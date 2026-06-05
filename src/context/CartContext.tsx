import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import type { CartItem, Product } from '../types';

interface CartContextType {
  items: CartItem[];
  localItems: { product: Product; quantity: number }[];
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [localItems, setLocalItems] = useState<{ product: Product; quantity: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('rc_cart');
    if (stored) {
      try { setLocalItems(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    if (localItems.length > 0) {
      localStorage.setItem('rc_cart', JSON.stringify(localItems));
    } else {
      localStorage.removeItem('rc_cart');
    }
  }, [localItems]);

  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCartItems = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user.id);
    setItems(data ?? []);
    setLoading(false);
  };

  const addItem = async (product: Product, quantity = 1) => {
    if (user) {
      const existing = items.find(i => i.product_id === product.id);
      if (existing) {
        await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + quantity })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('cart_items')
          .insert({ user_id: user.id, product_id: product.id, quantity });
      }
      await fetchCartItems();
    } else {
      setLocalItems(prev => {
        const existing = prev.find(i => i.product.id === product.id);
        if (existing) {
          return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { product, quantity }];
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (user) {
      if (quantity <= 0) {
        await supabase.from('cart_items').delete().eq('id', itemId);
      } else {
        await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
      }
      await fetchCartItems();
    }
  };

  const removeItem = async (itemId: string) => {
    if (user) {
      await supabase.from('cart_items').delete().eq('id', itemId);
      await fetchCartItems();
    } else {
      setLocalItems(prev => prev.filter(i => i.product.id !== itemId));
    }
  };

  const clearCart = async () => {
    if (user) {
      await supabase.from('cart_items').delete().eq('user_id', user.id);
      setItems([]);
    } else {
      setLocalItems([]);
      localStorage.removeItem('rc_cart');
    }
  };

  const totalItems = user ? items.reduce((sum, i) => sum + i.quantity, 0) : localItems.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, localItems, loading, addItem, updateQuantity, removeItem, clearCart, totalItems }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
