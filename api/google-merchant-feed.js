import { SHOPIFY_SYNC_PRODUCTS } from "./shopify-admin/_catalog.js";

const SITE_ORIGIN = "https://shoprealscents.com";
const SITE_TITLE = "Real Scents";
const SITE_DESCRIPTION =
  "David Walker perfumes and car scents with secure Shopify checkout and free U.S. shipping.";
const FEED_TITLE = "Real Scents Google Merchant Feed";
const GOOGLE_NS = "http://base.google.com/ns/1.0";
const AUTO_SCENT_HANDLE = "david-walker-auto-scent";
const AUTO_SCENT_PATH = "/auto-scents";
const AUTO_SCENT_VARIANT_DESCRIPTIONS = {
  "Iris Flower":
    "David Walker Auto Scent Iris Flower hanging car air freshener with a soft floral profile and free U.S. shipping.",
  Melon:
    "David Walker Auto Scent Melon hanging car air freshener with a bright fruity profile and free U.S. shipping.",
  Oud:
    "David Walker Auto Scent Oud hanging car air freshener with a warm woody profile and free U.S. shipping.",
};

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function stripHtml(value) {
  return String(value ?? "")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<\/p>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildProductUrl(handle) {
  return `${SITE_ORIGIN}/product/${handle}`;
}

function buildAutoScentUrl(variantSlug) {
  return `${SITE_ORIGIN}${AUTO_SCENT_PATH}/${variantSlug}`;
}

function variantNameToSlug(name) {
  return String(name).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function toMerchantPrice(value) {
  return `${Number.parseFloat(value).toFixed(2)} USD`;
}

function toAdditionalImageTags(imageUrls) {
  return imageUrls
    .slice(1, 10)
    .map((url) => `      <g:additional_image_link>${escapeXml(url)}</g:additional_image_link>`)
    .join("\n");
}

function buildPerfumeItem(product) {
  const description = stripHtml(product.description || product.bodyHtml);
  const itemLines = [
    "    <item>",
    `      <g:id>${escapeXml(product.code)}</g:id>`,
    `      <title>${escapeXml(product.title)}</title>`,
    `      <description>${escapeXml(description)}</description>`,
    `      <link>${escapeXml(buildProductUrl(product.handle))}</link>`,
    `      <g:image_link>${escapeXml(product.imageUrls[0])}</g:image_link>`,
    toAdditionalImageTags(product.imageUrls),
    "      <g:availability>in stock</g:availability>",
    `      <g:price>${escapeXml(toMerchantPrice(product.price))}</g:price>`,
    "      <g:condition>new</g:condition>",
    `      <g:brand>${escapeXml(product.vendor)}</g:brand>`,
    `      <g:mpn>${escapeXml(product.code)}</g:mpn>`,
    `      <g:product_type>${escapeXml(product.productType)}</g:product_type>`,
    `      <g:custom_label_0>${escapeXml(product.gender || "unisex")}</g:custom_label_0>`,
    `      <g:custom_label_1>${escapeXml((product.scentFamilies || []).join(" | "))}</g:custom_label_1>`,
    "      <g:custom_label_2>perfume</g:custom_label_2>",
    "    </item>",
  ].filter(Boolean);

  return itemLines.join("\n");
}

function buildAutoScentItems(product) {
  return product.variants.map((variant, index) => {
    const variantName = variant.optionValues?.[0] || `Variant ${index + 1}`;
    const variantSlug = variantNameToSlug(variantName);
    const variantImages = product.imageUrls.filter((url) => url.includes(`/${variantSlug}/`));
    const imageUrls = variantImages.length > 0 ? variantImages : product.imageUrls;
    const title = `David Walker Auto Scent ${variantName} Car Air Freshener`;
    const description =
      AUTO_SCENT_VARIANT_DESCRIPTIONS[variantName] ||
      stripHtml(`${product.description} Variant: ${variantName}.`);

    const itemLines = [
      "    <item>",
      `      <g:id>${escapeXml(variant.sku)}</g:id>`,
      `      <title>${escapeXml(title)}</title>`,
      `      <description>${escapeXml(description)}</description>`,
      `      <link>${escapeXml(buildAutoScentUrl(variantSlug))}</link>`,
      `      <g:image_link>${escapeXml(imageUrls[0])}</g:image_link>`,
      toAdditionalImageTags(imageUrls),
      "      <g:availability>in stock</g:availability>",
      `      <g:price>${escapeXml(toMerchantPrice(variant.price))}</g:price>`,
      "      <g:condition>new</g:condition>",
      `      <g:brand>${escapeXml(product.vendor)}</g:brand>`,
      `      <g:mpn>${escapeXml(variant.sku)}</g:mpn>`,
      `      <g:product_type>${escapeXml(product.productType)}</g:product_type>`,
      "      <g:custom_label_0>car scent</g:custom_label_0>",
      `      <g:custom_label_1>${escapeXml(variantName)}</g:custom_label_1>`,
      "      <g:custom_label_2>auto scent</g:custom_label_2>",
      "    </item>",
    ].filter(Boolean);

    return itemLines.join("\n");
  });
}

function buildFeedXml() {
  const perfumeProducts = SHOPIFY_SYNC_PRODUCTS.filter((product) => product.handle !== AUTO_SCENT_HANDLE);
  const autoScentProduct = SHOPIFY_SYNC_PRODUCTS.find((product) => product.handle === AUTO_SCENT_HANDLE);
  const itemXml = [
    ...perfumeProducts.map(buildPerfumeItem),
    ...(autoScentProduct ? buildAutoScentItems(autoScentProduct) : []),
  ].join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="${GOOGLE_NS}" version="2.0">
  <channel>
    <title>${escapeXml(FEED_TITLE)}</title>
    <link>${escapeXml(SITE_ORIGIN)}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
${itemXml}
  </channel>
</rss>`;
}

export default function handler(req, res) {
  if (req.method && req.method !== "GET") {
    res.status(405).setHeader("Allow", "GET").send("Method Not Allowed");
    return;
  }

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=900, stale-while-revalidate=86400");
  res.status(200).send(buildFeedXml());
}
