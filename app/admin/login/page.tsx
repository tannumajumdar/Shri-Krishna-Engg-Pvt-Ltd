"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { api, ApiClientError } from "@/lib/admin/api-client";

/**
 * Admin sign-in.
 *
 * One centred panel, not the old two-column split: the left half carried a
 * photograph and a marketing paragraph aimed at nobody — the only person who
 * ever reaches this screen already works here and wants the password box. The
 * brand stays present through the mark and the navy ground.
 */
export default function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.post("/api/auth/login", { email, password });
      router.replace(params.get("from") || "/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col bg-adm-bg">
      {/* the site's own engineering grid, kept very faint */}
      <div
        className="pointer-events-none absolute inset-0 bg-grid-fine opacity-[0.35]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(60%_100%_at_50%_0%,rgba(140,198,63,0.10),transparent_70%)]"
        aria-hidden="true"
      />

      <header className="relative px-6 pt-6">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-adm-muted transition-colors hover:text-adm-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5 text-adm-accent" strokeWidth={2} />
          Back to website
        </a>
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            {/* self-start would squash this in a stretch context; the parent is
                a column with items-center, so w-auto is safe here. */}
            <img
              src="/media/logo-light.png"
              alt="Shree Krishna Engineering Balco"
              width={640}
              height={197}
              className="h-10 w-auto"
            />
            <span className="mt-5 inline-flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-adm-faint">
              <span className="h-px w-7 bg-adm-accent" />
              Content Management
              <span className="h-px w-7 bg-adm-accent" />
            </span>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-adm-line bg-adm-surface p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
          >
            <div className="mb-6">
              <h1 className="text-lg font-semibold text-adm-ink">Sign in</h1>
              <p className="mt-0.5 text-xs text-adm-muted">
                Manage products, media, enquiries and site content.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-lg border border-adm-danger/40 bg-adm-danger-soft px-3 py-2.5 text-sm text-adm-danger"
              >
                <span aria-hidden="true">⚠</span>
                <span>{error}</span>
              </div>
            )}

            <label htmlFor="admin-email" className="mb-1.5 block text-xs font-semibold text-adm-ink-2">
              Email
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              required
              autoFocus
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mb-4 w-full rounded-lg border border-adm-line bg-adm-raised px-3.5 py-2.5 text-sm text-adm-ink placeholder:text-adm-faint outline-none transition focus:border-adm-accent focus:ring-4 focus:ring-adm-accent/20"
              placeholder="admin@shrikrishnaengineering.in"
            />

            <label htmlFor="admin-password" className="mb-1.5 block text-xs font-semibold text-adm-ink-2">
              Password
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mb-6 w-full rounded-lg border border-adm-line bg-adm-raised px-3.5 py-2.5 text-sm text-adm-ink placeholder:text-adm-faint outline-none transition focus:border-adm-accent focus:ring-4 focus:ring-adm-accent/20"
              placeholder="••••••••••"
            />

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-lg bg-adm-accent py-3 text-sm font-semibold text-adm-accent-ink shadow-sm transition hover:bg-adm-accent-hi disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-[11px] text-adm-faint">
            © {new Date().getFullYear()} Shree Krishna Engineering Balco · BALCO
          </p>
        </div>
      </main>
    </div>
  );
}
