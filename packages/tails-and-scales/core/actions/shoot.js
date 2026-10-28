// Shooting (DESIGN §1.1): who may shoot, at whom and at what odds, and the
// shot itself: a plain volley, a blast weapon's templates (each aimed,
// rolled, scattered on a miss, landed), or a spell (an eruption of thorns
// under the target, or a mesmerizing gaze). (F18) A target locked in combat
// may be shot by any of them: a template hits whoever it lands on, as it
// always has, and a volley's misses may stray into the shooter's own units
// in the fight.
//
// (V3c, DESIGN §4.1 rule 29) A caster has several spells (its type's
// `spells`, data/schema.js) and casts one a shooting phase, the one its
// command names (`sp`; none: its first, which is its ranged weapon): one
// erupting under its target (Thornburst's thorns, Venom Mist's cloud, which
// spares the scenery), one marking its target (Mesmerize, Root Snare's
// snare), or one cast on a friend, the caster itself included, within its
// range and with no need to see it (allySpell: Barkskin's ward, Cold
// Blood's resolve). Every one is the 2D6 cast first, a fizzle on a miss.
//
// Synchronous, like damage.js: what the old code waited on is an event in
// the match's out at the same place (DESIGN §2.3, §4.1 rule 3): the tray's
// title and each row of dice (`tray.open`, `dice`), the beat after a
// template that caught nobody (`pause`), and what the view shows as its own
// event, which the view's handlers play with the old visuals
// (view/index.js, app/flow.js). No logic moves across an emit, and building
// an event draws nothing and changes nothing.
//
//   unit.face        { u, tg }         the shooter turns to its target
//   volley           { u, tg, fx, n }  a volley of n shots flies at tg (the
//                                      view flies a handful of them)
//   blast.aim        { x, z, r }       a template is aimed there
//   blast.scatter    { from, to, d }   it missed, and scatters d" away
//   blast.fire       { u, to, fx }     u throws it; it flies to `to`
//   blast.land       { x, z, r, fx }   it lands: an explosion, a ring
//   spell.cast       { u }             u's cast roll made it
//   spell.fizzle     { u }             it didn't
//   spell.thorns     { u, x, z, r, fx } an eruption: thorns burst up through
//                                      the turf (fx 'thorns'), or (V3c) a
//                                      venom mist billows up (fx 'mist');
//                                      the event keeps the first one's name
//   spell.fade       { u }             and sink back, once they are done
//   spell.gaze       { u, tg }         u's gaze reaches tg
//   spell.mesmerized { u, tg }         tg is mesmerized
//   spell.snare      { u, tg }         (V3c) roots burst up round tg and
//                                      bind it
//   spell.ward       { u, tg, fx }     (V3c) u's spell settles on its
//                                      friend tg: a ward (fx 'bark') or a
//                                      resolve (fx 'coil')
//
// Units go by id. `fx` is the weapon's look, which the rules carry to the
// view and never test. Nothing here ends the action (its state line in the
// trace, the flags, the labels) or calls finishAction: the `shoot` handler
// (core/commands.js), the only path to doShoot, calls core/engine.js's
// finishAction after it (DESIGN §2.2's (R6a) note).
// The orders of §4.1 rule 4 (a template's draws; a blast's victims; the
// gaze's D3) and rule 5 (the dice roll even when there is no save to make)
// are kept exactly. (V3c) A snare and a spell on a friend draw nothing
// but their cast; every save reads the target's own (rules.js svOf: one
// better while warded).
import { hitNeed, roll, d6, passes, woundNeed, saveNeed, attackCount, svOf } from '../rules.js'
import { draw } from '../rng.js'
import { hypot, hypot3, sin, cos } from '../dmath.js'
import { emit, log } from '../journal.js'
import { refreshNav } from '../match.js'
import { alive, enemiesOf, gap, inCover, isEngaged, mx, mz, sight, statusOf, floorAt, groundY, fightOf } from '../queries.js'
import { damage } from './damage.js'
import { HAZARDS } from '../../data/hazards.js'
import { kegsIn } from '../terrain/terrain.js'

