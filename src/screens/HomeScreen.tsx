import React, { useCallback, useRef } from 'react';
import { Animated, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HomeHeader } from '../components/home/HomeHeader';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HeroCarousel, type HeroSlide } from '../components/home/HeroCarousel';
import { PromoImageCarousel, type PromoImageSlide } from '../components/home/PromoImageCarousel';
import { ShopifyGridImageSlider, type ShopifyGridImageSlide } from '../components/home/ShopifyGridImageSlider';
import { ShopByCategory, type CategoryItem } from '../components/home/ShopByCategory';
import { TopPicksPanel, type TopPickProduct } from '../components/home/TopPicksPanel';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import type { RootStackParamList } from '../navigation/types';
import { CATALOG_PRODUCTS, PRODUCT_CATEGORIES } from '../data/productCatalog';

/** Placeholder imagery; replace with Storefront API (collections, metaobjects, files). */
const HERO_SLIDES: HeroSlide[] = [
  {
    id: '1',
    imageUrl:
      // Use a known-good demo image (some placeholder entries can appear "empty" at runtime).
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&auto=format&fit=crop&q=80',
    brandLabel: 'Energie Fruit',
    ctaLabel: 'تسوق الآن',
  },
  {
    id: '2',
    imageUrl:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&auto=format&fit=crop&q=80',
    brandLabel: 'Summer glow',
    ctaLabel: 'Shop now',
  },
  {
    id: '3',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&auto=format&fit=crop&q=80',
    brandLabel: 'Skincare',
    ctaLabel: 'Shop now',
  },
  {
    id: '4',
    imageUrl:
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=900&auto=format&fit=crop&q=80',
    brandLabel: 'Hair care',
    ctaLabel: 'Shop now',
  },
  {
    id: '5',
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=900&auto=format&fit=crop&q=80',
    brandLabel: 'Body',
    ctaLabel: 'Shop now',
  },
];

const TOP_PICKS: TopPickProduct[] = CATALOG_PRODUCTS.slice(0, 5).map(({ categoryIds: _categoryIds, ...product }) => product);

const PROMO_SLIDES: PromoImageSlide[] = [
  { id: 'ps1', imageAsset: require('../../assets/demo/promo-slide-1.png') },
  { id: 'ps2', imageAsset: require('../../assets/demo/promo-slide-2.png') },
  { id: 'ps3', imageAsset: require('../../assets/demo/promo-slide-3.png') },
  { id: 'ps4', imageAsset: require('../../assets/demo/promo-slide-4.png') },
  { id: 'ps5', imageAsset: require('../../assets/demo/promo-slide-5.png') },
];

const GRID_SLIDES: ShopifyGridImageSlide[] = [
  { id: 'gs1', imageAsset: require('../../assets/demo/shopify-grid-slide-1.png') },
  { id: 'gs2', imageAsset: require('../../assets/demo/shopify-grid-slide-2.png') },
  { id: 'gs3', imageAsset: require('../../assets/demo/shopify-grid-slide-3.png') },
  { id: 'gs4', imageAsset: require('../../assets/demo/shopify-grid-slide-4.png') },
  { id: 'gs5', imageAsset: require('../../assets/demo/shopify-grid-slide-5.png') },
];

export default function HomeScreen() {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { addItem } = useCart();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const parsePrice = (priceText: string) =>
    Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

  const categories: CategoryItem[] = PRODUCT_CATEGORIES.map((category) => ({
    id: category.id,
    title: category.title,
    imageUrl: category.imageUrl,
    onPress: () =>
      navigation.navigate('ProductList', {
        categoryId: category.id,
        categoryTitle: category.title,
      }),
  }));

  useFocusEffect(
    useCallback(() => {
      RNStatusBar.setBarStyle('light-content');
      return () => RNStatusBar.setBarStyle('dark-content');
    }, [])
  );

  return (
    <Animated.ScrollView
      style={styles.root}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      })}
      scrollEventThrottle={16}
    >
      <HomeHeader scrollY={scrollY} onSearchPress={() => navigation.navigate('Search')} />
      {/* <AnnouncementBar /> */}
      <HeroCarousel slides={HERO_SLIDES} />
      <ShopByCategory categories={categories} />
      <TopPicksPanel
        title="Likenti Top Picks"
        products={TOP_PICKS}
        onPressItem={(item) => navigation.navigate('ProductDetail', { product: item })}
        onPressAdd={(item) =>
          addItem({
            id: item.id,
            title: item.title,
            variantTitle: 'Default',
            imageUrl: item.imageUrl,
            unitPrice: parsePrice(item.newPrice),
            compareAtPrice: parsePrice(item.oldPrice),
            quantity: 1,
            inventoryNote: 'Ships in 24 hours',
          })
        }
      />
      <PromoImageCarousel slides={PROMO_SLIDES} height={200} />
      <ShopifyGridImageSlider slides={GRID_SLIDES} />
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    paddingBottom: 32,
  },
});
