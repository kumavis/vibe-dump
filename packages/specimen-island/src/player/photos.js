import * as THREE from 'three'
import { WEAPONS, PHOTO } from '../data/weapons.js'
import { clamp, damp, smoothstep } from '../core/mathx.js'

// Wildlife photography with the Field Camera. The shutter asks evaluate() what
// is in the viewfinder: every loaded animal in range is projected through the
// game camera (its hit spheres give a screen-space box), and a handful of body
// spheres are tested for visibility twice — a physics ray (terrain, walls,
// trunks) and a look-up in a small ID render of the view, because ferns, tall
// grass, buttress roots and leaves have no colliders but hide an animal just
// the same. gradeSubject() — a pure function of those measurements and the
// PHOTO table in data/weapons.js — turns that into quality 0-100 and 1-3
// stars. The best subject is the photo's subject.
//
// Each species' first photo pays its science.photo value scaled by quality;
// a retake pays only the improvement on that species' best, so a species is
// worth at most its photo value. Photos do not catalogue anything — the
// scanner stays the way to learn a species. The album keeps every species'
// best frame as a small JPEG read off the WebGL canvas right after the scene
// renders and before the view models draw (main.js draw() calls capture()).

const _v = new THREE.Vector3()
const _fwd = new THREE.Vector3()
const _prevFwd = new THREE.Vector3()
const _clear = new THREE.Color()

// The viewfinder rectangle inside a w x h viewport (any unit: CSS px for the
// overlay, drawing-buffer px for the capture, NDC-ish for evaluation).
export function frameRect(w, h, f = PHOTO.frame) {
  const fw = Math.min(w * f.fill, h * f.fill * f.aspect)
  const fh = fw / f.aspect
  return { x: (w - fw) / 2, y: (h - fh) / 2, w: fw, h: fh }
}

// Unearned stars are dimmed filled stars: readable at any size, unlike ☆.
export const starHtml = (n) => '★'.repeat(n) + (n < 3 ? `<i>${'★'.repeat(3 - n)}</i>` : '')

export function starsFor(quality, P = PHOTO) {
  if (quality < P.minQuality) return 0
  return quality >= P.stars[1] ? 3 : quality >= P.stars[0] ? 2 : 1
}

// Pure grading. `m` holds one subject's measurements:
//   fill      larger of box width/height relative to the frame (may exceed 1)
//   inFrame   share of the box inside the frame       headIn  head inside it
//   cu, cv    centre of the in-frame part of the box (0..1, v down)
//   vis       weighted share of sampled spheres in plain view
//   turn      camera swing (rad/s)   zoom  lens factor   speed  photographer m/s
//   pose      key into P.pose        group  herd-mates in frame   unaware  bool
export function gradeSubject(m, P = PHOTO) {
  const F = P.fill
  let fill
  if (m.fill < F.min) fill = 0
  else if (m.fill < F.sweet[0]) fill = Math.pow((m.fill - F.min) / (F.sweet[0] - F.min), 0.8)
  else if (m.fill <= F.sweet[1]) fill = 1
  else if (m.fill <= F.big) fill = 1 - ((1 - F.bigScore) * (m.fill - F.sweet[1])) / (F.big - F.sweet[1])
  else fill = Math.max(F.hugeScore, F.bigScore - ((F.bigScore - F.hugeScore) * (m.fill - F.big)) / F.big)
  const vis = clamp(m.vis, 0, 1)
  const crop = Math.pow(clamp(m.inFrame, 0, 1), 1.5) * (m.headIn ? 1 : P.cropHeadOut)
  // composition: dead centre is fine, a rule-of-thirds point is better
  const T = P.thirds
  const dCentre = Math.hypot(m.cu - 0.5, m.cv - 0.5)
  let dThird = Infinity
  for (const tu of [1 / 3, 2 / 3]) for (const tv of [1 / 3, 2 / 3]) dThird = Math.min(dThird, Math.hypot(m.cu - tu, m.cv - tv))
  const placed = Math.max(T.centre * (1 - smoothstep(0.03, T.falloff, dCentre)), 1 - smoothstep(0.03, T.falloff, dThird))
  const comp = 1 - T.weight + T.weight * placed
  // motion blur: a swinging lens (worse zoomed in) or a walking photographer
  const S = P.steady
  const blur = m.turn * m.zoom * S.turn + Math.max(0, m.speed - S.walk) * S.move
  const steady = clamp(1 - blur, S.floor, 1)
  const core = fill * vis * crop * comp * steady
  const pose = P.pose[m.pose] ?? 0
  const group = Math.min(P.group.max, m.group * P.group.each)
  const unaware = m.unaware ? P.unaware : 0
  const quality = Math.round(clamp(100 * P.scale * core * Math.max(0.1, 1 + pose + group + unaware), 0, 100))
  return { quality, stars: starsFor(quality, P), parts: { fill, vis, crop, comp, steady, pose, group, unaware } }
}

