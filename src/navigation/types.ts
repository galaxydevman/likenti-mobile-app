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
  saveLabel: string;
  oldPrice: string;
  newPrice: string;
  badgeLabel: string;
  rating: number;
};

export type HomeStackParamList = {
  Home: undefined;
  Search: undefined;
  ExploreCategories: undefined;
  ProductList: { categoryId: string; categoryTitle: string };
};

export type RootTabParamList = {
  Nuhdeek: undefined;
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Cart: undefined;
  Account: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<RootTabParamList> | undefined;
  ProductDetail: { product: ProductDetailProduct };
};

type HomeTabAndRootStackProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, 'Home'>,
  NativeStackScreenProps<RootStackParamList>
>;

/** Navigation from the home feed: same stack (Search, categories, lists) + root (ProductDetail) via parent. */
export type HomeScreenNavigationProp = CompositeNavigationProp<
  NativeStackNavigationProp<HomeStackParamList, 'Home'>,
  HomeTabAndRootStackProps['navigation']
>;

/** Any screen pushed on the home stack (search, categories, product list): can open product detail on root. */
export type HomeStackChildScreenProps<RouteName extends keyof HomeStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<HomeStackParamList, RouteName>,
  HomeTabAndRootStackProps
>;
