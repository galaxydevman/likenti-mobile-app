import type {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type ProductDetailProduct = {
  id: string;
  title: string;
  imageUrl: string;
  /** Extra gallery images from Shopify; detail screen falls back to [imageUrl] when absent */
  imageUrls?: string[];
  /** Plain text from Shopify `description` or catalog */
  description?: string;
  saveLabel: string;
  oldPrice: string;
  newPrice: string;
  badgeLabel: string;
  rating: number;
  /** When set (e.g. Shopify), shown in the reviews header */
  reviewCount?: number;
};

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  ExploreCategories: undefined;
  ProductList: { categoryId: string; categoryTitle: string };
  ProductDetail: { product: ProductDetailProduct };
};

export type RootTabParamList = {
  Nuhdeek: undefined;
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Cart: undefined;
  Account: undefined;
  More: undefined;
};

/** Navigation from the home feed: home stack (Search, categories, lists, product detail) + sibling tabs via parent. */
export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  BottomTabNavigationProp<RootTabParamList>
>;

/** Any screen pushed on the home stack: can open product detail in the same stack (tab bar stays visible). */
export type HomeStackChildScreenProps<RouteName extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, RouteName>,
  BottomTabScreenProps<RootTabParamList, 'Home'>
>;
