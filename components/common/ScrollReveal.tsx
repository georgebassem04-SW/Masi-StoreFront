/**
 * SCROLL REVEAL — things rise into place as they come onto the screen (like the MASI reference).
 * ------------------------------------------------------------------
 * Inside every page block (SectionRenderer.tsx marks them with data-reveal-scope), this tags:
 *   - titles and texts (h1–h3, p) · pictures · list items (store cards, features…) · CTA links
 *   - product cards (ProductCard.tsx marks them data-reveal="card"), anywhere on the page
 * Mode "blocks" (dashboard) tags the whole block instead.
 * Each element gets "is-in" once, at about 15% visible. Elements of the same group get --i (0, 1, 2…)
 * so each lands just after the one before. New content (next page, more results) is picked up too.
 * The look (distance, duration, stagger) is in app/globals.css → "SCROLL REVEAL", values from
 * dashboard → Theme & design → Layout → Motion. Visitors who ask for less motion see everything at rest.
 */
"use client";

import { useEffect } from "react";

/** What rises on its own inside a block */
const TARGETS = "h1, h2, h3, p, img, video, li, a.link-line";

export function ScrollReveal({ mode = "elements" }: { mode?: "elements" | "blocks" }) {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      root.classList.remove("reveal-ready");
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -5% 0px" },
    );

    /** Position among the tagged elements of the same parent (restarts every 8) */
    const stagger = (el: HTMLElement) => {
      const parent = el.parentElement;
      if (!parent) return;
      const cell = el.dataset.reveal === "card" && parent.children.length === 1 ? parent : el;
      const group = cell.parentElement ? Array.from(cell.parentElement.children) : [cell];
      el.style.setProperty("--i", String(Math.max(0, group.indexOf(cell)) % 8));
    };

    const tagScope = (scope: HTMLElement) => {
      if (scope.hasAttribute("data-reveal-tagged")) return;
      scope.setAttribute("data-reveal-tagged", "");
      if (mode === "blocks") {
        scope.setAttribute("data-reveal", "block");
        return;
      }
      scope.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
        // Not inside something that already rises (a card, a store card…), and not empty helpers
        if (el.parentElement?.closest("[data-reveal]") || el.closest("nav, form, button, [role=tablist]")) return;
        if (el.tagName === "LI" && el.querySelector('[data-reveal="card"]')) return;
        el.setAttribute("data-reveal", "item");
      });
    };

    // Elements this run is watching. (A Set per run, not a mark on the page: React may run this setup
    // twice in development, and the second run must watch everything again.)
    const watched = new WeakSet<Element>();
    const watch = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal-scope]").forEach(tagScope);
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)").forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        stagger(el);
        io.observe(el);
      });
    };
    watch();
    // (also set by a small script in the page head, so nothing flashes before this runs)
    root.classList.add("reveal-ready");

    // Pages change without a reload in Next.js: watch for new blocks and cards
    const mo = new MutationObserver(() => watch());
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [mode]);

  return null;
}
