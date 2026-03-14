import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

export type Locale = "en" | "es";

const translations = {
  en: {
    "announcement.freeShipping": "Free shipping on every U.S. order",
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
    "hero.subtitle": "Curated David Walker fragrances for everyday wear.",
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
    "brand.aboutLink": "About Real Scents",
    "brand.bestSellersLink": "Shop Best Sellers",
    "brand.standardsTitle1": "BUILT FOR",
    "brand.standardsTitle2": "ONLINE DISCOVERY",
    "brand.standardsDesc": "Every listing is organized around scent profile, notes, and wearing occasion so customers can shop by mood instead of guessing from a code alone.",

    "newsletter.title": "Get early drops and offer alerts",
    "newsletter.desc": "Join the Real Scents list for launch updates, scent tips, and bundle reminders.",
    "newsletter.placeholder": "Your email address",
    "newsletter.subscribe": "Join the list",
    "newsletter.submitting": "Joining...",
    "newsletter.privacy": "By subscribing, you agree to receive email updates and offers from Real Scents. Unsubscribe anytime.",
    "newsletter.status": "Email list",
    "newsletter.comingSoon":
      "Stored directly in Shopify so you can build a free customer list without paying for a separate email capture app.",
    "newsletter.browse": "Browse all perfumes",
    "newsletter.success": "You're in. We'll send new drops and offer updates by email.",
    "newsletter.error": "We couldn't save your email right now. Please try again.",
    "newsletter.invalid": "Please enter a valid email address.",

    "footer.tagline": "Shop David Walker fragrances at Real Scents with clear scent notes and free U.S. shipping on every order.",
    "footer.shop": "Shop",
    "footer.shopAll": "All Perfumes",
    "footer.shopWomen": "Women",
    "footer.shopMen": "Men",
    "footer.shopNew": "Best Sellers",
    "footer.info": "Info",
    "footer.aboutUs": "About Us",
    "footer.shipping": "Shipping Policy",
    "footer.refunds": "Refund Policy",
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
    "cart.previewNote": "Multi-bottle pricing and promo code rules are shown before checkout. Perfume orders include 1 free car scent per order. Car scent-only orders do not include an extra free car scent.",
    "cart.added": "Added to cart",

    "product.back": "Back",
    "product.notFound": "Product not found",
    "product.goHome": "Go to homepage",

    "lang.en": "English",
    "lang.es": "Espanol",
  },
  es: {
    "announcement.freeShipping": "Envio gratuito en todos los pedidos de Estados Unidos",
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
    "hero.subtitle": "Fragancias David Walker seleccionadas para el dia a dia.",
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
    "brand.aboutLink": "Conoce Real Scents",
    "brand.bestSellersLink": "Ver Mas Vendidos",
    "brand.standardsTitle1": "HECHO PARA",
    "brand.standardsTitle2": "DESCUBRIMIENTO ONLINE",
    "brand.standardsDesc": "Cada ficha esta organizada por perfil olfativo, notas y ocasion de uso para que la compra online sea mas clara y directa.",

    "newsletter.title": "Recibe lanzamientos y ofertas primero",
    "newsletter.desc": "Unete a la lista de Real Scents para novedades, consejos olfativos y recordatorios de bundles.",
    "newsletter.placeholder": "Tu correo electronico",
    "newsletter.subscribe": "Unirme a la lista",
    "newsletter.submitting": "Enviando...",
    "newsletter.privacy": "Al suscribirte aceptas recibir correos y ofertas de Real Scents. Puedes darte de baja cuando quieras.",
    "newsletter.status": "Lista de correo",
    "newsletter.comingSoon":
      "Guardado directamente en Shopify para crear tu lista de clientes sin pagar una app separada de captacion.",
    "newsletter.browse": "Ver todos los perfumes",
    "newsletter.success": "Listo. Te enviaremos novedades y ofertas por correo.",
    "newsletter.error": "No pudimos guardar tu correo ahora mismo. Intentalo de nuevo.",
    "newsletter.invalid": "Introduce un correo electronico valido.",

    "footer.tagline": "Compra fragancias David Walker en Real Scents con notas olfativas claras y envio gratuito en todos los pedidos de Estados Unidos.",
    "footer.shop": "Tienda",
    "footer.shopAll": "Todos los Perfumes",
    "footer.shopWomen": "Mujer",
    "footer.shopMen": "Hombre",
    "footer.shopNew": "Mas Vendidos",
    "footer.info": "Informacion",
    "footer.aboutUs": "Sobre Nosotros",
    "footer.shipping": "Politica de Envio",
    "footer.refunds": "Politica de Reembolso",
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
    "cart.previewNote": "Las reglas del bundle y del codigo promocional se muestran antes del pago. Los pedidos de perfume incluyen 1 ambientador para auto por pedido. Los pedidos solo de ambientador no incluyen otro gratis.",
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
