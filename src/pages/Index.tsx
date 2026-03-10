import AnnouncementBar from "@/components/AnnouncementBar";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CategoryCards from "@/components/CategoryCards";
import ScentFamilySection from "@/components/ScentFamilySection";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";
import Seo from "@/components/Seo";
import { getAbsoluteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";

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
            "@type": "Store",
            name: SITE_NAME,
            description: SITE_DESCRIPTION,
            url: getAbsoluteUrl("/"),
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
          },
        ]}
      />
      <Navbar />
      <main>
        <HeroSection />
        <CategoryCards />
        <ScentFamilySection />
        <FeaturedProducts />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Index;
