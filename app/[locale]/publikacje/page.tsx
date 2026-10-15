import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publications } from "@/content";
import { getDictionary, isLocale, plural } from "@/i18n";
import { publicationYears } from "@/lib/publications";
import { Heading, Section } from "@/components/ui";
import { PublicationList } from "@/components/sections/PublicationList";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.publications.title, description: dict.publications.metaDescription };
}

export default async function PublicationsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const s = dict.publications;
  const years = publicationYears(publications).map((y) => y.year);
  const lede = s.lede
    .replace("{n}", plural(s.count, publications.length, locale))
    .replace("{from}", String(Math.min(...years)))
    .replace("{to}", String(Math.max(...years)));

  return (
    <main id="main">
      <Section tone="paper" space="loose" aria-labelledby="publications-title" className="md:pt-20">
        <div className="grid-12 gap-y-5">
          <Heading as="h1" size="l" id="publications-title" className="col-span-12 md:col-span-7">
            {s.title}
          </Heading>
          <p className="col-span-12 m-0 max-w-[30em] text-body text-ink-muted md:col-span-5 md:col-start-8 md:pt-3 lg:col-span-4 lg:col-start-9">
            {lede}
          </p>
        </div>
        <PublicationList items={publications} locale={locale} strings={s} />
      </Section>
    </main>
  );
}
