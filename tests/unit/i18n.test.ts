import { describe, expect, it } from "vitest";
import { isLocale, localePath, plural, switchLocalePath, t, defaultLocale, locales } from "@/i18n";
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

describe("plural", () => {
  const forms = { one: "{n} aparat", few: "{n} aparaty", many: "{n} aparatów", other: "{n} aparatu" };
  it("uses Polish plural categories", () => {
    expect(plural(forms, 1, "pl")).toBe("1 aparat");
    expect(plural(forms, 3, "pl")).toBe("3 aparaty");
    expect(plural(forms, 5, "pl")).toBe("5 aparatów");
    expect(plural(forms, 12, "pl")).toBe("12 aparatów");
    expect(plural(forms, 22, "pl")).toBe("22 aparaty");
  });
  it("uses English categories", () => {
    const en = { one: "{n} instrument", few: "x", many: "x", other: "{n} instruments" };
    expect(plural(en, 1, "en")).toBe("1 instrument");
    expect(plural(en, 4, "en")).toBe("4 instruments");
  });
});
