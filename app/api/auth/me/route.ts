import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, requireAuth, notFound } from "@/lib/api";

/**
 * GET /api/auth/me — the current admin, or 401.
 * Re-reads from the DB rather than trusting the token payload, so a
 * deactivated or renamed admin is reflected immediately. Password is never
 * selected.
 */
export const GET = handle(async (req: NextRequest) => {
  const session = await requireAuth(req);
  const admin = await prisma.admin.findUnique({
    where: { id: Number(session.sub) },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  if (!admin) throw notFound("Admin account no longer exists");
  return ok(admin);
});
