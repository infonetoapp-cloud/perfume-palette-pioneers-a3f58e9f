import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, ShoppingBag } from "lucide-react";
import { storefrontApiRequest, PRODUCT_BY_HANDLE_QUERY } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
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

const ProductDetail = () => {
  const { handle } = useParams<{ handle: string }>();
  const [product, setProduct] = useState<ProductNode | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);
  const addItem = useCartStore((s) => s.addItem);
  const isCartLoading = useCartStore((s) => s.isLoading);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
        if (data?.data?.productByHandle) {
          setProduct(data.data.productByHandle);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      } finally {
        setLoading(false);
      }
    };
    if (handle) fetchProduct();
  }, [handle]);

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
    toast.success("Sepete eklendi", { description: product.title });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-accent" />
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className="flex min-h-screen flex-col items-center justify-center gap-4">
          <h1 className="font-display text-3xl text-foreground">Ürün bulunamadı</h1>
          <Link to="/" className="font-body text-sm text-accent hover:underline">
            Ana sayfaya dön
          </Link>
        </div>
      </>
    );
  }

  const variant = product.variants.edges[selectedVariantIdx]?.node;
  const images = product.images.edges;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24">
        <div className="container mx-auto px-6 py-12 lg:px-12">
          <Link to="/" className="mb-8 inline-flex items-center gap-2 font-body text-sm text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={16} />
            Geri Dön
          </Link>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-muted">
                {images[selectedImage] ? (
                  <img
                    src={images[selectedImage].node.url}
                    alt={images[selectedImage].node.altText || product.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="mt-4 flex gap-3">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`h-20 w-20 overflow-hidden rounded-sm border-2 transition-all ${
                        idx === selectedImage ? "border-accent" : "border-border"
                      }`}
                    >
                      <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="font-display text-4xl font-light text-foreground md:text-5xl">
                {product.title}
              </h1>

              <div className="mt-4">
                <span className="font-display text-2xl font-semibold text-foreground">
                  {variant ? parseFloat(variant.price.amount).toFixed(2) : parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}{" "}
                  {variant?.price.currencyCode || product.priceRange.minVariantPrice.currencyCode}
                </span>
              </div>

              {product.description && (
                <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              )}

              {/* Options / Variants */}
              {product.options.length > 0 && product.options[0].name !== "Title" && (
                <div className="mt-8 space-y-4">
                  {product.options.map((option) => (
                    <div key={option.name}>
                      <label className="mb-2 block font-body text-xs font-medium uppercase tracking-widest text-muted-foreground">
                        {option.name}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((value) => {
                          const variantIdx = product.variants.edges.findIndex(
                            (v) => v.node.selectedOptions.some((o) => o.name === option.name && o.value === value)
                          );
                          const isSelected = variantIdx === selectedVariantIdx;
                          return (
                            <button
                              key={value}
                              onClick={() => variantIdx >= 0 && setSelectedVariantIdx(variantIdx)}
                              className={`rounded-sm border px-4 py-2 font-body text-sm transition-all ${
                                isSelected
                                  ? "border-accent bg-accent text-primary-foreground"
                                  : "border-border text-foreground hover:border-accent"
                              }`}
                            >
                              {value}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={isCartLoading || !variant?.availableForSale}
                className="mt-8 w-full rounded-sm bg-primary px-8 py-4 font-body text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-accent disabled:opacity-50"
              >
                {isCartLoading ? (
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                ) : variant?.availableForSale ? (
                  "Sepete Ekle"
                ) : (
                  "Tükendi"
                )}
              </button>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default ProductDetail;
