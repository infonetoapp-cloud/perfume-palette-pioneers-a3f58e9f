import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductDisplayCopy } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalogData";
import { getMotionInitial } from "@/lib/motion";
import { BUNDLE_PRICE_USD, GIFT_LABEL, PROMO_CODE, formatUsd } from "@/lib/promotions";

interface ProductCardProps {
  product: CatalogProduct;
  index?: number;
  className?: string;
  isCartLoading?: boolean;
  onAddToCart?: (event: MouseEvent, product: CatalogProduct) => void;
}

const ProductCard = ({ product, index = 0, className = "", isCartLoading = false, onAddToCart }: ProductCardProps) => {
  const image = product.images[0];
  const copy = getProductDisplayCopy(product);

  return (
    <motion.article
      initial={getMotionInitial({ opacity: 0, y: 24 })}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className={className}
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
              Surprise gift every order
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
            {`Buy any 2 for ${formatUsd(BUNDLE_PRICE_USD)}. ${GIFT_LABEL}.`}
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
