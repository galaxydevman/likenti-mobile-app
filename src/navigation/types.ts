import type {
  CompositeNavigationProp,
  CompositeScreenProps,
  NavigatorScreenParams,
} from '@react-navigation/native';
import type { BottomTabNavigationProp, BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export type ProductDetailProduct = {
  id: string;
  /** Storefront ProductVariant GID; required for Shopify Checkout */
  variantId?: string;
  /** Label from Shopify variant (e.g. size); falls back to "Default" in cart when missing */
  variantTitle?: string;
  title: string;
  imageUrl: string;
  /** Extra gallery images from Shopify; detail screen falls back to [imageUrl] when absent */
  imageUrls?: string[];
  /** Plain text from Shopify `description` or catalog */
  description?: string;
  /** Shopify productType; used to compute related products */
  productType?: string;
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

export type CartStackParamList = {
  CartMain: undefined;
  CheckoutWebView: { checkoutUrl: string };
};

export type RootTabParamList = {
  Likdeek: undefined;
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Cart: NavigatorScreenParams<CartStackParamList> | undefined;
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
