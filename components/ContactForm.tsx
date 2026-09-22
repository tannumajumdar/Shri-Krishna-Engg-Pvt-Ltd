"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type State = "idle" | "sending" | "sent" | "error";

/** The six capabilities, so an enquiry arrives already routed. */
const SUBJECTS = [
  "Mechanical Works",
  "Fabrication",
  "Erection & Commissioning",
  "Civil Works",
  "Transportation & Logistics",
  "Plant Operations & Maintenance",
  "Careers",
  "Other",
];

/**
 * The enquiry form on the contact page.
 *
 * Posts to the same /api/enquiries endpoint the WhatsApp modal uses, so every
 * lead lands in one admin inbox regardless of where it came in. The hidden
 * `website` field is the API's honeypot — it must stay rendered and empty.
 */
export function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setState("sending");
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "WEBSITE" }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error?.message ?? "Could not send the enquiry.");
      }

      form.reset();
      setState("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the enquiry.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-md border border-hairline bg-surface p-8 text-center">
        <CheckCircle2
          className="mx-auto h-9 w-9 text-accent-500"
          strokeWidth={1.5}
          aria-hidden="true"
        />
        <h3 className="mt-5 font-display text-[18px] font-semibold text-ink">
          Enquiry received
        </h3>
        <p className="mx-auto mt-3 max-w-sm text-[13.5px] leading-relaxed text-ink-muted">
          Our team will get back to you within one working day. For anything urgent,
          please call the number listed alongside.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="mt-6 text-[13px] font-semibold text-accent-600 underline underline-offset-4 hover:text-accent-500"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  const busy = state === "sending";

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-md border border-hairline bg-surface p-6 lg:p-8"
    >
      {/* Honeypot — hidden from people, irresistible to bots. */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" name="name" required placeholder="Full name" />
        <Field label="Company" name="company" placeholder="Organisation" />
        <Field
          label="Phone"
          name="phone"
          type="tel"
          required
          placeholder="+91 00000 00000"
        />
        <Field label="Email" name="email" type="email" placeholder="you@company.com" />
      </div>

      <div className="mt-5">
        <Label htmlFor="subject">What is this about?</Label>
        <select
          id="subject"
          name="subject"
          defaultValue=""
          className={cn(
            "mt-2 w-full rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5",
            "text-[14px] text-ink outline-none transition-colors duration-300",
            "focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30",
          )}
        >
          <option value="" disabled>
            Select a capability
          </option>
          {SUBJECTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-5">
        <Label htmlFor="message">
          Your requirement <span className="text-accent-600">*</span>
        </Label>
        <textarea
          id="message"
          name="message"
          required
          minLength={5}
          rows={5}
          placeholder="Scope of work, location, timeline — whatever you have so far."
          className={cn(
            "mt-2 w-full resize-y rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5",
            "text-[14px] leading-relaxed text-ink outline-none transition-colors duration-300",
            "placeholder:text-ink-faint",
            "focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30",
          )}
        />
      </div>

      {error && (
        <p role="alert" className="mt-4 text-[13px] text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className={cn(
          "mt-6 inline-flex items-center gap-2.5 rounded-md bg-accent-500 px-6 py-3",
          "text-[13px] font-semibold uppercase tracking-label text-white",
          "transition-all duration-500 ease-brand hover:bg-accent-600",
          "disabled:cursor-not-allowed disabled:opacity-60",
        )}
      >
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Sending
          </>
        ) : (
          <>
            Send Enquiry
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </>
        )}
      </button>

      <p className="mt-4 text-[12px] leading-relaxed text-ink-faint">
        We use your details only to answer this enquiry.
      </p>
    </form>
  );
}

function Label({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-semibold uppercase tracking-label text-ink-faint"
    >
      {children}
    </label>
  );
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <Label htmlFor={name}>
        {label} {required && <span className="text-accent-600">*</span>}
      </Label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={cn(
          "mt-2 w-full rounded-md border border-hairline bg-surface-2 px-3.5 py-2.5",
          "text-[14px] text-ink outline-none transition-colors duration-300",
          "placeholder:text-ink-faint",
          "focus:border-accent-500 focus:ring-1 focus:ring-accent-500/30",
        )}
      />
    </div>
  );
}
