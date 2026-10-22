// The front on the table (ENGINEERING.md §10, DATA.md §6, DESIGN.md §5.4),
// drawn the Green Books' way (R3 §5.1): land held is a filled area, islands
// are dated intervals, island groups get a dashed perimeter, declared lines
// are their own layer, and the sea is never filled.
//
// Land. Each keyframe's land polygons are rasterised once, when the date
// first needs them, into two textures over the table's rectangle (about
// 14 km a texel): a fill (the state's colour, premultiplied by coverage) and
// marks (R: hatch, where the state is `contested` or the polygon is
// `pointsAndLines`, Japan's cities and railways in occupied China, 点と線;
// G: the state's strength, which is how strongly its colour lies on the
// relief; B: Japan's side, whose edge is drawn as the front's line). The
// relief shader samples the two keyframes either side of the date
// (WarClock.frontPair) and cross-fades them, never morphs them (a morph would
// draw a front where none was), and lays the colour on land only, as a tint
// that keeps the hillshade, with the hatch in world space at a spacing that
// holds still on the screen and the line where Japan's side ends, a pixel and
// a half wide, cross-faded per keyframe as the fills are. A few keyframes'
// textures are kept; the rest are rasterised again if the date comes back.
//
// Lines. Each keyframe's perimeters are a dashed LineSet in the front's red,
// faded with its keyframe's share of the cross-fade and labelled; each
// declared line of fronts/lines.geojson is a longer-dashed LineSet in sand,
// shown while the date is inside its own `from`–`to`, and labelled with its
// name and its Japanese name.
//
// Islands. Every place with `held` intervals is an instanced mark at its
// point, coloured by who holds it on the date (Japan's red, the Allies'
// blue-white), and from its `cutOff` date a cut-off garrison keeps the old
// colour inside a pale ring, as Appleman's map of March 1945 draws the
// bypassed garrisons. A place outside every interval on the date has no
// mark.
//
// Everything fades with the overlays (the fly-down into a box fades them
// out, TableScene.fade) and with the front's own switch.

import * as THREE from 'three'
import { LineSet } from '../render/lines.js'
import { constantTexture } from '../render/pack.js'
import { constants } from '../render/shaders/common.glsl.js'
import { world, ground } from '../render/shaders/ground.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../render/shaders/logdepth.glsl.js'
import { geometryPoint, densifyLonLat } from '../geo.js'
import { parseInstant, spanOf } from '../time.js'

import { STATES, OTHER } from './states.js'

// occupied China's points and lines: a light wash under the hatch
const POINTS_AND_LINES = 0.22

// the islands' marks: Japan's red, the Allies' blue-white, linear
const ISLE_JP = [0.62, 0.13, 0.08]
const ISLE_ALLIED = [0.66, 0.8, 0.95]
// the lines' colours, linear and may exceed 1
const PERIMETER = [1.25, 0.42, 0.3]
const DECLARED = [1.55, 0.98, 0.42]
// how many keyframes' textures are kept
const KEEP = 4
// the mask's width in texels
const MASK_W = 1024

/** The uniforms the relief samples, made before the ground so it can take them by reference. */
export function frontUniforms(rect) {
  const none = constantTexture(0, 0, 0, 0)
  return {
    uFrontFillA: { value: none },
    uFrontFillB: { value: none },
    uFrontMarkA: { value: none },
    uFrontMarkB: { value: none },
    uFrontT: { value: 0 },
    uFrontK: { value: 0 },
    uFrontRect: { value: new THREE.Vector4(rect.x0, rect.z0, rect.x1, rect.z1) },
    uFrontInk: { value: new THREE.Color(0.2, 0.035, 0.02) },
  }
}

