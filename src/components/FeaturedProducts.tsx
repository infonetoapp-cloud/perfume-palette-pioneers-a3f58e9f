import { useRef, type MouseEvent, type PointerEvent, type WheelEvent } from "react";
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
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef({
    isDragging: false,
    pointerId: -1,
    startX: 0,
    startScrollLeft: 0,
  });

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

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || !scrollerRef.current) return;

    dragStateRef.current = {
      isDragging: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: scrollerRef.current.scrollLeft,
    };

    scrollerRef.current.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollerRef.current || !dragStateRef.current.isDragging) return;
    if (event.pointerId !== dragStateRef.current.pointerId) return;

    const deltaX = event.clientX - dragStateRef.current.startX;
    scrollerRef.current.scrollLeft = dragStateRef.current.startScrollLeft - deltaX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return;
    if (dragStateRef.current.pointerId !== event.pointerId) return;

    dragStateRef.current.isDragging = false;
    scrollerRef.current.releasePointerCapture(event.pointerId);
  };

  const handleWheel = (event: WheelEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    scrollerRef.current.scrollLeft += event.deltaY;
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

        <div
          ref={scrollerRef}
          className="featured-scroll flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 pr-4 [scrollbar-width:none] [-ms-overflow-style:none] cursor-grab active:cursor-grabbing"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onWheel={handleWheel}
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="w-[280px] flex-shrink-0 snap-start md:w-[300px]"
            >
              <ProductCard
                product={product}
                index={i}
                isCartLoading={isCartLoading}
                onAddToCart={handleAddToCart}
              />
            </div>
          ))}
          <div className="w-px flex-shrink-0" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
