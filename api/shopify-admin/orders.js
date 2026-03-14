import { fetchRecentOpenOrders } from "./_admin.js";
import { requireOpsToken } from "./_ops-auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!requireOpsToken(req, res)) {
    return;
  }

  try {
    const requestedLimit = Number.parseInt(String(req.query.limit || "20"), 10);
    const limit = Number.isFinite(requestedLimit)
      ? Math.min(Math.max(requestedLimit, 1), 50)
      : 20;

    const orders = await fetchRecentOpenOrders(limit);

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Could not fetch orders",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
