import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { SEED_TEAS } from '@/data/products';
import { storage } from '@/utils/storage';
import { Tea } from '@/types';

const TEAS_KEY = 'steep_teas';
const CART_KEY = 'steep_cart';

interface CartContextValue {
  teas: Tea[];
  setTeas: (teas: Tea[]) => void;
  cart: Record<string, number>;
  addItem: (teaId: string, qty?: number) => void;
  removeItem: (teaId: string) => void;
  increment: (teaId: string) => void;
  decrement: (teaId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  shipping: number;
  total: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [teas, setTeasState] = useState<Tea[]>(SEED_TEAS);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      const [savedTeas, savedCart] = await Promise.all([
        storage.get<Tea[] | null>(TEAS_KEY, null),
        storage.get<Record<string, number>>(CART_KEY, {}),
      ]);
      if (savedTeas) setTeasState(savedTeas);
      setCart(savedCart);
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (hydrated) {
      storage.set(TEAS_KEY, teas);
    }
  }, [teas, hydrated]);

  useEffect(() => {
    if (hydrated) {
      storage.set(CART_KEY, cart);
    }
  }, [cart, hydrated]);

  const setTeas = (newTeas: Tea[]) => setTeasState(newTeas);

  const value = useMemo<CartContextValue>(() => {
    const entries = Object.entries(cart).filter(([, qty]) => qty > 0);
    const cartCount = entries.reduce((sum, [, qty]) => sum + qty, 0);
    const subtotal = entries.reduce((sum, [id, qty]) => {
      const tea = teas.find((t) => t.id === id);
      return sum + (tea ? tea.price * qty : 0);
    }, 0);
    const shipping = subtotal > 0 ? 4.5 : 0;

    return {
      teas,
      setTeas,
      cart,
      addItem: (teaId: string, qty = 1) =>
        setCart((prev) => ({
          ...prev,
          [teaId]: (prev[teaId] ?? 0) + qty,
        })),
      removeItem: (teaId: string) =>
        setCart((prev) => {
          const next = { ...prev };
          delete next[teaId];
          return next;
        }),
      increment: (teaId: string) =>
        setCart((prev) => ({
          ...prev,
          [teaId]: (prev[teaId] ?? 0) + 1,
        })),
      decrement: (teaId: string) =>
        setCart((prev) => {
          const current = prev[teaId] ?? 0;
          if (current <= 1) {
            const next = { ...prev };
            delete next[teaId];
            return next;
          }
          return { ...prev, [teaId]: current - 1 };
        }),
      clearCart: () => setCart({}),
      cartCount,
      subtotal,
      shipping,
      total: subtotal + shipping,
    };
  }, [teas, cart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
