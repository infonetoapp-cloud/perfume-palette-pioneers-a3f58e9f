import { useEffect, useMemo, useRef, useState } from "react";
import { Gift, Loader2, Minus, Plus, ShoppingBag, Sparkles, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getAutoScentVariant, getAutoScentVariants, type AutoScentVariant } from "@/lib/autoScents";
import type { CatalogProduct } from "@/lib/catalogData";
import {
  BASE_AUTO_SCENT_PRICE_USD,
  BUNDLE_PRICE_USD,
  BUNDLE_SIZE,
  PROMO_CODE,
  formatUsd,
  getCartPromotionSummary,
  normalizePromoCode,
  type CartItemKind,
  type CartPromotionItem,
} from "@/lib/promotions";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { useCartStore, type CartItem } from "@/stores/cartStore";
import { useStorefrontCatalog } from "@/stores/storefrontCatalogStore";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface CartDrawerProps {
  onOpenChange?: (open: boolean) => void;
}

interface CartDisplayRow {
  key: string;
  kind: CartItemKind | "complimentary-gift";
  title: string;
  subtitle: string;
  imageUrl: string | null;
  imageAlt: string;
  quantity: number;
  totalPrice: number;
  compareAtPrice: number | null;
  helper: string | null;
  editable?: boolean;
  sourceItem?: CartItem;
}

function getCartItemKind(item: CartItem): CartItemKind {
  if (
    item.product.code === "AUTO-SCENT"
    || item.product.handle.toLowerCase().includes("auto-scent")
    || item.product.title.toLowerCase().includes("car air freshener")
  ) {
    return "auto-scent";
  }

  return "perfume";
}

function toPromotionItems(items: CartItem[], managedGiftVariantId: string | null): CartPromotionItem[] {
  return items.map((item) => ({
    kind: getCartItemKind(item),
    unitPrice: parseFloat(item.price.amount),
    quantity: item.quantity,
    title: item.product.title,
    variantId: item.variantId,
    managedGift: item.variantId === managedGiftVariantId,
  }));
}

function getPromoHelperText(status: ReturnType<typeof getCartPromotionSummary>["promoCodeStatus"]) {
  if (status === "applied") return `${PROMO_CODE} applied to your single perfume.`;
  if (status === "blocked") return `${PROMO_CODE} cannot be combined with the 2-for-${formatUsd(BUNDLE_PRICE_USD)} perfume offer.`;
  if (status === "invalid") return "That code is not valid.";
  return `Use ${PROMO_CODE} for 10% off one eligible perfume.`;
}

function getPromoHelperClass(status: ReturnType<typeof getCartPromotionSummary>["promoCodeStatus"]) {
  if (status === "applied") return "text-emerald-700";
  if (status === "blocked" || status === "invalid") return "text-destructive";
  return "text-muted-foreground";
}

function getNextBundleHint(perfumeCount: number) {
  if (perfumeCount <= 0) return null;
  if (perfumeCount < BUNDLE_SIZE) return `Add 1 more perfume to unlock 2 for ${formatUsd(BUNDLE_PRICE_USD)}.`;
  if (perfumeCount % BUNDLE_SIZE === 1) return `Add 1 more perfume to unlock your next pair at ${formatUsd(BUNDLE_PRICE_USD)}.`;
  return null;
}

function getOfferCopy(perfumeCount: number, autoScentCount: number, pairCount: number) {
  if (pairCount > 0) {
    return {
      title: "Pair pricing unlocked",
      detail: `Your order already qualifies for ${pairCount} perfume pair${pairCount > 1 ? "s" : ""} at ${formatUsd(BUNDLE_PRICE_USD)} and still includes 1 free car scent.`,
    };
  }

  if (perfumeCount === 1) {
    return {
      title: "One more perfume unlocks your pair price",
      detail: `Your order already includes 1 free car scent. Add a second perfume and the pair drops to ${formatUsd(BUNDLE_PRICE_USD)}.`,
    };
  }

  if (autoScentCount > 0) {
    return {
      title: "Add any perfume to unlock your free car scent",
      detail: "Car scent-only orders stay paid. As soon as a perfume joins the order, 1 car scent becomes complimentary.",
    };
  }

  return {
    title: "Build your best-value order first",
    detail: `Perfume orders include 1 free car scent per order. 2 perfumes unlock ${formatUsd(BUNDLE_PRICE_USD)}.`,
  };
}

