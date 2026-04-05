import React, { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export type CartLine = {
  id: string;
  /** Shopify ProductVariant GID; sent to Storefront checkout */
  merchandiseId?: string;
  title: string;
  variantTitle: string;
  imageUrl: string;
  unitPrice: number;
  compareAtPrice?: number;
  quantity: number;
  inventoryNote?: string;
};

export type AddCartItemInput = {
  id: string;
  merchandiseId?: string;
  title: string;
  variantTitle: string;
  imageUrl: string;
  unitPrice: number;
  compareAtPrice?: number;
  quantity?: number;
  inventoryNote?: string;
};

type CartContextValue = {
  items: CartLine[];
  lineCount: number;
  subtotal: number;
  compareAtSubtotal: number;
  savings: number;
  discountCode: string;
  discountAmount: number;
  shippingAmount: number;
  estimatedTax: number;
  total: number;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyDiscountCode: (code: string) => { ok: boolean; message: string };
};

const INITIAL_ITEMS: CartLine[] = [
  {
    id: 'tp2',
    title: 'Veet Wax Strips For Sensitive Skin 20 pcs',
    variantTitle: '20 strips',
    imageUrl: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80',
    unitPrice: 50.91,
    compareAtPrice: 24.96,
    quantity: 1,
    inventoryNote: 'Ships in 24 hours',
  },
  {
    id: 'tp4',
    title: 'Skincare Serum Vitamin C 30ml',
    variantTitle: '30ml',
    imageUrl: 'https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&auto=format&fit=crop&q=80',
    unitPrice: 34.8,
    compareAtPrice: 24.5,
    quantity: 2,
    inventoryNote: 'Limited stock',
  },
];

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartLine[]>(INITIAL_ITEMS);
  const [discountCode, setDiscountCode] = useState('');

  const subtotal = useMemo(
    () => items.reduce((sum, line) => sum + line.unitPrice * line.quantity, 0),
    [items]
  );
  const compareAtSubtotal = useMemo(
    () =>
      items.reduce(
        (sum, line) => sum + (line.compareAtPrice ?? line.unitPrice) * line.quantity,
        0
      ),
    [items]
  );
  const savings = Math.max(0, compareAtSubtotal - subtotal);
  const lineCount = items.reduce((count, line) => count + line.quantity, 0);
  const discountAmount = discountCode === 'WELCOME10' ? subtotal * 0.1 : 0;
  const shippingAmount = subtotal >= 99 ? 0 : 6.9;
  const estimatedTax = (subtotal - discountAmount) * 0.06;
  const total = subtotal - discountAmount + shippingAmount + estimatedTax;

  const addItem = (item: AddCartItemInput) => {
    const lineKey = item.merchandiseId ?? item.id;
    setItems((prev) => {
      const idx = prev.findIndex((line) => line.id === lineKey);
      if (idx === -1) {
        return [
          ...prev,
          {
            ...item,
            id: lineKey,
            quantity: Math.max(1, item.quantity ?? 1),
          },
        ];
      }
      return prev.map((line, index) =>
        index === idx
          ? { ...line, quantity: line.quantity + Math.max(1, item.quantity ?? 1) }
          : line
      );
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      setItems((prev) => prev.filter((line) => line.id !== id));
      return;
    }
    setItems((prev) =>
      prev.map((line) => (line.id === id ? { ...line, quantity: Math.floor(quantity) } : line))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((line) => line.id !== id));
  };

  const clearCart = () => {
    setItems([]);
  };

  const applyDiscountCode = (code: string) => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) {
      setDiscountCode('');
      return { ok: true, message: 'Discount removed.' };
    }
    if (normalized === 'WELCOME10') {
      setDiscountCode(normalized);
      return { ok: true, message: 'Promo applied: 10% off.' };
    }
    return { ok: false, message: 'Code not valid. Try WELCOME10.' };
  };

  const value = useMemo(
    () => ({
      items,
      lineCount,
      subtotal,
      compareAtSubtotal,
      savings,
      discountCode,
      discountAmount,
      shippingAmount,
      estimatedTax,
      total,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
      applyDiscountCode,
    }),
    [items, lineCount, subtotal, compareAtSubtotal, savings, discountCode, discountAmount, shippingAmount, estimatedTax, total]
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within CartProvider');
  }
  return ctx;
}
