"use client";

import {
  Cog,
  Factory,
  ShieldCheck,
  Ruler,
  Truck,
  Layers,
  type LucideIcon,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { features as staticFeatures, type Feature } from "@/lib/site";

const ICONS: Record<Feature["icon"], LucideIcon> = {
  expertise: Cog,
  infrastructure: Factory,
  quality: ShieldCheck,
  precision: Ruler,
  delivery: Truck,
  custom: Layers,
};

export function WhyChooseUs({ items }: { items?: Feature[] } = {}) {
  const features = items ?? staticFeatures;
  return (
    <section className="theme-surface relative bg-surface-2 py-24 lg:py-32">
      {/* faint sheet-metal wash */}
      <div
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_50%_0%,rgba(255,255,255,0.9),transparent_60%)] dark:hidden"
        aria-hidden="true"
      />

      <div className="container relative">
        <SectionHeading
          align="center"
          eyebrow="Why Choose Us"
          title="Six reasons engineers keep sending us the difficult drawings."
        />

        <RevealGroup className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = ICONS[feature.icon];

            return (
              <RevealItem key={feature.title}>
                <article className="group relative h-full overflow-hidden bg-surface p-8 transition-colors duration-500 lg:p-10">
                  {/* navy wash rises out of the card on hover */}
                  <span className="absolute inset-0 translate-y-full bg-navy-900 transition-transform duration-[700ms] ease-brand group-hover:translate-y-0 dark:bg-navy-700" />

                  <div className="relative">
                    <span className="grid h-12 w-12 place-items-center rounded-xl border border-hairline bg-surface-2 text-ink transition-all duration-[600ms] ease-brand group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                    </span>

                    <h3 className="mt-7 font-display text-lg font-medium leading-snug text-ink transition-colors duration-[600ms] group-hover:text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-3 text-[14px] leading-relaxed text-ink-muted transition-colors duration-[600ms] group-hover:text-white/65">
                      {feature.description}
                    </p>

                    {/* hairline that draws out under the copy */}
                    <span className="mt-7 block h-px w-10 bg-ink transition-all duration-[700ms] ease-brand group-hover:w-20 group-hover:bg-accent-400" />
                  </div>
                </article>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
