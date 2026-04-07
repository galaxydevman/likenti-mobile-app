import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
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
import { ShopByCategory, type CategoryItem } from '../components/home/ShopByCategory';
import { TopPicksPanel, type TopPickProduct } from '../components/home/TopPicksPanel';
import { StoreLoadingView } from '../components/StoreLoadingView';
import { useCart } from '../context/CartContext';
import type { HomeScreenNavigationProp } from '../navigation/types';
import {
  fetchStorefrontHeroBanners,
  fetchStorefrontMainMenuCategories,
  fetchStorefrontProducts,
} from '../services/shopify';
import { styles } from '../styles/HomeScreen.styles';
import { useTheme } from '../theme/ThemeContext';

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
    if (!menuCategories?.length) return [];
    return menuCategories.map((category) => ({
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
    return <StoreLoadingView message="Loading store…" />;
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
      {heroSlides && heroSlides.length > 0 ? <HeroCarousel slides={heroSlides} /> : null}
      {categories.length > 0 ? <ShopByCategory categories={categories} /> : null}
      {topPicksProducts && topPicksProducts.length > 0 ? (
        <TopPicksPanel
          title="Likenti Top Picks"
          products={topPicksProducts}
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
      ) : null}
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
