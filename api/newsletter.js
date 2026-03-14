import { upsertEmailSubscriber } from "./shopify-admin/_admin.js";

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const payload = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const email = normalizeEmail(payload?.email);
    const honeypot = String(payload?.company || "").trim();

    if (honeypot) {
      return res.status(200).json({
        status: "subscribed",
        message: "You're on the list.",
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Please enter a valid email address.",
      });
    }

    const customer = await upsertEmailSubscriber(email);

    return res.status(200).json({
      status: "subscribed",
      customerId: customer?.id || null,
      message: "You're on the list. We'll send new drops and offer updates by email.",
    });
  } catch (error) {
    console.error("Newsletter subscribe failed", error);

    return res.status(500).json({
      error: "Newsletter signup failed.",
      detail: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
