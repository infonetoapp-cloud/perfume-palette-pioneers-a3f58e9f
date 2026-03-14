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

export async function fetchRecentOpenOrders(limit = 25) {
  const query = `
    query RecentOpenOrders($first: Int!) {
      orders(
        first: $first
        sortKey: CREATED_AT
        reverse: true
        query: "status:open AND (fulfillment_status:unfulfilled OR fulfillment_status:partial)"
      ) {
        edges {
          node {
            id
            legacyResourceId
            name
            createdAt
            displayFinancialStatus
            displayFulfillmentStatus
            totalPriceSet {
              shopMoney {
                amount
                currencyCode
              }
            }
            customer {
              displayName
              email
            }
            shippingAddress {
              name
              city
              province
              country
              zip
            }
            lineItems(first: 25) {
              edges {
                node {
                  title
                  quantity
                  sku
                }
              }
            }
            fulfillmentOrders(first: 10) {
              edges {
                node {
                  id
                  status
                  assignedLocation {
                    name
                  }
                  lineItems(first: 25) {
                    edges {
                      node {
                        remainingQuantity
                        lineItem {
                          title
                          sku
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyAdminGraphql(query, { first: limit });

  return (data.orders?.edges || []).map(({ node }) => ({
    id: node.id,
    legacyResourceId: node.legacyResourceId,
    name: node.name,
    createdAt: node.createdAt,
    financialStatus: node.displayFinancialStatus,
    fulfillmentStatus: node.displayFulfillmentStatus,
    total: node.totalPriceSet?.shopMoney || null,
    customer: node.customer || null,
    shippingAddress: node.shippingAddress || null,
    lineItems: (node.lineItems?.edges || []).map(({ node: line }) => ({
      title: line.title,
      quantity: line.quantity,
      sku: line.sku,
    })),
    fulfillmentOrders: (node.fulfillmentOrders?.edges || []).map(({ node: fulfillmentOrder }) => ({
      id: fulfillmentOrder.id,
      status: fulfillmentOrder.status,
      assignedLocation: fulfillmentOrder.assignedLocation?.name || null,
      lineItems: (fulfillmentOrder.lineItems?.edges || []).map(({ node: line }) => ({
        remainingQuantity: line.remainingQuantity,
        title: line.lineItem?.title || null,
        sku: line.lineItem?.sku || null,
      })),
    })),
  }));
}

export async function createFulfillment({
  fulfillmentOrderId,
  trackingNumber,
  trackingCompany,
  trackingUrl,
  notifyCustomer = true,
}) {
  const mutation = `
    mutation CreateFulfillment(
      $fulfillment: FulfillmentInput!
      $message: String
    ) {
      fulfillmentCreate(fulfillment: $fulfillment, message: $message) {
        fulfillment {
          id
          status
          trackingInfo {
            company
            number
            url
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const fulfillmentInput = {
    notifyCustomer,
    lineItemsByFulfillmentOrder: [
      {
        fulfillmentOrderId,
      },
    ],
    trackingInfo: {
      number: trackingNumber,
      company: trackingCompany || undefined,
      url: trackingUrl || undefined,
    },
  };

  const data = await shopifyAdminGraphql(mutation, {
    fulfillment: fulfillmentInput,
    message: notifyCustomer ? "Your order is on the way." : null,
  });

  const payload = data.fulfillmentCreate;
  if (payload.userErrors?.length) {
    throw new Error(payload.userErrors.map((error) => error.message).join(", "));
  }

  return payload.fulfillment;
}

export async function upsertEmailSubscriber(email) {
  const customerSetMutation = `
    mutation CustomerSet($identifier: CustomerSetIdentifiers, $input: CustomerSetInput!) {
      customerSet(identifier: $identifier, input: $input) {
        customer {
          id
          email
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  const customerSetData = await shopifyAdminGraphql(customerSetMutation, {
    identifier: { email },
    input: { email },
  });

  const customerSetPayload = customerSetData.customerSet;
  if (customerSetPayload.userErrors?.length) {
    throw new Error(customerSetPayload.userErrors.map((error) => error.message).join(", "));
  }

  const customerId = customerSetPayload.customer?.id;
  if (!customerId) {
    throw new Error("Shopify did not return a customer record for newsletter signup.");
  }

  const consentMutation = `
    mutation CustomerEmailMarketingConsentUpdate($input: CustomerEmailMarketingConsentUpdateInput!) {
      customerEmailMarketingConsentUpdate(input: $input) {
        customer {
          id
          email
          emailMarketingConsent {
            marketingState
            marketingOptInLevel
            consentUpdatedAt
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const consentData = await shopifyAdminGraphql(consentMutation, {
    input: {
      customerId,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN",
        consentUpdatedAt: new Date().toISOString(),
      },
    },
  });

  const consentPayload = consentData.customerEmailMarketingConsentUpdate;
  if (consentPayload.userErrors?.length) {
    throw new Error(consentPayload.userErrors.map((error) => error.message).join(", "));
  }

  return consentPayload.customer;
}
