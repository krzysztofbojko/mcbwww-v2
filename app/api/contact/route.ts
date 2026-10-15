import { NextResponse } from "next/server";
import { Resend } from "resend";
import { isCaptchaConfigured, verifyCaptcha } from "@/lib/captcha";
import { MAX_BODY_BYTES, readBodyLimited, buildEmailHtml, buildSubject, validateContact, type ContactApiError } from "@/lib/contact";

export const dynamic = "force-dynamic";

function fail(error: ContactApiError, status: number) {
  return NextResponse.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

/**
 * POST /api/contact (JSON). Every enquiry goes to ONE central MCB inbox (CONTACT_TO); the office routes it.
 * 400 bad_request | required | email | too_long | captcha · 503 not_configured · 500 send_failed · 200 { ok: true }.
 */
export async function POST(request: Request) {
  let raw: string | null;
  try {
    raw = await readBodyLimited(request, MAX_BODY_BYTES);
  } catch {
    return fail("bad_request", 400);
  }
  if (raw === null) return fail("too_long", 400);

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return fail("bad_request", 400);
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return fail("bad_request", 400);

  const result = validateContact(body);
  if (!result.ok) return fail(result.error, 400);
  const data = result.data;

  if (!isCaptchaConfigured()) return fail("not_configured", 503);
  if (!verifyCaptcha(data.captchaToken, data.captchaAnswer)) return fail("captcha", 400);

  const apiKey = process.env.RESEND_API_KEY;
  const to = (process.env.CONTACT_TO ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const from = process.env.CONTACT_FROM;
  if (!apiKey || to.length === 0 || !from) return fail("not_configured", 503);

  try {
    const { error } = await new Resend(apiKey).emails.send({
      from,
      to,
      replyTo: data.email,
      subject: buildSubject(data),
      html: buildEmailHtml(data),
    });
    if (error) {
      console.error("[contact] Resend error:", error.name, error.message);
      return fail("send_failed", 500);
    }
  } catch (e) {
    console.error("[contact] send failed:", e instanceof Error ? e.message : e);
    return fail("send_failed", 500);
  }
  return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
