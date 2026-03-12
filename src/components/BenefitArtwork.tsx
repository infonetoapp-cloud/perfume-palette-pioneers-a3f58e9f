import { useEffect, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

export type BenefitArtworkKey =
  | "free-shipping"
  | "eau-de-parfum-50ml"
  | "perfume-order-gift"
  | "bundle-offer"
  | "single-car-scent"
  | "auto-scent-design";

type BenefitArtworkProps = {
  kind: BenefitArtworkKey;
  fallbackIcon: ReactNode;
  className?: string;
};

export function BenefitArtwork({ kind, fallbackIcon, className }: BenefitArtworkProps) {
  const [hasError, setHasError] = useState(false);
  const src = `/commerce-benefit-icons/${kind}.png`;

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <div className={cn("relative h-7 w-7", className)}>
      {!hasError ? (
        <img
          src={src}
          alt=""
          loading="lazy"
          onError={() => setHasError(true)}
          className="h-full w-full object-contain"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">{fallbackIcon}</div>
      )}
    </div>
  );
}
