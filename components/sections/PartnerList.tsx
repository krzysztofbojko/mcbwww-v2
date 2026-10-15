import { site } from "@/content";
import type { Locale } from "@/i18n";

/** „Współpracujemy m.in. z KGHM…, PGE…, Termocent i Geocom.” — partners in one sentence, never a logo ticker. */
export function PartnerList({ locale, lead, strongClass }: { locale: Locale; lead: string; strongClass: string }) {
  const parts = new Intl.ListFormat(locale, { style: "long", type: "conjunction" }).formatToParts(site.partners);
  return (
    <>
      {lead}{" "}
      {parts.map((p, i) =>
        p.type === "element" ? (
          <strong key={i} className={strongClass}>
            {p.value}
          </strong>
        ) : (
          <span key={i}>{p.value}</span>
        ),
      )}
      .
    </>
  );
}
