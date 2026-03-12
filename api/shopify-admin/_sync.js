import { SHOPIFY_SYNC_PRODUCTS } from "./_catalog.js";
import { SHOPIFY_SYNC_COLLECTION_IMAGES } from "./_collections.js";

const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || process.env.SHOPIFY_API_VERSION || "2025-07";
const MAX_RETRY_ATTEMPTS = 6;
const ADMIN_REQUEST_INTERVAL_MS = 550;

const PERFUME_COLLECTION_HANDLE = "all-perfumes";
const CAR_SCENTS_COLLECTION_HANDLE = "car-scents";
const SHOPIFY_APP_DISCOUNT_FUNCTION_HANDLE = "real-scents-discount-engine";
const SHOPIFY_APP_DISCOUNT_CLASSES = ["PRODUCT", "ORDER", "SHIPPING"];
const DISCOUNT_TITLES = {
  gift: "Real Scents | Free car scent with perfume order",
  pair: "Real Scents | 2 perfumes for $119.90",
  shipping: "Real Scents | Free shipping on every order",
  scent10: "Real Scents | SCENT10",
  engine: "Real Scents | Checkout pricing engine",
};

const SHOPIFY_SYNC_COLLECTIONS = [
  {
    title: "All Perfumes",
    handle: PERFUME_COLLECTION_HANDLE,
    bodyHtml: "<p>Explore the full David Walker catalog for women and men at Real Scents.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "all-perfumes" }],
  },
  {
    title: "Women's Perfumes",
    handle: "women",
    bodyHtml: "<p>Browse David Walker women's Eau de Parfum styles with floral, fruity, warm, and modern scent profiles.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "women" }],
  },
  {
    title: "Men's Fragrances",
    handle: "men",
    bodyHtml: "<p>Browse David Walker men's Eau de Parfum styles with woody, fresh, aromatic, and warm scent profiles.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "men" }],
  },
  {
    title: "Best Sellers",
    handle: "best-sellers",
    bodyHtml: "<p>Shop the most giftable and versatile David Walker fragrances curated by Real Scents.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "best-seller" }],
  },
  {
    title: "Car Scents",
    handle: CAR_SCENTS_COLLECTION_HANDLE,
    bodyHtml: "<p>Shop David Walker car scents in Iris Flower, Melon, and Oud. Sold individually or included once per perfume order.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "car-scent" }],
  },
  {
    title: "Fresh Perfumes",
    handle: "fresh",
    bodyHtml: "<p>Shop fresh perfumes with airy citrus, cool herbs, marine brightness, and clean everyday character.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "fresh" }],
  },
  {
    title: "Woody Perfumes",
    handle: "woody",
    bodyHtml: "<p>Shop woody perfumes built around cedar, patchouli, sandalwood, vetiver, and dry warm depth.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "woody" }],
  },
  {
    title: "Vanilla Perfumes",
    handle: "vanilla",
    bodyHtml: "<p>Shop vanilla perfumes with creamy sweetness, warm tonka, and smooth lingering depth.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "vanilla" }],
  },
  {
    title: "Floral Perfumes",
    handle: "floral",
    bodyHtml: "<p>Shop floral perfumes with rose, jasmine, orange blossom, tuberose, and soft feminine radiance.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "floral" }],
  },
  {
    title: "Citrus Perfumes",
    handle: "citrus",
    bodyHtml: "<p>Shop citrus perfumes with bergamot, lemon, mandarin, and blood orange for a bright opening.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "citrus" }],
  },
  {
    title: "Amber Perfumes",
    handle: "amber",
    bodyHtml: "<p>Shop amber perfumes with warm resins, smooth woods, tonka, and sensual depth.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "amber" }],
  },
  {
    title: "Aromatic Perfumes",
    handle: "aromatic",
    bodyHtml: "<p>Shop aromatic perfumes shaped by lavender, sage, basil, mint, and herbal freshness.</p>",
    rules: [{ column: "tag", relation: "equals", condition: "aromatic" }],
  },
];

let lastAdminRequestAt = 0;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForAdminRequestSlot() {
  const waitMs = lastAdminRequestAt + ADMIN_REQUEST_INTERVAL_MS - Date.now();

  if (waitMs > 0) {
    await sleep(waitMs);
  }

  lastAdminRequestAt = Date.now();
}

