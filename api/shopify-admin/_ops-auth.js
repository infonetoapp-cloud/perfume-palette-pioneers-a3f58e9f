const SHOPIFY_ADMIN_OPS_TOKEN = process.env.SHOPIFY_ADMIN_OPS_TOKEN?.trim();

function readBearerToken(req) {
  const authHeader = String(req.headers.authorization || "").trim();
  if (!authHeader.toLowerCase().startsWith("bearer ")) return null;
  return authHeader.slice(7).trim();
}

export function requireOpsToken(req, res) {
  if (!SHOPIFY_ADMIN_OPS_TOKEN) {
    res.status(503).json({
      error: "Shopify ops token is not configured",
      detail: "Set SHOPIFY_ADMIN_OPS_TOKEN in Vercel before using order operation endpoints.",
    });
    return false;
  }

  const headerToken = readBearerToken(req);
  const queryToken = String(req.query?.token || req.body?.token || "").trim();
  const providedToken = headerToken || queryToken;

  if (!providedToken || providedToken !== SHOPIFY_ADMIN_OPS_TOKEN) {
    res.status(401).json({
      error: "Unauthorized",
      detail: "Provide a valid Bearer token or token parameter.",
    });
    return false;
  }

  return true;
}
