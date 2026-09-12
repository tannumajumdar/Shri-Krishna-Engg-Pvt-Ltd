"use client";

import {
  Package, FolderTree, Factory, Image as ImageIcon, Inbox, MailWarning,
} from "lucide-react";
import { PageHeader, PageBody, useResource } from "./ui";

type Dashboard = {
  counts: {
    products: number;
    categories: number;
    industries: number;
    media: number;
    enquiries: number;
    newEnquiries: number;
  };
  recentEnquiries: {
    id: number;
    name: string;
    email: string;
    subject: string | null;
    status: string;
    createdAt: string;
  }[];
};

/* One icon treatment across the row — the lime of the logo K on a soft wash
   of itself. The multi-hue tints this replaced were a light-theme habit: on a
   navy ground they read as six unrelated widgets rather than one panel. */
const ICON_TINT = "bg-adm-accent-soft text-adm-accent";

const CARDS = [
  { key: "products", label: "Products", icon: Package, href: "/admin/products" },
  { key: "categories", label: "Categories", icon: FolderTree, href: "/admin/categories" },
  { key: "industries", label: "Industries", icon: Factory, href: "/admin/industries" },
  { key: "media", label: "Media", icon: ImageIcon, href: "/admin/media" },
  { key: "enquiries", label: "Enquiries", icon: Inbox, href: "/admin/enquiries" },
  { key: "newEnquiries", label: "New Enquiries", icon: MailWarning, href: "/admin/enquiries" },
] as const;

export default function DashboardPage() {
  const { data, loading, error } = useResource<Dashboard>("/api/dashboard");

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of website content" />
      <PageBody>
        {error && <p className="mb-4 text-sm text-adm-danger">{error}</p>}

        {/* Six tiles: two up on phones, six across on a desktop monitor. At
            md:grid-cols-3 they grew into huge half-empty panels on a wide
            screen — a stat tile should stay small enough to scan at a glance. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {CARDS.map(({ key, label, icon: Icon, href }) => (
            <a
              key={key}
              href={href}
              className="group rounded-xl border border-adm-line bg-adm-surface p-4 transition hover:border-adm-line hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]"
            >
              <span className={`inline-grid h-9 w-9 place-items-center rounded-lg ${ICON_TINT}`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-adm-ink">
                {loading ? "—" : (data?.counts[key] ?? 0)}
              </div>
              <span className="mt-0.5 block truncate text-xs text-adm-muted">
                {label}
              </span>
            </a>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-sm font-semibold text-adm-ink-2">
          Recent Enquiries
        </h2>
        <div className="overflow-x-auto rounded-xl border border-adm-line bg-adm-surface">
          <table className="w-full text-sm">
            <thead className="bg-adm-raised text-left text-xs text-adm-muted">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentEnquiries ?? []).map((e) => (
                <tr key={e.id} className="border-t border-adm-line-soft">
                  <td className="px-5 py-3 text-adm-ink">{e.name}</td>
                  <td className="px-5 py-3 text-adm-muted">{e.email}</td>
                  <td className="px-5 py-3 text-adm-muted">{e.subject || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-adm-raised px-2 py-0.5 text-xs text-adm-muted">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !data?.recentEnquiries.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-adm-faint">
                    No enquiries yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageBody>
    </>
  );
}
