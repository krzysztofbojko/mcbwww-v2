import Link from "next/link";
import { site } from "@/content";
import { type Dictionary, type Locale } from "@/i18n";
import { Container } from "@/components/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { mainNav } from "./nav";
import { PartnerList } from "./PartnerList";

/** Ink field: address, sections, phone / e-mail, partners in one sentence, and the name at full width. */
export function SiteFooter({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = mainNav(locale, dict);
  return (
    <footer data-tone="ink" className="overflow-hidden bg-ink pt-16 pb-6 text-paper md:pt-24">
      <Container>
        <div className="grid-12 gap-y-8 text-ui leading-[1.7]">
          <div className="col-span-12 md:col-span-5">
            <p className="m-0">
              {dict.footer.centre}
              <br />
              <span className="text-ink-subtle">{dict.footer.university}</span>
            </p>
            <p className="mt-3 text-ink-subtle">{site.address}</p>
          </div>
          <nav aria-label={dict.footer.navLabel} className="col-span-12 md:col-span-3">
            <ul className="m-0 list-none p-0">
              {items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="no-underline hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="col-span-12 md:col-span-4">
            <p className="m-0">
              <a href={`tel:${site.phone.replace(/\s/g, "")}`}>{site.phone}</a>
              <br />
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </p>
            <p className="mt-3 text-ink-subtle">
              <PartnerList locale={locale} lead={dict.footer.partners} strongClass="font-normal text-paper" />
            </p>
            <LocaleSwitcher
              locale={locale}
              label={dict.common.languageSwitcher}
              names={dict.localeSwitcher}
              tone="ink"
              className="mt-3"
            />
          </div>
        </div>
        <p
          aria-hidden
          translate="no"
          className="mt-16 mb-0 font-display text-[min(18vw,16.5rem)] leading-[0.9] font-medium tracking-[-0.035em] whitespace-nowrap md:mt-24"
        >
          {dict.site.short}
        </p>
      </Container>
    </footer>
  );
}
