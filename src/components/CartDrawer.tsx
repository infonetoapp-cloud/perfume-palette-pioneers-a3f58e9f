import { useEffect, useState } from "react";
import { ShoppingBag, Minus, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useCartStore } from "@/stores/cartStore";
import { useI18n } from "@/lib/i18n";

export const CartDrawer = () => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + parseFloat(item.price.amount) * item.quantity, 0);
  const checkoutUrl = getCheckoutUrl();

  useEffect(() => {
    if (isOpen) {
      syncCart();
    }
  }, [isOpen, syncCart]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
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
              </div>
            </div>
          ) : (
            <>
              <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-3">
                  {items.map((item) => (
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
                          ${parseFloat(item.price.amount).toFixed(0)}
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

              <div className="flex-shrink-0 space-y-3 border-t border-border pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-display text-base font-semibold">{t("cart.total")}</span>
                  <span className="font-display text-lg font-bold">${totalPrice.toFixed(0)}</span>
                </div>
                <p className="font-body text-xs leading-relaxed text-muted-foreground">{t("cart.previewNote")}</p>
                <Button
                  className="w-full rounded-full bg-primary font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground hover:bg-foreground/80"
                  size="lg"
                  disabled={items.length === 0 || isLoading || isSyncing || !checkoutUrl}
                >
                  {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : t("cart.previewCheckout")}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
