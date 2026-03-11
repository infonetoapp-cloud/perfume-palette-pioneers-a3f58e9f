import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { CatalogMoney, CatalogProduct } from "@/lib/catalogData";
import { getAutoScentVariant, getAutoScentVariants, resolveAutoScentProduct } from "@/lib/autoScents";
import {
  addLineToShopifyCart,
  createShopifyCart,
  fetchShopifyCart,
  removeLineFromShopifyCart,
  updateShopifyCartLine,
} from "@/lib/shopify";
import { fetchLiveProductByHandle } from "@/stores/storefrontCatalogStore";

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
  giftSelectionSlug: string;
  managedGiftVariantId: string | null;
  isLoading: boolean;
  isSyncing: boolean;
  cartId: string | null;
  checkoutUrl: string | null;
  lineIds: Record<string, string>;
  addItem: (item: CartItem) => Promise<void>;
  updateQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  setPromoCode: (promoCode: string) => void;
  clearPromoCode: () => void;
  setGiftSelectionSlug: (giftSelectionSlug: string) => void;
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

function isLiveVariantId(variantId: string) {
  return variantId.startsWith("gid://shopify/ProductVariant/");
}

function isAutoScentItem(item: CartItem) {
  return (
    item.product.code === "AUTO-SCENT"
    || item.product.handle.toLowerCase().includes("auto-scent")
    || item.product.title.toLowerCase().includes("car air freshener")
  );
}

function inferAutoScentSlug(item: CartItem): string | null {
  const haystack = [item.variantTitle, ...item.selectedOptions.map((option) => option.value), item.product.title]
    .join(" ")
    .toLowerCase();

  return getAutoScentVariants().find(
    (variant) => haystack.includes(variant.name.toLowerCase()) || haystack.includes(variant.slug),
  )?.slug ?? null;
}

function getSyncableItems(items: CartItem[]) {
  return items.filter((item) => isLiveVariantId(item.variantId));
}

async function resolveLiveCartItem(item: CartItem): Promise<CartItem> {
  if (isLiveVariantId(item.variantId)) return item;

  const liveProduct = await fetchLiveProductByHandle(item.product.handle);
  if (!liveProduct || !isLiveVariantId(liveProduct.variant.id)) return item;

  return {
    ...item,
    product: liveProduct,
    variantId: liveProduct.variant.id,
    variantTitle: liveProduct.variant.title,
    price: liveProduct.variant.price,
    selectedOptions: liveProduct.variant.selectedOptions,
  };
}

async function buildManagedGiftItem(giftSelectionSlug: string): Promise<CartItem> {
  const autoScentVariant = getAutoScentVariant(giftSelectionSlug) ?? getAutoScentVariants()[0];
  const product = await resolveAutoScentProduct(autoScentVariant);

  return {
    product,
    variantId: product.variant.id,
    variantTitle: product.variant.title,
    price: product.variant.price,
    quantity: 1,
    selectedOptions: product.variant.selectedOptions,
  };
}

