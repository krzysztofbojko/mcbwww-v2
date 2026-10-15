"use client";

import { useCallback, useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { Check, RotateCw } from "lucide-react";
import type { Dictionary, Locale } from "@/i18n";
// Narrow, client-safe module (imports only content/services), never the "@/content" barrel.
import { DEFAULT_TOPIC, LIMITS, contactApiErrors, isValidEmail, resolveTopic, type ContactApiError } from "@/lib/contact";
import { Button, cn } from "@/components/ui";

export interface ContactTopicOption {
  id: string;
  label: string;
}

export interface ContactFormProps {
  locale: Locale;
  strings: Dictionary["contact"];
  /** Localised on the server: general topics (Zlecenie badań … Inne) and one per service. */
  topics: { general: ContactTopicOption[]; services: ContactTopicOption[] };
  /** Shown in the „not configured” / „send failed” messages. */
  office: { email: string; phone: string };
}

type Field = "message" | "name" | "email" | "captchaAnswer" | "consent";
type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "success"; email: string }
  | { kind: "error"; code: ContactApiError | "network" };
type Captcha =
  | { state: "loading" }
  | { state: "ready"; question: string; token: string }
  | { state: "error"; notConfigured: boolean };

function isApiError(x: unknown): x is ContactApiError {
  return typeof x === "string" && (contactApiErrors as readonly string[]).includes(x);
}

/**
 * Reads ?temat= and preselects the topic. Sits inside <Suspense fallback={<ContactForm/>}> on the page: the
 * prerendered fallback is the same form with topic „Inne”; `key` remounts the form when ?temat= changes.
 */
export function ContactFormFromQuery(props: ContactFormProps) {
  const param = useSearchParams()?.get("temat") ?? undefined;
  const topic = resolveTopic(param);
  return <ContactForm key={topic} {...props} initialTopic={topic} preset={topic !== DEFAULT_TOPIC} />;
}

