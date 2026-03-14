import crypto from "crypto";

const SHOPIFY_ADMIN_CLIENT_ID = process.env.SHOPIFY_ADMIN_CLIENT_ID;
const SHOPIFY_ADMIN_CLIENT_SECRET = process.env.SHOPIFY_ADMIN_CLIENT_SECRET;
const SHOPIFY_ADMIN_SCOPES = process.env.SHOPIFY_ADMIN_SCOPES
  || "read_products,write_products,read_inventory,write_inventory,read_files,write_files,read_publications,write_publications,read_discounts,write_discounts,read_orders,write_orders,read_draft_orders,write_draft_orders,read_merchant_managed_fulfillment_orders,write_merchant_managed_fulfillment_orders,read_customers,write_customers";

export function getShopifyAdminConfig() {
  return {
    clientId: SHOPIFY_ADMIN_CLIENT_ID?.trim(),
    clientSecret: SHOPIFY_ADMIN_CLIENT_SECRET?.trim(),
    scopes: SHOPIFY_ADMIN_SCOPES?.trim(),
  };
}

export function buildBaseUrl(req) {
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || "https";
  return `${protocol}://${host}`;
}

export function isValidShopDomain(shop) {
  return typeof shop === "string" && /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/i.test(shop);
}

export function createNonce() {
  return crypto.randomBytes(16).toString("hex");
}

export function signQuery(params, secret) {
  const message = Object.keys(params)
    .filter((key) => key !== "hmac" && key !== "signature" && typeof params[key] !== "undefined")
    .sort()
    .map((key) => `${key}=${Array.isArray(params[key]) ? params[key].join(",") : params[key]}`)
    .join("&");

  return crypto.createHmac("sha256", secret).update(message).digest("hex");
}

export function verifyHmac(query, secret) {
  if (!query?.hmac || !secret) return false;
  const generated = signQuery(query, secret);
  const received = String(query.hmac);

  if (generated.length !== received.length) return false;

  return crypto.timingSafeEqual(Buffer.from(generated), Buffer.from(received));
}

export function setStateCookie(res, value) {
  const cookie = [
    `shopify_admin_state=${value}`,
    "Path=/api/shopify-admin",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=600",
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
}

export function clearStateCookie(res) {
  const cookie = [
    "shopify_admin_state=",
    "Path=/api/shopify-admin",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    "Max-Age=0",
  ].join("; ");

  res.setHeader("Set-Cookie", cookie);
}

export function readStateCookie(req) {
  const rawCookie = req.headers.cookie || "";
  const match = rawCookie.match(/(?:^|;\s*)shopify_admin_state=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function renderHtml(title, body) {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <style>
      body{font-family:Inter,Arial,sans-serif;background:#f7f3ed;color:#111;margin:0;padding:40px}
      .card{max-width:760px;margin:0 auto;background:#fff;border:1px solid #e7ddd1;border-radius:24px;padding:28px;box-shadow:0 10px 30px rgba(0,0,0,.04)}
      h1{font-size:28px;line-height:1.1;margin:0 0 16px}
      p{font-size:15px;line-height:1.7;color:#444}
      code,textarea{font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
      textarea{width:100%;min-height:140px;border:1px solid #d8c8b7;border-radius:16px;padding:16px;font-size:14px}
      .muted{color:#666}
      .ok{color:#0f7b49;font-weight:600}
      .err{color:#a32727;font-weight:600}
      a{color:#111}
    </style>
  </head>
  <body>
    <div class="card">
      ${body}
    </div>
  </body>
</html>`;
}
