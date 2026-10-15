import Link from "next/link";
import { equipment, getService, meaningfulSpecs } from "@/content";
import { localePath, t, type Dictionary, type Locale } from "@/i18n";
import { Button, Heading } from "@/components/ui";

/** The six flagship instruments as datasheet rows on the steel field: name, what it does, key values, service. */
export function FlagshipStrip({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = equipment.filter((e) => e.isFlagship);
  return (
    <>
      <div className="grid-12 mb-10 gap-y-4 md:mb-14 md:items-end">
        <Heading as="h2" size="l" id="flagship-title" className="col-span-12 md:col-span-6">
          {dict.home.flagshipTitle}
        </Heading>
        <div className="col-span-12 md:col-span-5 md:col-start-8">
          <p className="m-0 max-w-[34em] text-ui text-ink-muted">{dict.home.flagshipLede}</p>
          <Button variant="link" href={localePath(locale, "/infrastruktura")} className="mt-4">
            {dict.home.catalog}
          </Button>
        </div>
      </div>
      <ul className="m-0 list-none border-t border-ink p-0">
        {items.map((e) => {
          const service = getService(e.serviceSlug);
          const specs = meaningfulSpecs(e).slice(0, 2);
          return (
            <li key={e.slug} className="grid-12 gap-y-2 border-b border-rule-steel py-5">
              <div className="col-span-12 md:col-span-4">
                <Link
                  href={localePath(locale, `/infrastruktura/${e.slug}`)}
                  className="text-ui font-medium no-underline transition-colors hover:text-burgundy hover:underline"
                >
                  {e.name}
                </Link>
                {service ? (
                  <p className="m-0 text-small text-steel">
                    {dict.home.flagshipService}:{" "}
                    <Link href={localePath(locale, `/oferta/${service.slug}`)} className="text-steel hover:text-burgundy">
                      {t(service.title, locale)}
                    </Link>
                  </p>
                ) : null}
              </div>
              <p className="col-span-12 m-0 text-ui text-ink-muted md:col-span-4 md:col-start-6">
                {e.flagshipHighlight ? t(e.flagshipHighlight, locale) : null}
              </p>
              <ul className="col-span-12 m-0 list-none p-0 md:col-span-3 md:col-start-10">
                {specs.map((s) => (
                  <li key={s}>
                    <span className="spec text-steel">{s}</span>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
    </>
  );
}
