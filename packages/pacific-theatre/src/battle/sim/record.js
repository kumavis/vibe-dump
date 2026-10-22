// The record as the sim plays it (ENGINEERING.md §5, DATA.md §9): battle.json
// read once into ship tracks and stations, events with their causes and
// seeded counts, and every aircraft of every group with a closed-form flight
// plan (launch or entry, route, the attack profile, losses, retirement and
// recovery) and the timed actions the record implies (a bomb released, a
// torpedo dropped, an aircraft lost). Everything here is a pure function of
// the record and the seed: untouched, a box replays the battle the same way
// every time.

import { prepareTrack, trackAt, courseVec, headingOf, wrap180, slotOffset, offsetBy, fallPath, legAt, keysAt, keysSpeed, makeLift, liftAt, DEG } from './path.js'
import { KN } from './units.js'
import { P } from './params.js'

export const normSide = (s) => (/^(jp|japan|ijn|ija)$/i.test(String(s)) ? 'jp' : /^(us|usa|usn|usaaf|usmc|usa?f)$/i.test(String(s)) ? 'us' : s || 'us')
const clampN = (v, a, b) => Math.max(a, Math.min(b, v))
const SINK_KINDS = new Set(['sunk', 'scuttled', 'capsized', 'exploded', 'lost', 'wrecked'])

/**
 * ctx: { proj (TangentProjection), clock (BattleClock), rng, warn,
 * shipModel(kitId), aircraftModel(kitId), heightAt(x, z), ground (world.js:
 * metresAt, maxIn, exaggeration; the record's plans clear it over land) }.
 */
export function readRecord(battle, ctx) {
  const { proj, clock, rng, warn } = ctx
  const T = (s) => clock.parse(s)
  const ships = []
  const shipById = new Map()
  const sites = (battle.sites || []).map((s, i) => {
    const [x, z] = s.lonlat ? proj.toWorld(s.lonlat) : [0, 0]
    return { index: i, id: s.id, kind: s.kind, name: s.name || s.id, x, z, side: normSide(s.side), target: s.target !== false && s.kind !== 'building', damage: s.damage || 0 }
  })
  const siteById = new Map(sites.map((s) => [s.id, s]))

  for (const u of battle.units || []) {
    const r = {
      index: ships.length,
      id: u.id,
      name: u.name || u.id,
      ja: u.ja || null,
      kitId: u.kit,
      side: normSide(u.side),
      formation: u.group || null,
      fixed: !!u.fixed,
      hospital: !!u.hospital,
      tokko: !!u.tokko,
      target: u.target !== false && !u.hospital,
      colour: u.colour || null,
      dye: u.dye || null,
      track: null,
      station: null,
      events: [],
      fate: null,
      hh: [],
      ready: u.ready || null,
      sinkT: null,
      raw: u,
    }
    if (u.track?.length) {
      const fixes = u.track.map((f) => {
        const [x, z] = proj.toWorld(f.lonlat)
        return { t: T(f.t), x, z, course: f.courseDeg, speed: (f.speedKn ?? 0) * KN, precision: f.precision }
      })
      fixes.sort((a, b) => a.t - b.t)
      for (let i = 0; i < fixes.length; i++) {
        const f = fixes[i]
        if (f.course == null) {
          const b = fixes[i + 1] || f
          const a = fixes[i - 1] || f
          f.course = b !== f ? headingOf(b.x - f.x, b.z - f.z) : a !== f ? headingOf(f.x - a.x, f.z - a.z) : 0
        }
      }
      r.track = prepareTrack(fixes)
    }
    if (u.station) {
      const s = u.station
      r.station = { guideId: s.guide ?? null, guide: -1, bearingDeg: s.bearingDeg ?? 0, rangeM: s.rangeM ?? 0, relative: !!s.relative, parked: s.parked ?? null, site: s.site ?? (typeof s.parked === 'string' ? s.parked : null), headingDeg: s.headingDeg ?? 0, lonlat: s.lonlat || null }
      if (r.station.site || r.station.lonlat || r.station.parked) {
        const site = siteById.get(r.station.site)
        const [x, z] = r.station.lonlat ? proj.toWorld(r.station.lonlat) : site ? [site.x, site.z] : [0, 0]
        r.fixedPos = { x, z }
      }
    }
    if (!r.track && !r.station) warn?.(`battle: unit ${u.id} has neither a track nor a station; it stays at the box's centre`)
    r.events = (u.events || []).map((e, i) => {
      const ev = { ...e, i, unit: r.index, t: T(e.t) }
      ev.count = Array.isArray(e.count) ? e.count : e.count != null ? [e.count, e.count] : null
      ev.rc = ev.count ? rng.fork(`count:${u.id}:${i}`).range(ev.count) : 0
      return ev
    })
    r.events.sort((a, b) => a.t - b.t)
    r.events.forEach((e, k) => (e.k = k))
    if (u.fate) r.fate = { kind: u.fate.kind, t: u.fate.t != null ? T(u.fate.t) : null }
    if (r.fate && SINK_KINDS.has(r.fate.kind) && r.fate.t != null) r.sinkT = r.fate.t
    else {
      const s = r.events.find((e) => e.kind === 'sinks' || e.kind === 'scuttled')
      if (s) r.sinkT = s.t
    }
    r.hh = (u.hangarHazard || []).map((h) => ({ t: T(h.t), h: h.h })).sort((a, b) => a.t - b.t)
    shipById.set(u.id, r)
    ships.push(r)
  }
  for (const r of ships) {
    if (r.station?.guideId) {
      const g = shipById.get(r.station.guideId)
      if (g) r.station.guide = g.index
      else warn?.(`battle: ${r.id}'s station guide ${r.station.guideId} is not a unit`)
    }
  }

  const motion = new RecordMotion(ships)

  // --- groups ----------------------------------------------------------------
  const groups = []
  const groupById = new Map()
  for (const g of battle.groups || []) {
    const rec = {
      index: groups.length,
      id: g.id,
      name: g.name || g.id,
      kitId: g.kit,
      side: normSide(g.side),
      count: Math.max(1, g.count | 0),
      fromId: g.from ?? null,
      from: shipById.get(g.from)?.index ?? -1,
      fromSite: siteById.get(g.from) || null,
      launch: g.launch != null ? T(g.launch) : null,
      offBox: !!g.offBox,
      enter: g.enter ? { t: T(g.enter.t), ...(g.enter.lonlat ? xz(proj, g.enter.lonlat) : { x: 0, z: 0 }), heading: g.enter.headingDeg ?? 180, alt: g.enter.altM ?? g.altM ?? 2000 } : null,
      alt: g.altM ?? null,
      route: (g.route || []).map((w) => ({ t: T(w.t), ...xz(proj, w.lonlat), alt: w.altM ?? g.altM ?? 1500 })).sort((a, b) => a.t - b.t),
      attack: g.attack ? { ...g.attack, t: g.attack.t != null ? T(g.attack.t) : null } : null,
      losses: g.losses || [],
      recover: g.recover ? { t: T(g.recover.t), to: shipById.get(g.recover.to)?.index ?? -1, toId: g.recover.to } : null,
      sources: g.sources || [],
      aircraft: [],
      raw: g,
    }
    groups.push(rec)
    groupById.set(g.id, rec)
  }
  for (const g of groups) {
    const a = g.attack
    if (!a) continue
    // a target, or a list of them (Pearl Harbor's waves split over the battleships, the ramps and the hangars):
    // the group's aircraft are shared out over the list in order, a section to each (buildGroup)
    const ids = Array.isArray(a.target) ? a.target : a.target != null ? [a.target] : []
    a.targets = ids.map((id) => ({ id, unit: shipById.get(id)?.index ?? -1, group: groupById.get(id)?.index ?? -1, site: siteById.get(id) || null }))
    for (const x of a.targets) if (x.unit < 0 && x.group < 0 && !x.site) warn?.(`battle: group ${g.id}'s attack target ${x.id} is not a unit, group or site`)
    a.targets = a.targets.filter((x) => x.unit >= 0 || x.group >= 0 || x.site)
    const first = a.targets[0] || null
    a.targetUnit = first?.unit ?? -1
    a.targetGroup = first?.group ?? -1
    a.targetSite = first?.site ?? null
  }

  const ctx2 = { ...ctx, ships, groups, motion, sites, shipById, groupById }
  // the record's scripted hits per cause group, for the bombs drawn as hits
  for (const g of groups) {
    g.recordHits = 0
    for (const s of ships) for (const e of s.events) if (e.by === g.id && (e.kind === 'hit' || e.kind === 'torpedo-hit')) g.recordHits += e.rc
  }
  // build in dependency order: a CAP or escort follows its target group
  const built = new Set()
  const build = (g, depth = 0) => {
    if (built.has(g.index)) return
    const tg = g.attack?.targetGroup ?? -1
    if (tg >= 0 && tg !== g.index && depth < 4) build(groups[tg], depth + 1)
    buildGroup(g, ctx2)
    built.add(g.index)
  }
  for (const g of groups) build(g)

  // --- weather: squalls as moving polygons in box metres ---------------------
  const w = battle.weather || {}
  const squalls = (w.squalls || []).map((s) => ({
    t0: s.from != null ? T(s.from) : -Infinity,
    t1: s.to != null ? T(s.to) : Infinity,
    poly: (s.polygon || []).map((c) => proj.toWorld(c)),
    vx: s.velocity ? (s.velocity.kn ?? 0) * KN * Math.sin((s.velocity.towardDeg ?? 0) * DEG) : 0,
    vz: s.velocity ? -(s.velocity.kn ?? 0) * KN * Math.cos((s.velocity.towardDeg ?? 0) * DEG) : 0,
  }))

  const moments = new Map((battle.moments || []).map((m) => [m.id, { ...m, t: T(m.t), beats: (m.beats || []).map((b) => ({ ...b, t: T(b.t) })) }]))
  const stops = (battle.stops || []).map((s) => ({ ...s, t: T(s.t) }))
  return { ships, groups, sites, squalls, moments, stops, motion, shipById, groupById, siteById, weather: w }
}

