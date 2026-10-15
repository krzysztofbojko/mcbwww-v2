import { describe, expect, it } from "vitest";
import { organizationJsonLd, pageMetadata, serviceJsonLd, siteUrl, jsonLdString } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import { equipment, services } from "@/content";

describe("siteUrl", () => {
  it("defaults to localhost and strips the trailing slash", () => {
    const prev = process.env.SITE_URL;
    delete process.env.SITE_URL;
    expect(siteUrl()).toBe("http://localhost:3000");
    process.env.SITE_URL = "https://mcb.example.pl/";
    expect(siteUrl()).toBe("https://mcb.example.pl");
    if (prev === undefined) delete process.env.SITE_URL;
    else process.env.SITE_URL = prev;
  });
});

describe("pageMetadata", () => {
  const m = pageMetadata({ locale: "en", path: "/oferta", title: "Services", description: "Desc" });
  it("sets canonical and hreflang alternates", () => {
    expect(m.alternates?.canonical).toBe("http://localhost:3000/en/oferta");
    expect(m.alternates?.languages).toEqual({
      pl: "http://localhost:3000/pl/oferta",
      en: "http://localhost:3000/en/oferta",
      "x-default": "http://localhost:3000/pl/oferta",
    });
  });
  it("sets Open Graph and Twitter", () => {
    expect(m.openGraph).toMatchObject({ url: "http://localhost:3000/en/oferta", locale: "en_GB", type: "website" });
    expect(m.twitter).toMatchObject({ card: "summary_large_image" });
  });
  it("home path has no trailing slash", () => {
    const h = pageMetadata({ locale: "pl", path: "", title: "x", description: "y" });
    expect(h.alternates?.canonical).toBe("http://localhost:3000/pl");
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Json = Record<string, any>;

describe("JSON-LD", () => {
  it("describes the organization with its parent", () => {
    const o = organizationJsonLd("pl") as Json;
    expect(o["@type"]).toBe("ResearchOrganization");
    expect(o.address["@type"]).toBe("PostalAddress");
    expect(o.address.postalCode).toBe("05-092");
    expect(o.parentOrganization.url).toBe("https://uksw.edu.pl");
  });
  it("describes a service with the organization as provider", () => {
    const s = serviceJsonLd(services[0], "en") as Json;
    expect(s["@type"]).toBe("Service");
    expect(s.provider["@type"]).toBe("ResearchOrganization");
  });
  it("escapes < so a script tag cannot be closed early", () => {
    expect(jsonLdString({ a: "</script><b>" })).not.toContain("<");
    expect(JSON.parse(jsonLdString({ a: "</script>" })).a).toBe("</script>");
  });
});

describe("sitemap", () => {
  const entries = sitemap();
  const urls = entries.map((e) => e.url);
  it("has 2 x (7 static + services + equipment) entries", () => {
    expect(services).toHaveLength(13);
    expect(equipment).toHaveLength(56);
    expect(entries).toHaveLength(152);
    expect(new Set(urls).size).toBe(152);
  });
  it("includes every slug in both locales with alternates", () => {
    for (const s of services) expect(urls).toContain(`http://localhost:3000/pl/oferta/${s.slug}`);
    for (const e of equipment) expect(urls).toContain(`http://localhost:3000/en/infrastruktura/${e.slug}`);
    const home = entries.find((e) => e.url === "http://localhost:3000/pl");
    expect(home?.alternates?.languages).toMatchObject({ pl: "http://localhost:3000/pl", en: "http://localhost:3000/en" });
  });
  it("excludes the styleguide", () => {
    expect(urls.some((u) => u.includes("styleguide"))).toBe(false);
  });
});
