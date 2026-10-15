import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { equipment, services, site } from "@/content";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import { Button, Container, Figure, Heading } from "@/components/ui";
import { PartnerList } from "./PartnerList";

const HERO_EQUIPMENT = "piec-lukowy-edmund-buhler-am-500";

/**
 * Mockup 01: the H1 spans the page; below it the lede and the problem router („Od czego zaczynamy?”) on the left,
 * the arc-furnace plate bleeding into the right edge. On phones: lede, plate, router.
 */
export function HomeHero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const h = dict.home;
  const lede = h.lede.replace("{equipment}", String(equipment.length)).replace("{services}", String(services.length));
  return (
    <section aria-labelledby="hero-title" className="bg-paper">
      <Container className="grid-12 pt-8 pb-16 md:pt-16 md:pb-24">
        <Heading as="h1" size="xl" id="hero-title" className="col-span-12 mb-6 md:mb-16">
          {h.title}
        </Heading>

        <div className="col-span-12 flex flex-col max-md:contents md:col-span-5 lg:col-span-4">
          <p className="m-0 max-w-[24em] text-statement max-md:order-1 max-md:col-span-12">{lede}</p>

          <nav aria-labelledby="router-title" className="mt-12 max-md:order-3 max-md:col-span-12">
            <h2 id="router-title" className="mb-3 font-sans text-ui font-semibold tracking-normal">
              {h.routerTitle}
            </h2>
            <ol className="m-0 list-none border-t border-ink p-0">
              {h.router.map((item) => (
                <li key={item.slug}>
                  <Link
                    href={localePath(locale, `/oferta/${item.slug}`)}
                    className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 border-b border-rule py-[13px] no-underline"
                  >
                    <span className="text-ui transition-colors group-hover:text-burgundy">{item.q}</span>
                    <span className="col-start-1 text-small text-steel">{item.to}</span>
                    <ArrowRight
                      aria-hidden
                      className="col-start-2 row-span-2 row-start-1 size-4 self-center text-burgundy"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              ))}
            </ol>
            <p className="mt-5 flex flex-wrap gap-x-6 gap-y-2">
              <Button variant="link" href={localePath(locale, "/oferta")}>
                {h.allServices}
              </Button>
              <Button variant="link" href={localePath(locale, "/infrastruktura")}>
                {h.catalog}
              </Button>
            </p>
          </nav>
        </div>

        <Figure
          src="/gallery/HA705863-scaled.jpg"
          alt={h.heroAlt}
          number={1}
          caption={
            <>
              {h.heroCaption}{" "}
              <Link href={localePath(locale, `/infrastruktura/${HERO_EQUIPMENT}`)}>{dict.common.equipmentCard}</Link>
            </>
          }
          aspect="16 / 10"
          position="58% 78%"
          sizes="(min-width: 768px) 66vw, 100vw"
          preload
          locale={locale}
          className="col-span-12 -mx-gutter max-md:order-2 max-md:mt-8 md:col-span-7 md:col-start-6 md:mx-0 md:-mr-gutter lg:col-span-8 lg:col-start-5 [&_figcaption]:px-gutter md:[&_figcaption]:pl-0"
        />
      </Container>

      <Container>
        <div className="flex flex-col gap-2 border-t border-rule pt-5 pb-6 text-ui text-ink-muted md:flex-row md:items-baseline md:justify-between md:gap-6">
          <p className="m-0">
            <PartnerList locale={locale} lead={dict.footer.partners} strongClass="font-medium text-ink" />
          </p>
          <p className="m-0">{site.address}</p>
        </div>
      </Container>
    </section>
  );
}
