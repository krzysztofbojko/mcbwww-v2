import { site } from "@/content";
import { t, type Dictionary, type Locale } from "@/i18n";
import { Heading, SpecList } from "@/components/ui";

/**
 * „Science to Business”: who we are, then the centre's figures as a quiet datasheet.
 * Deliberately not a row of big animated numbers (direction.md: no „90+ / 3,7 PB / 56” section).
 */
export function AboutBlock({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="grid-12 gap-y-10">
      <div className="col-span-12 md:col-span-5">
        <Heading as="h2" size="l" id="about-title">
          {t(site.about.title, locale)}
        </Heading>
        <p className="mt-6 mb-0 max-w-[26em] text-statement">{t(site.about.description, locale)}</p>
      </div>
      <div className="col-span-12 md:col-span-6 md:col-start-7">
        <p className="m-0 max-w-[38em] text-ui text-ink-muted">{t(site.about.details, locale)}</p>
        <h3 className="mt-10 mb-3 font-sans text-ui font-semibold tracking-normal">{dict.home.aboutFactsLabel}</h3>
        <SpecList
          topRule="ink"
          items={site.stats.map((s) => ({
            label: t(s.label, locale),
            value: (
              <>
                {t(s.value, locale)}
                <span className="mt-0.5 block font-sans text-small text-ink-muted [font-feature-settings:normal]">{t(s.desc, locale)}</span>
              </>
            ),
          }))}
        />
      </div>
    </div>
  );
}
