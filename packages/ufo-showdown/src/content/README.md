# Content packs

A content pack is a folder here with an `index.js` whose default export adds
levels, bosses and enemy types to the game:

```js
export default {
  levels: { asteroids: LevelDef },
  bosses: { krax: BossDef },
  enemies: { rock: EnemyDef },
}
```

`main.js` imports every pack and merges these into its registries at startup.
A mission in `../missions.js` names its `level` and `boss` by these keys. Keys
are global, so prefix anything generic with the pack's name.

Packs never edit `main.js`. They get everything through the game API object,
passed to every hook as `g`.

## The game API: `g`

| member | what it is |
| --- | --- |
| `g.W`, `g.H` | world size. Height is at least 800 and width at least 640; a wide window gives more width. Origin is top-left. |
| `g.playerTop()` | ships fly between this y (half-way down) and `H - 48` |
| `g.time` | seconds since load; use it for animation |
| `g.phase`, `g.phaseT` | `intro` → `main` → (`warning` → `boss`) → `clear` / `victory`; seconds in phase |
| `g.mission` | the mission object (`difficulty` 1–5, `fire`, `name`, …); `g.difficulty` for short |
| `g.numPlayers` | 1 or 2 |
| `g.players` | ships: `{ id, x, y, vx, vy, alive, out, invuln, hitR, lives, score, powers, carry, pal, paint }` |
| `g.enemies`, `g.eShots`, `g.pShots`, `g.bubbles`, `g.lasers` | live arrays. **Re-read them through `g` every frame**: they're replaced as dead things are filtered out. `g.eShots = []` clears enemy bullets. |
| `g.boss` | the boss object while one is up, else `null` |
| `g.debug` | `true` when the page was opened with `?debug` |
| `g.alive()`, `g.nearestPlayer(x, y)` | ships currently flying; the closest one (or `null`) |
| `g.spawn(type, x, y, fields)` | add an enemy of a registered type; `fields` are copied onto it |
| `g.later(seconds, fn)` | run `fn` after a delay (dropped if the mission ends first) |
| `g.shoot(x, y, angle, speed, color, r = 6)` | one enemy bullet. Angles in radians, `Math.PI / 2` is straight down |
| `g.aimed(x, y, n, spread, speed, color, target?)` | `n` bullets fanned around a ship |
| `g.fan(x, y, n, width, speed, color, center?)`, `g.ringShot(x, y, n, speed, color, offset?, r?)` | patterns |
| `g.hurtPlayer(p)` | the one way to damage a ship. Handles shields, Phoenix, invulnerability, lives and dropping a carried item |
| `g.damageEnemy(e, dmg, owner)` | handles score, explosion, bubble drops and `onDeath` |
| `g.damageBoss(b, dmg, owner, x, y)` | hits a boss; it dies at 0 hp |
| `g.startBossDeath(b)` | kill a boss outright; plays its death sequence |
| `g.bossEnter(b, dt)` | slides `b.y` down to `b.ty`; returns `true` while still arriving (the boss is invulnerable then) |
| `g.hpMult()` | 1.5 with two players; scale boss hp by it |
| `g.addScore(owner, pts, x?, y?)` | points for player `owner` (with a pop-up when x/y are given) |
| `g.popText(x, y, text, color, size = 18, life = 1.1)` | floating text; returns it, so you can change its `rise` speed (36 units/s) |
| `g.canFire(e)` | whether a formation saucer is in a spot to shoot, for telegraphing it |
| `g.warp(n)` | starfield speed: 1 is cruising, 6+ is warp. Reset it in `setup` |
| `g.explode(x, y, color, size = 1)`, `g.sparks(x, y, color, n)`, `g.splash(x, y, color)` | effects |
| `g.dropBubble(x, y, type?)` | a power-up bubble (`shield` `triple` `rapid` `speed` `heart` `nova`, random if omitted) |
| `g.banner(sub, title, cls?)` | big centre banner; `cls` is `''`, `'warn'` or `'clear'` |
| `g.shake(n)`, `g.flash(n)` | screen shake (try 6–20) and white flash (0–1) |
| `g.cutscene(on, { onSkip })`, `g.inCutscene` | a scripted moment: while on, ships ignore their controls, don't shoot and can't be hurt; the HUD gives way to letterbox bars; Enter or a tap calls `onSkip`, which should wrap the scene up and call `g.cutscene(false)`. Enemies keep running, so hold your own fire during it |
| `g.levelDone()` | the level's main part is finished: on to the boss, or to the finish if there isn't one |
| `g.sfx` | sounds from `../../audio.js` `sfx`: `zap hitTick ting pop(size) boom hurt shieldPop bubble nova laserWarn laser siren revive clear win lose select start buy deny` |
| `g.ctx`, `g.FONT` | the canvas context (already in world units) and the Bungee font stack |
| `g.rand(a, b)`, `g.pick(arr)`, `g.clamp(v, a, b)`, `g.near(ax, ay, bx, by, r)`, `g.TAU` | maths |

Bungee only has Latin glyphs. Arrows and other symbols fall back to a thin
system font, so spell them out (`>>>`) or draw them.

