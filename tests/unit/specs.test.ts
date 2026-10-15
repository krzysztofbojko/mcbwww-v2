import { describe, expect, it } from "vitest";
import { equipment, getEquipment, meaningfulSpecs, type Equipment } from "@/content";

const base: Equipment = {
  slug: "x",
  serviceSlug: "preparatyka-metalograficzna",
  clusterId: "material-engineering",
  name: "X",
  fullName: "X",
  specs: [],
  isFlagship: false,
};

describe("meaningfulSpecs", () => {
  it("drops a single-word spec that only repeats a word of the service title (v1 placeholder)", () => {
    expect(meaningfulSpecs({ ...base, specs: ["Preparatyka"] })).toEqual([]);
    expect(meaningfulSpecs({ ...base, specs: ["preparatyka"] })).toEqual([]);
    expect(meaningfulSpecs({ ...base, specs: ["Metalograficzna"] })).toEqual([]);
  });
  it("keeps single words that carry information of their own", () => {
    expect(meaningfulSpecs({ ...base, specs: ["Nanoproszki"] })).toEqual(["Nanoproszki"]);
  });
  it("keeps multi-word specs and anything with digits, even if it repeats the title", () => {
    expect(meaningfulSpecs({ ...base, specs: ["automatyczna preparatyka", "do 3500°C", "EDM"] })).toEqual([
      "automatyczna preparatyka",
      "do 3500°C",
      "EDM",
    ]);
  });
  it("matches the known placeholders in content", () => {
    const placeholder = (slug: string) => meaningfulSpecs(getEquipment(slug)!);
    expect(placeholder("narzedzia-do-wizualizacji-i-przetwarzania-wynikow-obliczen")).toEqual([]);
    expect(placeholder("analizator-wielkosci-i-sferycznosci-czastek-kamika-mini-30")).toEqual([]);
    expect(placeholder("dygestoria-laboratoryjne-z-wyciagami-do-pracy-z-odczynnikami-chemicznymi")).toEqual([]);
    expect(placeholder("mediaimager-gms")).toEqual([]);
    expect(placeholder("zestaw-do-fotogrametrii-wykorzystujacy-polaryzacje-krzyzowa")).toEqual([]);
    expect(placeholder("miernik-wieloparametrowy-elmetron")).toEqual([]);
    expect(placeholder("profesjonalna-aula-audiowizualna-na-126-miejsc")).toEqual([]);
    expect(placeholder("drukarka-3d-do-metalu-aconity-mini")).toHaveLength(4);
    const leftovers = equipment.flatMap(meaningfulSpecs).filter((s) => /^\p{Lu}\p{Ll}+$/u.test(s));
    expect(leftovers).toEqual(["Nanoproszki"]);
  });
});
