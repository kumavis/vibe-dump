const PKG = '/home/user/vibe-dump-wt/f5a/packages/tails-and-scales'
const THREE = await import('three')
const cache = await import(PKG + '/view/models/cache.js')
const { RACES } = await import(PKG + '/data/schema.js')
const L0 = new THREE.Layers()
for (const [race, key] of process.argv.slice(2).map((s) => s.split(':'))) {
  const r = RACES[race], t = r.units[key]
  const root = cache.buildModel(r.look.models, key, t, '#d23a9a')
  const rows = []
  root.traverseVisible((o) => {
    if (!o.isMesh || !o.layers.test(L0)) return
    let p = o.parent, path = []
    while (p && p !== root) { path.push(p === root.userData.fig ? 'fig' : p === root.userData.base ? 'base' : (p.userData.keep ? 'KEEP' : 'g')); p = p.parent }
    const m = o.material
    rows.push(`${path.reverse().join('/')} ${m.type} r${m.roughness} cc${m.clearcoat ?? '-'} sh${m.sheen ?? '-'} tris ${(o.geometry.index ? o.geometry.index.count : o.geometry.getAttribute('position').count) / 3}`)
  })
  console.log(`${race}:${key} ${rows.length}\n  ${rows.join('\n  ')}`)
}
