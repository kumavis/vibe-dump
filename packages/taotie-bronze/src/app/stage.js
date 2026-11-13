// The vitrine: renderer, lights, plinth, environment, camera framing, and
// render-on-demand. World units are millimetres, so a vessel's patina noise,
// relief and lighting all agree on scale; the stage re-fits plinth, lights,
// shadow camera and fog to whatever it is showing.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { setPatinaMode, setPatinaVessel } from '../kit/index.js'

const BG = new THREE.Color('#0b0a09')
// tone mapping: ACES rolls the as-cast gold highlights off without clipping;
// exposure < 1 keeps saturated malachite from going neon
const TONE = THREE.ACESFilmicToneMapping
const EXPOSURE = 1.0
const DEG = Math.PI / 180

export class Stage {
  constructor(canvas, { deterministic = false } = {}) {
    this.deterministic = deterministic
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = TONE
    renderer.toneMappingExposure = EXPOSURE
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer = renderer

    const scene = new THREE.Scene()
    scene.background = BG.clone()
    this.scene = scene
    this.camera = new THREE.PerspectiveCamera(30, 1, 5, 200000)
    this.camera.position.set(0, 300, 1500)

    this.controls = new OrbitControls(this.camera, canvas)
    this.controls.enableDamping = !deterministic
    this.controls.dampingFactor = 0.08
    this.controls.autoRotateSpeed = 0.35
    this.controls.autoRotate = !deterministic
    this.controls.addEventListener('start', () => {
      this.controls.autoRotate = false
    })
    this.controls.addEventListener('change', () => (this.dirty = true))

    this._buildEnvironment()
    this._buildRoom()
    this._buildLights()

    this.content = null
    this.box = new THREE.Box3(new THREE.Vector3(-100, 0, -100), new THREE.Vector3(100, 200, 100))
    this.mode = 'beauty'
    this.rig = 'vitrine'
    this.insets = { left: 0, right: 0, top: 0, bottom: 0 }
    // with chrome on screen the subject wants more air than in a bare render
    this.fitScale = deterministic ? 1 : 1.18
    this.dirty = true
    this._frameWaiters = []
    this.onFrame = null
    this.resize()
    window.addEventListener('resize', () => this.resize())
    const loop = () => {
      requestAnimationFrame(loop)
      const moved = this.controls.update()
      if (moved || this.dirty || this._frameWaiters.length) this.render()
    }
    requestAnimationFrame(loop)
  }

