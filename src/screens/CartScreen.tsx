import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
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
      <View style={[styles.emptyRoot, { paddingTop: insets.top + 16 }]}>
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
    <View style={styles.root}>
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

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  content: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textDark,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: '#6C7A91',
  },
  clearAll: {
    color: colors.headerBlue,
    fontSize: 14,
    fontWeight: '700',
  },
  freeShipCard: {
    backgroundColor: '#EAF7FF',
    borderWidth: 1,
    borderColor: '#C6E8FA',
    borderRadius: 14,
    padding: 12,
    marginBottom: 14,
  },
  freeShipTitle: {
    color: '#0D4F73',
    fontWeight: '700',
    marginBottom: 8,
  },
  progressTrack: {
    height: 8,
    borderRadius: 999,
    backgroundColor: '#CFE8F8',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.headerBlue,
    borderRadius: 999,
  },
  lineCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: 12,
    marginBottom: 12,
    flexDirection: 'row',
  },
  lineImage: {
    width: 92,
    height: 92,
    borderRadius: 12,
    backgroundColor: '#EEF2F5',
  },
  lineBody: {
    flex: 1,
    marginLeft: 12,
  },
  lineTitle: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '700',
  },
  lineVariant: {
    marginTop: 4,
    fontSize: 12,
    color: '#64748B',
  },
  inventory: {
    marginTop: 2,
    fontSize: 12,
    color: '#0F9D58',
    fontWeight: '600',
  },
  lineBottomRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    color: colors.textDark,
    fontWeight: '800',
    fontSize: 16,
  },
  compareAt: {
    marginTop: 2,
    color: '#8A94A6',
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  quantityWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D8E0EB',
    borderRadius: 999,
    paddingHorizontal: 4,
    height: 34,
  },
  qtyBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyValue: {
    minWidth: 20,
    textAlign: 'center',
    fontWeight: '700',
    color: colors.textDark,
  },
  lineActions: {
    marginTop: 10,
    flexDirection: 'row',
    gap: 14,
  },
  actionText: {
    color: colors.headerBlue,
    fontSize: 13,
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(15,23,42,0.08)',
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: colors.textDark,
    marginBottom: 10,
  },
  codeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  codeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D8E0EB',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    color: colors.textDark,
    backgroundColor: '#FAFCFF',
  },
  applyBtn: {
    height: 42,
    borderRadius: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.headerBlue,
  },
  applyText: {
    color: colors.white,
    fontWeight: '700',
  },
  codeMessage: {
    marginTop: 8,
    color: '#475569',
    fontSize: 12,
  },
  noteInput: {
    minHeight: 72,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#D8E0EB',
    borderRadius: 10,
    padding: 10,
    color: colors.textDark,
    backgroundColor: '#FAFCFF',
  },
  sumRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sumLabel: {
    color: '#55637B',
  },
  sumValue: {
    color: colors.textDark,
    fontWeight: '600',
  },
  sumSavings: {
    color: '#0F9D58',
    fontWeight: '700',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E4EAF2',
    paddingTop: 10,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    color: colors.textDark,
    fontWeight: '800',
    fontSize: 16,
  },
  totalValue: {
    color: colors.textDark,
    fontWeight: '900',
    fontSize: 18,
  },
  checkoutBar: {
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
    justifyContent: 'space-between',
  },
  checkoutLabel: {
    color: '#64748B',
    fontSize: 12,
  },
  checkoutTotal: {
    marginTop: 2,
    color: colors.textDark,
    fontSize: 20,
    fontWeight: '900',
  },
  checkoutBtn: {
    backgroundColor: colors.headerBlue,
    borderRadius: 999,
    paddingHorizontal: 24,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 16,
  },
  emptyRoot: {
    flex: 1,
    backgroundColor: colors.pageBg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    marginTop: 12,
    fontSize: 24,
    color: colors.textDark,
    fontWeight: '800',
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#64748B',
    lineHeight: 20,
  },
});
