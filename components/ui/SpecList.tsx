import type { ReactNode } from "react";
import { cn } from "./cn";

export interface SpecRow {
  label: string;
  value: ReactNode;
  /** Headline value of the datasheet (e.g. „do 3500°C”): larger, burgundy. Use once per list. */
  emphasis?: boolean;
  /** The value is prose or a link, not a measurement: render it in the text face, not mono. */
  text?: boolean;
}

export interface SpecListProps {
  /** Plain strings (content `specs`) render as a single mono column; rows render label + value. */
  items: Array<string | SpecRow>;
  /** steel: hairlines tuned for steel-wash fields. */
  tone?: "paper" | "steel";
  /** Strong ink line on top (datasheet aside) instead of a hairline. */
  topRule?: "ink" | "hair" | "none";
  className?: string;
}

/** Datasheet list: hairline rows, values in JetBrains Mono with tabular figures. */
export function SpecList({ items, tone = "paper", topRule = "hair", className }: SpecListProps) {
  if (items.length === 0) return null;
  const line = tone === "steel" ? "border-rule-steel" : "border-rule";
  return (
    <ul
      className={cn(
        "m-0 list-none p-0",
        topRule === "ink" && "border-t border-ink",
        topRule === "hair" && cn("border-t", line),
        className,
      )}
    >
      {items.map((item, i) => {
        const row: SpecRow = typeof item === "string" ? { label: "", value: item } : item;
        const valueCls = row.text
          ? "text-ui"
          : cn("spec", row.emphasis ? "text-[1.375rem] leading-tight text-burgundy" : "text-ink");
        return (
          <li
            key={typeof item === "string" ? item : `${row.label}-${i}`}
            className={cn(
              "grid gap-0.5 border-b py-[11px] text-ui",
              line,
              row.label && "sm:grid-cols-[11em_1fr] sm:gap-4",
            )}
          >
            {row.label ? <span className="text-ink-muted">{row.label}</span> : null}
            <span className={valueCls}>{row.value}</span>
          </li>
        );
      })}
    </ul>
  );
}

/** Inline technical value (counts, units) in steel mono, e.g. „5 aparatów”. */
export function Spec({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("spec whitespace-nowrap text-steel", className)}>{children}</span>;
}
