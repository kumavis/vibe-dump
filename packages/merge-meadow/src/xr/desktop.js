// Desktop camera and keys (design §9). Two modes, one rig:
//   editor: free cursor; right-drag looks, WASD/arrows move, scroll dollies along
//           the view (so you can rise above the meadow), click selects
//   play:   pointer lock; the mouse looks, the reticle at screen centre picks
// Keys: G grab the selection, Esc abort a grab (or leave play), Delete/Backspace
// onDelete, F focus the selection, E ride/dismount, P toggle play.
// Keys typed into the editor's inputs never reach here.
import * as THREE from 'three'
import { moveVector } from './rig.js'

const isTyping = (t) => !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName ?? ''))
const tmpV = new THREE.Vector3(); const tmpD = new THREE.Vector3()

export function makeDesktopControls ({ rig, dom, interaction, reconciler, mode = 'editor', speed = 4, lookSpeed = 0.0025, onDelete, onMode, keyTarget = globalThis.window, doc = globalThis.document } = {}) {
  const keys = new Set()
  let looking = false
  let current = mode
  const offs = []
  const on = (t, type, fn, opt) => { if (!t?.addEventListener) return; t.addEventListener(type, fn, opt); offs.push(() => t.removeEventListener(type, fn, opt)) }
  // the latest world-space [x, z] move: a mounted rider's steering input
  const move = [0, 0]

  function setMode (m) {
    if (m === current) return
    current = m
    if (m === 'play') { if (!rig.mountedOn) rig.root.position.y = 0; dom.requestPointerLock?.() } else if (doc?.pointerLockElement === dom) doc.exitPointerLock?.()
    try { onMode?.(current) } catch (e) { console.error('[desktop] onMode', e) }
  }

  function focus (id) {
    const obj = id && reconciler?.objectFor(id)
    if (!obj || rig.mountedOn) return false
    const target = obj.getWorldPosition(tmpV)
    const b = reconciler.bounds?.(id)
    const size = b && !b.isEmpty() ? Math.max(1, b.max.y - b.min.y, b.max.x - b.min.x) : 1.5
    const yaw = rig.headYaw()
    const dist = 2.5 + size * 2
    rig.root.position.set(target.x + Math.sin(yaw) * dist, rig.root.position.y, target.z + Math.cos(yaw) * dist)
    return true
  }

  on(keyTarget, 'keydown', (e) => {
    if (isTyping(e.target) || e.ctrlKey || e.metaKey || e.altKey) return
    keys.add(e.code)
    const sel = interaction?.selected
    switch (e.code) {
      case 'KeyG': if (sel && !interaction.grabbing) interaction.grab(sel, 'mouse', { sticky: true }); break
      case 'Escape': if (interaction?.grabbing) interaction.abort(); else if (current === 'play') setMode('editor'); break
      case 'Delete': case 'Backspace': if (sel) { e.preventDefault(); onDelete?.(sel) } break
      case 'KeyF': focus(sel); break
      case 'KeyE': interaction?.toggleRide(rig.head.getWorldPosition(new THREE.Vector3()), sel); break
      case 'KeyP': setMode(current === 'play' ? 'editor' : 'play'); break
    }
  })
  on(keyTarget, 'keyup', (e) => keys.delete(e.code))
  on(keyTarget, 'blur', () => { keys.clear(); looking = false })
  on(dom, 'contextmenu', (e) => e.preventDefault())
  on(dom, 'pointerdown', (e) => { if (e.button === 2) { looking = true; dom.setPointerCapture?.(e.pointerId) } })
  on(keyTarget, 'pointerup', (e) => { if (e.button === 2) looking = false })
  on(keyTarget, 'pointermove', (e) => {
    if (rig.presenting) return
    const locked = doc?.pointerLockElement === dom
    if (locked || looking) rig.look(-e.movementX * lookSpeed, -e.movementY * lookSpeed)
  })
  on(dom, 'wheel', (e) => {
    if (rig.presenting || current !== 'editor' || rig.mountedOn) return
    e.preventDefault()
    // dolly along the view: wheel up flies toward what you look at
    rig.head.getWorldDirection(tmpD)
    const step = -Math.sign(e.deltaY) * Math.min(4, Math.abs(e.deltaY) * 0.01 + 0.5)
    rig.root.position.addScaledVector(tmpD, step)
    rig.root.position.y = Math.max(0, Math.min(80, rig.root.position.y))
  }, { passive: false })
  on(doc, 'pointerlockchange', () => { if (doc.pointerLockElement !== dom && current === 'play') setMode('editor') })

  function update (dt) {
    move[0] = move[1] = 0
    if (rig.presenting) return
    const k = (...c) => c.some((x) => keys.has(x))
    const f = (k('KeyW', 'ArrowUp') ? 1 : 0) - (k('KeyS', 'ArrowDown') ? 1 : 0)
    const s = (k('KeyD', 'ArrowRight') ? 1 : 0) - (k('KeyA', 'ArrowLeft') ? 1 : 0)
    if (!f && !s) return
    const [x, z] = moveVector(rig.headYaw(), f, s)
    const n = Math.hypot(x, z) || 1
    move[0] = x / n; move[1] = z / n
    rig.move(f, s, dt, (k('ShiftLeft', 'ShiftRight') ? 2.5 : 1) * speed)
  }

  return {
    update,
    move,
    get mode () { return current },
    setMode,
    focus,
    keys,
    dispose () { for (const off of offs.splice(0)) off(); if (doc?.pointerLockElement === dom) doc.exitPointerLock?.() },
  }
}
