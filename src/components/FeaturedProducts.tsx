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
  const products = getCatalogProductsForCollection("best-sellers").slice(0, 8);

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
            <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-muted-foreground">
              {t("products.subtitle")}
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
              {t("products.title")}
            </h2>
          </div>
          <Link
            to={getCollectionPath("all-perfumes")}
            className="font-body text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent"
          >
            {t("products.viewAll")}
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6">
          {products.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              isCartLoading={isCartLoading}
              onAddToCart={handleAddToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
