// The CPU die: a slab of silicon painted from the real floorplan, plus an
// additive "activity" overlay per block, the ring bus, per-thread status LEDs
// and packets that travel the ring. All coordinates are millimetres in the
// die's local frame: x across the long edge, z down the short edge, y up.

import * as THREE from 'three'
import { paintDie } from './dietex.js'
import { MODE_COLORS } from './util.js'

const OVERLAY_VERT = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const OVERLAY_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
uniform float uStyle;
uniform vec2 uSize;
uniform float uSeed;
varying vec2 vUv;
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7)) + uSeed) * 43758.5453); }
void main() {
  if (uLevel < 0.002) discard;
  vec2 d = min(vUv, 1.0 - vUv) * uSize;
  float edge = min(d.x, d.y);
  float rim = exp(-edge * 9.0);
  float a;
  if (uStyle < 0.5) {
    // steady glow
    a = 0.32 + rim * 0.9;
  } else if (uStyle < 1.5) {
    // scan: bands sweeping through (instruction streaming / enumeration)
    float s = fract(vUv.x * 3.0 - uTime * 1.2);
    a = 0.18 + rim * 0.8 + smoothstep(0.0, 0.08, s) * smoothstep(0.35, 0.08, s) * 0.9;
  } else if (uStyle < 2.5) {
    // pinned: diagonal hatching — cache lines locked in place as RAM
    float s = step(0.55, fract((vUv.x * uSize.x - vUv.y * uSize.y) * 1.6 + uTime * 0.25));
    a = 0.2 + 0.45 * s + rim * 0.9;
  } else if (uStyle < 3.5) {
    // sparkle: lots of independent little bursts (heavy compute / training)
    vec2 cell = floor(vUv * uSize * 3.0);
    float n = hash(cell + floor(uTime * 14.0));
    a = 0.16 + rim * 0.7 + step(0.86, n) * 1.1;
  } else if (uStyle < 4.5) {
    // breathe: slow pulse (waiting / parked / powered but idle)
    a = (0.25 + 0.2 * sin(uTime * 2.4 + uSeed)) + rim * 0.6;
  } else {
    // stripe: one way of a 12-way cache pinned — a thin hatched band
    float band = smoothstep(0.455, 0.47, vUv.y) * smoothstep(0.545, 0.53, vUv.y);
    float hatch = step(0.5, fract((vUv.x * uSize.x - vUv.y * uSize.y) * 3.0 + uTime * 0.3));
    a = 0.05 + rim * 0.35 + band * (0.9 + 0.5 * hatch);
  }
  gl_FragColor = vec4(uColor * a * uLevel, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

const RING_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
varying vec2 vUv;
void main() {
  float dash = smoothstep(0.0, 0.15, fract(vUv.x * 0.9 - uTime * 2.2)) * smoothstep(0.6, 0.3, fract(vUv.x * 0.9 - uTime * 2.2));
  float across = 1.0 - abs(vUv.y - 0.5) * 2.0;
  float a = (0.18 + dash * 0.9) * across * uLevel;
  gl_FragColor = vec4(uColor * a, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

export const LED_FRAG = /* glsl */ `
uniform vec3 uColor;
uniform float uLevel;
uniform float uTime;
uniform float uBreath;
uniform float uSeed;
varying vec2 vUv;
void main() {
  float r = length(vUv - 0.5) * 2.0;
  float core = smoothstep(0.42, 0.3, r);
  float ring = smoothstep(0.5, 0.44, r) * smoothstep(0.38, 0.44, r) * 0.6;
  float halo = smoothstep(1.0, 0.2, r) * 0.28;
  float b = mix(1.0, 0.45 + 0.4 * sin(uTime * 2.2 + uSeed), uBreath);
  gl_FragColor = vec4(uColor * (core + ring + halo) * uLevel * b, 1.0);
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
}`

export function overlayMaterial(w, h, seed) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color('#ffffff') },
      uLevel: { value: 0 },
      uTime: { value: 0 },
      uStyle: { value: 0 },
      uSize: { value: new THREE.Vector2(w, h) },
      uSeed: { value: seed },
    },
    vertexShader: OVERLAY_VERT,
    fragmentShader: OVERLAY_FRAG,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
}

export const STYLE = { glow: 0, scan: 1, pinned: 2, sparkle: 3, breathe: 4, stripe: 5 }

export function buildDie(fp, { maxTexture = 4096, anisotropy = 8 } = {}) {
  const W = fp.die_mm.w
  const H = fp.die_mm.h
  const group = new THREE.Group()
  group.name = 'die'

  // --- silicon slab -------------------------------------------------------
  const texW = Math.min(maxTexture, 4096)
  const texH = Math.round((texW * H) / W)
  const canvas = paintDie(fp, texW, texH)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = anisotropy
  const top = new THREE.MeshPhysicalMaterial({
    map: tex,
    roughness: 0.32,
    metalness: 0.35,
    iridescence: 0.55,
    iridescenceIOR: 1.7,
    iridescenceThicknessRange: [180, 520],
    clearcoat: 0.25,
    clearcoatRoughness: 0.4,
    emissive: new THREE.Color('#ffffff'),
    emissiveMap: tex,
    emissiveIntensity: 0.06,
  })
  // The real die photo arrives later (setPhoto). It is shown through a
  // duotone grade — navy shadows, violet mids, pale-gold highlights — so the
  // activity glow reads against it; uGrade = 0 shows the photo's true colour.
  const grade = { value: 0 }
  top.onBeforeCompile = (shader) => {
    shader.uniforms.uGrade = grade
    const fn = `
uniform float uGrade;
vec3 dieGrade(vec3 lin) {
  vec3 s = pow(max(lin, vec3(0.0)), vec3(1.0 / 2.2));
  float l = dot(s, vec3(0.299, 0.587, 0.114));
  vec3 c0 = vec3(0.020, 0.024, 0.059);
  vec3 c1 = vec3(0.200, 0.150, 0.370);
  vec3 c2 = vec3(0.700, 0.600, 0.430);
  vec3 duo = l < 0.588 ? mix(c0, c1, l / 0.588) : mix(c1, c2, (l - 0.588) / 0.412);
  return mix(lin * 0.32, pow(duo, vec3(2.2)) * 0.5, uGrade);
}`
    shader.fragmentShader = shader.fragmentShader
      .replace('void main() {', fn + '\nvoid main() {')
      .replace('#include <map_fragment>', '#include <map_fragment>\ndiffuseColor.rgb = dieGrade(diffuseColor.rgb);')
      .replace('#include <emissivemap_fragment>', '#ifdef USE_EMISSIVEMAP\ntotalEmissiveRadiance *= dieGrade(texture2D(emissiveMap, vEmissiveMapUv).rgb);\n#endif')
  }
  const side = new THREE.MeshStandardMaterial({ color: '#2a2a33', roughness: 0.6, metalness: 0.4 })
  const THICK = 0.78 // die thickness in mm (thinned silicon is ~0.3–0.8 mm)
  const slab = new THREE.Mesh(new THREE.BoxGeometry(W, THICK, H), [side, side, top, side, side, side])
  slab.position.y = -THICK / 2
  group.add(slab)

  // --- blocks + overlays ----------------------------------------------------
  const blocks = new Map()
  const toLocal = (nx, ny, y = 0) => new THREE.Vector3((nx - 0.5) * W, y, (ny - 0.5) * H)
  let seed = 1
  const addOverlay = (id, kind, nx, ny, nw, nh, parent = null) => {
    const w = nw * W
    const h = nh * H
    const mat = overlayMaterial(w, h, seed++ * 1.37)
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat)
    mesh.rotation.x = -Math.PI / 2
    const c = toLocal(nx + nw / 2, ny + nh / 2, 0.012 + (parent ? 0.004 : 0))
    mesh.position.copy(c)
    mesh.renderOrder = parent ? 3 : 2
    group.add(mesh)
    const rec = {
      id,
      kind,
      parent,
      rect: { x: nx, y: ny, w: nw, h: nh },
      center: c.clone().setY(0),
      size: [w, h],
      mesh,
      mat,
      level: 0,
      target: 0,
      color: new THREE.Color('#ffffff'),
      targetColor: new THREE.Color('#ffffff'),
      style: 0,
    }
    blocks.set(id, rec)
    return rec
  }
  // A whole-die overlay for die-wide events (power-good, reset).
  addOverlay('die', 'whole', 0, 0, 1, 1).label = fp.chip
  for (const b of fp.blocks) {
    const rec = addOverlay(b.id, b.kind, b.x, b.y, b.w, b.h)
    rec.label = b.label
    rec.data = b
  }
  // Sub-block overlays inside every P-core and E-core cluster, so activity can
  // be pinned to "the BSP's front end" or "core 2's L2".
  const subOf = (b, list) => {
    if (!list) return
    for (const s of list) {
      let sx = s.x
      let sy = s.y
      if (b.mirror?.x) sx = 1 - s.x - s.w
      if (b.mirror?.y) sy = 1 - s.y - s.h
      const rec = addOverlay(`${b.id}.${s.id}`, s.kind || s.id, b.x + sx * b.w, b.y + sy * b.h, s.w * b.w, s.h * b.h, b.id)
      rec.label = s.label
    }
  }
  for (const b of fp.blocks) {
    if (b.kind === 'pcore') subOf(b, fp.core_internals?.pcore)
    if (b.kind === 'ecore_cluster') subOf(b, fp.core_internals?.ecore_cluster)
  }

  // --- ring bus -------------------------------------------------------------
  const ringPts = (fp.ring?.path || []).map(([x, y]) => toLocal(x, y, 0.03))
  let ring = null
  if (ringPts.length > 1) {
    const closed = fp.ring.closed !== false
    const pts = closed ? [...ringPts, ringPts[0]] : ringPts
    const width = fp.ring.width_mm || 0.22
    const pos = []
    const uv = []
    const idx = []
    let dist = 0
    for (let i = 0; i < pts.length; i++) {
      const a = pts[Math.max(0, i - 1)]
      const b = pts[Math.min(pts.length - 1, i + 1)]
      const t = new THREE.Vector3().subVectors(b, a).setY(0).normalize()
      const n = new THREE.Vector3(-t.z, 0, t.x).multiplyScalar(width / 2)
      if (i > 0) dist += pts[i].distanceTo(pts[i - 1])
      pos.push(pts[i].x + n.x, pts[i].y, pts[i].z + n.z, pts[i].x - n.x, pts[i].y, pts[i].z - n.z)
      uv.push(dist, 0, dist, 1)
      if (i > 0) {
        const k = i * 2
        idx.push(k - 2, k - 1, k, k - 1, k + 1, k)
      }
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2))
    g.setIndex(idx)
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color('#bfb6ff') }, uLevel: { value: 0 }, uTime: { value: 0 } },
      vertexShader: OVERLAY_VERT,
      fragmentShader: RING_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(g, mat)
    mesh.renderOrder = 4
    group.add(mesh)
    ring = { mesh, mat, pts, closed, level: 0, target: 0 }
  }
  const stops = new Map()
  for (const s of fp.ring?.stops || []) stops.set(s.id, { ...s, p: toLocal(s.x, s.y, 0.05) })
  // Which ring stop serves a block (falls back to the nearest stop).
  const stopFor = (id) => {
    const base = id.split('.')[0]
    for (const s of stops.values()) if (s.serves?.includes(base)) return s
    const b = blocks.get(base)
    if (!b) return null
    let best = null
    let bd = Infinity
    for (const s of stops.values()) {
      const d = s.p.distanceTo(b.center)
      if (d < bd) {
        bd = d
        best = s
      }
    }
    return best
  }

  // Project a point onto the ring polyline; return {seg, t, dist, point}.
  const ringLen = []
  if (ring) {
    let acc = 0
    ringLen.push(0)
    for (let i = 1; i < ring.pts.length; i++) {
      acc += ring.pts[i].distanceTo(ring.pts[i - 1])
      ringLen.push(acc)
    }
  }
  const projectRing = (p) => {
    let best = null
    for (let i = 1; i < ring.pts.length; i++) {
      const a = ring.pts[i - 1]
      const b = ring.pts[i]
      const ab = new THREE.Vector3().subVectors(b, a)
      const L2 = ab.lengthSq() || 1
      const t = Math.min(1, Math.max(0, new THREE.Vector3().subVectors(p, a).dot(ab) / L2))
      const q = a.clone().addScaledVector(ab, t)
      const d = q.distanceTo(p)
      if (!best || d < best.d) best = { d, seg: i, dist: ringLen[i - 1] + t * Math.sqrt(L2), point: q }
    }
    return best
  }
  const ringPointAt = (dist) => {
    const total = ringLen[ringLen.length - 1]
    dist = ((dist % total) + total) % total
    for (let i = 1; i < ringLen.length; i++) {
      if (dist <= ringLen[i]) {
        const t = (dist - ringLen[i - 1]) / (ringLen[i] - ringLen[i - 1] || 1)
        return ring.pts[i - 1].clone().lerp(ring.pts[i], t)
      }
    }
    return ring.pts[0].clone()
  }

  // A route between two blocks: out of the block to its ring stop, round the
  // ring the short way, off at the destination's stop, into the block.
  const routeCache = new Map()
  const route = (fromId, toId) => {
    const key = `${fromId}>${toId}`
    if (routeCache.has(key)) return routeCache.get(key)
    const A = blocks.get(fromId)
    const B = blocks.get(toId)
    if (!A || !B) return null
    const a = A.center.clone().setY(0.06)
    const b = B.center.clone().setY(0.06)
    let pts = [a, b]
    if (ring) {
      const sa = stopFor(fromId)
      const sb = stopFor(toId)
      const pa = projectRing(sa ? sa.p : a)
      const pb = projectRing(sb ? sb.p : b)
      const total = ringLen[ringLen.length - 1]
      let d = pb.dist - pa.dist
      if (ring.closed) {
        if (d > total / 2) d -= total
        if (d < -total / 2) d += total
      }
      const n = Math.max(2, Math.ceil(Math.abs(d) / 0.5))
      const mid = []
      for (let i = 0; i <= n; i++) mid.push(ringPointAt(pa.dist + (d * i) / n).setY(0.06))
      pts = [a, ...mid, b]
    }
    routeCache.set(key, pts)
    return pts
  }

  // --- per-thread status LEDs ---------------------------------------------
  // Each P-core gets two pips (its two hardware threads), each E-core one.
  const leds = []
  const addLed = (x, z, size) => {
    const mat = new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color() }, uLevel: { value: 0 }, uTime: { value: 0 }, uBreath: { value: 0 }, uSeed: { value: seed++ * 0.7 } },
      vertexShader: OVERLAY_VERT,
      fragmentShader: LED_FRAG,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size * 2.6, size * 2.6), mat)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(x, 0.05, z)
    mesh.renderOrder = 5
    group.add(mesh)
    const led = { mesh, mat, color: new THREE.Color(MODE_COLORS.off), level: 0 }
    leds.push(led)
    return led
  }
  const pcores = fp.blocks.filter((b) => b.kind === 'pcore').sort((a, b) => idNum(a.id) - idNum(b.id))
  const eclusters = fp.blocks.filter((b) => b.kind === 'ecore_cluster').sort((a, b) => idNum(a.id) - idNum(b.id))
  // Logical processor table: index -> { led, block, label }.
  const lps = []
  for (const b of pcores) {
    const c = toLocal(b.x + b.w / 2, b.y + b.h / 2)
    const s = Math.min(b.w * W, b.h * H)
    for (let t = 0; t < 2; t++) {
      const led = addLed(c.x + (t - 0.5) * s * 0.34, c.z, s * 0.12)
      lps.push({ led, block: b.id, label: `P${idNum(b.id)} T${t}`, kind: 'p' })
    }
  }
  const eSubs = (fp.core_internals?.ecore_cluster || []).filter((s) => /core/i.test(s.kind || s.id) && !/l2/i.test(s.id))
  for (const b of eclusters) {
    for (let k = 0; k < 4; k++) {
      let cx
      let cz
      const s = eSubs[k]
      if (s) {
        let sx = s.x
        let sy = s.y
        if (b.mirror?.x) sx = 1 - s.x - s.w
        if (b.mirror?.y) sy = 1 - s.y - s.h
        const c = toLocal(b.x + (sx + s.w / 2) * b.w, b.y + (sy + s.h / 2) * b.h)
        cx = c.x
        cz = c.z
      } else {
        const c = toLocal(b.x + ((k % 2) + 0.5) * (b.w / 2), b.y + (Math.floor(k / 2) + 0.5) * (b.h / 2))
        cx = c.x
        cz = c.z
      }
      const size = Math.min(b.w * W, b.h * H) * 0.09
      const led = addLed(cx, cz, size)
      lps.push({ led, block: b.id, label: `E${idNum(b.id) * 4 + k}`, kind: 'e' })
    }
  }

  // --- packets --------------------------------------------------------------
  const MAXP = 600
  const pGeo = new THREE.BufferGeometry()
  const pPos = new Float32Array(MAXP * 3)
  const pCol = new Float32Array(MAXP * 3)
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
  pGeo.setAttribute('color', new THREE.BufferAttribute(pCol, 3))
  const pMat = new THREE.PointsMaterial({
    size: 0.55,
    map: glowSprite(),
    vertexColors: true,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true,
  })
  const points = new THREE.Points(pGeo, pMat)
  points.frustumCulled = false
  points.renderOrder = 6
  group.add(points)
  const packets = []
  const streams = new Map() // key -> {pts, rate, color, acc, speed, live}

  // ------------------------------------------------------------------------
  const api = {
    group,
    W,
    H,
    // Swap in the real die photograph (graded) once it has loaded.
    setPhoto(photo) {
      photo.colorSpace = THREE.SRGBColorSpace
      photo.anisotropy = anisotropy
      const old = top.map
      top.map = photo
      top.emissiveMap = photo
      if (old && old !== photo) old.dispose()
      top.emissiveIntensity = 0.05
      top.roughness = 0.5
      top.metalness = 0.2
      top.clearcoat = 0.12
      top.iridescence = 0.3
      grade.value = 1
      top.needsUpdate = true
    },
    setTrueColor(on) {
      grade.value = on ? 0 : 1
    },
    blocks,
    lps,
    stops,
    route,
    toLocal,
    // Called at the start of every frame: everything decays unless re-asserted.
    begin() {
      for (const b of blocks.values()) b.target = 0
      if (ring) ring.target = 0
      for (const s of streams.values()) s.live = false
    },
    // Light a block (or every block of a kind, or a sub-block "pcore0.l2").
    light(sel, level, color, style = 'glow') {
      for (const b of api.select(sel)) {
        if (level >= b.target) {
          b.target = level
          b.targetColor.set(color)
          b.style = STYLE[style] ?? 0
        }
      }
    },
    select(sel) {
      if (blocks.has(sel)) return [blocks.get(sel)]
      if (sel.startsWith('kind:')) {
        const k = sel.slice(5)
        return [...blocks.values()].filter((b) => b.kind === k && !b.parent)
      }
      if (sel.startsWith('sub:')) {
        // sub:pcore0:l2 -> pcore0.l2 ; sub:*:l2 -> every core's l2 ;
        // sub:pcore0:decode|l1i -> both
        const [, owner, sub] = sel.split(':')
        const want = sub.split('|')
        return [...blocks.values()].filter((b) => b.parent && (owner === '*' || b.parent === owner) && want.includes(b.id.slice(b.id.indexOf('.') + 1)))
      }
      return []
    },
    ringLevel(level, color) {
      if (!ring) return
      if (level > ring.target) {
        ring.target = level
        ring.mat.uniforms.uColor.value.set(color)
      }
    },
    // A steady stream of packets along a route.
    stream(key, fromId, toId, rate, color, speed = 6) {
      let s = streams.get(key)
      if (!s) {
        const pts = route(fromId, toId)
        if (!pts) return
        s = { pts, acc: 0, rate, color: new THREE.Color(color), speed, live: true, len: polyLen(pts), fresh: true }
        streams.set(key, s)
      }
      s.rate = rate
      s.color.set(color)
      s.speed = speed
      s.live = true
    },
    setLp(i, mode, level = 1) {
      const lp = lps[i]
      if (!lp) return
      lp.mode = mode
      lp.targetColor = MODE_COLORS[mode] || MODE_COLORS.off
      lp.targetLevel = mode === 'off' ? 0 : level
    },
    // `animDt` drives motion (packets); it is 0 while paused so the scene holds still.
    update(dt, time, animDt = dt) {
      const k = 1 - Math.exp(-dt * 7)
      for (const b of blocks.values()) {
        b.level += (b.target - b.level) * k
        b.color.lerp(b.targetColor, k)
        const u = b.mat.uniforms
        u.uLevel.value = b.level
        u.uColor.value.copy(b.color)
        u.uTime.value = time
        u.uStyle.value = b.style
        b.mesh.visible = b.level > 0.003
      }
      if (ring) {
        ring.level += (ring.target - ring.level) * k
        ring.mat.uniforms.uLevel.value = ring.level
        ring.mat.uniforms.uTime.value = time
        ring.mesh.visible = ring.level > 0.003
      }
      for (const lp of lps) {
        const led = lp.led
        const tc = new THREE.Color(lp.targetColor || MODE_COLORS.off)
        led.color.lerp(tc, k)
        led.level += ((lp.targetLevel ?? 0) - led.level) * k
        const u = led.mat.uniforms
        u.uColor.value.copy(led.color)
        u.uLevel.value = led.level * 1.5
        u.uTime.value = time
        u.uBreath.value = lp.mode === 'wfs' || lp.mode === 'park' ? 1 : 0
        led.mesh.visible = led.level > 0.01
      }
      // spawn
      for (const [key, s] of streams) {
        if (!s.live) {
          streams.delete(key)
          continue
        }
        // A stream that first appears while paused (stepping through a paused
        // walkthrough) is shown in its steady state, spread along the route.
        if (s.fresh && animDt === 0) {
          const n = Math.min(MAXP - packets.length, Math.round((s.rate * s.len) / s.speed))
          for (let k = 0; k < n; k++) packets.push({ key, pts: s.pts, len: s.len, d: ((k + 0.5) / n) * s.len, speed: s.speed, color: s.color.clone() })
        }
        s.fresh = false
        s.acc += animDt * s.rate
        while (s.acc >= 1 && packets.length < MAXP) {
          s.acc -= 1
          packets.push({ key, pts: s.pts, len: s.len, d: 0, speed: s.speed * (0.85 + Math.random() * 0.3), color: s.color.clone() })
        }
      }
      // advance
      let n = 0
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i]
        p.d += p.speed * animDt
        // while paused, packets of a stream that has ended can't finish their trip
        if (p.d >= p.len || (animDt === 0 && !streams.has(p.key))) {
          packets.splice(i, 1)
          continue
        }
      }
      for (const p of packets) {
        const q = pointAlong(p.pts, p.d)
        pPos[n * 3] = q.x
        pPos[n * 3 + 1] = q.y
        pPos[n * 3 + 2] = q.z
        const fade = Math.min(1, p.d / 0.4, (p.len - p.d) / 0.4)
        pCol[n * 3] = p.color.r * fade
        pCol[n * 3 + 1] = p.color.g * fade
        pCol[n * 3 + 2] = p.color.b * fade
        n++
      }
      pGeo.setDrawRange(0, n)
      pGeo.attributes.position.needsUpdate = true
      pGeo.attributes.color.needsUpdate = true
    },
    // For hover picking: which block (deepest) is under a local point.
    blockAt(x, z) {
      const nx = x / W + 0.5
      const ny = z / H + 0.5
      let best = null
      for (const b of blocks.values()) {
        const r = b.rect
        if (b.kind === 'whole') continue
      if (nx >= r.x && nx <= r.x + r.w && ny >= r.y && ny <= r.y + r.h) {
          if (!best || (b.parent && !best.parent) || r.w * r.h < best.rect.w * best.rect.h) best = b
        }
      }
      return best
    },
  }
  return api
}

function idNum(id) {
  const m = /(\d+)$/.exec(id)
  return m ? Number(m[1]) : 0
}

export function polyLen(pts) {
  let L = 0
  for (let i = 1; i < pts.length; i++) L += pts[i].distanceTo(pts[i - 1])
  return L
}

const _q = new THREE.Vector3()
export function pointAlong(pts, d) {
  for (let i = 1; i < pts.length; i++) {
    const seg = pts[i].distanceTo(pts[i - 1])
    if (d <= seg) return _q.copy(pts[i - 1]).lerp(pts[i], seg ? d / seg : 0)
    d -= seg
  }
  return _q.copy(pts[pts.length - 1])
}

let _sprite = null
export function glowSprite() {
  if (_sprite) return _sprite
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grd.addColorStop(0, 'rgba(255,255,255,1)')
  grd.addColorStop(0.25, 'rgba(255,255,255,0.8)')
  grd.addColorStop(0.6, 'rgba(255,255,255,0.15)')
  grd.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grd
  g.fillRect(0, 0, 64, 64)
  _sprite = new THREE.CanvasTexture(c)
  return _sprite
}
