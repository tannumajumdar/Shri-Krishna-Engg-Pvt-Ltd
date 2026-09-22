"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  capabilityHeadlines,
  capabilityHeroImages,
  media,
  productCategories as staticCategories,
  type ProductCategory,
} from "@/lib/site";
import { parallaxRange, useParallaxEnabled } from "@/lib/use-parallax";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Reads down the right edge — the four things the pitch rests on. */
const PILLARS = ["PEOPLE", "EXPERIENCE", "EXECUTION", "RESULTS"];

/** How long a slide holds before the carousel advances on its own. */
const DWELL = 3000;

type Slide = {
  id: string;
  name: string;
  blurb: string;
  image: string;
  lead: string;
  accent: string;
};

/**
 * Turn the capability records into hero slides.
 *
 * Name and blurb come from the category itself, so the copy stays whatever the
 * admin maintains under Products. The backdrop prefers the dedicated hero
 * frame — the in-house photographs are only 600–1600px wide and go soft at
 * full-bleed — and falls back to the category's own product photograph.
 */
function toSlides(categories: ProductCategory[]): Slide[] {
  return categories.slice(0, 6).map((c) => {
    const head = capabilityHeadlines[c.id];
    return {
      id: c.id,
      name: c.name,
      blurb: c.blurb,
      image: capabilityHeroImages[c.id] || c.products[0]?.image || media.heroPoster,
      lead: head?.lead ?? "Engineering that keeps",
      accent: head?.accent ?? `${c.name.toLowerCase()}.`,
    };
  });
}

export function Hero({
  /** The six capabilities. Each becomes one slide. */
  categories,
}: {
  categories?: ProductCategory[];
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

  const slides = toSlides(categories?.length ? categories : staticCategories);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[index];

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

  /* Preload every slide so a click never shows an empty frame. */
  useEffect(() => {
    for (const s of slides) {
      const img = new Image();
      img.src = s.image;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length]);

  if (!slide) return null;

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
            key={slide.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 0.6, ease: "easeInOut" },
              scale: { duration: 3.6, ease: "linear" },
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={slide.image}
              alt=""
              aria-hidden="true"
              className="h-full w-full object-cover object-[50%_45%] brightness-[0.86] contrast-[1.04]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Travels with the frame: a foot fade so the controls at the bottom
            keep their contrast. Deliberately thin — the old stack put four
            navy layers over every photograph and flattened all of them to the
            same slab. Opacity steps have to be multiples of 5: Tailwind only
            generates those, and anything else silently produces no class at
            all, so the layer renders as nothing. */}
        <div
          className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-transparent to-navy-950/40"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-grid-fine opacity-[0.16]" aria-hidden="true" />
      </motion.div>

      {/* Held still while the frame drifts, so it stays locked to the type, and
          built from the two colours in the mark: navy carries the weight behind
          the headline, the lime of the K glows in off the opposite shoulder.

          Its direction follows the layout. On a phone the type runs the full
          width, so the weight falls from the top and the lower third of the
          photograph comes through; from lg up the copy sits left and the ramp
          turns with it, leaving the right side clear.

          The phone ramp is deliberately two stops. It carried via/to stops on
          non-multiple-of-5 opacities for a while, which Tailwind never
          generated, so what actually shipped — and what was signed off — was
          this plain 90-to-transparent fall. Adding the mid stops back makes
          the phone hero markedly darker. */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy-950/90 to-transparent lg:bg-gradient-to-r lg:from-navy-950 lg:via-navy-950/55 lg:to-navy-950/5"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(42%_55%_at_92%_48%,rgba(140,198,63,0.13),transparent_72%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy-950 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 flex flex-1 flex-col justify-center pb-32 pt-[calc(var(--nav-h)+3rem)]"
      >
        <div className="flex items-start justify-between gap-10">
          {/* The copy changes with the frame behind it, so the whole block is
              keyed to the slide and swapped as one. */}
          <div className="max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: EASE }}
              >
                <span className="mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-accent-400">
                  <span className="h-px w-10 bg-accent-400" />
                  {slide.name}
                </span>

                <h1 className="font-display text-display-md font-semibold uppercase text-white">
                  <span className="block">{slide.lead}</span>
                  <span className="block text-accent-400">{slide.accent}</span>
                </h1>

                <p className="mt-8 max-w-xl text-pretty text-[15px] leading-relaxed text-white/75 [text-shadow:0_1px_12px_rgba(7,15,34,0.75)]">
                  {slide.blurb}
                </p>

                <div className="mt-10 flex flex-wrap items-center gap-4">
                  <Button href={`/services#${slide.id}`} variant="light" size="lg" withArrow>
                    View {slide.name}
                  </Button>
                  <Button href="#contact" variant="outline" size="lg">
                    Talk To Our Team
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The four pillars, set down the right edge. Hidden on phones,
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
                className="flex items-center justify-end gap-2.5 text-[11px] font-semibold uppercase tracking-label text-white/70 [text-shadow:0_1px_10px_rgba(7,15,34,0.9)]"
              >
                {word}
                <span className="h-px w-4 bg-accent-400/70" aria-hidden="true" />
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
            <CarouselButton label="Previous capability" onClick={() => go(-1)}>
              <ChevronLeft className="h-4 w-4" strokeWidth={2} />
            </CarouselButton>
            <CarouselButton label="Next capability" onClick={() => go(1)}>
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
        {slide.name} — capability {index + 1} of {slides.length}
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
