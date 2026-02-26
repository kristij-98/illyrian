import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { CartItem, Product } from '../types';

type CartContextValue = {
  items: CartItem[];
  drawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
  addItem: (product: Product, variantTitle?: string) => void;
  removeItem: (handle: string) => void;
  updateQty: (handle: string, qty: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);
const KEY = 'illyrian-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product: Product, variantTitle?: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.handle === product.handle && item.variantTitle === variantTitle);
      if (existing) {
        return prev.map((item) =>
          item.handle === product.handle && item.variantTitle === variantTitle ? { ...item, qty: item.qty + 1 } : item
        );
      }
      return [
        ...prev,
        {
          handle: product.handle,
          title: product.title,
          price: product.price,
          qty: 1,
          image: product.featuredImage ?? product.images[0],
          variantTitle
        }
      ];
    });
    setDrawerOpen(true);
  };

  const removeItem = (handle: string) => setItems((prev) => prev.filter((item) => item.handle !== handle));
  const updateQty = (handle: string, qty: number) =>
    setItems((prev) => prev.map((item) => (item.handle === handle ? { ...item, qty: Math.max(1, qty) } : item)));

  const value = useMemo(
    () => ({ items, drawerOpen, setDrawerOpen, addItem, removeItem, updateQty }),
    [items, drawerOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart requires CartProvider');
  return ctx;
}
