import { useEffect } from "react";
import { SITE_DEFAULT_SOCIAL_IMAGE_ALT, SITE_NAME } from "@/lib/site";
import { resolveSeoData, useSeoCollector } from "@/lib/seoContext";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  type?: "website" | "product";
  noindex?: boolean;
  jsonLd?: Array<Record<string, unknown>> | Record<string, unknown>;
}

function upsertMeta(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

function upsertLink(selector: string, attributes: Record<string, string>) {
  let element = document.head.querySelector(selector) as HTMLLinkElement | null;

  if (!element) {
    element = document.createElement("link");
    document.head.appendChild(element);
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value);
  });
}

const Seo = ({
  title,
  description,
  path = "/",
  image,
  imageAlt = SITE_DEFAULT_SOCIAL_IMAGE_ALT,
  type = "website",
  noindex = false,
  jsonLd,
}: SeoProps) => {
  const collector = useSeoCollector();
  const resolved = resolveSeoData({ title, description, path, image, imageAlt, type, noindex, jsonLd });

  if (collector) {
    collector.register(resolved);
  }

  useEffect(() => {
    document.title = resolved.title;

    upsertMeta('meta[name="description"]', { name: "description", content: resolved.description });
    upsertMeta('meta[name="application-name"]', { name: "application-name", content: SITE_NAME });
    upsertMeta('meta[name="apple-mobile-web-app-title"]', { name: "apple-mobile-web-app-title", content: SITE_NAME });
    upsertMeta('meta[name="theme-color"]', { name: "theme-color", content: "#f3ede4" });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: resolved.robots,
    });
    upsertMeta('meta[property="og:locale"]', { property: "og:locale", content: "en_US" });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: resolved.type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: resolved.title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: resolved.description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: resolved.canonicalUrl });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: "summary_large_image",
    });
    upsertMeta('meta[name="twitter:site"]', { name: "twitter:site", content: SITE_NAME });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: resolved.title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: resolved.description });
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: resolved.canonicalUrl });
    upsertMeta('meta[property="og:image"]', { property: "og:image", content: resolved.imageUrl });
    upsertMeta('meta[property="og:image:alt"]', { property: "og:image:alt", content: resolved.imageAlt });
    upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: resolved.imageUrl });
    upsertMeta('meta[name="twitter:image:alt"]', { name: "twitter:image:alt", content: resolved.imageAlt });

    document.head.querySelectorAll('script[data-seo-managed="true"]').forEach((script) => script.remove());

    if (resolved.jsonLd.length > 0) {
      resolved.jsonLd.forEach((payload) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seoManaged = "true";
        script.text = JSON.stringify(payload);
        document.head.appendChild(script);
      });
    }
  }, [resolved]);

  return null;
};

export default Seo;
