"use client";

import { useEffect, useRef, useState } from "react";
import { media } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The brand lockup.
 *
 * Two things decide which artwork is right: whether the logo sits over dark
 * imagery (`onDark`), and the active theme. The theme half is resolved in CSS
 * by rendering both variants and letting `dark:` visibility pick one — reading
 * the theme in JS would render the wrong lockup until hydration, which on a
 * solid dark navbar means blue-on-navy for a frame.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  /** Force the white knockout — for the hero navbar, mobile sheet and footer. */
  onDark?: boolean;
}) {
  if (onDark) {
    return <LogoArtwork src={media.logoLight} onDark className={className} />;
  }

  return (
    <>
      <span className="dark:hidden">
        <LogoArtwork src={media.logo} className={className} />
      </span>
      <span className="hidden dark:inline-flex">
        <LogoArtwork src={media.logoLight} onDark className={className} />
      </span>
    </>
  );
}

/* -------------------------------------------------------------------------- */

function LogoArtwork({
  src,
  onDark = false,
  className,
}: {
  src: string;
  onDark?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  /* Same hydration guard as MediaImage: the markup is server-rendered, so a
     missing file can 404 before React attaches onError. */
  useEffect(() => {
    setFailed(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth === 0) setFailed(true);
  }, [src]);

  if (failed) return <LogoFallback onDark={onDark} className={className} />;

  return (
    <img
      ref={imgRef}
      src={src}
      alt="Shri Krishna Engineering"
      onError={() => setFailed(true)}
      className={cn("h-9 w-auto lg:h-10", className)}
    />
  );
}

/** Monogram only — for tight spots such as a favicon or a compact header. */
export function LogoMark({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 114 40"
      className={cn("h-8 w-auto", className)}
      aria-hidden="true"
    >
      {/* S and E carry the brand blue, reversing to white on dark grounds.
          The horizontal slat gaps echo an extruded section in profile. */}
      <g className={onDark ? "fill-white" : "fill-navy-600 dark:fill-white"}>
        <path d="M0 0h30v10H10v5h20v25H0V30h20v-5H0V0Z" />
        <path d="M82 0h32v10H92v5h16v10H92v5h22v10H82V0Z" />
      </g>
      {/* K keeps the brand lime — it holds up on light and dark alike. */}
      <path
        className="fill-accent-500"
        d="M38 0h10v15L62 0h12L56 20l18 20H62L48 25v15H38V0Z"
      />
    </svg>
  );
}

function LogoFallback({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span className={cn("flex items-center gap-3", className)}>
      <LogoMark onDark={onDark} className="h-7 shrink-0 lg:h-8" />
      <span
        className={cn(
          "font-display text-[15px] font-semibold leading-none tracking-tight transition-colors duration-500 sm:text-base",
          onDark ? "text-white" : "text-navy-800 dark:text-white",
        )}
      >
        Shri Krishna Engineering
      </span>
    </span>
  );
}
