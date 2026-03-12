const SHOPIFY_API_VERSION = process.env.SHOPIFY_API_VERSION || "2025-07";
const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN?.trim();
const SHOPIFY_ADMIN_ACCESS_TOKEN = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN?.trim();

function getAdminBaseUrl() {
  if (!SHOPIFY_STORE_DOMAIN) {
    throw new Error("Missing SHOPIFY_STORE_DOMAIN");
  }

  if (!SHOPIFY_ADMIN_ACCESS_TOKEN) {
    throw new Error("Missing SHOPIFY_ADMIN_ACCESS_TOKEN");
  }

  return `https://${SHOPIFY_STORE_DOMAIN}/admin/api/${SHOPIFY_API_VERSION}`;
}

function getAdminHeaders() {
  return {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": SHOPIFY_ADMIN_ACCESS_TOKEN,
  };
}

export async function shopifyAdminGraphql(query, variables = {}) {
  const response = await fetch(`${getAdminBaseUrl()}/graphql.json`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Shopify Admin GraphQL request failed: ${JSON.stringify(payload)}`);
  }

  if (payload.errors?.length) {
    throw new Error(`Shopify Admin GraphQL errors: ${payload.errors.map((error) => error.message).join(", ")}`);
  }

  return payload.data;
}

export async function fetchVariantSnapshots(variantIds) {
  const query = `
    query VariantSnapshots($ids: [ID!]!) {
      nodes(ids: $ids) {
        ... on ProductVariant {
          id
          legacyResourceId
          title
          price
          selectedOptions {
            name
            value
          }
          product {
            handle
            title
            vendor
          }
        }
      }
    }
  `;

  const data = await shopifyAdminGraphql(query, { ids: variantIds });
  const map = new Map();

  for (const node of data.nodes || []) {
    if (node?.id && node?.legacyResourceId) {
      map.set(node.id, node);
    }
  }

  return map;
}

export async function createDraftOrder(draftOrderInput) {
  const response = await fetch(`${getAdminBaseUrl()}/draft_orders.json`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify({ draft_order: draftOrderInput }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Shopify draft order creation failed: ${JSON.stringify(payload)}`);
  }

  if (!payload?.draft_order?.invoice_url) {
    throw new Error("Shopify draft order response did not include an invoice URL.");
  }

  return payload.draft_order;
}
