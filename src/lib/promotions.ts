export const BASE_FRAGRANCE_PRICE_USD = 79.9;
export const BUNDLE_SIZE = 2;
export const BUNDLE_PRICE_USD = 119.9;
export const PROMO_CODE = "SCENT10";
export const PROMO_CODE_DISCOUNT_RATE = 0.1;
export const GIFT_LABEL = "Complimentary car fragrance";
export const GIFT_DETAILS = "One per order. Promotional gift, not part of the item price.";

export type PromoCodeStatus = "idle" | "applied" | "invalid" | "blocked";

export interface BundlePricingSummary {
  pairCount: number;
  discountedSubtotal: number;
  savings: number;
  isApplied: boolean;
}

export interface CartPromotionSummary {
  itemCount: number;
  baseSubtotal: number;
  bundle: BundlePricingSummary;
  promoCode: string;
  promoCodeStatus: PromoCodeStatus;
  promoCodeDiscount: number;
  finalSubtotal: number;
  complimentaryGiftEligible: boolean;
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

export function getBundlePricing(itemCount: number): BundlePricingSummary {
  if (itemCount < BUNDLE_SIZE) {
    return {
      pairCount: 0,
      discountedSubtotal: roundCurrency(itemCount * BASE_FRAGRANCE_PRICE_USD),
      savings: 0,
      isApplied: false,
    };
  }

  const pairCount = Math.floor(itemCount / BUNDLE_SIZE);
  const remainder = itemCount % BUNDLE_SIZE;
  const baseSubtotal = itemCount * BASE_FRAGRANCE_PRICE_USD;
  const discountedSubtotal = roundCurrency((pairCount * BUNDLE_PRICE_USD) + (remainder * BASE_FRAGRANCE_PRICE_USD));
  const savings = roundCurrency(baseSubtotal - discountedSubtotal);

  return {
    pairCount,
    discountedSubtotal,
    savings,
    isApplied: pairCount > 0,
  };
}

export function getCartPromotionSummary(itemCount: number, promoCodeInput = ""): CartPromotionSummary {
  const baseSubtotal = roundCurrency(itemCount * BASE_FRAGRANCE_PRICE_USD);
  const bundle = getBundlePricing(itemCount);
  const promoCode = normalizePromoCode(promoCodeInput);
  let promoCodeStatus: PromoCodeStatus = "idle";
  let promoCodeDiscount = 0;

  if (promoCode) {
    if (promoCode !== PROMO_CODE) {
      promoCodeStatus = "invalid";
    } else if (bundle.isApplied) {
      promoCodeStatus = "blocked";
    } else {
      promoCodeStatus = "applied";
      promoCodeDiscount = roundCurrency(baseSubtotal * PROMO_CODE_DISCOUNT_RATE);
    }
  }

  const subtotalAfterBundle = bundle.isApplied ? bundle.discountedSubtotal : baseSubtotal;
  const finalSubtotal = roundCurrency(subtotalAfterBundle - promoCodeDiscount);

  return {
    itemCount,
    baseSubtotal,
    bundle,
    promoCode,
    promoCodeStatus,
    promoCodeDiscount,
    finalSubtotal,
    complimentaryGiftEligible: itemCount > 0,
  };
}
