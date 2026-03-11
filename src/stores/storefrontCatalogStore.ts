import { useEffect, useMemo } from "react";
import { create } from "zustand";

import {
  PRODUCTS_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  storefrontApiRequest,
  type ShopifyProduct,
} from "@/lib/shopify";
import {
  getCatalogProductByHandle as getFallbackCatalogProductByHandle,
  getCatalogProducts as getFallbackCatalogProducts,
  type CatalogImage,
  type CatalogMoney,
  type CatalogProduct,
  type CatalogVariant,
} from "@/lib/catalogData";
import {
  getProductDisplayCopy,
  matchesCollection,
  sortProductsForCollection,
  type CollectionSlug,
} from "@/lib/catalog";
import { getProductMeta } from "@/lib/productMetadata";

type StorefrontCatalogState = {
  products: CatalogProduct[];
  isLoading: boolean;
  hasLoaded: boolean;
  error: string | null;
  loadProducts: () => Promise<void>;
  refreshProducts: () => Promise<void>;
};

const FALLBACK_PRODUCTS = getFallbackCatalogProducts();

function toMoney(amount: string, currencyCode = "USD"): CatalogMoney {
  return {
    amount,
    currencyCode: currencyCode === "USD" ? "USD" : "USD",
  };
}

function buildLiveImages(
  product: CatalogProduct,
  edges: ShopifyProduct["node"]["images"]["edges"],
): CatalogImage[] {
  const images = edges
    .map((edge, index) => ({
      url: edge.node.url,
      altText: edge.node.altText || product.images[index]?.altText || `${product.title} image ${index + 1}`,
      role: product.images[index]?.role || (index === 0 ? "hero" : `image-${index + 1}`),
    }))
    .filter((image) => !!image.url);

  return images.length > 0 ? images : product.images;
}

function buildLiveVariant(
  product: CatalogProduct,
  edges: ShopifyProduct["node"]["variants"]["edges"],
  fallbackPrice: CatalogMoney,
): CatalogVariant {
  const fallbackVariant = product.variant;
  const preferred = edges.find((edge) => edge.node.availableForSale) ?? edges[0];

  if (!preferred) {
    return {
      ...fallbackVariant,
      price: fallbackPrice,
      availableForSale: product.availableForSale,
    };
  }

  return {
    id: preferred.node.id,
    title: preferred.node.title || fallbackVariant.title,
    price: toMoney(preferred.node.price.amount, preferred.node.price.currencyCode),
    availableForSale: preferred.node.availableForSale,
    selectedOptions:
      preferred.node.selectedOptions.length > 0
        ? preferred.node.selectedOptions
        : fallbackVariant.selectedOptions,
  };
}

function mapShopifyNodeToCatalogProduct(node: ShopifyProduct["node"]): CatalogProduct | null {
  const fallbackProduct = getFallbackCatalogProductByHandle(node.handle);
  if (!fallbackProduct) return null;

  const fallbackPrice = toMoney(
    node.priceRange.minVariantPrice.amount || fallbackProduct.price.amount,
    node.priceRange.minVariantPrice.currencyCode || fallbackProduct.price.currencyCode,
  );
  const variant = buildLiveVariant(fallbackProduct, node.variants.edges, fallbackPrice);
  const availableForSale = node.variants.edges.some((edge) => edge.node.availableForSale) || variant.availableForSale;

  return {
    ...fallbackProduct,
    id: node.id,
    title: node.title || fallbackProduct.title,
    description: node.description || fallbackProduct.description,
    tags: node.tags?.length ? node.tags : fallbackProduct.tags,
    price: fallbackPrice,
    images: buildLiveImages(fallbackProduct, node.images.edges),
    variant,
    options:
      node.options.length > 0
        ? node.options.map((option) => ({ name: option.name, values: option.values }))
        : fallbackProduct.options,
    availableForSale,
  };
}

function mergeWithFallbackProducts(liveProducts: CatalogProduct[]): CatalogProduct[] {
  const liveByHandle = new Map(liveProducts.map((product) => [product.handle, product]));

  return FALLBACK_PRODUCTS.map((product) => liveByHandle.get(product.handle) ?? product);
}

function matchesStorefrontCollection(product: CatalogProduct, collection: CollectionSlug): boolean {
  if (collection === "all-perfumes") return true;

  const tags = new Set(product.tags.map((tag) => tag.toLowerCase()));
  if (collection === "women" || collection === "men") {
    return tags.has(collection);
  }

  if (collection === "best-sellers") {
    return tags.has("best-seller");
  }

  return tags.has(collection);
}

