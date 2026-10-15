import type { ElementType, ReactNode } from "react";
import { Container } from "./Container";
import { cn } from "./cn";

export type SectionTone = "paper" | "deep" | "steel" | "burgundy" | "ink";
export type SectionSpace = "none" | "default" | "loose";

export interface SectionProps {
  as?: ElementType;
  id?: string;
  /** Sections are separated by a change of ground tone, never by a line. */
  tone?: SectionTone;
  /** Vertical padding: default 64→96px, loose adds 144px at the bottom (closing sections). */
  space?: SectionSpace;
  /** Wrap children in the site Container (default true). Set false for full-bleed content. */
  contained?: boolean;
  className?: string;
  "aria-labelledby"?: string;
  "aria-label"?: string;
  children: ReactNode;
}

const tones: Record<SectionTone, string> = {
  paper: "bg-paper text-ink",
  deep: "bg-paper-deep text-ink",
  steel: "bg-steel-wash text-ink",
  burgundy: "bg-burgundy text-paper",
  ink: "bg-ink text-paper",
};

const spaces: Record<SectionSpace, string> = {
  none: "",
  default: "py-16 md:py-24",
  loose: "pt-16 pb-24 md:pt-24 md:pb-36",
};

export function Section({
  as: Tag = "section",
  id,
  tone = "paper",
  space = "default",
  contained = true,
  className,
  children,
  ...aria
}: SectionProps) {
  return (
    <Tag id={id} data-tone={tone} className={cn(tones[tone], spaces[space], className)} {...aria}>
      {contained ? <Container>{children}</Container> : children}
    </Tag>
  );
}
