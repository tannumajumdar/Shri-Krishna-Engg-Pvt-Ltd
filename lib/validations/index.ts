import { z } from "zod";
import {
  StatusEnum,
  MediaTypeEnum,
  MediaSectionEnum,
  EnquiryStatusEnum,
  shortText,
  longText,
  mediaPath,
  requiredMediaPath,
  sortOrder,
} from "./common";

export * from "./common";

/* --------------------------------- auth ---------------------------------- */

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(1, "Password is required").max(200),
});

/* ------------------------------- category -------------------------------- */

export const categoryCreateSchema = z.object({
  name: shortText(191),
  slug: shortText(191).optional(), // derived from name when omitted
  description: longText(),
  image: mediaPath,
  status: StatusEnum.default("PUBLISHED"),
  sortOrder,
});
export const categoryUpdateSchema = categoryCreateSchema.partial();

/* -------------------------------- product -------------------------------- */

const specificationItem = z.object({
  label: shortText(191),
  value: shortText(191),
});

export const productCreateSchema = z.object({
  categoryId: z.coerce.number().int().positive(),
  name: shortText(191),
  slug: shortText(191).optional(),
  shortDescription: longText(500),
  description: longText(),
  image: mediaPath,
  pdf: mediaPath,
  specifications: z.array(specificationItem).max(50).optional(),
  applications: z.array(shortText(191)).max(50).optional(),
  status: StatusEnum.default("PUBLISHED"),
  sortOrder,
  /** Gallery images, in order. */
  images: z.array(requiredMediaPath).max(20).optional(),
});
export const productUpdateSchema = productCreateSchema.partial();

/* ------------------------------- industry -------------------------------- */

export const industryCreateSchema = z.object({
  name: shortText(191),
  slug: shortText(191).optional(),
  description: longText(),
  image: mediaPath,
  status: StatusEnum.default("PUBLISHED"),
  sortOrder,
});
export const industryUpdateSchema = industryCreateSchema.partial();

/* --------------------------------- media --------------------------------- */

export const mediaCreateSchema = z.object({
  type: MediaTypeEnum.default("IMAGE"),
  title: shortText(191).optional(),
  fileUrl: z.string().trim().min(1, "fileUrl is required").max(2048),
  poster: mediaPath,
  alt: shortText(191).optional(),
  section: MediaSectionEnum,
  sortOrder,
  status: StatusEnum.default("PUBLISHED"),
});
export const mediaUpdateSchema = mediaCreateSchema.partial();

/* ------------------------------- statistic ------------------------------- */

export const statisticCreateSchema = z.object({
  title: shortText(191),
  value: shortText(50),
  suffix: shortText(20).optional(),
  sortOrder,
  status: StatusEnum.default("PUBLISHED"),
});
export const statisticUpdateSchema = statisticCreateSchema.partial();

/* ------------------------ feature / quality point ------------------------ */

export const featureCreateSchema = z.object({
  title: shortText(191),
  description: longText(2000),
  icon: shortText(60).optional(),
  sortOrder,
  status: StatusEnum.default("PUBLISHED"),
});
export const featureUpdateSchema = featureCreateSchema.partial();

// Quality points share the same shape as features.
export const qualityPointCreateSchema = featureCreateSchema;
export const qualityPointUpdateSchema = featureUpdateSchema;

/* -------------------------------- enquiry -------------------------------- */

export const enquiryCreateSchema = z.object({
  name: shortText(191),
  company: shortText(191).optional(),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  phone: shortText(40).optional(),
  subject: shortText(191).optional(),
  product: shortText(191).optional(),
  message: z.string().trim().min(5, "Message is too short").max(5000),
  /** Honeypot — bots fill hidden fields; humans leave it empty. Accepted by
   *  validation on purpose: the handler silently drops a filled one with a
   *  normal 201 so a bot cannot tell it was caught. */
  website: z.string().max(200).optional(),
});

export const enquiryUpdateSchema = z.object({
  status: EnquiryStatusEnum,
});

/* -------------------------------- contact -------------------------------- */

export const contactUpdateSchema = z.object({
  address: longText(1000),
  phone: shortText(40).optional(),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .email()
    .optional()
    .or(z.literal("").transform(() => undefined)),
  whatsapp: shortText(40).optional(),
  mapUrl: longText(2048),
  hours: shortText(191).optional(),
});

/* ------------------------------ social link ------------------------------ */

export const socialLinkCreateSchema = z.object({
  platform: shortText(60),
  url: z.string().trim().url("Enter a valid URL").max(2048),
  icon: shortText(60).optional(),
  sortOrder,
  status: StatusEnum.default("PUBLISHED"),
});
export const socialLinkUpdateSchema = socialLinkCreateSchema.partial();
