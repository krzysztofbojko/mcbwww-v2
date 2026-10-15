import { describe, expect, it } from "vitest";
import { equipment, filterEquipment } from "@/content";
import {
  activeFilterCount,
  catalogSearch,
  emptyFilter,
  flagshipFirst,
  parseCatalogParams,
  toggleService,
  withCluster,
} from "@/lib/catalog";

const params = (qs: string) => new URLSearchParams(qs);

describe("filterEquipment: service and flagship filters", () => {
  it("keeps only the listed services", () => {
    const out = filterEquipment(equipment, { serviceSlugs: ["piec-x", "akwizycja-danych-dronami"] });
    expect(out.length).toBe(5);
    expect(out.every((e) => e.serviceSlug === "akwizycja-danych-dronami")).toBe(true);
  });
  it("an empty service list does not filter", () => {
    expect(filterEquipment(equipment, { serviceSlugs: [] })).toHaveLength(56);
  });
  it("flagshipOnly keeps the six flagship items", () => {
    const out = filterEquipment(equipment, { flagshipOnly: true });
    expect(out).toHaveLength(6);
    expect(out.every((e) => e.isFlagship)).toBe(true);
  });
  it("combines all criteria", () => {
    const out = filterEquipment(equipment, { clusterId: "digital-tech", flagshipOnly: true, query: "ac922" });
    expect(out.map((e) => e.slug)).toEqual(["superkomputer-cato-ibm-ac922-gpu-v100"]);
  });
});

describe("parseCatalogParams", () => {
  it("returns the empty filter for no params", () => {
    expect(parseCatalogParams(params(""))).toEqual(emptyFilter);
  });
  it("reads cluster, services, flagship and query", () => {
    expect(
      parseCatalogParams(
        params("klaster=digital-tech&usluga=zasoby-obliczeniowe-klaster-cato&wiodace=1&q=%20GPU "),
      ),
    ).toEqual({
      clusterId: "digital-tech",
      serviceSlugs: ["zasoby-obliczeniowe-klaster-cato"],
      flagshipOnly: true,
      query: " GPU ",
    });
  });
  it("drops unknown clusters and services, and services outside the chosen cluster", () => {
    expect(parseCatalogParams(params("klaster=nope&usluga=nope&wiodace=tak"))).toEqual(emptyFilter);
    expect(
      parseCatalogParams(params("klaster=analysis-control&usluga=piec-x&usluga=akwizycja-danych-dronami&usluga=preparatyka-metalograficzna"))
        .serviceSlugs,
    ).toEqual(["akwizycja-danych-dronami"]);
  });
  it("deduplicates services", () => {
    expect(parseCatalogParams(params("usluga=informatyka-sledcza&usluga=informatyka-sledcza")).serviceSlugs).toEqual([
      "informatyka-sledcza",
    ]);
  });
});

describe("catalogSearch", () => {
  it("is empty for the empty filter", () => {
    expect(catalogSearch(emptyFilter)).toBe("");
    expect(catalogSearch({ ...emptyFilter, query: "   " })).toBe("");
  });
  it("round-trips through parseCatalogParams", () => {
    const f = {
      clusterId: "material-engineering" as const,
      serviceSlugs: ["wytwarzanie-stopow-metali", "preparatyka-metalograficzna"],
      flagshipOnly: true,
      query: "3500°C łuk",
    };
    const qs = catalogSearch(f);
    expect(qs.startsWith("?klaster=material-engineering&usluga=")).toBe(true);
    expect(parseCatalogParams(params(qs.slice(1)))).toEqual(f);
  });
});

describe("filter helpers", () => {
  it("withCluster drops services from other clusters", () => {
    const f = { ...emptyFilter, serviceSlugs: ["informatyka-sledcza", "piec-x"] };
    expect(withCluster(f, "digital-tech").serviceSlugs).toEqual(["informatyka-sledcza"]);
    expect(withCluster(f, "material-engineering").serviceSlugs).toEqual([]);
    expect(withCluster(f, undefined)).toEqual({ ...f, clusterId: undefined });
  });
  it("toggleService adds and removes", () => {
    const on = toggleService(emptyFilter, "informatyka-sledcza");
    expect(on.serviceSlugs).toEqual(["informatyka-sledcza"]);
    expect(toggleService(on, "informatyka-sledcza").serviceSlugs).toEqual([]);
  });
  it("activeFilterCount counts cluster, each service and flagship, not the query", () => {
    expect(activeFilterCount(emptyFilter)).toBe(0);
    expect(
      activeFilterCount({ clusterId: "digital-tech", serviceSlugs: ["informatyka-sledcza"], flagshipOnly: true, query: "x" }),
    ).toBe(3);
  });
});

describe("flagshipFirst", () => {
  it("moves flagship items to the top and keeps the content order otherwise", () => {
    const sorted = flagshipFirst(equipment);
    expect(sorted).toHaveLength(56);
    expect(sorted.slice(0, 6).every((e) => e.isFlagship)).toBe(true);
    const rest = equipment.filter((e) => !e.isFlagship);
    expect(sorted.slice(6)).toEqual(rest);
    expect(sorted.slice(0, 6)).toEqual(equipment.filter((e) => e.isFlagship));
  });
  it("does not mutate its input", () => {
    const copy = [...equipment];
    flagshipFirst(equipment);
    expect(equipment).toEqual(copy);
  });
});

describe("equipmentPhoto", () => {
  it("knows the arc furnace photograph and nothing it cannot vouch for", async () => {
    const { equipmentPhoto } = await import("@/content");
    const fs = await import("node:fs");
    const photo = equipmentPhoto("piec-lukowy-edmund-buhler-am-500");
    expect(photo?.src).toBe("/gallery/HA705863-scaled.jpg");
    expect(fs.existsSync(`public${photo!.src}`)).toBe(true);
    expect(photo!.alt.en).toBeTruthy();
    expect(equipmentPhoto("piec-muflowy")).toBeUndefined();
  });
});

describe("client-safe content module", () => {
  it("does not import projects, publications or experts (they would ship in the catalog bundle)", async () => {
    const fs = await import("node:fs");
    const src = fs.readFileSync("content/equipment.ts", "utf8");
    const imports = src.split("\n").filter((l) => l.startsWith("import ")).join("\n");
    expect(imports).not.toMatch(/projects|publications|experts|\.\/index|@\/content"/);
    for (const f of ["lib/catalog.ts", "components/sections/EquipmentCatalog.tsx"]) {
      expect(fs.readFileSync(f, "utf8")).not.toMatch(/from "@\/content"/);
    }
  });
});
