"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { NavMenu } from "@/components/NavMenu";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navLinks, contact, company } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Which top-level link owns the page being viewed.
 *
 * Every destination is a real route now, so this is a path comparison rather
 * than the scroll-spy this used to run: the landing page no longer holds the
 * sections the nav points at, and observing elements that are not there left
 * every link unlit. "/" has to match exactly, or it would own every page.
 */
function useIsActive() {
  const pathname = usePathname();
  return (href: string) => {
    const path = href.split("#")[0];
    if (path === "/") return pathname === "/";
    return pathname === path || pathname.startsWith(`${path}/`);
  };
}

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const pathname = usePathname();
  const isActive = useIsActive();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  /* Transparent over the hero, solid once the hero starts leaving. */
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 80));

  /* A real navigation now replaces the page, so the sheet has to close with
     it — otherwise it stays open over the page that just loaded. */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /* Lock the page behind the mobile sheet. */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  /* Escape closes the sheet. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const onDark = !solid;

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-brand",
          solid
            ? "border-b border-hairline/80 bg-surface/85 shadow-[0_1px_24px_-8px_rgba(8,16,32,0.18)] backdrop-blur-xl"
            : "border-b border-white/10 bg-transparent",
        )}
      >
        <div className="container flex h-[var(--nav-h)] items-center justify-between gap-6">
          <a href="/" aria-label={`${company.name} — home`}>
            <Logo onDark={onDark} />
          </a>

          {/* ---------------------------- desktop nav ---------------------- */}
          <nav
            className="hidden items-center gap-0.5 xl:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => (
              <NavMenu
                key={link.label}
                link={{
                  ...link,
                  groups: link.groups,
                }}
                href={link.href}
                isActive={isActive(link.href)}
                onDark={onDark}
              />
            ))}
          </nav>

          {/* ------------------------------ actions ------------------------ */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* The design leaves this bar to the logo, the links and one
                action. Admin sign-in moved to the footer; the theme toggle
                lives in the mobile sheet, which is the only place the design
                gives it room. */}

            <Button
              href="/contact"
              size="sm"
              variant={onDark ? "light" : "solid"}
              className="hidden sm:inline-flex"
              withArrow
            >
              Get A Quote
            </Button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-md border transition-colors duration-300 xl:hidden",
                onDark
                  ? "border-white/25 text-white hover:bg-white/10"
                  : "border-hairline text-ink hover:bg-surface-2",
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Reading-progress hairline, only once the bar is solid */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className={cn(
            "absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-navy-700 via-accent-500 to-navy-700 transition-opacity duration-500",
            solid ? "opacity-100" : "opacity-0",
          )}
        />
      </header>

      {/* ----------------------------- mobile sheet ----------------------- */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] xl:hidden"
            initial="hidden"
            animate="show"
            exit="hidden"
          >
            <motion.div
              className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              transition={{ duration: 0.35 }}
              onClick={() => setOpen(false)}
            />

            <motion.nav
              aria-label="Mobile"
              className="on-dark absolute inset-y-0 right-0 flex w-full max-w-sm flex-col bg-navy-900 shadow-2xl"
              variants={{
                hidden: { x: "100%" },
                show: { x: 0 },
              }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <div
                className="absolute inset-0 bg-grid-fine bg-grid-fine opacity-40"
                aria-hidden="true"
              />

              <div className="relative flex h-[var(--nav-h)] items-center justify-between px-6">
                <Logo onDark />
                <div className="flex items-center gap-2">
                  {/* The bar's own toggle sits behind the overlay, so the
                      sheet carries its own. */}
                  <ThemeToggle onDark />
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="grid h-11 w-11 place-items-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
                  >
                    <X className="h-5 w-5" strokeWidth={1.75} />
                  </button>
                </div>
              </div>

              {/* The sheet scrolls now: with the sub-items expanded the list
                  can outrun a phone screen. */}
              <div className="relative flex-1 overflow-y-auto px-6 py-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.14 + i * 0.06, duration: 0.5, ease: EASE }}
                    className="border-b border-white/10"
                  >
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="group flex items-baseline gap-4 py-4 font-display text-xl font-light text-white/90 transition-colors hover:text-white"
                    >
                      <span className="font-mono text-[10px] tracking-widest text-white/35">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="transition-transform duration-500 ease-brand group-hover:translate-x-1.5">
                        {link.label}
                      </span>
                    </a>

                    {/* Sub-items sit open rather than behind a toggle — a
                        phone menu that needs two taps to reveal a link is
                        worse than a slightly longer scroll. */}
                    {link.groups && (
                      <div className="pb-4 pl-[2.1rem]">
                        {link.groups.map((group) => (
                          <div key={group.heading ?? "only"} className="mb-3 last:mb-0">
                            {group.heading && (
                              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-label text-accent-400">
                                {group.heading}
                              </p>
                            )}
                            <ul className="space-y-0.5">
                              {group.items.map((item) => (
                                <li key={item.label}>
                                  <a
                                    href={item.href}
                                    onClick={() => setOpen(false)}
                                    className="block py-1.5 text-[13.5px] text-white/55 transition-colors hover:text-accent-400"
                                  >
                                    {item.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
              <div className="relative space-y-4 px-6 pb-10">
                <Button
                  href="/contact"
                  variant="light"
                  size="lg"
                  className="w-full"
                  withArrow
                  onClick={() => setOpen(false)}
                >
                  Get A Quote
                </Button>
                <div className="space-y-1 text-[13px] text-white/55">
                  <a
                    href={contact.phoneHref}
                    className="block hover:text-white"
                  >
                    {contact.phone}
                  </a>
                  <a
                    href={contact.emailHref}
                    className="block hover:text-white"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
