import React, { useMemo } from 'react';
import { FlatList, Text, View } from 'react-native';
import { ProductGridCard, type ProductGridCardItem } from '../products/ProductGridCard';
import { styles, GAP, OUTER_PAD, CARD_W } from '../../styles/TopPicksPanel.styles';

export type TopPickProduct = ProductGridCardItem;

type Props = {
  title?: string;
  products: TopPickProduct[];
  onPressItem?: (item: TopPickProduct) => void;
  onPressAdd?: (item: TopPickProduct) => void;
};

export function TopPicksPanel({ title = 'Likenti Top Picks', products, onPressItem, onPressAdd }: Props) {
  const keyExtractor = useMemo(() => (item: TopPickProduct) => item.id, []);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <View style={{ marginRight: index === products.length - 1 ? 0 : GAP }}>
            <ProductGridCard
              item={item}
              width={CARD_W}
              onPressCard={() => onPressItem?.(item)}
              onPressAdd={() => onPressAdd?.(item)}
            />
          </View>
        )}
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

