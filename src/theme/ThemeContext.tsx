import React, { createContext, useContext, useMemo, type ReactNode } from 'react';
import { colors } from './colors';

type Theme = {
  colors: typeof colors;
};

const ThemeContext = createContext<Theme | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const value = useMemo(() => ({ colors }), []);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    return { colors };
  }
  return ctx;
}
