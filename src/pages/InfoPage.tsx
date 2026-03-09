import { Link, useLocation } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import AnnouncementBar from "@/components/AnnouncementBar";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Seo from "@/components/Seo";
import { getAbsoluteUrl, SITE_NAME } from "@/lib/site";

type InfoSlug = "about" | "shipping" | "privacy" | "faq" | "terms";

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
    title: "About David Walker Fragrances",
    eyebrow: "Brand Overview",
    description:
      "Learn how this U.S.-focused David Walker storefront is organized around scent notes, easy discovery, and clear fragrance shopping information.",
    lastUpdated: "March 9, 2026",
    sections: [
      {
        heading: "Authorized retail focus",
        body: "This storefront is designed to present David Walker fragrances clearly to shoppers in the United States, with direct product pages, organized collections, and consistent scent information.",
      },
      {
        heading: "Built for product discovery",
        body: "Each fragrance page is structured around mood, main notes, and wearing occasions so customers can shop by scent profile instead of relying on code-only naming.",
      },
      {
        heading: "Launch-ready catalog structure",
        body: "Collections are separated into all perfumes, women's fragrances, men's fragrances, and best sellers so the catalog remains easy to browse and ready to scale.",
      },
    ],
  },
  shipping: {
    title: "Shipping & Returns",
    eyebrow: "Order Policies",
    description:
      "Review free U.S. shipping, processing, delivery, return timing, and refund expectations for David Walker fragrance orders.",
    lastUpdated: "March 9, 2026",
    sections: [
      {
        heading: "Free U.S. shipping",
        body: "Standard shipping is free for delivery addresses within the United States. If faster shipping options are offered later, they will be shown before payment is completed.",
      },
      {
        heading: "Processing and delivery timing",
        body: "Most in-stock orders should be processed within 1 to 3 business days. Delivery times may vary by destination, carrier capacity, weather conditions, and holiday volume.",
        items: [
          "Orders are processed on business days only.",
          "A shipping confirmation and tracking update should be sent once the order leaves the warehouse.",
          "Delivery estimates are not guarantees and may change if a carrier experiences delays.",
        ],
      },
      {
        heading: "Address and order review",
        body: "Customers are responsible for entering a complete and accurate shipping address. Orders may be delayed, adjusted, or canceled if payment review, fraud checks, or address verification issues arise.",
      },
      {
        heading: "Returns and exchanges",
        body: "Return requests should be made within 30 days of delivery. Returned items should be unused, in saleable condition, and sent back with original packaging where possible. If an item arrives damaged or incorrect, contact the store promptly so the issue can be reviewed.",
        items: [
          "Refunds are typically issued back to the original payment method after the return is received and inspected.",
          "Items showing significant use, abuse, or missing original components may be refused.",
          "Where offered, exchanges are subject to product availability.",
        ],
      },
      {
        heading: "Taxes and order totals",
        body: "Applicable sales tax may be calculated based on the shipping destination and the requirements of the relevant U.S. jurisdiction. Final taxes and charges should always be reviewed before checkout is completed.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    eyebrow: "Customer Privacy",
    description:
      "Read how this storefront may collect, use, store, and protect customer information for orders, support, analytics, and lawful business operations.",
    lastUpdated: "March 9, 2026",
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
          "To respond to questions, returns, or support requests",
          "To monitor performance, security, and fraud prevention",
        ],
      },
      {
        heading: "Sharing of information",
        body: "Information may be shared only as needed with service providers that support payments, shipping, hosting, analytics, fraud prevention, and other operational services. Information may also be disclosed when required by law, legal process, or to protect the rights, safety, or property of the business and its customers.",
      },
      {
        heading: "Cookies and analytics",
        body: "The site may use cookies, local storage, and similar technologies to remember preferences, support shopping functions, measure traffic, and improve the customer experience. Customers can often control cookies through their browser settings, although some parts of the site may not work properly if certain technologies are disabled.",
      },
      {
        heading: "Your choices and rights",
        body: "Depending on applicable U.S. state privacy law, customers may have the right to request access to personal information, request correction or deletion, and ask questions about how personal information is used. To make a privacy request, customers should use the support contact information published by the store.",
      },
      {
        heading: "Children's privacy",
        body: "This storefront is not directed to children under 13 and is not intended to knowingly collect personal information from children. If the store becomes aware that personal information from a child has been collected in error, reasonable steps should be taken to delete it.",
      },
      {
        heading: "Data retention and security",
        body: "Information may be retained for as long as reasonably necessary to complete orders, maintain records, comply with law, resolve disputes, and protect the storefront. No system can be guaranteed fully secure, but reasonable administrative, technical, and organizational safeguards should be used to protect customer information.",
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
      "Common questions about fragrance shopping, free U.S. shipping, returns, order handling, and product use on the David Walker storefront.",
    lastUpdated: "March 9, 2026",
    sections: [
      {
        heading: "How do I choose the right fragrance?",
        body: "Use the notes, intensity meter, and wearing guidance shown on each product page. Collection pages also separate women's fragrances, men's fragrances, and best sellers to make comparison easier.",
      },
      {
        heading: "Is shipping free in the United States?",
        body: "Yes. Standard shipping is free for U.S. delivery addresses based on the current storefront policy.",
      },
      {
        heading: "How long will my order take?",
        body: "Most in-stock orders are expected to process within 1 to 3 business days. Delivery timing depends on the destination, carrier, and seasonal volume.",
      },
      {
        heading: "Can I return a fragrance?",
        body: "Return requests should be made within 30 days of delivery. Returned items should be unused and sent back in saleable condition. Damaged or incorrect deliveries should be reported promptly for review.",
      },
      {
        heading: "How should I apply fragrance?",
        body: "For most Eau de Parfum styles, two to four sprays on pulse points is enough. Allow the fragrance to dry naturally on skin instead of rubbing it in.",
      },
      {
        heading: "Are the product details final?",
        body: "Product pages are already structured for launch, but details such as final payment flow, support contact information, and any optional rush delivery settings may still be refined before the store goes fully live.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    eyebrow: "Store Terms",
    description:
      "Review the general terms that apply to browsing this storefront, placing orders, using content, and interacting with David Walker Fragrances online.",
    lastUpdated: "March 9, 2026",
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

const InfoPage = () => {
  const location = useLocation();
  const slug = resolveInfoSlug(location.pathname);
  const content = pageContent[slug];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: getAbsoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: content.title, item: getAbsoluteUrl(`/${slug}`) },
    ],
  };

  return (
    <>
      <Seo
        title={`${content.title} | ${SITE_NAME}`}
        description={content.description}
        path={`/${slug}`}
        jsonLd={breadcrumbJsonLd}
      />
      <AnnouncementBar />
      <Navbar />
      <main className="min-h-screen bg-background">
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
