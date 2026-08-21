import { SignJWT, jwtVerify, type JWTPayload } from "jose";

/**
 * JWT session helpers — Edge-safe.
 *
 * This file uses ONLY `jose`, which runs on the Edge runtime. It is imported by
 * middleware.ts (which runs on Edge). Password hashing lives in lib/auth.ts
 * with bcrypt — keep that OUT of this file, or bcrypt gets pulled into the Edge
 * bundle and the build warns / the middleware fails at runtime on serverless
 * hosts (Netlify/Vercel).
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
 * bad signature, expiry, tampering. Callers treat null as "not authenticated".
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
