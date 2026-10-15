import { afterEach, describe, expect, it, vi } from "vitest";
import { createCaptcha, isCaptchaConfigured, verifyCaptcha } from "@/lib/captcha";

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
