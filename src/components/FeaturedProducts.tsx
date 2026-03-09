import type { MouseEvent } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { getCollectionPath, getProductDisplayCopy } from "@/lib/catalog";
import { getCatalogProductsForCollection, type CatalogProduct } from "@/lib/catalogData";

const FeaturedProducts = () => {
  const { t } = useI18n();
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);
  const products = getCatalogProductsForCollection("best-sellers").slice(0, 12);
  const marqueeProducts = [...products, ...products];

  const handleAddToCart = async (e: MouseEvent, product: CatalogProduct) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.availableForSale) return;

    await addItem({
      product,
      variantId: product.variant.id,
      variantTitle: product.variant.title,
      price: product.variant.price,
      quantity: 1,
      selectedOptions: product.variant.selectedOptions,
    });

    toast.success(t("cart.added"), { description: getProductDisplayCopy(product).shortTitle });
  };
  if (products.length === 0) {
    return (
      <section id="products" className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">{t("products.noProducts")}</h2>
          <p className="mt-3 font-body text-base text-muted-foreground">{t("products.noProductsDesc")}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">{t("products.title")}</h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">{t("products.subtitle")}</p>
          </div>
          <div className="flex items-center gap-2">
            <Link to={getCollectionPath("all-perfumes")} className="hidden font-body text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent md:block">
              {t("products.viewAll")}
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent" />

          <div className="featured-marquee-track flex w-max gap-5 pb-4">
            {marqueeProducts.map((product, i) => (
              <div
                key={`${product.id}-${i}`}
                className="w-[280px] flex-shrink-0 md:w-[300px]"
              >
                <ProductCard
                  product={product}
                  index={i % products.length}
                  isCartLoading={isCartLoading}
                  onAddToCart={handleAddToCart}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
