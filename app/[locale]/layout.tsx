import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { getDictionary, isLocale, locales } from "@/i18n";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { jsonLdString, organizationJsonLd, siteUrl } from "@/lib/seo";
import { fontVariables } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

/** Browser UI tinted with the paper ground. */
export const viewport: Viewport = { themeColor: "#f4f1eb" };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = await getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: dict.site.short, template: `%s — ${dict.site.short}` },
    description: dict.home.metaDescription,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = await getDictionary(locale);
  return (
    <html lang={locale} className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-ui text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {dict.common.skipToContent}
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(organizationJsonLd(locale)) }} />
        <SiteHeader locale={locale} dict={dict} />
        <div className="flex-1">{children}</div>
        <SiteFooter locale={locale} dict={dict} />
      </body>
    </html>
  );
}
