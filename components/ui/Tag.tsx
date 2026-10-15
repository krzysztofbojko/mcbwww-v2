import type { ReactNode } from "react";
import { cn } from "./cn";

export interface TagProps {
  children: ReactNode;
  className?: string;
}

/** A quiet marker in steel text, e.g. „Aparat wiodący”. Not a pill, not uppercase. */
export function Tag({ children, className }: TagProps) {
  return <span className={cn("text-small text-steel", className)}>{children}</span>;
}
