import { cn } from "@/lib/utils";

type ShopifyTrustMarkProps = {
  compact?: boolean;
  className?: string;
};

const ShopifyGlyph = ({ compact = false }: { compact?: boolean }) => (
  <div
    className={cn(
      "relative shrink-0 overflow-hidden rounded-[0.95rem] border border-[#e5ddd3] bg-white shadow-sm",
      compact ? "h-10 w-10 p-1.5" : "h-11 w-11 p-1.5",
    )}
    aria-hidden="true"
  >
    <img
      src="/brand-assets/shopify-icon.png"
      alt=""
      className="h-full w-full object-contain"
      loading="lazy"
    />
  </div>
);

const ShopifyTrustMark = ({ compact = false, className }: ShopifyTrustMarkProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-[1.25rem] border border-[#e5ddd3] bg-[linear-gradient(180deg,#fffdfa_0%,#f8f3ec_100%)]",
        compact ? "px-3 py-2.5" : "px-4 py-3.5",
        className,
      )}
    >
      <ShopifyGlyph compact={compact} />
      <div className="min-w-0">
        <p className="font-body text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Powered by Shopify
        </p>
        <p className={cn("mt-1 font-body font-medium text-foreground", compact ? "text-xs leading-5" : "text-sm leading-6")}>
          Secure Shopify checkout. Sales tax is calculated at checkout where applicable.
        </p>
      </div>
    </div>
  );
};

export default ShopifyTrustMark;
