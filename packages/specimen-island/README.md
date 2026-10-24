# Specimen Island

A first-person field-biology game on a forgotten dinosaur preserve. Sneak through
jungle and tall grass, scan and dart animals, draw blood while the sedative wears
off, photograph them — or go loud with the rifles and watch your score bleed.
Restore the old infrastructure, ride the stabilized trail bike, drive the ranger jeep and fly the station
helicopter to the summit relay — or take the gunship the garrison left behind and
lock its heat-seeking missiles onto anything warm, at a price.

Everything is procedural: terrain, rivers, jungle, buildings, dinosaurs (rigged
and animated from data), textures and sound. No assets are downloaded.

## Playing

Xbox controllers work through the browser's standard Gamepad API, using USB or
wireless (Bluetooth or an Xbox wireless adapter where supported by your OS and
browser). Connect/pair in the operating system first, open the game over HTTPS
or localhost, and press a controller button to let the browser discover it.
The title and Settings show connection status. Controllers with a nonstandard
mapping are reported rather than assigned guessed bindings. If audio is silent,
click the page once to allow browser audio playback.

| Xbox control | action |
| --- | --- |
| Left stick / click left stick | analog movement / hold to sprint |
| Right stick / click right stick | look / flashlight or jeep headlights |
| A / B | jump / toggle crouch |
| Y (hold) / X | interact / reload |
| LT / RT | aim / fire, scan, photograph or jab |
| LB / RB | previous / next tool; zoom in / out with the Field Camera raised |
| D-pad up / down / left / right | map / medkit / stone / flare |
| View / Menu | journal / pause or resume |
| Vehicle: left / right stick | drive and steer or pitch and slide / look or turn |
| Vehicle: Y / LB | board or exit / seat or chase camera |
| Jeep: A; helicopter: A / B | handbrake; climb / descend |
| Gunship: LT (hold) / RT | missile seeker / fire a missile |
| Menus: D-pad or left stick, A, B | navigate, select, back |
| Menus: left / right, right stick | adjust settings, scroll long sheets and journal |

Controller look sensitivity and invert-Y are in Settings. Both sticks have a
radial deadzone to prevent drift. Keyboard and mouse remain usable alongside the
controller. Disconnecting or leaving the page pauses play; reconnect and resume
explicitly. Held menu buttons and reconnecting triggers must be released before
they can trigger gameplay actions.


| key | action |
| --- | --- |
| WASD / Shift / Space | move / sprint / jump |
| C | crouch (toggle) — the stealth stance |
| Mouse, RMB | look, aim (scopes on the rifles) |
| LMB | fire; hold on an animal with the scanner |
| 1–7, wheel | scanner, tranq pistol, tranq rifle, hunting rifle, shotgun, Field Camera, jumbo syringe |
| Field Camera [6] | RMB raises it to the eye, the wheel is then the zoom ring, LMB takes the photo (1 s to wind on) |
| Jumbo syringe [7] | from the keeper's shed at Paddock C's gate: LMB thrusts the needle into whatever is within reach (under 3 m), emptying one cartridge into it; a miss costs only the swing, a fresh cartridge takes 4 s. UNDERFOOT on the readout: a sauropod tramples you when it walks. The Field Lab's cold store restocks cartridges once the lab has power |
| R | reload |
| E (hold) | interact: lockers, ladders, generator, procedures on sedated animals, field repair of a wreck |
| G / T / H / F | throw stone (distraction) / flare (deterrent) / medkit / flashlight |
| M / J or Tab | map / field journal (species, photo album, ledger, field manual) |
| Esc | pause — Resume, Settings, Field journal |
| any vehicle | E at a door to board, E to get out once stopped or landed, V camera (seat / chase) |
| jeep | W/S drive and reverse, A/D steer, Space handbrake, F headlights, mouse look |
| helicopter | Space/Shift collective, W/S pitch, A/D slide, mouse yaw |
| gunship | as the helicopter; hold RMB for the missile seeker, LMB fires a missile; hold E at the munitions point by its pad to rearm |

Boarding either vehicle also shows its controls for a few seconds, and the Settings
sheet (from the title or the pause menu) lists them all. Settings holds Graphics
(Auto, Low, Medium, High), mouse sensitivity, volume and invert-Y; they are kept
in `localStorage`.

Scoring lives in `src/game/scoring.js`: scans and procedures earn points (×1.25 and
×1.5 if the animal never noticed you), each species' first photo pays its photo value
scaled by quality (a better retake pays only the difference), and every kill or
overdose costs the species' penalty.

### After the expedition: the Full Survey

