import { createHmac } from "crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MAX_USED_SIGNATURES, createCaptcha, isCaptchaConfigured, usedSignatureCount, verifyCaptcha } from "@/lib/captcha";

afterEach(() => {
  vi.unstubAllEnvs();
});

function solve(question: string): string {
  const [a, b] = question.match(/\d+/g)!.map(Number);
  return String(a + b);
}

describe("captcha", () => {
  it("accepts the right answer once (no replay)", () => {
    const c = createCaptcha();
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(true);
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(false);
  });
  it("rejects wrong, non-numeric and malformed input", () => {
    expect(verifyCaptcha(createCaptcha().token, "abc")).toBe(false);
    const c = createCaptcha();
    expect(verifyCaptcha(c.token, String(Number(solve(c.question)) + 1))).toBe(false);
    expect(verifyCaptcha("garbage", "3")).toBe(false);
    expect(verifyCaptcha(undefined, "3")).toBe(false);
    expect(verifyCaptcha(c.token, 3)).toBe(false);
  });
  it("a wrong answer spends the token: no guessing sums 2–18 against one token", () => {
    const c = createCaptcha();
    const right = solve(c.question);
    expect(verifyCaptcha(c.token, String(Number(right) + 1))).toBe(false);
    expect(verifyCaptcha(c.token, right)).toBe(false);
  });
  it("rejects an expired token", () => {
    vi.useFakeTimers();
    try {
      const c = createCaptcha();
      vi.setSystemTime(Date.now() + 6 * 60 * 1000);
      expect(verifyCaptcha(c.token, solve(c.question))).toBe(false);
    } finally {
      vi.useRealTimers();
    }
  });
  it("asks in the requested language", () => {
    expect(createCaptcha("pl").question).toMatch(/^Ile wynosi \d \+ \d\?$/);
    expect(createCaptcha("en").question).toMatch(/^What is \d \+ \d\?$/);
  });
  it("uses CAPTCHA_SECRET from env: a token signed with another secret fails", () => {
    vi.stubEnv("CAPTCHA_SECRET", "secret-a");
    const c = createCaptcha();
    vi.stubEnv("CAPTCHA_SECRET", "secret-b");
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(false);
  });
  it("in production without CAPTCHA_SECRET it is not configured (no hard-coded fallback)", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CAPTCHA_SECRET", "");
    expect(isCaptchaConfigured()).toBe(false);
    expect(() => createCaptcha()).toThrow(/not configured/i);
    expect(verifyCaptcha("a.b", "3")).toBe(false);
  });
  it("in development without CAPTCHA_SECRET it falls back to a per-process random secret", () => {
    vi.stubEnv("NODE_ENV", "development");
    vi.stubEnv("CAPTCHA_SECRET", "");
    expect(isCaptchaConfigured()).toBe(true);
    const c = createCaptcha();
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(true);
  });
});

describe("captcha spent-token store (no unauthenticated growth)", () => {
  const forge = (exp: number, sig = "A".repeat(43)) =>
    `${Buffer.from(JSON.stringify({ salt: "x", exp })).toString("base64url")}.${sig}`;

  it("a forged signature is rejected and not recorded", () => {
    const before = usedSignatureCount();
    const now = Math.floor(Date.now() / 1000);
    for (let i = 0; i < 50; i++) expect(verifyCaptcha(forge(now + 60, `forged${i}${"x".repeat(1900)}`), "5")).toBe(false);
    expect(usedSignatureCount()).toBe(before);
  });

  it("a far-future exp is rejected (even when correctly signed) and not recorded", () => {
    vi.stubEnv("CAPTCHA_SECRET", "known-secret");
    const exp = 9_999_999_999;
    const sig = createHmac("sha256", "known-secret").update(`x:${exp}:5`).digest("base64url");
    const before = usedSignatureCount();
    expect(verifyCaptcha(forge(exp, sig), "5")).toBe(false);
    expect(usedSignatureCount()).toBe(before);
  });

  it("a genuine token is recorded once, right or wrong answer", () => {
    const c = createCaptcha();
    const before = usedSignatureCount();
    expect(verifyCaptcha(c.token, "99")).toBe(false);
    expect(usedSignatureCount()).toBe(before + 1);
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(false);
    expect(usedSignatureCount()).toBe(before + 1);
  });

  it("the store is capped", () => {
    for (let i = 0; i < MAX_USED_SIGNATURES + 50; i++) {
      const c = createCaptcha();
      verifyCaptcha(c.token, solve(c.question));
    }
    expect(usedSignatureCount()).toBeLessThanOrEqual(MAX_USED_SIGNATURES);
    // The newest token is still protected against replay after eviction.
    const c = createCaptcha();
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(true);
    expect(verifyCaptcha(c.token, solve(c.question))).toBe(false);
  });
});
