# Battlefield dressing: state at hand-over

Repo: `kumavis/vibe-dump`, branch `wt/world` (worktree `/home/user/vibe-dump-wt/world`), package `packages/tails-and-scales`. The tip is `0b656695`, pushed, and the work tree is clean. `node_modules` in the worktree is an untracked symlink: never stage it. The design text is in DESIGN.md §4.3 "Battlefield dressing", and ROADMAP has its queue line. All the code is in `view/dressing/`, plus small hooks in `view/index.js`, `view/stage.js`, `view/table.js` and `app/boot.js` (`?dress=0`).

Scratch directory (all paths below are relative to it): `/tmp/claude-0/-home-user-vibe-dump/c8117bd8-3b62-5359-9239-be458d8a067b/scratchpad/world/`

## Commits (oldest first) and what each puts on screen

1. **`0f5462a7` S1, the surround and the sky.**
   - The commit's subject runs on into its first paragraph (I left out the blank line after the subject). The coordinator will deal with it at merge: never amend, rebase or force-push this branch.
   - The wooden table, frame and dark room are put away. Seeded ground runs out past the haze: fields, hedgerows and a cart track, rolling into hills, with woods and long grass.
   - A sky dome with clouds and sun glow; the horizon haze is the fog's colour.
   - The mat's edge: a trodden band, a dark cut line, a paler meadow beyond, and stakes with pennants in seat colours.
   - One seeded time of day per board (`view/dressing/sky.js`, set through `stage.daylight`).
   - `?dress=0` draws the old table exactly. The pixel gates `title-shot` and `terrain-shots` shoot with it.
2. **`a2be409f` S2, the pieces in the ground.**
   - Footprint decals painted into the mat under the scorch.
   - Debris thinning outward from 1 tail; ferns inside woods.
   - Seeded, clumped tufts and flowers.
3. **`039e2e12` Fixes to S1 and S2.**
   - Clutter is hidden under figure bases: `view/dressing/bases.js` builds the mask, and the shaders in `ground.js` read it. It also applies to the table's tufts and flowers.
   - Mat clutter stays wholly on the mat.
   - Forest floors get a ragged, soft-edged cover with a darker core and litter (`ground.js` `floorCover`), plus more undergrowth.
   - The feet of works (rampart, bastion and keep decks and stairs, stone walls) are worn: packed earth, a damp line, rubble fans, moss. Ladder feet are trodden bare.
   - The wood along one side is now 2-3 stands with gaps, from 20 tails back.
4. **`996da014` S3, the lanes.**
   - `place.js` `lanesOf`: A* on the view's own half-tail grid. Lanes form a tree spanning the objectives, plus an army road from each edge, a spur to the cart track, and a lane from each ladder foot.
   - They are painted into the mat; wear is heaviest in gaps and at ladder feet.
   - Off the mat, the roads and the spur continue in the surround (`surround.js`).
   - No clutter stands on a lane.
5. **`0b656695` S4, themes.** See "Themes as built" below.

## Frames

- **No frames were shot this round.** The Chromium lane was held for the whole round by the units stream's `input-check` runs, and the load stayed at 6.6-8.
- This means commits 3-5 have been checked in Node only and **never looked at**. Expect visual bugs: the floor cover's UV and orientation, the scale and placement of the works, the colour of the lanes.
- The frames from last round are still in `shots/`: `now-*` (before the dressing), `s1-*` and `s2-*`.

To shoot this round's frames, everything is prebuilt and queued:
- **Builds:** `distA`, `distB` and `distC` hold the package as of commits 3, 4 and 5. They were built by `node buildvar.mjs <A|B|C> <out>`, which copies the package and, for A and B, cuts it back with `strip.py`.
- **Queue:** `queue.sh` runs, in order:
  - `s4-*`: default view, low and overview poses for classic 411 (farm), classic 1 (quarry), fortified 4 (keep), Grand fortified 5 (keep), the Powder mid-battle (burned) and the title;
  - the `measure:` runs;
  - ten-seed contact sheets per set, `s4a/s4b-sheet-<set>-<mission>.png`, for the wood-line check;
  - the rest of the `s4-*` frames;
  - the `s3-*` frames from `distB`;
  - the `a-*` frames from `distA`.
