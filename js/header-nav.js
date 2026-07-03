import { qs, qsa } from "./utils.js";

// Toggles the mobile section-nav dropdown from the hamburger button. The
// desktop inline nav (.site-header__nav) needs no JS — it's just anchor
// links relying on the site-wide smooth-scroll + scroll-margin-top.
export function initHeaderNav() {
  const toggle = qs("#site-header-menu-toggle");
  const panel = qs("#site-header-mobile-nav");
  if (!toggle || !panel) return;

  function close() {
    panel.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
  }

  function open() {
    panel.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) open();
    else close();
  });

  qsa("a", panel).forEach((link) => link.addEventListener("click", close));

  document.addEventListener("click", (event) => {
    if (!toggle.contains(event.target) && !panel.contains(event.target)) close();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") close();
  });
}
