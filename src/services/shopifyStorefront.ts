import type { ProductDetailProduct } from '../navigation/types';

const SHOPIFY_API_VERSION = '2026-01';
const DEFAULT_PAGE_SIZE = 50;

type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

type ShopifyProductNode = {
  id: string;
  title: string;
  productType: string;
  featuredImage: { url: string } | null;
  priceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
  compareAtPriceRange: {
    minVariantPrice: MoneyV2;
    maxVariantPrice: MoneyV2;
  };
};

type ProductsResponse = {
  products?: {
    nodes: ShopifyProductNode[];
    pageInfo: {
      hasNextPage: boolean;
      endCursor: string | null;
    };
  };
  collectionByHandle?: {
    products: {
      nodes: ShopifyProductNode[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor: string | null;
      };
    };
  } | null;
};

export type StorefrontProductsPage = {
  items: ProductDetailProduct[];
  hasNextPage: boolean;
  endCursor: string | null;
};

function getStorefrontConfig() {
  const rawDomain = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const domain = rawDomain?.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

  if (!domain || !token) {
    throw new Error('Missing Shopify Storefront env vars. Check EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN and EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.');
  }

  return { domain, token };
}

function formatMoney(money?: MoneyV2): string {
  if (!money) return '$0.00';
  const value = Number.parseFloat(money.amount);
  if (!Number.isFinite(value)) return '$0.00';
  return `${money.currencyCode} ${value.toFixed(2)}`;
}

function toProductDetailProduct(node: ShopifyProductNode): ProductDetailProduct {
  const current = node.priceRange.minVariantPrice;
  const compareAt =
    node.compareAtPriceRange.minVariantPrice.amount !== '0.0'
      ? node.compareAtPriceRange.minVariantPrice
      : node.priceRange.maxVariantPrice;

  const currentValue = Number.parseFloat(current.amount) || 0;
  const compareValue = Number.parseFloat(compareAt.amount) || currentValue;
  const savingPct =
    compareValue > currentValue ? Math.round(((compareValue - currentValue) / compareValue) * 100) : 0;

  return {
    id: node.id,
    title: node.title,
    imageUrl: node.featuredImage?.url ?? 'https://via.placeholder.com/600x600?text=No+Image',
    saveLabel: savingPct > 0 ? `Save ${savingPct}%` : 'Best price',
    oldPrice: formatMoney(compareAt),
    newPrice: formatMoney(current),
    badgeLabel: 'Shopify',
    rating: 4.5,
  };
}

async function storefrontQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const { domain, token } = getStorefrontConfig();
  const endpoint = `https://${domain}/api/${SHOPIFY_API_VERSION}/graphql.json`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new Error(`Network request failed. Verify store domain and internet. Endpoint: ${endpoint}. Cause: ${message}`);
  }

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.[0]?.message ?? `Storefront request failed (${response.status})`;
    throw new Error(message);
  }

  return payload.data as T;
}

export async function fetchStorefrontProducts(params: {
  categoryId: string;
  categoryTitle: string;
  afterCursor?: string | null;
  pageSize?: number;
}): Promise<StorefrontProductsPage> {
  const pageSize = params.pageSize ?? DEFAULT_PAGE_SIZE;
  const isAllCategory = params.categoryId === 'all';

  const query = isAllCategory
    ? `
      query Products($first: Int!, $after: String) {
        products(first: $first, sortKey: BEST_SELLING, after: $after) {
          nodes {
            id
            title
            productType
            featuredImage {
              url
            }
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            compareAtPriceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `
    : `
      query CollectionProducts($first: Int!, $handle: String!, $after: String) {
        collectionByHandle(handle: $handle) {
          products(first: $first, after: $after) {
            nodes {
              id
              title
              productType
              featuredImage {
                url
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      }
    `;

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
    const allData = await storefrontQuery<ProductsResponse>(
      `
        query Products($first: Int!, $after: String) {
          products(first: $first, sortKey: BEST_SELLING, after: $after) {
            nodes {
              id
              title
              productType
              featuredImage {
                url
              }
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              compareAtPriceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `,
      { first: pageSize, after: null }
    );

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
