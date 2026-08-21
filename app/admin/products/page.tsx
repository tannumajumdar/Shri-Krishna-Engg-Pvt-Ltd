"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { PageHeader, Button, Modal, Field, Notice, inputClass, useResource } from "../ui";
import { UploadField } from "../UploadField";
import { api, ApiClientError } from "@/lib/admin/api-client";

type Category = { id: number; name: string };
type ProductImage = { id: number; imageUrl: string };
type Product = {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
  category?: { name: string };
  shortDescription: string | null;
  description: string | null;
  image: string | null;
  pdf: string | null;
  applications: string[] | null;
  images: ProductImage[];
  status: "PUBLISHED" | "DRAFT";
  sortOrder: number;
};

export default function ProductsPage() {
  const { data, loading, error, reload } = useResource<Product[]>("/api/products?all=1");
  const { data: cats } = useResource<Category[]>("/api/categories?all=1");
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const rows = data ?? [];
  const categories = cats ?? [];

  return (
    <>
      <PageHeader
        title="Products"
        subtitle="Catalogue items grouped by category"
        action={
          <Button onClick={() => setCreating(true)} disabled={!categories.length}>
            <Plus className="mr-1 inline h-4 w-4" /> New
          </Button>
        }
      />
      <div className="p-8">
        {error && <Notice kind="error">{error}</Notice>}
        {!categories.length && !loading && (
          <div className="mb-4"><Notice kind="error">Create a category first.</Notice></div>
        )}

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs text-slate-500">
              <tr>
                <th className="px-5 py-3 font-medium">Name</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Images</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-t border-slate-100">
                  <td className="px-5 py-3 font-medium text-slate-800">{p.name}</td>
                  <td className="px-5 py-3 text-slate-600">{p.category?.name ?? "—"}</td>
                  <td className="px-5 py-3 text-slate-500">{p.images.length}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs ${
                      p.status === "PUBLISHED" ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
                    }`}>{p.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => setEditing(p)} className="mr-1 rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-blue-600">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm("Delete this product?")) return;
                        await api.del(`/api/products/${p.id}`);
                        reload();
                      }}
                      className="rounded-md p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {!loading && !rows.length && (
                <tr><td colSpan={5} className="px-5 py-6 text-center text-slate-400">No products yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(creating || editing) && (
        <ProductForm
          categories={categories}
          initial={editing}
          onClose={() => { setCreating(false); setEditing(null); }}
          onSaved={reload}
        />
      )}
    </>
  );
}

function ProductForm({
  categories, initial, onClose, onSaved,
}: {
  categories: Category[];
  initial: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [categoryId, setCategoryId] = useState<number>(initial?.categoryId ?? categories[0]?.id ?? 0);
  const [shortDescription, setShort] = useState(initial?.shortDescription ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const [applications, setApplications] = useState((initial?.applications ?? []).join(", "));
  const [images, setImages] = useState<string[]>(initial?.images.map((i) => i.imageUrl) ?? []);
  const [status, setStatus] = useState<"PUBLISHED" | "DRAFT">(initial?.status ?? "PUBLISHED");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setFieldErrors({});
    const payload: Record<string, unknown> = {
      categoryId,
      name,
      status,
      images: images.filter(Boolean),
    };
    if (shortDescription) payload.shortDescription = shortDescription;
    if (description) payload.description = description;
    if (image) payload.image = image;
    const apps = applications.split(",").map((s) => s.trim()).filter(Boolean);
    if (apps.length) payload.applications = apps;

    try {
      if (initial) await api.put(`/api/products/${initial.id}`, payload);
      else await api.post("/api/products", payload);
      onSaved();
      onClose();
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
        if (err.details) setFieldErrors(err.details);
      } else setError("Save failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open title={initial ? "Edit Product" : "New Product"} onClose={onClose}>
      <form onSubmit={submit}>
        {error && <div className="mb-4"><Notice kind="error">{error}</Notice></div>}

        <Field label="Name *" error={fieldErrors.name}>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Category *" error={fieldErrors.categoryId}>
          <select className={inputClass} value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </Field>

        <Field label="Short description" error={fieldErrors.shortDescription}>
          <textarea className={inputClass} rows={2} value={shortDescription} onChange={(e) => setShort(e.target.value)} />
        </Field>

        <Field label="Full description">
          <textarea className={inputClass} rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </Field>

        <Field label="Main image">
          <UploadField kind="image" value={image} onChange={setImage} />
        </Field>

        <Field label="Applications (comma separated)">
          <input className={inputClass} value={applications} onChange={(e) => setApplications(e.target.value)} placeholder="Framing, Glazing, Cladding" />
        </Field>

        <Field label="Gallery images">
          <GalleryEditor images={images} onChange={setImages} />
        </Field>

        <Field label="Status">
          <select className={inputClass} value={status} onChange={(e) => setStatus(e.target.value as "PUBLISHED" | "DRAFT")}>
            <option value="PUBLISHED">Published</option>
            <option value="DRAFT">Draft</option>
          </select>
        </Field>

        <div className="mt-2 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" disabled={busy}>{busy ? "Saving…" : "Save"}</Button>
        </div>
      </form>
    </Modal>
  );
}

function GalleryEditor({
  images, onChange,
}: {
  images: string[];
  onChange: (imgs: string[]) => void;
}) {
  return (
    <div className="space-y-2">
      {images.map((url, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">
            <UploadField
              kind="image"
              value={url}
              onChange={(v) => onChange(images.map((x, j) => (j === i ? v : x)))}
            />
          </div>
          <button
            type="button"
            onClick={() => onChange(images.filter((_, j) => j !== i))}
            className="shrink-0 rounded-md p-2 text-slate-400 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
      <Button type="button" variant="ghost" onClick={() => onChange([...images, ""])}>
        <Plus className="mr-1 inline h-4 w-4" /> Add image
      </Button>
    </div>
  );
}
