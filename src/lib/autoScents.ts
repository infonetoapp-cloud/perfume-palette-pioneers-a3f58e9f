import type { CatalogImage, CatalogProduct, CatalogVariant } from "@/lib/catalogData";
import { PRODUCT_BY_HANDLE_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";

export interface AutoScentImageSet {
  hero: string;
  detail: string;
  lifestyle: string;
}

export interface AutoScentVariant {
  slug: "iris-flower" | "melon" | "oud";
  name: string;
  title: string;
  eyebrow: string;
  tagline: string;
  shortDescription: string;
  description: string;
  metaDescription: string;
  bestFor: string;
  mood: string;
  scentProfile: string[];
  notePyramid: {
    top: string[];
    middle: string[];
    base: string[];
  };
  images: AutoScentImageSet;
  priceUsd: number;
  recommendedPerfumeHandles: string[];
  theme: {
    accent: string;
    tint: string;
    glow: string;
  };
}

const AUTO_SCENT_BASE_PATH = "/shopify-sync/products/auto-scent";
const AUTO_SCENT_SHOPIFY_HANDLE_CANDIDATES = [
  "david-walker-auto-scent",
  "auto-scent",
  "david-walker-car-scent",
  "david-walker-car-scents",
  "david-walker-auto-scent-car-air-freshener",
] as const;

export const AUTO_SCENT_VARIANTS: AutoScentVariant[] = [
  {
    slug: "iris-flower",
    name: "Iris Flower",
    title: "David Walker Auto Scent Iris Flower Car Air Freshener",
    eyebrow: "Auto Scent",
    tagline: "Soft, polished, and quietly luxurious inside the cabin.",
    shortDescription:
      "A clean floral car scent with airy iris character, soft powdery warmth, and a smooth upscale finish for daily driving.",
    description:
      "Soft, polished, and quietly luxurious. Iris Flower opens with a clean floral brightness that feels airy rather than sweet, then settles into a smooth powdery heart with a calm musky finish. It gives the cabin a refined just-detailed feel without becoming sharp or overwhelming. A premium hanging car scent for drivers who want the interior to feel clean, elevated, and modern.",
    metaDescription:
      "Shop David Walker Auto Scent Iris Flower, a premium hanging car air freshener with a soft floral, powdery-clean profile. Sold separately for $25.",
    bestFor: "Daily commuting, clean interiors, polished SUVs and sedans, and drivers who want a softer floral atmosphere.",
    mood: "Elegant, airy, calm, and freshly detailed.",
    scentProfile: ["Floral", "Powdery", "Clean Musk"],
    notePyramid: {
      top: ["Iris Petal", "Soft Violet", "Clean Air Accord"],
      middle: ["Powdery Florals", "Light Cotton Musk", "Pearl Accord"],
      base: ["White Woods", "Smooth Musk", "Dry Soft Amber"],
    },
    images: {
      hero: `${AUTO_SCENT_BASE_PATH}/iris-flower/hero.jpg`,
      detail: `${AUTO_SCENT_BASE_PATH}/iris-flower/detail.jpg`,
      lifestyle: `${AUTO_SCENT_BASE_PATH}/iris-flower/lifestyle.jpg`,
    },
    priceUsd: 25,
    recommendedPerfumeHandles: [
      "david-walker-b224-womens-eau-de-parfum-50ml",
      "david-walker-b223-womens-eau-de-parfum-50ml",
      "david-walker-b225-womens-eau-de-parfum-50ml",
      "david-walker-b206-womens-eau-de-parfum-50ml",
      "david-walker-b197-womens-eau-de-parfum-50ml",
      "david-walker-b222-womens-eau-de-parfum-50ml",
      "david-walker-e145-mens-eau-de-parfum-50ml",
      "david-walker-e71-mens-eau-de-parfum-50ml",
    ],
    theme: {
      accent: "text-[#8f74d6]",
      tint: "from-[#f4efff] via-[#ede6ff] to-[#f7f3ff]",
      glow: "bg-[#8f74d6]/10",
    },
  },
  {
    slug: "melon",
    name: "Melon",
    title: "David Walker Auto Scent Melon Car Air Freshener",
    eyebrow: "Auto Scent",
    tagline: "Bright, juicy, and clean with an easy warm-weather lift.",
    shortDescription:
      "A fresh melon car scent with watery green brightness and a crisp clean finish that keeps the interior feeling open and upbeat.",
    description:
      "Bright, juicy, and easy to like. Melon brings a crisp fresh-fruit opening with watery green lift, then settles into a clean airy trail that makes the car feel lighter and more refreshed. It reads modern rather than candy-sweet, with a smooth finish that works especially well in warm weather and everyday city driving. A premium hanging car scent for shoppers who want freshness with a clear, cheerful identity.",
    metaDescription:
      "Shop David Walker Auto Scent Melon, a premium hanging car air freshener with a bright watery-fresh profile. Sold separately for $25.",
    bestFor: "Daytime driving, spring and summer use, rideshare-ready interiors, and customers who prefer fresh fruity scents.",
    mood: "Fresh, optimistic, airy, and clean.",
    scentProfile: ["Fresh", "Fruity", "Watery Green"],
    notePyramid: {
      top: ["Fresh Melon", "Green Pear", "Watery Accord"],
      middle: ["Cucumber Water", "Soft Citrus Peel", "Clean Green Notes"],
      base: ["White Musk", "Light Woods", "Airy Dry-Down"],
    },
    images: {
      hero: `${AUTO_SCENT_BASE_PATH}/melon/hero.jpg`,
      detail: `${AUTO_SCENT_BASE_PATH}/melon/detail.jpg`,
      lifestyle: `${AUTO_SCENT_BASE_PATH}/melon/lifestyle.jpg`,
    },
    priceUsd: 25,
    recommendedPerfumeHandles: [
      "david-walker-e82-mens-eau-de-parfum-50ml",
      "david-walker-e176-mens-eau-de-parfum-50ml",
      "david-walker-e1-mens-eau-de-parfum-50ml",
      "david-walker-b224-womens-eau-de-parfum-50ml",
      "david-walker-e155-mens-eau-de-parfum-50ml",
      "david-walker-e71-mens-eau-de-parfum-50ml",
      "david-walker-b223-womens-eau-de-parfum-50ml",
      "david-walker-b222-womens-eau-de-parfum-50ml",
    ],
    theme: {
      accent: "text-[#6da756]",
      tint: "from-[#eef8dd] via-[#f7f7dd] to-[#fff0d8]",
      glow: "bg-[#6da756]/10",
    },
  },
  {
    slug: "oud",
    name: "Oud",
    title: "David Walker Auto Scent Oud Car Air Freshener",
    eyebrow: "Auto Scent",
    tagline: "Dark, smooth, and richer for a more dressed-up cabin feel.",
    shortDescription:
      "A premium oud-inspired car scent with dry woods, warm amber depth, and a smooth luxurious finish for darker interiors.",
    description:
      "Dark, smooth, and more luxurious from the first impression. Oud brings dry woods, warm resinous depth, and a softly smoky finish that makes the cabin feel richer and more tailored. It is styled to feel premium and refined rather than harsh or overly heavy, giving the interior a darker upscale atmosphere. A premium hanging car scent for drivers who prefer woody warmth over bright freshness.",
    metaDescription:
      "Shop David Walker Auto Scent Oud, a premium hanging car air freshener with warm woody depth and a refined luxury profile. Sold separately for $25.",
    bestFor: "Night driving, darker leather interiors, luxury sedans, and customers who prefer warm woody depth.",
    mood: "Rich, tailored, warm, and quietly powerful.",
    scentProfile: ["Woody", "Amber", "Smoky Warm"],
    notePyramid: {
      top: ["Dry Woods", "Saffron Glow", "Warm Spice"],
      middle: ["Oud Accord", "Amber Resin", "Soft Smoke"],
      base: ["Dark Woods", "Velvet Musk", "Smooth Balsamic Warmth"],
    },
    images: {
      hero: `${AUTO_SCENT_BASE_PATH}/oud/hero.jpg`,
      detail: `${AUTO_SCENT_BASE_PATH}/oud/detail.jpg`,
      lifestyle: `${AUTO_SCENT_BASE_PATH}/oud/lifestyle.jpg`,
    },
    priceUsd: 25,
    recommendedPerfumeHandles: [
      "david-walker-e49-mens-eau-de-parfum-50ml",
      "david-walker-e184-mens-eau-de-parfum-50ml",
      "david-walker-e185-mens-eau-de-parfum-50ml",
      "david-walker-b197-womens-eau-de-parfum-50ml",
      "david-walker-e145-mens-eau-de-parfum-50ml",
      "david-walker-e6-mens-eau-de-parfum-50ml",
      "david-walker-b206-womens-eau-de-parfum-50ml",
      "david-walker-b225-womens-eau-de-parfum-50ml",
    ],
    theme: {
      accent: "text-[#b26f2e]",
      tint: "from-[#211611] via-[#2a1d16] to-[#3a271b]",
      glow: "bg-[#b26f2e]/10",
    },
  },
];

const AUTO_SCENT_LOOKUP = new Map(
  AUTO_SCENT_VARIANTS.map((variant) => [variant.slug, variant]),
);

export function getAutoScentVariants() {
  return AUTO_SCENT_VARIANTS;
}

export function getAutoScentVariant(slug: string | undefined) {
  if (!slug) return null;
  return AUTO_SCENT_LOOKUP.get(slug) ?? null;
}

function toCatalogImages(node: ShopifyProduct["node"]): CatalogImage[] {
  return node.images.edges.map((edge, index) => ({
    url: edge.node.url,
    altText: edge.node.altText || `${node.title} image ${index + 1}`,
    role: index === 0 ? "hero" : `image-${index + 1}`,
  }));
}

function toCatalogVariant(node: ShopifyProduct["node"], matchedVariant: ShopifyProduct["node"]["variants"]["edges"][number]["node"]): CatalogVariant {
  return {
    id: matchedVariant.id,
    title: matchedVariant.title,
    price: {
      amount: matchedVariant.price.amount,
      currencyCode: "USD",
    },
    availableForSale: matchedVariant.availableForSale,
    selectedOptions: matchedVariant.selectedOptions,
  };
}

function matchShopifyVariant(
  node: ShopifyProduct["node"],
  autoScentVariant: AutoScentVariant,
) {
  const normalizedName = autoScentVariant.name.toLowerCase();

  return (
    node.variants.edges.find((edge) =>
      edge.node.selectedOptions.some((option) => option.value.toLowerCase() === normalizedName),
    )?.node
    ?? node.variants.edges.find((edge) => edge.node.title.toLowerCase().includes(normalizedName))?.node
    ?? null
  );
}

function toCatalogProduct(node: ShopifyProduct["node"], matchedVariant: ShopifyProduct["node"]["variants"]["edges"][number]["node"]): CatalogProduct {
  return {
    id: node.id,
    code: "AUTO-SCENT",
    handle: node.handle,
    aliases: [...AUTO_SCENT_SHOPIFY_HANDLE_CANDIDATES],
    title: node.title,
    description: node.description,
    gender: "women",
    tags: node.tags,
    price: {
      amount: matchedVariant.price.amount,
      currencyCode: "USD",
    },
    images: toCatalogImages(node),
    variant: toCatalogVariant(node, matchedVariant),
    options: node.options.map((option) => ({ name: option.name, values: option.values })),
    availableForSale: matchedVariant.availableForSale,
  };
}

export function buildFallbackAutoScentProduct(autoScentVariant: AutoScentVariant): CatalogProduct {
  const amount = autoScentVariant.priceUsd.toFixed(2);

  return {
    id: `auto-scent-${autoScentVariant.slug}`,
    code: "AUTO-SCENT",
    handle: "david-walker-auto-scent",
    aliases: [...AUTO_SCENT_SHOPIFY_HANDLE_CANDIDATES],
    title: autoScentVariant.title,
    description: autoScentVariant.description,
    gender: "women",
    tags: ["car-scent", autoScentVariant.slug],
    price: {
      amount,
      currencyCode: "USD",
    },
    images: [
      {
        url: autoScentVariant.images.hero,
        altText: autoScentVariant.title,
        role: "hero",
      },
      {
        url: autoScentVariant.images.detail,
        altText: `${autoScentVariant.title} detail`,
        role: "detail",
      },
      {
        url: autoScentVariant.images.lifestyle,
        altText: `${autoScentVariant.title} lifestyle`,
        role: "lifestyle",
      },
    ],
    variant: {
      id: `auto-scent-${autoScentVariant.slug}-variant`,
      title: autoScentVariant.name,
      price: {
        amount,
        currencyCode: "USD",
      },
      availableForSale: true,
      selectedOptions: [{ name: "Scent", value: autoScentVariant.name }],
    },
    options: [{ name: "Scent", values: [autoScentVariant.name] }],
    availableForSale: true,
  };
}

async function fetchShopifyProductByHandle(handle: string): Promise<ShopifyProduct["node"] | null> {
  try {
    const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
    return data?.data?.productByHandle ?? null;
  } catch {
    return null;
  }
}

export async function fetchLiveAutoScentProduct(autoScentVariant: AutoScentVariant): Promise<CatalogProduct | null> {
  for (const handle of AUTO_SCENT_SHOPIFY_HANDLE_CANDIDATES) {
    const node = await fetchShopifyProductByHandle(handle);
    if (!node) continue;

    const matchedVariant = matchShopifyVariant(node, autoScentVariant);
    if (!matchedVariant) continue;

    return toCatalogProduct(node, matchedVariant);
  }

  return null;
}

export async function resolveAutoScentProduct(autoScentVariant: AutoScentVariant): Promise<CatalogProduct> {
  return (await fetchLiveAutoScentProduct(autoScentVariant)) ?? buildFallbackAutoScentProduct(autoScentVariant);
}
