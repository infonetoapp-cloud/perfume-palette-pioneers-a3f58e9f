import { BUNDLE_PRICE_USD, GIFT_LABEL, PROMO_CODE, formatUsd } from "@/lib/promotions";

const AnnouncementBar = () => {
  const separator = "|";
  const messages = [
    `Buy any 2 perfumes for ${formatUsd(BUNDLE_PRICE_USD)}`,
    separator,
    `Use ${PROMO_CODE} for 10% off single-bottle orders`,
    separator,
    `${GIFT_LABEL} with every order`,
    separator,
    "Free U.S. shipping",
    separator,
    separator,
  ];

  return (
    <div className="overflow-hidden whitespace-nowrap bg-primary py-2.5 text-primary-foreground">
      <div className="inline-flex animate-marquee gap-8">
        {[...messages, ...messages].map((message, index) => (
          <span key={index} className="font-body text-xs font-medium uppercase tracking-wider">
            {message}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
