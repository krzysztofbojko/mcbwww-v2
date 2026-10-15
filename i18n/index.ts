import type { L } from "@/content/types";
import { isLocale, type Locale } from "./config";
import type pl from "./dictionaries/pl.json";

export { locales, defaultLocale, isLocale, type Locale } from "./config";

export type Dictionary = typeof pl;

export function t(value: L, locale: Locale): string {
  return (locale === "en" ? value.en : undefined) ?? value.pl;
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  pl: () => import("./dictionaries/pl.json").then((m) => m.default),
  en: () => import("./dictionaries/en.json").then((m) => m.default),
};

export function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]();
}

export function localePath(locale: Locale, path: string): string {
  const p = path === "/" || path === "" ? "" : path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${p}`;
}

export function switchLocalePath(pathname: string, to: Locale): string {
  const [, first, ...rest] = pathname.split("/");
  const tail = first && isLocale(first) ? rest : first ? [first, ...rest] : [];
  return localePath(to, tail.length ? `/${tail.join("/")}` : "/");
}


export interface PluralForms {
  one: string;
  few: string;
  many: string;
  other: string;
}

/** Picks the CLDR plural form for `n` (pl: one/few/many/other, en: one/other) and fills `{n}`. */
export function plural(forms: PluralForms, n: number, locale: Locale): string {
  const category = new Intl.PluralRules(locale).select(n) as keyof PluralForms;
  return (forms[category] ?? forms.other).replace("{n}", String(n));
}
