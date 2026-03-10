import { motion } from "framer-motion";

import trustBadge from "@/assets/brand/trust-badge.png";
import { getMotionInitial } from "@/lib/motion";

type TrustBadgeProps = {
  variant?: "overlay" | "inline";
};

const TrustBadge = ({ variant = "inline" }: TrustBadgeProps) => {
  const sectionClassName =
    variant === "overlay"
      ? "relative z-20 -mt-7 px-4 pb-4 md:-mt-8 md:px-8 md:pb-6"
      : "px-0 py-8 md:py-10";

  const badgeClassName =
    variant === "overlay"
      ? "mx-auto flex w-fit max-w-full items-center justify-center rounded-full border border-border/70 bg-background/92 px-4 py-3 shadow-soft backdrop-blur-xl md:px-5"
      : "mx-auto flex w-fit max-w-full items-center justify-center rounded-full border border-border/70 bg-secondary/45 px-4 py-3 shadow-soft md:px-5";

  return (
    <section className={sectionClassName}>
      <motion.div
        initial={getMotionInitial({ opacity: 0, y: 14 })}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.45 }}
        className={badgeClassName}
      >
        <img
          src={trustBadge}
          alt="Trusted by customers"
          className="h-7 w-auto max-w-[15rem] md:h-8 md:max-w-[20rem]"
          loading="lazy"
        />
      </motion.div>
    </section>
  );
};

export default TrustBadge;