// (V3c) The weapon a shot or a cast uses: the unit's ranged weapon, or with
// `sp` its spell of that index; null for a spell it doesn't have (the
// `shoot` command refuses one first: core/commands.js).
export const weaponOf = (u, sp) => (sp === undefined ? u.t.ranged : u.t.spells?.[sp] ?? null)
// (V3c) A spell cast on a friend: a ward (Barkskin) or a resolve (Cold
// Blood).
export const allySpell = (w) => !!w && !!(w.ward || w.resolve)

// May `u` shoot (or (V3c) cast) at all this phase: one shot or one spell a
// phase, as ever (its `shot` flag). (F9a) A rider can't shoot while aboard:
// the firing deck, from which up to `fire` rider units shoot from the
// deck's height, is F9c's (DESIGN §4.2.5), and a rider is off the table
// until then.
export function canShoot(G, u) {
  const w = u.t.ranged
  if (!w || !alive(u) || u.flags.shot || u.aboard) return false
  if (u.mesmerized || u.flags.fellBack || isEngaged(G, u)) return false
  if (u.flags.advanced && !w.assault) return false
  return true
}

// (F17, DESIGN §4.2.4) Lobbing from height. A lobbed weapon (a blast or an
// indirect one, but never a spell: the thorns erupt under the target and the
// gaze is no lob) carries farther from higher ground, as a thrown thing
// does: with R its printed range and h the drop (the shooter's floor less
// the target's, negative firing up), it reaches √(R² + 2hR), the farthest a
// projectile launched at the speed that carries it R on the flat lands from
// h higher, at its best angle (scale-free, so the table's inches serve).
// Direct fire (a sling's, a spit's, a javelin's: flat arcs) reaches its
// printed range from anywhere.
export const lobbed = (w) => !!w && !w.spell && !!(w.blast || w.indirect)

// How far `u`'s ranged weapon (or (V3c) its spell `sp`) reaches `tg` from
// `from` (where it stands, by default; the AI scores the cells it might
// move to), or with no `tg` the ground under it (the overlay's ring: h its
// own floor). Without height the
// printed range itself, the classic expression (§4.1 rule 18: a path of its
// own, never the formula with h = 0); with it, a lobbed weapon's reach as
// above (level, the printed range exactly), anything else the printed range.
// A drop so far below that nothing reaches (R² + 2hR ≤ 0: firing up more
// than half the range) reaches 0. Pure, under the lock like every query:
// shotInfo's range test reads it, and the AI's (core/ai/score.js), and
// through the queries the tooltip's inches and the overlay's ring.
export function rangeOf(G, u, tg = null, from = u.pos, sp = undefined) {
  const w = weaponOf(u, sp)
  if (!G.nav.hasHeight || !lobbed(w)) return w.range
  const R = w.range, h = floorAt(G, from.x, from.z) - (tg ? groundY(G, tg) : 0)
  if (h === 0) return R
  const q = R * R + 2 * h * R
  return q > 0 ? Math.sqrt(q) : 0
}

