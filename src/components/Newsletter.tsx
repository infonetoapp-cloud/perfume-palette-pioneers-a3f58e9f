import { motion } from "framer-motion";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";

const Newsletter = () => {
  const { t } = useI18n();
  const [email, setEmail] = useState("");

  return (
    <section className="bg-primary py-20 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
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
          <form onSubmit={(e) => e.preventDefault()} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("newsletter.placeholder")}
              className="flex-1 rounded-full border border-primary-foreground/20 bg-transparent px-5 py-3 font-body text-sm text-primary-foreground placeholder:text-primary-foreground/40 focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-full bg-accent px-8 py-3 font-body text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-coral-light"
            >
              {t("newsletter.subscribe")}
            </button>
          </form>
          <p className="mt-4 font-body text-[11px] text-primary-foreground/40">
            {t("newsletter.privacy")}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
