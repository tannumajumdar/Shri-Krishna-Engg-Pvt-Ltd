/**
 * Finishes the `next build --output=standalone` bundle so it can run entirely
 * on its own (e.g. cPanel "Setup Node.js App", where only the standalone folder
 * is uploaded — the project's root node_modules is NOT there).
 *
 * Next's file-tracer copies most things, but it cannot follow the MySQL
 * driver's dynamic requires, so mysql2 and parts of its dependency tree get
 * left out. This script:
 *   1. copies  .next/static  and  public  into the standalone folder
 *      (Next never copies these two — documented behaviour),
 *   2. copies mysql2 + @prisma/adapter-mariadb and their FULL dependency trees
 *      into .next/standalone/node_modules.
 *
 * Run automatically by `npm run build:cpanel`.
 */
import { cpSync, existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const NM = join(root, "node_modules");
const OUT = join(root, ".next", "standalone");
const OUT_NM = join(OUT, "node_modules");

if (!existsSync(join(OUT, "server.js"))) {
  console.error("✗ .next/standalone/server.js not found — run `next build` first.");
  process.exit(1);
}

/* 1) static assets Next does not copy */
cpSync(join(root, ".next", "static"), join(OUT, ".next", "static"), { recursive: true });
console.log("✓ copied .next/static");
if (existsSync(join(root, "public"))) {
  cpSync(join(root, "public"), join(OUT, "public"), { recursive: true });
  console.log("✓ copied public");
}

/* 2) copy a package + its whole dependency tree from the flat root node_modules */
const done = new Set();
let copied = 0;

function pkgDir(name) {
  const d = join(NM, ...name.split("/"));
  return existsSync(d) ? d : null;
}

function copyTree(name) {
  if (done.has(name)) return;
  done.add(name);

  const src = pkgDir(name);
  if (!src) return; // built-in or already-hoisted-elsewhere; skip quietly

  const dest = join(OUT_NM, ...name.split("/"));
  if (!existsSync(dest)) {
    mkdirSync(join(dest, ".."), { recursive: true });
    cpSync(src, dest, { recursive: true });
    copied++;
  }

  try {
    const pj = JSON.parse(readFileSync(join(src, "package.json"), "utf8"));
    for (const dep of Object.keys(pj.dependencies || {})) copyTree(dep);
    // optionalDependencies (e.g. mysql2 → aws-ssl-profiles on some setups)
    for (const dep of Object.keys(pj.optionalDependencies || {})) copyTree(dep);
  } catch {
    /* ignore unreadable package.json */
  }
}

for (const entry of ["mysql2", "@prisma/adapter-mariadb"]) copyTree(entry);
console.log(`✓ bundled driver packages (${copied} new package folders)`);
console.log("✓ standalone bundle is self-contained → .next/standalone");
