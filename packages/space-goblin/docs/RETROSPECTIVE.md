# Retrospective — building Space Goblin

Written immediately after the first version shipped. The goal is an honest
account, not a victory lap: the things that worked are worth repeating, and the
things that went wrong cost more time than any of the things that went right
saved.

Final numbers, for context: 68 bones, 39,402 triangles, 13 material groups, 22
simulated accessories, ~1.5 s to generate everything from maths at load, zero
asset files, zero network requests.

---

## What went well

### Hard interface contracts before any parallel work

Four subsystems were delegated to concurrent agents — procedural textures, the
alien environment, the verlet/cloth solver, and the weapons — while the rig,
skin solver, mesh toolkit, animation and integration stayed in one head. Each
agent got a written contract first: exact signatures, exact return shapes, the
material-key vocabulary, the coordinate and unit conventions, and a list of the
modules it was allowed to touch (exactly one file each).

All four came back honouring their contract. `character.js` was written against
those signatures *before* three of the four files existed, and integration was
essentially a no-op. That is the single highest-leverage thing that happened on
this project. The contract is not bureaucracy; it is the thing that lets you
write the consumer and the producer at the same time.

The corollary also held: the one place I did not write a contract — the informal
"material keys" list — is the one place a mismatch nearly slipped through
(`plate` vs `metal` vs `blade`), and it needed an alias to paper over.

### Requiring agents to verify, with evidence

Each delegation ended with "verify before you finish", and named the method:
build a Playwright harness, screenshot it, **read the PNG**, iterate until it
looks right, and report measured numbers. What came back was not "done" but
"0.40 ms/step, 0.6 bytes/step allocation, survived a `dt=0.9` spike and a
`dt=1e6` spike, max stretch 1.58×, here are four bugs I found and fixed."

That is a qualitatively different deliverable from unverified code, and it meant
I never had to debug the dynamics solver or the texture generator at all.

### The delegated review caught my bug

The weapons agent reported, unprompted, that my `sweep()` wound its triangles
inside-out for a counter-clockwise cross-section, and had verified it by signed
volume. It was right. Every limb, strap, horn and tube in the character had
inward-facing normals and had been shading wrong for the entire session.

An agent given a real task and told to verify will audit its dependencies. That
is worth more than a dedicated review pass over the same code.

### Choosing a rig convention that removes a whole bug class

Two decisions paid for themselves repeatedly:

- **Every bone's rest rotation is identity.** All bone axes are world-aligned in
  the bind pose; only offsets differ. Hand-authored poses then read as anatomy,
  mirroring a pose is negating Y and Z, and a bone-local offset is just
  world-minus-rest — which is why `gear.js` can publish accessory anchors as
  one-line subtractions.
- **Poses are quaternions composed about fixed parent axes** (`seq(Z(-1.3),
  X(0.4))` = "drop the arm, then swing it back"), never euler triples. Euler
  order ambiguity produced exactly zero bugs in this project, which is not the
  usual outcome.

### Measuring instead of eyeballing

Every time I stopped guessing and computed the answer, it took one attempt:

- Foot-through-floor was found by sampling toe-tip and heel world Y across the
  run cycle. It was 5.7 cm at mid-stance — invisible in a render, obvious in a
  table.
