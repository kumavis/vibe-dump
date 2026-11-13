// The vitrine: renderer, lights, plinth, environment, camera framing, and
// render-on-demand. World units are millimetres, so a vessel's patina noise,
// relief and lighting all agree on scale; the stage re-fits plinth, lights,
// shadow camera and fog to whatever it is showing.

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { setPatinaMode } from '../kit/index.js'

const BG = new THREE.Color('#0f0e0c')
const DEG = Math.PI / 180

export class Stage {
  constructor(canvas, { deterministic = false } = {}) {
    this.deterministic = deterministic
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
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
   * A tiny hand-built photo studio, PMREM-filtered: a big warm softbox high
   * front-right (the key's reflection), a cool strip at the left, a dim warm
   * card behind, in a near-black room. Bronze is a mirror under its patina;
   * these shapes are what the relief arrises catch as crisp highlights.
   */
  _buildEnvironment() {
    const env = new THREE.Scene()
    const room = new THREE.Mesh(new THREE.BoxGeometry(20, 12, 20), new THREE.MeshBasicMaterial({ color: 0x2a231c, side: THREE.BackSide }))
    room.position.y = 3
    env.add(room)
    const card = (w, h, color, k, pos, look) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(k), side: THREE.DoubleSide }))
      m.position.set(...pos)
      m.lookAt(...look)
      env.add(m)
    }
    card(8, 4, '#ffe2bd', 6, [4, 6.5, 5], [0, 0, 0]) // key softbox
    card(6, 2.5, '#ffd9b0', 2.2, [-5, 2.5, 7], [0, 1, 0]) // front-left fill card
    card(1.2, 7, '#bfd4ea', 2.4, [-8.5, 3, 1], [0, 1, 0]) // cool strip
    card(5, 1.4, '#ffd2a0', 1.2, [-1, 4, -9], [0, 1, 0]) // back card
    card(14, 14, '#3a3128', 0.9, [0, -2.9, 0], [0, 0, 0]) // floor bounce
    const pmrem = new THREE.PMREMGenerator(this.renderer)
    this.envMap = pmrem.fromScene(env, 0.02).texture
    pmrem.dispose()
    this.scene.environment = this.envMap
  }

  _buildRoom() {
    // floor + backdrop meet in the same final colour, so the vitrine has no
    // horizon. three mixes fog in AFTER tone mapping, so the backdrop must skip
    // tone mapping too or ACES would crush it darker than the fogged floor.
    this.backdrop = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 16), new THREE.MeshBasicMaterial({ color: BG, side: THREE.BackSide, fog: false, depthWrite: false, toneMapped: false }))
    this.backdrop.renderOrder = -1
    this.scene.add(this.backdrop)
    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshStandardMaterial({ color: '#1b1814', roughness: 0.96, metalness: 0, envMapIntensity: 0.25 }))
    this.floor.rotation.x = -Math.PI / 2
    this.floor.receiveShadow = true
    this.scene.add(this.floor)
    this.plinth = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: '#2a2621', roughness: 0.92, metalness: 0, envMapIntensity: 0.35 }))
    this.plinth.receiveShadow = true
    this.plinth.castShadow = true
    this.scene.add(this.plinth)
    this._fog = new THREE.Fog(BG, 1000, 5000)
    this.scene.fog = this._fog
  }

  _buildLights() {
    this.key = new THREE.SpotLight('#ffd7a6', 4.4, 0, 0.5, 0.75, 0)
    this.key.castShadow = true
    this.key.shadow.mapSize.set(2048, 2048)
    this.key.shadow.bias = -0.0002
    this.scene.add(this.key, this.key.target)
    this.fill = new THREE.DirectionalLight('#8ea6c4', 0.35)
    this.scene.add(this.fill, this.fill.target)
    this.rim = new THREE.SpotLight('#cfdcef', 2.2, 0, 0.45, 0.9, 0)
    this.scene.add(this.rim, this.rim.target)
    this.ambient = new THREE.HemisphereLight('#3a3631', '#0c0b0a', 0.25)
    this.scene.add(this.ambient)
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

    const aim = new THREE.Vector3(c.x, b.min.y + size.y * 0.42, c.z)
    const dir = (az, el) => new THREE.Vector3(Math.sin(az * DEG) * Math.cos(el * DEG), Math.sin(el * DEG), Math.cos(az * DEG) * Math.cos(el * DEG))
    const d = R * 4.2
    if (this.rig === 'raking') {
      // light grazing across the plaque from the upper left: relief by shadow
      this.key.position.copy(aim).addScaledVector(dir(-74, 22), d)
      this.key.angle = Math.atan((R * 1.6) / d)
      this.key.intensity = 6.5
      this.rim.intensity = 0.6
      this.fill.intensity = 0.18
    } else {
      this.key.position.copy(aim).addScaledVector(dir(32, 48), d)
      this.key.angle = Math.atan((R * 2.1) / d)
      this.key.intensity = 4.4
      this.rim.intensity = 2.2
      this.fill.intensity = 0.35
    }
    this.key.target.position.copy(aim)
    const sc = this.key.shadow.camera
    sc.near = d * 0.4
    sc.far = d * 2
    sc.updateProjectionMatrix()
    this.key.shadow.normalBias = R * 0.0015
    this.key.shadow.needsUpdate = true
    this.rim.position.copy(aim).addScaledVector(dir(200, 38), d)
    this.rim.angle = Math.atan((R * 1.5) / d)
    this.rim.target.position.copy(aim)
    this.fill.position.copy(aim).addScaledVector(dir(-120, 20), d)
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
  /** beauty | clay | height | silhouette */
  setMode(mode) {
    this.mode = mode
    const lit = mode === 'beauty' || mode === 'clay'
    setPatinaMode(mode === 'silhouette' ? 'beauty' : mode)
    this.renderer.toneMapping = lit ? THREE.ACESFilmicToneMapping : THREE.NoToneMapping
    this.scene.overrideMaterial = mode === 'silhouette' ? (this._white ??= new THREE.MeshBasicMaterial({ color: 0xffffff })) : null
    for (const o of [this.floor, this.plinth, this.backdrop]) o.visible = lit
    for (const l of [this.key, this.fill, this.rim, this.ambient]) l.visible = lit
    this.scene.environment = lit ? this.envMap : null
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
