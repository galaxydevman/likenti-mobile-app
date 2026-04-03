import React, { useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, type NavigationProp, type ParamListBase } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCart } from '../context/CartContext';
import { colors } from '../theme/colors';
import { cartColors, styles } from '../styles/CartScreen.styles';
import type { RootStackParamList, RootTabParamList } from '../navigation/types';

function formatCurrency(value: number): string {
  return `$${value.toFixed(2)}`;
}

/** Switch to Home tab and root home stack screen (Cart lives under tabs inside root stack). */
function navigateToMainHome(
  navigation: NavigationProp<ParamListBase>
) {
  let current: NavigationProp<ParamListBase> | undefined = navigation;
  for (let i = 0; i < 6 && current; i += 1) {
    const names = current.getState()?.routeNames as string[] | undefined;
    if (names?.includes('Home') && names?.includes('Cart')) {
      (current as BottomTabNavigationProp<RootTabParamList>).navigate('Home', { screen: 'Home' });
      return;
    }
    current = current.getParent();
  }
  current = navigation;
  for (let i = 0; i < 6 && current; i += 1) {
    const names = current.getState()?.routeNames as string[] | undefined;
    if (names?.includes('Tabs')) {
      (current as NavigationProp<RootStackParamList>).navigate('Tabs', {
        screen: 'Home',
        params: { screen: 'Home' },
      });
      return;
    }
    current = current.getParent();
  }
}

export default function CartScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { items, subtotal, updateQuantity, removeItem } = useCart();

  const [orderNote, setOrderNote] = useState('');

  const onCheckout = () => {
    Alert.alert('Checkout', 'Proceeding to secure checkout...');
  };

  const onPayPal = () => {
    Alert.alert('PayPal', 'PayPal checkout would open here.');
  };

  const goHome = () => {
    navigateToMainHome(navigation);
  };

  const lineTotal = (unit: number, qty: number) => unit * qty;

  if (!items.length) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <View style={styles.headerWrap}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={goHome}
            style={styles.headerSide}
            hitSlop={12}
          >
            <Ionicons name="chevron-back" size={24} color={colors.textDark} />
          </Pressable>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle}>Your Cart</Text>
          </View>
          <View style={styles.headerSide} />
        </View>
        <View style={styles.emptyRoot}>
          <View style={styles.emptyArt}>
            <Ionicons name="bag-handle-outline" size={48} color={colors.headerBlue} />
          </View>
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add items from the shop and they will show up here.
          </Text>
          <Pressable onPress={goHome}>
            <Text style={styles.emptyLink}>Continue Shopping</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <View style={styles.headerWrap}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={goHome}
          style={styles.headerSide}
          hitSlop={12}
        >
          <Ionicons name="chevron-back" size={24} color={colors.textDark} />
        </Pressable>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.headerSide} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 24 + insets.bottom },
        ]}
      >
        <View style={styles.hero}>
          <View style={styles.heroArt}>
            <Ionicons name="bag-handle" size={44} color="#1976D2" />
          </View>
          <View style={styles.heroTextBlock}>
            <Text style={styles.heroTitle}>Almost there!</Text>
            <Text style={styles.heroSubtitle}>Ready to complete your order?</Text>
            <Pressable onPress={goHome} accessibilityRole="button">
              <Text style={styles.continueLink}>Continue Shopping</Text>
            </Pressable>
          </View>
        </View>

        {items.map((line) => (
          <View key={line.id} style={styles.lineWrap}>
            <Image source={{ uri: line.imageUrl }} style={styles.lineImage} contentFit="cover" />
            <View style={styles.lineMain}>
              <View style={styles.lineTitleRow}>
                <Text style={styles.lineTitle} numberOfLines={2}>
                  {line.title}
                </Text>
                <Text style={styles.linePrice}>
                  {formatCurrency(lineTotal(line.unitPrice, line.quantity))}
                </Text>
              </View>
              <Text style={styles.lineVariant}>{line.variantTitle}</Text>

              <View style={styles.quantityBox}>
                <Pressable
                  style={[styles.qtyBtn, styles.qtyBtnBorder]}
                  onPress={() => updateQuantity(line.id, line.quantity - 1)}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease quantity"
                >
                  <Text style={{ fontSize: 18, color: colors.textDark, fontWeight: '500' }}>−</Text>
                </Pressable>
                <Text style={styles.qtyValue}>{line.quantity}</Text>
                <Pressable
                  style={[styles.qtyBtn, styles.qtyBtnBorderLeft]}
                  onPress={() => updateQuantity(line.id, line.quantity + 1)}
                  accessibilityRole="button"
                  accessibilityLabel="Increase quantity"
                >
                  <Text style={{ fontSize: 18, color: colors.textDark, fontWeight: '500' }}>+</Text>
                </Pressable>
              </View>

              <View style={styles.lineActions}>
                <Pressable onPress={() => removeItem(line.id)} accessibilityRole="button">
                  <Text style={styles.actionLink}>Remove</Text>
                </Pressable>
                <Text style={styles.actionSep}>|</Text>
                <Pressable
                  onPress={() => Alert.alert('Saved', 'Item saved for later.')}
                  accessibilityRole="button"
                >
                  <Text style={styles.actionLink}>Save for later</Text>
                </Pressable>
              </View>
            </View>
          </View>
        ))}

        <View style={styles.noteSection}>
          <View style={styles.noteRow}>
            <TextInput
              value={orderNote}
              onChangeText={setOrderNote}
              placeholder="Add a note to your order..."
              placeholderTextColor="#9E9E9E"
              style={styles.noteInput}
            />
            <Pressable
              style={styles.noteApply}
              onPress={() =>
                orderNote.trim()
                  ? Alert.alert('Note', 'Your note has been added to this order.')
                  : undefined
              }
              accessibilityRole="button"
              accessibilityLabel="Apply order note"
            >
              <Text style={styles.noteApplyText}>Apply</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.summaryBlock}>
          <Text style={styles.summaryHeading}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
          </View>
          <Pressable
            onPress={() =>
              Alert.alert('Shipping', 'Shipping and taxes are calculated at checkout.')
            }
            accessibilityRole="button"
          >
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <View style={styles.shippingRowInner}>
                <Text style={styles.shippingHint}>Calculated at checkout</Text>
                <Ionicons name="chevron-forward" size={16} color={cartColors.linkBlue} />
              </View>
            </View>
          </Pressable>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{formatCurrency(subtotal)}</Text>
          </View>
        </View>

        <View style={styles.checkoutBlock}>
          <LinearGradient
            colors={['#43A047', '#2E7D32']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.checkoutGradient}
          >
            <Pressable onPress={onCheckout} style={styles.checkoutBtnInner} accessibilityRole="button">
              <Text style={styles.checkoutBtnText}>Checkout</Text>
            </Pressable>
          </LinearGradient>

          <Text style={styles.orText}>or</Text>

          <Pressable style={styles.paypalBtn} onPress={onPayPal} accessibilityRole="button">
            <Text style={styles.paypalMark}>Pay</Text>
            <Text style={styles.paypalWord}>Pal</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
