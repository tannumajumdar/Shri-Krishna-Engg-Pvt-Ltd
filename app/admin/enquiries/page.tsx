"use client";

import { Fragment, useState } from "react";
import { Trash2, MessageCircle, Globe } from "lucide-react";
import { PageHeader, Notice, useResource } from "../ui";
import { api, ApiClientError } from "@/lib/admin/api-client";

type Enquiry = {
  id: number;
  name: string;
  company: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  product: string | null;
  source: "WEBSITE" | "WHATSAPP";
  message: string;
  status: "NEW" | "READ" | "RESPONDED" | "ARCHIVED";
  createdAt: string;
};

const STATUSES: Enquiry["status"][] = ["NEW", "READ", "RESPONDED", "ARCHIVED"];

const BADGE: Record<Enquiry["status"], string> = {
  NEW: "bg-blue-50 text-blue-700",
  READ: "bg-slate-100 text-slate-600",
  RESPONDED: "bg-green-50 text-green-700",
  ARCHIVED: "bg-amber-50 text-amber-700",
};

export default function EnquiriesPage() {
  const { data, loading, error, reload } = useResource<Enquiry[]>("/api/enquiries");
  const [open, setOpen] = useState<number | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const rows = data ?? [];

  async function setStatus(id: number, status: Enquiry["status"]) {
    try {
      await api.put(`/api/enquiries/${id}`, { status });
      reload();
    } catch (e) {
      setMsg(e instanceof ApiClientError ? e.message : "Update failed");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this enquiry?")) return;
    await api.del(`/api/enquiries/${id}`);
    reload();
  }

  return (
    <>
      <PageHeader title="Enquiries" subtitle="Messages submitted through the contact form" />
      <div className="p-8">
        {error && <Notice kind="error">{error}</Notice>}
        {msg && <Notice kind="error">{msg}</Notice>}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">From</th>
                <th className="px-5 py-3 font-medium">Subject</th>
                <th className="px-5 py-3 font-medium">Received</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <Fragment key={e.id}>
                  <tr
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                    onClick={() => setOpen(open === e.id ? null : e.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800">{e.name}</span>
                        {e.source === "WHATSAPP" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[10px] font-semibold text-[#128C3E]">
                            <MessageCircle className="h-3 w-3" /> WhatsApp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                            <Globe className="h-3 w-3" /> Website
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500">{e.email || "—"}</div>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{e.product || e.subject || "—"}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">
                      {new Date(e.createdAt).toLocaleString()}
                    </td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs ${BADGE[e.status]}`}>
                        {e.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={(ev) => { ev.stopPropagation(); remove(e.id); }}
                        className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                  {open === e.id && (
                    <tr className="border-t border-slate-100 bg-slate-50/60">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          {e.company && <Detail label="Company" value={e.company} />}
                          {e.phone && <Detail label="Phone" value={e.phone} />}
                          {e.product && <Detail label="Product" value={e.product} />}
                        </div>
                        <div className="mt-3 whitespace-pre-wrap rounded-lg bg-white p-3 text-sm text-slate-700">
                          {e.message}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-slate-500">Set status:</span>
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(e.id, s)}
                              className={`rounded-full px-2.5 py-1 text-xs transition ${
                                e.status === s
                                  ? "bg-blue-600 text-white"
                                  : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {!loading && !rows.length && (
                <tr>
                  <td colSpan={5} className="px-5 py-6 text-center text-slate-400">
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-slate-400">{label}: </span>
      <span className="text-slate-700">{value}</span>
    </div>
  );
}
