import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getAbsoluteUrl, SITE_DOMAIN, SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site";

type InfoSlug = "about" | "shipping" | "privacy" | "faq" | "terms" | "refund-policy";

interface InfoSection {
  heading: string;
  body: string;
  items?: string[];
}

interface InfoPageContent {
  title: string;
  eyebrow: string;
  description: string;
  lastUpdated: string;
  sections: InfoSection[];
}

const pageContent: Record<InfoSlug, InfoPageContent> = {
  about: {
    title: "About Real Scents",
    eyebrow: "Brand Overview",
    description:
      "Learn how Real Scents organizes David Walker fragrances for U.S. shoppers with clear scent notes, secure checkout, and free shipping.",
    lastUpdated: "March 12, 2026",
    sections: [
      {
        heading: "What Real Scents offers",
        body: "Real Scents is a U.S.-focused online storefront for David Walker Eau de Parfum and car scents. The storefront is built to make fragrance shopping straightforward, with clear pricing, organized collections, and scent-note guidance that helps customers compare styles before checkout.",
      },
      {
        heading: "How the catalog is organized",
        body: "The catalog is structured around all perfumes, men's fragrances, women's fragrances, best sellers, and major scent families so customers can browse by mood, notes, and occasion instead of relying only on product codes.",
        items: [
          "Every product page includes note guidance, scent-family context, and wearing direction.",
          "Car scents are kept in a separate collection so perfume browsing stays clean and focused.",
          "Multi-bottle pricing is surfaced clearly before checkout so customers understand the offer before they pay.",
        ],
      },
      {
        heading: "Checkout and order confidence",
        body: "Orders are processed through secure Shopify checkout. Product prices are shown before checkout, free U.S. shipping is built into the storefront policy, and any applicable sales tax is displayed during checkout before payment is completed.",
      },
      {
        heading: "Support and contact",
        body: `Customer support is available at ${SITE_SUPPORT_EMAIL}. Real Scents operates online at ${SITE_DOMAIN} and keeps the key customer policies, including shipping, privacy, FAQs, and terms, available directly on the storefront for quick review before and after purchase.`,
      },
    ],
  },
  shipping: {
    title: "Shipping Policy",
    eyebrow: "Order Policies",
    description:
      "Review free U.S. shipping, processing times, final sale fragrance terms, tax at checkout, and support guidance for Real Scents orders.",
    lastUpdated: "March 12, 2026",
    sections: [
      {
        heading: "Free U.S. shipping",
        body: "Standard shipping is free on every order delivered within the United States. If faster or premium delivery options are offered later, they will be shown during checkout before payment is completed.",
      },
        {
          heading: "Processing and delivery timing",
          body: "Orders ship from El Paso, Texas. Most in-stock orders are expected to process within 1 business day, and standard delivery within the contiguous United States is generally expected in 2 to 5 business days after dispatch. Delivery timing can still vary based on destination, carrier conditions, weather, and seasonal order volume.",
          items: [
            "Orders are processed on business days only.",
            "Shipments to Alaska, Hawaii, U.S. territories, military addresses, or remote destinations may take longer than the standard 2 to 5 business day window.",
            "A shipping confirmation and tracking update should be sent once the order leaves the warehouse.",
            "If there is a material delay after checkout, customers should be contacted using the order details provided at purchase.",
          ],
        },
      {
        heading: "Address accuracy and review checks",
        body: "Customers are responsible for entering a complete and accurate delivery address. Orders may be delayed, adjusted, or canceled if payment review, fraud screening, or address verification problems arise before shipment.",
      },
      {
        heading: "Final sale policy",
        body: "All fragrance purchases are final sale personal care products. Returns and exchanges are not accepted after checkout for change-of-mind purchases, scent preference, gift orders, duplicate orders, opened items, or standard ordering mistakes.",
        items: [
          "Customers should review product details carefully before completing checkout.",
          `If an order arrives damaged, incorrect, or incomplete, the issue should be reported promptly to ${SITE_SUPPORT_EMAIL}.`,
          "Support may request the order number, shipping name, and clear photos so the issue can be documented and reviewed.",
        ],
      },
      {
        heading: "Taxes and order totals",
        body: "Displayed product prices do not include applicable sales tax. Any required sales tax is calculated separately at checkout and shown before payment is completed, so customers can review the full order total before finalizing payment.",
      },
      {
        heading: "Customer support",
        body: `Questions about shipping, delivery status, damaged packages, or order issues can be sent to ${SITE_SUPPORT_EMAIL}. Support is available before and after purchase even though fragrance sales are final.`,
      },
    ],
  },
  "refund-policy": {
    title: "Refund Policy",
    eyebrow: "Final Sale Terms",
    description:
      "Review the final sale policy for Real Scents fragrance and car scent orders, including the no-return and no-exchange policy for personal care products.",
    lastUpdated: "March 13, 2026",
    sections: [
      {
        heading: "Final sale on fragrance and car scent products",
        body:
          "All perfumes and car scents sold by Real Scents are final sale personal care products. For hygiene, product integrity, and resale-safety reasons, opened, used, tested, or change-of-mind orders are not eligible for return, refund, or exchange.",
      },
      {
        heading: "No returns for customer preference or order changes",
        body:
          "Returns are not accepted for scent preference, gift decisions, duplicate purchases, incorrect product selection by the customer, shipping timing dissatisfaction, or any other non-defect reason once checkout has been completed.",
        items: [
          "No returns for personal preference or expected scent profile differences.",
          "No returns for opened or unsealed fragrance or car scent products.",
          "No returns for accidental duplicate orders after checkout unless support confirms cancellation before shipment.",
        ],
      },
      {
        heading: "No exchanges",
        body:
          "Real Scents does not offer exchanges. Because the catalog consists of personal care fragrance products, orders cannot be swapped for another scent, another code, another variation, or store credit after purchase.",
      },
      {
        heading: "Delivery issues and support review",
        body: `If an order arrives damaged, incorrect, or incomplete, customers should contact ${SITE_SUPPORT_EMAIL} promptly so support can review and document the shipment issue. This support review does not create a general return or exchange program for personal care products.`,
        items: [
          "Include the order number and full shipping name.",
          "Provide clear photos of the shipping box, label, and product issue.",
          "Report the issue as soon as possible after delivery.",
        ],
      },
      {
        heading: "Chargebacks and policy consistency",
        body:
          "This policy applies to all checkout methods offered on the storefront. Submitting an order means the customer agrees that fragrance and car scent products are sold on a final sale basis and are not eligible for routine returns or exchanges.",
      },
      {
        heading: "Contact",
        body: `Questions about this policy can be sent to ${SITE_SUPPORT_EMAIL}. Customers should contact support before initiating payment disputes whenever an order issue can be reviewed directly by the store.`,
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Customer Privacy",
    description:
      "Read how Real Scents collects, uses, stores, and protects customer information for orders, support, analytics, and fraud prevention.",
    lastUpdated: "March 12, 2026",
    sections: [
      {
        heading: "Information collected",
        body: "This storefront may collect information customers provide directly, including name, shipping address, billing address, email address, phone number, and order details. Basic technical information such as IP address, browser type, device data, and on-site activity may also be collected automatically through standard analytics, security, and site operation tools.",
      },
      {
        heading: "How information is used",
        body: "Customer information may be used to operate the storefront, fulfill orders, communicate about purchases, prevent fraud, provide customer support, improve website performance, comply with legal obligations, and maintain business records.",
        items: [
          "To process and deliver orders",
          "To send transactional updates such as confirmations and shipping notices",
          "To respond to questions, order issues, or support requests",
          "To monitor performance, security, and fraud prevention",
        ],
      },
      {
        heading: "Sharing of information",
        body: "Information may be shared only as needed with service providers that support checkout, payments, shipping, hosting, analytics, fraud prevention, and related operational services. Information may also be disclosed when required by law, legal process, or to protect the rights, safety, or property of the business and its customers.",
      },
      {
        heading: "Cookies and analytics",
        body: "The site may use cookies, local storage, and similar technologies to remember preferences, support shopping functions, measure traffic, and improve the customer experience. Customers can often control cookies through their browser settings, although some parts of the site may not work properly if certain technologies are disabled.",
      },
      {
        heading: "Your choices and rights",
        body: `Depending on applicable U.S. state privacy law, customers may have the right to request access to personal information, request correction or deletion, and ask questions about how personal information is used. Privacy requests can be sent to ${SITE_SUPPORT_EMAIL}.`,
      },
      {
        heading: "Children's privacy",
        body: "This storefront is not directed to children under 13 and is not intended to knowingly collect personal information from children. If the store becomes aware that personal information from a child has been collected in error, reasonable steps should be taken to delete it.",
      },
      {
        heading: "Data retention and security",
        body: "Information may be retained for as long as reasonably necessary to complete orders, maintain business records, comply with law, resolve disputes, and protect the storefront. No system can be guaranteed fully secure, but reasonable administrative, technical, and organizational safeguards should be used to protect customer information.",
      },
      {
        heading: "Policy updates",
        body: "This policy may be updated from time to time to reflect operational, legal, or technical changes. The latest version published on the storefront should control going forward.",
      },
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    eyebrow: "Customer Help",
    description:
      "Common questions about fragrance shopping, multi-bottle pricing, free U.S. shipping, tax at checkout, and customer support at Real Scents.",
    lastUpdated: "March 12, 2026",
    sections: [
      {
        heading: "How do I choose the right fragrance?",
        body: "Use the notes, intensity meter, and wearing guidance shown on each product page. Collection pages also separate women's fragrances, men's fragrances, and best sellers to make comparison easier.",
      },
      {
        heading: "Is shipping free in the United States?",
        body: "Yes. Standard shipping is free on every U.S. order under the current storefront policy.",
      },
        {
          heading: "How long will my order take?",
          body: "Orders ship from El Paso, Texas. Most in-stock orders are expected to process within 1 business day, and standard delivery within the contiguous United States is generally expected in 2 to 5 business days after dispatch. Remote destinations may take longer.",
        },
      {
        heading: "How does multi-bottle pricing work?",
        body: "The first perfume is priced at $79.90. A cart with 2 perfumes totals $119.90, and every additional perfume after that adds $40, so the pricing stays clear as the order grows.",
      },
      {
        heading: "Are taxes included in listed prices?",
        body: "No. Listed product prices do not include applicable sales tax. Any required sales tax is calculated at checkout and shown before payment is completed.",
      },
      {
        heading: "Can I use SCENT10 with multi-bottle pricing?",
        body: "No. SCENT10 cannot be combined with the automatic multi-bottle pricing. Customers can use the single-bottle code discount or the automatic multi-bottle pricing, but not both on the same order.",
      },
      {
        heading: "Do I get a free car fragrance with every perfume order?",
        body: "Yes. Each order that includes at least one perfume qualifies for one free car scent. The gift is limited to one per order, appears separately from paid items, and car scent-only orders do not include an extra free car scent.",
      },
      {
        heading: "Is checkout secure?",
        body: "Yes. Orders are completed through secure Shopify checkout, and the final order total is shown before payment is submitted.",
      },
      {
        heading: "Can I return a fragrance order?",
        body: "No. Fragrance purchases are final sale personal care products. Returns are not accepted after checkout.",
      },
      {
        heading: "Can I exchange for a different scent?",
        body: "No. Real Scents does not offer scent swaps or post-purchase exchanges.",
      },
      {
        heading: "What if my order arrives damaged or incorrect?",
        body: `Email ${SITE_SUPPORT_EMAIL} promptly with the order number and clear photos so support can document and review the shipment issue.`,
      },
      {
        heading: "How do I contact support?",
        body: `For order questions, shipping issues, privacy requests, or general help, email ${SITE_SUPPORT_EMAIL}.`,
      },
      {
        heading: "How should I apply fragrance?",
        body: "For most Eau de Parfum styles, two to four sprays on pulse points is enough. Allow the fragrance to dry naturally on skin instead of rubbing it in.",
      },
      {
        heading: "Where do you sell online?",
        body: `The Real Scents storefront operates at ${SITE_DOMAIN} and is structured for customers shopping within the United States.`,
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Store Terms",
    description:
      "Review the terms that apply to browsing Real Scents, placing orders, using site content, and interacting with the storefront online.",
    lastUpdated: "March 12, 2026",
    sections: [
      {
        heading: "Use of the storefront",
        body: "By using this storefront, customers agree to use it only for lawful purposes and in a way that does not interfere with the site, its security, or other users. The store may restrict access, cancel orders, or suspend activity that appears unlawful, abusive, fraudulent, or harmful.",
      },
      {
        heading: "Product and pricing information",
        body: "Product descriptions, pricing, availability, and imagery are presented in good faith but may be updated or corrected at any time. The store reserves the right to correct pricing, inventory, content, or listing errors before or after an order is submitted.",
      },
      {
        heading: "Order acceptance",
        body: "Submitting an order request does not guarantee acceptance. The store may decline, limit, or cancel orders in cases involving suspected fraud, payment problems, inventory issues, shipping restrictions, suspected resale abuse, or incorrect listing information.",
      },
      {
        heading: "Final sale merchandise",
        body: `Fragrance purchases are sold on a final sale basis. Returns and exchanges are not accepted for change-of-mind purchases, opened items, scent preference, or post-purchase swaps. If a shipment arrives damaged, incorrect, or incomplete, customers should contact ${SITE_SUPPORT_EMAIL} promptly so support can document the issue.`,
      },
      {
        heading: "Promotional offers",
        body: "Multi-bottle pricing, the one-free-car-scent-per-perfume-order offer, and discount codes may be changed, corrected, or suspended at any time. Gift items are not part of the paid item price and cannot be redeemed for cash. Unless explicitly stated otherwise, discount codes cannot be combined with automatic multi-bottle offers.",
      },
      {
        heading: "Intellectual property",
        body: "Storefront content, including branding, design, copy, product photography, graphics, and page structure, belongs to the store or its licensors and may not be copied, redistributed, or used without permission except as allowed by applicable law.",
      },
      {
        heading: "Disclaimers and liability",
        body: "The storefront is provided on an as-available basis. To the maximum extent permitted by applicable law, the store disclaims implied warranties that are not expressly stated and is not liable for indirect, incidental, special, or consequential damages arising from site use, delays, or inability to access the storefront.",
      },
      {
        heading: "Policy changes",
        body: "These terms may be revised at any time by posting an updated version on the storefront. Continued use of the site after updates are published means the updated terms apply going forward.",
      },
      {
        heading: "Contact",
        body: `Questions about these terms or the operation of the storefront can be sent to ${SITE_SUPPORT_EMAIL}.`,
      },
    ],
  },
};

function resolveInfoSlug(pathname: string): InfoSlug {
  const slug = pathname.replace("/", "") || "about";
  if (slug in pageContent) {
    return slug as InfoSlug;
  }

  return "about";
}

function toSchemaDate(value: string): string | undefined {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parsed.toISOString().split("T")[0];
}

const InfoPage = () => {
  const location = useLocation();
  const slug = resolveInfoSlug(location.pathname);
  const content = pageContent[slug];
  const schemaDate = toSchemaDate(content.lastUpdated);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: content.title, item: getAbsoluteUrl(`/${slug}`) },
    ],
  };
  const organizationJsonLd =
    slug === "about"
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: SITE_NAME,
          url: getAbsoluteUrl("/"),
          email: SITE_SUPPORT_EMAIL,
          contactPoint: [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: SITE_SUPPORT_EMAIL,
              areaServed: "US",
              availableLanguage: ["en"],
            },
          ],
        }
      : null;
  const pageJsonLd =
    slug === "faq"
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: content.sections.map((section) => ({
            "@type": "Question",
            name: section.heading,
            acceptedAnswer: {
              "@type": "Answer",
              text: section.body,
            },
          })),
        }
      : {
          "@context": "https://schema.org",
          "@type": slug === "about" ? "AboutPage" : "WebPage",
          name: content.title,
          description: content.description,
          url: getAbsoluteUrl(`/${slug}`),
          ...(schemaDate ? { dateModified: schemaDate } : {}),
        };

  return (
    <>
      <Seo
        title={`${content.title} | ${SITE_NAME}`}
        description={content.description}
        path={`/${slug}`}
        jsonLd={organizationJsonLd ? [breadcrumbJsonLd, pageJsonLd, organizationJsonLd] : [breadcrumbJsonLd, pageJsonLd]}
      />
      <Navbar />
      <main className="min-h-screen bg-background pt-28">
        <section className="border-b border-border bg-secondary/30">
          <div className="container mx-auto px-4 py-12 lg:px-8 lg:py-16">
            <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 font-body text-xs text-muted-foreground">
              <Link to="/" className="transition-colors hover:text-foreground">Home</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="font-semibold text-foreground">{content.title}</span>
            </nav>
            <p className="font-body text-xs font-semibold uppercase tracking-[0.24em] text-accent">{content.eyebrow}</p>
            <h1 className="mt-3 font-display text-4xl font-bold text-foreground md:text-5xl">{content.title}</h1>
            <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-foreground">{content.description}</p>
            <p className="mt-3 font-body text-sm text-muted-foreground">Last updated: {content.lastUpdated}</p>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="container mx-auto max-w-3xl px-4 lg:px-8">
            <div className="space-y-10">
              {content.sections.map((section) => (
                <article key={section.heading} className="rounded-3xl border border-border bg-card p-7 shadow-soft">
                  <h2 className="font-display text-2xl font-semibold text-foreground">{section.heading}</h2>
                  <p className="mt-3 font-body text-base leading-relaxed text-muted-foreground">{section.body}</p>
                  {section.items && (
                    <ul className="mt-4 space-y-2 font-body text-sm leading-relaxed text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-accent" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default InfoPage;