/** The relief's half of the front (relief.js applyFront): sampled, cross-faded, laid on land. */
export const frontChunk = /* glsl */ `
uniform sampler2D uFrontFillA;
uniform sampler2D uFrontFillB;
uniform sampler2D uFrontMarkA;
uniform sampler2D uFrontMarkB;
uniform float uFrontT;
uniform float uFrontK;
uniform vec4 uFrontRect;
uniform vec3 uFrontInk;

// one family of diagonal hairlines, \`s\` world units apart
float hatchLines(vec2 xz, float s) {
  float u = (xz.x - xz.y) / s;
  float fw = max(fwidth(u), 1e-4);
  float d = abs(fract(u + 0.5) - 0.5);
  return 1.0 - smoothstep(0.45 * fw, 1.25 * fw, d);
}
// the hatch at about 7 px on the screen, its spacing a power of two of world
// units so it holds still as the camera moves, the finer lines fading out as
// the next coarser spacing takes over
float hatch(vec2 xz) {
  float px = max(length(fwidth(xz)), 1e-6);
  float l = log2(px * 7.0);
  float fl = floor(l);
  float s = exp2(fl);
  return mix(hatchLines(xz, s), hatchLines(xz, s * 2.0), smoothstep(0.0, 1.0, l - fl));
}
// where a keyframe's Japanese side ends, as a line a pixel and a half wide
float frontEdge(float jp) {
  float fw = fwidth(jp);
  return fw < 1e-5 ? 0.0 : 1.0 - smoothstep(0.55 * fw, 1.5 * fw, abs(jp - 0.5));
}

vec3 applyFront(vec3 col, vec2 xz, float metres, float landK) {
  if (uFrontK <= 0.001) return col;
  vec2 uv = rectUv(uFrontRect, xz);
  if (uv.x < 0.0 || uv.y < 0.0 || uv.x > 1.0 || uv.y > 1.0) return col;
  vec4 fA = texture(uFrontFillA, uv);
  vec4 fB = texture(uFrontFillB, uv);
  vec4 mA = texture(uFrontMarkA, uv);
  vec4 mB = texture(uFrontMarkB, uv);
  float t = uFrontT;
  vec4 f = mix(fA, fB, t);
  vec4 mk = mix(mA, mB, t);
  float k = landK * uFrontK;
  vec3 state = pow(f.rgb / max(f.a, 1e-4), vec3(2.2));
  float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
  // a tint that keeps the hillshade: the state's colour at the relief's brightness
  vec3 tinted = state * (0.35 + 2.1 * lum);
  col = mix(col, tinted, clamp(mk.g, 0.0, 1.0) * k);
  // the hatch, in the state's colour, darker
  col = mix(col, state * (0.12 + 0.9 * lum), clamp(mk.r, 0.0, 1.0) * hatch(xz) * 0.85 * k);
  // the line where Japan's side ends, each keyframe's own, cross-faded
  float edge = mix(frontEdge(mA.b), frontEdge(mB.b), t);
  col = mix(col, uFrontInk, edge * 0.8 * k);
  return col;
}
`

const isleVertex = /* glsl */ `
${constants}
${world}
${ground}
${logDepthParsVertex}
in vec2 aXZ;
in vec4 aMark;           // rgb colour (linear), w: 1 for a cut-off garrison
uniform vec2 uResolution;
uniform float uSize;     // the dot's radius, px
uniform vec3 uCamPos;
out vec2 vP;
out vec4 vMark;
void main() {
  vMark = aMark;
  vP = vec2(0.0);
  if (aMark.w < -0.5) { gl_Position = vec4(2.0, 2.0, 2.0, 1.0); ${logDepthVertex} return; }
  vec3 p = vec3(aXZ.x, max(groundMetres(aXZ), 0.0) * uVert, aXZ.y);
  p.y += 0.05 + distance(uCamPos, p) * 0.003;
  vec4 c = projectionMatrix * viewMatrix * vec4(p, 1.0);
  float r = uSize * (aMark.w > 0.5 ? 2.5 : 1.15);
  vP = position.xy * r / uSize;
  c.xy += position.xy * r * 2.0 / uResolution * c.w;
  gl_Position = c;
  ${logDepthVertex}
}
`

