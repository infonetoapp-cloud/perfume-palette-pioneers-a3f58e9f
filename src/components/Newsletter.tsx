import { motion } from "framer-motion";
import { useState } from "react";

const Newsletter = () => {
  const [email, setEmail] = useState("");

  return (
    <section className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-xl text-center"
        >
          <span className="mb-3 block font-body text-xs font-medium uppercase tracking-[0.4em] text-accent">
            Bülten
          </span>
          <h2 className="mb-4 font-display text-3xl font-light text-foreground md:text-4xl">
            İlk öğrenen <span className="italic">siz olun</span>
          </h2>
          <p className="mb-8 font-body text-sm text-muted-foreground">
            Yeni koleksiyonlar, özel fırsatlar ve koku dünyasından ilham veren içerikler.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresiniz"
              className="flex-1 rounded-sm border border-border bg-transparent px-5 py-3.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none"
            />
            <button
              type="submit"
              className="rounded-sm bg-primary px-8 py-3.5 font-body text-sm font-medium uppercase tracking-widest text-primary-foreground transition-all hover:bg-accent"
            >
              Abone Ol
            </button>
          </form>

          <p className="mt-4 font-body text-[10px] text-muted-foreground">
            Gizliliğinize saygı duyuyoruz. İstediğiniz zaman aboneliğinizi iptal edebilirsiniz.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
