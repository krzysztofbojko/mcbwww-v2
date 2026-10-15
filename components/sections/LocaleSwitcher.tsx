"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/i18n";
import { cn } from "@/components/ui";

export interface LocaleSwitcherProps {
  locale: Locale;
  /** Accessible name of the group, e.g. „Zmień język”. */
  label: string;
  /** Full language names, used as accessible names of the PL / EN codes. */
  names: Record<Locale, string>;
  /** paper: header and menu · ink: footer (lighter muted tone). */
  tone?: "paper" | "ink";
  className?: string;
}

/** „PL / EN”: the current language is plain text, the other links to the same page in that language. */
export function LocaleSwitcher({ locale, label, names, tone = "paper", className }: LocaleSwitcherProps) {
  const pathname = usePathname() ?? `/${locale}`;
  const muted = tone === "ink" ? "text-ink-subtle" : "text-ink-muted";
  const strong = tone === "ink" ? "text-paper" : "text-ink";
  return (
    <nav aria-label={label} className={cn("text-small", muted, className)}>
      <ul className="m-0 flex list-none items-baseline gap-1.5 p-0">
        {locales.map((l, i) => (
          <li key={l} className="flex items-baseline gap-1.5">
            {i > 0 ? <span aria-hidden>/</span> : null}
            {l === locale ? (
              <span aria-current="true" className={strong} lang={l} title={names[l]}>
                <span aria-hidden>{l.toUpperCase()}</span>
                <span className="sr-only">{names[l]}</span>
              </span>
            ) : (
              <Link
                href={switchLocalePath(pathname, l)}
                hrefLang={l}
                lang={l}
                className={cn("no-underline transition-colors", tone === "ink" ? "hover:text-paper" : "hover:text-burgundy")}
              >
                <span aria-hidden>{l.toUpperCase()}</span>
                <span className="sr-only">{names[l]}</span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
