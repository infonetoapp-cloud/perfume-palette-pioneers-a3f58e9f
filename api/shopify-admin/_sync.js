import { SHOPIFY_SYNC_PRODUCTS } from "./_catalog.js";
import { SHOPIFY_SYNC_COLLECTION_IMAGES } from "./_collections.js";

const SHOPIFY_ADMIN_API_VERSION = process.env.SHOPIFY_ADMIN_API_VERSION || "2025-07";

const SHOPIFY_SYNC_COLLECTIONS = [
  {
    title: "All Perfumes",
    handle: "all-perfumes",
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

async function adminRestRequest({ shop, accessToken, path, method = "GET", body }) {
  const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_ADMIN_API_VERSION}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.text();
  let json = null;

  try {
    json = payload ? JSON.parse(payload) : null;
  } catch {
    json = null;
  }

  if (!response.ok) {
    throw new Error(`Shopify REST ${method} ${path} failed (${response.status}): ${payload}`);
  }

  return json;
}

async function adminGraphqlRequest({ shop, accessToken, query, variables = {} }) {
  const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_ADMIN_API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(`Shopify GraphQL failed (${response.status}): ${JSON.stringify(payload)}`);
  }

  if (payload.errors?.length) {
    throw new Error(`Shopify GraphQL errors: ${payload.errors.map((error) => error.message).join(", ")}`);
  }

  return payload.data;
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

function buildRestProductPayload(product, existingProduct = null) {
  const variant = existingProduct?.variants?.[0] ?? null;

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
      options: [
        {
          name: "Size",
          values: ["50ml / 1.7oz"],
        },
      ],
      variants: [
        {
          ...(variant?.id ? { id: variant.id } : {}),
          option1: "50ml / 1.7oz",
          price: product.price,
          sku: product.code,
          taxable: true,
          requires_shipping: true,
          inventory_policy: "continue",
          inventory_management: null,
        },
      ],
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
    body: {
      image,
    },
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
        message: `Collection ${action}, but publication failed: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      continue;
    }

    results.push({
      handle: collection.handle,
      title: collection.title,
      action,
      message: `Collection ${action} and published successfully.`,
    });
  }

  return results;
}