- **Gating:** each run waits for load < 6.5 and no other Chromium, and is capped at 190 s.
- **Start:** `nohup ./queue.sh > logs/queue.out 2>&1 &`.
- **Single runs:** `DIST=$PWD/distC PREFIX=s4 ./go.sh <name> <case>`. The cases are listed in `shoot.mjs`.
- **Rebuild after code changes:** re-run `buildvar.mjs`. In the package itself, `npx vite build` writes the ignored `dist/`.
- For the Powder board before/after, compare `now-mid-powder-battle.png` with `s4-mid-powder-battle.png`.

## Cost (dressing's own meshes; the old wooden table drew 6 calls)

| Board | Measured in page at S2 (`a2be409f`) | Node estimate at tip (triangles) |
|---|---|---|
| Classic 411 (farm) | 10 calls, 29.4 K tris | 24.8 K |
| Classic 1 (quarry) | – | 25.3 K |
| Fortified 4 (keep) | – | 24.3 K |
| Grand fortified 5 (keep) | 9 calls, 36.8 K tris | 33.5 K |
| Grand open 7 (quarry) | – | 34.9 K |
| Powder 3 (burned) | – | 30.8 K |
| Keg 2 (farm) | – | 26.8 K |

- **Draw calls at the tip, by construction: 12, which is the cap.** That is sky 1, ground 1, edge+stakes 1, works 1, trees 2, grass 1, debris 4 and floor cover 1. There is no room for another mesh: S5 camps must merge into the works mesh.
- The Node estimate counts geometry × instances, but it read about 3 K under the in-page figure at S2.
- **To measure in page:** `DIST=$PWD/distC PREFIX=s4 ./go.sh m measure:<mission>:<set>:<seed>`. It prints `{calls, tris}` for every visible mesh under `userData.dressing`.
- **Caps:** 12 calls and 40 K triangles. If over, trim `TREES` or `DEBRIS` in `place.js`.

## Checks against the tip `0b656695`

**Passed (Node):**
- `node sim/parity.mjs`: 97 of 97, run after each commit with one CPU.
- `node sim/boundaries.mjs` and `--self-test`. Rule 5 holds `view/dressing/` to three.js, its own modules and `core/dmath.js`, with no `Math.random`, `Date`, `performance` or `crypto`.
- `node sim/flag-lint.mjs` and `--self-test`.
- `node sim/dressing-check.mjs`: 1,000 boards for each set, about 10 minutes. It checks that placement is seeded and the same twice, the three placement classes, and that clutter is hidden under every base.
- `node sim/dressing-check.mjs --self-test`: all class plants caught, both unseeded placers caught, both broken base masks caught.

**Owed (Chromium).** Run them only when no other chrome is alive and load < 3. Set `CHROMIUM_PATH=/opt/pw-browsers/chromium` (the `c.sh` wrapper sets it, along with a short TMPDIR). Never loosen a check to get a pass. From the package directory:
- `npx vite build && node sim/render-bench.mjs` (dressed: the real cost)
- `node sim/title-shot.mjs` (shoots with `?dress=0` against HEAD; `--dressed` for the dressed title once a dressed reference exists. The coordinator re-pins the title and re-shoots `thumbnail.jpg` at merge.)
- `node sim/terrain-shots.mjs` (`?dress=0`)
- `node sim/snap-check.mjs`
- `node sim/dressing-check.mjs --browser` (written, never run: a watched battle dressed and with `?dress=0` must end with the same hash, trace and dice state)
- `node sim/bake-check.mjs`

## Themes as built (`place.js` themeOf, worksOf, PALETTES, nameOf; geometry in `works.js`)

