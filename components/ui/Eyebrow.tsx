import type { ReactNode } from "react";
import { cn } from "./cn";

export interface EyebrowProps {
  /** Cluster numeral, e.g. "01". It is the cluster's id, the one permitted index on the site. */
  number: string;
  /** Cluster name shown after the numeral (breadcrumb style). Omit for the bare index numeral. */
  children?: ReactNode;
  /** inline: breadcrumb / list marker · index: the large numeral heading a cluster row. */
  size?: "inline" | "index";
  className?: string;
}

/**
 * Cluster numeral marker („01 Inżynieria materiałowa i wytwarzanie”).
 * Deliberately NOT a small-caps label above a heading: direction.md bans eyebrows.
 */
export function Eyebrow({ number, children, size = "inline", className }: EyebrowProps) {
  const numeral = (
    <span
      className={cn(
        "font-display font-medium text-burgundy [font-feature-settings:'lnum','tnum']",
        size === "index" ? "block text-[2.75rem] leading-[0.85] md:text-[clamp(3rem,6vw,5.5rem)]" : "text-ui",
      )}
    >
      {number}
    </span>
  );
  if (size === "index" && !children) return <span className={className}>{numeral}</span>;
  return (
    <span className={cn("inline-flex items-baseline gap-2", className)}>
      {numeral}
      {children ? <span>{children}</span> : null}
    </span>
  );
}
