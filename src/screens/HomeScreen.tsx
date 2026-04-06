import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Easing,
  Linking,
  Modal,
  Pressable,
  StatusBar as RNStatusBar,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { HomeHeader } from '../components/home/HomeHeader';
import { AnnouncementBar } from '../components/home/AnnouncementBar';
import { HeroCarousel, type HeroSlide } from '../components/home/HeroCarousel';
import { PromoImageCarousel, type PromoImageSlide } from '../components/home/PromoImageCarousel';
import { ShopifyGridImageSlider, type ShopifyGridImageSlide } from '../components/home/ShopifyGridImageSlider';
import { ShopByCategory, type CategoryItem } from '../components/home/ShopByCategory';
import { TopPicksPanel, type TopPickProduct } from '../components/home/TopPicksPanel';
import { useCart } from '../context/CartContext';
import type { HomeScreenNavigationProp } from '../navigation/types';
import { CATALOG_PRODUCTS, PRODUCT_CATEGORIES } from '../data/productCatalog';
import {
  fetchStorefrontHeroBanners,
  fetchStorefrontMainMenuCategories,
  fetchStorefrontProducts,
} from '../services/shopify';
import { styles } from '../styles/HomeScreen.styles';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';

/** Placeholder imagery; replace with Storefront API (collections, metaobjects, files). */
const DEFAULT_HERO_SLIDES: HeroSlide[] = [
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
  const { headerTheme } = useTheme();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const headerBleedColor = headerTheme.gradientColors?.[0] ?? headerTheme.backgroundColor ?? '#1a2744';
  const [menuCategories, setMenuCategories] = useState<CategoryItem[] | null>(null);
  const [heroSlides, setHeroSlides] = useState<HeroSlide[] | null>(null);
  const [topPicksProducts, setTopPicksProducts] = useState<TopPickProduct[] | null>(null);
  const [storefrontLoading, setStorefrontLoading] = useState(true);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const notificationAnim = useRef(new Animated.Value(0)).current;
  const hasAutoOpenedNotification = useRef(false);

  const parsePrice = (priceText: string) =>
    Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;

  useEffect(() => {
    let alive = true;

    const loadMenuCategories = async () => {
      try {
        const items = await fetchStorefrontMainMenuCategories();
        if (!alive || items.length === 0) return;

        const withAll: CategoryItem[] = [
          {
            id: 'all',
            title: 'All Category',
            imageUrl:
              'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&auto=format&fit=crop&q=80',
          },
          ...items,
        ];
        setMenuCategories(withAll);
      } catch {
        if (alive) {
          setMenuCategories(null);
        }
      }
    };

    const loadHeroBanners = async () => {
      try {
        const banners = await fetchStorefrontHeroBanners();
        if (!alive || banners.length === 0) return;

        const slides: HeroSlide[] = banners.map((banner) => {
          const link = banner.buttonLink;
          return {
            id: banner.id,
            imageUrl: banner.imageUrl,
            title: banner.title,
            subtitle: banner.subtitle,
            ctaLabel: banner.buttonText,
            onCtaPress: link
              ? () => {
                  void (async () => {
                    const canOpen = await Linking.canOpenURL(link);
                    if (canOpen) {
                      await Linking.openURL(link);
                    }
                  })();
                }
              : undefined,
          };
        });
        setHeroSlides(slides);
      } catch {
        if (alive) {
          setHeroSlides(null);
        }
      }
    };

    const loadTopPicks = async () => {
      try {
        const page = await fetchStorefrontProducts({
          categoryId: 'all',
          categoryTitle: 'All',
          pageSize: 20,
        });
        if (!alive || page.items.length === 0) return;
        const validWithImage = page.items.filter(
          (item) =>
            Boolean(item.imageUrl?.trim()) &&
            !item.imageUrl.includes('via.placeholder.com') &&
            !item.imageUrl.includes('No+Image')
        );
        if (validWithImage.length === 0) return;
        setTopPicksProducts(validWithImage.slice(0, 5));
      } catch {
        if (alive) {
          setTopPicksProducts(null);
        }
      }
    };

    const load = async () => {
      await Promise.all([loadMenuCategories(), loadHeroBanners(), loadTopPicks()]);
      if (alive) {
        setStorefrontLoading(false);
      }
    };

    void load();
    return () => {
      alive = false;
    };
  }, []);

  const categories: CategoryItem[] = useMemo(() => {
    const source = menuCategories ?? PRODUCT_CATEGORIES;
    return source.map((category) => ({
      id: category.id,
      title: category.id === 'all' ? 'All Category' : category.title,
      imageUrl: category.imageUrl,
      onPress: () => {
        if (category.id === 'all') {
          navigation.navigate('ExploreCategories');
          return;
        }
        navigation.navigate('ProductList', {
          categoryId: category.id,
          categoryTitle: category.title,
        });
      },
    }));
  }, [menuCategories, navigation]);

  useFocusEffect(
    useCallback(() => {
      RNStatusBar.setBarStyle(
        headerTheme.statusBarStyle === 'light' ? 'light-content' : 'dark-content'
      );
      return () => RNStatusBar.setBarStyle('dark-content');
    }, [headerTheme.statusBarStyle])
  );

  const openNotificationModal = useCallback(() => {
    notificationAnim.stopAnimation();
    notificationAnim.setValue(0);
    setNotificationVisible(true);
    Animated.timing(notificationAnim, {
      toValue: 1,
      duration: 320,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [notificationAnim]);

  const closeNotificationModal = useCallback(() => {
    notificationAnim.stopAnimation();
    Animated.timing(notificationAnim, {
      toValue: 0,
      duration: 220,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) {
        setNotificationVisible(false);
      }
    });
  }, [notificationAnim]);

  useEffect(() => {
    if (storefrontLoading || hasAutoOpenedNotification.current) return;
    hasAutoOpenedNotification.current = true;
    const timer = setTimeout(() => {
      openNotificationModal();
    }, 220);
    return () => clearTimeout(timer);
  }, [openNotificationModal, storefrontLoading]);

  if (storefrontLoading) {
    return (
      <View style={[styles.root, styles.loadingScreen, { backgroundColor: headerTheme.pageBackground }]}>
        <ActivityIndicator size="large" color={colors.headerBlue} />
        <Text style={styles.loadingText}>Loading store…</Text>
      </View>
    );
  }

  return (
    <Animated.ScrollView
      style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      stickyHeaderIndices={[0]}
      onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], {
        useNativeDriver: false,
      })}
      scrollEventThrottle={16}
    >
      <View style={[styles.stickyHeader, { backgroundColor: headerBleedColor }]}>
        <HomeHeader
          scrollY={scrollY}
          onSearchPress={() => navigation.navigate('Search')}
          onPressNotification={openNotificationModal}
        />
      </View>
      {/* <AnnouncementBar /> */}
      <HeroCarousel slides={heroSlides ?? DEFAULT_HERO_SLIDES} />
      <ShopByCategory categories={categories} />
      <TopPicksPanel
        title="Likenti Top Picks"
        products={topPicksProducts ?? TOP_PICKS}
        onPressItem={(item) => navigation.navigate('ProductDetail', { product: item })}
        onPressAdd={(item) => {
          const unitPrice = parsePrice(item.newPrice);
          const compareParsed = parsePrice(item.oldPrice);
          addItem({
            id: item.id,
            title: item.title,
            variantTitle: 'Default',
            imageUrl: item.imageUrl,
            unitPrice,
            compareAtPrice: compareParsed > unitPrice ? compareParsed : undefined,
            quantity: 1,
            inventoryNote: 'Ships in 24 hours',
          });
        }}
      />
      <PromoImageCarousel slides={PROMO_SLIDES} height={200} />
      <ShopifyGridImageSlider slides={GRID_SLIDES} />
      <Modal
        visible={notificationVisible}
        transparent
        animationType="none"
        statusBarTranslucent
        onRequestClose={closeNotificationModal}
      >
        <Animated.View
          style={[
            styles.notificationOverlay,
            {
              opacity: notificationAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 1],
              }),
            },
          ]}
        >
          <Animated.View
            style={[
              styles.notificationCard,
              {
                opacity: notificationAnim,
                transform: [
                  {
                    translateY: notificationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [24, 0],
                    }),
                  },
                  {
                    scale: notificationAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.97, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            <Pressable
              style={styles.notificationCloseBtn}
              onPress={closeNotificationModal}
              accessibilityRole="button"
              accessibilityLabel="Close notification"
            >
              <Text style={styles.notificationCloseText}>×</Text>
            </Pressable>
            <View style={styles.notificationPatternLayer}>
              <View style={[styles.notificationPatternBlob, styles.notificationPatternBlobOne]} />
              <View style={[styles.notificationPatternBlob, styles.notificationPatternBlobTwo]} />
              <View style={[styles.notificationPatternBlob, styles.notificationPatternBlobThree]} />
              <View style={[styles.notificationPatternBlob, styles.notificationPatternBlobFour]} />
            </View>
            <Text style={styles.notificationTitle}>Save 10% off your first purchase</Text>
            <Text style={styles.notificationSubtitle}>
              Sign up today and we'll send you a 10% discount code towards your first purchase.
            </Text>
            <View style={styles.notificationInputRow}>
              <TextInput
                value={emailValue}
                onChangeText={setEmailValue}
                placeholder="Inscrivez-vous à notre"
                placeholderTextColor="#D4D7DE"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.notificationInput}
              />
              <Pressable style={styles.notificationSubmitBtn}>
                <Text style={styles.notificationSubmitText}>S'inscrire</Text>
              </Pressable>
            </View>
          </Animated.View>
        </Animated.View>
      </Modal>
    </Animated.ScrollView>
  );
}
