import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale } from "@/i18n";
import { Section } from "@/components/ui";
import { ClusterIndex } from "@/components/sections/ClusterIndex";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return { title: dict.nav.oferta, description: dict.services.metaDescription };
}

export default async function ServicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <main id="main">
      <Section tone="deep" space="loose" aria-labelledby="clusters-title">
        <ClusterIndex locale={locale} dict={dict} variant="page" />
      </Section>
    </main>
  );
}
