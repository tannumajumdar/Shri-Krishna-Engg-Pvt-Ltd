# Media credits

All placeholder photography and footage in this folder came from
[Pexels](https://www.pexels.com), under the
[Pexels licence](https://www.pexels.com/license/): free to use, including
commercially, with no attribution required and no permission needed. This file
exists as a record of provenance, not because attribution is owed.

Each item can be viewed at `https://www.pexels.com/photo/<id>/` (or
`/video/<id>/` for the five clips).

> These are stock images of other companies' plants. They are placeholders.
> Replace them with photography of the BALCO works before presenting the site
> as a record of your own facility — overwrite in place, keep the filename.

## Video

| File | Pexels ID | Subject | Size |
| --- | --- | --- | --- |
| `hero-video.mp4` | 6997856 | Furnace sparks | 2.9 MB |
| `products-video.mp4` | 18896576 | Aluminium profiles on the line | 2.8 MB |
| `industry-video.mp4` | 6997690 | Heavy industry, workers on the floor | 5.7 MB |
| `quality-video.mp4` | 6579400 | Machine cutting a metal pipe | 3.9 MB |
| `cta-video.mp4` | 12183843 | Cloud timelapse over an industrial plant | 3.1 MB |

All five are 1920×1080 H.264. Larger renditions were available and were
deliberately not used — the 4K source of the hero clip alone was 32 MB, which
is not a background video, it is a download.

They still carry their original audio tracks. The player mutes them, so this
costs a little file size and nothing else; strip the tracks with
`ffmpeg -i in.mp4 -an -c:v copy out.mp4` if you want the bytes back.

## Posters

| File | Pexels ID | Subject |
| --- | --- | --- |
| `hero-poster.jpg` | 36398099 | Molten steel pouring at night |
| `products-poster.jpg` | 19825178 | Bars, tubes and profiles on shelves |
| `industry-poster.jpg` | 37502061 | Metalworkers at a furnace |
| `quality-poster.jpg` | 36003973 | Micrometer measuring sheet thickness |
| `cta.jpg` | 36915547 | Industrial structure against open sky |

Posters are matched to their clip by subject and mood, not frame-accurately —
there was no `ffmpeg` available to pull an actual first frame. If a swap ever
looks abrupt, export frame 1 of the clip over the poster.

## Admin

| File | Pexels ID | Subject |
| --- | --- | --- |
| `admin/login-bg.jpg` | 36398099 | Molten steel pouring at night — admin login backdrop |

## Stills

| File | Pexels ID | Subject |
| --- | --- | --- |
| `about.jpg` | 10031804 | Factory interior, overhead cranes |
| `about-secondary.jpg` | 36003961 | Digital caliper on a steel beam |

## Products

Named by category. Eight of these are the original stills, re-filed under the
category naming; the rest were added when the catalogue was grouped by process.

### Extruded Products

| File | Pexels ID | Subject |
| --- | --- | --- |
| `products/extruded-01.jpg` | 14838208 | Stacked pipes and rods |
| `products/extruded-02.jpg` | 30728904 | Anodised blue aluminium shutters |
| `products/extruded-03.jpg` | 36397982 | Stacked structural beams |
| `products/extruded-04.jpg` | 35407110 | Architectural facade, vertical fins |
| `products/extruded-05.jpg` | 28101196 | Heat sink profile |
| `products/extruded-06.jpg` | 27312811 | Stacked tube profiles |

### Cast & Machined

| File | Pexels ID | Subject |
| --- | --- | --- |
| `products/cast-01.jpg` | 6804260 | Ladle pouring molten metal |
| `products/cast-02.jpg` | 7505186 | Pouring into moulds |
| `products/cast-03.jpg` | 28752153 | Machined components |
| `products/cast-04.jpg` | 8865189 | Precision milling |
| `products/cast-05.jpg` | 12951633 | Machined rings and housings |

### Sheet & Coil

| File | Pexels ID | Subject |
| --- | --- | --- |
| `products/sheet-01.jpg` | 2271100 | Cold-rolled sheet surface |
| `products/sheet-02.jpg` | 8940223 | Coil in a warehouse |
| `products/sheet-03.jpg` | 11687360 | Treadplate |
| `products/sheet-04.jpg` | 10727957 | Cladding panels |

### Fabricated Assemblies

| File | Pexels ID | Subject |
| --- | --- | --- |
| `products/fabricated-01.jpg` | 27757293 | Welding in a factory |
| `products/fabricated-02.jpg` | 12110409 | Bolted platforms and pipework |
| `products/fabricated-03.jpg` | 33706880 | Cabinet and enclosure line-up |
| `products/fabricated-04.jpg` | 9729566 | Measuring aluminium |
| `products/fabricated-05.jpg` | 34675450 | Walkway and handrail |

### Electrical & Conductors

| File | Pexels ID | Subject |
| --- | --- | --- |
| `products/electrical-01.jpg` | 36137506 | Substation conductors |
| `products/electrical-02.jpg` | 37041882 | Conductor sections on towers |
| `products/electrical-03.jpg` | 35573433 | Switchgear panel |
| `products/electrical-04.jpg` | 8442025 | Bonding connectors |

Weakest match of the set is `extruded-02` — domestic-looking shutters standing
in for anodised profile. Worth replacing first if you shoot your own.

## Industries

| File | Pexels ID | Subject |
| --- | --- | --- |
| `industries/power.jpg` | 18468536 | High-voltage substation at dawn |
| `industries/infrastructure.jpg` | 14668116 | Steel bridge girders |
| `industries/construction.jpg` | 8960939 | Bridge under construction |
| `industries/manufacturing.jpg` | 34221997 | Manufacturing facility |
| `industries/automotive.jpg` | 19233057 | Robots assembling a car |
| `industries/electrical.jpg` | 7867328 | Transformers at a power station |

## Infrastructure gallery

| File | Pexels ID | Subject |
| --- | --- | --- |
| `infrastructure/facility-01.jpg` | 27102103 | Large fabrication machine |
| `infrastructure/facility-02.jpg` | 8865187 | CNC machine in action |
| `infrastructure/facility-03.jpg` | 8803230 | Casting in a steel mill |
| `infrastructure/facility-04.jpg` | 36878027 | Warehouse, stacked pipes |
| `infrastructure/facility-05.jpg` | 15947586 | Welding workshop |
| `infrastructure/facility-06.jpg` | 36003974 | Caliper measurement |
| `infrastructure/facility-07.jpg` | 28929510 | Industrial CNC lathe |
| `infrastructure/facility-08.jpg` | 36696522 | Warehouse forklifts |
| `infrastructure/facility-09.jpg` | 36398133 | Furnace flames |
| `infrastructure/facility-10.jpg` | 17363180 | Finished metal panels |

The gallery tiles declare an aspect ratio in `lib/site.ts` (`portrait`,
`square`, `landscape`, `wide`). Each file above was chosen to suit the ratio
its slot uses; if you swap one for a differently shaped photo, adjust the
`ratio` on that entry so the crop stays sensible.
