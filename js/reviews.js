import { qs } from "./utils.js";

// Add/edit reviews here — each renders as one card in the scroll-snap track.
// Sourced verbatim (excerpted) from real Google reviews:
// https://share.google/LsTwxgFKCOGCyqJ2a
const REVIEWS = [
  {
    quote:
      "My wife also had a facial treatment, and she says it's the best she's ever had. Her skin looks and feels smoother, more hydrated, and glowing. She keeps saying she's never felt better about her skin!",
    name: "George Taylor",
    rating: 5,
  },
  {
    quote:
      "Korean “IDOL SKIN” Facial was an amazing experience. Marcela has the best hands — skilled, gentle, and precise. The facility was spotless, organized, and highly professional. You can truly see the pride and dedication they put into their work.",
    name: "Eddie Escalante",
    rating: 5,
  },
  {
    quote:
      "Regenerative Medical Spa is amazing. The place is super clean and the staff couldn't be nicer. Everyone went out of their way to make sure I felt comfortable the whole time. They explained everything as we went which really put me at ease and I learned a lot during my treatment.",
    name: "Darrell Clay Ritchey",
    rating: 5,
  },
];

export function initReviews(trackSelector) {
  const track = qs(trackSelector);
  if (!track) return;

  REVIEWS.forEach((review) => {
    const card = document.createElement("li");
    card.className = "review-card";

    const stars = document.createElement("span");
    stars.className = "review-card__stars";
    stars.setAttribute("role", "img");
    stars.setAttribute("aria-label", `${review.rating} out of 5 stars`);
    stars.textContent = "★".repeat(review.rating);

    const quote = document.createElement("p");
    quote.className = "review-card__quote";
    quote.textContent = `"${review.quote}"`;

    const name = document.createElement("p");
    name.className = "review-card__name";
    name.textContent = review.name;

    card.append(stars, quote, name);
    track.appendChild(card);
  });
}
