import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ShoppingBag,
  ChevronRight,
  Heart,
  Sparkles,
  Droplets,
  Flower2,
  Wind,
  Flame,
  TreePine,
  Citrus,
  Package,
  RotateCcw,
  HelpCircle,
  Cherry,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getCollectionDefinition, getCollectionPath, getProductDisplayCopy } from "@/lib/catalog";
import { getCatalogProductByHandle, getRelatedCatalogProducts, type CatalogProduct } from "@/lib/catalogData";
import { getProductMeta, type ProductMeta } from "@/lib/productMetadata";
import { getAbsoluteUrl, SITE_BRAND, SITE_NAME } from "@/lib/site";
import { useI18n } from "@/lib/i18n";
import { useCartStore } from "@/stores/cartStore";

const noteIconMap: Record<string, ReactNode> = {
  floral: <Flower2 className="h-7 w-7 text-accent" />,
  sweet: <Cherry className="h-7 w-7 text-accent" />,
  warm: <Flame className="h-7 w-7 text-accent" />,
  fresh: <Wind className="h-7 w-7 text-accent" />,
  woody: <TreePine className="h-7 w-7 text-accent" />,
  spicy: <Sparkles className="h-7 w-7 text-accent" />,
  citrus: <Citrus className="h-7 w-7 text-accent" />,
  musky: <Droplets className="h-7 w-7 text-accent" />,
};

const TrustBadges = () => {
  const badges = [
    { icon: <Sparkles className="h-3.5 w-3.5" />, label: "50ml / 1.7oz" },
    { icon: <Heart className="h-3.5 w-3.5" />, label: "Eau de Parfum" },
    { icon: <Droplets className="h-3.5 w-3.5" />, label: "Free U.S. shipping" },
  ];

  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {badges.map((badge) => (
        <span key={badge.label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 font-body text-xs text-foreground">
          {badge.icon}
          {badge.label}
        </span>
      ))}
    </div>
  );
};

