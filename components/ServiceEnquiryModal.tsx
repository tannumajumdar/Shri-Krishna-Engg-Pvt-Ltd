"use client";

import { useEffect, useState } from "react";
import { X, MessageCircle, CheckCircle2, ExternalLink } from "lucide-react";
import { whatsappLink, type Product } from "@/lib/site";

/**
 * Enquiry form shown when a visitor taps "Enquire" on a service.
 *
 * IMPORTANT — why there is a confirmation step:
 * WhatsApp is a separate app. A website cannot detect whether the visitor
 * actually pressed "Send" inside WhatsApp — the wa.me link only OPENS the chat.
 * So we cannot claim "message sent" or record a lead just because WhatsApp
 * opened. Instead:
 *   1. Submit form  → open WhatsApp (nothing recorded yet).
 *   2. Visitor returns and confirms "I have sent it" → THEN we save the lead
 *      and show the sent confirmation.
 * This means neither an accidental tap nor merely opening WhatsApp creates a
 * lead — only a real, confirmed send does.
 */
type Step = "form" | "confirm" | "done";

export function ServiceEnquiryModal({
  product,
  categoryName,
  whatsapp,
  onClose,
}: {
  product: Product;
  categoryName: string;
  whatsapp: string;
  onClose: () => void;
}) {
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [requirement, setRequirement] = useState("");
  const [waUrl, setWaUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function buildMessage() {
    const lines = [
      "Hello Shri Krishna Engineering,",
      "",
      "I would like to enquire about:",
      `• Service: ${product.name}`,
      `• Category: ${categoryName}`,
      "",
      "My details —",
      `Name: ${name}`,
    ];
    if (company) lines.push(`Company: ${company}`);
    if (phone) lines.push(`Phone: ${phone}`);
    if (requirement) lines.push(`Requirement: ${requirement}`);
    lines.push("", "Please share the details and a quotation.");
    return lines.join("\n");
  }

  /** Step 1 → open WhatsApp. No lead is recorded here. */
  function openWhatsApp(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    const url = whatsappLink(whatsapp, buildMessage());
    setWaUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setStep("confirm");
  }

  /** Step 2 → the visitor confirms they actually sent it. Record the lead now. */
  async function confirmSent() {
    setBusy(true);
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          company: company.trim() || undefined,
          phone: phone.trim() || undefined,
          product: product.name,
          subject: `${categoryName} enquiry`,
          source: "WHATSAPP",
          message:
            requirement.trim() ||
            `Enquiry about ${product.name} (${categoryName}) via the website.`,
        }),
      });
    } catch {
      /* Even if saving hiccups, the visitor has already messaged us. */
    }
    setBusy(false);
    setStep("done");
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 bg-slate-50 px-6 py-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6E9F2B]">
              {categoryName}
            </p>
            <h3 className="mt-1 font-display text-lg font-semibold text-navy-900">
              Enquire: {product.name}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* -------------------------- step: form ------------------------ */}
        {step === "form" && (
          <form onSubmit={openWhatsApp} className="px-6 py-5">
            <p className="mb-4 text-[13px] leading-relaxed text-slate-500">
              Fill in your details and we&apos;ll continue on WhatsApp with a
              quotation — no charge to enquire.
            </p>

            {error && (
              <div className="mb-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <Field label="Your name *">
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rakesh Kumar"
                className={inputCls}
              />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Phone">
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 …"
                  inputMode="tel"
                  className={inputCls}
                />
              </Field>
              <Field label="Company">
                <input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Optional"
                  className={inputCls}
                />
              </Field>
            </div>

            <Field label="Your requirement">
              <textarea
                value={requirement}
                onChange={(e) => setRequirement(e.target.value)}
                rows={3}
                placeholder="Scope, quantity, timeline, site…"
                className={inputCls}
              />
            </Field>

            <button
              type="submit"
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-[#0C1936] transition hover:bg-[#20c65c]"
            >
              <MessageCircle className="h-4 w-4" strokeWidth={2.25} />
              Continue to WhatsApp
            </button>
          </form>
        )}

        {/* ------------------------ step: confirm ----------------------- */}
        {step === "confirm" && (
          <div className="px-6 py-6">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[13.5px] font-medium text-navy-900">
                WhatsApp has opened with your enquiry.
              </p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-slate-500">
                Please press <b>Send</b> inside WhatsApp to deliver it to us.
                Once you have sent it, tap the button below so we know to expect
                you.
              </p>
            </div>

            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 text-[13px] font-medium text-[#6E9F2B] hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              WhatsApp didn&apos;t open? Tap to open again
            </a>

            <div className="mt-5 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                onClick={confirmSent}
                disabled={busy}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#25D366] py-3 text-sm font-semibold text-[#0C1936] transition hover:bg-[#20c65c] disabled:opacity-60"
              >
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
                {busy ? "Saving…" : "I have sent the message"}
              </button>
              <button
                onClick={() => setStep("form")}
                className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Back
              </button>
            </div>
          </div>
        )}

        {/* ------------------------- step: done ------------------------- */}
        {step === "done" && (
          <div className="px-6 py-10 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-[#25D366]" strokeWidth={1.5} />
            <h4 className="mt-4 font-display text-lg font-semibold text-navy-900">
              Thank you — enquiry received
            </h4>
            <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-slate-500">
              We have your details for <b>{product.name}</b> and will reply on
              WhatsApp shortly.
            </p>
            <button
              onClick={onClose}
              className="mt-6 rounded-lg bg-navy-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-navy-800"
            >
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-navy-500 focus:ring-4 focus:ring-navy-500/10";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-xs font-semibold text-slate-700">{label}</span>
      {children}
    </label>
  );
}
