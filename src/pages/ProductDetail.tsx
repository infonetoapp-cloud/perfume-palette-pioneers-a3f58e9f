import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingBag, ChevronRight, Heart, Sparkles, Droplets, Flower2, Wind, Flame, TreePine, Citrus, Package, RotateCcw, HelpCircle, Cherry } from "lucide-react";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY, PRODUCTS_QUERY, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getProductMeta, type ProductMeta } from "@/lib/productMetadata";
import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface ProductNode {
  id: string;
  title: string;
  description: string;
  handle: string;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: {
    edges: Array<{
      node: {
        id: string;
        title: string;
        price: { amount: string; currencyCode: string };
        availableForSale: boolean;
        selectedOptions: Array<{ name: string; value: string }>;
      };
    }>;
  };
  options: Array<{ name: string; values: string[] }>;
}

/* ── Icon helpers ── */
const noteIconMap: Record<string, React.ReactNode> = {
  floral: <Flower2 className="h-7 w-7 text-accent" />,
  sweet: <Cherry className="h-7 w-7 text-accent" />,
  warm: <Flame className="h-7 w-7 text-accent" />,
  fresh: <Wind className="h-7 w-7 text-accent" />,
  woody: <TreePine className="h-7 w-7 text-accent" />,
  spicy: <Sparkles className="h-7 w-7 text-accent" />,
  citrus: <Citrus className="h-7 w-7 text-accent" />,
  musky: <Droplets className="h-7 w-7 text-accent" />,
};

