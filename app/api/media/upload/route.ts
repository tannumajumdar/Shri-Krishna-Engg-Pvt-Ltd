import { type NextRequest } from "next/server";
import { handle, ok, requireAuth, ApiError } from "@/lib/api";
import {
  storage,
  UPLOAD_KINDS,
  maxUploadBytes,
  type UploadKind,
} from "@/lib/storage";

/**
 * POST /api/media/upload — ADMIN only. multipart/form-data.
 *
 * Fields:
 *   file   (required) — the binary
 *   kind   (optional) — image | video | pdf | any   (default: image)
 *   folder (optional) — subfolder under /uploads     (default: kind)
 *
 * Validates MIME type and size, writes via the storage driver, and returns
 * { url }. The URL is what you then save on a Media/Product/etc. record — the
 * upload endpoint itself creates no DB rows, so it stays reusable everywhere.
 */
export const POST = handle(async (req: NextRequest) => {
  await requireAuth(req);

  const form = await req.formData().catch(() => {
    throw new ApiError(400, "Expected multipart/form-data");
  });

  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    throw new ApiError(400, "No file provided");
  }

  const kind = (form.get("kind")?.toString() || "image") as UploadKind;
  const allowed = UPLOAD_KINDS[kind];
  if (!allowed) throw new ApiError(400, "Unknown upload kind");

  if (!allowed.includes(file.type)) {
    throw new ApiError(
      415,
      `File type ${file.type || "unknown"} not allowed for ${kind}`,
    );
  }

  const max = maxUploadBytes();
  if (file.size > max) {
    throw new ApiError(
      413,
      `File exceeds the ${Math.round(max / 1024 / 1024)} MB limit`,
    );
  }

  const folder = (form.get("folder")?.toString() || kind).toLowerCase();
  const stored = await storage.save(file, folder);

  return ok(
    {
      url: stored.url,
      key: stored.key,
      type: file.type,
      size: file.size,
      name: file.name,
    },
    201,
  );
});