const xz = (proj, ll) => {
  const [x, z] = proj.toWorld(ll)
  return { x, z }
}

/** The record's ship poses as pure functions of t (tracks, stations, fixed positions). */
export class RecordMotion {
  constructor(ships) {
    this.ships = ships
    this.tmp = { x: 0, z: 0, vx: 0, vz: 0, course: 0 }
  }

  /** out: { x, z, vx, vz, heading, speed } of record ship i at t. */
  pose(i, t, out, depth = 0) {
    const r = this.ships[i]
    if (r.sinkT != null && t > r.sinkT) t = r.sinkT
    const tr = r.track
    const st = r.station
    if (tr && (!st || st.guide < 0 || t >= tr[0].t)) {
      trackAt(tr, t, this.tmp)
      this.copy(out, this.tmp)
      if (st && st.guide >= 0 && t < tr[0].t + 120 && depth < 8) {
        // ease off the station into the track over two minutes
        const s = { x: 0, z: 0, vx: 0, vz: 0, heading: 0, speed: 0 }
        this.station(r, tr[0].t, s, depth)
        const k = (t - tr[0].t) / 120
        out.x = s.x + (out.x - s.x) * k
        out.z = s.z + (out.z - s.z) * k
      }
      return out
    }
    if (st && st.guide >= 0 && depth < 8) return this.station(r, t, out, depth)
    if (r.fixedPos) {
      out.x = r.fixedPos.x
      out.z = r.fixedPos.z
      out.vx = 0
      out.vz = 0
      out.heading = st?.headingDeg ?? 0
      out.speed = 0
      return out
    }
    out.x = 0
    out.z = 0
    out.vx = 0
    out.vz = 0
    out.heading = 0
    out.speed = 0
    return out
  }

  station(r, t, out, depth) {
    const st = r.station
    this.pose(st.guide, t, out, depth + 1)
    const brg = st.bearingDeg + (st.relative ? out.heading : 0)
    const [ux, uz] = courseVec(brg)
    out.x += ux * st.rangeM
    out.z += uz * st.rangeM
    return out
  }

  copy(out, s) {
    out.x = s.x
    out.z = s.z
    out.vx = s.vx
    out.vz = s.vz
    const sp = Math.hypot(s.vx, s.vz)
    out.speed = sp
    out.heading = sp > 0.3 ? headingOf(s.vx, s.vz) : s.course
    return out
  }
}

/** The hangar hazard of a record ship at t (a step function of the record's entries). */
export function hangarHazardAt(r, t) {
  let h = r.hh.length ? 0 : null
  for (const e of r.hh) if (e.t <= t) h = e.h
  return h
}

// --- the groups' flight plans --------------------------------------------------

/**
 * Build every aircraft of a group: { k, plan: { legs }, spawnT, endT, endHow,
 * lossT, lossHow, lossCause, releaseT, actions }. The plan is closed-form; the
 * timed actions (release, drop, strafe, lose, land) go to the sim's queue.
 */
