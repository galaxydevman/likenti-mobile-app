import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

type CartContextValue = {
  lineCount: number;
  setLineCount: (n: number) => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lineCount, setLineCount] = useState(0);
  const value = useMemo(() => ({ lineCount, setLineCount }), [lineCount]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
