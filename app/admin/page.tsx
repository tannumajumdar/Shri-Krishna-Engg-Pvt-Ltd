"use client";

import {
  Package, FolderTree, Factory, Image as ImageIcon, Inbox, MailWarning,
} from "lucide-react";
import { PageHeader, useResource } from "./ui";

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
      <div className="p-8">
        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          {CARDS.map(({ key, label, icon: Icon, tint, href }) => (
            <a
              key={key}
              href={href}
              className="group rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-slate-300 hover:shadow-[0_8px_30px_-12px_rgba(12,25,54,0.15)]"
            >
              <span className={`inline-grid h-10 w-10 place-items-center rounded-xl ${tint}`}>
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div className="mt-4 text-3xl font-semibold tracking-tight text-slate-900">
                {loading ? "—" : (data?.counts[key] ?? 0)}
              </div>
              <span className="mt-1 block text-sm text-slate-500">{label}</span>
            </a>
          ))}
        </div>

        <h2 className="mb-3 mt-9 text-sm font-semibold text-slate-700">
          Recent Enquiries
        </h2>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
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
      </div>
    </>
  );
}
