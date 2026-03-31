import { storefrontQuery } from './client';
import { toHeroBanner } from './mappers';
import { HERO_BANNERS_QUERY } from './queries';
import type { HeroBannersResponse, StorefrontHeroBanner } from './types';

const DEFAULT_HERO_PAGE_SIZE = 20;

export async function fetchStorefrontHeroBanners(): Promise<StorefrontHeroBanner[]> {
  const data = await storefrontQuery<HeroBannersResponse>(HERO_BANNERS_QUERY, { first: DEFAULT_HERO_PAGE_SIZE });
  const items = (data.metaobjects?.nodes ?? []).map(toHeroBanner).filter(Boolean) as StorefrontHeroBanner[];
  return items.sort((a, b) => a.order - b.order);
}
