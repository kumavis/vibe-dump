// One Pointer abstraction for every input (research: webxr §3). Interaction
// code sees only these, whatever drives them:
//   { id: 'mouse' | 'xr-0' | 'xr-1', kind: 'mouse' | 'reticle' | 'xr', active,
//     ray: Raycaster (world), matrix: Matrix4 (pointer pose, -Z along the ray),
//     down, pressed, released, squeeze, squeezed, dragPx, hand }
// Edges (pressed/released/squeezed) are true for exactly one update() after the
// event, and a press and release inside one frame still reads as a click.
// The mouse ray goes through the cursor, or through the screen centre while the
// pointer is locked (play mode: kind 'reticle'); XR rays come from the target-ray
// space via Raycaster.setFromXRController (three >= 0.162).
import * as THREE from 'three'

function makePointer (id, kind, camera) {
  const ray = new THREE.Raycaster()
  ray.camera = camera // sprites need a camera to raycast against
  return { id, kind, active: false, ray, matrix: new THREE.Matrix4(), down: false, pressed: false, released: false, squeeze: false, squeezed: false, unsqueezed: false, dragPx: 0, hand: null, events: [] }
}

const UP = new THREE.Vector3(0, 1, 0)
const ZERO = new THREE.Vector2()
const tmpV = new THREE.Vector3(); const tmpT = new THREE.Vector3()

export function makePointers ({ renderer, camera, rig, dom = renderer?.domElement, win = globalThis.window } = {}) {
  const mouse = makePointer('mouse', 'mouse', camera)
  const xr = [makePointer('xr-0', 'xr', camera), makePointer('xr-1', 'xr', camera)]
  const ndc = new THREE.Vector2()
  let mouseEnabled = true
  let downAt = null
  const offs = []
  const on = (t, type, fn, opt) => { if (!t?.addEventListener) return; t.addEventListener(type, fn, opt); offs.push(() => t.removeEventListener(type, fn, opt)) }

  const setNdc = (e) => {
    const r = dom.getBoundingClientRect?.() ?? { left: 0, top: 0, width: win?.innerWidth ?? 1, height: win?.innerHeight ?? 1 }
    ndc.set(((e.clientX - r.left) / Math.max(1, r.width)) * 2 - 1, -((e.clientY - r.top) / Math.max(1, r.height)) * 2 + 1)
  }
  on(dom, 'pointermove', (e) => {
    setNdc(e)
    if (downAt) mouse.dragPx = Math.max(mouse.dragPx, Math.hypot(e.clientX - downAt[0], e.clientY - downAt[1]))
  })
  on(dom, 'pointerdown', (e) => {
    if (e.button !== 0 || !mouseEnabled) return
    setNdc(e); downAt = [e.clientX, e.clientY]; mouse.dragPx = 0
    mouse.events.push('down')
  })
  on(win, 'pointerup', (e) => {
    if (e.button !== 0 || !downAt) return
    downAt = null
    mouse.events.push('up')
  })
  for (const h of rig.hands) {
    const p = xr[h.index]; p.hand = h
    on(h.ray, 'selectstart', () => p.events.push('down'))
    on(h.ray, 'selectend', () => p.events.push('up'))
    on(h.ray, 'squeezestart', () => p.events.push('sqdown'))
    on(h.ray, 'squeezeend', () => p.events.push('squp'))
  }

  function drain (p) {
    p.pressed = p.released = p.squeezed = p.unsqueezed = false
    for (const ev of p.events) {
      if (ev === 'down') { p.pressed = true; p.down = true } else if (ev === 'up') { p.released = true; p.down = false } else if (ev === 'sqdown') { p.squeezed = true; p.squeeze = true } else if (ev === 'squp') { p.unsqueezed = true; p.squeeze = false }
    }
    p.events.length = 0
  }

  // Idempotent within a frame: the app may call update() and then interaction
  // calls it again; a second drain would erase this frame's press/release edges.
  let lastAt = -Infinity
  const nowMs = () => globalThis.performance?.now() ?? Date.now()
  function update () {
    const t = nowMs()
    const queued = mouse.events.length + xr[0].events.length + xr[1].events.length
    if (t - lastAt < 3 && !queued) return
    lastAt = t
    const presenting = !!renderer.xr?.isPresenting
    // mouse: a pointer whose -Z is the ray, so grab-offset math is identical to XR
    drain(mouse)
    mouse.active = !presenting && mouseEnabled
    if (mouse.active) {
      const locked = !!globalThis.document?.pointerLockElement
      mouse.kind = locked ? 'reticle' : 'mouse'
      camera.updateMatrixWorld()
      mouse.ray.setFromCamera(locked ? ZERO : ndc, camera)
      const r = mouse.ray.ray
      mouse.matrix.lookAt(tmpV.set(0, 0, 0), tmpT.copy(r.direction).negate(), UP).setPosition(r.origin)
    } else { mouse.down = mouse.pressed = mouse.released = false; downAt = null }
    for (const p of xr) {
      drain(p)
      const h = p.hand
      p.active = presenting && !!h?.connected
      if (!p.active) { p.down = p.squeeze = p.pressed = p.released = p.squeezed = false; continue }
      h.ray.updateMatrixWorld(true)
      p.ray.setFromXRController(h.ray)
      p.matrix.copy(h.ray.matrixWorld)
    }
  }

  return {
    update,
    list: () => [mouse, ...xr].filter((p) => p.active),
    all: () => [mouse, ...xr],
    get: (id) => (id === 'mouse' ? mouse : xr.find((p) => p.id === id) ?? null),
    ndc,
    // the editor turns the mouse pointer off while a DOM panel has the cursor
    setMouseEnabled (v) { mouseEnabled = !!v },
    dispose () { for (const off of offs.splice(0)) off() },
  }
}
