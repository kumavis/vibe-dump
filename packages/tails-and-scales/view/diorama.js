// A race's figures on a plinth (DESIGN §1.1, F6): the race showcase of the
// battle-setup panel and the lobby's seat cards, drawn by the table's own
// renderer into a window of the page (a scissor viewport over an element's
// rect, after the table's frame: the element is left clear so the canvas
// shows through it), one figure per unit of the race, in its army's
// order, each idling as it does on the table. The figures come from the
// template cache (view/models/cache.js), so a race shown once costs a
// figure's base thereafter, and a battle after it finds its miniatures
// baked.
//
// Nothing is built until a window is first shown: the title's first frame,
// and every cosmetic Math.random draw the title makes, stay the table's
// (sim/title-shot.mjs).
//
// (V2) A window's splat-fur Bushtails (view/models/splat/splats.js) are
// prepared at the start of each of its renders (its scene's
// onBeforeRender), for its camera, its viewport (set just before) and its
// own sun: each figure's level of detail from its height in the window, and
// its draw order from the window camera's direction in it, as the table's
// are (view/stage.js), within what the frame's splat budget has left after
// the table's render (which, while a window shows, draws its own figures at
// their coarsest: the panel is over it). The windows cast no shadows, so a
// squirrel's shadow proxy (or a figure's shadow caster) is never drawn in
// one.
//
//   diorama.show(el, race, color)   the race in element `el`'s window (its
//                                   bases' rims in `color`); again with
//                                   another race or colour rebuilds it
//   diorama.hide(el)                the window let go of, its figures
//                                   freed
//   diorama.shown(el)               whether element `el` has a window (no:
//                                   never shown, let go of, or a race this
//                                   code doesn't know)
//   diorama.unitAt(el, x, y)        the unit (its type) under the page
//                                   point x, y in that window, or null
//   diorama.draw(time)              each frame, after the table's
import * as THREE from 'three'
import { RACES } from '../data/schema.js'
import { buildModel, disposeFigure } from './models/cache.js'
import { prepareSplats } from './models/splat/splats.js'

export class Diorama {
  constructor(renderer) {
    this.renderer = renderer
    this.windows = new Map()
    this.ray = new THREE.Raycaster()
  }

  show(el, race, color) {
    const had = this.windows.get(el)
    if (had && had.race === race && had.color === color) return
    if (had) this.hide(el)
    const r = RACES[race]
    if (!r) return
    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#231b14')
    scene.add(new THREE.HemisphereLight('#d6e6ff', '#3b2a1a', 0.95))
    const sun = new THREE.DirectionalLight('#fff0d6', 2.1)
    sun.position.set(-6, 12, 9)
    scene.add(sun)
    const fill = new THREE.DirectionalLight('#9fb8ff', 0.4)
    fill.position.set(6, 5, -6)
    scene.add(fill)
    // ((V2) its splats, lit by its sun)
    const toSun = sun.position.clone().normalize()
    scene.onBeforeRender = (renderer, s, camera) => prepareSplats(camera, renderer, toSun, s, 'window')
    // each unit of the race once, in the order its army lists them, on a
    // felt plinth, the big ones at the back
    const keys = [...new Set([...r.army, ...Object.keys(r.units)])]
    const front = keys.filter((k) => !r.units[k].big), back = keys.filter((k) => r.units[k].big)
    const figures = []
    const row = (list, z) => {
      const widths = list.map((k) => r.units[k].base * 2 + 0.5)
      let x = -widths.reduce((a, b) => a + b, 0) / 2
      list.forEach((k, i) => {
        const t = r.units[k]
        const root = buildModel(r.look.models, k, t, color)
        root.position.set(x + widths[i] / 2, 0, z)
        x += widths[i]
        root.userData.type = t
        scene.add(root)
        figures.push(root)
      })
      return widths.reduce((a, b) => a + b, 0)
    }
    const wide = Math.max(row(front, 1.1), back.length ? row(back, -1.3) : 0)
    const plinth = new THREE.Mesh(new THREE.CylinderGeometry(wide / 2 + 0.8, wide / 2 + 1, 0.3, 48), new THREE.MeshStandardMaterial({ color: '#3d4a26', roughness: 0.95 }))
    plinth.scale.z = 0.55
    plinth.position.y = -0.15
    scene.add(plinth)
    const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100)
    this.windows.set(el, { el, race, color, scene, camera, figures, plinth, wide })
  }

  hide(el) {
    const w = this.windows.get(el)
    if (!w) return
    for (const f of w.figures) disposeFigure(f)
    w.plinth.geometry.dispose()
    w.plinth.material.dispose()
    this.windows.delete(el)
  }

  shown(el) {
    return this.windows.has(el)
  }

  // where the window stands on the page, or null (hidden, or off the page)
  rectOf(w) {
    if (!w.el.isConnected) return null
    const r = w.el.getBoundingClientRect()
    return r.width > 2 && r.height > 2 && r.bottom > 0 && r.top < innerHeight ? r : null
  }

  unitAt(el, x, y) {
    const w = this.windows.get(el), r = w && this.rectOf(w)
    if (!r) return null
    this.ray.setFromCamera(new THREE.Vector2(((x - r.left) / r.width) * 2 - 1, -((y - r.top) / r.height) * 2 + 1), w.camera)
    const hit = this.ray.intersectObjects(w.figures, true)[0]
    let o = hit?.object
    while (o && !o.userData.type) o = o.parent
    return o?.userData.type ?? null
  }

  draw(time) {
    if (!this.windows.size) return
    const renderer = this.renderer
    let drew = false
    for (const w of this.windows.values()) {
      const r = this.rectOf(w)
      if (!r) continue
      // the camera frames the plinth's width, whatever the window's shape
      const aspect = r.width / r.height, cam = w.camera
      cam.aspect = aspect
      const half = Math.atan(Math.tan((cam.fov * Math.PI) / 360) * aspect)
      const dist = Math.max((w.wide / 2 + 1.2) / Math.tan(half), 8)
      cam.position.set(0, dist * 0.42, dist)
      cam.lookAt(0, 0.55, 0)
      cam.updateProjectionMatrix()
      // each figure idles as on the table, the whole plinth turning a
      // little to and fro
      for (const f of w.figures) {
        const a = f.userData.anim, fig = f.userData.fig, t = time + f.userData.phase
        // ((V2) about the figure's own height scale, as on the table)
        if (a?.kind === 'squirrel') fig.scale.y = fig.userData.sy * (1 + Math.sin(t * 2.4) * 0.018)
        else if (a?.kind === 'naga') {
          fig.rotation.z = Math.sin(t * 1.4) * 0.035
          fig.scale.y = fig.userData.sy * (1 + Math.sin(t * 1.4) * 0.015)
        }
        if (a?.gem) a.gem.rotation.y = t * 2
      }
      w.scene.rotation.y = Math.sin(time * 0.35) * 0.22
      renderer.setScissorTest(true)
      renderer.setViewport(r.left, innerHeight - r.bottom, r.width, r.height)
      renderer.setScissor(r.left, innerHeight - r.bottom, r.width, r.height)
      renderer.render(w.scene, cam)
      drew = true
    }
    if (drew) {
      renderer.setScissorTest(false)
      renderer.setViewport(0, 0, innerWidth, innerHeight)
    }
  }
}
