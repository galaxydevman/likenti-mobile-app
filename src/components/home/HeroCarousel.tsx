import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  Pressable,
} from 'react-native';
import { Image } from 'expo-image';
import { colors } from '../../theme/colors';

const { width: SCREEN_W } = Dimensions.get('window');
const SLIDE_W = SCREEN_W;
const HERO_H = 300;

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

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.pageBg,
  },
  slide: {
    width: SLIDE_W,
    height: HERO_H,
    position: 'relative',
  },
  slideImage: {
    width: '100%',
    height: '100%',
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  brandPill: {
    backgroundColor: 'rgba(236, 72, 153, 0.95)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    maxWidth: '70%',
  },
  brandText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  cta: {
    marginTop: 10,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ctaText: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
  },
  title: {
    marginTop: 10,
    color: colors.white,
    fontSize: 24,
    fontWeight: '700',
    maxWidth: '75%',
  },
  subtitle: {
    marginTop: 8,
    color: colors.white,
    fontSize: 14,
    maxWidth: '75%',
  },
  dotStrip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: 10,
    paddingTop: 16,
    backgroundColor: 'rgba(0,0,0,0.28)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    height: 4,
    borderRadius: 2,
  },
  dotActive: {
    width: 28,
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  dotInactive: {
    width: 18,
    backgroundColor: 'rgba(200,200,200,0.55)',
  },
});
