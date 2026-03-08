import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCTS_QUERY, { first: 12 });
        if (data?.data?.products?.edges) {
          setProducts(data.data.products.edges);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();
    const variant = product.node.variants.edges[0]?.node;
    if (!variant || !variant.availableForSale) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions || [],
    });
    toast.success("Sepete eklendi", { description: product.node.title });
  };

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    const amount = 320;
    scrollRef.current.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  if (loading) {
    return (
      <section className="bg-background py-16">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section id="products" className="bg-background py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-foreground">
            Henüz ürün yok
          </h2>
          <p className="mt-3 font-body text-base text-muted-foreground">
            Mağazanıza ürün eklemek için sohbette bana söyleyin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground md:text-3xl">
              Seçkin parfümler
            </h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Özenle küratörlenmiş koleksiyonumuz
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="#products"
              className="hidden font-body text-sm font-medium text-foreground underline underline-offset-4 hover:text-accent md:block"
            >
              Tümünü Gör
            </Link>
            <button
              onClick={() => scroll("left")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-all hover:bg-muted"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition-all hover:bg-muted"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {products.map((product, i) => {
            const image = product.node.images.edges[0]?.node;
            const price = product.node.priceRange.minVariantPrice;
            const variant = product.node.variants.edges[0]?.node;

            return (
              <motion.div
                key={product.node.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="w-[280px] flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <Link to={`/product/${product.node.handle}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <span className="text-muted-foreground">Görsel yok</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <h3 className="font-display text-base font-semibold text-foreground">
                      {product.node.title}
                    </h3>
                    {product.node.description && (
                      <p className="mt-0.5 font-body text-xs text-muted-foreground line-clamp-1">
                        {product.node.description}
                      </p>
                    )}
                  </div>
                </Link>

                <div className="mt-3 flex items-center justify-between">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    disabled={isCartLoading || !variant?.availableForSale}
                    className="rounded-full bg-primary px-5 py-2 font-body text-xs font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground/80 disabled:opacity-50"
                  >
                    {variant?.availableForSale ? "SEPETE EKLE" : "TÜKENDİ"}
                  </button>
                  <span className="font-display text-base font-bold text-foreground">
                    {parseFloat(price.amount).toFixed(0)} {price.currencyCode === "TRY" ? "₺" : price.currencyCode}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