Extraction at the Supply Dock ends the expedition with a debrief. **Continue — Full
Survey** carries on where you stand with a second objective chain: scan every
species, draw blood from every species (everything collected on the expedition
counts), fetch the keeper's jumbo syringe from Paddock C for the brachiosaurs,
then get the sample set into the Field Lab's cold store. The HUD counts each set
("Blood Bank 6/10") and names what is still missing; the journal's Species tab
marks what each animal still owes the survey (with a scan / blood / photo check
on every card) and, for species you have not met, gives the Foundation's sighting
notes — size, company and haunts — instead of the name. Nothing restocks the
island, so a species wiped out before its blood was drawn owes a tissue sample
from a carcass instead, and the HUD and journal say so. Finishing pays a bonus
into the ledger and opens a second debrief, "Survey complete". **New expedition**
on either debrief starts over.

### Stabilized trail bike

A rideable motorbike waits on clear ground at the inland end of the Supply Dock,
marked **BIKE** on the map. Approach it and press **E / Xbox Y** to mount.
Use **W/S + A/D / left stick** to ride, reverse and steer; **Space / A** brakes;
**F / right-stick click** controls the headlight; **V / LB** switches between
rider and chase cameras. Stop before pressing **E / Y** to dismount.

Its automatic gyroscopic stabilizer is always on. It holds the bike upright at
rest, banks into turns up to 22 degrees, damps wobble and levels out as steering
returns to centre. The exposed green flywheel spins and the HUD shows
**STABILIZER ON**. The bike has suspension, narrow collision geometry, an engine
sound, damage, field repair and recovery; the Field Lab pump can service it.
The stabilizer prevents tipping, but collisions and deep water still matter.

### Gunship and heat-seeking missiles

An attack helicopter waits on the far side of the island — on the military
base's helipad, or on clear ground on the north-east plateau — marked
**GUNSHIP** on the map. It flies like the station helicopter (same controls),
only faster and twitchier, armoured against a share of every hit, and thirstier:
it starts with half a tank and refuels at the Field Lab pad pump. Eight
missiles hang under its stub wings.

Hold **RMB / LT** and the seeker looks along your sight — the middle of the
screen, in the chase view or the cockpit — through a ring as wide as its lock
cone. It picks the strongest heat source in line of sight: big animals glow,
small ones barely register (a compy never locks), leaves hide some of it, a
burning flare outshines anything alive and an engine that has been running stays
hot for minutes after it stops. The headset growls while it searches, pulses
higher as it builds a lock, and holds one steady note once locked; brackets on
screen follow the target. **LMB / RT** fires: at the lock, or unguided along the
sight when there is none. A missile drops off its rail, lights its motor, steers
by proportional navigation, trails smoke and goes off at its closest pass or on
impact through the shared explosion. A flare burning hotter than the target in
the missile's view pulls it off; a target that stays out of view for half a
second is lost, and the missile flies on until it self-destructs.

The Foundation bills every launch (−50, hit or miss) and every animal a missile
kills costs that species' kill penalty, so the ledger shows exactly what going
loud cost. Land on its pad, climb out, and hold **E / Y** at the munitions point
beside it to load all eight rails again.

## Architecture

The game is built as **data + services + systems**, so most iteration is editing
a table rather than code.

