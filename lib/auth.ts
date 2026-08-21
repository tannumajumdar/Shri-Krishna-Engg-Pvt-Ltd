import bcrypt from "bcryptjs";

/**
 * Password hashing (bcrypt) — Node runtime only.
 *
 * bcrypt uses Node APIs and must NOT run on the Edge runtime, so this file is
 * imported only by the login route (which runs on Node). Session sign/verify
 * lives in lib/session.ts (jose, Edge-safe). Session helpers are re-exported
 * here for convenience, but anything that runs on Edge (middleware) must import
 * from "@/lib/session" directly so bcrypt is never bundled for Edge.
 */

const BCRYPT_ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

// Convenience re-exports for Node-runtime callers.
export {
  AUTH_COOKIE,
  signSession,
  verifySession,
  authCookieOptions,
  type SessionPayload,
} from "@/lib/session";
