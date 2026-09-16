"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { company, media } from "@/lib/site";
import { parallaxRange, useParallaxEnabled } from "@/lib/use-parallax";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE = ["ENGINEERING", "THAT KEEPS", "INDUSTRY"];

/** Reads down the right edge of the hero — the four things the pitch rests on. */
const PILLARS = ["PEOPLE", "EXPERIENCE", "EXECUTION", "RESULTS"];

/** How long a slide holds before the carousel advances on its own. */
const DWELL = 6500;

export function Hero({
  /** Kept for API compatibility with the page's DB-driven media; the hero is
   *  a still carousel now, so only the poster is used, as slide one. */
  video,
}: {
  video?: { src: string; poster: string };
} = {}) {
  const ref = useRef<HTMLElement>(null);

  /* Footage drifts slower than the page; content lifts and fades out. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const parallax = useParallaxEnabled();
  const mediaY = useTransform(scrollYProgress, [0, 1], parallaxRange(parallax, ["0%", "18%"], "0%"));
  const contentY = useTransform(scrollYProgress, [0, 1], parallaxRange(parallax, ["0%", "-12%"], "0%"));
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  /* A DB-managed poster, when there is one, takes slide one. */
  const slides = video?.poster
    ? [video.poster, ...media.heroSlides.filter((s) => s !== video.poster)].slice(0, 3)
    : media.heroSlides;

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const go = useCallback(
    (delta: number) => setIndex((i) => (i + delta + slides.length) % slides.length),
    [slides.length],
  );

  /* Advance on a timer, but never while the pointer is resting on the hero or
     the tab is in the background — an unseen slideshow is wasted work. */
  useEffect(() => {
    if (paused || slides.length < 2) return;
    const id = window.setInterval(() => {
      if (!document.hidden) setIndex((i) => (i + 1) % slides.length);
    }, DWELL);
    return () => window.clearInterval(id);
  }, [paused, slides.length]);

  /* Preload the neighbouring slides so a click never shows an empty frame. */
  useEffect(() => {
    for (const src of slides) {
      const img = new Image();
      img.src = src;
    }
  }, [slides]);

  return (
    <section
      id="home"
      ref={ref}
      className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-navy-950"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <motion.div style={{ y: mediaY }} className="absolute inset-0 -bottom-[18%]">
        <AnimatePresence initial={false}>
          <motion.div
            key={slides[index]}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1, ease: "easeInOut" }, scale: { duration: 7, ease: "linear" } }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slides[index]}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-[50%_45%]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Contrast stack: flat wash, vertical falloff, then a left vignette so
            the headline keeps its footing over any frame. */}
        <div className="absolute inset-0 bg-navy-950/60" aria-hidden="true" />
        <div
          className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-transparent to-navy-950/90"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.35]" aria-hidden="true" />
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/30 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 flex flex-1 flex-col justify-center pb-32 pt-[calc(var(--nav-h)+3rem)]"
      >
        <div className="flex items-start justify-between gap-10">
          <div className="max-w-3xl">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
              className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-accent-400"
            >
              <span className="h-px w-10 bg-accent-400" />
              Industrial Engineering &amp; Plant Services
            </motion.span>

            <h1 className="font-display text-display-md font-semibold uppercase text-white">
              {HEADLINE.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, ease: EASE, delay: 0.1 + i * 0.09 }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
              <span className="block overflow-hidden">
                <motion.span
                  className="block text-accent-400"
                  initial={{ y: "110%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.1 + HEADLINE.length * 0.09 }}
                >
                  MOVING.
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.5 }}
              className="mt-8 max-w-xl text-pretty text-[15px] leading-relaxed text-white/65"
            >
              Integrated engineering, fabrication, erection, civil, logistics and plant
              operations &amp; maintenance solutions for India&apos;s critical industries.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: EASE, delay: 0.62 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Button href="#capabilities" variant="light" size="lg" withArrow>
                Explore Our Capabilities
              </Button>
              <Button href="#contact" variant="outline" size="lg">
                Talk To Our Team
              </Button>
            </motion.div>
          </div>

          {/* The four pillars, set down the right edge. Decorative on phones,
              where there is no room for a second column. */}
          <motion.ul
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.7 }}
            className="hidden shrink-0 space-y-3 pt-3 text-right lg:block"
            aria-hidden="true"
          >
            {PILLARS.map((word) => (
              <li
                key={word}
                className="text-[11px] font-semibold uppercase tracking-label text-white/35"
              >
                {word}
              </li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {/* ------------------------------ carousel controls ------------------- */}
      {/* The WhatsApp float is fixed to this same corner, so the controls keep
          clear of it rather than sliding underneath. */}
      <div className="container relative z-10 pb-14 sm:pb-10">
        <div className="flex items-center justify-end gap-5 pr-20">
          <div className="flex items-center gap-2">
            <CarouselButton label="Previous slide" onClick={() => go(-1)}>
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </CarouselButton>
            <CarouselButton label="Next slide" onClick={() => go(1)}>
              <ChevronRight className="h-4 w-4" strokeWidth={2} />
            </CarouselButton>
          </div>

          <p className="font-mono text-[11px] tracking-[0.18em] text-white/45 tabular-nums">
            <span className="text-white">{String(index + 1).padStart(2, "0")}</span>
            <span className="mx-1.5 text-white/25">/</span>
            {String(slides.length).padStart(2, "0")}
          </p>
        </div>

        {/* progress hairline — shows how much of the dwell is left */}
        <div className="mt-5 h-px w-full bg-white/10" aria-hidden="true">
          <motion.div
            key={`${index}-${paused}`}
            className="h-px bg-accent-400"
            initial={{ width: "0%" }}
            animate={{ width: paused ? "0%" : "100%" }}
            transition={{ duration: paused ? 0 : DWELL / 1000, ease: "linear" }}
          />
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {company.name} — slide {index + 1} of {slides.length}
      </span>
    </section>
  );
}

function CarouselButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-md border border-white/25 text-white/75",
        "transition-colors duration-300 ease-brand hover:border-accent-400 hover:bg-accent-400 hover:text-navy-950",
      )}
    >
      {children}
    </button>
  );
}
