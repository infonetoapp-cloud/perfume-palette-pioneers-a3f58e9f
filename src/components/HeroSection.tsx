import { motion } from "framer-motion";
import bottleHero from "@/assets/bottle-hero.png";
import heroMan from "@/assets/hero-man.png";
import heroWoman from "@/assets/hero-woman.png";
import { useI18n } from "@/lib/i18n";

const HeroSection = () => {
  const { t } = useI18n();

  return (
    <section className="relative min-h-[85vh] overflow-hidden">
      {/* Split background */}
      <div className="absolute inset-0 flex">
        {/* Woman side - warm coral/rose */}
        <div className="w-1/2 bg-gradient-to-br from-[hsl(8,60%,75%)] via-[hsl(15,50%,65%)] to-[hsl(20,40%,55%)]" />
        {/* Man side - dark charcoal */}
        <div className="w-1/2 bg-gradient-to-bl from-[hsl(0,0%,12%)] via-[hsl(0,0%,8%)] to-[hsl(0,0%,5%)]" />
      </div>

      {/* Center blend overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent" />

      <div className="relative z-10 container mx-auto flex h-full min-h-[85vh] items-center px-4 lg:px-8">
        <div className="grid w-full grid-cols-3 items-end gap-0">
          {/* Left: Woman */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-end"
          >
            <img
              src={heroWoman}
              alt="Woman model"
              className="h-[55vh] max-h-[550px] w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.3)] md:h-[70vh]"
              loading="eager"
            />
          </motion.div>

          {/* Center: Bottle + Text */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
            className="flex flex-col items-center justify-end text-center"
          >
            <span className="mb-3 inline-block rounded-full bg-white/20 px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm">
              {t("hero.badge")}
            </span>
            <h1 className="mb-2 font-display text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl xl:text-6xl">
              <span className="block">{t("hero.title")}</span>
              <span className="block font-light text-white/80">{t("hero.subtitle")}</span>
            </h1>
            <img
              src={bottleHero}
              alt="David Walker Eau de Parfum"
              className="my-4 h-[35vh] max-h-[400px] w-auto object-contain drop-shadow-[0_20px_60px_rgba(255,255,255,0.2)] md:h-[45vh]"
              loading="eager"
            />
            <div className="mb-8 flex flex-wrap justify-center gap-3">
              <a
                href="#products"
                className="rounded-full bg-white px-7 py-3 font-body text-sm font-semibold uppercase tracking-wider text-foreground transition-all hover:bg-secondary"
              >
                {t("hero.cta1")}
              </a>
              <a
                href="#products"
                className="rounded-full border-2 border-white/40 bg-transparent px-7 py-3 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:border-white hover:bg-white/10"
              >
                {t("hero.cta2")}
              </a>
            </div>
          </motion.div>

          {/* Right: Man */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col items-center justify-end"
          >
            <img
              src={heroMan}
              alt="Man model"
              className="h-[55vh] max-h-[550px] w-auto object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.3)] md:h-[70vh]"
              loading="eager"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
