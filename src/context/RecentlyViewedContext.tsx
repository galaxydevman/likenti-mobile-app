import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ProductDetailProduct } from '../navigation/types';

const STORAGE_KEY = 'recentlyViewedProducts';
const MAX_ITEMS = 25;

type RecentlyViewedContextValue = {
  items: ProductDetailProduct[];
  addRecentlyViewed: (product: ProductDetailProduct) => void;
};

const RecentlyViewedContext = createContext<RecentlyViewedContextValue | null>(null);

export function RecentlyViewedProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ProductDetailProduct[]>([]);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive || !raw) return;
        const parsed = JSON.parse(raw) as unknown;
        if (!Array.isArray(parsed)) return;
        const next = parsed.filter(
          (row): row is ProductDetailProduct =>
            Boolean(row) && typeof row === 'object' && typeof (row as ProductDetailProduct).id === 'string',
        );
        setItems(next);
      } catch {
        /* ignore corrupt storage */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const addRecentlyViewed = useCallback((product: ProductDetailProduct) => {
    setItems((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      const next = [product, ...filtered].slice(0, MAX_ITEMS);
      void AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      addRecentlyViewed,
    }),
    [items, addRecentlyViewed],
  );

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>;
}

export function useRecentlyViewed(): RecentlyViewedContextValue {
  const ctx = useContext(RecentlyViewedContext);
  if (!ctx) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return ctx;
}
