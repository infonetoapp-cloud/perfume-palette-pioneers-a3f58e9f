import { motion, AnimatePresence } from "framer-motion";
import { useState, useCallback } from "react";
import heroStudio from "@/assets/hero/hero-studio.jpg";
import { useI18n } from "@/lib/i18n";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  angle: number;
  speed: number;
  opacity: number;
}

const SprayEffect = ({ side, isActive }: { side: "left" | "right"; isActive: boolean }) => {
  const particles: Particle[] = Array.from({ length: 24 }, (_, i) => {
    const direction = side === "left" ? 1 : -1;
    const baseAngle = direction * (Math.random() * 35 - 17.5);
    return {
      id: i,
      x: direction * (40 + Math.random() * 120),
      y: -30 + Math.random() * 60,
      size: 2 + Math.random() * 4,
      angle: baseAngle,
      speed: 0.5 + Math.random() * 0.5,
      opacity: 0.3 + Math.random() * 0.5,
    };
  });

  return (
    <AnimatePresence>
      {isActive && (
        <>
          {/* Mist cloud */}
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 0.4, scale: 1.2 }}
            exit={{ opacity: 0, scale: 1.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute top-[28%] pointer-events-none"
            style={{
              [side === "left" ? "left" : "right"]: "8%",
              width: "120px",
              height: "60px",
              background: "radial-gradient(ellipse, rgba(255,255,255,0.3) 0%, transparent 70%)",
              filter: "blur(8px)",
              transform: `translateX(${side === "left" ? "60px" : "-60px"})`,
            }}
          />
          {/* Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{
                opacity: 0,
                x: 0,
                y: 0,
                scale: 0.2,
              }}
              animate={{
                opacity: [0, p.opacity, p.opacity * 0.5, 0],
                x: p.x,
                y: p.y,
                scale: [0.2, 1, 0.6],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.6 + p.speed * 0.4,
                ease: "easeOut",
                delay: Math.random() * 0.15,
              }}
              className="absolute rounded-full pointer-events-none"
              style={{
                top: "30%",
                [side === "left" ? "left" : "right"]: "12%",
                width: p.size,
                height: p.size,
                background: `radial-gradient(circle, rgba(255,220,180,${p.opacity}) 0%, rgba(255,255,255,${p.opacity * 0.5}) 100%)`,
                filter: "blur(0.5px)",
              }}
            />
          ))}
        </>
      )}
    </AnimatePresence>
  );
};

const HeroSection = () => {
  const { t } = useI18n();
  const [sprayLeft, setSprayLeft] = useState(false);
  const [sprayRight, setSprayRight] = useState(false);

  const handleSpray = useCallback((side: "left" | "right") => {
    const setter = side === "left" ? setSprayLeft : setSprayRight;
    setter(true);
    setTimeout(() => setter(false), 900);
  }, []);

  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#c8b8a8]">
      {/* Studio background with bottle */}
      <img
        src={heroStudio}
        alt="David Walker Perfume - Studio"
        className="absolute inset-0 h-full w-full object-cover object-center"
        loading="eager"
      />

      {/* Subtle gradient for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-transparent" />

      {/* Spray clickable area & effect */}
      <div className="absolute inset-0 z-10">
        <button
          onClick={() => { handleSpray("left"); handleSpray("right"); }}
          className="absolute right-[5%] top-[10%] w-[30%] h-[80%] cursor-pointer bg-transparent border-none outline-none hover:bg-white/5 rounded-xl transition-colors duration-200"
          aria-label="Spray bottle"
        />
        <SprayEffect side="left" isActive={sprayLeft} />
        <SprayEffect side="right" isActive={sprayRight} />
      </div>

      {/* Brand text - left aligned */}
      <div className="relative z-20 flex min-h-[85vh] flex-col items-start justify-center text-left px-8 md:px-16 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-start max-w-[50%] md:max-w-[45%]"
        >
          <h1 className="font-display text-4xl font-bold text-charcoal md:text-6xl lg:text-7xl xl:text-8xl tracking-wide">
            DAVID WALKER
          </h1>
          <p className="mt-3 font-body text-sm font-light uppercase tracking-[0.3em] text-charcoal/70 md:text-base lg:text-lg">
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#products"
              className="rounded-full bg-charcoal px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-charcoal/80"
            >
              {t("hero.cta1")}
            </a>
            <a
              href="#products"
              className="rounded-full border-2 border-charcoal/30 bg-transparent px-8 py-3.5 font-body text-sm font-semibold uppercase tracking-wider text-charcoal transition-all hover:border-charcoal hover:bg-charcoal/5"
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
