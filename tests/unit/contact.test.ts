import { describe, expect, it } from "vitest";
import { services } from "@/content";
import pl from "@/i18n/dictionaries/pl.json";
import en from "@/i18n/dictionaries/en.json";
import {
  buildEmailHtml,
  buildSubject,
  contactApiErrors,
  contactTopics,
  escapeHtml,
  resolveTopic,
  topicLabel,
  validateContact,
  type ContactInput,
} from "@/lib/contact";

const valid: ContactInput = {
  name: "Anna Kowalska",
  email: "anna@firma.pl",
  topic: "inne",
  message: "Pęknięcie wału",
  captchaToken: "t.s",
  captchaAnswer: "7",
};

describe("escapeHtml", () => {
  it("escapes & < > \" '", () => {
    expect(escapeHtml(`<script>"x"&'y'</script>`)).toBe("&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;");
  });
});

describe("buildEmailHtml", () => {
  it("escapes the message and turns newlines into <br>", () => {
    expect(buildEmailHtml({ ...valid, message: "<b>hi</b>\nok" })).toContain("&lt;b&gt;hi&lt;/b&gt;<br>ok");
  });
  it("escapes every user field", () => {
    expect(buildEmailHtml({ ...valid, name: "<img src=x>" })).not.toContain("<img");
    expect(buildEmailHtml({ ...valid, email: "a@b.pl<script>" })).not.toContain("<script>");
    expect(buildEmailHtml({ ...valid, company: "<i>x</i>", phone: "<u>1</u>" })).not.toMatch(/<i>|<u>/);
  });
  it("handles CRLF line endings", () => {
    expect(buildEmailHtml({ ...valid, message: "a\r\nb" })).toContain("a<br>b");
  });
});

describe("validateContact", () => {
  it("requires name, email and message", () => {
    expect(validateContact({})).toEqual({ ok: false, error: "required" });
    expect(validateContact(null)).toEqual({ ok: false, error: "required" });
    expect(validateContact("x")).toEqual({ ok: false, error: "required" });
    expect(validateContact({ ...valid, name: "   " })).toEqual({ ok: false, error: "required" });
    expect(validateContact({ ...valid, message: 42 })).toEqual({ ok: false, error: "required" });
  });
  it("checks the e-mail shape", () => {
    expect(validateContact({ ...valid, email: "nope" })).toEqual({ ok: false, error: "email" });
    expect(validateContact({ ...valid, email: "a@nodot" })).toEqual({ ok: false, error: "email" });
    expect(validateContact({ ...valid, email: "a@b.pl\r\nBcc: x@y.pl" })).toEqual({ ok: false, error: "email" });
    for (const bad of ["<a@b.pl>", "a@b.pl,x", "a@b.pl;c@d.pl", '"a"@b.pl', "a b@c.pl", "a@b_c.pl", "a@b..pl", "a@.pl"]) {
      expect(validateContact({ ...valid, email: bad }), bad).toEqual({ ok: false, error: "email" });
    }
    for (const good of ["a.b+tag@sub.uksw.edu.pl", "x-y@my-domain.com"]) {
      expect(validateContact({ ...valid, email: good }).ok, good).toBe(true);
    }
  });
  it("limits lengths", () => {
    expect(validateContact({ ...valid, message: "x".repeat(5001) })).toEqual({ ok: false, error: "too_long" });
    expect(validateContact({ ...valid, message: "x".repeat(5000) }).ok).toBe(true);
    expect(validateContact({ ...valid, name: "x".repeat(201) })).toEqual({ ok: false, error: "too_long" });
  });
  it("trims and normalises the topic", () => {
    const r = validateContact({ ...valid, name: "  Anna  ", topic: "nieistniejacy", extra: "dropped" });
    expect(r).toEqual({ ok: true, data: { ...valid, name: "Anna", topic: "inne" } });
  });
});

describe("topics", () => {
  it("lists the general topics and every service", () => {
    const ids = contactTopics.map((t) => t.id);
    expect(ids.slice(0, 4)).toEqual(["zlecenie-badan", "moc-obliczeniowa", "wspolpraca-br", "inne"]);
    expect(contactTopics[0].label.pl).toBe("Zlecenie badań");
    expect(contactTopics[1].label.pl).toBe("Wynajem mocy obliczeniowej");
    expect(contactTopics[2].label.pl).toBe("Współpraca B+R");
    expect(contactTopics[3].label.pl).toBe("Inne");
    for (const s of services) expect(ids).toContain(s.slug);
    expect(new Set(ids).size).toBe(ids.length);
  });
  it("resolveTopic maps unknown or missing to inne", () => {
    expect(resolveTopic("nieistniejacy")).toBe("inne");
    expect(resolveTopic(undefined)).toBe("inne");
    expect(resolveTopic("")).toBe("inne");
    expect(resolveTopic(services[0].slug)).toBe(services[0].slug);
    expect(resolveTopic("wspolpraca-br")).toBe("wspolpraca-br");
  });
  it("topicLabel localises", () => {
    expect(topicLabel("inne", "en")).toBe("Other");
    expect(topicLabel("bogus", "pl")).toBe("Inne");
  });
});

describe("buildSubject", () => {
  it("cannot carry header injection", () => {
    const s = buildSubject({ ...valid, name: "Eve\r\nBcc: victim@x.pl" });
    expect(s).not.toMatch(/[\r\n]/);
    expect(s).toContain("Eve Bcc: victim@x.pl");
    expect(s.startsWith("[MCB WWW] Inne")).toBe(true);
  });
});

describe("error messages", () => {
  it("every API error code and the network error has a message in both languages", () => {
    for (const dict of [pl, en]) {
      const errors = dict.contact.errors as Record<string, string>;
      for (const code of [...contactApiErrors, "network"]) expect(errors[code], code).toBeTruthy();
    }
  });
});