const isleFragment = /* glsl */ `
${logDepthParsFragment}
uniform float uOpacity;
uniform float uSize;
in vec2 vP;
in vec4 vMark;
void main() {
  ${logDepthFragment}
  float r = length(vP) * uSize;            // px from the centre
  float core = 1.0 - smoothstep(uSize - 0.8, uSize + 0.4, r);
  float rim = 1.0 - smoothstep(uSize + 0.4, uSize + 1.6, r);
  vec3 col = mix(vec3(0.02, 0.03, 0.05), vMark.rgb, core);
  float a = max(core, rim * 0.85);
  if (vMark.w > 0.5) {
    // the cut-off garrison's ring: dashed ink on a pale rim, so it reads on
    // a pale shelf and on the deep alike
    float R = uSize * 1.8;
    float d = abs(r - R);
    float halo = (1.0 - smoothstep(1.2, 2.2, d)) * (1.0 - core);
    float dash = step(0.5, fract(atan(vP.y, vP.x) / 6.2831853 * 8.0 + 0.25));
    float ring = (1.0 - smoothstep(0.35, 1.0, d)) * dash;
    col = mix(col, vec3(0.85, 0.83, 0.78), halo);
    col = mix(col, vec3(0.02, 0.025, 0.035), ring);
    a = max(a, max(halo * 0.9, ring));
  }
  if (a < 0.01) discard;
  gl_FragColor = vec4(col, a * uOpacity);
}
`

const smooth = (t) => t * t * (3 - 2 * t)

/** A held interval's [from, to) in ms; `to` open means to the end of the war. */
function intervalMs(h) {
  try {
    const a = parseInstant(h.from)
    const b = h.to ? spanOf({ from: h.to, precision: 'day' })[1] : Infinity
    const c = h.cutOff ? parseInstant(h.cutOff) : null
    return { by: h.by, a, b, c }
  } catch {
    return null
  }
}

export class Front {
  /**
   * table: the TableScene; data: load.js's result; uniforms: frontUniforms()'s,
   * already handed to the ground; labels: the table's Labels.
   */
  constructor(table, data, uniforms, labels) {
    this.table = table
    this.data = data
    this.proj = data.proj
    this.uniforms = uniforms
    this.labels = labels
    this.keyframes = data.fronts?.keyframes || new Map()
    this.cache = new Map() // keyframe id → { fill, mark, used }
    this.group = new THREE.Group()
    this.group.name = 'front'
    this.on = true
    this.k = 1
    const r = data.table.rect
    this.rect = r
    this.W = MASK_W
    this.H = Math.max(2, Math.round((MASK_W * (r.z1 - r.z0)) / (r.x1 - r.x0)))
    this.statesSeen = new Set()

    // the perimeters, a dashed set per keyframe, and their labels
    const shared = table.uniforms
    this.perimeters = new Map()
    for (const [id, kf] of this.keyframes) {
      const feats = (kf.geojson?.features || []).filter((f) => f.properties?.kind === 'perimeter' && /LineString/.test(f.geometry?.type || ''))
      if (!feats.length) continue
      const lines = new LineSet({ type: 'FeatureCollection', features: feats }, this.proj, shared, { color: PERIMETER, width: 1.6, order: 4, maxSeg: 30, lift: [0.03, 0.0023], height: 300, densifyKm: 40, dash: [60, 0.58] })
      this.group.add(lines.group)
      const lbs = feats.map((f) => this.lineLabel(f, 3)).filter(Boolean)
      this.perimeters.set(id, { lines, labels: lbs, k: 0 })
    }
    // the declared lines, each with its own dates
    this.declared = []
    for (const f of data.fronts?.lines?.features || []) {
      if (!/LineString/.test(f.geometry?.type || '')) continue
      const p = f.properties || {}
      let span = null
      try {
        span = [parseInstant(p.from), p.to ? spanOf({ from: p.to, precision: 'day' })[1] : Infinity]
      } catch {
        span = null
      }
      if (!span) continue
      const lines = new LineSet({ type: 'FeatureCollection', features: [f] }, this.proj, shared, { color: DECLARED, width: 1.8, order: 4, maxSeg: 30, lift: [0.03, 0.0024], height: 300, densifyKm: 40, dash: [100, 0.7] })
      this.group.add(lines.group)
      this.declared.push({ f, span, lines, label: this.lineLabel(f, 2), k: 0 })
    }

    this.buildIslands(data.places || [])
    this.pairKey = null
    this.date = null
    this._last = null
  }