function getRetryDelayMs(response, attempt) {
  const retryAfterSeconds = Number(response.headers.get("retry-after"));

  if (Number.isFinite(retryAfterSeconds) && retryAfterSeconds > 0) {
    return retryAfterSeconds * 1000;
  }

  return Math.min(5000, 800 * 2 ** attempt);
}

async function adminRestRequest({ shop, accessToken, path, method = "GET", body }) {
  const serializedBody = body ? JSON.stringify(body) : undefined;

  for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
    await waitForAdminRequestSlot();

    const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_ADMIN_API_VERSION}${path}`, {
      method,
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: serializedBody,
    });

    const payload = await response.text();
    let json = null;

    try {
      json = payload ? JSON.parse(payload) : null;
    } catch {
      json = null;
    }

    if (response.status === 429 && attempt < MAX_RETRY_ATTEMPTS) {
      await sleep(getRetryDelayMs(response, attempt));
      continue;
    }

    if (!response.ok) {
      throw new Error(`Shopify REST ${method} ${path} failed (${response.status}): ${payload}`);
    }

    return json;
  }

  throw new Error(`Shopify REST ${method} ${path} failed after retry exhaustion.`);
}

async function adminGraphqlRequest({ shop, accessToken, query, variables = {} }) {
  const serializedBody = JSON.stringify({ query, variables });

  for (let attempt = 0; attempt <= MAX_RETRY_ATTEMPTS; attempt += 1) {
    await waitForAdminRequestSlot();

    const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Access-Token": accessToken,
      },
      body: serializedBody,
    });

    const payload = await response.json();

    if (response.status === 429 && attempt < MAX_RETRY_ATTEMPTS) {
      await sleep(getRetryDelayMs(response, attempt));
      continue;
    }

    if (!response.ok) {
      throw new Error(`Shopify GraphQL failed (${response.status}): ${JSON.stringify(payload)}`);
    }

    if (payload.errors?.length) {
      throw new Error(`Shopify GraphQL errors: ${payload.errors.map((error) => error.message).join(", ")}`);
    }

    return payload.data;
  }

  throw new Error("Shopify GraphQL failed after retry exhaustion.");
}

async function fetchExistingProductByHandle(shop, accessToken, handle) {
  const payload = await adminRestRequest({
    shop,
    accessToken,
    path: `/products.json?handle=${encodeURIComponent(handle)}&limit=1`,
  });

  return payload?.products?.[0] ?? null;
}

function getFilenameFromUrl(url) {
  try {
    return new URL(url).pathname.split("/").pop() || "image";
  } catch {
    return "image";
  }
}

function getManagedImageAlt(productCode, filename) {
  return `real-scents-sync:${productCode}:${filename}`;
}

function getNormalizedProductOptions(product) {
  if (Array.isArray(product.options) && product.options.length > 0) {
    return product.options.map((option) => ({
      name: option.name,
      values: [...option.values],
    }));
  }

  return [
    {
      name: "Size",
      values: ["50ml / 1.7oz"],
    },
  ];
}

function getNormalizedProductVariants(product) {
  if (Array.isArray(product.variants) && product.variants.length > 0) {
    return product.variants.map((variant) => ({
      sku: variant.sku,
      price: variant.price,
      optionValues: variant.optionValues ?? ["50ml / 1.7oz"],
      taxable: variant.taxable ?? true,
      requiresShipping: variant.requiresShipping ?? true,
      inventoryPolicy: variant.inventoryPolicy ?? "continue",
      inventoryManagement: variant.inventoryManagement ?? null,
    }));
  }

  return [
    {
      sku: product.code,
      price: product.price,
      optionValues: ["50ml / 1.7oz"],
      taxable: true,
      requiresShipping: true,
      inventoryPolicy: "continue",
      inventoryManagement: null,
    },
  ];
}

function getVariantMatchKey(variant) {
  const optionValues = [variant.option1, variant.option2, variant.option3].filter(Boolean);
  return optionValues.join("||").toLowerCase();
}

function findExistingVariant(existingProduct, desiredVariant) {
  const existingVariants = existingProduct?.variants ?? [];

  return (
    existingVariants.find((variant) => variant.sku && desiredVariant.sku && variant.sku === desiredVariant.sku)
    || existingVariants.find((variant) => getVariantMatchKey(variant) === desiredVariant.optionValues.join("||").toLowerCase())
    || null
  );
}

function buildRestProductPayload(product, existingProduct = null) {
  const optionDefinitions = getNormalizedProductOptions(product);
  const variantDefinitions = getNormalizedProductVariants(product);

  return {
    product: {
      ...(existingProduct?.id ? { id: existingProduct.id } : {}),
      title: product.title,
      body_html: product.bodyHtml,
      vendor: product.vendor,
      product_type: product.productType,
      handle: product.handle,
      status: "active",
      tags: product.tags.join(", "),
      options: optionDefinitions.map((option) => ({
        name: option.name,
        values: option.values,
      })),
      variants: variantDefinitions.map((variantDefinition) => {
        const existingVariant = findExistingVariant(existingProduct, variantDefinition);
        const [option1, option2, option3] = variantDefinition.optionValues;

        return {
          ...(existingVariant?.id ? { id: existingVariant.id } : {}),
          ...(option1 ? { option1 } : {}),
          ...(option2 ? { option2 } : {}),
          ...(option3 ? { option3 } : {}),
          price: variantDefinition.price,
          sku: variantDefinition.sku,
          taxable: variantDefinition.taxable,
          requires_shipping: variantDefinition.requiresShipping,
          inventory_policy: variantDefinition.inventoryPolicy,
          inventory_management: variantDefinition.inventoryManagement,
        };
      }),
      published: true,
    },
  };
}

async function createOrUpdateProduct(shop, accessToken, product) {
  const existingProduct = await fetchExistingProductByHandle(shop, accessToken, product.handle);
  const body = buildRestProductPayload(product, existingProduct);

  const payload = existingProduct
    ? await adminRestRequest({
        shop,
        accessToken,
        path: `/products/${existingProduct.id}.json`,
        method: "PUT",
        body,
      })
    : await adminRestRequest({
        shop,
        accessToken,
        path: "/products.json",
        method: "POST",
        body,
      });

  return {
    action: existingProduct ? "updated" : "created",
    product: payload.product,
  };
}

async function fetchProductImages(shop, accessToken, productId) {
  const payload = await adminRestRequest({
    shop,
    accessToken,
    path: `/products/${productId}/images.json`,
  });

  return payload?.images ?? [];
}

async function deleteProductImage(shop, accessToken, productId, imageId) {
  await adminRestRequest({
    shop,
    accessToken,
    path: `/products/${productId}/images/${imageId}.json`,
    method: "DELETE",
  });
}

async function createProductImage(shop, accessToken, productId, image) {
  await adminRestRequest({
    shop,
    accessToken,
    path: `/products/${productId}/images.json`,
    method: "POST",
    body: { image },
  });
}

async function updateProductImage(shop, accessToken, productId, imageId, image) {
  await adminRestRequest({
    shop,
    accessToken,
    path: `/products/${productId}/images/${imageId}.json`,
    method: "PUT",
    body: {
      image: {
        id: imageId,
        ...image,
      },
    },
  });
}

async function syncProductImages(shop, accessToken, productId, product) {
  if (!product.imageUrls?.length) return;

  const desiredImages = product.imageUrls.map((imageUrl, index) => {
    const filename = getFilenameFromUrl(imageUrl);
    return {
      src: imageUrl,
      position: index + 1,
      alt: getManagedImageAlt(product.code, filename),
    };
  });

  const desiredAlts = new Set(desiredImages.map((image) => image.alt));
  const existingImages = await fetchProductImages(shop, accessToken, productId);
  const managedExistingImages = existingImages.filter((image) => String(image.alt || "").startsWith(`real-scents-sync:${product.code}:`));

  for (const image of managedExistingImages) {
    if (!desiredAlts.has(image.alt)) {
      await deleteProductImage(shop, accessToken, productId, image.id);
    }
  }

  const refreshedImages = await fetchProductImages(shop, accessToken, productId);
  const refreshedByAlt = new Map(refreshedImages.map((image) => [image.alt, image]));

  for (const desiredImage of desiredImages) {
    const existingImage = refreshedByAlt.get(desiredImage.alt);

    if (!existingImage) {
      await createProductImage(shop, accessToken, productId, desiredImage);
      continue;
    }

    if (existingImage.position !== desiredImage.position) {
      await updateProductImage(shop, accessToken, productId, existingImage.id, {
        position: desiredImage.position,
        alt: desiredImage.alt,
      });
    }
  }
}

async function getTargetPublications(shop, accessToken) {
  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      query GetPublications {
        publications(first: 50) {
          nodes {
            id
            name
          }
        }
      }
    `,
  });

  const publications = data?.publications?.nodes ?? [];
  const preferred = publications.filter((publication) => /headless|online store/i.test(publication.name));

  return preferred.length > 0 ? preferred : publications;
}

