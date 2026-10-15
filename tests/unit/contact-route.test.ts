import { afterEach, describe, expect, it, vi } from "vitest";
import { POST } from "@/app/api/contact/route";
import { GET } from "@/app/api/captcha/route";
import { MAX_BODY_BYTES } from "@/lib/contact";

afterEach(() => {
  vi.unstubAllEnvs();
});

const URL_ = "http://localhost/api/contact";

/** A streamed body without Content-Length (as with Transfer-Encoding: chunked). */
function streamed(totalBytes: number, chunk = 16 * 1024) {
  let sent = 0;
  let pulls = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      pulls++;
      if (sent >= totalBytes) return controller.close();
      const n = Math.min(chunk, totalBytes - sent);
      sent += n;
      controller.enqueue(new Uint8Array(n).fill(0x61));
    },
  });
  const req = new Request(URL_, { method: "POST", body: stream, duplex: "half" } as RequestInit);
  return { req, sent: () => sent, pulls: () => pulls };
}

describe("POST /api/contact", () => {
  it("rejects invalid JSON with 400 bad_request", async () => {
    const res = await POST(new Request(URL_, { method: "POST", body: "{not json" }));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "bad_request" });
  });

  it("rejects an oversized chunked body (no Content-Length) without buffering all of it", async () => {
    const s = streamed(10 * 1024 * 1024);
    expect(s.req.headers.get("content-length")).toBeNull();
    const res = await POST(s.req);
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "too_long" });
    expect(s.sent()).toBeLessThan(MAX_BODY_BYTES + 64 * 1024);
  });

  it("accepts a small chunked body (then validates it)", async () => {
    const body = new TextEncoder().encode("{}");
    const stream = new ReadableStream<Uint8Array>({
      start(c) {
        c.enqueue(body);
        c.close();
      },
    });
    const res = await POST(new Request(URL_, { method: "POST", body: stream, duplex: "half" } as RequestInit));
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "required" });
  });

  it("valid enquiry with a correct captcha but no RESEND_API_KEY answers 503 not_configured", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    const c = (await (await GET(new Request("http://localhost/api/captcha"))).json()) as { question: string; token: string };
    const [a, b] = c.question.match(/\d+/g)!.map(Number);
    const res = await POST(
      new Request(URL_, {
        method: "POST",
        body: JSON.stringify({ name: "Anna", email: "a@b.pl", message: "m", captchaToken: c.token, captchaAnswer: String(a + b) }),
      }),
    );
    expect(res.status).toBe(503);
    expect(await res.json()).toEqual({ error: "not_configured" });
  });
});
