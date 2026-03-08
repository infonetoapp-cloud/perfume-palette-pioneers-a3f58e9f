import { useI18n } from "@/lib/i18n";

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border bg-background py-14">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="font-display text-lg font-bold text-foreground">Real Scents</h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-muted-foreground">{t("footer.tagline")}</p>
          </div>
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">{t("footer.shop")}</h4>
            <ul className="flex flex-col gap-2.5">
              {[t("footer.shopAll"), t("footer.shopWomen"), t("footer.shopMen"), t("footer.shopNew")].map((item) => (
                <li key={item}><a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">{t("footer.info")}</h4>
            <ul className="flex flex-col gap-2.5">
              {[t("footer.aboutUs"), t("footer.shipping"), t("footer.privacy"), t("footer.faq")].map((item) => (
                <li key={item}><a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{item}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">{t("footer.social")}</h4>
            <ul className="flex flex-col gap-2.5">
              {["Instagram", "Twitter", "Pinterest", "TikTok"].map((s) => (
                <li key={s}><a href="#" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{s}</a></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center">
          <p className="font-body text-xs text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
