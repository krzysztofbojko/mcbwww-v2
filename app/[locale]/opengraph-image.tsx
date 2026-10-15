import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { getDictionary, isLocale, type Locale } from "@/i18n";

export const alt = "MCB UKSW";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return [{ locale: "pl" }, { locale: "en" }];
}

const COPY: Record<Locale, { kicker: string; line: string }> = {
  pl: { kicker: "Uniwersytet Kardynała Stefana Wyszyńskiego", line: "Badania i usługi laboratoryjne dla przemysłu" },
  en: { kicker: "Cardinal Stefan Wyszyński University", line: "Research and laboratory services for industry" },
};

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "pl";
  const dict = await getDictionary(locale);
  const font = await readFile(path.join(process.cwd(), "assets/fonts/Brygada1918.ttf"));
  const copy = COPY[locale];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#F4F1EB",
          color: "#1B1917",
          padding: "72px 80px",
          fontFamily: "Brygada",
          borderLeft: "24px solid #7C1E2D",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, color: "#7C1E2D", letterSpacing: 1 }}>{copy.kicker}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 150, lineHeight: 1, fontWeight: 400 }}>MCB UKSW</div>
          <div style={{ display: "flex", fontSize: 44, lineHeight: 1.25, marginTop: 28, maxWidth: 900 }}>{copy.line}</div>
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#5A544C" }}>{dict.site.name}</div>
      </div>
    ),
    { ...size, fonts: [{ name: "Brygada", data: font, style: "normal", weight: 400 }] },
  );
}
