"use client";

import { usePathname } from "next/navigation";
import { LogIn, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { SocialIcon, type SocialName } from "@/components/ui/SocialIcon";
import {
  company,
  contact,
  productCategories,
  socials,
} from "@/lib/site";

type FooterContact = {
  address: readonly string[];
  phone: string;
  phoneHref: string;
  email: string;
  emailHref: string;
  hours: string;
};
type FooterSocial = { label: string; href: string; icon: string };

/** Company column. Careers and the journey pages are anchors for now. */
const COMPANY_LINKS = [
  { label: "About Us", href: "#about" },
  { label: "Leadership", href: "#about" },
  { label: "Our Journey", href: "#about" },
  { label: "Quality & Safety", href: "#why" },
  { label: "Careers", href: "#contact" },
  { label: "Contact", href: "#contact" },
];

/**
 * Away from the landing page none of these sections exist, so a bare "#about"
 * would scroll nowhere. Same rule as the navbar: prefix with "/" off-landing.
 */
function useSectionHref() {
  const pathname = usePathname();
  const onLanding = pathname === "/";
  return (href: string) =>
    !onLanding && href.startsWith("#") ? `/${href}` : href;
}

export function Footer({
  contact: contactProp,
  socials: socialsProp,
}: {
  contact?: FooterContact;
  socials?: readonly FooterSocial[];
} = {}) {
  const _contact = contactProp ?? contact;
  const _socials = socialsProp ?? socials;
  const year = new Date().getFullYear();
  const sectionHref = useSectionHref();

  return (
    <footer className="on-dark relative overflow-hidden border-t border-white/10 bg-navy-950 text-white">
      <div className="absolute inset-0 bg-grid-fine opacity-20" aria-hidden="true" />

      <div className="container relative">
        {/* ------------------------------ main --------------------------- */}
        <div className="grid gap-12 py-16 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* brand */}
          <div className="lg:col-span-4">
            <Logo onDark />

            <p className="mt-6 text-[10px] font-semibold uppercase tracking-label text-white/35">
              Engineering for a stronger tomorrow
            </p>

            <ul className="mt-8 flex items-center gap-2.5">
              {_socials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-md border border-white/15 text-white/60 transition-all duration-500 ease-brand hover:-translate-y-0.5 hover:border-accent-400/60 hover:bg-white/10 hover:text-accent-400"
                  >
                    <SocialIcon name={social.icon as SocialName} className="h-4 w-4" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* company */}
          <nav className="lg:col-span-2" aria-label="Company">
            <h2 className="text-[10px] font-semibold uppercase tracking-label text-white/35">
              Company
            </h2>
            <ul className="mt-6 space-y-3">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <FooterLink href={sectionHref(link.href)}>{link.label}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* capabilities */}
          <nav className="lg:col-span-3" aria-label="Our capabilities">
            <h2 className="text-[10px] font-semibold uppercase tracking-label text-white/35">
              Our Capabilities
            </h2>
            <ul className="mt-6 space-y-3">
              {productCategories.map((cat) => (
                <li key={cat.id}>
                  <FooterLink href={`/products#${cat.id}`}>{cat.name}</FooterLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* contact */}
          <div className="lg:col-span-3">
            <h2 className="text-[10px] font-semibold uppercase tracking-label text-white/35">
              Contact Us
            </h2>

            <address className="mt-6 space-y-4 not-italic">
              <div className="flex gap-3">
                <MapPin
                  className="mt-0.5 h-4 w-4 shrink-0 text-accent-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <p className="text-[13px] leading-relaxed text-white/55">
                  {_contact.address.map((line) => (
                    <span key={line} className="block">
                      {line}
                    </span>
                  ))}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Phone
                  className="h-4 w-4 shrink-0 text-accent-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <a
                  href={_contact.phoneHref}
                  className="text-[13px] text-white/55 transition-colors hover:text-white"
                >
                  {_contact.phone}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <Mail
                  className="h-4 w-4 shrink-0 text-accent-400"
                  strokeWidth={1.6}
                  aria-hidden="true"
                />
                <a
                  href={_contact.emailHref}
                  className="break-all text-[13px] text-white/55 transition-colors hover:text-white"
                >
                  {_contact.email}
                </a>
              </div>
            </address>

            <div className="mt-7">
              <Button href={sectionHref("#contact")} variant="light" size="sm" withArrow>
                Get A Quote
              </Button>
            </div>
          </div>
        </div>

        {/* ----------------------------- bottom -------------------------- */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-6 sm:flex-row">
          <p className="text-center text-[12px] text-white/40 sm:text-left">
            © {year} {company.legalName}. All rights reserved.
          </p>

          <div className="flex items-center gap-5">
            <p className="hidden text-[12px] text-white/30 sm:block">
              Engineering a Stronger Tomorrow.
            </p>

            {/* Staff sign-in. Lives here rather than the navbar, which should
                carry only what a visitor came for. */}
            <a
              href="/admin"
              className="group inline-flex items-center gap-1.5 text-[12px] font-medium text-white/45 transition-colors duration-300 hover:text-accent-400"
            >
              <LogIn
                className="h-3.5 w-3.5 text-accent-400 transition-transform duration-500 ease-brand group-hover:translate-x-0.5"
                strokeWidth={1.75}
                aria-hidden="true"
              />
              Admin Login
            </a>
          </div>
        </div>
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
      className="group inline-flex items-center gap-2 text-[13px] text-white/55 transition-colors duration-300 hover:text-white"
    >
      <span className="h-px w-0 bg-accent-400 transition-all duration-500 ease-brand group-hover:w-3" />
      <span className="transition-transform duration-500 ease-brand group-hover:translate-x-0.5">
        {children}
      </span>
    </a>
  );
}
