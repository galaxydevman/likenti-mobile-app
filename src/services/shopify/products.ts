import { storefrontQuery } from './client';
import { toProductDetailProduct } from './mappers';
import { COLLECTION_PRODUCTS_QUERY, PRODUCTS_QUERY } from './queries';
import type { FetchStorefrontProductsParams, ProductsResponse, StorefrontProductsPage } from './types';
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
