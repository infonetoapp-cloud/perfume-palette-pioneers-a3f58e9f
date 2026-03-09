import { useEffect } from "react";
import { getAbsoluteUrl, SITE_NAME } from "@/lib/site";

interface SeoProps {
  title: string;
  description: string;
  path?: string;
  image?: string;
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

const Seo = ({ title, description, path = "/", image, type = "website", noindex = false, jsonLd }: SeoProps) => {
  useEffect(() => {
    const absoluteUrl = getAbsoluteUrl(path);
    const absoluteImage = image ? getAbsoluteUrl(image) : undefined;

    document.title = title;

    upsertMeta('meta[name="description"]', { name: "description", content: description });
    upsertMeta('meta[name="robots"]', {
      name: "robots",
      content: noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
    });
    upsertMeta('meta[property="og:site_name"]', { property: "og:site_name", content: SITE_NAME });
    upsertMeta('meta[property="og:type"]', { property: "og:type", content: type });
    upsertMeta('meta[property="og:title"]', { property: "og:title", content: title });
    upsertMeta('meta[property="og:description"]', { property: "og:description", content: description });
    upsertMeta('meta[property="og:url"]', { property: "og:url", content: absoluteUrl });
    upsertMeta('meta[name="twitter:card"]', {
      name: "twitter:card",
      content: absoluteImage ? "summary_large_image" : "summary",
    });
    upsertMeta('meta[name="twitter:title"]', { name: "twitter:title", content: title });
    upsertMeta('meta[name="twitter:description"]', { name: "twitter:description", content: description });
    upsertLink('link[rel="canonical"]', { rel: "canonical", href: absoluteUrl });

    if (absoluteImage) {
      upsertMeta('meta[property="og:image"]', { property: "og:image", content: absoluteImage });
      upsertMeta('meta[name="twitter:image"]', { name: "twitter:image", content: absoluteImage });
    }

    document.head.querySelectorAll('script[data-seo-managed="true"]').forEach((script) => script.remove());

    if (jsonLd) {
      const payloads = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      payloads.forEach((payload) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.dataset.seoManaged = "true";
        script.text = JSON.stringify(payload);
        document.head.appendChild(script);
      });
    }
  }, [description, image, jsonLd, noindex, path, title, type]);

  return null;
};

export default Seo;
