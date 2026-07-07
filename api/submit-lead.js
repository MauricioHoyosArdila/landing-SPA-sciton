// Vercel serverless function. This is the ONLY place the Zapier webhook URL
// exists -- it's read from a server-side env var and never shipped to the
// browser, so the URL can't be copied out of client code and hit directly
// (which would bypass reCAPTCHA entirely). A lead is forwarded to Zapier
// only after its reCAPTCHA v3 token verifies here, server-side.

const SCORE_THRESHOLD = 0.5;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  const webhookUrl = process.env.ZAPIER_WEBHOOK_URL;
  if (!secret || !webhookUrl) {
    // Fail closed: never forward a lead if we can't verify it or don't know where to send it.
    console.error("[submit-lead] RECAPTCHA_SECRET_KEY or ZAPIER_WEBHOOK_URL is not set.");
    return res.status(500).json({ success: false, error: "Server misconfiguration" });
  }

  const { token, ...lead } = req.body || {};
  if (!token || typeof token !== "string") {
    return res.status(400).json({ success: false, error: "Missing token" });
  }

  try {
    const verifyParams = new URLSearchParams({ secret, response: token });
    const verifyRes = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyParams.toString(),
    });
    const verifyData = await verifyRes.json();
    const score = typeof verifyData.score === "number" ? verifyData.score : 0;

    if (!verifyData.success || score < SCORE_THRESHOLD) {
      return res.status(200).json({ success: false, score });
    }
  } catch (error) {
    console.error("[submit-lead] reCAPTCHA verification failed:", error);
    return res.status(502).json({ success: false, error: "Verification service unavailable" });
  }

  try {
    const zapierPayload = { ...lead };
    // Optional defense-in-depth: if set, Zapier's "Catch Hook" trigger only
    // exposes body fields (not custom headers) for use in a Filter step, so
    // the shared secret travels as a field here instead of an HTTP header.
    if (process.env.ZAPIER_WEBHOOK_SECRET) {
      zapierPayload.webhookSecret = process.env.ZAPIER_WEBHOOK_SECRET;
    }
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(zapierPayload),
    });
  } catch (error) {
    // The lead already passed spam verification -- a downstream delivery
    // hiccup shouldn't be reported to the user as a rejected submission.
    console.error("[submit-lead] Zapier webhook call failed:", error);
  }

  return res.status(200).json({ success: true });
}
