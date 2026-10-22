// The cross-references that only meet at the integration (ENGINEERING.md §13
// Integrate, step 3; DATA.md §§4–5, 7–10): each workflow's check holds its own
// files to the contract against the frozen ids, and this one holds the files
// of different workflows to each other once they share a tree.
//
// - every event `box` names a baked box (boxes/manifest.json, its height pack
//   on disk), and every baked box's `event` names an event that names it back;
// - every box's manifest `clock` is its battle's clock id, and every clock id
//   a battle uses (its own and its `others`) is in clocks.json;
// - every kit a battle cites (units, groups, moment roles, a saved carrier's
//   `ready` strikes) is a kit in kits/ships.json or kits/aircraft.json of the
//   unit's side, and every such kit cites a source sources.json has;
// - every moment's role kit is a kit of the role's side, and is the kit of
//   the unit or the group the role names;
// - every `fleet` route of a boxed battle names the box units it stands for
//   (battle.mjs compares route and tracks at the battle's start, DATA.md §5).
//
// The integrator's module; it runs on public/data and on the fixtures.

import { existsSync } from 'node:fs'
import { join } from 'node:path'

const list = (v, k) => (Array.isArray(v) ? v : Array.isArray(v?.[k]) ? v[k] : [])
const code = (s) => (/^(jp|japan|ijn|ija)$/i.test(String(s)) ? 'jp' : /^(us|usa|usn|usaaf|usmc)$/i.test(String(s)) ? 'us' : String(s))

export default function check(ctx) {
  const need = ctx.test ? ctx.warn : ctx.bad
  const events = list(ctx.load('events.json'), 'events')
  const evById = new Map(events.filter((e) => e?.id).map((e) => [e.id, e]))
  const man = ctx.load('boxes/manifest.json')
  const boxes = list(man, 'boxes')
  const boxById = new Map(boxes.filter((b) => b?.id).map((b) => [b.id, b]))
  const clocks = new Map(list(ctx.load('clocks.json'), 'clocks').filter((c) => c?.id).map((c) => [c.id, c]))
  const sources = new Set(list(ctx.load('sources.json'), 'sources').map((s) => s?.id).filter(Boolean))
  const kits = new Map()
  for (const k of list(ctx.load('kits/ships.json'), 'ships')) if (k?.id) kits.set(k.id, { ...k, kind: 'ship' })
  for (const k of list(ctx.load('kits/aircraft.json'), 'aircraft')) if (k?.id && !kits.has(k.id)) kits.set(k.id, { ...k, kind: 'aircraft' })

  // events ↔ boxes
  for (const e of events) {
    if (!e?.box) continue
    const b = boxById.get(e.box)
    if (!b) need(`events.json ${e.id}`, `box “${e.box}” is not in boxes/manifest.json`)
    else if (b.height?.file && !existsSync(join(ctx.dir, b.height.file))) need(`events.json ${e.id}`, `box “${e.box}” has no baked pack (${b.height.file})`)
    else ctx.count('event boxes baked')
  }
  for (const b of boxes) {
    const at = `boxes/manifest.json ${b.id}`
    const e = b.event ? evById.get(b.event) : null
    if (!e) need(at, `event “${b.event}” is not in events.json`)
    else if (e.box !== b.id) need(at, `its event ${e.id} names box “${e.box ?? 'none'}”, not this one`)
    if (!b.battle) continue
    const B = ctx.load(b.battle)
    if (!B) continue
    const rel = b.battle
    const sides = B.sides || {}
    const sideOf = (s) => code(sides[s]?.side ?? s)
    // clocks
    if (b.clock && B.clock?.id && b.clock !== B.clock.id) ctx.bad(at, `clock ${b.clock}; its battle's clock is ${B.clock.id}`)
    for (const c of [B.clock, ...(B.clock?.others || [])]) {
      if (c?.id && !clocks.has(c.id)) ctx.bad(`${rel} clock`, `clock id “${c.id}” is not in clocks.json`)
      else if (c?.id) ctx.count('battle clock ids resolved')
    }
    // kits, with their sides and sources
    const cite = (where, kitId, side, kind) => {
      const k = kits.get(kitId)
      if (!k) return ctx.bad(where, `kit “${kitId}” is in neither kits/ships.json nor kits/aircraft.json`)
      if (kind && k.kind !== kind) ctx.bad(where, `kit “${kitId}” is a ${k.kind} kit, not a ${kind} kit`)
      if (side && k.side && code(k.side) !== side) ctx.bad(where, `kit “${kitId}” is ${k.side}'s, not ${side}'s`)
      const srcs = list(k.sources).map((s) => (typeof s === 'string' ? s : s?.id))
      if (!srcs.length) need(where, `kit “${kitId}” cites no source`)
      else for (const s of srcs) if (!sources.has(s)) need(where, `kit “${kitId}” cites “${s}”, not in sources.json`)
      ctx.count('battle kit citations resolved')
      return k
    }
    const units = new Map()
    const groups = new Map()
    for (const u of list(B.units)) {
      if (!u?.id) continue
      units.set(u.id, u)
      const isAircraft = kits.get(u.kit)?.kind === 'aircraft'
      cite(`${rel} unit ${u.id}`, u.kit, sideOf(u.side), isAircraft ? 'aircraft' : null)
      for (const r of list(u.ready)) if (r?.kit) cite(`${rel} unit ${u.id} ready`, r.kit, sideOf(u.side), 'aircraft')
    }
    for (const g of list(B.groups)) {
      if (!g?.id) continue
      groups.set(g.id, g)
      cite(`${rel} group ${g.id}`, g.kit, sideOf(g.side), 'aircraft')
    }
    for (const m of list(B.moments)) {
      const r = m?.role
      if (!r) continue
      const at2 = `${rel} moment ${m.id}`
      const side = sideOf(r.side)
      if (r.kit) cite(at2, r.kit, side, r.kind === 'aircraft' ? 'aircraft' : r.kind === 'ship' ? 'ship' : null)
      const u = r.unit ? units.get(r.unit) : null
      const g = r.group ? groups.get(r.group) : null
      if (r.unit && !u) ctx.bad(at2, `role unit “${r.unit}” is not a unit`)
      if (r.group && !g) ctx.bad(at2, `role group “${r.group}” is not a group`)
      if (u && r.kit && u.kit !== r.kit) ctx.bad(at2, `role kit ${r.kit}; unit ${u.id} is a ${u.kit}`)
      if (g && r.kit && g.kit !== r.kit) ctx.bad(at2, `role kit ${r.kit}; group ${g.id} flies ${g.kit}`)
      if (u && sideOf(u.side) !== side) ctx.bad(at2, `role side ${side}; unit ${u.id} is ${sideOf(u.side)}'s`)
      if (g && sideOf(g.side) !== side) ctx.bad(at2, `role side ${side}; group ${g.id} is ${sideOf(g.side)}'s`)
      ctx.count('moment roles resolved')
    }
  }

  // a boxed battle's fleet routes name their units
  for (const r of list(ctx.load('routes.json'), 'routes')) {
    if (r?.kind !== 'fleet') continue
    const e = evById.get(r.event)
    if (!e?.box || !boxById.has(e.box)) continue
    if (!Array.isArray(r.units) || !r.units.length) need(`routes.json ${r.id}`, `a fleet route of the boxed battle ${e.id} names no units (DATA.md §5)`)
    else ctx.count('boxed fleet routes with their units')
  }
}
