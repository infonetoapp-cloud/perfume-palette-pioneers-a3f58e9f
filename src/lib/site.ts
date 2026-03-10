import defaultSocialImage from "@/assets/hero/hero-studio.jpg";

export const SITE_NAME = "Real Scents";
export const SITE_BRAND = "David Walker";
export const SITE_DOMAIN = "shoprealscents.com";
export const SITE_SUPPORT_EMAIL = "hello@shoprealscents.com";
export const SITE_DESCRIPTION =
  "Shop David Walker Eau de Parfum for women and men at Real Scents with free U.S. shipping, curated scent notes, and premium product photography.";
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
