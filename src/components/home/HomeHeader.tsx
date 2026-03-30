import React from 'react';
import { Animated, View, Pressable, StyleSheet, Image, type ImageSourcePropType } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '../../theme/colors';
import { HomeSearchBar } from './HomeSearchBar';

const DEFAULT_LOGO = require('../../../assets/icon/likenti_logo_transparent_white.png');

type Props = {
  /** Override the default LikEnti lockup (icon + wordmark + tagline in one image). */
  logoSource?: ImageSourcePropType;
  onPressNotification?: () => void;
  searchPlaceholder?: string;
  onSearchChange?: (q: string) => void;
  onSearchPress?: () => void;
  scrollY?: Animated.Value;
};

export function HomeHeader({
  logoSource = DEFAULT_LOGO,
  onPressNotification,
  searchPlaceholder = 'Rechercher',
  onSearchChange,
  onSearchPress,
  scrollY,
}: Props) {
  const insets = useSafeAreaInsets();
  const animatedScrollY = scrollY ?? new Animated.Value(0);

  const topRowHeight = animatedScrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [56, 0],
    extrapolate: 'clamp',
  });
  const topRowMarginBottom = animatedScrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [12, 0],
    extrapolate: 'clamp',
  });
  const topRowOpacity = animatedScrollY.interpolate({
    inputRange: [0, 45, 70],
    outputRange: [1, 0.3, 0],
    extrapolate: 'clamp',
  });
  const topRowTranslateY = animatedScrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [0, -14],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.wrap, { paddingTop: Math.max(insets.top, 12) }]}>
      <Animated.View
        style={[
          styles.topRowContainer,
          {
            height: topRowHeight,
            marginBottom: topRowMarginBottom,
            opacity: topRowOpacity,
            transform: [{ translateY: topRowTranslateY }],
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={styles.logoBlock}>
            <Image source={logoSource} style={styles.logo} resizeMode="contain" />
          </View>
          <View style={styles.icons}>
            <Pressable onPress={onPressNotification} hitSlop={12} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={26} color={colors.white} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
      <HomeSearchBar
        placeholder={searchPlaceholder}
        onChangeText={onSearchChange}
        onFocus={onSearchPress}
        onPressSearch={onSearchPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.headerBlue,
    paddingHorizontal: 16,
    paddingBottom: 14,
  },
  topRowContainer: {
    overflow: 'hidden',
  },
  topRow: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoBlock: {
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  logo: {
    width: 168,
    height: 48,
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
