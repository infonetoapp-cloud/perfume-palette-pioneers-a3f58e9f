import { Link } from "react-router-dom";

import AutoScentCard from "@/components/AutoScentCard";
import { getAutoScentVariants } from "@/lib/autoScents";

const AutoScentRecommendations = () => {
  const variants = getAutoScentVariants();

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Car Scents
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Pick 1 car scent for your perfume order.
          </h2>
          <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-muted-foreground">
            Perfume orders include 1 free car scent per order, and each option is also available to purchase on its own for $25.
          </p>
        </div>
        <Link
          to="/auto-scents"
          className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-foreground underline underline-offset-4 transition-colors hover:text-accent"
        >
          View Car Scents Collection
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
        {variants.map((variant, index) => (
          <AutoScentCard key={variant.slug} variant={variant} index={index} layout="compact" />
        ))}
      </div>
    </section>
  );
};

export default AutoScentRecommendations;
