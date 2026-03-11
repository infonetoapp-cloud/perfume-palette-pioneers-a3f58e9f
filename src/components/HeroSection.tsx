import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import heroMobile from "@/assets/hero/hero-mobile.jpg";
import heroStudio from "@/assets/hero/hero-studio.jpg";
import { getCollectionPath } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { getMotionInitial } from "@/lib/motion";
import { BUNDLE_PRICE_USD, GIFT_ORDER_LABEL, PROMO_CODE, formatUsd } from "@/lib/promotions";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <img
        src={heroMobile}
        alt="David Walker Perfume - Mobile Studio"
        className="absolute inset-0 h-full w-full object-cover object-[56%_center] md:hidden"
        loading="eager"
      />
      <img
        src={heroStudio}
        alt="David Walker Perfume - Studio"
        className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        loading="eager"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div className="relative z-20 flex h-full flex-col justify-end px-6 pb-16 md:px-12 lg:px-20 lg:pb-20">
        <motion.div
          initial={getMotionInitial({ opacity: 0, y: 30 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl"
        >
          <span className="inline-block rounded bg-accent px-3 py-1 font-body text-xs font-bold uppercase tracking-wider text-accent-foreground">
            {t("hero.subtitle")}
          </span>

          <h1 className="mt-4 font-display text-4xl font-bold leading-[1.05] text-white md:text-6xl lg:text-7xl">
            DAVID WALKER
          </h1>

          <p className="mt-3 max-w-md font-body text-base text-white/80 md:text-lg">
            Premium fragrances crafted for women and men.
          </p>
          <div className="mt-4 inline-flex flex-wrap gap-2">
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              2 for {formatUsd(BUNDLE_PRICE_USD)}
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              {PROMO_CODE} for 10% off
            </span>
            <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
              {GIFT_ORDER_LABEL}
            </span>
          </div>
          <p className="mt-3 max-w-lg font-body text-sm text-white/75">
            {`Buy any two fragrances for ${formatUsd(BUNDLE_PRICE_USD)} or use code ${PROMO_CODE} for 10% off a single-bottle order. Offers cannot be combined.`}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to={getCollectionPath("all-perfumes")}
              className="rounded-full bg-white px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-white/90"
            >
              {t("hero.cta1")}
            </Link>
            <Link
              to={getCollectionPath("best-sellers")}
              className="rounded-full border-2 border-white/40 bg-transparent px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white/10"
            >
              {t("hero.cta2")}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
