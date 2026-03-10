import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import { getCollectionPath } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { getMotionInitial } from "@/lib/motion";
import { SITE_SUPPORT_EMAIL } from "@/lib/site";

const Newsletter = () => {
  const { t } = useI18n();

  return (
    <section className="bg-primary py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={getMotionInitial({ opacity: 0, y: 30 })}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-lg text-center"
        >
          <h2 className="font-display text-3xl font-bold text-primary-foreground md:text-4xl">
            {t("newsletter.title")}
          </h2>
          <p className="mt-3 font-body text-sm text-primary-foreground/70">
            {t("newsletter.desc")}
          </p>
          <div className="mt-8 rounded-[2rem] border border-primary-foreground/15 bg-primary-foreground/5 p-6 text-left shadow-soft">
            <p className="font-body text-xs font-semibold uppercase tracking-[0.22em] text-accent">
              {t("newsletter.status")}
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-primary-foreground/75">
              {t("newsletter.comingSoon")}
            </p>
            <p className="mt-3 font-body text-sm leading-relaxed text-primary-foreground/75">
              Questions before launch? Email{" "}
              <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-primary-foreground underline underline-offset-4">
                {SITE_SUPPORT_EMAIL}
              </a>
              .
            </p>
            <div className="mt-5">
              <Link
                to={getCollectionPath("all-perfumes")}
                className="inline-flex rounded-full bg-accent px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-coral-light"
              >
                {t("newsletter.browse")}
              </Link>
            </div>
          </div>
          <p className="mt-4 font-body text-[11px] text-primary-foreground/40">
            {t("newsletter.privacy")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
