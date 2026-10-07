"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { CheckIcon } from "@/components/icons";
import { useSound } from "@/components/providers/SoundProvider";
import { profile } from "@/data/profile";
import { LIMITS, validateContact, type ContactErrors, type ContactInput } from "@/lib/contact";

type Status = "idle" | "sending" | "sent" | "error" | "unconfigured";

const EMPTY: ContactInput = { name: "", email: "", message: "" };

const FLASHES = [
  { left: "12%", top: "18%", delay: "0s" },
  { left: "78%", top: "12%", delay: "0.25s" },
  { left: "88%", top: "62%", delay: "0.5s" },
  { left: "20%", top: "70%", delay: "0.7s" },
  { left: "50%", top: "8%", delay: "0.95s" },
];

/** Contact form with inline validation, posting to /api/contact. */
export function ContactForm() {
  const { play } = useSound();
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<keyof ContactInput, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const [serverErrors, setServerErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const fieldRefs = useRef<Partial<Record<keyof ContactInput, HTMLInputElement | HTMLTextAreaElement | null>>>({});
  const successRef = useRef<HTMLHeadingElement>(null);

  const errors: ContactErrors = { ...validateContact(values), ...serverErrors };
  const shown = (f: keyof ContactInput) => (touched[f] || submitted ? errors[f] : undefined);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const field = e.target.name as keyof ContactInput;
    setValues((v) => ({ ...v, [field]: e.target.value }));
    if (serverErrors[field]) setServerErrors((s) => ({ ...s, [field]: undefined }));
  };
  const onBlur = (field: keyof ContactInput) => setTouched((t) => ({ ...t, [field]: true }));

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    const clientErrors = validateContact(values);
    const firstInvalid = (Object.keys(EMPTY) as (keyof ContactInput)[]).find((f) => clientErrors[f]);
    if (firstInvalid) {
      play("error");
      fieldRefs.current[firstInvalid]?.focus();
      return;
    }

    setStatus("sending");
    const honeypot = new FormData(e.currentTarget).get("company");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, company: honeypot }),
      });
      if (res.ok) {
        setStatus("sent");
        play("success");
        requestAnimationFrame(() => successRef.current?.focus());
        return;
      }
      if (res.status === 503) {
        setStatus("unconfigured");
      } else if (res.status === 422) {
        const data = (await res.json().catch(() => ({}))) as { fields?: ContactErrors };
        setServerErrors(data.fields ?? {});
        setStatus("idle");
      } else {
        setStatus("error");
      }
      play("error");
    } catch {
      setStatus("error");
      play("error");
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setSubmitted(false);
    setServerErrors({});
    setStatus("idle");
  };

  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${values.name || "the press room"}`)}&body=${encodeURIComponent(values.message)}`;

  if (status === "sent") {
    return (
      <div className="relative overflow-hidden rounded-xl border border-accent/30 bg-accent/[0.06] px-6 py-12 text-center">
        {FLASHES.map((f) => (
          <span
            key={f.left}
            className="flashbulb pointer-events-none absolute h-24 w-24 rounded-full bg-[radial-gradient(circle,white,transparent_65%)]"
            style={{ left: f.left, top: f.top, "--delay": f.delay } as React.CSSProperties}
            aria-hidden="true"
          />
        ))}
        <div className="score-pop mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-accent text-accent-ink">
          <CheckIcon className="h-10 w-10" />
        </div>
        <h3 ref={successRef} tabIndex={-1} className="font-display mt-5 text-5xl outline-none">
          Message received!
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-mist">
          Thanks{values.name ? `, ${values.name.trim()}` : ""} — I&apos;ll get back to you at{" "}
          <span className="text-fog">{values.email.trim()}</span> after the final whistle.
        </p>
        <button type="button" onClick={reset} className="btn-ghost mt-6">
          Send another question
        </button>
      </div>
    );
  }

  const inputClass = (f: keyof ContactInput) =>
    `w-full rounded-lg border bg-ink-950/60 px-4 py-3 text-fog placeholder:text-mist/60 transition-colors focus:outline-none focus:ring-2 focus:ring-accent/70 ${
      shown(f) ? "border-redcard/80" : "border-white/10 focus:border-accent/60"
    }`;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {/* Honeypot for bots — hidden from people and assistive tech. */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mist">
            Name
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.name = el;
            }}
            id="cf-name"
            name="name"
            autoComplete="name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={onChange}
            onBlur={() => onBlur("name")}
            aria-invalid={!!shown("name")}
            aria-describedby={shown("name") ? "cf-name-err" : undefined}
            className={inputClass("name")}
            placeholder="Your name"
          />
          {shown("name") && (
            <p id="cf-name-err" className="mt-1.5 text-sm text-redcard">
              {shown("name")}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="cf-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-mist">
            Email
          </label>
          <input
            ref={(el) => {
              fieldRefs.current.email = el;
            }}
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={onChange}
            onBlur={() => onBlur("email")}
            aria-invalid={!!shown("email")}
            aria-describedby={shown("email") ? "cf-email-err" : undefined}
            className={inputClass("email")}
            placeholder="you@club.com"
          />
          {shown("email") && (
            <p id="cf-email-err" className="mt-1.5 text-sm text-redcard">
              {shown("email")}
            </p>
          )}
        </div>
      </div>

      <div>
        <div className="mb-1.5 flex items-baseline justify-between">
          <label htmlFor="cf-message" className="block text-xs font-bold uppercase tracking-wider text-mist">
            Your question
          </label>
          <span className="text-xs tabular-nums text-mist" aria-hidden="true">
            {values.message.length}/{LIMITS.message}
          </span>
        </div>
        <textarea
          ref={(el) => {
            fieldRefs.current.message = el;
          }}
          id="cf-message"
          name="message"
          rows={6}
          maxLength={LIMITS.message}
          value={values.message}
          onChange={onChange}
          onBlur={() => onBlur("message")}
          aria-invalid={!!shown("message")}
          aria-describedby={shown("message") ? "cf-message-err" : undefined}
          className={`${inputClass("message")} resize-y`}
          placeholder="Recruiting? Collaboration? Hot take on last night's game? The floor is yours."
        />
        {shown("message") && (
          <p id="cf-message-err" className="mt-1.5 text-sm text-redcard">
            {shown("message")}
          </p>
        )}
      </div>

      {(status === "error" || status === "unconfigured") && (
        <div role="alert" className="rounded-lg border border-redcard/40 bg-redcard/10 p-4 text-sm">
          {status === "unconfigured"
            ? "The press room's phone line isn't connected yet. "
            : "Something went wrong sending that — the line dropped. "}
          <a href={mailto} className="font-semibold text-fog underline underline-offset-4">
            Email me directly instead
          </a>
          .
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-game" disabled={status === "sending"}>
          {status === "sending" ? (
            <>
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-accent-ink border-t-transparent"
                aria-hidden="true"
              />
              Sending…
            </>
          ) : (
            "Send to the press room"
          )}
        </button>
        <p className="text-xs text-mist">No spam, no tracking. Just a message to my inbox.</p>
      </div>
    </form>
  );
}
