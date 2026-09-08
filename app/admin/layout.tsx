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
      {/* A plain surface, deliberately. An admin panel is a work tool: the
          photograph that used to sit here competed with every table and form
          on top of it, and the translucent chrome it required made headings
          hard to read. The brand shows up in the sidebar and the login screen
          instead, where it costs nothing. */}
      <main className="min-w-0 flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
