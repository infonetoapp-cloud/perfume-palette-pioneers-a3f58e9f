import { useI18n } from "@/lib/i18n";

const AnnouncementBar = () => {
  const { t } = useI18n();

  const messages = [
    t("announcement.freeShipping"),
    "✦",
    t("announcement.discount"),
    "✦",
    t("announcement.newCollection"),
    "✦",
    t("announcement.freeShipping"),
    "✦",
    t("announcement.discount"),
    "✦",
    t("announcement.newCollection"),
    "✦",
  ];

  return (
    <div className="bg-primary text-primary-foreground overflow-hidden whitespace-nowrap py-2.5">
      <div className="animate-marquee inline-flex gap-8">
        {[...messages, ...messages].map((msg, i) => (
          <span key={i} className="font-body text-xs font-medium tracking-wider uppercase">
            {msg}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementBar;
