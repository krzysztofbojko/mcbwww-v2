import { localePath, type Dictionary, type Locale } from "@/i18n";
import { Button, Heading, Section } from "@/components/ui";

const pages = ["oferta", "infrastruktura", "projekty", "publikacje"] as const;

/**
 * The 404 body. A not-found page receives no params, so it cannot know the locale: the message is given
 * in Polish first, then English, each with its own way back. Renders <main id="main"> for the skip link.
 */
export function NotFoundContent({ pl, en }: { pl: Dictionary; en: Dictionary }) {
  return (
    <main id="main">
      <Section tone="paper" space="loose" aria-labelledby="not-found-title" className="md:pt-20">
        <div className="grid-12 gap-y-14">
          <Block locale="pl" dict={pl} primary className="col-span-12 md:col-span-6" />
          <Block locale="en" dict={en} className="col-span-12 md:col-span-5 md:col-start-8 md:pt-4" />
        </div>
      </Section>
    </main>
  );
}

function Block({
  locale,
  dict,
  primary,
  className,
}: {
  locale: Locale;
  dict: Dictionary;
  primary?: boolean;
  className?: string;
}) {
  const d = dict.notFound;
  return (
    <div lang={locale} className={className}>
      {primary ? (
        <Heading as="h1" size="l" id="not-found-title">
          {d.title}
        </Heading>
      ) : (
        <Heading as="p" size="m" className="m-0">
          {d.title}
        </Heading>
      )}
      <p className={primary ? "mt-6 mb-0 max-w-[30em] text-statement" : "mt-4 mb-0 max-w-[30em] text-body text-ink-muted"}>
        {d.body}
      </p>
      <Button variant={primary ? "primary" : "ghost"} href={localePath(locale, "/")} arrow className="mt-8">
        {d.back}
      </Button>
      <nav aria-label={d.links} className="mt-12">
        <p className="mb-3 text-small text-ink-muted">{d.links}</p>
        <ul className="m-0 list-none border-t border-ink p-0">
          {pages.map((key) => (
            <li key={key} className="border-b border-rule">
              <a
                href={localePath(locale, `/${key}`)}
                className="block py-3 text-ui no-underline transition-colors hover:text-burgundy"
              >
                {dict.nav[key]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
