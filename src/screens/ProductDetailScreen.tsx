import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  FlatList,
  LayoutChangeEvent,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList, ProductDetailProduct } from '../navigation/types';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { cartItemFromProductDetail } from '../utils/cartLineFromProduct';
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { fetchStorefrontRecommendedProducts } from '../services/shopify';
import { TopPicksPanel } from '../components/home/TopPicksPanel';
import { ProductImageSaleTag } from '../components/products/ProductImageSaleTag';
import { styles } from '../styles/ProductDetailScreen.styles';

const SAMPLE_REVIEWS: { author: string; rating: number; date: string; text: string }[] = [
  {
    author: 'Maya R.',
    rating: 5,
    date: 'Mar 2026',
    text: 'Exactly as described. Fast delivery and well packaged. Happy to shop here again.',
  },
  {
    author: 'Jonas K.',
    rating: 4,
    date: 'Feb 2026',
    text: 'Great quality for the price. Small learning curve on use, but worth it overall.',
  },
];

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

function formatCurrency(value: number): string {
  return `د.ت ${value.toFixed(2)}`;
}

const CONTENT_H_PAD = 16;

const DESCRIPTION_ANIM_MS = 300;

const descriptionEase = Easing.bezier(0.25, 0.1, 0.25, 1);

const DESCRIPTION_FALLBACK = 'No detailed description is available for this product yet.';

function descriptionToBullets(text: string): string[] {
  const trimmed = text.trim();
  if (!trimmed || trimmed === DESCRIPTION_FALLBACK) {
    return [DESCRIPTION_FALLBACK];
  }

  if (trimmed.includes('\n')) {
    const lines = trimmed
      .split(/\n+/)
      .map((l) => l.trim().replace(/^[-•*·]\s*/, ''))
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }

  if (trimmed.includes('•')) {
    const parts = trimmed
      .split(/•/)
      .map((s) => s.trim().replace(/^[,;\s]+|[,;\s]+$/g, ''))
      .filter(Boolean);
    if (parts.length > 1) return parts;
  }

  const semicolonClauses = trimmed.split(/;\s+/).map((s) => s.trim()).filter(Boolean);
  if (semicolonClauses.length > 1) return semicolonClauses;

  const sentences = trimmed
    .split(/\.\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 2);
  if (sentences.length > 1) {
    return sentences.map((s) => (s.endsWith('.') ? s : `${s}.`));
  }

  return [trimmed];
}

function StarRow({ value, size = 14 }: { value: number; size?: number }) {
  const full = Math.round(Math.min(5, Math.max(0, value)));
  return (
    <View style={styles.reviewStarsRow}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons key={i} name={i <= full ? 'star' : 'star-outline'} size={size} color="#F59E0B" />
      ))}
    </View>
  );
}

