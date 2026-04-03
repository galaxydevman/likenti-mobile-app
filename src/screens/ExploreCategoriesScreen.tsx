import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { PRODUCT_CATEGORIES } from '../data/productCatalog';
import type { RootStackParamList } from '../navigation/types';
import { fetchStorefrontMainMenuCategories, type StorefrontMenuCategory } from '../services/shopify';
import { colors } from '../theme/colors';
import { useTheme } from '../theme/ThemeContext';
import { styles } from '../styles/ExploreCategoriesScreen.styles';

type Props = NativeStackScreenProps<RootStackParamList, 'ExploreCategories'>;

const FALLBACK: StorefrontMenuCategory[] = PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map(
  (c) => ({ id: c.id, title: c.title, imageUrl: c.imageUrl })
);

export default function ExploreCategoriesScreen({ navigation }: Props) {
  const { headerTheme } = useTheme();
  const [categories, setCategories] = useState<StorefrontMenuCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageFailed, setImageFailed] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const items = await fetchStorefrontMainMenuCategories();
        if (!alive) return;
        if (items.length > 0) {
          setCategories(items);
        } else {
          setCategories(FALLBACK);
        }
      } catch {
        if (alive) {
          setCategories(FALLBACK);
        }
      } finally {
        if (alive) {
          setLoading(false);
        }
      }
    };
    void load();
    return () => {
      alive = false;
    };
  }, []);

  const onPressCategory = useCallback(
    (item: StorefrontMenuCategory) => {
      navigation.navigate('ProductList', { categoryId: item.id, categoryTitle: item.title });
    },
    [navigation]
  );

  return (
    <View style={[styles.root, { backgroundColor: headerTheme.pageBackground ?? colors.pageBg }]}>
      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="small" color={colors.headerBlue} />
          <Text style={styles.loadingText}>Loading categories…</Text>
        </View>
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable style={styles.card} onPress={() => onPressCategory(item)}>
              <View style={styles.imageWrap}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.image}
                  contentFit="cover"
                  transition={150}
                  onError={() => setImageFailed((prev) => ({ ...prev, [item.id]: true }))}
                  onLoad={() =>
                    setImageFailed((prev) => {
                      if (!prev[item.id]) return prev;
                      const next = { ...prev };
                      delete next[item.id];
                      return next;
                    })
                  }
                />
                {imageFailed[item.id] ? (
                  <View style={styles.imagePlaceholder} pointerEvents="none">
                    <Ionicons name="image-outline" size={28} color={colors.textLabel} />
                  </View>
                ) : null}
              </View>
              <View style={styles.labelWrap}>
                <Text style={styles.label} numberOfLines={2}>
                  {item.title}
                </Text>
              </View>
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
