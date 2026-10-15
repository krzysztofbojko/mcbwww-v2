import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // The root layout sits under [locale], so unmatched URLs need app/global-not-found.tsx to get the site 404.
    globalNotFound: true,
  },
};

export default nextConfig;
