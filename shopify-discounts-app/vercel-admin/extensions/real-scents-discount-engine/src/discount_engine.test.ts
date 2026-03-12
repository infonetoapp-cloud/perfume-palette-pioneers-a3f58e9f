import { describe, expect, it } from "vitest";

import {
  getComplimentaryGiftDiscount,
  getPerfumePricingDiscount,
  getRejectedScent10Codes,
  getTargetPerfumeSubtotal,
} from "./discount_engine";

describe("discount engine pricing", () => {
  it("prices the first perfume at 79.90 and each additional perfume at 40", () => {
    expect(getTargetPerfumeSubtotal(0)).toBe(0);
    expect(getTargetPerfumeSubtotal(1)).toBe(79.9);
    expect(getTargetPerfumeSubtotal(2)).toBe(119.9);
    expect(getTargetPerfumeSubtotal(3)).toBe(159.9);
    expect(getTargetPerfumeSubtotal(4)).toBe(199.9);
  });

  it("computes the correct order discount for two perfumes and a car scent", () => {
    const result = getPerfumePricingDiscount([
      { id: "perfume-1", quantity: 1, subtotal: 79.9, kind: "perfume" },
      { id: "perfume-2", quantity: 1, subtotal: 79.9, kind: "perfume" },
      { id: "gift", quantity: 1, subtotal: 25, kind: "auto-scent" },
    ]);

    expect(result.perfumeCount).toBe(2);
    expect(result.discountAmount).toBe(39.9);
    expect(result.excludedLineIds).toEqual(["gift"]);
  });

  it("computes the correct order discount for four perfumes", () => {
    const result = getPerfumePricingDiscount([
      { id: "perfume-1", quantity: 2, subtotal: 159.8, kind: "perfume" },
      { id: "perfume-2", quantity: 2, subtotal: 159.8, kind: "perfume" },
    ]);

    expect(result.perfumeCount).toBe(4);
    expect(result.discountAmount).toBe(119.7);
  });
});

describe("discount engine gifts", () => {
  it("makes one auto scent complimentary when the cart includes perfume", () => {
    const result = getComplimentaryGiftDiscount([
      { id: "perfume", quantity: 1, subtotal: 79.9, kind: "perfume" },
      { id: "auto", quantity: 2, subtotal: 50, kind: "auto-scent" },
    ]);

    expect(result).toEqual({
      lineId: "auto",
      discountAmount: 25,
      quantity: 1,
    });
  });

  it("does not create a gift discount for car scent-only carts", () => {
    const result = getComplimentaryGiftDiscount([
      { id: "auto", quantity: 1, subtotal: 25, kind: "auto-scent" },
    ]);

    expect(result).toBeNull();
  });
});

describe("discount engine promo code rules", () => {
  it("rejects SCENT10 when the cart is not a single perfume order", () => {
    const result = getRejectedScent10Codes(
      [
        { code: "SCENT10", rejectable: true },
        { code: "OTHER", rejectable: true },
      ],
      2,
    );

    expect(result).toEqual([{ code: "SCENT10", rejectable: true }]);
  });

  it("keeps SCENT10 available on one-perfume orders", () => {
    const result = getRejectedScent10Codes([{ code: "SCENT10", rejectable: true }], 1);
    expect(result).toEqual([]);
  });
});
