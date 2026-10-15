import { site } from "@/content";
import { t, type Dictionary, type Locale } from "@/i18n";

/** The Rector's words, set as a statement in the display face, attributed below. */
export function RectorQuote({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const q = site.rectorQuote;
  return (
    <div className="grid-12">
      <h2 id="quote-title" className="sr-only">
        {dict.home.quoteLabel}
      </h2>
      <figure className="col-span-12 m-0 md:col-span-9 md:col-start-3 lg:col-span-8 lg:col-start-4">
        <blockquote className="m-0 font-display text-statement">
          <p className="m-0">„{t(q.quote, locale)}”</p>
        </blockquote>
        <figcaption className="mt-6 text-ui">
          {q.author}
          <span className="block text-ink-muted">{t(q.title, locale)}</span>
        </figcaption>
      </figure>
    </div>
  );
}
