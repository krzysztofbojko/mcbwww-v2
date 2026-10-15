import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "./cn";

export type ButtonVariant = "primary" | "ghost" | "link" | "inverse";

interface CommonProps {
  /** primary: burgundy fill · ghost: 1px ink outline · link: underlined burgundy text · inverse: paper fill on burgundy/ink fields. */
  variant: ButtonVariant;
  /** Trailing arrow for actions that move the visitor forward. */
  arrow?: boolean;
  /** Stretch to the container and push the arrow to the far edge (mobile forms, owner card). */
  block?: boolean;
  className?: string;
  children: ReactNode;
}

export type ButtonProps = CommonProps &
  (
    | { href: string; type?: never; onClick?: never; disabled?: never }
    | { href?: undefined; type?: "button" | "submit" | "reset"; onClick?: () => void; disabled?: boolean }
  );

const base =
  "items-center gap-3 font-sans font-medium text-ui leading-none transition-colors duration-[var(--dur-ui)] ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-55";

const variants: Record<ButtonVariant, string> = {
  primary: "no-underline bg-burgundy text-paper px-[22px] py-[15px] hover:bg-burgundy-deep active:bg-burgundy-deep",
  ghost: "no-underline border border-ink text-ink px-[21px] py-[14px] hover:bg-ink hover:text-paper",
  link: "text-burgundy underline underline-offset-[0.3em] decoration-1 hover:text-burgundy-deep hover:decoration-2",
  inverse: "no-underline bg-paper text-burgundy px-[22px] py-[15px] hover:bg-white",
};

function isInternal(href: string) {
  return href.startsWith("/") && !href.startsWith("//");
}

/**
 * Flat, square, one fill.
 * The base sets `inline-flex`; to hide responsively use a variant (`max-md:hidden`), not plain `hidden`.
 * Renders next/link, <a> (external, mailto:, tel:, #hash) or <button>. */
export function Button(props: ButtonProps) {
  const { variant, arrow, block, className, children } = props;
  const cls = cn(base, variants[variant], block ? "flex w-full justify-between" : "inline-flex", className);
  const content = (
    <>
      {children}
      {arrow ? <ArrowRight aria-hidden className="size-4 shrink-0" strokeWidth={1.5} /> : null}
    </>
  );
  if (props.href !== undefined) {
    if (isInternal(props.href)) {
      return (
        <Link href={props.href} className={cls}>
          {content}
        </Link>
      );
    }
    return (
      <a href={props.href} className={cls}>
        {content}
      </a>
    );
  }
  return (
    <button type={props.type ?? "button"} onClick={props.onClick} disabled={props.disabled} className={cls}>
      {content}
    </button>
  );
}
