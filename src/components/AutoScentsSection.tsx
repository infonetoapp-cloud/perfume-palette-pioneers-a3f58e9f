import { Link } from "react-router-dom";

import AutoScentCard from "@/components/AutoScentCard";
import { getAutoScentVariants } from "@/lib/autoScents";

const AutoScentsSection = () => {
  const variants = getAutoScentVariants();

  return (
    <section className="overflow-hidden bg-[linear-gradient(180deg,#f8f4ef_0%,#fffdf9_45%,#f7f1e9_100%)] py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-accent">
              Car Scents
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-bold leading-tight text-foreground md:text-5xl">
              Premium car scents for a cleaner, more polished drive.
            </h2>
            <p className="mt-5 max-w-2xl font-body text-base leading-8 text-foreground/75">
              Choose from Iris Flower, Melon, and Oud. Each hanging car scent is designed to keep the cabin fresh while
              adding a refined, minimal look to the interior.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 md:justify-end">
            <span className="rounded-full bg-foreground px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-background">
              $25 each
            </span>
            <span className="rounded-full border border-border bg-white/80 px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
              Free shipping on every order
            </span>
            <span className="rounded-full border border-border bg-white/80 px-4 py-2 font-body text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
              3 scent options
            </span>
            <Link
              to="/auto-scents"
              className="font-body text-sm font-medium text-foreground underline underline-offset-4 transition-colors hover:text-accent"
            >
              View Car Scents Collection
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {variants.map((variant, index) => (
            <AutoScentCard key={variant.slug} variant={variant} index={index} layout="compact" />
          ))}
        </div>
      </div>
    </section>
  );
};

export default AutoScentsSection;
