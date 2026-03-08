import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

export const CartDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart } = useCartStore();
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (parseFloat(item.price.amount) * item.quantity), 0);

  useEffect(() => { if (isOpen) syncCart(); }, [isOpen, syncCart]);

  const handleCheckout = () => {
    const checkoutUrl = getCheckoutUrl();
    if (checkoutUrl) {
      window.open(checkoutUrl, '_blank');
      setIsOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button aria-label="Sepet" className="relative text-foreground transition-colors hover:text-accent">
          <ShoppingBag size={20} />
          {totalItems > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {totalItems}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full bg-background">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle className="font-display text-xl font-bold">Sepet</SheetTitle>
          <SheetDescription className="font-body text-sm">
            {totalItems === 0 ? "Sepetiniz boş" : `${totalItems} ürün`}
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col flex-1 pt-4 min-h-0">
          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground font-body text-sm">Sepetiniz boş</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto pr-1 min-h-0">
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.variantId} className="flex gap-3 rounded-xl bg-secondary p-3">
                      <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-muted">
                        {item.product.node.images?.edges?.[0]?.node && (
                          <img src={item.product.node.images.edges[0].node.url} alt={item.product.node.title} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-display text-sm font-semibold text-foreground truncate">{item.product.node.title}</h4>
                        <p className="text-xs text-muted-foreground font-body mt-0.5">{item.selectedOptions.map(o => o.value).join(' · ')}</p>
                        <p className="font-display text-sm font-bold mt-1 text-foreground">
                          {parseFloat(item.price.amount).toFixed(0)} {item.price.currencyCode === "TRY" ? "₺" : item.price.currencyCode}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button className="h-7 w-7 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-muted" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-6 text-center text-sm font-body font-medium">{item.quantity}</span>
                          <button className="h-7 w-7 flex items-center justify-center rounded-full border border-border text-foreground hover:bg-muted" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </button>
                          <button className="ml-auto h-7 w-7 flex items-center justify-center rounded-full text-muted-foreground hover:text-destructive" onClick={() => removeItem(item.variantId)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-shrink-0 space-y-3 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="font-display text-base font-semibold">Toplam</span>
                  <span className="font-display text-lg font-bold">
                    {totalPrice.toFixed(0)} {items[0]?.price.currencyCode === "TRY" ? "₺" : items[0]?.price.currencyCode || "TRY"}
                  </span>
                </div>
                <Button
                  onClick={handleCheckout}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-foreground/80 font-body text-sm font-semibold uppercase tracking-wider"
                  size="lg"
                  disabled={items.length === 0 || isLoading || isSyncing}
                >
                  {isLoading || isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <><ExternalLink className="w-4 h-4 mr-2" />ÖDEMEYE GEÇ</>}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
