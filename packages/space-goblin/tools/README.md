# `verify.mjs` — the headless assertion suite

(`tools/` also holds `contact-sheet.mjs`, which renders the goblin from every
angle and phase. Different instrument, same purpose: that one is for the things
only an eye can judge, this one is for the things only a number can.)

```bash
npm run verify                         # everything, exits non-zero if anything fails
node tools/verify.mjs locomotion       # one family (or several, space separated)
node tools/verify.mjs -v               # print the detail line for passing checks too
```

No browser, no canvas, no renderer, no screenshots. `rig.js`, `anim.js`,
`attach.js`, `weapons.js` and the pure half of `character.js` import nothing but
three, so the whole suite is forward kinematics and arithmetic in plain node. It
runs in about 120 ms.

That is not a performance boast, it is the point. Both of the bugs this suite
was written after — a goblin running backwards under a world scrolling the same
way, and a cleaver whose handle ran along the fingers and out through the palm —
were *numeric* bugs that rendered perfectly happily. A screenshot shows you a
goblin with a cleaver. A number tells you the grip axis is 104.7° out.

Every check reports a **measured value on success as well as failure**, so the
table is a set of readings rather than a row of ticks. Where a check needs a
threshold it is a named constant at the top of its file with a paragraph saying
where the number came from and what was measured to get it.

---

## The families

### `rig` — the skeleton's own invariants

`rig.js` states these in prose and every module downstream quietly relies on
them. Nothing enforced them.

| check | asserts |
| --- | --- |
| rest rotations are identity | every bone's bind rotation is exactly identity. `anim.js` writes absolute quaternions per bone and `mirrorQ` negates only y and z; both are wrong the moment a bone rests rotated. |
| L/R mirror negates x and nothing else | for every `…L` bone there is an `…R` bone whose local offset and world rest position negate x exactly and match y and z exactly, and whose parent is the mirror of the original's parent. |
| no bone is its own ancestor | the parent chain terminates, and every bone is reachable from `root` (an unreachable bone is never touched by `updateMatrixWorld`). |
| boneSegments are non-degenerate | every skin-weighting segment is longer than 1 mm. `skinning.js` divides by the squared length. |
| skeleton instantiates to the declared bone table | `buildSkeleton()` produces exactly `BONE_DEFS`, at the declared offsets, under the declared parents. |

### `locomotion` — does he actually run forwards?

The headline is a **cross-module** assertion, because the moonwalk was a
cross-module bug: the world's direction lived in `world.js` and the gait's lived
in `anim.js`, and nothing compared them.

| check | asserts |
| --- | --- |
| planted foot slides against FORWARD | during each plant, the contact marker travels opposite `convention.FORWARD`. |
| world travel opposes the goblin, and matches the feet | `WORLD_TRAVEL_Z = sign(scrollZ(1))` is the opposite of `FORWARD.z` **and** equals the sign of the measured planted-foot velocity. This is the moonwalk check. |
| world.js takes its direction from convention.js | the check above can only speak for `world.js` because `world.js` has no private opinion left — every scroll site routes through `scrollZ()`. That is a property of the source (the module needs WebGL and cannot be imported), so it is checked as one. |
| planted foot does not skate against RUN_SPEED | the stance carries the foot at roughly the speed `main.js` scrolls the world. **See the caveat below.** |
| each foot plants once a cycle, half a cycle apart | exactly two plants, one per foot, half a cycle apart, with a bounded flight phase. |
| feet stay out of the floor | the planted foot does not sink through y = 0, and the swinging foot does not scuff through it on the way past. |
| arms swing contralateral to the legs | correlation between each foot's fore-aft reach and the same-side hand's is strongly negative, and cross-side strongly positive. |
| torso leans FORWARD and the head stays level | hips→chest tips toward `FORWARD`; head→headTop stays within 15° of world up. |

**Caveat, stated in the code and repeated here because it matters:** the run
clip's stance carries the foot at **3.51 m/s** while `main.js` scrolls the world
at `RUN_SPEED = 4.8` — he skates by 27%, and instantaneously the planted foot
ranges over 0.17…6.05 m/s because `k()` interpolates with a smoothstep and so
stalls the foot at every keyframe. The fence is set at 33%, above today's
number, so the reading is printed on every run and cannot get worse without
failing. Closing it is an `anim.js`/`main.js` change (lengthen the stride, or
drop `RUN_SPEED` to ~3.5); it is not something a threshold can fix.

