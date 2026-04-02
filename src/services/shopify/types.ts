import type { ProductDetailProduct } from '../../navigation/types';

export const SHOPIFY_API_VERSION = '2026-01';
export const DEFAULT_PAGE_SIZE = 50;

export type MoneyV2 = {
  amount: string;
  currencyCode: string;
};

export type ShopifyProductNode = {
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

export type ProductsResponse = {
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

export type ShopifyMenuItem = {
  id: string;
  title: string;
  url?: string | null;
  resource?:
    | {
        __typename: 'Collection';
        id: string;
        handle: string;
        image?: { url: string } | null;
        products?: {
          nodes: Array<{
            featuredImage?: { url: string } | null;
          }>;
        } | null;
      }
    | {
        __typename: 'Product';
        id: string;
      }
    | {
        __typename: string;
      }
    | null;
  items?: ShopifyMenuItem[] | null;
};

export type MenuResponse = {
  menu?: {
    items: ShopifyMenuItem[];
  } | null;
};

export type StorefrontProductsPage = {
  items: ProductDetailProduct[];
  hasNextPage: boolean;
  endCursor: string | null;
};

export type StorefrontMenuCategory = {
  id: string;
  title: string;
  imageUrl: string;
};

export type FetchStorefrontProductsParams = {
  categoryId: string;
  categoryTitle: string;
  afterCursor?: string | null;
  pageSize?: number;
};

export type FetchStorefrontProductSearchParams = {
  searchQuery: string;
  afterCursor?: string | null;
  pageSize?: number;
};

export type ShopifyMetaobjectField = {
  key: string;
  value: string | null;
  reference?:
    | {
        __typename: 'MediaImage';
        image?: { url: string } | null;
      }
    | {
        __typename: string;
      }
    | null;
};

export type ShopifyMetaobjectNode = {
  id: string;
  handle: string;
  fields: ShopifyMetaobjectField[];
};

export type HeroBannersResponse = {
  metaobjects?: {
    nodes: ShopifyMetaobjectNode[];
  } | null;
};

export type StorefrontHeroBanner = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  order: number;
};
