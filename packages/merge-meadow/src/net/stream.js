// Live pose stream (design §4.2, §16.4). Each owner broadcasts packed frames on
// the doc's ephemeral channel: NPCs at `hz` (10), its own player at `playerHz` (20):
//   { t:'po', k: <table key>, ts: <sender ms>, f: Float32Array[idx,x,y,z,yaw,anim]×N, ids?, an? }
// 24 bytes per entity. `ids` (the table) rides along when the owned set changes,
// on the first frame after any presence hello, and every `tableEvery`-th frame,
// so a late joiner decodes within a second. Resting entities are only included
// on those table frames (1 Hz keep-alive), which is what keeps 50+ streamed
// entities affordable now that automerge-repo re-gossips every ephemeral message.
// `anim` is a code into ANIMS; a non-standard state name travels in `an`.
//
// Receivers render `delayMs` (120) behind a per-sender clock offset (running
// minimum of arrival − ts, so base latency and skew are absorbed), lerping the
// bracketing samples. Past the newest sample they extrapolate with a velocity
// measured over >= 50 ms, clamped to 30 m/s, for at most 200 ms, then hold —
// S2's unclamped version flew an entity 245 m after a stall. Corrections after a
// gap are blended over blendMs (250). An entity whose stream falls silent holds
// its last pose; only after snapMs (5 s, longer than the 2.5 s failover) does it
// snap back to its doc transform. On ownership loss the caller hold()s the last
// simulated pose until the new owner's first frame; on gain it forget()s.
export const STRIDE = 6
export const ANIMS = ['idle', 'walk', 'run', 'attack', 'die', 'sit']
const ANIM_EXTRA = 100
const DEG = Math.PI / 180
const PLAYER = 'player:'

const fnv = (s) => { let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) } return h >>> 0 }
export const tableKey = (ids) => fnv(ids.join('\n'))

// rows: [[id, x, y, z, yaw, animName], ...]; table: ids the indices refer to
// (defaults to the rows' own ids). Returns the message; `withTable` adds `ids`.
export function encodeFrame (rows, { table, ts = Date.now(), withTable = true } = {}) {
  const ids = table ?? rows.map((r) => r[0])
  const index = new Map(ids.map((id, i) => [id, i]))
  const f = new Float32Array(rows.length * STRIDE)
  const extra = []
  rows.forEach((r, i) => {
    const o = i * STRIDE
    f[o] = index.get(r[0]); f[o + 1] = r[1]; f[o + 2] = r[2]; f[o + 3] = r[3]; f[o + 4] = r[4]
    const name = String(r[5] ?? 'idle'); let code = ANIMS.indexOf(name)
    if (code < 0) { let j = extra.indexOf(name); if (j < 0) j = extra.push(name) - 1; code = ANIM_EXTRA + j }
    f[o + 5] = code
  })
  return { t: 'po', k: tableKey(ids), ts, f, ...(withTable ? { ids } : {}), ...(extra.length ? { an: extra } : {}) }
}

const asF32 = (f) => {
  if (f instanceof Float32Array) return f
  if (ArrayBuffer.isView(f)) return new Float32Array(f.buffer.slice(f.byteOffset, f.byteOffset + f.byteLength))
  if (f instanceof ArrayBuffer) return new Float32Array(f)
  return Float32Array.from(f ?? [])
}

// tables: Map(key -> ids) per sender. -> rows or null when the table is unknown.
export function decodeFrame (msg, tables) {
  if (Array.isArray(msg.ids)) tables.set(msg.k, msg.ids)
  const ids = tables.get(msg.k)
  if (!ids) return null
  const f = asF32(msg.f); const out = []
  for (let o = 0; o + STRIDE <= f.length; o += STRIDE) {
    const id = ids[f[o]]
    if (id == null) continue
    const c = f[o + 5]
    const anim = c >= ANIM_EXTRA ? String(msg.an?.[c - ANIM_EXTRA] ?? 'idle') : (ANIMS[c] ?? 'idle')
    out.push([String(id), f[o + 1], f[o + 2], f[o + 3], f[o + 4], anim])
  }
  return out
}

const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a))

