import type { NextConfig } from "next";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { siteUrlBuildError } from "./lib/site-url-check";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Only frame-ancestors: a full CSP would have to allow next/font, next/image and inline runtime scripts.
  { key: "Content-Security-Policy", value: "frame-ancestors 'self'" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  // The OG image route reads the font at runtime via process.cwd(); make sure the standalone trace always ships it.
  outputFileTracingIncludes: {
    "/*/opengraph-image": ["./assets/fonts/**/*"],
  },
  experimental: {
    // The root layout sits under [locale], so unmatched URLs need app/global-not-found.tsx to get the site 404.
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default function config(phase: string): NextConfig {
  // SITE_URL is read at build time (all pages, sitemap and robots are prerendered), so a production build must have it.
  if (phase === PHASE_PRODUCTION_BUILD && process.env.NODE_ENV === "production" && !process.env.VITEST) {
    const error = siteUrlBuildError(process.env.SITE_URL);
    if (error) throw new Error(error);
  }
  return nextConfig;
}
