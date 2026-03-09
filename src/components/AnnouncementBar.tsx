import { useI18n } from "@/lib/i18n";

const AnnouncementBar = () => {
  const { t } = useI18n();

  const separator = "|";
  const messages = [
    t("announcement.freeShipping"),
    separator,
    t("announcement.discount"),
    separator,
    t("announcement.newCollection"),
    separator,
    t("announcement.freeShipping"),
    separator,
    t("announcement.discount"),
    separator,
    t("announcement.newCollection"),
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
