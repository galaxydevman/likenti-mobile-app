import React, { useMemo } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme/colors';
import { ProductPromoCard, type ProductPromoCardItem } from '../products/ProductPromoCard';

export type TopPickProduct = ProductPromoCardItem;

type Props = {
  title?: string;
  products: TopPickProduct[];
  onPressAdd?: (item: TopPickProduct) => void;
};

const { width: SCREEN_W } = Dimensions.get('window');
const OUTER_PAD = 8;
const GAP = 10;

// Target: show ~2 cards fully and a 3rd partially on most phones.
// We intentionally size cards so that the remaining horizontal space reveals the next card.
const PARTIAL_VISIBLE_COUNT = 2.3;
const CARD_W = Math.max(
  150,
  Math.round((SCREEN_W - OUTER_PAD * 2 - GAP) / PARTIAL_VISIBLE_COUNT)
);
const CARD_H = 400;

export function TopPicksPanel({ title = 'Likenti Top Picks', products, onPressAdd }: Props) {
  const keyExtractor = useMemo(() => (item: TopPickProduct) => item.id, []);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>

      <FlatList
        data={products}
        keyExtractor={keyExtractor}
        renderItem={({ item, index }) => (
          <View style={{ marginRight: index === products.length - 1 ? 0 : GAP }}>
            <ProductPromoCard
              item={item}
              cardWidth={CARD_W}
              cardHeight={CARD_H}
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

const styles = StyleSheet.create({
  section: {
    marginTop: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  sectionTitle: {
    paddingHorizontal: 16,
    fontSize: 26,
    fontWeight: '400',
    color: colors.textDark,
    marginBottom: 10,
  },
});

