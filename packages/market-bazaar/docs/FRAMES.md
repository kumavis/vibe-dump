# FRAMES.md — conventions contract for `market-bazaar`

Every module quotes this file instead of re-deriving an answer. If a fact here
is wrong, fix it *here* and then fix the code; never let a module keep a
private opinion about direction, units or vocabulary. (This is the space-goblin
lesson: the one un-written contract is where the mismatch slips in.)

## World

- **Units are metres.** Ground plane is `y = 0`. Up is `+Y`.
- **The plaza is centred on the origin.** Walkable area is a disc of radius
  `bounds.r` (world.js exports it; sim clamps to it).
- A character standing at rest has feet at `y = 0`.
- **Characters face their local `+Z`.** A character's yaw is a rotation about
  `+Y` applied to its root; `yaw = 0` faces world `+Z`, `yaw = π/2` faces
  world `+X` (`x = sin(yaw), z = cos(yaw)` — the three.js convention for
  `Object3D.rotation.y`).
- Spot records `{x, z, yaw}` mean: stand at `(x, 0, z)`, set root yaw to
  `yaw`. A stall's `vendorSpot.yaw` therefore points the vendor's `+Z` *out
  across the counter* toward shoppers; each `browseSpot.yaw` points *at* the
  counter.

## Rig

- **Every bone's rest rotation is identity** — all bone axes are world-aligned
  in the bind pose; only offsets differ. Bone direction is implied by child
  offsets. Mirroring a pose = negate the Y and Z euler components.
- Poses are quaternions composed about **fixed parent axes**, e.g.
  `rot(bone, X(-0.5), Y(0.2))` = "swing forward, then out". Never raw euler
  triples with implicit order.
- The character's own **left is `+X`** in the bind pose; bones named `…L` sit
  at positive x. Left/right mirroring is `x → -x`.
- Arm bones run **down** in the bind pose (A-pose, arms hanging slightly out):
  the chain `upperarm → forearm → hand` descends along `-Y`. Rotating an
  upperarm by `X(-θ)` raises the arm forward (toward `+Z`); by `Z(-θ)` (left
  side) raises it sideways away from the body.
- Leg chains descend along `-Y`; `X(-θ)` on a thigh swings the leg forward.

## Skinning

- Geometry is authored in **bind-pose world space** (same space as the rig's
  rest positions), then bound by the segment-distance solver in
  `src/skinning.js`. A part declares its candidate bones (`bones: [...]`) or
  a single rigid bone (`rigid: 'head'`).
- Closed parts must have **outward-facing normals / positive signed volume**.
  `tools/checks/geometry.mjs` asserts this; prefer three.js primitives
  (Sphere/Capsule/Cone/Cylinder — all wind outward) transformed into place
  over hand-rolled sweeps.
- `THREE.TorusGeometry` is born in the **XY plane, hole along +Z** (looked
  up, not assumed). `THREE.ConeGeometry` points along **+Y**.
  `THREE.CapsuleGeometry`'s long axis is **+Y**.

## Materials

The exact vocabulary — a part's `material` key is one of:

| key    | meaning                                | three material                                  |
| ------ | -------------------------------------- | ----------------------------------------------- |
| `body` | skin, cloth, wood, all lit surfaces    | `MeshStandardMaterial` `vertexColors` rough 0.85|
| `glow` | emissive bits: devil eyes, lamp flames | `MeshBasicMaterial` `vertexColors`              |

Colour lives in **vertex colors** (sRGB values written as linear via
`Color.convertSRGBToLinear()` — the renderer outputs sRGB). One material per
key across the whole app; draw calls stay low.

## Money & goods

- Currency is integer **coins** (no fractions anywhere in the economy).
- `src/goods.js` is the single catalog. A good's `id` string is the only key
  ever used to reference it (`'fish'`, not an index).
- Prices are per-unit; a haggle is always about **one unit** of one good.

## Time

- `sim.update(dt)` takes wall seconds. One **market day** = 120 wall seconds;
  economy `tick(dtDays)` consumes days. The sim fast-forwards ~80 s during
  load (pre-roll, last few seconds with visuals live) so the plaza is
  already busy — mid-conversation — at first paint.

## Determinism

- No `Math.random()` anywhere in `src/`. Everything derives from
  `makeRng(seed)` / `hashU32` in `src/rng.js`. Same seed ⇒ same bazaar, same
  ledger. (Checked: economy check hashes the ledger twice.)
