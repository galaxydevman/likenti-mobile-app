import React, { useMemo } from 'react';
import { Dimensions, FlatList, StyleSheet, View } from 'react-native';
import { Image, type ImageSourcePropType } from 'expo-image';
import { colors } from '../../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
const OUTER_PAD = 8;
const GAP = 10;

// Target: show ~2 cards fully and a 3rd partially (similar intent to `TopPicksPanel`).
const PARTIAL_VISIBLE_COUNT = 2.3;

const CARD_W = Math.max(150, Math.round((SCREEN_W - OUTER_PAD * 2 - GAP) / PARTIAL_VISIBLE_COUNT));
const CARD_H = Math.round(CARD_W * 1.18);

export type ShopifyGridImageSlide = {
  id: string;
  /**
   * Provide either `imageAsset` (local `require(...)`) OR `imageUrl` (remote URL).
   */
  imageAsset?: ImageSourcePropType;
  imageUrl?: string;
};

type Props = {
  slides: ShopifyGridImageSlide[];
};

export function ShopifyGridImageSlider({ slides }: Props) {
  const data = useMemo(() => slides, [slides]);

  return (
    <View style={styles.wrap}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => {
          const source = item.imageAsset ? item.imageAsset : { uri: item.imageUrl ?? '' };
          return (
            <View style={{ marginRight: index === data.length - 1 ? 0 : GAP }}>
              <View style={styles.card}>
                <Image source={source} style={styles.image} contentFit="cover" />
              </View>
            </View>
          );
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: OUTER_PAD,
          paddingBottom: 18,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.pageBg,
    marginTop: 16,
    paddingTop: 6,
  },
  card: {
    width: CARD_W,
    height: CARD_H,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