export function makePoseStream (handle, {
  world, peerId, owns, owner, presence,
  hz = 10, playerHz = 20, delayMs = 120, maxExtrapMs = 200, minBaselineMs = 50, maxSpeed = 30,
  blendMs = 250, snapMs = 5000, keepMs = 2000, tableEvery = 10, gapMs = 300, acceptSilentMs = 300,
  restMove = 0.001, restTurn = 0.1 * DEG, now = () => Date.now(), send,
} = {}) {
  const out = send ?? ((m) => { try { handle.broadcast(m) } catch {} })
  const ownerOf = owner ?? ((id) => world.owner?.(id) ?? null)
  const myPlayer = PLAYER + peerId

  // ---- send side ----
  const tx = {
    npc: { k: null, n: 0, next: 0, last: new Map(), hello: false },
    player: { k: null, n: 0, next: 0, last: new Map(), hello: false },
  }
  // a presence hello asks EACH stream to send its table next (§4.2), so the flag is per stream
  const helloAll = () => { tx.npc.hello = true; tx.player.hello = true }
  const stats = { sent: 0, recv: 0, rows: 0, dropped: 0, noTable: 0, bytesF: 0 }

  const rowOf = (e) => { const l = e.live; return [e.id, l.p[0], l.p[1], l.p[2], l.yaw ?? 0, l.anim ?? 'idle'] }
  const moved = (st, r) => {
    const prev = st.last.get(r[0])
    return !prev || Math.hypot(r[1] - prev[1], r[2] - prev[2], r[3] - prev[3]) > restMove || Math.abs(wrapAngle(r[4] - prev[4])) > restTurn || r[5] !== prev[5]
  }

  function sendFrame (st, entities, t, forceAll) {
    const table = entities.map((e) => e.id).sort()
    const k = tableKey(table)
    const withTable = k !== st.k || st.hello || st.n % tableEvery === 0
    const all = forceAll || withTable
    const rows = []
    for (const id of table) { const r = rowOf(world.get(id)); if (all || moved(st, r)) rows.push(r) }
    st.n++
    if (!rows.length && !withTable) return false
    const msg = encodeFrame(rows, { table, ts: t, withTable })
    st.k = k
    for (const r of rows) st.last.set(r[0], r)
    if (withTable) for (const id of [...st.last.keys()]) if (!table.includes(id)) st.last.delete(id)
    out(msg)
    if (withTable) st.hello = false
    stats.sent++; stats.rows += rows.length; stats.bytesF += msg.f.byteLength
    return true
  }

  function tick (t = now()) {
    presence?.selfCheck?.(t)
    let sent = false; let have = false
    const npcs = []; const players = []
    for (const e of world.entities.values()) {
      if (!e.live?.p || !owns(e.id)) continue
      if (e.id === myPlayer) players.push(e)
      else if (!e.id.startsWith(PLAYER)) npcs.push(e)
    }
    have = npcs.length > 0 || players.length > 0
    for (const [st, list, rate] of [[tx.player, players, playerHz], [tx.npc, npcs, hz]]) {
      if (t < st.next) continue
      const period = 1000 / rate
      st.next = st.next && t - st.next < period ? st.next + period : t + period
      // a player is never "resting" for the stream: its frames double as our heartbeat
      // nothing owned: send nothing, and forget the table so a later gain resends it
      if (list.length) sent = sendFrame(st, list, t, st === tx.player) || sent
      else st.k = null
    }
    presence?.setStreaming?.(have)
    return sent
  }

  // ---- receive side ----
  const tables = new Map() // sender -> Map(k -> ids)
  const offsets = new Map() // sender -> { min, at }
  const buf = new Map() // id -> { samples: [{lt, x,y,z,yaw,anim}], sender, at, gapped }
  const seen = new Map() // id -> Map(sender -> last arrival)
  const blend = new Map() // id -> { d: [dx,dy,dz,dyaw], at }
  const frameFns = new Set()

  const accept = (id, sender, at) => {
    let s = seen.get(id); if (!s) seen.set(id, s = new Map()); s.set(sender, at)
    if (owns(id)) return false
    const o = ownerOf(id)
    if (o === sender) return true
    // the believed owner is silent for this entity: take whoever streams it
    return !(s.get(o) > at - acceptSilentMs)
  }

  function receive (sender, msg) {
    if (!sender || sender === peerId) return
    const at = now()
    let tb = tables.get(sender); if (!tb) tables.set(sender, tb = new Map())
    const rows = decodeFrame(msg, tb)
    if (!rows) { stats.noTable++; return }
    // offset = running min of (arrival − ts), allowed to creep up 1 ms/s for drift but
    // never reset: a reset after a stall put two samples ~0 ms apart (S2's 245 m bug)
    let o = offsets.get(sender); const d = at - msg.ts
    if (!o) offsets.set(sender, o = { min: d, at })
    else { o.min = Math.min(d, o.min + (at - o.at) / 1000); o.at = at }
    const lt = msg.ts + o.min
    stats.recv++
    for (const [id, x, y, z, yaw, anim] of rows) {
      if (!accept(id, sender, at)) { stats.dropped++; continue }
      let b = buf.get(id)
      if (!b || b.sender !== sender) { b = { samples: [], sender, at, gapped: true }; buf.set(id, b) }
      const s = b.samples
      if (s.length && lt <= s[s.length - 1].lt) continue
      if (at - b.at > gapMs) b.gapped = true
      s.push({ lt, x, y, z, yaw, anim })
      while (s.length > 2 && s[0].lt < at - keepMs) s.shift()
      b.at = at
    }
    for (const fn of frameFns) { try { fn({ sender, rows, hello: false }) } catch (e) { console.error('[stream] onFrame', e) } }
  }

  // pose at local time t (default now − delay); null if nothing buffered
  function sample (id, t = now() - delayMs) {
    const s = buf.get(id)?.samples
    if (!s?.length) return null
    const last = s[s.length - 1]
    if (t >= last.lt) {
      const prev = s[s.length - 2]; const dt = Math.min(t - last.lt, maxExtrapMs)
      if (!prev || dt <= 0) return { p: [last.x, last.y, last.z], v: [0, 0, 0], yaw: last.yaw, anim: last.anim, age: t - last.lt }
      const base = Math.max(last.lt - prev.lt, minBaselineMs) / 1000
      let vx = (last.x - prev.x) / base; let vz = (last.z - prev.z) / base
      const sp = Math.hypot(vx, vz); if (sp > maxSpeed) { vx *= maxSpeed / sp; vz *= maxSpeed / sp }
      return { p: [last.x + vx * dt / 1000, last.y, last.z + vz * dt / 1000], v: [vx, 0, vz], yaw: last.yaw, anim: last.anim, age: t - last.lt, extrap: true }
    }
    let i = s.length - 1; while (i > 0 && s[i - 1].lt > t) i--
    const a = s[Math.max(0, i - 1)]; const c = s[i]
    if (a === c || t <= a.lt) return { p: [a.x, a.y, a.z], v: [0, 0, 0], yaw: a.yaw, anim: a.anim, age: 0 }
    const u = (t - a.lt) / (c.lt - a.lt); const base = Math.max(c.lt - a.lt, minBaselineMs) / 1000
    let vx = (c.x - a.x) / base; let vz = (c.z - a.z) / base
    const sp = Math.hypot(vx, vz); if (sp > maxSpeed) { vx *= maxSpeed / sp; vz *= maxSpeed / sp }
    return { p: [a.x + (c.x - a.x) * u, a.y + (c.y - a.y) * u, a.z + (c.z - a.z) * u], v: [vx, 0, vz], yaw: a.yaw + wrapAngle(c.yaw - a.yaw) * u, anim: u < 0.5 ? a.anim : c.anim, age: 0 }
  }

  function snapToDoc (e) {
    const tr = e.c?.transform
    const p = tr?.p ?? [0, 0, 0]
    e.live.p = [Number(p[0]) || 0, Number(p[1]) || 0, Number(p[2]) || 0]
    e.live.v = [0, 0, 0]
    e.live.yaw = (Number(tr?.r?.[1]) || 0) * DEG
  }

  // remote poses -> live of every entity I do not own
  function apply (t = now()) {
    for (const [id, b] of buf) {
      const e = world.get(id)
      if (!e) { if (t - b.at > snapMs) { buf.delete(id); seen.delete(id); blend.delete(id) } continue }
      if (owns(id)) continue
      if (t - b.at > snapMs) { snapToDoc(e); buf.delete(id); blend.delete(id); continue }
      const s = sample(id, t - delayMs)
      if (!s) continue
      const l = e.live
      if (b.gapped) {
        b.gapped = false
        if (l.p) blend.set(id, { d: [l.p[0] - s.p[0], l.p[1] - s.p[1], l.p[2] - s.p[2], wrapAngle((l.yaw ?? s.yaw) - s.yaw)], at: t })
      }
      const bl = blend.get(id)
      let k = 0
      if (bl) { k = 1 - (t - bl.at) / blendMs; if (k <= 0) { blend.delete(id); k = 0 } }
      l.p = k ? [s.p[0] + bl.d[0] * k, s.p[1] + bl.d[1] * k, s.p[2] + bl.d[2] * k] : s.p
      l.v = s.v
      l.yaw = k ? s.yaw + bl.d[3] * k : s.yaw
      l.anim = s.anim
      l.streamAge = s.age
    }
  }

  // on ownership LOSS: keep showing my last simulated pose until the new owner's
  // first frame lands, instead of the doc transform (up to a checkpoint stale:
  // S2 measured 0.5–2.3 m snaps without this)
  function hold (id, pose) {
    const l = pose ?? world.get(id)?.live
    if (!l?.p) return
    const t = now()
    buf.set(id, { samples: [{ lt: t - delayMs, x: l.p[0], y: l.p[1], z: l.p[2], yaw: l.yaw ?? 0, anim: l.anim ?? 'idle' }], sender: '(held)', at: t, gapped: false })
    blend.delete(id)
  }
  // on GAIN: stale frames from before I owned it must not replay when I lose it again
  function forget (id) { buf.delete(id); blend.delete(id); seen.delete(id) }

  const onMsg = ({ message, senderId }) => {
    if (message?.t === 'po') receive(senderId, message)
    else if (message?.t === 'pr' && message.hello) helloAll()
  }
  handle?.on?.('ephemeral-message', onMsg)

  return {
    tick, apply, hold, forget, sample, receive,
    onFrame (fn) { frameFns.add(fn); return () => frameFns.delete(fn) },
    lastHeard (id) { const b = buf.get(id); return b ? { sender: b.sender, at: b.at } : null },
    resendTable () { helloAll() },
    stats: () => ({ ...stats }),
    stop () { handle?.off?.('ephemeral-message', onMsg); frameFns.clear(); presence?.setStreaming?.(false) },
  }
}
