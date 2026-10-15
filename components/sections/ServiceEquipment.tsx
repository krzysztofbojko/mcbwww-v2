import { meaningfulSpecs, type Equipment } from "@/content";
import { localePath, t, type Dictionary, type Locale } from "@/i18n";
import { Button, Heading, Rule, SpecList, Tag } from "@/components/ui";
import { EquipmentTable } from "./EquipmentTable";

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
              <Heading as="h3" size="m" className="max-w-[14em]">
                {flagship.name}
              </Heading>
              {/* Status note under the name, not a kicker above it. */}
              <Tag className="mt-2 block">{d.flagshipTag}</Tag>
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
        <EquipmentTable
          items={rest}
          firstColumn={flagship ? d.otherEquipment : d.equipmentColumn}
          locale={locale}
          dict={dict}
          className="mt-12 md:mt-16"
        />
      ) : null}
    </>
  );
}
