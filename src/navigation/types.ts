import type { NavigatorScreenParams } from '@react-navigation/native';

export type ProductDetailProduct = {
  id: string;
  title: string;
  imageUrl: string;
  /** Extra gallery images from Shopify; detail screen falls back to [imageUrl] when absent */
  imageUrls?: string[];
  saveLabel: string;
  oldPrice: string;
  newPrice: string;
  badgeLabel: string;
  rating: number;
};

export type RootTabParamList = {
  Nuhdeek: undefined;
  Home: undefined;
  Cart: undefined;
  Account: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  ProductDetail: { product: ProductDetailProduct };
  Search: undefined;
  ExploreCategories: undefined;
  ProductList: { categoryId: string; categoryTitle: string };
};
