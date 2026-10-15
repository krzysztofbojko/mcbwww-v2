import { Fragment, Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { experts, site } from "@/content";
import { contactTopics, GENERAL_TOPIC_COUNT } from "@/lib/contact";
import { pageMetadata } from "@/lib/seo";
import { getDictionary, isLocale, t } from "@/i18n";
import { Figure, Heading, Section } from "@/components/ui";
import { ContactForm, ContactFormFromQuery, type ContactFormProps } from "@/components/sections/ContactForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return pageMetadata({ locale, path: "/kontakt", title: dict.contact.metaTitle, description: dict.contact.metaDescription });
}

/** Mockup 06: building photo across the page, the burgundy field with the form, then every MCB expert. */
export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  const s = dict.contact;
  const options = contactTopics.map((topic) => ({ id: topic.id, label: t(topic.label, locale) }));
  const formProps: ContactFormProps = {
    locale,
    strings: s,
    topics: { general: options.slice(0, GENERAL_TOPIC_COUNT), services: options.slice(GENERAL_TOPIC_COUNT) },
    office: { email: site.email, phone: site.phone },
  };
  // „ul. …, 05-092 …” → one line per comma-separated part, however many there are.
  const addressLines = site.address.split(/,\s*/).filter(Boolean);

  return (
    <main id="main">
      {/* Mobile 3:2, desktop the mockup's wide band; the variable feeds Figure's aspect-ratio. */}
      <Figure
        src="/images/tlo-glowna.jpg"
        alt={s.buildingAlt}
        aspect="var(--plate-aspect)"
        position="50% 58%"
        sizes="100vw"
        preload
        locale={locale}
        className="[--plate-aspect:3/2] md:[--plate-aspect:1440/515]"
      />

      <Section tone="burgundy" space="loose" aria-labelledby="kontakt-title">
        <div className="grid-12 gap-y-14">
          <div className="col-span-12 md:col-span-5">
            <Heading as="h1" size="l" id="kontakt-title">
              {s.title}
            </Heading>
            <p className="mt-6 mb-0 max-w-[30em] text-statement text-burgundy-tint">{s.lede}</p>
            <dl
              aria-label={s.detailsLabel}
              className="mt-10 grid grid-cols-1 gap-x-6 border-t border-paper/35 pt-8 text-ui sm:grid-cols-[7em_1fr] sm:gap-y-4"
            >
              <dt className="text-burgundy-tint">{s.address}</dt>
              <dd className="m-0 mb-4 font-display text-display-s sm:mb-0">
                {addressLines.map((line, i) => (
                  <Fragment key={i}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </dd>
              <dt className="text-burgundy-tint">{s.phone}</dt>
              <dd className="m-0 mb-4 sm:mb-0">
                <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              </dd>
              <dt className="text-burgundy-tint">{s.email}</dt>
              <dd className="m-0">
                <a href={`mailto:${site.email}`}>{site.email}</a>
              </dd>
            </dl>
          </div>
          <div className="col-span-12 md:col-span-6 md:col-start-7">
            {/* useSearchParams (?temat=) opts the form into client rendering; the fallback prerenders it with „Inne”. */}
            <Suspense fallback={<ContactForm {...formProps} />}>
              <ContactFormFromQuery {...formProps} />
            </Suspense>
          </div>
        </div>
      </Section>

      <Section id="eksperci" tone="paper" space="loose" aria-labelledby="eksperci-title" className="scroll-mt-14">
        <div className="grid-12 gap-y-10">
          <div className="col-span-12 md:col-span-4">
            <Heading as="h2" size="m" id="eksperci-title">
              {s.expertsTitle}
            </Heading>
            <p className="mt-5 mb-0 max-w-[30em] text-body text-ink-muted">{s.expertsLede}</p>
          </div>
          <ul className="col-span-12 m-0 grid list-none grid-cols-1 gap-x-10 gap-y-9 p-0 sm:grid-cols-2 md:col-span-7 md:col-start-6">
            {experts.map((e) => (
              <li key={e.id}>
                <Heading as="p" size="s">
                  {e.name}
                </Heading>
                <p className="mt-2 mb-0 text-ui text-ink-muted">{t(e.role, locale)}</p>
                <p className="mt-3 mb-0 text-ui">
                  <a href={`mailto:${e.email}`} className="break-all">
                    {e.email}
                  </a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    </main>
  );
}
