/* Motive motion engine — native browser APIs only; no libraries. */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const revealGroups = [
    ".hero-content", ".hero-actions", ".hero-note", ".mini-preview",
    ".section-head", ".feature-card", ".step", ".plan-card",
    ".faq", ".faq-item", ".how-step", ".stage", ".picture", ".how",
    "#team > h1", "#team > p", "#team article", ".preview-panel",
    ".faq-section", ".cta", ".pricing-container", ".pricing-hero",
    ".footer"
  ].join(",");
  const tiltTargets = ".feature-card, .step, .plan-card, #team article, .preview-panel, .tile, .how";
  let revealObserver;
  let mutationObserver;
  let resizeObserver;
  let scrollQueued = false;

  const addProgressBar = () => {
    if (document.querySelector(".scroll-progress")) return;
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.append(bar);
  };

  const updateScrollState = () => {
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
    root.style.setProperty("--scroll-progress", progress.toFixed(4));
    document.querySelector(".nav")?.classList.toggle("is-scrolled", window.scrollY > 18);
    scrollQueued = false;
  };

  const queueScrollUpdate = () => {
    if (scrollQueued) return;
    scrollQueued = true;
    window.requestAnimationFrame(updateScrollState);
  };

  const decorate = (element, index = 0) => {
    if (!(element instanceof HTMLElement)) return;
    if (element.matches(tiltTargets) && !element.classList.contains("motion-tilt")) {
      element.classList.add("motion-tilt");
    }
    if (element.matches(revealGroups) && !element.classList.contains("reveal")) {
      element.classList.add("reveal");
      element.style.setProperty("--reveal-delay", `${Math.min(index % 5, 4) * 75}ms`);
      if (revealObserver) revealObserver.observe(element);
    }
  };

  const prepare = () => {
    addProgressBar();
    updateScrollState();
    window.addEventListener("scroll", queueScrollUpdate, { passive: true });
    window.addEventListener("resize", queueScrollUpdate, { passive: true });

    if (reduceMotion.matches) return;

    if ("IntersectionObserver" in window) {
      root.classList.add("motion-ready");
      revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -42px 0px" });
    }

    document.querySelectorAll(revealGroups).forEach((element, index) => decorate(element, index));
    document.querySelectorAll(tiltTargets).forEach((element) => decorate(element));

    /* MutationObserver catches FAQ content and other UI added after initial load. */
    if ("MutationObserver" in window) {
      mutationObserver = new MutationObserver((records) => {
        records.forEach((record) => {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            decorate(node);
            node.querySelectorAll?.(revealGroups).forEach((element, index) => decorate(element, index));
            node.querySelectorAll?.(tiltTargets).forEach((element) => decorate(element));
          });
        });
      });
      mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    /* ResizeObserver refreshes scroll progress when content height changes. */
    if ("ResizeObserver" in window) {
      resizeObserver = new ResizeObserver(queueScrollUpdate);
      resizeObserver.observe(document.body);
    }

    /* Pointer spotlight and restrained 3D tilt on fine-pointer devices. */
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      document.addEventListener("pointermove", (event) => {
        root.style.setProperty("--pointer-x", `${event.clientX}px`);
        root.style.setProperty("--pointer-y", `${event.clientY}px`);
        const card = event.target.closest?.(".motion-tilt");
        if (!card) return;
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty("--card-x", `${x * 100}%`);
        card.style.setProperty("--card-y", `${y * 100}%`);
        card.style.setProperty("--tilt-y", `${(x - .5) * 5}deg`);
        card.style.setProperty("--tilt-x", `${(.5 - y) * 5}deg`);
      }, { passive: true });
      document.addEventListener("pointerout", (event) => {
        const card = event.target.closest?.(".motion-tilt");
        if (card && !card.contains(event.relatedTarget)) {
          card.style.setProperty("--tilt-x", "0deg");
          card.style.setProperty("--tilt-y", "0deg");
        }
      });
    }


  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", prepare, { once: true });
  } else {
    prepare();
  }

  reduceMotion.addEventListener?.("change", (event) => {
    if (event.matches) {
      root.classList.remove("motion-ready");
      document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
      revealObserver?.disconnect();
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
    }
  });
})();