async function reconcileComplimentaryGift(
  items: CartItem[],
  giftSelectionSlug: string,
  managedGiftVariantId: string | null,
): Promise<{ items: CartItem[]; managedGiftVariantId: string | null }> {
  const perfumeCount = items.reduce((sum, item) => sum + (isAutoScentItem(item) ? 0 : item.quantity), 0);
  const autoScentItems = items.filter(isAutoScentItem);
  let nextItems = [...items];
  let nextManagedGiftVariantId = managedGiftVariantId;

  if (perfumeCount <= 0) {
    if (nextManagedGiftVariantId) {
      nextItems = nextItems.filter((item) => item.variantId !== nextManagedGiftVariantId);
      nextManagedGiftVariantId = null;
    }

    return { items: nextItems, managedGiftVariantId: nextManagedGiftVariantId };
  }

  const selectedVariant = getAutoScentVariant(giftSelectionSlug) ?? getAutoScentVariants()[0];
  const matchingPaidAutoScent = autoScentItems.find(
    (item) => item.variantId !== nextManagedGiftVariantId && inferAutoScentSlug(item) === selectedVariant.slug,
  );

  if (matchingPaidAutoScent) {
    if (nextManagedGiftVariantId) {
      nextItems = nextItems.filter((item) => item.variantId !== nextManagedGiftVariantId);
      nextManagedGiftVariantId = null;
    }

    return { items: nextItems, managedGiftVariantId: nextManagedGiftVariantId };
  }

  const currentManagedGift = nextManagedGiftVariantId
    ? nextItems.find((item) => item.variantId === nextManagedGiftVariantId) ?? null
    : null;

  if (currentManagedGift && inferAutoScentSlug(currentManagedGift) === selectedVariant.slug) {
    return { items: nextItems, managedGiftVariantId: nextManagedGiftVariantId };
  }

  if (nextManagedGiftVariantId) {
    nextItems = nextItems.filter((item) => item.variantId !== nextManagedGiftVariantId);
    nextManagedGiftVariantId = null;
  }

  const managedGiftItem = await buildManagedGiftItem(selectedVariant.slug);
  const existingSameVariant = nextItems.find((item) => item.variantId === managedGiftItem.variantId);

  if (existingSameVariant) {
    return { items: nextItems, managedGiftVariantId: null };
  }

  nextItems = [...nextItems, managedGiftItem];
  nextManagedGiftVariantId = managedGiftItem.variantId;

  return { items: nextItems, managedGiftVariantId: nextManagedGiftVariantId };
}