```
src/
  main.js            composition root: builds the shared context G, runs the loop,
                     the settings/Auto wiring, the title's attract camera
  core/              engine-agnostic utilities
    events.js        pub/sub bus — the only way systems talk to each other
    input.js         action-mapped input (bindings table)
    rng.js noise.js  seeded randomness, simplex noise
    mathx.js         angles (yaw 0 = -Z = north), damping, segment distance
    spatial.js       uniform grid for colliders
    quality.js       graphics autodetect: a first guess from the GPU name, cores
                     and screen, then a frame-time TierController (pure, testable)
  data/              everything a designer touches
    species.js       body plan, temperament, senses, sedation, science values
    weapons.js       guns, darts, the Field Camera, the jumbo syringe, hit zones,
                     throwables, and PHOTO (how a photograph is graded)
    vehicles.js      the helicopters', jeep's and bike's tune tables: hull and damage,
                     colliders, feedback, flight handling, surfaces, spawn, ecology
                     streaming, engine heat; GUNSHIP's rails and munitions point
    missiles.js      missile airframes and motors, the launcher's seeker (cone,
                     signal, lock time, decoy margin) and heat signatures
    blasts.js        explosions: radius, damage, hull damage, knock, noise, shake
    encounters.js    guaranteed early herds in sight of the pier and the station
    items.js         inventory caps, start kit, caches, restocking stores, loot tables
    objectives.js    the missions (the expedition, then the Full Survey) as
                     unlock/complete rules
    world.js         island layout: mountain, river, lake, POIs, roads, cleared lots
    lore.js          notes left by the last team (each teaches a system)
  world/
    island.js        heightfield + water + biomes + vegetation density + cover
                     grids (pure data, no three.js)
    terrain.js water.js sky.js textures.js fx.js
    vegetation.js    instanced plants: big-tier LODs and streamed undergrowth,
                     dithered LOD fades, wind sway and parting in the shader
    structures.js    prefabs built with the Kit (merged geometry + colliders +
                     E actions): dock, station, lab, towers, keeper's shed,
                     bridge, wrecks…
    physics.js       heightfield + cylinders + rotated boxes; boxes double as floors
  actors/
    rig.js           species body plan -> bones + one skinned mesh
    animator.js      intents (speed, look, graze, roar, down...) -> bone poses
    vitals.js        health and the sedation model (absorb, KO, wake, overdose)
    perception.js    sight (FOV, LOS, visibility), hearing (noise bus), smell (wind)
    brain.js         temperament-driven state machine
    creature.js      composes the above; locomotion and steering
    ecology.js       herds, persistent records, load/unload around the player
  player/
    player.js        first-person body: walk, sprint, crouch, swim, footsteps
    weapons.js       selection, aiming, firing, reloads, scanner, camera, gadgets
    viewmodels.js    first-person weapon models in their own overlay scene
    projectiles.js   darts, thrown stones, flares
    photos.js        the Field Camera: framing, visibility (physics rays + a small
                     ID render), grading, the album, the shutter's payout
    science.js interaction.js inventory.js
  game/              stealth model, flags/stats, scoring, the missions/objectives runner,
                     blast.js — one explosion (data/blasts.js): fire or spray, noise,
                     damage falling off to animals, the player and vehicles, shake
                     guidance.js — pure seeker and missile maths (signal, lock
                     tracking with decoys, proportional navigation, proximity fuse)
                     missiles.js — heat sources, the Seeker a launcher carries, and
                     missiles in flight: guidance, smoke trail, fuses, blasts
  vehicles/
    vehicle.js       the shared base: boarding/exit, colliders, cameras, AI noise,
                     damage feedback, field repair
    helicopter.js    arcade flight, fuel, landings, rotor — every aircraft, from its
                     tune table (`handling`, `rotor`, `controls`)
    gunship.js       the attack helicopter: model, armour, seeker and missile rails,
                     sight-line chase camera, the munitions point beside its pad
    jeep.js          shared ground handling and ranger 4x4 model
    motorbike.js     trail-bike model, rider, two wheels and active gyro balance
    stabilizer.js    bounded turn lean and automatic return upright
  audio/
    audio.js         procedural Web Audio (guns, voices, ambience, rotor, engine)
    footsteps.js     synthesised footsteps per surface
  ui/
    hud.js           HUD: visibility eye, awareness arcs, target readout, vehicle panel
    lockbox.js       the missile seeker's ring and lock brackets, and what the last
                     missile did
    dose.js          dart (and jab) arithmetic for the target readout and the
                     journal
    viewfinder.js    the camera's frame, focus box, live estimate and polaroid
    map.js journal.js menus.js
```

### Recipes

- **Add a species:** one entry in `data/species.js` (and its id in
  `SPECIES_ORDER`). The `body` block drives the rig — `plan: 'biped' | 'quad'`,
  proportions, and `features` such as `frill`, `horns`, `plates`, `club`,
  `crest`, `quills`. `herds` and `habitat` place it; `temperament` picks its AI;
  `sedation` sets the dart maths (the readout and journal derive their dart
  counts from it by running `actors/vitals.js` forward); `science.photo` is what
  its best photograph can earn.
