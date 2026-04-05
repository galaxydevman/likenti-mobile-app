import { storefrontQuery } from './client';
import { CART_CREATE_MUTATION } from './queries';

export type CheckoutLineInput = {
  merchandiseId: string;
  quantity: number;
};

type CartCreateData = {
  cartCreate?: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field?: string[] | null; message: string }[];
  };
};

/**
 * Creates a Storefront cart and returns the hosted Shopify checkout URL.
 */
export async function createStorefrontCheckoutUrl(lines: CheckoutLineInput[]): Promise<string> {
  if (lines.length === 0) {
    throw new Error('Cart has no items to check out.');
  }

  const data = await storefrontQuery<CartCreateData>(CART_CREATE_MUTATION, {
    input: {
      lines: lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: Math.max(1, Math.floor(line.quantity)),
      })),
    },
  });

  const payload = data.cartCreate;
  const errors = payload?.userErrors ?? [];
  if (errors.length > 0) {
    throw new Error(errors.map((e) => e.message).join(' '));
  }

  const url = payload?.cart?.checkoutUrl?.trim();
  if (!url) {
    throw new Error('Shopify did not return a checkout URL.');
  }

  return url;
}
