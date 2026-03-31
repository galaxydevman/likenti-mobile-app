import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import type { ProductDetailProduct, RootStackParamList } from '../navigation/types';
import { fetchStorefrontProducts } from '../services/shopifyStorefront';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

export default function ProductListScreen({ route, navigation }: Props) {
  const { categoryId, categoryTitle } = route.params;
  const { addItem } = useCart();
  const [products, setProducts] = useState<ProductDetailProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      const items = await fetchStorefrontProducts({ categoryId, categoryTitle });
      setProducts(items);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not load products from Shopify.';
      setErrorMessage(message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId, categoryTitle]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

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
        onRefresh={loadProducts}
        ListFooterComponent={
          loading ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator size="small" color={colors.headerBlue} />
              <Text style={styles.loadingText}>Loading products...</Text>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
    gap: 12,
  },
  row: {
    gap: 12,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 4,
  },
  emptyText: {
    color: colors.textLabel,
    fontSize: 15,
    marginTop: 20,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 14,
    marginTop: 16,
  },
  loadingWrap: {
    marginTop: 16,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  loadingText: {
    color: colors.textLabel,
    fontSize: 13,
    fontWeight: '500',
  },
  card: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
  },
  image: {
    width: '100%',
    height: 170,
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
  },
  cardBody: {
    padding: 12,
  },
  title: {
    color: colors.textDark,
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  priceRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  newPrice: {
    color: '#E11D48',
    fontSize: 20,
    fontWeight: '800',
  },
  oldPrice: {
    color: '#8A94A6',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  addBtn: {
    marginTop: 12,
    borderRadius: 999,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerBlue,
  },
  addBtnText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '700',
  },
});
