import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { notFound } from "next/navigation";
import {
  clusters,
  equipment,
  equipmentForService,
  equipmentPhoto,
  getEquipment,
  getService,
  meaningfulSpecs,
  resolveExperts,
} from "@/content";
import { getDictionary, isLocale, localePath, locales, t } from "@/i18n";
import { Button, Container, Eyebrow, Figure, Heading, Section, SpecList, type SpecRow } from "@/components/ui";
import { EquipmentTable } from "@/components/sections/EquipmentTable";
import { ExpertContact } from "@/components/sections/ExpertContact";

/** Every instrument in both languages is prerendered; any other slug is a 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((locale) => equipment.map((e) => ({ locale, slug: e.slug })));
}

type Params = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const item = getEquipment(slug);
  const service = item && getService(item.serviceSlug);
  if (!isLocale(locale) || !item || !service) return {};
  const dict = await getDictionary(locale);
  const description = item.flagshipHighlight
    ? t(item.flagshipHighlight, locale)
    : item.fullName !== item.name
      ? item.fullName
      : dict.equipment.about.replace("{service}", t(service.title, locale));
  return pageMetadata({ locale, path: `/infrastruktura/${item.slug}`, title: item.name, description });
}

/**
 * Mockup 04: breadcrumb, name with the headline value, plates on two thirds, the datasheet and its expert on
 * one third; below, the rest of the same service on steel. Most instruments have no photograph of their own:
 * they show the service's plate with a caption that says so, never a stand-in passed off as the instrument.
 */
