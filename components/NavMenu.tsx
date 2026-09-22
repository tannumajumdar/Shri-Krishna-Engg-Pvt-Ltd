"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { NavLink } from "@/lib/site";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Leaving the trigger for the panel crosses a gap; don't close on the way. */
const CLOSE_DELAY = 120;

/**
 * One top-level nav entry, with or without a menu.
 *
 * The trigger stays a real link: clicking it goes to the section, exactly as
 * it did before, and the menu is an addition rather than a replacement. That
 * keeps the bar usable when JavaScript has not run and gives every menu a
 * landing place of its own.
 *
 * A single group renders as a narrow list; two or more render as a mega panel
 * with a heading per column, which is the shape the wider menus need.
 */
export function NavMenu({
  link,
  href,
  isActive,
  onDark,
}: {
  link: NavLink;
  /** Already resolved for the current route by the navbar. */
  href: string;
  isActive: boolean;
  onDark: boolean;
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const panelId = useId();

  const groups = link.groups ?? [];
  const hasMenu = groups.length > 0;
  const mega = groups.length > 1;

  const cancelClose = () => window.clearTimeout(closeTimer.current);
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setOpen(false), CLOSE_DELAY);
  };

  useEffect(() => () => cancelClose(), []);

  /* Escape closes, and so does a click anywhere outside the entry. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const triggerClass = cn(
    "relative flex items-center gap-1 rounded-md px-3 py-2 text-[12.5px] font-medium transition-colors duration-300",
    onDark
      ? isActive || open
        ? "text-white"
        : "text-white/70 hover:text-white"
      : isActive || open
        ? "text-accent-600"
        : "text-ink-faint hover:text-ink",
  );

  const underline = isActive && (
    <motion.span
      layoutId="nav-active"
      transition={{ duration: 0.5, ease: EASE }}
      className={cn(
        "absolute inset-x-3 -bottom-0.5 h-px",
        onDark ? "bg-white/70" : "bg-accent-600",
      )}
    />
  );

  if (!hasMenu) {
    return (
      <a href={href} aria-current={isActive ? "true" : undefined} className={triggerClass}>
        {link.label}
        {underline}
      </a>
    );
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={() => {
        cancelClose();
        setOpen(true);
      }}
      onPointerLeave={scheduleClose}
    >
      <a
        href={href}
        aria-current={isActive ? "true" : undefined}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={open ? panelId : undefined}
        className={triggerClass}
        onFocus={() => setOpen(true)}
        /* Keyboard users get the menu on Down without losing the link. */
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
      >
        {link.label}
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 transition-transform duration-300 ease-brand",
            open && "rotate-180",
          )}
          strokeWidth={2.25}
          aria-hidden="true"
        />
        {underline}
      </a>

      <AnimatePresence>
        {open && (
          <motion.div
            id={panelId}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: EASE }}
            /* pt bridges the gap under the trigger so the pointer never
               crosses dead space on its way into the panel. */
            className={cn(
              "absolute top-full z-50 pt-3",
              mega ? "left-1/2 -translate-x-1/2" : "left-0",
            )}
          >
            <div
              className={cn(
                "overflow-hidden rounded-lg border border-hairline bg-surface shadow-[0_18px_50px_-18px_rgba(8,16,32,0.35)]",
                mega ? "p-7" : "p-2",
              )}
            >
              {mega ? (
                <div className="flex gap-12">
                  {groups.map((group) => (
                    <div key={group.heading} className="min-w-[164px]">
                      <h3 className="mb-4 font-display text-[13.5px] font-semibold text-ink">
                        {group.heading}
                      </h3>
                      <ul className="space-y-1">
                        {group.items.map((item) => (
                          <li key={item.label}>
                            <MenuItem href={item.href} onNavigate={() => setOpen(false)}>
                              {item.label}
                            </MenuItem>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="min-w-[228px]">
                  {groups[0].items.map((item) => (
                    <li key={item.label}>
                      <MenuItem href={item.href} onNavigate={() => setOpen(false)}>
                        {item.label}
                      </MenuItem>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  href,
  children,
  onNavigate,
}: {
  href: string;
  children: React.ReactNode;
  onNavigate: () => void;
}) {
  return (
    <a
      href={href}
      onClick={onNavigate}
      className="block rounded-md px-3 py-2 text-[13px] leading-snug text-ink-muted transition-colors duration-200 hover:bg-surface-2 hover:text-accent-600"
    >
      {children}
    </a>
  );
}
