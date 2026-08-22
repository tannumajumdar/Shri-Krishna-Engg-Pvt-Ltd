"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";
import { Stats } from "@/components/Stats";
import { company, media } from "@/lib/site";

const EASE = [0.22, 1, 0.36, 1] as const;

export function About({
  stats,
}: {
  stats?: { value: number; suffix: string; label: string; detail?: string }[];
} = {}) {
  const imageRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section
      id="about"
      className="theme-surface relative bg-surface py-24 lg:py-36"
    >
      {/* hairline rule that anchors the section to the grid */}
      <div className="container">
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-16 xl:gap-24">
          {/* ------------------------------ visual ----------------------- */}
          <div className="lg:col-span-6 xl:col-span-6">
            <div className="relative">
              {/* The in-view trigger has to live on an UNCLIPPED element: an
                  element clipped to zero by its own clip-path reports no
                  intersection, so a whileInView placed on it would wait on a
                  reveal that only it could start. The parent observes, the
                  child clips. */}
              <motion.div
                ref={imageRef}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-90px" }}
                className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:aspect-[5/6] lg:aspect-[4/5]"
              >
                <motion.div
                  variants={{
                    hidden: { clipPath: "inset(0% 0% 100% 0%)" },
                    show: {
                      clipPath: "inset(0% 0% 0% 0%)",
                      transition: { duration: 1.15, ease: EASE },
                    },
                  }}
                  className="absolute inset-0"
                >
                  <motion.div style={{ y: imgY }} className="absolute -inset-y-[8%] inset-x-0">
                    <MediaImage
                      src={media.about}
                      alt="Shri Krishna Engineering production floor"
                      className="h-full w-full"
                      sizes="(min-width: 1024px) 50vw, 100vw"
                    />
                  </motion.div>
                </motion.div>
                <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ink/10" />
              </motion.div>

              {/* overlapping secondary plate */}
              <Reveal
                delay={0.25}
                className="absolute -bottom-10 -right-4 hidden w-44 sm:block lg:-right-10 lg:w-52"
              >
                <div className="overflow-hidden rounded-xl border-4 border-surface shadow-lift-lg">
                  <MediaImage
                    src={media.aboutSecondary}
                    alt="Site team on the shop floor at BALCO"
                    className="aspect-square w-full"
                  />
                </div>
              </Reveal>

              {/* years badge */}
              <Reveal
                delay={0.4}
                className="absolute -left-4 top-8 hidden lg:block"
              >
                <div className="rounded-xl bg-navy-800 px-5 py-4 text-white shadow-lift-lg ring-1 ring-white/10">
                  <div className="font-display text-3xl font-light leading-none">
                    {new Date().getFullYear() - company.established}
                    <span className="text-accent-400">+</span>
                  </div>
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/55">
                    Years
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ------------------------------ copy ------------------------- */}
          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
            <Reveal>
              <p className="eyebrow text-ink-faint">About Shri Krishna Engineering</p>
            </Reveal>

            <RevealHeading
              as="h2"
              delay={0.08}
              text="Twenty-five years of engineering, fabrication and plant services at BALCO."
              className="mt-6 font-display text-display-sm font-light text-ink"
            />

            <Reveal delay={0.15} className="mt-7 space-y-5 text-[15px] leading-relaxed text-ink-muted">
              <p>
                Based in the BALCO industrial belt at Korba, Shri Krishna
                Engineering is an engineering contractor serving some of
                India’s most demanding plants — running mechanical, fabrication,
                erection, civil and transportation work where downtime is not
                an option.
              </p>
              <p>
                At BALCO Rolled Product we run round-the-clock operations and
                maintenance across the foundry, rolling mills and material
                handling. Our own workforce, fabrication yard and transport
                fleet let us hold schedules and take single-point
                responsibility from foundation to commissioning.
              </p>
            </Reveal>

            <Reveal delay={0.22} className="mt-9">
              <Button href="#products" variant="solid" size="lg" withArrow>
                Our Services
              </Button>
            </Reveal>
          </div>
        </div>

        {/* ------------------------------- stats -------------------------- */}
        <Stats items={stats} className="mt-20 border border-hairline lg:mt-28" />
      </div>
    </section>
  );
}
