"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { VideoBackground } from "@/components/VideoBackground";
import { RevealHeading, Reveal } from "@/components/ui/Reveal";
import { media } from "@/lib/site";

const CAPABILITIES = [
  "Extrusion",
  "Casting",
  "CNC Machining",
  "Fabrication",
  "Anodising",
  "Powder Coating",
];

/**
 * Full-bleed cinematic band. The footage travels at roughly 80% of page speed
 * so the section reads with depth without the layer ever exposing an edge.
 */
export function IndustrialShowcase() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-14%", "14%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.06, 1, 1.06]);
  const textY = useTransform(scrollYProgress, [0, 1], ["18%", "-18%"]);

  return (
    <section
      ref={ref}
      className="on-dark relative flex min-h-[85svh] items-center overflow-hidden bg-navy-950 lg:min-h-[95svh]"
    >
      {/* Over-sized so the parallax shift never reveals the plate edges. */}
      <motion.div style={{ y, scale }} className="absolute -inset-y-[16%] inset-x-0">
        <VideoBackground
          src={media.industryVideo}
          poster={media.industryPoster}
          overlayOpacity={0.6}
          objectPosition="object-[50%_50%]"
        />
      </motion.div>

      <motion.div
        style={{ y: textY }}
        className="container relative z-10 py-28 text-center lg:py-36"
      >
        <Reveal>
          <p className="eyebrow justify-center text-white/50">Capability</p>
        </Reveal>

        <RevealHeading
          as="h2"
          delay={0.08}
          stagger={0.07}
          text="Built for Industry. Designed for Excellence."
          className="mx-auto mt-7 max-w-4xl font-display text-display-md font-light text-white"
        />

        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-xl text-pretty text-[15px] leading-relaxed text-white/65 sm:text-base">
            Six processes, one plant, one accountable team — from molten metal
            to a finished part on your dock.
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <ul className="mx-auto mt-12 flex max-w-3xl flex-wrap items-center justify-center gap-x-3 gap-y-3">
            {CAPABILITIES.map((c) => (
              <li
                key={c}
                className="rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-[13px] font-medium text-white/80 backdrop-blur-sm transition-colors duration-500 hover:border-white/40 hover:bg-white/10 hover:text-white"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </motion.div>

      {/* blend the band into the sections either side */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-navy-950 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface to-transparent"
        aria-hidden="true"
      />
    </section>
  );
}
