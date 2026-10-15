import Link from "next/link";
import { meaningfulSpecs, type Equipment } from "@/content";
import { localePath, t, type Dictionary, type Locale } from "@/i18n";
import { Button, Heading, Rule, SpecList, Tag } from "@/components/ui";

/**
 * Mockup 03 (steel field): the service's flagship instrument as a datasheet, then the rest as a table.
 * Placeholder specs carried over from v1 are dropped (meaningfulSpecs); such rows show name + manufacturer only.
 */
export function ServiceEquipment({
  items,
  locale,
  dict,
}: {
  items: Equipment[];
  locale: Locale;
  dict: Dictionary;
}) {
  const d = dict.service;
  const flagship = items.find((e) => e.isFlagship);
  const rest = items.filter((e) => e !== flagship);
  const cardHref = (e: Equipment) => localePath(locale, `/infrastruktura/${e.slug}`);

  return (
    <>
      <div className="grid-12 gap-y-6">
        <Heading as="h2" size="m" id="aparatura-title" className="col-span-12 md:col-span-4">
          {d.equipmentTitle}
        </Heading>
        <p className="col-span-12 m-0 max-w-[34em] text-ui text-ink-muted md:col-span-6 md:col-start-6">
          {d.equipmentLede}
        </p>
      </div>

      {flagship ? (
        <div className="mt-12 md:mt-16">
          <Rule tone="ink" />
          <div className="grid-12 gap-y-6 pt-6">
            <div className="col-span-12 md:col-span-5">
              <Tag className="mb-3 block">{d.flagshipTag}</Tag>
              <Heading as="h3" size="m" className="max-w-[14em]">
                {flagship.name}
              </Heading>
              {flagship.flagshipHighlight ? (
                <p className="mt-4 mb-0 max-w-[24em] text-ui">{t(flagship.flagshipHighlight, locale)}</p>
              ) : null}
              {flagship.manufacturer ? (
                <p className="mt-2 mb-0 text-small text-ink-muted">
                  {d.manufacturer}: {flagship.manufacturer}
                </p>
              ) : null}
              <Button variant="link" href={cardHref(flagship)} className="mt-5">
                {dict.common.equipmentCard}
              </Button>
            </div>
            <SpecList
              tone="steel"
              topRule="none"
              items={meaningfulSpecs(flagship)}
              className="col-span-12 md:col-span-6 md:col-start-7"
            />
          </div>
        </div>
      ) : null}

      {rest.length > 0 ? (
        <table className="mt-12 w-full border-collapse text-ui max-md:border-t max-md:border-ink md:mt-16">
          <thead className="max-md:sr-only">
            <tr>
              {[flagship ? d.otherEquipment : d.equipmentColumn, d.manufacturer, d.specsColumn].map((h) => (
                <th
                  key={h}
                  scope="col"
                  className="border-b border-ink pr-4 pb-2 text-left text-small font-normal text-ink-muted"
                >
                  {h}
                </th>
              ))}
              <th scope="col" className="border-b border-ink pb-2">
                <span className="sr-only">{dict.common.equipmentCard}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rest.map((e) => {
              const specs = meaningfulSpecs(e);
              return (
                <tr
                  key={e.slug}
                  className="border-b border-rule-steel max-md:grid max-md:grid-cols-[1fr_auto] max-md:gap-x-4 max-md:py-3"
                >
                  <th
                    scope="row"
                    className="py-3.5 pr-4 text-left align-top font-normal [font-variant-numeric:normal] max-md:col-span-2 max-md:p-0 md:w-[46%]"
                  >
                    {e.name}
                  </th>
                  <td className="py-3.5 pr-4 align-top [font-variant-numeric:normal] max-md:col-start-1 max-md:p-0 max-md:text-small max-md:text-ink-muted max-md:empty:hidden">
                    {e.manufacturer ?? ""}
                  </td>
                  <td className="py-3.5 pr-4 align-top max-md:col-start-1 max-md:p-0 max-md:empty:hidden">
                    {specs.length > 0 ? <span className="spec text-steel">{specs.join(" · ")}</span> : null}
                  </td>
                  <td className="py-3.5 text-right align-top whitespace-nowrap max-md:col-start-2 max-md:row-start-2 max-md:self-end max-md:p-0">
                    <Link
                      href={cardHref(e)}
                      aria-label={d.cardOf.replace("{name}", e.name)}
                      className="text-burgundy hover:text-burgundy-deep"
                    >
                      {d.card}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : null}
    </>
  );
}
