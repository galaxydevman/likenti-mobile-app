import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { styles } from '../styles/ProductDetailScreen.styles';

type Props = NativeStackScreenProps<HomeStackParamList, 'ProductDetail'>;

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

const CONTENT_H_PAD = 16;

export default function ProductDetailScreen({ route }: Props) {
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();
  const slideWidth = windowWidth - CONTENT_H_PAD * 2;
  const { headerTheme } = useTheme();
  const { addItem } = useCart();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
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
          <FlatList
            ref={galleryListRef}
            data={imageGallery}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            keyExtractor={(uri, index) => `${index}-${uri}`}
            renderItem={({ item }) => (
              <View style={{ width: slideWidth }}>
                <Image source={{ uri: item }} style={styles.galleryImage} contentFit="contain" />
              </View>
            )}
            onScroll={onGalleryScroll}
            scrollEventThrottle={16}
            getItemLayout={(_, index) => ({
              length: slideWidth,
              offset: slideWidth * index,
              index,
            })}
          />
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
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(12, insets.bottom) }]}>
        <Pressable style={styles.addBtn} onPress={onAddToCart}>
          <Text style={styles.addBtnText}>Add to cart</Text>
        </Pressable>
      </View>
    </View>
  );
}