async function publishResource(shop, accessToken, resourceGid, publicationIds) {
  if (!resourceGid || publicationIds.length === 0) return;

  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      mutation PublishProduct($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      id: resourceGid,
      input: publicationIds.map((publicationId) => ({ publicationId })),
    },
  });

  const userErrors = data?.publishablePublish?.userErrors ?? [];
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }
}

function getCollectionGid(collection) {
  if (collection?.admin_graphql_api_id) return collection.admin_graphql_api_id;
  if (collection?.id) return `gid://shopify/Collection/${collection.id}`;
  return null;
}

async function fetchSmartCollections(shop, accessToken) {
  const payload = await adminRestRequest({
    shop,
    accessToken,
    path: "/smart_collections.json?limit=250",
  });

  return payload?.smart_collections ?? [];
}

async function createOrUpdateSmartCollection(shop, accessToken, collection, existingCollections) {
  const existingCollection = existingCollections.find(
    (item) => item.handle === collection.handle || item.title === collection.title,
  );

  const collectionImageUrl = SHOPIFY_SYNC_COLLECTION_IMAGES[collection.handle];
  const body = {
    smart_collection: {
      ...(existingCollection?.id ? { id: existingCollection.id } : {}),
      title: collection.title,
      body_html: collection.bodyHtml,
      handle: collection.handle,
      disjunctive: false,
      rules: collection.rules,
      published: true,
      sort_order: "best-selling",
      ...(collectionImageUrl
        ? {
            image: {
              src: collectionImageUrl,
              alt: `${collection.title} collection image`,
            },
          }
        : {}),
    },
  };

  const payload = existingCollection
    ? await adminRestRequest({
        shop,
        accessToken,
        path: `/smart_collections/${existingCollection.id}.json`,
        method: "PUT",
        body,
      })
    : await adminRestRequest({
        shop,
        accessToken,
        path: "/smart_collections.json",
        method: "POST",
        body,
      });

  return {
    action: existingCollection ? "updated" : "created",
    collection: payload.smart_collection,
  };
}

