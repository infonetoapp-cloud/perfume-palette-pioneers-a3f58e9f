import { motion } from "framer-motion";
import heroPerfume from "@/assets/hero-perfume.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroPerfume}
          alt="Lüks parfüm şişesi mermer üzerinde"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/70 via-foreground/40 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="mb-4 inline-block rounded-sm bg-accent/20 px-3 py-1 font-body text-xs font-medium uppercase tracking-[0.3em] text-primary-foreground"
            >
              Yeni Koleksiyon
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="mb-2 font-display text-5xl font-light leading-tight text-primary-foreground md:text-7xl lg:text-8xl"
            >
              Koku,
              <br />
              <span className="font-medium italic">zarafetle</span>
              <br />
              düzenlenmiş
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mb-8 max-w-md font-body text-base font-light leading-relaxed text-primary-foreground/80 md:text-lg"
            >
              Seçkin parfümlerin sessiz lüksü. Her şişede bir hikaye, her notada bir duygu.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#scent-families"
                className="gradient-gold rounded-sm px-8 py-3.5 font-body text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:opacity-90"
              >
                Koleksiyonu Keşfet
              </a>
              <a
                href="#about"
                className="rounded-sm border border-primary-foreground/30 px-8 py-3.5 font-body text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary-foreground/10"
              >
                Hikayemiz
              </a>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[10px] uppercase tracking-[0.4em] text-primary-foreground/60">
            Aşağı Kaydır
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-8 w-px bg-primary-foreground/40"
          />
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
