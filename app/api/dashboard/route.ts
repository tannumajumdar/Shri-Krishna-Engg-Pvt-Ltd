import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { handle, ok, requireAuth } from "@/lib/api";

/**
 * GET /api/dashboard — ADMIN. Counts for the dashboard cards, plus the most
 * recent enquiries so the landing view is useful on its own.
 */
export const GET = handle(async (req: NextRequest) => {
  await requireAuth(req);

  const [
    products,
    categories,
    industries,
    media,
    enquiries,
    newEnquiries,
    recentEnquiries,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.productCategory.count(),
    prisma.industry.count(),
    prisma.media.count(),
    prisma.enquiry.count(),
    prisma.enquiry.count({ where: { status: "NEW" } }),
    prisma.enquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        subject: true,
        status: true,
        createdAt: true,
      },
    }),
  ]);

  return ok({
    counts: { products, categories, industries, media, enquiries, newEnquiries },
    recentEnquiries,
  });
});
