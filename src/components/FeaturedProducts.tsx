import { motion } from "framer-motion";
import featuredPerfumes from "@/assets/featured-perfumes.jpg";

const products = [
  { name: "Velvet Noir", family: "Odunsu & Dumanlı", price: "₺2.450", size: "50ml EDP" },
  { name: "Golden Hour", family: "Amber & Reçine", price: "₺1.890", size: "30ml EDP" },
  { name: "Citrus Breeze", family: "Narenciye & Neroli", price: "₺1.650", size: "50ml EDT" },
];

const FeaturedProducts = () => {
  return (
    <section className="bg-secondary py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="overflow-hidden rounded-sm"
          >
            <img
              src={featuredPerfumes}
              alt="Öne çıkan parfüm koleksiyonu"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </motion.div>

          {/* Products */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="mb-3 block font-body text-xs font-medium uppercase tracking-[0.4em] text-accent">
              Öne Çıkanlar
            </span>
            <h2 className="mb-8 font-display text-4xl font-light text-foreground md:text-5xl">
              Editörün <span className="italic">seçimi</span>
            </h2>

            <div className="flex flex-col gap-6">
              {products.map((product, i) => (
                <motion.div
                  key={product.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="group flex items-center justify-between border-b border-border pb-6 transition-all hover:border-accent"
                >
                  <div>
                    <h3 className="mb-1 font-display text-2xl font-medium text-foreground">
                      {product.name}
                    </h3>
                    <p className="font-body text-xs uppercase tracking-widest text-muted-foreground">
                      {product.family} · {product.size}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="block font-display text-xl text-foreground">
                      {product.price}
                    </span>
                    <button className="mt-1 font-body text-xs font-medium uppercase tracking-widest text-accent opacity-0 transition-opacity group-hover:opacity-100">
                      İncele →
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            <a
              href="#"
              className="mt-8 inline-block rounded-sm bg-primary px-8 py-3.5 font-body text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-accent"
            >
              Tüm Parfümler
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
