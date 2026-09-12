"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Plus, ArrowRight } from "lucide-react";
import {
  PageHeader, PageBody, Button, Modal, Field, Notice, inputClass, useResource,
} from "./ui";
import { api, ApiClientError } from "@/lib/admin/api-client";
import { UploadField } from "./UploadField";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "textarea" | "number" | "url" | "select" | "status" | "image" | "video";
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
};

type Row = Record<string, unknown> & { id: number };

/**
 * Generic list + create/edit/delete for a resource. Every simple content type
 * (categories, industries, statistics, social links, media) is a config over
 * this one component, so the CRUD behaviour is written and tested once.
 */
export function ResourceManager({
  title,
  subtitle,
  endpoint,
  fields,
  columns,
  rowLink,
  rowLinkLabel = "View",
}: {
  title: string;
  subtitle?: string;
  endpoint: string;
  fields: FieldDef[];
  /** Field names to show as table columns. */
  columns: string[];
  /** When set, each row links here (e.g. a category → its products). */
  rowLink?: (row: Row) => string;
  rowLinkLabel?: string;
}) {
  const { data, loading, error, reload } = useResource<Row[]>(`${endpoint}?all=1`);
  const [editing, setEditing] = useState<Row | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = data ?? [];

  return (
    <>
      <PageHeader
        title={title}
        subtitle={subtitle}
        action={
          <Button onClick={() => setCreating(true)}>
            <Plus className="mr-1 inline h-4 w-4" /> New
          </Button>
        }
      />
      <PageBody>
        {error && <Notice kind="error">{error}</Notice>}

        <div className="overflow-x-auto rounded-2xl border border-adm-line bg-adm-surface">
          <table className="w-full text-sm">
            <thead className="bg-adm-raised text-left text-xs text-adm-muted">
              <tr>
                {columns.map((c) => (
                  <th key={c} className="px-5 py-3 font-medium capitalize">
                    {fields.find((f) => f.name === c)?.label ?? c}
                  </th>
                ))}
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const href = rowLink?.(row);
                return (
                  <tr
                    key={row.id}
                    className={`border-t border-adm-line-soft ${href ? "transition-colors hover:bg-adm-raised" : ""}`}
                  >
                    {columns.map((c, ci) => (
                      <td key={c} className="px-5 py-3 text-adm-ink-2">
                        {href && ci === 0 ? (
                          <Link
                            href={href}
                            className="font-medium text-adm-ink underline-offset-2 hover:text-adm-accent hover:underline"
                          >
                            <Cell value={row[c]} field={fields.find((f) => f.name === c)} />
                          </Link>
                        ) : (
                          <Cell value={row[c]} field={fields.find((f) => f.name === c)} />
                        )}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-right">
                      {href && (
                        <Link
                          href={href}
                          className="mr-1 inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-adm-muted hover:bg-adm-raised hover:text-adm-accent"
                        >
                          {rowLinkLabel}
                          <ArrowRight className="h-3.5 w-3.5 text-adm-accent" />
                        </Link>
                      )}
                      <button
                        onClick={() => setEditing(row)}
                        className="mr-1 rounded-md p-1.5 hover:bg-adm-raised"
                      >
                        <Pencil className="h-4 w-4 text-adm-accent" />
                      </button>
                      <DeleteButton endpoint={endpoint} id={row.id} onDone={reload} />
                    </td>
                  </tr>
                );
              })}
              {!loading && !rows.length && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-6 text-center text-adm-faint">
                    Nothing yet — click New.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </PageBody>

      {(creating || editing) && (
        <ResourceForm
          title={editing ? `Edit ${title}` : `New ${title}`}
          fields={fields}
          initial={editing ?? {}}
          onClose={() => {
            setCreating(false);
            setEditing(null);
          }}
          onSubmit={async (values) => {
            if (editing) await api.put(`${endpoint}/${editing.id}`, values);
            else await api.post(endpoint, values);
            reload();
          }}
        />
      )}
    </>
  );
}

function Cell({ value, field }: { value: unknown; field?: FieldDef }) {
  if (value == null || value === "") return <span className="text-adm-faint">—</span>;
  if (field?.type === "image" || field?.type === "video") {
    return <span className="font-mono text-xs text-adm-muted">{String(value)}</span>;
  }
  if (field?.type === "status") {
    return (
      <span className={`rounded-full px-2 py-0.5 text-xs ${
        value === "PUBLISHED" ? "bg-adm-ok-soft text-adm-ok" : "bg-adm-warn-soft text-adm-warn"
      }`}>
        {String(value)}
      </span>
    );
  }
  const s = String(value);
  return <span>{s.length > 60 ? s.slice(0, 60) + "…" : s}</span>;
}

function DeleteButton({
  endpoint, id, onDone,
}: {
  endpoint: string;
  id: number;
  onDone: () => void;
}) {
  const [busy, setBusy] = useState(false);
  return (
    <button
      disabled={busy}
      onClick={async () => {
        if (!confirm("Delete this item? This cannot be undone.")) return;
        setBusy(true);
        try {
          await api.del(`${endpoint}/${id}`);
          onDone();
        } catch (e) {
          alert(e instanceof ApiClientError ? e.message : "Delete failed");
        } finally {
          setBusy(false);
        }
      }}
      className="group rounded-md p-1.5 hover:bg-adm-danger-soft disabled:opacity-50"
    >
      <Trash2 className="h-4 w-4 text-adm-accent transition-colors group-hover:text-adm-danger" />
    </button>
  );
}

export function ResourceForm({
  title, fields, initial, onClose, onSubmit,
}: {
  title: string;
  fields: FieldDef[];
  initial: Record<string, unknown>;
  onClose: () => void;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
}) {
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const v: Record<string, unknown> = {};
    for (const f of fields) v[f.name] = initial[f.name] ?? (f.type === "status" ? "PUBLISHED" : "");
    return v;
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function set(name: string, value: unknown) {
    setValues((v) => ({ ...v, [name]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});
    // Drop empty optional strings so the API gets clean input.
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const val = values[f.name];
      if (val === "" && !f.required) continue;
      payload[f.name] = f.type === "number" ? Number(val) : val;
    }
    try {
      await onSubmit(payload);
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.details) setFieldErrors(err.details);
      } else setError("Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open title={title} onClose={onClose}>
      <form onSubmit={submit}>
        {error && (
          <div className="mb-4">
            <Notice kind="error">{error}</Notice>
          </div>
        )}
        {fields.map((f) => (
          <Field key={f.name} label={f.label + (f.required ? " *" : "")} error={fieldErrors[f.name]}>
            {f.type === "textarea" ? (
              <textarea
                className={inputClass}
                rows={3}
                value={String(values[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
              />
            ) : f.type === "status" ? (
              <select className={inputClass} value={String(values[f.name] ?? "PUBLISHED")} onChange={(e) => set(f.name, e.target.value)}>
                <option value="PUBLISHED">Published</option>
                <option value="DRAFT">Draft</option>
              </select>
            ) : f.type === "select" ? (
              <select className={inputClass} value={String(values[f.name] ?? "")} onChange={(e) => set(f.name, e.target.value)}>
                <option value="">Select…</option>
                {f.options?.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            ) : f.type === "image" || f.type === "video" ? (
              <UploadField
                kind={f.type}
                value={String(values[f.name] ?? "")}
                onChange={(url) => set(f.name, url)}
              />
            ) : (
              <input
                type={f.type === "number" ? "number" : f.type === "url" ? "url" : "text"}
                className={inputClass}
                value={String(values[f.name] ?? "")}
                onChange={(e) => set(f.name, e.target.value)}
                placeholder={f.placeholder}
              />
            )}
          </Field>
        ))}
        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </Modal>
  );
}