// May `u` shoot `target`, and at what odds: { ok, range, reach, visible,
// cover, seen, total, mod, need, fight, under }, or { ok: false, why }.
// (F17) `range` is the gap between the two bases, `reach` how far the
// weapon carries to this target (rangeOf: the printed range but for a lob
// from or at height).
//
// (F18, DESIGN §4.1 rule 27) A target locked in combat may be shot, by any
// ranged weapon and at no modifier: the cost is the risk to the shooter's
// own units in the fight. `fight` says what that is (fightOf: u's units
// engaged with the target, their models and the target's; null when none
// of u's is in it), and `under`, for a blast weapon, who of u's side a
// template landing square on the target would catch (friendsUnder): what
// the tooltip warns of. The shooter itself still may not shoot while it is
// engaged (canShoot).
//
// (V3c) `sp` names a caster's spell (none: its ranged weapon, its first).
// A spell cast on a friend (allySpell) takes a unit of the caster's own
// side, the caster itself among them, within the spell's range, seen or
// not: { ok, range (the gap; 0 for the caster), reach (the spell's range),
// ally: true }. Anything else is shot at an enemy, never a friend. Neither
// asks whether the target stands (the command's own rule,
// core/commands.js mine and foe). (F9a, at the V3 merge) Neither takes a
// rider either, a friend's or a foe's: it is inside its vehicle, and its
// hull is the target, as the command has it (core/commands.js foe and
// friend, shootTargets' pool); refused here so that the table's odds and
// the click it sends say so rather than offer what legal() refuses.
export function shotInfo(G, u, target, sp) {
  const w = weaponOf(u, sp)
  if (!w) return { ok: false, why: `no spell ${sp}` }
  if (allySpell(w)) {
    if (target.side !== u.side) return { ok: false, why: `${w.name} is cast on a friend` }
    if (target.aboard) return { ok: false, why: `${target.t.short} is inside a vehicle` }
    const range = target === u ? 0 : gap(u, target)
    if (range > w.range) return { ok: false, why: `out of range (${range.toFixed(1)}" / ${w.range}")` }
    return { ok: true, range, reach: w.range, ally: true }
  }
  if (target.side === u.side) return { ok: false, why: 'one of your own' }
  if (target.aboard) return { ok: false, why: `${target.t.short} is inside a vehicle` }
  const range = gap(u, target), reach = rangeOf(G, u, target, u.pos, sp)
  if (range > reach) return { ok: false, why: `out of range (${range.toFixed(1)}" / ${reach === w.range ? w.range : reach.toFixed(1)}")` }
  const s = sight(G, u, target)
  if (!s.visible && !w.indirect) return { ok: false, why: 'no line of sight' }
  let mod = 0
  if (w.heavy && u.flags.moved) mod++
  if (w.indirect && !s.visible) mod++
  return { ok: true, range, reach, ...s, mod, need: hitNeed(u.t.BS, mod), fight: fightOf(G, u, target), under: w.blast ? friendsUnder(G, u, target, w) : null }
}

// (F18) Who of `u`'s own side (u itself among them: a template spares
// nobody) a template of its weapon landing square on `tg` would catch: the
// aim's centre, before the aim's offset or any scatter. [{ v, under }] in
// G.units order, `under` the count of v's models under it, by blastLands'
// own test (modelsUnder); [] for a weapon with no template. The tooltip's
// warning and the AI's cost (core/ai/score.js) read it; nothing rolls on it.
// (F9a) A rider is never under a template (blastLands' rule): its hull is.
// ((V3c) `w`: the weapon, a caster's spell; its ranged weapon by default)
export function friendsUnder(G, u, tg, w = u.t.ranged) {
  if (!w?.blast) return []
  const land = { x: tg.pos.x, z: tg.pos.z }, ly = G.nav.hasHeight ? floorAt(G, land.x, land.z) : 0
  const out = []
  for (const v of G.units) {
    if (v.side !== u.side || !alive(v) || v.aboard) continue
    const under = modelsUnder(G, v, land, ly, w)
    if (under.length) out.push({ v, under: under.length })
  }
  return out
}

// Whom `u` may shoot now, or (V3c) cast its spell `sp` on: the enemies
// shotInfo takes, or for a spell cast on a friend the standing friends it
// takes (the caster among them), in G.units order. ((F9a, at the V3 merge)
// A rider is off the table for a spell on a friend too, as it is for every
// shot: its hull takes one, not it.)
export function shootTargets(G, u, sp) {
  if (!canShoot(G, u)) return []
  const w = weaponOf(u, sp)
  if (!w) return []
  const pool = allySpell(w) ? G.units.filter((f) => f.side === u.side && alive(f) && !f.aboard) : enemiesOf(G, u)
  return pool.filter((e) => shotInfo(G, u, e, sp).ok)
}

// (V3c) Whether `u` has anything to shoot at or cast on now (canAct's
// shooting phase): a target for its ranged weapon, or for a caster one for
// any of its spells (a spell cast on a friend always has the caster
// itself). For a unit with no spells, its weapon's targets, as ever.
export function hasTarget(G, u) {
  const n = u.t.spells?.length ?? 0
  if (!n) return shootTargets(G, u).length > 0
  for (let sp = 0; sp < n; sp++) if (shootTargets(G, u, sp).length) return true
  return false
}

