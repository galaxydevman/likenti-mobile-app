import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { colors } from './colors';
import {
  DEFAULT_HEADER_THEME_ID,
  HEADER_THEME_PRESETS,
  getHeaderThemeById,
  type HeaderThemePreset,
} from './headerThemes';

const STORAGE_KEY = 'likenti_header_theme_id';

type Theme = {
  colors: typeof colors;
  headerTheme: HeaderThemePreset;
  cycleHeaderTheme: () => void;
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [headerThemeId, setHeaderThemeId] = useState(DEFAULT_HEADER_THEME_ID);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!alive || !stored) return;
        if (HEADER_THEME_PRESETS.some((p) => p.id === stored)) {
          setHeaderThemeId(stored);
        }
      } catch {
        /* keep default */
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const headerTheme = useMemo(() => getHeaderThemeById(headerThemeId), [headerThemeId]);

  const cycleHeaderTheme = useCallback(() => {
    const idx = HEADER_THEME_PRESETS.findIndex((p) => p.id === headerThemeId);
    const next = HEADER_THEME_PRESETS[(idx + 1) % HEADER_THEME_PRESETS.length];
    setHeaderThemeId(next.id);
    void AsyncStorage.setItem(STORAGE_KEY, next.id);
  }, [headerThemeId]);

  const value = useMemo(
    () => ({
      colors,
      headerTheme,
      cycleHeaderTheme,
    }),
    [headerTheme, cycleHeaderTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return {
      colors,
      headerTheme: getHeaderThemeById(DEFAULT_HEADER_THEME_ID),
      cycleHeaderTheme: () => {},
    };
  }
  return ctx;
}
