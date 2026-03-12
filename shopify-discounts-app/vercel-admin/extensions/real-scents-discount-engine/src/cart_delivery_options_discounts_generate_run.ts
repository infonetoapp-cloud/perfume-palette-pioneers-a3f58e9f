import {
  CartDeliveryOptionsDiscountsGenerateRunResult,
  DeliveryDiscountSelectionStrategy,
  DeliveryInput,
  DiscountClass,
} from "../generated/api";

export function cartDeliveryOptionsDiscountsGenerateRun(
  input: DeliveryInput,
): CartDeliveryOptionsDiscountsGenerateRunResult {
  if (!input.cart.deliveryGroups.length) {
    return { operations: [] };
  }

  const hasShippingDiscountClass = input.discount.discountClasses.includes(DiscountClass.Shipping);
  if (!hasShippingDiscountClass) {
    return { operations: [] };
  }

  return {
    operations: [
      {
        deliveryDiscountsAdd: {
          candidates: input.cart.deliveryGroups.map((group) => ({
            message: "Free shipping on every order",
            targets: [
              {
                deliveryGroup: {
                  id: group.id,
                },
              },
            ],
            value: {
              percentage: {
                value: 100,
              },
            },
          })),
          selectionStrategy: DeliveryDiscountSelectionStrategy.All,
        },
      },
    ],
  };
}
