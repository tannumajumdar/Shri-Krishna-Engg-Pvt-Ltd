import type { Metadata } from "next";
import { headers } from "next/headers";
import { AdminNav } from "./nav";

export const metadata: Metadata = {
  title: "SKE Admin",
  robots: { index: false, follow: false },
};

/**
 * The login page renders bare (no sidebar); every other admin page gets the
 * chrome. We detect the path from the middleware-set header so this stays a
 * server component. The middleware already gates access.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-admin-path") || "";
  const bare = pathname.endsWith("/admin/login");

  if (bare) return <>{children}</>;

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-800">
      <AdminNav />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
