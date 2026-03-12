import { useEffect, useMemo, useState, type MouseEvent, type ReactNode } from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Cherry,
  ChevronRight,
  Droplets,
  Flame,
  Flower2,
  Heart,
  HelpCircle,
  Package,
  Sparkles,
  TreePine,
  Wind,
} from "lucide-react";
import { toast } from "sonner";

import AutoScentCard from "@/components/AutoScentCard";
import { BenefitArtwork } from "@/components/BenefitArtwork";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { NoteArtwork, NoteArtworkStack } from "@/components/NoteArtwork";
import ProductCard from "@/components/ProductCard";
import Seo from "@/components/Seo";
import TrustBadge from "@/components/TrustBadge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { resolveAutoScentProduct, getAutoScentVariant, getAutoScentVariants, type AutoScentVariant } from "@/lib/autoScents";
import type { CatalogProduct } from "@/lib/catalogData";
import { getMotionInitial } from "@/lib/motion";
import { getAbsoluteUrl, SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site";
import { useCartStore } from "@/stores/cartStore";
import { useStorefrontCatalog } from "@/stores/storefrontCatalogStore";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);

function getProfileIcon(label: string): ReactNode {
  const normalized = label.toLowerCase();

  if (normalized.includes("floral") || normalized.includes("iris")) {
    return <Flower2 className="h-4 w-4 text-accent" />;
  }
  if (normalized.includes("fruity") || normalized.includes("melon")) {
    return <Cherry className="h-4 w-4 text-accent" />;
  }
  if (normalized.includes("fresh") || normalized.includes("watery") || normalized.includes("clean")) {
    return <Wind className="h-4 w-4 text-accent" />;
  }
  if (normalized.includes("woody")) {
    return <TreePine className="h-4 w-4 text-accent" />;
  }
  if (normalized.includes("amber") || normalized.includes("warm")) {
    return <Flame className="h-4 w-4 text-accent" />;
  }

  return <Sparkles className="h-4 w-4 text-accent" />;
}

