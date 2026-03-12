import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Citrus, Flame, Flower2, Leaf, Sparkles, TreePine, Wind } from "lucide-react";
import { getCollectionDefinition, getCollectionPath, SCENT_FAMILY_SLUGS, type ScentFamily } from "@/lib/catalog";
import { getMotionInitial } from "@/lib/motion";
import { useStorefrontCatalog } from "@/stores/storefrontCatalogStore";
import { NoteArtwork } from "@/components/NoteArtwork";

const FAMILY_IMAGE_MODULES = import.meta.glob("../assets/scent-families/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const familyImageMap = Object.fromEntries(
  Object.entries(FAMILY_IMAGE_MODULES).map(([path, url]) => {
    const filename = path.replace(/\\/g, "/").split("/").pop() ?? "";
    const slug = filename.replace(/\.(png|jpe?g|webp)$/i, "").toLowerCase();
    return [slug, url];
  }),
) as Record<string, string>;

const familyIconMap: Record<ScentFamily, ReactNode> = {
  fresh: <Wind className="h-5 w-5 text-accent" />,
  woody: <TreePine className="h-5 w-5 text-accent" />,
  vanilla: <Sparkles className="h-5 w-5 text-accent" />,
  floral: <Flower2 className="h-5 w-5 text-accent" />,
  citrus: <Citrus className="h-5 w-5 text-accent" />,
  amber: <Flame className="h-5 w-5 text-accent" />,
  aromatic: <Leaf className="h-5 w-5 text-accent" />,
};

const ScentFamilySection = () => {
  const { getProductsForCollection } = useStorefrontCatalog();
  const families = SCENT_FAMILY_SLUGS.map((slug) => {
    const definition = getCollectionDefinition(slug);
    const count = getProductsForCollection(slug).length;
    const fallbackIcon = familyIconMap[slug];
    const image = familyImageMap[slug];

    return { slug, definition, count, fallbackIcon, image };
  }).filter((family) => family.count > 0);

  if (families.length === 0) return null;

  return (
    <section className="bg-background py-16 lg:py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mb-8 max-w-3xl sm:mb-10">
          <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-accent">Shop by Scent Family</p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl font-bold text-foreground md:text-4xl">
            Find the profile that actually matches how you want to smell
          </h2>
          <p className="mt-4 hidden font-body text-base leading-relaxed text-muted-foreground md:block">
            Explore the catalog through real scent families such as fresh, woody, vanilla, floral, citrus, amber,
            and aromatic, each grounded in the actual note structure of the stocked lineup.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-4">
          {families.map(({ slug, definition, count, fallbackIcon, image }, index) => (
            <motion.div
              key={slug}
              initial={getMotionInitial({ opacity: 0, y: 24 })}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: index * 0.05 }}
            >
              <Link
                to={getCollectionPath(slug)}
                className="group block overflow-hidden rounded-[28px] border border-border bg-card shadow-soft transition-transform hover:-translate-y-1"
              >
                <div className="relative aspect-[3/4] overflow-hidden sm:aspect-[4/5]">
                  {image ? (
                    <img
                      src={image}
                      alt={`${definition.title} background`}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full bg-secondary/40" />
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary/60 sm:h-11 sm:w-11">
                      <NoteArtwork label={definition.label} fallbackIcon={fallbackIcon} size="sm" />
                    </div>
                    <span className="rounded-full border border-border bg-secondary/50 px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground sm:px-3 sm:py-1.5 sm:text-[11px]">
                      {count} scents
                    </span>
                  </div>

                  <h3 className="mt-3 font-display text-xl font-semibold text-foreground sm:mt-4 sm:text-3xl">{definition.label}</h3>
                  <p className="mt-2 hidden font-body text-sm leading-relaxed text-muted-foreground line-clamp-2 sm:block">
                    {definition.story}
                  </p>

                  <span className="mt-3 inline-flex items-center gap-2 font-body text-xs font-semibold text-foreground sm:mt-4 sm:text-sm">
                    <span className="sm:hidden">Explore</span>
                    <span className="hidden sm:inline">Explore {definition.label}</span>
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScentFamilySection;
