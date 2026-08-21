"use client";

import { useEffect, useState } from "react";
import { PageHeader, useResource } from "../ui";

type Me = { name: string; email: string; role: string; createdAt: string };

export default function SettingsPage() {
  const { data } = useResource<Me>("/api/auth/me");
  return (
    <>
      <PageHeader title="Settings" subtitle="Account and environment" />
      <div className="max-w-2xl p-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">Signed-in Admin</h2>
          <dl className="space-y-3 text-sm">
            <Row label="Name" value={data?.name} />
            <Row label="Email" value={data?.email} />
            <Row label="Role" value={data?.role} />
          </dl>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
          <h2 className="mb-2 text-sm font-semibold text-slate-700">Notes</h2>
          <ul className="list-inside list-disc space-y-1.5">
            <li>Passwords, database URL and JWT secret live in <code className="rounded bg-slate-100 px-1">.env</code> and are never sent to the browser.</li>
            <li>To change the admin password, update <code className="rounded bg-slate-100 px-1">ADMIN_PASSWORD</code> in <code className="rounded bg-slate-100 px-1">.env</code> and re-run <code className="rounded bg-slate-100 px-1">npm run db:seed</code>.</li>
            <li>Uploaded files are stored under <code className="rounded bg-slate-100 px-1">/public/uploads</code>. Swap <code className="rounded bg-slate-100 px-1">lib/storage.ts</code> to move to S3 or Cloudinary.</li>
          </ul>
        </div>
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between border-b border-slate-100 pb-2">
      <dt className="text-slate-500">{label}</dt>
      <dd className="font-medium text-slate-800">{value ?? "—"}</dd>
    </div>
  );
}
