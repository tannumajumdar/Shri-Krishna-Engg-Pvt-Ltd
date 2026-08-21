import { type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/auth";
import { signSession, authCookieOptions, AUTH_COOKIE } from "@/lib/session";
import { handle, ok, parseBody, ApiError } from "@/lib/api";
import { loginSchema } from "@/lib/validations";

/**
 * POST /api/auth/login
 * Verify credentials, set an httpOnly JWT cookie, return the admin profile.
 * The same 401 is returned whether the email is unknown or the password is
 * wrong, so the endpoint cannot be used to enumerate accounts.
 */
export const POST = handle(async (req: NextRequest) => {
  const { email, password } = await parseBody(req, loginSchema);

  const admin = await prisma.admin.findUnique({ where: { email } });
  const invalid = new ApiError(401, "Invalid email or password");
  if (!admin) {
    // Compare against a dummy hash anyway so timing does not reveal whether
    // the account exists.
    await verifyPassword(password, "$2a$10$invalidinvalidinvalidinvalidinva");
    throw invalid;
  }

  const good = await verifyPassword(password, admin.password);
  if (!good) throw invalid;

  const token = await signSession({
    sub: String(admin.id),
    email: admin.email,
    role: admin.role,
    name: admin.name,
  });

  const maxAge = 60 * 60 * 24 * 7; // 7 days, matching JWT_EXPIRES_IN default
  const res = ok({
    id: admin.id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
  });
  res.cookies.set(AUTH_COOKIE, token, authCookieOptions(maxAge));
  return res;
});