- **Add a weapon:** an entry in `data/weapons.js`; `kind: 'projectile'` darts
  carry `dose`, `kind: 'hitscan'` bullets carry `damage`, `kind: 'melee'`
  thrusts (the jumbo syringe) inject `dose` into an animal within `reach` and
  spend their `ammo` only on a hit, `kind: 'scanner'` and `kind: 'camera'` are
  the two tools (the camera's grading lives in `PHOTO`). Add a view model in
  `player/viewmodels.js`, a sound case in `audio/audio.js` and a `slotN`
  binding in `core/input.js`; `ui/dose.js` says a melee syringe's dose in jabs.
- **Add a vehicle:** subclass `Vehicle` (`vehicles/vehicle.js`) with a tune
  table in `data/vehicles.js` (`kind`, `hull`, `door`, colliders, `load`, …).
  Implement `buildModel()`, `boardLabel()` and `update(dt, input)` — read input
  only while `occupied`, call `updateCommon(dt, noiseRadius)` and then `sync()`
  to place the model — and override `onEnter()`, `canExit()`, `seatCamera()` /
  `chaseCamera()` as needed. Create it in `main.js` and push it onto
  `G.vehicles`; boarding, exit, damage feedback, field repair and the map marker
  come from the base class. The HUD's vehicle panel switches on `kind`.
- **Add an aircraft:** a tune table spread from `HELI` with its own `kind`,
  `handling` (attitude, thrust, drag, climb, yaw), `rotor` (blade speed, sound
  voice — add one to `ROTOR_VOICES` in `audio/audio.js`), `controls` and
  colliders, and a subclass of `Helicopter` that overrides `buildModel()` (it
  must set `rotor`, `tail`, `disc` and `model`). Anything that flies is
  `aircraft`, which the HUD, sky and wind read.
- **Add a missile or a heat source:** a `MISSILES` entry in `data/missiles.js`
  (motor, turn rate, gimbal, fuse, `blast` preset, `cost`) launched with
  `G.missiles.launch(launcher, from, vel, dir, target, M)`; a launcher carries a
  `Seeker` (`game/missiles.js`), sets its `origin`/`axis` and calls
  `update(dt, on)`. A vehicle's engine heat is its tune's `heat`; anything else
  hot goes into `Missiles.sources()` with a `locate()` case.
- **Add an objective:** append to `data/objectives.js`; `done` is a `reach`,
  `flag`, `item` or `stat` test, `allSpecies` (every species in a stats set such
  as `speciesBlood`; the HUD counts it and its `need` labels what each missing
  species still owes in the journal; `extinct` names a second set that counts
  for a species with none left alive, labelled by `needExtinct`) or `any` of
  several. Anything can set a flag (`G.flags.set`) and the stats counters are
  derived from bus events in `game/state.js`.
- **Add a mission:** an entry in `MISSIONS` and objectives tagged with its id in
  `mission`, one of them `final`. Its objectives stay locked until
  `G.objectives.start(id)` — a mission's debrief offers its `next` as the
  Continue button — and are then tested against everything earned before.
  Completing it emits `mission:complete`, pays its `bonus` and opens its debrief.
- **Add a building:** write a prefab in `world/structures.js` with the `Kit`
  (boxes become merged geometry and colliders; `kit.interact()` registers E
  actions) and place it from `buildStructures`, or add a POI in `data/world.js`
  — or, for a small prefab beside one, a cleared lot (`lots`), which keeps the
  plants off it before anything grows and tells the prefab where to stand.
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

### Graphics: Auto

`core/quality.js` makes a first guess from the WebGL renderer string, core count,
memory and how many pixels the tier would fill, then a `TierController` watches
frame times through the title and the first 20 s of play: slow windows step down
the ladder (tier + pixel ratio), one steady fast stretch earns a single upgrade
that is undone unless frames stay steady, and hitches (frames several times the
median) are ignored. After that only a severe slowdown moves it. An automated
browser (`navigator.webdriver`, as in the gallery thumbnail shot and the headless
playtests) is pinned to Medium and does not adapt — a software rasteriser would
otherwise always look like the slowest machine.

### Controller checks

Run `node --test packages/specimen-island/tests/*.test.js` from the repo root.
`tests/missiles.test.js` flies the guidance against moving targets and checks the
seeker's cone, cover and decoy rules.
For the browser integration check, build this package and run
`node packages/specimen-island/tests/controller-browser.mjs` (Playwright Chromium
required). The checks simulate standard Gamepad API input; a physical USB and
wireless controller should also be checked on the target OS/browser.

### Testing hooks

`window.__G` is the game context and `window.__step(seconds)` fast-forwards the
simulation without rendering, which is how the headless playtests drive it.
`?play` skips the title screen, `?god` makes the player invulnerable, `?seed=N`
grows a different island. `__G.gfx` holds the autodetect's state (`gpu`,
`guess`, `ladder`, `auto` — the live TierController — and the current `tier` and
`pixelRatio`). `__G.gunship.seeker` is the missile seeker (`mode`, `progress`, `target`),
`__G.missiles.flying` the missiles in the air and `__G.missiles.sources()` what
they can see. `__G.objectives.start('survey')` takes up the Full Survey
without finishing the expedition first. `__G.photos.evaluate()` grades the
current view as the shutter would, and `__G.audio.renderStep(surface)` renders
one footstep offline so its envelope can be measured.
