import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { allPaths } from "./seo-manifest.mjs";

const siteOrigin = (process.env.SITE_URL || process.env.VITE_SITE_URL || "https://shoprealscents.com").replace(/\/$/, "");
const publicDir = join(process.cwd(), "public");

mkdirSync(publicDir, { recursive: true });

const sitemap = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...allPaths.map((path) => `  <url><loc>${siteOrigin}${path}</loc></url>`),
  "</urlset>",
  "",
].join("\n");

const robots = [
  "User-agent: *",
  "Allow: /",
  `Sitemap: ${siteOrigin}/sitemap.xml`,
  "",
].join("\n");

writeFileSync(join(publicDir, "sitemap.xml"), sitemap, "utf8");
writeFileSync(join(publicDir, "robots.txt"), robots, "utf8");

console.log(`Generated sitemap.xml and robots.txt for ${siteOrigin}`);
