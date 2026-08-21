import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * Admin auth primitives: password hashing (bcrypt) and stateless sessions
 * (JWT via `jose`, which runs on the Edge runtime unlike jsonwebtoken).
 *
 * Route handlers do not call these directly for auth checks — they use
 * `requireAuth` in lib/api.ts, which reads the cookie and verifies it.
 */

const encoder = new TextEncoder();

function secretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error("JWT_SECRET is missing or too short — see .env.example");
  }
  return encoder.encode(secret);
}

/** Name of the httpOnly cookie the JWT is stored in. */
export const AUTH_COOKIE = "ske_admin_token";

export type SessionPayload = JWTPayload & {
  sub: string; // admin id (stringified)
  email: string;
  role: string;
  name: string;
};

const BCRYPT_ROUNDS = 10;

export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, BCRYPT_ROUNDS);
}

export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signSession(
  payload: Omit<SessionPayload, keyof JWTPayload>,
): Promise<string> {
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secretKey());
}

/**
 * Verify a token. Returns the payload on success, or null for any failure —
 * bad signature, expiry, tampering. Callers treat null as "not authenticated"
 * and never see the underlying error, so an attacker learns nothing from it.
 */
export async function verifySession(
  token: string | undefined | null,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secretKey());
    return payload as SessionPayload;
  } catch {
    return null;
  }
}

/** Cookie options shared by login (set) and logout (clear). */
export function authCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
