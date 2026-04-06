import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { ProductImageSaleTag } from './ProductImageSaleTag';
import { styles } from '../../styles/ProductGridCard.styles';

export type ProductGridCardItem = {
  id: string;
  title: string;
  imageUrl: string;
  oldPrice: string;
  newPrice: string;
};

type Props = {
  item: ProductGridCardItem;
  width?: number | string;
  onPressCard?: () => void;
  onPressAdd?: () => void;
  onPressHeart?: () => void;
};

export function ProductGridCard({ item, width, onPressCard, onPressAdd, onPressHeart }: Props) {
  return (
    <Pressable style={[styles.card, width !== undefined ? { width } : { flex: 1 }]} onPress={onPressCard}>
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} contentFit="cover" />
        <Pressable
          style={styles.favoriteBtn}
          onPress={(event) => {
            event.stopPropagation();
            onPressHeart?.();
          }}
        >
          <Ionicons name="heart-outline" size={20} color={colors.headerBlue} />
        </Pressable>
        <Pressable
          style={styles.quickAddBtn}
          onPress={(event) => {
            event.stopPropagation();
            onPressAdd?.();
          }}
        >
          <Ionicons name="add" size={26} color={colors.white} />
        </Pressable>
        <ProductImageSaleTag visible={Boolean(item.oldPrice)} oldPrice={item.oldPrice} newPrice={item.newPrice} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.titleWrap}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.newPrice}>{item.newPrice}</Text>
          {item.oldPrice ? <Text style={styles.oldPrice}>{item.oldPrice}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}
