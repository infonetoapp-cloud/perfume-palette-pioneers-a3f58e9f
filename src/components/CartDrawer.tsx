import { useEffect, useMemo, useState } from "react";
import { ShoppingBag, Minus, Plus, Trash2, Loader2, Gift, TicketPercent } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useI18n } from "@/lib/i18n";
import { useStorefrontCatalog } from "@/stores/storefrontCatalogStore";
import {
  BUNDLE_PRICE_USD,
  BUNDLE_SIZE,
  GIFT_DETAILS,
  GIFT_LABEL,
  PROMO_CODE,
  formatUsd,
  getCartPromotionSummary,
  normalizePromoCode,
} from "@/lib/promotions";

interface CartDrawerProps {
  onOpenChange?: (open: boolean) => void;
}

function getPromoHelperText(status: ReturnType<typeof getCartPromotionSummary>["promoCodeStatus"]): string {
  switch (status) {
    case "applied":
      return `${PROMO_CODE} applied.`;
    case "blocked":
      return `${PROMO_CODE} cannot be combined with the 2-for-${formatUsd(BUNDLE_PRICE_USD)} offer.`;
    case "invalid":
      return "That code is not valid.";
    default:
      return `Use ${PROMO_CODE} for 10% off on eligible single-bottle orders.`;
  }
}

function getPromoHelperClass(status: ReturnType<typeof getCartPromotionSummary>["promoCodeStatus"]): string {
  switch (status) {
    case "applied":
      return "text-emerald-700";
    case "blocked":
    case "invalid":
      return "text-destructive";
    default:
      return "text-muted-foreground";
  }
}

function getNextBundleHint(totalItems: number): string | null {
  if (totalItems <= 0) return null;
  const remainder = totalItems % BUNDLE_SIZE;

  if (totalItems < BUNDLE_SIZE) {
    return `Add 1 more fragrance to unlock 2 for ${formatUsd(BUNDLE_PRICE_USD)}.`;
  }

  if (remainder === 1) {
    return `Add 1 more fragrance to bundle your next pair at ${formatUsd(BUNDLE_PRICE_USD)}.`;
  }

  return null;
}

