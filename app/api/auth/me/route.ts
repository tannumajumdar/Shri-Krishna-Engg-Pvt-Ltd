import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  handle,
  ok,
  parseBody,
  requireAuth,
  notFound,
  ApiError,
} from "@/lib/api";
import { hashPassword, verifyPassword } from "@/lib/auth";
import { profileUpdateSchema } from "@/lib/validations";

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

/**
 * PUT /api/auth/me — the admin updates their own name, email and/or password.
 *
 * `currentPassword` is always required and must match, so a stolen session
 * cookie alone cannot change the login credentials. A duplicate email surfaces
 * as 409 via the shared error handler. The password hash is never returned.
 */
export const PUT = handle(async (req: NextRequest) => {
  const session = await requireAuth(req);
  const body = await parseBody(req, profileUpdateSchema);

  const admin = await prisma.admin.findUnique({
    where: { id: Number(session.sub) },
  });
  if (!admin) throw notFound("Admin account no longer exists");

  const okPassword = await verifyPassword(body.currentPassword, admin.password);
  if (!okPassword) throw new ApiError(401, "Current password is incorrect");

  const data: {
    name?: string;
    email?: string;
    password?: string;
  } = {};
  if (body.name) data.name = body.name;
  if (body.email) data.email = body.email;
  if (body.newPassword) data.password = await hashPassword(body.newPassword);

  const updated = await prisma.admin.update({
    where: { id: admin.id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  return ok(updated);
});
