// The only module that creates three.js objects for entities (design §8).
// One root Group per entity, posed from `transform` (lifecycle order -100) and
// then, every frame, from the entity's live pose; one child per visual component
// (`representation`, `light`). The world calls these handlers with the effective
// (preset + own + groups) component data; this module never reads the doc for
// entity data. `animation` has no handler: frame() reads it with live.anim, so
// editing a clip mapping never rebuilds a look.
import * as THREE from 'three'
import { KINDS, PLACEHOLDER, onKindRegistered } from './kinds/index.js'
import { lightHandler } from './light.js'

const DEG = Math.PI / 180
const SNAP = 4 // m between two ticks: a teleport, not motion; do not tween across it
const VISUAL = { representation: null, light: lightHandler } // representation: KINDS[data.kind]

const copy = (v) => (v == null || typeof v !== 'object' ? v : Array.isArray(v) ? v.map(copy) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])))
const fin = (v, d = 0) => (Number.isFinite(+v) && v !== null ? +v : d)
const v3 = (a, d) => (Array.isArray(a) && a.length === 3 ? [fin(a[0], d[0]), fin(a[1], d[1]), fin(a[2], d[2])] : [...d])
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))

export function normTransform (t) {
  return { p: v3(t?.p, [0, 0, 0]), r: v3(t?.r, [0, 0, 0]), s: v3(t?.s, [1, 1, 1]) }
}

