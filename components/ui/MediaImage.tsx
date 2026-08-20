"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type MediaImageProps = {
  src: string;
  alt: string;
  /** Applied to the wrapper — put sizing/aspect/rounding here. */
  className?: string;
  /** Applied to the <img> itself — object-position overrides etc. */
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
};

/**
 * Image with a designed fallback.
 *
 * Assets are dropped in later, so a missing file must never look broken. Until
 * the file exists we render a blueprint panel that names the expected path —
 * it reads as an intentional placeholder rather than a 404.
 */
export function MediaImage({
  src,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
}: MediaImageProps) {
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const imgRef = useRef<HTMLImageElement>(null);

  /**
   * The markup is server-rendered, so an image can finish — or 404 — before
   * React hydrates and attaches onLoad/onError. Those events are gone by then,
   * which would strand the tile in its loading state forever. Re-read the
   * element once on mount and settle from what actually happened.
   */
  useEffect(() => {
    setStatus("loading");
    const img = imgRef.current;
    if (img?.complete) {
      setStatus(img.naturalWidth > 0 ? "ready" : "error");
    }
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden bg-navy-950", className)}>
      {status !== "error" && (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("error")}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-700 ease-brand",
            status === "ready" ? "opacity-100" : "opacity-0",
            imgClassName,
          )}
        />
      )}

      {status === "loading" && <MediaSkeleton />}
      {status === "error" && <MediaPlaceholder label={src} />}
    </div>
  );
}

/** Quiet shimmer shown while the real file is in flight. */
function MediaSkeleton() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-navy-900">
      <div className="absolute inset-0 animate-[sheen_1.6s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/[0.07] to-transparent" />
    </div>
  );
}

/** Blueprint panel standing in for an asset that has not been uploaded yet. */
export function MediaPlaceholder({ label }: { label?: string }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-navy-950">
      <div className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-60" />
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg,transparent 0 14px,rgba(255,255,255,.5) 14px 15px)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-navy-950/40 via-transparent to-navy-950/70" />

      {/* corner registration marks */}
      <span className="absolute left-4 top-4 h-5 w-5 border-l border-t border-white/25" />
      <span className="absolute right-4 top-4 h-5 w-5 border-r border-t border-white/25" />
      <span className="absolute bottom-4 left-4 h-5 w-5 border-b border-l border-white/25" />
      <span className="absolute bottom-4 right-4 h-5 w-5 border-b border-r border-white/25" />

      <div className="relative z-10 max-w-[85%] px-4 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          className="mx-auto h-7 w-7 text-white/40"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="16" rx="1.5" />
          <circle cx="8.5" cy="9.5" r="1.5" />
          <path d="m3 16.5 4.5-4 3.5 3 4-5L21 16" />
        </svg>
        {label && (
          <p className="mt-2.5 break-all font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
            {label}
          </p>
        )}
      </div>
    </div>
  );
}
