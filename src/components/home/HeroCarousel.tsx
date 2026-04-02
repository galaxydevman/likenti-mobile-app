import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { styles, SLIDE_W, HERO_H } from '../../styles/HeroCarousel.styles';

export type HeroSlide = {
  id: string;
  imageUrl: string;
  title?: string;
  subtitle?: string;
  brandLabel?: string;
  ctaLabel?: string;
  onCtaPress?: () => void;
};

type Props = {
  slides: HeroSlide[];
};

export function HeroCarousel({ slides }: Props) {
  const [index, setIndex] = useState(0);
  const listRef = useRef<FlatList<HeroSlide>>(null);

  const onScroll = useCallback((e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const i = Math.round(x / SLIDE_W);
    if (i >= 0 && i < slides.length) setIndex(i);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % slides.length;
        listRef.current?.scrollToOffset({
          offset: next * SLIDE_W,
          animated: true,
        });
        return next;
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const renderItem = useCallback(
    ({ item }: { item: HeroSlide }) => (
      <View style={styles.slide}>
        <Image
          source={{ uri: item.imageUrl }}
          style={styles.slideImage}
          // contentFit="fill"
          contentFit="cover"
          transition={200}
        />
        {item.brandLabel || item.title || item.subtitle || item.ctaLabel ? (
          <View style={styles.slideOverlay} pointerEvents="box-none">
            {item.brandLabel ? (
              <View style={styles.brandPill}>
                <Text style={styles.brandText} numberOfLines={1}>
                  {item.brandLabel}
                </Text>
              </View>
            ) : null}
            {item.title ? <Text style={styles.title}>{item.title}</Text> : null}
            {item.subtitle ? (
              <Text style={styles.subtitle} numberOfLines={2}>
                {item.subtitle}
              </Text>
            ) : null}
            {item.ctaLabel ? (
              <Pressable
                style={styles.cta}
                onPress={item.onCtaPress}
                android_ripple={{ color: '#ddd' }}
              >
                <Text style={styles.ctaText}>{item.ctaLabel}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}
      </View>
    ),
    []
  );

  return (
    <View style={styles.wrap}>
      <FlatList
        ref={listRef}
        data={slides}
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
          {slides.map((s, i) => (
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
