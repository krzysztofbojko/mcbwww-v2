import { describe, expect, it } from "vitest";
import { isLocale, localePath, switchLocalePath, t, defaultLocale, locales } from "@/i18n";
import pl from "@/i18n/dictionaries/pl.json";
import en from "@/i18n/dictionaries/en.json";

function flatten(obj: Record<string, unknown>, prefix = ""): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object") Object.assign(out, flatten(v as Record<string, unknown>, key));
    else out[key] = String(v);
  }
  return out;
}

describe("i18n", () => {
  it("t falls back to pl", () => {
    expect(t({ pl: "Oferta" }, "en")).toBe("Oferta");
    expect(t({ pl: "Oferta", en: "Services" }, "en")).toBe("Services");
    expect(t({ pl: "Oferta", en: "Services" }, "pl")).toBe("Oferta");
  });
  it("locale helpers", () => {
    expect(locales).toEqual(["pl", "en"]);
    expect(defaultLocale).toBe("pl");
    expect(isLocale("de")).toBe(false);
    expect(isLocale("en")).toBe(true);
    expect(localePath("en", "/oferta")).toBe("/en/oferta");
    expect(localePath("pl", "/")).toBe("/pl");
    expect(switchLocalePath("/pl/oferta/druk-3d", "en")).toBe("/en/oferta/druk-3d");
    expect(switchLocalePath("/pl", "en")).toBe("/en");
    expect(switchLocalePath("/en/kontakt", "pl")).toBe("/pl/kontakt");
  });
  it("dictionaries have identical keys", () => {
    expect(Object.keys(flatten(en)).sort()).toEqual(Object.keys(flatten(pl)).sort());
  });
});
