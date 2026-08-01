# contact-sheet

    node tools/contact-sheet.mjs                       # 3 clips x 6 views x 3 phases
    node tools/contact-sheet.mjs --mode all --clip run # + the sockets and trails overlays
    node tools/contact-sheet.mjs --out tools/out/after --diff tools/out/before
    node tools/contact-sheet.mjs --help

Renders the turntable from every camera preset at several phases of every clip
and lays the frames out as one PNG per clip, with the axis compass in each tile
and the view, clip and time burnt into a caption strip above it.

## Why

The retrospective's finding was that the two worst bugs in this character both
survived review, and both survived for the same reason: the goblin was only ever
judged from one whole-body render, at one angle, at one moment, of one clip.

- The world scrolled toward the runner for the entire first version. A still
  frame of a symmetrical stage does not say which way is +Z, so no screenshot
  could have caught it.
- The cleaver sat 104.7° off the hand's grip axis. A fist and a handle overlap
  in silhouette from almost every angle, so from the one angle anybody looked
  at, it looked held.

A render is a sample of size one out of `view x clip x phase x overlay`, and
both bugs happened to be invisible at the sample that got taken. So take the
grid, and put the labels in the pixels: a tile that cannot be misattributed is a
tile you can argue about.

## What comes out

    <out>/
      run-plain.png        one sheet per clip x mode
      run-sockets.png
      run-trails.png
      tiles/               every tile at capture resolution, one PNG each
      diff/                heatmaps, only for tiles a --diff flagged
      manifest.json        every caption, the socket errors, the floor sweep,
                           the measured noise floor, console errors

The **sheet** is for reading at a glance; the **tiles** are what you open when
you want to read the compass text or count polygons. `--scale` only affects the
sheet — tiles are always saved at full capture resolution.

## Modes

| mode | default views | answers |
| --- | --- | --- |
| `plain` | all six | is the figure right |
| `sockets` | hands, q34, front | is the kit actually *in* his hand |
| `trails` | left, q34, back | which way do the feet actually go |

`sockets` and `trails` have narrower default view lists because a socket triad
on a knuckle is unreadable from BACK at 2.55 m, and a world-space foot trail
viewed down its own axis from FRONT is a dot. `--views` overrides all of them.

`sockets` also burns the live `socketError` numbers into the bottom of each
tile, green under 1°/1 mm and red over. `trails` plays the clip for
`--trail-frames` frames, freezes it, and then orbits the frozen path, because
the scrub handler clears the trails by design — a trail assembled from scrubbed
frames would be a lie about how the foot moved.

## Known: the scrub slider does not work, and this tool shims it

`AnimationMixer.setTime(t)` zeroes every action's time and then calls
`update(t)`, and `update` opens with `deltaTime *= this.timeScale`.
`turntable/main.js` sets `mixer.timeScale = 0` while paused, so from the second
paused frame onward `setTime` means "rewind to 0, then advance by 0" and the
figure is pinned to frame 0 of the clip wherever the slider is. Measured: the
run action's `time` reads `0.000` at scrub 20%, 55% and 85%.

The tool probes for this before capturing anything, and if it finds it, patches
`mixer.setTime` to force `timeScale = 1` for the duration of the call. It then
re-probes (`0.112 / 0.308 / 0.476`) and refuses to continue if the patch did not
take, because a sheet of identical columns confidently captioned 0% / 33% / 67%
is exactly the failure this tool exists to prevent.

Every sheet produced with the shim active says so in red across the header.
When `turntable/main.js` is fixed, the probe will pass, the shim will not be
installed, and the banner will disappear on its own.

## `--diff`, and what "no difference" means

`--diff <baselineDir>` captures a fresh set and compares it tile by tile against
a previous run's `tiles/`, then prints the biggest movers and writes an
amplified heatmap for each flagged tile.

Two captures of the *same* state are not identical. The cape and strap solver
runs on wall-clock delta with a time-varying wind and never reaches a fixed
point, paused or not — settling for 24 frames instead of 3 does not help,
because there is nothing to settle to. So the tool measures the floor instead of
assuming one: while capturing, it takes one extra grab of an
already-captured state per distinct view, and reports that as that view's noise.

Typical, at the default 800x560:

    q34 0.71   front 0.39   left 0.41   back 0.36   head 4.29   hands 0.82

in mean absolute delta out of 255. `head` is an order of magnitude noisier than
the rest and it is not broken: at 0.62 m a hair strand moving half a millimetre
moves a sixth of the frame. A single global threshold flags HEAD on every run,
which is how people learn to stop reading a diff table. Each tile is therefore
judged against its own view's floor, and the table is ranked by `xFLOOR` rather
than by raw delta.

A recapture of an unchanged build lands at 1.4–2.7x floor across every tile. A
real change is not subtle by comparison: substituting one phase's tile for
another's in the baseline reads 5.9x, and substituting a different view's tile
reads 21.3x.

`--diff-only` compares tiles already in `--out` without recapturing.
`--from-tiles` re-lays-out the sheets from those tiles — a layout fix takes 1.4 s
instead of 80.

## How it runs, and why it is slow

Against `vite build` + `vite preview`, never the dev server: HMR reloading the
page mid-capture has already corrupted one debugging session, and half a sheet
from each of two builds is worse than no sheet.

This container has no GPU. Chromium rasterises in software at roughly 300 ms a
frame at 800x560, of which about 230 ms is fixed CPU cost — the verlet solver
and the skinning, which do not care how many pixels you asked for. That sets the
whole budget, so the tool is built around spending as few frames as possible:

- Tiles are grabbed from inside a `requestAnimationFrame` on the page, not with
  `page.screenshot`. The app re-registers its own loop at the top of its
  callback, so a callback registered now runs after this frame's render with the
  drawing buffer still intact. Playwright's screenshot path costs about two
  extra frames; this costs zero. The compass is a second canvas and is
  composited in at the position and size it occupies on screen.
- Pointing the camera, waiting the frame, grabbing the pixels and reading the
  caption are one `page.evaluate`, not four. Each round trip blocks on the frame
  already in flight, so four of them cost most of a second per tile in pure
  waiting.
- Overlays are toggled without disturbing the solver, so `plain` and `sockets`
  tiles for a phase share one settle.

Measured: default (3 clips x 6 views x 3 phases, 54 tiles) about 2 minutes;
`--mode all --clip run` (30 tiles) about 80 s. `--phases 2` or
`--size 640x450` roughly halves either.

There is no `sharp` in this monorepo and adding a native image dependency to lay
out a debug PNG is a bad trade, so the compositing and the diffing both run on a
2D canvas in a blank tab of the same Chromium. No new dependencies.

## Reading a sheet

- **Header** — clip, mode, grid shape, the deepest either foot reached over
  `SWEEP_FRAMES` frames of real playback (red below −2 mm), and the shim banner
  if the shim is active.
- **Caption strip** — the view preset as its button spells it, the clip, and the
  time in seconds and as a percentage of the clip.
- **Compass, bottom right of every tile** — drawn by the turntable itself, not
  by this tool. Spoke length is the honest projected length, a filled tip is
  coming toward you, and the four lines underneath spell out where FORWARD,
  LEFT and UP land on screen. At `--scale 0.6` the dial reads but its text does
  not; open the tile in `tiles/`, or pass `--scale 1`.
