import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { styles } from '../../styles/ProductPromoCard.styles';

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
  onPressCard?: () => void;
  onPressHeart?: () => void;
  onPressAdd?: () => void;
};

export function ProductPromoCard({
  item,
  cardWidth,
  cardHeight = 400,
  onPressCard,
  onPressHeart,
  onPressAdd,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);
  const scale = cardHeight / 400;
  const imageH = Math.round(185 * scale);
  const titleWrapH = Math.round(60 * scale);
  const savePillH = Math.round(32 * scale);

  return (
    <Pressable style={[styles.card, { width: cardWidth, height: cardHeight }]} onPress={onPressCard}>
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
    </Pressable>
  );
}