function buildGroup(g, ctx) {
  const { motion, ships, groups, rng, warn } = ctx
  const model = ctx.aircraftModel(g.kitId)
  if (!model) {
    warn?.(`battle: group ${g.id}'s kit ${g.kitId} is not an aircraft kit`)
    g.aircraft = []
    return
  }
  g.model = model
  const R = rng.fork(`group:${g.id}`)
  const vC = clampN(model.vCruise || 80, 45, 160)
  const a = g.attack
  const profile = a?.profile || 'search'
  const pose = { x: 0, z: 0, vx: 0, vz: 0, heading: 0, speed: 0 }
  const shipPose = (i, t) => motion.pose(i, t, { ...pose })
  const heightAt = ctx.heightAt || (() => 0)

  // --- losses and survivors at the attack (the group rule's Srec) -------------
  const lossTotal = g.losses.reduce((s, r) => s + R.range(r), 0)
  const capOn = groups.find((c) => c.attack?.profile === 'cap' && c.attack.targetGroup === g.index) || null
  let Srec
  if (a?.reached != null) Srec = clampN(R.fork('reached').range(a.reached), 0, g.count)
  else if (profile === 'torpedo' || capOn) Srec = g.count - Math.min(g.count, lossTotal)
  else Srec = g.count
  // those that did not reach the release: lost on the way in, as far as the record's losses go; the rest
  // turned back or reached it with nothing to drop (VB-3's four bombs jettisoned by the arming switch, the
  // morning strike's aborts): they fly the plan without a release and are not counted lost
  const notReached = g.count - Srec
  const preLoss = Math.min(notReached, lossTotal)
  const turnedBack = notReached - preLoss
  const postLoss = Math.max(0, lossTotal - preLoss)
  g.Srec = Srec
  g.preLoss = preLoss
  g.turnedBack = turnedBack
  g.lossTotal = lossTotal

  // --- the start: a carrier's deck, an airfield, or the box's edge -------------
  const fromShip = g.from >= 0 ? g.from : -1
  const fromModel = fromShip >= 0 ? ctx.shipModel(ships[fromShip].kitId) : null
  const gap = 18
  const starts = []
  for (let k = 0; k < g.count; k++) {
    const keys = []
    const off = slotOffset(k)
    if (g.enter) {
      const t0 = g.enter.t
      const [x, z] = offsetBy(g.enter.x, g.enter.z, g.enter.heading, off)
      keys.push({ t: t0, x, y: slotY(g.enter.alt, off.up), z })
      const [ux, uz] = courseVec(g.enter.heading)
      keys.push({ t: t0 + 60, x: x + ux * vC * 60, y: slotY(g.enter.alt, off.up), z: z + uz * vC * 60 })
      starts.push({ keys, spawnT: t0 })
      continue
    }
    const t0 = g.launch ?? (g.route[0] ? g.route[0].t - 600 : a?.t != null ? a.t - 1800 : 0)
    const ts = t0 + k * gap
    if (fromShip >= 0) {
      const p = shipPose(fromShip, ts)
      const [ux, uz] = courseVec(p.heading)
      const deckY = (fromModel?.fdTop ?? fromModel?.deck ?? 15) + 1.5
      const back = (fromModel?.L ?? 200) * 0.3
      keys.push({ t: ts, x: p.x - ux * back, y: deckY, z: p.z - uz * back })
      keys.push({ t: ts + 7, x: p.x + ux * (p.speed * 7 + 120), y: deckY + 25, z: p.z + uz * (p.speed * 7 + 120) })
      keys.push({ t: ts + 45, x: p.x + ux * 2600, y: 350, z: p.z + uz * 2600 })
    } else {
      const s = g.fromSite || { x: 0, z: 0 }
      const ground = heightAt(s.x, s.z) + 2
      const h = g.route[0] ? headingOf(g.route[0].x - s.x, g.route[0].z - s.z) : 0
      const [ux, uz] = courseVec(h)
      const lat = (k % 3) * 40 - 40
      // (each on the ground under its own place in the line abreast, not under the field's point)
      keys.push({ t: ts, x: s.x - uz * lat, y: Math.max(ground, heightAt(s.x - uz * lat, s.z + ux * lat) + 2), z: s.z + ux * lat })
      keys.push({ t: ts + 25, x: s.x + ux * 900 - uz * lat, y: ground + 30, z: s.z + uz * 900 + ux * lat })
      keys.push({ t: ts + 70, x: s.x + ux * 4000, y: ground + 400, z: s.z + uz * 4000 })
    }
    starts.push({ keys, spawnT: ts })
  }

  // --- the route, in formation ------------------------------------------------
  const route = g.route
  const routeKeys = (k) => {
    const out = []
    const off = slotOffset(k)
    for (let i = 0; i < route.length; i++) {
      const w = route[i]
      const nb = route[i + 1] || null
      const pv = route[i - 1] || null
      const h = nb ? headingOf(nb.x - w.x, nb.z - w.z) : pv ? headingOf(w.x - pv.x, w.z - pv.z) : 0
      const [x, z] = offsetBy(w.x, w.z, h, off)
      out.push({ t: w.t, x, y: slotY(w.alt, off.up), z })
    }
    return out
  }

  // --- the attack -------------------------------------------------------------
  // (the target of the aircraft being planned: a list's targets take the group's sections in order)
  const targetList = a?.targets?.length ? a.targets : [{ unit: a?.targetUnit ?? -1, site: a?.targetSite ?? null }]
  let cur = targetList[0]
  const targetOf = (k) => targetList[Math.min(targetList.length - 1, Math.floor((k * targetList.length) / g.count))]
  const lengthOf = (c) => (c.unit >= 0 ? ctx.shipModel(ships[c.unit].kitId)?.L : null) ?? 60
  const targetPose = (t) => {
    if (cur.unit >= 0) return shipPose(cur.unit, t)
    if (cur.site) return { x: cur.site.x, z: cur.site.z, heading: 0, speed: 0, vx: 0, vz: 0 }
    return null
  }
  const ta = a?.t ?? null
  let tgtL = lengthOf(cur)
  // the approach bearing: the record's fromDeg, or from the last route point
  const lastRoute = route[route.length - 1] || null
  const approachFrom = (t) => {
    if (a?.fromDeg != null) return a.fromDeg
    const tp = targetPose(t)
    if (tp && lastRoute) return headingOf(lastRoute.x - tp.x, lastRoute.z - tp.z)
    if (tp && fromShip >= 0) {
      const f = shipPose(fromShip, t)
      return headingOf(f.x - tp.x, f.z - tp.z)
    }
    return 0
  }
  const hitsToDraw = Math.min(g.recordHits, Srec)

  const aircraft = []
  for (let k = 0; k < g.count; k++) {
    const keys = [...starts[k].keys]
    const pushKeys = (arr) => {
      for (const q of arr) {
        if (q.t > keys[keys.length - 1].t + 0.5) keys.push(q)
      }
    }
    pushKeys(routeKeys(k))
    const ac = { k, plan: { legs: [] }, spawnT: starts[k].spawnT, endT: Infinity, endHow: 'exit', lossT: null, lossHow: null, lossCause: null, releaseT: null, actions: [], hit: false }
    const order = k // attack order: the survivors first (losses are drawn from the rear)
    cur = targetOf(k)
    tgtL = lengthOf(cur)
    ac.target = cur.unit
    const tgt0 = ta != null ? targetPose(ta) : null
    let tEnd = keys[keys.length - 1].t

    if (a && ta != null && (tgt0 || profile === 'cap' || profile === 'escort')) {
      if (profile === 'dive' && tgt0) {
        const vd = clampN(model.kit.aero?.diveMs ?? model.vShake * 0.8, 85, 160)
        const ang = 70 * DEG
        const hp = a.pushOverM ?? g.alt ?? 4000
        const hr = Math.min(a.releaseM ?? 600, hp - 200)
        const tp = ta + order * 7
        const Td = (hp - hr) / (vd * Math.sin(ang))
        const tr = tp + Td
        const vv = vd * Math.sin(ang)
        const tf = (-vv + Math.sqrt(vv * vv + 2 * 9.81 * hr)) / 9.81
        const hb = vd * Math.cos(ang) * tf
        const T1 = targetPose(tr + tf)
        const phi = approachFrom(tp) + (order % 3 - 1) * 8
        const [ux, uz] = courseVec(phi)
        const hit = hitIndex(order, Srec, hitsToDraw)
        ac.hit = hit
        const [fx, fz] = courseVec(T1.heading)
        const along = hit ? (R.next() - 0.5) * 0.5 * tgtL : 0
        const miss = hit ? [0, 0] : [R.gauss() * 45 + Math.sign(R.next() - 0.5) * 30, R.gauss() * 45]
        const aim = { x: T1.x + fx * along + miss[0], z: T1.z + fz * along + miss[1] }
        const rel = { x: aim.x + ux * hb, z: aim.z + uz * hb }
        const push = { x: rel.x + (ux * (hp - hr)) / Math.tan(ang), z: rel.z + (uz * (hp - hr)) / Math.tan(ang) }
        const pre = { x: push.x + ux * vC * 25, z: push.z + uz * vC * 25 }
        const appr = { x: push.x + ux * 6000, z: push.z + uz * 6000 }
        const off = slotOffset(k)
        const [ax, az] = offsetBy(appr.x, appr.z, phi + 180, off)
        const bottomY = Math.max(120, hr - 230)
        pushKeys([
          { t: ta - 120, x: ax, y: hp + off.up, z: az },
          { t: tp - 25, x: pre.x, y: hp, z: pre.z },
          { t: tp, x: push.x, y: hp, z: push.z, corner: true },
          { t: tr, x: rel.x, y: hr, z: rel.z },
          { t: tr + 5, x: rel.x - ux * (vd * 0.34 * 5 + 120), y: bottomY, z: rel.z - uz * (vd * 0.34 * 5 + 120) },
          { t: tr + 35, x: rel.x - ux * 3200, y: 180, z: rel.z - uz * 3200 },
          { t: tr + 200, x: rel.x - ux * 15000, y: 900, z: rel.z - uz * 15000 },
        ])
        ac.releaseT = tr
        ac.actions.push({ t: tr, kind: 'release', g: g.index, k, hit, aim, target: cur.unit, weapon: model.payload[0]?.weapon?.id ?? null })
        tEnd = tr + 200
      } else if (profile === 'torpedo' && tgt0) {
        const tor = model.torpedo
        const vr = clampN(Math.min(vC * 1.05, ((tor?.dropSpeedKn ?? 110) + 10) * KN), 45, 110)
        const dropAlt = clampN(Math.min(30, tor?.dropAltM ?? 30), 12, 60)
        const vt = ((tor?.speedKn ?? tor?.settings?.[0]?.speedKn ?? 33) || 33) * KN
        const dr = 900
        const td = ta + order * 5
        const tt = dr / vt
        const fan = (order % 2 ? 1 : -1) * Math.ceil(order / 2) * 7
        const phi = approachFrom(td) + clampN(fan, -40, 40)
        const [ux, uz] = courseVec(phi)
        const T1 = targetPose(td + tt)
        const hit = hitIndex(order, Srec, hitsToDraw)
        ac.hit = hit
        const [fx, fz] = courseVec(T1.heading)
        const lead = hit ? 0 : (R.next() < 0.5 ? -1 : 1) * (0.7 + R.next() * 0.6) * tgtL
        const aim = { x: T1.x + fx * lead, z: T1.z + fz * lead }
        const drop = { x: aim.x + ux * dr, z: aim.z + uz * dr }
        const far = 8000
        const tFar = td - (far - dr) / vr
        const tHigh = tFar - 70
        const off = slotOffset(k)
        const [hx, hz] = offsetBy(aim.x + ux * 16000, aim.z + uz * 16000, phi + 180, off)
        const [px, pz] = [-uz, ux] // right of the run
        const side = order % 2 ? 1 : -1
        pushKeys([
          { t: tHigh, x: hx, y: Math.max(500, (g.alt ?? 1200) * 0.6), z: hz },
          { t: tFar, x: aim.x + ux * far, y: 60, z: aim.z + uz * far },
          { t: td, x: drop.x, y: dropAlt, z: drop.z },
          { t: td + 9, x: drop.x - ux * vr * 9 + px * side * 150, y: 25, z: drop.z - uz * vr * 9 + pz * side * 150 },
          { t: td + 35, x: aim.x - ux * 1200 + px * side * 1800, y: 60, z: aim.z - uz * 1200 + pz * side * 1800 },
          { t: td + 200, x: aim.x - ux * 9000 + px * side * 6000, y: 700, z: aim.z - uz * 9000 + pz * side * 6000 },
        ])
        ac.releaseT = td
        const heading = (phi + 180) % 360
        ac.actions.push({ t: td, kind: 'drop', g: g.index, k, hit, aim, heading, target: cur.unit, weapon: tor?.id ?? null })
        tEnd = td + 200
      } else if ((profile === 'level' || profile === 'strafe' || profile === 'search') && tgt0) {
        const low = profile === 'strafe'
        const h = low ? 45 : a.altM ?? g.alt ?? 3000
        const v = low ? Math.min(vC * 1.2, model.vMax * 0.9) : vC
        const tr = ta + (low ? order * 6 : 0)
        const phi = approachFrom(tr)
        const [ux, uz] = courseVec(phi)
        const tf = Math.sqrt((2 * h) / 9.81)
        const T1 = targetPose(tr + (low ? 0 : tf))
        const off = slotOffset(k)
        const [cx, cz] = offsetBy(T1.x, T1.z, phi + 180, low ? { right: off.right * 0.5, back: 0, up: 0 } : off)
        const fwd = low ? 0 : v * tf
        const rel = { x: cx + ux * fwd, z: cz + uz * fwd }
        pushKeys([
          { t: tr - 14000 / v, x: rel.x + ux * 14000, y: h + (low ? 300 : off.up), z: rel.z + uz * 14000 },
          { t: tr - 4000 / v, x: rel.x + ux * 4000, y: h + (low ? 0 : off.up), z: rel.z + uz * 4000 },
          { t: tr, x: rel.x, y: h + (low ? 0 : off.up), z: rel.z },
          { t: tr + 6000 / v, x: rel.x - ux * 6000, y: h + (low ? 250 : off.up), z: rel.z - uz * 6000 },
          { t: tr + 12000 / v, x: rel.x - ux * 12000 + uz * 4000, y: Math.max(800, h), z: rel.z - uz * 12000 - ux * 4000 },
        ])
        ac.releaseT = tr
        if (profile === 'level') {
          const hit = hitIndex(order, Srec, hitsToDraw)
          ac.hit = hit
          const aim = { x: cx + (hit ? 0 : R.gauss() * 120), z: cz + (hit ? 0 : R.gauss() * 120) }
          ac.actions.push({ t: tr, kind: 'release', g: g.index, k, hit, aim, target: cur.unit, weapon: model.payload[0]?.weapon?.id ?? null, level: true })
        } else if (profile === 'strafe') {
          ac.actions.push({ t: tr - 3, kind: 'strafe', g: g.index, k, dur: 3, target: cur.unit, site: cur.site?.id ?? null })
        }
        tEnd = tr + 12000 / v
      } else if (profile === 'cap') {
        tEnd = capPlan(ac, keys, g, k, ctx, { vC, R, ta, fromShip })
      } else if (profile === 'escort') {
        tEnd = escortPlan(ac, keys, g, k, ctx, { vC, R, ta })
      }
    }
    if (!ac.plan.legs.length) ac.plan.legs.push({ type: 'keys', t0: keys[0].t, t1: keys[keys.length - 1].t, keys })
    // --- home: recover aboard, land at the field, or leave the box -------------
    homePlan(ac, g, k, ctx, { vC, tEnd, fromShip, fromModel, shipPose })
    // --- clear of the ground over land: the profiles' heights are over the sea's level -------------
    clearGround(ac, g, ctx)
    aircraft.push(ac)
  }

  // --- losses: the record's ranges, drawn by the seed, placed in time ----------
  scheduleLosses(g, aircraft, ctx, { R, preLoss, postLoss, turnedBack, capOn, profile, ta })
  // the plans' falls
  for (const ac of aircraft) {
    if (ac.lossT == null) continue
    const p = { x: 0, y: 0, z: 0 }
    const q = { x: 0, y: 0, z: 0 }
    planPos(ac, ac.lossT, p, ctx)
    planPos(ac, ac.lossT - 0.5, q, ctx)
    const vx = (p.x - q.x) * 2
    const vy = (p.y - q.y) * 2
    const vz = (p.z - q.z) * 2
    if (ac.lossHow === 'ditch') {
      ac.fall = fallPath(p.x, p.y, p.z, vx * 0.6, Math.min(vy, -3), vz * 0.6, heightAt)
      ac.fall.tImpact = Math.min(ac.fall.tImpact, 120)
    } else ac.fall = fallPath(p.x, p.y, p.z, vx, vy, vz, heightAt)
    ac.goneT = ac.lossT + ac.fall.tImpact
    ac.actions = ac.actions.filter((x) => x.t < ac.lossT)
  }
  g.aircraft = aircraft
}

