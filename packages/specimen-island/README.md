# Specimen Island

A first-person field-biology game on a forgotten dinosaur preserve. Sneak through
jungle and tall grass, scan and dart animals, draw blood while the sedative wears
off — or go loud with the rifles and watch your score bleed. Restore the old
infrastructure and fly the station helicopter to the summit relay.

Everything is procedural: terrain, rivers, jungle, buildings, dinosaurs (rigged
and animated from data), textures and sound. No assets are downloaded.

## Playing

| key | action |
| --- | --- |
| WASD / Shift / Space | move / sprint / jump |
| C | crouch (toggle) — the stealth stance |
| Mouse, RMB | look, aim (scopes on the rifles) |
| LMB | fire; hold on an animal with the scanner |
| 1–5, wheel | scanner, tranq pistol, tranq rifle, hunting rifle, shotgun |
| R | reload |
| E (hold) | interact: lockers, ladders, generator, procedures on sedated animals |
| G / T / H / F | throw stone (distraction) / flare (deterrent) / medkit / flashlight |
| M / J | map / field journal |
| helicopter | Space/Shift collective, W/S pitch, A/D slide, mouse yaw, V camera, E exit |

Scoring lives in `src/game/scoring.js`: scans and procedures earn points (×1.5 if
the animal never noticed you), every kill or overdose costs the species' penalty.

## Architecture

The game is built as **data + services + systems**, so most iteration is editing
a table rather than code.

```
src/
  main.js            composition root: builds the shared context G, runs the loop
  core/              engine-agnostic utilities
    events.js        pub/sub bus — the only way systems talk to each other
    input.js         action-mapped input (bindings table)
    rng.js noise.js  seeded randomness, simplex noise
    mathx.js         angles (yaw 0 = -Z = north), damping, segment distance
    spatial.js       uniform grid for colliders
  data/              everything a designer touches
    species.js       body plan, temperament, senses, sedation, science values
    weapons.js       guns, darts, hit zones, throwables
    items.js         inventory caps, start kit, caches, loot tables
    objectives.js    the expedition, as unlock/complete rules
    world.js         island layout: mountain, river, lake, POIs, roads
    lore.js          notes left by the last team (each teaches a system)
  world/
    island.js        heightfield + water + biomes + vegetation density + cover
                     grids (pure data, no three.js)
    terrain.js water.js sky.js vegetation.js structures.js fx.js textures.js
    physics.js       heightfield + cylinders + rotated boxes; boxes double as floors
  actors/
    rig.js           species body plan -> bones + one skinned mesh
    animator.js      intents (speed, look, graze, roar, down...) -> bone poses
    vitals.js        health and the sedation model (absorb, KO, wake, overdose)
    perception.js    sight (FOV, LOS, visibility), hearing (noise bus), smell (wind)
    brain.js         temperament-driven state machine
    creature.js      composes the above; locomotion and steering
    ecology.js       herds, persistent records, load/unload around the player
  player/            controller, weapons, view models, darts, interaction, science
  game/              stealth model, flags/stats, scoring, objectives runner
  vehicles/          helicopter
  audio/             procedural Web Audio (guns, voices, ambience, rotor)
  ui/                HUD, map, journal, menus
```

### Recipes

- **Add a species:** one entry in `data/species.js` (and its id in
  `SPECIES_ORDER`). The `body` block drives the rig — `plan: 'biped' | 'quad'`,
  proportions, and `features` such as `frill`, `horns`, `plates`, `club`,
  `crest`, `quills`. `herds` and `habitat` place it; `temperament` picks its AI;
  `sedation` sets the dart maths.
- **Add a weapon:** an entry in `data/weapons.js`; `kind: 'projectile'` darts
  carry `dose`, `kind: 'hitscan'` bullets carry `damage`. Add a view model in
  `player/viewmodels.js` and a sound case in `audio/audio.js`.
- **Add an objective:** append to `data/objectives.js`; `done` is a `reach`,
  `flag`, `item` or `stat` test. Anything can set a flag (`G.flags.set`) and the
  stats counters are derived from bus events in `game/state.js`.
- **Add a building:** write a prefab in `world/structures.js` with the `Kit`
  (boxes become merged geometry and colliders; `kit.interact()` registers E
  actions) and place it from `buildStructures`, or add a POI in `data/world.js`.
- **Add a plant:** a builder plus a `TYPES` row in `world/vegetation.js`, and a
  density grid in `Island.computeDensities` (which also feeds stealth cover).

### Stealth in one paragraph

`game/stealth.js` computes the player's visibility each frame from stance,
speed, the cover grid under them, daylight and the flashlight, and keeps the
recent noise events. Each animal's `Perception` builds `awareness` from sight
(gated by field of view and line of sight; motion hunters like the tyrant barely
see a still player), hearing (footsteps, shots, thrown stones) and scent (only
downwind). Below 0.35 it is oblivious, up to 1 it investigates, at 1 it has
detected you and its temperament takes over.

### Testing hooks

`window.__G` is the game context and `window.__step(seconds)` fast-forwards the
simulation without rendering, which is how the headless playtests drive it.
`?play` skips the title screen, `?god` makes the player invulnerable, `?seed=N`
grows a different island.
