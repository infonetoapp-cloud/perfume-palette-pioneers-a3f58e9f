import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CatalogProduct, CatalogMoney } from "@/lib/catalogData";

export interface CartItem {
  product: CatalogProduct;
  variantId: string;
  variantTitle: string;
  price: CatalogMoney;
  quantity: number;
  selectedOptions: Array<{ name: string; value: string }>;
}

interface CartStore {
  items: CartItem[];
  promoCode: string;
  isLoading: boolean;
  isSyncing: boolean;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  setPromoCode: (promoCode: string) => void;
  clearPromoCode: () => void;
  clearCart: () => void;
  syncCart: () => Promise<void>;
  getCheckoutUrl: () => string | null;
}

const memoryStorage: Storage = {
  getItem: () => null,
  setItem: () => undefined,
  removeItem: () => undefined,
  clear: () => undefined,
  key: () => null,
  length: 0,
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      isLoading: false,
      isSyncing: false,

      addItem: async (item) => {
        set({ isLoading: true });

        try {
          const existingItem = get().items.find((entry) => entry.variantId === item.variantId);
          if (existingItem) {
            set({
              items: get().items.map((entry) =>
                entry.variantId === item.variantId
                  ? { ...entry, quantity: entry.quantity + item.quantity }
                  : entry,
              ),
            });
            return;
          }

          set({ items: [...get().items, item] });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        set({ isLoading: true });

        try {
          if (quantity <= 0) {
            set({ items: get().items.filter((item) => item.variantId !== variantId) });
            return;
          }

          set({
            items: get().items.map((item) =>
              item.variantId === variantId ? { ...item, quantity } : item,
            ),
          });
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        set({ isLoading: true });

        try {
          set({ items: get().items.filter((item) => item.variantId !== variantId) });
        } finally {
          set({ isLoading: false });
        }
      },

      setPromoCode: (promoCode) => set({ promoCode }),
      clearPromoCode: () => set({ promoCode: "" }),
      clearCart: () => set({ items: [] }),
      syncCart: async () => undefined,
      getCheckoutUrl: () => null,
    }),
    {
      name: "david-walker-local-cart-v1",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : window.localStorage)),
      partialize: (state) => ({ items: state.items, promoCode: state.promoCode }),
    },
  ),
);
