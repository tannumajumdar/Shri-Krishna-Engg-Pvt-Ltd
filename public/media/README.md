# Media

Drop your files here using the exact names below and the page picks them up —
no code changes needed.

## Logo (do this first)

| File | Used by |
| --- | --- |
| `logo.svg` | Navbar once it turns solid — the full colour lockup on white |
| `logo-light.svg` | Navbar over the hero, mobile menu, footer — white knockout |

`logo-light.svg` is **not optional**. The navbar is transparent over the hero
and the footer is near-black, and the blue letterforms and navy wordmark
disappear against both. Export a version with the S, E and wordmark in white,
leaving the K in its brand lime (`#8CC63F`) — the lime holds up on dark.

Export with a tight bounding box (no baked-in padding); the header sizes the
lockup by height, so extra whitespace shrinks the artwork. PNG works too —
point `media.logo` / `media.logoLight` in `lib/site.ts` at the `.png` names.

Until both exist, the header renders a slatted SKE monogram in the brand
colours rather than a broken image. Every path is declared once in [`lib/site.ts`](../../lib/site.ts)
under `media`, `products`, `industries` and `facilities`, so renaming a file is a
one-line edit there.

Until a file exists the page renders a blueprint placeholder that names the
missing path, so the layout stays intact while you collect assets.

## Videos

| File | Used by |
| --- | --- |
| `hero-video.mp4` | Hero background |
| `industry-video.mp4` | "Built for Industry" band |
| `quality-video.mp4` | Quality / sustainability panel |

Each video needs a matching poster still — it is what shows before playback
starts, when autoplay is refused (iOS Low Power Mode), and for visitors who
have asked for reduced motion:

- `hero-poster.jpg`
- `industry-poster.jpg`
- `quality-poster.jpg`

**Encoding:** H.264 MP4, no audio track, 8–15 s seamless loop, ≤ 1920 px wide,
≤ 5 MB. Videos are muted, looped and inline, and pause while off screen.

## Images

| File | Used by |
| --- | --- |
| `about.jpg` | About — main plate (portrait, 4:5) |
| `about-secondary.jpg` | About — inset plate (square) |
| `cta.jpg` | Final call-to-action background (wide) |

### `products/`

`product-01.jpg` … `product-08.jpg` — portrait-ish, they fill a tall card.

### `industries/`

`power.jpg`, `infrastructure.jpg`, `construction.jpg`, `manufacturing.jpg`,
`automotive.jpg`, `electrical.jpg` — portrait, they fill full-height panels.

### `infrastructure/`

`facility-01.jpg` … `facility-10.jpg` — the gallery marquee. Each tile has a
declared aspect ratio in `lib/site.ts` (`portrait`, `square`, `landscape`,
`wide`); crop to roughly match so nothing important sits outside the frame.

**Encoding:** JPG or WebP, ~1600 px on the long edge, ≤ 400 KB each. Images are
lazy-loaded and cover-cropped, so keep the subject near the centre.
