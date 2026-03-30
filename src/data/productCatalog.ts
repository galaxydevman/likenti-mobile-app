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
    saveLabel: 'Save 41%',
    oldPrice: '₹44.94',
    newPrice: '₹26.25',
    badgeLabel: 'Express',
    rating: 4.1,
    categoryIds: ['moisturizing', 'body-lotion'],
  },
  {
    id: 'tp2',
    title: 'Veet Wax Strips For Sensitive Skin 20 pcs',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'ONLINE EXCLUSIVE - Save 51%',
    oldPrice: '₹24.96',
    newPrice: '₹12.20',
    badgeLabel: 'Express',
    rating: 4.7,
    categoryIds: ['body-lotion', 'bath-essentials'],
  },
  {
    id: 'tp3',
    title: 'Aroma Therapy Body Wash Lavender 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 33%',
    oldPrice: '₹18.90',
    newPrice: '₹12.70',
    badgeLabel: 'Express',
    rating: 4.3,
    categoryIds: ['bath-essentials', 'body-lotion'],
  },
  {
    id: 'tp4',
    title: 'Skincare Serum Vitamin C 30ml',
    imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 29%',
    oldPrice: '₹24.50',
    newPrice: '₹17.40',
    badgeLabel: 'Express',
    rating: 4.6,
    categoryIds: ['serums', 'moisturizing'],
  },
  {
    id: 'tp5',
    title: 'Hair Care Conditioner Repair 250ml',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 20%',
    oldPrice: '₹15.20',
    newPrice: '₹12.16',
    badgeLabel: 'Express',
    rating: 4.0,
    categoryIds: ['hair-care'],
  },
  {
    id: 'tp6',
    title: 'SPF50 Daily Defense Sunscreen 100ml',
    imageUrl: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 18%',
    oldPrice: '₹22.00',
    newPrice: '₹18.04',
    badgeLabel: 'Express',
    rating: 4.4,
    categoryIds: ['sun-care', 'moisturizing'],
  },
  {
    id: 'tp7',
    title: 'Omega-3 Softgels 60 Capsules',
    imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 25%',
    oldPrice: '₹30.00',
    newPrice: '₹22.50',
    badgeLabel: 'Express',
    rating: 4.2,
    categoryIds: ['supplements'],
  },
];

export function getProductsByCategory(categoryId: string): ProductDetailProduct[] {
  if (categoryId === 'all') {
    return CATALOG_PRODUCTS;
  }

  return CATALOG_PRODUCTS.filter((item) => item.categoryIds.includes(categoryId));
}
