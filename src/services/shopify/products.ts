import { storefrontQuery } from './client';
import { toProductDetailProduct } from './mappers';
import { COLLECTION_PRODUCTS_QUERY, PRODUCTS_QUERY, PRODUCT_SEARCH_QUERY } from './queries';
import type {
  FetchStorefrontProductsParams,
  FetchStorefrontProductSearchParams,
  ProductDetailProduct,
  ProductsResponse,
  StorefrontProductsPage,
} from './types';
import { DEFAULT_PAGE_SIZE } from './types';

export async function fetchStorefrontProducts(
  params: FetchStorefrontProductsParams
): Promise<StorefrontProductsPage> {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const isAllCategory = params.categoryId === 'all';

  const query = isAllCategory ? PRODUCTS_QUERY : COLLECTION_PRODUCTS_QUERY;
  const variables = isAllCategory
    ? { first: pageSize, after: params.afterCursor ?? null }
    : {
        first: pageSize,
        handle: params.categoryId,
        after: params.afterCursor ?? null,
      };

  const data = await storefrontQuery<ProductsResponse>(query, variables);
  const connection = isAllCategory ? data.products : data.collectionByHandle?.products;
  const nodes = connection?.nodes ?? [];
  const pageInfo = connection?.pageInfo;

  // If a category handle does not exist in Shopify, fall back to title-based filter over all products.
  if (!isAllCategory && !params.afterCursor && nodes.length === 0) {
    const allData = await storefrontQuery<ProductsResponse>(PRODUCTS_QUERY, {
      first: pageSize,
      after: null,
    });

    const normalizedTitle = params.categoryTitle.trim().toLowerCase();
    const filtered = (allData.products?.nodes ?? [])
      .filter((node) => node.productType?.toLowerCase().includes(normalizedTitle))
      .map(toProductDetailProduct);
    return {
      items: filtered,
      hasNextPage: false,
      endCursor: null,
    };
  }

  return {
    items: nodes.map(toProductDetailProduct),
    hasNextPage: pageInfo?.hasNextPage ?? false,
    endCursor: pageInfo?.endCursor ?? null,
  };
}

export async function fetchStorefrontProductSearch(
  params: FetchStorefrontProductSearchParams
): Promise<StorefrontProductsPage> {
  const q = params.searchQuery.trim();
  if (!q) {
    return { items: [], hasNextPage: false, endCursor: null };
  }

  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const data = await storefrontQuery<ProductsResponse>(PRODUCT_SEARCH_QUERY, {
    first: pageSize,
    query: q,
    after: params.afterCursor ?? null,
  });

  const connection = data.products;
  const nodes = connection?.nodes ?? [];
  const pageInfo = connection?.pageInfo;

  return {
    items: nodes.map(toProductDetailProduct),
    hasNextPage: pageInfo?.hasNextPage ?? false,
    endCursor: pageInfo?.endCursor ?? null,
  };
}

export async function fetchStorefrontRecommendedProducts(
  currentProduct: ProductDetailProduct,
  limit = 8
): Promise<ProductDetailProduct[]> {
  const max = Math.max(1, limit);
  const relatedByType: ProductDetailProduct[] = [];

  if (currentProduct.productType?.trim()) {
    const typeQuery = `product_type:"${currentProduct.productType.trim()}"`;
    const byType = await fetchStorefrontProductSearch({
      searchQuery: typeQuery,
      pageSize: Math.max(16, max + 4),
    });
    relatedByType.push(...byType.items.filter((item) => item.id !== currentProduct.id));
  }

  if (relatedByType.length >= max) {
    return relatedByType.slice(0, max);
  }

  const bestSellingFallback = await fetchStorefrontProducts({
    categoryId: 'all',
    categoryTitle: 'All',
    pageSize: Math.max(24, max + 12),
  });

  const merged: ProductDetailProduct[] = [];
  const seen = new Set<string>([currentProduct.id]);

  for (const item of [...relatedByType, ...bestSellingFallback.items]) {
    if (merged.length >= max) break;
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    merged.push(item);
  }

  return merged;
}
