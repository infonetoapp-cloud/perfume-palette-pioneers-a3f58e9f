import { motion } from "framer-motion";
import heroProduct from "@/assets/hero-product.jpg";
import { useI18n } from "@/lib/i18n";

const BrandStory = () => {
  const { t } = useI18n();

  return (
    <section id="about" className="bg-background py-20 lg:py-28">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="overflow-hidden rounded-2xl"
          >
            <img src={brandStoryImg} alt="Perfume atelier" className="h-full w-full object-cover" loading="lazy" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-4xl font-bold leading-tight text-foreground md:text-5xl lg:text-6xl">
              {t("brand.title1")}
              <br />
              {t("brand.title2")}
              <br />
              {t("brand.title3")}
              <br />
              <span className="text-accent">{t("brand.titleAccent")}</span>
            </h2>
            <p className="mt-6 max-w-md font-body text-base leading-relaxed text-muted-foreground">
              {t("brand.desc")}
            </p>
            <a href="#" className="mt-6 inline-block font-body text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-accent">
              {t("brand.learnMore")}
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mt-20 rounded-2xl bg-secondary p-10 md:p-16"
        >
          <div className="mx-auto max-w-2xl text-center">
            <h3 className="font-display text-3xl font-bold text-foreground md:text-4xl">
              {t("brand.standardsTitle1")}
              <br />
              <span className="text-accent">{t("brand.standardsTitle2")}</span>
            </h3>
            <p className="mt-6 font-body text-base leading-relaxed text-muted-foreground">
              {t("brand.standardsDesc")}
            </p>
            <a href="#" className="mt-6 inline-block font-body text-sm font-semibold text-foreground underline underline-offset-4 transition-colors hover:text-accent">
              {t("brand.learnMore")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BrandStory;
