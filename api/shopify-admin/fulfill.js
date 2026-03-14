import { createFulfillment } from "./_admin.js";
import { requireOpsToken } from "./_ops-auth.js";

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!requireOpsToken(req, res)) {
    return;
  }

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const fulfillmentOrderId = String(body?.fulfillmentOrderId || "").trim();
    const trackingNumber = String(body?.trackingNumber || "").trim();
    const trackingCompany = String(body?.trackingCompany || "").trim();
    const trackingUrl = String(body?.trackingUrl || "").trim();
    const notifyCustomer = body?.notifyCustomer !== false;

    if (!fulfillmentOrderId) {
      return res.status(400).json({ error: "Missing fulfillmentOrderId" });
    }

    if (!trackingNumber) {
      return res.status(400).json({ error: "Missing trackingNumber" });
    }

    const fulfillment = await createFulfillment({
      fulfillmentOrderId,
      trackingNumber,
      trackingCompany,
      trackingUrl,
      notifyCustomer,
    });

    return res.status(200).json({
      success: true,
      fulfillment,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Fulfillment creation failed",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
