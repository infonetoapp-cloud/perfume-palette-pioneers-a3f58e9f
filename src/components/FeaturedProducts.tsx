import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Loader2, ShoppingBag } from "lucide-react";
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";

const FeaturedProducts = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);
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

  const handleAddToCart = async (product: ShopifyProduct) => {
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
    toast.success("Sepete eklendi", {
      description: product.node.title,
    });
  };

  if (loading) {
    return (
      <section className="bg-secondary py-24 lg:py-32">
        <div className="container mx-auto flex items-center justify-center px-6">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className="bg-secondary py-24 lg:py-32">
        <div className="container mx-auto px-6 text-center">
          <span className="mb-3 block font-body text-xs font-medium uppercase tracking-[0.4em] text-accent">
            Koleksiyon
          </span>
          <h2 className="mb-4 font-display text-4xl font-light text-foreground md:text-5xl">
            Henüz ürün yok
          </h2>
          <p className="mx-auto max-w-md font-body text-base text-muted-foreground">
            Mağazanıza ürün eklemek için sohbette bana ne satmak istediğinizi söyleyin.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-secondary py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block font-body text-xs font-medium uppercase tracking-[0.4em] text-accent">
            Koleksiyon
          </span>
          <h2 className="mb-4 font-display text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
            Editörün <span className="italic">seçimi</span>
          </h2>
          <p className="mx-auto max-w-lg font-body text-base text-muted-foreground">
            Özenle küratörlenmiş parfüm koleksiyonumuzu keşfedin.
          </p>
        </motion.div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const image = product.node.images.edges[0]?.node;
            const price = product.node.priceRange.minVariantPrice;
            const variant = product.node.variants.edges[0]?.node;

            return (
              <motion.div
                key={product.node.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="group"
              >
                <Link to={`/product/${product.node.handle}`} className="block">
                  <div className="relative aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                    {image ? (
                      <img
                        src={image.url}
                        alt={image.altText || product.node.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </Link>

                <div className="mt-4">
                  <Link to={`/product/${product.node.handle}`}>
                    <h3 className="font-display text-xl font-medium text-foreground transition-colors hover:text-accent">
                      {product.node.title}
                    </h3>
                  </Link>
                  <p className="mt-1 font-body text-sm text-muted-foreground line-clamp-2">
                    {product.node.description}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-display text-lg font-semibold text-foreground">
                      {parseFloat(price.amount).toFixed(2)} {price.currencyCode}
                    </span>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isCartLoading || !variant?.availableForSale}
                      className="rounded-sm bg-primary px-5 py-2 font-body text-xs font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-accent disabled:opacity-50"
                    >
                      {isCartLoading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : variant?.availableForSale ? (
                        "Sepete Ekle"
                      ) : (
                        "Tükendi"
                      )}
                    </button>
                  </div>
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
