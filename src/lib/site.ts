export const SITE_NAME = "David Walker Fragrances";
export const SITE_BRAND = "David Walker";
export const SITE_DESCRIPTION =
  "Shop David Walker Eau de Parfum for women and men with free U.S. shipping, curated scent notes, and premium product photography.";

export function getSiteOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }

  return "";
}

export function getAbsoluteUrl(path = "/"): string {
  const origin = getSiteOrigin();
  if (!origin) return path;
  return new URL(path, origin).toString();
}
