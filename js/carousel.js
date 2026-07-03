import { qsa } from "./utils.js";

// Lightweight scroll-snap carousel controller (dots + arrows + keyboard).
// The track itself is plain CSS scroll-snap (see components.css), so the
// carousel stays fully usable by scroll/swipe/keyboard even if this script
// fails to load — this only adds the dot/arrow affordances on top. Dots are
// optional: omit dotsContainer for a carousel that only needs arrows.
export function initCarousel({ root, track, prevBtn, nextBtn, dotsContainer, stepMode = "item" }) {
  const rootEl = document.querySelector(root);
  const trackEl = document.querySelector(track);
  if (!rootEl || !trackEl) return;

  const slides = qsa(":scope > *", trackEl);
  const dotsEl = dotsContainer ? document.querySelector(dotsContainer) : null;
  let dots = [];

  if (dotsEl) {
    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "ba-carousel__dot";
      dot.setAttribute("role", "tab");
      dot.setAttribute("aria-label", `Go to result ${i + 1} of ${slides.length}`);
      dot.addEventListener("click", () => goTo(i));
      dotsEl.appendChild(dot);
    });
    dots = qsa(".ba-carousel__dot", dotsEl);
  }

  function setActive(index) {
    dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
  }

  // Jump straight to a specific slide (used by dot clicks).
  function goTo(index) {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    slides[clamped].scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }

  // Step by one slide's width (used by prev/next arrows and keyboard). Centering
  // on activeIndex ± 1 like goTo() falls apart when several slides are visible
  // at once (e.g. a 3-up carousel): the "next" slide can already be centered,
  // so nothing scrolls. Stepping by a measured pixel distance always moves.
  //
  // stepMode "page" instead advances by the track's own visible width, so a
  // carousel showing N slides at once pages to a fresh set of N rather than
  // shifting by a single slide and leaving overlap from the previous view.
  //
  // Both directions loop: at the last slide, "next" wraps smoothly back to
  // the start instead of going inert against the scroll boundary, and "prev"
  // at the first slide wraps to the end. A small EDGE_TOLERANCE absorbs
  // sub-pixel scroll-snap rounding so the edge check is reliable.
  const EDGE_TOLERANCE = 4;

  function step(direction) {
    if (slides.length < 2) return;

    const maxScrollLeft = trackEl.scrollWidth - trackEl.clientWidth;

    if (direction > 0 && trackEl.scrollLeft >= maxScrollLeft - EDGE_TOLERANCE) {
      trackEl.scrollTo({ left: 0, behavior: "smooth" });
      return;
    }
    if (direction < 0 && trackEl.scrollLeft <= EDGE_TOLERANCE) {
      trackEl.scrollTo({ left: maxScrollLeft, behavior: "smooth" });
      return;
    }

    if (stepMode === "page") {
      trackEl.scrollBy({ left: direction * trackEl.clientWidth, behavior: "smooth" });
      return;
    }
    const a = slides[0].getBoundingClientRect();
    const b = slides[1].getBoundingClientRect();
    trackEl.scrollBy({ left: direction * (b.left - a.left), behavior: "smooth" });
  }

  document.querySelector(prevBtn)?.addEventListener("click", () => step(-1));
  document.querySelector(nextBtn)?.addEventListener("click", () => step(1));

  if (dotsEl) {
    // Tracks whichever slide sits closest to the track's own center on every
    // scroll frame. Works regardless of how many slides are visible at once
    // (1-up, 2-up, 3-up) — e.g. in a 3-up view this picks the middle card, not
    // whichever fully-visible card happens to be leftmost. An IntersectionObserver
    // threshold can't make that distinction (several slides are 100% visible at
    // once) and only fires on crossings, missing updates entirely when slides
    // never leave view during a scroll.
    const updateActiveFromScroll = () => {
      const trackRect = trackEl.getBoundingClientRect();
      const trackCenter = trackRect.left + trackRect.width / 2;
      let bestIndex = 0;
      let bestDistance = Infinity;
      slides.forEach((slide, i) => {
        const rect = slide.getBoundingClientRect();
        const slideCenter = rect.left + rect.width / 2;
        const distance = Math.abs(slideCenter - trackCenter);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = i;
        }
      });
      setActive(bestIndex);
    };

    let scrollRaf = null;
    trackEl.addEventListener(
      "scroll",
      () => {
        if (scrollRaf) cancelAnimationFrame(scrollRaf);
        scrollRaf = requestAnimationFrame(updateActiveFromScroll);
      },
      { passive: true }
    );

    setActive(0);
  }

  rootEl.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
  });
}
