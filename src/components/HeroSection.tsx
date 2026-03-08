import { motion } from "framer-motion";
import heroCombined from "@/assets/hero-combined.jpg";
import { useI18n } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-charcoal">
      {/* Full-bleed background image */}
      <img
        src={heroCombined}
        alt="David Walker - Women's and Men's Fragrance"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

      {/* Center brand text */}
      <div className="relative z-10 flex min-h-[85vh] flex-col items-center justify-center text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <h1 className="font-display text-5xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)] md:text-7xl lg:text-8xl xl:text-9xl tracking-wide">
            DAVID WALKER
          </h1>
          <p className="mt-3 font-body text-sm font-light uppercase tracking-[0.3em] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] md:text-base lg:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a
              href="#products"
              className="rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-secondary"
            >
              {t("hero.cta1")}
            </a>
            <a
              href="#products"
              className="rounded-full border-2 border-white/50 bg-white/10 px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-white backdrop-blur-sm transition-all hover:border-white hover:bg-white/20"
            >
              {t("hero.cta2")}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
