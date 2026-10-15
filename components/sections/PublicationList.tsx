"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { Publication } from "@/content/types";
import { plural, type Dictionary, type Locale } from "@/i18n";
import { groupByYear, publicationLink, publicationYears } from "@/lib/publications";
import { cn } from "@/components/ui";

export interface PublicationListProps {
  /** Passed from the server page: client components must not import the @/content barrel. */
  items: Publication[];
  locale: Locale;
  strings: Dictionary["publications"];
}

const PARAM = "rok";

/**
 * Publications grouped by year (newest first) with a year filter.
 * The prerendered HTML lists every year; the filter is a radio group kept in ?rok= (replaceState, shareable).
 */
export function PublicationList({ items, locale, strings: s }: PublicationListProps) {
  const [year, setYear] = useState<number | undefined>(undefined);
  // Radios do nothing before hydration (or without JS), so they start disabled, like the catalog filters.
  const [interactive, setInteractive] = useState(false);
  const years = publicationYears(items);
  const groups = groupByYear(items, year);
  const shown = groups.reduce((n, g) => n + g.items.length, 0);

  useEffect(() => {
    const fromUrl = Number(new URLSearchParams(window.location.search).get(PARAM));
    // Initial filter from a shared link; the URL is only readable after mount (the page is static).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInteractive(true);
    if (years.some((y) => y.year === fromUrl)) setYear(fromUrl);
    // years derive from items, which never change on this page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function choose(next: number | undefined) {
    setYear(next);
    const url = new URL(window.location.href);
    if (next === undefined) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, String(next));
    window.history.replaceState(null, "", url);
  }

  return (
    <div className="grid-12 mt-12 gap-y-10 md:mt-16">
      <fieldset className="col-span-12 m-0 min-w-0 border-0 p-0 md:sticky md:top-24 md:col-span-3 md:self-start">
        <legend className="mb-4 p-0 text-ui font-medium">{s.yearLegend}</legend>
        <ul className="m-0 flex list-none flex-wrap gap-x-6 gap-y-3 p-0 md:flex-col md:gap-3">
          <YearOption disabled={!interactive} checked={year === undefined} onChange={() => choose(undefined)} count={items.length}>
            {s.allYears}
          </YearOption>
          {years.map((y) => (
            <YearOption key={y.year} disabled={!interactive} checked={year === y.year} onChange={() => choose(y.year)} count={y.count}>
              <span className="[font-variant-numeric:lining-nums_tabular-nums]">{y.year}</span>
            </YearOption>
          ))}
        </ul>
        <p className="sr-only" aria-live="polite">
          {s.shown.replace("{n}", plural(s.count, shown, locale))}
        </p>
      </fieldset>

      <div className="col-span-12 md:col-span-9">
        {groups.map((g) => (
          <section key={g.year} aria-labelledby={`rok-${g.year}`} className="not-first:mt-14 md:not-first:mt-20">
            <div className="flex items-baseline justify-between gap-4 border-b border-ink pb-3">
              <h2
                id={`rok-${g.year}`}
                className="m-0 text-display-m [font-feature-settings:'lnum','tnum']"
              >
                {g.year}
              </h2>
              <span className="text-small text-steel">{plural(s.count, g.items.length, locale)}</span>
            </div>
            <ol className="m-0 list-none p-0">
              {g.items.map((p) => (
                <PublicationRow key={p.id} p={p} s={s} />
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}

function PublicationRow({ p, s }: { p: Publication; s: Dictionary["publications"] }) {
  const link = publicationLink(p);
  const metrics = [
    p.impactFactor ? { abbr: s.impactFactor, full: s.impactFactorFull, value: p.impactFactor } : null,
    p.mnisw ? { abbr: s.mnisw, full: s.mniswFull, value: p.mnisw } : null,
  ].filter((m) => m !== null);

  return (
    <li className="grid gap-x-8 gap-y-3 border-b border-rule py-5 md:grid-cols-[1fr_9.5rem]">
      <div>
        <p className="m-0 max-w-[70ch] text-ui">{p.text}</p>
        {link || p.scholarUrl ? (
          <p className="mt-2 mb-0 flex flex-wrap gap-x-5 gap-y-1 text-small">
            {link ? (
              <a
                href={link.href}
                aria-label={
                  link.kind === "doi" ? s.openDoi.replace("{doi}", link.label) : s.openUrl.replace("{host}", link.label)
                }
                className="break-all text-burgundy hover:text-burgundy-deep"
              >
                {link.kind === "doi" ? (
                  <>
                    <span className="text-ink-muted">{s.doi}</span> <span className="spec">{link.label}</span>
                  </>
                ) : (
                  link.label
                )}
              </a>
            ) : null}
            {p.scholarUrl ? (
              <a href={p.scholarUrl} className="text-burgundy hover:text-burgundy-deep">
                {s.scholar}
              </a>
            ) : null}
          </p>
        ) : null}
      </div>
      {metrics.length > 0 ? (
        <dl className="m-0 flex gap-6 md:flex-col md:gap-1">
          {metrics.map((m) => (
            <div key={m.abbr} className="flex items-baseline gap-2 md:justify-between">
              <dt className="text-small text-ink-muted">
                <abbr title={m.full} className="no-underline">
                  {m.abbr}
                </abbr>
              </dt>
              <dd className="spec m-0 text-ink">{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}
    </li>
  );
}

function YearOption({
  disabled,
  checked,
  onChange,
  count,
  children,
}: {
  disabled: boolean;
  checked: boolean;
  onChange: () => void;
  count: number;
  children: ReactNode;
}) {
  return (
    <li>
      <label
        className={cn(
          "grid cursor-pointer grid-cols-[1.25rem_1fr_auto] items-baseline gap-x-2.5 text-ui",
          checked ? "text-burgundy" : "text-ink hover:text-burgundy",
        )}
      >
        <input
          type="radio"
          name={PARAM}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="m-0 size-[15px] translate-y-[2px] cursor-pointer accent-burgundy disabled:cursor-default"
        />
        <span>{children}</span>
        <span className="spec text-small text-ink-muted">{count}</span>
      </label>
    </li>
  );
}