/**
 * A formation slot's height at a route height: the vee's step down (slotOffset's negative `up`) never
 * takes a slot below SLOT_FLOOR, so a group the record brings down low (Akagi's and Kaga's torpedo
 * planes at 50 to 60 m over Pearl Harbor) keeps its rear sections over the water, not 15 to 25 m under it.
 */
const SLOT_FLOOR = 30
function slotY(alt, up) {
  return alt + (up < 0 ? Math.max(up, Math.min(0, SLOT_FLOOR - alt)) : up)
}

// --- clear of the ground ----------------------------------------------------------

const CLEAR = 60 // m of ground clearance a record aircraft keeps over land
const CLIMB = 10 // m/s: how fast a lift comes on ahead of the ground it clears (a climb an A6M or a B5N makes easily)
const SINK = 25 // m/s: how fast it goes off after (a fighter diving from a ridge onto its strafe)
const FIELD_S = [5, 30] // s from a field's runway: a take-off's or a landing's clearance ramps from nothing to CLEAR
const DROP_S = [1, 5] // s from a release or a drop over the water: the clearance of the shore beside it ramps the same way
const LEAF_S = 2 // s: the finest interval the search splits a plan into
const BIN_S = 4 // s: the lift's key spacing
const PIN_S = 1 // s: the ground this close to a pinned key (a runway, a release over the water) is let go

