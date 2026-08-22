"use client";

import { useEffect, useState } from "react";
import { UserCog } from "lucide-react";
import { PageHeader, Button, Field, Notice, inputClass } from "../ui";
import { api, ApiClientError } from "@/lib/admin/api-client";

type Me = { id: number; name: string; email: string; role: string; createdAt: string };

export default function SettingsPage() {
  const [me, setMe] = useState<Me | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ kind: "error" | "success"; text: string } | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    api.get<Me>("/api/auth/me").then((m) => {
      setMe(m);
      setName(m.name);
      setEmail(m.email);
    }).catch(() => {});
  }, []);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setFieldErrors({});

    if (newPassword && newPassword !== confirm) {
      setFieldErrors({ confirm: "Passwords do not match" });
      return;
    }
    if (!currentPassword) {
      setFieldErrors({ currentPassword: "Enter your current password to save" });
      return;
    }

    setBusy(true);
    const payload: Record<string, unknown> = { currentPassword };
    if (name && name !== me?.name) payload.name = name;
    if (email && email !== me?.email) payload.email = email;
    if (newPassword) payload.newPassword = newPassword;

    try {
      const updated = await api.put<Me>("/api/auth/me", payload);
      setMe(updated);
      setCurrentPassword("");
      setNewPassword("");
      setConfirm("");
      setMsg({ kind: "success", text: "Profile updated successfully." });
    } catch (err) {
      if (err instanceof ApiClientError) {
        setMsg({ kind: "error", text: err.message });
        if (err.details) setFieldErrors(err.details);
      } else setMsg({ kind: "error", text: "Update failed" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Your admin profile and account" />
      <div className="max-w-2xl p-8">
        {/* -------------------------- profile ----------------------------- */}
        <form
          onSubmit={save}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#0C1936] text-white">
              <UserCog className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">My Profile</h2>
              <p className="text-xs text-slate-500">
                Change your login email and password
              </p>
            </div>
          </div>

          {msg && (
            <div className="mb-4">
              <Notice kind={msg.kind}>{msg.text}</Notice>
            </div>
          )}

          <Field label="Name" error={fieldErrors.name}>
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
          </Field>

          <Field label="Email" error={fieldErrors.email}>
            <input
              type="email"
              className={inputClass}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
            />
          </Field>

          <div className="my-5 border-t border-slate-100 pt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Change password (optional)
            </p>
            <Field label="New password" error={fieldErrors.newPassword}>
              <input
                type="password"
                className={inputClass}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
              />
            </Field>
            <Field label="Confirm new password" error={fieldErrors.confirm}>
              <input
                type="password"
                className={inputClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
          </div>

          <div className="rounded-xl bg-amber-50 p-4">
            <Field label="Current password (required to save changes)" error={fieldErrors.currentPassword}>
              <input
                type="password"
                className={inputClass}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Button type="submit" disabled={busy} className="mt-1">
              {busy ? "Saving…" : "Save changes"}
            </Button>
          </div>
        </form>

        {/* --------------------------- account ---------------------------- */}
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Account</h2>
          <dl className="space-y-2">
            <Row label="Role" value={me?.role} />
            <Row
              label="Member since"
              value={me ? new Date(me.createdAt).toLocaleDateString() : undefined}
            />
          </dl>
          <p className="mt-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
            Database URL and JWT secret live in <code className="rounded bg-slate-100 px-1">.env</code> on the
            server and are never sent to the browser. Uploaded files are stored under{" "}
            <code className="rounded bg-slate-100 px-1">/public/uploads</code>.
          </p>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value ?? "—"}</dd>
    </div>
  );
}
