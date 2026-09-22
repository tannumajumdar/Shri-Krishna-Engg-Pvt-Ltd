/**
 * Drop the real project photography into the site's image slots.
 *
 * Every placeholder is replaced in place, keeping its filename. That matters:
 * the media, product and industry records in the database point at these exact
 * paths, so swapping the file behind the path updates the live site with no
 * code change and no admin edit.
 *
 * Two rules decide the mapping:
 *
 *  - **Never upscale.** The source frames run from 560px to 1600px wide.
 *    Stretching a 576px photograph to 1920 does not add detail, it only makes
 *    it soft, so each file is written at its own native width, capped at 1920.
 *  - **Resolution follows display size.** The six capability covers are the
 *    full-bleed hero backgrounds, so they take the largest frames; the 3:4
 *    industry cards render around 210px, so the portrait frames go there.
 *
 *   node scripts/place-project-photos.mjs
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const SRC = "C:/Users/tannu/AppData/Local/Temp/ske-proj-src";
const PUB = path.join(process.cwd(), "public", "media");
const MAX = 1920;

/* [source photo, destination, what it shows] */
const PLAN = [
  /* capability covers — these are the hero backgrounds, so the widest,
     highest-resolution frames land here */
  [ 8, "services/mechanical-01.jpg",      "plant gallery interior — mechanical services"],
  [ 7, "services/fabrication-01.jpg",     "fabricated railings in the shop"],
  [21, "services/erection-01.jpg",        "silo cone under erection"],
  [18, "services/civil-01.jpg",           "concrete pour, crew on the floor"],
  [ 4, "services/transport-01.jpg",       "tank sections on a trailer"],
  [11, "services/om-01.jpg",              "conveyor guarding, plant yard"],

  /* wide bands */
  [17, "cta.jpg",                         "rebar mesh, crew at work"],
  [16, "hero-poster.jpg",                 "shed with civil foundations"],
  [13, "industry-poster.jpg",             "pipe rack & conveyor bridge"],
  [15, "products-poster.jpg",             "access floor framework"],
  [10, "quality-poster.jpg",              "pipe gallery overhead"],

  /* industry cards are 3:4, so the portrait frames go here */
  [24, "industries/electrical.jpg",       "silo tower — Aluminium & Metals"],
  [19, "industries/construction.jpg",     "duct lift — Steel & Heavy Engineering"],
  [ 3, "industries/manufacturing.jpg",    "dust collector plant — Manufacturing"],
  [ 1, "industries/power.jpg",            "tower erection at dusk — Power & Energy"],
  [ 2, "industries/automotive.jpg",       "pipeline in trench — Mining & Minerals"],
  [12, "industries/infrastructure.jpg",   "structural tower — Industrial Infrastructure"],

  /* featured projects (01–04) then the infrastructure marquee */
  [20, "infrastructure/facility-01.jpg",  "tank & hopper fabrication"],
  [ 6, "infrastructure/facility-02.jpg",  "silo erection"],
  [ 5, "infrastructure/facility-03.jpg",  "EOT crane maintenance"],
  [23, "infrastructure/facility-04.jpg",  "control room handover"],
  [ 9, "infrastructure/facility-05.jpg",  "barricade fabrication & painting"],
  [14, "infrastructure/facility-06.jpg",  "raised access flooring"],
  [22, "infrastructure/facility-07.jpg",  "temple hall, civil & finishing"],
];

const files = fs.readdirSync(SRC).sort();
const pick = (n) => path.join(SRC, files[n - 1]);

/** Width/height straight out of the JPEG header, to report the native size. */
function jpegSize(file) {
  const buf = fs.readFileSync(file);
  let i = 2;
  while (i < buf.length) {
    if (buf[i] !== 0xff) { i++; continue; }
    const m = buf[i + 1];
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc)
      return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
    i += 2 + buf.readUInt16BE(i + 2);
  }
  return { w: 0, h: 0 };
}

let bytes = 0;
for (const [n, dest, what] of PLAN) {
  const src = pick(n);
  const { w, h } = jpegSize(src);
  const out = path.join(PUB, dest);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  execFileSync(ffmpeg, [
    "-y", "-i", src,
    // min(iw, MAX) — downscale when the frame is bigger, otherwise leave it be
    "-vf", `scale=w='min(iw,${MAX})':h=-2:flags=lanczos`,
    "-q:v", "3",
    "-map_metadata", "-1",
    out,
  ], { stdio: ["ignore", "ignore", "pipe"] });
  const o = jpegSize(out);
  const size = fs.statSync(out).size;
  bytes += size;
  console.log(
    `p${String(n).padStart(2, "0")} ${String(w + "x" + h).padStart(9)} -> ` +
    `${String(o.w + "x" + o.h).padStart(9)}  ${dest.padEnd(34)} ` +
    `${(size / 1024).toFixed(0).padStart(4)} KB  ${what}`,
  );
}
console.log(`\n${PLAN.length} photographs placed, ${(bytes / 1048576).toFixed(2)} MB total — none upscaled`);
