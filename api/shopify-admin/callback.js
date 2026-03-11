import {
  clearStateCookie,
  getShopifyAdminConfig,
  readStateCookie,
  renderHtml,
  verifyHmac,
} from "./_oauth.js";
import { syncCatalogToShopify, syncCollectionsToShopify, syncDiscountsToShopify } from "./_sync.js";

function renderResultList(results) {
  return `
        <ul style="padding-left:20px;margin:20px 0 0">
          ${results.map((result) => `
        <li style="margin:10px 0">
          <strong>${result.code || result.title}</strong> - ${result.message}
        </li>
      `).join("")}
    </ul>
  `;
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const { clientId, clientSecret } = getShopifyAdminConfig();
  const shop = String(req.query.shop || "").trim();
  const code = String(req.query.code || "").trim();
  const state = String(req.query.state || "").trim();
  const cookieState = readStateCookie(req);

  clearStateCookie(res);

  if (!clientId || !clientSecret) {
    res.status(500).setHeader("Content-Type", "text/html").send(
      renderHtml("Missing Shopify app credentials", `
        <h1 class="err">Shopify app credentials missing</h1>
        <p>Set <code>SHOPIFY_ADMIN_CLIENT_ID</code> and <code>SHOPIFY_ADMIN_CLIENT_SECRET</code> in Vercel before retrying.</p>
      `),
    );
    return;
  }

  if (!verifyHmac(req.query, clientSecret)) {
    res.status(400).setHeader("Content-Type", "text/html").send(
      renderHtml("Invalid callback signature", `
        <h1 class="err">Shopify callback could not be verified</h1>
        <p>The HMAC signature from Shopify did not match. Start the install flow again.</p>
      `),
    );
    return;
  }

  if (!state || !cookieState || state !== cookieState) {
    res.status(400).setHeader("Content-Type", "text/html").send(
      renderHtml("Invalid install state", `
        <h1 class="err">Install state mismatch</h1>
        <p>The Shopify install state was missing or expired. Start the install flow again from the same browser.</p>
      `),
    );
    return;
  }

  if (!shop || !code) {
    res.status(400).setHeader("Content-Type", "text/html").send(
      renderHtml("Missing callback values", `
        <h1 class="err">Missing required callback values</h1>
        <p>The callback did not include both <code>shop</code> and <code>code</code>.</p>
      `),
    );
    return;
  }

  try {
    const tokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      }),
    });

    const tokenPayload = await tokenResponse.json();

    if (!tokenResponse.ok || !tokenPayload.access_token) {
      const tokenError = `Token exchange failed: ${JSON.stringify(tokenPayload)}`;

      if (String(tokenPayload?.error_description || "").includes("authorization code was not found or was already used")) {
        res.status(400).setHeader("Content-Type", "text/html").send(
          renderHtml("Shopify sync needs a fresh OAuth start", `
            <h1 class="err">This Shopify sync link expired</h1>
            <p>The Shopify authorization code was already used. This happens if the callback page is refreshed or reopened from history.</p>
            <p><a href="/api/shopify-admin/install.js">Start a fresh Shopify sync</a></p>
          `),
        );
        return;
      }

      throw new Error(tokenError);
    }

    const productSync = await syncCatalogToShopify({
      shop,
      accessToken: tokenPayload.access_token,
    });
    const collectionSync = await syncCollectionsToShopify({
      shop,
      accessToken: tokenPayload.access_token,
    });
    const discountSync = await syncDiscountsToShopify({
      shop,
      accessToken: tokenPayload.access_token,
    });

    const successCount = productSync.results.filter((result) => result.status === "success").length;
    const warningCount = productSync.results.filter((result) => result.status === "warning").length;
    const discountSuccessCount = discountSync.filter((result) => result.status === "success" || result.status === "existing").length;

    res.status(200).setHeader("Content-Type", "text/html").send(
      renderHtml("Shopify sync complete", `
        <h1 class="ok">Shopify sync complete</h1>
        <p><strong>${successCount}</strong> products synced successfully.</p>
        <p><strong>${collectionSync.length}</strong> collections synced successfully.</p>
        <p><strong>${discountSuccessCount}</strong> discount rules are present in Shopify.</p>
        <p>${warningCount > 0 ? `<strong>${warningCount}</strong> products synced with publication warnings.` : "No publication warnings were reported."}</p>
        <p class="muted">Target publications: <code>${productSync.publications.join(", ") || "none detected"}</code></p>
        <p><a href="https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/products" target="_blank" rel="noreferrer">Open Shopify products</a></p>
        <p><a href="https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/collections" target="_blank" rel="noreferrer">Open Shopify collections</a></p>
        <p><a href="https://admin.shopify.com/store/${shop.replace(".myshopify.com", "")}/discounts" target="_blank" rel="noreferrer">Open Shopify discounts</a></p>
        <p><a href="https://shoprealscents.com" target="_blank" rel="noreferrer">Open storefront</a></p>
        <h2 style="margin-top:28px">Product results</h2>
        ${renderResultList(productSync.results)}
        <h2 style="margin-top:28px">Collection results</h2>
        ${renderResultList(collectionSync)}
        <h2 style="margin-top:28px">Discount results</h2>
        ${renderResultList(discountSync)}
      `),
    );
  } catch (error) {
    res.status(500).setHeader("Content-Type", "text/html").send(
      renderHtml("Shopify sync failed", `
        <h1 class="err">Shopify sync failed</h1>
        <p>${error instanceof Error ? error.message : "Unknown error"}</p>
      `),
    );
  }
}
