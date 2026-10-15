import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { clusters, equipmentForService, getService, resolveExperts, services } from "@/content";
import { getDictionary, isLocale, localePath, locales, t } from "@/i18n";
import { Section } from "@/components/ui";
import { ExpertContact } from "@/components/sections/ExpertContact";
import { ServiceEquipment } from "@/components/sections/ServiceEquipment";
import { ServiceHeader } from "@/components/sections/ServiceHeader";
import { ServicePath } from "@/components/sections/ServicePath";

/** Every service in both languages is prerendered; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => services.map((s) => ({ locale, slug: s.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const service = getService(slug);
  if (!isLocale(locale) || !service) return {};
  const cluster = clusters.find((c) => c.id === service.clusterId);
  return {
    title: t(service.title, locale),
    description: cluster ? t(cluster.description, locale) : undefined,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const service = getService(slug);
  const cluster = service && clusters.find((c) => c.id === service.clusterId);
  if (!service || !cluster) notFound();
  const dict = await getDictionary(locale);
  const items = equipmentForService(service.slug);
  const ask = { href: `${localePath(locale, "/kontakt")}?temat=${service.slug}`, label: dict.service.ask };

  return (
    <main id="main">
      <ServiceHeader service={service} cluster={cluster} locale={locale} dict={dict} />
      <ServicePath
        label={dict.service.pathLabel}
        links={{
          service: dict.service.pathService,
          equipment: dict.service.pathEquipment,
          expert: dict.service.pathExpert,
        }}
        equipmentCount={items.length}
        cta={ask}
      />
      <Section id="aparatura" tone="steel" aria-labelledby="aparatura-title" className="scroll-mt-14">
        <ServiceEquipment items={items} locale={locale} dict={dict} />
      </Section>
      <Section id="ekspert" tone="paper" space="loose" aria-labelledby="ekspert-title" className="scroll-mt-14">
        <ExpertContact experts={resolveExperts(service)} serviceSlug={service.slug} locale={locale} dict={dict} />
      </Section>
    </main>
  );
}
