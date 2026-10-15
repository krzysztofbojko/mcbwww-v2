import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Stateless arithmetic captcha, ported from v1 (lib/captcha.ts): an HMAC-signed token
 * that carries only a salt and an expiry (never the answer), valid for 5 minutes and usable for one attempt.
 * Changes from v1: the secret is read from CAPTCHA_SECRET on every call (so it is never baked in at build time),
 * production refuses to run without it, a wrong answer also spends the token, and the question can be asked in English.
 */

const CAPTCHA_TTL_SECONDS = 5 * 60;

/**
 * Development only: a random per-process secret, so `npm run dev` works without an .env file.
 * Kept on globalThis: /api/captcha and /api/contact are separate bundles, each with its own copy of this module,
 * and a per-module secret would make every token fail verification in the other route.
 */
const DEV_SECRET_KEY = Symbol.for("mcb.captcha.devSecret");
function devSecret(): string {
  const g = globalThis as Record<symbol, string | undefined>;
  return (g[DEV_SECRET_KEY] ??= randomBytes(32).toString("hex"));
}

export class CaptchaNotConfiguredError extends Error {
  constructor() {
    super("Captcha is not configured: set CAPTCHA_SECRET");
    this.name = "CaptchaNotConfiguredError";
  }
}

function getSecret(): string | null {
  const fromEnv = process.env.CAPTCHA_SECRET;
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production" ? null : devSecret();
}

/** False in production when CAPTCHA_SECRET is missing; the API then answers „not_configured”. */
export function isCaptchaConfigured(): boolean {
  return getSecret() !== null;
}

type CaptchaPayload = {
  salt: string;
  exp: number;
};

/** Upper bound on remembered signatures; when full, expired ones go first, then the oldest. */
export const MAX_USED_SIGNATURES = 10_000;

// Spent signatures of GENUINE tokens (HMAC verified), kept until they expire. Shared across route bundles for
// the same reason as the dev secret. Insertion order = age, so the first key is the oldest.
const USED_KEY = Symbol.for("mcb.captcha.usedSignatures");
const usedSignatures: Map<string, number> = ((globalThis as Record<symbol, Map<string, number> | undefined>)[USED_KEY] ??=
  new Map<string, number>());

/** For tests and diagnostics. */
export function usedSignatureCount(): number {
  return usedSignatures.size;
}

function cleanExpiredTokens() {
  const now = Math.floor(Date.now() / 1000);
  for (const [sig, exp] of usedSignatures.entries()) {
    if (exp < now) usedSignatures.delete(sig);
  }
}

function recordUsed(signature: string, exp: number) {
  if (usedSignatures.size >= MAX_USED_SIGNATURES) cleanExpiredTokens();
  while (usedSignatures.size >= MAX_USED_SIGNATURES) {
    const oldest = usedSignatures.keys().next().value;
    if (oldest === undefined) break;
    usedSignatures.delete(oldest);
  }
  usedSignatures.set(signature, exp);
}

/** Every answer the captcha can have: a, b ∈ 1..9. */
const POSSIBLE_SUMS = Array.from({ length: 17 }, (_, i) => i + 2);

function encode(value: string) {
  return Buffer.from(value).toString("base64url");
}

function computeSignature(secret: string, salt: string, exp: number, answer: number | string) {
  return createHmac("sha256", secret).update(`${salt}:${exp}:${Number(answer)}`).digest("base64url");
}

export function createCaptcha(locale: "pl" | "en" = "pl") {
  const secret = getSecret();
  if (secret === null) throw new CaptchaNotConfiguredError();
  const a = Math.floor(Math.random() * 9) + 1;
  const b = Math.floor(Math.random() * 9) + 1;
  const exp = Math.floor(Date.now() / 1000) + CAPTCHA_TTL_SECONDS;
  const salt = randomBytes(16).toString("hex");

  // The payload holds neither the sum nor its terms.
  const payload: CaptchaPayload = { salt, exp };
  const encoded = encode(JSON.stringify(payload));
  const signature = computeSignature(secret, salt, exp, a + b);

  return {
    question: locale === "en" ? `What is ${a} + ${b}?` : `Ile wynosi ${a} + ${b}?`,
    token: `${encoded}.${signature}`,
  };
}

export function verifyCaptcha(token: unknown, answer: unknown): boolean {
  if (typeof token !== "string" || typeof answer !== "string") return false;
  const secret = getSecret();
  if (secret === null) return false;

  const trimmedAnswer = answer.trim();
  if (!/^\d+$/.test(trimmedAnswer)) return false;

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  // Each genuine token gets one attempt.
  if (usedSignatures.has(signature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as CaptchaPayload;
    if (typeof payload?.salt !== "string" || !payload.salt || typeof payload.exp !== "number") return false;

    // Expired, or further in the future than any token we issue: reject before recording anything.
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now || payload.exp > now + CAPTCHA_TTL_SECONDS) return false;

    // Which sum was this token signed for? Checking all 17 possible sums tells a genuine token (exactly one match)
    // from a forged one (none). Forged tokens are rejected without being remembered, so they cannot grow the store.
    const receivedBuf = Buffer.from(signature);
    // All 17 are always computed (no early exit), so the timing does not reveal the signed sum.
    let signedSum: number | undefined;
    for (const sum of POSSIBLE_SUMS) {
      const expectedBuf = Buffer.from(computeSignature(secret, payload.salt, payload.exp, sum));
      if (expectedBuf.length === receivedBuf.length && timingSafeEqual(expectedBuf, receivedBuf)) signedSum = sum;
    }
    if (signedSum === undefined) return false;

    // Genuine: any attempt spends it, right or wrong (security ruling, deviation from v1), so a bot cannot
    // try every sum against one token.
    recordUsed(signature, payload.exp);
    return Number(trimmedAnswer) === signedSum;
  } catch {
    return false;
  }
}
