import { motion } from "framer-motion";

const BrandStory = () => {
  return (
    <section id="about" className="bg-primary py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-4 block font-body text-xs font-medium uppercase tracking-[0.4em] text-gold-light"
          >
            Hikayemiz
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mb-8 font-display text-4xl font-light leading-tight text-primary-foreground md:text-5xl lg:text-6xl"
          >
            Daha az gürültü,
            <br />
            <span className="italic">daha çok anlam</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mb-6 font-body text-base leading-relaxed text-primary-foreground/70 md:text-lg"
          >
            Real Scents, parfümün sessiz tarafında duruyor. Her şişe, 
            dünyanın en seçkin parfüm evlerinden özenle küratörlenmiş. 
            Amacımız basit: doğru kokuyu doğru insanla buluşturmak.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.6 }}
            className="font-body text-base leading-relaxed text-primary-foreground/70 md:text-lg"
          >
            Koleksiyonumuzda yalnızca gerçekten özel olan var. 
            Çünkü inanıyoruz ki koku, kimliğin en kişisel ifadesidir.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex justify-center gap-12"
          >
            {[
              { value: "150+", label: "Seçkin Koku" },
              { value: "50K+", label: "Mutlu Müşteri" },
              { value: "4.9", label: "Ortalama Puan" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block font-display text-3xl font-semibold text-gold-light md:text-4xl">
                  {stat.value}
                </span>
                <span className="mt-1 block font-body text-[10px] uppercase tracking-[0.3em] text-primary-foreground/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