export default function ProductDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth, height: windowHeight } = useWindowDimensions();
  const slideWidth = windowWidth - CONTENT_H_PAD * 2;
  const { headerTheme } = useTheme();
  const { addItem } = useCart();
  const { items: recentlyViewedItems, addRecentlyViewed } = useRecentlyViewed();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const [viewerMountKey, setViewerMountKey] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionContentHeight, setDescriptionContentHeight] = useState(0);
  const [recommendedProducts, setRecommendedProducts] = useState<ProductDetailProduct[]>([]);
  const descriptionHeightAnim = useRef(new Animated.Value(0)).current;
  const descriptionChevronAnim = useRef(new Animated.Value(0)).current;
  const galleryListRef = useRef<FlatList<string>>(null);

  const imageGallery = useMemo(
    () => (product.imageUrls?.length ? product.imageUrls : [product.imageUrl]),
    [product.imageUrl, product.imageUrls],
  );

  useEffect(() => {
    setGalleryIndex(0);
    galleryListRef.current?.scrollToOffset({ offset: 0, animated: false });
  }, [product.id]);

  useEffect(() => {
    setDescriptionExpanded(false);
    setDescriptionContentHeight(0);
    descriptionHeightAnim.setValue(0);
    descriptionChevronAnim.setValue(0);
  }, [product.id, descriptionHeightAnim, descriptionChevronAnim]);

  const onDescriptionContentLayout = useCallback((e: LayoutChangeEvent) => {
    const h = Math.ceil(e.nativeEvent.layout.height);
    if (h > 0) setDescriptionContentHeight((prev) => (prev === h ? prev : h));
  }, []);

  useEffect(() => {
    if (!descriptionExpanded || descriptionContentHeight <= 0) return;

    descriptionHeightAnim.stopAnimation();
    descriptionHeightAnim.setValue(0);

    Animated.parallel([
      Animated.timing(descriptionHeightAnim, {
        toValue: descriptionContentHeight,
        duration: DESCRIPTION_ANIM_MS,
        easing: descriptionEase,
        useNativeDriver: false,
      }),
      Animated.timing(descriptionChevronAnim, {
        toValue: 1,
        duration: DESCRIPTION_ANIM_MS,
        easing: descriptionEase,
        useNativeDriver: true,
      }),
    ]).start();
  }, [descriptionExpanded, descriptionContentHeight, descriptionHeightAnim, descriptionChevronAnim]);

  const toggleDescriptionExpanded = useCallback(() => {
    if (descriptionExpanded) {
      descriptionHeightAnim.stopAnimation();
      descriptionChevronAnim.stopAnimation();
      Animated.parallel([
        Animated.timing(descriptionHeightAnim, {
          toValue: 0,
          duration: DESCRIPTION_ANIM_MS,
          easing: descriptionEase,
          useNativeDriver: false,
        }),
        Animated.timing(descriptionChevronAnim, {
          toValue: 0,
          duration: DESCRIPTION_ANIM_MS,
          easing: descriptionEase,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (finished) setDescriptionExpanded(false);
      });
    } else {
      descriptionHeightAnim.stopAnimation();
      descriptionChevronAnim.stopAnimation();
      descriptionChevronAnim.setValue(0);
      descriptionHeightAnim.setValue(0);
      setDescriptionExpanded(true);
    }
  }, [descriptionExpanded, descriptionHeightAnim, descriptionChevronAnim]);

  useEffect(() => {
    if (imageGallery.length == 1) return;

    const timer = setInterval(() => {
      setGalleryIndex((prev) => {
        const next = (prev + 1) % imageGallery.length;
        galleryListRef.current?.scrollToOffset({
          offset: next * slideWidth,
          animated: true,
        });
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [imageGallery.length, slideWidth]);

  const onGalleryScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const i = Math.round(e.nativeEvent.contentOffset.x / slideWidth);
      if (i >= 0 && i < imageGallery.length) setGalleryIndex(i);
    },
    [imageGallery.length, slideWidth],
  );

  const unitPrice = useMemo(() => parsePrice(product.newPrice), [product.newPrice]);
  const compareAtPrice = useMemo(() => parsePrice(product.oldPrice), [product.oldPrice]);

  const continueFromRecent = useMemo(
    () => recentlyViewedItems.filter((p) => p.id !== product.id).slice(0, 10),
    [recentlyViewedItems, product.id],
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const items = await fetchStorefrontRecommendedProducts(product, 8);
        if (alive) setRecommendedProducts(items);
      } catch {
        if (alive) setRecommendedProducts([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, [product]);

  const aboutText = useMemo(() => {
    const raw = product.description?.trim();
    if (raw) return raw;
    return DESCRIPTION_FALLBACK;
  }, [product.description]);

  const descriptionBullets = useMemo(() => descriptionToBullets(aboutText), [aboutText]);

  const descriptionChevronRotation = useMemo(
    () =>
      descriptionChevronAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '180deg'],
      }),
    [descriptionChevronAnim],
  );

  const reviewTotalDisplay = useMemo(() => {
    if (product.reviewCount != null && product.reviewCount > 0) return product.reviewCount;
    return 48 + (product.id.length % 140);
  }, [product.id, product.reviewCount]);

  useEffect(() => {
    addRecentlyViewed(product);
  }, [product, addRecentlyViewed]);

  const openImageViewer = useCallback((index: number) => {
    setViewerIndex(index);
    setViewerMountKey((k) => k + 1);
    setImageViewerVisible(true);
  }, []);

  const closeImageViewer = useCallback(() => {
    setImageViewerVisible(false);
  }, []);

  const onPressAddFromRail = (item: ProductDetailProduct) => {
    addItem(cartItemFromProductDetail(item, 1));
  };

  const onAddToCart = () => {
    addItem(cartItemFromProductDetail(product, quantity));
    Alert.alert('Added to cart', `${quantity} item(s) added successfully.`);
  };

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}>
      <ScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 100 + insets.bottom }]}
      >
        <View style={styles.galleryWrap}>
          <View style={styles.galleryImageArea}>
            <FlatList
              ref={galleryListRef}
              data={imageGallery}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(uri, index) => `${index}-${uri}`}
              renderItem={({ item, index }) => (
                <Pressable
                  style={{ width: slideWidth }}
                  onPress={() => openImageViewer(index)}
                  accessibilityRole="imagebutton"
                  accessibilityLabel="View product image full screen"
                >
                  <Image source={{ uri: item }} style={styles.galleryImage} contentFit="contain" />
                </Pressable>
              )}
              onScroll={onGalleryScroll}
              scrollEventThrottle={16}
              getItemLayout={(_, index) => ({
                length: slideWidth,
                offset: slideWidth * index,
                index,
              })}
            />
            <ProductImageSaleTag
              visible={Boolean(product.oldPrice.trim() && compareAtPrice > unitPrice)}
              oldPrice={product.oldPrice}
              newPrice={product.newPrice}
              scale={Math.min(1.35, Math.max(1.05, slideWidth / 300))}
              pointerEvents="none"
            />
            <Pressable
              style={styles.galleryHeartBtn}
              onPress={() => setIsFavorite((v) => !v)}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: isFavorite }}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#E11D48' : colors.headerBlue}
              />
            </Pressable>
          </View>
          {imageGallery.length > 1 ? (
            <View style={styles.galleryDots}>
              {imageGallery.map((_, i) => (
                <View
                  key={`dot-${i}`}
                  style={[
                    styles.galleryDot,
                    i === galleryIndex ? styles.galleryDotActive : styles.galleryDotInactive,
                  ]}
                />
              ))}
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color="#F59E0B" />
            <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{product.badgeLabel}</Text>
            </View>
          </View>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.priceRow}>
            <Text style={styles.newPrice}>{formatCurrency(unitPrice)}</Text>
            {product.oldPrice.trim() && compareAtPrice > unitPrice ? (
              <Text style={styles.oldPrice}>{formatCurrency(compareAtPrice)}</Text>
            ) : null}
          </View>

          <View style={styles.qtyRow}>
            <Text style={styles.qtyLabel}>Quantity</Text>
            <View style={styles.quantityWrap}>
              <Pressable
                style={styles.qtyBtn}
                onPress={() => setQuantity((current) => Math.max(1, current - 1))}
              >
                <Ionicons name="remove" size={16} color={colors.textDark} />
              </Pressable>
              <Text style={styles.qtyValue}>{quantity}</Text>
              <Pressable style={styles.qtyBtn} onPress={() => setQuantity((current) => current + 1)}>
                <Ionicons name="add" size={16} color={colors.textDark} />
              </Pressable>
            </View>
          </View>
        </View>

        {recommendedProducts.length > 0 ? (
          <View style={styles.railBleed}>
            <TopPicksPanel
              title="Products you might like"
              products={recommendedProducts}
              onPressItem={(item) => navigation.navigate('ProductDetail', { product: item })}
              onPressAdd={onPressAddFromRail}
            />
          </View>
        ) : null}

        {continueFromRecent.length > 0 ? (
          <View style={styles.railBleed}>
            <TopPicksPanel
              title="Continue from recently viewed"
              products={continueFromRecent}
              onPressItem={(item) => navigation.navigate('ProductDetail', { product: item })}
              onPressAdd={onPressAddFromRail}
            />
          </View>
        ) : null}

        <View style={styles.aboutSection}>
          <Text style={styles.aboutSectionTitle}>About Product</Text>
          <View style={styles.aboutCard}>
            <Pressable
              style={({ pressed }) => [
                styles.descriptionAccordionHeader,
                descriptionExpanded && styles.descriptionAccordionHeaderExpanded,
                pressed && { opacity: 0.92 },
              ]}
              onPress={toggleDescriptionExpanded}
              accessibilityRole="button"
              accessibilityState={{ expanded: descriptionExpanded }}
              accessibilityLabel="Product description"
              accessibilityHint={
                descriptionExpanded ? 'Collapses product description' : 'Expands product description'
              }
            >
              <Text style={styles.descriptionAccordionLabel}>Product Description</Text>
              <Animated.View
                style={[styles.descriptionAccordionChevron, { transform: [{ rotate: descriptionChevronRotation }] }]}
              >
                <Ionicons name="chevron-down" size={22} color={colors.headerBlue} />
              </Animated.View>
            </Pressable>
            <Animated.View
              style={{
                height: descriptionHeightAnim,
                overflow: 'hidden',
              }}
              pointerEvents={descriptionExpanded ? 'auto' : 'none'}
            >
              <View
                style={[
                  styles.descriptionAccordionExpanded,
                  { position: 'absolute', left: 0, right: 0, top: 0 },
                ]}
                onLayout={onDescriptionContentLayout}
              >
                <Text style={styles.descriptionBlockTitle}>Product Description:</Text>
                {descriptionBullets.map((line, idx) => (
                  <View
                    key={`desc-bullet-${idx}`}
                    style={[
                      styles.descriptionBulletRow,
                      idx === descriptionBullets.length - 1 ? { marginBottom: 0 } : null,
                    ]}
                  >
                    <View style={styles.descriptionBulletDot} />
                    <Text style={styles.descriptionBulletText}>{line}</Text>
                  </View>
                ))}
              </View>
            </Animated.View>
          </View>
        </View>

        <View style={styles.subsectionCard}>
          <Text style={styles.subsectionTitle}>Product reviews</Text>
          <View style={styles.reviewsSummary}>
            <View style={styles.reviewsAverageWrap}>
              <Text style={styles.reviewsAverage}>{product.rating.toFixed(1)}</Text>
            </View>
            <View style={styles.reviewsMeta}>
              <StarRow value={product.rating} size={16} />
              <Text style={styles.reviewsBasedOn}>Based on {reviewTotalDisplay} reviews</Text>
            </View>
          </View>
          {SAMPLE_REVIEWS.map((rev, idx) => (
            <View key={`${rev.author}-${idx}`} style={[styles.reviewItem, idx === 0 ? styles.reviewItemFirst : null]}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewAuthor}>{rev.author}</Text>
                <Text style={styles.reviewDate}>{rev.date}</Text>
              </View>
              <StarRow value={rev.rating} size={13} />
              <Text style={styles.reviewText}>{rev.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(12, insets.bottom) }]}>
        <Pressable style={styles.addBtn} onPress={onAddToCart}>
          <Text style={styles.addBtnText}>Add to cart</Text>
        </Pressable>
      </View>

      <Modal
        visible={imageViewerVisible}
        animationType="fade"
        presentationStyle="fullScreen"
        onRequestClose={closeImageViewer}
        statusBarTranslucent
      >
        <View style={styles.imageViewerRoot}>
          <StatusBar barStyle="light-content" backgroundColor="#000" />
          <FlatList
            key={viewerMountKey}
            data={imageGallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={Math.min(viewerIndex, Math.max(0, imageGallery.length - 1))}
            style={styles.imageViewerList}
            keyExtractor={(uri, index) => `viewer-${index}-${uri}`}
            renderItem={({ item }) => (
              <View style={[styles.imageViewerPage, { width: windowWidth, height: windowHeight }]}>
                <Image
                  source={{ uri: item }}
                  style={styles.imageViewerImage}
                  contentFit="contain"
                  transition={200}
                />
              </View>
            )}
            getItemLayout={(_, index) => ({
              length: windowWidth,
              offset: windowWidth * index,
              index,
            })}
          />
          <Pressable
            style={[
              styles.imageViewerClose,
              { top: Math.max(12, insets.top + 6), right: 16 },
            ]}
            onPress={closeImageViewer}
            accessibilityRole="button"
            accessibilityLabel="Close full screen image"
          >
            <Ionicons name="close" size={26} color={colors.white} />
          </Pressable>
        </View>
      </Modal>
    </View>
  );
}
