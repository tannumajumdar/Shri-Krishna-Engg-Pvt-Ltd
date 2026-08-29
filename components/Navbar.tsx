"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { Menu, X, LogIn } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { navLinks, contact, company } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Navbar() {
  const { scrollY, scrollYProgress } = useScroll();
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("home");

  /* Transparent over the hero, solid once the hero starts leaving. */
  useMotionValueEvent(scrollY, "change", (v) => setSolid(v > 80));

  /* Highlight whichever section owns the upper third of the viewport. */
  useEffect(() => {
    const ids = navLinks.map((l) => l.href.slice(1));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: [0, 0.25, 0.5] },
    );

    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

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
          <a href="#home" aria-label={`${company.name} — home`}>
            <Logo onDark={onDark} />
          </a>

          {/* ---------------------------- desktop nav ---------------------- */}
          <nav
            className="hidden items-center gap-1 lg:flex"
            aria-label="Primary"
          >
            {navLinks.map((link) => {
              const id = link.href.slice(1);
              const isActive = active === id;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[13.5px] font-medium transition-colors duration-300",
                    onDark
                      ? isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                      : isActive
                        ? "text-ink"
                        : "text-ink-faint hover:text-ink",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      transition={{ duration: 0.5, ease: EASE }}
                      className={cn(
                        "absolute inset-x-3 -bottom-0.5 h-px",
                        onDark ? "bg-white/70" : "bg-ink",
                      )}
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* ------------------------------ actions ------------------------ */}
          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle onDark={onDark} className="h-10 w-10" />

            {/* Admin sign-in. Discreet — a text link, not a primary button —
                since it is for staff, not visitors. */}
            <a
              href="/admin"
              className={cn(
                "hidden items-center gap-1.5 text-[13px] font-medium transition-colors duration-300 sm:flex",
                onDark
                  ? "text-white/75 hover:text-white"
                  : "text-ink-faint hover:text-ink",
              )}
            >
              <LogIn className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
              Login
            </a>

            <Button
              href="#contact"
              size="sm"
              variant={onDark ? "light" : "solid"}
              className="hidden sm:inline-flex"
              withArrow
            >
              Enquire Now
            </Button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full border transition-colors duration-300 lg:hidden",
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
            className="fixed inset-0 z-[60] lg:hidden"
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

              <div className="relative flex flex-1 flex-col justify-center gap-1 px-6">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      delay: 0.14 + i * 0.06,
                      duration: 0.5,
                      ease: EASE,
                    }}
                    className="group flex items-baseline gap-4 border-b border-white/10 py-4 font-display text-2xl font-light text-white/90 transition-colors hover:text-white"
                  >
                    <span className="font-mono text-[10px] tracking-widest text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="transition-transform duration-500 ease-brand group-hover:translate-x-1.5">
                      {link.label}
                    </span>
                  </motion.a>
                ))}
              </div>

              <div className="relative space-y-4 px-6 pb-10">
                <Button
                  href="#contact"
                  variant="light"
                  size="lg"
                  className="w-full"
                  withArrow
                  onClick={() => setOpen(false)}
                >
                  Enquire Now
                </Button>
                <a
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full border border-white/20 py-3 text-[13px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <LogIn className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
                  Admin Login
                </a>
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
