import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import heroMobile from "@/assets/hero/hero-mobile.jpg";
import heroStudio from "@/assets/hero/hero-studio.jpg";
import { getCollectionPath } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { getMotionInitial } from "@/lib/motion";
import { BUNDLE_PRICE_USD, formatUsd } from "@/lib/promotions";

const HeroCopy = ({ mobile = false }: { mobile?: boolean }) => (
  <div className={mobile ? "max-w-[18rem]" : "max-w-[19rem] md:max-w-xl"}>
    <span className="inline-flex rounded-full bg-accent px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-sm">
      Daily wear
    </span>

    <p
      className={
        mobile
          ? "mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/52"
          : "mt-4 font-body text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground/50 md:text-xs md:text-white/78"
      }
    >
      David Walker Eau de Parfum
    </p>

    <h1
      className={
        mobile
          ? "mt-2 font-display text-[2.15rem] font-bold leading-[0.95] text-foreground"
          : "mt-2 font-display text-[2.15rem] font-bold leading-[0.95] text-foreground md:mt-4 md:text-6xl md:text-white lg:text-7xl"
      }
    >
      David Walker
    </h1>

    <p
      className={
        mobile
          ? "mt-3 max-w-[15rem] font-body text-[15px] leading-6 text-foreground/76"
          : "mt-3 max-w-[17rem] font-body text-[15px] leading-6 text-foreground/76 md:max-w-md md:text-lg md:text-white/82"
      }
    >
      Premium fragrances for women and men with cleaner pricing, fast shipping, and clear scent profiles.
    </p>

    <p
      className={
        mobile
          ? "mt-4 max-w-[15.75rem] font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-foreground/60"
          : "mt-5 max-w-[19rem] font-body text-[12px] font-semibold uppercase tracking-[0.16em] text-foreground/56 md:mt-5 md:text-white/70"
      }
    >
      2 for {formatUsd(BUNDLE_PRICE_USD)}. Free car scent with each perfume order.
    </p>

    {!mobile && (
      <p className="mt-4 hidden max-w-lg font-body text-sm text-white/75 md:block">
        Curated David Walker fragrances with straightforward bundle pricing, free shipping, and clear scent profiles.
      </p>
    )}

    <div className={mobile ? "mt-5 grid grid-cols-2 gap-3" : "mt-6 grid grid-cols-2 gap-3 sm:flex sm:flex-row sm:flex-wrap"}>
      <Link
        to={getCollectionPath("all-perfumes")}
        className={
          mobile
            ? "flex min-h-[3.3rem] items-center justify-center whitespace-nowrap rounded-full bg-foreground px-4 py-3 text-center font-body text-[12px] font-semibold uppercase tracking-[0.11em] text-white transition-all hover:bg-foreground/90"
            : "rounded-full bg-foreground px-4 py-3.5 text-center font-body text-[13px] font-semibold uppercase tracking-[0.14em] text-white transition-all hover:bg-foreground/90 md:px-7 md:text-sm md:bg-white md:text-foreground md:hover:bg-white/90"
        }
      >
        Shop all
      </Link>
      <Link
        to={getCollectionPath("best-sellers")}
        className={
          mobile
            ? "flex min-h-[3.3rem] items-center justify-center whitespace-nowrap rounded-full border border-foreground/22 bg-white/35 px-4 py-3 text-center font-body text-[12px] font-semibold uppercase tracking-[0.11em] text-foreground transition-all hover:border-foreground/36 hover:bg-white/50"
            : "rounded-full border border-foreground/22 bg-white/35 px-4 py-3.5 text-center font-body text-[13px] font-semibold uppercase tracking-[0.14em] text-foreground transition-all hover:border-foreground/36 hover:bg-white/50 md:px-7 md:text-sm md:border-white/26 md:bg-transparent md:text-white md:hover:border-white md:hover:bg-white/10"
        }
      >
        Best sellers
      </Link>
    </div>
  </div>
);

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden bg-[#efe4d5] md:h-screen">
      <img
        src={heroMobile}
        alt="David Walker Eau de Parfum hero bottle"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center] md:hidden"
        loading="eager"
      />
      <img
        src={heroStudio}
        alt="David Walker Perfume - Studio"
        className="absolute inset-0 hidden h-full w-full object-cover object-center md:block"
        loading="eager"
      />

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,248,239,0.42)_0%,rgba(255,247,239,0.14)_18%,rgba(247,239,231,0.08)_40%,rgba(244,235,227,0.84)_100%)] md:bg-[linear-gradient(180deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.08)_28%,rgba(7,7,7,0.42)_100%)]" />

      <div className="absolute inset-x-4 bottom-6 z-20 md:hidden">
        <motion.div
          initial={getMotionInitial({ opacity: 0, y: 30 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <HeroCopy mobile />
        </motion.div>
      </div>

      <div className="relative z-20 hidden h-full flex-col justify-end px-4 pb-7 pt-40 md:flex md:px-12 md:pb-16 md:pt-28 lg:px-20 lg:pb-20">
        <motion.div
          initial={getMotionInitial({ opacity: 0, y: 30 })}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-xl"
        >
          <HeroCopy />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
