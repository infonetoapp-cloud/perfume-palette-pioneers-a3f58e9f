import { extractCodeFromHandle, getProductMeta, type ProductMeta, type ScentFamily } from "@/lib/productMetadata";
export type { ScentFamily } from "@/lib/productMetadata";

export type ProductLike = {
  handle: string;
  title: string;
  description: string;
};

export type CoreCollectionSlug = "all-perfumes" | "women" | "men" | "best-sellers" | "auto-scents";
export type CollectionSlug = CoreCollectionSlug | ScentFamily;

export interface CollectionDefinition {
  slug: CollectionSlug;
  kind: "core" | "family";
  label: string;
  title: string;
  eyebrow: string;
  description: string;
  story?: string;
  commonNotes?: string[];
  wearMoments?: string;
}

export interface ProductDisplayCopy {
  code: string | null;
  title: string;
  shortTitle: string;
  eyebrow: string;
  subtitle: string;
  description: string;
  metaDescription: string;
  noteHighlights: string[];
  familyLabels: string[];
  badges: string[];
  genderLabel: string;
  categoryLabel: string;
}

export const STOCKED_PRODUCT_CODES = [
  "e155",
  "e49",
  "e145",
  "e152",
  "e82",
  "e185",
  "e184",
  "e171",
  "e176",
  "e71",
  "e6",
  "e1",
  "b206",
  "b197",
  "b224",
  "b223",
  "b222",
  "b225",
] as const;

export const SCENT_FAMILY_SLUGS: ScentFamily[] = [
  "fresh",
  "woody",
  "vanilla",
  "floral",
  "citrus",
  "amber",
  "aromatic",
];

const STOCKED_PRODUCT_CODE_SET = new Set<string>(STOCKED_PRODUCT_CODES);
const BEST_SELLER_CODES = new Set(["e49", "e145", "e155", "b197", "b206", "b225"]);

const CORE_COLLECTION_DEFINITIONS: Record<CoreCollectionSlug, CollectionDefinition> = {
  "all-perfumes": {
    slug: "all-perfumes",
    kind: "core",
    label: "All Perfumes",
    title: "All Perfumes",
    eyebrow: "Full Collection",
    description:
      "Explore the full David Walker catalog for women and men at Real Scents, organized for easy fragrance shopping.",
    story:
      "This collection brings the full stocked lineup into one place, making it easier to compare fresh, woody, vanilla, floral, citrus, amber, and aromatic directions without bouncing between separate landing pages.",
    commonNotes: ["Citrus", "Lavender", "Vanilla", "Amber woods"],
    wearMoments: "Best for comparing the full assortment, discovering signature scents, and navigating between women's, men's, and family-led categories.",
  },
  women: {
    slug: "women",
    kind: "core",
    label: "Women's",
    title: "Women's Perfumes",
    eyebrow: "Women's Collection",
    description:
      "Browse David Walker women's Eau de Parfum styles with floral, fruity, warm, and modern scent profiles.",
    story:
      "The women's edit leans into floral brightness, creamy sweetness, polished woods, and modern warm signatures designed for daily wear, gifting, and evening dressing.",
    commonNotes: ["Rose", "Orange blossom", "Vanilla", "Soft musk"],
    wearMoments: "Ideal for daily elegance, gifting, special occasions, and shoppers who want polished feminine scent options in one place.",
  },
  men: {
    slug: "men",
    kind: "core",
    label: "Men's",
    title: "Men's Fragrances",
    eyebrow: "Men's Collection",
    description:
      "Browse David Walker men's Eau de Parfum styles with woody, fresh, aromatic, and warm scent profiles.",
    story:
      "The men's lineup moves from crisp citrus-aromatic profiles into woody, amber, and vanilla-driven evening styles, giving shoppers a cleaner way to compare daily and after-dark options.",
    commonNotes: ["Bergamot", "Lavender", "Vetiver", "Amber"],
    wearMoments: "Built for office wear, signature scent shopping, date nights, and straightforward comparison across fresh and warm profiles.",
  },
  "best-sellers": {
    slug: "best-sellers",
    kind: "core",
    label: "Best Sellers",
    title: "Best Sellers",
    eyebrow: "Customer Favorites",
    description:
      "Shop the most giftable and versatile David Walker fragrances curated by Real Scents across men's and women's collections.",
    story:
      "These are the strongest all-rounders in the current lineup, balancing broad appeal, easy wearability, and clear scent identity across both women's and men's selections.",
    commonNotes: ["Vanilla", "Floral notes", "Citrus", "Woody notes"],
    wearMoments: "A strong starting point for first orders, gift shopping, and anyone who wants the safest entry into the catalog.",
  },
  "auto-scents": {
    slug: "auto-scents",
    kind: "core",
    label: "Car Scents",
    title: "Car Scents",
    eyebrow: "Car Scents",
    description:
      "Shop David Walker car scents in Iris Flower, Melon, and Oud. Premium hanging scents for a cleaner, more polished cabin.",
    story:
      "The auto scent range is designed for drivers who want the cabin to feel cleaner, more polished, and more intentional without overwhelming sweetness or harsh chemical sharpness.",
    commonNotes: ["Iris flower", "Melon", "Oud", "Clean musks"],
    wearMoments: "Best for daily commuting, keeping the cabin fresh between details, and pairing the car with the same polished scent mood as your perfume.",
  },
};

