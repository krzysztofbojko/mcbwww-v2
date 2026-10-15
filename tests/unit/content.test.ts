import { describe, it, expect } from "vitest";
import {
  clusters, services, experts, equipment, projects, publications,
  getService, getEquipment, servicesByCluster, equipmentForService,
  resolveExperts, filterEquipment, slugify,
} from "@/content";

describe("content counts", () => {
  it("matches v1 data", () => {
    expect(clusters).toHaveLength(4);
    expect(services).toHaveLength(13);
    expect(equipment).toHaveLength(56);
    expect(experts).toHaveLength(10);
    expect(projects).toHaveLength(10);
    expect(publications).toHaveLength(49);
  });
});

describe("integrity", () => {
  it("links services, equipment and experts", () => {
    for (const s of services) expect(equipmentForService(s.slug).length).toBeGreaterThan(0);
    for (const e of equipment) expect(getService(e.serviceSlug)).toBeDefined();
    for (const s of services) for (const id of s.expertIds) expect(experts.find((x) => x.id === id)).toBeDefined();
    expect(new Set(services.map((s) => s.slug)).size).toBe(13);
    expect(new Set(equipment.map((e) => e.slug)).size).toBe(56);
  });
  it("lookups and cluster grouping work", () => {
    expect(getService("nie-ma")).toBeUndefined();
    expect(getEquipment(equipment[0].slug)).toBe(equipment[0]);
    expect(servicesByCluster("material-engineering")).toHaveLength(5);
    expect(servicesByCluster("analysis-control")).toHaveLength(3);
  });
  it("keeps service slugs frozen (titles may change case, URLs may not)", () => {
    expect(services.map((s) => s.slug)).toEqual([
      "projektowanie-materialow",
      "wytwarzanie-stopow-metali",
      "wytwarzanie-przyrostowe-metali-druk-3d",
      "wytwarzanie-przyrostowe-tworzyw-sztucznych-i-ceramiki",
      "preparatyka-metalograficzna",
      "analiza-struktury-i-skladu-fazowego",
      "badania-wlasciwosci-mechanicznych",
      "akwizycja-danych-dronami",
      "zasoby-obliczeniowe-klaster-cato",
      "skanowanie-3d-digitalizacja-i-vr",
      "informatyka-sledcza",
      "laboratorium-srodowiskowe",
      "medioznawstwo-i-analizy-ux",
    ]);
    for (const s of services) expect(slugify(s.title.pl)).toBe(s.slug);
  });
  it("uses sentence case for Polish cluster and service titles", () => {
    expect(clusters[0].title.pl).toBe("Inżynieria materiałowa i wytwarzanie");
    expect(getService("zasoby-obliczeniowe-klaster-cato")!.title.pl).toBe("Zasoby obliczeniowe (klaster CATO)");
    expect(getService("medioznawstwo-i-analizy-ux")!.title.pl).toBe("Medioznawstwo i analizy UX");
  });
  it("writes Polish expert roles in sentence case with a typographic dash", () => {
    for (const e of experts) {
      expect(e.role.pl).not.toMatch(/ - /);
      // After the leading word no capitalised common word; acronyms (HPC, ICT, VR, MCB) stay upper case.
      const words = e.role.pl.split(/[\s,–]+/).slice(1).filter(Boolean);
      for (const w of words) {
        const titleCased = w.length > 1 && w === w[0].toUpperCase() + w.slice(1).toLowerCase();
        expect(titleCased, `${e.id}: ${w}`).toBe(false);
      }
    }
  });
  it("has EN for cluster and service titles", () => {
    for (const c of clusters) { expect(c.title.en).toBeTruthy(); expect(c.description.en).toBeTruthy(); }
    for (const s of services) expect(s.title.en).toBeTruthy();
  });
});

describe("resolveExperts", () => {
  it("resolves multiple contacts", () => {
    const multi = getService("zasoby-obliczeniowe-klaster-cato")!;
    expect(resolveExperts(multi).map((e) => e.name)).toEqual(["dr inż. Piotr Kwaśniak", "inż. Krzysztof Bojko"]);
  });
  it("returns [] for general MCB contact", () => {
    const general = getService("preparatyka-metalograficzna")!;
    expect(resolveExperts(general)).toEqual([]);
    const forensic = getService("informatyka-sledcza")!;
    expect(resolveExperts(forensic)).toEqual([]);
  });
  it("derives ids without titles", () => {
    expect(experts.find((e) => e.name === "dr inż. Piotr Kwaśniak")!.id).toBe("piotr-kwasniak");
  });
});

describe("filterEquipment", () => {
  it("filters by query and cluster", () => {
    expect(filterEquipment(equipment, { query: "zzzz-brak" })).toEqual([]);
    expect(filterEquipment(equipment, { query: "kwasniak" })).toEqual([]);
    expect(filterEquipment(equipment, { query: "AC922" }).length).toBeGreaterThan(0);
    expect(filterEquipment(equipment, { query: "lukowy" })).toEqual(filterEquipment(equipment, { query: "łukowy" }));
    expect(filterEquipment(equipment, { query: "lukowy" }).length).toBeGreaterThan(0);
    expect(filterEquipment(equipment, { clusterId: "digital-tech" }).every((e) => e.clusterId === "digital-tech")).toBe(true);
    expect(filterEquipment(equipment, {})).toHaveLength(56);
  });
});

describe("slugify", () => {
  it("normalizes", () => {
    expect(slugify("Wytwarzanie Przyrostowe Metali (Druk 3D)")).toBe("wytwarzanie-przyrostowe-metali-druk-3d");
    expect(slugify("Łódź Żółć")).toBe("lodz-zolc");
  });
});

describe("cross-references kept in sync by hand", () => {
  it("every home router slug in both dictionaries resolves to a service", async () => {
    const pl = (await import("@/i18n/dictionaries/pl.json")).default;
    const en = (await import("@/i18n/dictionaries/en.json")).default;
    for (const dict of [pl, en]) {
      expect(dict.home.router.length).toBeGreaterThan(0);
      for (const r of dict.home.router) expect(getService(r.slug), r.slug).toBeDefined();
    }
    expect(en.home.router.map((r) => r.slug)).toEqual(pl.home.router.map((r) => r.slug));
  });
  it("each instrument sits in the same cluster as its service", () => {
    for (const e of equipment) expect(e.clusterId, e.slug).toBe(getService(e.serviceSlug)!.clusterId);
  });
});
