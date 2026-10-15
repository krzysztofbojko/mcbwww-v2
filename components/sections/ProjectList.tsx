import type { Project } from "@/content";
import type { Dictionary, Locale } from "@/i18n";
import { formatBudget, formatPeriod, projectDescription } from "@/lib/publications";
import { ChevronRight } from "lucide-react";
import { SpecList } from "@/components/ui";

/**
 * One status group as a datasheet index: title and summary on the left,
 * a parameter card (investigator, funder, budget, timeline) on the right. The long description folds into <details>.
 */
export function ProjectList({ items, locale, dict }: { items: Project[]; locale: Locale; dict: Dictionary }) {
  const d = dict.projects;
  return (
    <ol className="m-0 list-none p-0">
      {items.map((p) => {
        const description = projectDescription(p);
        return (
          <li key={p.id} className="grid-12 gap-y-6 border-b border-rule py-10 md:py-12">
            <div className="col-span-12 lg:col-span-7">
              <h3 className="m-0 max-w-[30em] text-statement">{p.title}</h3>
              <p className="mt-4 mb-0 max-w-[62ch] text-ui">{p.summary}</p>
              {description ? (
                <details className="group mt-4 max-w-[62ch]">
                  <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-ui text-burgundy hover:text-burgundy-deep [&::-webkit-details-marker]:hidden">
                    <ChevronRight
                      aria-hidden
                      strokeWidth={1.5}
                      className="size-4 transition-transform duration-[var(--dur-ui)] group-open:rotate-90 motion-reduce:transition-none"
                    />
                    {d.more}
                  </summary>
                  <p className="mt-3 mb-0 text-ui text-ink-muted">{description}</p>
                </details>
              ) : null}
            </div>
            <SpecList
              // Beside the text (lg+) the row's hairline is the sheet's top edge; stacked below it needs its own ink rule.
              className="col-span-12 max-lg:border-t max-lg:border-ink lg:col-span-4 lg:col-start-9"
              topRule="none"
              items={[
                { label: d.lead, value: p.lead, text: true },
                { label: d.funding, value: p.funding, text: true },
                { label: d.budget, value: formatBudget(p.budget, locale) },
                { label: d.period, value: formatPeriod(p.period) },
              ]}
            />
          </li>
        );
      })}
    </ol>
  );
}