/** Mockup 06: the enquiry form on the burgundy field. Labels are bound to fields; the status is announced. */
export function ContactForm({
  locale,
  strings: s,
  topics,
  office,
  initialTopic = DEFAULT_TOPIC,
  preset = false,
}: ContactFormProps & { initialTopic?: string; preset?: boolean }) {
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [captcha, setCaptcha] = useState<Captcha>({ state: "loading" });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({});
  /** Set when a server answer arrives: the status (success or error) then takes focus once it renders. */
  const focusStatus = useRef(false);

  useEffect(() => {
    if (!focusStatus.current) return;
    focusStatus.current = false;
    statusRef.current?.focus();
  }, [status]);

  const loadCaptcha = useCallback(async () => {
    setCaptcha({ state: "loading" });
    try {
      const res = await fetch(`/api/captcha?locale=${locale}`, { cache: "no-store" });
      const json: unknown = await res.json().catch(() => null);
      const data = json as { question?: unknown; token?: unknown; error?: unknown } | null;
      if (res.ok && typeof data?.question === "string" && typeof data.token === "string") {
        setCaptcha({ state: "ready", question: data.question, token: data.token });
      } else {
        const notConfigured = data?.error === "not_configured";
        setCaptcha({ state: "error", notConfigured });
        if (notConfigured) setStatus({ kind: "error", code: "not_configured" });
      }
    } catch {
      setCaptcha({ state: "error", notConfigured: false });
    }
  }, [locale]);

  useEffect(() => {
    // Fetching on mount; state is set when the request settles, not synchronously in the effect.
    const t = setTimeout(() => void loadCaptcha(), 0);
    return () => clearTimeout(t);
  }, [loadCaptcha]);

  const fill = (msg: string, extra: Record<string, string> = {}) =>
    // Non-breaking spaces keep the phone number on one line.
    Object.entries({ email: office.email, phone: office.phone.replace(/ /g, "\u00a0"), ...extra }).reduce(
      (acc, [k, v]) => acc.replace(`{${k}}`, v),
      msg,
    );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status.kind === "sending") return;
    const fd = new FormData(e.currentTarget);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const values = {
      message: get("message"),
      topic: get("topic"),
      name: get("name"),
      company: get("company"),
      email: get("email"),
      phone: get("phone"),
      captchaAnswer: get("captchaAnswer"),
      captchaToken: captcha.state === "ready" ? captcha.token : "",
    };

    const errors: Partial<Record<Field, string>> = {};
    if (!values.message) errors.message = s.fieldRequired;
    if (!values.name) errors.name = s.fieldRequired;
    if (!values.email) errors.email = s.fieldRequired;
    else if (!isValidEmail(values.email)) errors.email = s.errors.email;
    if (!values.captchaAnswer) errors.captchaAnswer = s.fieldRequired;
    if (fd.get("consent") !== "on") errors.consent = s.consentRequired;
    setFieldErrors(errors);
    const firstInvalid = (["message", "name", "email", "captchaAnswer", "consent"] as Field[]).find((f) => errors[f]);
    if (firstInvalid) {
      // The form cannot be sent at all while the captcha is not configured: keep saying so, not „required”.
      const notConfigured = captcha.state === "error" && captcha.notConfigured;
      setStatus({
        kind: "error",
        code: notConfigured ? "not_configured" : errors.email && !errors.message && !errors.name ? "email" : "required",
      });
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setStatus({ kind: "sending" });
    let next: Status;
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json().catch(() => null)) as { ok?: boolean; error?: unknown } | null;
      if (res.ok && json?.ok) next = { kind: "success", email: values.email };
      else next = { kind: "error", code: isApiError(json?.error) ? json.error : "send_failed" };
    } catch {
      next = { kind: "error", code: "network" };
    }
    focusStatus.current = true;
    setStatus(next);
    if (next.kind === "success") {
      formRef.current?.reset();
    } else {
      // A captcha token is accepted once and may have been spent: always ask a fresh question after a failure.
      const answer = formRef.current?.querySelector<HTMLInputElement>('[name="captchaAnswer"]');
      if (answer) answer.value = "";
      if (next.code === "captcha") setFieldErrors({ captchaAnswer: s.errors.captcha });
      void loadCaptcha();
    }
  }

  if (status.kind === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        <p className="m-0 font-display text-display-s">{s.successTitle}</p>
        <p className="mt-4 mb-0 max-w-[34em] text-body text-burgundy-tint">{fill(s.successBody, { email: status.email })}</p>
        <Button
          variant="inverse"
          className="mt-8"
          onClick={() => {
            setStatus({ kind: "idle" });
            void loadCaptcha();
          }}
        >
          {s.sendAnother}
        </Button>
      </div>
    );
  }

  const errorText = status.kind === "error" ? fill(s.errors[status.code]) : "";
  const sending = status.kind === "sending";

  return (
    <form
      ref={formRef}
      noValidate
      onSubmit={onSubmit}
      aria-label={s.formLabel}
      aria-busy={sending}
      className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2"
    >
      <FieldShell id={id("message")} label={s.messageLabel} error={fieldErrors.message} full>
        <textarea
          id={id("message")}
          name="message"
          rows={4}
          maxLength={LIMITS.message}
          placeholder={s.messagePlaceholder}
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? `${id("message")}-err` : undefined}
          className={cn(control, "min-h-[7.5em] resize-y border px-3.5 py-3")}
        />
      </FieldShell>

      <FieldShell id={id("topic")} label={s.topicLabel} hint={preset ? s.topicHintPreset : s.topicHint} full>
        <select
          id={id("topic")}
          name="topic"
          defaultValue={initialTopic}
          aria-describedby={`${id("topic")}-hint`}
          className={cn(control, "cursor-pointer appearance-none truncate border-b bg-no-repeat pr-8 [&_optgroup]:bg-paper [&_optgroup]:text-ink [&_option]:bg-paper [&_option]:text-ink")}
          style={{ backgroundImage: chevron, backgroundPosition: "right 2px center", backgroundSize: "16px" }}
        >
          <optgroup label={s.topicGeneral}>
            {topics.general.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </optgroup>
          <optgroup label={s.topicServices}>
            {topics.services.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
            ))}
          </optgroup>
        </select>
      </FieldShell>

      <FieldShell id={id("name")} label={s.nameLabel} error={fieldErrors.name}>
        <input
          id={id("name")}
          name="name"
          type="text"
          autoComplete="name"
          maxLength={LIMITS.name}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? `${id("name")}-err` : undefined}
          className={cn(control, "border-b")}
        />
      </FieldShell>
      <FieldShell id={id("company")} label={s.companyLabel} optional={s.optional}>
        <input
          id={id("company")}
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.company}
          placeholder={s.companyPlaceholder}
          className={cn(control, "border-b")}
        />
      </FieldShell>
      <FieldShell id={id("email")} label={s.emailLabel} error={fieldErrors.email}>
        <input
          id={id("email")}
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          spellCheck={false}
          maxLength={LIMITS.email}
          placeholder={s.emailPlaceholder}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? `${id("email")}-err` : undefined}
          className={cn(control, "border-b")}
        />
      </FieldShell>
      <FieldShell id={id("phone")} label={s.phoneLabel} optional={s.optional}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={LIMITS.phone}
          placeholder={s.phonePlaceholder}
          className={cn(control, "border-b")}
        />
      </FieldShell>

      <FieldShell
        id={id("captcha")}
        label={
          <>
            {s.captchaLabel}
            {": "}
            <span className="text-paper" aria-live="polite">
              {captcha.state === "ready"
                ? captcha.question
                : captcha.state === "loading"
                  ? s.captchaLoading
                  : s.captchaUnavailable}
            </span>
          </>
        }
        error={fieldErrors.captchaAnswer}
      >
        <div className="flex items-end gap-4">
          <input
            id={id("captcha")}
            name="captchaAnswer"
            type="text"
            inputMode="numeric"
            autoComplete="off"
            maxLength={3}
            aria-invalid={fieldErrors.captchaAnswer ? true : undefined}
            aria-describedby={fieldErrors.captchaAnswer ? `${id("captcha")}-err` : undefined}
            className={cn(control, "min-w-0 flex-1 border-b")}
          />
          <button
            type="button"
            onClick={() => void loadCaptcha()}
            className="inline-flex shrink-0 cursor-pointer items-center gap-2 pb-2.5 text-small text-burgundy-tint underline decoration-1 underline-offset-[0.25em] transition-colors hover:text-paper"
          >
            <RotateCw aria-hidden className="size-3.5" strokeWidth={1.5} />
            {s.captchaReload}
          </button>
        </div>
      </FieldShell>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-3.5 text-small">
          <span className="relative mt-0.5 inline-flex size-4 shrink-0">
            <input
              type="checkbox"
              name="consent"
              aria-invalid={fieldErrors.consent ? true : undefined}
              aria-describedby={fieldErrors.consent ? `${id("consent")}-err` : undefined}
              className="peer size-4 cursor-pointer appearance-none border border-paper bg-transparent checked:bg-paper"
            />
            <Check
              aria-hidden
              strokeWidth={2.5}
              className="pointer-events-none absolute inset-0 m-auto hidden size-3 text-burgundy peer-checked:block"
            />
          </span>
          <span>{s.consent}</span>
        </label>
        {fieldErrors.consent ? <FieldError id={`${id("consent")}-err`}>{fieldErrors.consent}</FieldError> : null}
      </div>

      <div className="flex flex-col gap-x-6 gap-y-4 sm:flex-row sm:items-center md:col-span-2">
        <Button variant="inverse" type="submit" arrow disabled={sending} className="max-sm:flex max-sm:w-full max-sm:justify-between">
          {sending ? s.sending : s.submit}
        </Button>
        <p className="m-0 text-small text-burgundy-tint">{s.sendNote}</p>
      </div>

      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        aria-live="polite"
        className={cn("outline-none md:col-span-2", errorText ? "" : "sr-only")}
      >
        {errorText ? (
          <p className="m-0 border border-paper/60 bg-burgundy-deep px-4 py-3 text-ui text-paper">{errorText}</p>
        ) : sending ? (
          s.sending
        ) : null}
      </div>
    </form>
  );
}

