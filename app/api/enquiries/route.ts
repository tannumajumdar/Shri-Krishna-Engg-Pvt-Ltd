import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, parseBody, requireAuth, ApiError } from "@/lib/api";
import { enquiryCreateSchema, EnquiryStatusEnum } from "@/lib/validations";

/**
 * POST /api/enquiries — PUBLIC. Anyone can submit the contact form.
 * GET  /api/enquiries — ADMIN. List/inbox, filterable by ?status=NEW.
 */
export const POST = handle(async (req: NextRequest) => {
  const body = await parseBody(req, enquiryCreateSchema);

  // Honeypot: a filled hidden field means a bot. Accept silently so it does
  // not retry, but store nothing.
  if (body.website) return ok({ received: true }, 201);

  const { website: _hp, ...data } = body;
  const enquiry = await prisma.enquiry.create({ data });
  return ok(
    { id: enquiry.id, received: true, createdAt: enquiry.createdAt },
    201,
  );
});

export const GET = handle(async (req: NextRequest) => {
  await requireAuth(req);

  const statusParam = req.nextUrl.searchParams.get("status");
  const where = statusParam
    ? { status: EnquiryStatusEnum.parse(statusParam) }
    : {};

  const enquiries = await prisma.enquiry.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return ok(enquiries);
});
