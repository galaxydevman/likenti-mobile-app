import { PlatformPressable } from '@react-navigation/elements';
import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { colors } from '../theme/colors';

/** Rounded tile like the reference (soft squircle). */
export const TAB_PILL_RADIUS = 12;

/**
 * Must match `tabBarActiveBackgroundColor` on the tab navigator (used only for focus detection).
 */
export const TAB_ACTIVE_BG = 'rgba(36, 114, 169, 0.08)';

export const TAB_ACTIVE_TINT = colors.headerBlueDeep;

export const TAB_INACTIVE_TINT = '#8e8e93';

/**
 * Selected state: stronger pale blue under the icon, fading to transparent toward the bottom
 * so the tile melts into the bar — no hard rim (reference-style wash).
 */
const SELECTED_FILL_GRADIENT = [
  'rgba(198, 226, 245, 0.58)',
  'rgba(228, 240, 250, 0.38)',
  'rgba(244, 248, 252, 0.14)',
  'rgba(255, 255, 255, 0)',
] as const;

const SELECTED_FILL_LOCATIONS = [0, 0.38, 0.72, 1] as const;

type Props = BottomTabBarButtonProps & { activeBackgroundColor: string };

const TAB_TIMING = {
  duration: 360,
  easing: Easing.bezier(0.33, 0, 0.2, 1),
  useNativeDriver: false,
} as const;

export function AnimatedTabBarButton({ activeBackgroundColor, style, children, ...rest }: Props) {
  const flat = StyleSheet.flatten(style) ?? {};
  const selected = flat.backgroundColor === activeBackgroundColor;
  const flex = typeof flat.flex === 'number' ? flat.flex : 1;

  const progress = useRef(new Animated.Value(selected ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      ...TAB_TIMING,
      toValue: selected ? 1 : 0,
    }).start();
  }, [selected, progress]);

  const washOpacity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <View
      style={{
        flex,
        marginHorizontal: 3,
        borderRadius: TAB_PILL_RADIUS,
        overflow: 'hidden',
      }}
    >
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFillObject,
          { borderRadius: TAB_PILL_RADIUS, opacity: washOpacity },
        ]}
      >
        <LinearGradient
          colors={[...SELECTED_FILL_GRADIENT]}
          locations={[...SELECTED_FILL_LOCATIONS]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          style={[StyleSheet.absoluteFillObject, { borderRadius: TAB_PILL_RADIUS }]}
        />
      </Animated.View>
      <PlatformPressable
        {...rest}
        style={[style, styles.pressableTransparent, { borderRadius: TAB_PILL_RADIUS }]}
      >
        {children}
      </PlatformPressable>
    </View>
  );
}

type TabLabelProps = {
  focused: boolean;
  children: React.ReactNode;
};

export function AnimatedTabLabel({ focused, children }: TabLabelProps) {
  const progress = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(progress, {
      ...TAB_TIMING,
      toValue: focused ? 1 : 0,
    }).start();
  }, [focused, progress]);

  const labelColor = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [TAB_INACTIVE_TINT, TAB_ACTIVE_TINT],
  });

  return (
    <Animated.Text style={[styles.tabLabel, { color: labelColor, fontWeight: focused ? '700' : '500' }]}>
      {children}
    </Animated.Text>
  );
}

const styles = StyleSheet.create({
  pressableTransparent: {
    backgroundColor: 'transparent',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 3,
  },
});
