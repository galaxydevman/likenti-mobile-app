import React, { useMemo, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

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

const { width: SCREEN_W } = Dimensions.get('window');
const CIRCLE = 88;
const TILE_W = CIRCLE + 6; // keeps 4 tiles fit on most phones
const OVERLAP_Y = 0;
const ROW_GAP = 12;
const H_GAP = 12;

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

const styles = StyleSheet.create({
  section: {
    position: 'relative',
    zIndex: 20,
    elevation: 20,
    overflow: 'visible',
    paddingBottom: 24,
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: OVERLAP_Y,
    bottom: 0,
    backgroundColor: colors.pageBg,
    zIndex: 0,
  },
  content: {
    paddingHorizontal: 16,
    zIndex: 2,
    overflow: 'visible',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 14,
  },
  scrollContent: {
    paddingRight: Math.max(16, SCREEN_W - (TILE_W * 2 + H_GAP + 32)),
  },
  columnsWrap: {
    flexDirection: 'row',
    marginTop: 0,
    gap: H_GAP,
    zIndex: 3,
  },
  column: {
    width: TILE_W,
    gap: ROW_GAP,
  },
  item: {
    width: TILE_W,
    alignItems: 'center',
  },
  itemSpacer: {
    width: TILE_W,
    height: CIRCLE + ROW_GAP + 34,
  },
  circle: {
    width: CIRCLE,
    height: CIRCLE,
    borderRadius: CIRCLE / 2,
    backgroundColor: colors.categoryCircleBg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleImage: {
    width: CIRCLE - 8,
    height: CIRCLE - 8,
    borderRadius: (CIRCLE - 8) / 2,
  },
  imagePlaceholder: {
    position: 'absolute',
    width: CIRCLE - 8,
    height: CIRCLE - 8,
    borderRadius: (CIRCLE - 8) / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.04)',
  },
  label: {
    marginTop: 8,
    fontSize: 13,
    color: colors.textLabel,
    textAlign: 'center',
    fontWeight: '500',
  },
});
