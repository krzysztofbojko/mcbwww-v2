"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "./cn";

export interface RevealProps {
  children: ReactNode;
  /** Seconds before the (first) item rises. */
  delay?: number;
  /**
   * Stagger the content instead of moving the wrapper as one block: the items are the wrapper's children
   * (descending through single-child wrappers such as one `grid-12`), 75 ms apart.
   */
  stagger?: boolean;
  className?: string;
}

// Native Web Animations API + IntersectionObserver: no animation library ships to the client.
const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";
/** Seconds. */
const DURATION = 0.7;
const RISE = "translateY(18px)";
/** 75 ms between items (direction.md: 60–90 ms); items after the 6th share the last delay so long lists do not lag. */
const STEP = 0.075;
const MAX_STEPS = 6;
/** Marks an element that is hidden until it is revealed; globals.css shows it in print. */
const PENDING = "revealPending";

/** The items of one section entrance: the children of the first element that has more than one child. */
export function revealTargets(root: HTMLElement): HTMLElement[] {
  let el: Element = root;
  for (let depth = 0; depth < 4 && el.childElementCount === 1 && el.tagName !== "TABLE"; depth++) {
    el = el.firstElementChild!;
  }
  if (el.tagName === "TABLE" || el.childElementCount === 0) return [el as HTMLElement];
  return Array.from(el.children).filter((c): c is HTMLElement => c instanceof HTMLElement);
}

/**
 * One calm entrance per section: rise 18px + fade, 700ms, once; with `stagger` the items follow 75 ms apart.
 * The server-rendered state is fully visible, so content never depends on JS (and no-JS shows it immediately).
 * Only content that starts below the first screen is hidden (off-screen, so no flash) and then revealed.
 * With prefers-reduced-motion: reduce nothing is touched. Inline styles are removed after the entrance, so the
 * items do not keep a transform (which would break sticky/fixed children).
 */
export function Reveal({ children, delay = 0, stagger = false, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (root.getBoundingClientRect().top < window.innerHeight) return;

    const items = stagger ? revealTargets(root) : [root];
    const reset = (el: HTMLElement) => {
      el.style.opacity = "";
      el.style.transform = "";
      delete el.dataset[PENDING];
    };
    for (const el of items) {
      el.dataset[PENDING] = "";
      el.style.opacity = "0";
      el.style.transform = RISE;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        // Once: stop observing before the entrance starts.
        observer.disconnect();
        items.forEach((el, i) => {
          const animation = el.animate(
            [
              { opacity: 0, transform: RISE },
              { opacity: 1, transform: "translateY(0px)" },
            ],
            {
              duration: DURATION * 1000,
              delay: (delay + Math.min(i, MAX_STEPS) * STEP) * 1000,
              easing: EASE,
              // Hold the end state until the inline styles are cleared, then drop the animation: no flash, no transform left.
              fill: "forwards",
            },
          );
          animation.onfinish = () => {
            reset(el);
            animation.cancel();
          };
        });
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(root);
    return () => {
      observer.disconnect();
      items.forEach(reset);
    };
  }, [delay, stagger]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