const FAMILY_COLLECTION_DEFINITIONS: Record<ScentFamily, CollectionDefinition> = {
  fresh: {
    slug: "fresh",
    kind: "family",
    label: "Fresh",
    title: "Fresh Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop fresh perfumes with airy citrus, cool herbs, marine brightness, and clean everyday character across the David Walker collection.",
    story:
      "Fresh perfumes open with sparkling citrus, mint, green notes, or marine air, then settle into a clean and easy trail that wears especially well in daytime.",
    commonNotes: ["Mint", "Marine notes", "Green herbs", "Clean musks"],
    wearMoments: "Great for daytime wear, office settings, warm weather, and anyone who wants a crisp clean signature.",
  },
  woody: {
    slug: "woody",
    kind: "family",
    label: "Woody",
    title: "Woody Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop woody perfumes built around cedar, patchouli, sandalwood, vetiver, and dry warm depth in the David Walker fragrance lineup.",
    story:
      "Woody fragrances feel grounded and structured. They often move from a brighter opening into cedar, patchouli, sandalwood, or vetiver for a polished and lasting finish.",
    commonNotes: ["Cedarwood", "Patchouli", "Vetiver", "Sandalwood"],
    wearMoments: "Ideal for smart-casual dressing, cooler evenings, and anyone who likes a dry refined finish.",
  },
  vanilla: {
    slug: "vanilla",
    kind: "family",
    label: "Vanilla",
    title: "Vanilla Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop vanilla perfumes with creamy sweetness, warm tonka, and smooth lingering depth across women's and men's David Walker scents.",
    story:
      "Vanilla perfumes feel smooth, enveloping, and softly addictive. Depending on the blend, vanilla can read airy and elegant or rich and evening-ready.",
    commonNotes: ["Vanilla", "Tonka bean", "Cashmeran", "Soft woods"],
    wearMoments: "Best for evening wear, cooler weather, and anyone drawn to creamy warmth in the dry-down.",
  },
  floral: {
    slug: "floral",
    kind: "family",
    label: "Floral",
    title: "Floral Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop floral perfumes with rose, jasmine, orange blossom, tuberose, and soft feminine radiance in the David Walker collection.",
    story:
      "Floral perfumes center on petals and bloom. Some wear airy and polished, while others feel creamy, radiant, or more dressed up through the heart of the fragrance.",
    commonNotes: ["Rose", "Jasmine", "Orange blossom", "Tuberose"],
    wearMoments: "Well suited to daily elegance, weddings, polished office wear, and luminous day-to-night styling.",
  },
  citrus: {
    slug: "citrus",
    kind: "family",
    label: "Citrus",
    title: "Citrus Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop citrus perfumes with bergamot, lemon, mandarin, and blood orange for a bright opening and energizing first impression.",
    story:
      "Citrus fragrances feel sparkling and immediate. They usually open with bright peel, zest, and juice-like freshness before moving into cleaner woods, florals, or aromatic notes.",
    commonNotes: ["Bergamot", "Lemon", "Mandarin", "Blood orange"],
    wearMoments: "A strong fit for daytime use, spring and summer dressing, and shoppers who want a brighter scent profile.",
  },
  amber: {
    slug: "amber",
    kind: "family",
    label: "Amber",
    title: "Amber Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop amber perfumes with warm resins, smooth woods, tonka, and sensual depth for evening-ready David Walker fragrances.",
    story:
      "Amber perfumes feel warm, smooth, and more enveloping on skin. They tend to bloom in the dry-down with resinous warmth, soft sweetness, and richer evening character.",
    commonNotes: ["Amber accord", "Tonka bean", "Soft woods", "Suede"],
    wearMoments: "Best for night wear, cooler weather, and anyone who prefers richer depth over airy freshness.",
  },
  aromatic: {
    slug: "aromatic",
    kind: "family",
    label: "Aromatic",
    title: "Aromatic Perfumes",
    eyebrow: "Scent Family",
    description:
      "Shop aromatic perfumes shaped by lavender, sage, basil, mint, and herbal freshness for a polished modern finish.",
    story:
      "Aromatic fragrances lean on herbs and clean structure. They often combine lavender, sage, basil, mint, or cardamom with woods and citrus for a sharp, refined profile.",
    commonNotes: ["Lavender", "Sage", "Mint", "Basil"],
    wearMoments: "Perfect for signature scent use, office wear, smart-casual outfits, and shoppers who prefer a groomed polished profile.",
  },
};

