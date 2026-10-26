// Shooting (DESIGN §1.1): who may shoot, at whom and at what odds, and the
// shot itself: a plain volley, a blast weapon's templates (each aimed,
// rolled, scattered on a miss, landed), or a spell (an eruption of thorns
// under the target, or a mesmerizing gaze).
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
//   spell.thorns     { u, x, z, r }    thorns burst up through the turf
//   spell.fade       { u }             and sink back, once they are done
//   spell.gaze       { u, tg }         u's gaze reaches tg
//   spell.mesmerized { u, tg }         tg is mesmerized
//
// Units go by id. `fx` is the weapon's look, which the rules carry to the
// view and never test. Nothing here ends the action (its state line in the
// trace, the flags, the labels) or calls finishAction: the `shoot` handler
// (core/commands.js), the only path to doShoot, calls core/engine.js's
// finishAction after it (DESIGN §2.2's (R6a) note).
// The orders of §4.1 rule 4 (a template's draws; a blast's victims; the
// gaze's D3) and rule 5 (the dice roll even when there is no save to make)
// are kept exactly.
import { hitNeed, roll, d6, passes, woundNeed, saveNeed, attackCount } from '../rules.js'
import { draw } from '../rng.js'
import { hypot, hypot3, sin, cos } from '../dmath.js'
import { emit, log } from '../journal.js'
import { refreshNav } from '../match.js'
import { alive, enemiesOf, gap, inCover, isEngaged, mx, mz, sight, statusOf, floorAt } from '../queries.js'
import { damage } from './damage.js'

// (F9a) A rider can't shoot while aboard: the firing deck, from which up to
// `fire` rider units shoot from the deck's height, is F9c's (DESIGN §4.2.5),
// and a rider is off the table until then.
export function canShoot(G, u) {
  const w = u.t.ranged
  if (!w || !alive(u) || u.flags.shot || u.aboard) return false
  if (u.mesmerized || u.flags.fellBack || isEngaged(G, u)) return false
  if (u.flags.advanced && !w.assault) return false
  return true
}

export function shotInfo(G, u, target) {
  const w = u.t.ranged
  const range = gap(u, target)
  if (range > w.range) return { ok: false, why: `out of range (${range.toFixed(1)}" / ${w.range}")` }
  if (isEngaged(G, target) && !w.spell) return { ok: false, why: 'locked in combat' }
  const s = sight(G, u, target)
  if (!s.visible && !w.indirect) return { ok: false, why: 'no line of sight' }
  let mod = 0
  if (w.heavy && u.flags.moved) mod++
  if (w.indirect && !s.visible) mod++
  return { ok: true, range, ...s, mod, need: hitNeed(u.t.BS, mod) }
}

export function shootTargets(G, u) {
  if (!canShoot(G, u)) return []
  return enemiesOf(G, u).filter((e) => shotInfo(G, u, e).ok)
}

// ── The shot ────────────────────────────────────────────────────────────────
// `u` shoots `target` (shotInfo says it may): a spell is cast first (2D6
// against its number), a blast weapon throws its templates, and anything
// else is a volley, rolled to hit, to wound and to save.
export function doShoot(G, u, target) {
  const w = u.t.ranged
  const info = shotInfo(G, u, target)
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
  const wn = woundNeed(w.S, target.t.T, w.poison)
  const wd = roll(G, h)
  const wounds = passes(wd, wn)
  if (h) emit(G, 'dice', { label: `Wound ${wn}+`, dice: wd, need: wn })
  const sn = saveNeed(target.t.Sv, w.AP, info.cover)
  // (the dice roll even when there is no save to make: §4.1 rule 5)
  const sv = roll(G, wounds)
  const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
  if (wounds) emit(G, 'dice', { label: sn > 6 ? 'No save' : `Save ${sn}+${info.cover ? ' (cover)' : ''}`, dice: sn > 6 ? [] : sv, need: sn, save: true })
  const killed = damage(G, target, unsaved, w.D, u)
  log(G, u.side, `<b>${u.t.short}</b> shoot ${target.t.short}: ${h} hit, ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
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
// thorns sink back.
export function eruption(G, u, target, w) {
  const land = { x: target.pos.x, z: target.pos.z }
  emit(G, 'spell.thorns', { u: u.id, x: land.x, z: land.z, r: w.blast })
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
// victims were all found, so no rider is among this template's.
export function blastLands(G, u, land, w) {
  emit(G, 'blast.land', { x: land.x, z: land.z, r: w.blast, fx: w.fx })
  const victims = []
  const ly = G.nav.hasHeight ? floorAt(G, land.x, land.z) : 0
  for (const v of G.units) {
    if (!alive(v) || v.aboard) continue
    const under = G.nav.hasHeight
      ? v.models.filter((m) => m.alive && hypot3(mx(v, m) - land.x, floorAt(G, mx(v, m), mz(v, m)) - ly, mz(v, m) - land.z) <= w.blast + v.t.base * 0.6)
      : v.models.filter((m) => m.alive && hypot(mx(v, m) - land.x, mz(v, m) - land.z) <= w.blast + v.t.base * 0.6)
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
    const sn = saveNeed(v.t.Sv, w.AP, cover)
    // (the dice roll even when there is no save to make: §4.1 rule 5)
    const sv = roll(G, wounds)
    const unsaved = sn > 6 ? wounds : wounds - passes(sv, sn)
    if (wounds && sn <= 6) emit(G, 'dice', { label: `Save ${sn}+${cover ? ' (cover)' : ''}`, dice: sv, need: sn, save: true })
    const killed = damage(G, v, unsaved, w.D, u, under)
    log(G, u.side, `${friendly ? '<b>Friendly fire!</b> ' : ''}${w.name} hits ${v.t.short}: ${wounds} wound, ${unsaved} unsaved${killed ? ` — <b>${killed} slain</b>` : ''}.`)
  }
  if (!victims.length) emit(G, 'pause', { s: 0.25 })
  const broke = G.nav.hasHeight
    ? G.terrain.blast(land.x, land.z, w.blast, w.scenery || 1, { acid: !!w.corrodes, y: ly + 0.5 }, G.out)
    : G.terrain.blast(land.x, land.z, w.blast, w.scenery || 1, { acid: !!w.corrodes }, G.out)
  if (broke.length) log(G, u.side, `…and ${broke.length} piece${broke.length > 1 ? 's' : ''} of scenery ${broke.length > 1 ? 'are' : 'is'} wrecked.`)
  // (the nav follows the scenery, at today's site: DESIGN §4.1 rule 9)
  refreshNav(G)
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
