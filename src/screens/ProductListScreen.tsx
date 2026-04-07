import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, FlatList, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { useCart } from '../context/CartContext';
import { cartItemFromProductDetail } from '../utils/cartLineFromProduct';
import type { HomeStackChildScreenProps, ProductDetailProduct } from '../navigation/types';
import { fetchStorefrontProducts } from '../services/shopify';
import { ProductGridCard } from '../components/products/ProductGridCard';
import { StoreLoadingView } from '../components/StoreLoadingView';
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
const SORT_BACKDROP_MAX_OPACITY = 0.45;
const FILTER_ROWS = [
  'Title',
  'Vendor',
  'Tags',
  'Size',
  'Product type',
  'Price',
  'Discount',
  'Color',
  'Collections',
  'Availability',
];

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
  const [filterOnSaleOnly, setFilterOnSaleOnly] = useState(false);
  const [draftFilterOnSaleOnly, setDraftFilterOnSaleOnly] = useState(false);
  const [isSortSheetVisible, setIsSortSheetVisible] = useState(false);
  const [isFilterSheetVisible, setIsFilterSheetVisible] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const sortSheetAnim = useRef(new Animated.Value(0)).current;
  const sortBackdropAnim = useRef(new Animated.Value(0)).current;
  const filterSheetAnim = useRef(new Animated.Value(0)).current;
  const listRef = useRef<FlatList<ProductDetailProduct> | null>(null);

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

  const filteredProducts = useMemo(() => {
    if (!filterOnSaleOnly) return products;
    return products.filter((item) => Boolean(item.oldPrice) && getDiscountPercent(item) > 0);
  }, [filterOnSaleOnly, products]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
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
  }, [filteredProducts, selectedSort]);

  const filteredCountForDraft = useMemo(() => {
    if (!draftFilterOnSaleOnly) return products.length;
    return products.filter((item) => Boolean(item.oldPrice) && getDiscountPercent(item) > 0).length;
  }, [draftFilterOnSaleOnly, products]);

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
        duration: 200,
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
        duration: 240,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start();
  }, [sortBackdropAnim, sortSheetAnim]);

  const closeFilterSheet = useCallback(() => {
    Animated.timing(filterSheetAnim, {
      toValue: 0,
      duration: SHEET_CLOSE_MS,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }).start(() => setIsFilterSheetVisible(false));
  }, [filterSheetAnim]);

  const openFilterSheet = useCallback(() => {
    filterSheetAnim.stopAnimation();
    filterSheetAnim.setValue(0);
    setDraftFilterOnSaleOnly(filterOnSaleOnly);
    setIsFilterSheetVisible(true);
    Animated.spring(filterSheetAnim, {
      toValue: 1,
      damping: 24,
      stiffness: 210,
      mass: 0.95,
      useNativeDriver: true,
    }).start();
  }, [filterOnSaleOnly, filterSheetAnim]);

  const sheetTranslateY = sortSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [320, 0],
  });

  const filterSheetTranslateY = filterSheetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [420, 0],
  });

  const sortBackdropOpacity = sortBackdropAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, SORT_BACKDROP_MAX_OPACITY],
  });

  const onListScroll = useCallback((event: { nativeEvent: { contentOffset: { y: number } } }) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const shouldShow = offsetY > 260;
    setShowScrollToTop((prev) => (prev === shouldShow ? prev : shouldShow));
  }, []);

  const scrollToTop = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  if (loading && products.length === 0) {
    return <StoreLoadingView message="Loading products…" />;
  }

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}>
      <FlatList
        ref={listRef}
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
        onScroll={onListScroll}
        scrollEventThrottle={16}
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
          <ProductGridCard
            item={item}
            onPressCard={() => navigation.navigate('ProductDetail', { product: item })}
            onPressAdd={() => onPressAdd(item)}
          />
        )}
      />
      {showScrollToTop ? (
        <Pressable
          style={[styles.scrollTopBtn, { bottom: Math.max(insets.bottom, 8) + 10 }]}
          onPress={scrollToTop}
          accessibilityRole="button"
          accessibilityLabel="Scroll to top"
        >
          <Ionicons name="chevron-up" size={22} color={colors.white} />
        </Pressable>
      ) : null}
      <View style={[styles.actionBarWrap, { paddingBottom: Math.max(insets.bottom, 8) }]}>
        <View style={styles.actionBar}>
          <Pressable style={styles.actionBtn} onPress={openFilterSheet}>
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
        <Animated.View style={[styles.sortBackdrop, { opacity: sortBackdropOpacity }]}>
          <Pressable style={styles.sortBackdropTapArea} onPress={closeSortSheet} />
        </Animated.View>
        <Animated.View
          style={[
            styles.sortSheetWrap,
            {transform: [{ translateY: sheetTranslateY }] },
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
      <Modal
        transparent
        visible={isFilterSheetVisible}
        animationType="none"
        onRequestClose={closeFilterSheet}
        statusBarTranslucent
      >
        <Pressable style={styles.sortBackdropTapArea} onPress={closeFilterSheet} />
        <Animated.View
          style={[
            styles.sortSheetWrap,
            { paddingBottom: Math.max(insets.bottom, 10), transform: [{ translateY: filterSheetTranslateY }] },
          ]}
        >
          <View style={styles.filterSheet}>
            <View style={styles.sortSheetHeader}>
              <Text style={styles.sortSheetTitle}>Filters</Text>
              <Pressable style={styles.sortCloseBtn} onPress={closeFilterSheet}>
                <Ionicons name="close" size={40} color={colors.headerBlue} />
              </Pressable>
            </View>
            <ScrollView
              style={styles.filterRowsWrap}
              contentContainerStyle={styles.filterRowsContent}
              showsVerticalScrollIndicator
            >
              {FILTER_ROWS.map((row) => (
                <View key={row}>
                  <Pressable
                    style={styles.filterRow}
                    onPress={() => {
                      if (row === 'Discount') {
                        setDraftFilterOnSaleOnly((prev) => !prev);
                      }
                    }}
                  >
                    <Text style={styles.filterRowText}>{row}</Text>
                    <Ionicons
                      name={row === 'Discount' && draftFilterOnSaleOnly ? 'remove' : 'add'}
                      size={40}
                      color="#0F172A"
                    />
                  </Pressable>
                  {row === 'Discount' && draftFilterOnSaleOnly ? (
                    <Pressable style={styles.filterSubOption} onPress={() => setDraftFilterOnSaleOnly((prev) => !prev)}>
                      <Ionicons name="checkmark-circle" size={20} color={colors.headerBlue} />
                      <Text style={styles.filterSubOptionText}>On Sale only</Text>
                    </Pressable>
                  ) : null}
                </View>
              ))}
            </ScrollView>
            <Pressable
              style={styles.filterApplyBtn}
              onPress={() => {
                setFilterOnSaleOnly(draftFilterOnSaleOnly);
                closeFilterSheet();
              }}
            >
              <Text style={styles.filterApplyBtnText}>Show {filteredCountForDraft} result(s)</Text>
            </Pressable>
          </View>
        </Animated.View>
      </Modal>
    </View>
  );
}