const COLLECTION_DEFINITIONS: Record<CollectionSlug, CollectionDefinition> = {
  ...CORE_COLLECTION_DEFINITIONS,
  ...FAMILY_COLLECTION_DEFINITIONS,
};

export function normalizeCode(code: string | null): string | null {
  if (!code) return null;
  return code.toLowerCase().replace(/^k/, "b");
}

export function isStockedHandle(handle: string): boolean {
  const code = normalizeCode(extractCodeFromHandle(handle));
  return !!code && STOCKED_PRODUCT_CODE_SET.has(code);
}

export function getStockPriority(handle: string): number {
  const code = normalizeCode(extractCodeFromHandle(handle));
  if (!code) return Number.MAX_SAFE_INTEGER;
  const index = STOCKED_PRODUCT_CODES.indexOf(code as (typeof STOCKED_PRODUCT_CODES)[number]);
  return index === -1 ? Number.MAX_SAFE_INTEGER : index;
}

function getGenderLabel(gender: ProductMeta["gender"] | null): string {
  if (gender === "women") return "Women's";
  if (gender === "men") return "Men's";
  return "Unisex";
}

function getCategoryLabel(gender: ProductMeta["gender"] | null): string {
  if (gender === "women") return "Women's perfume";
  if (gender === "men") return "Men's fragrance";
  return "Unisex fragrance";
}

function getDisplayTitle(title: string, code: string | null, genderLabel: string, meta: ProductMeta | null): string {
  if (meta?.displayTitle) {
    return meta.displayTitle;
  }

  const normalizedTitle = title.replace(/\s+/g, " ").trim();
  if (normalizedTitle) {
    return normalizedTitle;
  }

  if (code) {
    return `David Walker ${code.toUpperCase()} ${genderLabel} Eau de Parfum`;
  }

  return title;
}

function formatFamilySummary(families: ScentFamily[]): string {
  const labels = families.slice(0, 2).map((family) => COLLECTION_DEFINITIONS[family].label.toLowerCase());
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return labels[0] ?? "";
}

function getSeoNoteHighlights(meta: ProductMeta | null): string[] {
  if (!meta) return [];

  const orderedNotes = [...meta.scentNotes.top, ...meta.scentNotes.middle, ...meta.scentNotes.base];
  return orderedNotes.filter((note, index) => orderedNotes.indexOf(note) === index).slice(0, 3);
}