// ── The shot ────────────────────────────────────────────────────────────────
// `u` shoots `target` (shotInfo says it may): a spell is cast first (2D6
// against its number), a blast weapon throws its templates, and anything
// else is a volley, rolled to hit, to wound and to save. (V3c) `sp`: the
// caster's spell (none: its first).
export function doShoot(G, u, target, sp) {
  const w = weaponOf(u, sp)
  const info = shotInfo(G, u, target, sp)
  u.flags.shot = true
  emit(G, 'unit.face', { u: u.id, tg: target.id })
  emit(G, 'tray.open', { title: `${u.t.short} → ${target.t.short} · ${w.name}` })
  if (w.spell) {
    const c = roll(G, 2)
    const ok = c[0] + c[1] >= w.spell
    emit(G, 'dice', { label: `Cast ${w.spell}+ (2D6)`, dice: c, need: 0, sum: true, pass: ok })
    if (!ok) {
      emit(G, 'spell.fizzle', { u: u.id })
      log(G, u.side, `<b>${u.t.short}</b> tries ${w.name} — it fizzles (${c[0] + c[1]}).`)
      return
    }
    emit(G, 'spell.cast', { u: u.id })
    if (w.mesmerize) return mesmerize(G, u, target)
    if (w.snare) return snare(G, u, target, w)
    if (allySpell(w)) return bless(G, u, target, w)
    log(G, u.side, `<b>${u.t.short}</b> casts <b>${w.name}</b> on ${target.t.short}!`)
    return eruption(G, u, target, w)
  }
  if (w.blast) return blastVolley(G, u, target, w, info)
  // a plain volley
  const n = attackCount(u, w, false)
  emit(G, 'volley', { u: u.id, tg: target.id, fx: w.fx, n })
  const hits = roll(G, n)
  const h = passes(hits, info.need)
  emit(G, 'dice', { label: `Hit ${info.need}+`, dice: hits, need: info.need })
  // (F18, §4.1 rule 27) into a fight, each miss strays into the shooter's
  // own units there with the odds of their share of the fight's models:
  // one draw per miss, in the order of the misses, after the whole hit roll
  // and before any wound roll. With none of u's units in the fight nothing
  // strays and nothing is drawn (§4.1 rule 11: the classic path).
  const fight = info.fight
  let stray = 0
  if (fight) {
    const share = fight.F / (fight.F + fight.T)
    for (const d of hits) if (d < info.need && draw(G.rng) < share) stray++
  }
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const wd = roll(G, h)
  const wounds = passes(wd, wn)
  if (h) emit(G, 'dice', { label: `Wound ${wn}+`, dice: wd, need: wn })
  const sn = saveNeed(svOf(target), w.AP, info.cover)
  // (the dice roll even when there is no save to make: §4.1 rule 5)
  const sv = roll(G, wounds)
  const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
  if (wounds) emit(G, 'dice', { label: sn > 6 ? 'No save' : `Save ${sn}+${saveWhy(target, info.cover)}`, dice: sn > 6 ? [] : sv, need: sn, save: true })
  const killed = damage(G, target, unsaved, w.D, u)
  log(G, u.side, `<b>${u.t.short}</b> shoot ${target.t.short}: ${h} hit, ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  // (the target's rows and line first, then the friends')
  if (stray) strayHits(G, u, fight.onto, stray, w)
}

// (F18, §4.1 rule 27) `n` of `u`'s shots strayed into its own unit `f`,
// fighting their target: each a hit on f, rolled to wound against its T and
// saved on its Sv (cover as inCover), in rows of their own after the
// target's, the dice rolling even with no save to make (§4.1 rule 5); then
// damage as ever, and the friendly-fire line.
function strayHits(G, u, f, n, w) {
  const wn = woundNeed(w.S, f.t.T, w.poison)
  const wd = roll(G, n)
  const wounds = passes(wd, wn)
  emit(G, 'dice', { label: `⚠ ${f.t.short}: ${n} stray hit${n > 1 ? 's' : ''} · wound ${wn}+`, dice: wd, need: wn })
  const cover = inCover(G, f)
  const sn = saveNeed(svOf(f), w.AP, cover)
  const sv = roll(G, wounds)
  const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
  if (wounds) emit(G, 'dice', { label: sn > 6 ? 'No save' : `Save ${sn}+${saveWhy(f, cover)}`, dice: sn > 6 ? [] : sv, need: sn, save: true })
  const killed = damage(G, f, unsaved, w.D, u)
  log(G, u.side, `<b>Friendly fire!</b> ${n} stray shot${n > 1 ? 's' : ''} hit ${f.t.short}: ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
}

// A blast weapon: one template per model, up to its count. Each is aimed at
// the target, rolled to hit, and on a miss scatters D6+1" in a random
// direction before it lands. Per template, in this order (§4.1 rule 4): the
// volley ends if the shooter's own unit is gone (a template of its own
// that wiped it out: nobody is left to throw), then if the target is (after
// the first); the aim's angle, then its offset; the hit roll; on a miss the
// scatter's D6, then its angle.
export function blastVolley(G, u, target, w, info) {
  const { W, H } = G.board
  const n = attackCount(u, w, false)
  log(G, u.side, `<b>${u.t.short}</b> fire ${w.name} at ${target.t.short} (${info.need}+${info.visible ? '' : ', unseen'}).`)
  for (let k = 0; k < n; k++) {
    if (!alive(u)) break
    if (!alive(target) && k > 0) break
    const ang = draw(G.rng) * Math.PI * 2, off = draw(G.rng) * target.r * 0.5
    const aim = { x: target.pos.x + cos(ang) * off, z: target.pos.z + sin(ang) * off }
    emit(G, 'blast.aim', { x: aim.x, z: aim.z, r: w.blast })
    const r = roll(G, 1)
    const hit = r[0] >= info.need
    emit(G, 'dice', { label: n > 1 ? `Template ${k + 1}: hit ${info.need}+` : `Hit ${info.need}+`, dice: r, need: info.need })
    let land = aim
    if (!hit) {
      const sc = roll(G, 1)[0] + 1
      const a = draw(G.rng) * Math.PI * 2
      land = {
        x: Math.max(-W / 2 + 0.3, Math.min(W / 2 - 0.3, aim.x + cos(a) * sc)),
        z: Math.max(-H / 2 + 0.3, Math.min(H / 2 - 0.3, aim.z + sin(a) * sc)),
      }
      emit(G, 'dice', { label: 'Scatter D6+1', dice: [sc - 1], need: 0, sum: true, note: `${sc}"` })
      emit(G, 'blast.scatter', { from: { x: aim.x, z: aim.z }, to: { x: land.x, z: land.z }, d: sc })
    }
    emit(G, 'blast.fire', { u: u.id, to: { x: land.x, z: land.z }, fx: w.fx })
    blastLands(G, u, land, w)
  }
}

// A spell that erupts under its target (the cast was its roll: no hit roll
// and no scatter): thorns burst up where the target stands, a template there
// hurts whoever is under it, friend or foe, and the scenery, and then the
// thorns sink back. ((V3c) Or Venom Mist's cloud, its look the event's fx,
// which spares the scenery: its `scenery` 0, landing's.)
export function eruption(G, u, target, w) {
  const land = { x: target.pos.x, z: target.pos.z }
  emit(G, 'spell.thorns', { u: u.id, x: land.x, z: land.z, r: w.blast, fx: w.fx })
  blastLands(G, u, land, w)
  emit(G, 'spell.fade', { u: u.id })
}

// A template lands at `land`: everything under it takes a hit, whoever it
// belongs to; then the blast chews the scenery, and the nav grid follows.
// Every victim is found first, in unit order; a big one takes D3+1 hits,
// that D6 rolled before its wound roll (§4.1 rule 4).
//
// (F7a) With height the template lands on the floor where it falls (land.y),
// a model is under it by its distance in 3D from there (its own floor's
// height off the template's), and the scenery is chewed from half an inch
// over that floor; without height, the flat test and 0.5 as ever.
//
// (F9a) Riders are off the table: a template over a hull hits the hull (a
// big target: D3+1 hits), never the riders on its deck. A hull it destroys
// bails its riders out mid-volley (core/actions/transport.js), after the
// victims were all found, so no rider is among this template's (a later
// keg's blast in the same chain finds them where they bailed out to).
//
// (F19a, §4.1 rule 28) Then any powder keg the blast broke goes off
// (kegsGoOff): on a board with no keg (every set but `keg`) nothing more.
export function blastLands(G, u, land, w) {
  const kegs = landing(G, u, land, w)
  if (kegs.length) kegsGoOff(G, u, kegs)
}

// (F19a, DESIGN §4.1 rule 28) The powder kegs `kegs` go off, one after
// another in that order (a template's blast's in chunk order, a walk's as it
// broke them), each a blast at its place with the keg's profile
// (data/hazards.js): its line in the battle log ("The powder keg goes
// up!"), `keg.fuse { id, x, z }` as it is set off, then straight on, its
// blast landing as a template's does (landing: `blast.land` with fx 'keg',
// whoever is under it, friend and foe, in G.units order, the "⚠" rows and
// the "Friendly fire!" lines, the scenery round it, the nav after it). `u`
// set it off, and is the attacker of every keg in the chain: a model the
// blasts slay is u's (unit.slain's `by`), and "friendly" is u's side; the
// wounds go first to the models nearest the keg. A keg a keg's blast
// breaks joins the end of the line, in chunk order, so the first keg's
// victims (and the scenery its blast chewed) all come before the second
// keg's; a keg breaks once (a broken chunk is past every blast), so none
// goes off twice. Nothing is drawn but the blasts' own dice (rule 4's, per
// victim).
export function kegsGoOff(G, u, kegs) {
  const line = [...kegs], w = HAZARDS.keg
  for (let i = 0; i < line.length; i++) {
    const k = line[i], at = { x: k.shape.x, z: k.shape.z }
    log(G, u.side, '<b>The powder keg goes up!</b>')
    emit(G, 'keg.fuse', { id: k.id, x: at.x, z: at.z })
    for (const next of landing(G, u, at, w, at)) line.push(next)
  }
}

// A blast lands at `land`: blastLands' victims and scenery, the nav after
// them; the kegs it broke, for its caller to set off. (F19a) `from` is
// where the victims' wounds go nearest to (damage's): the thrower, or the
// keg that went off.
function landing(G, u, land, w, from = u.pos) {
  emit(G, 'blast.land', { x: land.x, z: land.z, r: w.blast, fx: w.fx })
  const victims = []
  const ly = G.nav.hasHeight ? floorAt(G, land.x, land.z) : 0
  for (const v of G.units) {
    if (!alive(v) || v.aboard) continue
    const under = modelsUnder(G, v, land, ly, w)
    if (under.length) victims.push({ v, under })
  }
  for (const { v, under } of victims) {
    let hits = under.length
    if (v.t.big) hits = Math.ceil(d6(G) / 2) + 1
    const friendly = v.side === u.side
    const wn = woundNeed(w.S, v.t.T, w.poison)
    const wd = roll(G, hits)
    const wounds = passes(wd, wn)
    emit(G, 'dice', { label: `${friendly ? '⚠ ' : ''}${v.t.short}: ${hits} hit${hits > 1 ? 's' : ''} · wound ${wn}+`, dice: wd, need: wn })
    const cover = inCover(G, v)
    const sn = saveNeed(svOf(v), w.AP, cover)
    // (the dice roll even when there is no save to make: §4.1 rule 5)
    const sv = roll(G, wounds)
    const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
    if (wounds && sn <= 6) emit(G, 'dice', { label: `Save ${sn}+${saveWhy(v, cover)}`, dice: sv, need: sn, save: true })
    const killed = damage(G, v, unsaved, w.D, u, under, from)
    log(G, u.side, `${friendly ? '<b>Friendly fire!</b> ' : ''}${w.name} hits ${v.t.short}: ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  }
  if (!victims.length) emit(G, 'pause', { s: 0.25 })
  // ((V3c) a template of scenery 0, Venom Mist's, wrecks nothing, and so
  // sets no keg off)
  const broke = w.scenery === 0 ? []
    : G.nav.hasHeight
      ? G.terrain.blast(land.x, land.z, w.blast, w.scenery || 1, { acid: !!w.corrodes, y: ly + 0.5 }, G.out)
      : G.terrain.blast(land.x, land.z, w.blast, w.scenery || 1, { acid: !!w.corrodes }, G.out)
  if (broke.length) log(G, u.side, `…and ${broke.length} piece${broke.length > 1 ? 's' : ''} of scenery ${broke.length > 1 ? 'are' : 'is'} wrecked.`)
  // (the nav follows the scenery, at today's site: DESIGN §4.1 rule 9)
  refreshNav(G)
  return kegsIn(broke)
}

// The living models of `v` under `w`'s template landed at `land`: within
// its radius and 0.6 of the model's base of the landing, (F7a) in 3D from
// the floor there (`ly`) with height, flat without. (F18) blastLands'
// victims, and friendsUnder's.
function modelsUnder(G, v, land, ly, w) {
  return G.nav.hasHeight
    ? v.models.filter((m) => m.alive && hypot3(mx(v, m) - land.x, floorAt(G, mx(v, m), mz(v, m)) - ly, mz(v, m) - land.z) <= w.blast + v.t.base * 0.6)
    : v.models.filter((m) => m.alive && hypot(mx(v, m) - land.x, mz(v, m) - land.z) <= w.blast + v.t.base * 0.6)
}

// A spell that mesmerizes: `u`'s gaze reaches the target, which takes D3
// mortal wounds (rolled after the cast: §4.1 rule 4) and is mesmerized
// until the end of its own next turn (it can't shoot or charge, and hits
// worse in a fight).
export function mesmerize(G, u, target) {
  emit(G, 'spell.gaze', { u: u.id, tg: target.id })
  const mw = Math.ceil(d6(G) / 2)
  emit(G, 'dice', { label: 'Mortal wounds D3', dice: [mw], need: 0, sum: true, note: `${mw}` })
  const killed = damage(G, target, mw, 1, u)
  target.mesmerized = true
  // its label says so
  if (G.out) emit(G, 'status', statusOf(G))
  emit(G, 'spell.mesmerized', { u: u.id, tg: target.id })
  log(G, u.side, `<b>${u.t.short}</b> mesmerizes ${target.t.short}: ${mw} mortal wound${mw > 1 ? 's' : ''}${killed ? `, <b>${killed} slain</b>` : ''}. It can't shoot or charge next turn.`)
}

// (V3c, DESIGN §4.1 rule 29) Root Snare: roots burst up round `target` and
// bind it until the end of its own next turn (core/engine.js endSpells, as
// mesmerism wears off): it may not move, advance or fall back
// (core/commands.js) nor charge (charge.js canCharge); it still shoots and
// fights. Nothing drawn but the cast.
export function snare(G, u, target, w) {
  emit(G, 'spell.snare', { u: u.id, tg: target.id })
  target.snared = true
  // its label says so
  if (G.out) emit(G, 'status', statusOf(G))
  log(G, u.side, `<b>${u.t.short}</b> binds ${target.t.short} with <b>${w.name}</b>: it can't move or charge next turn.`)
}

// (V3c, §4.1 rule 29) A spell cast on a friend (allySpell) settles on
// `target` until its side's next turn begins (core/engine.js resetTurn
// takes it off): a ward (Barkskin: its saves one better, rules.js svOf) or
// a resolve (Cold Blood: no morale test, morale.js; a failed charge roll
// rolled again, charge.js). Nothing drawn but the cast. The spell's look
// rides on its event, which the two share.
export function bless(G, u, target, w) {
  emit(G, 'spell.ward', { u: u.id, tg: target.id, fx: w.fx })
  if (w.ward) target.warded = true
  else target.resolute = true
  if (G.out) emit(G, 'status', statusOf(G))
  const who = target === u ? 'itself' : target.t.short
  log(G, u.side, w.ward
    ? `<b>${u.t.short}</b> wraps ${who} in <b>${w.name}</b>: +1 to its saves until its next turn.`
    : `<b>${u.t.short}</b> steels ${who} with <b>${w.name}</b>: no morale test, and a failed charge rolled again, until its next turn.`)
}

// (V3c) Why a save row needs what it needs, after its number: cover's +1
// and a ward's (the dice row's label, which the view shows and no rule
// reads)
const saveWhy = (u, cover) => (cover || u.warded ? ` (${[cover && 'cover', u.warded && 'ward'].filter(Boolean).join(', ')})` : '')
