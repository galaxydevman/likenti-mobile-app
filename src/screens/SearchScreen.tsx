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
import { fetchStorefrontProductSearch } from '../services/shopify';
import { useCart } from '../context/CartContext';
import { styles } from '../styles/SearchScreen.styles';

const TRENDING_KEYWORDS = [
  'Toothpaste',
  'Deodorant',
  'Sunscreen',
  'Shampoo',
  'Fragrances',
  'Lenses',
  'Napkins',
  'Baby Diapers',
];

const TRENDING_CATEGORIES = [
  {
    id: 'baby-toiletries',
    label: 'Baby Toiletries',
    imageUrl:
      'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'oral-care',
    label: 'Oral Care',
    imageUrl:
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sanitary-care',
    label: 'Sanitary Care',
    imageUrl:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'deodorant',
    label: 'Deodorant',
    imageUrl:
      'https://images.unsplash.com/photo-1612817288484-6f916006741a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'bath-body',
    label: 'Bath & Body',
    imageUrl:
      'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'baby-nutrition',
    label: 'Baby Nutrition',
    imageUrl:
      'https://images.unsplash.com/photo-1585435557343-3b092031d4a8?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sport-nutrition',
    label: 'Sport Nutrition',
    imageUrl:
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'healthy-nutrition',
    label: 'Healthy Nutrition',
    imageUrl:
      'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'electrical-hair-devices',
    label: 'Electrical Hair Devices',
    imageUrl:
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'lenses-care',
    label: 'Lenses Care',
    imageUrl:
      'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=400&auto=format&fit=crop&q=80',
  },
];

const SEARCH_DEBOUNCE_MS = 400;
const MIN_QUERY_LENGTH = 2;

type Props = HomeStackChildScreenProps<'Search'>;

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

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

  const isSearchActive = debouncedQuery.length >= MIN_QUERY_LENGTH;

  const trendingHeader = (
    <>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Keywords</Text>
        <View style={styles.keywordsWrap}>
          {TRENDING_KEYWORDS.map((keyword) => (
            <Pressable key={keyword} style={styles.keywordChip} onPress={() => applyKeyword(keyword)}>
              <Ionicons name="trending-up" size={18} color="#4CAF50" />
              <Text style={styles.keywordText}>{keyword}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Categories</Text>
        <View style={styles.categoriesList}>
          {TRENDING_CATEGORIES.map((category) => (
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
            <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
            <View style={styles.cardBody}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.newPrice}>{item.newPrice}</Text>
                <Text style={styles.oldPrice}>{item.oldPrice}</Text>
              </View>
              <Pressable style={styles.addBtn} onPress={() => onPressAdd(item)}>
                <Text style={styles.addBtnText}>Add to cart</Text>
              </Pressable>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
