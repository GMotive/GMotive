/* Motive shared motion: lightweight, accessible scroll reveals. */
(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const groups = [
    [".section-head", ".section"],
    [".feature-card", ".feature-grid"],
    [".step", ".steps"],
    [".plan-card", ".pricing-container"],
    [".faq", ".faq-list"],
    ["#team article", "#team"],
    [".preview-panel", ".preview-inner"],
    [".stage", "main"],
    [".how", ".stage"],
    [".faq-section", "main"],
    [".cta", "main"]
  ];

  const prepare = () => {
    if (reduceMotion || !("IntersectionObserver" in window)) return;
    document.documentElement.classList.add("motion-ready");

    groups.forEach(([selector]) => {
      document.querySelectorAll(selector).forEach((element, index) => {
        if (element.classList.contains("reveal")) return;
        element.classList.add("reveal");
        element.style.setProperty("--reveal-delay", `${Math.min(index % 6, 5) * 85}ms`);
      });
    });

    document.querySelectorAll(".hero, .pricing-hero").forEach((element) => {
      element.classList.add("hero-motion");
    });

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -48px 0px" });

    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepare, { once: true });
  } else {
    prepare();
  }
})();
