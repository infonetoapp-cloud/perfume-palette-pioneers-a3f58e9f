import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Gift, Loader2, Minus, Plus, ShoppingBag, Sparkles, TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { getAutoScentVariant, getAutoScentVariants, type AutoScentVariant } from "@/lib/autoScents";
import type { CatalogProduct } from "@/lib/catalogData";
import {
  ADDITIONAL_PERFUME_PRICE_LABEL,
  BASE_AUTO_SCENT_PRICE_USD,
  BUNDLE_PRICE_USD,
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
  if (status === "blocked") return `${PROMO_CODE} cannot be combined with multi-bottle perfume pricing.`;
  if (status === "invalid") return "That code is not valid.";
  return `Use ${PROMO_CODE} for 10% off one eligible perfume.`;
}

function getPromoHelperClass(status: ReturnType<typeof getCartPromotionSummary>["promoCodeStatus"]) {
  if (status === "applied") return "text-emerald-700";
  if (status === "blocked" || status === "invalid") return "text-destructive";
  return "text-muted-foreground";
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

function OfferProgressCard({
  perfumeCount,
  higherTierUnlocked,
}: {
  perfumeCount: number;
  higherTierUnlocked: boolean;
}) {
  const steps = [
    {
      label: "Perfume order",
      mobileLabel: "Gift",
      detail: "1 free car scent",
      mobileDetail: "1 free scent",
      active: perfumeCount >= 1,
    },
    {
      label: "2 perfumes",
      mobileLabel: "Pair",
      detail: formatUsd(BUNDLE_PRICE_USD),
      mobileDetail: formatUsd(BUNDLE_PRICE_USD),
      active: perfumeCount >= 2,
    },
    {
      label: "Each next perfume",
      mobileLabel: "Next",
      detail: `+${ADDITIONAL_PERFUME_PRICE_LABEL}`,
      mobileDetail: `+${ADDITIONAL_PERFUME_PRICE_LABEL}`,
      active: higherTierUnlocked,
    },
  ];

  return (
    <section className="rounded-[1.6rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#f5ede3_0%,#fbf7f1_100%)] p-3.5 shadow-soft sm:rounded-[1.85rem] sm:p-4">
      <div>
        <div className="relative px-1.5 sm:px-3">
          <div className="absolute left-5 right-5 top-2.5 h-px bg-[#d8c7b4] sm:left-6 sm:right-6 sm:top-3" />
          <div className="relative z-10 grid grid-cols-3 gap-1.5 sm:gap-2">
            {steps.map((step) => (
              <div key={step.label} className="flex flex-col items-center text-center">
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border bg-white sm:h-6 sm:w-6",
                    step.active ? "border-accent bg-accent text-accent-foreground" : "border-[#d8c7b4]",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full sm:h-2.5 sm:w-2.5", step.active ? "bg-accent-foreground" : "bg-[#d8c7b4]")} />
                </span>
                <div className="mt-2.5 w-full rounded-[0.95rem] border border-[#eadfd1] bg-white/90 px-2 py-2 sm:mt-3 sm:rounded-[1.05rem] sm:px-3 sm:py-2.5">
                  <p className="font-body text-[9px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-[10px] sm:tracking-[0.16em]">
                    <span className="sm:hidden">{step.mobileLabel}</span>
                    <span className="hidden sm:inline">{step.label}</span>
                  </p>
                  <p className="mt-1.5 font-body text-xs font-semibold text-foreground sm:mt-2 sm:text-sm">
                    <span className="sm:hidden">{step.mobileDetail}</span>
                    <span className="hidden sm:inline">{step.detail}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function DrawerSection({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-[1.8rem] border border-[#eadfd1] bg-card shadow-soft">
      <div className="flex items-center gap-3 bg-[#efe6d8] px-4 py-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white font-display text-lg font-semibold text-accent">
          {step}
        </div>
        <div className="min-w-0">
          <h3 className="font-display text-xl font-semibold text-foreground">{title}</h3>
          {description ? <p className="mt-0.5 font-body text-xs leading-5 text-foreground/70">{description}</p> : null}
        </div>
      </div>
      <div className="p-4">{children}</div>
    </section>
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
    <article className="min-w-[196px] rounded-[1.5rem] border border-[#eadfd1] bg-[#fffaf5] p-3 shadow-soft sm:min-w-[228px]">
      <div className="h-40 overflow-hidden rounded-[1rem] bg-secondary">
        {product.images[0] ? <img src={product.images[0].url} alt={product.images[0].altText} className="h-full w-full object-cover" /> : null}
      </div>
      <p className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">Best next bottle</p>
      <p className="mt-2 font-display text-[15px] font-semibold leading-tight text-foreground">{product.title.replace(" Eau de Parfum 50ml", "")}</p>
      <p className="mt-1 font-body text-xs text-muted-foreground">{formatUsd(parseFloat(product.price.amount))}</p>
      <Button
        type="button"
        variant="outline"
        className="mt-3 w-full rounded-full border-accent/30 bg-white text-[11px] font-semibold uppercase tracking-[0.16em] text-accent hover:bg-accent hover:text-accent-foreground"
        onClick={onAdd}
        disabled={isLoading || !product.availableForSale}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add perfume"}
      </Button>
    </article>
  );
}

function GiftSelectionPanel({
  variant,
  onSelect,
}: {
  variant: AutoScentVariant;
  onSelect: (slug: string) => void;
}) {
  return (
    <article className="rounded-[1.35rem] border border-[#eadfd1] bg-[linear-gradient(180deg,#fbf5ec_0%,#fffaf5_100%)] p-3">
      <div className="flex items-start gap-3">
        <div className="h-16 w-14 shrink-0 overflow-hidden rounded-[0.9rem] bg-white">
          <img src={variant.images.hero} alt={variant.title} className="h-full w-full object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-accent">Complimentary gift</p>
          <p className="mt-1.5 font-display text-[1.05rem] font-semibold leading-tight text-foreground">Choose your free car scent</p>
          <p className="mt-1 font-body text-[13px] leading-5 text-muted-foreground">
            Included with your perfume order.
          </p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {getAutoScentVariants().map((preview) => {
          const selected = preview.slug === variant.slug;

          return (
            <button
              type="button"
              key={preview.slug}
              onClick={() => onSelect(preview.slug)}
              className={cn(
                "overflow-hidden rounded-[0.95rem] border bg-white text-left transition-all hover:border-accent/60",
                selected ? "border-accent shadow-soft ring-1 ring-accent/20" : "border-[#eadfd1]",
              )}
            >
              <div className="aspect-[4/5] bg-secondary">
                <img src={preview.images.hero} alt={preview.title} className="h-full w-full object-cover" />
              </div>
              <div className="px-2 py-2">
                <p className="truncate font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">{preview.name}</p>
                {selected ? <p className="mt-1 font-body text-[10px] font-semibold uppercase tracking-[0.12em] text-accent">Selected</p> : null}
              </div>
            </button>
          );
        })}
      </div>
    </article>
  );
}

export const CartDrawer = ({ onOpenChange }: CartDrawerProps) => {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [promoInput, setPromoInput] = useState("");
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
          helper: null,
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
        detail: `Add one more perfume. Your 2-bottle total becomes ${formatUsd(BUNDLE_PRICE_USD)}.`,
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
        detail: `Every perfume after the first adds ${ADDITIONAL_PERFUME_PRICE_LABEL}.`,
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

  const handleApplyPresetPromo = () => {
    setPromoInput(PROMO_CODE);
    setPromoCode(PROMO_CODE);
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

  const showGiftTeaser = summary.complimentaryGiftEligible && !!selectedGiftVariant;
  const showUpsellSection = !!upsellConfig && upsellConfig.products.length > 0;
  let nextSectionStep = 1;
  const cartStep = nextSectionStep++;
  const giftStep = showGiftTeaser ? nextSectionStep++ : null;
  const upsellStep = showUpsellSection ? nextSectionStep++ : null;
  const summaryStep = nextSectionStep++;

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
                <p className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">Cart</p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-foreground">Start with one perfume at {formatUsd(79.9)}</h3>
                <p className="mt-2 font-body text-sm leading-6 text-foreground/75">
                  Perfume orders include 1 free car scent. The second perfume brings the total to {formatUsd(BUNDLE_PRICE_USD)}, and each additional perfume adds {ADDITIONAL_PERFUME_PRICE_LABEL}.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div ref={scrollAreaRef} className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="space-y-4 pb-6">
                  <OfferProgressCard
                    perfumeCount={summary.perfumeCount}
                    higherTierUnlocked={summary.perfumeCount >= 3}
                  />

                  <DrawerSection
                    step={cartStep}
                    title="Your cart"
                    description={summary.itemCount === 1 ? "1 item in your bag" : `${summary.itemCount} items in your bag`}
                  >
                    <div className="space-y-3">
                      {displayRows.map((row) => (
                        <Row
                          key={row.key}
                          row={row}
                          isLoading={isLoading}
                          onDecrease={row.sourceItem ? () => void updateQuantity(row.sourceItem.variantId, row.sourceItem.quantity - 1) : undefined}
                          onIncrease={row.sourceItem ? () => void updateQuantity(row.sourceItem.variantId, row.sourceItem.quantity + 1) : undefined}
                          onRemove={row.sourceItem ? () => void removeItem(row.sourceItem.variantId) : undefined}
                        />
                      ))}
                    </div>
                  </DrawerSection>

                  {showGiftTeaser && giftStep ? (
                    <DrawerSection
                      step={giftStep}
                      title="Pick your free car scent"
                      description="Perfume orders include 1 complimentary car scent per order."
                    >
                      <GiftSelectionPanel
                        variant={selectedGiftVariant}
                        onSelect={setGiftSelectionSlug}
                      />
                    </DrawerSection>
                  ) : null}

                  {showUpsellSection && upsellConfig && upsellStep ? (
                    <DrawerSection
                      step={upsellStep}
                      title={upsellConfig.title}
                      description={upsellConfig.detail}
                    >
                      <div className="flex gap-3 overflow-x-auto pb-1">
                        {upsellConfig.products.map((product) => (
                          <Upsell key={product.handle} product={product} isLoading={isLoading} onAdd={() => void handleUpsellAdd(product)} />
                        ))}
                      </div>
                    </DrawerSection>
                  ) : null}

                  <DrawerSection
                    step={summaryStep}
                    title="Order summary"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between font-body text-sm text-muted-foreground">
                        <span>Merchandise subtotal</span>
                        <span>{formatUsd(summary.baseSubtotal)}</span>
                      </div>
                      {summary.bundle.isApplied ? (
                        <div className="flex items-center justify-between font-body text-sm text-emerald-700">
                          <span>Perfume pricing savings</span>
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
                      <div className="flex items-center justify-between border-t border-border pt-2.5">
                        <span className="font-display text-base font-semibold">{t("cart.total")}</span>
                        <span className="font-display text-xl font-bold">{formatUsd(summary.finalSubtotal)}</span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-[1.05rem] border border-[#eadfd1] bg-[#fffaf5] p-3">
                      <div className="flex items-start gap-3">
                        <TicketPercent className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <div className="w-full">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Promo code</p>
                            {summary.promoCodeStatus === "applied" ? (
                              <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                                Applied
                              </span>
                            ) : null}
                          </div>
                          <div className="mt-2 flex items-center gap-2">
                            <div className="flex-1 rounded-full border border-border bg-white px-4 py-2.5 font-body text-sm text-muted-foreground">
                              {PROMO_CODE}
                            </div>
                            <Button
                              type="button"
                              variant="outline"
                              className="rounded-full px-4"
                              onClick={handleApplyPresetPromo}
                              disabled={summary.promoCodeStatus === "applied"}
                            >
                              {summary.promoCodeStatus === "applied" ? "Added" : "Apply"}
                            </Button>
                          </div>
                          <p className={`mt-2 font-body text-xs leading-relaxed ${getPromoHelperClass(summary.promoCodeStatus)}`}>
                            {summary.promoCodeStatus === "applied" ? `${PROMO_CODE} applied to 1 perfume.` : `Tap apply to use ${PROMO_CODE} on 1 eligible perfume.`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </DrawerSection>

                  <p className="hidden font-body text-xs leading-relaxed text-muted-foreground sm:block">{t("cart.previewNote")}</p>
                </div>
              </div>

              <div className="shrink-0 border-t border-border bg-background/95 px-6 pb-5 pt-3 backdrop-blur">
                <div className="rounded-[1.4rem] border border-[#e6d6c6] bg-[linear-gradient(180deg,#fffdf9_0%,#fff8ef_100%)] p-3 shadow-soft">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-body text-[9px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">Ready to checkout</p>
                      <p className="mt-1 font-display text-[1.7rem] font-semibold leading-none text-foreground">{formatUsd(summary.finalSubtotal)}</p>
                    </div>
                    <span className="rounded-full border border-[#dfd3c6] bg-white/90 px-2.5 py-1 font-body text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      Free shipping
                    </span>
                  </div>

                  {checkoutUrl ? (
                    <Button
                      asChild
                      className="mt-3 h-11 w-full rounded-full border border-transparent bg-[#8d8882] font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-[#78736d]"
                      size="lg"
                      disabled={items.length === 0 || isLoading || isSyncing}
                    >
                      <a href={checkoutUrl} target="_blank" rel="noreferrer">
                        {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Checkout - ${formatUsd(summary.finalSubtotal)}`}
                      </a>
                    </Button>
                  ) : (
                    <Button
                      className="mt-3 h-11 w-full rounded-full border border-transparent bg-[#8d8882] font-body text-[13px] font-semibold uppercase tracking-[0.16em] text-white"
                      size="lg"
                      disabled
                    >
                      {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : `Checkout - ${formatUsd(summary.finalSubtotal)}`}
                    </Button>
                  )}

                  <p className="mt-2 text-center font-body text-[11px] leading-5 text-muted-foreground">
                    Taxes are calculated at checkout.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>

    </Sheet>
  );
};
