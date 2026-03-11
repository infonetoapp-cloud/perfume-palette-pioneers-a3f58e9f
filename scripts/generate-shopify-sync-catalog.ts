import { copyFileSync, existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";

import productMetadata, { type ProductMeta } from "../src/lib/productMetadata";

const STOCKED_CODES = [
  "e155",
  "e49",
  "e145",
  "e82",
  "e185",
  "e184",
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

const BEST_SELLER_CODES = new Set(["e49", "e145", "e155", "b197", "b206", "b225"]);
const SITE_URL = "https://shoprealscents.com";
const PUBLIC_SYNC_ROOT = path.resolve("public", "shopify-sync");

function getGenderSegment(gender: ProductMeta["gender"]): "womens" | "mens" {
  return gender === "women" ? "womens" : "mens";
}

function getGenderLabel(gender: ProductMeta["gender"]): "Women's" | "Men's" {
  return gender === "women" ? "Women's" : "Men's";
}

function getProductType(gender: ProductMeta["gender"]): "Women's Perfume" | "Men's Fragrance" {
  return gender === "women" ? "Women's Perfume" : "Men's Fragrance";
}

function buildHandle(code: string, gender: ProductMeta["gender"]) {
  return `david-walker-${code}-${getGenderSegment(gender)}-eau-de-parfum-50ml`;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildBodyHtml(meta: ProductMeta) {
  const sections = [
    `<p><strong>${escapeHtml(meta.feeling)}</strong></p>`,
    `<p>${escapeHtml(meta.description)}</p>`,
    `<p><strong>Top Notes:</strong> ${escapeHtml(meta.scentNotes.top.join(", "))}</p>`,
    `<p><strong>Heart Notes:</strong> ${escapeHtml(meta.scentNotes.middle.join(", "))}</p>`,
    `<p><strong>Base Notes:</strong> ${escapeHtml(meta.scentNotes.base.join(", "))}</p>`,
    `<p><strong>Best For:</strong> ${escapeHtml(meta.usage)}</p>`,
    `<p><strong>Size:</strong> 50ml / 1.7oz</p>`,
    `<p><strong>Concentration:</strong> Eau de Parfum</p>`,
  ];

  return sections.join("");
}

function ensureCleanDir(directory: string) {
  rmSync(directory, { recursive: true, force: true });
  mkdirSync(directory, { recursive: true });
}

function copyProductImages(code: string) {
  const sourceDir = path.resolve("src", "assets", "products", code);
  const targetDir = path.join(PUBLIC_SYNC_ROOT, "products", code);
  ensureCleanDir(targetDir);

  if (!existsSync(sourceDir)) return [];

  return readdirSync(sourceDir)
    .filter((filename) => /\.(png|jpe?g|webp)$/i.test(filename))
    .sort((left, right) => left.localeCompare(right))
    .map((filename) => {
      copyFileSync(path.join(sourceDir, filename), path.join(targetDir, filename));
      return `${SITE_URL}/shopify-sync/products/${code}/${filename}`;
    });
}

const COLLECTION_IMAGE_SOURCES = {
  "all-perfumes": path.resolve("src", "assets", "hero", "hero-product.jpg"),
  women: path.resolve("src", "assets", "categories", "category-women.jpg"),
  men: path.resolve("src", "assets", "categories", "category-men.jpg"),
  "best-sellers": path.resolve("src", "assets", "hero", "hero-studio.jpg"),
  fresh: path.resolve("src", "assets", "scent-families", "fresh.jpg"),
  woody: path.resolve("src", "assets", "scent-families", "woody.jpg"),
  vanilla: path.resolve("src", "assets", "scent-families", "vanilla.jpg"),
  floral: path.resolve("src", "assets", "scent-families", "floral.jpg"),
  citrus: path.resolve("src", "assets", "scent-families", "citrus.jpg"),
  amber: path.resolve("src", "assets", "scent-families", "amber.jpg"),
  aromatic: path.resolve("src", "assets", "scent-families", "aromatic.jpg"),
} as const;

function copyCollectionImages() {
  const targetDir = path.join(PUBLIC_SYNC_ROOT, "collections");
  ensureCleanDir(targetDir);

  return Object.entries(COLLECTION_IMAGE_SOURCES).map(([handle, sourcePath]) => {
    const filename = path.basename(sourcePath);
    copyFileSync(sourcePath, path.join(targetDir, `${handle}-${filename}`));
    return {
      handle,
      imageUrl: `${SITE_URL}/shopify-sync/collections/${handle}-${filename}`,
    };
  });
}

ensureCleanDir(PUBLIC_SYNC_ROOT);
const collectionImageMap = Object.fromEntries(copyCollectionImages().map((entry) => [entry.handle, entry.imageUrl]));

const syncCatalog = STOCKED_CODES.map((code) => {
  const meta = productMetadata[code];
  if (!meta || meta.gender === "unisex") {
    throw new Error(`Missing sync metadata for ${code}`);
  }

  const title = `David Walker ${meta.code} ${getGenderLabel(meta.gender)} Eau de Parfum 50ml`;
  const handle = buildHandle(code, meta.gender);
  const tags = [
    "all-perfumes",
    meta.gender === "women" ? "women" : "men",
    ...meta.scentFamilies,
    ...meta.badges,
    meta.intensity,
    "Real Scents",
    "David Walker",
  ];

  if (BEST_SELLER_CODES.has(code)) {
    tags.push("best-seller");
  }

  return {
    code: meta.code,
    handle,
    title,
    description: `${meta.feeling} ${meta.description}`,
    bodyHtml: buildBodyHtml(meta),
    vendor: "David Walker",
    productType: getProductType(meta.gender),
    price: "79.90",
    tags,
    scentFamilies: meta.scentFamilies,
    gender: meta.gender,
    imageUrls: copyProductImages(code),
  };
});

const outputPath = path.resolve("api", "shopify-admin", "_catalog.js");
const fileContents = `export const SHOPIFY_SYNC_PRODUCTS = ${JSON.stringify(syncCatalog, null, 2)};\n`;

writeFileSync(outputPath, fileContents, "utf8");
writeFileSync(
  path.resolve("api", "shopify-admin", "_collections.js"),
  `export const SHOPIFY_SYNC_COLLECTION_IMAGES = ${JSON.stringify(collectionImageMap, null, 2)};\n`,
  "utf8",
);
console.log(`Wrote ${syncCatalog.length} products to ${outputPath}`);
