import React from 'react';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { colors } from '../theme/colors';

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

export default function SearchScreen() {
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