export default async function EquipmentPage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const item = getEquipment(slug);
  const service = item && getService(item.serviceSlug);
  const cluster = service && clusters.find((c) => c.id === service.clusterId);
  if (!item || !service || !cluster) notFound();
  const dict = await getDictionary(locale);
  const d = dict.equipment;

  const serviceTitle = t(service.title, locale);
  const serviceHref = localePath(locale, `/oferta/${service.slug}`);
  const photo = equipmentPhoto(item.slug);
  const specs = meaningfulSpecs(item);
  const others = equipmentForService(service.slug).filter((e) => e.slug !== item.slug);
  const linkCls = "no-underline hover:text-burgundy hover:underline";

  const rows: Array<string | SpecRow> = [
    ...specs.map((s, i): SpecRow => ({ label: "", value: s, emphasis: item.isFlagship && i === 0 })),
    ...(item.manufacturer ? [{ label: d.manufacturer, value: item.manufacturer }] : []),
    { label: d.service, value: <Link href={serviceHref}>{serviceTitle}</Link>, text: true },
    {
      label: d.cluster,
      value: (
        <Link href={`${localePath(locale, "/infrastruktura")}?klaster=${cluster.id}`} className={linkCls}>
          <Eyebrow number={cluster.number}>{t(cluster.title, locale)}</Eyebrow>
        </Link>
      ),
      text: true,
    },
  ];

  const description = (
    <div className="max-w-[34em] text-body text-ink-muted">
      {item.fullName !== item.name ? <p className="m-0">{item.fullName}</p> : null}
      <p className={item.fullName !== item.name ? "mt-3 mb-0" : "m-0"}>
        {d.about.split("{service}")[0]}
        <Link href={serviceHref}>{serviceTitle}</Link>
        {d.about.split("{service}")[1]}
      </p>
    </div>
  );

  return (
    <main id="main">
      <section aria-labelledby="equipment-title" className="bg-paper">
        <Container>
          <nav aria-label={d.breadcrumb} className="pt-5 text-small text-ink-muted">
            <ol className="m-0 flex list-none flex-wrap items-baseline gap-x-3 gap-y-1 p-0">
              <li className="flex items-baseline gap-3">
                <Link href={localePath(locale, "/infrastruktura")} className={linkCls}>
                  {dict.nav.infrastruktura}
                </Link>
                <span aria-hidden>/</span>
              </li>
              <li className="flex items-baseline gap-3">
                <Link href={`${localePath(locale, "/infrastruktura")}?klaster=${cluster.id}`} className={linkCls}>
                  <Eyebrow number={cluster.number}>{t(cluster.title, locale)}</Eyebrow>
                </Link>
                <span aria-hidden>/</span>
              </li>
              <li>
                <Link href={serviceHref} className={linkCls}>
                  {serviceTitle}
                </Link>
              </li>
            </ol>
          </nav>

          <div className="grid-12 gap-y-5 pt-8 md:pt-12">
            <Heading
              as="h1"
              size="l"
              id="equipment-title"
              className="col-span-12 max-w-[18em] [overflow-wrap:anywhere] lg:col-span-8"
            >
              {item.name}
            </Heading>
            {item.flagshipHighlight ? (
              <p className="col-span-12 m-0 max-w-[26em] text-body text-ink-muted lg:col-span-4 lg:col-start-9 lg:pt-4">
                {t(item.flagshipHighlight, locale)}
              </p>
            ) : null}
          </div>

          <div className="grid-12 gap-y-12 pt-8 pb-16 md:pt-12 md:pb-24">
            <div className="col-span-12 md:col-span-7">
              {photo ? (
                <>
                  <Figure
                    src={photo.src}
                    alt={t(photo.alt, locale)}
                    number={1}
                    caption={t(photo.caption, locale)}
                    aspect="3 / 2"
                    position={photo.position}
                    sizes="(min-width: 768px) 55vw, 100vw"
                    preload
                    locale={locale}
                    className="-mx-gutter md:mx-0 [&_figcaption]:px-gutter md:[&_figcaption]:px-0"
                  />
                  <div className="mt-8">{description}</div>
                </>
              ) : service.image ? (
                <div className="grid gap-y-8 md:grid-cols-7 md:gap-x-6">
                  <Figure
                    src={service.image}
                    alt={d.plateAlt.replace("{service}", serviceTitle)}
                    number={1}
                    caption={d.plateCaption.replace("{service}", serviceTitle)}
                    aspect="420 / 596"
                    sizes="(min-width: 768px) 25vw, 100vw"
                    preload
                    locale={locale}
                    className="-mx-gutter max-md:[&>div]:aspect-[3/2]! md:col-span-3 md:mx-0 [&_figcaption]:px-gutter md:[&_figcaption]:px-0"
                  />
                  <div className="md:col-span-4 md:pt-1">{description}</div>
                </div>
              ) : (
                /* No photograph of the instrument nor of its service: a typographic plate, never a stand-in photo. */
                <div className="border-t border-ink pt-6">{description}</div>
              )}
            </div>

            <aside className="col-span-12 flex flex-col gap-12 md:col-span-5 lg:col-span-4 lg:col-start-9">
              <div>
                <h2 className="mt-0 mb-3 font-sans text-ui font-medium">{d.params}</h2>
                <SpecList items={rows} topRule="ink" />
                {specs.length === 0 ? <p className="mt-4 mb-0 text-small text-ink-muted">{d.noSpecs}</p> : null}
              </div>
              <div className="-mx-gutter md:mx-0">
                <ExpertContact
                  experts={resolveExperts(service)}
                  serviceSlug={service.slug}
                  locale={locale}
                  dict={dict}
                  variant="aside"
                  askLabel={d.ask}
                  title={d.whoTitle}
                />
                <Button variant="link" href={`${serviceHref}#ekspert`} className="mt-5 ml-gutter md:ml-0">
                  {d.serviceLink}
                </Button>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      {others.length > 0 ? (
        <Section tone="steel" space="loose" aria-labelledby="same-service-title">
          <div className="grid-12 gap-y-8">
            <Heading as="h2" size="m" id="same-service-title" className="col-span-12 md:col-span-4">
              {d.sameService}
            </Heading>
            <EquipmentTable
              items={others}
              firstColumn={dict.service.equipmentColumn}
              locale={locale}
              dict={dict}
              className="col-span-12 md:col-span-8 md:col-start-5"
            />
          </div>
        </Section>
      ) : null}
    </main>
  );
}