const control =
  "block w-full rounded-none border-paper/60 bg-transparent py-2 pb-2.5 text-body text-paper placeholder:text-burgundy-tint/80 transition-colors hover:border-paper aria-[invalid=true]:border-paper aria-[invalid=true]:border-b-2";

const chevron = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='none' stroke='%23F4F1EB' stroke-width='1.5'%3E%3Cpath d='M3 6l5 5 5-5'/%3E%3C/svg%3E")`;

function FieldShell({
  id,
  label,
  hint,
  optional,
  error,
  full,
  children,
}: {
  id: string;
  label: ReactNode;
  hint?: string;
  optional?: string;
  error?: string;
  full?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-2", full && "md:col-span-2")}>
      <label htmlFor={id} className="text-small text-burgundy-tint">
        {label}
        {optional ? <span className="text-burgundy-tint/80"> {optional}</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${id}-hint`} className="m-0 text-small text-burgundy-tint">
          {hint}
        </p>
      ) : null}
      {error ? <FieldError id={`${id}-err`}>{error}</FieldError> : null}
    </div>
  );
}

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="m-0 mt-1 text-small font-medium text-paper">
      <span aria-hidden className="mr-1.5 inline-block size-1.5 translate-y-[-2px] bg-paper" />
      {children}
    </p>
  );
}
