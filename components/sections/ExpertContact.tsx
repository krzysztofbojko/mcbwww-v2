import { site, type Expert } from "@/content";
import { localePath, t, type Dictionary, type Locale } from "@/i18n";
import { Button, Heading } from "@/components/ui";

export interface ExpertContactProps {
  experts: Expert[];
  serviceSlug: string;
  locale: Locale;
  dict: Dictionary;
}

/**
 * „Kto prowadzi usługę”: the named expert(s) with e-mail and the MCB office phone, and one enquiry action
 * that opens the contact form with the service filled in. No experts ⇒ the general MCB contact from `site`.
 */
export function ExpertContact({ experts, serviceSlug, locale, dict }: ExpertContactProps) {
  const d = dict.service;
  const people =
    experts.length > 0
      ? experts.map((e) => ({ key: e.id, name: e.name, role: t(e.role, locale), email: e.email }))
      : [{ key: "mcb", name: d.officeName, role: d.officeRole, email: site.email }];
  const phoneHref = `tel:${site.phone.replace(/\s/g, "")}`;

  return (
    <div className="grid-12 gap-y-6">
      <Heading as="h2" size="m" id="ekspert-title" className="col-span-12 md:col-span-4">
        {d.whoTitle}
      </Heading>
      <div className="col-span-12 md:col-span-7 md:col-start-6">
        <ul className="m-0 flex list-none flex-col gap-10 p-0">
          {people.map((p) => (
            <li key={p.key}>
              <Heading as="p" size="l">
                {p.name}
              </Heading>
              <p className="mt-3 mb-0 max-w-[34em] text-ui text-ink-muted">{p.role}</p>
              <dl className="my-6 grid grid-cols-1 gap-x-4 border-y border-rule py-5 text-ui sm:grid-cols-[7em_1fr] sm:gap-y-3">
                <dt className="text-ink-muted">{d.email}</dt>
                <dd className="m-0 max-sm:mb-3">
                  <a href={`mailto:${p.email}`}>{p.email}</a>
                </dd>
                <dt className="text-ink-muted">{d.phone}</dt>
                <dd className="m-0">
                  <a href={phoneHref}>{site.phone}</a>
                  {experts.length > 0 ? <span className="text-small text-ink-muted"> {d.phoneNote}</span> : null}
                </dd>
              </dl>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button variant="primary" href={`${localePath(locale, "/kontakt")}?temat=${serviceSlug}`} arrow>
            {d.ask}
          </Button>
          <p className="m-0 max-w-[30em] text-small text-ink-muted">{d.routeNote}</p>
        </div>
      </div>
    </div>
  );
}