function getIsoNow() {
  return new Date().toISOString();
}

function getCombinesWith({ productDiscounts = true, orderDiscounts = false, shippingDiscounts = true } = {}) {
  return {
    productDiscounts,
    orderDiscounts,
    shippingDiscounts,
  };
}

async function fetchDiscountNodes(shop, accessToken) {
  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      query GetDiscountNodes {
        discountNodes(first: 100) {
          nodes {
            id
            discount {
              __typename
              ... on DiscountAutomaticBxgy {
                title
                status
              }
              ... on DiscountAutomaticBasic {
                title
                status
              }
              ... on DiscountAutomaticFreeShipping {
                title
                status
              }
              ... on DiscountAutomaticApp {
                title
                status
              }
              ... on DiscountCodeBasic {
                title
                status
              }
            }
          }
        }
      }
    `,
  });

  return data?.discountNodes?.nodes ?? [];
}

function findDiscountNodeByTitle(discountNodes, title) {
  return discountNodes.find((node) => node?.discount?.title === title) ?? null;
}

function findDiscountNodesByTitles(discountNodes, titles) {
  const titleSet = new Set(titles);
  return discountNodes.filter((node) => titleSet.has(node?.discount?.title));
}

function extractUserErrors(payload, fieldName) {
  return payload?.[fieldName]?.userErrors ?? [];
}

async function ensureAutomaticBxgyDiscount(shop, accessToken, discountNodes, { buysCollectionId, getsCollectionId }) {
  const existingNode = findDiscountNodeByTitle(discountNodes, DISCOUNT_TITLES.gift);
  if (existingNode) {
    return {
      status: "existing",
      title: DISCOUNT_TITLES.gift,
      message: "Gift discount already exists in Shopify.",
    };
  }

  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      mutation CreateGiftDiscount($discount: DiscountAutomaticBxgyInput!) {
        discountAutomaticBxgyCreate(automaticBxgyDiscount: $discount) {
          automaticDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      discount: {
        title: DISCOUNT_TITLES.gift,
        startsAt: getIsoNow(),
        combinesWith: getCombinesWith({ productDiscounts: true, orderDiscounts: false, shippingDiscounts: true }),
        usesPerOrderLimit: "1",
        customerBuys: {
          value: { quantity: "1" },
          items: {
            collections: {
              add: [buysCollectionId],
            },
          },
        },
        customerGets: {
          value: {
            discountOnQuantity: {
              quantity: "1",
              effect: {
                percentage: 1,
              },
            },
          },
          items: {
            collections: {
              add: [getsCollectionId],
            },
          },
        },
      },
    },
  });

  const userErrors = extractUserErrors(data, "discountAutomaticBxgyCreate");
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }

  return {
    status: "success",
    title: DISCOUNT_TITLES.gift,
    message: "Gift discount created successfully.",
  };
}

async function ensureAutomaticBasicPairDiscount(shop, accessToken, discountNodes, { perfumeCollectionId }) {
  const existingNode = findDiscountNodeByTitle(discountNodes, DISCOUNT_TITLES.pair);
  if (existingNode) {
    return {
      status: "existing",
      title: DISCOUNT_TITLES.pair,
      message: "Pair-price discount already exists in Shopify.",
    };
  }

  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      mutation CreatePairDiscount($discount: DiscountAutomaticBasicInput!) {
        discountAutomaticBasicCreate(automaticBasicDiscount: $discount) {
          automaticDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      discount: {
        title: DISCOUNT_TITLES.pair,
        startsAt: getIsoNow(),
        combinesWith: getCombinesWith({ productDiscounts: true, orderDiscounts: false, shippingDiscounts: true }),
        customerGets: {
          value: {
            discountAmount: {
              amount: "39.90",
              appliesOnEachItem: false,
            },
          },
          items: {
            collections: {
              add: [perfumeCollectionId],
            },
          },
        },
        minimumRequirement: {
          quantity: {
            greaterThanOrEqualToQuantity: "2",
          },
        },
      },
    },
  });

  const userErrors = extractUserErrors(data, "discountAutomaticBasicCreate");
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }

  return {
    status: "success",
    title: DISCOUNT_TITLES.pair,
    message: "Pair-price discount created successfully.",
  };
}

async function ensureCodeBasicDiscount(shop, accessToken, discountNodes, { perfumeCollectionId }) {
  const existingNode = findDiscountNodeByTitle(discountNodes, DISCOUNT_TITLES.scent10);
  if (existingNode) {
    return {
      status: "existing",
      title: DISCOUNT_TITLES.scent10,
      message: "SCENT10 code discount already exists in Shopify.",
    };
  }

  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      mutation CreateScent10Discount($discount: DiscountCodeBasicInput!) {
        discountCodeBasicCreate(basicCodeDiscount: $discount) {
          codeDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      discount: {
        title: DISCOUNT_TITLES.scent10,
        code: "SCENT10",
        startsAt: getIsoNow(),
        combinesWith: getCombinesWith({ productDiscounts: true, orderDiscounts: false, shippingDiscounts: true }),
        customerGets: {
          value: { percentage: 0.1 },
          items: {
            collections: {
              add: [perfumeCollectionId],
            },
          },
        },
      },
    },
  });

  const userErrors = extractUserErrors(data, "discountCodeBasicCreate");
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }

  return {
    status: "success",
    title: DISCOUNT_TITLES.scent10,
    message: "SCENT10 code discount created successfully.",
  };
}

async function deleteDiscountNode(shop, accessToken, discountNodeId) {
  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      mutation DeleteAutomaticDiscount($id: ID!) {
        discountAutomaticDelete(id: $id) {
          deletedAutomaticDiscountId
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      id: discountNodeId,
    },
  });

  const userErrors = extractUserErrors(data, "discountAutomaticDelete");
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }
}

async function removeLegacyAutomaticDiscounts(shop, accessToken, discountNodes) {
  const legacyNodes = findDiscountNodesByTitles(discountNodes, [
    DISCOUNT_TITLES.gift,
    DISCOUNT_TITLES.pair,
    DISCOUNT_TITLES.shipping,
  ]);

  const results = [];

  for (const node of legacyNodes) {
    if (!node?.id || node.discount?.__typename === "DiscountCodeBasic") {
      continue;
    }

    await deleteDiscountNode(shop, accessToken, node.id);
    results.push({
      status: "removed",
      title: node.discount?.title ?? "Legacy automatic discount",
      message: "Legacy automatic discount removed.",
    });
  }

  return results;
}

async function ensureAutomaticAppDiscount(shop, accessToken, discountNodes) {
  const existingNode = findDiscountNodeByTitle(discountNodes, DISCOUNT_TITLES.engine);

  const mutationName = existingNode ? "UpdateCheckoutEngineDiscount" : "CreateCheckoutEngineDiscount";
  const mutation = existingNode
    ? `
      mutation ${mutationName}($id: ID!, $discount: DiscountAutomaticAppInput!) {
        discountAutomaticAppUpdate(id: $id, automaticAppDiscount: $discount) {
          automaticAppDiscount {
            discountId
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `
    : `
      mutation ${mutationName}($discount: DiscountAutomaticAppInput!) {
        discountAutomaticAppCreate(automaticAppDiscount: $discount) {
          automaticAppDiscount {
            discountId
            title
            status
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: mutation,
    variables: existingNode
      ? {
          id: existingNode.id,
          discount: {
            title: DISCOUNT_TITLES.engine,
            functionHandle: SHOPIFY_APP_DISCOUNT_FUNCTION_HANDLE,
            startsAt: getIsoNow(),
            combinesWith: getCombinesWith({ productDiscounts: true, orderDiscounts: false, shippingDiscounts: true }),
            discountClasses: SHOPIFY_APP_DISCOUNT_CLASSES,
          },
        }
      : {
          discount: {
            title: DISCOUNT_TITLES.engine,
            functionHandle: SHOPIFY_APP_DISCOUNT_FUNCTION_HANDLE,
            startsAt: getIsoNow(),
            combinesWith: getCombinesWith({ productDiscounts: true, orderDiscounts: false, shippingDiscounts: true }),
            discountClasses: SHOPIFY_APP_DISCOUNT_CLASSES,
          },
        },
  });

  const fieldName = existingNode ? "discountAutomaticAppUpdate" : "discountAutomaticAppCreate";
  const userErrors = extractUserErrors(data, fieldName);
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }

  return {
    status: existingNode ? "success" : "success",
    title: DISCOUNT_TITLES.engine,
    message: existingNode
      ? "Checkout pricing app discount updated successfully."
      : "Checkout pricing app discount created successfully.",
  };
}

async function ensureAutomaticFreeShippingDiscount(shop, accessToken, discountNodes) {
  const existingNode = findDiscountNodeByTitle(discountNodes, DISCOUNT_TITLES.shipping);
  if (existingNode) {
    return {
      status: "existing",
      title: DISCOUNT_TITLES.shipping,
      message: "Free shipping discount already exists in Shopify.",
    };
  }

  const data = await adminGraphqlRequest({
    shop,
    accessToken,
    query: `
      mutation CreateFreeShippingDiscount($discount: DiscountAutomaticFreeShippingInput!) {
        discountAutomaticFreeShippingCreate(freeShippingAutomaticDiscount: $discount) {
          automaticDiscountNode {
            id
          }
          userErrors {
            field
            message
          }
        }
      }
    `,
    variables: {
      discount: {
        title: DISCOUNT_TITLES.shipping,
        startsAt: getIsoNow(),
        combinesWith: {
          orderDiscounts: true,
          productDiscounts: true,
        },
        appliesOnOneTimePurchase: true,
        destination: { all: true },
      },
    },
  });

  const userErrors = extractUserErrors(data, "discountAutomaticFreeShippingCreate");
  if (userErrors.length > 0) {
    throw new Error(userErrors.map((error) => error.message).join(", "));
  }

  return {
    status: "success",
    title: DISCOUNT_TITLES.shipping,
    message: "Free shipping discount created successfully.",
  };
}

export async function syncCatalogToShopify({ shop, accessToken }) {
  const results = [];
  const publications = await getTargetPublications(shop, accessToken);
  const publicationIds = publications.map((publication) => publication.id);

  for (const product of SHOPIFY_SYNC_PRODUCTS) {
    const { action, product: syncedProduct } = await createOrUpdateProduct(shop, accessToken, product);

    try {
      await syncProductImages(shop, accessToken, syncedProduct.id, product);
    } catch (error) {
      results.push({
        code: product.code,
        handle: product.handle,
        action,
        status: "warning",
        message: `Product ${action}, but image sync failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      continue;
    }

    try {
      await publishResource(shop, accessToken, syncedProduct.admin_graphql_api_id, publicationIds);
    } catch (error) {
      results.push({
        code: product.code,
        handle: product.handle,
        action,
        status: "warning",
        message: `Product ${action}, but publication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      continue;
    }

    results.push({
      code: product.code,
      handle: product.handle,
      action,
      status: "success",
      message: `Product ${action}, images synced, and published successfully.`,
    });
  }

  return {
    results,
    publications: publications.map((publication) => publication.name),
  };
}

export async function syncCollectionsToShopify({ shop, accessToken }) {
  const results = [];
  const existingCollections = await fetchSmartCollections(shop, accessToken);
  const publications = await getTargetPublications(shop, accessToken);
  const publicationIds = publications.map((publication) => publication.id);

  for (const collection of SHOPIFY_SYNC_COLLECTIONS) {
    const { action, collection: syncedCollection } = await createOrUpdateSmartCollection(shop, accessToken, collection, existingCollections);

    try {
      await publishResource(shop, accessToken, syncedCollection.admin_graphql_api_id, publicationIds);
    } catch (error) {
      results.push({
        handle: collection.handle,
        title: collection.title,
        action,
        status: "warning",
        message: `Collection ${action}, but publication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      continue;
    }

    results.push({
      handle: collection.handle,
      title: collection.title,
      action,
      status: "success",
      message: `Collection ${action} and published successfully.`,
    });
  }

  return results;
}

export async function syncDiscountsToShopify({ shop, accessToken }) {
  const results = [];

  try {
    const collections = await fetchSmartCollections(shop, accessToken);
    const perfumeCollection = collections.find((collection) => collection.handle === PERFUME_COLLECTION_HANDLE);
    const carScentsCollection = collections.find((collection) => collection.handle === CAR_SCENTS_COLLECTION_HANDLE);

    if (!perfumeCollection || !carScentsCollection) {
      return [
        {
          status: "error",
          title: "Discount sync prerequisites",
          message: "Required Shopify collections are missing. Sync collections before syncing discounts.",
        },
      ];
    }

    const perfumeCollectionId = getCollectionGid(perfumeCollection);
    const carScentsCollectionId = getCollectionGid(carScentsCollection);

    if (!perfumeCollectionId || !carScentsCollectionId) {
      return [
        {
          status: "error",
          title: "Discount sync prerequisites",
          message: "Collection GraphQL IDs could not be resolved for Shopify discounts.",
        },
      ];
    }

    const initialDiscountNodes = await fetchDiscountNodes(shop, accessToken);
    results.push(...await removeLegacyAutomaticDiscounts(shop, accessToken, initialDiscountNodes));

    const syncTasks = [
      async () => {
        const latestDiscountNodes = await fetchDiscountNodes(shop, accessToken);
        return ensureAutomaticAppDiscount(shop, accessToken, latestDiscountNodes);
      },
      async () => {
        const latestDiscountNodes = await fetchDiscountNodes(shop, accessToken);
        return ensureCodeBasicDiscount(shop, accessToken, latestDiscountNodes, {
        perfumeCollectionId,
        });
      },
    ];

    for (const runTask of syncTasks) {
      try {
        results.push(await runTask());
      } catch (error) {
        results.push({
          status: "error",
          title: "Discount sync error",
          message: error instanceof Error ? error.message : "Unknown discount sync error",
        });
      }
    }
  } catch (error) {
    results.push({
      status: "error",
      title: "Discount sync failed",
      message: error instanceof Error ? error.message : "Unknown discount sync failure",
    });
  }

  return results;
}
