import type { ProductDetailProduct } from '../../navigation/types';
import type {
  MoneyV2,
  ShopifyMenuItem,
  ShopifyMetaobjectNode,
  ShopifyProductNode,
  StorefrontHeroBanner,
  StorefrontMenuCategory,
} from './types';

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

function parseInteger(input: string | null | undefined, fallback = 0): number {
  if (!input) return fallback;
  const parsed = Number.parseInt(input, 10);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeOptionalText(input: string | null | undefined): string | undefined {
  const value = input?.trim();
  return value ? value : undefined;
}

function toFieldMap(node: ShopifyMetaobjectNode): Map<string, ShopifyMetaobjectNode['fields'][number]> {
  const map = new Map<string, ShopifyMetaobjectNode['fields'][number]>();
  for (const field of node.fields ?? []) {
    if (field?.key) {
      map.set(field.key, field);
    }
  }
  return map;
}

export function toHeroBanner(node: ShopifyMetaobjectNode): StorefrontHeroBanner | null {
  const fields = toFieldMap(node);
  const imageField = fields.get('image');
  const imageUrl = imageField?.reference?.__typename === 'MediaImage' ? imageField.reference.image?.url : null;

  if (!imageUrl) {
    return null;
  }

  const title = normalizeOptionalText(fields.get('title')?.value) ?? 'Shop now';

  return {
    id: node.id,
    title,
    subtitle: normalizeOptionalText(fields.get('subtitle')?.value),
    imageUrl,
    buttonText: normalizeOptionalText(fields.get('button_text')?.value),
    buttonLink: normalizeOptionalText(fields.get('button_link')?.value),
    order: parseInteger(fields.get('order')?.value, 0),
  };
}