Two more measured facts the suite records rather than fails on, for the same
reason: the left toe tip reaches **39 mm below the ground plane** at t = 0.121,
and the sprint has a real **62.5% flight phase**, so "at least one foot in
contact at all times" is false for this clip by design.

### `attachment` — is the kit where it says it is?

Two kinds of check, and both are needed. The first alone passes a perfectly
seated cleaver that saws his own ear off. The second alone *is* the brute-force
euler search that caused the original bug.

| check | asserts |
| --- | --- |
| every weapon mates its socket exactly | `socketError` < 1° of axis and < 1 mm of offset, against the socket **displaced by the mount's own trim** — otherwise a 10 mm `slide` reads as 10 mm of error. Measured once per weapon, not per frame: a socket is a frame in the bone's local space and the holder is a child of that bone, so the error is a constant of the mount. |
| the roll trim is the angle it claims | `mate` folds `trim.roll` into the quaternion; this measures the residual roll back out. It is the one dial a human turns on this system, and if it silently did nothing nobody would notice. |
| the cleaver tip clears his head and torso | ≥ 12 cm from the head and torso capsules over every frame of every clip — the same 12 cm `character.js` chose the little-finger-side seat by. |
| the cleaver tip stays off the floor | tip never below y = 0.12. |
| no weapon passes through the head | the whole **span** of each weapon, not its tip, against the head capsule, zero tolerance. A blade can miss with its point and still be buried to the spine, which is exactly what a tip-position objective cannot see. |
| the weapons do not collide with each other | centreline to centreline, ≥ 20 mm. |

### `self-intersection` — does he pass through himself?

Samples the `COLLIDERS` capsules — the only body the cloth solver knows about —
through every clip and reports any pair overlapping by more than 20 mm.
Legitimate neighbours (the torso chain, the hip, knee and shoulder joints) are
excluded by an explicit list that records what each one measures today, and a
companion check fails if that list starts naming capsules that no longer exist.

Deliberately a gross check: these are fat proxies, so it looks for a limb
somewhere it has no business being, not for a proxy grazing a proxy.

### `clips` — the baked tracks themselves

These are here because the failure mode is *silence*: three interpolates
straight into a NaN and blanks the mesh, and drops a track whose bone name does
not resolve without saying a word.

| check | asserts |
| --- | --- |
| every track value is finite | no NaN/Infinity in any value or time, times strictly increasing. |
| every quaternion keyframe is unit length | within 1e-6. three's SLERP assumes unit length and shears the pose if it is not. |
| every track names a bone that exists | every `bone.property` path resolves against `BONE_NAMES`. |
| looping clips meet themselves at the seam | first and last keyframe coincide, **and** the step across the seam is no more than 1.5× the biggest step the clip takes anywhere else — matching keyframes are not enough, because the mixer interpolates *into* the last frame from the one before it. |
| baked clips cover their stated duration | `buildClips()` still returns what `harness.mjs` thinks it samples, at the duration it thinks it samples it at. Every velocity in the locomotion family is wrong by that ratio otherwise. |

---

## Proving it has teeth

A check suite that has never failed is not evidence. Both known bugs were
reintroduced — into a throwaway copy of the package, so nothing under `src/` was
touched — and the suite pointed at them.

**Bug 1, the world flip.** `scrollZ()` changed to `FORWARD.z * dist`, i.e. the
pre-fix world scrolling toward +Z:

```
locomotion  world travel opposes the goblin, and matches the feet  FAIL  FORWARD.z +1, scrollZ(1) 1, planted foot z-
  ! convention.js sends the scenery toward z+ and the goblin faces z+ — the scenery is
    running away from him at twice the speed, which is the original moonwalk bug.
  ! the planted foot travels z- under him at 3.51 m/s but scrollZ(1) = 1 sends the world z+.
```

Flipping the *character* instead — declaring `FORWARD = -Z` and leaving the gait
alone — trips three checks from the other side, which is what makes it a
comparison rather than a restatement:

