"use client";

import { useEffect, useState } from "react";
import { PageHeader, Button, Field, Notice, inputClass } from "../ui";
import { api, ApiClientError } from "@/lib/admin/api-client";

type Contact = {
  address: string | null;
  phone: string | null;
  email: string | null;
  whatsapp: string | null;
  mapUrl: string | null;
  hours: string | null;
};

const FIELDS: { name: keyof Contact; label: string; textarea?: boolean }[] = [
  { name: "address", label: "Address", textarea: true },
  { name: "phone", label: "Phone" },
  { name: "email", label: "Email" },
  { name: "whatsapp", label: "WhatsApp" },
  { name: "hours", label: "Working hours" },
  { name: "mapUrl", label: "Map embed URL", textarea: true },
];

export default function ContactPage() {
  const [values, setValues] = useState<Contact>({
    address: "", phone: "", email: "", whatsapp: "", mapUrl: "", hours: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(null);

  useEffect(() => {
    api.get<Contact | null>("/api/contact").then((c) => {
      if (c) setValues((v) => ({ ...v, ...c }));
    }).catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) if (v) payload[k] = v;
    try {
      await api.put("/api/contact", payload);
      setMsg({ kind: "success", text: "Contact information saved." });
    } catch (err) {
      setMsg({ kind: "error", text: err instanceof ApiClientError ? err.message : "Save failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Contact Information" subtitle="Shown in the contact section and footer" />
      <form onSubmit={save} className="max-w-2xl p-8">
        {msg && <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div>}
        {FIELDS.map((f) => (
          <Field key={f.name} label={f.label}>
            {f.textarea ? (
              <textarea
                className={inputClass}
                rows={2}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              />
            ) : (
              <input
                className={inputClass}
                value={values[f.name] ?? ""}
                onChange={(e) => setValues((v) => ({ ...v, [f.name]: e.target.value }))}
              />
            )}
          </Field>
        ))}
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save changes"}</Button>
      </form>
    </>
  );
}