  // ---------------------------------------------------------- environment
  /**
   * A museum vitrine at night, built procedurally and PMREM-filtered (no HDR
   * files): a near-black gallery; the vitrine's warm ceiling light box above
   * and a big warm softbox front-upper-left (the key's own reflection); a row
   * of small ceiling spots (the glints polished metal shows); a cool tall
   * window strip back-right and a dim warm wall card behind (rim); the glass
   * edges as faint verticals; a dark plinth below. Bronze is a mirror under
   * its patina: these shapes are what the arrises catch. A second, neutral
   * grey copy lights clay mode.
   */
  _buildEnvironment() {
    const build = (neutral) => {
      const env = new THREE.Scene()
      const tint = (c) => {
        const k = new THREE.Color(c)
        return neutral ? k.setScalar(0.2126 * k.r + 0.7152 * k.g + 0.0722 * k.b) : k
      }
      const basic = (c, k) => new THREE.MeshBasicMaterial({ color: tint(c).multiplyScalar(k), side: THREE.DoubleSide })
      // the room: vertical gradient walls (dark floor → slightly lit ceiling) via vertex colours
      const roomGeo = new THREE.SphereGeometry(16, 32, 16)
      const cols = []
      const pos = roomGeo.attributes.position
      const lo = tint('#14110e'), mid = tint('#3a3128'), hi = tint('#4a3f33')
      for (let i = 0; i < pos.count; i++) {
        const y = pos.getY(i) / 16
        const c = y < 0 ? lo.clone().lerp(mid, y + 1) : mid.clone().lerp(hi, Math.min(1, y * 1.4))
        cols.push(c.r, c.g, c.b)
      }
      roomGeo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
      env.add(new THREE.Mesh(roomGeo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })))
      const card = (w, h, color, k, p, look, geo) => {
        const m = new THREE.Mesh(geo || new THREE.PlaneGeometry(w, h), basic(color, k))
        m.position.set(...p)
        m.lookAt(...look)
        env.add(m)
        return m
      }
      card(7, 4.5, '#ffdcb0', 5.5, [-5.5, 7, 6], [0, 0.5, 0]) // key softbox, front-upper-left
      card(9, 6, '#ffe6c8', 1.4, [0, 9.5, 0], [0, 0, 0]) // vitrine ceiling light box
      for (let i = 0; i < 5; i++) card(0.5, 0.5, '#fff0dc', 14, [-6 + i * 3, 11, -3 + (i % 2) * 5], [0, 0, 0]) // ceiling spots
      card(1.3, 8, '#b9cde6', 2.2, [8, 4, -6], [0, 2, 0]) // cool window strip, back-right
      card(6, 2.2, '#ffcf98', 0.9, [-2, 3.5, -10], [0, 2, 0]) // warm wall card behind
      card(5, 4, '#ffd9b4', 1.6, [9, 3, 5], [0, 1.5, 0]) // right fill card
      card(6, 4, '#ffe0c0', 1.4, [-10, 3, -1], [0, 1.5, 0]) // left wall wash
      for (const x of [-7.5, 7.5]) card(0.08, 12, '#e8e0d4', 1.2, [x, 3, 7.5], [x, 3, 0]) // vitrine glass edges
      card(10, 10, '#211d18', 1, [0, -2.5, 0], [0, 0, 0]) // plinth / floor bounce
      card(18, 7, '#6a5a48', 2.2, [0, 3, 13], [0, 3, 0]) // the gallery behind the viewer: dim warm wall
      card(3.5, 2.2, '#ffe4c0', 3, [2.5, 4.5, 11], [0, 1.5, 0]) // a lit label / doorway glow behind the viewer
      const pmrem = new THREE.PMREMGenerator(this.renderer)
      const tex = pmrem.fromScene(env, 0.015).texture
      pmrem.dispose()
      return tex
    }
    this.envMap = build(false)
    this.envNeutral = build(true)
    this.scene.environment = this.envMap
  }

  _buildRoom() {
    // floor + backdrop meet in the same final colour, so the vitrine has no
    // horizon. three mixes fog in AFTER tone mapping, so the backdrop must skip
    // tone mapping too or the tone curve would crush it darker than the fogged floor.
    this.backdrop = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshBasicMaterial({ color: BG, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false }))
    this.backdrop.renderOrder = -1
    this.scene.add(this.backdrop)
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#141210', roughness: 0.97, metalness: 0, envMapIntensity: 0.2 }))
    this.floor.rotation.x = -Math.PI / 2
    this.floor.receiveShadow = true
    this.scene.add(this.floor)
    // matte dark plinth: fine felt/lacquered-wood top, darker sides
    const top = new THREE.MeshStandardMaterial({ color: '#2b2722', roughness: 0.9, metalness: 0, envMapIntensity: 0.3 })
    const side = new THREE.MeshStandardMaterial({ color: '#1a1714', roughness: 0.93, metalness: 0, envMapIntensity: 0.25 })
    this.plinth = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), [side, side, top, side, side, side])
    this.plinth.receiveShadow = true
    this.plinth.castShadow = true
    this.scene.add(this.plinth)
    // contact shadow: soft occlusion where the vessel meets the plinth (the key's
    // shadow map alone leaves feet and foot rings floating)
    const c = document.createElement('canvas')
    c.width = c.height = 128
    const g = c.getContext('2d')
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64)
    grd.addColorStop(0, 'rgba(0,0,0,0.75)')
    grd.addColorStop(0.45, 'rgba(0,0,0,0.42)')
    grd.addColorStop(1, 'rgba(0,0,0,0)')
    g.fillStyle = grd
    g.fillRect(0, 0, 128, 128)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    this.contact = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false, fog: false }))
    this.contact.rotation.x = -Math.PI / 2
    this.contact.renderOrder = 1
    this.scene.add(this.contact)
    this._fog = new THREE.Fog(BG, 1000, 5000)
    this.scene.fog = this._fog
  }

  _buildLights() {
    // warm tungsten-halogen key spot, front-upper-left: rakes across the relief
    this.key = new THREE.SpotLight('#ffeedf', 4.2, 0, 0.5, 0.6, 0)
    this.key.castShadow = true
    this.key.shadow.mapSize.set(2048, 2048)
    this.key.shadow.bias = -0.0002
    this.key.shadow.radius = 4
    this.scene.add(this.key, this.key.target)
    // cool, weak fill from the front-right
    this.fill = new THREE.DirectionalLight('#c3cbd6', 0.3)
    this.scene.add(this.fill, this.fill.target)
    // soft rim from behind so the silhouette lifts off the near-black ground
    this.rim = new THREE.SpotLight('#dfe6f0', 2.6, 0, 0.45, 0.95, 0)
    this.scene.add(this.rim, this.rim.target)
    this.ambient = new THREE.HemisphereLight('#3a3631', '#0c0b0a', 0.3)
    this.scene.add(this.ambient)
    this._lightLook = { key: this.key.color.clone(), fill: this.fill.color.clone(), rim: this.rim.color.clone() }
  }

  // ------------------------------------------------------------- content
  /** Show an object (vessel or plaque). The previous one is removed, not disposed. */
  setContent(object, { rig = 'vitrine' } = {}) {
    if (this.content) this.scene.remove(this.content)
    this.content = object
    this.rig = rig
    if (object) {
      this.scene.add(object)
      object.updateMatrixWorld(true)
      this.box = new THREE.Box3().setFromObject(object)
      setPatinaVessel(object)
    }
    this._layoutRoom()
    this.dirty = true
  }

  _layoutRoom() {
    const b = this.box
    const size = b.getSize(new THREE.Vector3())
    const c = b.getCenter(new THREE.Vector3())
    const R = Math.max(size.length() / 2, 10)
    this.R = R
    const ph = Math.max(12, Math.min(60, size.y * 0.08))
    const pw = Math.max(size.x, size.z * 0.6) * 1.32 + 40
    const pd = Math.max(size.z, size.x * 0.5) * 1.32 + 40
    this.plinth.scale.set(pw, ph, pd)
    this.plinth.position.set(c.x, b.min.y - ph / 2, c.z)
    this.floor.scale.set(R * 60, R * 60, 1)
    this.floor.position.set(c.x, b.min.y - ph, c.z)
    this.backdrop.scale.setScalar(R * 40)
    this.backdrop.position.copy(c)

    // contact shadow: the vessel's footprint, a little larger, on the plinth top
    this.contact.scale.set(size.x * 1.25 + 20, size.z * 1.25 + 20, 1)
    this.contact.position.set(c.x, b.min.y + 0.3, c.z)

    const aim = new THREE.Vector3(c.x, b.min.y + size.y * 0.45, c.z)
    const dir = (az, el) => new THREE.Vector3(Math.sin(az * DEG) * Math.cos(el * DEG), Math.sin(el * DEG), Math.cos(az * DEG) * Math.cos(el * DEG))
    const d = R * 4.2
    if (this.rig === 'raking') {
      // light grazing across the plaque from the upper left: relief by shadow
      this.key.position.copy(aim).addScaledVector(dir(-74, 22), d)
      this.key.angle = Math.atan((R * 1.6) / d)
      this.key.intensity = 5.2
      this.rim.intensity = 0.6
      this.fill.intensity = 0.2
      this.contact.visible = false
    } else {
      // vitrine: key front-upper-left, high enough to rake down across horizontal registers
      this.key.position.copy(aim).addScaledVector(dir(-38, 42), d)
      this.key.angle = Math.atan((R * 1.9) / d)
      this.key.intensity = 4.2
      this.rim.intensity = 3.2
      this.fill.intensity = 1.2
      this.contact.visible = true
    }
    this.key.target.position.copy(aim)
    const sc = this.key.shadow.camera
    sc.near = d * 0.4
    sc.far = d * 2
    sc.updateProjectionMatrix()
    this.key.shadow.normalBias = R * 0.0015
    this.key.shadow.needsUpdate = true
    this.rim.position.copy(aim).addScaledVector(dir(165, 32), d)
    this.rim.angle = Math.atan((R * 1.5) / d)
    this.rim.target.position.copy(aim)
    this.fill.position.copy(aim).addScaledVector(dir(60, 12), d)
    this.fill.target.position.copy(aim)
  }

  // --------------------------------------------------------------- views
  /**
   * Frame the content from a named view: { azimuth°, elevation°, fov°, fit, target?: [x,y,z] mm }.
   * fit = 1 puts the bounding box exactly at the frame edge; >1 adds air.
   */
  setView(v = {}) {
    const { azimuth = 25, elevation = 12, fov = 30 } = v
    const fit = (v.fit ?? 1.1) * this.fitScale
    const cam = this.camera
    cam.fov = fov
    const b = this.box
    const target = v.target ? new THREE.Vector3(...v.target) : b.getCenter(new THREE.Vector3())
    const d = new THREE.Vector3(Math.sin(azimuth * DEG) * Math.cos(elevation * DEG), Math.sin(elevation * DEG), Math.cos(azimuth * DEG) * Math.cos(elevation * DEG))
    const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), d).normalize()
    if (right.lengthSq() < 1e-6) right.set(1, 0, 0)
    const up = new THREE.Vector3().crossVectors(d, right).normalize()
    const { w, h } = this._effectiveSize()
    // the frustum spans the whole canvas; the subject must fit the part of it
    // left free by the chrome (insets), at the same angle per pixel
    const perPx = Math.tan((fov * DEG) / 2) / (this.height / 2)
    const tanV = perPx * (h / 2)
    const tanH = perPx * (w / 2)
    let dist = 0
    if (v.target) {
      // a detail view frames a region of `fit × R` around the target
      dist = (this.R * fit) / Math.min(tanV, tanH)
    } else {
      for (let i = 0; i < 8; i++) {
        const p = new THREE.Vector3(i & 1 ? b.max.x : b.min.x, i & 2 ? b.max.y : b.min.y, i & 4 ? b.max.z : b.min.z).sub(target)
        const x = Math.abs(p.dot(right)), y = Math.abs(p.dot(up)), z = p.dot(d)
        dist = Math.max(dist, z + x / tanH, z + y / tanV)
      }
      dist *= fit
    }
    cam.position.copy(target).addScaledVector(d, dist)
    this.controls.target.copy(target)
    cam.near = Math.max(1, dist / 100)
    cam.far = this.R * 80
    cam.updateProjectionMatrix()
    this.controls.minDistance = this.R * 0.25
    this.controls.maxDistance = this.R * 12
    this.controls.maxPolarAngle = Math.PI * 0.5 - 0.02
    this.controls.update()
    this._fog.near = dist + this.R * 1.4
    this._fog.far = dist + this.R * 9
    this._applyViewOffset()
    this.dirty = true
  }

  /** Reserve screen space for chrome (px) so the subject centres in what's left. */
  setInsets(insets) {
    this.insets = { left: 0, right: 0, top: 0, bottom: 0, ...insets }
    this._applyViewOffset()
    this.dirty = true
  }

  _effectiveSize() {
    const W = this.width || 1, H = this.height || 1
    return { w: Math.max(100, W - this.insets.left - this.insets.right), h: Math.max(100, H - this.insets.top - this.insets.bottom) }
  }

  _applyViewOffset() {
    const W = this.width, H = this.height
    const dx = (this.insets.right - this.insets.left) / 2
    const dy = (this.insets.bottom - this.insets.top) / 2
    if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) this.camera.clearViewOffset()
    else this.camera.setViewOffset(W, H, dx, dy, W, H)
    this.camera.aspect = W / H
    this.camera.updateProjectionMatrix()
  }

  // --------------------------------------------------------------- modes
  /** beauty | clay | height | silhouette | mask (patina layer coverages, false colour) */
  setMode(mode) {
    this.mode = mode
    const lit = mode === 'beauty' || mode === 'clay'
    const clay = mode === 'clay'
    setPatinaMode(mode === 'silhouette' ? 'beauty' : mode)
    this.renderer.toneMapping = lit ? TONE : THREE.NoToneMapping
    this.renderer.toneMappingExposure = clay ? 1 : EXPOSURE
    this.scene.overrideMaterial = mode === 'silhouette' ? (this._white ??= new THREE.MeshBasicMaterial({ color: 0xffffff })) : null
    for (const o of [this.floor, this.plinth, this.backdrop]) o.visible = lit
    this.contact.visible = lit && this.rig !== 'raking'
    for (const l of [this.key, this.fill, this.rim, this.ambient]) l.visible = lit
    // clay: the same raking geometry, but neutral white light and a grey room
    this.key.color.copy(clay ? new THREE.Color('#ffffff') : this._lightLook.key)
    this.fill.color.copy(clay ? new THREE.Color('#d8d8d8') : this._lightLook.fill)
    this.rim.color.copy(clay ? new THREE.Color('#ffffff') : this._lightLook.rim)
    this.scene.environment = lit ? (clay ? this.envNeutral : this.envMap) : null
    this.scene.fog = lit ? this._fog : null
    this.scene.background = lit ? BG : new THREE.Color(0x000000)
    this.dirty = true
  }

  // -------------------------------------------------------------- render
  resize() {
    const W = window.innerWidth, H = window.innerHeight
    this.width = W
    this.height = H
    this.renderer.setSize(W, H, false)
    this.camera.aspect = W / H
    this._applyViewOffset()
    this.dirty = true
  }

  render() {
    this.dirty = false
    this.renderer.render(this.scene, this.camera)
    const w = this._frameWaiters
    this._frameWaiters = []
    for (const r of w) r()
    if (this.onFrame) this.onFrame()
  }

  /** Resolves after the next rendered frame (forces one). */
  frame() {
    return new Promise((resolve) => {
      this._frameWaiters.push(resolve)
      this.dirty = true
    })
  }

  setAutoRotate(on) {
    this.controls.autoRotate = on && !this.deterministic
  }
}
