import { SHOPIFY_API_VERSION } from './types';

function getStorefrontConfig() {
  const rawDomain = process.env.EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN?.trim();
  const token = process.env.EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN?.trim();
  const domain = rawDomain?.replace(/^https?:\/\//i, '').replace(/\/+$/, '');

  if (!domain || !token) {
    throw new Error(
      'Missing Shopify Storefront env vars. Check EXPO_PUBLIC_SHOPIFY_STORE_DOMAIN and EXPO_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN.'
    );
  }

  return { domain, token };
}

export async function storefrontQuery<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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
    throw new Error(
      `Network request failed. Verify store domain and internet. Endpoint: ${endpoint}. Cause: ${message}`
    );
  }

  const payload = await response.json();

  if (!response.ok || payload.errors?.length) {
    const message = payload.errors?.[0]?.message ?? `Storefront request failed (${response.status})`;
    throw new Error(message);
  }

  return payload.data as T;
}
