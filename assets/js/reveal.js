// Simple reveal on scroll (works on mobile)
(function () {
  const cards = document.querySelectorAll(".programs-showcase.clean .program-card");
  if (!cards.length) return;

  const show = (el) => el.classList.add("is-visible");

  // If IntersectionObserver not supported, just show everything
  if (!("IntersectionObserver" in window)) {
    cards.forEach(show);
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          show(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  cards.forEach((c) => io.observe(c));
})();
/* =========================================
   reveal.js
   - Reveals program cards smoothly on scroll
   - Works on mobile + desktop
   - Respects prefers-reduced-motion
========================================= */

(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Only target your OUR PROGRAMS section cards
  const cards = document.querySelectorAll(".programs-showcase.clean .program-card");
  if (!cards.length) return;

  // Helper to show a card with stagger
  const showCard = (el, delayMs = 0) => {
    el.style.animationDelay = `${delayMs}ms`;
    el.classList.add("is-visible");
  };

  // If reduced motion, show instantly
  if (reduceMotion) {
    cards.forEach((c) => c.classList.add("is-visible"));
    return;
  }

  // Fallback for older browsers
  if (!("IntersectionObserver" in window)) {
    cards.forEach((c, i) => showCard(c, i * 120));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        // Stagger only within this section
        const index = Array.from(cards).indexOf(entry.target);
        showCard(entry.target, Math.max(0, index) * 140);

        io.unobserve(entry.target);
      });
    },
    {
      root: null,
      threshold: 0.22,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  cards.forEach((c) => io.observe(c));

  // If page loads directly on #nqf2 or #nqf5, reveal immediately (nice UX)
  window.addEventListener("load", () => {
    const hash = window.location.hash;
    if (hash === "#nqf2" || hash === "#nqf5") {
      cards.forEach((c, i) => showCard(c, i * 120));
    }
  });
})();
