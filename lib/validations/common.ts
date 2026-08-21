import { z } from "zod";

/** Enums mirror the Prisma schema. Kept here so validation owns the strings. */
export const StatusEnum = z.enum(["DRAFT", "PUBLISHED"]);
export const MediaTypeEnum = z.enum(["IMAGE", "VIDEO"]);
export const MediaSectionEnum = z.enum([
  "HERO",
  "ABOUT",
  "PRODUCTS",
  "INDUSTRIES",
  "INFRASTRUCTURE",
  "QUALITY",
  "CTA",
]);
export const EnquiryStatusEnum = z.enum([
  "NEW",
  "READ",
  "RESPONDED",
  "ARCHIVED",
]);
export const RoleEnum = z.enum(["ADMIN", "EDITOR"]);

/** Trimmed, non-empty string with a max length. */
export const shortText = (max = 191) =>
  z.string().trim().min(1, "Required").max(max);

/** Optional long text; empty string is normalised to undefined. */
export const longText = (max = 20000) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .or(z.literal("").transform(() => undefined));

/** Optional URL or root-relative path (our uploads return /uploads/...). */
export const mediaPath = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === "" || v.startsWith("/") || /^https?:\/\//.test(v), {
    message: "Must be a URL or a root-relative path",
  })
  .optional()
  .or(z.literal("").transform(() => undefined));

export const sortOrder = z.coerce.number().int().min(0).max(9999).default(0);

/** Like mediaPath but required — for gallery array items. */
export const requiredMediaPath = z
  .string()
  .trim()
  .min(1)
  .max(2048)
  .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), {
    message: "Must be a URL or a root-relative path",
  });
