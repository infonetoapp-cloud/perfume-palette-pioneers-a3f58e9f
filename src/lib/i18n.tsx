import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export type Locale = "en" | "es";

const translations = {
  en: {
    "announcement.freeShipping": "Free shipping across the United States",
    "announcement.discount": "50ml Eau de Parfum",
    "announcement.newCollection": "Curated scent notes",

    "nav.perfumes": "Perfumes",
    "nav.about": "About",
    "nav.search": "Search",
    "nav.searchPlaceholder": "Search perfumes...",
    "nav.account": "Account",

    "hero.badge": "NEW",
    "hero.title": "Curated scents:",
    "hero.subtitle": "Authorized David Walker fragrances for the U.S. market.",
    "hero.cta1": "SHOP ALL PERFUMES",
    "hero.cta2": "SHOP BEST SELLERS",

    "category.women": "Women",
    "category.men": "Men",
    "category.unisex": "Unisex",
    "category.shopNow": "Shop Now",

    "products.title": "Featured perfumes",
    "products.subtitle": "Best-selling David Walker fragrances, ready for online purchase",
    "products.viewAll": "View All",
    "products.addToCart": "ADD TO CART",
    "products.soldOut": "SOLD OUT",
    "products.noProducts": "No products yet",
    "products.noProductsDesc": "This launch catalog is being curated locally and will expand soon.",
    "products.noImage": "No image",

    "brand.title1": "THE PERFUME",
    "brand.title2": "HOUSE",
    "brand.title3": "FOR ONLINE",
    "brand.titleAccent": "DISCOVERY",
    "brand.desc": "David Walker Eau de Parfum, presented with clear scent notes, premium visuals, and straightforward U.S. delivery.",
    "brand.learnMore": "Learn More",
    "brand.standardsTitle1": "BUILT FOR",
    "brand.standardsTitle2": "& DISCOVERY",
    "brand.standardsDesc": "Every listing is organized around scent profile, notes, and wearing occasion so customers can shop by mood instead of guessing from a code alone.",

    "newsletter.title": "Be the first to know",
    "newsletter.desc": "New collections, exclusive offers, and scent inspiration.",
    "newsletter.placeholder": "Your email address",
    "newsletter.subscribe": "Subscribe",
    "newsletter.privacy": "We respect your privacy. Unsubscribe anytime.",

    "footer.tagline": "Authorized David Walker retailer for customers shopping from the United States.",
    "footer.shop": "Shop",
    "footer.shopAll": "All Perfumes",
    "footer.shopWomen": "Women",
    "footer.shopMen": "Men",
    "footer.shopNew": "Best Sellers",
    "footer.info": "Info",
    "footer.aboutUs": "About Us",
    "footer.shipping": "Shipping & Returns",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.faq": "FAQ",
    "footer.social": "Social",
    "footer.copyright": "Copyright 2026 David Walker Fragrances. All rights reserved.",

    "cart.title": "Cart",
    "cart.empty": "Your cart is empty",
    "cart.items": "items",
    "cart.item": "item",
    "cart.total": "Total",
    "cart.checkout": "CHECKOUT",
    "cart.previewCheckout": "CHECKOUT OPENS AT LAUNCH",
    "cart.previewNote": "The store is running in preview mode. Cart editing works now, and checkout will be enabled when the launch setup is complete.",
    "cart.added": "Added to cart",

    "product.back": "Back",
    "product.notFound": "Product not found",
    "product.goHome": "Go to homepage",

    "lang.en": "English",
    "lang.es": "Espanol",
  },
  es: {
    "announcement.freeShipping": "Envio gratuito en todo Estados Unidos",
    "announcement.discount": "Eau de Parfum de 50 ml",
    "announcement.newCollection": "Notas olfativas claras",

    "nav.perfumes": "Perfumes",
    "nav.about": "Nosotros",
    "nav.search": "Buscar",
    "nav.searchPlaceholder": "Buscar perfumes...",
    "nav.account": "Cuenta",

    "hero.badge": "NUEVO",
    "hero.title": "Aromas selectos:",
    "hero.subtitle": "Fragancias autorizadas de David Walker para el mercado de Estados Unidos.",
    "hero.cta1": "VER TODOS LOS PERFUMES",
    "hero.cta2": "VER LOS MAS VENDIDOS",

    "category.women": "Mujer",
    "category.men": "Hombre",
    "category.unisex": "Unisex",
    "category.shopNow": "Comprar Ahora",

    "products.title": "Perfumes destacados",
    "products.subtitle": "Fragancias David Walker mas vendidas y listas para compra online",
    "products.viewAll": "Ver Todos",
    "products.addToCart": "ANADIR AL CARRITO",
    "products.soldOut": "AGOTADO",
    "products.noProducts": "Aun no hay productos",
    "products.noProductsDesc": "Este catalogo de lanzamiento se esta preparando localmente y crecera pronto.",
    "products.noImage": "Sin imagen",

    "brand.title1": "LA CASA DE",
    "brand.title2": "PERFUMES",
    "brand.title3": "PARA DESCUBRIR",
    "brand.titleAccent": "ONLINE",
    "brand.desc": "Eau de Parfum de David Walker con notas claras, visuales premium y una experiencia de compra pensada para Estados Unidos.",
    "brand.learnMore": "Saber Mas",
    "brand.standardsTitle1": "HECHO PARA",
    "brand.standardsTitle2": "& DESCUBRIR",
    "brand.standardsDesc": "Cada ficha esta organizada por perfil olfativo, notas y ocasion de uso para que la compra online sea mas clara y directa.",

    "newsletter.title": "Se el primero en enterarte",
    "newsletter.desc": "Nuevas colecciones, ofertas exclusivas e inspiracion aromatica.",
    "newsletter.placeholder": "Tu correo electronico",
    "newsletter.subscribe": "Suscribirse",
    "newsletter.privacy": "Respetamos tu privacidad. Cancela cuando quieras.",

    "footer.tagline": "Minorista autorizado de David Walker para clientes que compran desde Estados Unidos.",
    "footer.shop": "Tienda",
    "footer.shopAll": "Todos los Perfumes",
    "footer.shopWomen": "Mujer",
    "footer.shopMen": "Hombre",
    "footer.shopNew": "Mas Vendidos",
    "footer.info": "Informacion",
    "footer.aboutUs": "Sobre Nosotros",
    "footer.shipping": "Envios y Devoluciones",
    "footer.privacy": "Politica de Privacidad",
    "footer.terms": "Terminos del Servicio",
    "footer.faq": "Preguntas Frecuentes",
    "footer.social": "Social",
    "footer.copyright": "Copyright 2026 David Walker Fragrances. Todos los derechos reservados.",

    "cart.title": "Carrito",
    "cart.empty": "Tu carrito esta vacio",
    "cart.items": "articulos",
    "cart.item": "articulo",
    "cart.total": "Total",
    "cart.checkout": "PAGAR",
    "cart.previewCheckout": "PAGO DISPONIBLE EN EL LANZAMIENTO",
    "cart.previewNote": "La tienda esta en modo previo. El carrito funciona ahora y el pago se activara cuando termine la configuracion del lanzamiento.",
    "cart.added": "Anadido al carrito",

    "product.back": "Volver",
    "product.notFound": "Producto no encontrado",
    "product.goHome": "Ir al inicio",

    "lang.en": "English",
    "lang.es": "Espanol",
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
    const browserLanguage = navigator.language?.slice(0, 2);
    return browserLanguage === "es" ? "es" : "en";
  });

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
    localStorage.setItem("locale", nextLocale);
    document.documentElement.lang = nextLocale;
  }, []);

  const t = useCallback(
    (key: TranslationKey): string => {
      return translations[locale][key] || translations.en[key] || key;
    },
    [locale],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within I18nProvider");
  }

  return context;
};
