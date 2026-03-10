import { createContext, useContext, type ReactNode } from "react";

import { getAbsoluteUrl, SITE_DEFAULT_SOCIAL_IMAGE, SITE_DEFAULT_SOCIAL_IMAGE_ALT, SITE_NAME } from "@/lib/site";

export interface SeoRegistration {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "product";
  noindex?: boolean;
  jsonLd?: Array<Record<string, unknown>> | Record<string, unknown>;
}

export interface ResolvedSeoData {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  imageAlt: string;
  type: "website" | "product";
  robots: string;
  jsonLd: Array<Record<string, unknown>>;
}

interface SeoCollectorValue {
  register: (data: ResolvedSeoData) => void;
}

const SeoCollectorContext = createContext<SeoCollectorValue | null>(null);

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeJsonLd(payload: Record<string, unknown>): string {
  return JSON.stringify(payload).replace(/</g, "\\u003c");
}

export function resolveSeoData({
  title,
  description,
  path = "/",
  image,
  imageAlt = SITE_DEFAULT_SOCIAL_IMAGE_ALT,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoRegistration): ResolvedSeoData {
  return {
    title,
    description,
    canonicalUrl: getAbsoluteUrl(path),
    imageUrl: getAbsoluteUrl(image ?? SITE_DEFAULT_SOCIAL_IMAGE),
    imageAlt,
    type,
    robots: noindex
      ? "noindex, nofollow"
      : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    jsonLd: Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [],
  };
}

export function buildSeoHeadMarkup(data: ResolvedSeoData): string {
  return [
    `<title>${escapeHtml(data.title)}</title>`,
    `<meta name="description" content="${escapeHtml(data.description)}" />`,
    `<meta name="application-name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="apple-mobile-web-app-title" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="theme-color" content="#f3ede4" />`,
    `<meta name="robots" content="${escapeHtml(data.robots)}" />`,
    `<meta property="og:locale" content="en_US" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta property="og:type" content="${escapeHtml(data.type)}" />`,
    `<meta property="og:title" content="${escapeHtml(data.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(data.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(data.canonicalUrl)}" />`,
    `<meta property="og:image" content="${escapeHtml(data.imageUrl)}" />`,
    `<meta property="og:image:alt" content="${escapeHtml(data.imageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:site" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(data.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(data.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(data.imageUrl)}" />`,
    `<meta name="twitter:image:alt" content="${escapeHtml(data.imageAlt)}" />`,
    `<link rel="canonical" href="${escapeHtml(data.canonicalUrl)}" />`,
    ...data.jsonLd.map(
      (payload) => `<script type="application/ld+json" data-seo-managed="true">${serializeJsonLd(payload)}</script>`,
    ),
  ].join("\n    ");
}

export const SeoCollectorProvider = ({
  collector,
  children,
}: {
  collector: SeoCollectorValue;
  children: ReactNode;
}) => <SeoCollectorContext.Provider value={collector}>{children}</SeoCollectorContext.Provider>;

export function useSeoCollector() {
  return useContext(SeoCollectorContext);
}