/* ── JSON-LD Schema ── */
const ProductJsonLd = ({ product, variant }: { product: ProductNode; variant: ProductNode["variants"]["edges"][0]["node"] }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.edges.map((img) => img.node.url),
    brand: { "@type": "Brand", name: "Real Scents" },
    offers: {
      "@type": "Offer",
      url: `https://realscents.com/product/${product.handle}`,
      priceCurrency: variant.price.currencyCode,
      price: variant.price.amount,
      availability: variant.availableForSale ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

const BreadcrumbJsonLd = ({ productTitle, handle }: { productTitle: string; handle: string }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://realscents.com/" },
      { "@type": "ListItem", position: 2, name: "Perfumes", item: "https://realscents.com/" },
      { "@type": "ListItem", position: 3, name: productTitle, item: `https://realscents.com/product/${handle}` },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />;
};

/* ── Trust Badges (no Vegan) ── */
const TrustBadges = () => {
  const badges = [
    { icon: <Sparkles className="h-3.5 w-3.5" />, label: "IFRA Compliant" },
    { icon: <Heart className="h-3.5 w-3.5" />, label: "EU Standards" },
    { icon: <Droplets className="h-3.5 w-3.5" />, label: "Long-lasting" },
  ];
  return (
    <div className="flex flex-wrap gap-2 mt-5">
      {badges.map((badge) => (
        <span key={badge.label} className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/50 px-3 py-1.5 font-body text-xs text-foreground">
          {badge.icon} {badge.label}
        </span>
      ))}
    </div>
  );
};

/* ── Scent Notes (dynamic from meta) ── */
const ScentNotes = ({ meta }: { meta: ProductMeta }) => (
  <div className="space-y-4">
    <div className="flex gap-6 justify-center py-4">
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
        { tier: "Base", desc: "Long-lasting foundation", notes: meta.scentNotes.base.join(", ") },
      ].map((row) => (
        <div key={row.tier} className="flex items-start gap-3 rounded-lg bg-secondary/30 p-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-accent/10">
            <Droplets className="h-4 w-4 text-accent" />
          </div>
          <div>
            <p className="font-body font-semibold text-foreground">{row.tier}: <span className="font-normal text-muted-foreground">{row.desc}</span></p>
            <p className="font-body text-muted-foreground">{row.notes}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ── Scent Intensity Bar ── */
const ScentIntensity = ({ level = "Medium" }: { level?: "Soft" | "Medium" | "Strong" }) => {
  const levels: Array<"Soft" | "Medium" | "Strong"> = ["Soft", "Medium", "Strong"];
  const idx = levels.indexOf(level);
  return (
    <div className="mt-4 flex items-center gap-3">
      <span className="font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">Intensity:</span>
      <div className="flex items-center gap-1">
        {levels.map((l, i) => (
          <div key={l} className={`h-2 w-8 rounded-full ${i <= idx ? "bg-accent" : "bg-border"}`} />
        ))}
      </div>
      <span className="font-body text-xs text-foreground">{level}</span>
    </div>
  );
};

/* ── Product Info Accordions ── */
const ProductAccordions = ({ meta }: { meta: ProductMeta | null }) => (
  <Accordion type="multiple" className="mt-6 w-full" defaultValue={meta ? ["scent-notes"] : ["about"]}>
    {meta && (
      <AccordionItem value="scent-notes">
        <AccordionTrigger className="font-display text-sm font-semibold">
          <span className="flex items-center gap-2"><Droplets className="h-4 w-4" /> Scent Notes</span>
        </AccordionTrigger>
        <AccordionContent>
          <ScentNotes meta={meta} />
        </AccordionContent>
      </AccordionItem>
    )}

    <AccordionItem value="about">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2"><Sparkles className="h-4 w-4" /> About</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 font-body text-sm text-muted-foreground">
          {meta && (
            <>
              <p className="text-foreground font-medium">{meta.feeling}</p>
              <p>{meta.description}</p>
              <div className="flex items-center gap-2 rounded-lg bg-secondary/40 px-3 py-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Inspired by:</span>
                <span className="text-foreground">{meta.inspiredBy} — {meta.inspiredBrand}</span>
              </div>
            </>
          )}
          <p><strong>Concentration:</strong> Eau de Parfum</p>
          <p><strong>Size:</strong> 50ml / 1.7oz</p>
        </div>
      </AccordionContent>
    </AccordionItem>

    {meta && (
      <AccordionItem value="usage">
        <AccordionTrigger className="font-display text-sm font-semibold">
          <span className="flex items-center gap-2"><Wind className="h-4 w-4" /> When to Wear</span>
        </AccordionTrigger>
        <AccordionContent>
          <div className="font-body text-sm text-muted-foreground space-y-2">
            <p>{meta.usage}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {meta.badges.map((badge) => (
                <span key={badge} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{badge}</span>
              ))}
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    )}

    <AccordionItem value="shipping">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2"><Package className="h-4 w-4" /> Kargo</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 font-body text-sm text-muted-foreground">
          <div className="flex justify-between"><span>Standard Shipping (2+ items)</span><span className="font-semibold text-accent">FREE</span></div>
          <div className="flex justify-between"><span>Standard Shipping</span><span>$3.95</span></div>
          <div className="flex justify-between"><span>Express Shipping (2 business days)</span><span>$19.00</span></div>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="returns">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2"><RotateCcw className="h-4 w-4" /> İade</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-2 font-body text-sm text-muted-foreground">
          <p>Kokunuzu sevmenizi istiyoruz. Memnun kalmazsanız, siparişin teslim tarihinden itibaren 30 gün içinde iade edebilirsiniz.</p>
          <p>Tüm siparişlerde ücretsiz değişim imkânı.</p>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="faq">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2"><HelpCircle className="h-4 w-4" /> SSS</span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 font-body text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">Bu parfümler kalıcı mı?</p>
            <p>Evet, yüksek konsantrasyonlu Eau de Parfum formülüyle uzun süre kalıcılık sağlar.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Hangi kokuyu seçeceğimi bilmiyorum?</p>
            <p>Koleksiyonumuza göz atın veya bize ulaşın, size özel önerilerde bulunalım.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Orijinal parfümlerle aynı mı?</p>
            <p>Ürünlerimiz ilham aldığı kokuların yorumlarıdır. Aynı kalite standartlarında, daha uygun fiyatlarla sunulmaktadır.</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

/* ── Related Products ── */
const RelatedProducts = ({ currentHandle }: { currentHandle: string }) => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 5 });
        const all = (data?.data?.products?.edges || []) as ShopifyProduct[];
        setProducts(all.filter((p) => p.node.handle !== currentHandle).slice(0, 4));
      } catch (e) {
        console.error("Failed to fetch related products:", e);
      }
    };
    fetchRelated();
  }, [currentHandle]);

  if (products.length === 0) return null;

  const handleAddToCart = async (product: ShopifyProduct) => {
    const variant = product.node.variants.edges[0]?.node;
    if (!variant?.availableForSale) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Added to cart", { description: product.node.title });
  };

  return (
    <section className="mt-16 border-t border-border pt-12">
      <h2 className="mb-8 text-center font-display text-2xl font-bold text-foreground">Bunları da Sevebilirsin</h2>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {products.map((p) => {
          const img = p.node.images.edges[0]?.node;
          const price = p.node.priceRange.minVariantPrice;
          return (
            <motion.div key={p.node.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
              <Link to={`/product/${p.node.handle}`} className="group block">
                <div className="aspect-[3/4] overflow-hidden rounded-xl bg-muted">
                  {img ? (
                    <img src={img.url} alt={img.altText || p.node.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><ShoppingBag className="h-8 w-8 text-muted-foreground" /></div>
                  )}
                </div>
                <h3 className="mt-3 font-display text-sm font-semibold text-foreground">{p.node.title}</h3>
                <p className="font-body text-sm text-muted-foreground">${parseFloat(price.amount).toFixed(0)}</p>
              </Link>
              <button
                onClick={(e) => { e.preventDefault(); handleAddToCart(p); }}
                disabled={isCartLoading}
                className="mt-2 w-full rounded-full border border-foreground bg-transparent px-4 py-2 font-body text-xs font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-foreground hover:text-background"
              >
                Add to Cart
              </button>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

/* ── Main Page ── */
const ProductDetail = () => {
  const { t } = useI18n();
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  const meta = handle ? getProductMeta(handle) : null;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) setProduct(data.data.productByHandle);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (handle) fetchProduct();
  }, [handle]);

  useEffect(() => {
    if (product) {
      document.title = `${product.title} | Real Scents — Premium Perfumes`;
    }
    return () => { document.title = "Real Scents — Premium Perfumes"; };
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    const variant = product.variants.edges[selectedVariantIdx]?.node;
    if (!variant || !variant.availableForSale) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success(t("cart.added"), { description: product.title });
  };

  if (loading) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <AnnouncementBar />
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="font-display text-3xl font-bold text-foreground">{t("product.notFound")}</h1>
          <Link to="/" className="font-body text-sm text-accent hover:underline">{t("product.goHome")}</Link>
        </div>
      </>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

  return (
    <>
      <ProductJsonLd product={product} variant={variant} />
      <BreadcrumbJsonLd productTitle={product.title} handle={product.handle} />
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">

          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 font-body text-xs text-muted-foreground">
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/" className="transition-colors hover:text-foreground">Perfumes</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">{product.title}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* Images */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              {/* Gender + Badges */}
              {meta && (
                <div className="mb-3 flex gap-2">
                  <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-body text-xs text-muted-foreground">
                    {meta.gender === "women" ? "Women" : meta.gender === "men" ? "Men" : "Unisex"}
                  </span>
                  {meta.badges.slice(0, 2).map((b) => (
                    <span key={b} className="rounded-full bg-accent/10 px-3 py-1 font-body text-xs text-accent">{b}</span>
                  ))}
                </div>
              )}

              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                {images[selectedImage] ? (
                  <img src={images[selectedImage].node.url} alt={images[selectedImage].node.altText || product.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center"><ShoppingBag className="h-16 w-16 text-muted-foreground" /></div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button key={idx} onClick={() => setSelectedImage(idx)} className={`h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all ${idx === selectedImage ? "border-accent" : "border-border"}`}>
                      <img src={img.node.url} alt="" className="h-full w-full object-cover" loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
              <h1 className="font-display text-3xl font-bold text-foreground md:text-4xl">{product.title}</h1>
              <p className="mt-1 font-body text-sm text-muted-foreground">Eau de Parfum · 50ml / 1.7oz</p>

              {/* Inspired By */}
              {meta && (
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  İlham: <span className="font-semibold text-foreground">{meta.inspiredBy}</span> — {meta.inspiredBrand}
                </p>
              )}

              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">
                  ${variant ? parseFloat(variant.price.amount).toFixed(0) : parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                </span>
              </div>

              {/* Dynamic description from metadata or Shopify */}
              <p className="mt-5 font-body text-sm leading-relaxed text-muted-foreground">
                {meta ? meta.feeling + " " + meta.description : product.description}
              </p>

              {/* Product Tags - no "Crafted in France" */}
              {meta && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-body text-xs text-accent">
                    {meta.gender === "women" ? "Kadın Parfümü" : meta.gender === "men" ? "Erkek Parfümü" : "Unisex"}
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 font-body text-xs text-muted-foreground">
                    Kullanım: {meta.usage.split(",")[0]}
                  </span>
                </div>
              )}

              <ScentIntensity level={meta?.intensity || "Medium"} />
              <TrustBadges />

              {/* Variant Selector */}
              {product.options.length > 0 && product.options[0].name !== "Title" && (
                <div className="mt-6 space-y-4">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <label className="mb-2 block font-body text-xs font-semibold uppercase tracking-widest text-muted-foreground">{option.name}</label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const variantIdx = product.variants.edges.findIndex((v) => v.node.selectedOptions.some((o) => o.name === option.name && o.value === value));
                          const isSelected = variantIdx === selectedVariantIdx;
                          return (
                            <button key={value} onClick={() => variantIdx >= 0 && setSelectedVariantIdx(variantIdx)} className={`rounded-full border px-5 py-2 font-body text-sm transition-all ${isSelected ? "border-foreground bg-foreground text-background" : "border-border text-foreground hover:border-foreground"}`}>
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !variant?.availableForSale}
                className="mt-8 w-full rounded-full bg-accent px-8 py-4 font-body text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
              >
                {isCartLoading ? <Loader2 className="mx-auto h-5 w-5 animate-spin" /> : variant?.availableForSale ? t("products.addToCart") : t("products.soldOut")}
              </button>

              {/* Accordions */}
              <ProductAccordions meta={meta} />
            </motion.div>
          </div>

          {/* Related Products */}
          <RelatedProducts currentHandle={handle || ""} />
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
