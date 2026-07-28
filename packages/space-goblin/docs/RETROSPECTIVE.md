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
those signatures _before_ three of the four files existed, and integration was
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
sounds like it _should_ work that way.

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

## Second pass — what the review rounds taught

Everything above was written when the model shipped. What follows came out of
several rounds of review against it, and it is a different kind of lesson: not
"how do you build this", but "how does a thing that passes every check you wrote
turn out to be wrong anyway".

### A green suite only describes the axes you thought of

The cleaver mated its socket at 0.000° and 2e-15 mm. It cleared the head by
326 mm, stayed 150 mm off the floor, kept 54 mm from the pistol, and passed a
self-intersection sweep over 660 frames. Five checks, all green, all genuinely
measuring something.

And through both strikes of the combo it was **63-86° off its own cutting edge**.
He was hitting with the flat of a cleaver at 5.9 m/s.

Nothing in the suite was wrong. Every check measured what it claimed. The blade
was in exactly the right place, travelling at exactly the right speed, and
rotated about its own long axis into a completely useless orientation — an axis
no check had an opinion about, because a blade at 75° still reads as a blade in
any render and no clearance test cares which way a flat surface faces.

**A passing suite is a statement about the questions you asked.** The habit that
follows is to periodically ask what property of a subsystem has _never_ had a
number put on it, rather than re-reading the checks that already pass.

### Prose claiming a measured property is a hypothesis until it cites the number

The comment above the combo's wrist keys said the blade was "thrown out past the
knuckles through each strike so the edge leads it". It then listed real
measurements — 5.92 m/s against 4.57 m/s with a dead wrist, 46 mm of thigh
clearance against 47 mm buried.

The edge-leading claim had no number next to it, and it was false. The numbers
that _were_ cited were true. The agent had measured what it optimised and
asserted the rest, and the asserted part read exactly as confidently as the
measured part.

**In a codebase where comments carry measurements, a claim without a number is a
claim nobody checked** — and it is more dangerous than no comment, because it
tells the next reader the question is already settled.

### Gear worn across a joint has to be split at the joint

The rebreather is a bridge band over the snout, cartridges on the cheeks, and a
chin strap under the mandible. All of it was rigidly bound to `jaw`. On the
combo's roar the mandible opens 50° and took the nose bridge with it, parting
from the snout it sits on by 19 mm.

The bug is structural, not numeric: a rigid binding assumes the part lives on
one side of every joint it spans. The rebreather spans the jaw hinge, so it is
two parts, and no amount of tuning the single binding would have fixed it. Same
class as the pauldron sitting on the clavicle rather than the upper arm — but
that one was reasoned through when it was built, and this one was not.

### A comment that conflates two things is where the bug is hiding

`forearmStrapSocket` said: _"away from the arm is the same -Y the palm faces"_.

Two different concepts, welded together by "is the same". -Y **is** where the
palm looks. It is **not** away from the arm in any sense a shield cares about —
a buckler mounted there rides the inside of the wrist. The goblin carried his
shield on the wrong side of his forearm for the entire build, behind a comment
that sounded like it had thought about the question.

The tell, in hindsight, is the phrase "is the same". When a comment asserts two
descriptions are equivalent, that equivalence is load-bearing and usually
unexamined. The test turned out to be one line — dot the strap axis against the
hand's own palm normal — and it read **+0.997** where it should read about −1.

### Default orientations of library primitives are facts to look up

`THREE.TorusGeometry` is born in the XY plane with its hole along +Z. The ear
hoops were rotated about X, which lays them flat, so the goblin wore small
horizontal discs on the side of his head.

This is the same failure as the horizontal ear in the first pass, and the same
as `light.layers`: **a fact about the library was assumed rather than checked.**
It keeps happening because the assumed value is right about half the time, and
when it is wrong the result still renders.

### Two systems that cannot collide need the constraint asserted, not simulated

The cape is verlet cloth that collides against capsules on the _skeleton_. The
scrubber pack is a rigid gear part skinned into the body mesh. They have no
representation in common, so **they can never collide, and no amount of solver
work will change that.** The cape's centre pin sat 5 mm above the pack's top
edge and 16 mm inside its front face, and the cloth fell straight down through
all 155 mm of it.

When two subsystems cannot see each other, the only thing keeping them apart is
a number a human chose, and that number needs a check on it. The fix was not in
the solver; it was moving the anchor and then asserting the anchor.

### A cut has to be made in every representation of the object

Splitting the cape into two tails meant dropping constraints in the solver _and_
dropping triangles in the mesh — two arrays built by two different functions
from the same grid. Either one alone produces a convincing-looking failure:
links-only leaves a visible gap whose halves still move as one board; quads-only
leaves two tails swinging through triangles stretched across the gap.

Neither is visible in a still. The check asserts both at once, from the same
declared spec, which is the only formulation that catches the half-done case.

### Scope a check to the regime where the property should hold

The first version of the edge-leading check failed the _run_ clip at 129°. The
check was wrong, not the animation: he is **carrying** the cleaver there, and a
sprinting goblin holds a blade flat and away from his own leg rather than
presented edge-first at his thigh. A carry and a cut want opposite things from
the same wrist.

The temptation at that moment is to widen the tolerance until it passes, which
would have destroyed the check — 45° and 129° would both be legal. The correct
move was to narrow the _domain_: attack clips are held to it, carries are not,
and the reason is written where the constant is defined.

### Measure against the right reference or the number means nothing

The first gear audit reported the pack's emissive readout floating "70 mm off
the skin", which looks damning until you notice it is mounted on the _pack_,
which is itself 62 mm off the skin by design. The measurement was correct and
the reference was wrong.

Large numbers are not findings. A finding is a number measured against the thing
the part is supposed to be attached to.

### The human caught what the suite structurally could not

Three of the four faults in one review round — shield on the wrong side, hoops
lying flat, cape falling through the pack — were spotted by eye, immediately, by
someone who had not read the code.

That is not a failure of the suite so much as a statement about what a suite is.
Every check in it encodes _physics_: clearances, intersections, exactness of a
mate, stability of a binding. Not one of them knows what a shield is **for**, or
which way an earring hangs, or that a cloak is worn under a pack rather than
through it. Those are facts about the world, and they arrive through a person.

The useful division, going forward: **automated checks defend properties that
have a number; humans supply the intent, and then the intent gets a number.**
All three notes are now checks — and all three checks were written against the
broken state first, to watch them fail.

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

The distribution of quality tracks the distribution of _feedback loop speed_
almost exactly. The subsystems with a tight, automated verification loop came
out best; the ones I judged by eye from a whole-body render came out worst.

**After the review rounds**, that assessment needs one amendment. The kit — the
part called "strong" above — turned out to contain the shield on the wrong side
of the forearm, the ear hoops lying flat, the rebreather bound across a hinge,
and the cape falling through the pack. The secondary motion was genuinely good
and that is what the eye went to; the _semantics_ of the kit had never been
examined by anything, because the checks measured clearance and the renders
showed movement, and neither asks what a piece of equipment is for.

The suite has grown from 26 checks to 30 across those rounds, and the four
additions are all of one kind: they encode a fact about the world that a person
supplied. That is the shape of the remaining work, too. What is left on the list
— the 39 mm toe-through-floor, the 22 mm of grip slack in an oversized fist —
are both things a measurement already knows about and nobody has fixed yet,
which is a much more comfortable position than not knowing.
