const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-07";
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_TOKEN;

const shopifyTokenHeader = SHOPIFY_STOREFRONT_TOKEN?.startsWith("shpat_")
  ? "Shopify-Storefront-Private-Token"
  : "X-Shopify-Storefront-Access-Token";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!SHOPIFY_STORE_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    return res.status(500).json({
      error: "Shopify proxy is not configured",
      detail: "Set SHOPIFY_STORE_DOMAIN and SHOPIFY_STOREFRONT_TOKEN in the deployment environment.",
    });
  }

  try {
    const response = await fetch(`https://${SHOPIFY_STORE_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [shopifyTokenHeader]: SHOPIFY_STOREFRONT_TOKEN,
      },
      body: JSON.stringify(req.body),
    });

    const payload = await response.text();
    res.status(response.status).setHeader("Content-Type", "application/json").send(payload);
  } catch (error) {
    res.status(500).json({
      error: "Shopify proxy request failed",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
