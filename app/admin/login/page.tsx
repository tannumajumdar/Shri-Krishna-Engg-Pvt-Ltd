"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogIn, ArrowLeft } from "lucide-react";
import { api, ApiClientError } from "@/lib/admin/api-client";

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
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* ---- brand / imagery panel ---- */}
      <div className="relative hidden overflow-hidden bg-[#0C1936] lg:block">
        <img
          src="/media/admin/login-bg.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-70"
        />
        {/* navy wash + vignette for legibility */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#0C1936] via-[#0C1936]/70 to-transparent" />
        <div className="absolute inset-0 bg-[#0C1936]/30" />

        <div className="relative flex h-full flex-col justify-between p-12">
          <img src="/media/logo-light.png" alt="Shri Krishna Engineering" className="h-11 w-auto" />
          <div className="max-w-md">
            <span className="mb-5 inline-flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/50">
              <span className="h-px w-8 bg-[#5CB531]" />
              Content Management
            </span>
            <h2 className="text-4xl font-semibold leading-[1.1] text-white">
              Mechanical · Fabrication · Erection
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/60">
              Manage products, media, enquiries and site content for the Shri
              Krishna Engineering website — all from one place.
            </p>
          </div>
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} Shri Krishna Engineering Pvt. Ltd. · BALCO
          </p>
        </div>
      </div>

      {/* ---- form panel ---- */}
      <div className="relative grid place-items-center bg-slate-50 p-6">
        <a
          href="/"
          className="absolute left-6 top-6 flex items-center gap-1.5 text-xs font-medium text-slate-500 transition-colors hover:text-slate-900"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
          Back to website
        </a>

        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-8 shadow-[0_8px_40px_-12px_rgba(12,25,54,0.15)]"
        >
          {/* logo lockup on mobile, where the left panel is hidden */}
          <img
            src="/media/logo.png"
            alt="Shri Krishna Engineering"
            className="mb-6 h-9 w-auto lg:hidden"
          />

          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#0C1936] text-white">
              <LogIn className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <div>
              <div className="text-base font-semibold text-slate-900">Welcome back</div>
              <p className="text-xs text-slate-500">Sign in to the admin panel</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-700">
              <span aria-hidden="true">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <label className="mb-3.5 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Email</span>
            <input
              type="email"
              required
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1541A8] focus:ring-4 focus:ring-[#1541A8]/10"
              placeholder="admin@shrikrishnaengineering.in"
            />
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-xs font-semibold text-slate-700">Password</span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-[#1541A8] focus:ring-4 focus:ring-[#1541A8]/10"
              placeholder="••••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-lg bg-[#0C1936] py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#16294F] disabled:opacity-60"
          >
            {busy ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
