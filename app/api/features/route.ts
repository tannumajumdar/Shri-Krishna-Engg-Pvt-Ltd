import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth } from "@/lib/api";
import { statusFilter, wantsAll } from "@/lib/query";
import { verifySession, AUTH_COOKIE } from "@/lib/auth";
import { featureCreateSchema } from "@/lib/validations";

export const GET = handle(async (req: NextRequest) => {
  const isAdmin =
    wantsAll(req) &&
    Boolean(await verifySession(req.cookies.get(AUTH_COOKIE)?.value));
  const rows = await prisma.feature.findMany({
    where: statusFilter(req, isAdmin),
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return ok(rows);
});

export const POST = handle(async (req: NextRequest) => {
  await requireAuth(req);
  const body = await parseBody(req, featureCreateSchema);
  const row = await prisma.feature.create({ data: body });
  return ok(row, 201);
});