  /** A line's label at the middle of its length, turned along it there. */
  lineLabel(f, rank) {
    const p = f.properties || {}
    if (!p.name) return null
    const line = f.geometry.type === 'MultiLineString' ? f.geometry.coordinates.reduce((a, b) => (b.length > a.length ? b : a), []) : f.geometry.coordinates
    if (!line || line.length < 2) return null
    const pts = densifyLonLat(line, 50)
    const w = pts.map((c) => this.proj.toWorld(c))
    let total = 0
    const acc = [0]
    for (let i = 1; i < w.length; i++) acc.push((total += Math.hypot(w[i][0] - w[i - 1][0], w[i][1] - w[i - 1][1])))
    let i = acc.findIndex((s) => s >= total / 2)
    i = Math.max(1, Math.min(w.length - 1, i))
    const a = pts[i - 1]
    const b = pts[i]
    const it = this.labels.add({ text: p.name, ja: typeof p.ja === 'string' ? p.ja : p.ja?.kanji || null, kind: 'front', rank, lonlat: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], along: [a, b] })
    it.k = 0
    return it
  }

  buildIslands(places) {
    const isles = []
    for (const p of places) {
      if (!Array.isArray(p.held) || !p.held.length) continue
      const pt = geometryPoint(p.geometry)
      if (!pt) continue
      const iv = p.held.map(intervalMs).filter(Boolean)
      if (!iv.length) continue
      const [x, z] = this.proj.toWorld(pt)
      isles.push({ place: p, x, z, iv })
    }
    this.isles = isles
    if (!isles.length) return
    const n = isles.length
    const g = new THREE.InstancedBufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]), 3))
    g.setIndex([0, 1, 2, 2, 1, 3])
    const xz = new Float32Array(n * 2)
    isles.forEach((s, i) => xz.set([s.x, s.z], i * 2))
    g.setAttribute('aXZ', new THREE.InstancedBufferAttribute(xz, 2))
    this.isleMark = new THREE.InstancedBufferAttribute(new Float32Array(n * 4), 4)
    this.isleMark.setUsage(THREE.DynamicDrawUsage)
    g.setAttribute('aMark', this.isleMark)
    g.instanceCount = n
    let x0 = Infinity
    let x1 = -Infinity
    let z0 = Infinity
    let z1 = -Infinity
    for (const s of isles) {
      x0 = Math.min(x0, s.x)
      x1 = Math.max(x1, s.x)
      z0 = Math.min(z0, s.z)
      z1 = Math.max(z1, s.z)
    }
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3((x0 + x1) / 2, 0, (z0 + z1) / 2), Math.hypot(x1 - x0, z1 - z0) / 2 + 500)
    this.isleUniforms = { ...this.table.uniforms, uResolution: { value: new THREE.Vector2(1, 1) }, uSize: { value: 3.5 }, uCamPos: { value: new THREE.Vector3() }, uOpacity: { value: 1 } }
    this.isleMaterial = new THREE.ShaderMaterial({ vertexShader: isleVertex, fragmentShader: isleFragment, uniforms: this.isleUniforms, transparent: true, depthWrite: false })
    this.isleMesh = new THREE.Mesh(g, this.isleMaterial)
    this.isleMesh.name = 'front-islands'
    this.isleMesh.renderOrder = 6
    this.group.add(this.isleMesh)
    this.isleDay = null
  }

  /** Who holds each island on `ms`, into the instance colours (only when the day changes). */
  setIslands(ms) {
    if (!this.isleMesh) return
    const day = Math.floor(ms / 86400000)
    if (day === this.isleDay) return
    this.isleDay = day
    const m = this.isleMark.array
    let shown = 0
    this.isles.forEach((s, i) => {
      const h = s.iv.find((v) => ms >= v.a && ms < v.b)
      s.now = h || null
      if (!h) {
        m.set([0, 0, 0, -1], i * 4)
        return
      }
      shown++
      const c = h.by === 'jp' ? ISLE_JP : ISLE_ALLIED
      const cut = h.c !== null && ms >= h.c ? 1 : 0
      m.set([c[0], c[1], c[2], cut], i * 4)
    })
    this.isleShown = shown
    this.isleMark.needsUpdate = true
  }

  /** A keyframe's two textures, rasterised the first time (and again if it was let go). */
  textures(id) {
    let e = this.cache.get(id)
    if (e) {
      e.used = performance.now()
      return e
    }
    const kf = this.keyframes.get(id)
    e = this.rasterise(kf?.geojson)
    e.used = performance.now()
    this.cache.set(id, e)
    // let the least recently used go, but never the pair in use
    while (this.cache.size > KEEP) {
      let old = null
      for (const [k, v] of this.cache) if (!old || v.used < old[1].used) old = [k, v]
      if (!old) break
      old[1].fill.dispose()
      old[1].mark.dispose()
      this.cache.delete(old[0])
    }
    return e
  }

  rasterise(fc) {
    const { W, H, rect: r } = this
    const mk = () => {
      const c = document.createElement('canvas')
      c.width = W
      c.height = H
      return c
    }
    const fill = mk()
    const mark = mk()
    const fx = fill.getContext('2d')
    const mx = mark.getContext('2d')
    const sx = W / (r.x1 - r.x0)
    const sz = H / (r.z1 - r.z0)
    const path = (ctx, rings) => {
      ctx.beginPath()
      for (const ring of rings) {
        const pts = densifyLonLat(ring, 25)
        pts.forEach((c, i) => {
          const [x, z] = this.proj.toWorld(c)
          const px = (x - r.x0) * sx
          const pz = (z - r.z0) * sz
          if (i) ctx.lineTo(px, pz)
          else ctx.moveTo(px, pz)
        })
        ctx.closePath()
      }
    }
    let n = 0
    for (const f of fc?.features || []) {
      const p = f.properties || {}
      if (p.kind === 'perimeter') continue
      const g = f.geometry
      const polys = g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : []
      if (!polys.length) continue
      const st = STATES[p.state] || OTHER
      this.statesSeen.add(p.state)
      const hatch = st.hatch || p.pointsAndLines ? 1 : 0
      const strength = p.pointsAndLines ? POINTS_AND_LINES : st.strength
      fx.fillStyle = `rgb(${st.colour.join(',')})`
      mx.fillStyle = `rgb(${hatch * 255}, ${Math.round(strength * 255)}, ${st.jp * 255})`
      for (const rings of polys) {
        path(fx, rings)
        fx.fill('evenodd')
        path(mx, rings)
        mx.fill('evenodd')
        n++
      }
    }
    const tex = (c) => {
      const t = new THREE.CanvasTexture(c)
      t.flipY = false
      t.premultiplyAlpha = true
      t.minFilter = THREE.LinearFilter
      t.magFilter = THREE.LinearFilter
      t.generateMipmaps = false
      t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping
      return t
    }
    return { fill: tex(fill), mark: tex(mark), polygons: n }
  }

  /**
   * Once a frame: the pair of keyframes and the cross-fade for the date, the
   * islands' holders, the lines' fades, the dashes' size for the camera's
   * distance. `fade` is the overlays' strength; `ease` 1 lands every fade.
   */
  update(date, distance, { camera, resolution, dpr = 1, fade = 1, ease } = {}) {
    const now = performance.now() / 1000
    const dt = this._last === null ? 1 : Math.max(0, Math.min(0.1, now - this._last))
    this._last = now
    const e = ease ?? 1 - Math.exp(-dt * 5)
    this.k += ((this.on ? 1 : 0) - this.k) * e
    if (Math.abs((this.on ? 1 : 0) - this.k) < 0.002) this.k = this.on ? 1 : 0
    const K = this.k * fade
    const u = this.uniforms
    const pair = this.table.app.clock.frontPair(date)
    const a = pair.a && this.keyframes.has(pair.a.id) ? pair.a.id : null
    const b = pair.b && this.keyframes.has(pair.b.id) ? pair.b.id : a
    this.pair = { a, b, t: pair.t }
    if (a) {
      const key = `${a}|${b}`
      if (key !== this.pairKey) {
        this.pairKey = key
        const ta = this.textures(a)
        const tb = b === a ? ta : this.textures(b)
        u.uFrontFillA.value = ta.fill
        u.uFrontMarkA.value = ta.mark
        u.uFrontFillB.value = tb.fill
        u.uFrontMarkB.value = tb.mark
      }
      u.uFrontT.value = smooth(Math.max(0, Math.min(1, pair.t)))
      u.uFrontK.value = K
    } else u.uFrontK.value = 0
    const tB = a ? u.uFrontT.value : 0
    for (const [id, p] of this.perimeters) {
      const want = id === a && id === b ? 1 : id === a ? 1 - tB : id === b ? tB : 0
      p.k += (want - p.k) * e
      if (Math.abs(want - p.k) < 0.003) p.k = want
      p.lines.uniforms.uWidth.value = 1.6 * dpr
      p.lines.setDash(distance * 0.016)
      p.lines.update(camera, resolution, 0.9 * p.k * K)
      for (const l of p.labels) l.k = p.k * K
    }
    for (const d of this.declared) {
      const want = date >= d.span[0] && date < d.span[1] ? 1 : 0
      d.k += (want - d.k) * e
      if (Math.abs(want - d.k) < 0.003) d.k = want
      d.lines.uniforms.uWidth.value = 1.8 * dpr
      d.lines.setDash(distance * 0.028)
      d.lines.update(camera, resolution, 0.9 * d.k * K)
      if (d.label) d.label.k = d.k * K
    }
    this.setIslands(date)
    if (this.isleMesh) {
      const iu = this.isleUniforms
      iu.uResolution.value.copy(resolution)
      iu.uCamPos.value.copy(camera.position)
      iu.uSize.value = (distance < 2500 ? 4 : 3.2) * dpr
      iu.uOpacity.value = K
      this.isleMesh.visible = K > 0.01 && this.isleShown > 0
    }
    this.date = date
  }

  /** What the legend shows: the states in the pair in use, the keyframes' dates and sources. */
  legend() {
    if (!this.pair?.a) return null
    const ids = [...new Set([this.pair.a, this.pair.b])]
    const states = new Set()
    let hatch = false
    for (const id of ids) {
      for (const f of this.keyframes.get(id)?.geojson?.features || []) {
        const p = f.properties || {}
        if (p.kind === 'perimeter') continue
        if (p.state) states.add(p.state)
        if (p.pointsAndLines) hatch = true
      }
    }
    const nearest = this.pair.t < 0.5 ? this.pair.a : this.pair.b
    const kf = this.keyframes.get(nearest)
    const isles = { jp: false, allied: false, cut: false }
    for (const s of this.isles || []) {
      if (!s.now) continue
      if (s.now.by === 'jp') isles.jp = true
      else isles.allied = true
      if (s.now.c !== null && this.date >= s.now.c) isles.cut = true
    }
    return {
      keyframe: nearest,
      date: kf?.date ?? nearest,
      between: this.pair.a !== this.pair.b && this.pair.t > 0.02 && this.pair.t < 0.98 ? [this.keyframes.get(this.pair.a)?.date, this.keyframes.get(this.pair.b)?.date] : null,
      states: [...states].map((s) => ({ id: s, ...(STATES[s] || OTHER) })),
      pointsAndLines: hatch,
      perimeter: ids.some((id) => this.perimeters.has(id)),
      declared: this.declared.filter((d) => d.k > 0.5).map((d) => ({ name: d.f.properties.name, ja: d.f.properties.ja })),
      isles,
      sources: kf?.sources || [],
      note: kf?.note || null,
    }
  }

  /** The front's land at world (x, z) on the date (nearest keyframe): its state and name, for the hover card. */
  at(x, z) {
    if (!this.pair?.a) return null
    const id = this.pair.t < 0.5 ? this.pair.a : this.pair.b
    const [lon, lat] = this.proj.toLonLat(x, z)
    let hit = null
    for (const f of this.keyframes.get(id)?.geojson?.features || []) {
      const p = f.properties || {}
      if (p.kind === 'perimeter') continue
      const g = f.geometry
      const polys = g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : []
      for (const rings of polys) if (inRings(rings, lon, lat)) hit = { state: p.state, name: p.name, pointsAndLines: !!p.pointsAndLines, ...(STATES[p.state] || OTHER) }
    }
    return hit
  }

  stats() {
    return { keyframes: this.keyframes.size, cached: this.cache.size, pair: this.pair, perimeters: this.perimeters.size, declared: this.declared.length, islands: this.isles?.length || 0, islandsShown: this.isleShown || 0 }
  }

  dispose() {
    for (const e of this.cache.values()) {
      e.fill.dispose()
      e.mark.dispose()
    }
    for (const p of this.perimeters.values()) p.lines.dispose()
    for (const d of this.declared) d.lines.dispose()
    if (this.isleMesh) {
      this.isleMesh.geometry.dispose()
      this.isleMaterial.dispose()
    }
  }
}

/** Even-odd point in rings (lon/lat, already normalised about the table's lon0). */
function inRings(rings, x, y) {
  let inside = false
  for (const r of rings) {
    for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
      const [xi, yi] = r[i]
      const [xj, yj] = r[j]
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside
    }
  }
  return inside
}