/**
 * Lift a record aircraft's plan clear of the ground over land. The profiles put their heights over the
 * sea's level (a strafe at 45 m, a run-in at 300 m, a landing approach at 200 m), so over Oʻahu the A6Ms'
 * strafe passed some 650 m inside the Waiʻanae range and the second wave's level bombers through the
 * Koʻolau. The plan as built is searched for where its aircraft is less than CLEAR above the ground over
 * land: each leg is split in time until an interval's whole reach (its ends and the most the leg can fly
 * between them: keysSpeed for keys, a bound for an orbit or a slot on a leader) is over the sea or clear
 * of the highest ground under it (world.js maxIn), down to LEAF_S. The shortfalls are then covered by a lift
 * added to the plan's height (liftThrough). It is zero at the pinned keys (a field's runway at take-off and
 * landing, a release or a drop over the water), so no release over the water moves; the plan's horizontal
 * path is unchanged everywhere, and over the sea away from the coast so is its height.
 */
function clearGround(ac, g, ctx) {
  const ground = ctx.ground
  const legs = ac.plan.legs
  if (!ground?.maxIn || !legs.length) return
  const exag = ground.exaggeration ?? 1
  const resolve = makeResolve(ctx)
  const t0 = ac.spawnT
  const t1 = Math.min(Number.isFinite(ac.endT) ? ac.endT : Infinity, legs[legs.length - 1].t1, t0 + 6 * 3600)
  const takeT = g.from < 0 && !g.enter && g.fromSite ? t0 : null
  const landT = ac.endHow === 'land' && !(ac.landOn >= 0) ? ac.endT : null
  const drops = []
  const p = { x: 0, y: 0, z: 0 }
  for (const a of ac.actions) {
    if (a.kind !== 'release' && a.kind !== 'drop') continue
    planPos(ac, a.t, p, ctx)
    if (ground.metresAt(p.x, p.z) <= 0) drops.push(a.t)
  }
  const pins = [...drops]
  if (takeT != null) pins.push(takeT)
  if (landT != null) pins.push(landT)
  // the most clearance asked anywhere in [ta, tb]: CLEAR, less on a take-off's or a landing's ramp from its runway and
  // on the ramp down to a release or a drop over the water and up from it
  const ramp = (s, [s0, s1]) => CLEAR * clampN((s - s0) / (s1 - s0), 0, 1)
  const clearAt = (ta, tb) => {
    let c = CLEAR
    if (takeT != null) c = Math.min(c, ramp(tb - takeT, FIELD_S))
    if (landT != null) c = Math.min(c, ramp(landT - ta, FIELD_S))
    for (const td of drops) c = Math.min(c, ramp(Math.max(Math.abs(ta - td), Math.abs(tb - td)), DROP_S))
    return c
  }
  const found = [] // ta, tb, metres short: flat triples
  // an interval [ta, tb] whose ends are A and B: V the most the leg flies in a second, ylo its lowest height
  const walk = (ta, tb, A, B, V, ylo, at) => {
    const dt = tb - ta
    const c = Math.hypot(B.x - A.x, B.z - A.z) / 2
    const r = (V * dt) / 2
    const e = r > c ? Math.sqrt(r * r - c * c) : 0
    const gm = ground.maxIn(Math.min(A.x, B.x) - e, Math.min(A.z, B.z) - e, Math.max(A.x, B.x) + e, Math.max(A.z, B.z) + e)
    if (gm <= 0) return
    const need = gm * exag + clearAt(ta, tb) - ylo(A, B, dt)
    if (need <= 0) return
    if (dt <= LEAF_S) {
      // beside a pin the leaves are split finer, so the ground just outside its PIN_S is still cleared
      const pinned = pins.some((tp) => tb > tp - PIN_S && ta < tp + PIN_S)
      if (!pinned) {
        found.push(ta, tb, need)
        return
      }
      if (dt <= LEAF_S / 8) return
    }
    const tm = (ta + tb) / 2
    const M = at(tm, { x: 0, y: 0, z: 0 })
    walk(ta, tm, A, M, V, ylo, at)
    walk(tm, tb, M, B, V, ylo, at)
  }
  const lowerEnd = (A, B) => Math.min(A.y, B.y) // keys: the height is monotone between keys
  for (let li = 0; li < legs.length; li++) {
    const leg = legs[li]
    const a0 = Math.max(leg.t0, t0)
    const b0 = Math.min(leg.t1, t1, legs[li + 1]?.t0 ?? Infinity)
    if (!(b0 > a0)) continue
    if (leg.type === 'keys') {
      const K = leg.keys
      const at = (t, o) => keysAt(K, t, o)
      for (let i = 0; i + 1 < K.length; i++) {
        const sa = Math.max(K[i].t, a0)
        const sb = Math.min(K[i + 1].t, b0)
        if (sb > sa) walk(sa, sb, at(sa, { x: 0, y: 0, z: 0 }), at(sb, { x: 0, y: 0, z: 0 }), keysSpeed(K, i), lowerEnd, at)
      }
    } else {
      const at = (t, o) => legAt(leg, t, o, resolve)
      // an orbit flies r·w about a centre that moves at a ship's speed, 40 m either side of its height; a slot on a
      // leader moves with it, weaving, and its height changes no faster than a dive's
      const V = leg.type === 'orbit' ? Math.abs(leg.r * leg.w) + 25 : 400
      const ylo = leg.type === 'orbit' ? () => leg.alt - 40 : (A, B, dt) => Math.max(60, Math.min(A.y, B.y) - 100 * dt)
      walk(a0, b0, at(a0, { x: 0, y: 0, z: 0 }), at(b0, { x: 0, y: 0, z: 0 }), V, ylo, at)
    }
  }
  // a pin clears the lift's keys off its ramp, so the lift comes down to it no faster than the ramp asks
  const spans = [...drops.map((t) => [t, DROP_S[1]]), ...[takeT, landT].filter((t) => t != null).map((t) => [t, FIELD_S[1]])]
  if (found.length) ac.plan.lift = liftThrough(found, spans)
}

