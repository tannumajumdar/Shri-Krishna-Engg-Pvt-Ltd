import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth, ApiError } from "@/lib/api";
import { statusFilter, wantsAll } from "@/lib/query";
import { verifySession, AUTH_COOKIE } from "@/lib/session";
import { mediaCreateSchema, MediaSectionEnum } from "@/lib/validations";
import type { Prisma } from "@/lib/generated/prisma/client";

/**
 * GET /api/media            — all published media.
 * GET /api/media?section=HERO — one section (the frontend's main use).
 * GET /api/media?type=VIDEO — filter by type.
 * POST /api/media           — admin only. Register an already-uploaded file.
 */
export const GET = handle(async (req: NextRequest) => {
  const isAdmin =
    wantsAll(req) &&
    Boolean(await verifySession(req.cookies.get(AUTH_COOKIE)?.value));
  const where: Prisma.MediaWhereInput = statusFilter(req, isAdmin);

  const section = req.nextUrl.searchParams.get("section");
  if (section) {
    const parsed = MediaSectionEnum.safeParse(section);
    if (!parsed.success) throw new ApiError(400, "Unknown media section");
    where.section = parsed.data;
  }

  const type = req.nextUrl.searchParams.get("type");
  if (type === "IMAGE" || type === "VIDEO") where.type = type;

  const rows = await prisma.media.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
  return ok(rows);
});

export const POST = handle(async (req: NextRequest) => {
  await requireAuth(req);
  const body = await parseBody(req, mediaCreateSchema);
  const row = await prisma.media.create({ data: body });
  return ok(row, 201);
});
