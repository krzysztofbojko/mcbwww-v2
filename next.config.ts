import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // The OG image route reads the font at runtime via process.cwd(); make sure the standalone trace always ships it.
  outputFileTracingIncludes: {
    "/*/opengraph-image": ["./assets/fonts/**/*"],
  },
  experimental: {
    // The root layout sits under [locale], so unmatched URLs need app/global-not-found.tsx to get the site 404.
    globalNotFound: true,
  },
};

export default nextConfig;
