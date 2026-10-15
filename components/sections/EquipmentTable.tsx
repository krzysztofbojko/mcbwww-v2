import Link from "next/link";
import { meaningfulSpecs, type Equipment } from "@/content";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import { cn } from "@/components/ui";

/**
 * Steel-field table of instruments (mockups 03 and 04): name, manufacturer, real specs in mono, link to the sheet.
 * Placeholder specs carried over from v1 are dropped (meaningfulSpecs). On phones each row stacks.
 */
export function EquipmentTable({
  items,
  firstColumn,
  locale,
  dict,
  className,
}: {
  items: Equipment[];
  /** Header of the name column, e.g. „Pozostała aparatura”. */
  firstColumn: string;
  locale: Locale;
  dict: Dictionary;
  className?: string;
}) {
  const d = dict.service;
  return (
    <table className={cn("w-full border-collapse text-ui max-md:border-t max-md:border-ink", className)}>
      <thead className="max-md:sr-only">
        <tr>
          {[firstColumn, d.manufacturer, d.specsColumn].map((h) => (
            <th key={h} scope="col" className="border-b border-ink pr-4 pb-2 text-left text-small font-normal text-ink-muted">
              {h}
            </th>
          ))}
          <th scope="col" className="border-b border-ink pb-2">
            <span className="sr-only">{dict.common.equipmentCard}</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {items.map((e) => {
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
                  href={localePath(locale, `/infrastruktura/${e.slug}`)}
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
  );
}
