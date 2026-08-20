"use client";

import { useEffect, useRef, useState } from "react";
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
  /** Slows the footage down — 0.75 reads more cinematic than 1. */
  playbackRate?: number;
};

/**
 * Full-bleed background video.
 *
 * Autoplays muted and inline so iOS/Android honour it, pauses whenever it
 * scrolls out of view to save battery, and degrades in three steps:
 * video -> poster image -> blueprint placeholder. Users who ask for reduced
 * motion never get the video at all.
 */
export function VideoBackground({
  src,
  poster,
  className,
  objectPosition = "object-center",
  overlayOpacity = 0.62,
  grid = false,
  playbackRate = 0.85,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [videoOk, setVideoOk] = useState(true);
  const [posterOk, setPosterOk] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  /* Honour the OS "reduce motion" setting, live. */
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
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

  /* Only play while on screen. */
  useEffect(() => {
    const el = wrapRef.current;
    const video = videoRef.current;
    if (!el || !video || reduceMotion) return;

    video.playbackRate = playbackRate;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Autoplay can still be refused (iOS Low Power Mode) — the poster
          // stays visible underneath, so a rejection is not a failure state.
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0.05 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduceMotion, playbackRate]);

  const showVideo = videoOk && !reduceMotion;

  return (
    <div ref={wrapRef} className={cn("absolute inset-0 overflow-hidden bg-navy-950", className)}>
      {/* Poster sits underneath at all times: it covers the pre-roll frame,
          blocked autoplay, and decode failures without any extra state. */}
      {posterOk ? (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={cn("absolute inset-0 h-full w-full object-cover", objectPosition)}
        />
      ) : (
        <MediaPlaceholder label={src} />
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className={cn("absolute inset-0 h-full w-full object-cover", objectPosition)}
          poster={posterOk ? poster : undefined}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          disablePictureInPicture
          aria-hidden="true"
          tabIndex={-1}
          onError={() => setVideoOk(false)}
        >
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
          className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-[0.35]"
          aria-hidden="true"
        />
      )}
    </div>
  );
}
