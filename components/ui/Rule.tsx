import { cn } from "./cn";

export interface RuleProps {
  /** ink: the strong top line of a table or index · rule: hairline · steel: hairline on steel-wash. */
  tone?: "ink" | "rule" | "steel";
  className?: string;
}

const tones = { ink: "border-ink", rule: "border-rule", steel: "border-rule-steel" } as const;

/** 1px rule. Use only in tables, indexes and datasheets; sections change tone instead. */
export function Rule({ tone = "rule", className }: RuleProps) {
  return <hr className={cn("m-0 border-0 border-t", tones[tone], className)} />;
}
