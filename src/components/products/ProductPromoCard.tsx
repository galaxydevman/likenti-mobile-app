import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export type ProductPromoCardItem = {
  id: string;
  title: string;
  imageUrl: string;
  saveLabel: string;
  oldPrice: string;
  newPrice: string;
  badgeLabel: string; // e.g. Express
  rating: number; // 0..5
};

type Props = {
  item: ProductPromoCardItem;
  cardWidth: number;
  cardHeight?: number; // default designed for 400px tall
  onPressHeart?: () => void;
  onPressAdd?: () => void;
};

export function ProductPromoCard({
  item,
  cardWidth,
  cardHeight = 400,
  onPressHeart,
  onPressAdd,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const scale = cardHeight / 400;
  const imageH = Math.round(185 * scale);
  const titleWrapH = Math.round(60 * scale);
  const savePillH = Math.round(32 * scale);

  return (
    <View style={[styles.card, { width: cardWidth, height: cardHeight }]}>
      <View style={[styles.imageArea, { height: imageH }]}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.productImage}
          contentFit="contain"
          onError={() => setImageFailed(true)}
        />

        {imageFailed ? (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={34} color={colors.headerBlue} />
          </View>
        ) : null}

        <Pressable
          style={[styles.heartCircle, { top: Math.round(12 * scale), right: Math.round(12 * scale) }]}
          hitSlop={10}
          onPress={onPressHeart}
        >
          <Ionicons name="heart-outline" size={18} color={colors.headerBlue} />
        </Pressable>

        <Pressable
          style={[
            styles.plusCircle,
            {
              right: Math.round(12 * scale),
              bottom: Math.round(18 * scale),
              width: Math.round(44 * scale),
              height: Math.round(44 * scale),
              borderRadius: Math.round(22 * scale),
            },
          ]}
          hitSlop={10}
          onPress={onPressAdd}
        >
          <Ionicons name="add" size={22} color={colors.white} />
        </Pressable>
      </View>

      <View style={[styles.savePill, { height: savePillH }]}>
        <Ionicons
          name="pricetag-outline"
          size={16}
          color={colors.white}
          style={{ marginRight: 8 }}
        />
        <Text style={styles.saveText} numberOfLines={1} ellipsizeMode="tail">
          {item.saveLabel}
        </Text>
      </View>

      <View style={[styles.titleWrap, { height: titleWrapH }]}>
        <Text style={styles.title} numberOfLines={3}>
          {item.title}
        </Text>
      </View>

      <View style={styles.priceRow}>
        <Text style={styles.oldPrice} numberOfLines={1}>
          {item.oldPrice}
        </Text>
        <Text style={styles.newPrice} numberOfLines={1}>
          {item.newPrice}
        </Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.badgePill}>
          <Ionicons name="car-outline" size={16} color={colors.white} style={{ marginRight: 8 }} />
          <Text style={styles.badgeText} numberOfLines={1}>
            {item.badgeLabel}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={14} color="#F59E0B" style={{ marginRight: 6 }} />
          <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.08)',
    paddingHorizontal: 14,
    paddingBottom: 14,
    overflow: 'hidden',
    justifyContent: 'flex-start',
  },
  imageArea: {
    marginTop: 0,
    borderRadius: 18,
    backgroundColor: 'rgba(15, 23, 42, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    width: '96%',
    height: '92%',
  },
  heartCircle: {
    position: 'absolute',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  plusCircle: {
    position: 'absolute',
    right: 12,
    bottom: 18,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.headerBlue,
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePill: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#E11D48',
    paddingHorizontal: 14,
    paddingVertical: 0,
    borderRadius: 999,
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
  },
  saveText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
    lineHeight: 16,
  },
  titleWrap: {
    marginTop: 10,
    color: colors.textDark,
  },
  title: {
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 20,
  },
  priceRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  oldPrice: {
    color: '#E11D48',
    fontWeight: '800',
    textDecorationLine: 'line-through',
    fontSize: 16,
  },
  newPrice: {
    color: '#E11D48',
    fontWeight: '900',
    fontSize: 20,
  },
  bottomRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgePill: {
    backgroundColor: '#2FB47C',
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontWeight: '800',
    fontSize: 14,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: colors.textLabel,
    fontWeight: '600',
    fontSize: 14,
  },
});

