import { motion } from "framer-motion";
import heroWoman from "@/assets/hero-woman.jpg";
import heroMan from "@/assets/hero-man.jpg";
import { useI18n } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-charcoal">
      <div className="relative z-10 container mx-auto flex h-full min-h-[85vh] items-center px-0 lg:px-0">
        <div className="grid w-full grid-cols-2 items-stretch min-h-[85vh]">
          {/* Left: Woman */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative overflow-hidden group cursor-pointer"
          >
            <img
              src={heroWoman}
              alt="David Walker Women's Fragrance"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  Collection
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-4xl lg:text-5xl">
                  {t("category.women")}
                </h2>
                <a
                  href="#products"
                  className="mt-3 inline-block font-body text-xs font-semibold uppercase tracking-widest text-white underline underline-offset-4 transition-colors hover:text-accent"
                >
                  {t("category.shopNow")}
                </a>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Man */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="relative overflow-hidden group cursor-pointer"
          >
            <img
              src={heroMan}
              alt="David Walker Men's Fragrance"
              className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <span className="font-body text-xs font-bold uppercase tracking-[0.2em] text-white/80">
                  Collection
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold text-white md:text-4xl lg:text-5xl">
                  {t("category.men")}
                </h2>
                <a
                  href="#products"
                  className="mt-3 inline-block font-body text-xs font-semibold uppercase tracking-widest text-white underline underline-offset-4 transition-colors hover:text-accent"
                >
                  {t("category.shopNow")}
                </a>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Center overlay brand text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        >
          <h1 className="font-display text-4xl font-bold text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)] md:text-6xl lg:text-7xl xl:text-8xl tracking-wide">
            DAVID WALKER
          </h1>
          <p className="mt-2 font-body text-sm font-light uppercase tracking-[0.3em] text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] md:text-base">
            {t("hero.subtitle")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