const AutoScentBenefitsGrid = ({ variant }: { variant: AutoScentVariant }) => {
  const benefits = [
    {
      title: "FREE U.S.\nSHIPPING",
      detail: "Every car scent order ships free within the United States, including single-scent purchases.",
      icon: <BenefitArtwork kind="free-shipping" fallbackIcon={<Package className="h-7 w-7 text-accent" />} />,
    },
    {
      title: `${formatPrice(variant.priceUsd)}\nEACH`,
      detail: "Each scent is sold separately, so customers can buy only the one they want.",
      icon: <BenefitArtwork kind="single-car-scent" fallbackIcon={<Droplets className="h-7 w-7 text-accent" />} />,
    },
    {
      title: "PERFUME\nORDER GIFT",
      detail: "Perfume orders include 1 complimentary car scent per order. Car scent-only purchases are sold separately.",
      icon: <BenefitArtwork kind="perfume-order-gift" fallbackIcon={<Heart className="h-7 w-7 text-accent" />} />,
    },
    {
      title: "AUTO SCENT\nDESIGN",
      detail: "Compact bottle, wood cap, and hanging cord designed to look clean inside the cabin.",
      icon: <BenefitArtwork kind="auto-scent-design" fallbackIcon={<Sparkles className="h-7 w-7 text-accent" />} />,
    },
  ];

  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-2">
      {benefits.map((benefit) => (
        <article
          key={benefit.title}
          className="group relative overflow-hidden rounded-[1.4rem] border border-border bg-card/90 p-3 shadow-soft transition-transform duration-300 hover:-translate-y-0.5 sm:p-4 md:p-5"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(227,102,81,0.07),transparent_42%)]" />
          <div className="relative flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h3 className="whitespace-pre-line font-display text-[1.05rem] font-semibold uppercase leading-[0.98] tracking-[-0.03em] text-foreground sm:text-[1.2rem] md:text-[1.6rem]">
                {benefit.title}
              </h3>
              <p className="mt-3 hidden max-w-[15rem] font-body text-[13px] leading-relaxed text-muted-foreground sm:block md:text-sm">
                {benefit.detail}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-accent/20 bg-accent/5 sm:h-12 sm:w-12 md:h-14 md:w-14">
              {benefit.icon}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

const AutoScentPromoStrip = ({ variant }: { variant: AutoScentVariant }) => (
  <div className="mt-6 rounded-[1.35rem] border border-border/80 bg-secondary/20 p-3">
    <div className="flex flex-wrap gap-2">
      <span className="rounded-full bg-foreground px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-background">
        {formatPrice(variant.priceUsd)} each
      </span>
      <span className="hidden rounded-full border border-border bg-background/80 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-foreground sm:inline-flex">
        Free shipping on every order
      </span>
      <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1.5 font-body text-[10px] font-semibold uppercase tracking-[0.16em] text-accent">
        Free with perfume orders
      </span>
    </div>
    <p className="mt-2 hidden font-body text-[11px] leading-relaxed text-muted-foreground sm:block">
      Buy one for {formatPrice(variant.priceUsd)} with free shipping. Car scent-only orders stay paid, and perfume orders include 1 free car scent per order.
    </p>
    <p className="mt-2 font-body text-[11px] leading-relaxed text-muted-foreground sm:hidden">
      Car scent-only orders stay paid. Add any perfume to make 1 car scent complimentary.
    </p>
  </div>
);

const AutoScentNoteHighlights = ({ variant }: { variant: AutoScentVariant }) => {
  const noteGroups = [
    { label: "Top Notes", notes: variant.notePyramid.top.slice(0, 2), icon: <Sparkles className="h-4 w-4 text-accent" /> },
    { label: "Heart Notes", notes: variant.notePyramid.middle.slice(0, 2), icon: <Flower2 className="h-4 w-4 text-accent" /> },
    { label: "Base Notes", notes: variant.notePyramid.base.slice(0, 2), icon: <Flame className="h-4 w-4 text-accent" /> },
  ];

  return (
    <div className="mt-6 hidden gap-3 sm:grid sm:grid-cols-3">
      {noteGroups.map((group) => (
        <article key={group.label} className="rounded-2xl border border-border bg-secondary/30 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 sm:flex-1">
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">{group.label}</p>
              <p className="mt-3 font-body text-sm font-medium text-foreground">{group.notes.join(" / ")}</p>
            </div>
            <NoteArtworkStack notes={group.notes} fallbackIcon={group.icon} className="self-start" />
          </div>
        </article>
      ))}
    </div>
  );
};

const AutoScentAccordions = ({ variant }: { variant: AutoScentVariant }) => (
  <Accordion type="multiple" className="mt-6 w-full" defaultValue={["scent-notes"]}>
    <AccordionItem value="scent-notes">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Droplets className="h-4 w-4" />
          Scent Notes
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 text-sm">
          {[
            {
              tier: "Top",
              desc: "The first impression",
              notes: variant.notePyramid.top,
              icon: <Sparkles className="h-4 w-4 text-accent" />,
            },
            {
              tier: "Heart",
              desc: "The core of the scent",
              notes: variant.notePyramid.middle,
              icon: <Flower2 className="h-4 w-4 text-accent" />,
            },
            {
              tier: "Base",
              desc: "The lasting finish",
              notes: variant.notePyramid.base,
              icon: <Flame className="h-4 w-4 text-accent" />,
            },
          ].map((row) => (
            <div
              key={row.tier}
              className="flex flex-col gap-4 rounded-[1.35rem] border border-border bg-secondary/20 p-4 sm:flex-row sm:items-start"
            >
              <NoteArtworkStack notes={row.notes} fallbackIcon={row.icon} className="self-start sm:pt-1" />
              <div className="min-w-0">
                <p className="font-body font-semibold text-foreground">
                  {row.tier}: <span className="font-normal text-muted-foreground">{row.desc}</span>
                </p>
                <p className="mt-1.5 font-body leading-6 text-muted-foreground">{row.notes.join(", ")}</p>
              </div>
            </div>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="about">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          What It Smells Like
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 font-body text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{variant.tagline}</p>
          <p>{variant.description}</p>
          <p>
            <strong className="text-foreground">Mood:</strong> {variant.mood}
          </p>
          <p>
            <strong className="text-foreground">Best for:</strong> {variant.bestFor}
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="shipping">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          Shipping
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div id="shipping" className="space-y-2 font-body text-sm text-muted-foreground">
          <p>Every car scent order ships free for delivery addresses within the United States.</p>
          <p>Single car scent orders can be purchased on their own for {formatPrice(variant.priceUsd)} with no shipping threshold.</p>
          <p>Taxes, if applicable, are shown before checkout is completed.</p>
          <p>
            Questions about ordering or delivery can be sent to{" "}
            <a href={`mailto:${SITE_SUPPORT_EMAIL}`} className="font-medium text-foreground underline underline-offset-4">
              {SITE_SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
      </AccordionContent>
    </AccordionItem>

    <AccordionItem value="faq">
      <AccordionTrigger className="font-display text-sm font-semibold">
        <span className="flex items-center gap-2">
          <HelpCircle className="h-4 w-4" />
          FAQ
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="space-y-3 font-body text-sm text-muted-foreground">
          <div>
            <p className="font-semibold text-foreground">Can I buy one car scent on its own?</p>
            <p>Yes. Each car scent is sold separately for {formatPrice(variant.priceUsd)}.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Is shipping free on car scent orders?</p>
            <p>Yes. Every car scent order ships free within the United States, including single-scent purchases.</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Do car scent orders come with another free car scent?</p>
            <p>No. Car scent-only orders do not include an extra free car scent. The gift is limited to 1 per perfume order.</p>
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const AutoScentPerfumeRecommendations = ({ variant }: { variant: AutoScentVariant }) => {
  const { getProductByHandle } = useStorefrontCatalog();
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);

  const perfumes = useMemo(
    () =>
      variant.recommendedPerfumeHandles
        .map((handle) => getProductByHandle(handle))
        .filter(Boolean)
        .slice(0, 8),
    [getProductByHandle, variant.recommendedPerfumeHandles],
  );

  if (perfumes.length === 0) return null;

  const handleAddToCart = async (event: MouseEvent, product: NonNullable<(typeof perfumes)[number]>) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product.availableForSale) return;

    await addItem({
      product,
      variantId: product.variant.id,
      variantTitle: product.variant.title,
      price: product.variant.price,
      quantity: 1,
      selectedOptions: product.variant.selectedOptions,
    });

    toast.success("Added to cart", { description: product.title });
  };

  return (
    <section className="mt-16 border-t border-border pt-12">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-accent">
            Pair It With Perfume
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
            Perfume picks that fit this cabin mood.
          </h2>
          <p className="mt-3 hidden max-w-2xl font-body text-sm leading-7 text-muted-foreground md:block">
            Add a matching David Walker perfume alongside {variant.name.toLowerCase()} for a cleaner, more consistent scent story.
          </p>
        </div>
        <Link
          to="/collections/all-perfumes"
          className="font-body text-sm font-semibold uppercase tracking-[0.16em] text-foreground underline underline-offset-4 transition-colors hover:text-accent"
        >
          View All Perfumes
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 xl:gap-6 [&>*:nth-child(n+3)]:hidden md:[&>*:nth-child(n+3)]:block md:[&>*:nth-child(n+5)]:hidden xl:[&>*:nth-child(n+5)]:block">
        {perfumes.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            index={index}
            layout="compact"
            isCartLoading={isCartLoading}
            onAddToCart={(event) => {
              void handleAddToCart(event, product);
            }}
          />
        ))}
      </div>
    </section>
  );
};

const AutoScentListingPage = () => {
  const variants = getAutoScentVariants();

  const itemList = variants.map((variant, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: getAbsoluteUrl(`/auto-scents/${variant.slug}`),
    name: variant.title,
  }));

  return (
    <>
      <Seo
        title={`Car Scents | ${SITE_NAME}`}
        description="Shop premium David Walker car scents in Iris Flower, Melon, and Oud. Clean hanging car air fresheners designed for a fresher, more polished drive."
        path="/auto-scents"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Car Scents",
            description:
              "Premium hanging car scents including Iris Flower, Melon, and Oud.",
            url: getAbsoluteUrl("/auto-scents"),
          },
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Car Scents",
            itemListElement: itemList,
          },
        ]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-border bg-[linear-gradient(180deg,#f7f0e8_0%,#fbf8f4_100%)]">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 font-body text-xs text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">Car Scents</span>
            </nav>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-accent">Cabin Collection</p>
            <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-foreground md:text-6xl">
              Premium car scents for a fresher, more refined cabin.
            </h1>
            <p className="mt-5 max-w-2xl font-body text-base leading-8 text-foreground/75">
              Explore Iris Flower, Melon, and Oud. Each hanging car scent is made to keep the interior feeling clean,
              elevated, and easy to enjoy every day. Every car scent order ships free within the United States.
            </p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
              {variants.map((variant, index) => (
                <AutoScentCard key={variant.slug} variant={variant} index={index} />
              ))}
            </div>

            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <div className="rounded-[1.75rem] border border-border bg-secondary/25 p-6">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Everyday Freshness
                </p>
                <p className="mt-3 font-display text-xl font-semibold text-foreground">A clean scent profile for every kind of drive.</p>
                <p className="mt-3 font-body text-sm leading-7 text-muted-foreground">
                  From soft florals to juicy freshness and deeper woody warmth, each option is designed to feel polished inside the cabin.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-border bg-secondary/25 p-6">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Free U.S. Shipping
                </p>
                <p className="mt-3 font-display text-xl font-semibold text-foreground">Every car scent order ships free.</p>
                <p className="mt-3 font-body text-sm leading-7 text-muted-foreground">
                  Customers can buy a single car scent for {formatPrice(25)} and still get free shipping.
                </p>
              </div>
              <div className="rounded-[1.75rem] border border-border bg-secondary/25 p-6">
                <p className="font-body text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                  Perfume Order Gift
                </p>
                <p className="mt-3 font-display text-xl font-semibold text-foreground">1 free car scent is included per perfume order.</p>
                <p className="mt-3 font-body text-sm leading-7 text-muted-foreground">
                  Car scents are sold separately, and car scent-only orders do not include an extra free car scent.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

const AutoScentDetailPage = ({ slug }: { slug: string }) => {
  const variant = getAutoScentVariant(slug);
  const addItem = useCartStore((state) => state.addItem);
  const isCartLoading = useCartStore((state) => state.isLoading);
  const [resolvedAutoScentProduct, setResolvedAutoScentProduct] = useState<CatalogProduct | null>(null);
  const [isResolvingPurchase, setIsResolvingPurchase] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadLiveAutoScent = async () => {
      if (!variant) {
        setResolvedAutoScentProduct(null);
        setIsResolvingPurchase(false);
        return;
      }

      setIsResolvingPurchase(true);
      const product = await resolveAutoScentProduct(variant);
      if (!isMounted) return;
      setResolvedAutoScentProduct(product);
      setIsResolvingPurchase(false);
    };

    void loadLiveAutoScent();

    return () => {
      isMounted = false;
    };
  }, [variant]);

  if (!variant) {
    return <AutoScentListingPage />;
  }

  const handleAddAutoScentToCart = async () => {
    if (!resolvedAutoScentProduct?.availableForSale) return;

    await addItem({
      product: resolvedAutoScentProduct,
      variantId: resolvedAutoScentProduct.variant.id,
      variantTitle: resolvedAutoScentProduct.variant.title,
      price: resolvedAutoScentProduct.variant.price,
      quantity: 1,
      selectedOptions: resolvedAutoScentProduct.variant.selectedOptions,
    });

    toast.success("Added to cart", { description: resolvedAutoScentProduct.title });
  };

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: variant.title,
    description: variant.metaDescription,
    image: [
      getAbsoluteUrl(variant.images.hero),
      getAbsoluteUrl(variant.images.detail),
      getAbsoluteUrl(variant.images.lifestyle),
    ],
    brand: {
      "@type": "Brand",
      name: "David Walker",
    },
    category: "Car air freshener",
    offers: {
      "@type": "Offer",
      url: getAbsoluteUrl(`/auto-scents/${variant.slug}`),
      priceCurrency: "USD",
      price: String(variant.priceUsd),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };

  return (
    <>
      <Seo
        title={`${variant.name} Auto Scent | ${SITE_NAME}`}
        description={variant.metaDescription}
        path={`/auto-scents/${variant.slug}`}
        image={variant.images.hero}
        imageAlt={variant.title}
        jsonLd={[productJsonLd]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-28">
        <section className="container mx-auto px-4 py-6 lg:px-8 lg:py-10">
          <nav aria-label="Breadcrumb" className="mb-6 hidden items-center gap-1.5 font-body text-xs text-muted-foreground md:flex">
            <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/auto-scents" className="transition-colors hover:text-foreground">Car Scents</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground">{variant.name}</span>
          </nav>

          <div className="grid gap-10 lg:grid-cols-2">
            <motion.div initial={getMotionInitial({ opacity: 0 })} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="mb-3 hidden gap-2 md:flex">
                <span className="rounded-full border border-border bg-secondary/50 px-3 py-1 font-body text-xs text-muted-foreground">
                  Car air freshener
                </span>
                {variant.scentProfile.slice(0, 2).map((profile) => (
                  <span key={profile} className="rounded-full bg-accent/10 px-3 py-1 font-body text-xs text-accent">
                    {profile}
                  </span>
                ))}
              </div>

              <div className="aspect-[3/4] overflow-hidden rounded-2xl bg-muted">
                <img
                  src={variant.images.hero}
                  alt={`${variant.title} hero image`}
                  className="h-full w-full object-cover"
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                  <img
                    src={variant.images.detail}
                    alt={`${variant.title} detail image`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="aspect-square overflow-hidden rounded-xl bg-muted">
                  <img
                    src={variant.images.lifestyle}
                    alt={`${variant.title} lifestyle image`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="hidden lg:block">
                <AutoScentBenefitsGrid variant={variant} />
              </div>
            </motion.div>

            <motion.div
              initial={getMotionInitial({ opacity: 0, y: 20 })}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className={`font-body text-xs font-semibold uppercase tracking-[0.24em] ${variant.theme.accent}`}>
                {variant.eyebrow}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold text-foreground md:text-4xl">
                David Walker {variant.name} Auto Scent
              </h1>
              <p className="mt-1 font-body text-sm text-muted-foreground">Hanging car air freshener</p>
              <p className="mt-3 max-w-xl font-display text-lg font-semibold leading-tight text-foreground md:text-[1.35rem]">
                Car air freshener - {variant.scentProfile.join(" - ")}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {variant.scentProfile.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-border bg-secondary/30 px-3 py-1.5 font-body text-[11px] font-medium text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-4">
                <span className="font-display text-2xl font-bold text-foreground">{formatPrice(variant.priceUsd)}</span>
              </div>

              <p className="mt-3 font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-accent sm:hidden">
                Free shipping on every order
              </p>
              <p className="mt-3 hidden font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-accent sm:block">
                Free shipping on every order · 1 free car scent per perfume order
              </p>

              <div className="mt-5">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.22em] text-accent">Scent Profile</p>
                <p className="mt-2 max-w-xl font-display text-xl font-semibold leading-tight text-foreground md:text-[1.55rem]">
                  {variant.tagline}
                </p>
                <p className="mt-3 max-w-2xl font-body text-sm leading-7 text-foreground/80 md:text-[15px]">
                  {variant.description}
                </p>
              </div>

              <AutoScentNoteHighlights variant={variant} />

              <button
                onClick={handleAddAutoScentToCart}
                disabled={isResolvingPurchase || isCartLoading || !resolvedAutoScentProduct?.availableForSale}
                className="mt-6 w-full rounded-full bg-accent px-8 py-4 font-body text-sm font-semibold uppercase tracking-wider text-accent-foreground transition-all hover:bg-accent/90 disabled:opacity-50"
              >
                {isResolvingPurchase ? "Loading" : resolvedAutoScentProduct?.availableForSale ? "Add to Cart" : "Temporarily unavailable"}
              </button>

              <AutoScentPromoStrip variant={variant} />
              <div className="lg:hidden">
                <AutoScentBenefitsGrid variant={variant} />
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-accent/30 bg-accent/5 px-3 py-1 font-body text-xs text-accent">
                  Car air freshener
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-body text-xs text-muted-foreground">
                  Best for: {variant.bestFor.split(",")[0]}
                </span>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-border bg-secondary/20 p-5">
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">Mood</p>
                <p className="mt-3 font-display text-2xl font-semibold text-foreground">{variant.mood}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {variant.scentProfile.map((profile) => (
                    <span
                      key={profile}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 font-body text-xs text-foreground"
                    >
                      <NoteArtwork label={profile} fallbackIcon={getProfileIcon(profile)} size="xs" />
                      {profile}
                    </span>
                  ))}
                </div>
              </div>

              <AutoScentAccordions variant={variant} />
            </motion.div>
          </div>

          <AutoScentPerfumeRecommendations variant={variant} />
          <TrustBadge />
        </section>
      </main>
      <Footer />
    </>
  );
};

const AutoScentsPage = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <AutoScentListingPage />;
  }

  return <AutoScentDetailPage slug={slug} />;
};

export default AutoScentsPage;
