import defaultSocialImage from "@/assets/hero/hero-studio.jpg";

export const SITE_NAME = "Real Scents";
export const SITE_BRAND = "David Walker";
export const SITE_DOMAIN = "shoprealscents.com";
export const SITE_SUPPORT_EMAIL = "hello@shoprealscents.com";
export const SITE_DESCRIPTION =
  "Shop David Walker perfumes and car scents online at Real Scents with curated scent notes, free U.S. shipping on every order, and secure Shopify checkout.";
export const SITE_DEFAULT_ORIGIN = (import.meta.env.VITE_SITE_URL || `https://${SITE_DOMAIN}`).replace(/\/$/, "");
export const SITE_DEFAULT_SOCIAL_IMAGE = defaultSocialImage;
export const SITE_DEFAULT_SOCIAL_IMAGE_ALT = "Real Scents fragrance collection hero image";

export function getSiteOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return SITE_DEFAULT_ORIGIN;
}

export function getAbsoluteUrl(path = "/"): string {
  const origin = getSiteOrigin();
  if (!origin) return path;
  return new URL(path, origin).toString();
}
