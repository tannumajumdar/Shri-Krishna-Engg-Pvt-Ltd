"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Building2,
  Car,
  Cpu,
  Factory,
  HardHat,
  Zap,
  CheckCircle2,
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

const SECTOR_NAMES: Record<string, string> = {
  Power: "Power & Energy Sector",
  Infrastructure: "Infrastructure Sector",
  Construction: "Industrial Construction",
  Manufacturing: "Heavy Manufacturing",
  Automotive: "Automotive & Process",
  Electrical: "Electrical Systems",
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
          title="Six sectors that rely on us to keep their plants running."
          intro="Click any sector card to view full capabilities, detailed specifications, and engineering solutions."
        />
      </div>

      {/* --------------------- desktop: interactive expanding cards ------------------ */}
      <div className="container mt-14 hidden lg:mt-16 lg:block">
        <IndustryAccordion industries={industries} />
      </div>

      {/* ----------------------- mobile / tablet grid --------------------- */}
      <div className="container mt-12 grid gap-5 sm:grid-cols-2 lg:hidden">
        {industries.map((industry, i) => (
          <Reveal key={industry.name} delay={i * 0.06}>
            <IndustryCard industry={industry} index={i} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function IndustryAccordion({ industries }: { industries: Industry[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex h-[540px] gap-3 xl:h-[580px]">
      {industries.map((industry, i) => {
        const Icon = ICONS[industry.icon];
        const active = activeIndex === i;
        const fullName = SECTOR_NAMES[industry.name] || `${industry.name} Sector`;

        return (
          <div
            key={industry.name}
            onClick={() => setActiveIndex(i)}
            onMouseEnter={() => setActiveIndex(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && setActiveIndex(i)}
            style={{ flexGrow: active ? 3.2 : 1, flexBasis: 0 }}
            className={cn(
              "group relative min-w-0 overflow-hidden rounded-2xl cursor-pointer transition-[flex-grow] duration-[700ms] ease-brand border shadow-xl",
              active
                ? "border-brand-400/60 ring-2 ring-brand-400/30"
                : "border-white/10 hover:border-white/30"
            )}
          >
            {/* Background Image */}
            <MediaImage
              src={industry.image}
              alt={fullName}
              className="absolute inset-0 h-full w-full"
              imgClassName={cn(
                "transition-transform duration-[1400ms] ease-brand",
                active ? "scale-105" : "scale-100"
              )}
              sizes="(min-width: 1280px) 45vw, 30vw"
            />

            {/* Dark gradient overlay for readability */}
            <div
              className={cn(
                "absolute inset-0 bg-gradient-to-t transition-opacity duration-500 pointer-events-none z-0",
                active
                  ? "from-navy-950 via-navy-950/75 to-navy-950/25"
                  : "from-navy-950/95 via-navy-950/65 to-navy-950/40"
              )}
            />
            <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none z-0" />

            {/* Content Container (z-10 guarantees visibility above overlays) */}
            <div className="relative z-10 flex h-full flex-col justify-between p-5 xl:p-6 select-none">
              {/* TOP: Number Badge & Icon */}
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    "grid h-11 w-11 place-items-center rounded-full border backdrop-blur-md transition-all duration-500 ease-brand shadow-md",
                    active
                      ? "border-brand-400 bg-brand-500 text-navy-950 font-bold"
                      : "border-white/30 bg-navy-950/80 text-white"
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
                </span>

                <span className="font-mono text-xs font-bold text-brand-400 bg-navy-950/90 px-3 py-1 rounded-full border border-white/20 shadow-md">
                  0{i + 1}
                </span>
              </div>

              {/* BOTTOM: Sector Name & Details */}
              <div className="w-full">
                <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-brand-400 mb-1 drop-shadow">
                  Sector 0{i + 1}
                </span>

                <h3
                  className={cn(
                    "font-display font-bold text-white transition-all duration-500 drop-shadow-md",
                    active
                      ? "text-2xl xl:text-3xl mb-2"
                      : "text-base xl:text-lg leading-tight break-words text-white"
                  )}
                >
                  {fullName}
                </h3>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <p className="mt-2 text-sm leading-relaxed text-white/85 max-w-md">
                        {industry.description}
                      </p>

                      <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between gap-3">
                        <span className="inline-flex items-center gap-1.5 text-xs text-brand-300 font-medium">
                          <CheckCircle2 className="h-4 w-4 text-brand-400 shrink-0" />
                          Dedicated Services
                        </span>

                        <a
                          href="#contact"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-bold text-navy-950 transition-all hover:bg-brand-400 hover:shadow-lg shrink-0"
                        >
                          Enquire Now
                          <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function IndustryCard({ industry, index }: { industry: Industry; index: number }) {
  const Icon = ICONS[industry.icon];
  const fullName = SECTOR_NAMES[industry.name] || `${industry.name} Sector`;

  return (
    <div className="group relative block aspect-[4/3] overflow-hidden rounded-2xl sm:aspect-[3/4] shadow-xl border border-white/15">
      <MediaImage
        src={industry.image}
        alt={fullName}
        className="absolute inset-0 h-full w-full"
        imgClassName="transition-transform duration-[1400ms] ease-brand group-hover:scale-105"
        sizes="(min-width: 640px) 50vw, 100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/60 to-navy-950/20 pointer-events-none z-0" />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10 pointer-events-none z-0" />

      <div className="relative z-10 flex h-full flex-col justify-between p-5">
        <div className="flex items-center justify-between">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-navy-950/80 text-white backdrop-blur-sm shadow-md">
            <Icon className="h-5 w-5" strokeWidth={2} aria-hidden="true" />
          </span>
          <span className="font-mono text-xs font-bold text-brand-400 bg-navy-950/90 px-3 py-1 rounded-full border border-white/20">
            0{index + 1}
          </span>
        </div>

        <div>
          <span className="block font-mono text-[10px] font-bold uppercase tracking-wider text-brand-400 mb-1">
            Sector 0{index + 1}
          </span>
          <h3 className="font-display text-xl font-bold text-white drop-shadow-md mb-2">
            {fullName}
          </h3>
          <p className="text-[13px] leading-relaxed text-white/85 mb-4">
            {industry.description}
          </p>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-bold text-navy-950 transition-all hover:bg-brand-400"
          >
            Enquire Now
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
