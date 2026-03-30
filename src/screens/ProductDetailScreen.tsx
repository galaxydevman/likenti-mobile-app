import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetail'>;

function parsePrice(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function ProductDetailScreen({ route, navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { product } = route.params;
  const [quantity, setQuantity] = useState(1);

  const unitPrice = useMemo(() => parsePrice(product.newPrice), [product.newPrice]);
  const compareAtPrice = useMemo(() => parsePrice(product.oldPrice), [product.oldPrice]);
  const total = unitPrice * quantity;

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
    <View style={styles.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 140 + insets.bottom }]}
      >
        <Image source={{ uri: product.imageUrl }} style={styles.heroImage} contentFit="contain" />

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
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
        <Pressable style={styles.addBtn} onPress={onAddToCart}>
          <Text style={styles.addBtnText}>Add to cart</Text>
        </Pressable>
        <Pressable style={styles.viewCartBtn} onPress={() => navigation.navigate('Tabs', { screen: 'Cart' })}>
          <Text style={styles.viewCartText}>Cart</Text>
        </Pressable>
      </View>
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
  },
  heroImage: {
    width: '100%',
    height: 320,
    borderRadius: 20,
    backgroundColor: colors.white,
    marginBottom: 14,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  ratingText: {
    color: colors.textDark,
    fontWeight: '700',
    marginRight: 8,
  },
  badgePill: {
    backgroundColor: '#2FB47C',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  title: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: '700',
    color: colors.textDark,
    lineHeight: 30,
  },
  savePill: {
    marginTop: 12,
    alignSelf: 'flex-start',
    backgroundColor: '#E11D48',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  saveText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 12,
  },
  priceRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  oldPrice: {
    color: '#8A94A6',
    textDecorationLine: 'line-through',
    fontWeight: '600',
  },
  newPrice: {
    color: '#E11D48',
    fontSize: 28,
    fontWeight: '900',
  },
  qtyRow: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  qtyLabel: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '700',
  },
  quantityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E0EB',
    borderRadius: 999,
    paddingHorizontal: 4,
    height: 36,
  },
  qtyBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 24,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.textDark,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 1,
    borderTopColor: '#DEE7F1',
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  totalLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  totalValue: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '900',
  },
  addBtn: {
    flex: 1,
    height: 46,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerBlue,
  },
  addBtnText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  viewCartBtn: {
    height: 46,
    borderRadius: 999,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.headerBlue,
  },
  viewCartText: {
    color: colors.headerBlue,
    fontWeight: '700',
  },
});