function findAutoScentVariantFromItem(item: CartItem | undefined): AutoScentVariant | null {
  if (!item) return null;

  const haystack = [item.variantTitle, ...item.selectedOptions.map((option) => option.value), item.product.title]
    .join(" ")
    .toLowerCase();

  return getAutoScentVariants().find((variant) => haystack.includes(variant.name.toLowerCase()) || haystack.includes(variant.slug)) ?? null;
}

function Row({
  row,
  isLoading,
  onDecrease,
  onIncrease,
  onRemove,
}: {
  row: CartDisplayRow;
  isLoading: boolean;
  onDecrease?: () => void;
  onIncrease?: () => void;
  onRemove?: () => void;
}) {
  const editable = row.editable ?? (!!row.sourceItem && row.kind !== "complimentary-gift");

  return (
    <article className="rounded-[1.6rem] border border-border bg-card p-3 shadow-soft">
      <div className="flex gap-3">
        <div className="h-24 w-20 shrink-0 overflow-hidden rounded-[1rem] bg-secondary">
          {row.imageUrl ? <img src={row.imageUrl} alt={row.imageAlt} className="h-full w-full object-cover" /> : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="font-display text-[15px] font-semibold leading-tight text-foreground">{row.title}</p>
              <p className="mt-1 font-body text-xs leading-5 text-muted-foreground">{row.subtitle}</p>
              {row.helper ? (
                <span className="mt-2 inline-flex rounded-full border border-accent/20 bg-accent/5 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
                  {row.helper}
                </span>
              ) : null}
            </div>
            <div className="text-right">
              <p className="font-display text-base font-semibold text-foreground">{row.totalPrice <= 0 ? "$0.00" : formatUsd(row.totalPrice)}</p>
              {row.compareAtPrice && row.compareAtPrice > row.totalPrice ? (
                <p className="mt-1 font-body text-xs text-muted-foreground line-through">{formatUsd(row.compareAtPrice)}</p>
              ) : null}
            </div>
          </div>

          {editable ? (
            <div className="mt-3 flex items-center gap-2">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary disabled:opacity-50"
                onClick={onDecrease}
                disabled={isLoading}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center font-body text-sm font-medium">{row.quantity}</span>
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border transition-colors hover:bg-secondary disabled:opacity-50"
                onClick={onIncrease}
                disabled={isLoading}
              >
                <Plus className="h-3 w-3" />
              </button>
              <button
                className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-destructive disabled:opacity-50"
                onClick={onRemove}
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-3 flex items-center justify-between">
              <span className="font-body text-xs uppercase tracking-[0.16em] text-muted-foreground">Qty {row.quantity}</span>
              <span className="font-body text-xs font-semibold text-accent">Included automatically</span>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function Upsell({
  product,
  isLoading,
  onAdd,
}: {
  product: CatalogProduct;
  isLoading: boolean;
  onAdd: () => void;
}) {
  return (
    <article className="min-w-[220px] rounded-[1.5rem] border border-border bg-card p-3 shadow-soft">
      <div className="h-40 overflow-hidden rounded-[1rem] bg-secondary">
        {product.images[0] ? <img src={product.images[0].url} alt={product.images[0].altText} className="h-full w-full object-cover" /> : null}
      </div>
      <p className="mt-3 font-display text-[15px] font-semibold text-foreground">{product.title.replace(" Eau de Parfum 50ml", "")}</p>
      <p className="mt-1 font-body text-xs text-muted-foreground">{formatUsd(parseFloat(product.price.amount))}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full rounded-full border-accent/30 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:bg-accent hover:text-accent-foreground"
        onClick={onAdd}
        disabled={isLoading || !product.availableForSale}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add to cart"}
      </Button>
    </article>
  );
}

function GiftSelectionTeaser({
  variant,
  onOpen,
}: {
  variant: AutoScentVariant;
  onOpen: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="flex w-full items-center gap-3 rounded-[1.6rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#fbf5ec_0%,#fffaf5_100%)] p-4 text-left transition-all hover:border-accent/30 hover:shadow-soft"
    >
      <div className="h-20 w-16 shrink-0 overflow-hidden rounded-[1rem] bg-white">
        <img src={variant.images.hero} alt={variant.title} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Complimentary gift</p>
        <p className="mt-2 font-display text-lg font-semibold leading-tight text-foreground">Choose your free car scent</p>
        <p className="mt-1 font-body text-sm leading-6 text-muted-foreground">
          {variant.name} is selected right now. Tap to switch between Iris Flower, Melon, and Oud.
        </p>
        <span className="mt-3 inline-flex font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-accent underline underline-offset-4">
          Select your scent
        </span>
      </div>
    </button>
  );
}

function GiftSelectionDialog({
  isOpen,
  onOpenChange,
  selectedVariant,
  onSelect,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedVariant: AutoScentVariant;
  onSelect: (slug: string) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[980px] rounded-[2rem] border-[#eadfd1] bg-[linear-gradient(180deg,#fffdf8_0%,#fdf7ef_100%)] p-6 sm:p-8">
        <DialogHeader className="pr-8">
          <div className="inline-flex w-fit rounded-full bg-accent px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-accent-foreground">
            Complimentary gift
          </div>
          <DialogTitle className="mt-3 font-display text-3xl font-semibold leading-tight text-foreground">
            Pick your free car scent
          </DialogTitle>
          <DialogDescription className="max-w-2xl font-body text-sm leading-7 text-muted-foreground">
            Perfume orders include 1 free car scent per order. Choose the cabin mood you want to include with this order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3">
          {getAutoScentVariants().map((variant) => {
            const selected = variant.slug === selectedVariant.slug;

            return (
              <article
                key={variant.slug}
                className={cn(
                  "rounded-[1.6rem] border bg-white/90 p-4 shadow-soft transition-all",
                  selected ? "border-accent bg-accent/5" : "border-border",
                )}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-[1.2rem] bg-secondary">
                  <img src={variant.images.hero} alt={variant.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-4">
                  <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Car scent</p>
                  <p className="mt-2 font-display text-xl font-semibold text-foreground">{variant.name}</p>
                  <p className="mt-2 font-body text-sm leading-6 text-muted-foreground">{variant.scentProfile.slice(0, 2).join(" / ")}</p>
                </div>
                <Button
                  type="button"
                  className={cn(
                    "mt-4 h-11 w-full rounded-full font-body text-[11px] font-semibold uppercase tracking-[0.16em]",
                    selected ? "bg-foreground text-background hover:bg-foreground/90" : "bg-accent text-accent-foreground hover:bg-accent/90",
                  )}
                  onClick={() => {
                    onSelect(variant.slug);
                    onOpenChange(false);
                  }}
                >
                  {selected ? "Selected" : "Choose this scent"}
                </Button>
              </article>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export const CartDrawer = ({ onOpenChange }: CartDrawerProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
  const [isGiftDialogOpen, setIsGiftDialogOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);
  const sheetTitleRef = useRef<HTMLHeadingElement | null>(null);
  const {
    items,
    promoCode,
    giftSelectionSlug,
    managedGiftVariantId,
    isLoading,
    isSyncing,
    updateQuantity,
    removeItem,
    getCheckoutUrl,
    syncCart,
    setPromoCode,
    clearPromoCode,
    setGiftSelectionSlug,
    addItem,
  } = useCartStore();
  const { getProductByHandle, getRelatedProducts } = useStorefrontCatalog();

  const liveItems = useMemo(
    () => items.map((item) => ({ ...item, product: getProductByHandle(item.product.handle) ?? item.product })),
    [getProductByHandle, items],
  );
  const summary = useMemo(
    () => getCartPromotionSummary(toPromotionItems(liveItems, managedGiftVariantId), promoCode),
    [liveItems, managedGiftVariantId, promoCode],
  );
  const checkoutUrl = getCheckoutUrl();
  const selectedGiftVariant = useMemo(
    () => getAutoScentVariant(giftSelectionSlug) ?? getAutoScentVariants()[0],
    [giftSelectionSlug],
  );
  const perfumeItems = useMemo(() => liveItems.filter((item) => getCartItemKind(item) === "perfume"), [liveItems]);
  const autoScentItems = useMemo(() => liveItems.filter((item) => getCartItemKind(item) === "auto-scent"), [liveItems]);
  const nextBundleHint = getNextBundleHint(summary.perfumeCount);

  const displayRows = useMemo(() => {
    const rows: CartDisplayRow[] = [];
    let complimentaryAssigned = false;

    for (const item of liveItems) {
      const kind = getCartItemKind(item);
      const linePrice = parseFloat(item.price.amount) * item.quantity;

      if (
        kind === "auto-scent"
        && summary.complimentaryGift.mode === "existing-auto-scent"
        && summary.complimentaryGift.variantId === item.variantId
        && !complimentaryAssigned
      ) {
        complimentaryAssigned = true;
        rows.push({
          key: item.variantId,
          kind,
          title: item.product.title,
          subtitle: item.selectedOptions.map((option) => option.value).join(" / "),
          imageUrl: item.product.images[0]?.url ?? null,
          imageAlt: item.product.images[0]?.altText ?? item.product.title,
          quantity: item.quantity,
          totalPrice: Math.max(0, linePrice - parseFloat(item.price.amount)),
          compareAtPrice: linePrice,
          helper: item.quantity === 1 ? "Included with your perfume order" : `1 included, ${item.quantity - 1} paid`,
          editable: item.variantId !== managedGiftVariantId || item.quantity > 1,
          sourceItem: item,
        });
      } else {
        rows.push({
          key: item.variantId,
          kind,
          title: item.product.title,
          subtitle: item.selectedOptions.map((option) => option.value).join(" / "),
          imageUrl: item.product.images[0]?.url ?? null,
          imageAlt: item.product.images[0]?.altText ?? item.product.title,
          quantity: item.quantity,
          totalPrice: linePrice,
          compareAtPrice: null,
          helper: kind === "perfume" ? "Eligible for pair pricing" : null,
          editable: true,
          sourceItem: item,
        });
      }
    }

    if (summary.complimentaryGift.mode === "virtual" && selectedGiftVariant) {
      rows.splice(Math.min(1, rows.length), 0, {
        key: `gift-${selectedGiftVariant.slug}`,
        kind: "complimentary-gift",
        title: `Complimentary ${selectedGiftVariant.name} car scent`,
        subtitle: "Included automatically with this perfume order",
        imageUrl: selectedGiftVariant.images.hero,
        imageAlt: selectedGiftVariant.title,
        quantity: 1,
        totalPrice: 0,
        compareAtPrice: BASE_AUTO_SCENT_PRICE_USD,
        helper: "Selected in gift picker",
        editable: false,
      });
    }

    return rows;
  }, [liveItems, managedGiftVariantId, selectedGiftVariant, summary.complimentaryGift.mode]);

  const upsellConfig = useMemo(() => {
    const cartHandles = new Set(liveItems.map((item) => item.product.handle));

    if (summary.perfumeCount === 1 && perfumeItems[0]) {
      return {
        title: "Complete your pair",
        detail: `Add one more perfume to drop the pair to ${formatUsd(BUNDLE_PRICE_USD)}.`,
        products: getRelatedProducts(perfumeItems[0].product.handle, 8).filter((product) => !cartHandles.has(product.handle)).slice(0, 4),
      };
    }

    if (summary.perfumeCount === 0 && autoScentItems[0]) {
      const variant = findAutoScentVariantFromItem(autoScentItems[0]);
      return {
        title: "Add a perfume and unlock your complimentary car scent",
        detail: "The car scent already in your bag becomes complimentary when a perfume is added to the order.",
        products: (variant?.recommendedPerfumeHandles ?? [])
          .map((handle) => getProductByHandle(handle))
          .filter((product): product is CatalogProduct => !!product)
          .filter((product) => !cartHandles.has(product.handle))
          .slice(0, 4),
      };
    }

    if (summary.perfumeCount > 1 && perfumeItems[0]) {
      return {
        title: "Add another favorite",
        detail: "Keep building with matching David Walker perfumes.",
        products: getRelatedProducts(perfumeItems[0].product.handle, 8).filter((product) => !cartHandles.has(product.handle)).slice(0, 4),
      };
    }

    return null;
  }, [autoScentItems, getProductByHandle, getRelatedProducts, liveItems, perfumeItems, summary.perfumeCount]);

  useEffect(() => {
    setPromoInput(promoCode);
  }, [promoCode]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        scrollAreaRef.current?.scrollTo({ top: 0, behavior: "auto" });
      });
      void syncCart();
    } else {
      setIsGiftDialogOpen(false);
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

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    onOpenChange?.(open);
  };

  const handleSheetOpenAutoFocus = (event: Event) => {
    event.preventDefault();
    requestAnimationFrame(() => {
      scrollAreaRef.current?.scrollTo({ top: 0, behavior: "auto" });
      sheetTitleRef.current?.focus();
    });
  };

  const handleUpsellAdd = async (product: CatalogProduct) => {
    await addItem({
      product,
      variantId: product.variant.id,
      variantTitle: product.variant.title,
      price: product.variant.price,
      quantity: 1,
      selectedOptions: product.variant.selectedOptions,
    });
    toast.success(t("cart.added"), { description: product.title });
  };

  const offer = getOfferCopy(summary.perfumeCount, summary.autoScentCount, summary.bundle.pairCount);

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <button aria-label="Cart" className="relative text-foreground transition-colors hover:text-accent">
          <ShoppingBag size={20} />
          {summary.itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
              {summary.itemCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        className="flex h-full w-full flex-col bg-background px-0 sm:max-w-[460px]"
        onOpenAutoFocus={handleSheetOpenAutoFocus}
      >
        <SheetHeader className="px-6">
          <SheetTitle ref={sheetTitleRef} tabIndex={-1} className="font-display text-xl font-bold outline-none">
            {t("cart.title")}
          </SheetTitle>
          <SheetDescription className="font-body text-sm">
            {summary.itemCount === 0 ? t("cart.empty") : `${summary.itemCount} ${summary.itemCount !== 1 ? t("cart.items") : t("cart.item")}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex min-h-0 flex-1 flex-col px-6 pt-4">
          {items.length === 0 ? (
            <div className="flex flex-1 items-center">
              <div className="w-full rounded-[1.8rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#f5ede3_0%,#fbf7f1_100%)] p-5">
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Offer progress</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">{offer.title}</h3>
                <p className="mt-2 font-body text-sm leading-6 text-foreground/75">{offer.detail}</p>
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollAreaRef} className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-4 pb-6">
                  <section className="rounded-[1.8rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#f5ede3_0%,#fbf7f1_100%)] p-4">
                    <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Offer progress</p>
                    <h3 className="mt-3 font-display text-xl font-semibold text-foreground">{offer.title}</h3>
                    <p className="mt-2 font-body text-sm leading-6 text-foreground/75">{offer.detail}</p>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[
                        { label: "Perfume order", detail: "1 free car scent", active: summary.perfumeCount >= 1 },
                        { label: "2 perfumes", detail: `${formatUsd(BUNDLE_PRICE_USD)} pair`, active: summary.perfumeCount >= 2 },
                        { label: "Every order", detail: "Free shipping", active: summary.itemCount > 0 },
                      ].map((step) => (
                        <div key={step.label} className={cn("rounded-[1.1rem] border px-3 py-3", step.active ? "border-accent/20 bg-accent/10" : "border-[#eadfd1] bg-white/75")}>
                          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{step.label}</p>
                          <p className="mt-2 font-body text-sm font-semibold text-foreground">{step.detail}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-3">
                    {displayRows.map((row) => (
                      <Row
                        key={row.key}
                        row={row}
                        isLoading={isLoading}
                        onDecrease={row.sourceItem ? () => void updateQuantity(row.sourceItem!.variantId, row.sourceItem!.quantity - 1) : undefined}
                        onIncrease={row.sourceItem ? () => void updateQuantity(row.sourceItem!.variantId, row.sourceItem!.quantity + 1) : undefined}
                        onRemove={row.sourceItem ? () => void removeItem(row.sourceItem!.variantId) : undefined}
                      />
                    ))}
                  </section>

                  {summary.complimentaryGiftEligible && selectedGiftVariant ? (
                    <GiftSelectionTeaser
                      variant={selectedGiftVariant}
                      onOpen={() => setIsGiftDialogOpen(true)}
                    />
                  ) : null}

                  {upsellConfig && upsellConfig.products.length > 0 ? (
                    <section className="rounded-[1.7rem] border border-border bg-card p-4">
                      <div className="flex items-start gap-3">
                        <Sparkles className="mt-0.5 h-4 w-4 text-accent" />
                        <div>
                          <p className="font-display text-lg font-semibold text-foreground">{upsellConfig.title}</p>
                          <p className="mt-1 font-body text-sm leading-6 text-muted-foreground">{upsellConfig.detail}</p>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                        {upsellConfig.products.map((product) => (
                          <Upsell key={product.handle} product={product} isLoading={isLoading} onAdd={() => void handleUpsellAdd(product)} />
                        ))}
                      </div>
                    </section>
                  ) : null}

                  <section className="rounded-[1.7rem] border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <TicketPercent className="mt-0.5 h-4 w-4 text-accent" />
                      <div className="w-full">
                        <p className="font-display text-lg font-semibold text-foreground">Promo code</p>
                        <div className="mt-3 flex gap-2">
                          <Input value={promoInput} onChange={(event) => setPromoInput(event.target.value)} placeholder={PROMO_CODE} className="h-10 rounded-full" />
                          <Button type="button" variant="outline" className="rounded-full px-4" onClick={handleApplyPromo}>Apply</Button>
                        </div>
                        <p className={`mt-2 font-body text-xs leading-relaxed ${getPromoHelperClass(summary.promoCodeStatus)}`}>{getPromoHelperText(summary.promoCodeStatus)}</p>
                      </div>
                    </div>
                  </section>

                  <section className="rounded-[1.7rem] border border-border bg-card p-4">
                    <div className="flex items-start gap-3">
                      <Gift className="mt-0.5 h-4 w-4 text-accent" />
                      <div>
                        <p className="font-display text-lg font-semibold text-foreground">Order summary</p>
                        <p className="mt-1 font-body text-sm leading-6 text-muted-foreground">
                          {summary.perfumeCount > 0 ? "Pair pricing and 1 complimentary car scent per perfume order are reflected below." : "Add a perfume to make 1 car scent complimentary."}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                        <span>Merchandise subtotal</span>
                        <span>{formatUsd(summary.baseSubtotal)}</span>
                      </div>
                      {summary.bundle.isApplied ? (
                        <div className="flex items-center justify-between font-body text-sm text-emerald-700">
                          <span>Perfume pair savings</span>
                          <span>-{formatUsd(summary.bundle.savings)}</span>
                        </div>
                      ) : null}
                      {summary.complimentaryGift.savings > 0 ? (
                        <div className="flex items-center justify-between font-body text-sm text-emerald-700">
                          <span>Complimentary car scent</span>
                          <span>-{formatUsd(summary.complimentaryGift.savings)}</span>
                        </div>
                      ) : null}
                      {summary.complimentaryGift.mode === "virtual" ? (
                        <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                          <span>Complimentary car scent</span>
                          <span>Included</span>
                        </div>
                      ) : null}
                      {summary.promoCodeDiscount > 0 ? (
                        <div className="flex items-center justify-between font-body text-sm text-emerald-700">
                          <span>{PROMO_CODE} discount</span>
                          <span>-{formatUsd(summary.promoCodeDiscount)}</span>
                        </div>
                      ) : null}
                      <div className="flex items-center justify-between border-t border-border pt-3">
                        <span className="font-display text-base font-semibold">{t("cart.total")}</span>
                        <span className="font-display text-xl font-bold">{formatUsd(summary.finalSubtotal)}</span>
                      </div>
                    </div>
                    {nextBundleHint ? (
                      <div className="mt-4 rounded-[1.1rem] border border-accent/20 bg-accent/5 px-3 py-3">
                        <p className="font-body text-xs font-semibold uppercase tracking-[0.16em] text-accent">Next best move</p>
                        <p className="mt-2 font-body text-sm leading-6 text-accent">{nextBundleHint}</p>
                      </div>
                    ) : null}
                  </section>

                  <p className="font-body text-xs leading-relaxed text-muted-foreground">{t("cart.previewNote")}</p>
                </div>
              </div>

              <div className="shrink-0 border-t border-border bg-background/95 px-6 pb-6 pt-4 backdrop-blur">
                <div className="rounded-[1.7rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#fffaf5_0%,#fff 100%)] p-4 shadow-soft">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Ready to checkout</p>
                      <p className="mt-2 font-display text-2xl font-semibold text-foreground">{formatUsd(summary.finalSubtotal)}</p>
                    </div>
                    <div className="text-right">
                      {summary.bundle.savings > 0 ? (
                        <p className="font-body text-xs font-semibold text-emerald-700">-{formatUsd(summary.bundle.savings)} pair savings</p>
                      ) : null}
                      {summary.complimentaryGift.savings > 0 ? (
                        <p className="mt-1 font-body text-xs font-semibold text-emerald-700">-{formatUsd(summary.complimentaryGift.savings)} complimentary gift</p>
                      ) : null}
                    </div>
                  </div>

                  {checkoutUrl ? (
                    <Button
                      asChild
                      className="mt-4 h-14 w-full rounded-full bg-primary font-body text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground hover:bg-foreground/80"
                      size="lg"
                      disabled={items.length === 0 || isLoading || isSyncing}
                    >
                      <a href={checkoutUrl} target="_blank" rel="noreferrer">
                        {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Checkout - ${formatUsd(summary.finalSubtotal)}`}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      className="mt-4 h-14 w-full rounded-full bg-primary font-body text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground"
                      size="lg"
                      disabled
                    >
                      {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Checkout - ${formatUsd(summary.finalSubtotal)}`}
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

      {summary.complimentaryGiftEligible && selectedGiftVariant ? (
        <GiftSelectionDialog
          isOpen={isGiftDialogOpen}
          onOpenChange={setIsGiftDialogOpen}
          selectedVariant={selectedGiftVariant}
          onSelect={setGiftSelectionSlug}
        />
      ) : null}
    </Sheet>
  );
};
