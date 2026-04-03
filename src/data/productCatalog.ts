import type { ProductDetailProduct } from '../navigation/types';

export type ProductCategory = {
  id: string;
  title: string;
  imageUrl: string;
};

export type CatalogProduct = ProductDetailProduct & {
  categoryIds: string[];
};

export const PRODUCT_CATEGORIES: ProductCategory[] = [
  {
    id: 'all',
    title: 'All Categories',
    imageUrl: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'moisturizing',
    title: 'Moisturizing',
    imageUrl: 'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'serums',
    title: 'Serums',
    imageUrl: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sun-care',
    title: 'Sun care',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'hair-care',
    title: 'Hair care',
    imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'body-lotion',
    title: 'Body lotion',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'bath-essentials',
    title: 'Bath essentials',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'supplements',
    title: 'Supplements',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80',
  },
];

export const CATALOG_PRODUCTS: CatalogProduct[] = [
  {
    id: 'tp1',
    title: 'Vichy 72 Hours Stress Resist Excessive Perspiration Deodorant 50ml',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    description:
      'Clinical-strength protection against sweat and odor for up to 72 hours. Suitable for sensitive skin, dermatologist-tested, with a fresh clean scent.',
    saveLabel: 'Save 41%',
    oldPrice: '₹44.94',
    newPrice: '₹26.25',
    badgeLabel: 'Express',
    rating: 4.1,
    reviewCount: 214,
    categoryIds: ['moisturizing', 'body-lotion'],
  },
  {
    id: 'tp2',
    title: 'Veet Wax Strips For Sensitive Skin 20 pcs',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    description:
      'Ready-to-use wax strips shaped for legs and body, formulated with almond oil and vitamin E to care for sensitive skin while removing short hair effectively.',
    saveLabel: 'ONLINE EXCLUSIVE - Save 51%',
    oldPrice: '₹24.96',
    newPrice: '₹12.20',
    badgeLabel: 'Express',
    rating: 4.7,
    reviewCount: 892,
    categoryIds: ['body-lotion', 'bath-essentials'],
  },
  {
    id: 'tp3',
    title: 'Aroma Therapy Body Wash Lavender 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    description:
      'A relaxing lavender-scented gel wash that cleanses without drying. Vegan-friendly formula with essential oils for a calming shower ritual.',
    saveLabel: 'Save 33%',
    oldPrice: '₹18.90',
    newPrice: '₹12.70',
    badgeLabel: 'Express',
    rating: 4.3,
    reviewCount: 156,
    categoryIds: ['bath-essentials', 'body-lotion'],
  },
  {
    id: 'tp4',
    title: 'Skincare Serum Vitamin C 30ml',
    imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&auto=format&fit=crop&q=80',
    description:
      'Brightening serum with stabilized vitamin C and antioxidants. Helps even tone and reduce the look of dark spots; lightweight for daily morning use.',
    saveLabel: 'Save 29%',
    oldPrice: '₹24.50',
    newPrice: '₹17.40',
    badgeLabel: 'Express',
    rating: 4.6,
    reviewCount: 403,
    categoryIds: ['serums', 'moisturizing'],
  },
  {
    id: 'tp5',
    title: 'Hair Care Conditioner Repair 250ml',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    description:
      'Repairing conditioner for damaged and color-treated hair. Keratin-rich blend detangles, reduces breakage, and leaves hair soft with a salon-fresh finish.',
    saveLabel: 'Save 20%',
    oldPrice: '₹15.20',
    newPrice: '₹12.16',
    badgeLabel: 'Express',
    rating: 4.0,
    reviewCount: 98,
    categoryIds: ['hair-care'],
  },
  {
    id: 'tp6',
    title: 'SPF50 Daily Defense Sunscreen 100ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    description:
      'Broad-spectrum SPF 50 sunscreen for face and body. Fast-absorbing, non-greasy texture works under makeup and resists water for active days outdoors.',
    saveLabel: 'Save 18%',
    oldPrice: '₹22.00',
    newPrice: '₹18.04',
    badgeLabel: 'Express',
    rating: 4.4,
    reviewCount: 267,
    categoryIds: ['sun-care', 'moisturizing'],
  },
  {
    id: 'tp7',
    title: 'Omega-3 Softgels 60 Capsules',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    description:
      'Dietary supplement with EPA and DHA from fish oil to support heart and brain health. Enteric-coated softgels for easier digestion.',
    saveLabel: 'Save 25%',
    oldPrice: '₹30.00',
    newPrice: '₹22.50',
    badgeLabel: 'Express',
    rating: 4.2,
    reviewCount: 124,
    categoryIds: ['supplements'],
  },
];

function catalogToDetail(p: CatalogProduct): ProductDetailProduct {
  const { categoryIds: _c, ...rest } = p;
  return rest;
}

/** Related picks for the product detail page (catalog similarity, or general catalog when unknown). */
export function getRecommendedProducts(current: ProductDetailProduct, limit = 8): ProductDetailProduct[] {
  const match = CATALOG_PRODUCTS.find((p) => p.id === current.id);
  if (match) {
    const catIds = match.categoryIds;
    const sameCat = CATALOG_PRODUCTS.filter(
      (p) => p.id !== current.id && p.categoryIds.some((c) => catIds.includes(c)),
    ).map(catalogToDetail);
    if (sameCat.length >= limit) return sameCat.slice(0, limit);
    const fallbackPool = CATALOG_PRODUCTS.filter((p) => p.id !== current.id).map(catalogToDetail);
    const seen = new Set(sameCat.map((p) => p.id));
    const merged = [...sameCat];
    for (const item of fallbackPool) {
      if (merged.length >= limit) break;
      if (!seen.has(item.id)) {
        seen.add(item.id);
        merged.push(item);
      }
    }
    return merged;
  }
  return CATALOG_PRODUCTS.filter((p) => p.id !== current.id)
    .slice(0, limit)
    .map(catalogToDetail);
}

export function getProductsByCategory(categoryId: string): ProductDetailProduct[] {
  if (categoryId === 'all') {
    return CATALOG_PRODUCTS;
  }

  return CATALOG_PRODUCTS.filter((item) => item.categoryIds.includes(categoryId));
}
