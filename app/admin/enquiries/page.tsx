"use client";

import { Fragment, useState } from "react";
import { Trash2, MessageCircle, Globe } from "lucide-react";
import { PageHeader, PageBody, Notice, useResource } from "../ui";
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
  NEW: "bg-[#12224A] text-[#8EA5DC]",
  READ: "bg-adm-raised text-adm-muted",
  RESPONDED: "bg-adm-ok-soft text-adm-ok",
  ARCHIVED: "bg-adm-warn-soft text-adm-warn",
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
      <PageBody>
        {error && <Notice kind="error">{error}</Notice>}
        {msg && <Notice kind="error">{msg}</Notice>}

        <div className="overflow-hidden rounded-2xl border border-adm-line bg-adm-surface">
          <table className="w-full text-sm">
            <thead className="bg-adm-raised text-left text-xs text-adm-muted">
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
                    className="cursor-pointer border-t border-adm-line-soft hover:bg-adm-raised"
                    onClick={() => setOpen(open === e.id ? null : e.id)}
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-adm-ink">{e.name}</span>
                        {e.source === "WHATSAPP" ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#25D366]/15 px-2 py-0.5 text-[10px] font-semibold text-[#4EE08A]">
                            <MessageCircle className="h-3 w-3" /> WhatsApp
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-adm-raised px-2 py-0.5 text-[10px] font-semibold text-adm-muted">
                            <Globe className="h-3 w-3 text-adm-accent" /> Website
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-adm-muted">{e.email || "—"}</div>
                    </td>
                    <td className="px-5 py-3 text-adm-muted">{e.product || e.subject || "—"}</td>
                    <td className="px-5 py-3 text-xs text-adm-muted">
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
                        className="group rounded-md p-1.5 hover:bg-adm-danger-soft"
                      >
                        <Trash2 className="h-4 w-4 text-adm-accent transition-colors group-hover:text-adm-danger" />
                      </button>
                    </td>
                  </tr>
                  {open === e.id && (
                    <tr className="border-t border-adm-line-soft bg-adm-raised/60">
                      <td colSpan={5} className="px-5 py-4">
                        <div className="grid gap-2 text-sm sm:grid-cols-2">
                          {e.company && <Detail label="Company" value={e.company} />}
                          {e.phone && <Detail label="Phone" value={e.phone} />}
                          {e.product && <Detail label="Product" value={e.product} />}
                        </div>
                        <div className="mt-3 whitespace-pre-wrap rounded-lg bg-adm-surface p-3 text-sm text-adm-ink-2">
                          {e.message}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span className="text-xs text-adm-muted">Set status:</span>
                          {STATUSES.map((s) => (
                            <button
                              key={s}
                              onClick={() => setStatus(e.id, s)}
                              className={`rounded-full px-2.5 py-1 text-xs transition ${
                                e.status === s
                                  ? "bg-adm-accent text-adm-accent-ink"
                                  : "bg-adm-surface text-adm-muted ring-1 ring-adm-line hover:bg-adm-raised"
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
                  <td colSpan={5} className="px-5 py-6 text-center text-adm-faint">
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

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs text-adm-faint">{label}: </span>
      <span className="text-adm-ink-2">{value}</span>
    </div>
  );
}
