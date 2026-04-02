import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import type { ProductDetailProduct, RootStackParamList } from '../navigation/types';
import { fetchStorefrontProducts } from '../services/shopify';
import { styles } from '../styles/ProductListScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

export default function ProductListScreen({ route, navigation }: Props) {
  const { categoryId, categoryTitle } = route.params;
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

  return (
    <View style={styles.root}>
      <FlatList
        data={products}
        numColumns={2}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
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
