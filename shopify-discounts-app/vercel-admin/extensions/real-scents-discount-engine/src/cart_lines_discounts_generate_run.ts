import {
  CartInput,
  CartLinesDiscountsGenerateRunResult,
  DiscountClass,
  OrderDiscountSelectionStrategy,
  ProductDiscountSelectionStrategy,
} from "../generated/api";
import {
  getComplimentaryGiftDiscount,
  getPerfumePricingDiscount,
  getRejectedScent10Codes,
  type DiscountLine,
} from "./discount_engine";

function parseMoney(amount: string | number): number {
  return typeof amount === "number" ? amount : Number.parseFloat(amount);
}

function getLineKind(line: CartInput["cart"]["lines"][number]): DiscountLine["kind"] {
  if (line.merchandise.__typename !== "ProductVariant") {
    return "other";
  }

  const product = line.merchandise.product;
  const productType = product.productType?.toLowerCase() ?? "";
  const handle = product.handle.toLowerCase();

  if (
    product.hasAnyTag
    || productType.includes("car scent")
    || handle.includes("auto-scent")
  ) {
    return "auto-scent";
  }

  if (productType.includes("perfume") || productType.includes("fragrance")) {
    return "perfume";
  }

  return "other";
}

function toDiscountLines(input: CartInput): DiscountLine[] {
  return input.cart.lines.map((line) => ({
    id: line.id,
    quantity: line.quantity,
    subtotal: parseMoney(line.cost.subtotalAmount.amount),
    kind: getLineKind(line),
  }));
}

export function cartLinesDiscountsGenerateRun(
  input: CartInput,
): CartLinesDiscountsGenerateRunResult {
  if (!input.cart.lines.length) {
    return { operations: [] };
  }

  const hasOrderDiscountClass = input.discount.discountClasses.includes(DiscountClass.Order);
  const hasProductDiscountClass = input.discount.discountClasses.includes(DiscountClass.Product);

  if (!hasOrderDiscountClass && !hasProductDiscountClass) {
    return { operations: [] };
  }

  const discountLines = toDiscountLines(input);
  const pricing = getPerfumePricingDiscount(discountLines);
  const complimentaryGift = getComplimentaryGiftDiscount(discountLines);
  const rejectedCodes = getRejectedScent10Codes(input.enteredDiscountCodes, pricing.perfumeCount);

  const operations: CartLinesDiscountsGenerateRunResult["operations"] = [];

  if (rejectedCodes.length > 0) {
    operations.push({
      enteredDiscountCodesReject: {
        codes: rejectedCodes.map(({ code }) => ({ code })),
        message: "SCENT10 applies to single-bottle perfume orders only.",
      },
    });
  }

  if (hasOrderDiscountClass && pricing.discountAmount > 0) {
    operations.push({
      orderDiscountsAdd: {
        candidates: [
          {
            message: "2 perfumes for $119.90, then +$40 each additional bottle",
            targets: [
              {
                orderSubtotal: {
                  excludedCartLineIds: pricing.excludedLineIds,
                },
              },
            ],
            value: {
              fixedAmount: {
                amount: pricing.discountAmount,
              },
            },
          },
        ],
        selectionStrategy: OrderDiscountSelectionStrategy.First,
      },
    });
  }

  if (hasProductDiscountClass && complimentaryGift) {
    operations.push({
      productDiscountsAdd: {
        candidates: [
          {
            message: "Complimentary car scent with your perfume order",
            targets: [
              {
                cartLine: {
                  id: complimentaryGift.lineId,
                  quantity: complimentaryGift.quantity,
                },
              },
            ],
            value: {
              fixedAmount: {
                amount: complimentaryGift.discountAmount,
                appliesToEachItem: false,
              },
            },
          },
        ],
        selectionStrategy: ProductDiscountSelectionStrategy.First,
      },
    });
  }

  return { operations };
}
