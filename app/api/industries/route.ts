import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth } from "@/lib/api";
import { statusFilter, wantsAll } from "@/lib/query";
import { verifySession, AUTH_COOKIE } from "@/lib/session";
import { industryCreateSchema } from "@/lib/validations";
import { slugify } from "@/lib/utils/slug";

export const GET = handle(async (req: NextRequest) => {
  const isAdmin =
    wantsAll(req) &&
    Boolean(await verifySession(req.cookies.get(AUTH_COOKIE)?.value));
  const rows = await prisma.industry.findMany({
    where: statusFilter(req, isAdmin),
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return ok(rows);
});

export const POST = handle(async (req: NextRequest) => {
  await requireAuth(req);
  const body = await parseBody(req, industryCreateSchema);
  const row = await prisma.industry.create({
    data: { ...body, slug: body.slug || slugify(body.name) },
  });
  return ok(row, 201);
});
