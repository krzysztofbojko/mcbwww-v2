"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { animate, inView } from "motion";
import { cn } from "./cn";

export interface RevealProps {
  children: ReactNode;
  /** Seconds before this item rises; stagger siblings by 0.06–0.09. */
  delay?: number;
  className?: string;
}

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * One calm entrance: rise 18px + fade, 700ms, once.
 * The server-rendered state is fully visible, so content never depends on JS.
 * Only elements that start below the fold are hidden (off-screen, so no flash) and then revealed.
 * With prefers-reduced-motion: reduce nothing is touched.
 */
export function Reveal({ children, delay = 0, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.style.opacity = "0";
    el.style.transform = "translateY(18px)";
    const stop = inView(
      el,
      () => {
        animate(el, { opacity: 1, transform: "translateY(0px)" }, { duration: 0.7, delay, ease: EASE }).then(() => {
          // Drop the transform so the wrapper does not create a containing block for sticky/fixed children.
          el.style.transform = "";
        });
      },
      { margin: "0px 0px -8% 0px" },
    );
    return () => {
      stop();
      el.style.opacity = "";
      el.style.transform = "";
    };
  }, [delay]);

  return (
    <div ref={ref} className={cn(className)}>
      {children}
    </div>
  );
}
