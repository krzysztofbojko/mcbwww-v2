import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, isLocale } from "@/i18n";
import { Section } from "@/components/ui";
import { AboutBlock } from "@/components/sections/AboutBlock";
import { ClusterIndex } from "@/components/sections/ClusterIndex";
import { FlagshipStrip } from "@/components/sections/FlagshipStrip";
import { HomeCta } from "@/components/sections/HomeCta";
import { HomeHero } from "@/components/sections/HomeHero";
import { RectorQuote } from "@/components/sections/RectorQuote";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({ locale, path: "", title: dict.home.metaTitle, description: dict.home.metaDescription, absoluteTitle: true });
}

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <main id="main">
      <HomeHero locale={locale} dict={dict} />
      <Section tone="deep" reveal aria-labelledby="clusters-title">
        <ClusterIndex locale={locale} dict={dict} variant="home" />
      </Section>
      <Section tone="paper" reveal aria-labelledby="about-title">
        <AboutBlock locale={locale} dict={dict} />
      </Section>
      <Section tone="steel" reveal aria-labelledby="flagship-title">
        <FlagshipStrip locale={locale} dict={dict} />
      </Section>
      <Section tone="paper" reveal aria-labelledby="quote-title">
        <RectorQuote locale={locale} dict={dict} />
      </Section>
      <Section tone="deep" space="loose" reveal aria-labelledby="cta-title">
        <HomeCta locale={locale} dict={dict} />
      </Section>
    </main>
  );
}
