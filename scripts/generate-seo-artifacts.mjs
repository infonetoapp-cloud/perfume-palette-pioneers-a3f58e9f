import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { allPaths } from "./seo-manifest.mjs";

const siteOrigin = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://shoprealscents.com").replace(/\/$/, "");
const publicDir = join(process.cwd(), "public");
const lastModified = new Date().toISOString().split("T")[0];

mkdirSync(publicDir, { recursive: true });

function resolvePriority(path) {
  if (path === "/") return "1.0";
  if (path.startsWith("/collections/")) return "0.9";
  if (path.startsWith("/product/")) return "0.8";
  if (path.startsWith("/auto-scents/")) return "0.8";
  return "0.7";
}

function resolveChangefreq(path) {
  if (path === "/") return "daily";
  if (path.startsWith("/collections/")) return "weekly";
  if (path.startsWith("/product/")) return "weekly";
  return "monthly";
}

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allPaths.map(
    (path) =>
      [
        "  <url>",
        `    <loc>${siteOrigin}${path}</loc>`,
        `    <lastmod>${lastModified}</lastmod>`,
        `    <changefreq>${resolveChangefreq(path)}</changefreq>`,
        `    <priority>${resolvePriority(path)}</priority>`,
        "  </url>",
      ].join("\n"),
  ),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  "Disallow: /api/",
  `Sitemap: ${siteOrigin}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(`Generated sitemap.xml and robots.txt for ${siteOrigin}`);
