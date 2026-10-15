import type { Metadata, Viewport } from "next";
import { getDictionary } from "@/i18n";
import { SiteFooter } from "@/components/sections/SiteFooter";
import { SiteHeader } from "@/components/sections/SiteHeader";
import { NotFoundContent } from "@/components/sections/NotFoundContent";
import { fontVariables } from "./fonts";
import "./globals.css";

export const viewport: Viewport = { themeColor: "#f4f1eb" };

export const metadata: Metadata = {
  title: "Nie znaleziono strony · Page not found · MCB UKSW",
};

/**
 * Unmatched URLs (e.g. /pl/oferta/nieistniejacy, rejected by dynamicParams = false) bypass the [locale] layout,
 * so this full document repeats it: Polish chrome (default locale) around the bilingual 404 body.
 */
export default async function GlobalNotFound() {
  const [pl, en] = await Promise.all([getDictionary("pl"), getDictionary("en")]);
  return (
    <html lang="pl" className={fontVariables}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-50 bg-ink px-4 py-3 text-ui text-paper focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          {pl.common.skipToContent}
        </a>
        <SiteHeader locale="pl" dict={pl} />
        <div className="flex-1">
          <NotFoundContent pl={pl} en={en} />
        </div>
        <SiteFooter locale="pl" dict={pl} />
      </body>
    </html>
  );
}
