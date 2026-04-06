import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { styles } from '../styles/LikdeekScreen.styles';
import { useTheme } from '../theme/ThemeContext';

const GIFT_IDEAS = [
  { id: 'g1', icon: 'sparkles-outline', title: 'Glow Beauty Set', subtitle: 'Makeup + skincare duo' },
  { id: 'g2', icon: 'flower-outline', title: 'Fresh Fragrance', subtitle: 'Elegant daily perfume' },
  { id: 'g3', icon: 'shirt-outline', title: 'Fashion Accessory', subtitle: 'Trendy style touch' },
  { id: 'g4', icon: 'heart-outline', title: 'Self-Care Box', subtitle: 'Calm and cozy picks' },
] as const;

export default function LikdeekScreen() {
  const { headerTheme } = useTheme();

  return (
    <ScrollView
      style={[styles.root, { backgroundColor: headerTheme.pageBackground }]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <LinearGradient
        colors={['#7c3aed', '#ec4899', '#fb7185']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroCard}
      >
        <View style={styles.heroTag}>
          <Text style={styles.heroTagText}>TODAY ONLY</Text>
        </View>
        <Text style={styles.heroTitle}>Today&apos;s Gift Collection</Text>
        <Text style={styles.heroSubtitle}>
          Discover beautiful, fashionable gifts curated for today. Limited picks, premium style, ready to send.
        </Text>
        <View style={styles.countdownRow}>
          <View style={styles.countdownChip}>
            <Text style={styles.countdownValue}>08</Text>
            <Text style={styles.countdownLabel}>hours</Text>
          </View>
          <View style={styles.countdownChip}>
            <Text style={styles.countdownValue}>47</Text>
            <Text style={styles.countdownLabel}>minutes</Text>
          </View>
          <View style={styles.countdownChip}>
            <Text style={styles.countdownValue}>22</Text>
            <Text style={styles.countdownLabel}>seconds</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gift Spotlight</Text>
          <Text style={styles.sectionMeta}>Editor&apos;s pick</Text>
        </View>
        <View style={styles.spotlightRow}>
          <View style={styles.spotlightIcon}>
            <Ionicons name="gift-outline" size={22} color="#4f46e5" />
          </View>
          <View style={styles.spotlightTextWrap}>
            <Text style={styles.spotlightTitle}>Midnight Glam Kit</Text>
            <Text style={styles.spotlightDesc}>
              A fashionable beauty bundle with soft glam tones and best-selling skin essentials.
            </Text>
          </View>
        </View>
        <View style={styles.ctaRow}>
          <Pressable style={styles.primaryBtn} accessibilityRole="button">
            <Text style={styles.primaryBtnText}>Get This Gift</Text>
          </Pressable>
          <Pressable style={styles.secondaryBtn} accessibilityRole="button">
            <Text style={styles.secondaryBtnText}>Save For Later</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Fashion Gift Ideas</Text>
          <Text style={styles.sectionMeta}>4 curated styles</Text>
        </View>
        <View style={styles.giftGrid}>
          {GIFT_IDEAS.map((item) => (
            <View key={item.id} style={styles.giftCard}>
              <Ionicons name={item.icon} size={20} color="#475569" />
              <Text style={styles.giftLabel}>{item.title}</Text>
              <Text style={styles.giftSub}>{item.subtitle}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.fashionNoteCard}>
        <Text style={styles.fashionNoteTitle}>Style Tip of the Day</Text>
        <Text style={styles.fashionNoteText}>
          Pair neutral tones with one bold accent item for a clean, modern look that works from day to night.
        </Text>
      </View>
    </ScrollView>
  );
}
