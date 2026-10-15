import type { ElementType, ReactNode } from "react";
import { cn } from "./cn";

export interface ContainerProps {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

/** Site measure: 1440px max, fluid gutter (16–40px). */
export function Container({ as: Tag = "div", className, children }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-site px-gutter", className)}>{children}</Tag>;
}
