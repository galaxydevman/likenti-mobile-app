import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, View } from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { styles, SLIDE_W } from '../../styles/PromoImageCarousel.styles';

const AUTO_SLIDE_MS = 3000;

export type PromoImageSlide = {
  id: string;
  /**
   * Provide either `imageAsset` (local `require(...)`) OR `imageUrl` (remote URL).
   * For the demo we use `imageAsset`.
   */
  imageAsset?: ImageSourcePropType;
  imageUrl?: string;
};

type Props = {
  slides: PromoImageSlide[];
  /**
   * Carousel height. The demo promo banners are typically shorter than the hero.
   */
  height?: number;
};

export function PromoImageCarousel({ slides, height = 220 }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<PromoImageSlide> | null>(null);
  const indexRef = useRef(index);

  const data = useMemo(() => slides, [slides]);

  const onScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const x = e.nativeEvent.contentOffset.x;
      const i = Math.round(x / SLIDE_W);
      if (i >= 0 && i < data.length) {
        indexRef.current = i;
        setIndex(i);
      }
    },
    [data.length]
  );

  useEffect(() => {
    indexRef.current = index;
  }, [index]);

  useEffect(() => {
    if (data.length <= 1) return;
    const t = setInterval(() => {
      const next = (indexRef.current + 1) % data.length;
      indexRef.current = next;
      setIndex(next);
      listRef.current?.scrollToIndex({ index: next, animated: true });
    }, AUTO_SLIDE_MS);
    return () => clearInterval(t);
  }, [data.length]);

  const renderItem = useCallback(
    ({ item }: { item: PromoImageSlide }) => {
      if (!item.imageAsset && !item.imageUrl) {
        return <View style={[styles.slide, { height, backgroundColor: 'rgba(0,0,0,0.05)' }]} />;
      }
      const source = item.imageAsset ? item.imageAsset : { uri: item.imageUrl ?? '' };
      return (
        <View style={[styles.slide, { height }]}>
          <Image
            source={source}
            style={[styles.slideImage, { height }]}
            contentFit="cover"
            transition={200}
          />
        </View>
      );
    },
    [height]
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        decelerationRate="fast"
        getItemLayout={(_, i) => ({
          length: SLIDE_W,
          offset: SLIDE_W * i,
          index: i,
        })}
      />
      <View style={styles.dotStrip} pointerEvents="none">
        <View style={styles.dots}>
          {data.map((s, i) => (
            <View
              key={s.id}
              style={[styles.dot, i === index ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

