import React, { useMemo, useState } from 'react';
import { Dimensions, View, Text, StyleSheet, Pressable } from 'react-native';
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
const COLUMNS_MAX = 4;
const TILE_W = CIRCLE + 6; // keeps 4 tiles fit on most phones
const OVERLAP_Y = CIRCLE / 2;
const ROW_GAP = 12;

function splitIntoRows<T>(items: T[], columns: number) {
  const first = items.slice(0, columns);
  const second = items.slice(columns, columns * 2);
  return [first, second] as const;
}

export function ShopByCategory({ title, categories }: Props) {
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});

  const { row1, row2 } = useMemo(() => {
    const availableW = SCREEN_W - 32; // matches paddingHorizontal
    const inferred = Math.floor(availableW / TILE_W);
    const cols = Math.max(2, Math.min(COLUMNS_MAX, inferred));
    const [r1, r2] = splitIntoRows(categories, cols);
    return { row1: r1, row2: r2 };
  }, [categories]);

  const bgTop = title ? OVERLAP_Y + 20 : OVERLAP_Y;

  return (
    <View style={styles.section}>
      {/* Transparent top so the hero image shows behind the overlapped first row */}
      <View style={[styles.bg, { top: bgTop }]} pointerEvents="none" />

      <View style={styles.content}>
        {title ? <Text style={styles.sectionTitle}>{title}</Text> : null}

        <View style={[styles.row, styles.firstRow]}>
          {row1.map((c) => (
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
          ))}
        </View>

        {row2.length > 0 ? (
          <View style={[styles.row, styles.secondRow]}>
            {row2.map((c) => (
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
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    position: 'relative',
    paddingBottom: 24,
  },
  bg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: OVERLAP_Y,
    bottom: 0,
    backgroundColor: colors.pageBg,
  },
  content: {
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginTop: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstRow: {
    marginTop: -OVERLAP_Y,
  },
  secondRow: {
    marginTop: ROW_GAP,
  },
  item: {
    width: TILE_W,
    alignItems: 'center',
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
