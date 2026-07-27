# Process — building a detailed procedural 3D character

A playbook for the next project of this shape: a rigged, skinned, animated,
fully generated figure with simulated kit, built in one session with delegated
help. Written from the mistakes catalogued in `RETROSPECTIVE.md`.

The organising principle: **quality tracks feedback-loop speed.** Every part of
this project came out roughly as good as its verification loop was fast. So the
process is mostly about building loops before building art.

---

## Phase 0 — Write down the conventions before writing code

Half an hour here removes a whole bug class. Produce a `docs/FRAMES.md` in the
package stating, unambiguously:

- **World axes and facing.** (Here: Y up, character faces +Z, +X is the
  character's left, units are metres, feet at y = 0.)
- **Bone convention.** (Here: all rest rotations identity; bone direction is
  implied by child offsets; mirroring a pose = negate Y and Z.)
- **Sweep frame convention.** For a sweep running up +Y, does `profile.x` land
  on +Z or +X? Write it down once; every profile function then reads correctly.
- **Attachment space for hand-held objects.** (Here: grip axis along the
  weapon's +Y, business end towards +Y, "front" faces +Z.)
- **Handedness rule for parametric surfaces**: `du × dv` must point along the
  returned normal. Any surface that violates it must say so, or the builder must
  probe it (see `panelSurface`).
- **Material key vocabulary.** The exact string list. Not "roughly these".

Everything delegated later quotes this file rather than re-deriving it.

---

## Phase 1 — Contracts, then delegation

Split the work by *coupling*, not by size. Keep the tightly-coupled core in one
head (rig → geometry → skinning → animation → integration). Delegate the leaves:
textures, environment, physics solver, props/weapons.

For each delegated subsystem write, **before starting the agent**:

1. The exact exported signatures and return shapes, as a code block.
2. Which single file it owns. It touches nothing else.
3. The conventions file contents (or a link plus the relevant excerpt).
4. The art direction, specifically, with hex colours and named references.
5. A budget: triangles, milliseconds, allocations.
6. **The verification method and the evidence required.** Not "make sure it
   works" — "build a Playwright harness, screenshot it, read the PNG, iterate
   until it matches the brief, and report measured timings, triangle counts, and
   any deviation from the contract with the reason."

Then write the consumer against the contract immediately, in parallel with the
agents. If the contract is good enough to code against blind, it's good enough.

**While agents are live, do not test through a dev server with HMR.** Their file
saves will reload your page mid-measurement and you will misdiagnose it. Build a
static snapshot and serve that.

---

## Phase 2 — Build the validation battery before the art

This is the step that was skipped, and it is the one that matters. Concretely,
add a `tools/` directory to the package with the checks below. Most run headless
in Node in under a second — three.js builds `BufferGeometry` fine with no DOM.

### Level 0 — Geometry invariants (headless, every build)

Cheap, absolute, catches the bugs that are invisible to the eye.

```js
// tools/check-geometry.mjs
// For every part returned by buildBodyParts() / buildGearParts() / weapons:
//   1. finite:      no NaN/Infinity in any attribute
//   2. winding:     signed volume > 0 for parts tagged closed
//                   (tag open-ended parts explicitly; don't let them false-positive)
//   3. normals:     >95% of face normals point away from the local medial axis
//   4. degenerate:  zero-area triangle count == 0
//   5. uv:          uvs present and finite; no part entirely at (0,0)
//   6. envelope:    each part's bbox inside a declared per-part budget
```

Signed volume is five lines and would have caught the inside-out `sweep()`
before the first render:

```js
const volume = (g) => {
  let v = 0
  const p = g.attributes.position, idx = g.index
  for (let i = 0; i < idx.count; i += 3) {
    a.fromBufferAttribute(p, idx.getX(i))
    b.fromBufferAttribute(p, idx.getX(i + 1))
    c.fromBufferAttribute(p, idx.getX(i + 2))
    v += a.dot(_t.crossVectors(b, c)) / 6
  }
  return v // > 0 means outward-facing
}
```

Add the skin solve to the same run: weight rows sum to 1 ± 1e-3, no vertex with
zero total influence, no vertex bound to a bone whose segment is more than *N*
cm away.

**Make each geometry part declare its own expectations.** A `SkinPart` gains
optional `closed: true` and `bbox: [min, max]` fields; the checker then needs no
per-part special cases and new parts are covered by default.

### Level 1 — Positional and anatomical assertions (headless FK)

Pose the skeleton at sampled clip times and assert facts about the result. No
renderer involved.

```js
// tools/check-poses.mjs — for each clip, at ~20 sampled times:
//   contact:     during stance, toeTip.y ∈ [-0.005, 0.02]; heel above toe
//   penetration: hand/fist capsule vs torso capsule distance > 0
//   clearance:   swing-leg foot clears the ground by > 1 cm
//   drift:       hips.y stays within [0.50, 0.66]
//   gear:        every accessory anchor within 3 cm of the surface it hugs
//   region:      pauldron bbox max.y < head bone y  (armour is not a hat)
//   silhouette:  fingertip y < knee y when the arm hangs   (proportion check)
```

The foot-through-floor bug was 5.7 cm and completely invisible in a render. The
shoulder-armour-at-head-height bug was three rounds of visual guesswork and one
line of bounding-box comparison. Both are one-line assertions here.

Report as a table across the cycle, not a pass/fail — the shape of the numbers
over time is what tells you *why* it fails.

### Level 2 — Solve orientations, don't check them

The most effective single technique in this project: when an attachment
orientation matters, **state the objective and search for it** rather than
hand-tuning eulers.

```js
// tools/solve-attach.mjs
// Given: a bone, an object's local +Y extent, a clip, and an objective —
//   e.g. "mean tip offset ≈ (-0.03, +0.12, -0.30) m over the run cycle,
//         tip never below y = 0.15"
// brute-force the two aiming eulers on a 0.1 rad grid, score, print the best.
```

That found the cleaver's carry pose in a single run after two failed rounds of
eyeballing. It generalises to holsters, backpacks, quivers, ear-rings, anything
parented to a bone.

Note the structural insight it made obvious: with `Rx·Ry·Rz` applied to `(0,1,0)`,
the Y term cannot change the aim at all — it is purely a roll about the object's
own axis. Knowing which dial does what beats twiddling all three.

Pair it with a debug helper:

```js
// tools/frames.js — debugAxes(object, size) adds an RGB triad (X red, Y green,
// Z blue) at any bone or attachment point. Turn on with ?axes=1 in the inspector.
```

### Level 3 — Visual verification that a model can actually read

Renders are still necessary — they are just terrible as a *primary* source of
truth, and they were used badly here. Fixes:

**One contact sheet, not N screenshots.** Composite a fixed set of named views
into a single labelled image so a single look gives the whole picture and there
is no cross-image ambiguity.

```
tools/contact-sheet.mjs →  docs/shots/sheet.png
  rows: clip × time      (run@0.05, run@0.30, combo@0.36, idle@0.5)
  cols: front | left | back | 3/4 | head | hands+feet
  each cell stamped with: view name, clip, time, and a small axis compass
```

**Stamp the axis compass into every frame.** The "is screen-left the character's
left" question was re-derived from camera basis vectors more than once, and got
answered wrong. A 40-pixel gizmo in the corner ends it permanently.

**Add a part-isolation mode.** `?isolate=metalDark` renders that material key in
flat magenta and everything else at 20% grey. The mystery-cone hunt that took
three rounds becomes one screenshot.

**Baseline and diff.** Commit the contact sheet. On each change, regenerate and
pixel-diff against the baseline; a change to the belt that moves the ears is
then visible immediately instead of three iterations later. Seed everything
deterministically (already true — no `Math.random()` in generation) so the diff
is meaningful.

**Neutral studio lighting for character judgement.** Judging a figure inside a
dark, fogged, backlit environment judges two things at once. `dev/inspect.html`
already does this; use it *first*, and only then check the in-world look.

### Level 4 — Aesthetic review, structured

This cannot be automated, but it can be stopped from being vibes-only.

**The thumbnail test, first.** Downsample the render to 64 px and look at it. If
the silhouette does not read, nothing else matters yet. Ears too big, armour
floating beside the head, and a blade covering the face were all obvious at 64 px
and debatable at full resolution.

**A per-pass checklist**, applied to the contact sheet:

- Does the silhouette read as the intended creature at 64 px?
- Is the figure separated in value from its background, or is it a dark blob on
  a bright ground?
- Does any single element occupy more than ~20% of the silhouette without being
  the focal point? (The cleaver failed this badly at first.)
- Does each accent colour appear in 2–4 places, or is it sprayed everywhere?
  (The hazard stripes started on every metal part.)
- Is there exactly one busiest area, and is it the face?
- Does each material read as its intended substance — is "bone" bone, or is it a
  striped traffic cone?
- Are the texture repeats consistent in world-space density across parts?

**Use a fresh-eyes reviewer.** Hand a subagent the contact sheet *without* the
design intent and ask it to describe what it sees, part by part. "There is a
grey cone next to the head" arrives far faster from someone who is not already
convinced they modelled a rebreather. This is the cheapest high-value review
available and it was not used here.

**One change per axis per iteration.** Changing ear size, shoulder position and
material contrast together, then rendering once, teaches nothing about which one
helped.

### Level 5 — Performance budgets, measured where they're real

Containers here have no GPU: browser FPS is SwiftShader and means nothing. So
measure the parts you own and assert those:

- per-frame JS: solver step, world update, character update — each with a stated
  budget in ms (dynamics landed at 0.40 ms, world at 0.10 ms)
- allocations per frame in the hot path (target: zero)
- one-time build cost, broken down per stage
- triangle and draw-call counts against a budget

And say plainly in the report that end-to-end frame rate is *unverified* on real
hardware, rather than quoting a software-rasteriser number as if it meant
something.

---

## Phase 3 — Build order

Inner to outer, so that each layer is verified before the next depends on it:

1. `noise` → deterministic, seeded, no dependencies.
2. `geometry` toolkit → **run Level 0 on a unit tube before building anything
   real.** A single `tube()` with a known signed volume is the canary.
3. `rig` → run Level 1's FK dump on the bind pose; check proportions in a table
   before any mesh exists.
4. `body` → Level 0 + contact sheet, studio lighting, no gear.
5. `anim` → Level 1 across all clips. Foot contact and self-penetration now,
   not after the kit is on.
6. `gear` / `weapons` → Level 0 + isolation renders per piece.
7. `skinning` → weight validation, then a deformation sheet (extreme poses).
8. `dynamics` / `springbone` → stability soak with `dt` spikes.
9. `materials` / `env` → only now judge colour and value.
10. `world` → last, and judged against the character, not on its own.

The temptation is to build outside-in because the environment reads as progress
sooner. Resist it: it front-loads the pleasant work and back-loads the character,
which is the part that actually needs the iterations.

---

## Phase 4 — The iteration loop

```
change one thing
  → node tools/check-geometry.mjs && node tools/check-poses.mjs   (~2 s, headless)
  → node tools/contact-sheet.mjs                                   (~20 s)
  → read the sheet; thumbnail test; checklist
  → diff against baseline; explain every unintended difference
  → next
```

If a question can be answered by a number, answer it with a number. Reach for a
render only for questions that are genuinely about appearance.

---

## Delegation playbook

| Do | Don't |
|---|---|
| Write the contract before spawning | Describe the goal and hope |
| One file per agent, stated explicitly | Let two agents near one file |
| Require measured evidence in the report | Accept "done, looks good" |
| Ask for deviations *with reasons* | Assume the contract was followed |
| Give hex colours and named references | Say "make it look scavenged" |
| Give a budget (tris, ms, bytes) | Leave cost open-ended |
| Test against static builds while they run | Screenshot a live HMR dev server |
| Read their flagged findings seriously | Assume your own code is the fixed point |

The weapons agent's report contained "your `sweep()` winds inside-out, verified
by signed volume." That was correct, it was about *my* code, and acting on it
was the single largest quality jump in the session.

---

## Rules of thumb earned the hard way

1. **A plausible render is not a correct one.** Reversed winding, wrong-handed
   surfaces and 5 cm floor penetration all render as "hmm, looks a bit off".
2. **Version-check any API before building on it.** `scene.environmentIntensity`
   is r163+. `light.layers` filters against the *camera*, not the object, so
   per-object light rigs do not exist in the standard renderer.
3. **`metalness ≈ 1` with no environment renders black.** An environment map is
   not a polish step, it is a prerequisite for judging any metal.
4. **If an orientation matters, choose the frame explicitly.** Parallel transport
   will happily hand you a horizontal ear.
5. **Prefer probing to assuming for handedness.** `panelSurface()` samples its
   own surface rather than trusting the caller, and that is why adding a new
   surface type is now safe.
6. **Absolute paths across package boundaries.** A monorepo build inspected from
   a package subdirectory looks at the wrong `dist/`.
7. **List the tool path, don't guess it.** `ls /opt/pw-browsers`.
8. **Promote throwaway scripts.** Every `t7.mjs` that found something real should
   have become `tools/check-*.mjs` the moment it worked.

---

## Proposed tooling manifest

None of the following exists yet in this package; all of it is directly liftable
from throwaway scripts written during this build.

| File | Purpose | Runtime |
|---|---|---|
| `docs/FRAMES.md` | The conventions contract | — |
| `tools/check-geometry.mjs` | Level 0 invariants over every part | headless, ~1 s |
| `tools/check-skin.mjs` | Weight sums, orphan vertices, far-bone bindings | headless, ~1 s |
| `tools/check-poses.mjs` | Level 1 FK assertions across all clips | headless, ~2 s |
| `tools/solve-attach.mjs` | Search an attachment orientation against an objective | headless, ~5 s |
| `tools/frames.js` | `debugAxes()` triads + an in-frame axis compass | in-app |
| `tools/contact-sheet.mjs` | Labelled multi-view sheet + baseline diff | Playwright, ~20 s |
| `tools/soak.mjs` | Long run with combat bursts; NaN and console-error sweep | Playwright, ~60 s |
| `tools/perf.mjs` | Per-stage JS budgets and allocation counts | Playwright, ~15 s |

Plus two small additions to the existing inspector: `?isolate=<materialKey>` and
`?axes=1`.

The honest summary of this project is that it shipped with Level 0, 1, 2 and 5
performed ad hoc and then discarded, and Level 3 and 4 performed by eye. The
subsystems that were handed to agents with a required verification loop came out
best. Building the loops first is the whole process.
