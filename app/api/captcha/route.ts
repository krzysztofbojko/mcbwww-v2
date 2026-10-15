import { NextResponse } from "next/server";
import { createCaptcha, isCaptchaConfigured } from "@/lib/captcha";

export const dynamic = "force-dynamic";

const noStore = { "Cache-Control": "no-store" };

/** GET /api/captcha?locale=en → { question, token }. 503 „not_configured” when CAPTCHA_SECRET is missing in production. */
export async function GET(request: Request) {
  if (!isCaptchaConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503, headers: noStore });
  }
  const locale = new URL(request.url).searchParams.get("locale") === "en" ? "en" : "pl";
  return NextResponse.json(createCaptcha(locale), { headers: noStore });
}
