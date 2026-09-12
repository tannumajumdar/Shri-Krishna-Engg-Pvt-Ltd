/**
 * Re-encode the background videos in public/media for smooth playback.
 *
 * The source clips ship as 1080p at ~5 Mbps, which is far more than a muted
 * loop sitting behind a 60–75% navy overlay needs. Every one of those bits has
 * to arrive over the wire and go through the decoder, and on a phone that is
 * exactly where the stutter comes from.
 *
 * For each `<name>.mp4` this writes:
 *   <name>.mp4         720p,  CRF 27  — desktop / tablet
 *   <name>-mobile.mp4  480p,  CRF 30  — phones (picked by a <source media>)
 *
 * Both are H.264 baseline-friendly, capped at 30 fps, audio stripped (the
 * player is always muted), 2-second GOP so loop restarts and seeks are cheap,
 * and +faststart so the moov atom is read before the first byte of video.
 *
 * Originals are kept in git; run `git checkout public/media` to get them back.
 *
 *   node scripts/optimize-videos.mjs          # encode
 *   node scripts/optimize-videos.mjs --dry    # just print what it would do
 */

import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import ffmpeg from "ffmpeg-static";

const MEDIA_DIR = path.join(process.cwd(), "public", "media");
const DRY = process.argv.includes("--dry");

const VARIANTS = [
  { suffix: "", height: 720, crf: 27, maxrate: "1600k", bufsize: "3200k" },
  { suffix: "-mobile", height: 480, crf: 30, maxrate: "900k", bufsize: "1800k" },
];

function encode(input, output, { height, crf, maxrate, bufsize }) {
  const args = [
    "-y",
    "-i", input,
    "-an",
    "-map_metadata", "-1",
    "-vf", `scale=-2:${height}:flags=lanczos,fps=30`,
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.0",
    "-preset", "slow",
    "-crf", String(crf),
    "-maxrate", maxrate,
    "-bufsize", bufsize,
    "-g", "60",
    "-keyint_min", "30",
    "-sc_threshold", "0",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    output,
  ];
  if (DRY) {
    console.log(`  ${path.basename(output)}  <-  ffmpeg ${args.join(" ")}`);
    return;
  }
  execFileSync(ffmpeg, args, { stdio: ["ignore", "ignore", "pipe"] });
}

const mb = (p) => (fs.statSync(p).size / 1048576).toFixed(2);

const sources = fs
  .readdirSync(MEDIA_DIR)
  .filter((f) => f.endsWith(".mp4") && !f.endsWith("-mobile.mp4"));

if (!sources.length) {
  console.error(`No .mp4 files in ${MEDIA_DIR}`);
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(process.cwd(), ".video-opt-"));
let before = 0;
let after = 0;

try {
  for (const name of sources) {
    const input = path.join(MEDIA_DIR, name);
    const stem = name.replace(/\.mp4$/i, "");
    console.log(`${name}  (${mb(input)} MB)`);
    before += fs.statSync(input).size;

    // Encode into a scratch dir first, so a failure never leaves a half
    // written file where the site expects a playable one.
    const staged = [];
    for (const variant of VARIANTS) {
      const out = path.join(tmp, `${stem}${variant.suffix}.mp4`);
      encode(input, out, variant);
      if (!DRY) staged.push([out, path.join(MEDIA_DIR, `${stem}${variant.suffix}.mp4`)]);
    }

    for (const [from, to] of staged) {
      fs.copyFileSync(from, to);
      after += fs.statSync(to).size;
      console.log(`  -> ${path.basename(to)}  ${mb(to)} MB`);
    }
  }
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}

if (!DRY) {
  console.log(
    `\ntotal ${(before / 1048576).toFixed(1)} MB -> ${(after / 1048576).toFixed(1)} MB ` +
      `(both variants combined)`,
  );
}
