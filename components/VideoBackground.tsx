"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MediaPlaceholder } from "@/components/ui/MediaImage";
import { cn } from "@/lib/utils";

type VideoBackgroundProps = {
  /** e.g. "/media/hero-video.mp4" */
  src: string;
  /** Still frame shown before playback and wherever video cannot run. */
  poster: string;
  className?: string;
  /** Tailwind object-position, e.g. "object-[50%_35%]". */
  objectPosition?: string;
  /** 0–1. Layered under the content for text contrast. */
  overlayOpacity?: number;
  /** Adds the fine engineering grid over the footage. */
  grid?: boolean;
};

/* --------------------------------------------------------------------------
 * A page can hold five of these. On a phone, two overlapping decoders are
 * already enough to start dropping frames, so a tiny module-level coordinator
 * hands playback to the single most visible section. Desktops have the budget
 * for every on-screen clip, and pausing one there would just look broken.
 * ----------------------------------------------------------------------- */

type Player = { ratio: number; play: () => void; pause: () => void };

const players = new Set<Player>();
let arbitrating = false;

/** Small screen, touch input, or few cores: one decoder at a time. */
function soloMode() {
  if (typeof window === "undefined") return true;
  if (window.matchMedia("(max-width: 1023px), (pointer: coarse)").matches) return true;
  return (navigator.hardwareConcurrency ?? 8) <= 4;
}

function arbitrate() {
  if (arbitrating) return;
  arbitrating = true;
  queueMicrotask(() => {
    arbitrating = false;
    const visible = [...players].filter((p) => p.ratio > 0.05);

    if (!soloMode()) {
      for (const p of players) (visible.includes(p) ? p.play() : p.pause());
      return;
    }

    let winner: Player | null = null;
    for (const p of visible) if (!winner || p.ratio > winner.ratio) winner = p;
    for (const p of players) (p === winner ? p.play() : p.pause());
  });
}

/**
 * Only an explicit data-saver switch suppresses the video.
 *
 * Do NOT extend this to `effectiveType`: Chrome reports "3g" on plenty of
 * perfectly good connections, and gating on it silently turns the footage off
 * for a large share of real visitors. The clips are 0.2–0.4 MB on phones now,
 * which a genuinely slow link can carry anyway.
 */
function dataSaverOn() {
  if (typeof navigator === "undefined") return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  return c?.saveData === true;
}

/**
 * Derive the small phone encode sitting next to the desktop one. It is offered
 * as the first <source>; if that file was never generated the browser falls
 * through to the full-size one on its own, so a missing variant costs a single
 * failed request and nothing else.
 */
function mobileVariant(src: string) {
  return /\.mp4$/i.test(src) ? src.replace(/\.mp4$/i, "-mobile.mp4") : null;
}

/**
 * Full-bleed background video.
 *
 * Autoplays muted and inline so iOS/Android honour it, only mounts the
 * <video> once the section is nearly on screen, hands the decoder to a single
 * section at a time, and degrades in three steps: video -> poster image ->
 * blueprint placeholder. Reduced motion and data saver never get the video at
 * all.
 */
