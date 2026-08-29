"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.04, rootMargin: "80px 0px" }
    );

    const observeAll = () => {
      const elements = document.querySelectorAll(".reveal:not(.in)");
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in or above viewport, immediately reveal
        if (rect.top < window.innerHeight + 120) {
          el.classList.add("in");
        } else {
          observer.observe(el);
        }
      });
    };

    // Run immediately and after next tick for React transitions
    observeAll();
    const timer1 = setTimeout(observeAll, 60);
    const timer2 = setTimeout(observeAll, 250);

    // Also handle browser history back/forward (popstate) and bfcache (pageshow)
    window.addEventListener("popstate", observeAll);
    window.addEventListener("pageshow", observeAll);

    // MutationObserver to automatically catch dynamically rendered or swapped content
    const mutationObserver = new MutationObserver(() => {
      observeAll();
    });
    mutationObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      observer.disconnect();
      mutationObserver.disconnect();
      window.removeEventListener("popstate", observeAll);
      window.removeEventListener("pageshow", observeAll);
    };
  }, [pathname]);

  return null;
}