// The weakest factor of a graded subject, as advice for the viewfinder.
export function hintFor(m, P = PHOTO) {
  const q = m.parts
  if (m.fill < P.fill.sweet[0] && q.fill < 0.6) return 'Get closer or zoom in'
  if (m.fill > P.fill.big) return 'Too close — zoom out'
  if (q.vis < 0.6) return m.blocked > 0.4 ? 'Blocked from view' : m.screened > 0.3 ? 'Something is in the way' : 'Partly hidden'
  if (q.crop < 0.7) return m.headIn ? 'Cropped' : 'Head out of frame'
  if (q.steady < 0.8) return 'Hold still'
  if (m.fill > P.fill.sweet[1] && q.fill < 0.9) return 'A little tight'
  if (q.comp < 0.9) return 'Frame it on a third'
  return ''
}

const POSE_LABEL = {
  roar: 'roaring',
  charge: 'charging',
  attack: 'attacking',
  spit: 'spitting',
  threaten: 'threat display',
  hunt: 'hunting',
  running: 'running',
  flee: 'fleeing',
  feed: 'feeding',
  alert: 'alert',
  investigate: 'curious',
  groggy: 'groggy',
  down: 'sedated',
  dead: 'dead',
}
export function poseLabel(pose, sp) {
  if (pose === 'graze') return sp.diet === 'herbivore' ? 'grazing' : 'foraging'
  return POSE_LABEL[pose] || pose
}

function poseOf(c) {
  const v = c.vitals
  if (!v.alive) return 'dead'
  if (!v.conscious) return 'down'
  if (c.roaring > 0.4) return 'roar'
  const s = c.brain.state
  if (c.speed > c.sp.speed.run * 0.5 && !((PHOTO.pose[s] ?? 0) >= PHOTO.pose.running)) return 'running'
  return s
}

// A handful of spheres spread over the body for the line-of-sight test.
function sampleSpheres(hits) {
  const by = (prefix) => hits.filter((h) => h.bone.startsWith(prefix))
  const neck = by('neck')
  const tail = by('tail')
  const limbs = hits.filter((h) => h.zone === 'limb')
  return [hits[0], neck[neck.length >> 1], by('chest')[0], by('hips')[0], tail[1] || tail[0], limbs[0], limbs[limbs.length - 1]].filter(Boolean)
}

// Does the ID render show animal `id` within a pixel of NDC (nx, ny)?
function idAt(ids, nx, ny, id) {
  const { buf, w, h } = ids
  const px = Math.floor(((nx + 1) / 2) * w)
  const py = Math.floor(((ny + 1) / 2) * h) // readPixels rows start at the bottom, like NDC
  for (let y = Math.max(0, py - 1); y <= Math.min(h - 1, py + 1); y++) {
    for (let x = Math.max(0, px - 1); x <= Math.min(w - 1, px + 1); x++) {
      const i = (y * w + x) * 4
      if (buf[i] === id && buf[i + 1] === 255) return true
    }
  }
  return false
}

export class Photos {
  constructor(G) {
    this.G = G
    this.album = {} // species id -> best photo { species, quality, stars, pose, dist, image, hours, points }
    this.shots = 0
    this.cool = 0
    this.turn = 0 // smoothed camera swing, rad/s
    this.lastFrame = -9
    this.liveT = 0
    this.live = null // latest evaluate() for the viewfinder
    this.last = null // latest shot, for the preview card
    this.pending = [] // shots waiting for the next rendered frame
    this.snap = null // the 2D canvas the last frame was copied into
  }

  get count() {
    return Object.keys(this.album).length
  }

