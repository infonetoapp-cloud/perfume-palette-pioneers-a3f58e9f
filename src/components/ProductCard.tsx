import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { getProductDisplayCopy } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalogData";

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
      initial={{ opacity: 0, y: 24 }}
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
        </div>

        <div className="mt-4 space-y-2">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {copy.eyebrow}
          </p>
          <h3 className="font-display text-lg font-semibold text-foreground">{copy.shortTitle}</h3>
          <p className="font-body text-xs text-muted-foreground line-clamp-1">{copy.subtitle}</p>
          {copy.familyLabels.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {copy.familyLabels.slice(0, 2).map((family) => (
                <span key={family} className="rounded-full bg-secondary/60 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground">
                  {family}
                </span>
              ))}
            </div>
          )}
          <p className="font-body text-sm leading-relaxed text-muted-foreground line-clamp-2">{copy.description}</p>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="font-display text-lg font-bold text-foreground">
          ${parseFloat(product.price.amount).toFixed(0)}
        </span>
        <button
          onClick={(event) => onAddToCart?.(event, product)}
          disabled={isCartLoading || !product.availableForSale}
          className="rounded-full bg-primary px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground/80 disabled:opacity-50"
        >
          {product.availableForSale ? "Add to Cart" : "Sold Out"}
        </button>
      </div>
    </motion.article>
  );
};

export default ProductCard;
