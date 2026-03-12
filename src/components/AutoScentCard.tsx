import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { toast } from "sonner";

import { resolveAutoScentProduct, type AutoScentVariant } from "@/lib/autoScents";
import type { CatalogProduct } from "@/lib/catalogData";
import { getMotionInitial } from "@/lib/motion";
import { useCartStore } from "@/stores/cartStore";
import { cn } from "@/lib/utils";

interface AutoScentCardProps {
  variant: AutoScentVariant;
  index?: number;
  className?: string;
  layout?: "default" | "compact";
}

const AutoScentCard = ({ variant, index = 0, className, layout = "default" }: AutoScentCardProps) => {
  const subtitle = `Car air freshener - ${variant.scentProfile.slice(0, 3).join(" - ")}`;
  const detailPath = `/auto-scents/${variant.slug}`;
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const [resolvedAutoScentProduct, setResolvedAutoScentProduct] = useState<CatalogProduct | undefined>(undefined);
  const [isResolvingPurchase, setIsResolvingPurchase] = useState(false);
  const priceLabel = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(variant.priceUsd);
  const isCompact = layout === "compact";

  const handleAddToCart = async () => {
    setIsResolvingPurchase(true);

    try {
      let product = resolvedAutoScentProduct;
      if (product === undefined) {
        product = await resolveAutoScentProduct(variant);
        setResolvedAutoScentProduct(product);
      }

      if (!product.availableForSale) {
        toast.error("This scent is temporarily unavailable for checkout.");
        return;
      }

      await addItem({
        product,
        variantId: product.variant.id,
        variantTitle: product.variant.title,
        price: product.variant.price,
        quantity: 1,
        selectedOptions: product.variant.selectedOptions,
      });

      toast.success("Added to cart", { description: product.title });
    } finally {
      setIsResolvingPurchase(false);
    }
  };

  if (isCompact) {
    return (
      <motion.article
        initial={getMotionInitial({ opacity: 0, y: 24 })}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45, delay: index * 0.05 }}
        className={cn("flex h-full flex-col", className)}
      >
        <div className="flex h-full flex-col rounded-[1.75rem] border border-border bg-card/95 p-3 shadow-soft">
          <Link to={detailPath} className="group flex flex-1 flex-col">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem] bg-muted">
              <img
                src={variant.images.hero}
                alt={`${variant.title} hero image`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
              <div className="pointer-events-none absolute left-3 top-3">
                <span className="rounded-full border border-border/80 bg-background/90 px-2.5 py-1 font-body text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
                  Car scent
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col">
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                Auto scent
              </p>
              <h3 className="mt-2 min-h-[2.8rem] font-display text-[1.15rem] font-semibold leading-[1.15] text-foreground line-clamp-2">
                David Walker {variant.name}
              </h3>
              <p className="mt-2 font-body text-sm text-foreground">{variant.scentProfile.slice(0, 2).join(" / ")}</p>
            </div>
          </Link>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-border/80 pt-4">
            <div className="min-w-0">
              <p className="font-display text-xl font-bold text-foreground">{priceLabel}</p>
              <p className="mt-1 font-body text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Add to cart
              </p>
            </div>
            <button
              type="button"
              onClick={() => void handleAddToCart()}
              disabled={isResolvingPurchase || isCartLoading}
              className="shrink-0 rounded-full border border-accent/30 bg-background px-4 py-2.5 text-center font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground transition-all hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {isResolvingPurchase || isCartLoading ? "Loading" : "Add to Cart"}
            </button>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={getMotionInitial({ opacity: 0, y: 24 })}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={cn("flex h-full flex-col", className)}
    >
      <Link to={detailPath} className="group flex flex-1 flex-col">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
          <img
            src={variant.images.hero}
            alt={`${variant.title} hero image`}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>

        <div className="mt-3 flex flex-1 flex-col space-y-2">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {variant.eyebrow} - {variant.name}
          </p>
          <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-foreground md:text-lg">
            David Walker {variant.name}
          </h3>
          <p className="font-body text-xs leading-relaxed text-muted-foreground line-clamp-1">{subtitle}</p>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            Individual purchase
          </p>
          <div className="hidden flex-wrap gap-2 md:flex">
            {variant.scentProfile.slice(0, 2).map((profile) => (
              <span
                key={profile}
                className="rounded-full bg-secondary/60 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground"
              >
                {profile}
              </span>
            ))}
          </div>
          <p className="hidden font-body text-sm leading-relaxed text-muted-foreground line-clamp-2 md:block">
            {variant.shortDescription}
          </p>
        </div>
      </Link>

      <div className="mt-3 space-y-3">
        <div className="min-w-0">
          <span className="font-display text-lg font-bold text-foreground">{priceLabel}</span>
          <p className="mt-1 font-body text-[11px] leading-relaxed text-muted-foreground">
            {`Buy on its own for ${priceLabel}. Free shipping on every order.`}
          </p>
          <p className="mt-1 font-body text-[11px] leading-relaxed text-muted-foreground">
            Applicable sales tax is shown at checkout before payment.
          </p>
        </div>
        <button
          type="button"
          onClick={() => void handleAddToCart()}
          disabled={isResolvingPurchase || isCartLoading}
          className="block w-full whitespace-nowrap rounded-full bg-primary px-4 py-2.5 text-center font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-all hover:bg-foreground/80 disabled:opacity-50"
        >
          {isResolvingPurchase || isCartLoading ? "Loading" : "Add to Cart"}
        </button>
      </div>
    </motion.article>
  );
};

export default AutoScentCard;
