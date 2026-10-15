import Link from "next/link";
import type { Cluster, Service } from "@/content";
import { localePath, t, type Dictionary, type Locale } from "@/i18n";
import { Container, Eyebrow, Figure, Heading } from "@/components/ui";

/**
 * Mockup 03 (top): breadcrumb with the cluster numeral, then the reversed classic layout —
 * the plate on the left, title and the numbered scope of the service on the right.
 */
export function ServiceHeader({
  service,
  cluster,
  locale,
  dict,
}: {
  service: Service;
  cluster: Cluster;
  locale: Locale;
  dict: Dictionary;
}) {
  const title = t(service.title, locale);
  return (
    <section id="usluga" aria-labelledby="service-title" className="scroll-mt-16 bg-paper">
      <Container>
        <nav aria-label={dict.service.breadcrumb} className="pt-5 text-small text-ink-muted">
          <ol className="m-0 flex list-none flex-wrap items-baseline gap-3 p-0">
            <li className="flex items-baseline gap-3">
              <Link href={localePath(locale, "/oferta")} className="no-underline hover:text-burgundy hover:underline">
                {dict.nav.oferta}
              </Link>
              <span aria-hidden>/</span>
            </li>
            <li>
              <Link
                href={localePath(locale, `/oferta#${cluster.id}`)}
                className="no-underline hover:text-burgundy hover:underline"
              >
                <Eyebrow number={cluster.number}>{t(cluster.title, locale)}</Eyebrow>
              </Link>
            </li>
          </ol>
        </nav>

        <div className="grid-12 gap-y-8 pt-6 pb-16 md:pt-12 md:pb-24">
          {service.image ? (
            <Figure
              src={service.image}
              alt={title}
              aspect="420 / 596"
              sizes="(min-width: 768px) 33vw, 100vw"
              preload
              locale={locale}
              className="col-span-12 -mx-gutter max-md:[&>div]:aspect-[3/2]! md:col-span-4 md:mx-0"
            />
          ) : null}
          <div className="col-span-12 md:col-span-7 md:col-start-6">
            <Heading as="h1" size="l" id="service-title" className="max-w-[12em]">
              {title}
            </Heading>
            <div className="mt-12 md:mt-16">
              <Heading as="h2" size="m">
                {dict.service.scope}
              </Heading>
              <ol className="mt-5 mb-0 list-none border-t border-ink p-0">
                {service.offer.map((item, i) => (
                  <li
                    key={i}
                    className="grid grid-cols-[2rem_1fr] border-b border-rule py-3.5 text-ui md:grid-cols-[3rem_1fr]"
                  >
                    <span aria-hidden className="spec pt-px text-steel">
                      {i + 1}
                    </span>
                    <span>{t(item, locale)}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