export function VideoBackground({
  src,
  poster,
  className,
  objectPosition = "object-center",
  overlayOpacity = 0.62,
  grid = false,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [posterOk, setPosterOk] = useState(true);
  const [blocked, setBlocked] = useState(true); // reduced motion / data saver
  const [armed, setArmed] = useState(false); // section is near the viewport
  const [ready, setReady] = useState(false); // first frames decoded

  useEffect(() => {
    setVideoOk(true);
    setReady(false);
  }, [src]);

  /* Honour the OS "reduce motion" setting, live, plus the network hints. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setBlocked(mq.matches || dataSaverOn());
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  /* Preload the poster separately so we know whether it is safe to fall back. */
  useEffect(() => {
    const img = new Image();
    img.onload = () => setPosterOk(true);
    img.onerror = () => setPosterOk(false);
    img.src = poster;
  }, [poster]);

  /* Arm well before the section arrives so buffering happens off-screen and
     playback starts on already-decoded frames instead of stalling. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || blocked || armed) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setArmed(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [blocked, armed]);

  /* Register with the coordinator and keep reporting how visible we are. */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !armed || blocked) return;

    const player: Player = {
      ratio: 0,
      play: () => {
        const v = videoRef.current;
        if (!v || document.hidden) return;
        // Autoplay can still be refused (iOS Low Power Mode) — the poster
        // stays visible underneath, so a rejection is not a failure state.
        if (v.paused) v.play().catch(() => {});
      },
      pause: () => {
        const v = videoRef.current;
        if (v && !v.paused) v.pause();
      },
    };
    players.add(player);

    const io = new IntersectionObserver(
      ([entry]) => {
        player.ratio = entry.isIntersecting ? entry.intersectionRatio : 0;
        arbitrate();
      },
      { threshold: [0, 0.15, 0.35, 0.6, 0.85] },
    );
    io.observe(el);

    const onVisibility = () => (document.hidden ? player.pause() : arbitrate());
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      players.delete(player);
      arbitrate();
    };
  }, [armed, blocked]);

  const showVideo = videoOk && !blocked && armed;
  const small = mobileVariant(src);

  /**
   * Reveal the footage once it has a frame to show.
   *
   * This has to be a native listener rather than an onLoadedData prop: a
   * cached video (the files are served with a week-long Cache-Control now) can
   * reach readyState 2 before React ever attaches its handler, and then the
   * event never arrives and the layer stays at opacity 0 forever. So check the
   * current state first, and keep a timer as a last resort — an invisible
   * video is the one failure mode with no visual fallback.
   */
  useEffect(() => {
    const v = videoRef.current;
    if (!showVideo || !v) return;

    const reveal = () => {
      setReady(true);
      arbitrate();
    };

    if (v.readyState >= 2) reveal();
    v.addEventListener("loadeddata", reveal);
    v.addEventListener("canplay", reveal);
    const safety = window.setTimeout(reveal, 2500);

    return () => {
      v.removeEventListener("loadeddata", reveal);
      v.removeEventListener("canplay", reveal);
      window.clearTimeout(safety);
    };
  }, [showVideo, src]);

  /**
   * React bubbles a <source> error up to the <video>, and a <source> whose
   * media query does not match counts as one — so on desktop the phone encode
   * would otherwise look like a total failure. Only the media element setting
   * its own `error` means every candidate is exhausted.
   */
  const onError = useCallback(() => {
    if (videoRef.current?.error) setVideoOk(false);
  }, []);

  return (
    <div ref={wrapRef} className={cn("absolute inset-0 overflow-hidden bg-navy-950", className)}>
      {/* Poster sits underneath at all times: it covers the pre-roll frame,
          blocked autoplay, and decode failures without any extra state. */}
      {posterOk ? (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          decoding="async"
          className={cn("absolute inset-0 h-full w-full object-cover", objectPosition)}
        />
      ) : (
        <MediaPlaceholder label={src} />
      )}

      {showVideo && (
        <video
          key={src}
          ref={videoRef}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
            objectPosition,
            ready ? "opacity-100" : "opacity-0",
          )}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onError={onError}
        >
          {small && <source src={small} type="video/mp4" media="(max-width: 820px)" />}
          <source src={src} type="video/mp4" />
        </video>
      )}

      {/* Contrast stack: flat wash + vertical falloff so headlines stay legible
          against footage of any brightness. */}
      <div
        className="absolute inset-0 bg-navy-950"
        style={{ opacity: overlayOpacity }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-transparent to-navy-950/85"
        aria-hidden="true"
      />

      {grid && (
        <div
          className="absolute inset-0 bg-grid-fine opacity-[0.35]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
