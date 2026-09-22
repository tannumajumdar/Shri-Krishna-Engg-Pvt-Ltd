"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Minus, Plus, RotateCcw, X } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Reveal } from "@/components/ui/Reveal";
import {
  galleryEvents,
  galleryPhotos,
  type GalleryPhoto,
} from "@/lib/gallery";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.5;

const eventLabel = (id: string) =>
  galleryEvents.find((e) => e.id === id)?.date ?? "";

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export function GalleryGrid() {
  const [filter, setFilter] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  /* Lightbox zoom state. Offset is in px, applied before the scale so panning
     feels the same at every zoom level. */
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ active: boolean; x: number; y: number; moved: number }>({
    active: false,
    x: 0,
    y: 0,
    moved: 0,
  });

  const photos: GalleryPhoto[] =
    filter === "all" ? galleryPhotos : galleryPhotos.filter((p) => p.event === filter);

  const reset = useCallback(() => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
  }, []);

  const step = useCallback(
    (delta: number) => {
      reset();
      setOpen((i) => (i === null ? null : (i + delta + photos.length) % photos.length));
    },
    [photos.length, reset],
  );

  const zoomBy = useCallback((delta: number) => {
    setZoom((z) => {
      const next = clamp(z + delta, MIN_ZOOM, MAX_ZOOM);
      // Coming back to 1:1 should also recentre; a stranded offset looks broken.
      if (next === 1) setOffset({ x: 0, y: 0 });
      return next;
    });
  }, []);

  /* Keyboard drives the lightbox: Escape out, arrows through, +/- to zoom. */
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
      else if (e.key === "+" || e.key === "=") zoomBy(ZOOM_STEP);
      else if (e.key === "-" || e.key === "_") zoomBy(-ZOOM_STEP);
      else if (e.key === "0") reset();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, step, zoomBy, reset]);

  const zoomed = zoom > 1;

  return (
    <section className="bg-surface-2 py-20 lg:py-28">
      <div className="container">
        {/* ------------------------------ filter ------------------------- */}
        <Reveal>
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Filter photographs by event"
          >
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              All Photos
              <span className="ml-1.5 font-mono text-[10px] opacity-60">
                {galleryPhotos.length}
              </span>
            </FilterChip>
            {galleryEvents.map((event) => {
              const count = galleryPhotos.filter((p) => p.event === event.id).length;
              return (
                <FilterChip
                  key={event.id}
                  active={filter === event.id}
                  onClick={() => setFilter(event.id)}
                >
                  {event.label}
                  <span className="ml-1.5 font-mono text-[10px] opacity-60">{count}</span>
                </FilterChip>
              );
            })}
          </div>
        </Reveal>

        {/* ------------------------------- grid -------------------------- */}
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:mt-12">
          {photos.map((photo, i) => (
            <Reveal key={photo.src} delay={Math.min(i, 6) * 0.05}>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setOpen(i);
                }}
                aria-label={`Open photograph: ${photo.alt}`}
                className="group/tile relative block w-full overflow-hidden rounded-md border border-hairline bg-surface text-left"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <MediaImage
                    src={photo.src}
                    alt={photo.alt}
                    className="h-full w-full"
                    imgClassName="transition-transform duration-[1400ms] ease-brand group-hover/tile:scale-[1.05]"
                    sizes="(min-width: 640px) 50vw, 100vw"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover/tile:opacity-100"
                    aria-hidden="true"
                  />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-pretty text-[13.5px] font-medium leading-snug text-white">
                      {photo.alt}
                    </p>
                    <p className="mt-1 text-[11px] text-white/55">
                      {eventLabel(photo.event)}
                    </p>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>

        {photos.length === 0 && (
          <p className="mt-12 text-center text-sm text-ink-faint">
            No photographs for this event yet.
          </p>
        )}
      </div>

      {/* ----------------------------- lightbox -------------------------- */}
      <AnimatePresence>
        {open !== null && photos[open] && (
          <motion.div
            className="fixed inset-0 z-[70] flex flex-col bg-navy-950/95 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            role="dialog"
            aria-modal="true"
            aria-label={photos[open].alt}
          >
            {/* ------------------------- toolbar ------------------------- */}
            <div className="relative z-10 flex items-center justify-between gap-3 px-4 py-3 sm:px-6">
              <p className="font-mono text-[11px] tracking-[0.12em] text-white/45 tabular-nums">
                {String(open + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
                {zoomed && (
                  <span className="ml-3 text-accent-400">{Math.round(zoom * 100)}%</span>
                )}
              </p>

              <div className="flex items-center gap-2">
                <ToolButton
                  label="Zoom out"
                  disabled={zoom <= MIN_ZOOM}
                  onClick={() => zoomBy(-ZOOM_STEP)}
                >
                  <Minus className="h-4 w-4" strokeWidth={2} />
                </ToolButton>
                <ToolButton
                  label="Zoom in"
                  disabled={zoom >= MAX_ZOOM}
                  onClick={() => zoomBy(ZOOM_STEP)}
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </ToolButton>
                <ToolButton label="Reset zoom" disabled={!zoomed} onClick={reset}>
                  <RotateCcw className="h-4 w-4" strokeWidth={2} />
                </ToolButton>
                <ToolButton label="Close" onClick={() => setOpen(null)}>
                  <X className="h-5 w-5" strokeWidth={1.75} />
                </ToolButton>
              </div>
            </div>

            {/* -------------------------- stage -------------------------- */}
            <div
              className={cn(
                "relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-4 sm:px-16",
                zoomed ? (drag.current.active ? "cursor-grabbing" : "cursor-grab") : "cursor-zoom-in",
              )}
              /* Wheel zooms rather than scrolling the page behind. */
              onWheel={(e) => zoomBy(e.deltaY < 0 ? ZOOM_STEP / 2 : -ZOOM_STEP / 2)}
              onPointerDown={(e) => {
                if (!zoomed) return;
                drag.current = { active: true, x: e.clientX, y: e.clientY, moved: 0 };
                (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              }}
              onPointerMove={(e) => {
                const d = drag.current;
                if (!d.active) return;
                const dx = e.clientX - d.x;
                const dy = e.clientY - d.y;
                d.moved += Math.abs(dx) + Math.abs(dy);
                d.x = e.clientX;
                d.y = e.clientY;
                setOffset((o) => ({ x: o.x + dx, y: o.y + dy }));
              }}
              onPointerUp={(e) => {
                const d = drag.current;
                d.active = false;
                if ((e.currentTarget as HTMLElement).hasPointerCapture(e.pointerId)) {
                  (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
                }
              }}
              /* A click on the empty stage closes — but never the click that
                 ends a pan, and never while zoomed in. */
              onClick={() => {
                if (drag.current.moved > 6) {
                  drag.current.moved = 0;
                  return;
                }
                if (!zoomed) setOpen(null);
              }}
              onDoubleClick={() => (zoomed ? reset() : setZoom(2))}
            >
              <LightboxArrow
                side="left"
                onClick={(e) => {
                  e.stopPropagation();
                  step(-1);
                }}
              />
              <LightboxArrow
                side="right"
                onClick={(e) => {
                  e.stopPropagation();
                  step(1);
                }}
              />

              <motion.img
                key={photos[open].src}
                src={photos[open].src}
                alt={photos[open].alt}
                draggable={false}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE }}
                style={{
                  transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
                  transition: drag.current.active ? "none" : "transform 220ms ease-out",
                }}
                onClick={(e) => e.stopPropagation()}
                className="max-h-full max-w-full select-none rounded-md object-contain"
              />
            </div>

            {/* ------------------------- caption ------------------------- */}
            <figcaption className="relative z-10 px-4 pb-6 text-center sm:px-6">
              <p className="text-pretty text-[14px] text-white">{photos[open].alt}</p>
              <p className="mt-1 font-mono text-[11px] tracking-[0.12em] text-white/45">
                {eventLabel(photos[open].event)}
              </p>
              <p className="mt-2 text-[11px] text-white/30">
                Scroll or double-click to zoom · drag to pan · arrow keys to move through
              </p>
            </figcaption>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex items-center rounded-md border px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] transition-colors duration-300",
        active
          ? "border-accent-500 bg-accent-500 text-white"
          : "border-hairline bg-surface text-ink-faint hover:border-accent-500/50 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

function ToolButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className="grid h-10 w-10 place-items-center rounded-md border border-white/20 text-white transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

function LightboxArrow({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous photograph" : "Next photograph"}
      className={cn(
        "absolute top-1/2 z-10 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-md border border-white/20 bg-navy-950/60 text-white transition-colors hover:bg-white/10",
        side === "left" ? "left-2 sm:left-5" : "right-2 sm:right-5",
      )}
    >
      <Icon className="h-5 w-5" strokeWidth={1.75} />
    </button>
  );
}
