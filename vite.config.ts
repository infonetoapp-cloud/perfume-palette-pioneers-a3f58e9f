import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

const shopifyApiVersion = process.env.SHOPIFY_API_VERSION || "2025-07";
const shopifyStoreDomain = process.env.SHOPIFY_STORE_DOMAIN;
const shopifyStorefrontToken = process.env.SHOPIFY_STOREFRONT_TOKEN;
const shopifyTokenHeader = shopifyStorefrontToken?.startsWith("shpat_")
  ? "Shopify-Storefront-Private-Token"
  : "X-Shopify-Storefront-Access-Token";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      overlay: false,
    },
    ...(shopifyStoreDomain && shopifyStorefrontToken
      ? {
          proxy: {
            "/api/shopify": {
              target: `https://${shopifyStoreDomain}`,
              changeOrigin: true,
              rewrite: () => `/api/${shopifyApiVersion}/graphql.json`,
              headers: {
                [shopifyTokenHeader]: shopifyStorefrontToken,
              },
            },
          },
        }
      : {}),
  },
  build: {
    manifest: true,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
