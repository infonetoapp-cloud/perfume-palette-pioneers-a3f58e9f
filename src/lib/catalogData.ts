import {
  STOCKED_PRODUCT_CODES,
  getProductDisplayCopy,
  getStockPriority,
  matchesCollection,
  sortProductsForCollection,
  type CollectionSlug,
} from "@/lib/catalog";
import { getBaseFragrancePriceAmount } from "@/lib/promotions";
import { getProductMeta, type ProductMeta } from "@/lib/productMetadata";

export interface CatalogMoney {
  amount: string;
  currencyCode: "USD";
}

export interface CatalogImage {
  url: string;
  altText: string;
  role: string;
}

export interface CatalogVariant {
  id: string;
  title: string;
  price: CatalogMoney;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
}

export interface CatalogProduct {
  id: string;
  code: string;
  handle: string;
  aliases: string[];
  title: string;
  description: string;
  gender: Exclude<ProductMeta["gender"], "unisex">;
  price: CatalogMoney;
  images: CatalogImage[];
  variant: CatalogVariant;
  options: Array<{ name: string; values: string[] }>;
  availableForSale: boolean;
}

const PRODUCT_IMAGE_MODULES = import.meta.glob(
  [
    "../assets/products/e155/*.{png,jpg,jpeg,webp}",
    "../assets/products/e49/*.{png,jpg,jpeg,webp}",
    "../assets/products/e145/*.{png,jpg,jpeg,webp}",
    "../assets/products/e82/*.{png,jpg,jpeg,webp}",
    "../assets/products/e185/*.{png,jpg,jpeg,webp}",
    "../assets/products/e184/*.{png,jpg,jpeg,webp}",
    "../assets/products/e176/*.{png,jpg,jpeg,webp}",
    "../assets/products/e71/*.{png,jpg,jpeg,webp}",
    "../assets/products/e6/*.{png,jpg,jpeg,webp}",
    "../assets/products/e1/*.{png,jpg,jpeg,webp}",
    "../assets/products/b206/*.{png,jpg,jpeg,webp}",
    "../assets/products/b197/*.{png,jpg,jpeg,webp}",
    "../assets/products/b224/*.{png,jpg,jpeg,webp}",
    "../assets/products/b223/*.{png,jpg,jpeg,webp}",
    "../assets/products/b222/*.{png,jpg,jpeg,webp}",
    "../assets/products/b225/*.{png,jpg,jpeg,webp}",
  ],
  {
    eager: true,
    import: "default",
  },
) as Record<string, string>;

const PRODUCT_PRICE_USD: Record<(typeof STOCKED_PRODUCT_CODES)[number], string> = Object.fromEntries(
  STOCKED_PRODUCT_CODES.map((code) => [code, getBaseFragrancePriceAmount()]),
) as Record<(typeof STOCKED_PRODUCT_CODES)[number], string>;

const IMAGE_ROLE_PRIORITY: Record<string, number> = {
  hero: 0,
  bottle: 1,
  png: 2,
  detail: 3,
  lifestyle: 4,
  mood1: 5,
  mood2: 6,
};

function toMoney(amount: string): CatalogMoney {
  return { amount, currencyCode: "USD" };
}

function getGenderSegment(gender: CatalogProduct["gender"]): "womens" | "mens" {
  return gender === "women" ? "womens" : "mens";
}

function getGenderLabel(gender: CatalogProduct["gender"]): "Women's" | "Men's" {
  return gender === "women" ? "Women's" : "Men's";
}

function buildProductHandle(code: string, gender: CatalogProduct["gender"]): string {
  return `david-walker-${code}-${getGenderSegment(gender)}-eau-de-parfum-50ml`;
}

function buildProductAliases(code: string, gender: CatalogProduct["gender"]): string[] {
  const aliases = new Set<string>([
    code,
    `david-walker-${code}`,
    `david-walker-${code}-${getGenderSegment(gender)}`,
    buildProductHandle(code, gender),
  ]);

  if (code.startsWith("b")) {
    const legacyCode = `k${code.slice(1)}`;
    aliases.add(legacyCode);
    aliases.add(`david-walker-${legacyCode}`);
    aliases.add(`david-walker-${legacyCode}-${getGenderSegment(gender)}`);
    aliases.add(buildProductHandle(legacyCode, gender));
  }

  return Array.from(aliases);
}

function getImageRole(path: string, code: string): string {
  const normalizedPath = path.replace(/\\/g, "/");
  const filename = normalizedPath.split("/").pop()?.toLowerCase() ?? "";
  const extension = filename.split(".").pop()?.toLowerCase() ?? "";
  const basename = filename.replace(/\.(png|jpe?g|webp)$/i, "");
  if (basename === code) {
    return extension === "png" ? "png" : "image";
  }
  const role = basename.startsWith(`${code}-`) ? basename.slice(code.length + 1) : basename;
  return role || "image";
}

