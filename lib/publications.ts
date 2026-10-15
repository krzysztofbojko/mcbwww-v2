import type { Project, Publication } from "@/content/types";

export interface YearGroup {
  year: number;
  items: Publication[];
}

/** Publications grouped by year, newest year first; input order is kept inside a year. Optionally one year only. */
export function groupByYear(items: Publication[], year?: number): YearGroup[] {
  const map = new Map<number, Publication[]>();
  for (const p of items) {
    if (year !== undefined && p.year !== year) continue;
    const list = map.get(p.year);
    if (list) list.push(p);
    else map.set(p.year, [p]);
  }
  return [...map.entries()].sort(([a], [b]) => b - a).map(([y, list]) => ({ year: y, items: list }));
}

/** Distinct years with their publication counts, newest first (the year filter). */
export function publicationYears(items: Publication[]): Array<{ year: number; count: number }> {
  return groupByYear(items).map((g) => ({ year: g.year, count: g.items.length }));
}

export interface PublicationLink {
  href: string;
  label: string;
  kind: "doi" | "url";
}

/** The DOI (via doi.org) when known, else the plain URL labelled by its host; undefined when neither exists. */
export function publicationLink(p: Publication): PublicationLink | undefined {
  if (p.doi) return { href: `https://doi.org/${p.doi}`, label: p.doi, kind: "doi" };
  if (p.url) {
    let label = p.url;
    try {
      label = new URL(p.url).hostname.replace(/^www\./, "");
    } catch {
      /* keep the raw URL as label */
    }
    return { href: p.url, label, kind: "url" };
  }
  return undefined;
}

/** Projects split by status, in content order. */
export function projectsByStatus(items: Project[]): Record<Project["status"], Project[]> {
  return {
    w_trakcie: items.filter((p) => p.status === "w_trakcie"),
    zrealizowane: items.filter((p) => p.status === "zrealizowane"),
  };
}

/**
 * v1 budgets mix notations („4 495 465,00 zł PLN”, „1.143.200,00 PLN”, „200 000 PLN”).
 * Parses the amount and prints it one way: „4 495 465 zł” (pl) / „PLN 4,495,465” (en), with no-break spaces.
 * Grosze are kept only when non-zero. Unparseable input is returned unchanged.
 */
export function formatBudget(raw: string, locale: "pl" | "en"): string {
  const m = raw.match(/^\s*([\d\s. ]+?)(?:,(\d{1,2}))?\s*(?:zł|PLN|\s)*$/i);
  if (!m) return raw;
  const whole = m[1].replace(/[\s. ]/g, "");
  if (!/^\d+$/.test(whole)) return raw;
  const cents = m[2] && Number(m[2]) !== 0 ? m[2].padEnd(2, "0") : "";
  const group = (sep: string) => whole.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
  if (locale === "en") return `PLN ${group(",")}${cents ? `.${cents}` : ""}`;
  return `${group(" ")}${cents ? `,${cents}` : ""} zł`;
}

/** „1.01.2026- 31.12.2028” → „01.01.2026 – 31.12.2028”. Unparseable input is returned unchanged. */
export function formatPeriod(raw: string): string {
  const dates = raw.match(/\d{1,2}\.\d{1,2}\.\d{4}/g);
  if (!dates || dates.length !== 2) return raw;
  const pad = (d: string) =>
    d
      .split(".")
      .map((part, i) => (i < 2 ? part.padStart(2, "0") : part))
      .join(".");
  return `${pad(dates[0])} – ${pad(dates[1])}`;
}

/**
 * The long description worth folding under „Opis projektu”, or undefined when there is nothing beyond the summary
 * (v1 stored the same text in both fields, which made the disclosure repeat what is already on screen).
 */
export function projectDescription(p: Pick<Project, "summary" | "description">): string | undefined {
  const d = p.description?.trim();
  if (!d || d === p.summary.trim()) return undefined;
  return d;
}
