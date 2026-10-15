"use client";

import { Suspense, type MouseEvent } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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

/**
 * „PL / EN”: the current language is plain text, the other links to the same page in that language,
 * keeping the query string (?temat=, catalog filters) and the hash.
 * useSearchParams needs a Suspense boundary on prerendered pages; the fallback is the same switcher without
 * the query, so the static HTML still links to the right page.
 */
export function LocaleSwitcher(props: LocaleSwitcherProps) {
  return (
    <Suspense fallback={<Switcher {...props} search="" />}>
      <SwitcherWithQuery {...props} />
    </Suspense>
  );
}

function SwitcherWithQuery(props: LocaleSwitcherProps) {
  const search = useSearchParams()?.toString() ?? "";
  return <Switcher {...props} search={search} />;
}

function Switcher({ locale, label, names, tone = "paper", className, search }: LocaleSwitcherProps & { search: string }) {
  const pathname = usePathname() ?? `/${locale}`;
  const router = useRouter();
  const muted = tone === "ink" ? "text-ink-subtle" : "text-ink-muted";
  const strong = tone === "ink" ? "text-paper" : "text-ink";

  // The hash is never seen by the server and next/link changes it without an event, so read it on click.
  const withHash = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    const hash = window.location.hash;
    if (!hash || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    router.push(`${href}${hash}`);
  };

  return (
    <nav aria-label={label} className={cn("text-small", muted, className)}>
      <ul className="m-0 flex list-none items-baseline gap-1.5 p-0">
        {locales.map((l, i) => {
          const href = switchLocalePath(pathname, l, search);
          return (
            <li key={l} className="flex items-baseline gap-1.5">
              {i > 0 ? <span aria-hidden>/</span> : null}
              {l === locale ? (
                <span aria-current="true" className={strong} lang={l} title={names[l]}>
                  <span aria-hidden>{l.toUpperCase()}</span>
                  <span className="sr-only">{names[l]}</span>
                </span>
              ) : (
                <Link
                  href={href}
                  onClick={(e) => withHash(e, href)}
                  hrefLang={l}
                  lang={l}
                  className={cn("no-underline transition-colors", tone === "ink" ? "hover:text-paper" : "hover:text-burgundy")}
                >
                  <span aria-hidden>{l.toUpperCase()}</span>
                  <span className="sr-only">{names[l]}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
