import type { CartItem } from "@/stores/cartStore";

interface DraftCheckoutResponse {
  checkoutUrl: string;
  draftOrderId: number;
  summary: {
    finalSubtotal: number;
    perfumeCount: number;
    autoScentCount: number;
  };
}

export async function createDraftCheckout(items: CartItem[], promoCode: string, managedGiftVariantId: string | null) {
  const response = await fetch("/api/draft-checkout.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: items.map((item) => ({
        variantId: item.variantId,
        quantity: item.quantity,
      })),
      promoCode,
      managedGiftVariantId,
    }),
  });

  const payload = await response.json();

  if (!response.ok || !payload?.checkoutUrl) {
    throw new Error(payload?.detail || payload?.error || "Draft checkout could not be created.");
  }

  return payload as DraftCheckoutResponse;
}
