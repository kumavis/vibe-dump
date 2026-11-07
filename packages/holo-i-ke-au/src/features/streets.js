// The towns' streets, dated (DATA.md "Streets, dated"; DESIGN.md §5.4): the
// streets of today that the sheets show standing by a year, drawn from that
// year as the settlements' own streets are drawn, a ribbon on the ground of
// the moment (ribbons.js), and the lots the settlements lay along them
// (data/streets.js StreetNet, asked for by settlements.js and towns.js).
//
// streets/manifest.json is read once; an island's towns are read and decoded
// when its settlements or its ribbons first ask, and kept. What is drawn, one
// batch per look, each segment carrying its years (aSpan, as the works'
// roads do, with this module's eased year): packed earth until 1910, a
// macadam grey to 1950, asphalt after, crossfading at the turns; a street
// comes in over the year before the sheet that first shows it. Drawn near
// in only, where the towns' buildings are (towns.js RIG), and only on an
// island in its slot. A data set without streets/ draws none, and its
// settlements keep the modelled grid everywhere.

import * as THREE from 'three'
import { Ribbons } from './ribbons.js'
import { TOWN_PALETTE } from './buildings.js'
import { StreetNet } from '../data/streets.js'
import { OFF } from '../config.js'

const LINGER = 30
// the camera's distance over which the streets come in (as the towns' buildings do, a little further out)
const RIG = [110, 160]
// a point every 25 m along each street, so it drapes on the ground
const STEP = 0.25
const NEVER = 1e5
const lin = (hex) => new THREE.Color(hex).toArray()
// the looks by the years (as settlements.js streets() colours its grid's)
const LOOKS = [
  { name: 'earth', until: 1910, mode: 'earth', colour: lin('#9a8668'), alpha: 0.55 },
  { name: 'macadam', from: 1910, until: 1950, mode: 'earth', colour: lin('#8a8277'), alpha: 0.6 },
  { name: 'asphalt', from: 1950, mode: 'paved', colour: lin(TOWN_PALETTE.asphalt), alpha: 0.75 },
]
const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export class Streets {
  constructor(app) {
    this.app = app
    this.group = new THREE.Group()
    this.group.name = 'streets'
    app.scene.add(this.group)
    this.nets = new Map() // island id → Promise<StreetNet | null>
    this.views = new Map() // island id → { ribbons, batches, lastSeen }
    this.yearNow = app.timeline.year
    this.yearU = { value: this.yearNow }
    this.hidden = false
    app.updaters.push((dt) => this.update(dt))
  }

  /** streets/manifest.json, once; null where there is none. */
  manifest() {
    // (held off for a measure: config.js OFF)
    if (OFF.has('streets')) return (this._manifest ??= Promise.resolve(null))
    this._manifest ??= fetch(this.app.data.abs('streets/manifest.json'))
      .then((r) => (r.ok ? r.json() : null))
      .catch(() => null)
    return this._manifest
  }

  /** Island `id`'s street network (data/streets.js), or null where it has no town with streets. */
  net(id) {
    let p = this.nets.get(id)
    if (!p) {
      p = (async () => {
        const m = await this.manifest()
        const towns = (m?.towns || []).filter((t) => t.island === id)
        if (!towns.length) return null
        const fcs = await Promise.all(
          towns.map(async (t) => {
            const r = await fetch(this.app.data.abs(`streets/${t.file}`))
            if (!r.ok) throw new Error(`streets/${t.file}: HTTP ${r.status}`)
            return r.json()
          }),
        )
        const t0 = performance.now()
        const net = new StreetNet(fcs, this.app.data.proj)
        net.ms = Math.round(performance.now() - t0)
        return net
      })().catch((err) => {
        this.app.warn(`streets ${id}: ${err.message} (its towns keep the modelled grid)`)
        return null
      })
      this.nets.set(id, p)
      p.then((net) => (p.net = net))
    }
    return p
  }

  /**
   * One island's ribbons: a batch per town and look, each segment with its
   * years in that look, laid in the order its street comes in, so a year
   * draws only the run of segments in by then (instanceCount) and a town out
   * of view draws nothing.
   */
  view(id, net) {
    const ribbons = new Ribbons(this.app.shared, this.app.camera)
    const batches = []
    const towns = new Map()
    for (const L of net.lines) {
      if (!towns.has(L.town)) towns.set(L.town, [])
      towns.get(L.town).push(L)
    }
    for (const [town, lines] of towns) {
      for (const look of LOOKS) {
        const segs = []
        const box = [Infinity, Infinity, -Infinity, -Infinity]
        for (const L of lines) {
          const a = Math.max(L.from, look.from ?? -NEVER)
          const b = Math.min(L.to ?? NEVER, look.until ?? NEVER)
          if (a > b || (look.until && a >= look.until)) continue
          const sp = [a === L.from ? a - 1 : a - 0.5, a === L.from ? a : a + 0.5, b === look.until ? b - 0.5 : b, b === look.until ? b + 0.5 : b + 1]
          if (b >= NEVER) {
            sp[2] = NEVER
            sp[3] = NEVER + 1
          }
          // (resampled, so the ribbon follows the ground between the line's own points)
          const pts = [L.pts[0]]
          for (let i = 1; i < L.pts.length; i++) {
            const [ax, az] = L.pts[i - 1]
            const [bx, bz] = L.pts[i]
            const n = Math.max(1, Math.ceil(Math.hypot(bx - ax, bz - az) / STEP))
            for (let k = 1; k <= n; k++) pts.push([ax + ((bx - ax) * k) / n, az + ((bz - az) * k) / n])
          }
          let s = 0
          for (let i = 1; i < pts.length; i++) {
            const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
            if (d < 1e-6) continue
            segs.push([pts[i - 1][0], pts[i - 1][1], pts[i][0], pts[i][1], L.width, s, s + d, L.len, sp])
            box[0] = Math.min(box[0], pts[i - 1][0], pts[i][0])
            box[1] = Math.min(box[1], pts[i - 1][1], pts[i][1])
            box[2] = Math.max(box[2], pts[i - 1][0], pts[i][0])
            box[3] = Math.max(box[3], pts[i - 1][1], pts[i][1])
            s += d
          }
        }
        if (!segs.length) continue
        // (in the order they come in: a segment is drawn from its span's first year, ribbons.js)
        segs.sort((p, q) => p[8][0] - q[8][0])
        const n = segs.length
        const seg = new Float32Array(n * 4)
        const info = new Float32Array(n * 4)
        const end = new Float32Array(n)
        const span = new Float32Array(n * 4)
        const starts = new Float32Array(n)
        let last = -Infinity
        segs.forEach((q, i) => {
          seg.set(q.slice(0, 4), i * 4)
          info.set([q[4], q[4], q[5], q[6]], i * 4)
          end[i] = q[7]
          span.set(q[8], i * 4)
          starts[i] = q[8][0]
          last = Math.max(last, q[8][3])
        })
        const batch = ribbons.addPacked(
          { seg, info, end, span, grow: new Float32Array(n) },
          { mode: look.mode, colour: look.colour, alpha: 0, minPx: 0.6, lift: 0.005, order: 4, year: this.yearU },
        )
        if (batch) batches.push({ batch, look, n, town, starts, last, box: new THREE.Box3(new THREE.Vector3(box[0] - 0.2, -1, box[1] - 0.2), new THREE.Vector3(box[2] + 0.2, 0, box[3] + 0.2)) })
      }
    }
    this.group.add(ribbons.group)
    return { id, ribbons, batches, lastSeen: performance.now() }
  }

  /** How many of a batch's segments are in by the year (they are laid in the order they come in). */
  static countIn(starts, y) {
    let lo = 0
    let hi = starts.length
    while (lo < hi) {
      const m = (lo + hi) >> 1
      if (starts[m] < y) lo = m + 1
      else hi = m
    }
    return lo
  }

  update(dt) {
    const app = this.app
    const target = app.timeline.year
    if (dt > 0) {
      this.yearNow += (target - this.yearNow) * (1 - Math.exp(-dt * 2.2))
      if (Math.abs(target - this.yearNow) < 0.05) this.yearNow = target
    } else this.yearNow = target
    this.yearU.value = this.yearNow
    const d = app.rig?.state.distance ?? Infinity
    const show = this.hidden ? 0 : 1 - smooth(RIG[0], RIG[1], d)
    const now = performance.now()
    for (const t of app.world?.islands || []) {
      const id = t.pack.id
      const k = t.slot >= 0 ? t.k : 0
      let v = this.views.get(id)
      if (k > 0.02 && show > 0.001) {
        const p = this.net(id)
        if (!v && p.net) {
          v = this.view(id, p.net)
          this.views.set(id, v)
        }
      }
      if (!v) continue
      const s = show * smooth(0.6, 0.95, k)
      if (s > 0.001) v.lastSeen = now
      if (s > 0.001) {
        // (the view's frustum, once a frame, for the towns' batches)
        if (!this._frustum) {
          this._frustum = new THREE.Frustum()
          this._pv = new THREE.Matrix4()
        }
        const cam = app.camera
        this._pv.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse)
        this._frustum.setFromProjectionMatrix(this._pv)
      }
      const top = (t.pack.data.hi ?? 4000) * (app.world?.uniforms.uVert.value ?? 0.05) + 1
      for (const b of v.batches) {
        // (only the segments in by the year, and none of a town out of view or gone by then)
        const n = s > 0.001 && this.yearNow < b.last ? Streets.countIn(b.starts, this.yearNow) : 0
        b.box.max.y = top
        const on = n > 0 && this._frustum.intersectsBox(b.box)
        b.batch.mesh.geometry.instanceCount = on ? n : 0
        b.batch.uniforms.uAlpha.value = on ? s * b.look.alpha : 0
      }
      v.ribbons.update(app.renderer)
    }
    for (const [id, v] of this.views) {
      if (now - v.lastSeen <= LINGER * 1000) continue
      v.ribbons.dispose()
      this.group.remove(v.ribbons.group)
      this.views.delete(id)
    }
  }

  settle() {
    this.update(0)
  }

  /** For the tools: per island, the lines, the lots and what is drawn. */
  stats() {
    const out = {}
    for (const [id, p] of this.nets) {
      const net = p.net
      if (!net) {
        out[id] = net === null ? null : 'loading'
        continue
      }
      const y = this.yearNow
      const standing = net.lines.filter((L) => L.from <= y && (L.to === null || y <= L.to))
      out[id] = {
        lines: net.lines.length,
        standing: standing.length,
        km: +(standing.reduce((s, L) => s + L.len, 0) / 10).toFixed(1),
        lots: net.lots.length,
        breaks: net.breaks,
        ms: net.ms,
        drawn: this.views.get(id)?.batches.map((b) => `${b.look.name}:${b.n}:${b.batch.uniforms.uAlpha.value.toFixed(2)}`) ?? null,
      }
    }
    return out
  }
}
