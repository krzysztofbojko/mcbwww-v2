import { describe, expect, it } from "vitest";
import { projects, publications } from "@/content";
import {
  formatBudget,
  formatPeriod,
  groupByYear,
  projectDescription,
  projectsByStatus,
  publicationLink,
  publicationYears,
} from "@/lib/publications";

describe("groupByYear", () => {
  it("groups publications by year, newest first, keeping input order within a year", () => {
    const groups = groupByYear(publications);
    const years = groups.map((g) => g.year);
    expect(years).toEqual([...years].sort((a, b) => b - a));
    expect(years).toEqual([2025, 2024, 2023, 2022, 2021]);
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(publications.length);
    expect(groups[0].items.map((p) => p.id)).toEqual(publications.filter((p) => p.year === 2025).map((p) => p.id));
  });
  it("filters to one year", () => {
    const groups = groupByYear(publications, 2023);
    expect(groups).toHaveLength(1);
    expect(groups[0].items.every((p) => p.year === 2023)).toBe(true);
  });
  it("an unknown year yields no groups", () => {
    expect(groupByYear(publications, 1999)).toEqual([]);
  });
});

describe("publicationYears", () => {
  it("lists distinct years with counts, newest first", () => {
    const years = publicationYears(publications);
    expect(years[0]).toEqual({ year: 2025, count: 4 });
    expect(years.map((y) => y.year)).toEqual([2025, 2024, 2023, 2022, 2021]);
  });
});

describe("publicationLink", () => {
  it("prefers the DOI resolver", () => {
    expect(publicationLink({ id: 1, year: 2025, text: "x", doi: "10.1/abc", url: "https://example.org" })).toEqual({
      href: "https://doi.org/10.1/abc",
      label: "10.1/abc",
      kind: "doi",
    });
  });
  it("falls back to the URL, then to nothing", () => {
    expect(publicationLink({ id: 1, year: 2025, text: "x", url: "https://example.org/a" })).toEqual({
      href: "https://example.org/a",
      label: "example.org",
      kind: "url",
    });
    expect(publicationLink({ id: 1, year: 2025, text: "x" })).toBeUndefined();
  });
});

describe("projectsByStatus", () => {
  it("splits projects into running and completed", () => {
    const { w_trakcie, zrealizowane } = projectsByStatus(projects);
    expect(w_trakcie.length + zrealizowane.length).toBe(projects.length);
    expect(w_trakcie.every((p) => p.status === "w_trakcie")).toBe(true);
    expect(zrealizowane.every((p) => p.status === "zrealizowane")).toBe(true);
  });
});

/** Amounts use no-break spaces so they never wrap; compare with plain spaces. */
const sp = (s: string) => s.replace(/\u00a0/g, " ");

describe("formatBudget", () => {
  it("normalises the mixed v1 notations to one amount", () => {
    expect(sp(formatBudget("4 495 465,00 zł PLN", "pl"))).toBe("4 495 465 zł");
    expect(sp(formatBudget("1.143.200,00 PLN", "pl"))).toBe("1 143 200 zł");
    expect(sp(formatBudget("200 000 PLN", "pl"))).toBe("200 000 zł");
    expect(sp(formatBudget("778.736,00 PLN", "en"))).toBe("PLN 778,736");
  });
  it("keeps grosze when they are not zero", () => {
    expect(sp(formatBudget("1 000,50 PLN", "pl"))).toBe("1 000,50 zł");
  });
  it("returns unparseable input unchanged", () => {
    expect(sp(formatBudget("brak danych", "pl"))).toBe("brak danych");
  });
});

describe("formatPeriod", () => {
  it("pads dates and uses an en dash", () => {
    expect(formatPeriod("1.01.2026- 31.12.2028")).toBe("01.01.2026 – 31.12.2028");
    expect(formatPeriod("10.07.2024-9.07.2027")).toBe("10.07.2024 – 09.07.2027");
  });
  it("returns unparseable input unchanged", () => {
    expect(formatPeriod("2024")).toBe("2024");
  });
});

describe("projectDescription", () => {
  it("hides a description that only repeats the summary", () => {
    expect(projectDescription({ summary: "Cel projektu.", description: " Cel projektu. " })).toBeUndefined();
    expect(projectDescription({ summary: "Cel projektu.", description: "" })).toBeUndefined();
    expect(projectDescription({ summary: "Cel projektu." })).toBeUndefined();
  });
  it("keeps a description that adds to the summary", () => {
    expect(projectDescription({ summary: "Cel.", description: "Cel. Metody i wyniki." })).toBe("Cel. Metody i wyniki.");
  });
});
