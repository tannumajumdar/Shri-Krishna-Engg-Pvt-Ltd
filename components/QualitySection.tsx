"use client";

import { motion } from "framer-motion";
import { Award, Leaf, ScrollText, Gauge, type LucideIcon } from "lucide-react";
import { VideoBackground } from "@/components/VideoBackground";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { media, qualityPoints as staticQualityPoints } from "@/lib/site";

const POINT_ICONS: LucideIcon[] = [Award, ScrollText, Leaf, Gauge];

export function QualitySection({
  points,
  video,
}: {
  points?: { title: string; description: string }[];
  video?: { src: string; poster: string };
} = {}) {
  const qualityPoints = points ?? staticQualityPoints;
  return (
    <section id="quality" className="relative bg-navy-950 lg:min-h-[92svh]">
      <div className="grid lg:grid-cols-2">
        {/* ------------------------------ media ------------------------- */}
        <div className="relative min-h-[380px] overflow-hidden lg:min-h-full">
          <VideoBackground
            src={video?.src ?? media.qualityVideo}
            poster={video?.poster ?? media.qualityPoster}
            overlayOpacity={0.4}
            objectPosition="object-[50%_45%]"
          />

          {/* seam blend into the copy panel */}
          <div
            className="pointer-events-none absolute inset-y-0 right-0 hidden w-40 bg-gradient-to-r from-transparent to-navy-950 lg:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-navy-950 to-transparent lg:hidden"
            aria-hidden="true"
          />

          {/* floating certification plate */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-8 left-8 max-w-[15rem] rounded-xl border border-white/15 bg-navy-950/60 p-5 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <Award className="h-5 w-5 text-accent-400" strokeWidth={1.5} aria-hidden="true" />
              <span className="font-display text-sm font-medium text-white">
                ISO 9001 aligned
              </span>
            </div>
            <p className="mt-2.5 text-[12.5px] leading-relaxed text-white/55">
              Every batch leaves with its inspection record and material
              traceability intact.
            </p>
          </motion.div>
        </div>

        {/* ------------------------------- copy ------------------------- */}
        <div className="on-dark relative flex items-center overflow-hidden bg-navy-950 px-6 py-20 sm:px-10 lg:px-14 lg:py-28 xl:px-20">
          <div
            className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-30"
            aria-hidden="true"
          />

          <div className="relative w-full max-w-xl">
            <Reveal>
              <p className="eyebrow text-white/50">Quality &amp; Sustainability</p>
            </Reveal>

            <RevealHeading
              as="h2"
              delay={0.06}
              text="Quality That Drives Progress"
              className="mt-6 font-display text-display-sm font-light text-white"
            />

            <Reveal delay={0.14}>
              <p className="mt-7 text-pretty text-[15px] leading-relaxed text-white/65">
                Quality is not an inspection stage at the end of our line — it
                is the reason the line is laid out the way it is. Material is
                verified on arrival, dimensions are checked between operations,
                and nothing is released without a record that can be traced back
                to the billet it came from.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-5 text-pretty text-[15px] leading-relaxed text-white/65">
                Aluminium is endlessly recyclable, and we treat that as an
                obligation rather than a talking point. Process scrap returns to
                our own furnace, recovered heat is put back to work, and energy
                drawn per tonne is measured the same way we measure tolerance.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2">
              {qualityPoints.map((point, i) => {
                const Icon = POINT_ICONS[i];
                return (
                  <Reveal key={point.title} delay={0.24 + i * 0.07}>
                    <div className="group">
                      <div className="flex items-center gap-3">
                        <Icon
                          className="h-[18px] w-[18px] shrink-0 text-accent-400 transition-transform duration-500 ease-brand group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                        <h3 className="font-display text-[15px] font-medium text-white">
                          {point.title}
                        </h3>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-white/50">
                        {point.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.5} className="mt-12">
              <Button href="#contact" variant="light" size="lg" withArrow>
                Talk to Our Quality Team
              </Button>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