  // Runs every frame while the camera is in hand (from the weapon system).
  update(dt, input, active) {
    const G = this.G
    this.cool -= dt
    // how fast the view is swinging, for motion blur
    _fwd.set(0, 0, -1).applyQuaternion(G.camera.quaternion)
    if (this.lastFrame === G.frame - 1 && dt > 0) this.turn = damp(this.turn, _prevFwd.angleTo(_fwd) / dt, 10, dt)
    else this.turn = 0
    _prevFwd.copy(_fwd)
    this.lastFrame = G.frame

    this.liveT -= dt
    if (this.liveT <= 0) {
      this.liveT = PHOTO.liveRate
      this.live = active ? this.evaluate() : null
    }
    if (active && input.pressed('fire') && this.cool <= 0) this.take()
    this.drawScreen(active)
  }

  // Grade everything in the viewfinder; returns { best, subjects, zoom }.
  evaluate() {
    const G = this.G
    const cam = G.camera
    const tanY = Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))
    const fr = frameRect(cam.aspect, 1)
    const V = {
      o: cam.position,
      inv: cam.matrixWorldInverse,
      tanX: tanY * cam.aspect,
      tanY,
      fu: fr.w / cam.aspect, // frame half-extents in NDC
      fv: fr.h,
      range: WEAPONS.camera.range,
    }
    const subjects = []
    for (const c of G.ecology.active) {
      const m = this.measure(c, V)
      if (m) subjects.push(m)
    }
    const ids = subjects.length ? this.idPass(subjects) : null
    for (const m of subjects) this.resolveVisibility(m, ids)
    const zoom = G.weapons.zoomFactor()
    const speed = Math.hypot(G.player.vel.x, G.player.vel.z)
    const Gp = PHOTO.group
    let best = null
    for (const m of subjects) {
      m.group = 0
      for (const o of subjects) {
        if (o !== m && o.species === m.species && o.fill >= Gp.minFill && o.vis >= Gp.minVis && o.inFrame >= 0.5) m.group++
      }
      m.turn = this.turn
      m.zoom = zoom
      m.speed = speed
      Object.assign(m, gradeSubject(m))
      m.hint = hintFor(m)
      if (!best || m.quality > best.quality) best = m
    }
    return { best, subjects, zoom }
  }

  // Project one animal into the frame. null when it is out of range or view.
  measure(c, V) {
    if (c.disposed) return null
    const ctr = c.center()
    const dist = ctr.distanceTo(V.o)
    if (dist > V.range) return null
    const dims = c.rig.template.dims
    const R = Math.max(dims.length, dims.height) * 0.75 * c.scale
    _v.copy(ctr).applyMatrix4(V.inv)
    const z = -_v.z
    if (z < -R) return null
    const zc = Math.max(z, 0)
    if (Math.abs(_v.x) > zc * V.tanX * V.fu + R || Math.abs(_v.y) > zc * V.tanY * V.fv + R) return null

    const hits = c.updateHits()
    let u0 = Infinity
    let u1 = -Infinity
    let v0 = Infinity
    let v1 = -Infinity
    let front = 0
    let headIn = false
    for (const h of hits) {
      _v.copy(h.world).applyMatrix4(V.inv)
      const d = -_v.z
      if (d < 0.25) continue
      front++
      const ku = 1 / (2 * d * V.tanX * V.fu)
      const kv = 1 / (2 * d * V.tanY * V.fv)
      const u = 0.5 + _v.x * ku
      const v = 0.5 - _v.y * kv
      const ru = h.rWorld * ku
      const rv = h.rWorld * kv
      u0 = Math.min(u0, u - ru)
      u1 = Math.max(u1, u + ru)
      v0 = Math.min(v0, v - rv)
      v1 = Math.max(v1, v + rv)
      if (h === hits[0]) headIn = u > 0 && u < 1 && v > 0 && v < 1
    }
    if (!front) return null
    const cu0 = Math.max(0, u0)
    const cu1 = Math.min(1, u1)
    const cv0 = Math.max(0, v0)
    const cv1 = Math.min(1, v1)
    if (cu1 <= cu0 || cv1 <= cv0) return null
    const area = (u1 - u0) * (v1 - v0)
    const inFrame = ((cu1 - cu0) * (cv1 - cv0)) / Math.max(area, 1e-9) * (front / hits.length)
    if (inFrame < 0.05) return null

    // a few body spheres: where they land in the view, and whether a physics
    // ray reaches them (terrain, walls, trunks); the ID render adds the rest
    const spheres = c._photoSamples || (c._photoSamples = sampleSpheres(hits))
    const o = V.o
    const samples = []
    for (const h of spheres) {
      _v.copy(h.world).applyMatrix4(V.inv)
      const d = -_v.z
      const nx = _v.x / (Math.max(d, 1e-3) * V.tanX)
      const ny = _v.y / (Math.max(d, 1e-3) * V.tanY)
      if (d < 0.25 || Math.abs(nx) > 1 || Math.abs(ny) > 1) continue // out of view: that is cropping, not hiding
      const dx = h.world.x - o.x
      const dy = h.world.y - o.y
      const dz = h.world.z - o.z
      const len = Math.hypot(dx, dy, dz)
      const t = len - h.rWorld * 0.9
      const clear = t <= 0.1 || !this.G.physics.raycast(o.x, o.y, o.z, dx / len, dy / len, dz / len, t)
      samples.push({ w: h === hits[0] ? PHOTO.headWeight : 1, nx, ny, clear })
    }

    const pose = poseOf(c)
    return {
      creature: c,
      species: c.sp.id,
      dist,
      fill: Math.max(u1 - u0, v1 - v0),
      inFrame,
      headIn,
      box: { u0: cu0, u1: cu1, v0: cv0, v1: cv1 },
      cu: (cu0 + cu1) / 2,
      cv: (cv0 + cv1) / 2,
      samples,
      pose,
      poseLabel: poseLabel(pose, c.sp),
      unaware: c.vitals.conscious && c.perception.awareness < 0.35,
    }
  }

  // Weighted share of samples in plain view: the physics ray is clear and the
  // ID render shows this animal at (or right next to) the sample's pixel.
  resolveVisibility(m, ids) {
    let total = 0
    let seen = 0
    let blocked = 0
    let screened = 0
    for (const s of m.samples) {
      total += s.w
      if (!s.clear) blocked += s.w
      else if (ids && !idAt(ids, s.nx, s.ny, m.id)) screened += s.w
      else seen += s.w
    }
    m.vis = total ? seen / total : 0
    m.blocked = total ? blocked / total : 0
    m.screened = total ? screened / total : 0
    m.pixels = ids ? ids.count[m.id] || 0 : -1
  }

  // Render the view small: everything black, each candidate animal in its own
  // ID colour on top, depth-tested against the rest — what survives is what
  // the lens sees. Returns { buf, w, h, count } or null.
  idPass(subjects) {
    const G = this.G
    const R = G.renderer
    if (!R) return null
    const cam = G.camera
    const w = PHOTO.idBuffer.w
    const h = Math.max(32, Math.round(w / cam.aspect))
    if (!this.rt || this.rt.height !== h) {
      this.rt?.dispose()
      this.rt = new THREE.WebGLRenderTarget(w, h)
      this.idBuf = new Uint8Array(w * h * 4)
      // double-sided: a grass blade seen from behind still hides what is behind it
      this.black ||= new THREE.MeshBasicMaterial({ color: 0x000000, fog: false, toneMapped: false, side: THREE.DoubleSide })
      this.idMats ||= []
    }
    const scene = G.scene
    const prev = { target: R.getRenderTarget(), alpha: R.getClearAlpha(), override: scene.overrideMaterial, background: scene.background, shadows: R.shadowMap.autoUpdate, far: cam.far }
    R.getClearColor(_clear)
    const n = Math.min(subjects.length, 254)
    try {
      R.shadowMap.autoUpdate = false
      scene.background = null
      cam.far = WEAPONS.camera.range + 40
      cam.updateProjectionMatrix()
      R.setRenderTarget(this.rt)
      R.setClearColor(0x000000, 1)
      R.clear()
      scene.overrideMaterial = this.black
      R.render(scene, cam)
      scene.overrideMaterial = prev.override
      for (let i = 0; i < n; i++) {
        const m = subjects[i]
        m.id = i + 1
        const mesh = m.creature.mesh
        const mat = mesh.material
        mesh.material = this.idMat(m.id)
        R.render(mesh, cam)
        mesh.material = mat
      }
      R.readRenderTargetPixels(this.rt, 0, 0, w, h, this.idBuf)
    } catch (err) {
      console.warn('photo ID pass failed', err)
      return null
    } finally {
      scene.overrideMaterial = prev.override
      scene.background = prev.background
      R.shadowMap.autoUpdate = prev.shadows
      cam.far = prev.far
      cam.updateProjectionMatrix()
      R.setRenderTarget(prev.target)
      R.setClearColor(_clear, prev.alpha)
    }
    const count = new Uint32Array(256)
    const buf = this.idBuf
    for (let i = 0; i < buf.length; i += 4) count[buf[i]]++
    return { buf, w, h, count }
  }

  idMat(id) {
    let m = this.idMats[id]
    if (!m) {
      // linear colour straight into a linear target: the red byte is the id
      m = this.idMats[id] = new THREE.MeshBasicMaterial({ fog: false, toneMapped: false })
      m.color.setRGB(id / 255, 1, 0, THREE.LinearSRGBColorSpace)
    }
    return m
  }

  take() {
    const G = this.G
    const def = WEAPONS.camera
    const p = G.player
    this.cool = def.rof
    const res = this.evaluate()
    this.live = res
    this.liveT = PHOTO.liveRate
    G.audio?.play('shutter')
    G.weapons.vm.fire(0.12)
    G.events.emit('noise', { x: p.pos.x, y: p.pos.y, z: p.pos.z, radius: def.noise, source: 'player', kind: 'shutter' })
    const s = res.best && res.best.stars > 0 ? res.best : null
    const shot = { id: ++this.shots, time: G.time, image: null, species: null, quality: 0, stars: 0, points: 0, first: false, best: false, prevQuality: 0, subject: s }
    if (s) {
      const id = s.species
      const prev = this.album[id]
      const prevQuality = prev ? prev.quality : 0
      const first = !prev
      const points = Math.round((s.creature.sp.science.photo * Math.max(0, s.quality - prevQuality)) / 100)
      Object.assign(shot, { species: id, quality: s.quality, stars: s.stars, points, first, prevQuality, pose: s.poseLabel, dist: s.dist })
      if (s.quality > prevQuality) {
        shot.best = true
        shot.entry = { species: id, quality: s.quality, stars: s.stars, pose: s.poseLabel, dist: Math.round(s.dist), image: prev ? prev.image : null, hours: G.sky.hours, points: (prev ? prev.points : 0) + points }
        this.album[id] = shot.entry
      }
      G.events.emit('photo:taken', { creature: s.creature, species: id, quality: s.quality, stars: s.stars, points, first })
    }
    this.last = shot
    this.pending.push(shot)
    return shot
  }

  // main.js draw(): copy the frame just rendered (before the view models) for
  // the shots taken since the last frame. Same task as the render, so the
  // drawing buffer is still intact without preserveDrawingBuffer.
  capture(src) {
    if (!this.pending.length) return
    const I = PHOTO.image
    if (!this.snap) {
      this.snap = document.createElement('canvas')
      this.snap.width = I.w
      this.snap.height = I.h
    }
    const f = frameRect(src.width, src.height)
    let url = null
    try {
      this.snap.getContext('2d').drawImage(src, f.x, f.y, f.w, f.h, 0, 0, I.w, I.h)
      url = this.snap.toDataURL('image/jpeg', I.quality)
    } catch {
      /* a lost context: keep the shot, just without a picture */
    }
    for (const shot of this.pending) {
      shot.image = url
      if (shot.entry) shot.entry.image = url
    }
    this.pending.length = 0
  }

  // The little screen on the back of the camera: the live estimate, or the
  // last frame for a moment after the shutter.
  drawScreen(active) {
    const G = this.G
    const shot = this.last
    if (shot && shot.image && G.time - shot.time < PHOTO.preview) {
      G.weapons.vm.drawCameraScreen({ review: shot.id, snap: this.snap, stars: shot.stars })
      return
    }
    const b = active && this.live?.best
    const known = b && G.science.known(b.species)
    G.weapons.vm.drawCameraScreen({
      line1: b && b.stars ? (known ? b.creature.sp.name.toUpperCase() : 'UNKNOWN ANIMAL') : 'NO SUBJECT',
      stars: b ? b.stars : 0,
      zoom: G.weapons.zoomFactor().toFixed(1),
    })
  }
}
