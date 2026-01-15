'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  product_id: number;
  product_name: string;
  product_image?: string;
  price: number;
  quantity: number;
  sku: string;
  slug: string;
  stock_quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  getItemQuantity: (productId: number) => number;
  getItem: (productId: number) => CartItem | undefined;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existingItem = get().items.find((i) => i.product_id === item.product_id);
        if (existingItem) {
          // Check stock limit
          const newQuantity = existingItem.quantity + item.quantity;
          if (newQuantity > item.stock_quantity) {
            console.warn('Cannot add more items: stock limit reached');
            return;
          }
          set({
            items: get().items.map((i) =>
              i.product_id === item.product_id
                ? { ...i, quantity: newQuantity, stock_quantity: item.stock_quantity }
                : i
            ),
          });
        } else {
          // Validate initial quantity doesn't exceed stock
          if (item.quantity > item.stock_quantity) {
            console.warn('Cannot add items: exceeds stock quantity');
            return;
          }
          set({ items: [...get().items, item] });
        }
      },
      removeItem: (productId) => {
        set({ items: get().items.filter((i) => i.product_id !== productId) });
      },
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
        } else {
          const item = get().items.find((i) => i.product_id === productId);
          if (item && quantity > item.stock_quantity) {
            console.warn('Cannot update quantity: exceeds stock limit');
            return;
          }
          set({
            items: get().items.map((i) =>
              i.product_id === productId ? { ...i, quantity } : i
            ),
          });
        }
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },
      getItemQuantity: (productId) => {
        const item = get().items.find((i) => i.product_id === productId);
        return item ? item.quantity : 0;
      },
      getItem: (productId) => {
        return get().items.find((i) => i.product_id === productId);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);

