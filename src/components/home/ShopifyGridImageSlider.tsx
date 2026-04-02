import React, { useMemo } from 'react';
import { FlatList, View } from 'react-native';
import { Image, type ImageSourcePropType } from 'expo-image';
import { styles, OUTER_PAD, GAP } from '../../styles/ShopifyGridImageSlider.styles';

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