function condenseMetaTitle(title: string): string {
  return title
    .replace(/\s+Eau de Parfum\s+50ml$/i, "")
    .replace(/\s+50ml$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

function trimMetaDescription(value: string, maxLength = 158): string {
  if (value.length <= maxLength) return value;

  const trimmed = value.slice(0, maxLength - 1);
  const lastBoundary = Math.max(trimmed.lastIndexOf(". "), trimmed.lastIndexOf(", "), trimmed.lastIndexOf(" "));
  const safeTrimmed = lastBoundary > 90 ? trimmed.slice(0, lastBoundary) : trimmed;
  return `${safeTrimmed.replace(/[,\s.]+$/, "")}.`;
}

function buildMetaDescription(title: string, meta: ProductMeta | null, noteHighlights: string[], categoryLabel: string): string {
  if (!meta) {
    return trimMetaDescription(
      `${condenseMetaTitle(title)}. Shop premium David Walker ${categoryLabel.toLowerCase()} online at Real Scents with free U.S. shipping.`,
    );
  }

  const notes = noteHighlights.join(", ");
  const familySummary = formatFamilySummary(meta.scentFamilies);
  const descriptor = familySummary ? `${familySummary} ${categoryLabel.toLowerCase()}` : categoryLabel.toLowerCase();
  const condensedTitle = condenseMetaTitle(title);

  if (familySummary && notes) {
    return trimMetaDescription(`${condensedTitle}. ${descriptor} with ${notes}. Free U.S. shipping.`);
  }

  return trimMetaDescription(`${condensedTitle}. ${descriptor}. Free U.S. shipping.`);
}

function getDisplayDescription(productDescription: string, meta: ProductMeta | null): string {
  const normalized = productDescription.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return meta ? `${meta.feeling} ${meta.description}` : productDescription;
  }

  const looksLikeLongBodyCopy =
    normalized.length > 280
    || /top notes:|heart notes:|base notes:|best for:|concentration:/i.test(normalized);

  if (looksLikeLongBodyCopy && meta) {
    return `${meta.feeling} ${meta.description}`;
  }

  return normalized;
}

export function getCollectionDefinition(slug: string | undefined): CollectionDefinition {
  if (!slug || !(slug in COLLECTION_DEFINITIONS)) {
    return COLLECTION_DEFINITIONS["all-perfumes"];
  }

  return COLLECTION_DEFINITIONS[slug as CollectionSlug];
}

export function getCollectionPath(slug: CollectionSlug): string {
  return `/collections/${slug}`;
}

export function getProductDisplayCopy(product: ProductLike): ProductDisplayCopy {
  const meta = getProductMeta(product.handle);
  const code = normalizeCode(extractCodeFromHandle(product.handle));
  const genderLabel = getGenderLabel(meta?.gender ?? null);
  const categoryLabel = getCategoryLabel(meta?.gender ?? null);
  const noteHighlights = getSeoNoteHighlights(meta);
  const familyLabels = meta?.scentFamilies.map((family) => COLLECTION_DEFINITIONS[family].label) ?? [];
  const title = getDisplayTitle(product.title, code, genderLabel, meta);
  const shortTitle = meta?.shortTitle ?? (code ? `David Walker ${code.toUpperCase()}` : title);
  const subtitleHighlights = familyLabels.length > 0 ? familyLabels : noteHighlights;
  const subtitle = meta?.subtitle
    ?? (meta ? `${categoryLabel} - ${subtitleHighlights.slice(0, 3).join(" - ")}` : `${categoryLabel} - Eau de Parfum`);
  const description = getDisplayDescription(product.description, meta);
  const eyebrow = code ? `${code.toUpperCase()} - ${genderLabel}` : genderLabel;

  return {
    code: code ? code.toUpperCase() : null,
    title,
    shortTitle,
    eyebrow,
    subtitle,
    description,
    metaDescription: meta?.metaDescription ?? buildMetaDescription(title, meta, noteHighlights, categoryLabel),
    noteHighlights,
    familyLabels,
    badges: meta?.badges ?? [],
    genderLabel,
    categoryLabel,
  };
}

export function matchesCollection(handle: string, collection: CollectionSlug): boolean {
  if (!isStockedHandle(handle)) return false;
  if (collection === "all-perfumes") return true;
  if (collection === "auto-scents") return false;

  const meta = getProductMeta(handle);
  const code = normalizeCode(extractCodeFromHandle(handle));

  if (collection === "women") return meta?.gender === "women";
  if (collection === "men") return meta?.gender === "men";
  if (collection === "best-sellers") return code ? BEST_SELLER_CODES.has(code) : false;

  return meta?.scentFamilies.includes(collection) ?? false;
}

export function sortProductsForCollection<T extends ProductLike>(products: T[], collection: CollectionSlug): T[] {
  if (collection !== "best-sellers") {
    return [...products].sort((left, right) => getStockPriority(left.handle) - getStockPriority(right.handle));
  }

  return [...products].sort((left, right) => {
    const leftCode = normalizeCode(extractCodeFromHandle(left.handle));
    const rightCode = normalizeCode(extractCodeFromHandle(right.handle));
    const leftScore = leftCode && BEST_SELLER_CODES.has(leftCode) ? 1 : 0;
    const rightScore = rightCode && BEST_SELLER_CODES.has(rightCode) ? 1 : 0;
    if (rightScore !== leftScore) return rightScore - leftScore;
    return getStockPriority(left.handle) - getStockPriority(right.handle);
  });
}
