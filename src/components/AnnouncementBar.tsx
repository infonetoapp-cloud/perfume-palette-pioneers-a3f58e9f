import { ADDITIONAL_PERFUME_PRICE_LABEL, BUNDLE_PRICE_USD, GIFT_ORDER_LABEL, PROMO_CODE, formatUsd } from "@/lib/promotions";

const AnnouncementBar = () => {
  return (
    <div className="bg-primary py-2.5 text-primary-foreground">
      <div className="container mx-auto flex items-center justify-center gap-3 px-4 text-center">
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">
          2 perfumes for {formatUsd(BUNDLE_PRICE_USD)}
        </span>
        <span className="text-primary-foreground/35">/</span>
        <span className="hidden font-body text-[11px] font-semibold uppercase tracking-[0.16em] sm:inline">
          +{ADDITIONAL_PERFUME_PRICE_LABEL} each extra perfume
        </span>
        <span className="hidden text-primary-foreground/35 sm:inline">/</span>
        <span className="hidden font-body text-[11px] font-semibold uppercase tracking-[0.16em] sm:inline">
          {PROMO_CODE} on single bottles
        </span>
        <span className="text-primary-foreground/35">/</span>
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">
          {GIFT_ORDER_LABEL}
        </span>
        <span className="hidden text-primary-foreground/35 sm:inline">/</span>
        <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">
          Free shipping on every U.S. order
        </span>
      </div>
    </div>
  );
};

export default AnnouncementBar;
