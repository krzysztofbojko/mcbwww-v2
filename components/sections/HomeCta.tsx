import { site } from "@/content";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import { Button, Heading } from "@/components/ui";

/** Closing invitation: no method or instrument name needed, the MCB office routes the enquiry. */
export function HomeCta({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <div className="grid-12 gap-y-8">
      <Heading as="h2" size="l" id="cta-title" className="col-span-12 md:col-span-6">
        {dict.home.ctaTitle}
      </Heading>
      <div className="col-span-12 md:col-span-5 md:col-start-8">
        <p className="m-0 max-w-[30em] text-statement">{dict.home.ctaBody}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Button variant="primary" href={localePath(locale, "/kontakt")} arrow>
            {dict.header.cta}
          </Button>
          <p className="m-0 text-small text-ink-muted">
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="text-ink">
              {site.phone}
            </a>
            {" · "}
            <a href={`mailto:${site.email}`} className="text-ink">
              {site.email}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
