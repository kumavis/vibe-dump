# Space Goblin

A procedurally rigged, skinned and animated space goblin sprinting across an
alien flat, swinging a scavenged reactor-fin cleaver. There are no asset files:
every bone, vertex, texel, animation key and swinging strap is generated from
maths at load time (~1.5 s), and the page makes zero network requests.

## How it fits together

```
main.js            scene, camera presets, the director loop (run → strike → run)
src/
  noise.js         value/gradient/worley noise + seeded RNG — everything else grows from here
  geometry.js      the mesh toolkit: sweep(), panelSurface(), roundedBox, horn, deformers
  rig.js           68-bone skeleton definition
  body.js          the flesh: torso, sculpted skull, ears, hands, feet, tail
  gear.js          clothing + armour, and the *anchors* for anything that swings
  weapons.js       Slag-Cleaver, Sputterhawk sidearm, vent-plate buckler
  skinning.js      automatic skin weights (inverse distance + Laplacian smoothing)
  anim.js          procedural pose functions baked into THREE.AnimationClips
  springbone.js    ears and tail, driven by gravity and the skeleton's own motion
  dynamics.js      verlet strands + cloth for straps, hoses, necklace, cape, kilt
  textures.js      canvas-generated PBR sets: skin, leather, cloth, metal, glow, ground
  materials.js     material key -> THREE.Material
  env.js           procedural equirect sky, PMREM'd, so the metals have something to reflect
  world.js         the alien flat: clipmap terrain, gas giant, monoliths, pylons, dust
  character.js     assembles all of the above into one SkinnedMesh + one update()
```

## Notes worth knowing

- **Rest rotations are identity.** Every bone's axes are world-aligned in the
  bind pose and only the offsets differ, so hand-authored poses read as anatomy
  and mirroring a pose is just negating the Y and Z components.
- **Poses are quaternions, not euler triples.** `anim.js` composes them about
  fixed parent axes with `seq()`, which removes euler-order ambiguity entirely.
- **Ears and tail are skeleton bones**, so they run on a spring-bone solver
  (`springbone.js`) and the skin deforms with them. Straps, pouches, the
  necklace, the hose, the cape and the kilt are *not* bones and run on the
  verlet solver in `dynamics.js`, colliding against capsules on the skeleton.
- **Sweep winding is load-bearing.** `sweep()` builds a right-handed frame with
  `T = N × B`; a counter-clockwise cross-section must be wound as the code does
  or the whole mesh ends up lit from the inside. `panelSurface()` probes its
  surface's handedness instead of assuming, because `torsoSurface` and
  `domeSurface` disagree.
- **Metals need `scene.environment`.** `MeshStandardMaterial` at metalness ~1
  with nothing to reflect renders black. `env.js` exists for that alone.
- **Light layers don't do what you'd hope**: three tests a light's layers
  against the *camera's*, not each object's, so there's no such thing as a
  hero-only light rig in the standard renderer.

## Docs

- [`docs/RETROSPECTIVE.md`](docs/RETROSPECTIVE.md) — what worked and what went
  wrong building this, including the bugs that renders cannot show you.
- [`docs/PROCESS.md`](docs/PROCESS.md) — the playbook for the next one: contracts
  and delegation, build order, and a proposed five-level validation battery
  (geometry invariants, positional assertions, orientation solving, visual
  contact sheets, structured aesthetic review).

## Developing

```bash
npm run dev -w @vibe-dump/space-goblin      # the app
```

`dev/inspect.html` is a studio turntable for iterating on the character alone —
it is not part of the build. Query params:
`?clip=run|idle|combo&t=0.25&view=front|left|q34|back&dist=1.8&y=0.7&rig=1`.
