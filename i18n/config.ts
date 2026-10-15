export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export function isLocale(x: string): x is Locale {
  return (locales as readonly string[]).includes(x);
}
