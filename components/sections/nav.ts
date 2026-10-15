import { localePath, type Dictionary, type Locale } from "@/i18n";

export interface NavItem {
  href: string;
  label: string;
}

const sections = ["oferta", "infrastruktura", "projekty", "publikacje", "galeria", "kontakt"] as const;

/** Main navigation (user decision): six sections, in this order, on every page. */
export function mainNav(locale: Locale, dict: Dictionary): NavItem[] {
  return sections.map((key) => ({ href: localePath(locale, `/${key}`), label: dict.nav[key] }));
}

/** A nav item is current on its own page and on every page below it (/oferta/slug). */
export function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
