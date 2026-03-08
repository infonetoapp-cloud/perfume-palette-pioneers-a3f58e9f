import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import heroDossier1 from "@/assets/hero-dossier-1.jpg";

const slides = [
  {
    image: heroDossier1,
    badge: "YENİ",
    title: "Seçkin kokular:",
    subtitle: "Zarafet, saflık ve kalıcı sıcaklık.",
    cta1: { label: "YENİ KOLEKSİYON", href: "#products" },
    cta2: { label: "TÜMÜNÜ GÖR", href: "#products" },
  },
];

const HeroSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];

  return (
    <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt="Lüks parfüm koleksiyonu"
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 flex h-full items-end pb-16 md:pb-24">
        <div className="container mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <span className="mb-4 inline-block rounded-full bg-accent px-4 py-1.5 font-body text-xs font-bold uppercase tracking-wider text-accent-foreground">
              {slide.badge}
            </span>

            <h1 className="mb-2 max-w-xl font-display text-4xl font-bold leading-tight text-white md:text-5xl lg:text-6xl">
              <span className="font-bold">{slide.title}</span>{" "}
              <span className="font-light">{slide.subtitle}</span>
            </h1>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={slide.cta1.href}
                className="rounded-full bg-primary px-7 py-3 font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:bg-foreground/80"
              >
                {slide.cta1.label}
              </a>
              <a
                href={slide.cta2.href}
                className="rounded-full border-2 border-white bg-transparent px-7 py-3 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white hover:text-foreground"
              >
                {slide.cta2.label}
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Slide indicators */}
      {slides.length > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-2 rounded-full transition-all ${
                i === current ? "w-8 bg-white" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
