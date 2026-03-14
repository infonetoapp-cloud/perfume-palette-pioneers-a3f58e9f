import { motion } from "framer-motion";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

import { getCollectionPath } from "@/lib/catalog";
import { useI18n } from "@/lib/i18n";
import { getMotionInitial } from "@/lib/motion";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { SITE_SUPPORT_EMAIL } from "@/lib/site";

const Newsletter = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim()) {
      toast.error(t("newsletter.invalid"));
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await subscribeToNewsletter({
        email,
        company,
      });

      setIsSuccess(true);
      setEmail("");
      toast.success(response.message || t("newsletter.success"));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("newsletter.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

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
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <label className="sr-only" htmlFor="newsletter-email">
                {t("newsletter.placeholder")}
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("newsletter.placeholder")}
                className="w-full rounded-full border border-primary-foreground/15 bg-background/95 px-5 py-3 font-body text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-accent"
                disabled={isSubmitting}
                required
              />
              <div className="sr-only" aria-hidden="true">
                <label htmlFor="newsletter-company">Company</label>
                <input
                  id="newsletter-company"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={company}
                  onChange={(event) => setCompany(event.target.value)}
                />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-accent px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-coral-light disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? t("newsletter.submitting") : t("newsletter.subscribe")}
                </button>
                <Link
                  to={getCollectionPath("all-perfumes")}
                  className="inline-flex rounded-full border border-primary-foreground/18 px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-primary-foreground transition-all hover:border-primary-foreground/35 hover:bg-primary-foreground/6"
                >
                  {t("newsletter.browse")}
                </Link>
              </div>
              {isSuccess ? (
                <p className="font-body text-sm text-primary-foreground/80">
                  {t("newsletter.success")}
                </p>
              ) : null}
            </form>
            <p className="mt-3 font-body text-sm leading-relaxed text-primary-foreground/75">
              Questions about scents, gifts, or orders? Email{" "}
              <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-semibold text-primary-foreground underline underline-offset-4">
                {SITE_SUPPORT_EMAIL}
              </a>
              .
            </p>
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
