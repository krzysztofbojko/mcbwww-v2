import type { MetadataRoute } from "next";
import { equipment, services } from "@/content";
import { locales } from "@/i18n";
import { languageAlternates, localeUrl } from "@/lib/seo";

const staticPaths = ["", "/oferta", "/infrastruktura", "/projekty", "/publikacje", "/galeria", "/kontakt"];

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    ...staticPaths,
    ...services.map((s) => `/oferta/${s.slug}`),
    ...equipment.map((e) => `/infrastruktura/${e.slug}`),
  ];
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: localeUrl(locale, path),
      alternates: { languages: languageAlternates(path) },
    })),
  );
}
