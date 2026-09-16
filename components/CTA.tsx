"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Phone } from "lucide-react";
import { VideoBackground } from "@/components/VideoBackground";
import { parallaxRange, useParallaxEnabled } from "@/lib/use-parallax";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { contact, media } from "@/lib/site";

/** Set down the right edge — what the work is meant to leave behind. */
const OUTCOMES = ["Safer", "Stronger", "Cleaner", "Greener", "Together"];

export function CTA({
  video,
}: {
  video?: { src: string; poster: string };
} = {}) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const parallax = useParallaxEnabled();
  const y = useTransform(scrollYProgress, [0, 1], parallaxRange(parallax, ["-10%", "10%"], "0%"));

  return (
    <section id="contact" ref={ref} className="on-dark relative overflow-hidden bg-navy-950">
      {/* Over-sized so the parallax shift never exposes a plate edge. */}
      <motion.div style={{ y }} className="absolute -inset-y-[12%] inset-x-0">
        <VideoBackground
          src={video?.src ?? media.ctaVideo}
          poster={video?.poster ?? media.ctaPoster}
          overlayOpacity={0.72}
          objectPosition="object-[50%_50%]"
          grid
        />
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/40 to-transparent"
        aria-hidden="true"
      />

      <div className="container relative py-24 lg:py-32">
        <div className="flex items-center justify-between gap-12">
          <div className="max-w-2xl">
            <Reveal>
              <span className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-label text-white/50">
                <span className="h-px w-10 bg-accent-400" />
                Have an industrial project to execute?
              </span>
            </Reveal>

            <Reveal delay={0.08}>
              <h2 className="font-display text-display-sm font-semibold uppercase leading-[1.05] tracking-tight text-white">
                Let&apos;s engineer
                <br />
                <span className="text-accent-400">the solution.</span>
              </h2>
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mt-7 max-w-lg text-pretty text-[14px] leading-relaxed text-white/60">
                Whether you need fabrication, erection, maintenance, plant O&amp;M or
                complete industrial execution, talk to our engineering team.
              </p>
            </Reveal>

            <Reveal delay={0.24}>
              <div className="mt-10 flex flex-wrap items-center gap-4">
                <Button href={contact.emailHref} variant="light" size="lg" withArrow>
                  Start A Project
                </Button>
                <Button href={contact.phoneHref} variant="outline" size="lg">
                  <Phone className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Call Our Team
                </Button>
              </div>
            </Reveal>
          </div>

          {/* pr clears the fixed WhatsApp float, which sits in this corner */}
          <Reveal delay={0.3} className="hidden shrink-0 lg:block lg:pr-16">
            <ul className="space-y-2.5 text-right" aria-hidden="true">
              {OUTCOMES.map((word) => (
                <li
                  key={word}
                  className="text-[11px] font-semibold uppercase tracking-label text-white/35"
                >
                  {word}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
