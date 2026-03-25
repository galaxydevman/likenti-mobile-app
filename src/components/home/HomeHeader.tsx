import React from 'react';
import { View, Pressable, StyleSheet, Image, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { HomeSearchBar } from './HomeSearchBar';

const DEFAULT_LOGO = require('../../../assets/icon/likenti_logo_transparent_white.png');

type Props = {
  /** Override the default LikEnti lockup (icon + wordmark + tagline in one image). */
  logoSource?: ImageSourcePropType;
  onPressCart?: () => void;
  onPressMenu?: () => void;
  searchPlaceholder?: string;
  onSearchChange?: (q: string) => void;
};

export function HomeHeader({
  logoSource = DEFAULT_LOGO,
  onPressCart,
  onPressMenu,
  searchPlaceholder = 'Rechercher',
  onSearchChange,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 12) }]}>
      <View style={styles.topRow}>
        <View style={styles.logoBlock}>
          <Image source={logoSource} style={styles.logo} resizeMode="contain" />
        </View>
        <View style={styles.icons}>
          <Pressable onPress={onPressCart} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="cart-outline" size={26} color={colors.white} />
          </Pressable>
          <Pressable onPress={onPressMenu} hitSlop={12} style={styles.iconBtn}>
            <Ionicons name="menu" size={28} color={colors.white} />
          </Pressable>
        </View>
      </View>
      <HomeSearchBar placeholder={searchPlaceholder} onChangeText={onSearchChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.headerBlue,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  logoBlock: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  logo: {
    width: 168,
    height: 72,
    maxWidth: '72%',
  },
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  iconBtn: {
    padding: 4,
  },
});
