import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type Locale = "en" | "es";

const translations = {
  en: {
    // Announcement
    "announcement.freeShipping": "Free shipping across the United States",
    "announcement.discount": "10% off on 2+ items",
    "announcement.newCollection": "New collection just dropped",

    // Nav
    "nav.perfumes": "Perfumes",
    "nav.about": "About",
    "nav.search": "Search",
    "nav.searchPlaceholder": "Search perfumes...",
    "nav.account": "Account",

    // Hero
    "hero.badge": "NEW",
    "hero.title": "Curated scents:",
    "hero.subtitle": "Elegance, purity, and lasting warmth.",
    "hero.cta1": "SHOP NEW DROP",
    "hero.cta2": "SHOP ALL",

    // Categories
    "category.women": "Women",
    "category.men": "Men",
    "category.unisex": "Unisex",
    "category.shopNow": "Shop Now",

    // Products
    "products.title": "Featured perfumes",
    "products.subtitle": "Our carefully curated collection",
    "products.viewAll": "View All",
    "products.addToCart": "ADD TO CART",
    "products.soldOut": "SOLD OUT",
    "products.noProducts": "No products yet",
    "products.noProductsDesc": "Tell me in the chat what products you'd like to add to your store.",
    "products.noImage": "No image",

    // Brand Story
    "brand.title1": "THE PERFUME",
    "brand.title2": "HOUSE",
    "brand.title3": "FOR THE NEXT",
    "brand.titleAccent": "GENERATION",
    "brand.desc": "Premium-quality fragrances. No excessive markups. Crafted with heart, not ego.",
    "brand.learnMore": "Learn More",
    "brand.standardsTitle1": "HIGH STANDARDS",
    "brand.standardsTitle2": "& NON-TOXIC",
    "brand.standardsDesc": "That's the Real Scents promise. All our fragrances are sourced from the world's finest perfume houses. Cruelty-free and safe for your skin — so you can feel even better about your scent. Indulge in luxury, guilt-free.",

    // Newsletter
    "newsletter.title": "Be the first to know",
    "newsletter.desc": "New collections, exclusive offers, and scent inspiration.",
    "newsletter.placeholder": "Your email address",
    "newsletter.subscribe": "Subscribe",
    "newsletter.privacy": "We respect your privacy. Unsubscribe anytime.",

    // Footer
    "footer.tagline": "Your destination for curated perfumes. A story in every bottle.",
    "footer.shop": "Shop",
    "footer.shopAll": "All Perfumes",
    "footer.shopWomen": "Women",
    "footer.shopMen": "Men",
    "footer.shopNew": "New Arrivals",
    "footer.info": "Info",
    "footer.aboutUs": "About Us",
    "footer.shipping": "Shipping & Returns",
    "footer.privacy": "Privacy Policy",
    "footer.faq": "FAQ",
    "footer.social": "Social",
    "footer.copyright": "© 2026 Real Scents. All rights reserved.",

    // Cart
    "cart.title": "Cart",
    "cart.empty": "Your cart is empty",
    "cart.items": "items",
    "cart.item": "item",
    "cart.total": "Total",
    "cart.checkout": "CHECKOUT",
    "cart.added": "Added to cart",

    // Product Detail
    "product.back": "Back",
    "product.notFound": "Product not found",
    "product.goHome": "Go to homepage",

    // Language
    "lang.en": "English",
    "lang.es": "Español",
  },
  es: {
    // Announcement
    "announcement.freeShipping": "Envío gratuito en todo Estados Unidos",
    "announcement.discount": "10% de descuento en 2+ artículos",
    "announcement.newCollection": "Nueva colección disponible",

    // Nav
    "nav.perfumes": "Perfumes",
    "nav.about": "Nosotros",
    "nav.search": "Buscar",
    "nav.searchPlaceholder": "Buscar perfumes...",
    "nav.account": "Cuenta",

    // Hero
    "hero.badge": "NUEVO",
    "hero.title": "Aromas selectos:",
    "hero.subtitle": "Elegancia, pureza y calidez duradera.",
    "hero.cta1": "VER LO NUEVO",
    "hero.cta2": "VER TODO",

    // Categories
    "category.women": "Mujer",
    "category.men": "Hombre",
    "category.unisex": "Unisex",
    "category.shopNow": "Comprar Ahora",

    // Products
    "products.title": "Perfumes destacados",
    "products.subtitle": "Nuestra colección cuidadosamente curada",
    "products.viewAll": "Ver Todos",
    "products.addToCart": "AÑADIR AL CARRITO",
    "products.soldOut": "AGOTADO",
    "products.noProducts": "Aún no hay productos",
    "products.noProductsDesc": "Dime en el chat qué productos te gustaría agregar a tu tienda.",
    "products.noImage": "Sin imagen",

    // Brand Story
    "brand.title1": "LA CASA DE",
    "brand.title2": "PERFUMES",
    "brand.title3": "PARA LA NUEVA",
    "brand.titleAccent": "GENERACIÓN",
    "brand.desc": "Fragancias de calidad premium. Sin sobreprecios. Hechas con corazón, no con ego.",
    "brand.learnMore": "Saber Más",
    "brand.standardsTitle1": "ALTOS ESTÁNDARES",
    "brand.standardsTitle2": "& NO TÓXICO",
    "brand.standardsDesc": "Esa es la promesa de Real Scents. Todas nuestras fragancias provienen de las mejores casas de perfumes del mundo. Libres de crueldad y seguras para tu piel — para que te sientas aún mejor con tu aroma. Disfruta del lujo, sin culpa.",

    // Newsletter
    "newsletter.title": "Sé el primero en enterarte",
    "newsletter.desc": "Nuevas colecciones, ofertas exclusivas e inspiración aromática.",
    "newsletter.placeholder": "Tu correo electrónico",
    "newsletter.subscribe": "Suscribirse",
    "newsletter.privacy": "Respetamos tu privacidad. Cancela cuando quieras.",

    // Footer
    "footer.tagline": "Tu destino para perfumes selectos. Una historia en cada frasco.",
    "footer.shop": "Tienda",
    "footer.shopAll": "Todos los Perfumes",
    "footer.shopWomen": "Mujer",
    "footer.shopMen": "Hombre",
    "footer.shopNew": "Novedades",
    "footer.info": "Información",
    "footer.aboutUs": "Sobre Nosotros",
    "footer.shipping": "Envíos y Devoluciones",
    "footer.privacy": "Política de Privacidad",
    "footer.faq": "Preguntas Frecuentes",
    "footer.social": "Social",
    "footer.copyright": "© 2026 Real Scents. Todos los derechos reservados.",

    // Cart
    "cart.title": "Carrito",
    "cart.empty": "Tu carrito está vacío",
    "cart.items": "artículos",
    "cart.item": "artículo",
    "cart.total": "Total",
    "cart.checkout": "PAGAR",
    "cart.added": "Añadido al carrito",

    // Product Detail
    "product.back": "Volver",
    "product.notFound": "Producto no encontrado",
    "product.goHome": "Ir al inicio",

    // Language
    "lang.en": "English",
    "lang.es": "Español",
  },
} as const;

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: TranslationKey) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    const browserLang = navigator.language?.slice(0, 2);
    return browserLang === "es" ? "es" : "en";
  });

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    localStorage.setItem("locale", l);
    document.documentElement.lang = l;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] || translations.en[key] || key;
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
};
