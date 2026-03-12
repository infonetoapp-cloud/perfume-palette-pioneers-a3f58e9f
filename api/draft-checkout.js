import { SHOPIFY_AUTO_SCENT_PRODUCT } from "./shopify-admin/_auto-scent.js";
import { SHOPIFY_SYNC_PRODUCTS } from "./shopify-admin/_catalog.js";
import { createDraftOrder, fetchVariantSnapshots } from "./shopify-admin/_admin.js";

const BASE_FRAGRANCE_PRICE_USD = 79.9;
const BASE_AUTO_SCENT_PRICE_USD = 25;
const ADDITIONAL_PERFUME_PRICE_USD = 40;
const PROMO_CODE = "SCENT10";
const PROMO_CODE_DISCOUNT_RATE = 0.1;

const AUTO_SCENT_HANDLE = SHOPIFY_AUTO_SCENT_PRODUCT.handle;
const PERFUME_HANDLES = new Set(
  SHOPIFY_SYNC_PRODUCTS
    .map((product) => product.handle)
    .filter((handle) => handle !== AUTO_SCENT_HANDLE),
);

function roundCurrency(amount) {
  return Math.round(amount * 100) / 100;
}

function normalizePromoCode(code) {
  return String(code || "").trim().toUpperCase();
}

function isValidVariantGid(variantId) {
  return typeof variantId === "string" && /^gid:\/\/shopify\/ProductVariant\/\d+$/i.test(variantId);
}

function isPositiveWholeNumber(value) {
  return Number.isInteger(value) && value > 0;
}

function getBundlePricing(perfumeCount) {
  if (perfumeCount < 2) {
    return {
      discountedBottleCount: 0,
      discountedSubtotal: roundCurrency(perfumeCount * BASE_FRAGRANCE_PRICE_USD),
      savings: 0,
      isApplied: false,
    };
  }

  const discountedBottleCount = Math.max(0, perfumeCount - 1);
  const baseSubtotal = perfumeCount * BASE_FRAGRANCE_PRICE_USD;
  const discountedSubtotal = roundCurrency(
    BASE_FRAGRANCE_PRICE_USD + (discountedBottleCount * ADDITIONAL_PERFUME_PRICE_USD),
  );

  return {
    discountedBottleCount,
    discountedSubtotal,
    savings: roundCurrency(baseSubtotal - discountedSubtotal),
    isApplied: discountedBottleCount > 0,
  };
}

function getCartPromotionSummary(items, promoCodeInput = "") {
  const perfumeItems = items.filter((item) => item.kind === "perfume");
  const autoScentItems = items.filter((item) => item.kind === "auto-scent");

  const perfumeCount = perfumeItems.reduce((sum, item) => sum + item.quantity, 0);
  const autoScentCount = autoScentItems.reduce((sum, item) => sum + item.quantity, 0);

  const perfumeSubtotal = roundCurrency(
    perfumeItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
  );
  const autoScentSubtotal = roundCurrency(
    autoScentItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
  );

  const bundle = getBundlePricing(perfumeCount);
  const discountedPerfumeSubtotal = bundle.isApplied ? bundle.discountedSubtotal : perfumeSubtotal;

  const promoCode = normalizePromoCode(promoCodeInput);
  let promoCodeDiscount = 0;
  let promoCodeStatus = "idle";

  if (promoCode) {
    if (promoCode !== PROMO_CODE) {
      promoCodeStatus = "invalid";
    } else if (bundle.isApplied) {
      promoCodeStatus = "blocked";
    } else if (perfumeCount === 1) {
      promoCodeStatus = "applied";
      promoCodeDiscount = roundCurrency(BASE_FRAGRANCE_PRICE_USD * PROMO_CODE_DISCOUNT_RATE);
    } else {
      promoCodeStatus = "invalid";
    }
  }

  const complimentaryGiftEligible = perfumeCount > 0;
  const firstAutoScentItem = autoScentItems.find((item) => item.managedGift) ?? autoScentItems[0] ?? null;
  const complimentaryGift = complimentaryGiftEligible
    ? firstAutoScentItem
      ? {
          mode: "existing-auto-scent",
          variantId: firstAutoScentItem.variantId,
          value: roundCurrency(firstAutoScentItem.unitPrice),
          savings: roundCurrency(firstAutoScentItem.unitPrice),
        }
      : {
          mode: "virtual",
          variantId: null,
          value: BASE_AUTO_SCENT_PRICE_USD,
          savings: 0,
        }
    : {
        mode: "none",
        variantId: null,
        value: 0,
        savings: 0,
      };

  return {
    perfumeCount,
    autoScentCount,
    bundle,
    promoCode,
    promoCodeStatus,
    promoCodeDiscount,
    complimentaryGiftEligible,
    complimentaryGift,
    finalSubtotal: roundCurrency(
      discountedPerfumeSubtotal
      + Math.max(0, autoScentSubtotal - complimentaryGift.savings)
      - promoCodeDiscount,
    ),
  };
}

function createLineDiscount(title, description, amount) {
  const value = roundCurrency(amount).toFixed(2);

  return {
    title,
    description,
    value_type: "fixed_amount",
    value,
    amount: value,
  };
}

