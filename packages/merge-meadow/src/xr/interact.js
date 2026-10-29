// One interaction system for every Pointer (mouse, xr-0, xr-1): hover, select,
// grab and drag, ride, and (in XR) teleport and spawn from a wrist palette.
// Drags preview locally every frame and reach the doc only as 'transform' ops:
// at <= commitHz while held and once on release, together with the ownership
// unpin, because CRDT history is forever (a 90 Hz drag would be 90 changes/s).
//   desktop: press a selected entity and drag -> ground-plane drag; G -> sticky
//            grab until the next click (Esc aborts); press elsewhere -> select
//   XR:      trigger on an entity -> select + grab with the controller's pose
//            (twist to turn it); trigger on the ground -> teleport; squeeze near
//            a mount -> ride (squeeze again to get off)
import * as THREE from 'three'

const DEG = 180 / Math.PI
const r3 = (v) => Math.round(v * 1000) / 1000
const r1 = (v) => Math.round(v * 10) / 10
const UP = new THREE.Vector3(0, 1, 0)
const tmpV = new THREE.Vector3(); const tmpV2 = new THREE.Vector3(); const tmpQ = new THREE.Quaternion(); const tmpE = new THREE.Euler(); const tmpM = new THREE.Matrix4()
const worldYaw = (o) => tmpE.setFromQuaternion(o.getWorldQuaternion(tmpQ), 'YXZ').y

function ringMesh (color, opacity) {
  const m = new THREE.Mesh(new THREE.RingGeometry(0.86, 1, 48).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color, transparent: true, opacity, depthWrite: false }))
  m.renderOrder = 2; m.visible = false; m.userData.noPick = true
  return m
}

