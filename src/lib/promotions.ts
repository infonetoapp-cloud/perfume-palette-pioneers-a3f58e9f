export const BASE_FRAGRANCE_PRICE_USD = 79.9;
export const BASE_AUTO_SCENT_PRICE_USD = 25;
export const BUNDLE_SIZE = 2;
export const BUNDLE_PRICE_USD = 119.9;
export const PROMO_CODE = "SCENT10";
export const PROMO_CODE_DISCOUNT_RATE = 0.1;
export const GIFT_LABEL = "Free car scent";
export const GIFT_ORDER_LABEL = "1 free car scent per perfume order";
export const GIFT_DETAILS = "Perfume orders include 1 free car scent per order. Car scent-only orders do not include an extra free car scent.";

export type PromoCodeStatus = "idle" | "applied" | "invalid" | "blocked";
export type CartItemKind = "perfume" | "auto-scent";
export type ComplimentaryGiftMode = "none" | "virtual" | "existing-auto-scent";

export interface CartPromotionItem {
  kind: CartItemKind;
  unitPrice: number;
  quantity: number;
  title: string;
  variantId: string;
  managedGift?: boolean;
}

export interface BundlePricingSummary {
  pairCount: number;
  discountedSubtotal: number;
  savings: number;
  isApplied: boolean;
}

export interface ComplimentaryGiftSummary {
  eligible: boolean;
  mode: ComplimentaryGiftMode;
  title: string | null;
  variantId: string | null;
  value: number;
  savings: number;
}

export interface CartPromotionSummary {
  itemCount: number;
  perfumeCount: number;
  autoScentCount: number;
  baseSubtotal: number;
  perfumeSubtotal: number;
  autoScentSubtotal: number;
  payableAutoScentSubtotal: number;
  bundle: BundlePricingSummary;
  promoCode: string;
  promoCodeStatus: PromoCodeStatus;
  promoCodeDiscount: number;
  complimentaryGift: ComplimentaryGiftSummary;
  complimentaryGiftEligible: boolean;
  finalSubtotal: number;
}

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getBaseFragrancePriceAmount(): string {
  return BASE_FRAGRANCE_PRICE_USD.toFixed(2);
}

export function normalizePromoCode(code: string): string {
  return code.trim().toUpperCase();
}

export function getBundlePricing(perfumeCount: number): BundlePricingSummary {
  if (perfumeCount < BUNDLE_SIZE) {
    return {
      pairCount: 0,
      discountedSubtotal: roundCurrency(perfumeCount * BASE_FRAGRANCE_PRICE_USD),
      savings: 0,
      isApplied: false,
    };
  }

  const pairCount = Math.floor(perfumeCount / BUNDLE_SIZE);
  const remainder = perfumeCount % BUNDLE_SIZE;
  const baseSubtotal = perfumeCount * BASE_FRAGRANCE_PRICE_USD;
  const discountedSubtotal = roundCurrency((pairCount * BUNDLE_PRICE_USD) + (remainder * BASE_FRAGRANCE_PRICE_USD));
  const savings = roundCurrency(baseSubtotal - discountedSubtotal);

  return {
    pairCount,
    discountedSubtotal,
    savings,
    isApplied: pairCount > 0,
  };
}

export function getCartPromotionSummary(items: CartPromotionItem[], promoCodeInput = ""): CartPromotionSummary {
  const perfumeItems = items.filter((item) => item.kind === "perfume");
  const autoScentItems = items.filter((item) => item.kind === "auto-scent");

  const perfumeCount = perfumeItems.reduce((sum, item) => sum + item.quantity, 0);
  const autoScentCount = autoScentItems.reduce((sum, item) => sum + item.quantity, 0);
  const itemCount = perfumeCount + autoScentCount;

  const perfumeSubtotal = roundCurrency(
    perfumeItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
  );
  const autoScentSubtotal = roundCurrency(
    autoScentItems.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0),
  );
  const baseSubtotal = roundCurrency(perfumeSubtotal + autoScentSubtotal);

  const bundle = getBundlePricing(perfumeCount);
  const discountedPerfumeSubtotal = bundle.isApplied ? bundle.discountedSubtotal : perfumeSubtotal;

  const promoCode = normalizePromoCode(promoCodeInput);
  let promoCodeStatus: PromoCodeStatus = "idle";
  let promoCodeDiscount = 0;

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
  const complimentaryGift: ComplimentaryGiftSummary = complimentaryGiftEligible
    ? firstAutoScentItem
      ? {
          eligible: true,
          mode: "existing-auto-scent",
          title: firstAutoScentItem.title,
          variantId: firstAutoScentItem.variantId,
          value: roundCurrency(firstAutoScentItem.unitPrice),
          savings: roundCurrency(firstAutoScentItem.unitPrice),
        }
      : {
          eligible: true,
          mode: "virtual",
          title: null,
          variantId: null,
          value: BASE_AUTO_SCENT_PRICE_USD,
          savings: 0,
        }
    : {
        eligible: false,
        mode: "none",
        title: null,
        variantId: null,
        value: 0,
        savings: 0,
      };

  const payableAutoScentSubtotal = roundCurrency(
    Math.max(0, autoScentSubtotal - complimentaryGift.savings),
  );
  const finalSubtotal = roundCurrency(
    discountedPerfumeSubtotal + payableAutoScentSubtotal - promoCodeDiscount,
  );

  return {
    itemCount,
    perfumeCount,
    autoScentCount,
    baseSubtotal,
    perfumeSubtotal,
    autoScentSubtotal,
    payableAutoScentSubtotal,
    bundle,
    promoCode,
    promoCodeStatus,
    promoCodeDiscount,
    complimentaryGift,
    complimentaryGiftEligible,
    finalSubtotal,
  };
}
