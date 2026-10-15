/**
 * Build-time check for SITE_URL. Every page, sitemap.xml and robots.txt are prerendered,
 * so the origin is baked into the build: a production build without it would ship localhost URLs.
 * Returns an error message, or null when the value is an absolute http(s) URL.
 */
export function siteUrlBuildError(value: string | undefined): string | null {
  const raw = value?.trim();
  const hint =
    "SITE_URL is baked into the build (canonical, hreflang, sitemap, robots, Open Graph, JSON-LD). " +
    "Set it when building, e.g. `SITE_URL=https://mcb.uksw.edu.pl npm run build`, " +
    "`SITE_URL=http://localhost:3000 npm run build` locally, or SITE_URL in .env next to docker-compose.yml.";
  if (!raw) return `SITE_URL is not set. ${hint}`;
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return `SITE_URL "${raw}" is not an absolute URL. ${hint}`;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return `SITE_URL "${raw}" must use http or https. ${hint}`;
  }
  return null;
}
