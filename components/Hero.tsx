"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VideoBackground } from "@/components/VideoBackground";
import { Button } from "@/components/ui/Button";
import { company, media } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE = ["Precision", "Engineering &", "Manufacturing"];

const MARKERS = [
  { k: "Est.", v: String(company.established) },
  { k: "Unit", v: "BALCO, Korba" },
  { k: "Scope", v: "Turnkey Execution" },
];

export function Hero({
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
  const mediaY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "-14%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      id="home"
      ref={ref}
      className="on-dark relative flex min-h-[100svh] flex-col overflow-hidden bg-navy-950"
    >
      <motion.div style={{ y: mediaY }} className="absolute inset-0 -bottom-[22%]">
        <VideoBackground
          src={video?.src ?? media.heroVideo}
          poster={video?.poster ?? media.heroPoster}
          overlayOpacity={0.58}
          grid
          objectPosition="object-[50%_45%]"
        />
      </motion.div>

      {/* left-side vignette keeps the headline off busy footage */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/85 via-navy-950/25 to-transparent"
        aria-hidden="true"
      />

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="container relative z-10 flex flex-1 flex-col justify-center pb-28 pt-[calc(var(--nav-h)+3rem)]"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8, ease: EASE }}
          className="eyebrow text-white/65"
        >
          {company.legalName} · Established in {company.established}
        </motion.p>

        <h1 className="mt-7 max-w-5xl font-display text-display-lg font-light text-white">
          {HEADLINE.map((line, i) => (
            <span
              key={line}
              className="block overflow-hidden pb-[0.09em] [margin-bottom:-0.09em]"
            >
              <motion.span
                className="block"
                initial={{ y: "112%" }}
                animate={{ y: "0%" }}
                transition={{ delay: 0.35 + i * 0.11, duration: 1.05, ease: EASE }}
              >
                {i === 0 ? (
                  <span className="text-brand-400">{line}</span>
                ) : i === 2 ? (
                  <span className="metal-text font-normal">{line}</span>
                ) : (
                  line
                )}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.9, ease: EASE }}
          className="mt-8 max-w-xl text-pretty text-base leading-relaxed text-white/70 sm:text-lg"
        >
          Delivering reliable mechanical, fabrication, erection, civil and transportation
          solutions for India&apos;s heavy industry — with nearly two decades of proven
          expertise at BALCO, Korba.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.9, ease: EASE }}
          className="mt-11 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"
        >
          <Button href="#products" variant="light" size="lg" withArrow>
            Explore Products
          </Button>
          <Button href="#contact" variant="outline" size="lg">
            Contact Us
          </Button>
        </motion.div>
      </motion.div>

      {/* ------------------------- baseline strip ------------------------- */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.35, duration: 1 }}
        className="relative z-10 border-t border-white/10 bg-navy-950/25 backdrop-blur-md"
      >
        <div className="container flex items-center justify-between gap-6 py-5">
          <dl className="flex flex-wrap items-center gap-x-10 gap-y-3">
            {MARKERS.map((m) => (
              <div key={m.k} className="flex items-baseline gap-2.5">
                <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                  {m.k}
                </dt>
                <dd className="text-[13px] font-medium text-white/85">{m.v}</dd>
              </div>
            ))}
          </dl>

          <a
            href="#about"
            className="group hidden shrink-0 items-center gap-3 text-[11px] font-medium uppercase tracking-label text-white/50 transition-colors hover:text-white md:flex"
          >
            Scroll
            <span className="relative block h-9 w-5 rounded-full border border-white/25">
              <span className="absolute left-1/2 top-1.5 h-1.5 w-px -translate-x-1/2 animate-scroll-hint bg-white/70" />
            </span>
          </a>
        </div>
      </motion.div>
    </section>
  );
}
