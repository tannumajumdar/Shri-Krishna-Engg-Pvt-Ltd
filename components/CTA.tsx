"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Mail, MapPin, Phone, type LucideIcon } from "lucide-react";
import { MediaImage } from "@/components/ui/MediaImage";
import { Button } from "@/components/ui/Button";
import { Reveal, RevealHeading } from "@/components/ui/Reveal";
import { contact, media } from "@/lib/site";

const CHANNELS: Array<{
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}> = [
  { icon: Phone, label: "Call", value: contact.phone, href: contact.phoneHref },
  { icon: Mail, label: "Email", value: contact.email, href: contact.emailHref },
  { icon: MapPin, label: "Works", value: "BALCO Nagar, Korba, Chhattisgarh" },
];

export function CTA() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section
      id="contact"
      ref={ref}
      className="on-dark relative overflow-hidden bg-navy-950"
    >
      <motion.div style={{ y }} className="absolute -inset-y-[14%] inset-x-0">
        <MediaImage
          src={media.ctaImage}
          alt=""
          className="h-full w-full"
          sizes="100vw"
        />
      </motion.div>

      <div className="absolute inset-0 bg-navy-950/80" aria-hidden="true" />
      <div
        className="absolute inset-0 bg-gradient-to-b from-navy-950 via-navy-950/60 to-navy-950"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-30"
        aria-hidden="true"
      />

      <div className="container relative py-28 lg:py-36">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <p className="eyebrow justify-center text-white/50">Get in Touch</p>
          </Reveal>

          <RevealHeading
            as="h2"
            delay={0.06}
            stagger={0.06}
            text="Let’s Build the Future Together"
            className="mt-7 font-display text-display-md font-light text-white"
          />

          <Reveal delay={0.2}>
            <p className="mx-auto mt-8 max-w-xl text-pretty text-[15px] leading-relaxed text-white/65 sm:text-base">
              Send us a drawing, a specification, or just the problem you are
              trying to solve. You will hear back from an engineer, not a
              call-centre.
            </p>
          </Reveal>

          <Reveal delay={0.28}>
            <div className="mt-11 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button href={contact.emailHref} variant="light" size="lg" withArrow>
                Send Enquiry
              </Button>
              <Button href={contact.phoneHref} variant="outline" size="lg">
                Contact Us
              </Button>
            </div>
          </Reveal>
        </div>

        {/* ---------------------------- channels ------------------------- */}
        <div className="mx-auto mt-20 grid max-w-4xl gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-3">
          {CHANNELS.map((channel, i) => {
            const Icon = channel.icon;
            const shell =
              "group flex h-full flex-col gap-3 bg-navy-950/80 p-7 backdrop-blur-sm transition-colors duration-500 hover:bg-navy-900";

            const body = (
              <>
                <span className="flex items-center gap-2.5 text-[10px] font-semibold uppercase tracking-label text-white/40">
                  <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
                  {channel.label}
                </span>
                <span className="text-[14.5px] font-medium leading-snug text-white transition-colors group-hover:text-accent-400">
                  {channel.value}
                </span>
              </>
            );

            return (
              <Reveal key={channel.label} delay={0.34 + i * 0.08} className="h-full">
                {channel.href ? (
                  <a href={channel.href} className={shell}>
                    {body}
                  </a>
                ) : (
                  <div className={shell}>{body}</div>
                )}
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={0.6}>
          <p className="mt-10 text-center text-[12.5px] text-white/35">
            {contact.hours}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
