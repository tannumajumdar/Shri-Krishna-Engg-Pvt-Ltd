"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";
import { Stats } from "@/components/Stats";
import { company, media } from "@/lib/site";
import {
  Wrench,
  ShieldCheck,
  Users,
  Target,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const CAPABILITIES = [
  {
    icon: Wrench,
    title: "Engineering & Fabrication",
    description:
      "Complete in-house fabrication capability — structural steel, plate work, pipe spools, tanks and platforms built to drawing in our own yard.",
  },
  {
    icon: ShieldCheck,
    title: "Quality Assurance",
    description:
      "ISO-aligned quality systems with documented stage-wise inspections, material traceability and certified test reports for every project we deliver.",
  },
  {
    icon: Users,
    title: "250+ Skilled Workforce",
    description:
      "Certified welders, qualified riggers, experienced fitters and trained crane operators — all on our own rolls, available round-the-clock.",
  },
  {
    icon: Target,
    title: "Turnkey Execution",
    description:
      "Single-point responsibility from foundation to commissioning — mechanical, fabrication, erection, civil and transportation under one roof.",
  },
];

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
                      alt="Shree Krishna Engineering Balco production floor"
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
                <div className="rounded-xl bg-brand-600 px-5 py-4 text-white shadow-lift-lg ring-1 ring-white/10">
                  <div className="font-display text-3xl font-light leading-none">
                    {new Date().getFullYear() - company.established}
                    <span className="text-brand-200">+</span>
                  </div>
                  <div className="mt-1.5 text-[10px] uppercase tracking-[0.18em] text-white/75">
                    Years
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* ------------------------------ copy ------------------------- */}
          <div className="lg:col-span-6 xl:col-span-5 xl:col-start-8">
            <Reveal>
              <p className="eyebrow text-ink-faint">About Shree Krishna Engineering Balco</p>
            </Reveal>

            <RevealHeading
              as="h2"
              delay={0.08}
              text="Nineteen years of engineering, fabrication and plant services at BALCO."
              className="mt-6 font-display text-display-sm font-light text-ink"
            />

            <Reveal delay={0.15} className="mt-7 space-y-5 text-[15px] leading-relaxed text-ink-muted">
              <p>
                <span className="text-brand-600 font-medium">Established in 2006</span> in the BALCO
                industrial belt at Korba, Shree Krishna Engineering has built a reputation
                as a dependable engineering contractor serving some of India&apos;s most
                demanding aluminium and heavy industry plants.
              </p>
              <p>
                We deliver end-to-end <span className="text-brand-600 font-medium">mechanical works</span>,
                structural <span className="text-brand-600 font-medium">fabrication</span>,
                equipment <span className="text-brand-600 font-medium">erection</span>, civil construction
                and transportation — with single-point responsibility from foundation to commissioning.
              </p>
              <p>
                At BALCO Rolled Product we run round-the-clock operations and
                maintenance across the foundry, rolling mills and material
                handling lines. Our own workforce, fabrication yard and transport
                fleet let us hold schedules and deliver <span className="text-brand-600 font-medium">quality
                engineering solutions</span> where downtime is simply not an option.
              </p>
            </Reveal>

            <Reveal delay={0.22} className="mt-9">
              <Button href="#products" variant="solid" size="lg" withArrow>
                Explore Products
              </Button>
            </Reveal>
          </div>
        </div>

        {/* ----------------------- capability cards ----------------------- */}
        <Reveal delay={0.1} className="mt-20 lg:mt-28">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((cap) => {
              const Icon = cap.icon;
              return (
                <div
                  key={cap.title}
                  className="group relative overflow-hidden rounded-xl border border-hairline bg-surface p-6 transition-all duration-500 hover:border-brand-300 hover:shadow-lift"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-50 text-brand-600 transition-colors duration-300 group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-900/30 dark:text-brand-400">
                    <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-sm font-semibold text-ink">
                    {cap.title}
                  </h3>
                  <p className="mt-2 text-[13px] leading-relaxed text-ink-muted">
                    {cap.description}
                  </p>
                </div>
              );
            })}
          </div>
        </Reveal>

        {/* ------------------------------- stats -------------------------- */}
        <Stats items={stats} className="mt-16 border border-hairline lg:mt-20" />
      </div>
    </section>
  );
}
