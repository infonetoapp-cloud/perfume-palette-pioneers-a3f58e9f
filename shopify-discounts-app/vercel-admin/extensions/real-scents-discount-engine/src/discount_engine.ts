export const BASE_PERFUME_PRICE_USD = 79.9;
export const ADDITIONAL_PERFUME_PRICE_USD = 40;
export const AUTO_SCENT_GIFT_VALUE_USD = 25;
export const SCENT10_CODE = "SCENT10";

export type DiscountLineKind = "perfume" | "auto-scent" | "other";

export interface DiscountLine {
  id: string;
  quantity: number;
  subtotal: number;
  kind: DiscountLineKind;
}

function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}

export function getTargetPerfumeSubtotal(perfumeCount: number): number {
  if (perfumeCount <= 0) return 0;
  return roundCurrency(BASE_PERFUME_PRICE_USD + ((perfumeCount - 1) * ADDITIONAL_PERFUME_PRICE_USD));
}

export function getPerfumePricingDiscount(lines: DiscountLine[]) {
  const perfumeLines = lines.filter((line) => line.kind === "perfume");
  const nonPerfumeLineIds = lines.filter((line) => line.kind !== "perfume").map((line) => line.id);
  const perfumeCount = perfumeLines.reduce((sum, line) => sum + line.quantity, 0);
  const perfumeSubtotal = roundCurrency(perfumeLines.reduce((sum, line) => sum + line.subtotal, 0));

  if (perfumeCount < 2) {
    return {
      perfumeCount,
      perfumeSubtotal,
      discountAmount: 0,
      excludedLineIds: nonPerfumeLineIds,
    };
  }

  const targetSubtotal = getTargetPerfumeSubtotal(perfumeCount);
  const discountAmount = roundCurrency(Math.max(0, perfumeSubtotal - targetSubtotal));

  return {
    perfumeCount,
    perfumeSubtotal,
    discountAmount,
    excludedLineIds: nonPerfumeLineIds,
  };
}

export function getComplimentaryGiftDiscount(lines: DiscountLine[]) {
  const perfumeCount = lines
    .filter((line) => line.kind === "perfume")
    .reduce((sum, line) => sum + line.quantity, 0);

  if (perfumeCount <= 0) {
    return null;
  }

  const autoScentLine = lines.find((line) => line.kind === "auto-scent");
  if (!autoScentLine || autoScentLine.quantity <= 0) {
    return null;
  }

  const unitPrice = roundCurrency(autoScentLine.subtotal / autoScentLine.quantity);
  const discountAmount = roundCurrency(Math.min(AUTO_SCENT_GIFT_VALUE_USD, unitPrice));

  if (discountAmount <= 0) {
    return null;
  }

  return {
    lineId: autoScentLine.id,
    discountAmount,
    quantity: 1,
  };
}

export function getRejectedScent10Codes(codes: Array<{ code: string; rejectable: boolean }>, perfumeCount: number) {
  if (perfumeCount === 1) {
    return [];
  }

  return codes.filter((code) => code.rejectable && code.code.trim().toUpperCase() === SCENT10_CODE);
}
