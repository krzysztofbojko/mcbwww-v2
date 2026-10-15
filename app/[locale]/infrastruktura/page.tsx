import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { equipment } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, isLocale, plural } from "@/i18n";
import { Heading, Section } from "@/components/ui";
import { EquipmentCatalog, EquipmentCatalogFallback } from "@/components/sections/EquipmentCatalog";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({ locale, path: "/infrastruktura", title: dict.catalog.title, description: dict.catalog.metaDescription });
}

export default async function CatalogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const s = dict.catalog;
  return (
    <main id="main">
      <Section tone="paper" space="loose" aria-labelledby="catalog-title" className="md:pt-20">
        <div className="grid-12 gap-y-5">
          <Heading as="h1" size="l" id="catalog-title" className="col-span-12 md:col-span-7">
            {s.title}
          </Heading>
          <p className="col-span-12 m-0 max-w-[30em] text-body text-ink-muted md:col-span-5 md:col-start-8 md:pt-3 lg:col-span-4 lg:col-start-9">
            {s.lede.replace("{n}", plural(s.items, equipment.length, locale))}
          </p>
        </div>
        {/* useSearchParams opts the catalog into client rendering; the fallback prerenders the full list. */}
        <Suspense fallback={<EquipmentCatalogFallback locale={locale} strings={s} />}>
          <EquipmentCatalog locale={locale} strings={s} />
        </Suspense>
      </Section>
    </main>
  );
}
