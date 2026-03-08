import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ScentFamilies from "@/components/ScentFamilies";
import FeaturedProducts from "@/components/FeaturedProducts";
import BrandStory from "@/components/BrandStory";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ScentFamilies />
        <FeaturedProducts />
        <BrandStory />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
};

export default Index;
