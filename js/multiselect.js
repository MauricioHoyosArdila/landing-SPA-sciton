import { qsa } from "./utils.js";

// Custom multi-select dropdown: a closed, single-line trigger (styled like a
// normal <select>) that opens a checkbox panel. A native <select multiple>
// can't do this — it always renders as an open multi-row listbox, never a
// compact closed dropdown — so this reimplements just enough of the pattern
// on top of plain checkboxes (which form-validation.js already reads via
// FormData.getAll, so no submission logic changes).
export function initMultiselects(rootSelector = "[data-multiselect]") {
  qsa(rootSelector).forEach((root) => {
    const trigger = root.querySelector(".multiselect__trigger");
    const summary = root.querySelector("[data-multiselect-summary]");
    const panel = root.querySelector(".multiselect__panel");
    if (!trigger || !summary || !panel) return;

    const placeholder = summary.textContent;
    const checkboxes = qsa('input[type="checkbox"]', panel);

    function updateSummary() {
      const checked = checkboxes.filter((box) => box.checked);
      if (checked.length === 0) {
        summary.textContent = placeholder;
      } else if (checked.length === 1) {
        summary.textContent = checked[0].nextElementSibling.textContent;
      } else {
        summary.textContent = `${checked.length} selected`;
      }
    }

    function open() {
      panel.hidden = false;
      trigger.setAttribute("aria-expanded", "true");
    }

    function close() {
      panel.hidden = true;
      trigger.setAttribute("aria-expanded", "false");
    }

    trigger.addEventListener("click", () => {
      if (panel.hidden) open();
      else close();
    });

    checkboxes.forEach((box) => box.addEventListener("change", updateSummary));

    document.addEventListener("click", (event) => {
      if (!root.contains(event.target)) close();
    });

    root.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        close();
        trigger.focus();
      }
    });

    updateSummary();
  });
}
