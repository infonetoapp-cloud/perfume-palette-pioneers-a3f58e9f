import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

import { createServer } from "vite";

import { allPaths } from "./seo-manifest.mjs";

const rootDir = process.cwd();
const distDir = join(rootDir, "dist");
const templatePath = join(distDir, "index.html");
const manifestPath = join(distDir, ".vite", "manifest.json");

type AssetManifest = Record<string, { file: string }>;

function stripSeoTags(template: string): string {
  return template
    .replace(/<title>[\s\S]*?<\/title>\s*/i, "")
    .replace(/<meta[^>]+name="description"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="application-name"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="apple-mobile-web-app-title"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="theme-color"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="robots"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+property="og:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<meta[^>]+name="twitter:[^"]+"[^>]*>\s*/gi, "")
    .replace(/<link[^>]+rel="canonical"[^>]*>\s*/gi, "")
    .replace(/<script[^>]+data-seo-managed="true"[\s\S]*?<\/script>\s*/gi, "");
}

function injectRouteMarkup(template: string, appHtml: string, headTags: string, htmlAttributes = 'lang="en"'): string {
  return stripSeoTags(template)
    .replace(/<html[^>]*>/i, `<html ${htmlAttributes}>`)
    .replace(/<div id="root"><\/div>/i, `<div id="root">${appHtml}</div>`)
    .replace("</head>", `    ${headTags}\n  </head>`);
}

function getOutputPath(routePath: string): string {
  if (routePath === "/") {
    return templatePath;
  }

  return join(distDir, `${routePath.replace(/^\//, "")}.html`);
}

function rewriteAssetUrls(markup: string, manifest: AssetManifest): string {
  let rewritten = markup;

  for (const [sourcePath, entry] of Object.entries(manifest)) {
    if (!sourcePath.startsWith("src/assets/")) continue;

    const normalizedSourcePath = `/${sourcePath.replace(/\\/g, "/")}`;
    const builtPath = `/${entry.file}`;
    rewritten = rewritten.split(normalizedSourcePath).join(builtPath);
  }

  return rewritten;
}

async function main() {
  const template = readFileSync(templatePath, "utf8");
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as AssetManifest;
  const vite = await createServer({
    appType: "custom",
    server: { middlewareMode: true },
  });

  try {
    const entry = await vite.ssrLoadModule("/src/entry-server.tsx");
    const render = entry.render as (path: string) => { appHtml: string; headTags: string; htmlAttributes?: string };

    for (const routePath of allPaths) {
      const { appHtml, headTags, htmlAttributes } = await render(routePath);
      const outputPath = getOutputPath(routePath);
      mkdirSync(dirname(outputPath), { recursive: true });
      const routeMarkup = rewriteAssetUrls(appHtml, manifest);
      const routeHead = rewriteAssetUrls(headTags, manifest);
      writeFileSync(outputPath, injectRouteMarkup(template, routeMarkup, routeHead, htmlAttributes), "utf8");
    }

    console.log(`Prerendered ${allPaths.length} routes.`);
  } finally {
    await vite.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
