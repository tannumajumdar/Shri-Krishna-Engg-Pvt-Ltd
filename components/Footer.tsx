"use client";

import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon, type SocialName } from "@/components/ui/SocialIcon";
import {
  company,
  contact,
  navLinks,
  products,
  socials,
} from "@/lib/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden border-t border-white/10 bg-navy-950 text-white">
      <div
        className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-20"
        aria-hidden="true"
      />

      <div className="container relative">
        {/* ------------------------------ main --------------------------- */}
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* brand */}
          <div className="lg:col-span-4">
            <Logo onDark />

            <p className="mt-7 max-w-xs text-pretty text-[13.5px] leading-relaxed text-white/50">
              Aluminium extrusion, casting, machining and fabrication for
              India’s heavy industry — engineered, inspected and despatched
              from our works at BALCO, Korba.
            </p>

            <ul className="mt-8 flex items-center gap-2.5">
              {socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition-all duration-500 ease-brand hover:-translate-y-0.5 hover:border-white/40 hover:bg-white/10 hover:text-white"
                  >
                    <SocialIcon name={social.icon as SocialName} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* quick links */}
          <nav className="lg:col-span-2" aria-label="Quick links">
            <h2 className="text-[10px] font-semibold uppercase tracking-label text-white/35">
              Company
            </h2>
            <ul className="mt-6 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <FooterLink href={link.href}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* products */}
          <nav className="lg:col-span-3" aria-label="Products">
            <h2 className="text-[10px] font-semibold uppercase tracking-label text-white/35">
              Products
            </h2>
            <ul className="mt-6 space-y-3">
              {products.slice(0, 6).map((product) => (
                <li key={product.name}>
                  <FooterLink href="#products">{product.name}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-label text-white/35">
              Contact
            </h2>

            <address className="mt-6 space-y-5 not-italic">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-white/35"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-[13.5px] leading-relaxed text-white/55">
                  {contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-white/35"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <a
                  href={contact.phoneHref}
                  className="text-[13.5px] text-white/55 transition-colors hover:text-white"
                >
                  {contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-white/35"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <a
                  href={contact.emailHref}
                  className="break-all text-[13.5px] text-white/55 transition-colors hover:text-white"
                >
                  {contact.email}
                </a>
              </div>
            </address>

            <p className="mt-6 text-[12.5px] text-white/35">{contact.hours}</p>
          </div>
        </div>

        {/* ----------------------------- bottom -------------------------- */}
        <div className="flex flex-col items-center justify-between gap-5 border-t border-white/10 py-7 sm:flex-row">
          <p className="text-center text-[12.5px] text-white/40 sm:text-left">
            © {year} {company.legalName} All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            <p className="text-[12.5px] text-white/30">
              CIN · Registered in India
            </p>
            <a
              href="#home"
              aria-label="Back to top"
              className="group grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/60 transition-all duration-500 ease-brand hover:border-white/40 hover:bg-white/10 hover:text-white"
            >
              <ArrowUp
                className="h-4 w-4 transition-transform duration-500 ease-brand group-hover:-translate-y-0.5"
                strokeWidth={1.75}
              />
            </a>
          </div>
        </div>
      </div>

      {/* oversized wordmark, sunk into the footer edge */}
      <div
        className="pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <p className="mask-b translate-y-[18%] whitespace-nowrap text-center font-display text-[clamp(1.5rem,6.1vw,7.5rem)] font-semibold leading-none tracking-tightest text-white/[0.045]">
          SHRI KRISHNA ENGINEERING
        </p>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-2 text-[13.5px] text-white/55 transition-colors duration-300 hover:text-white"
    >
      <span className="h-px w-0 bg-accent-400 transition-all duration-500 ease-brand group-hover:w-3" />
      <span className="transition-transform duration-500 ease-brand group-hover:translate-x-0.5">
        {children}
      </span>
    </a>
  );
}
