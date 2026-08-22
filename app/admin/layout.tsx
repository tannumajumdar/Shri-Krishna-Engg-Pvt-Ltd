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
    <div className="flex min-h-screen bg-slate-100 text-slate-800">
      <AdminNav />
      {/* Industrial backdrop behind every admin page. Scoped INSIDE <main> as
          an absolute layer (z-0) so it paints above the container's own
          background — a fixed/-z-10 layer would hide behind it. The white
          content cards (z-10) stay perfectly readable over a light wash. */}
      <main className="relative flex-1 overflow-x-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-[url('/media/admin/admin-bg.jpg')] bg-cover bg-center bg-no-repeat"
        />
        {/* Light wash so the photo clearly shows through while cards read cleanly. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 bg-gradient-to-br from-white/45 via-white/35 to-slate-200/45"
        />
        <div className="relative z-10 min-h-screen">{children}</div>
      </main>
    </div>
  );
}