**Which board gets which theme:**
- powder set → **burned**
- fortified set → **keep**
- otherwise → **quarry** where stone and rock outweigh the green by 1.2×, else **farm**

For example: classic 411 and keg 2 are farm; classic 1 and Grand open 7 are quarry.

**What each theme puts round the board** (off the mat, on a seeded side that is not the wood's side):
- **farm:** house, barn, well, cart, a 3-sided fenced paddock, 12 hay stooks, a second cottage.
- **quarry:** a terraced cut, a crane, a works hut, 3 spoil heaps, 6 dressed blocks, a cart.
- **keep:** an outer wall 22 tails behind one army, in runs of 6 tails or less, with a gatehouse on that army's road, towers at the ends, 3 huts and 4 tents, and a beacon on the far side.
- **burned:** 3-5 cottage shells, chimneys, a burned cart, charred fields, scorched near trees, and the scorch grading past the mat's edge.

**Shared behaviour:**
- Yards are trodden into the ground, and no trees stand in them.
- On the mat, a theme changes only the wash, lane colours and its own low clutter: quarry stone chips, keep chips, burned sticks.
- 'low' quality and `?lowfi` hide the works.

**Board name:** `nameOf(seed, theme)` in `place.js` (for example "Watchgate"). It is on the plan as `plan.name` and **is not on screen**.

## What still looks wrong (priority order; all unseen this round, so judge the frames first)

1. Commits 3-5 are unverified on screen. Check the floor cover (UV and orientation, rim fit), the works' scale and grounding (lifted by `lift() - 0.25`, which may float or sink on slopes), and lane colour against the mat.
2. Works sit on one side only, and some sides are behind the default camera. A board may still read as quilt-plus-wood from the camera it opens on. Consider placing works where the default views look.
3. The tree-wall fix is a design change only. A Node projection check for it was attempted and dropped, because it did not match the page camera (the battle camera uses a view offset). Use the ten-seed contact sheets.
4. Bases hide clutter only for figure roots with `userData.base` that are visible and near the ground. Long hulls use a bounding sphere, so they over-hide. That is fine.
5. On the Powder board, the scorch now grades outward, but the mat's own scorch (V3d) is still a uniform tint.

## Remaining slices S5-S10 (what changes their plan)

- **Budget:** at the 12-call cap, every new slice must merge into an existing mesh (works, edge) or paint (0 calls).
- **S5, camps behind each zone:** add them to the works mesh (`worksOf` records, `works.js` builders); pennants in seat colours need per-vertex recolouring, as `surround.paint` does for the stakes. Smoke would cost plumes calls and is not affordable.
- **S6, light over the rounds:** `stage.daylight` plus `SKIES` presets. Interpolate by round from the mirror's turn, keeping the sun at 25° or higher, and keep `mood()` for burning.
- **S7, objectives:** flat decals only, plus a marker reskin per theme.
- **S8, scars:** paint into the mat via `table.dress` from mirror events. Must survive a snap; add a `snap-check` row.
- **S9, ambient life:** vertex-shader sway on the existing meshes. Birds would need a call.
- **S10, camera:** an optional lower orbit (`camera.js` maxPolarAngle 1.32). Covered by `sim/camera-check.mjs` and `sim/input-check.mjs`. Not started.

## When wt/units lands on main

1. `git merge origin/main` into `wt/world` (no rebase).
2. Run the inch-mark copy lint main will carry. My older comments and the S1 commit text still use `"` for inches in code comments (`place.js`, `surround.js`, `ground.js`, `dressing-check.mjs` headers). Convert them to tails where the lint covers comments. DESIGN §4.3 is already in tails.
3. Show the board name (`plan.name`, through `view.dressing.plan.name`) in the setup panel, the log header and replays, with ui strings in wt/units' style.
4. Re-run parity, boundaries, flag-lint, dressing-check and the owed Chromium list.
