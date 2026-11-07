// The schools (DATA.md "Schools, dated"; ISSUES.md 11): every school the
// file places, standing from the year it opened to the year it closed, on
// every island, at the near zoom and out to the island zoom as the works'
// buildings are (features/works.js), among the towns.
//
// schools.json is read once, when the first island takes its slot or its
// settlements ask what to keep off, and decoded on the main thread (it is
// small) into each island's schools and their eras (data/schools.js): what
// stood at a school in a year, the frame schoolhouse, the mission's hall,
// the territory's block, the campus, each its own instance with the years it
// stands, crossing over to the next on one window so the two dither over
// complementary pixels (kit.js), never both on one. An island draws its
// schools while it holds a slot: one instanced mesh per kit, every year at
// once (uYearNow, eased as the towns ease theirs), each instance on the
// ground drawn under it now (world.metresAt, the district's where it is
// down), its floor at the mean of the ground under its footprint and its
// footing taking up the fall; and the names at the near zoom, through the
// district's labels (features/labels.js), while the school stands.
//
// The settlements keep their lots off a school's building, and from its
// campus on off its grounds, in its years: features/works.js exclusion
// joins the schools' polys to the works' (data/schools.js decodeSchools), so
// the district's scatter and every island's (settlements.js, towns.js) and
// the crop trees (crops.js) read them as they read a base's. The schools
// are landmarks of `kind: "school"`, the shape the gazetteer's named
// buildings share; nothing here is placed by the settlement layer.

import * as THREE from 'three'
import { Y, objectMaterial } from './kit.js'
import { schoolKits } from './buildings.js'
import { mulberry32, LIFT } from './settlements.js'
import { Labels } from './labels.js'
import { decodeSchools, eraWeight, KIT_BOX, KIT_NAMES } from '../data/schools.js'
import { OFF } from '../config.js'

// how long an island's schools are kept after it gave its slot up (s)
const LINGER = 30
// the camera's distance over which they come in (as the works' blocks do), and their own fade by distance
const RIG = [150, 230]
const FADE = [160, 240]
// the names: whole under 30, gone by 55 (a little inside the place names' own)
const LABEL_RIG = [30, 55]
// where an instance's ground is read, in its half extents
const SAMPLES = [[0, 0], [-1, -1], [1, -1], [1, 1], [-1, 1], [0, -1], [1, 0], [0, 1], [-1, 0]]

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

export class Schools {
  constructor(app) {
    this.app = app
    this.group = new THREE.Group()
    this.group.name = 'schools'
    app.scene.add(this.group)
    this.islands = new Map() // island id → { id, t, view, lastSeen }
    this.yearNow = app.timeline.year
    this.yearU = { value: this.yearNow }
    this.hidden = false
    this.available = null
    this.byIsland = null
    this.base = app.params.get('schools') || null
    app.updaters.push((dt) => this.update(dt))
  }

  url() {
    if (!this.base) return this.app.data.abs('schools.json')
    const b = this.base.endsWith('/') ? this.base : `${this.base}/`
    return new URL('schools.json', new URL(b, location.href)).href
  }

