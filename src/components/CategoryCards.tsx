import { motion } from "framer-motion";
import categoryWomen from "@/assets/category-women.jpg";
import categoryMen from "@/assets/category-men.jpg";
import { useI18n } from "@/lib/i18n";

const CategoryCards = () => {
  const { t } = useI18n();

  const categories = [
    { label: t("category.women"), image: categoryWomen, href: "#products" },
    { label: t("category.men"), image: heroProduct, href: "#products" },
  ];

  return (
    <section className="bg-background py-12 lg:py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {categories.map((cat, i) => (
            <motion.a
              key={cat.label}
              href={cat.href}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-2xl"
            >
              <img src={cat.image} alt={cat.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white">{cat.label}</h3>
                <span className="mt-2 inline-block font-body text-xs font-semibold uppercase tracking-widest text-white/90 underline underline-offset-4 transition-all group-hover:text-accent">
                  {t("category.shopNow")}
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
