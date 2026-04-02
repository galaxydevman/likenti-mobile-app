import React, { useCallback, useLayoutEffect, useRef } from 'react';
import { InteractionManager, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { HomeSearchBar } from '../components/home/HomeSearchBar';
import type { RootStackParamList } from '../navigation/types';

const TRENDING_KEYWORDS = [
  'Vitamin C',
  'Sunscreen',
  'Hair Serum',
  'Body Lotion',
  'Face Wash',
  'Lip Balm',
  'Perfume',
  'Makeup',
];

const TRENDING_CATEGORIES = [
  'Skincare',
  'Hair Care',
  'Bath & Body',
  'Makeup',
  'Fragrance',
  'Supplements',
];

type Props = NativeStackScreenProps<RootStackParamList, 'Search'>;

export default function SearchScreen({ navigation }: Props) {
  const searchInputRef = useRef<TextInput>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: '',
      headerTitle: () => (
        <View style={styles.headerSearchWrap}>
          <HomeSearchBar
            placeholder="Search"
            inputRef={searchInputRef}
            showFavouriteButton={false}
            showQrScannerButton={false}
            autoFocus
          />
        </View>
      ),
    });
  }, [navigation]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      const task = InteractionManager.runAfterInteractions(() => {
        const tryFocus = () => {
          if (cancelled) return;
          searchInputRef.current?.focus();
        };
        requestAnimationFrame(() => {
          tryFocus();
          setTimeout(tryFocus, 100);
        });
      });
      return () => {
        cancelled = true;
        if (typeof task === 'object' && task !== null && 'cancel' in task) {
          (task as { cancel: () => void }).cancel();
        }
      };
    }, [])
  );

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Keywords</Text>
        <View style={styles.keywordsWrap}>
          {TRENDING_KEYWORDS.map((keyword) => (
            <Pressable key={keyword} style={styles.keywordChip}>
              <Text style={styles.keywordText}>{keyword}</Text>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Categories</Text>
        <View style={styles.categoriesList}>
          {TRENDING_CATEGORIES.map((category) => (
            <Pressable key={category} style={styles.categoryCard}>
              <Text style={styles.categoryText}>{category}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.pageBg,
  },
  headerSearchWrap: {
    flex: 1,
    minWidth: 240,
    paddingRight: 4,
  },
  content: {
    padding: 16,
    gap: 24,
    paddingBottom: 32,
  },
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textDark,
  },
  keywordsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  keywordChip: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  keywordText: {
    fontSize: 14,
    color: colors.textDark,
    fontWeight: '500',
  },
  categoriesList: {
    gap: 10,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryText: {
    fontSize: 16,
    color: colors.textDark,
    fontWeight: '600',
  },
});
