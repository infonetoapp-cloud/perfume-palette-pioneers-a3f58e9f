import { useI18n } from "@/lib/i18n";
import { Link } from "react-router-dom";
import { getCollectionPath } from "@/lib/catalog";
import { SITE_DOMAIN, SITE_SUPPORT_EMAIL } from "@/lib/site";
import ShopifyTrustMark from "@/components/ShopifyTrustMark";

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
              <li><Link to={getCollectionPath("all-perfumes")} className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.shopAll")}</Link></li>
              <li><Link to={getCollectionPath("women")} className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.shopWomen")}</Link></li>
              <li><Link to={getCollectionPath("men")} className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.shopMen")}</Link></li>
              <li><Link to={getCollectionPath("best-sellers")} className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.shopNew")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">{t("footer.info")}</h4>
            <ul className="flex flex-col gap-2.5">
              <li><Link to="/about" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.aboutUs")}</Link></li>
              <li><Link to="/shipping" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.shipping")}</Link></li>
              <li><Link to="/privacy" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.privacy")}</Link></li>
              <li><Link to="/terms" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.terms")}</Link></li>
              <li><Link to="/faq" className="font-body text-sm text-muted-foreground transition-colors hover:text-foreground">{t("footer.faq")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-body text-xs font-semibold uppercase tracking-widest text-foreground">Support</h4>
            <div className="space-y-2.5 font-body text-sm leading-relaxed text-muted-foreground">
              <p>Questions about orders, shipping, checkout totals, or damaged deliveries can be sent to support.</p>
              <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="block transition-colors hover:text-foreground">
                {SITE_SUPPORT_EMAIL}
              </a>
              <a href={`https://${SITE_DOMAIN}`} className="block transition-colors hover:text-foreground">
                {SITE_DOMAIN}
              </a>
              <p>Fragrance purchases are final sale.</p>
              <p>Applicable sales tax is shown at checkout before payment.</p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border pt-6 text-center">
          <div className="mx-auto mb-6 max-w-2xl">
            <ShopifyTrustMark />
          </div>
          <p className="font-body text-xs text-muted-foreground">{t("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
