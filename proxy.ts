import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/i18n/config";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const first = pathname.split("/")[1] ?? "";
  if (isLocale(first)) return NextResponse.next();
  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === "/" ? "" : pathname}`;
  url.search = search;
  return NextResponse.redirect(url, 307);
}

export const config = {
  // Skip /api and /_next (whole segments only) and files: a last segment ending in an extension that starts with a letter
  // (.ico, .txt, .jpg, .woff2). "/oferta/v1.0" or "/v1.0/oferta" are pages and still get the locale redirect.
  matcher: ["/((?!(?:api|_next)(?:/|$)|.*\\.[a-zA-Z][a-zA-Z0-9]*$).*)"],
};
