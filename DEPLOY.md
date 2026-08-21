# Deploying to a VPS (app + MySQL on one server)

This guide puts the Next.js app **and** MySQL on a single Ubuntu VPS behind
Nginx with a free SSL certificate. File uploads keep working because the disk is
persistent — nothing extra to configure.

Works on **Hostinger VPS, DigitalOcean, AWS Lightsail, Contabo**, or any Ubuntu
22.04+ server. Pick a region near your users — **Mumbai or Bangalore** for India.

Recommended size: **2 GB RAM** (1 GB works but the build is tight).

---

## 0. What you need

- A VPS with Ubuntu 22.04+ and its IP address
- Your domain (e.g. `shrikrishnaengineering.in`) with DNS pointing an **A
  record** to the VPS IP
- The GitHub repo (already set up):
  `https://github.com/tannumajumdar/Shri-Krishna-Engg-Pvt-Ltd.git`

Everything below runs **on the server** over SSH: `ssh root@YOUR_SERVER_IP`.

---

## 1. Base tools (Node 20, Git, build tools)

```bash
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs git build-essential
npm install -g pm2
node -v      # should print v20.x
```

## 2. Install & secure MySQL

```bash
apt install -y mysql-server
systemctl enable --now mysql
mysql_secure_installation      # set a root password, answer Y to the rest
```

Create the database and a dedicated app user (NOT root):

```bash
mysql -u root -p
```
```sql
CREATE DATABASE ske_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'ske_user'@'localhost' IDENTIFIED BY 'CHOOSE_A_STRONG_PASSWORD';
GRANT ALL PRIVILEGES ON ske_db.* TO 'ske_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

> Keep MySQL bound to `localhost` (the default). The app talks to it locally, so
> the database is never exposed to the internet.

## 3. Get the code

```bash
mkdir -p /var/www && cd /var/www
git clone https://github.com/tannumajumdar/Shri-Krishna-Engg-Pvt-Ltd.git ske
cd ske
npm ci        # clean install from package-lock (runs prisma generate too)
```

## 4. Production environment

Create `.env` **on the server** (never commit it):

```bash
nano /var/www/ske/.env
```

```env
# app user, strong password, local MySQL
DATABASE_URL="mysql://ske_user:CHOOSE_A_STRONG_PASSWORD@127.0.0.1:3306/ske_db"

# generate a fresh one — see command below
JWT_SECRET="PASTE_A_LONG_RANDOM_STRING"
JWT_EXPIRES_IN="7d"

# your real admin login
ADMIN_EMAIL="admin@shrikrishnaengineering.in"
ADMIN_PASSWORD="A_STRONG_ADMIN_PASSWORD"
ADMIN_NAME="SKE Administrator"

UPLOAD_DIR="public/uploads"
MAX_UPLOAD_MB="50"

NODE_ENV="production"
```

Generate the JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## 5. Migrate, seed, build

```bash
cd /var/www/ske
npm run migrate:deploy    # applies prisma/migrations to the production DB
npm run db:seed           # creates the admin + initial content (run ONCE)
npm run build             # production build
```

> `migrate:deploy` (not `migrate dev`) is the production-safe command — it only
> applies existing migrations, never generates new ones or touches data.

## 6. Start with PM2 (stays up, restarts on reboot)

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup systemd        # run the command it prints back to you
```

The app is now running on `http://127.0.0.1:3000`. Check it:
```bash
pm2 status
curl -I http://127.0.0.1:3000
```

## 7. Nginx reverse proxy

```bash
apt install -y nginx
nano /etc/nginx/sites-available/ske
```

```nginx
server {
    listen 80;
    server_name shrikrishnaengineering.in www.shrikrishnaengineering.in;

    # allow admin video/image uploads up to the app limit
    client_max_body_size 60M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/ske /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

Now `http://shrikrishnaengineering.in` should load the site.

## 8. Free SSL (HTTPS)

```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d shrikrishnaengineering.in -d www.shrikrishnaengineering.in
```

Certbot edits Nginx for you and auto-renews. Site is now on **https://**.

> `secure` cookies switch on automatically because `NODE_ENV=production` — the
> admin session cookie is only sent over HTTPS.

