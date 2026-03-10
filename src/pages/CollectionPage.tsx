import { type MouseEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { getCollectionDefinition, getCollectionPath, getProductDisplayCopy, SCENT_FAMILY_SLUGS } from "@/lib/catalog";
import { getCatalogProductsForCollection, type CatalogProduct } from "@/lib/catalogData";
import { getAbsoluteUrl, SITE_NAME } from "@/lib/site";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const CollectionPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const collection = getCollectionDefinition(slug);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const filteredProducts = getCatalogProductsForCollection(collection.slug);

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
  const itemList = filteredProducts.map((product, index) => ({
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
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 font-body text-xs text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">{collection.title}</span>
            </nav>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-accent">{collection.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">{collection.title}</h1>
            <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-foreground">{collection.description}</p>
            <p className="mt-4 font-body text-sm font-medium text-foreground">{filteredProducts.length} fragrances in this collection</p>

            {collection.kind === "family" && (
              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <article className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">What It Smells Like</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{collection.story}</p>
                </article>
                <article className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">Common Notes</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(collection.commonNotes ?? []).map((note) => (
                      <span key={note} className="rounded-full border border-border bg-secondary/40 px-3 py-1 font-body text-xs text-foreground">
                        {note}
                      </span>
                    ))}
                  </div>
                </article>
                <article className="rounded-3xl border border-border bg-card p-5 shadow-soft">
                  <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">Best For</p>
                  <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{collection.wearMoments}</p>
                </article>
              </div>
            )}

            {collection.slug === "all-perfumes" && (
              <div className="mt-8 flex flex-wrap gap-2">
                {SCENT_FAMILY_SLUGS.map((family) => {
                  const familyDefinition = getCollectionDefinition(family);
                  return (
                    <Link
                      key={family}
                      to={getCollectionPath(family)}
                      className="rounded-full border border-border bg-card px-4 py-2 font-body text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
                    >
                      {familyDefinition.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            {filteredProducts.length === 0 ? (
              <div className="rounded-3xl border border-border bg-secondary/20 px-6 py-16 text-center">
                <h2 className="font-display text-2xl font-semibold text-foreground">No products in this collection yet</h2>
                <p className="mt-3 font-body text-sm text-muted-foreground">This collection is still being curated for launch.</p>
              </div>
            ) : (
              <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
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