  /** schools.json, once, decoded by island; an empty map where there is none. */
  load() {
    this._load ??= (async () => {
      const url = this.url()
      // (held off for a measure: config.js OFF)
      if (OFF.has('schools')) {
        this.byIsland = new Map()
        this.available = false
        return this.byIsland
      }
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const fc = await res.json()
        this.about = { baked: fc.baked ?? null, count: fc.features?.length ?? 0 }
        this.byIsland = decodeSchools(fc, this.app.data.proj)
        this.available = this.byIsland.size > 0
      } catch (err) {
        this.byIsland = new Map()
        this.available = false
        this.app.warn(`${url}: ${err.message} (no schools)`)
      }
      return this.byIsland
    })()
    return this._load
  }

  /** What island `id`'s schools keep the settlements and the trees off: { polys, lines } as WorksExclusion takes them, or null. */
  async exclusion(id) {
    const m = await this.load()
    const isl = m.get(id)
    return isl && isl.excl.polys.length ? isl.excl : null
  }

  update(dt) {
    const app = this.app
    const target = app.timeline.year
    if (dt > 0) {
      this.yearNow += (target - this.yearNow) * (1 - Math.exp(-dt * 2.2))
      if (Math.abs(target - this.yearNow) < 0.05) this.yearNow = target
    } else this.yearNow = target
    this.yearU.value = this.yearNow
    const d = app.rig.state.distance
    const now = performance.now()
    for (const t of app.world.islands) {
      const id = t.pack.id
      const k = t.slot >= 0 ? t.k : 0
      let isl = this.islands.get(id)
      if (k > 0.02) {
        if (!this.byIsland) this.load()
        if (!isl) this.islands.set(id, (isl = { id, t, view: null, lastSeen: now }))
        isl.lastSeen = now
        const data = this.byIsland?.get(id)
        if (!isl.view && data?.schools.length) {
          isl.view = new IslandSchools(this, t, data)
          this.group.add(isl.view.group)
        }
      }
      if (isl?.view) isl.view.update(this.hidden ? 0 : k, d)
    }
    for (const [id, isl] of this.islands) {
      if (now - isl.lastSeen <= LINGER * 1000) continue
      isl.view?.dispose()
      this.islands.delete(id)
    }
  }

  /** Straight to what the view and the year want (tools). */
  settle() {
    this.update(0)
  }

  /** Every island's schools let go now (tools). */
  release() {
    for (const isl of this.islands.values()) isl.lastSeen = -1e9
    this.update(0)
  }

  /** A school by its id, decoded: { island, ...school }, or null. */
  school(id) {
    for (const [island, isl] of this.byIsland || []) {
      const s = isl.schools.find((q) => q.id === id)
      if (s) return { island, ...s }
    }
    return null
  }

  /** What stands at school `id` in a year, as the shaders draw it: [{ kit, variant, weight }] of the eras showing (the eased year by default). */
  standing(id, year = this.yearNow) {
    const s = this.school(id)
    if (!s) return null
    return s.eras.map((e) => ({ kit: e.kit, variant: e.variant, weight: +eraWeight(e.span, year).toFixed(3) })).filter((e) => e.weight > 0)
  }

  stats() {
    let n = 0
    for (const isl of this.byIsland?.values() || []) n += isl.schools.length
    return {
      available: this.available,
      base: this.base,
      schools: n,
      year: +this.yearNow.toFixed(2),
      hidden: this.hidden,
      islands: [...this.islands.values()].map((i) => ({ id: i.id, drawn: !!i.view, ...(i.view ? i.view.stats() : {}) })),
    }
  }
}

// --- one island ------------------------------------------------------------------

