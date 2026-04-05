import type { AddCartItemInput } from '../context/CartContext';
import type { ProductDetailProduct } from '../navigation/types';

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

/** Builds cart input from a storefront product (uses variant id when present for Shopify Checkout). */
export function cartItemFromProductDetail(product: ProductDetailProduct, quantity = 1): AddCartItemInput {
  const variantTitle = product.variantTitle?.trim() || 'Default';
  const merchandiseId = product.variantId;
  const lineId = merchandiseId ?? product.id;

  const unitPrice = parsePrice(product.newPrice);
  const compareParsed = parsePrice(product.oldPrice);

  return {
    id: lineId,
    title: product.title,
    variantTitle,
    imageUrl: product.imageUrl,
    unitPrice,
    compareAtPrice: compareParsed > unitPrice ? compareParsed : undefined,
    quantity: Math.max(1, quantity),
    inventoryNote: 'Ships in 24 hours',
    ...(merchandiseId ? { merchandiseId } : {}),
  };
}
