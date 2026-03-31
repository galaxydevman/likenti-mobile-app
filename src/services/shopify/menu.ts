import { storefrontQuery } from './client';
import { toMenuCategory } from './mappers';
import { MAIN_MENU_QUERY } from './queries';
import type { MenuResponse, StorefrontMenuCategory } from './types';

export async function fetchStorefrontMainMenuCategories(): Promise<StorefrontMenuCategory[]> {
  const data = await storefrontQuery<MenuResponse>(MAIN_MENU_QUERY, {});

  const seen = new Set<string>();
  const categories: StorefrontMenuCategory[] = [];
  for (const item of data.menu?.items ?? []) {
    const category = toMenuCategory(item);
    if (!category || seen.has(category.id)) {
      continue;
    }
    seen.add(category.id);
    categories.push(category);
  }
  return categories;
}
