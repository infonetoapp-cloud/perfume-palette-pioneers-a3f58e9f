import {
  buildBaseUrl,
  createNonce,
  getShopifyAdminConfig,
  isValidShopDomain,
  renderHtml,
  setStateCookie,
} from "./_oauth.js";

const SHOPIFY_STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;

export default async function handler(req, res) {
  const { clientId, scopes } = getShopifyAdminConfig();
  const shop = String(req.query.shop || SHOPIFY_STORE_DOMAIN || "").trim();

  if (!clientId) {
    res.status(500).setHeader("Content-Type", "text/html").send(
      renderHtml("Shopify app not configured", `
        <h1 class="err">Shopify app credentials missing</h1>
        <p>Set <code>SHOPIFY_ADMIN_CLIENT_ID</code> in Vercel before starting the install flow.</p>
      `),
    );
    return;
  }

  if (!isValidShopDomain(shop)) {
    res.status(400).setHeader("Content-Type", "text/html").send(
      renderHtml("Invalid shop", `
        <h1 class="err">Invalid Shopify shop domain</h1>
        <p>Expected a <code>*.myshopify.com</code> domain. Received: <code>${shop || "(empty)"}</code></p>
      `),
    );
    return;
  }

  const state = createNonce();
  setStateCookie(res, state);

  const redirectUri = `${buildBaseUrl(req)}/api/shopify-admin/callback.js`;
  const authorizeUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  authorizeUrl.searchParams.set("client_id", clientId);
  authorizeUrl.searchParams.set("scope", scopes);
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("state", state);

  res.redirect(authorizeUrl.toString());
}
