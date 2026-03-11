import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

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
    "nav.searchHelper": "Search by code, note, or scent family.",
    "nav.searchResults": "Matching fragrances",
    "nav.searchEmpty": "No fragrances matched your search.",
    "nav.searchEmptyHint": "Try a code like E155, a note like vanilla, or a family like woody.",
    "nav.searchBrowseAll": "Browse all perfumes",
    "nav.account": "Account",

    "hero.badge": "NEW",
    "hero.title": "Curated scents:",
    "hero.subtitle": "Curated David Walker fragrances for the U.S. market.",
    "hero.cta1": "SHOP ALL PERFUMES",
    "hero.cta2": "SHOP BEST SELLERS",

    "category.women": "Women",
    "category.men": "Men",
    "category.unisex": "Unisex",
    "category.shopNow": "Shop Now",

    "products.title": "Featured perfumes",
    "products.subtitle": "Best-selling David Walker fragrances, curated by Real Scents for online purchase",
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
    "brand.desc": "Real Scents presents David Walker Eau de Parfum with clear scent notes, premium visuals, and straightforward U.S. delivery.",
    "brand.learnMore": "Learn More",
    "brand.standardsTitle1": "BUILT FOR",
    "brand.standardsTitle2": "ONLINE DISCOVERY",
    "brand.standardsDesc": "Every listing is organized around scent profile, notes, and wearing occasion so customers can shop by mood instead of guessing from a code alone.",

    "newsletter.title": "Be the first to know",
    "newsletter.desc": "New collections, exclusive offers, and scent inspiration.",
    "newsletter.placeholder": "Your email address",
    "newsletter.subscribe": "Subscribe",
    "newsletter.privacy": "We respect your privacy. Unsubscribe anytime.",
    "newsletter.status": "Email signup opens at launch.",
    "newsletter.comingSoon":
      "The opt-in flow is not live yet. Final contact details and subscription setup will be added before launch.",
    "newsletter.browse": "Browse all perfumes",

    "footer.tagline": "Shop David Walker fragrances at Real Scents with clear scent notes and free U.S. shipping.",
    "footer.shop": "Shop",
    "footer.shopAll": "All Perfumes",
    "footer.shopWomen": "Women",
    "footer.shopMen": "Men",
    "footer.shopNew": "Best Sellers",
    "footer.info": "Info",
    "footer.aboutUs": "About Us",
    "footer.shipping": "Shipping Policy",
    "footer.privacy": "Privacy Policy",
    "footer.terms": "Terms of Service",
    "footer.faq": "FAQ",
    "footer.social": "Social",
    "footer.socialNote": "Social links will be added at launch.",
    "footer.copyright": "Copyright 2026 Real Scents. All rights reserved.",

    "cart.title": "Cart",
    "cart.empty": "Your cart is empty",
    "cart.items": "items",
    "cart.item": "item",
    "cart.total": "Total",
    "cart.checkout": "CHECKOUT",
    "cart.previewCheckout": "CHECKOUT",
    "cart.previewNote": "Bundle pricing and promo code rules are shown before checkout. Complimentary gift is added per order.",
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
    "nav.searchHelper": "Busca por codigo, nota o familia olfativa.",
    "nav.searchResults": "Fragancias relacionadas",
    "nav.searchEmpty": "No se encontraron fragancias para esa busqueda.",
    "nav.searchEmptyHint": "Prueba con un codigo como E155, una nota como vainilla o una familia como amaderado.",
    "nav.searchBrowseAll": "Ver todos los perfumes",
    "nav.account": "Cuenta",

    "hero.badge": "NUEVO",
    "hero.title": "Aromas selectos:",
    "hero.subtitle": "Fragancias David Walker seleccionadas para el mercado de Estados Unidos.",
    "hero.cta1": "VER TODOS LOS PERFUMES",
    "hero.cta2": "VER LOS MAS VENDIDOS",

    "category.women": "Mujer",
    "category.men": "Hombre",
    "category.unisex": "Unisex",
    "category.shopNow": "Comprar Ahora",

    "products.title": "Perfumes destacados",
    "products.subtitle": "Fragancias David Walker mas vendidas, seleccionadas por Real Scents para compra online",
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
    "brand.desc": "Real Scents presenta Eau de Parfum de David Walker con notas claras, visuales premium y una experiencia de compra pensada para Estados Unidos.",
    "brand.learnMore": "Saber Mas",
    "brand.standardsTitle1": "HECHO PARA",
    "brand.standardsTitle2": "DESCUBRIMIENTO ONLINE",
    "brand.standardsDesc": "Cada ficha esta organizada por perfil olfativo, notas y ocasion de uso para que la compra online sea mas clara y directa.",

    "newsletter.title": "Se el primero en enterarte",
    "newsletter.desc": "Nuevas colecciones, ofertas exclusivas e inspiracion aromatica.",
    "newsletter.placeholder": "Tu correo electronico",
    "newsletter.subscribe": "Suscribirse",
    "newsletter.privacy": "Respetamos tu privacidad. Cancela cuando quieras.",
    "newsletter.status": "El registro por email se abrira en el lanzamiento.",
    "newsletter.comingSoon":
      "El flujo de suscripcion aun no esta activo. Los datos finales de contacto y el formulario se agregaran antes del lanzamiento.",
    "newsletter.browse": "Ver todos los perfumes",

    "footer.tagline": "Compra fragancias David Walker en Real Scents con notas olfativas claras y envio gratuito en Estados Unidos.",
    "footer.shop": "Tienda",
    "footer.shopAll": "Todos los Perfumes",
    "footer.shopWomen": "Mujer",
    "footer.shopMen": "Hombre",
    "footer.shopNew": "Mas Vendidos",
    "footer.info": "Informacion",
    "footer.aboutUs": "Sobre Nosotros",
    "footer.shipping": "Politica de Envio",
    "footer.privacy": "Politica de Privacidad",
    "footer.terms": "Terminos del Servicio",
    "footer.faq": "Preguntas Frecuentes",
    "footer.social": "Social",
    "footer.socialNote": "Los enlaces sociales se anadiran en el lanzamiento.",
    "footer.copyright": "Copyright 2026 Real Scents. Todos los derechos reservados.",

    "cart.title": "Carrito",
    "cart.empty": "Tu carrito esta vacio",
    "cart.items": "articulos",
    "cart.item": "articulo",
    "cart.total": "Total",
    "cart.checkout": "PAGAR",
    "cart.previewCheckout": "PAGAR",
    "cart.previewNote": "Las reglas del bundle y del codigo promocional se muestran antes del pago. El regalo se agrega por pedido.",
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

function getInitialLocale(): Locale {
  if (typeof window === "undefined") {
    return "en";
  }

  const storedLocale = window.localStorage.getItem("locale");
  if (storedLocale === "en" || storedLocale === "es") {
    return storedLocale;
  }

  const browserLanguage = window.navigator.language?.slice(0, 2);
  return browserLanguage === "es" ? "es" : "en";
}

export const I18nProvider = ({ children }: { children: ReactNode }) => {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.localStorage.setItem("locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

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
