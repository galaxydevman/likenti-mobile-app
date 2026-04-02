import React from 'react';
import { Animated, View, Pressable, Image, type ImageSourcePropType } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { HomeSearchBar } from './HomeSearchBar';
import { styles } from '../../styles/HomeHeader.styles';
import { useTheme } from '../../theme/ThemeContext';

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
  const { headerTheme, cycleHeaderTheme } = useTheme();
  const animatedScrollY = scrollY ?? new Animated.Value(0);

  const { headerForeground, accentColor, backgroundColor, gradientColors, logoTintColor } = headerTheme;

  const topRowHeight = animatedScrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [56, 0],
    extrapolate: 'clamp',
  });
  const topRowMarginBottom = animatedScrollY.interpolate({
    inputRange: [0, 70],
    outputRange: [10, 0],
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

  const paddingTop = Math.max(insets.top, 10);

  const inner = (
    <>
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
          <View style={[styles.topColSide, { alignItems: 'flex-start' }]}>
            <Pressable
              onPress={cycleHeaderTheme}
              hitSlop={12}
              style={[styles.themeBtn, { backgroundColor: `${headerForeground}18` }]}
              accessibilityRole="button"
              accessibilityLabel="Changer le thème de l’en-tête"
            >
              <Ionicons name="color-palette-outline" size={24} color={headerForeground} />
            </Pressable>
          </View>
          <View style={styles.topColCenter}>
            <Image
              source={logoSource}
              style={[styles.logo, logoTintColor && { tintColor: logoTintColor }]}
              resizeMode="contain"
            />
          </View>
          <View style={[styles.topColSide, { alignItems: 'flex-end' }]}>
            <Pressable onPress={onPressNotification} hitSlop={12} style={styles.iconBtn}>
              <Ionicons name="notifications-outline" size={26} color={headerForeground} />
            </Pressable>
          </View>
        </View>
      </Animated.View>
      <HomeSearchBar
        placeholder={searchPlaceholder}
        onChangeText={onSearchChange}
        onFocus={onSearchPress}
        onPressSearch={onSearchPress}
        accentColor={accentColor}
      />
    </>
  );

  if (gradientColors) {
    return (
      <LinearGradient
        colors={[gradientColors[0], gradientColors[1]]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[styles.wrap, { paddingTop }]}
      >
        {inner}
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.wrap, { paddingTop, backgroundColor: backgroundColor ?? '#1a2744' }]}>
      {inner}
    </View>
  );
}
