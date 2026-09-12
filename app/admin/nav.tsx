"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, FolderTree, Factory, Image as ImageIcon,
  BarChart3, Inbox, Phone, Share2, Settings, LogOut, type LucideIcon,
} from "lucide-react";
import { api } from "@/lib/admin/api-client";

const LINKS: { href: string; label: string; icon: LucideIcon }[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: FolderTree },
  { href: "/admin/industries", label: "Industries", icon: Factory },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/statistics", label: "Statistics", icon: BarChart3 },
  { href: "/admin/enquiries", label: "Enquiries", icon: Inbox },
  { href: "/admin/contact", label: "Contact Info", icon: Phone },
  { href: "/admin/social-links", label: "Social Links", icon: Share2 },
  { href: "/admin/settings", label: "Profile & Settings", icon: Settings },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [me, setMe] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    api.get<{ name: string; email: string }>("/api/auth/me").then(setMe).catch(() => {});
  }, []);

  async function logout() {
    await api.post("/api/auth/logout");
    // Land on the public homepage, not the login screen.
    router.replace("/");
    router.refresh();
  }

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-adm-line bg-adm-surface">
      <div className="flex items-center gap-2.5 border-b border-adm-line px-5 py-5">
        <img
          src="/media/logo-light.png"
          alt="Shree Krishna Engineering Balco"
          width={640}
          height={197}
          className="h-8 w-auto shrink-0"
        />
        <span className="rounded-md bg-adm-raised px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-adm-muted">
          Admin
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {LINKS.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
                active
                  ? "bg-adm-accent font-medium text-adm-accent-ink shadow-sm"
                  : "text-adm-muted hover:bg-adm-raised"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] ${active ? "text-adm-accent-ink" : "text-adm-accent"}`}
                strokeWidth={1.75}
              />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-adm-line p-3">
        {me && (
          <div className="mb-2 flex items-center gap-2.5 px-2 py-1">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-adm-accent text-xs font-semibold text-adm-accent-ink">
              {me.name?.[0]?.toUpperCase() ?? "A"}
            </span>
            <div className="min-w-0">
              <div className="truncate text-xs font-medium text-adm-ink-2">{me.name}</div>
              <div className="truncate text-[11px] text-adm-faint">{me.email}</div>
            </div>
          </div>
        )}
        <button
          onClick={logout}
          className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-adm-muted transition hover:bg-adm-danger-soft hover:text-adm-danger"
        >
          <LogOut className="h-4 w-4 text-adm-accent transition-colors group-hover:text-adm-danger" strokeWidth={1.75} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
