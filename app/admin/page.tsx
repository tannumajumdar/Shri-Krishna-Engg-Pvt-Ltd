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

const CARDS = [
  { key: "products", label: "Products", icon: Package, tint: "bg-blue-50 text-blue-600", href: "/admin/products" },
  { key: "categories", label: "Categories", icon: FolderTree, tint: "bg-violet-50 text-violet-600", href: "/admin/categories" },
  { key: "industries", label: "Industries", icon: Factory, tint: "bg-amber-50 text-amber-600", href: "/admin/industries" },
  { key: "media", label: "Media", icon: ImageIcon, tint: "bg-emerald-50 text-emerald-600", href: "/admin/media" },
  { key: "enquiries", label: "Enquiries", icon: Inbox, tint: "bg-slate-100 text-slate-600", href: "/admin/enquiries" },
  { key: "newEnquiries", label: "New Enquiries", icon: MailWarning, tint: "bg-red-50 text-red-600", href: "/admin/enquiries" },
] as const;

export default function DashboardPage() {
  const { data, loading, error } = useResource<Dashboard>("/api/dashboard");

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Overview of website content" />
      <PageBody>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        {/* Six tiles: two up on phones, six across on a desktop monitor. At
            md:grid-cols-3 they grew into huge half-empty panels on a wide
            screen — a stat tile should stay small enough to scan at a glance. */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-6">
          {CARDS.map(({ key, label, icon: Icon, tint, href }) => (
            <a
              key={key}
              href={href}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:shadow-[0_8px_30px_-12px_rgba(12,25,54,0.15)]"
            >
              <span className={`inline-grid h-9 w-9 place-items-center rounded-lg ${tint}`}>
                <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <div className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
                {loading ? "—" : (data?.counts[key] ?? 0)}
              </div>
              <span className="mt-0.5 block truncate text-xs text-slate-500">
                {label}
              </span>
            </a>
          ))}
        </div>

        <h2 className="mb-3 mt-8 text-sm font-semibold text-slate-700">
          Recent Enquiries
        </h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Email</th>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {(data?.recentEnquiries ?? []).map((e) => (
                <tr key={e.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 text-slate-800">{e.name}</td>
                  <td className="px-5 py-3 text-slate-500">{e.email}</td>
                  <td className="px-5 py-3 text-slate-500">{e.subject || "—"}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
              {!loading && !data?.recentEnquiries.length && (
                <tr>
                  <td colSpan={4} className="px-5 py-6 text-center text-slate-400">
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
