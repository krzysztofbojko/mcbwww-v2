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
  it("has EN for cluster and service titles", () => {
    for (const c of clusters) { expect(c.title.en).toBeTruthy(); expect(c.description.en).toBeTruthy(); }
    for (const s of services) expect(s.title.en).toBeTruthy();
  });
});

describe("resolveExperts", () => {
  it("resolves multiple contacts", () => {
    const multi = services.find((s) => s.title.pl === "Zasoby Obliczeniowe (Klaster CATO)")!;
    expect(resolveExperts(multi).map((e) => e.name)).toEqual(["dr inż. Piotr Kwaśniak", "inż. Krzysztof Bojko"]);
  });
  it("returns [] for general MCB contact", () => {
    const general = services.find((s) => s.title.pl === "Preparatyka Metalograficzna")!;
    expect(resolveExperts(general)).toEqual([]);
    const forensic = services.find((s) => s.title.pl === "Informatyka Śledcza")!;
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
