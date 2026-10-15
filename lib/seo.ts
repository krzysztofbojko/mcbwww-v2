import type { Metadata } from "next";
import { clusters, site, type Service } from "@/content";
import { locales, t, type Locale } from "@/i18n";

const UKSW_URL = "https://uksw.edu.pl";
const OG_LOCALE: Record<Locale, string> = { pl: "pl_PL", en: "en_GB" };

/** Canonical origin from SITE_URL, without a trailing slash. */
export function siteUrl(): string {
  const raw = process.env.SITE_URL?.trim() || "http://localhost:3000";
  return raw.replace(/\/+$/, "");
}

/** Absolute URL of `path` ("", "/oferta", ...) in `locale`. */
export function localeUrl(locale: Locale, path: string): string {
  return `${siteUrl()}/${locale}${path === "/" ? "" : path}`;
}

export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(locales.map((l) => [l, localeUrl(l, path)])),
    "x-default": localeUrl("pl", path),
  };
}

export interface PageMetadataInput {
  locale: Locale;
  /** Path without locale: "", "/oferta", "/oferta/some-slug". */
  path: string;
  title: string;
  description: string;
  /** Use the title as-is, without the site-name template (home page). */
  absoluteTitle?: boolean;
}

export function pageMetadata({ locale, path, title, description, absoluteTitle }: PageMetadataInput): Metadata {
  const url = localeUrl(locale, path);
  // A page-level openGraph replaces the file-convention image, so point at the locale's generated card explicitly.
  const image = { url: localeUrl(locale, "/opengraph-image"), width: 1200, height: 630, alt: "MCB UKSW" };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url, languages: languageAlternates(path) },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName: "MCB UKSW",
      images: [image],
      locale: OG_LOCALE[locale],
      alternateLocale: locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
    },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}

const ORG_ID = () => `${siteUrl()}/#organization`;

export function organizationJsonLd(locale: Locale): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "ResearchOrganization",
    "@id": ORG_ID(),
    name: site.name,
    url: localeUrl(locale, ""),
    telephone: site.phone,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "ul. Marii Konopnickiej 1",
      postalCode: "05-092",
      addressLocality: "Dziekanów Leśny",
      addressCountry: "PL",
    },
    parentOrganization: {
      "@type": "CollegeOrUniversity",
      name: "Uniwersytet Kardynała Stefana Wyszyńskiego w Warszawie",
      url: UKSW_URL,
    },
  };
}

export function serviceJsonLd(service: Service, locale: Locale): Record<string, unknown> {
  const cluster = clusters.find((c) => c.id === service.clusterId);
  const provider = organizationJsonLd(locale);
  delete provider["@context"];
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: t(service.title, locale),
    url: localeUrl(locale, `/oferta/${service.slug}`),
    ...(cluster ? { description: t(cluster.description, locale), category: t(cluster.title, locale) } : {}),
    serviceType: t(service.title, locale),
    inLanguage: locale,
    provider,
  };
}

/** JSON for a `<script type="application/ld+json">`; `<` is escaped so no value can close the tag. */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