function formatImageAlt(title: string, role: string): string {
  const normalizedRole = role.toLowerCase();
  const roleLabels: Record<string, string> = {
    hero: "Hero image",
    bottle: "Bottle image",
    png: "Bottle image",
    detail: "Detail image",
    lifestyle: "Lifestyle image",
    mood1: "Mood image 1",
    mood2: "Mood image 2",
    image: "Product image",
  };
  const label = roleLabels[normalizedRole]
    ?? normalizedRole.replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
  return `${title} ${label}`.trim();
}

function buildImageMap(): Map<string, CatalogImage[]> {
  const imageMap = new Map<string, CatalogImage[]>();

  for (const [path, url] of Object.entries(PRODUCT_IMAGE_MODULES)) {
    const normalizedPath = path.replace(/\\/g, "/");
    const match = normalizedPath.match(/products\/([^/]+)\/([^/]+)$/);
    if (!match) continue;

    const [, code] = match;
    const images = imageMap.get(code) ?? [];
    images.push({
      url,
      role: getImageRole(normalizedPath, code),
      altText: "",
    });
    imageMap.set(code, images);
  }

  return imageMap;
}

const PRODUCT_IMAGES = buildImageMap();

function buildImages(code: string, title: string): CatalogImage[] {
  const images = PRODUCT_IMAGES.get(code) ?? [];

  return [...images]
    .sort((left, right) => {
      const leftPriority = IMAGE_ROLE_PRIORITY[left.role] ?? 99;
      const rightPriority = IMAGE_ROLE_PRIORITY[right.role] ?? 99;
      if (leftPriority !== rightPriority) return leftPriority - rightPriority;
      return left.url.localeCompare(right.url);
    })
    .map((image) => ({
      ...image,
      altText: formatImageAlt(title, image.role),
    }));
}

function buildCatalogProduct(code: (typeof STOCKED_PRODUCT_CODES)[number]): CatalogProduct {
  const meta = getProductMeta(code);
  if (!meta || meta.gender === "unisex") {
    throw new Error(`Missing metadata for stocked product ${code}`);
  }

  const title = `David Walker ${code.toUpperCase()} ${getGenderLabel(meta.gender)} Eau de Parfum 50ml`;
  const price = toMoney(PRODUCT_PRICE_USD[code]);
  const variant: CatalogVariant = {
    id: `variant-${code}-50ml`,
    title: "50ml / 1.7oz",
    price,
    availableForSale: true,
    selectedOptions: [{ name: "Size", value: "50ml / 1.7oz" }],
  };

  return {
    id: `product-${code}`,
    code: code.toUpperCase(),
    handle: buildProductHandle(code, meta.gender),
    aliases: buildProductAliases(code, meta.gender),
    title,
    description: meta.description,
    gender: meta.gender,
    price,
    images: buildImages(code, title),
    variant,
    options: [{ name: "Size", values: ["50ml / 1.7oz"] }],
    availableForSale: true,
  };
}

const CATALOG_PRODUCTS = STOCKED_PRODUCT_CODES.map(buildCatalogProduct);
const PRODUCT_LOOKUP = new Map<string, CatalogProduct>();

for (const product of CATALOG_PRODUCTS) {
  PRODUCT_LOOKUP.set(product.handle.toLowerCase(), product);
  for (const alias of product.aliases) {
    PRODUCT_LOOKUP.set(alias.toLowerCase(), product);
  }
}

export function getCatalogProducts(): CatalogProduct[] {
  return CATALOG_PRODUCTS;
}

export function getCatalogProductsForCollection(collection: CollectionSlug): CatalogProduct[] {
  const visibleProducts = CATALOG_PRODUCTS.filter((product) => matchesCollection(product.handle, collection));
  return sortProductsForCollection(visibleProducts, collection);
}

export function getCatalogProductByHandle(handle: string | undefined): CatalogProduct | null {
  if (!handle) return null;
  return PRODUCT_LOOKUP.get(handle.toLowerCase()) ?? null;
}

export function searchCatalogProducts(query: string, limit = 6): CatalogProduct[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  return [...CATALOG_PRODUCTS]
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

export function getRelatedCatalogProducts(handle: string | undefined, limit = 4): CatalogProduct[] {
  const currentProduct = getCatalogProductByHandle(handle);
  if (!currentProduct) return [];
  const currentMeta = getProductMeta(currentProduct.handle);

  return getCatalogProducts()
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
      return getStockPriority(left.product.handle) - getStockPriority(right.product.handle);
    })
    .slice(0, limit)
    .map((entry) => entry.product);
}