export function makeInteraction ({
  world, reconciler, pointers, rig, commit, canGrab, onSelect, onHover, onMount, onDismount, onSpawn,
  ownership, pinOps = ownership?.pinOps, unpinOps = ownership?.unpinOps, pinnedToMe = ownership?.pinnedToMe, pinWindowS = 1,
  scene = reconciler.scene, controllers, resources, palette = [],
  ground = () => 0, commitHz = 10, dragThresholdPx = 4, mountReach = 2.5, teleportRange = 40,
} = {}) {
  // local entities (players fed by presence) are not in the doc: nothing to write
  const ownCheck = canGrab ?? ownership?.canGrab ?? (() => true)
  const grabCheck = (id) => (world.get(id)?.local ? 'not editable' : ownCheck(id))
  // a commit that throws (validation, a vanished entity) must not stop the frame loop
  const send = (ops, meta) => { try { return commit(ops, meta) } catch (e) { console.error('[interact] commit failed:', e); return null } }
  let time = 0
  let selected = null
  let hovered = null
  let hoverReason = null
  let refused = null // { id, reason, t }
  let grab = null
  let pending = null // mouse pressed on the selected entity, waiting to become a drag
  let mounted = null

  const hoverRing = ringMesh('#ffffff', 0.55); const selRing = ringMesh('#ffd54a', 0.9)
  scene.add(hoverRing, selRing)

  // ---- XR palette: three looks on the left wrist, picked with the right trigger
  const paletteGroup = new THREE.Group(); paletteGroup.name = 'palette'; paletteGroup.visible = false
  const paletteItems = []
  if (resources && palette.length) {
    palette.slice(0, 6).forEach((item, i) => {
      const key = 'spritemat:palette:' + String(item.image)
      const tk = 'tex:' + String(item.image)
      const mat = resources.acquire(key, () => { const m = new THREE.SpriteMaterial({ map: resources.acquire(tk, () => resources.imageTexture(item.image)), depthTest: false }); m.userData.texKey = tk; return m }, (m) => { m.dispose(); resources.release(tk) })
      const s = new THREE.Sprite(mat); s.scale.setScalar(0.07); s.center.set(0.5, 0)
      s.position.set((i - (Math.min(palette.length, 6) - 1) / 2) * 0.08, 0.06, -0.02); s.renderOrder = 3
      s.userData.palette = item; s.userData.noPick = true; s.userData.matKey = key
      paletteGroup.add(s); paletteItems.push(s)
    })
  }

  const exists = (id) => !!(id && reconciler.objectFor(id) && world.get(id))
  const entityName = (id) => world.get(id)?.name || id

  function select (id, info = {}) {
    const next = exists(id) ? id : null
    if (next === selected && !info.refused) return
    selected = next
    try { onSelect?.(selected, info) } catch (e) { console.error('[interact] onSelect', e) }
  }

  function refuse (id, reason) {
    refused = { id, reason, t: time }
    try { onSelect?.(id, { refused: reason }) } catch (e) { console.error('[interact] onSelect', e) }
  }

  // ---- grab / drag / release
  function grabEntity (id, pointerId = 'mouse', { sticky = false } = {}) {
    if (!exists(id)) return false
    const p = pointers.get(pointerId)
    if (!p) return false
    const ok = grabCheck(id)
    if (ok !== true) { refuse(id, String(ok)); return false }
    if (grab) release()
    const obj = reconciler.objectFor(id)
    obj.updateMatrixWorld(true)
    const start = obj.getWorldPosition(new THREE.Vector3())
    const g = { id, pointer: p, sticky, mode: p.kind === 'xr' ? 'pose' : 'plane', start, startYaw: worldYaw(obj), planeY: start.y, offset: new THREE.Vector3(), offsetM: new THREE.Matrix4(), lastCommit: time, sent: null, now: null }
    if (g.mode === 'pose') g.offsetM.copy(p.matrix).invert().multiply(obj.matrixWorld)
    else {
      const hit = planeHit(p, g.planeY)
      if (hit) g.offset.copy(start).sub(hit)
    }
    const e = world.get(id)
    g.startLive = e?.live?.p ? { p: [...e.live.p], yaw: e.live.yaw } : null
    // the pin is a compare-and-set that lands with the next tick's flush; g.pinned
    // turns true once this peer sees it, and from then on a drag whose pin is no
    // longer mine aborts and writes nothing (design §4.1, §16.4)
    if (pinOps) { const ops = pinOps(id); if (ops?.length) { send(ops, { message: `grab ${entityName(id)}` }); g.pinRequested = true; g.pinAt = time; g.pinned = false } }
    grab = g
    select(id)
    return true
  }

  const plane = new THREE.Plane(); const hitP = new THREE.Vector3()
  function planeHit (p, y) {
    plane.set(UP, -y)
    return p.ray.ray.intersectPlane(plane, hitP) ? hitP.clone() : null
  }

  // the dragged pose: root-parent-local position + yaw (radians), or null if the ray misses
  function dragPose (g) {
    const obj = reconciler.objectFor(g.id)
    if (!obj) return null
    let world3; let yaw = null
    if (g.mode === 'pose') {
      tmpM.multiplyMatrices(g.pointer.matrix, g.offsetM)
      world3 = tmpV.setFromMatrixPosition(tmpM)
      yaw = tmpE.setFromRotationMatrix(tmpM, 'YXZ').y
    } else {
      const h = planeHit(g.pointer, g.planeY)
      if (!h || h.distanceTo(g.pointer.ray.ray.origin) > 200) return null
      world3 = tmpV.copy(h).add(g.offset)
    }
    world3.y = Math.max(world3.y, Number(ground(world3.x, world3.z)) || 0)
    const parent = obj.parent
    const local = parent ? parent.worldToLocal(tmpV2.copy(world3)) : tmpV2.copy(world3)
    if (yaw != null && parent) yaw -= worldYaw(parent)
    return { p: [local.x, local.y, local.z], yaw }
  }

  function transformOp (id, pose) {
    const op = { op: 'transform', id, p: pose.p.map(r3) }
    if (pose.yaw != null) op.yaw = r1(pose.yaw * DEG)
    return op
  }

  // 'ok' | 'pending' (the pin has not landed yet) | 'lost' (it landed and is no
  // longer mine, or it never landed within pinWindowS)
  function pinState (g) {
    if (!g.pinRequested || !pinnedToMe) return 'ok'
    if (pinnedToMe(g.id)) { g.pinned = true; return 'ok' }
    return !g.pinned && time - g.pinAt < pinWindowS ? 'pending' : 'lost'
  }
  function lose (g) {
    if (grab === g) grab = null
    pending = null
    abortGrab(g)
    const o = String(world.get(g.id)?.owner ?? '')
    refuse(g.id, o && o !== world.peerId ? 'held by ' + o : 'someone else grabbed it')
  }

  function applyDrag (g, dt) {
    const pin = pinState(g)
    if (pin === 'lost') { lose(g); return }
    const pose = dragPose(g)
    if (!pose) return
    g.now = pose
    reconciler.preview(g.id, pose)
    // an entity this peer simulates continues from where it was put down
    const e = world.get(g.id)
    if (e && world.owns(g.id) && e.live) {
      const l = e.live
      if (Array.isArray(l.p)) { l.p[0] = pose.p[0]; l.p[1] = pose.p[1]; l.p[2] = pose.p[2] } else l.p = [...pose.p]
      l.v = [0, 0, 0]; l.desired = [0, 0]
      if (pose.yaw != null) l.yaw = pose.yaw
      l.held = true // the built-in steer/integrate leave a held entity alone
    }
    if (pin === 'ok' && time - g.lastCommit >= 1 / commitHz) {
      const s = g.sent
      const moved = !s || Math.hypot(s.p[0] - pose.p[0], s.p[1] - pose.p[1], s.p[2] - pose.p[2]) > 0.01 || (pose.yaw != null && Math.abs((s.yaw ?? 0) - pose.yaw) > 0.01)
      if (moved) { send([transformOp(g.id, pose)], { message: `drag ${entityName(g.id)}` }); g.sent = { p: [...pose.p], yaw: pose.yaw } }
      g.lastCommit = time
    }
  }

  const pinnedElsewhere = (id) => {
    if (!pinOps) return false
    const o = String(world.get(id)?.owner ?? '')
    return o !== '' && o !== world.peerId
  }

  const unhold = (id) => { const l = world.get(id)?.live; if (l && l.held) delete l.held }

  function release () {
    const g = grab; if (!g) return null
    grab = null
    reconciler.preview(g.id, null)
    unhold(g.id)
    if (!exists(g.id)) return null
    // the pin went to someone else mid-drag: they are authoritative now; write nothing
    if (pinnedElsewhere(g.id)) { refuse(g.id, 'held by ' + String(world.get(g.id)?.owner)); return null }
    const pin = pinState(g)
    // a pin that landed and is no longer mine (lost a concurrent grab, even if the
    // winner has already let go): abort locally and write nothing
    if (pin === 'lost') { lose(g); return null }
    const pose = g.now ?? dragPose(g)
    if (!pose) { abortGrab(g); return null }
    const t = transformOp(g.id, pose)
    const tr = { p: t.p, ...(t.yaw != null ? { yaw: t.yaw } : {}) }
    let ops = unpinOps ? (unpinOps(g.id, { transform: tr }) ?? []) : []
    // a quick drag released before its pin landed: the pin is still queued ahead of
    // this commit, so clear it conditionally in the same change as the transform
    if (!ops.length && pin === 'pending') ops = [t, { op: 'unpin', id: g.id, ifOwner: String(world.peerId) }]
    if (!ops.length) ops = [t]
    send(ops, { message: `move ${entityName(g.id)}` })
    return ops
  }

  function abortGrab (g) {
    reconciler.preview(g.id, null)
    unhold(g.id)
    const e = world.get(g.id)
    if (e && g.startLive && world.owns(g.id)) { e.live.p = [...g.startLive.p]; e.live.yaw = g.startLive.yaw; e.live.v = [0, 0, 0] }
    if (unpinOps && !pinnedElsewhere(g.id)) { const ops = unpinOps(g.id) ?? []; if (ops.length) send(ops, { message: `drop ${entityName(g.id)}` }) }
  }
  function abort () { const g = grab; if (!g) return false; grab = null; pending = null; abortGrab(g); return true }

  // ---- riding
  function mount (id) {
    const e = world.get(id)
    if (!exists(id) || !e.c.mount || e.c.tags?.dead) return false
    const ok = grabCheck(id)
    if (ok !== true) { refuse(id, String(ok)); return false }
    if (mounted) dismount()
    const seats = e.c.mount.seats
    const name = String((Array.isArray(seats) && seats[0]?.anchor) || 'seat')
    if (!rig.mount(reconciler.anchorObject(id, name))) return false
    mounted = id
    try { onMount?.(id) } catch (err) { console.error('[interact] onMount', err) }
    return true
  }
  function dismount () {
    if (!mounted && !rig.mountedOn) return false
    const id = mounted
    rig.dismount(); mounted = null
    try { onDismount?.(id) } catch (err) { console.error('[interact] onDismount', err) }
    return true
  }
  // the closest living mount to a world point, within reach (+ its body radius)
  function nearestMount (from, reach = mountReach) {
    let best = null; let bd = Infinity
    for (const e of world.query('mount')) {
      if (e.c.tags?.dead) continue
      const obj = reconciler.objectFor(e.id); if (!obj) continue
      const d = obj.getWorldPosition(tmpV).setY(0).distanceTo(tmpV2.copy(from).setY(0)) - Number(e.c.body?.radius ?? 0.5)
      if (d < reach && d < bd) { bd = d; best = e.id }
    }
    return best
  }
  function toggleRide (fromPoint, preferId) {
    if (mounted || rig.mountedOn) return dismount()
    const id = (preferId && world.get(preferId)?.c.mount) ? preferId : nearestMount(fromPoint)
    return id ? mount(id) : false
  }

  // ---- the per-frame pass
  function update (dt = 0) {
    time += dt
    rig.update?.()
    if (mounted && !exists(mounted)) { const id = mounted; mounted = null; try { onDismount?.(id) } catch {} }
    pointers.update()
    if (grab && !exists(grab.id)) { reconciler.preview(grab.id, null); grab = null }
    if (selected && !exists(selected)) select(null)
    if (pending && !exists(pending.id)) pending = null

    const presenting = rig.presenting
    let hoverNow = null
    for (const p of pointers.list()) {
      const mine = grab && grab.pointer === p
      const hit = mine ? null : reconciler.pick(p.ray)
      if (p.kind === 'xr') {
        const pal = paletteGroup.visible && paletteItems.length ? p.ray.intersectObjects(paletteItems, false)[0] : null
        const len = pal ? pal.distance : hit ? hit.distance : (planeHit(p, 0)?.distanceTo(p.ray.ray.origin) ?? 5)
        controllers?.setRayLength(p.hand.index, Math.min(len, 5))
        if (!hoverNow && hit) hoverNow = hit.id
        if (mine) { if (p.released) release() } else if (p.pressed) {
          if (pal) onSpawn?.(pal.object.userData.palette, spawnPoint())
          else if (hit) { if (!grabEntity(hit.id, p.id)) select(hit.id) } else if (!rig.mountedOn) {
            const g = planeHit(p, 0)
            if (g && g.distanceTo(p.ray.ray.origin) < teleportRange) rig.teleport(g)
          }
        }
        if (p.squeezed) toggleRide(p.hand.grip.getWorldPosition(new THREE.Vector3()), hit?.id)
      } else {
        if (!hoverNow && hit) hoverNow = hit.id
        if (mine) {
          if (grab.sticky ? p.pressed : (p.released || !p.down)) release()
        } else {
          if (p.pressed) {
            if (hit && hit.id === selected) { pending = { id: hit.id, pointer: p } } else { pending = null; select(hit?.id ?? null) }
          }
          if (pending && pending.pointer === p) {
            if (p.down && p.dragPx > dragThresholdPx) { const id = pending.id; pending = null; grabEntity(id, p.id) } else if (!p.down) pending = null
          }
        }
      }
    }
    if (grab) applyDrag(grab, dt)

    // hover feedback, including "held by X" before anyone tries to grab
    if (hoverNow !== hovered) {
      hovered = hoverNow
      hoverReason = hovered ? grabCheck(hovered) : null
      if (hoverReason === true) hoverReason = null
      try { onHover?.(hovered, hoverReason ? { refused: String(hoverReason) } : {}) } catch (e) { console.error('[interact] onHover', e) }
    }
    placeRing(hoverRing, hovered && hovered !== selected ? hovered : null, hoverReason ? '#ff8a4d' : '#ffffff')
    const flash = refused && time - refused.t < 1.5 ? refused : null
    placeRing(selRing, flash?.id ?? selected, flash ? '#ff4d4d' : '#ffd54a')

    // the palette follows whichever controller is the left one
    const left = rig.hand?.('left')
    if (presenting && left && paletteItems.length) {
      if (paletteGroup.parent !== left.grip) left.grip.add(paletteGroup)
      paletteGroup.visible = true
    } else paletteGroup.visible = false
  }

  function spawnPoint () {
    const yaw = rig.headYaw()
    const h = rig.head.getWorldPosition(new THREE.Vector3())
    const x = h.x - Math.sin(yaw) * 2.5; const z = h.z - Math.cos(yaw) * 2.5
    return [r3(x), Number(ground(x, z)) || 0, r3(z)]
  }

  function placeRing (ring, id, color) {
    const obj = id && reconciler.objectFor(id)
    if (!obj) { ring.visible = false; return }
    const b = reconciler.bounds(id)
    obj.getWorldPosition(tmpV)
    const s = obj.getWorldScale(tmpV2)
    const r = b && !b.isEmpty() ? Math.max(b.max.x - b.min.x, b.max.z - b.min.z) * 0.5 * Math.max(s.x, s.z) + 0.25 : 0.8
    ring.position.set(tmpV.x, (Number(ground(tmpV.x, tmpV.z)) || 0) + 0.03, tmpV.z)
    ring.scale.setScalar(r)
    ring.material.color.set(color)
    ring.visible = true
  }

  return {
    update,
    get selected () { return selected },
    get hovered () { return hovered },
    get grabbing () { return grab ? grab.id : null },
    get mounted () { return mounted },
    palette: paletteGroup,
    select: (id) => select(id),
    grab: grabEntity,
    release,
    abort,
    mount,
    dismount,
    toggleRide,
    nearestMount,
    dispose () {
      abort()
      hoverRing.removeFromParent(); selRing.removeFromParent(); paletteGroup.removeFromParent()
      for (const r of [hoverRing, selRing]) { r.geometry.dispose(); r.material.dispose() }
      for (const s of paletteItems) resources.release(s.userData.matKey)
    },
  }
}
