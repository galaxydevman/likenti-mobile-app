import React, { useCallback, useRef } from 'react';
import { Animated, StyleSheet, StatusBar as RNStatusBar } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { HomeHeader } from '../components/home/HomeHeader';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HeroCarousel, type HeroSlide } from '../components/home/HeroCarousel';
import { PromoImageCarousel, type PromoImageSlide } from '../components/home/PromoImageCarousel';
import { ShopifyGridImageSlider, type ShopifyGridImageSlide } from '../components/home/ShopifyGridImageSlider';
import { ShopByCategory, type CategoryItem } from '../components/home/ShopByCategory';
import { TopPicksPanel, type TopPickProduct } from '../components/home/TopPicksPanel';
import { colors } from '../theme/colors';

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

const CATEGORIES: CategoryItem[] = [
  {
    id: 'c1',
    title: 'Cleaner',
    imageUrl:
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c2',
    title: 'Moisturizing',
    imageUrl:
      'https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c3',
    title: 'Serums',
    imageUrl:
      'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c4',
    title: 'Sun care',
    imageUrl:
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c5',
    title: 'Hair care',
    imageUrl:
      'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c6',
    title: 'Body lotion',
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c7',
    title: 'Bath essentials',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'c8',
    title: 'Supplements',
    imageUrl:
      'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400&auto=format&fit=crop&q=80',
  },
];

const TOP_PICKS: TopPickProduct[] = [
  {
    id: 'tp1',
    title: 'Vichy 72 Hours Stress Resist Excessive Perspiration Deodorant 50ml',
    // Use a known-good demo image so the first card doesn't render blank.
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 41%',
    oldPrice: '₹44.94',
    newPrice: '₹76.25',
    badgeLabel: 'Express',
    rating: 4.1,
  },
  {
    id: 'tp2',
    title: 'Veet Wax Strips For Sensitive Skin 20 pcs',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'ONLINE EXCLUSIVE _ Save 51%',
    oldPrice: '₹24.96',
    newPrice: '₹50.91',
    badgeLabel: 'Express',
    rating: 4.7,
  },
  {
    id: 'tp3',
    title: 'Aroma Therapy Body Wash Lavender 500ml',
    imageUrl: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 33%',
    oldPrice: '₹18.90',
    newPrice: '₹28.40',
    badgeLabel: 'Express',
    rating: 4.3,
  },
  {
    id: 'tp4',
    title: 'Skincare Serum Vitamin C 30ml',
    imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 29%',
    oldPrice: '₹24.50',
    newPrice: '₹34.80',
    badgeLabel: 'Express',
    rating: 4.6,
  },
  {
    id: 'tp5',
    title: 'Hair Care Conditioner Repair 250ml',
    imageUrl: 'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=600&auto=format&fit=crop&q=80',
    saveLabel: 'Save 20%',
    oldPrice: '₹15.20',
    newPrice: '₹19.00',
    badgeLabel: 'Express',
    rating: 4.0,
  },
];

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
      <HomeHeader scrollY={scrollY} />
      {/* <AnnouncementBar /> */}
      <HeroCarousel slides={HERO_SLIDES} />
      <ShopByCategory categories={CATEGORIES} />
      <TopPicksPanel title="Likenti Top Picks" products={TOP_PICKS} />
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
