import { motion } from "framer-motion";
import scentCitrus from "@/assets/scent-citrus.jpg";
import scentAmber from "@/assets/scent-amber.jpg";
import scentWoods from "@/assets/scent-woods.jpg";
import scentRose from "@/assets/scent-rose.jpg";

const families = [
  {
    title: "Narenciye & Neroli",
    subtitle: "Gün Işığı",
    description: "Taze, enerjik ve aydınlık. Sabah ritüelinizin parçası.",
    image: scentCitrus,
    alt: "Narenciye meyveleri ve neroli çiçekleri",
  },
  {
    title: "Amber & Reçine",
    subtitle: "Altın Saat",
    description: "Sıcak, sarmalayıcı ve gizemli. Akşamın büyüsü.",
    image: scentAmber,
    alt: "Amber reçine parçaları ve baharatlar",
  },
  {
    title: "Odunsu & Dumanlı",
    subtitle: "Gece Yarısı",
    description: "Derin, sofistike ve kalıcı. Karanlığın cazibesi.",
    image: scentWoods,
    alt: "Sandal ağacı ve sedir kabuğu",
  },
  {
    title: "Gül & Kadife Misk",
    subtitle: "Romantizm",
    description: "Zarif, feminen ve büyüleyici. Aşkın kokusu.",
    image: scentRose,
    alt: "Kırmızı güller ve kadife kumaş",
  },
];

const ScentFamilies = () => {
  return (
    <section id="scent-families" className="bg-background py-24 lg:py-32">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-16 text-center"
        >
          <span className="mb-3 block font-body text-xs font-medium uppercase tracking-[0.4em] text-accent">
            Koku Aileleri
          </span>
          <h2 className="mb-4 font-display text-4xl font-light text-foreground md:text-5xl lg:text-6xl">
            Ruh halinize göre seçin
          </h2>
          <p className="mx-auto max-w-lg font-body text-base text-muted-foreground">
            Önce atmosferi belirleyin. Şişe sonra gelsin.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {families.map((family, i) => (
            <motion.div
              key={family.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group cursor-pointer overflow-hidden rounded-sm"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={family.image}
                  alt={family.alt}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent transition-all duration-500 group-hover:from-foreground/90" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <span className="mb-1 block font-body text-[10px] font-medium uppercase tracking-[0.3em] text-gold-light">
                    {family.subtitle}
                  </span>
                  <h3 className="mb-2 font-display text-2xl font-medium text-primary-foreground">
                    {family.title}
                  </h3>
                  <p className="font-body text-sm text-primary-foreground/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    {family.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScentFamilies;
