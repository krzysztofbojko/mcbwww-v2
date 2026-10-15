import { describe, expect, it } from "vitest";
import * as staticInfo from "next/dist/build/analysis/get-page-static-info";
import { config } from "@/proxy";

// Compile the matcher exactly as Next does, so the test sees the same regex the server uses.
// getMiddlewareMatchers is exported at runtime but missing from Next's type declarations.
const { getMiddlewareMatchers } = staticInfo as unknown as {
  getMiddlewareMatchers: (matcher: string[], nextConfig: object) => { regexp: string }[];
};
const matchers = getMiddlewareMatchers(config.matcher, {});
const runsProxy = (path: string) => matchers.some((m) => new RegExp(m.regexp).test(path));

describe("proxy matcher", () => {
  it("runs on page paths, including ones with a dot in an earlier segment or mid-path", () => {
    for (const p of ["/", "/oferta", "/oferta/v1.0", "/v1.0/oferta", "/apiary", "/next-steps", "/pl/kontakt"]) {
      expect(runsProxy(p), p).toBe(true);
    }
  });
  it("skips /api, /_next and files (a dot in the last segment)", () => {
    for (const p of ["/api", "/api/contact", "/_next/static/chunks/a.js", "/favicon.ico", "/robots.txt", "/gallery/HA705863-scaled.jpg"]) {
      expect(runsProxy(p), p).toBe(false);
    }
  });
});
