import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, FlatList, Modal, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { cartItemFromProductDetail } from '../utils/cartLineFromProduct';
import type { HomeStackChildScreenProps, ProductDetailProduct } from '../navigation/types';
import { fetchStorefrontProducts } from '../services/shopify';
import { ProductImageSaleTag } from '../components/products/ProductImageSaleTag';
import { styles } from '../styles/ProductListScreen.styles';

type Props = HomeStackChildScreenProps<'ProductList'>;
type SortOption = 'relevance' | 'newly-arrived' | 'price-low-high' | 'discount-high-low' | 'price-high-low';

const SORT_OPTIONS: { key: SortOption; label: string }[] = [
  { key: 'relevance', label: 'Relevance' },
  { key: 'newly-arrived', label: 'Newly arrived' },
  { key: 'price-low-high', label: 'Price Low to High' },
  { key: 'discount-high-low', label: 'Discount High to Low' },
  { key: 'price-high-low', label: 'Price High to Low' },
];

const SHEET_OPEN_MS = 320;
const SHEET_CLOSE_MS = 260;
const BACKDROP_OPEN_MS = 260;
const BACKDROP_CLOSE_MS = 220;

function parsePriceValue(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

function getDiscountPercent(item: ProductDetailProduct): number {
  if (!item.oldPrice) return 0;
  const oldValue = parsePriceValue(item.oldPrice);
  const newValue = parsePriceValue(item.newPrice);
  if (oldValue <= 0 || newValue >= oldValue) return 0;
  return ((oldValue - newValue) / oldValue) * 100;
}

export default function ProductListScreen({ route, navigation }: Props) {
  const { categoryId, categoryTitle } = route.params;
  const { headerTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const [products, setProducts] = useState<ProductDetailProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [selectedSort, setSelectedSort] = useState<SortOption>('relevance');
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false);
  const sortSheetAnim = useRef(new Animated.Value(0)).current;
  const sortBackdropAnim = useRef(new Animated.Value(0)).current;

  const loadProducts = useCallback(async (isRefresh = false) => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const result = await fetchStorefrontProducts({ categoryId, categoryTitle, pageSize: 50 });
      setProducts(result.items);
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load products from Shopify.';
      setErrorMessage(message);
      if (!isRefresh) {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryTitle]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const loadMoreProducts = useCallback(async () => {
    if (loading || loadingMore || !hasNextPage) return;

    setLoadingMore(true);
    setErrorMessage(null);
    try {
      const result = await fetchStorefrontProducts({
        categoryId,
        categoryTitle,
        pageSize: 50,
        afterCursor: endCursor,
      });
      setProducts((prev) => [...prev, ...result.items]);
      setHasNextPage(result.hasNextPage);
      setEndCursor(result.endCursor);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load more products.';
      setErrorMessage(message);
    } finally {
      setLoadingMore(false);
    }
  }, [categoryId, categoryTitle, endCursor, hasNextPage, loading, loadingMore]);

  const onPressAdd = (item: ProductDetailProduct) => {
    addItem(cartItemFromProductDetail(item, 1));
  };

  const sortedProducts = useMemo(() => {
    const list = [...products];
    switch (selectedSort) {
      case 'price-low-high':
        return list.sort((a, b) => parsePriceValue(a.newPrice) - parsePriceValue(b.newPrice));
      case 'price-high-low':
        return list.sort((a, b) => parsePriceValue(b.newPrice) - parsePriceValue(a.newPrice));
      case 'discount-high-low':
        return list.sort((a, b) => getDiscountPercent(b) - getDiscountPercent(a));
      case 'newly-arrived':
        // Shopify search is already relevance-first; use latest fetched order as "newly arrived".
        return list.reverse();
      case 'relevance':
      default:
        return list;
    }
  }, [products, selectedSort]);

  const closeSortSheet = useCallback(() => {
    Animated.parallel([
      Animated.timing(sortSheetAnim, {
        toValue: 0,
        duration: SHEET_CLOSE_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(sortBackdropAnim, {
        toValue: 0,
        duration: BACKDROP_CLOSE_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => setIsSortSheetVisible(false));
  }, [sortBackdropAnim, sortSheetAnim]);

  const openSortSheet = useCallback(() => {
    sortSheetAnim.stopAnimation();
    sortBackdropAnim.stopAnimation();
    sortSheetAnim.setValue(0);
    sortBackdropAnim.setValue(0);
    setIsSortSheetVisible(true);
    Animated.parallel([
      Animated.spring(sortSheetAnim, {
        toValue: 1,
        damping: 24,
        stiffness: 210,
        mass: 0.95,
        useNativeDriver: true,
      }),
      Animated.timing(sortBackdropAnim, {
        toValue: 1,
        duration: BACKDROP_OPEN_MS,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [sortBackdropAnim, sortSheetAnim]);

  const sheetTranslateY = sortSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 0],
  });

  const backdropOpacity = sortBackdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.45],
  });

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}>
      <FlatList
        data={sortedProducts}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.content, { paddingBottom: 110 + insets.bottom }]}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={<Text style={styles.heading}>{categoryTitle}</Text>}
        refreshing={loading}
        onRefresh={() => loadProducts(true)}
        onEndReached={loadMoreProducts}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          loading || loadingMore ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.headerBlue} />
              <Text style={styles.loadingText}>{loadingMore ? 'Loading more products...' : 'Loading products...'}</Text>
            </View>
          ) : null
        }
        ListEmptyComponent={
          loading ? null : (
            <View>
              {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
              <Text style={styles.emptyText}>No products found in this category.</Text>
            </View>
          )
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
              <Pressable
                style={styles.favoriteBtn}
                onPress={(event) => {
                  event.stopPropagation();
                }}
              >
                <Ionicons name="heart-outline" size={20} color={colors.headerBlue} />
              </Pressable>
              <Pressable
                style={styles.quickAddBtn}
                onPress={(event) => {
                  event.stopPropagation();
                  onPressAdd(item);
                }}
              >
                <Ionicons name="add" size={26} color={colors.white} />
              </Pressable>
              <ProductImageSaleTag
                visible={Boolean(item.oldPrice)}
                oldPrice={item.oldPrice}
                newPrice={item.newPrice}
              />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.newPrice}>{item.newPrice}</Text>
                {item.oldPrice ? <Text style={styles.oldPrice}>{item.oldPrice}</Text> : null}
              </View>
            </View>
          </Pressable>
        )}
      />
      <View style={[styles.actionBarWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.actionBar}>
          <Pressable style={styles.actionBtn}>
            <Ionicons name="options-outline" size={18} color={colors.white} />
            <Text style={styles.actionBtnText}>Filters</Text>
          </Pressable>
          <View style={styles.actionDivider} />
          <Pressable style={styles.actionBtn} onPress={openSortSheet}>
            <Ionicons name="swap-vertical-outline" size={18} color={colors.white} />
            <Text style={styles.actionBtnText}>Sort By</Text>
          </Pressable>
        </View>
      </View>
      <Modal
        transparent
        visible={isSortSheetVisible}
        animationType="none"
        onRequestClose={closeSortSheet}
        statusBarTranslucent
      >
        <Animated.View style={[styles.sortBackdrop, { opacity: backdropOpacity }]}>
          <Pressable style={styles.sortBackdropTapArea} onPress={closeSortSheet} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sortSheetWrap,
            { paddingBottom: Math.max(insets.bottom, 10), transform: [{ translateY: sheetTranslateY }] },
          ]}
        >
          <View style={styles.sortSheet}>
            <View style={styles.sortSheetHeader}>
              <Text style={styles.sortSheetTitle}>Sort By</Text>
              <Pressable style={styles.sortCloseBtn} onPress={closeSortSheet}>
                <Ionicons name="close" size={40} color={colors.headerBlue} />
              </Pressable>
            </View>
            {SORT_OPTIONS.map((option) => (
              <Pressable
                key={option.key}
                style={styles.sortOptionBtn}
                onPress={() => {
                  setSelectedSort(option.key);
                  closeSortSheet();
                }}
              >
                <Text style={styles.sortOptionText}>{option.label}</Text>
                {selectedSort === option.key ? (
                  <Ionicons name="checkmark" size={22} color={colors.headerBlue} />
                ) : null}
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}
