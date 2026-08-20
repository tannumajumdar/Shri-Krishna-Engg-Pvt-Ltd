"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { cn, wrap } from "@/lib/utils";

export type MarqueeItem = {
  src: string;
  alt: string;
  href?: string;
  caption?: string;
  ratio?: "portrait" | "square" | "landscape" | "wide";
};

/**
 * How many times the item set is laid down.
 *
 * The track is periodic, so translating by exactly one set width lands on
 * pixel-identical content — that is what makes the wrap invisible. For that to
 * hold there must always be at least a viewport of content to the right of the
 * furthest travel, i.e. period * (repeat - 1) >= viewport width.
 *
 * Three copies covers a long row on any real display, but a short row — a
 * four-product category, say — has a narrow period and needs more. The count
 * is measured up from MIN rather than fixed, so a row can never run dry.
 */
const MIN_REPEAT = 3;
const MAX_REPEAT = 8;

const RATIO_CLASS: Record<NonNullable<MarqueeItem["ratio"]>, string> = {
  portrait: "aspect-[3/4]",
  square: "aspect-square",
  landscape: "aspect-[4/3]",
  wide: "aspect-[16/10]",
};

type ImageMarqueeProps = {
  items: MarqueeItem[];
  /** Travel in px/second at desktop width. Scaled down on small screens. */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  /** Row height; widths follow from each item ratio. */
  heightClass?: string;
  gapClass?: string;
  className?: string;
  /** Swap in a different tile — used by the product showcase. */
  renderItem?: (item: MarqueeItem, index: number) => ReactNode;
};

export function ImageMarquee({
  items,
  speed = 55,
  direction = "left",
  pauseOnHover = true,
  heightClass = "h-[210px] sm:h-[260px] lg:h-[320px]",
  gapClass = "gap-3 sm:gap-4 lg:gap-6",
  className,
  renderItem,
}: ImageMarqueeProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  const baseX = useMotionValue(0);
  const [period, setPeriod] = useState(0);
  const [repeat, setRepeat] = useState(MIN_REPEAT);
  const [hovered, setHovered] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [speedScale, setSpeedScale] = useState(1);

  /* --- measurement ------------------------------------------------------ */
  /* One period = the width of a single item set, including the gap that
     follows it. Derived from the live track so it stays correct through
     font loads, image swaps and every breakpoint. */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const gap = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      // getBoundingClientRect keeps sub-pixel precision; scrollWidth rounds,
      // and a rounded period leaves a visible sliver at the seam.
      const total = track.getBoundingClientRect().width;
      // period = one set plus its trailing gap, and is invariant of `repeat`.
      setPeriod(total > 0 ? (total + gap) / repeat : 0);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    return () => ro.disconnect();
  }, [items.length, repeat]);

  /* Lay down more copies if one period does not out-run the viewport. Period
     is independent of the copy count, so this settles after one adjustment. */
  useEffect(() => {
    if (period <= 0) return;
    const needed = Math.ceil(window.innerWidth / period) + 2;
    const clamped = Math.min(MAX_REPEAT, Math.max(MIN_REPEAT, needed));
    if (clamped > repeat) setRepeat(clamped);
  }, [period, repeat]);

  /* --- environment ------------------------------------------------------ */
  useEffect(() => {
    const motionMq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const smallMq = window.matchMedia("(max-width: 767px)");
    const midMq = window.matchMedia("(max-width: 1279px)");

    const sync = () => {
      setReduceMotion(motionMq.matches);
      setSpeedScale(smallMq.matches ? 0.6 : midMq.matches ? 0.8 : 1);
    };

    sync();
    motionMq.addEventListener("change", sync);
    smallMq.addEventListener("change", sync);
    midMq.addEventListener("change", sync);
    return () => {
      motionMq.removeEventListener("change", sync);
      smallMq.removeEventListener("change", sync);
      midMq.removeEventListener("change", sync);
    };
  }, []);

  /* Idle while scrolled past — no point burning frames off screen. */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* --- the loop --------------------------------------------------------- */
  const paused = (pauseOnHover && hovered) || !onScreen || reduceMotion;

  useAnimationFrame((_, delta) => {
    if (paused || period <= 0) return;
    // Clamp the step: a backgrounded tab returns one huge delta, which would
    // otherwise teleport the row.
    const dt = Math.min(delta, 64) / 1000;
    const dir = direction === "left" ? -1 : 1;
    baseX.set(baseX.get() + dir * speed * speedScale * dt);
  });

  const x = useTransform(baseX, (v) => (period > 0 ? wrap(-period, 0, v) : 0));

  const tiles = Array.from({ length: repeat }, (_, copy) =>
    items.map((item, i) => ({ item, i, copy, key: `${copy}-${i}` })),
  ).flat();

  /* Reduced motion: a plain, swipeable row. Same content, no perpetual travel. */
  if (reduceMotion) {
    return (
      <div
        className={cn("mask-edges overflow-x-auto overscroll-x-contain", className)}
      >
        <div className={cn("flex w-max", gapClass, heightClass)}>
          {items.map((item, i) => (
            <MarqueeTile key={i} item={item}>
              {renderItem?.(item, i)}
            </MarqueeTile>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={viewportRef}
      className={cn("mask-edges relative overflow-hidden", className)}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <motion.div
        ref={trackRef}
        style={{ x }}
        className={cn("flex w-max will-change-transform", gapClass, heightClass)}
      >
        {tiles.map(({ item, i, copy, key }) => (
          <MarqueeTile key={key} item={item} duplicate={copy > 0}>
            {renderItem?.(item, i)}
          </MarqueeTile>
        ))}
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

function MarqueeTile({
  item,
  duplicate = false,
  children,
}: {
  item: MarqueeItem;
  duplicate?: boolean;
  children?: ReactNode;
}) {
  const content = children ?? <DefaultTile item={item} />;

  /* A custom tile owns its own width, radius and clipping — only the default
     tile gets the ratio box and rounded mask. */
  const shell = cn(
    "group/tile relative h-full shrink-0",
    !children && cn("overflow-hidden rounded-lg", RATIO_CLASS[item.ratio ?? "landscape"]),
  );

  /* Every copy after the first exists only to make the loop seamless — keep
     them out of the accessibility tree and out of the tab order. */
  const a11y = duplicate ? { "aria-hidden": true as const, tabIndex: -1 } : {};

  if (item.href) {
    return (
      <a href={item.href} className={cn(shell, "block")} {...a11y}>
        {content}
      </a>
    );
  }

  return (
    <div className={shell} {...a11y}>
      {content}
    </div>
  );
}

function DefaultTile({ item }: { item: MarqueeItem }) {
  return (
    <>
      <MediaImage
        src={item.src}
        alt={item.alt}
        className="h-full w-full"
        imgClassName="transition-transform duration-[1200ms] ease-brand group-hover/tile:scale-[1.07]"
      />

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent opacity-80 transition-opacity duration-500 group-hover/tile:opacity-100" />
      <div className="pointer-events-none absolute inset-0 rounded-lg ring-1 ring-inset ring-white/10" />

      {item.caption && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
          <span className="translate-y-1 text-[13px] font-medium leading-tight text-white opacity-0 transition-all duration-500 ease-brand group-hover/tile:translate-y-0 group-hover/tile:opacity-100">
            {item.caption}
          </span>
          <ArrowUpRight
            className="h-4 w-4 shrink-0 translate-y-1 text-white opacity-0 transition-all duration-500 ease-brand group-hover/tile:translate-y-0 group-hover/tile:opacity-100"
            strokeWidth={1.75}
            aria-hidden="true"
          />
        </div>
      )}
    </>
  );
}