```
locomotion  planted foot slides against FORWARD  FAIL
  ! L plant at run t=0.046..0.192 carries toeTipL -0.2863 m = 3.505 m/s ALONG FORWARD (0,0,-1).
locomotion  torso leans FORWARD and the head stays level  FAIL  lean -17.7..-16.6°
  ! the spine leans -17.7° at run t=0.000 — hips->chest tips AWAY from FORWARD (0,0,-1).
```

**Bug 2, the old euler triple.** The cleaver mount given
`pos [-0.05, -0.002, 0.004]`, `euler [-2.24, 0.5, -1.04]` verbatim from commit
`5cb63f1`, seated as a raw transform instead of a mate:

```
attachment  every weapon mates its socket exactly  FAIL  cleaver 8e+1°/2e+1mm  buckler 0e+0°/0e+0mm  pistol 0e+0°/7e-15mm
  ! cleaver  axis 75.3°  roll 138.2°  offset 23.5 mm on handR — limits 1° / 1.0 mm.
    The plug's long axis is 75.3° off the socket's and its centre is 23.5 mm away
    (15.3 mm along the socket axis, -17.8 mm off the palm). At 75° the handle is not
    in the fist, it is across it.
attachment  the roll trim is the angle it claims  FAIL
  ! cleaver asked for -88.24° of roll and the seated plug shows 138.18°.
attachment  the cleaver tip clears his head and torso  FAIL  torso -0.117 m (hips, combo t=0.53)
  ! cleaver tip is -0.1174 m from the hips capsule at combo t=0.529 — a negative number
    means the point is inside it.
attachment  the weapons do not collide with each other  FAIL  cp 5 mm, cb 1 mm
  ! cleaver and buckler come within 0.6 mm at run t=0.796.
```

(75.3° and 23.5 mm rather than the 104.7° and 17.8 mm quoted in the audit: the
shipped plug is `flipped()`, so 180 − 104.7 = 75.3, and the offset is measured
against the socket the mount's `slide: -0.01` trim actually asks for. Same bug,
stated against the seat it claims to want.)

---

## Adding a check

A family is one file in `tools/checks/`. It exports a `name` and an array of
`checks`; the runner picks up every `.mjs` in the directory, so there is nothing
to register.

```js
export const name = 'locomotion'

/**
 * Say where the number came from. "Measured: the worst frame today is 12.1 mm
 * (run t = 0.075); the fence is 20 mm" is a threshold. "20 mm" is a guess.
 */
const SOME_LIMIT = 0.02

export const checks = [
  {
    name: 'a sentence that reads as a claim about the goblin',
    run() {
      return {
        pass: Boolean,
        measured: 'printed on success and failure — this is the deliverable',
        detail: 'the value, the threshold, and the clip and time it happened at',
      }
    },
  },
]
```

Rules that keep this suite worth running:

- **The failure message is the bug report.** `attachment failed` is useless.
  `cleaver axisDeg 104.7 > 1.0 at run t=0.31` is the whole thing. Print the
  measured value, the limit, and the frame.
- **No unexplained numbers.** Every threshold is a named constant with a
  paragraph. If you cannot say what you measured to get it, you have not
  finished measuring.
- **Do not tighten a fence until it is green.** If a check would fail on today's
  animation, say so in the constant's comment and in this README, and set the
  fence where it holds the line — see the foot-skate caveat above. A quietly
  loosened threshold is worse than no check.
- **Stay in node.** If a check needs a canvas it belongs somewhere else.
  `textures.js`, `materials.js`, `env.js`, `world.js` and `character.js`'s
  `createGoblin` all need a browser; everything they are built from does not.

`tools/harness.mjs` has the shared parts: `makeRig`/`applyPose` (forward
kinematics off the pose functions), `CLIPS` (sampling rates per clip), `BAKED`
(the real `buildClips()` output), `mounts()` (every weapon with the transform
`character.js` would give it), capsule and segment distance maths, and readers
that pull `COLLIDERS` out of `character.js` and `RUN_SPEED` out of `main.js` —
both are module-private, and parsing them fails loudly where a copy would rot
silently.
