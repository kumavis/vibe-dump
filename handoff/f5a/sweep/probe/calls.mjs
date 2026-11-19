// counts each figure's main-pass meshes (on three's default layer, visible), per unit, 'new' style or argv[2]
const PKG = '/home/user/vibe-dump-wt/f5a/packages/tails-and-scales'
const THREE = await import(PKG + '/node_modules/three/build/three.module.js').catch(() => import('three'))
const cache = await import(PKG + '/view/models/cache.js')
const { RACES } = await import(PKG + '/data/schema.js')
if (process.argv[2]) cache.setFigureStyle(process.argv[2])
const L0 = new THREE.Layers()
for (const [rk, r] of Object.entries(RACES)) {
  let tot = 0, line = []
  for (const key of r.army) {
    const t = r.units[key]
    let per = 0
    for (let m = 0; m < t.models; m++) {
      const root = cache.buildModel(r.look.models, key, t, '#d23a9a')
      let n = 0
      root.traverseVisible((o) => { if (o.isMesh && o.layers.test(L0)) n++ })
      if (m === 0) line.push(`${key} ${n}×${t.models}`)
      per += n
    }
    tot += per
  }
  console.log(rk, 'classic list main meshes', tot, ':', line.join(', '))
}
