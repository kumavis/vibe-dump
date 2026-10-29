// model: { url, scale } + the entity's `animation.clips` ({ idle: 'Idle', walk: 'Walk' }).
// One loaded glTF per URL (ref-counted as gltf:<url>); each entity gets a
// SkeletonUtils clone sharing geometry, materials and textures with the
// template, plus its own skeleton and mixer. GLTFLoader and SkeletonUtils are
// imported on the first model, so a world of emoji never downloads them.
// url is asset:<name> (resolved through doc.assets) or https; see resolveUrl.
import * as THREE from 'three'
import { makeAnimator } from '../animation.js'
import { gltfKey, resolveUrl, normColor, geoKey, shapeGeo } from '../resources.js'
import { kindProp, defaultsOf, clamp } from './common.js'

const schema = {
  type: 'object',
  properties: {
    kind: kindProp('model'),
    url: { type: 'string', title: 'glTF url (asset:… or https://…)', default: '', 'x-immutable': true },
    scale: { type: 'number', minimum: 0.01, maximum: 100, step: 0.01, title: 'scale', default: 1 },
  },
}

export const modelStats = { loads: 0, loadMs: [], errors: 0 }
let deps = null
function loadDeps () {
  deps ||= Promise.all([import('three/addons/loaders/GLTFLoader.js'), import('three/addons/utils/SkeletonUtils.js')])
    .then(([L, S]) => ({ loader: new L.GLTFLoader(), clone: S.clone }))
  return deps
}
function load (url) {
  const t0 = globalThis.performance?.now() ?? 0
  modelStats.loads++
  return loadDeps().then(({ loader, clone }) => loader.loadAsync(url).then((gltf) => {
    modelStats.loadMs.push(+((globalThis.performance?.now() ?? 0) - t0).toFixed(1))
    return { gltf, clone }
  }))
}
function disposeTemplate ({ gltf }) {
  gltf.scene.traverse((o) => {
    o.geometry?.dispose()
    for (const m of [].concat(o.material || [])) { for (const v of Object.values(m)) if (v?.isTexture) v.dispose(); m.dispose() }
  })
}

// a grey box shown while loading and, tinted red, when the url is refused or broken
const PLACEHOLDER_MAT = { loading: '#9aa3ad', error: '#d04848' }
function placeholder (holder, res, state) {
  const old = holder.userData.placeholder
  if (old) { holder.remove(old); res.release(old.userData.matKey) }
  if (!state) { holder.userData.placeholder = null; return }
  const k = 'mat:placeholder:' + state
  const m = new THREE.Mesh(res.use(holder, geoKey('box'), shapeGeo('box')),
    res.acquire(k, () => new THREE.MeshStandardMaterial({ color: normColor(PLACEHOLDER_MAT[state]), transparent: true, opacity: 0.6 })))
  // the geometry key stays recorded on the holder; the material is released here
  m.userData.matKey = k; m.position.y = 0.5
  holder.add(m); holder.userData.placeholder = m
}

const tintKey = (url, mat, tint) => `mat:tint:${url}:${mat.uuid}:${tint}`
function applyTint (holder, inst, url, tint, res) {
  const t = normColor(tint, '#ffffff'); if (t === '#ffffff') return
  inst.traverse((o) => {
    if (!o.isMesh) return
    const tinted = (m) => res.use(holder, tintKey(url, m, t), () => { const c = m.clone(); c.color?.multiply(new THREE.Color(t)); return c })
    o.material = Array.isArray(o.material) ? o.material.map(tinted) : tinted(o.material)
  })
}

function findAnchor (inst, re) { let hit = null; inst.traverse((o) => { if (!hit && re.test(o.name)) hit = o }); return hit }

export default {
  schema,
  defaults: defaultsOf(schema),
  create (d, { res, assets, changed }) {
    const holder = new THREE.Group(); holder.userData.pick = 'box'
    holder.scale.setScalar(clamp(d.scale, 1, 0.01, 100))
    const url = resolveUrl(d.url, assets?.())
    holder.userData.url = url; holder.userData.tint = normColor(d.tint, '#ffffff')
    if (!url) { holder.userData.error = 'refused url ' + String(d.url ?? ''); placeholder(holder, res, 'error'); holder.userData.ready = Promise.resolve(false); return holder }
    placeholder(holder, res, 'loading')
    holder.userData.ready = res.use(holder, gltfKey(url), () => load(url), disposeTemplate).then(({ gltf, clone }) => {
      if (holder.userData.disposed) return false // replaced mid-load; release already ran
      placeholder(holder, res, null)
      const inst = clone(gltf.scene)
      applyTint(holder, inst, url, holder.userData.tint, res)
      holder.add(inst); holder.userData.inst = inst
      holder.userData.anim = makeAnimator(inst, gltf.animations)
      holder.userData.anim.set(holder.userData.pending ?? 'idle', { mapping: holder.userData.pendingMap })
      // models may name their own anchors; otherwise the reconciler falls back to the bounds
      const seat = findAnchor(inst, /^(seat|saddle)/i); const head = findAnchor(inst, /^head/i)
      holder.userData.anchors = { ...(seat ? { seat } : {}), ...(head ? { head } : {}) }
      changed?.(holder)
      return true
    }, (e) => {
      if (holder.userData.disposed) return false
      modelStats.errors++; holder.userData.error = String(e?.message ?? e)
      placeholder(holder, res, 'error'); changed?.(holder)
      return false
    })
    return holder
  },
  update (holder, d, prev, { assets }) {
    if (resolveUrl(d.url, assets?.()) !== holder.userData.url) return false
    if (normColor(d.tint, '#ffffff') !== holder.userData.tint) return false // tinted materials are per template
    holder.scale.setScalar(clamp(d.scale, 1, 0.01, 100))
  },
  animate (holder, state, mapping, dt) {
    const a = holder.userData.anim
    if (!a) { holder.userData.pending = state; holder.userData.pendingMap = mapping; return }
    a.set(state, { mapping }); a.update(dt)
  },
  dispose (holder, { res }) {
    holder.userData.disposed = true
    placeholder(holder, res, null)
    holder.userData.anim?.dispose()
    holder.traverse((o) => { if (o.isSkinnedMesh) o.skeleton.dispose() }) // per-clone bone texture
  },
  anchors: (holder) => holder.userData.anchors ?? {},
}
