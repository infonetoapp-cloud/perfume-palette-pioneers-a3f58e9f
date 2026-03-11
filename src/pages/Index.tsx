import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import ScentFamilySection from "@/components/ScentFamilySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import AutoScentsSection from "@/components/AutoScentsSection";
import BrandStory from "@/components/BrandStory";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getAbsoluteUrl, SITE_BRAND, SITE_DESCRIPTION, SITE_NAME, SITE_SUPPORT_EMAIL } from "@/lib/site";

const Index = () => {
  return (
    <>
      <Seo
        title={`${SITE_NAME} | David Walker Perfumes for Women & Men`}
        description={SITE_DESCRIPTION}
        path="/"
        jsonLd={[
          {
            "@context": "https://schema.org",
            "@type": "Organization",
            name: SITE_NAME,
            brand: SITE_BRAND,
            url: getAbsoluteUrl("/"),
            email: SITE_SUPPORT_EMAIL,
            description: SITE_DESCRIPTION,
            areaServed: {
              "@type": "Country",
              name: "United States",
            },
            contactPoint: {
              "@type": "ContactPoint",
              contactType: "customer support",
              email: SITE_SUPPORT_EMAIL,
              areaServed: "US",
              availableLanguage: ["en"],
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "OnlineStore",
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            url: getAbsoluteUrl("/"),
            email: SITE_SUPPORT_EMAIL,
            areaServed: {
              "@type": "Country",
              name: "United States",
            },
            hasOfferCatalog: {
              "@type": "OfferCatalog",
              name: "David Walker Collection at Real Scents",
            },
          },
          {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: getAbsoluteUrl("/"),
            inLanguage: "en-US",
          },
        ]}
      />
      <Navbar />
      <main>
        <HeroSection />
        <CategoryCards />
        <ScentFamilySection />
        <FeaturedProducts />
        <AutoScentsSection />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Index;