/**
 * The lift over the shortfalls (flat triples ta, tb, metres): keys every BIN_S seconds, each the most any
 * shortfall within a bin of it needs, so between two keys the lift (monotone, path.js makeLift) is never
 * less than what the shortfalls there need; it comes on at CLIMB before them and goes off at SINK after,
 * and a dip between two shortfalls is filled where those ramps meet; zero at each pin, with the keys on
 * its ramp cleared and any shortfall the joined curve then misses beside it made a key of its own.
 */
function liftThrough(found, spans) {
  const raw = new Map()
  let k0 = Infinity
  let k1 = -Infinity
  for (let j = 0; j < found.length; j += 3) {
    const a = Math.floor(found[j] / BIN_S)
    const b = Math.floor(found[j + 1] / BIN_S)
    for (let k = a; k <= b; k++) raw.set(k, Math.max(raw.get(k) ?? 0, found[j + 2]))
    k0 = Math.min(k0, a)
    k1 = Math.max(k1, b)
  }
  let vmax = 0
  for (const v of raw.values()) vmax = Math.max(vmax, v)
  const R = Math.ceil(vmax / (CLIMB * BIN_S)) + 2
  const base = k0 - R
  const n = k1 + R - base + 1
  const v = new Float64Array(n)
  for (const [k, x] of raw) for (let d = -1; d <= 1; d++) v[k + d - base] = Math.max(v[k + d - base], x)
  for (let i = 1; i < n; i++) v[i] = Math.max(v[i], v[i - 1] - SINK * BIN_S)
  for (let i = n - 2; i >= 0; i--) v[i] = Math.max(v[i], v[i + 1] - CLIMB * BIN_S)
  let keys = []
  const at = (i) => (base + i + 0.5) * BIN_S
  for (let i = 0; i < n; i++) {
    if (v[i] <= 0) continue
    if (!(v[i - 1] > 0)) keys.push({ t: at(i) - v[i] / CLIMB, v: 0 })
    // a key inside a level run adds nothing
    if (!(v[i - 1] === v[i] && v[i + 1] === v[i])) keys.push({ t: at(i), v: v[i] })
    if (!(v[i + 1] > 0)) keys.push({ t: at(i) + v[i] / SINK, v: 0 })
  }
  const span0 = keys[0].t
  const span1 = keys[keys.length - 1].t
  const near = spans.filter(([tp]) => tp > span0 && tp < span1)
  if (!near.length) return makeLift(keys)
  keys = keys.filter((q) => !near.some(([tp, w]) => Math.abs(q.t - tp) < w))
  for (const [tp] of near) keys.push({ t: tp, v: 0 })
  keys.sort((a, b) => a.t - b.t)
  // the shortfalls within two minutes of a pin, held to the curve
  const check = []
  for (let j = 0; j < found.length; j += 3) if (near.some(([tp]) => found[j + 1] > tp - 120 && found[j] < tp + 120)) check.push({ t: found[j], v: found[j + 2] }, { t: found[j + 1], v: found[j + 2] })
  for (let it = 0; it < 16; it++) {
    makeLift(keys)
    const miss = check.filter((q) => liftAt(keys, q.t) < q.v - 0.01)
    if (!miss.length) break
    for (const q of miss) {
      const same = keys.find((x) => Math.abs(x.t - q.t) < 1e-6)
      if (same) same.v = Math.max(same.v, q.v)
      else keys.push({ t: q.t, v: q.v })
    }
    keys.sort((a, b) => a.t - b.t)
  }
  return makeLift(keys)
}

