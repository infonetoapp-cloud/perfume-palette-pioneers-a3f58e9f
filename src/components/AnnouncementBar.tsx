import { ADDITIONAL_PERFUME_PRICE_LABEL, BUNDLE_PRICE_USD, GIFT_ORDER_LABEL, PROMO_CODE, formatUsd } from "@/lib/promotions";

const AnnouncementBar = () => {
  const mobileItems = [`2 for ${formatUsd(BUNDLE_PRICE_USD)}`, `+${ADDITIONAL_PERFUME_PRICE_LABEL} next bottle`, "1 free car scent", "Free U.S. shipping"];

  return (
    <div className="bg-primary py-2 text-primary-foreground">
      <div className="md:container md:mx-auto md:px-4">
        <div className="overflow-hidden md:hidden">
          <div className="animate-marquee flex min-w-max items-center gap-0 whitespace-nowrap">
            {[...mobileItems, ...mobileItems].map((item, index) => (
              <div key={`${item}-${index}`} className="flex items-center">
                <span className="px-4 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground/92">
                  {item}
                </span>
                <span className="text-primary-foreground/25">/</span>
              </div>
            ))}
          </div>
        </div>
        <div className="hidden items-center justify-center gap-3 text-center md:flex">
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">
            2 perfumes for {formatUsd(BUNDLE_PRICE_USD)}
          </span>
          <span className="text-primary-foreground/35">/</span>
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">
            +{ADDITIONAL_PERFUME_PRICE_LABEL} each extra perfume
          </span>
          <span className="text-primary-foreground/35">/</span>
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">{PROMO_CODE} on single bottles</span>
          <span className="text-primary-foreground/35">/</span>
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">{GIFT_ORDER_LABEL}</span>
          <span className="text-primary-foreground/35">/</span>
          <span className="font-body text-[11px] font-semibold uppercase tracking-[0.16em]">Free shipping on every U.S. order</span>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
