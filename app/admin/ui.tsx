"use client";

import { useEffect, useState, type ReactNode } from "react";

/**
 * Page header with a title and optional action slot.
 *
 * Sticks to the top so the page title and its primary action stay reachable
 * while scrolling a long table.
 */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-8 py-5">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold text-slate-900">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-0.5 truncate text-sm text-slate-500">{subtitle}</p>
          )}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
    </div>
  );
}

/**
 * Standard page body. Caps the line length on wide monitors and keeps the
 * padding identical everywhere, so pages stop drifting apart as they are
 * edited. `width="narrow"` is for single-column forms.
 */
export function PageBody({
  children,
  width = "wide",
}: {
  children: ReactNode;
  width?: "wide" | "narrow";
}) {
  // The outer max-w-7xl matches PageHeader's, so a narrow form still starts on
  // the same left edge as the page title instead of drifting to the middle.
  return (
    <div className="mx-auto w-full max-w-7xl px-8 py-8">
      <div className={width === "narrow" ? "max-w-2xl" : undefined}>
        {children}
      </div>
    </div>
  );
}

export function Button({
  children,
  variant = "primary",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "danger";
}) {
  const styles = {
    primary: "bg-[#0C1936] text-white hover:bg-[#16294F] shadow-sm",
    ghost: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "text-red-600 hover:bg-red-50",
  }[variant];
  return (
    <button
      {...props}
      className={`rounded-lg px-3.5 py-2 text-sm font-medium transition disabled:opacity-60 ${styles} ${props.className ?? ""}`}
    >
      {children}
    </button>
  );
}

/** Toast-ish inline status line. */
export function Notice({
  kind,
  children,
}: {
  kind: "error" | "success";
  children: ReactNode;
}) {
  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm ${
        kind === "error" ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"
      }`}
    >
      {children}
    </div>
  );
}

/** Modal dialog for create/edit forms. */
export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/40 p-6">
      <div className="mt-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 transition hover:text-slate-700"
          >
            ✕
          </button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

export function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: ReactNode;
  error?: string;
}) {
  return (
    <label className="mb-4 block">
      <span className="mb-1 block text-xs font-medium text-slate-600">
        {label}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#1541A8] focus:ring-4 focus:ring-[#1541A8]/10";

/** Loads data from the API with loading/error states. */
export function useResource<T>(path: string, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let live = true;
    setLoading(true);
    import("@/lib/admin/api-client").then(({ api }) =>
      api
        .get<T>(path)
        .then((d) => live && (setData(d), setError(null)))
        .catch((e) => live && setError(e.message))
        .finally(() => live && setLoading(false)),
    );
    return () => {
      live = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, nonce, ...deps]);

  return { data, loading, error, reload: () => setNonce((n) => n + 1) };
}
