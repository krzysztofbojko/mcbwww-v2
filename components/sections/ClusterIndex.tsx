import Image from "next/image";
import Link from "next/link";
import { clusters, equipment, equipmentForService, getService, servicesByCluster, type ClusterId } from "@/content";
import { localePath, plural, t, type Dictionary, type Locale } from "@/i18n";
import { Button, Eyebrow, Heading, Spec } from "@/components/ui";

/** One plate per cluster (mockup 02), taken from the photograph of a representative service. */
const clusterPlate: Record<ClusterId, string> = {
  "material-engineering": "wytwarzanie-przyrostowe-metali-druk-3d",
  "analysis-control": "badania-wlasciwosci-mechanicznych",
  "digital-tech": "zasoby-obliczeniowe-klaster-cato",
  "society-environment": "laboratorium-srodowiskowe",
};

export interface ClusterIndexProps {
  locale: Locale;
  dict: Dictionary;
  /** home: the section heading is an H2 and each cluster links to /oferta#id · page: /oferta, heading is the H1. */
  variant: "home" | "page";
}

/**
 * Mockup 02: a table of contents in rows — numeral, description, services with instrument counts, an upright plate.
 * No cards. Each row carries the cluster id as its anchor (/oferta#material-engineering).
 */
export function ClusterIndex({ locale, dict, variant }: ClusterIndexProps) {
  const c = dict.clusters;
  const isPage = variant === "page";
  const NameTag = isPage ? "h2" : "h3";
  return (
    <>
      <div className="grid-12 mb-12 gap-y-4 md:mb-16 md:items-end">
        <Heading as={isPage ? "h1" : "h2"} size="l" id="clusters-title" className="col-span-12 md:col-span-7">
          {c.title}
        </Heading>
        <p className="col-span-12 m-0 max-w-[22em] text-statement md:col-span-4 md:col-start-9">{c.lede}</p>
      </div>

      <ol className="m-0 list-none border-t border-ink p-0">
        {clusters.map((cluster) => {
          const list = servicesByCluster(cluster.id);
          const plate = getService(clusterPlate[cluster.id]);
          return (
            <li
              key={cluster.id}
              id={cluster.id}
              className="grid-12 scroll-mt-20 gap-y-4 border-b border-rule pt-6 pb-8 last:border-b-0 md:pb-10"
            >
              <Eyebrow number={cluster.number} size="index" className="col-span-4 row-start-1 md:col-span-2" />
              <div className="col-span-12 md:col-span-6 md:col-start-3 md:row-start-1 lg:col-span-4">
                <NameTag className="mb-4 text-display-s">{t(cluster.title, locale)}</NameTag>
                <p className="m-0 max-w-[30em] text-ui text-ink-muted">{t(cluster.description, locale)}</p>
                {isPage ? null : (
                  <Button variant="link" href={localePath(locale, `/oferta#${cluster.id}`)} className="mt-5">
                    {c.wholeCluster}
                    <span className="sr-only">: {t(cluster.title, locale)}</span>
                  </Button>
                )}
              </div>
              <ul
                aria-label={`${c.servicesLabel}: ${t(cluster.title, locale)}`}
                className="col-span-12 m-0 list-none self-start border-t border-rule p-0 md:col-span-10 md:col-start-3 lg:col-span-4 lg:col-start-7 lg:row-start-1"
              >
                {list.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={localePath(locale, `/oferta/${s.slug}`)}
                      className="group flex items-baseline gap-4 border-b border-rule py-[9px] no-underline"
                    >
                      <span className="flex-1 text-ui transition-colors group-hover:text-burgundy group-hover:underline">
                        {t(s.title, locale)}
                      </span>
                      <Spec>{plural(dict.common.equipmentCount, equipmentForService(s.slug).length, locale)}</Spec>
                    </Link>
                  </li>
                ))}
              </ul>
              {plate?.image ? (
                <div className="relative col-span-4 col-start-9 row-start-1 aspect-[3/4] overflow-hidden bg-paper-deep md:col-start-9 lg:col-span-2 lg:col-start-11">
                  {/* Illustrative plate: the row's services are listed in text beside it, so it carries no name. */}
                  <Image
                    src={plate.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 15vw, 33vw"
                    className="object-cover"
                  />
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-2 border-t border-rule pt-5 text-ui text-ink-muted md:flex-row md:items-baseline md:justify-between">
        <p className="m-0">{c.total.replace("{n}", String(equipment.length))}</p>
        <Button variant="link" href={localePath(locale, "/infrastruktura")}>
          {c.browseCatalog}
        </Button>
      </div>
    </>
  );
}
