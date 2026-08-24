# Running the website on cPanel — "Setup Node.js App"

Your cPanel has **Setup Node.js App**, so the whole site (frontend + backend)
can run there. This guide uses a **self-contained standalone build** — you build
it once on your PC and upload it; the server does not need to install anything.

Do the **database** first (`database/CPANEL_DB.md`), then this.

---

## Step 1 — Build the bundle (on your PC)

In the project folder:

```bash
npm install
npm run build:cpanel
```

This produces a ready-to-run folder at **`.next/standalone/`** that already
contains the server, your pages, `public/`, and all needed `node_modules`
(including the MySQL driver). Nothing else has to be installed on the server.

> Verified self-contained: it was test-run outside the project with no other
> `node_modules` and served the database-backed APIs correctly.

## Step 2 — Upload it to cPanel

1. Zip the **contents of** `.next/standalone/` (so `server.js` is at the top of
   the zip, not inside a `standalone/` folder).
2. cPanel → **Files → File Manager** → create a folder, e.g. `ske-app`, in your
   home directory (NOT inside `public_html`).
3. Upload the zip into `ske-app` and **Extract** it there.

After extraction `ske-app` should contain: `server.js`, `.next/`, `public/`,
`node_modules/`, `package.json`.

## Step 3 — Create the Node.js app

cPanel → **Software → Setup Node.js App** → **Create Application**:

| Field | Value |
| --- | --- |
| Node.js version | **20.x** (or 18.x) |
| Application mode | **Production** |
| Application root | `ske-app` (the folder from Step 2) |
| Application URL | your domain (e.g. `shrikrishnaengineering.in`) |
| Application startup file | **`server.js`** |

Click **Create**.

> **Do NOT click "Run NPM Install".** The bundle already ships its
> `node_modules`; reinstalling from the minimal standalone `package.json` would
> break it.

## Step 4 — Environment variables

In the same Node.js App screen, open **Environment variables** and add:

```
DATABASE_URL   = mysql://youruser_skeuser:YOUR_PASSWORD@localhost:3306/youruser_ske
JWT_SECRET     = <a long random string>
JWT_EXPIRES_IN = 7d
ADMIN_EMAIL    = admin@shrikrishnaengineering.in
ADMIN_PASSWORD = (only used by the seed; the DB import already has the admin)
ADMIN_NAME     = SKE Administrator
UPLOAD_DIR     = public/uploads
MAX_UPLOAD_MB  = 50
NODE_ENV       = production
```

Generate the secret on your PC: `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"`

Use the exact DB name/user/password you created in `CPANEL_DB.md` (with the
cPanel account prefix). URL-encode special characters in the password.

## Step 5 — Start

Click **Restart** (or Start). Open your domain — the site loads. Go to
`/admin/login` and sign in with the admin from the DB import
(`admin@shrikrishnaengineering.in` / `Admin@12345`) — then change the password
in **Admin → Profile & Settings**.

---

## Updating the site later

1. On your PC: make changes → `npm run build:cpanel`.
2. Zip `.next/standalone/` contents and upload, **but keep the existing
   `public/uploads` folder** on the server (that holds admin-uploaded images and
   is not part of the build). Easiest: upload everything **except** `public/uploads`,
   or back it up first and restore it after.
3. cPanel → Setup Node.js App → **Restart**.

## Notes & troubleshooting

- **Uploads work** here (unlike Vercel/Netlify): cPanel disk is persistent, so
  admin-uploaded files in `public/uploads` stay. Make sure that folder is
  writable (File Manager → Permissions → 755).
- **App won't start / 503:** check the app's log in the Node.js App screen. Most
  often it is a wrong `DATABASE_URL` (name/user/password prefix) or a missing env
  var.
- **Port:** don't set one — cPanel/Passenger assigns it and the server reads it
  automatically.
- **Only run `npm run db:seed` never on the server** — the DB import already has
  the content; the seed would wipe it.
- If the build is heavy for your PC, you can instead upload the **full project**
  and run `npm ci && npm run build:cpanel` from cPanel's **Terminal**, then point
  the app at `ske-app/.next/standalone/server.js` — but the PC-build-and-upload
  route above is simpler and lighter on the server.
