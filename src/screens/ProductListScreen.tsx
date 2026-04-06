import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
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

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}>
      <FlatList
        data={products}
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
          <Pressable style={styles.actionBtn}>
            <Ionicons name="swap-vertical-outline" size={18} color={colors.white} />
            <Text style={styles.actionBtnText}>Sort By</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
