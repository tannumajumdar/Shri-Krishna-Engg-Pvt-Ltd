import { mkdir, writeFile } from "node:fs/promises";
import { join, extname } from "node:path";
import { randomBytes } from "node:crypto";

/**
 * Storage abstraction.
 *
 * Everything above this file deals in a `StorageDriver`, never in the
 * filesystem. To move uploads to S3 or Cloudinary later, implement the same
 * two methods against that provider and swap `storage` below — no route
 * handler changes.
 *
 * The local driver writes under /public/uploads and returns a web path
 * (/uploads/...), so Next serves the file statically with no extra route.
 */

export type StoredFile = {
  /** Public URL to store in the DB and hand to the frontend. */
  url: string;
  /** Provider-relative key, for deletion. */
  key: string;
};

export interface StorageDriver {
  save(file: File, folder: string): Promise<StoredFile>;
}

/* ------------------------------ file rules ------------------------------- */

export const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
];
export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
export const PDF_TYPES = ["application/pdf"];

export const UPLOAD_KINDS = {
  image: IMAGE_TYPES,
  video: VIDEO_TYPES,
  pdf: PDF_TYPES,
  any: [...IMAGE_TYPES, ...VIDEO_TYPES, ...PDF_TYPES],
} as const;

export type UploadKind = keyof typeof UPLOAD_KINDS;

export function maxUploadBytes(): number {
  const mb = Number(process.env.MAX_UPLOAD_MB || "50");
  return (Number.isFinite(mb) ? mb : 50) * 1024 * 1024;
}

/* ------------------------------ local disk ------------------------------- */

class LocalDiskDriver implements StorageDriver {
  private baseDir = process.env.UPLOAD_DIR || "public/uploads";

  async save(file: File, folder: string): Promise<StoredFile> {
    const safeFolder = folder.replace(/[^a-z0-9/_-]/gi, "").replace(/^\/+/, "");
    const ext = extToKeep(file);
    const name = `${Date.now()}-${randomBytes(6).toString("hex")}${ext}`;

    const dir = join(process.cwd(), this.baseDir, safeFolder);
    await mkdir(dir, { recursive: true });

    const bytes = Buffer.from(await file.arrayBuffer());
    await writeFile(join(dir, name), bytes);

    // /public is the web root, so strip it from the served path.
    const publicPrefix = this.baseDir.replace(/^public\/?/, "");
    const key = [publicPrefix, safeFolder, name].filter(Boolean).join("/");
    return { url: `/${key}`, key };
  }
}

/** Keep a sane extension: from the filename, falling back to the MIME type. */
function extToKeep(file: File): string {
  const fromName = extname(file.name).toLowerCase();
  if (fromName && /^\.[a-z0-9]{1,5}$/.test(fromName)) return fromName;
  const map: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/svg+xml": ".svg",
    "video/mp4": ".mp4",
    "video/webm": ".webm",
    "video/quicktime": ".mov",
    "application/pdf": ".pdf",
  };
  return map[file.type] ?? "";
}

/** The active driver. Swap this line to change providers. */
export const storage: StorageDriver = new LocalDiskDriver();
