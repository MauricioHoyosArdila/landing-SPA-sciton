import { FORM_ENDPOINT_URL } from "../config.js";
import { qs } from "./utils.js";

const REQUIRED_FIELDS = [
  { id: "full-name", message: "Please enter your full name." },
  {
    id: "phone",
    message: "Please enter a valid phone number.",
    validate: (value) => /^[0-9 ()+-]{7,}$/.test(value),
  },
  { id: "email", message: "Please enter a valid email address." },
];

const REQUIRED_CHECKBOXES = [{ id: "consent", message: "Please agree to be contacted to continue." }];

export function initConsultForm() {
  const form = qs("#consult-form-element");
  if (!form) return;
  const statusEl = qs("#form-status");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    clearErrors(form);

    let firstInvalidField = null;

    REQUIRED_FIELDS.forEach(({ id, message, validate }) => {
      const field = qs(`#${id}`, form);
      const errorEl = qs(`#${id}-error`);
      const value = field.value.trim();
      const isValid = value !== "" && field.checkValidity() && (!validate || validate(value));

      if (!isValid) {
        field.setAttribute("aria-invalid", "true");
        field.classList.add("is-invalid");
        if (errorEl) errorEl.textContent = message;
        firstInvalidField = firstInvalidField || field;
      }
    });

    REQUIRED_CHECKBOXES.forEach(({ id, message }) => {
      const field = qs(`#${id}`, form);
      const errorEl = qs(`#${id}-error`);

      if (!field.checked) {
        field.setAttribute("aria-invalid", "true");
        field.classList.add("is-invalid");
        if (errorEl) errorEl.textContent = message;
        firstInvalidField = firstInvalidField || field;
      }
    });

    if (firstInvalidField) {
      firstInvalidField.focus();
      statusEl.textContent = "";
      return;
    }

    submitForm(new FormData(form), statusEl);
  });
}

function clearErrors(form) {
  [...REQUIRED_FIELDS, ...REQUIRED_CHECKBOXES].forEach(({ id }) => {
    const field = qs(`#${id}`, form);
    const errorEl = qs(`#${id}-error`);
    field.removeAttribute("aria-invalid");
    field.classList.remove("is-invalid");
    if (errorEl) errorEl.textContent = "";
  });
}

// mainConcern/treatmentArea are chip checkboxes that share one name each, so a
// patient can pick several — Object.fromEntries would silently keep only the
// last one checked. getAll() collects every checked value into an array.
const MULTI_VALUE_FIELDS = ["mainConcern", "treatmentArea"];

async function submitForm(formData, statusEl) {
  const payload = Object.fromEntries(formData.entries());
  MULTI_VALUE_FIELDS.forEach((name) => {
    payload[name] = formData.getAll(name);
  });

  // No webhook configured yet: skip the network call so the team can demo
  // and test the full flow before the real endpoint exists (see config.js).
  if (!FORM_ENDPOINT_URL) {
    console.info("[consult-form] FORM_ENDPOINT_URL is not set yet — skipping submission.", payload);
    goToThankYou(statusEl);
    return;
  }

  try {
    await fetch(FORM_ENDPOINT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    // A failed promo-lead submission should still resolve to a friendly
    // confirmation (with a phone-call fallback) rather than block the user.
    console.error("[consult-form] submission failed:", error);
  }

  goToThankYou(statusEl);
}

function goToThankYou(statusEl) {
  if (statusEl) statusEl.textContent = "Thank you — redirecting...";
  window.setTimeout(() => {
    window.location.href = "thank-you.html";
  }, 500);
}
