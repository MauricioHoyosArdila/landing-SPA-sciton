// Single source of truth for public, client-safe constants. The Zapier
// webhook URL lives server-side only (ZAPIER_WEBHOOK_URL env var, read by
// api/submit-lead.js) so it's never shipped to the browser.

// reCAPTCHA v3 site key (public by design -- safe to hardcode client-side).
// Must match the render= query param on the reCAPTCHA <script> tag in index.html.
export const RECAPTCHA_SITE_KEY = "6LcASKosAAAAAAnY1h8C4i_TNIXBxBG0m6BRmM2K";

export const CONTACT = {
  phone: "4077305600",
  phoneDisplay: "407.730.5600",
  address: "10920 Moss Park Rd. Suite 218, Orlando, FL 32832",
};
