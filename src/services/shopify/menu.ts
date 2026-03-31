import { storefrontQuery } from './client';
import { toMenuCategory } from './mappers';
import { MAIN_MENU_QUERY } from './queries';
import type { MenuResponse, ShopifyMenuItem, StorefrontMenuCategory } from './types';

function flattenMenuItems(items: ShopifyMenuItem[]): ShopifyMenuItem[] {
  const flat: ShopifyMenuItem[] = [];
  for (const item of items) {
    flat.push(item);
    if (item.items?.length) {
      flat.push(...flattenMenuItems(item.items));
    }
  }
  return flat;
}

export async function fetchStorefrontMainMenuCategories(): Promise<StorefrontMenuCategory[]> {
  const data = await storefrontQuery<MenuResponse>(MAIN_MENU_QUERY, {});

  const seen = new Set<string>();
  const categories: StorefrontMenuCategory[] = [];
  const menuItems = flattenMenuItems(data.menu?.items ?? []);
  for (const item of menuItems) {
    const category = toMenuCategory(item);
    if (!category || seen.has(category.id)) {
      continue;
    }
    seen.add(category.id);
    categories.push(category);
  }
  return categories;
}
