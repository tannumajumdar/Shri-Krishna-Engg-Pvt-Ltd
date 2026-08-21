# Backend — Shri Krishna Engineering

Content backend for the landing page: **admin edits → MySQL → API → the page
renders it**, with no frontend code changes.

Stack: Next.js Route Handlers · TypeScript · MySQL (8.4) · Prisma 7 · JWT auth
(jose) · bcrypt · Zod.

## Setup

```bash
# 1. Point .env at your MySQL (see .env.example). Local dev is preconfigured
#    for the running MySQL on 127.0.0.1:3306, database ske_db, root/no-password.

# 2. Create the schema and generate the client
npm run db:migrate      # applies prisma/migrations
npm run db:seed         # admin + all content from lib/site.ts

# 3. Run
npm run dev             # site at /, admin at /admin
```

Default admin (change in `.env`, then re-seed): the values of `ADMIN_EMAIL` /
`ADMIN_PASSWORD` — seeded as `admin@shrikrishnaengineering.in` / `Admin@12345`.

## Secrets never reach the browser

`DATABASE_URL`, `JWT_SECRET`, `ADMIN_PASSWORD` live in `.env` (gitignored) and
are read only in server code. None are prefixed `NEXT_PUBLIC_`, so Next cannot
bundle them. Passwords are bcrypt-hashed and never selected into any response.

## API

Envelope: `{ success: true, data }` or `{ success: false, error, details }`.
Status codes: 200/201 ok · 400 bad request · 401 unauthenticated · 403
forbidden · 404 not found · 409 conflict (duplicate slug) · 413/415 upload
too large / wrong type · 422 validation (with per-field `details`).

Public GETs return only `PUBLISHED` rows. An authenticated admin adds `?all=1`
(or `?status=DRAFT`) to see everything.

| Resource | Endpoints | Auth |
| --- | --- | --- |
| Auth | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` | — / cookie |
| Products | `GET /api/products` (`?grouped=1`, `?category=slug`, `?all=1`), `GET /api/products/[slug\|id]`, `POST`, `PUT /api/products/[id]`, `DELETE /api/products/[id]` | GET public · writes admin |
| Categories | `GET /api/categories`, `POST`, `PUT/DELETE /api/categories/[id]` | GET public · writes admin |
| Industries | `GET /api/industries`, `POST`, `PUT/DELETE /api/industries/[id]` | GET public · writes admin |
| Media | `GET /api/media` (`?section=HERO`, `?type=VIDEO`), `POST`, `PUT/DELETE /api/media/[id]` | GET public · writes admin |
| Statistics | `GET /api/statistics`, `POST`, `PUT/DELETE /api/statistics/[id]` | GET public · writes admin |
| Features | `GET /api/features`, `POST`, `PUT/DELETE /api/features/[id]` | Why-Choose-Us cards |
| Quality points | `GET /api/quality-points`, `POST`, `PUT/DELETE /api/quality-points/[id]` | Quality section |
| Enquiries | `POST /api/enquiries` (**public**), `GET /api/enquiries`, `PUT/DELETE /api/enquiries/[id]` | create public · rest admin |
| Contact | `GET /api/contact`, `PUT /api/contact` | GET public · PUT admin |
| Social links | `GET /api/social-links`, `POST`, `PUT/DELETE /api/social-links/[id]` | GET public · writes admin |
| Upload | `POST /api/media/upload` (multipart) | admin |
| Dashboard | `GET /api/dashboard` | admin |

> Next forbids sibling `[id]` and `[slug]` segments, so products use one
> `[key]` route: GET accepts a slug **or** a numeric id; PUT/DELETE require an id.

## Uploads

`POST /api/media/upload` (multipart): `file`, `kind` = image|video|pdf|any,
optional `folder`. Validates MIME + size (`MAX_UPLOAD_MB`), writes under
`/public/uploads`, returns `{ url }`. Save that url on a Media/Product record —
the upload route creates no DB rows, so it is reusable everywhere.

Storage is swappable: everything goes through `lib/storage.ts`. Implement the
`StorageDriver` interface against S3/Cloudinary and change the one `export const
storage =` line — no route changes.

## Auth model

- Login verifies bcrypt, issues a 7-day HS256 JWT in an **httpOnly, SameSite=Lax**
  cookie (secure in production). Wrong email and wrong password return the same
  401 with a constant-time compare, so accounts can't be enumerated.
- Every mutating/admin route calls `requireAuth(req)` (in `lib/api.ts`), which
  verifies the cookie. Invalid/expired tokens → 401.
- `middleware.ts` guards the **`/admin` pages** at the edge (redirect to login).
  API routes guard themselves, which keeps public endpoints open.

## How the frontend consumes it

`app/page.tsx` is a server component. It reads each block through
`lib/content.ts` (Prisma queries mapped to the shapes the sections expect) and
passes them as props. Each section component takes an optional prop that
**defaults to the static content in `lib/site.ts`**, so:

- with a DB → the page shows DB content (editable in `/admin`);
- with no DB / empty tables → it falls back to the shipped static content and
  still renders. Failures are logged, never surfaced.

The page uses `export const revalidate = 60`, so admin edits appear within a
minute without a redeploy. `/api/*` remains available for client-side or
external consumers.

Wired end-to-end: **Hero video · Products (grouped marquee) · Industries ·
Infrastructure gallery · Statistics · Why-Choose-Us · Quality · Contact ·
Social links.**

## Data model

10 content models + `Admin`, in `prisma/schema.prisma`. Relations:
`ProductCategory → Product → ProductImage` (cascade delete), `ContactInfo` is a
single upserted row. Indexes on `slug` (unique), `status`, `categoryId`,
`section`, `createdAt`.

## Scripts

`db:migrate` · `db:push` · `db:seed` · `db:generate` · `db:studio`.
