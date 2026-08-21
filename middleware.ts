import { NextResponse, type NextRequest } from "next/server";
import { verifySession, AUTH_COOKIE } from "@/lib/auth";

/**
 * Edge guard for the admin UI.
 *
 * Pages under /admin (except /admin/login) require a valid session, else we
 * redirect to the login screen. API routes are NOT guarded here — each route
 * handler calls requireAuth itself, which lets public endpoints
 * (GET /api/products, POST /api/enquiries) stay open while admin ones are
 * protected. Doing both keeps the two concerns independent.
 */
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLogin = pathname === "/admin/login";
  const token = req.cookies.get(AUTH_COOKIE)?.value;
  const session = await verifySession(token);

  if (!session && !isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Already signed in but sitting on the login page → send to dashboard.
  if (session && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Expose the path to the server layout (via a REQUEST header, which is what
  // headers() reads) so it can render the login page without the sidebar.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-admin-path", pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: ["/admin/:path*"],
};