## 9. Firewall

```bash
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable
```

Port 3306 (MySQL) stays closed to the outside — good.

---

## Done. Test the live site

- **Website:** `https://shrikrishnaengineering.in`
- **Admin:** `https://shrikrishnaengineering.in/admin`
  (login with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` you set in `.env`)

Upload an image in the admin → it saves to `/var/www/ske/public/uploads` on the
server's disk and shows on the site. Because the disk is persistent, it stays
there across restarts and deploys.

---

## Pushing updates later

When you change code and push to GitHub:

```bash
cd /var/www/ske
git pull
npm ci
npm run migrate:deploy   # only if you added a migration
npm run build
pm2 reload ske-web       # zero-downtime restart
```

`public/uploads` is gitignored, so `git pull` never deletes uploaded media.

---

## Backups (do this — 5 minutes now saves you later)

A nightly MySQL dump:

```bash
mkdir -p /var/backups/ske
crontab -e
```
Add:
```cron
0 2 * * * mysqldump -u ske_user -p'CHOOSE_A_STRONG_PASSWORD' ske_db | gzip > /var/backups/ske/ske_db_$(date +\%F).sql.gz
0 3 * * * find /var/backups/ske -name '*.sql.gz' -mtime +14 -delete
```

Also back up `public/uploads` periodically (rsync to another location or object
storage) — those files are not in git.

---

## Security checklist before going live

- [ ] MySQL app user is `ske_user`, **not root**, with a strong password
- [ ] `JWT_SECRET` regenerated (not the dev value)
- [ ] `ADMIN_PASSWORD` changed from `Admin@12345`
- [ ] `.env` exists only on the server, never in git
- [ ] HTTPS working (certbot) — session cookies need it
- [ ] `ufw` firewall on; MySQL not exposed publicly
- [ ] Nightly DB backup cron in place

---

## Quick reference

| Task | Command |
| --- | --- |
| App logs | `pm2 logs ske-web` |
| Restart app | `pm2 reload ske-web` |
| App status | `pm2 status` |
| MySQL shell | `mysql -u ske_user -p ske_db` |
| Re-seed content | `npm run db:seed` (⚠ wipes content tables, keeps admin) |
| Nginx reload | `systemctl reload nginx` |

---

# Hostinger-specific notes

## ⚠ Buy the right product: **VPS**, not "Web Hosting"

Hostinger sells two very different things:

- **Web Hosting / Cloud Hosting** (hPanel, cPanel-style) — **won't work** for this
  app. No root SSH, no PM2, can't run a persistent Next.js server.
- **VPS Hosting** (KVM plans) — **this is what you need.** Full Ubuntu server,
  root SSH, persistent disk.

Buy from: hPanel → **VPS** → choose a **KVM** plan.

| Plan | Specs | Good for |
| --- | --- | --- |
| KVM 1 | 1 vCPU, 4 GB RAM | Works — fine for this site |
| **KVM 2** | 2 vCPU, 8 GB RAM | **Recommended** — builds are comfortable |

During setup choose:
- **OS template:** plain **Ubuntu 24.04** (or 22.04). *Do not* pick a template
  with a control panel (CyberPanel/CWP) — you don't need one and it conflicts
  with the Nginx setup below.
- **Location:** **India (Mumbai)** — fastest for your users.

## Getting into the server

hPanel → VPS → your server → you'll see the **IP address** and a **root
password** (set one if asked). Two ways to run commands:

- **Browser terminal:** hPanel → VPS → **Browser terminal** (easiest, nothing to
  install).
- **SSH from your PC:** `ssh root@YOUR_VPS_IP` then enter the root password.

Once you're at the `root@server:~#` prompt, follow **Steps 1–9** above exactly.

## DNS (if your domain is with Hostinger)

hPanel → **Domains** → your domain → **DNS / Nameservers** → **DNS Zone**:

- Add/edit an **A record**: name `@` → value = your **VPS IP**
- Add an **A record**: name `www` → value = your **VPS IP**

Wait ~15–30 min for DNS to propagate, then do Step 8 (SSL). If the domain is
registered elsewhere, point its A records to the VPS IP there instead.

## Firewall

Hostinger has a firewall panel (hPanel → VPS → **Firewall**), but the `ufw`
setup in Step 9 already handles it from inside the server. If you also use
Hostinger's panel firewall, allow ports **22 (SSH), 80 (HTTP), 443 (HTTPS)** and
block the rest.

## Kodee (Hostinger's AI helper)

hPanel's VPS section has an AI assistant "Kodee" — handy for restarting the
server or checking status, but run the actual deploy commands yourself from the
terminal so you know exactly what's set.

## One-glance order of operations on Hostinger

1. Buy **VPS KVM 2**, OS **Ubuntu 24.04**, location **Mumbai**
2. hPanel → VPS → note **IP**, set **root password**
3. Point domain **A records** (`@` and `www`) to the VPS IP
4. Open **Browser terminal** → run Steps 1–9 from this guide
5. Run **certbot** (Step 8) once DNS has propagated → HTTPS live

---

# Alternative: Deploying on Railway

Easier than a VPS — no server admin, automatic HTTPS, and it redeploys every
time you `git push`. Trade-offs: closest region to India is **Singapore** (not
Mumbai), cost is usage-based (~$5/month minimum, no free tier), and you **must
attach a Volume** or uploaded files vanish on redeploy.

The repo already includes `railway.json` (build + start command) and a
`start:prod` script that runs `prisma migrate deploy` automatically on every
deploy.

## Steps

1. **Push the repo to GitHub** (already connected) so Railway can read it.

2. **Create the project** — railway.app → *New Project* → *Deploy from GitHub
   repo* → pick `Shri-Krishna-Engg-Pvt-Ltd`. Railway auto-detects Next.js
   (Nixpacks) and uses `railway.json`.

3. **Add MySQL** — in the project: *+ New* → *Database* → *Add MySQL*. Railway
   provisions it and exposes a `MYSQL_URL`.

4. **⚠ Add a Volume for uploads** — click the **app service** → *Settings* →
   *Volumes* → *New Volume*, mount path:
   ```
   /app/public/uploads
   ```
   Without this, admin-uploaded images/videos are lost on every redeploy.

5. **Set environment variables** — app service → *Variables*:
   ```
   DATABASE_URL   = ${{MySQL.MYSQL_URL}}      # reference the MySQL service
   JWT_SECRET     = <run the generate command below>
   JWT_EXPIRES_IN = 7d
   ADMIN_EMAIL    = admin@shrikrishnaengineering.in
   ADMIN_PASSWORD = <a strong password>
   ADMIN_NAME     = SKE Administrator
   UPLOAD_DIR     = public/uploads
   MAX_UPLOAD_MB  = 50
   NODE_ENV       = production
   ```
   Generate the secret locally:
   ```bash
   node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
   ```
   `${{MySQL.MYSQL_URL}}` is Railway's reference-variable syntax — type it
   exactly; it links the app to the database with no hardcoded password.

6. **Deploy** — Railway builds and starts. `start:prod` applies migrations on
   boot, so the tables are created automatically. Watch the *Deploy Logs*.

7. **Seed the initial content (once)** — open the app service → *Settings* →
   run a one-off command, or via the Railway CLI:
   ```bash
   npm i -g @railway/cli
   railway login
   railway link          # pick the project
   railway run npm run db:seed
   ```
   This creates the admin and the starter content.

8. **Domain** — app service → *Settings* → *Networking* → *Generate Domain*
   (free `*.up.railway.app`) or *Custom Domain* → add
   `shrikrishnaengineering.in` and point a **CNAME** at the target Railway
   shows. HTTPS is automatic.

## Updating later

Just `git push` — Railway rebuilds and redeploys, running migrations on the way
up. Uploaded files persist on the Volume; the database persists in the MySQL
service.

## Railway vs VPS — quick call

| | Railway | VPS (Hostinger) |
| --- | --- | --- |
| Setup effort | Low (clicks) | Higher (server admin) |
| India latency | Singapore | **Mumbai** (better) |
| Uploads | needs a **Volume** | works out of the box |
| HTTPS | automatic | certbot (one command) |
| Cost | usage-based, ~$5+/mo | fixed VPS price |
| Control | managed | full root |
