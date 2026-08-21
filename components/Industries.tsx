"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Building2,
  Car,
  Cpu,
  Factory,
  HardHat,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { industries as staticIndustries, type Industry } from "@/lib/site";
import { cn } from "@/lib/utils";

const ICONS: Record<Industry["icon"], LucideIcon> = {
  power: Zap,
  infrastructure: Building2,
  construction: HardHat,
  manufacturing: Factory,
  automotive: Car,
  electrical: Cpu,
};

const EASE = [0.22, 1, 0.36, 1] as const;

export function Industries({ items }: { items?: Industry[] } = {}) {
  const industries = items ?? staticIndustries;
  return (
    <section
      id="industries"
      className="theme-surface relative bg-surface py-24 lg:py-32"
    >
      <div className="container">
        <SectionHeading
          eyebrow="Industries We Serve"
          title="Six sectors that depend on aluminium behaving exactly as specified."
          intro="Each brings its own standards, tolerances and paperwork. We work to theirs, not to a house average."
        />
      </div>

      {/* --------------------- desktop: expanding panels ------------------ */}
      <div className="container mt-14 hidden lg:mt-20 lg:block">
        <IndustryAccordion industries={industries} />
      </div>

      {/* ----------------------- mobile / tablet grid --------------------- */}
      <div className="container mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
        {industries.map((industry, i) => (
          <Reveal key={industry.name} delay={i * 0.06}>
            <IndustryCard industry={industry} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * Panels share the row width. The panel under the pointer claims roughly
 * two-and-a-half shares, which pushes its copy open without any layout jump —
 * flex-grow interpolates, so nothing reflows outside the row.
 */
function IndustryAccordion({ industries }: { industries: Industry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div
      className="flex h-[520px] gap-3 xl:h-[560px]"
      onMouseLeave={() => setActiveIndex(0)}
    >
      {industries.map((industry, i) => {
        const Icon = ICONS[industry.icon];
        const active = activeIndex === i;

        return (
          <motion.a
            key={industry.name}
            href="#contact"
            onMouseEnter={() => setActiveIndex(i)}
            onFocus={() => setActiveIndex(i)}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.07, ease: EASE }}
            style={{ flexGrow: active ? 2.6 : 1, flexBasis: 0 }}
            aria-label={`${industry.name} — ${industry.description}`}
            className="group relative min-w-0 overflow-hidden rounded-xl transition-[flex-grow] duration-[750ms] ease-brand"
          >
            <MediaImage
              src={industry.image}
              alt=""
              className="absolute inset-0 h-full w-full"
              imgClassName={cn(
                "transition-transform duration-[1600ms] ease-brand",
                active ? "scale-105" : "scale-100",
              )}
              sizes="(min-width: 1280px) 40vw, 30vw"
            />

            {/* gradient deepens under the active panel so copy stays readable */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t transition-opacity duration-700",
                active
                  ? "from-navy-950 via-navy-950/45 to-navy-950/10"
                  : "from-navy-950/95 via-navy-950/55 to-navy-950/35",
              )}
            />
            <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

            <div className="relative flex h-full flex-col justify-between p-6">
              <span
                className={cn(
                  "grid h-11 w-11 place-items-center rounded-full border backdrop-blur-sm transition-all duration-700 ease-brand",
                  active
                    ? "border-white/40 bg-white text-navy-900"
                    : "border-white/20 bg-white/10 text-white",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} aria-hidden="true" />
              </span>

              <div>
                <div className="flex items-end justify-between gap-4">
                  <h3
                    className={cn(
                      "font-display font-medium leading-tight text-white transition-all duration-700 ease-brand",
                      active ? "text-2xl" : "text-lg",
                    )}
                  >
                    {industry.name}
                  </h3>

                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 text-white transition-all duration-700 ease-brand",
                      active
                        ? "translate-x-0 opacity-100"
                        : "translate-x-2 opacity-0",
                    )}
                  >
                    <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                </div>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden text-[13.5px] leading-relaxed text-white/70"
                    >
                      <span className="mt-3 block max-w-sm">{industry.description}</span>
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.a>
        );
      })}
    </div>
  );
}

function IndustryCard({ industry }: { industry: Industry }) {
  const Icon = ICONS[industry.icon];

  return (
    <a
      href="#contact"
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl sm:aspect-[3/4]"
    >
      <MediaImage
        src={industry.image}
        alt=""
        className="absolute inset-0 h-full w-full"
        imgClassName="transition-transform duration-[1400ms] ease-brand group-hover:scale-105"
        sizes="(min-width: 640px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/45 to-navy-950/10" />
      <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

      <div className="relative flex h-full flex-col justify-between p-5">
        <span className="grid h-10 w-10 place-items-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm">
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden="true" />
        </span>

        <div>
          <div className="flex items-center justify-between gap-3">
            <h3 className="font-display text-xl font-medium text-white">
              {industry.name}
            </h3>
            <ArrowUpRight
              className="h-5 w-5 shrink-0 text-white transition-transform duration-500 ease-brand group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-white/65">
            {industry.description}
          </p>
        </div>
      </div>
    </a>
  );
}
