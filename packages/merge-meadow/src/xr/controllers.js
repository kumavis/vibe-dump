// XR controllers: procedural meshes (no XRControllerModelFactory: it fetches GLB
// profiles from jsDelivr at runtime, 196 KB to 3.9 MB each) and the gamepad
// mapping verified under IWER for Quest Touch (xr-standard: thumbstick axes 2/3,
// buttons 0 trigger, 1 squeeze, 3 stick press, 4/5 A-B or X-Y).
//   left stick: smooth move        right stick X: 30° snap turn (hysteresis 0.7 / 0.3)
//   X/Y or A/B: onMenu             select/squeeze: forwarded (pointers handle picking)
import * as THREE from 'three'
import { moveVector } from './rig.js'

const COLORS = { left: '#4f86c6', right: '#d9734e', none: '#8a96a3' }

export function makeControllers (rig, { onMove, onSnapTurn, onSelect, onSqueeze, onMenu, deadzone = 0.15, snapAngle = Math.PI / 6, speed = 3 } = {}) {
  const shared = {
    body: new THREE.CylinderGeometry(0.018, 0.024, 0.11, 12).rotateX(Math.PI / 2),
    ring: new THREE.TorusGeometry(0.035, 0.006, 6, 18),
    line: new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -1)]),
    dot: new THREE.SphereGeometry(0.012, 8, 6),
    joint: new THREE.SphereGeometry(0.008, 6, 4),
    lineMat: new THREE.LineBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.75 }),
    dotMat: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
    jointMat: new THREE.MeshStandardMaterial({ color: '#e8c4a8', roughness: 0.7 }),
    mats: Object.fromEntries(Object.entries(COLORS).map(([k, c]) => [k, new THREE.MeshStandardMaterial({ color: c, roughness: 0.5 })])),
  }
  const offs = []
  const state = rig.hands.map(() => ({ snapReady: true, buttons: [] }))

  for (const h of rig.hands) {
    const mark = (o) => { o.userData.noPick = true; return o }
    const body = mark(new THREE.Mesh(shared.body, shared.mats.none)); body.name = 'controller-body'
    const ring = mark(new THREE.Mesh(shared.ring, shared.mats.none)); ring.position.set(0, 0.012, -0.05); ring.rotation.x = Math.PI / 2.6
    h.grip.add(body, ring)
    const line = mark(new THREE.Line(shared.line, shared.lineMat)); line.name = 'ray-line'; line.scale.z = 5
    const dot = mark(new THREE.Mesh(shared.dot, shared.dotMat)); dot.position.z = -5
    h.ray.add(line, dot)
    h.line = line; h.dot = dot; h.body = body; h.ringMesh = ring
    const recolor = () => { const m = shared.mats[h.handedness] ?? shared.mats.none; body.material = m; ring.material = m }
    const vis = () => { const ctl = h.connected && !h.isHand; body.visible = ring.visible = ctl; line.visible = dot.visible = h.connected }
    const conn = () => { recolor(); vis() }
    const disc = () => { vis() }
    h.ray.addEventListener('connected', conn); h.ray.addEventListener('disconnected', disc)
    offs.push(() => { h.ray.removeEventListener('connected', conn); h.ray.removeEventListener('disconnected', disc) })
    for (const [type, fn, phase] of [['selectstart', onSelect, 'start'], ['selectend', onSelect, 'end'], ['squeezestart', onSqueeze, 'start'], ['squeezeend', onSqueeze, 'end']]) {
      if (!fn) continue
      const l = () => fn(h, phase)
      h.ray.addEventListener(type, l); offs.push(() => h.ray.removeEventListener(type, l))
    }
    vis()
  }

  // tracked hands: a small sphere on every joint three has created so far
  function dressHands () {
    for (const h of rig.hands) {
      const joints = h.hand?.joints
      if (!joints) continue
      for (const j of Object.values(joints)) {
        if (j.userData.dressed) continue
        j.userData.dressed = true
        const m = new THREE.Mesh(shared.joint, shared.jointMat); m.userData.noPick = true
        j.add(m)
      }
    }
  }

  const ax = (v) => (Math.abs(v) > deadzone ? v : 0)
  // last world-space move ([x, z], |m| <= 1) from the left stick: a mounted rider's steering input
  const move = [0, 0]

  function update (dt) {
    move[0] = move[1] = 0
    if (!rig.presenting) return
    dressHands()
    for (const h of rig.hands) {
      const gp = h.gamepad
      if (!h.connected || !gp) continue
      const st = state[h.index]
      const axes = gp.axes ?? []
      const x = axes.length >= 4 ? axes[2] : axes[0] ?? 0
      const y = axes.length >= 4 ? axes[3] : axes[1] ?? 0
      if (h.handedness === 'left') {
        const f = -ax(y); const s = ax(x)
        if (f || s) {
          const [mx, mz] = moveVector(rig.headYaw(), f, s); move[0] = mx; move[1] = mz
          if (onMove) onMove(f, s, dt, h); else rig.move(f, s, dt, speed)
        }
      } else if (h.handedness === 'right') {
        if (Math.abs(x) > 0.7 && st.snapReady) {
          st.snapReady = false
          const a = -Math.sign(x) * snapAngle
          if (onSnapTurn) onSnapTurn(a, h); else rig.snapTurn(a)
        }
        if (Math.abs(x) < 0.3) st.snapReady = true
      }
      const b = gp.buttons ?? []
      for (const i of [4, 5]) {
        const p = !!b[i]?.pressed
        if (p && !st.buttons[i]) onMenu?.(h, i)
        st.buttons[i] = p
      }
    }
  }

  return {
    update,
    move,
    // pointer lines end where they hit something (5 m when they hit nothing)
    setRayLength (i, d) { const h = rig.hands[i]; if (!h?.line) return; const L = Math.max(0.05, Math.min(30, d ?? 5)); h.line.scale.z = L; h.dot.position.z = -L },
    dispose () {
      for (const off of offs.splice(0)) off()
      for (const g of [shared.body, shared.ring, shared.line, shared.dot, shared.joint]) g.dispose()
      for (const m of [shared.lineMat, shared.dotMat, shared.jointMat, ...Object.values(shared.mats)]) m.dispose()
    },
  }
}
