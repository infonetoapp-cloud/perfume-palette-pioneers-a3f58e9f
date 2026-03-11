const AUTO_SCENT_BASE_URL = "https://shoprealscents.com/shopify-sync/products/auto-scent";

export const SHOPIFY_AUTO_SCENT_PRODUCT = {
  code: "AUTO-SCENT",
  handle: "david-walker-auto-scent",
  title: "David Walker Auto Scent Car Air Freshener",
  description:
    "Premium hanging car scents in Iris Flower, Melon, and Oud. Sold individually for $25 or included complimentary once per perfume order.",
  bodyHtml: [
    "<p><strong>Premium hanging car scents for a cleaner, more polished cabin.</strong></p>",
    "<p>David Walker Auto Scent is available in Iris Flower, Melon, and Oud. Each scent is sold individually for $25 and perfume orders include 1 complimentary car scent per order.</p>",
    "<p><strong>Available scents:</strong> Iris Flower, Melon, Oud</p>",
    "<p><strong>Use:</strong> Hanging car air freshener</p>",
    "<p><strong>Shipping:</strong> Free U.S. shipping on every order.</p>",
  ].join(""),
  vendor: "David Walker",
  productType: "Car Scent",
  tags: [
    "car-scent",
    "car-scents",
    "auto-scent",
    "Real Scents",
    "David Walker",
    "iris-flower",
    "melon",
    "oud",
  ],
  options: [
    {
      name: "Scent",
      values: ["Iris Flower", "Melon", "Oud"],
    },
  ],
  variants: [
    {
      sku: "AUTO-SCENT-IRIS-FLOWER",
      price: "25.00",
      optionValues: ["Iris Flower"],
    },
    {
      sku: "AUTO-SCENT-MELON",
      price: "25.00",
      optionValues: ["Melon"],
    },
    {
      sku: "AUTO-SCENT-OUD",
      price: "25.00",
      optionValues: ["Oud"],
    },
  ],
  imageUrls: [
    `${AUTO_SCENT_BASE_URL}/iris-flower/hero.jpg`,
    `${AUTO_SCENT_BASE_URL}/iris-flower/detail.jpg`,
    `${AUTO_SCENT_BASE_URL}/iris-flower/lifestyle.jpg`,
    `${AUTO_SCENT_BASE_URL}/melon/hero.jpg`,
    `${AUTO_SCENT_BASE_URL}/melon/detail.jpg`,
    `${AUTO_SCENT_BASE_URL}/melon/lifestyle.jpg`,
    `${AUTO_SCENT_BASE_URL}/oud/hero.jpg`,
    `${AUTO_SCENT_BASE_URL}/oud/detail.jpg`,
    `${AUTO_SCENT_BASE_URL}/oud/lifestyle.jpg`,
  ],
};
