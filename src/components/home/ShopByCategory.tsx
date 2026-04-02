import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { styles } from '../../styles/ShopByCategory.styles';

export type CategoryItem = {
  id: string;
  title: string;
  imageUrl: string;
  onPress?: () => void;
};

type Props = {
  title?: string;
  categories: CategoryItem[];
};

export function ShopByCategory({ title, categories }: Props) {
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});

  const columns = useMemo(() => {
    const pairs: Array<{ top: CategoryItem; bottom?: CategoryItem }> = [];
    for (let index = 0; index < categories.length; index += 2) {
      pairs.push({ top: categories[index], bottom: categories[index + 1] });
    }
    return pairs;
  }, [categories]);

  const bgTop = title ? 20 : 0;

  const renderTile = (c: CategoryItem) => (
    <Pressable key={c.id} style={styles.item} onPress={c.onPress}>
      <View style={styles.circle}>
        <Image
          source={{ uri: c.imageUrl }}
          style={styles.circleImage}
          contentFit="cover"
          transition={150}
          onError={() => setImageFailed((prev) => ({ ...prev, [c.id]: true }))}
          onLoad={() =>
            setImageFailed((prev) => {
              if (!prev[c.id]) return prev;
              const next = { ...prev };
              delete next[c.id];
              return next;
            })
          }
        />
        {imageFailed[c.id] ? (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={28} color={colors.textLabel} />
          </View>
        ) : null}
      </View>
      <Text style={styles.label} numberOfLines={2}>
        {c.title}
      </Text>
    </Pressable>
  );

  return (
    <View style={styles.section}>
      {/* Keep category grid fully visible below hero (no overlap clipping). */}
      <View style={[styles.bg, { top: bgTop }]} pointerEvents="none" />

      <View style={styles.content}>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          bounces={false}
          alwaysBounceHorizontal={false}
          overScrollMode="never"
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.columnsWrap}>
            {columns.map((column) => (
              <View key={column.top.id} style={styles.column}>
                {renderTile(column.top)}
                {column.bottom ? renderTile(column.bottom) : <View style={styles.itemSpacer} />}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
