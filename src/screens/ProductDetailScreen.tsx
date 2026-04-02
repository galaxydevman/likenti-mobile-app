import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useCart } from '../context/CartContext';
import { styles } from '../styles/ProductDetailScreen.styles';

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
