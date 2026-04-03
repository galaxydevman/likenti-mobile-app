import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
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
import { useRecentlyViewed } from '../context/RecentlyViewedContext';
import { getRecommendedProducts } from '../data/productCatalog';
import { TopPicksPanel } from '../components/home/TopPicksPanel';
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
  return `$${value.toFixed(2)}`;
}

const CONTENT_H_PAD = 16;

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
  }, [product.id]);

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

  const recommendedProducts = useMemo(() => getRecommendedProducts(product, 8), [product]);

  const continueFromRecent = useMemo(
    () => recentlyViewedItems.filter((p) => p.id !== product.id).slice(0, 10),
    [recentlyViewedItems, product.id],
  );

  const aboutText = useMemo(() => {
    const raw = product.description?.trim();
    if (raw) return raw;
    return DESCRIPTION_FALLBACK;
  }, [product.description]);

  const descriptionBullets = useMemo(() => descriptionToBullets(aboutText), [aboutText]);

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
    addItem({
      id: item.id,
      title: item.title,
      variantTitle: 'Default',
      imageUrl: item.imageUrl,
      unitPrice: parsePrice(item.newPrice),
      compareAtPrice: parsePrice(item.oldPrice),
      quantity: 1,
      inventoryNote: 'Ships in 24 hours',
    });
  };

  const onAddToCart = () => {
    addItem({
      id: product.id,
      title: product.title,
      variantTitle: 'Default',
      imageUrl: product.imageUrl,
      unitPrice,
      compareAtPrice,
      quantity,
      inventoryNote: 'Ships in 24 hours',
    });
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
          <View style={styles.savePill}>
            <Ionicons name="pricetag-outline" size={14} color={colors.white} />
            <Text style={styles.saveText}>{product.saveLabel}</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.newPrice}>{formatCurrency(unitPrice)}</Text>
            <Text style={styles.oldPrice}>{formatCurrency(compareAtPrice)}</Text>
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
              onPress={() => setDescriptionExpanded((v) => !v)}
              accessibilityRole="button"
              accessibilityState={{ expanded: descriptionExpanded }}
              accessibilityLabel="Product description"
              accessibilityHint={
                descriptionExpanded ? 'Collapses product description' : 'Expands product description'
              }
            >
              <Text style={styles.descriptionAccordionLabel}>Product Description</Text>
              <Ionicons
                name="chevron-down"
                size={22}
                color={colors.headerBlue}
                style={[
                  styles.descriptionAccordionChevron,
                  { transform: [{ rotate: descriptionExpanded ? '180deg' : '0deg' }] },
                ]}
              />
            </Pressable>
            {descriptionExpanded ? (
              <View style={styles.descriptionAccordionExpanded}>
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
            ) : null}
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
