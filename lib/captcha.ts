import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Stateless arithmetic captcha, ported from v1 (lib/captcha.ts) with the same logic: an HMAC-signed token
 * that carries only a salt and an expiry (never the answer), valid for 5 minutes and accepted once.
 * Changes from v1: the secret is read from CAPTCHA_SECRET on every call (so it is never baked in at build time),
 * production refuses to run without it, and the question can be asked in English.
 */

const CAPTCHA_TTL_SECONDS = 5 * 60;

/** Development only: a random per-process secret, so `npm run dev` works without an .env file. */
const DEV_RUNTIME_SECRET = randomBytes(32).toString("hex");

export class CaptchaNotConfiguredError extends Error {
  constructor() {
    super("Captcha is not configured: set CAPTCHA_SECRET");
    this.name = "CaptchaNotConfiguredError";
  }
}

function getSecret(): string | null {
  const fromEnv = process.env.CAPTCHA_SECRET;
  if (fromEnv) return fromEnv;
  return process.env.NODE_ENV === "production" ? null : DEV_RUNTIME_SECRET;
}

/** False in production when CAPTCHA_SECRET is missing; the API then answers „not_configured”. */
export function isCaptchaConfigured(): boolean {
  return getSecret() !== null;
}

type CaptchaPayload = {
  salt: string;
  exp: number;
};

// Used signatures, kept until they expire: protects against replaying a solved token.
const usedSignatures = new Map<string, number>();

function cleanExpiredTokens() {
  const now = Math.floor(Date.now() / 1000);
  for (const [sig, exp] of usedSignatures.entries()) {
    if (exp < now) usedSignatures.delete(sig);
  }
}

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

  cleanExpiredTokens();

  // Each solved token is accepted only once.
  if (usedSignatures.has(signature)) return false;

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString()) as CaptchaPayload;
    if (!payload.salt || typeof payload.exp !== "number") return false;

    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) return false;

    const expectedSignature = computeSignature(secret, payload.salt, payload.exp, trimmedAnswer);
    const expectedBuf = Buffer.from(expectedSignature);
    const receivedBuf = Buffer.from(signature);

    if (expectedBuf.length !== receivedBuf.length || !timingSafeEqual(expectedBuf, receivedBuf)) {
      return false;
    }

    usedSignatures.set(signature, payload.exp);
    return true;
  } catch {
    return false;
  }
}
