import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { styles } from '../styles/CartScreen.styles';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const { headerTheme } = useTheme();
  const {
    items,
    lineCount,
    subtotal,
    savings,
    discountCode,
    discountAmount,
    shippingAmount,
    estimatedTax,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    applyDiscountCode,
  } = useCart();

  const [codeInput, setCodeInput] = useState(discountCode);
  const [orderNote, setOrderNote] = useState('');
  const [codeMessage, setCodeMessage] = useState('');

  const freeShippingTarget = 99;
  const freeShippingProgress = useMemo(
    () => Math.min(1, subtotal / freeShippingTarget),
    [subtotal]
  );
  const freeShippingLeft = Math.max(0, freeShippingTarget - subtotal);

  const onApplyCode = () => {
    const result = applyDiscountCode(codeInput);
    setCodeMessage(result.message);
  };

  const onCheckout = () => {
    Alert.alert('Checkout', 'Proceeding to secure checkout...');
  };

  if (!items.length) {
    return (
      <View
        style={[styles.emptyRoot, { paddingTop: insets.top + 16, backgroundColor: headerTheme.pageBackground }]}
      >
        <Ionicons name="bag-handle-outline" size={68} color={colors.headerBlue} />
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>
          Add products from Home to see them here. We will calculate discounts and shipping
          automatically.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: 148 + insets.bottom }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <View>
            <Text style={styles.title}>Your Cart</Text>
            <Text style={styles.subtitle}>{lineCount} items ready to ship</Text>
          </View>
          <Pressable onPress={clearCart} hitSlop={8}>
            <Text style={styles.clearAll}>Clear all</Text>
          </Pressable>
        </View>

        <View style={styles.freeShipCard}>
          <Text style={styles.freeShipTitle}>
            {freeShippingLeft > 0
              ? `Add ${formatCurrency(freeShippingLeft)} more for free shipping`
              : 'You unlocked free shipping!'}
          </Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${freeShippingProgress * 100}%` }]} />
          </View>
        </View>

        {items.map((line) => (
          <View key={line.id} style={styles.lineCard}>
            <Image source={{ uri: line.imageUrl }} style={styles.lineImage} contentFit="cover" />

            <View style={styles.lineBody}>
              <Text style={styles.lineTitle} numberOfLines={2}>
                {line.title}
              </Text>
              <Text style={styles.lineVariant}>{line.variantTitle}</Text>
              {line.inventoryNote ? <Text style={styles.inventory}>{line.inventoryNote}</Text> : null}

              <View style={styles.lineBottomRow}>
                <View>
                  <Text style={styles.price}>{formatCurrency(line.unitPrice)}</Text>
                  {line.compareAtPrice ? (
                    <Text style={styles.compareAt}>{formatCurrency(line.compareAtPrice)}</Text>
                  ) : null}
                </View>

                <View style={styles.quantityWrap}>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(line.id, line.quantity - 1)}
                  >
                    <Ionicons name="remove" size={16} color={colors.textDark} />
                  </Pressable>
                  <Text style={styles.qtyValue}>{line.quantity}</Text>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => updateQuantity(line.id, line.quantity + 1)}
                  >
                    <Ionicons name="add" size={16} color={colors.textDark} />
                  </Pressable>
                </View>
              </View>

              <View style={styles.lineActions}>
                <Pressable onPress={() => removeItem(line.id)}>
                  <Text style={styles.actionText}>Remove</Text>
                </Pressable>
                <Pressable onPress={() => Alert.alert('Saved', 'Saved for later.')}>
                  <Text style={styles.actionText}>Save for later</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Discount code</Text>
          <View style={styles.codeRow}>
            <TextInput
              value={codeInput}
              onChangeText={setCodeInput}
              placeholder="Enter code"
              placeholderTextColor="#8A94A6"
              autoCapitalize="characters"
              style={styles.codeInput}
            />
            <Pressable style={styles.applyBtn} onPress={onApplyCode}>
              <Text style={styles.applyText}>Apply</Text>
            </Pressable>
          </View>
          {!!codeMessage ? <Text style={styles.codeMessage}>{codeMessage}</Text> : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Order note</Text>
          <TextInput
            value={orderNote}
            onChangeText={setOrderNote}
            placeholder="Add delivery notes or gift message"
            placeholderTextColor="#8A94A6"
            multiline
            numberOfLines={3}
            style={styles.noteInput}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Summary</Text>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Subtotal</Text>
            <Text style={styles.sumValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Product savings</Text>
            <Text style={styles.sumSavings}>-{formatCurrency(savings)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Discount</Text>
            <Text style={styles.sumValue}>-{formatCurrency(discountAmount)}</Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Shipping</Text>
            <Text style={styles.sumValue}>
              {shippingAmount > 0 ? formatCurrency(shippingAmount) : 'Free'}
            </Text>
          </View>
          <View style={styles.sumRow}>
            <Text style={styles.sumLabel}>Estimated tax</Text>
            <Text style={styles.sumValue}>{formatCurrency(estimatedTax)}</Text>
          </View>
          <View style={[styles.sumRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.checkoutBar, { paddingBottom: Math.max(12, insets.bottom) }]}>
        <View>
          <Text style={styles.checkoutLabel}>Total payable</Text>
          <Text style={styles.checkoutTotal}>{formatCurrency(total)}</Text>
        </View>
        <Pressable style={styles.checkoutBtn} onPress={onCheckout}>
          <Text style={styles.checkoutText}>Checkout</Text>
        </Pressable>
      </View>
    </View>
  );
}
