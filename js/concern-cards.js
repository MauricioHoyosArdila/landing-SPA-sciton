import { qsa } from "./utils.js";

// The circular media area already reveals its overlay on CSS :hover/:focus-within
// (see css/sections.css .concern-card__media-wrap). This adds the tap/keyboard
// path: click toggles aria-expanded, and Enter/Space activate it like a real
// button, since it's a plain div (a real <button> can't contain the overlay's
// "Learn more" link — buttons can't nest interactive content).
export function initConcernCards(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;

  const triggers = qsa(".concern-card__media-wrap", container);

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const isOpen = trigger.getAttribute("aria-expanded") === "true";
      trigger.setAttribute("aria-expanded", String(!isOpen));
    });

    trigger.addEventListener("keydown", (event) => {
      if (event.target !== trigger) return;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        trigger.click();
      }
    });
  });
}
