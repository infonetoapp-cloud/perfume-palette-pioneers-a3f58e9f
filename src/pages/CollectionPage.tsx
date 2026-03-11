import { useEffect, useRef, type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AutoScentCard from "@/components/AutoScentCard";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { getAutoScentVariants } from "@/lib/autoScents";
import { getCollectionDefinition, getCollectionPath, getProductDisplayCopy } from "@/lib/catalog";
import type { CatalogProduct } from "@/lib/catalogData";
import { getAbsoluteUrl, SITE_NAME } from "@/lib/site";
import { useCartStore } from "@/stores/cartStore";
import { useStorefrontCatalog } from "@/stores/storefrontCatalogStore";

const COLLECTION_TILES = [
  { label: "All Perfumes", slug: "all-perfumes", to: getCollectionPath("all-perfumes") },
  { label: "Best Sellers", slug: "best-sellers", to: getCollectionPath("best-sellers") },
  { label: "Women", slug: "women", to: getCollectionPath("women") },
  { label: "Men", slug: "men", to: getCollectionPath("men") },
  { label: "Vanilla", slug: "vanilla", to: getCollectionPath("vanilla") },
  { label: "Fresh", slug: "fresh", to: getCollectionPath("fresh") },
  { label: "Woody", slug: "woody", to: getCollectionPath("woody") },
  { label: "Floral", slug: "floral", to: getCollectionPath("floral") },
  { label: "Citrus", slug: "citrus", to: getCollectionPath("citrus") },
  { label: "Amber", slug: "amber", to: getCollectionPath("amber") },
  { label: "Aromatic", slug: "aromatic", to: getCollectionPath("aromatic") },
  { label: "Car Scents", slug: "auto-scents", to: getCollectionPath("auto-scents") },
] as const;

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = getCollectionDefinition(slug);
  const activeTileRef = useRef<HTMLAnchorElement | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const { getProductsForCollection } = useStorefrontCatalog();
  const autoScentVariants = getAutoScentVariants();
  const isAutoScentsCollection = collection.slug === "auto-scents";
  const visibleProducts = getProductsForCollection(collection.slug);

  useEffect(() => {
    activeTileRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [collection.slug]);

  const handleAddToCart = async (event: MouseEvent, product: CatalogProduct) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product.availableForSale) return;

    await addItem({
      product,
      variantId: product.variant.id,
      variantTitle: product.variant.title,
      price: product.variant.price,
      quantity: 1,
      selectedOptions: product.variant.selectedOptions,
    });

    toast.success("Added to cart", { description: getProductDisplayCopy(product).shortTitle });
  };

  const canonicalPath = getCollectionPath(collection.slug);
  const itemList = isAutoScentsCollection
    ? autoScentVariants.map((variant, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getAbsoluteUrl(`/auto-scents/${variant.slug}`),
        name: variant.title,
      }))
    : visibleProducts.map((product, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: getAbsoluteUrl(`/product/${product.handle}`),
        name: getProductDisplayCopy(product).title,
      }));

  return (
    <>
      <Seo
        title={`${collection.title} | ${SITE_NAME}`}
        description={collection.description}
        path={canonicalPath}
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: collection.title,
            description: collection.description,
            url: getAbsoluteUrl(canonicalPath),
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: getAbsoluteUrl("/") },
              { "@type": "ListItem", position: 2, name: collection.title, item: getAbsoluteUrl(canonicalPath) },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: collection.title,
            itemListElement: itemList,
          },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-black/8 bg-[linear-gradient(180deg,#ffffff_0%,#fbf8f4_100%)]">
          <div className="container mx-auto px-4 py-4 lg:px-8 lg:py-5">
            <div className="relative overflow-hidden rounded-[1.35rem] border border-black/8 bg-white/90 shadow-[0_14px_34px_rgba(15,23,42,0.04)]">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-white via-white/90 to-white/0 md:hidden" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-white via-white/90 to-white/0 md:hidden" />
              <div className="scrollbar-none -mx-4 flex snap-x snap-mandatory items-center gap-5 overflow-x-auto overscroll-x-contain px-4 py-3 md:mx-0 md:flex-nowrap md:justify-between md:gap-1 md:overflow-visible md:px-3 lg:gap-2 lg:px-4">
                {COLLECTION_TILES.map((entry) => {
                  const isActive = entry.slug === collection.slug;

                  return (
                    <Link
                      key={entry.label}
                      to={entry.to}
                      ref={isActive ? activeTileRef : undefined}
                      className={`group relative flex h-11 shrink-0 snap-start items-center justify-center whitespace-nowrap rounded-full px-4 py-2 leading-none transition-all md:flex-none md:px-2.5 lg:px-3 ${
                        isActive
                          ? "bg-[#fff4ef] text-black shadow-[0_0_0_1px_rgba(239,115,92,0.18)]"
                          : "text-black/72 hover:bg-black/[0.025] hover:text-black"
                      }`}
                    >
                      <span
                        className={`absolute left-1/2 top-0 h-[4px] -translate-x-1/2 rounded-full bg-[#ef735c] transition-all ${
                          isActive ? "w-10 opacity-100" : "w-0 opacity-0 group-hover:w-8 group-hover:opacity-45"
                        }`}
                      />
                      <p className="text-center font-display text-[0.76rem] font-semibold uppercase tracking-[0.14em] md:text-[0.58rem] lg:text-[0.64rem] xl:text-[0.7rem]">
                        {entry.label}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section className="py-10 lg:py-14">
          <div className="container mx-auto px-4 lg:px-8">
            {isAutoScentsCollection ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-3 xl:gap-6">
                {autoScentVariants.map((variant, index) => (
                  <AutoScentCard
                    key={variant.slug}
                    variant={variant}
                    index={index}
                    layout="compact"
                  />
                ))}
              </div>
            ) : visibleProducts.length === 0 ? (
              <div className="rounded-3xl border border-border bg-secondary/20 px-6 py-16 text-center">
                <h2 className="font-display text-2xl font-semibold text-foreground">No products in this collection</h2>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {visibleProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    layout="compact"
                    isCartLoading={isCartLoading}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default CollectionPage;

