import React, { useMemo } from 'react';
import { Platform, StyleSheet, Text, View, type ViewProps } from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';

/** Glossy pentagon badge art (black areas blended out via mixBlendMode where supported). */
const SALE_BADGE = require('../../../assets/sale-badge.png');

function parsePriceAmount(priceText: string): number {
  return Number.parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
}

function computePercentOff(oldPrice: string, newPrice: string): number {
  const oldVal = parsePriceAmount(oldPrice);
  const newVal = parsePriceAmount(newPrice);
  if (oldVal <= 0 || newVal >= oldVal) return 0;
  return Math.max(1, Math.round(((oldVal - newVal) / oldVal) * 100));
}

type Props = {
  visible: boolean;
  oldPrice: string;
  newPrice: string;
  scale?: number;
  /** Use `"none"` when the badge sits on a pressable image so taps still open the viewer. */
  pointerEvents?: ViewProps['pointerEvents'];
};

export function ProductImageSaleTag({
  visible,
  oldPrice,
  newPrice,
  scale = 1,
  pointerEvents = 'auto',
}: Props) {
  const pct = useMemo(() => computePercentOff(oldPrice, newPrice), [oldPrice, newPrice]);

  if (!visible || pct <= 0) return null;

  const W = Math.max(68, Math.round(80 * scale));
  /** Flush to top-left of the image area (bump up if the shadow gets clipped). */
  const offset = -10;
  const radius = Math.max(3, Math.round(4 * scale));
  const fontSize = Math.max(13, Math.min(22, Math.round(W * 0.2)));
  const padTop = Math.round(W * 0.22);
  const padBottom = Math.round(W * 0.34);

  const blendLayerStyle =
    Platform.OS === 'web'
      ? undefined
      : ({ mixBlendMode: 'lighten' as const } satisfies View['props']['style']);

  return (
    <View
      style={[styles.shadowWrap, { top: offset, left: offset, width: W, height: W }]}
      pointerEvents={pointerEvents}
    >
      <View style={[styles.blendClip, { width: W, height: W, borderRadius: radius }, blendLayerStyle]}>
        <Image
          source={SALE_BADGE}
          style={styles.badgeImage}
          contentFit="contain"
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
        />
      </View>
      <View
        style={[
          styles.textLayer,
          {
            width: W,
            height: W,
            paddingTop: padTop,
            paddingBottom: padBottom,
            paddingHorizontal: Math.round(W * 0.08),
          },
        ]}
        pointerEvents="none"
      >
        <Text
          style={[styles.offLabel, { fontSize }]}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.55}
        >
          {`${pct}%`}
          {'\n'}
          OFF
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shadowWrap: {
    position: 'absolute',
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 8,
  },
  blendClip: {
    overflow: 'hidden',
  },
  badgeImage: {
    width: '100%',
    height: '100%',
  },
  textLayer: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offLabel: {
    color: colors.white,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: 0.5,
    includeFontPadding: false,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    width: '100%',
  },
});
