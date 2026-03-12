import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import { getProductDisplayCopy, matchesCollection } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalogData";
import { getMotionInitial } from "@/lib/motion";
import { ADDITIONAL_PERFUME_PRICE_LABEL, BUNDLE_PRICE_USD, GIFT_ORDER_LABEL, PROMO_CODE, formatUsd } from "@/lib/promotions";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: CatalogProduct;
  index?: number;
  className?: string;
  isCartLoading?: boolean;
  onAddToCart?: (event: MouseEvent, product: CatalogProduct) => void;
  layout?: "default" | "compact";
}

const ProductCard = ({
  product,
  index = 0,
  className = "",
  isCartLoading = false,
  onAddToCart,
  layout = "default",
}: ProductCardProps) => {
  const image = product.images[0];
  const copy = getProductDisplayCopy(product);
  const isCompact = layout === "compact";
  const genderBadge = copy.genderLabel === "Women's" ? "Women" : copy.genderLabel === "Men's" ? "Men" : "Unisex";
  const secondaryBadge = matchesCollection(product.handle, "best-sellers")
    ? "Bestseller"
    : copy.familyLabels[0] ?? null;
  const compactSubline = copy.familyLabels.slice(0, 2).join(" / ") || copy.subtitle.replace(`${copy.categoryLabel} - `, "");

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
          <Link to={`/product/${product.handle}`} className="group flex flex-1 flex-col">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.3rem] bg-muted">
              {image ? (
                <img
                  src={image.url}
                  alt={image.altText || `${copy.title} bottle`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  loading="lazy"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
              )}

              <div className="pointer-events-none absolute inset-x-3 top-3 flex items-start justify-between gap-2">
                <span className="rounded-full border border-border/80 bg-background/90 px-2.5 py-1 font-body text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground backdrop-blur-sm">
                  {genderBadge}
                </span>
                {secondaryBadge ? (
                  <span className="rounded-full border border-border/80 bg-background/90 px-2.5 py-1 font-body text-[10px] font-medium uppercase tracking-[0.12em] text-foreground backdrop-blur-sm">
                    {secondaryBadge}
                  </span>
                ) : null}
              </div>

              <div className="pointer-events-none absolute inset-x-3 bottom-3">
                <span className="inline-flex rounded-full border border-white/15 bg-black/65 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.14em] text-white shadow-soft backdrop-blur-sm">
                  2 for {formatUsd(BUNDLE_PRICE_USD)}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-1 flex-col">
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                {copy.categoryLabel}
              </p>
              <h3 className="mt-2 min-h-[2.8rem] font-display text-[1.15rem] font-semibold leading-[1.15] text-foreground line-clamp-2">
                {copy.shortTitle}
              </h3>
              <p className="mt-2 font-body text-sm text-foreground">{compactSubline}</p>
            </div>
          </Link>

          <div className="mt-4 flex items-end justify-between gap-3 border-t border-border/80 pt-4">
            <div className="min-w-0">
              <p className="font-display text-xl font-bold text-foreground">
                {formatUsd(parseFloat(product.price.amount))}
              </p>
              <p className="mt-1 font-body text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                Add to cart
              </p>
            </div>
            <button
              onClick={(event) => onAddToCart?.(event, product)}
              disabled={isCartLoading || !product.availableForSale}
              className="shrink-0 rounded-full border border-accent/30 bg-background px-4 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-foreground transition-all hover:border-accent hover:text-accent disabled:opacity-50"
            >
              {product.availableForSale ? "Add to Cart" : "Sold Out"}
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
      className={cn(className)}
    >
      <Link to={`/product/${product.handle}`} className="group block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
          {image ? (
            <img
              src={image.url}
              alt={image.altText || `${copy.title} bottle`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">No image</div>
          )}
          <div className="pointer-events-none absolute left-3 top-3 hidden items-start flex-col gap-2 md:flex">
          <span className="rounded-full bg-foreground/85 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-background shadow-soft backdrop-blur-sm">
            2 for {formatUsd(BUNDLE_PRICE_USD)}
          </span>
            <span className="rounded-full bg-foreground/85 px-3 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-background shadow-soft backdrop-blur-sm">
              {GIFT_ORDER_LABEL}
            </span>
          </div>
          <div className="pointer-events-none absolute bottom-3 left-3 hidden rounded-full bg-black/65 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-white shadow-soft backdrop-blur-sm md:block">
            {PROMO_CODE} for 10% off
          </div>
        </div>

        <div className="mt-3 space-y-2">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h3 className="font-display text-[1.05rem] font-semibold leading-tight text-foreground md:text-lg">
            {copy.shortTitle}
          </h3>
          <p className="font-body text-xs leading-relaxed text-muted-foreground line-clamp-1">{copy.subtitle}</p>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
            {PROMO_CODE} for 10% off
          </p>
          {copy.familyLabels.length > 0 && (
            <div className="hidden flex-wrap gap-2 md:flex">
              {copy.familyLabels.slice(0, 2).map((family) => (
                <span key={family} className="rounded-full bg-secondary/60 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
                  {family}
                </span>
              ))}
            </div>
          )}
          <p className="hidden font-body text-sm leading-relaxed text-muted-foreground line-clamp-2 md:block">
            {copy.description}
          </p>
        </div>
      </Link>

      <div className="mt-3 space-y-3">
        <div className="min-w-0">
          <span className="font-display text-lg font-bold text-foreground">
            {formatUsd(parseFloat(product.price.amount))}
          </span>
          <p className="mt-1 font-body text-[11px] leading-relaxed text-muted-foreground">
            {`Buy any 2 for ${formatUsd(BUNDLE_PRICE_USD)}, then ${ADDITIONAL_PERFUME_PRICE_LABEL} each extra bottle. ${GIFT_ORDER_LABEL}.`}
          </p>
          <p className="mt-1 font-body text-[11px] leading-relaxed text-muted-foreground">
            Applicable sales tax is shown at checkout before payment.
          </p>
        </div>
        <button
          onClick={(event) => onAddToCart?.(event, product)}
          disabled={isCartLoading || !product.availableForSale}
          className="w-full whitespace-nowrap rounded-full bg-primary px-4 py-2.5 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-all hover:bg-foreground/80 disabled:opacity-50"
        >
          {product.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </motion.article>
  );
};

export default ProductCard;