/** Whether attacker `order` of S carries one of the record's `n` hits (exactly n of the S, spread through the group). */
function hitIndex(order, S, n) {
  if (n <= 0 || order >= S) return false
  if (n >= S) return true
  return Math.floor(((order + 1) * n) / S) > Math.floor((order * n) / S)
}

/** A CAP aircraft: up from its carrier to an orbit, onto the group it is sent at, back to the orbit. */
function capPlan(ac, keys, g, k, ctx, { vC, R, ta, fromShip }) {
  const { groups, motion } = ctx
  const a = g.attack
  const alt = a.altM ?? g.alt ?? 1500
  const r = 3500 + (k % 4) * 600
  const w = (vC / r) * (k % 2 ? 1 : -1)
  const centre = fromShip >= 0 ? { unit: fromShip } : g.fromSite ? { point: g.fromSite } : { point: { x: keys[0].x, z: keys[0].z } }
  const t0 = keys[keys.length - 1].t + 60
  const legs = ac.plan.legs
  const orbit = (ts, te, phase) => ({ type: 'orbit', t0: ts, t1: te, centre, r, w, alt: alt + (k % 3) * 120, phase })
  const resolve = makeResolve(ctx)
  const phase0 = R.next() * Math.PI * 2
  const o1 = orbit(t0, Infinity, phase0)
  const tg = a.targetGroup >= 0 ? groups[a.targetGroup] : null
  // the intercept: from attack.t to the end of the target group's attack
  let tI0 = ta
  let tI1 = ta
  if (tg && tg.attack?.t != null) tI1 = Math.max(ta + 120, tg.attack.t + 60 + Math.min(tg.count, 12) * 6)
  const enduranceEnd = (keys[0].t ?? 0) + (g.model.enduranceS || 3600)
  const leadIn = (to, leg) => {
    const p = legAt(leg, leg.t0, { x: 0, y: 0, z: 0 }, resolve)
    return { t: leg.t0, x: p.x, y: p.y, z: p.z }
  }
  if (tg && tI1 > tI0 && tg.aircraft.length) {
    const lead = Math.min(k % Math.max(1, tg.count), tg.aircraft.length - 1)
    o1.t1 = tI0
    const follow = { type: 'follow', t0: tI0 + 45, t1: tI1, leader: { group: tg.index, k: lead }, off: { right: (k % 2 ? 1 : -1) * (150 + 60 * k), back: 350 + 80 * (k % 3), up: 80 }, weave: 0.35, phase: R.next() * 6 }
    const o2 = orbit(tI1 + 90, Math.max(enduranceEnd, tI1 + 600), phase0 + 1)
    const kUp = [...keys, leadIn(t0, o1)]
    legs.push({ type: 'keys', t0: kUp[0].t, t1: t0, keys: kUp })
    legs.push(o1)
    const pA = legAt(o1, o1.t1, { x: 0, y: 0, z: 0 }, resolve)
    const pB = legAt(follow, follow.t0, { x: 0, y: 0, z: 0 }, resolve)
    legs.push({ type: 'keys', t0: o1.t1, t1: follow.t0, keys: [{ t: o1.t1, ...pA }, { t: follow.t0, ...pB }] })
    legs.push(follow)
    const pC = legAt(follow, follow.t1, { x: 0, y: 0, z: 0 }, resolve)
    const pD = legAt(o2, o2.t0, { x: 0, y: 0, z: 0 }, resolve)
    legs.push({ type: 'keys', t0: follow.t1, t1: o2.t0, keys: [{ t: follow.t1, ...pC }, { t: o2.t0, ...pD }] })
    legs.push(o2)
    return o2.t1
  }
  o1.t1 = Math.max(enduranceEnd, t0 + 600)
  const kUp = [...keys, leadIn(t0, o1)]
  legs.push({ type: 'keys', t0: kUp[0].t, t1: t0, keys: kUp })
  legs.push(o1)
  return o1.t1
}

/** An escort: up and into a slot above and behind the group it covers, weaving, until that group turns for home. */
function escortPlan(ac, keys, g, k, ctx, { vC, R, ta }) {
  const { groups } = ctx
  const a = g.attack
  const tg = a.targetGroup >= 0 ? groups[a.targetGroup] : null
  const legs = ac.plan.legs
  const resolve = makeResolve(ctx)
  const tLast = keys[keys.length - 1].t
  if (!tg || !tg.aircraft.length) {
    legs.push({ type: 'keys', t0: keys[0].t, t1: tLast, keys })
    return tLast
  }
  const lead = tg.aircraft[0]
  const t0 = Math.max(tLast + 30, (lead.spawnT ?? 0) + 120)
  const t1 = Math.max(t0 + 60, (tg.attack?.t ?? ta) + 90)
  const follow = { type: 'follow', t0, t1, leader: { group: tg.index, k: 0 }, off: { right: (k % 2 ? 1 : -1) * (250 + 40 * k), back: 250, up: 500 + (k % 3) * 60 }, weave: 0.25, phase: R.next() * 6 }
  const p = legAt(follow, t0, { x: 0, y: 0, z: 0 }, resolve)
  legs.push({ type: 'keys', t0: keys[0].t, t1: t0, keys: [...keys, { t: t0, ...p }] })
  legs.push(follow)
  return t1
}