For a sound of your own: `import { synth } from '../../audio.js'`, then
`synth.tone({ type, from, to, dur, vol, at })` or `synth.noise({ dur, vol, freq, to })`.
For art: `import { drawSaucer, drawAlien, drawStar, drawIcon, drawBubble } from '../../art.js'`
and `import { hexA } from '../../stars.js'`.

Ships are drawn after enemies and the boss. Player and enemy bullets, lasers
and particles are drawn above everything except `drawTop` and the HUD.

## LevelDef

Every hook is optional. A level keeps its own state in module variables and
resets it in `setup`. The same level runs again on retry.

```js
{
  setup(g) {},          // mission (re)starting: reset your state here
  start(g) {},          // the intro banner is done and the main phase begins
  update(g, dt) {},     // every frame of the mission, in every phase. Check
                        // g.phase === 'main' before spawning level content;
                        // keep a hazard going into the boss fight if it should
  progress(g) {},       // 0..1 for the default HUD bar during the main phase
  hud(g, ctx) {},       // replaces the default top-centre HUD (mission name +
                        // progress bar) during intro/main. Draw within y 0..60,
                        // centred on W/2, at most min(W * 0.46, 520) wide;
                        // player HUDs sit in the top corners
  drawBack(g, ctx) {},  // behind the boss and enemies
  drawMid(g, ctx) {},   // over the boss and enemies, under bubbles, ships and
                        // bullets — fog goes here
  drawTop(g, ctx) {},   // over everything except floating text and the HUD
  icon(ctx, w, h) {},   // the mission-map picture, w = 80, h = 50 units (drawn
                        // at 2x); fill the whole box, the background is #0b0726
  noFire: false,        // ships don't shoot (and neither do drones)
  noBubbles: false,     // no power-up bubbles drift down on their own
}
```

When the main part is over, call `g.levelDone()` once.

## BossDef

```js
{
  name: 'Krax',                  // warning banner and HUD
  warnSub: 'Warning!',           // optional banner sub-line
  hudName: (b) => '…',           // optional HUD name that changes with the fight
  create(g) {                    // return the boss's own fields
    const hp = Math.round(120 * g.hpMult())
    return { x: g.W / 2, y: -150, ty: 170, hp, maxHp: hp }
  },
  update(b, dt, g) { if (g.bossEnter(b, dt)) return /* … */ },
  shot(b, x, y, owner, g) {},    // a player laser at (x, y): return true if it
                                 // hit the boss (the laser is spent), false to
                                 // let it fly on. Call g.damageBoss to hurt it,
                                 // or sparks + sfx.ting for an armoured part
  hits(b, p, g) {},              // true if ship p is touching the boss body
  nova(b, owner, g) {},          // a Nova blast went off (optional)
  draw(b, g, ctx) {},
  hud(b, g, ctx) {},             // optional extra HUD under the boss bar (y ≥ 60)
  explodeAt(b) { return [x, y] },// random point on the hull for the death fireworks
  defeated(b, g) {},             // optional: tidy up your entities
}
```

The game adds `t`, `flash` (fades from 1), `hurt`, `tilt`, `entering` and
`dying` to every boss. While `b.dying > 0` the game runs the death sequence and
does not call `update`, `shot` or `hits`. The HUD bar shows `b.hp / b.maxHp`.

## EnemyDef

```js
{
  hp: 3, r: 30, score: 150,
  light: '#ffb02e',        // explosion colour
  boom: 0.8,               // explosion size
  drop: 0.09,              // chance to drop a bubble
  update(e, dt, g) {},     // optional: full control of movement and shooting.
                           // Without it the enemy is a saucer on the formation
                           // paths. e.t (age) and e.flash are kept for you; set
                           // e.gone = true to remove it quietly
  draw(e, g, ctx) {},      // optional; default is a saucer
  onDeath(e, g, owner) {}, // e.g. split a rock into smaller ones
  armored(e, g) {},        // optional: return true to make a laser bounce off
  keepOffscreen: false,    // true: don't auto-remove when it wanders off screen
}
```

Enemies hurt a ship on contact and take 3 damage when they hit it.

## Carrying things: `p.carry`

A level or boss can give a ship something to haul:

```js
p.carry = { slow: 0.8, draw(ctx, p, t) {}, onDrop(p) {} }
```

The ship flies at `slow` × its speed. `draw` runs right after the ship is
drawn. If the ship is knocked out, the game clears `p.carry` and calls
`onDrop(p)`. That's the place to leave the item floating where the ship was.
To hand it over, clear `p.carry` yourself.

## Lasers

`g.lasers.push({ x, y0, w, warn, active })` is a vertical beam from `y0` to the
bottom of the screen. It shows a flickering warning line for `warn` seconds,
then hurts for `active` seconds. Optional extras:

- `track(L, g)` moves it every frame.
- `draw(ctx, L, H, t)` replaces the red look. Check `L.warn > 0` for the warning stage.

## Testing a pack

Add `?debug` to the page URL for `window.__ufo`:

- `start(id, players)`
- `god(on)`
- `give(i, type)`
- `steer(i, x, y)`, which moves a ship like a finger drag
- `skip()`, which calls `levelDone`
- `setSave(patch)`
- `g`

`?mission=<id>` jumps straight into a mission from the 1/2 player choice, and
`&boss` skips to its boss.
