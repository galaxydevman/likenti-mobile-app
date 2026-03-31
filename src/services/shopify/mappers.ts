import type { ProductDetailProduct } from '../../navigation/types';
import type { MoneyV2, ShopifyMenuItem, ShopifyProductNode, StorefrontMenuCategory } from './types';

function formatMoney(money?: MoneyV2): string {
  if (!money) return '$0.00';
  const value = Number.parseFloat(money.amount);
  if (!Number.isFinite(value)) return '$0.00';
  return `${money.currencyCode} ${value.toFixed(2)}`;
}

function toCategoryId(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function parseCollectionHandleFromUrl(rawUrl?: string | null): string | null {
  if (!rawUrl) return null;
  const match = rawUrl.match(/\/collections\/([^/?#]+)/i);
  return match?.[1]?.trim() ?? null;
}

export function toProductDetailProduct(node: ShopifyProductNode): ProductDetailProduct {
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

export function toMenuCategory(item: ShopifyMenuItem): StorefrontMenuCategory | null {
  const title = item.title?.trim();
  if (!title) return null;

  const collectionHandle =
    item.resource?.__typename === 'Collection'
      ? item.resource.handle
      : parseCollectionHandleFromUrl(item.url);

  if (!collectionHandle) {
    return null;
  }

  const imageUrl =
    item.resource?.__typename === 'Collection' && item.resource.image?.url
      ? item.resource.image.url
      : `https://via.placeholder.com/300x300?text=${encodeURIComponent(title)}`;

  return {
    id: toCategoryId(collectionHandle),
    title,
    imageUrl,
  };
}
