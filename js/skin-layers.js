import { qs, qsa, prefersReducedMotion } from "./utils.js";

const CONTENT = {
  smooth: "Refines texture and softens the look of rough, uneven skin.",
  brighten: "Targets discoloration and uneven tone for a clearer look.",
  renew: "Supports deeper skin quality for a healthier, more radiant complexion.",
};

// Markers on the illustration and the tabs on the right control the same
// state — either one updates both, plus the description panel, which
// crossfades instead of swapping text abruptly.
export function initSkinLayers(rootSelector) {
  const root = qs(rootSelector);
  if (!root) return;

  const markers = qsa(".skin-layers__marker", root);
  const tabs = qsa(".skin-layers__tab", root);
  const panel = qs(".skin-layers__panel", root);
  const panelText = panel?.querySelector("p");
  if (!panel || !panelText) return;

  let current = "smooth";

  function activate(key) {
    if (key === current || !CONTENT[key]) return;
    current = key;

    markers.forEach((marker) => marker.setAttribute("aria-pressed", String(marker.dataset.target === key)));

    let activeTab = null;
    tabs.forEach((tab) => {
      const isActive = tab.dataset.target === key;
      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      if (isActive) activeTab = tab;
    });
    if (activeTab) panel.setAttribute("aria-labelledby", activeTab.id);

    if (prefersReducedMotion()) {
      panelText.textContent = CONTENT[key];
      return;
    }

    const swapText = (event) => {
      if (event.target !== panelText || event.propertyName !== "opacity") return;
      panelText.textContent = CONTENT[key];
      panel.classList.remove("is-fading");
      panel.removeEventListener("transitionend", swapText);
    };
    panel.addEventListener("transitionend", swapText);
    panel.classList.add("is-fading");
  }

  [...markers, ...tabs].forEach((el) => {
    el.addEventListener("click", () => activate(el.dataset.target));
  });
}
