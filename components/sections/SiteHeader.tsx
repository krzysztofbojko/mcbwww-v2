import Link from "next/link";
import { site } from "@/content";
import { localePath, type Dictionary, type Locale } from "@/i18n";
import { Button, Container } from "@/components/ui";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import { mainNav } from "./nav";

/** Wordmark, six sections, PL / EN and the one burgundy action. Below lg the links fold into MobileNav. */
export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = mainNav(locale, dict);
  const home = localePath(locale, "/");
  const cta = { href: localePath(locale, "/kontakt"), label: dict.header.cta };
  return (
    <header className="bg-paper text-ink">
      <Container className="flex items-center gap-6 py-4 lg:py-5 xl:gap-8">
        <Link
          href={home}
          aria-label={dict.header.home}
          className="mr-auto flex items-baseline gap-3 no-underline"
        >
          <span translate="no" className="font-display text-statement leading-none font-bold tracking-[-0.01em] text-burgundy">
            MCB
          </span>
          <span className="max-w-[15em] text-small leading-tight text-ink-muted max-xl:hidden">{dict.site.name}</span>
        </Link>
        <NavLinks items={items} label={dict.header.mainNav} className="max-lg:hidden" />
        <LocaleSwitcher
          locale={locale}
          label={dict.common.languageSwitcher}
          names={dict.localeSwitcher}
          className="max-lg:hidden"
        />
        <Button variant="primary" href={cta.href} className="max-lg:hidden">
          {cta.label}
        </Button>
        <MobileNav
          className="lg:hidden"
          locale={locale}
          items={items}
          homeHref={home}
          cta={cta}
          labels={{
            menu: dict.header.menu,
            close: dict.header.close,
            title: dict.header.menuTitle,
            nav: dict.header.mainNav,
            home: dict.header.home,
            language: dict.common.languageSwitcher,
          }}
          languageNames={dict.localeSwitcher}
          contact={{ phone: site.phone, email: site.email }}
        />
      </Container>
    </header>
  );
}
