import { type NextRequest } from "next/server";
import { authCookieOptions, AUTH_COOKIE } from "@/lib/auth";
import { handle, ok } from "@/lib/api";

/** POST /api/auth/logout — clear the session cookie. Idempotent. */
export const POST = handle(async (_req: NextRequest) => {
  const res = ok({ loggedOut: true });
  res.cookies.set(AUTH_COOKIE, "", authCookieOptions(0));
  return res;
});
