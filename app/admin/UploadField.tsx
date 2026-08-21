"use client";

import { useRef, useState } from "react";
import { Upload, X } from "lucide-react";
import { api, ApiClientError } from "@/lib/admin/api-client";
import { inputClass } from "./ui";

/**
 * File upload + manual-URL input in one control.
 *
 * The admin can either upload a file (goes through /api/media/upload and comes
 * back as a /uploads/... URL) or paste an existing path. Either way the value
 * handed up is a string URL — exactly what every model field stores — so the
 * same control works for images, videos and posters.
 */
export function UploadField({
  kind,
  value,
  onChange,
}: {
  kind: "image" | "video";
  value: string;
  onChange: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const res = await api.upload(file, kind, `${kind}s`);
      onChange(res.url);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isVideo = kind === "video";

  return (
    <div>
      <div className="flex gap-2">
        <input
          className={inputClass}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="/uploads/… or paste a URL"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-300 px-3 text-sm text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {busy ? "…" : "Upload"}
        </button>
        <input
          ref={inputRef}
          type="file"
          hidden
          accept={isVideo ? "video/*" : "image/*"}
          onChange={onFile}
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}

      {value && (
        <div className="mt-2 flex items-center gap-3">
          {isVideo ? (
            <video src={value} className="h-16 w-24 rounded-md object-cover" muted />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-16 w-24 rounded-md object-cover" />
          )}
          <button
            type="button"
            onClick={() => onChange("")}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-red-600"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        </div>
      )}
    </div>
  );
}
