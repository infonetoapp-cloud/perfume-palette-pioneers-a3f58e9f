import { motion } from "framer-motion";
import bottleHero from "@/assets/bottle-hero.png";
import heroBg from "@/assets/hero-product.jpg";
import { useI18n } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-charcoal">
      {/* Subtle background image for warmth */}
      <img
        src={heroBg}
        alt=""
        className="absolute inset-0 h-full w-full object-cover opacity-30 blur-2xl scale-110"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/80 to-charcoal/40" />

      <div className="relative z-10 container mx-auto flex h-full min-h-[85vh] items-center px-6 lg:px-8">
        <div className="grid w-full items-center gap-8 md:grid-cols-2 md:gap-12">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center"
          >
            <span className="mb-5 inline-block w-fit rounded-full bg-accent px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {t("hero.badge")}
            </span>
            <h1 className="mb-4 font-display text-4xl font-bold leading-[1.1] text-white md:text-5xl lg:text-6xl xl:text-7xl">
              <span className="block">{t("hero.title")}</span>
              <span className="block font-light text-white/80">{t("hero.subtitle")}</span>
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#products"
                className="rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-charcoal transition-all hover:bg-cream"
              >
                {t("hero.cta1")}
              </a>
              <a
                href="#products"
                className="rounded-full border-2 border-white/40 bg-transparent px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white/10"
              >
                {t("hero.cta2")}
              </a>
            </div>
          </motion.div>

          {/* Right: Bottle */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex items-center justify-center"
          >
            <img
              src={bottleHero}
              alt="David Walker Eau de Parfum"
              className="h-[50vh] max-h-[600px] w-auto object-contain drop-shadow-[0_20px_60px_rgba(255,255,255,0.15)] md:h-[65vh]"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