class IslandSchools {
  constructor(owner, t, data) {
    this.owner = owner
    this.app = owner.app
    this.t = t
    this.data = data
    this.id = t.pack.id
    this.group = new THREE.Group()
    this.group.name = `schools ${this.id}`
    this.show = 0
    const rand = mulberry32(1831 + data.schools.length)
    this.kits = schoolKits(rand)
    // (data/schools.js lays the kits out by their extents: a kit built otherwise would stand off its place)
    for (const k of KIT_NAMES) {
      this.kits[k].forEach((kit, v) => {
        const want = KIT_BOX[k][v]
        if (kit.box.some((c, i) => Math.abs(c - want[i]) > 0.15)) this.app.warn(`schools: the ${k} kit ${v} is ${kit.box.map((c) => c.toFixed(1))}, not data/schools.js KIT_BOX's ${want}`)
      })
    }
    this.own = {
      uShow: { value: 0 },
      uFeatSeen: { value: Array.from({ length: 16 }, () => new THREE.Vector4(0, 0, 0, 0)) },
      uShadeS: { value: t.shadow.texture },
      uShadeRect: { value: t.rect },
      uYearNow: owner.yearU,
    }
    this.material = objectMaterial(this.app.shared, this.own, { fade: FADE, grow: true })
    // the eras, one instance each, by kit and variant
    const byKit = new Map()
    this.instances = []
    for (const s of data.schools) {
      for (const e of s.eras) {
        const key = `${e.kit}:${e.variant}`
        const kit = this.kits[e.kit][e.variant]
        const it = { ...e, school: s.id, kit, c: 0.94 + 0.12 * rand() }
        if (!byKit.has(key)) byKit.set(key, [])
        byKit.get(key).push(it)
        this.instances.push(it)
      }
    }
    this.meshes = []
    for (const [key, list] of byKit) {
      // (in the order they come in, so a year draws only the run of them in by then: update)
      list.sort((a, b) => a.span[0] - b.span[0])
      const kit = list[0].kit
      const g = kit.geometry
      const mesh = new THREE.InstancedMesh(g, this.material, list.length)
      mesh.name = `schools ${key}`
      mesh.frustumCulled = false
      mesh.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 3), 3)
      const aSpan = new THREE.InstancedBufferAttribute(new Float32Array(list.length * 4), 4)
      const aStretch = new THREE.InstancedBufferAttribute(new Float32Array(list.length).fill(1), 1)
      g.setAttribute('aSpan', aSpan)
      g.setAttribute('aStretch', aStretch)
      list.forEach((it, i) => {
        aSpan.array.set(it.span, i * 4)
        mesh.instanceColor.array.set([it.c, it.c, it.c * 0.98], i * 3)
        it.mesh = mesh
        it.index = i
      })
      mesh.starts = Float32Array.from(list, (it) => it.span[0])
      this.meshes.push(mesh)
      this.group.add(mesh)
    }
    this._m4 = new THREE.Matrix4()
    this._q = new THREE.Quaternion()
    this._v = new THREE.Vector3()
    this._s = new THREE.Vector3()
    this._up = new THREE.Vector3(0, 1, 0)
    this.place()
    this.groundKey = ''
    // the names, at the near zoom, while the school stands
    this.labels = new Labels(this.app, [], {
      items: data.schools.filter((s) => s.label).map((s) => ({ name: s.label, x: s.x, z: s.z, cls: 'dlabel wlabel wl-school', from: s.from, to: s.to })),
      alive: (it, y) => y >= it.from - 0.5 && (it.to === null || y < it.to + 0.5),
      zoom: (d) => 1 - smooth(LABEL_RIG[0], LABEL_RIG[1], d),
      layer: 'slabels',
      avoid: '.pin.show, .cluster.show',
      lang: '',
    })
  }

  /**
   * Each instance on the ground drawn under it now: its floor at the mean of
   * the ground under its footprint, never further over the lowest of it than
   * its footing reaches. With `year`, those standing within a year of it.
   */
  place(year) {
    const W = this.app.world
    for (const it of this.instances) {
      if (year !== undefined && (year < it.span[0] - 1 || year > it.span[3] + 1)) continue
      const c = Math.cos(it.dir)
      const s = Math.sin(it.dir)
      // (the box's middle, which the kit's origin is moved off by)
      const [x0, x1, z0, z1] = it.kit.box
      const mx = it.x + (((x0 + x1) / 2) * c - ((z0 + z1) / 2) * s) * it.scale
      const mz = it.z + (((x0 + x1) / 2) * s + ((z0 + z1) / 2) * c) * it.scale
      let sum = 0
      let lo = Infinity
      for (const [u, v] of SAMPLES) {
        const g = Math.max(0, W.metresAt(mx + u * it.hx * c - v * it.hz * s, mz + u * it.hx * s + v * it.hz * c))
        sum += g
        lo = Math.min(lo, g)
      }
      const floor = Math.min(sum / SAMPLES.length, lo + it.kit.foot * 0.8)
      this._q.setFromAxisAngle(this._up, -it.dir)
      this._v.set(it.x, Y(floor) + LIFT, it.z)
      this._s.set(it.scale, it.scale, it.scale)
      this._m4.compose(this._v, this._q, this._s)
      this._m4.toArray(it.mesh.instanceMatrix.array, it.index * 16)
    }
    for (const m of this.meshes) m.instanceMatrix.needsUpdate = true
  }

  update(k, d) {
    const app = this.app
    this.show = k
    this.group.visible = k > 0.001
    const bs = k * (1 - smooth(RIG[0], RIG[1], d))
    this.own.uShow.value = bs
    // (each kit's instances in by the eased year, and none of a kit with none in yet)
    const y = this.owner.yearNow
    for (const m of this.meshes) {
      let lo = 0
      let hi = m.starts.length
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (m.starts[mid] < y) lo = mid + 1
        else hi = mid
      }
      m.count = lo
      m.visible = bs > 0.001 && lo > 0
    }
    if (bs > 0.001) {
      // (the ground under them moves as the district comes and goes, and with the patches of the year)
      const D = app.districts
      const year = Math.round(app.timeline.year)
      const key = `${D?.on ? D.cur?.d.id : ''}:${(D?.on ? D.k : 0).toFixed(2)}:${this.t.k.toFixed(2)}:${year}`
      if (key !== this.groundKey) {
        this.groundKey = key
        this.place(year)
      }
    }
    this.labels.update(this.owner.hidden ? 0 : k)
  }

  stats() {
    const y = this.owner.yearNow
    const by = {}
    let standing = 0
    for (const s of this.data.schools) {
      const e = s.eras.find((q) => eraWeight(q.span, y) > 0.5)
      if (!e) continue
      standing++
      by[e.kit] = (by[e.kit] || 0) + 1
    }
    return {
      show: +this.show.toFixed(2),
      shown: +this.own.uShow.value.toFixed(2),
      schools: this.data.schools.length,
      standing,
      kits: by,
      instances: this.instances.length,
      calls: this.meshes.length,
      labels: this.labels.visible(),
    }
  }

  dispose() {
    this.group.parent?.remove(this.group)
    for (const list of Object.values(this.kits)) for (const kit of list) kit.geometry.dispose()
    this.material.dispose()
    for (const m of this.meshes) m.dispose()
    this.labels.dispose()
  }
}
