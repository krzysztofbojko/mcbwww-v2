import type { L } from "@/content/types";
// Narrow import: this module is also used by the (client) contact form; "@/content" would pull every JSON in.
import { services } from "@/content/services";

export type ContactError = "required" | "email" | "too_long";

/** Error codes the contact API answers with; the form translates each through the dictionary (contact.errors). */
export const contactApiErrors = ["required", "email", "too_long", "bad_request", "captcha", "not_configured", "send_failed"] as const;
export type ContactApiError = (typeof contactApiErrors)[number];

export type ContactInput = {
  name: string;
  email: string;
  topic: string;
  message: string;
  captchaToken: string;
  captchaAnswer: string;
  /** Optional (mockup 06). */
  company?: string;
  /** Optional (mockup 06). */
  phone?: string;
};

export const LIMITS = { name: 200, email: 254, message: 5000, company: 200, phone: 40, captcha: 2000 } as const;

/** Upper bound for the raw request body; anything larger is refused before parsing. */
export const MAX_BODY_BYTES = 32 * 1024;

export const DEFAULT_TOPIC = "inne";

/** General topics first, then every service (id = service slug, so ?temat={serviceSlug} links resolve). */
export const contactTopics: { id: string; label: L }[] = [
  { id: "zlecenie-badan", label: { pl: "Zlecenie badań", en: "Commissioning research" } },
  { id: "moc-obliczeniowa", label: { pl: "Wynajem mocy obliczeniowej", en: "Renting computing power" } },
  { id: "wspolpraca-br", label: { pl: "Współpraca B+R", en: "R&D collaboration" } },
  { id: DEFAULT_TOPIC, label: { pl: "Inne", en: "Other" } },
  ...services.map((s) => ({ id: s.slug, label: s.title })),
];

/** Number of general (non-service) topics at the head of contactTopics. */
export const GENERAL_TOPIC_COUNT = 4;

export function resolveTopic(param: string | undefined): string {
  return param && contactTopics.some((t) => t.id === param) ? param : DEFAULT_TOPIC;
}

export function topicLabel(id: string, locale: "pl" | "en"): string {
  const topic = contactTopics.find((t) => t.id === resolveTopic(id))!;
  return (locale === "en" ? topic.label.en : undefined) ?? topic.label.pl;
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

export function validateContact(
  body: unknown,
): { ok: true; data: ContactInput } | { ok: false; error: ContactError } {
  const b = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;
  const name = str(b.name);
  const email = str(b.email);
  const message = str(b.message);
  if (!name || !email || !message) return { ok: false, error: "required" };
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return { ok: false, error: "email" };

  const company = str(b.company);
  const phone = str(b.phone);
  const captchaToken = typeof b.captchaToken === "string" ? b.captchaToken : "";
  const captchaAnswer = typeof b.captchaAnswer === "string" ? b.captchaAnswer.trim() : "";
  if (
    name.length > LIMITS.name ||
    message.length > LIMITS.message ||
    company.length > LIMITS.company ||
    phone.length > LIMITS.phone ||
    captchaToken.length > LIMITS.captcha ||
    captchaAnswer.length > LIMITS.captcha
  ) {
    return { ok: false, error: "too_long" };
  }

  const data: ContactInput = {
    name,
    email,
    topic: resolveTopic(typeof b.topic === "string" ? b.topic : undefined),
    message,
    captchaToken,
    captchaAnswer,
  };
  if (company) data.company = company;
  if (phone) data.phone = phone;
  return { ok: true, data };
}

function oneLine(s: string): string {
  return s.replace(/[\r\n\t\u2028\u2029]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

/** Subject header: topic and name on one line (CR/LF stripped, so no header injection). */
export function buildSubject(d: ContactInput): string {
  return oneLine(`[MCB WWW] ${topicLabel(d.topic, "pl")} · ${d.name}`).slice(0, 250);
}

/** The e-mail body for the MCB office. Every user-supplied field goes through escapeHtml. */
export function buildEmailHtml(d: ContactInput): string {
  const rows: [string, string | undefined][] = [
    ["Imię i nazwisko", d.name],
    ["E-mail", d.email],
    ["Firma", d.company],
    ["Telefon", d.phone],
    ["Temat", topicLabel(d.topic, "pl")],
  ];
  const meta = rows
    .filter((r): r is [string, string] => Boolean(r[1]))
    .map(([k, v]) => `<p><strong>${k}:</strong> ${escapeHtml(v)}</p>`)
    .join("\n");
  const message = escapeHtml(d.message).replace(/\r\n|\r|\n/g, "<br>");
  return `<h3>Nowe zapytanie z formularza kontaktowego MCB</h3>
${meta}
<hr />
<p><strong>Treść wiadomości:</strong></p>
<p>${message}</p>`;
}