async function rebuildCartFromItems(items: CartItem[]) {
  const syncableItems = getSyncableItems(items);

  if (syncableItems.length === 0) {
    return {
      cartId: null,
      checkoutUrl: null,
      lineIds: {} as Record<string, string>,
      items,
    };
  }

  const firstItem = syncableItems[0];
  const createdCart = await createShopifyCart({
    variantId: firstItem.variantId,
    quantity: firstItem.quantity,
  });

  if (!createdCart) {
    return {
      cartId: null,
      checkoutUrl: null,
      lineIds: {} as Record<string, string>,
      items,
    };
  }

  const lineIds: Record<string, string> = {
    [firstItem.variantId]: createdCart.lineId,
  };

  for (const item of syncableItems.slice(1)) {
    const result = await addLineToShopifyCart(createdCart.cartId, {
      variantId: item.variantId,
      quantity: item.quantity,
    });

    if (result.success && result.lineId) {
      lineIds[item.variantId] = result.lineId;
    }
  }

  return {
    cartId: createdCart.cartId,
    checkoutUrl: createdCart.checkoutUrl,
    lineIds,
    items,
  };
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promoCode: "",
      giftSelectionSlug: "iris-flower",
      managedGiftVariantId: null,
      isLoading: false,
      isSyncing: false,
      cartId: null,
      checkoutUrl: null,
      lineIds: {},

      addItem: async (incomingItem) => {
        set({ isLoading: true });

        try {
          const item = await resolveLiveCartItem(incomingItem);
          const existingItem = get().items.find((entry) => entry.variantId === item.variantId);

          const nextItems = existingItem
            ? get().items.map((entry) =>
                entry.variantId === item.variantId
                  ? { ...entry, quantity: entry.quantity + item.quantity }
                  : entry,
              )
            : [...get().items, item];

          set({ items: nextItems });
          await get().syncCart();
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (variantId, quantity) => {
        set({ isLoading: true });

        try {
          const nextItems =
            quantity <= 0
              ? get().items.filter((item) => item.variantId !== variantId)
              : get().items.map((item) =>
                  item.variantId === variantId ? { ...item, quantity } : item,
                );

          set({ items: nextItems });
          await get().syncCart();
        } finally {
          set({ isLoading: false });
        }
      },

      removeItem: async (variantId) => {
        set({ isLoading: true });

        try {
          set({ items: get().items.filter((item) => item.variantId !== variantId) });
          await get().syncCart();
        } finally {
          set({ isLoading: false });
        }
      },

      setPromoCode: (promoCode) => set({ promoCode }),
      clearPromoCode: () => set({ promoCode: "" }),
      setGiftSelectionSlug: (giftSelectionSlug) => {
        set({ giftSelectionSlug });
        void get().syncCart();
      },
      clearCart: () => set({ items: [], cartId: null, checkoutUrl: null, lineIds: {}, managedGiftVariantId: null }),

      syncCart: async () => {
        if (get().isSyncing) return;

        set({ isSyncing: true });

        try {
          const resolvedItems = await Promise.all(get().items.map(resolveLiveCartItem));
          const cartChanged =
            resolvedItems.length !== get().items.length ||
            resolvedItems.some((item, index) => item.variantId !== get().items[index]?.variantId);

          if (cartChanged) {
            set({ items: resolvedItems });
          }

          const items = cartChanged ? resolvedItems : get().items;
          const reconciled = await reconcileComplimentaryGift(
            items,
            get().giftSelectionSlug,
            get().managedGiftVariantId,
          );
          const giftChanged =
            reconciled.managedGiftVariantId !== get().managedGiftVariantId
            || reconciled.items.length !== items.length
            || reconciled.items.some((item, index) => item.variantId !== items[index]?.variantId || item.quantity !== items[index]?.quantity);

          if (giftChanged) {
            set({
              items: reconciled.items,
              managedGiftVariantId: reconciled.managedGiftVariantId,
            });
          }

          const nextItems = giftChanged ? reconciled.items : items;

          if (nextItems.length === 0) {
            set({ cartId: null, checkoutUrl: null, lineIds: {}, managedGiftVariantId: null });
            return;
          }

          const syncableItems = getSyncableItems(nextItems);
          if (syncableItems.length === 0) {
            set({ cartId: null, checkoutUrl: null, lineIds: {} });
            return;
          }

          const currentCartId = get().cartId;
          if (!currentCartId) {
            const rebuilt = await rebuildCartFromItems(nextItems);
            set(rebuilt);
            return;
          }

          let cartExists = false;
          try {
            const cartResponse = await fetchShopifyCart(currentCartId);
            cartExists = !!cartResponse?.data?.cart?.id;
          } catch {
            cartExists = false;
          }

          if (!cartExists) {
            const rebuilt = await rebuildCartFromItems(nextItems);
            set(rebuilt);
            return;
          }

          const currentLineIds = { ...get().lineIds };
          const currentVariantIds = new Set(syncableItems.map((item) => item.variantId));

          for (const [variantId, lineId] of Object.entries(currentLineIds)) {
            if (!currentVariantIds.has(variantId)) {
              const removed = await removeLineFromShopifyCart(currentCartId, lineId);
              if (removed.success) {
                delete currentLineIds[variantId];
              } else if (removed.cartNotFound) {
                const rebuilt = await rebuildCartFromItems(nextItems);
                set(rebuilt);
                return;
              }
            }
          }

          for (const item of syncableItems) {
            const existingLineId = currentLineIds[item.variantId];

            if (!existingLineId) {
              const added = await addLineToShopifyCart(currentCartId, {
                variantId: item.variantId,
                quantity: item.quantity,
              });

              if (added.cartNotFound) {
                const rebuilt = await rebuildCartFromItems(nextItems);
                set(rebuilt);
                return;
              }

              if (added.success && added.lineId) {
                currentLineIds[item.variantId] = added.lineId;
              }
              continue;
            }

            const updated = await updateShopifyCartLine(currentCartId, existingLineId, item.quantity);
            if (updated.cartNotFound) {
              const rebuilt = await rebuildCartFromItems(nextItems);
              set(rebuilt);
              return;
            }
          }

          set({ lineIds: currentLineIds });
        } finally {
          set({ isSyncing: false });
        }
      },

      getCheckoutUrl: () => get().checkoutUrl,
    }),
    {
      name: "real-scents-shopify-cart-v1",
      storage: createJSONStorage(() => (typeof window === "undefined" ? memoryStorage : window.localStorage)),
      partialize: (state) => ({
        items: state.items,
        promoCode: state.promoCode,
        giftSelectionSlug: state.giftSelectionSlug,
        managedGiftVariantId: state.managedGiftVariantId,
        cartId: state.cartId,
        checkoutUrl: state.checkoutUrl,
        lineIds: state.lineIds,
      }),
    },
  ),
);