const ScentNotes = ({ meta }: { meta: ProductMeta }) => (
  <div className="space-y-4">
    <div className="flex justify-center gap-6 py-4">
      {meta.mainNotes.map((note) => (
        <div key={note.name} className="flex flex-col items-center gap-1.5">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60">
            {noteIconMap[note.icon] || <Droplets className="h-7 w-7 text-accent" />}
          </div>
          <span className="font-body text-xs text-muted-foreground">{note.name}</span>
        </div>
      ))}
    </div>
    <div className="space-y-3 text-sm">
      {[
        { tier: "Top", desc: "The first impression", notes: meta.scentNotes.top.join(", ") },
        { tier: "Middle", desc: "The heart of the fragrance", notes: meta.scentNotes.middle.join(", ") },
        { tier: "Base", desc: "The lasting dry-down", notes: meta.scentNotes.base.join(", ") },
      ].map((row) => (
        <div key={row.tier} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-accent/10">
            <Droplets className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="font-body font-semibold text-foreground">
              {row.tier}: <span className="font-normal text-muted-foreground">{row.desc}</span>
            </p>
            <p className="font-body text-muted-foreground">{row.notes}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ScentIntensity = ({ level = "Medium" }: { level?: "Soft" | "Medium" | "Strong" }) => {
  const levels: Array<"Soft" | "Medium" | "Strong"> = ["Soft", "Medium", "Strong"];
  const index = levels.indexOf(level);

  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Intensity:</span>
      <div className="flex items-center gap-1">
        {levels.map((item, itemIndex) => (
          <div key={item} className={`h-2 w-8 rounded-full ${itemIndex <= index ? "bg-accent" : "bg-border"}`} />
        ))}
      </div>
      <span className="font-body text-xs text-foreground">{level}</span>
    </div>
  );
};

const ScentFamilyLinks = ({ meta }: { meta: ProductMeta | null }) => {
  if (!meta || meta.scentFamilies.length === 0) return null;

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {meta.scentFamilies.map((family) => {
        const definition = getCollectionDefinition(family);
        return (
          <Link
            key={family}
            to={getCollectionPath(family)}
            className="rounded-full border border-border bg-secondary/40 px-3 py-1.5 font-body text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {definition.label}
          </Link>
        );
      })}
    </div>
  );
};

const ProductAccordions = ({ meta }: { meta: ProductMeta | null }) => (
  <Accordion type="multiple" className="mt-6 w-full" defaultValue={meta ? ["scent-notes"] : ["about"]}>
    {meta && (
      <AccordionItem value="scent-notes">
        <AccordionTrigger className="font-display text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Droplets className="h-4 w-4" />
            Scent Notes
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <ScentNotes meta={meta} />
        </AccordionContent>
      </AccordionItem>
    )}

    <AccordionItem value="about">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          What It Smells Like
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 font-body text-sm text-muted-foreground">
          {meta && (
            <>
              <p className="font-medium text-foreground">{meta.feeling}</p>
              <p>{meta.description}</p>
              <ScentFamilyLinks meta={meta} />
            </>
          )}
          <p>
            <strong>Concentration:</strong> Eau de Parfum
          </p>
          <p>
            <strong>Size:</strong> 50ml / 1.7oz
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>

    {meta && (
      <AccordionItem value="usage">
        <AccordionTrigger className="font-display text-sm font-semibold">
          <span className="flex items-center gap-2">
            <Wind className="h-4 w-4" />
            When to Wear
          </span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="space-y-2 font-body text-sm text-muted-foreground">
            <p>{meta.usage}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {meta.badges.map((badge) => (
                <span key={badge} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    )}

    <AccordionItem value="shipping">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Shipping
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div id="shipping" className="space-y-2 font-body text-sm text-muted-foreground">
          <p>Standard shipping is free for delivery addresses within the United States.</p>
          <p>Most in-stock orders are expected to process within 1 to 3 business days.</p>
          <p>Tracking information should be sent once the order ships.</p>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="returns">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4" />
          Returns
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 font-body text-sm text-muted-foreground">
          <p>Return requests should be made within 30 days of delivery.</p>
          <p>Items should be unused and returned in saleable condition with original packaging where possible.</p>
          <p>Damaged or incorrect orders should be reported promptly for review.</p>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="faq">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQ
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div id="faq" className="space-y-3 font-body text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">Are these fragrances long-lasting?</p>
            <p>Yes. All product pages are configured for Eau de Parfum concentration.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">How do I pick the right scent?</p>
            <p>Use the notes, mood, and occasion guidance on each product page or browse by women's and men's collections.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">How should I apply fragrance?</p>
            <p>Spray two to four times on pulse points such as the wrists, neck, and chest. Let the scent settle naturally on skin.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Is shipping free in the United States?</p>
            <p>Yes. Standard shipping is free for U.S. delivery addresses under the current storefront policy.</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const RelatedProducts = ({ currentHandle }: { currentHandle: string }) => {
  const products = getRelatedCatalogProducts(currentHandle, 4);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

  if (products.length === 0) return null;

  const handleAddToCart = async (product: CatalogProduct) => {
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

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">You May Also Like</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            isCartLoading={isCartLoading}
            onAddToCart={(event) => {
              event.preventDefault();
              handleAddToCart(product);
            }}
          />
        ))}
      </div>
    </section>
  );
};

const ProductDetail = () => {
  const { t } = useI18n();
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

  const product = getCatalogProductByHandle(handle);

  useEffect(() => {
    setSelectedImage(0);
  }, [handle]);

  useEffect(() => {
    if (product && handle && handle !== product.handle) {
      navigate(`/product/${product.handle}`, { replace: true });
    }
  }, [handle, navigate, product]);

  if (!product) {
    return (
      <>
        <Seo title={`Product Not Found | ${SITE_NAME}`} description="This product could not be found." noindex />
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-28">
          <h1 className="font-display text-3xl font-bold text-foreground">{t("product.notFound")}</h1>
          <Link to="/" className="font-body text-sm text-accent hover:underline">{t("product.goHome")}</Link>
        </div>
      </>
    );
  }

  const meta = getProductMeta(product.handle) ?? (handle ? getProductMeta(handle) : null);
  const copy = getProductDisplayCopy(product);
  const selectedVisual = product.images[selectedImage] ?? product.images[0];
  const productPath = `/product/${product.handle}`;

  const handleAddToCart = async () => {
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

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: copy.title,
    sku: copy.code || undefined,
    description: copy.metaDescription,
    image: product.images.map((image) => getAbsoluteUrl(image.url)),
    brand: { "@type": "Brand", name: SITE_BRAND },
    category: copy.categoryLabel,
    offers: {
      "@type": "Offer",
      url: getAbsoluteUrl(productPath),
      priceCurrency: product.price.currencyCode,
      price: product.price.amount,
      availability: product.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "All Perfumes", item: getAbsoluteUrl(getCollectionPath("all-perfumes")) },
      { "@type": "ListItem", position: 3, name: copy.title, item: getAbsoluteUrl(productPath) },
    ],
  };

  return (
    <>
      <Seo
        title={`${copy.title} | ${SITE_NAME}`}
        description={copy.metaDescription}
        path={productPath}
        type="product"
        image={product.images[0]?.url}
        jsonLd={[productJsonLd, breadcrumbJsonLd]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-28">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
          <Link to={getCollectionPath("all-perfumes")} className="mb-6 inline-flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Back to all perfumes
          </Link>

          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 font-body text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to={getCollectionPath("all-perfumes")} className="transition-colors hover:text-foreground">All Perfumes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">{copy.shortTitle}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {meta && (
                <div className="mb-3 flex gap-2">
                  <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-body text-xs text-muted-foreground">
                    {copy.categoryLabel}
                  </span>
                  {meta.badges.slice(0, 2).map((badge) => (
                    <span key={badge} className="rounded-full bg-accent/10 px-3 py-1 font-body text-xs text-accent">
                      {badge}
                    </span>
                  ))}
                </div>
              )}

              <div className="aspect-[3/4] cursor-pointer overflow-hidden rounded-2xl bg-muted" onClick={() => setSelectedImage(0)}>
                {selectedVisual ? (
                  <img src={selectedVisual.url} alt={selectedVisual.altText} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="mt-3 grid grid-cols-2 gap-3">
                  {product.images.slice(1).map((image, index) => (
                    <div
                      key={image.url}
                      onClick={() => setSelectedImage(index + 1)}
                      className={`aspect-square cursor-pointer overflow-hidden rounded-xl border-2 bg-muted transition-all ${
                        selectedImage === index + 1 ? "border-accent" : "border-transparent hover:border-accent/40"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.altText}
                        className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-accent">{copy.eyebrow}</p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">{copy.title}</h1>
              <p className="mt-1 font-body text-sm text-muted-foreground">Eau de Parfum - 50ml / 1.7oz</p>
              <p className="mt-3 font-body text-sm text-muted-foreground">{copy.subtitle}</p>
              <ScentFamilyLinks meta={meta} />

              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">${parseFloat(product.price.amount).toFixed(0)}</span>
              </div>

              <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground">{copy.description}</p>

              {meta && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-body text-xs text-accent">
                    {copy.categoryLabel}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 font-body text-xs text-muted-foreground">
                    Best for: {meta.usage.split(",")[0]}
                  </span>
                </div>
              )}

              <ScentIntensity level={meta?.intensity || "Medium"} />
              <TrustBadges />

              <div className="mt-6 space-y-4">
                {product.options.map((option) => (
                  <div key={option.name}>
                    <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      {option.name}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => (
                        <button
                          key={value}
                          type="button"
                          className="rounded-full border border-foreground bg-foreground px-5 py-2 font-body text-sm text-background"
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !product.availableForSale}
                className="mt-8 w-full rounded-full bg-accent px-8 py-4 font-body text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
              >
                {isCartLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : product.availableForSale ? t("products.addToCart") : t("products.soldOut")}
              </button>

              <ProductAccordions meta={meta} />
            </motion.div>
          </div>

          <RelatedProducts currentHandle={product.handle} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