/** Home: aboard the recovering carrier, at the field, or out of the box. */
function homePlan(ac, g, k, ctx, { vC, tEnd, fromShip, fromModel, shipPose }) {
  const legs = ac.plan.legs
  const resolve = makeResolve(ctx)
  const last = legs[legs.length - 1]
  if (!Number.isFinite(last.t1)) {
    ac.endT = Infinity
    return
  }
  const p0 = legAt(last, last.t1, { x: 0, y: 0, z: 0 }, resolve)
  const rec = g.recover
  const to = rec?.to >= 0 ? rec.to : g.offBox ? -1 : fromShip
  const keys = [{ t: last.t1, ...p0 }]
  if (to >= 0) {
    const tm = ctx.shipModel(ctx.ships[to].kitId)
    let tLand = rec?.t != null ? rec.t + k * 30 : last.t1 + 600
    const q0 = shipPose(to, tLand)
    const dist = Math.hypot(q0.x - p0.x, q0.z - p0.z)
    tLand = Math.max(tLand, last.t1 + dist / (vC * 0.95) + 60)
    const q = shipPose(to, tLand)
    const [ux, uz] = courseVec(q.heading)
    const deckY = (tm?.fdTop ?? tm?.deck ?? 15) + 1.5
    const L = tm?.L ?? 200
    keys.push({ t: tLand - 120, x: q.x - ux * 6000, y: 300, z: q.z - uz * 6000 })
    keys.push({ t: tLand - 30, x: q.x - ux * (1500 + q.speed * 30), y: 80, z: q.z - uz * (1500 + q.speed * 30) })
    keys.push({ t: tLand, x: q.x + ux * L * 0.1, y: deckY, z: q.z + uz * L * 0.1 })
    if (keys[1].t <= last.t1 + 1) keys.splice(1, 1)
    if (keys[1] && keys[1].t <= last.t1 + 1) keys.splice(1, 1)
    legs.push({ type: 'keys', t0: last.t1, t1: tLand, keys })
    ac.endT = tLand
    ac.endHow = 'land'
    ac.landOn = to
    ac.actions.push({ t: tLand, kind: 'land', g: g.index, k, unit: to })
    return
  }
  if (g.fromSite && !g.offBox) {
    const s = g.fromSite
    const ground = (ctx.heightAt ? ctx.heightAt(s.x, s.z) : 0) + 2
    const dist = Math.hypot(s.x - p0.x, s.z - p0.z)
    const tLand = last.t1 + dist / vC + 90 + k * 20
    keys.push({ t: tLand - 60, x: s.x + 3000, y: 200, z: s.z })
    keys.push({ t: tLand, x: s.x, y: ground, z: s.z })
    legs.push({ type: 'keys', t0: last.t1, t1: tLand, keys })
    ac.endT = tLand
    ac.endHow = 'land'
    ac.actions.push({ t: tLand, kind: 'land', g: g.index, k, unit: -1 })
    return
  }
  // out of the box the way it came (or straight on)
  const ex = g.enter ? { x: g.enter.x, z: g.enter.z } : { x: p0.x * 3, z: p0.z * 3 }
  const dist = Math.hypot(ex.x - p0.x, ex.z - p0.z)
  const tOut = last.t1 + Math.max(120, dist / vC)
  keys.push({ t: tOut, x: ex.x, y: Math.max(800, p0.y), z: ex.z })
  legs.push({ type: 'keys', t0: last.t1, t1: tOut, keys })
  ac.endT = tOut
  ac.endHow = 'exit'
}

/** The record's losses, drawn and placed: before the attack (those that never reached it, from the rear), after it (the rest). */
function scheduleLosses(g, aircraft, ctx, { R, preLoss, postLoss, turnedBack = 0, capOn, profile, ta }) {
  const n = aircraft.length
  const at = (ac) => ac.releaseT ?? ta ?? ac.spawnT + 1800
  // before the attack: the rear aircraft, shot down by the CAP sent at the group or by the AA on the run in
  if (preLoss > 0) {
    let w0
    let w1
    if (capOn && capOn.attack?.t != null) {
      w0 = capOn.attack.t + 60
      w1 = Math.max(w0 + 30, (ta ?? w0 + 300) - 8)
    } else if (ta != null) {
      w0 = ta - (profile === 'torpedo' ? 150 : 90)
      w1 = ta - 5
    } else {
      w0 = aircraft[0].spawnT + 600
      w1 = w0 + 600
    }
    for (let j = 0; j < preLoss; j++) {
      const ac = aircraft[n - 1 - j]
      const t = w0 + ((w1 - w0) * (j + 0.5)) / preLoss
      ac.lossT = Math.min(t, (ac.releaseT ?? Infinity) - 1)
      ac.lossHow = 'shot'
      ac.lossCause = capOn ? capOn.index : 'aa'
    }
  }
  // the ones that reached no release and were not lost: no release, no hit
  for (let j = 0; j < turnedBack; j++) {
    const ac = aircraft[n - 1 - preLoss - j]
    if (!ac) break
    ac.noReach = true
    ac.hit = false
    ac.actions = ac.actions.filter((x) => x.kind !== 'release' && x.kind !== 'drop')
  }
  // after: among those that reached the attack; half to the AA on the way out, half to the sea on the way home
  const reached = aircraft.slice(0, Math.max(0, n - preLoss - turnedBack))
  const pool = reached.filter((ac) => ac.endT > at(ac) + 60)
  const pick = []
  for (let j = 0; j < postLoss && pool.length; j++) pick.push(pool.splice(Math.floor(R.next() * pool.length), 1)[0])
  pick.forEach((ac, j) => {
    const tr = at(ac)
    if (j % 2 === 0 && profile !== 'cap' && profile !== 'escort' && profile !== 'search') {
      ac.lossT = tr + 4 + R.next() * 20
      ac.lossHow = 'shot'
      ac.lossCause = 'aa'
    } else {
      const end = Number.isFinite(ac.endT) ? ac.endT : tr + 3600
      ac.lossT = tr + 600 + R.next() * Math.max(60, end - tr - 900)
      ac.lossHow = 'ditch'
      ac.lossCause = 'fuel'
    }
  })
}

/** Resolve an orbit centre or a formation leader to a pose (record only). */
export function makeResolve(ctx) {
  const { motion, groups } = ctx
  const pose = { x: 0, z: 0, vx: 0, vz: 0, heading: 0, speed: 0 }
  const p = { x: 0, y: 0, z: 0 }
  const q = { x: 0, y: 0, z: 0 }
  return function resolve(ref, t, out) {
    if (ref.unit != null) {
      motion.pose(ref.unit, t, pose)
      out.x = pose.x
      out.z = pose.z
      out.y = 0
      out.heading = pose.heading
      return out
    }
    if (ref.point) {
      out.x = ref.point.x
      out.z = ref.point.z
      out.y = 0
      out.heading = 0
      return out
    }
    if (ref.group != null) {
      const ac = groups[ref.group].aircraft[ref.k]
      if (!ac) {
        out.x = 0
        out.z = 0
        out.y = 1000
        out.heading = 0
        return out
      }
      planPos(ac, t, p, ctx)
      planPos(ac, t - 1, q, ctx)
      out.x = p.x
      out.y = p.y
      out.z = p.z
      out.heading = headingOf(p.x - q.x, p.z - q.z)
      return out
    }
    out.x = 0
    out.z = 0
    out.y = 0
    out.heading = 0
    return out
  }
}

/** An aircraft's record position at t (clamped to its plan; falling after its loss). */
export function planPos(ac, t, out, ctx) {
  if (ac.lossT != null && t > ac.lossT && ac.fall) {
    ac.fall.at(Math.min(t - ac.lossT, ac.fall.tImpact), out)
    return out
  }
  const legs = ac.plan.legs
  if (!legs.length) return out
  const tc = Math.max(legs[0].t0, Math.min(t, legs[legs.length - 1].t1))
  let leg = legs[0]
  for (let i = 0; i < legs.length; i++) {
    if (tc >= legs[i].t0) leg = legs[i]
    else break
  }
  ctx._resolve ||= makeResolve(ctx)
  legAt(leg, Math.min(tc, leg.t1), out, ctx._resolve)
  if (ac.plan.lift) out.y += liftAt(ac.plan.lift, tc)
  return out
}

export { wrap180 }
