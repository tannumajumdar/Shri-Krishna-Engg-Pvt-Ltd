import { type NextRequest } from "next/server";
import { Status } from "@/lib/generated/prisma/enums";

/**
 * Public reads return only PUBLISHED rows. The admin panel calls the same
 * endpoints with ?all=1 (or ?status=DRAFT) to see everything — but only after
 * the route has confirmed a session. Passing ?all=1 without auth is ignored.
 */
export function statusFilter(
  req: NextRequest,
  isAdmin: boolean,
): { status?: Status } {
  if (!isAdmin) return { status: Status.PUBLISHED };

  const status = req.nextUrl.searchParams.get("status");
  if (status === "DRAFT") return { status: Status.DRAFT };
  if (status === "PUBLISHED") return { status: Status.PUBLISHED };
  return {}; // admin, no filter → everything
}

/** True if the request is asking for the admin (unfiltered) view. */
export function wantsAll(req: NextRequest): boolean {
  const p = req.nextUrl.searchParams;
  return p.get("all") === "1" || p.has("status");
}
