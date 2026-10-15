import type { Project } from "@/content";
import type { Dictionary, Locale } from "@/i18n";
import { formatBudget, formatPeriod } from "@/lib/publications";
import { SpecList } from "@/components/ui";

/**
 * One status group as a datasheet index: title and summary on the left,
 * a parameter card (investigator, funder, budget, timeline) on the right. The long description folds into <details>.
 */
export function ProjectList({ items, locale, dict }: { items: Project[]; locale: Locale; dict: Dictionary }) {
  const d = dict.projects;
  return (
    <ol className="m-0 list-none p-0">
      {items.map((p) => (
        <li key={p.id} className="grid-12 gap-y-6 border-b border-rule py-10 md:py-12">
          <div className="col-span-12 md:col-span-7">
            <h3 className="m-0 max-w-[30em] text-statement">{p.title}</h3>
            <p className="mt-4 mb-0 max-w-[62ch] text-ui">{p.summary}</p>
            {p.description ? (
              <details className="group mt-4 max-w-[62ch]">
                <summary className="cursor-pointer text-ui text-burgundy marker:text-burgundy hover:text-burgundy-deep">
                  {d.more}
                </summary>
                <p className="mt-3 mb-0 text-ui text-ink-muted">{p.description}</p>
              </details>
            ) : null}
          </div>
          <SpecList
            // On desktop the row's hairline is the sheet's top edge; stacked on phones it needs its own ink rule.
            className="col-span-12 max-md:border-t max-md:border-ink md:col-span-4 md:col-start-9"
            topRule="none"
            items={[
              { label: d.lead, value: p.lead, text: true },
              { label: d.funding, value: p.funding, text: true },
              { label: d.budget, value: formatBudget(p.budget, locale) },
              { label: d.period, value: formatPeriod(p.period) },
            ]}
          />
        </li>
      ))}
    </ol>
  );
}
