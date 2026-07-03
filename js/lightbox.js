import { qsa } from "./utils.js";

// Builds one shared lightbox overlay and wires every .ba-slide__zoom button
// to open it with that slide's full image. Closes on backdrop click, the
// close button, or Escape; restores focus to the button that opened it.
export function initLightbox(triggerSelector) {
  const triggers = qsa(triggerSelector);
  if (!triggers.length) return;

  const overlay = document.createElement("div");
  overlay.className = "lightbox";
  overlay.hidden = true;
  overlay.innerHTML = `
    <button type="button" class="lightbox__close" aria-label="Close zoomed photo">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
    </button>
    <img class="lightbox__img" src="" alt="" />
  `;
  document.body.appendChild(overlay);

  const imgEl = overlay.querySelector(".lightbox__img");
  const closeBtn = overlay.querySelector(".lightbox__close");
  let lastTrigger = null;

  function open(trigger) {
    const img = trigger.closest(".ba-slide__img")?.querySelector("img");
    if (!img) return;
    lastTrigger = trigger;
    imgEl.src = img.currentSrc || img.src;
    imgEl.alt = img.alt;
    overlay.hidden = false;
    document.body.classList.add("lightbox-open");
    closeBtn.focus();
  }

  function close() {
    overlay.hidden = true;
    imgEl.src = "";
    document.body.classList.remove("lightbox-open");
    lastTrigger?.focus();
  }

  triggers.forEach((trigger) => trigger.addEventListener("click", () => open(trigger)));
  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) close();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.hidden) close();
  });
}