export const CartDrawer = ({ onOpenChange }: CartDrawerProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const {
    items,
    promoCode,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
    setPromoCode,
    clearPromoCode,
  } = useCartStore();
  const { getProductByHandle } = useStorefrontCatalog();

  const liveItems = useMemo(
    () => items.map((item) => ({ ...item, product: getProductByHandle(item.product.handle) ?? item.product })),
    [getProductByHandle, items],
  );
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const checkoutUrl = getCheckoutUrl();
  const summary = useMemo(() => getCartPromotionSummary(totalItems, promoCode), [promoCode, totalItems]);
  const nextBundleHint = getNextBundleHint(totalItems);

  useEffect(() => {
    setPromoInput(promoCode);
  }, [promoCode]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  useEffect(() => {
    if (isOpen) {
      syncCart();
    }
  }, [isOpen, syncCart]);

  const handleApplyPromo = () => {
    const normalized = normalizePromoCode(promoInput);
    if (!normalized) {
      clearPromoCode();
      return;
    }
    setPromoCode(normalized);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button aria-label="Cart" className="relative text-foreground transition-colors hover:text-accent">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col bg-background sm:max-w-md">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-xl font-bold">{t("cart.title")}</SheetTitle>
          <SheetDescription className="font-body text-sm">
            {totalItems === 0 ? t("cart.empty") : `${totalItems} ${totalItems !== 1 ? t("cart.items") : t("cart.item")}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col pt-4">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <p className="font-body text-sm text-muted-foreground">{t("cart.empty")}</p>
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  Add a fragrance to preview bundle pricing, the {PROMO_CODE} code, and the complimentary gift.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-3">
                  {liveItems.map((item) => (
                    <div key={item.variantId} className="flex gap-3 rounded-xl bg-secondary p-3">
                      <div className="h-20 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                        {item.product.images[0] && (
                          <img
                            src={item.product.images[0].url}
                            alt={item.product.images[0].altText}
                            className="h-full w-full object-cover"
                          />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h4 className="truncate font-display text-sm font-semibold text-foreground">{item.product.title}</h4>
                        <p className="mt-0.5 font-body text-xs text-muted-foreground">
                          {item.selectedOptions.map((option) => option.value).join(" / ")}
                        </p>
                        <p className="mt-1 font-display text-sm font-bold text-foreground">
                          {formatUsd(parseFloat(item.product.price.amount))}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center font-body text-sm font-medium">{item.quantity}</span>
                          <button
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-foreground hover:bg-muted"
                            onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                          <button
                            className="ml-auto flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground hover:text-destructive"
                            onClick={() => removeItem(item.variantId)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 space-y-4 border-t border-border pt-4">
                <div className="rounded-2xl border border-border bg-secondary/20 p-4">
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-4 w-4 text-accent" />
                    <div>
                      <p className="font-body text-sm font-semibold text-foreground">{GIFT_LABEL} included</p>
                      <p className="mt-1 font-body text-xs leading-relaxed text-muted-foreground">{GIFT_DETAILS}</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-4">
                  <div className="flex items-start gap-3">
                    <TicketPercent className="mt-0.5 h-4 w-4 text-accent" />
                    <div className="w-full">
                      <p className="font-body text-sm font-semibold text-foreground">Promo code</p>
                      <div className="mt-3 flex gap-2">
                        <Input
                          value={promoInput}
                          onChange={(event) => setPromoInput(event.target.value)}
                          placeholder={PROMO_CODE}
                          className="h-10 rounded-full"
                        />
                        <Button type="button" variant="outline" className="rounded-full px-4" onClick={handleApplyPromo}>
                          Apply
                        </Button>
                      </div>
                      <p className={`mt-2 font-body text-xs leading-relaxed ${getPromoHelperClass(summary.promoCodeStatus)}`}>
                        {getPromoHelperText(summary.promoCodeStatus)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                    <span>Merchandise subtotal</span>
                    <span>{formatUsd(summary.baseSubtotal)}</span>
                  </div>

                  {summary.bundle.isApplied && (
                    <div className="flex items-center justify-between font-body text-sm text-emerald-700">
                      <span>Bundle savings ({summary.bundle.pairCount} pair)</span>
                      <span>-{formatUsd(summary.bundle.savings)}</span>
                    </div>
                  )}

                  {summary.promoCodeDiscount > 0 && (
                    <div className="flex items-center justify-between font-body text-sm text-emerald-700">
                      <span>{PROMO_CODE} discount</span>
                      <span>-{formatUsd(summary.promoCodeDiscount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between border-t border-border pt-3">
                    <span className="font-display text-base font-semibold">{t("cart.total")}</span>
                    <span className="font-display text-lg font-bold">{formatUsd(summary.finalSubtotal)}</span>
                  </div>
                  <p className="font-body text-[11px] text-muted-foreground">Free U.S. shipping.</p>

                  {nextBundleHint && (
                    <p className="rounded-2xl border border-accent/20 bg-accent/5 px-3 py-2 font-body text-xs leading-relaxed text-accent">
                      {nextBundleHint}
                    </p>
                  )}
                </div>

                <p className="font-body text-xs leading-relaxed text-muted-foreground">{t("cart.previewNote")}</p>
                {checkoutUrl ? (
                  <Button
                    asChild
                    className="w-full rounded-full bg-primary font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-foreground/80"
                    size="lg"
                    disabled={items.length === 0 || isLoading || isSyncing}
                  >
                    <a href={checkoutUrl} target="_blank" rel="noreferrer">
                      {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
                    </a>
                  </Button>
                ) : (
                  <Button
                    className="w-full rounded-full bg-primary font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-foreground/80"
                    size="lg"
                    disabled
                  >
                    {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : "Checkout"}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
