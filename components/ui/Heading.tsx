import type { ReactNode } from "react";
import { cn } from "./cn";

export type HeadingSize = "xl" | "l" | "m" | "s";

export interface HeadingProps {
  as: "h1" | "h2" | "h3" | "h4" | "p";
  /** xl: home H1 only · l: page H1 · m: section H2 · s: H3 in index rows and datasheets. */
  size: HeadingSize;
  id?: string;
  className?: string;
  children: ReactNode;
}

const sizes: Record<HeadingSize, string> = {
  xl: "text-display-xl",
  l: "text-display-l",
  m: "text-display-m",
  s: "text-display-s",
};

/** Brygada 1918, weight 500, balanced. No eyebrow, no italic, no colour accent inside. */
export function Heading({ as: Tag, size, id, className, children }: HeadingProps) {
  return (
    <Tag id={id} className={cn("font-display font-medium text-balance", sizes[size], className)}>
      {children}
    </Tag>
  );
}
