import { initScrollReveal } from "./scroll-reveal.js";
import { initAccordion } from "./accordion.js";
import { initCarousel } from "./carousel.js";
import { initConcernCards } from "./concern-cards.js";
import { initSkinLayers } from "./skin-layers.js";
import { initStickyNav } from "./nav-sticky.js";
import { initAnnouncementBar } from "./announcement-bar.js";
import { initConsultForm } from "./form-validation.js";

initScrollReveal();
initAccordion("#faq-accordion");
initCarousel({
  root: "#concerns-carousel",
  track: "#concerns-carousel-track",
  prevBtn: "#concerns-prev",
  nextBtn: "#concerns-next",
  dotsContainer: "#concerns-dots",
});
initConcernCards("#concerns-carousel-track");
initSkinLayers("#skin-layers");
initCarousel({
  root: "#ba-carousel",
  track: "#ba-carousel-track",
  prevBtn: "#ba-prev",
  nextBtn: "#ba-next",
});
initStickyNav();
initAnnouncementBar();
initConsultForm();
