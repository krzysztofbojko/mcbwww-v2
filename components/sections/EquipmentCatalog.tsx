"use client";

import { useEffect, useId, useRef, useState, type ChangeEvent, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { ArrowRight, Search, X } from "lucide-react";
import {
  clusters,
  equipment,
  filterEquipment,
  getService,
  meaningfulSpecs,
  services,
  servicesByCluster,
  type Equipment,
} from "@/content/equipment";
import { localePath, plural, t, type Dictionary, type Locale } from "@/i18n";
import {
  activeFilterCount,
  catalogSearch,
  emptyFilter,
  flagshipFirst,
  parseCatalogParams,
  PARAM,
  toggleService,
  withCluster,
  type CatalogFilter,
} from "@/lib/catalog";
import { Button, cn } from "@/components/ui";

export interface EquipmentCatalogProps {
  locale: Locale;
  strings: Dictionary["catalog"];
}

const sorted = flagshipFirst(equipment);
const clusterTotal = (id: string) => equipment.filter((e) => e.clusterId === id).length;
const serviceTotal = (slug: string) => equipment.filter((e) => e.serviceSlug === slug).length;

/**
 * Mockup 05. The filter lives in the query string (?klaster=&usluga=&wiodace=1&q=), read with useSearchParams;
 * typing replaces the history entry, a filter click pushes one (Back undoes it).
 * Must sit inside <Suspense fallback={<EquipmentCatalogFallback/>}>: the fallback is the same view with no
 * filter, so the prerendered HTML lists every instrument before (and without) JavaScript.
 */
export function EquipmentCatalog({ locale, strings }: EquipmentCatalogProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const filter = parseCatalogParams(searchParams);

  // The field is local state so typing never waits for the URL; it re-syncs when the URL query changes
  // from elsewhere (Back, „Wyczyść filtry”), using the render-time update pattern instead of an effect.
  const [text, setText] = useState(filter.query);
  const [urlQuery, setUrlQuery] = useState(filter.query);
  if (urlQuery !== filter.query) {
    setUrlQuery(filter.query);
    setText(filter.query);
  }

  const go = (next: CatalogFilter, mode: "push" | "replace") => {
    const url = `${pathname}${catalogSearch(next)}`;
    if (mode === "push") window.history.pushState(null, "", url);
    else window.history.replaceState(null, "", url);
  };

  return (
    <CatalogView
      locale={locale}
      strings={strings}
      filter={{ ...filter, query: text }}
      onQuery={(q) => {
        setText(q);
        go({ ...filter, query: q }, "replace");
      }}
      onFilter={(next) => {
        setText(next.query);
        go(next, "push");
      }}
    />
  );
}

/** Static first paint: the full, unfiltered list (no handlers until hydration). */
export function EquipmentCatalogFallback({ locale, strings }: EquipmentCatalogProps) {
  return <CatalogView locale={locale} strings={strings} filter={emptyFilter} />;
}

function CatalogView({
  locale,
  strings: s,
  filter,
  onQuery,
  onFilter,
}: EquipmentCatalogProps & {
  filter: CatalogFilter;
  onQuery?: (q: string) => void;
  /** A discrete filter change (the filter includes the current query). */
  onFilter?: (f: CatalogFilter) => void;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelId = useId();
  const interactive = onFilter !== undefined;

  // „/” focuses the search field, as hinted next to it.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey) return;
      if (el && (el.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName))) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const results = filterEquipment(sorted, filter);
  const countText = plural(s.items, results.length, locale);

  // The visible count follows every keystroke; screen readers hear it once typing pauses.
  const [announced, setAnnounced] = useState(countText);
  useEffect(() => {
    const id = window.setTimeout(() => setAnnounced(countText), 400);
    return () => window.clearTimeout(id);
  }, [countText]);
  const count = activeFilterCount(filter);
  const hasAny = count > 0 || filter.query.trim() !== "";
  const visibleServices = filter.clusterId ? servicesByCluster(filter.clusterId) : services;
  const cluster = clusters.find((c) => c.id === filter.clusterId);
  const set = (next: CatalogFilter) => onFilter?.(next);
  const clear = () => onFilter?.(emptyFilter);

  const chips: Array<{ key: string; label: ReactNode; name: string; remove: () => void }> = [
    ...(cluster
      ? [
          {
            key: "cluster",
            name: t(cluster.title, locale),
            label: (
              <>
                <span className="text-ink-subtle [font-feature-settings:'lnum','tnum']">{cluster.number}</span>{" "}
                {t(cluster.title, locale)}
              </>
            ),
            remove: () => set(withCluster(filter, undefined)),
          },
        ]
      : []),
    ...filter.serviceSlugs.map((slug) => {
      const name = t(getService(slug)!.title, locale);
      return { key: slug, name, label: name, remove: () => set(toggleService(filter, slug)) };
    }),
    ...(filter.flagshipOnly
      ? [{ key: "flagship", name: s.flagshipOnly, label: s.flagshipOnly, remove: () => set({ ...filter, flagshipOnly: false }) }]
      : []),
  ];

  return (
    <form
      action={localePath(locale, "/infrastruktura")}
      method="get"
      onSubmit={(e) => {
        if (interactive) e.preventDefault();
      }}
    >
      {/* Search: the large serif field across the page. */}
      <div className="mt-10 flex items-center gap-4 border-b border-ink pb-3 transition-[border-color,box-shadow] focus-within:border-burgundy focus-within:shadow-[inset_0_-1px_0_var(--color-burgundy)] md:mt-14 md:gap-5 md:pb-5">
        <Search aria-hidden className="size-5 shrink-0 text-ink" strokeWidth={1.5} />
        <label htmlFor="catalog-q" className="sr-only">
          {s.searchLabel}
        </label>
        <input
          ref={searchRef}
          id="catalog-q"
          name={PARAM.query}
          type="search"
          autoComplete="off"
          spellCheck={false}
          enterKeyHint="search"
          placeholder={s.searchPlaceholder}
          value={filter.query}
          onChange={(e: ChangeEvent<HTMLInputElement>) => onQuery?.(e.target.value)}
          readOnly={!interactive}
          className="min-w-0 flex-1 bg-transparent font-display text-[1.125rem] leading-tight text-ink outline-none placeholder:text-ink-muted md:text-[clamp(1.375rem,2vw,1.75rem)] [&::-webkit-search-cancel-button]:hidden"
        />
        <kbd
          title={s.searchShortcut}
          className="spec border border-rule px-1.5 py-0.5 text-small text-ink-muted max-md:hidden"
        >
          /
        </kbd>
      </div>

      <div className="grid-12 gap-y-6 pt-6 md:pt-12">
        {/* Phones: filters fold under a button. */}
        <div className="col-span-12 flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-expanded={filtersOpen}
            aria-controls={panelId}
            onClick={() => setFiltersOpen((o) => !o)}
            className="cursor-pointer border border-ink px-4 py-2.5 text-ui text-ink"
          >
            {s.filters}
            {count > 0 ? <span className="spec ml-1.5">· {count}</span> : null}
          </button>
        </div>

        <div
          id={panelId}
          role="group"
          aria-label={s.filtersLabel}
          className={cn("col-span-12 md:col-span-3", !filtersOpen && "max-md:hidden")}
        >
          <fieldset className="m-0 border-0 p-0">
            <legend className="mb-4 p-0 text-ui font-medium">{s.clusterLegend}</legend>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              <Option
                type="radio"
                name={PARAM.cluster}
                value=""
                checked={!filter.clusterId}
                onChange={() => set(withCluster(filter, undefined))}
                count={equipment.length}
                disabled={!interactive}
              >
                {s.allClusters}
              </Option>
              {clusters.map((c) => (
                <Option
                  key={c.id}
                  type="radio"
                  name={PARAM.cluster}
                  value={c.id}
                  checked={filter.clusterId === c.id}
                  onChange={() => set(withCluster(filter, c.id))}
                  count={clusterTotal(c.id)}
                  disabled={!interactive}
                >
                  <span className="mr-1.5 font-display text-burgundy [font-feature-settings:'lnum','tnum']">
                    {c.number}
                  </span>
                  {t(c.title, locale)}
                </Option>
              ))}
            </ul>
          </fieldset>

          <fieldset className="m-0 mt-10 border-0 p-0">
            <legend className="mb-4 p-0 text-ui font-medium">{s.serviceLegend}</legend>
            <ul className="m-0 flex list-none flex-col gap-3 p-0">
              {visibleServices.map((sv) => (
                <Option
                  key={sv.slug}
                  type="checkbox"
                  name={PARAM.service}
                  value={sv.slug}
                  checked={filter.serviceSlugs.includes(sv.slug)}
                  onChange={() => set(toggleService(filter, sv.slug))}
                  count={serviceTotal(sv.slug)}
                  disabled={!interactive}
                >
                  {t(sv.title, locale)}
                </Option>
              ))}
            </ul>
          </fieldset>

          <fieldset className="m-0 mt-10 border-0 p-0">
            <legend className="mb-4 p-0 text-ui font-medium">{s.showLegend}</legend>
            <label className="flex cursor-pointer items-center justify-between gap-4 text-ui">
              <span>{s.flagshipOnly}</span>
              <input
                type="checkbox"
                role="switch"
                name={PARAM.flagship}
                value="1"
                checked={filter.flagshipOnly}
                onChange={() => set({ ...filter, flagshipOnly: !filter.flagshipOnly })}
                disabled={!interactive}
                className="peer sr-only"
              />
              <span
                aria-hidden
                className="relative h-[18px] w-[34px] shrink-0 border border-ink-muted bg-paper-deep transition-colors peer-checked:border-burgundy peer-checked:bg-burgundy peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-burgundy after:absolute after:top-[2px] after:left-[2px] after:size-3 after:bg-ink-muted after:transition-transform peer-checked:after:translate-x-4 peer-checked:after:bg-paper"
              />
            </label>
          </fieldset>
        </div>

        <div className="col-span-12 md:col-span-9 md:col-start-4">
          {/* Active filters, result count and order. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
            {chips.length > 0 ? (
              <ul aria-label={s.activeFilters} className="m-0 flex list-none flex-wrap gap-2 p-0">
                {chips.map((c) => (
                  <li key={c.key}>
                    <button
                      type="button"
                      onClick={c.remove}
                      aria-label={s.removeFilter.replace("{name}", c.name)}
                      className="inline-flex cursor-pointer items-center gap-2.5 bg-ink px-3 py-2 text-small text-paper hover:bg-burgundy"
                    >
                      <span>{c.label}</span>
                      <X aria-hidden className="size-3.5" strokeWidth={2} />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <p className="m-0 text-ui">{countText}</p>
            <p aria-live="polite" className="sr-only">
              {announced}
            </p>
            {hasAny && interactive && results.length > 0 ? (
              <button
                type="button"
                onClick={clear}
                className="cursor-pointer text-small text-burgundy underline underline-offset-[0.3em] hover:text-burgundy-deep"
              >
                {s.clear}
              </button>
            ) : null}
            <p className="m-0 text-small text-ink-muted md:ml-auto max-md:basis-full">
              {s.order}: <span className="text-ink">{s.orderValue}</span>
            </p>
          </div>

          {results.length > 0 ? (
            <div className="mt-4 md:mt-5">
              <div
                aria-hidden
                className="grid grid-cols-[minmax(0,5fr)_minmax(0,3.4fr)_minmax(0,2.6fr)_1.5rem] gap-x-4 border-b border-ink px-4 pb-2 text-small text-ink-muted max-md:hidden"
              >
                <span>{s.equipmentColumn}</span>
                <span>{s.specsColumn}</span>
                <span>{s.serviceColumn}</span>
              </div>
              <ol aria-label={s.results} className="m-0 list-none p-0 max-md:border-t max-md:border-rule">
                {results.map((e) => (
                  <Row key={e.slug} item={e} locale={locale} strings={s} />
                ))}
              </ol>
            </div>
          ) : (
            <div className="mt-6 border-t border-ink pt-8">
              <p className="m-0 font-display text-display-s">{s.empty}</p>
              <p className="mt-4 mb-0 max-w-[36em] text-ui text-ink-muted">{s.emptyHint}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4">
                {interactive ? (
                  <Button variant="ghost" onClick={clear}>
                    {s.clear}
                  </Button>
                ) : null}
                <Button variant="link" href={localePath(locale, "/kontakt")}>
                  {s.emptyAsk}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}

function Option({
  type,
  name,
  value,
  checked,
  onChange,
  count,
  disabled,
  children,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  count: number;
  disabled: boolean;
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
          type={type}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={cn(
            "m-0 size-[15px] translate-y-[2px] cursor-pointer accent-burgundy disabled:cursor-default",
            type === "checkbox" && "rounded-none",
          )}
        />
        <span>{children}</span>
        <span className="spec text-small text-ink-muted">{count}</span>
      </label>
    </li>
  );
}

function Row({ item: e, locale, strings: s }: { item: Equipment; locale: Locale; strings: Dictionary["catalog"] }) {
  const specs = meaningfulSpecs(e).slice(0, 2);
  const service = getService(e.serviceSlug);
  return (
    <li
      className={cn(
        "relative grid gap-x-4 gap-y-1.5 border-b border-rule px-4 py-4 md:grid-cols-[minmax(0,5fr)_minmax(0,3.4fr)_minmax(0,2.6fr)_1.5rem] md:py-[18px]",
        e.isFlagship ? "bg-paper-deep max-md:-mx-gutter max-md:px-gutter" : "max-md:px-0",
        "transition-colors hover:bg-paper-deep/70",
      )}
    >
      <div>
        <Link
          href={localePath(locale, `/infrastruktura/${e.slug}`)}
          aria-label={s.cardOf.replace("{name}", e.name)}
          className="text-[1.0625rem] leading-snug text-ink no-underline after:absolute after:inset-0 hover:text-burgundy md:text-[1.125rem]"
        >
          {e.name}
        </Link>
        {e.isFlagship || e.manufacturer ? (
          <p className="mt-1.5 mb-0 flex flex-wrap items-baseline gap-x-2.5 text-small text-ink-muted">
            {e.isFlagship ? <span className="bg-burgundy px-1.5 py-px text-paper">{s.flagship}</span> : null}
            {e.manufacturer ? <span>{e.manufacturer}</span> : null}
          </p>
        ) : null}
      </div>
      <div className="max-md:empty:hidden">
        {specs.length > 0 ? (
          <ul className="m-0 list-none p-0">
            {specs.map((sp) => (
              <li key={sp} className="spec text-ink">
                {sp}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <p className="m-0 text-small text-ink-muted">{service ? t(service.title, locale) : null}</p>
      <ArrowRight aria-hidden className="size-4 text-burgundy max-md:hidden md:mt-1" strokeWidth={1.5} />
    </li>
  );
}