function searchProducts(products: CatalogProduct[], query: string, limit: number): CatalogProduct[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return [...products]
    .map((product) => {
      const copy = getProductDisplayCopy(product);
      const meta = getProductMeta(product.handle);
      const searchableNotes = meta
        ? [...meta.scentNotes.top, ...meta.scentNotes.middle, ...meta.scentNotes.base, ...meta.mainNotes.map((note) => note.name)]
        : [];

      let score = 0;
      const exactCode = product.code.toLowerCase() === normalizedQuery;
      const shortTitle = copy.shortTitle.toLowerCase();
      const fullTitle = copy.title.toLowerCase();
      const subtitle = copy.subtitle.toLowerCase();
      const description = copy.description.toLowerCase();
      const familyMatch = copy.familyLabels.some((label) => label.toLowerCase().includes(normalizedQuery));
      const noteMatch = searchableNotes.some((note) => note.toLowerCase().includes(normalizedQuery));

      if (exactCode) score += 120;
      if (shortTitle.startsWith(normalizedQuery)) score += 70;
      if (fullTitle.includes(normalizedQuery)) score += 55;
      if (subtitle.includes(normalizedQuery)) score += 35;
      if (familyMatch) score += 35;
      if (noteMatch) score += 30;
      if (description.includes(normalizedQuery)) score += 10;

      return { product, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.product.title.localeCompare(right.product.title);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}

function getRelatedProducts(products: CatalogProduct[], handle: string | undefined, limit: number): CatalogProduct[] {
  const currentProduct = products.find((product) => product.handle === handle);
  if (!currentProduct) return [];
  const currentMeta = getProductMeta(currentProduct.handle);

  return products
    .filter((product) => product.handle !== currentProduct.handle)
    .map((product) => {
      const meta = getProductMeta(product.handle);
      const sharedFamilyCount = currentMeta && meta
        ? meta.scentFamilies.filter((family) => currentMeta.scentFamilies.includes(family)).length
        : 0;
      const sharedMainNoteCount = currentMeta && meta
        ? meta.mainNotes.filter((note) => currentMeta.mainNotes.some((currentNote) => currentNote.name === note.name)).length
        : 0;

      let score = 0;
      if (product.gender === currentProduct.gender) score += 40;
      score += sharedFamilyCount * 35;
      score += sharedMainNoteCount * 10;
      if (currentMeta && meta && meta.intensity === currentMeta.intensity) score += 15;

      return { product, score };
    })
    .sort((left, right) => {
      if (right.score !== left.score) return right.score - left.score;
      return left.product.title.localeCompare(right.product.title);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}

export async function fetchLiveProductByHandle(handle: string): Promise<CatalogProduct | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    const node = data?.data?.productByHandle;
    return node ? mapShopifyNodeToCatalogProduct(node) : null;
  } catch {
    return null;
  }
}

export const useStorefrontCatalogStore = create<StorefrontCatalogState>((set, get) => ({
  products: FALLBACK_PRODUCTS,
  isLoading: false,
  hasLoaded: false,
  error: null,
  loadProducts: async () => {
    if (get().isLoading || get().hasLoaded) return;

    set({ isLoading: true, error: null });

    try {
      const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 100, query: "tag:all-perfumes" });
      const liveProducts = (data?.data?.products?.edges || [])
        .map((edge: ShopifyProduct) => mapShopifyNodeToCatalogProduct(edge.node))
        .filter(Boolean) as CatalogProduct[];

      if (liveProducts.length > 0) {
        set({
          products: mergeWithFallbackProducts(liveProducts),
          isLoading: false,
          hasLoaded: true,
          error: null,
        });
        return;
      }

      set({
        isLoading: false,
        hasLoaded: true,
        error: "No Shopify products were returned. Using local fallback catalog.",
      });
    } catch (error) {
      set({
        isLoading: false,
        hasLoaded: true,
        error: error instanceof Error ? error.message : "Failed to load Shopify products.",
      });
    }
  },
  refreshProducts: async () => {
    set({ hasLoaded: false });
    await get().loadProducts();
  },
}));

export function useStorefrontCatalog() {
  const products = useStorefrontCatalogStore((state) => state.products);
  const isLoading = useStorefrontCatalogStore((state) => state.isLoading);
  const hasLoaded = useStorefrontCatalogStore((state) => state.hasLoaded);
  const error = useStorefrontCatalogStore((state) => state.error);
  const loadProducts = useStorefrontCatalogStore((state) => state.loadProducts);

  useEffect(() => {
    if (!hasLoaded && !isLoading) {
      void loadProducts();
    }
  }, [hasLoaded, isLoading, loadProducts]);

  const getProductByHandle = useMemo(
    () => (handle: string | undefined) => {
      if (!handle) return null;
      return products.find((product) => product.handle === handle || product.aliases.includes(handle)) ?? null;
    },
    [products],
  );

  const getProductsForCollection = useMemo(
    () => (collection: CollectionSlug) => {
      const visibleProducts = products.filter((product) =>
        product.tags?.length
          ? matchesStorefrontCollection(product, collection)
          : matchesCollection(product.handle, collection),
      );
      return sortProductsForCollection(visibleProducts, collection);
    },
    [products],
  );

  const search = useMemo(() => (query: string, limit = 6) => searchProducts(products, query, limit), [products]);
  const getRelated = useMemo(
    () => (handle: string | undefined, limit = 4) => getRelatedProducts(products, handle, limit),
    [products],
  );

  return {
    products,
    isLoading,
    hasLoaded,
    error,
    getProductByHandle,
    getProductsForCollection,
    searchProducts: search,
    getRelatedProducts: getRelated,
  };
}