- The cleaver's carry orientation was found by brute-forcing both euler angles
  over the whole run cycle against a stated objective ("mean tip offset ≈
  (-0.03, +0.12, -0.30) m, tip never below y = 0.15"). One search, done.
- A mystery grey cone that survived three rounds of visual guessing was
  identified in one command by printing part bounding boxes filtered to the
  region it appeared in.

### Building the studio inspector

A studio turntable — a neutral stage with named views and per-clip playback,
since promoted out of `dev/` and shipped as the `turntable/` page — was worth
its cost within two uses. Judging a character against a dark, fog-heavy, backlit
environment is judging two things at once.

---

## What had hiccups

### The winding bug lived for hours because renders "looked fine"

A closed mesh with reversed winding does not look obviously broken. With
back-face culling you see the inside of the far wall instead of the outside of
the near one — same silhouette, plausible-ish shading. I spent several iterations
tuning materials and lights to fix "muddy shading" that was actually inverted
normals.

**The lesson is not "look harder".** It is that some classes of correctness are
invisible to the eye by construction and must be asserted numerically. A
five-line signed-volume check would have caught this before the first render.

### Reading 3D from a single 2D render is unreliable, and I did it anyway

Repeated failures of this kind:

- I confidently concluded the head was "pitched far forward". A forward-kinematics
  dump showed its up-axis was `(0, 1.000, 0.015)` — dead level. What I was
  reading as a drooping head was a large ear.
- I spent real reasoning effort deriving whether screen-left was the goblin's
  left, twice, from camera basis vectors, and got it wrong at least once.
- The "grey cone" was variously diagnosed as the rebreather, a filter cartridge
  and a scrubber tank before bounding boxes revealed it was the right shoulder
  cap, riding at head height.

Every one of these was cheap to resolve numerically and expensive to resolve by
staring. The harness should have been printing an axis compass and view label
into every frame from the start.

### Two three.js facts I assumed instead of checked

- `scene.environmentIntensity` does not exist in r160 (it arrives in r163). I
  wrote it, then caught it by grepping `node_modules` before it shipped — the
  right habit, applied slightly late.
- **Light layers do not do per-object light filtering.** three tests a light's
  `layers` against the **camera's**, not each object's. My "hero-only light rig"
  on layer 1 was therefore silently switched off entirely, and I burned a full
  build-render-inspect cycle concluding "the lights aren't reaching him" before
  grepping for `layers.test` and finding the answer in one line.

Version-check the API before building on it, especially for anything that
sounds like it *should* work that way.

### Parallel agents editing files while I screenshot the dev server

The world and dynamics agents were still saving their files while I was
screenshotting the app through Vite's dev server. HMR reloaded the page
mid-build, and I captured a boot overlay frozen at "sculpting…". I then went
hunting for a nonexistent module-loading bug, including a network trace, before
realising the page had simply been reloaded out from under me.

**Test against a static build snapshot whenever agents are live.** Or don't run
a dev server with HMR at all during delegated work.

### Letting a general-purpose tool pick an orientation that mattered

The ears were built with `sweep()`, whose cross-section plane is decided by
parallel-transport frames from an initial hint. On a path that climbs as it
travels outward, the membrane ended up horizontal — the ear rendered as a flat
paddle lying on its side, and no amount of adjusting the profile could fix it
because the profile was not the problem.

The fix was to stop inheriting the frame and build the ear as an explicit ruled
surface with a chosen up vector. **When an orientation is part of the design,
state it; don't accept whatever the sweep's transport happens to produce.**

### Small friction

- Guessed the Playwright Chromium path (`/opt/pw-browsers/chromium`) instead of
  listing it (`chromium-1194/chrome-linux/chrome`). One wasted run.
- Ran a monorepo-wide build from a package subdirectory and then inspected the
  wrong `dist/`. Absolute paths, or `git -C` style explicitness, for anything
  that crosses package boundaries.
- Several throwaway verification scripts (`t1.mjs` … `t9.mjs`) were written to
  the scratchpad and are now gone. The good ones should have been part of the
  package from the start — see `PROCESS.md`.

---

## Where the result actually landed

Honest assessment of the shipped version:

- **Strong:** the kit and its secondary motion. Straps, charms, necklace, hose,
  antenna, cape and kilt all swing convincingly under gravity and the run's
  inertia, and the two-solver split (spring bones for skeleton parts, verlet for
  accessories) was the right call. The weapons read as scavenged and specific.
  The world is genuinely handsome and stays out of the character's way.
- **Adequate:** the run cycle and the melee combo read correctly and the feet no
  longer sink, but the arms still read a little noodly and the elbow break is
  soft.
- **Weakest:** the head. It reads as a goblin, but the muzzle, mandible and eye
  don't yet form a face that holds up at close range, and the right shoulder cap
  remains more prominent than it should be. The head got the fewest iterations
  and needed the most.

The distribution of quality tracks the distribution of *feedback loop speed*
almost exactly. The subsystems with a tight, automated verification loop came
out best; the ones I judged by eye from a whole-body render came out worst.
