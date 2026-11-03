# The toy: an arcade battle a 12-year-old gamer would enjoy

The owner, after three rounds: *"I still find the games too realistic to be
fun (eg flying long distances). Prototype an alternate toy version of a
battle, something a 12yo gamer could enjoy."* This is the brief for a
**prototype**: a vertical slice, built fast, meant to be played and judged,
not a contract. It lives beside the record and the wargame and borrows
their models; it does not touch their rules.

## 1. The game in one breath

**Hold the line.** You fly one fighter-bomber over your carrier. For three
minutes, waves of enemy aircraft and ships come at you and at her; you shoot
the aircraft down, bomb and torpedo the ships, and at two minutes the
battleship arrives: knock out her turrets one by one and finish her. Score,
combos, three lives, instant respawn, a high score. Everything is within
a kilometre and something happens every few seconds.

## 2. What "fun" means here (the checklist the prototype is judged by)

- The first enemy is in your sights within **5 seconds** of pressing start,
  the first hit within 10, the first explosion within 20.
- Never more than **5 seconds** without a target in view; a new thing every
  30 seconds (a new wave, a new ship type, the boss, her turrets, her end).
- **One stick and two buttons**: steer, fire, drop. The aircraft always
  flies forward; no throttle, no stall, no height to manage beyond up and
  down; the sea bounces you back up; the arena edge turns you around.
- **Generous**: big hitboxes, guns that walk onto the target, bombs and
  torpedoes that lock on when a ship sits in the reticle for a second and
  then home a little; enemy aim poor; your health regenerates when you are
  not being hit; three lives and a two-second respawn over the carrier.
- **Loud feedback**: hit flashes and sparks, damage numbers, a combo
  counter (×2 to ×5) that fades if you stop hitting, *SHOT DOWN* and
  *SUNK!* stamps, a second of slow motion on a sinking, screen shake,
  wave banners (*WAVE 2*), the carrier's health bar, your own, the score,
  and a boss bar with her turrets as segments.
- **Short**: three minutes to the end screen (score, best combo, ships
  sunk, aircraft shot down, accuracy, your high score, *Play again*,
  *Other side*).
- **60 frames a second on an integrated GPU**: at most 12 enemy aircraft
  and 6 ships alive at once, the existing low-poly kits, pooled effects.

## 3. Shape

- **Entry**: a third door on each battle's card on the table, *Arcade*,
  beside *Enter the battle* and *Play it as a wargame*; `#toy=<box>&side=jp|us`.
  The start screen: choose your side (United States: a Wildcat over an
  escort carrier against Zeros, destroyers, cruisers and Yamato; Japan: a
  Zero over Akagi against Wildcats, Fletchers, a cruiser and Washington),
  one line of controls, the label *A toy, not the record.*
- **Arena**: the box's sea and sky (the Samar box for the US side, Midway's
  for the Japanese) with the real terrain under it where there is any,
  1 km across for the action, the carrier at its centre steaming slowly.
- **Waves** (US side; mirrored for Japan): 0:00 three Zeros; 0:30 two
  destroyers from the east plus three Zeros; 1:00 a cruiser with flak and
  five Zeros; 1:30 four Zeros that go for the carrier; 2:00 Yamato with
  three turrets as weak points (each a target with its own health), her
  secondary flak, and a final magazine hit with the slow motion; 3:00 the
  end screen if she is still afloat. Difficulty rises a notch each wave;
  the carrier's health decides nothing until it reaches zero, which ends
  the game early (*The carrier is lost*).
- **Weapons**: guns (held, a heat bar that cools), bombs (three, reload by
  flying through the ring over your carrier or every 20 s), one torpedo
  per reload that only arms low over the water. Hits are generous; the
  turrets and the magazine are big glowing targets when they are vulnerable.
- **Enemies**: aircraft fly simple pursuits with telegraphed turns and
  fire tracer when lined up; destroyers and cruisers steer toward the
  carrier and fire flak bursts you can see and dodge; Yamato shells the
  carrier from 800 m and her turrets track you.
- **Controls**: mouse or arrows/WASD to steer (the nose follows the
  pointer, auto-level when centred), left button or Space to fire, right
  button or Shift to drop; touch: a stick, *fire* and *drop*, landscape
  best, portrait allowed; a gamepad if present (left stick, A, B).
- **Camera**: chase, a little loose, with shake; a quick cut to the
  sinking for the slow-motion second and back.
- **Sound**: none in the prototype (the app has none); say so.

## 4. Words

Machines, never people: *shot down*, *sunk*, *hit*, *lost*. In the toy the
words *score*, *combo*, *wave* and *boss bar* are allowed; *kill* is not.
No slur, no count of people. The what-if label on the start screen; the
end screen says nothing about the record.

## 5. Code

- `src/toy/**`, self-contained: its own loop, physics (kinematic),
  spawner, enemy AI, weapons, damage, scoring, HUD and screens, touch and
  gamepad; it imports the kits generator (`src/battle/kits/`), the box
  pack's ground and sea from the box scene's modules, the sky, and the
  effects pool, and nothing from the record or arena sims. Under 3,000
  lines.
- `src/link.js` and `src/ui/card.js`: the door only. `src/app.js`: the
  hash. Nothing else outside `src/toy/` changes.
- `tools/smoke-toy.mjs`: a scripted bot (steers at the nearest target,
  fires, drops when locked) plays both sides to the end screen under
  SwiftShader: no console errors, the waves and the boss arrive on time,
  the end screen's numbers are consistent, frame time and heap reported,
  the phone bounding-box check for the toy's HUD at the six sizes.

## 6. Delivery

One agent, on the branch, small commits, the repo's style and trailers,
`dist/` rebuilt and committed last, no push. The report: what was built,
the checklist of §2 with how each line was met (measured where it can
be), screenshots looked at (start, the first dogfight, a bombing run, the
boss with her turrets, the sinking, the end screen, a phone), what is
still rough, and three suggestions for the next iteration if the owner
likes it.
