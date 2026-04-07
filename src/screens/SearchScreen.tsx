import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  InteractionManager,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Image } from 'expo-image';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { HomeSearchBar } from '../components/home/HomeSearchBar';
import type { HomeStackChildScreenProps, ProductDetailProduct } from '../navigation/types';
import { fetchStorefrontMainMenuCategories, fetchStorefrontProductSearch } from '../services/shopify';
import { useCart } from '../context/CartContext';
import { cartItemFromProductDetail } from '../utils/cartLineFromProduct';
import { ProductImageSaleTag } from '../components/products/ProductImageSaleTag';
import { StoreLoadingView } from '../components/StoreLoadingView';
import { styles } from '../styles/SearchScreen.styles';

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

type Props = HomeStackChildScreenProps<'Search'>;

export default function SearchScreen({ navigation }: Props) {
  const { addItem } = useCart();
  const { headerTheme } = useTheme();
  const searchInputRef = useRef<TextInput>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [searchBarKey, setSearchBarKey] = useState(0);
  const [searchBarDefault, setSearchBarDefault] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [products, setProducts] = useState<ProductDetailProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [endCursor, setEndCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);
  const [trendingCategories, setTrendingCategories] = useState<
    { id: string; label: string; imageUrl: string }[]
  >([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  const scheduleSearch = useCallback((text: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(text.trim());
    }, SEARCH_DEBOUNCE_MS);
  }, []);

  const applyKeyword = useCallback((keyword: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    setSearchBarDefault(keyword);
    setSearchBarKey((k) => k + 1);
    setDebouncedQuery(keyword.trim());
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={styles.headerSearchWrap}>
          <HomeSearchBar
            key={searchBarKey}
            placeholder="Search"
            defaultValue={searchBarDefault}
            inputRef={searchInputRef}
            onChangeText={scheduleSearch}
            showFavouriteButton={false}
            showQrScannerButton={false}
            autoFocus
          />
        </View>
      ),
    });
  }, [navigation, scheduleSearch, searchBarKey, searchBarDefault]);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const categories = await fetchStorefrontMainMenuCategories();
        if (cancelled) return;
        if (categories.length === 0) {
          setTrendingCategories([]);
          setTrendingKeywords([]);
          return;
        }

        const normalizedCategories = categories.slice(0, 10).map((category) => ({
          id: category.id,
          label: category.title,
          imageUrl: category.imageUrl,
        }));
        setTrendingCategories(normalizedCategories);

        const derivedKeywords = Array.from(
          new Set(
            categories
              .map((category) => category.title.trim())
              .filter((title) => title.length > 0)
          )
        ).slice(0, 8);

        setTrendingKeywords(derivedKeywords);
      } catch {
        if (!cancelled) {
          setTrendingCategories([]);
          setTrendingKeywords([]);
        }
      } finally {
        if (!cancelled) {
          setTrendingLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const task = InteractionManager.runAfterInteractions(() => {
        const tryFocus = () => {
          if (cancelled) return;
          searchInputRef.current?.focus();
        };
        requestAnimationFrame(() => {
          tryFocus();
          setTimeout(tryFocus, 100);
        });
      });
      return () => {
        cancelled = true;
        if (typeof task === 'object' && task !== null && 'cancel' in task) {
          (task as { cancel: () => void }).cancel();
        }
      };
    }, [])
  );

  useEffect(() => {
    if (debouncedQuery.length < MIN_QUERY_LENGTH) {
      setProducts([]);
      setErrorMessage(null);
      setLoading(false);
      setLoadingMore(false);
      setHasNextPage(false);
      setEndCursor(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErrorMessage(null);
    setEndCursor(null);
    setHasNextPage(false);

    void (async () => {
      try {
        const page = await fetchStorefrontProductSearch({ searchQuery: debouncedQuery, pageSize: 24 });
        if (cancelled) return;
        setProducts(page.items);
        setHasNextPage(page.hasNextPage);
        setEndCursor(page.endCursor);
      } catch (error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : 'Search failed.';
          setErrorMessage(message);
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  const loadMore = useCallback(async () => {
    if (
      debouncedQuery.length < MIN_QUERY_LENGTH ||
      loading ||
      loadingMore ||
      !hasNextPage ||
      !endCursor
    ) {
      return;
    }
    setLoadingMore(true);
    setErrorMessage(null);
    try {
      const page = await fetchStorefrontProductSearch({
        searchQuery: debouncedQuery,
        pageSize: 24,
        afterCursor: endCursor,
      });
      setProducts((prev) => [...prev, ...page.items]);
      setHasNextPage(page.hasNextPage);
      setEndCursor(page.endCursor);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load more.';
      setErrorMessage(message);
    } finally {
      setLoadingMore(false);
    }
  }, [debouncedQuery, endCursor, hasNextPage, loading, loadingMore]);

  const onPressAdd = (item: ProductDetailProduct) => {
    addItem(cartItemFromProductDetail(item, 1));
  };

  const isSearchActive = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const trendingHeader =
    trendingKeywords.length === 0 && trendingCategories.length === 0 ? (
      <View style={styles.emptyBlock}>
        <Text style={styles.emptyText}>No store categories to show yet.</Text>
      </View>
    ) : (
      <>
        {trendingKeywords.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Keywords</Text>
            <View style={styles.keywordsWrap}>
              {trendingKeywords.map((keyword) => (
                <Pressable key={keyword} style={styles.keywordChip} onPress={() => applyKeyword(keyword)}>
                  <Ionicons name="trending-up" size={18} color="#4CAF50" />
                  <Text style={styles.keywordText}>{keyword}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}

        {trendingCategories.length > 0 ? (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trending Categories</Text>
            <View style={styles.categoriesList}>
              {trendingCategories.map((category) => (
                <Pressable key={category.id} style={styles.categoryItem} onPress={() => applyKeyword(category.label)}>
                  <View style={styles.categoryCircle}>
                    <Image source={{ uri: category.imageUrl }} style={styles.categoryImage} contentFit="cover" />
                  </View>
                  <Text style={styles.categoryText} numberOfLines={2}>
                    {category.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        ) : null}
      </>
    );

  const searchListHeader = (
    <View style={styles.resultsHeader}>
      <Text style={styles.resultsTitle} numberOfLines={2}>
        Results for &quot;{debouncedQuery}&quot;
      </Text>
      {loading ? (
        <View style={styles.inlineLoading}>
          <ActivityIndicator size="small" color={colors.headerBlue} />
          <Text style={styles.loadingHint}>Searching…</Text>
        </View>
      ) : null}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}>
      {!isSearchActive && trendingLoading ? (
        <StoreLoadingView message="Loading search…" />
      ) : (
      <FlatList
        key={isSearchActive ? 'search-results' : 'search-trending'}
        data={isSearchActive ? products : []}
        keyExtractor={(item) => item.id}
        numColumns={isSearchActive ? 2 : undefined}
        columnWrapperStyle={isSearchActive ? styles.row : undefined}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={isSearchActive ? searchListHeader : <View style={styles.trendingWrap}>{trendingHeader}</View>}
        onEndReached={isSearchActive ? loadMore : undefined}
        onEndReachedThreshold={0.35}
        ListFooterComponent={
          isSearchActive && loadingMore ? (
            <View style={styles.footerLoading}>
              <ActivityIndicator size="small" color={colors.headerBlue} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          isSearchActive && !loading ? (
            <View style={styles.emptyBlock}>
              {errorMessage ? null : (
                <Text style={styles.emptyText}>
                  {products.length === 0 ? 'No products match your search.' : ''}
                </Text>
              )}
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => navigation.navigate('ProductDetail', { product: item })}>
            <View style={styles.imageWrap}>
              <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
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
              <Pressable style={styles.addBtn} onPress={() => onPressAdd(item)}>
                <Text style={styles.addBtnText}>Add to cart</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
      )}
    </View>
  );
}
