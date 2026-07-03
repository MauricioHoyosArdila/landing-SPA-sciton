import { initScrollReveal } from "./scroll-reveal.js";
import { initAccordion } from "./accordion.js";
import { initCarousel } from "./carousel.js";
import { initConcernCards } from "./concern-cards.js";
import { initSkinLayers } from "./skin-layers.js";
import { initReviews } from "./reviews.js";
import { initStickyNav } from "./nav-sticky.js";
import { initAnnouncementBar } from "./announcement-bar.js";
import { initConsultForm } from "./form-validation.js";
import { initMultiselects } from "./multiselect.js";
import { initHeaderNav } from "./header-nav.js";
import { initLightbox } from "./lightbox.js";

initScrollReveal();
initAccordion("#faq-accordion");
initCarousel({
  root: "#concerns-carousel",
  track: "#concerns-carousel-track",
  prevBtn: "#concerns-prev",
  nextBtn: "#concerns-next",
});
initConcernCards("#concerns-carousel-track");
initSkinLayers("#skin-layers");
initCarousel({
  root: "#ba-carousel",
  track: "#ba-carousel-track",
  prevBtn: "#ba-prev",
  nextBtn: "#ba-next",
  stepMode: "page",
});
initReviews("#reviews-track");
initStickyNav();
initAnnouncementBar();
initConsultForm();
initMultiselects();
initHeaderNav();
initLightbox(".ba-slide__zoom");