export function makeReconciler ({ world, scene, resources, plain = copy, tickHz = 30 } = {}) {
  const res = resources
  const recs = new Map() // id -> rec
  const assets = () => world.doc?.assets
  const offs = []
  let lastTick = -1
  let sinceTick = 0

  const ctxFor = (rec) => ({ res, entity: rec.e, assets, changed: () => { rec.boxDirty = true } })

  function ensure (e) {
    let rec = recs.get(e.id)
    if (rec) { rec.e = e; return rec }
    const root = new THREE.Group()
    root.name = 'entity:' + e.id; root.userData.entity = e.id
    scene.add(root)
    rec = { id: e.id, e, root, t: null, visuals: new Map(), anchors: new Map(), prevP: null, curP: null, prevYaw: 0, curYaw: 0, preview: null, box: new THREE.Box3(), boxDirty: true, clipsRef: undefined, clips: null }
    recs.set(e.id, rec)
    return rec
  }

  // ---- visual children
  const kindFor = (data) => KINDS[String(data?.kind)] ?? PLACEHOLDER
  function mount (rec, comp, data) {
    const h = comp === 'representation' ? kindFor(data) : VISUAL[comp]
    let impl = h; let obj
    try { obj = h.create(data, ctxFor(rec)) } catch (err) {
      // a kind that throws (say, one an agent registered) shows as a placeholder
      console.error(`[render] ${comp} create failed for ${rec.id}:`, err)
      impl = PLACEHOLDER; obj = PLACEHOLDER.create(data, ctxFor(rec)); obj.userData.error = String(err?.message ?? err)
    }
    obj.userData.component = comp
    if (comp === 'representation') obj.userData.kind = String(data?.kind ?? '')
    rec.root.add(obj)
    rec.visuals.set(comp, { obj, data, impl })
    rec.boxDirty = true
  }
  function unmount (rec, comp) {
    const v = rec.visuals.get(comp); if (!v) return
    try { v.impl.dispose(v.obj, ctxFor(rec)) } catch (err) { console.error(`[render] ${comp} dispose failed for ${rec.id}:`, err) }
    res.releaseAll(v.obj)
    v.obj.removeFromParent()
    rec.visuals.delete(comp); rec.boxDirty = true
  }
  function change (rec, comp, data) {
    const v = rec.visuals.get(comp)
    if (!v) return mount(rec, comp, data)
    const sameKind = comp !== 'representation' || (kindFor(data) === v.impl && String(data?.kind ?? '') === v.obj.userData.kind)
    let ok = false
    if (sameKind) {
      try { ok = v.impl.update(v.obj, data, v.data, ctxFor(rec)) !== false } catch (err) { console.error(`[render] ${comp} update failed for ${rec.id}:`, err) }
    }
    if (ok) { v.data = data; rec.boxDirty = true; return }
    unmount(rec, comp); mount(rec, comp, data)
  }

  function destroy (rec) {
    for (const comp of [...rec.visuals.keys()]) unmount(rec, comp)
    // anchors may carry things that are not ours (a player rig riding this
    // entity): keep them in the world where they are
    for (const a of rec.anchors.values()) for (const ch of [...a.children]) scene.attach(ch)
    // orphaned child entities go to the scene root rather than vanishing
    for (const ch of [...rec.root.children]) if (ch.userData.entity) scene.add(ch)
    rec.root.removeFromParent()
    recs.delete(rec.id)
  }
  const keeps = (e, except) => ['transform', 'representation', 'light'].some((n) => n !== except && n in e.c)
  const gone = (e, comp) => { const rec = recs.get(e.id); if (rec && !keeps(e, comp)) destroy(rec) }

  // ---- lifecycle handlers on the world
  offs.push(world.registerComponent('transform', {
    order: -100,
    add: (e, d) => { ensure(e).t = normTransform(plain(d)) },
    change: (e, d) => { ensure(e).t = normTransform(plain(d)) },
    remove: (e) => { const rec = recs.get(e.id); if (rec) rec.t = null; gone(e, 'transform') },
  }))
  for (const comp of Object.keys(VISUAL)) {
    offs.push(world.registerComponent(comp, {
      order: 10,
      add: (e, d) => mount(ensure(e), comp, plain(d)),
      change: (e, d) => change(ensure(e), comp, plain(d)),
      remove: (e) => { const rec = recs.get(e.id); if (rec) unmount(rec, comp); gone(e, comp) },
    }))
  }
  // a kind registered after its entities were built: upgrade their placeholders
  offs.push(onKindRegistered((name) => {
    for (const rec of recs.values()) {
      const v = rec.visuals.get('representation')
      if (v && v.impl === PLACEHOLDER && v.obj.userData.kind === name) { const d = v.data; unmount(rec, 'representation'); mount(rec, 'representation', d) }
    }
  }))

  // ---- per frame
  function syncParent (rec) {
    const pid = rec.e.parent
    let want = (pid && recs.get(pid)?.root) || scene
    if (want !== scene) for (let o = want; o; o = o.parent) if (o === rec.root) { want = scene; break } // no cycles
    if (rec.root.parent !== want) want.add(rec.root)
  }

  function pose (rec, fresh, alpha, direct) {
    const t = rec.t ?? normTransform(null)
    const L = rec.e.live
    const root = rec.root
    let x, y, z, yaw
    if (rec.preview) {
      ;[x, y, z] = rec.preview.p
      yaw = Number.isFinite(rec.preview.yaw) ? rec.preview.yaw : rec.curYaw
      rec.prevP = rec.curP = [x, y, z]; rec.prevYaw = rec.curYaw = yaw
    } else if (L && Array.isArray(L.p) && L.p.length === 3) {
      if (fresh || direct || !rec.curP) {
        rec.prevP = rec.curP ?? [L.p[0], L.p[1], L.p[2]]
        rec.prevYaw = rec.curP ? rec.curYaw : (Number.isFinite(L.yaw) ? L.yaw : t.r[1] * DEG)
        rec.curP = [fin(L.p[0]), fin(L.p[1]), fin(L.p[2])]
        rec.curYaw = Number.isFinite(L.yaw) ? L.yaw : t.r[1] * DEG
        const a = rec.prevP; const b = rec.curP
        if (direct || Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]) > SNAP) { rec.prevP = b; rec.prevYaw = rec.curYaw }
      }
      // render one tick behind the sim, tweening between its last two states
      const k = Math.min(1, Math.max(0, alpha))
      const a = rec.prevP; const b = rec.curP
      x = a[0] + (b[0] - a[0]) * k; y = a[1] + (b[1] - a[1]) * k; z = a[2] + (b[2] - a[2]) * k
      yaw = rec.prevYaw + wrap(rec.curYaw - rec.prevYaw) * k
    } else {
      ;[x, y, z] = t.p; yaw = t.r[1] * DEG
    }
    root.position.set(x, y, z)
    root.rotation.set(t.r[0] * DEG, yaw, t.r[2] * DEG)
    root.scale.set(t.s[0], t.s[1], t.s[2])
  }

  function animate (rec, dt) {
    const v = rec.visuals.get('representation')
    if (!v?.impl.animate) return
    const ref = rec.e.c.animation?.clips
    if (ref !== rec.clipsRef) { rec.clipsRef = ref; rec.clips = ref ? plain(ref) : null }
    try { v.impl.animate(v.obj, String(rec.e.live?.anim ?? 'idle'), rec.clips, dt) } catch (err) {
      if (!rec.animErr) console.error(`[render] animate failed for ${rec.id}:`, err)
      rec.animErr = true
    }
  }

  // ---- anchors (design §16.14): named points a seat or a camera attaches to
  const mLocal = new THREE.Matrix4(); const mTmp = new THREE.Matrix4()
  const vTmp = new THREE.Vector3(); const qTmp = new THREE.Quaternion(); const sTmp = new THREE.Vector3()
  function kindAnchor (rec, name) {
    const v = rec.visuals.get('representation')
    const a = v?.impl.anchors?.(v.obj)?.[name]
    return a?.isObject3D ? a : null
  }
  function bounds (rec) {
    if (!rec.boxDirty) return rec.box
    rec.boxDirty = false
    const box = rec.box.makeEmpty()
    rec.root.updateMatrixWorld(true)
    const inv = mTmp.copy(rec.root.matrixWorld).invert()
    const b = new THREE.Box3()
    for (const { obj } of rec.visuals.values()) {
      obj.traverse((o) => {
        if (o.userData.noPick) return
        if (o.isSprite) b.set(vTmp.set(-0.5, 0, -0.5), sTmp.set(0.5, 1, 0.5))
        else if (o.geometry) { if (!o.geometry.boundingBox) o.geometry.computeBoundingBox(); b.copy(o.geometry.boundingBox) } else return
        box.union(b.applyMatrix4(mLocal.multiplyMatrices(inv, o.matrixWorld)))
      })
      if (obj.isLight && box.isEmpty()) box.setFromCenterAndSize(obj.position, vTmp.set(0.6, 0.6, 0.6))
    }
    return box
  }
  // anchor position in root space: the kind's named anchor, a mount seat offset, or the top of the bounds
  function anchorLocal (rec, name, out) {
    const a = kindAnchor(rec, name)
    if (a) {
      mLocal.identity()
      for (let o = a; o && o !== rec.root; o = o.parent) { o.updateMatrix(); mLocal.premultiply(o.matrix) }
      return out.setFromMatrixPosition(mLocal)
    }
    if (name === 'seat') {
      const seats = rec.e.c.mount?.seats
      const seat = Array.isArray(seats) ? (seats.find((s) => String(s?.anchor ?? '') === name) ?? seats[0]) : null
      if (Array.isArray(seat?.offset)) { const o = v3(plain(seat.offset), [0, 1.5, 0]); return out.set(o[0], o[1], o[2]) }
    }
    const box = bounds(rec)
    if (box.isEmpty()) return out.set(0, 1.5, 0)
    return out.set((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2)
  }
  // World position of a named anchor. For a top-level entity with a live pose it
  // is taken from the SIM pose (live.p, live.yaw), not the rendered root: the
  // mount system seats riders with it during the tick, and the rendered root is
  // a tick behind (interpolation), which would make a rider trail a galloping
  // horse by a body length.
  const eTmp = new THREE.Euler()
  function anchor (id, name, out = new THREE.Vector3()) {
    const rec = recs.get(id); if (!rec) return null
    anchorLocal(rec, String(name), out)
    const L = rec.e.live
    if (!rec.e.parent && Array.isArray(L?.p) && L.p.length === 3) {
      const t = rec.t ?? normTransform(null)
      const yaw = Number.isFinite(L.yaw) ? L.yaw : t.r[1] * DEG
      mLocal.compose(vTmp.set(fin(L.p[0]), fin(L.p[1]), fin(L.p[2])), qTmp.setFromEuler(eTmp.set(t.r[0] * DEG, yaw, t.r[2] * DEG)), sTmp.set(t.s[0], t.s[1], t.s[2]))
      return out.applyMatrix4(mLocal)
    }
    rec.root.updateWorldMatrix(true, false)
    return out.applyMatrix4(rec.root.matrixWorld)
  }
  // A stable carrier owned by the reconciler, so a rider stays seated when the
  // look under it is swapped: each frame it copies the kind anchor's pose (or the
  // fallback) and undoes the root's scale, so a rig never inherits a giant's size.
  function anchorObject (id, name) {
    const rec = recs.get(id); if (!rec) return null
    let g = rec.anchors.get(name)
    if (!g) {
      g = new THREE.Group(); g.name = 'anchor:' + name; g.userData.anchor = name; g.userData.noPick = true
      rec.root.add(g); rec.anchors.set(name, g)
      placeAnchor(rec, name, g)
    }
    return g
  }
  function placeAnchor (rec, name, g) {
    const a = kindAnchor(rec, name)
    if (a) {
      mLocal.identity()
      for (let o = a; o && o !== rec.root; o = o.parent) { o.updateMatrix(); mLocal.premultiply(o.matrix) }
      mLocal.decompose(g.position, qTmp, sTmp)
      g.quaternion.copy(qTmp)
    } else { anchorLocal(rec, name, g.position); g.quaternion.identity() }
    const s = rec.root.scale
    g.scale.set(s.x ? 1 / s.x : 1, s.y ? 1 / s.y : 1, s.z ? 1 / s.z : 1)
  }

  function frame (dt = 0, alpha = 1) {
    const fresh = world.tickCount !== lastTick
    if (fresh) { lastTick = world.tickCount; sinceTick = 0 } else sinceTick += dt
    // a world that is not ticking (paused, or a harness) is shown as-is, untweened
    const direct = sinceTick > 2.5 / tickHz
    for (const rec of recs.values()) syncParent(rec)
    for (const rec of recs.values()) {
      pose(rec, fresh, direct ? 1 : alpha, direct)
      animate(rec, dt)
      for (const [name, g] of rec.anchors) placeAnchor(rec, name, g)
    }
  }

  // ---- picking: a ray against each root's local bounds first, then the real
  // meshes of the few candidates (skinned meshes and sprites trust their bounds:
  // a SkinnedMesh raycast skins every vertex on the CPU)
  const rayLocal = new THREE.Ray(); const hitLocal = new THREE.Vector3()
  function pick (raycaster) {
    const cands = []
    const ray = raycaster.ray
    for (const rec of recs.values()) {
      if (!rec.visuals.size || !rec.root.visible) continue
      const box = bounds(rec)
      if (box.isEmpty()) continue
      mTmp.copy(rec.root.matrixWorld).invert()
      rayLocal.copy(ray).applyMatrix4(mTmp)
      if (!rayLocal.intersectBox(box, hitLocal)) continue
      const point = hitLocal.clone().applyMatrix4(rec.root.matrixWorld)
      const distance = point.distanceTo(ray.origin)
      if (distance < raycaster.near || distance > raycaster.far) continue
      cands.push({ rec, distance, point })
    }
    cands.sort((a, b) => a.distance - b.distance)
    for (const c of cands) {
      let best = null
      for (const { obj } of c.rec.visuals.values()) {
        if (obj.userData.noPick) continue
        if (obj.userData.pick !== 'mesh') { if (!best || c.distance < best.distance) best = { distance: c.distance, point: c.point, object: obj }; continue }
        const hits = raycaster.intersectObject(obj, true).filter((h) => !h.object.userData.noPick)
        if (hits[0] && (!best || hits[0].distance < best.distance)) best = hits[0]
      }
      if (best) return { id: c.rec.id, point: best.point, object: best.object, distance: best.distance }
    }
    return null
  }

  function idOf (object3d) {
    for (let o = object3d; o; o = o.parent) if (o.userData?.entity) return o.userData.entity
    return null
  }

  return {
    scene,
    objectFor: (id) => recs.get(id)?.root ?? null,
    visualFor: (id, comp = 'representation') => recs.get(id)?.visuals.get(comp)?.obj ?? null,
    idOf,
    ids: () => [...recs.keys()],
    frame,
    pick,
    anchor,
    anchorArray: (id, name) => { const v = anchor(id, name); return v ? [v.x, v.y, v.z] : null },
    anchorObject,
    bounds: (id) => { const rec = recs.get(id); return rec ? bounds(rec).clone() : null },
    // hide an entity's root (your own player avatar) without touching its components; unpickable while hidden
    setVisible (id, v) { const rec = recs.get(id); if (rec) rec.root.visible = !!v },
    // interaction's drag preview: shown immediately, untweened, until cleared
    preview (id, p) { const rec = recs.get(id); if (!rec) return; rec.preview = p ? { p: [...p.p], yaw: p.yaw } : null },
    stats () {
      let visuals = 0; let placeholders = 0
      for (const rec of recs.values()) for (const v of rec.visuals.values()) { visuals++; if (v.impl === PLACEHOLDER) placeholders++ }
      return { entities: recs.size, visuals, placeholders, resources: res.stats() }
    },
    dispose () {
      for (const off of offs.splice(0)) off()
      for (const rec of [...recs.values()]) destroy(rec)
    },
  }
}
