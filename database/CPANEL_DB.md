# Setting up the database in cPanel

This adds the website's database to a **cPanel** host and connects the app to
it. You only do the import once.

Files you need (both in this repo):
- `database/ske_database.sql` — the full database (tables + starting content).
- `.env.cpanel.example` — the connection string template.

---

## Step 1 — Create the database and user (cPanel)

1. Log in to **cPanel** → **Databases** → **MySQL® Databases**.
2. Under **Create New Database**, type a name, e.g. `ske`, and click **Create
   Database**.
   - cPanel saves it as `youruser_ske` (it adds your account prefix). **Note
     the full name.**
3. Scroll to **MySQL Users → Add New User**. Create a user, e.g. `skeuser`, with
   a **strong password**. (Saved as `youruser_skeuser`.)
4. Under **Add User To Database**, pick the user and the database → **Add** →
   tick **ALL PRIVILEGES** → **Make Changes**.

Write down: **DB name**, **DB user**, **DB password** — you need them in Step 3.

## Step 2 — Import the data (phpMyAdmin)

1. cPanel → **Databases** → **phpMyAdmin**.
2. In the left sidebar, click your database (`youruser_ske`).
3. Open the **Import** tab → **Choose File** → select
   **`database/ske_database.sql`** → scroll down → **Import**.
4. You should see "Import has been successfully finished". The left sidebar now
   shows the tables (`admins`, `products`, `product_categories`, `media`, …).

That's it — the database is live with the starting content and the admin login.

> The admin login shipped in the import is
> `admin@shrikrishnaengineering.in` / `Admin@12345`.
> **Change the password after first login** (Admin → Profile & Settings), or set
> a new one and re-run the seed if you prefer.

## Step 3 — Point the app at this database

Edit your app's `.env` (see `.env.cpanel.example`). Use the values from Step 1:

```env
DATABASE_URL="mysql://youruser_skeuser:YOUR_PASSWORD@localhost:3306/youruser_ske"
```

- **If the app runs on the same cPanel** (via cPanel → "Setup Node.js App"):
  host is **`localhost`** (as above).
- **If the app runs somewhere else** (VPS / Vercel / Railway) and only the DB is
  on cPanel: first enable cPanel → **Remote MySQL** and add the app server's IP
  to the allowed hosts, then use the **cPanel server hostname/IP** instead of
  `localhost`:
  ```env
  DATABASE_URL="mysql://youruser_skeuser:YOUR_PASSWORD@your-server-host:3306/youruser_ske"
  ```

If the password has special characters (`@ : / # ? & % +` or a space),
URL-encode them (e.g. `@` → `%40`, `#` → `%23`).

## Step 4 — Run the app

The app talks to MySQL through Prisma's driver adapter, which is already wired to
read `DATABASE_URL`. Nothing else to configure.

```bash
npm ci
npm run build
npm run start      # or: pm2 start ecosystem.config.js
```

Open the site, then `/admin/login` — sign in with the admin above.

> Do **not** run `npm run db:seed` after importing — the SQL already contains the
> content, and the seed would wipe and replace it. Only run migrations
> (`npm run migrate:deploy`) if you later change the Prisma schema.

---

## Updating the export later

Whenever you want a fresh copy of the current local database to re-import, this
repo can regenerate `database/ske_database.sql`. Ask for a re-export, or run the
same dump step used to create it.

## Compatibility notes

- Needs **MySQL 5.7+** or **MariaDB 10.2+** (all current cPanel hosts qualify).
  The schema uses `JSON`, `ENUM`, and `datetime(3)` columns — supported on both.
- The file is `utf8mb4`, so names and symbols import correctly.
- Foreign-key checks are turned off during import and back on at the end, so the
  table order in the file does not matter.

## Important — will the app run on cPanel at all?

A standard cPanel **shared "Web Hosting"** plan usually **cannot run** a Next.js
server (no persistent Node process). If your cPanel has **"Setup Node.js App"**
(many Hostinger/LiteSpeed cPanels do), it can — point that app at this DB. If it
does not, host the app on a **VPS or Railway** (see `DEPLOY.md`) and keep only
the **database** on cPanel using **Case B / Remote MySQL** above.