function getVariantLegacyId(snapshot) {
  const parsed = Number.parseInt(String(snapshot.legacyResourceId || ""), 10);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Variant ${snapshot.id} is missing a valid legacyResourceId.`);
  }

  return parsed;
}

function buildDraftOrderLineItems(items, summary) {
  const lineItems = [];

  for (const item of items.filter((entry) => entry.kind === "perfume")) {
    lineItems.push({
      variant_id: getVariantLegacyId(item.snapshot),
      quantity: item.quantity,
    });
  }

  const sortedAutoScentItems = items
    .filter((entry) => entry.kind === "auto-scent")
    .sort((left, right) => Number(Boolean(right.managedGift)) - Number(Boolean(left.managedGift)));

  let remainingGiftCount = summary.complimentaryGiftEligible ? 1 : 0;

  for (const item of sortedAutoScentItems) {
    const giftQuantity = Math.min(item.quantity, remainingGiftCount);
    const paidQuantity = item.quantity - giftQuantity;

    if (giftQuantity > 0) {
      lineItems.push({
        variant_id: getVariantLegacyId(item.snapshot),
        quantity: giftQuantity,
        applied_discount: createLineDiscount(
          "Free car scent",
          "Complimentary with perfume order",
          item.unitPrice * giftQuantity,
        ),
      });
      remainingGiftCount -= giftQuantity;
    }

    if (paidQuantity > 0) {
      lineItems.push({
        variant_id: getVariantLegacyId(item.snapshot),
        quantity: paidQuantity,
      });
    }
  }

  return lineItems;
}

function buildOrderDiscount(summary) {
  const savings = roundCurrency(summary.bundle.savings + summary.promoCodeDiscount);
  if (savings <= 0) return null;

  const parts = [];

  if (summary.bundle.isApplied) {
    parts.push(`${summary.perfumeCount} perfumes for ${summary.finalSubtotal.toFixed(2)}`);
  }

  if (summary.promoCodeStatus === "applied") {
    parts.push(`${PROMO_CODE} applied`);
  }

  return createLineDiscount(
    "Real Scents pricing",
    parts.join(" · ") || "Real Scents checkout pricing",
    savings,
  );
}

function buildNoteAttributes(summary) {
  return [
    { name: "checkout_source", value: "headless-draft-order" },
    { name: "perfume_count", value: String(summary.perfumeCount) },
    { name: "auto_scent_count", value: String(summary.autoScentCount) },
    { name: "promo_code", value: summary.promoCode || "" },
  ];
}

function getKindFromHandle(handle) {
  if (handle === AUTO_SCENT_HANDLE) return "auto-scent";
  if (PERFUME_HANDLES.has(handle)) return "perfume";
  return null;
}

async function buildValidatedCartItems(rawItems, managedGiftVariantId) {
  const normalizedItems = rawItems
    .map((item) => ({
      variantId: String(item?.variantId || "").trim(),
      quantity: Number(item?.quantity),
    }))
    .filter((item) => isValidVariantGid(item.variantId) && isPositiveWholeNumber(item.quantity));

  if (normalizedItems.length === 0) {
    throw new Error("No valid cart items were provided.");
  }

  if (normalizedItems.length > 20) {
    throw new Error("Cart contains too many distinct items for draft checkout.");
  }

  const snapshotMap = await fetchVariantSnapshots([...new Set(normalizedItems.map((item) => item.variantId))]);

  const validatedItems = normalizedItems.map((item) => {
    const snapshot = snapshotMap.get(item.variantId);

    if (!snapshot?.product?.handle) {
      throw new Error(`Variant ${item.variantId} could not be verified in Shopify.`);
    }

    const kind = getKindFromHandle(snapshot.product.handle);
    if (!kind) {
      throw new Error(`Product ${snapshot.product.title} is not eligible for draft checkout pricing.`);
    }

    return {
      variantId: snapshot.id,
      quantity: item.quantity,
      unitPrice: Number.parseFloat(snapshot.price),
      kind,
      managedGift: snapshot.id === managedGiftVariantId,
      snapshot,
    };
  });

  const hasAutoScent = validatedItems.some((item) => item.kind === "auto-scent");
  if (!hasAutoScent && isValidVariantGid(managedGiftVariantId)) {
    const extraSnapshotMap = await fetchVariantSnapshots([managedGiftVariantId]);
    const managedGiftSnapshot = extraSnapshotMap.get(managedGiftVariantId);

    if (managedGiftSnapshot?.product?.handle === AUTO_SCENT_HANDLE) {
      validatedItems.push({
        variantId: managedGiftSnapshot.id,
        quantity: 1,
        unitPrice: Number.parseFloat(managedGiftSnapshot.price),
        kind: "auto-scent",
        managedGift: true,
        snapshot: managedGiftSnapshot,
      });
    }
  }

  return validatedItems;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const rawItems = Array.isArray(payload?.items) ? payload.items : [];
    const promoCode = normalizePromoCode(payload?.promoCode);
    const managedGiftVariantId = String(payload?.managedGiftVariantId || "").trim();

    const validatedItems = await buildValidatedCartItems(rawItems, managedGiftVariantId);
    const summary = getCartPromotionSummary(validatedItems, promoCode);
    const lineItems = buildDraftOrderLineItems(validatedItems, summary);
    const appliedDiscount = buildOrderDiscount(summary);

    const draftOrder = await createDraftOrder({
      line_items: lineItems,
      shipping_line: {
        title: "Free shipping",
        price: "0.00",
        custom: true,
      },
      applied_discount: appliedDiscount,
      allow_discount_codes_in_checkout: false,
      note: "Created by Real Scents headless checkout engine",
      note_attributes: buildNoteAttributes(summary),
      tags: "real-scents-draft-checkout",
    });

    return res.status(200).json({
      checkoutUrl: draftOrder.invoice_url,
      draftOrderId: draftOrder.id,
      summary: {
        finalSubtotal: summary.finalSubtotal,
        perfumeCount: summary.perfumeCount,
        autoScentCount: summary.autoScentCount,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Draft checkout creation failed",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
