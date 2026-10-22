// The coast's ink on the table (DATA.md §3, DESIGN.md §5.2): Natural Earth's
// coastline strokes as screen-width lines draped on the relief (render/
// lines.js LineSet), so no false meridian is drawn along a polygon split at
// 180°, and the small islands the relief cannot show filled flat a hair above
// the sea.
//
// The strokes are sorted by the size of what they outline into three sets,
// each its own LineSet: the continents and the large islands, inked at every
// distance; the middling islands, which come in as the camera closes past the
// whole theatre; the islets and atolls, which come in once a few kilometres
// are a few pixels. The width thins with the distance too (a fine pen over
// the whole theatre, a broader one over an island group), so the far view is
// not a tangle of ink and the near view keeps a coast's line. A stroke's size
// is its polygon's `area` where the coast file links the two by `ne`, else
// the span of the stroke itself. Where a coast file has no strokes (the
// fixtures may not), the polygons' rings stand in.
//
// The fills: every coast polygon whose ground the relief pack has no land
// texel for (an atoll's reef and islets, an islet beside a large island, a
// low cay: at 6.9 km a texel is land only where half of it is, DATA.md §2) is
// triangulated once and drawn flat, lifted 0.2 km over the sea, in the
// relief's lowland tint (islands) or a pale reef sand (reefs), lit by the
// same war-room light as the relief. Polygons the pack does show are left to
// the relief, which has their height.

import * as THREE from 'three'
import { LineSet, ringsOf } from '../render/lines.js'
import { constants, lighting } from '../render/shaders/common.glsl.js'
import { logDepthParsVertex, logDepthVertex, logDepthParsFragment, logDepthFragment } from '../render/shaders/logdepth.glsl.js'
import { densifyLonLat } from '../geo.js'

// the size classes, by the outline's area (km²) or, failing that, its span (km)
const BIG_KM2 = 3000
const SMALL_KM2 = 60
const BIG_SPAN = 120
const SMALL_SPAN = 15
// camera distances (km) over which each class comes in, from gone to full
const MID_IN = [17000, 11000]
const SMALL_IN = [6500, 3500]
// the fills' lift over the sea, km
const FILL_LIFT = 0.2
// the ink: a chart's near-black, in the scene's linear light
const INK = [0.032, 0.037, 0.043]

const smooth = (a, b, x) => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const fillVertex = /* glsl */ `
${logDepthParsVertex}
in vec3 aColour;
out vec3 vColour;
out vec3 vWorld;
void main() {
  vColour = aColour;
  vWorld = position;
  gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
  ${logDepthVertex}
}
`

const fillFragment = /* glsl */ `
${constants}
${lighting}
${logDepthParsFragment}
uniform float uOpacity;
in vec3 vColour;
in vec3 vWorld;
void main() {
  ${logDepthFragment}
  vec3 col = shade(vColour, vec3(0.0, 1.0, 0.0), vWorld, 1.0, 1.0);
  gl_FragColor = vec4(col, uOpacity);
}
`

/** The span of a ring in world units (its bounding box's longer side). */
function spanOf(ring) {
  let x0 = Infinity
  let x1 = -Infinity
  let z0 = Infinity
  let z1 = -Infinity
  for (const [x, z] of ring) {
    if (x < x0) x0 = x
    if (x > x1) x1 = x
    if (z < z0) z0 = z
    if (z > z1) z1 = z
  }
  return Math.max(x1 - x0, z1 - z0)
}

const srgb = (c) => c.map((v) => Math.pow(v, 2.2))

export class Coast {
  /**
   * coast: table/coast.json (normalised); proj: the TableProjection;
   * uniforms: the table's bag (light and ground); ground: the TableGround,
   * whose pack decides which polygons the relief already shows.
   */
  constructor(coast, proj, uniforms, ground = null) {
    this.group = new THREE.Group()
    this.group.name = 'coast'
    const polys = coast?.features || []
    const strokes = coast?.strokes?.features?.length ? coast.strokes.features : polys
    const areaByNe = new Map()
    for (const f of polys) if (f.properties?.ne != null && Number.isFinite(f.properties.area)) areaByNe.set(String(f.properties.ne), f.properties.area)
    const classes = { big: [], mid: [], small: [] }
    for (const f of strokes) {
      const p = f.properties || {}
      const area = p.ne != null && areaByNe.has(String(p.ne)) ? areaByNe.get(String(p.ne)) : Number.isFinite(p.area) ? p.area : null
      let cls
      if (area !== null) cls = area >= BIG_KM2 ? 'big' : area >= SMALL_KM2 ? 'mid' : 'small'
      else {
        const span = Math.max(0, ...ringsOf(f.geometry).map((r) => spanOf(r.map((c) => proj.toWorld(c)))))
        cls = span >= BIG_SPAN ? 'big' : span >= SMALL_SPAN ? 'mid' : 'small'
      }
      classes[cls].push(f)
    }
    this.counts = { big: classes.big.length, mid: classes.mid.length, small: classes.small.length }
    const line = (features, order) =>
      new LineSet({ type: 'FeatureCollection', features }, proj, uniforms, {
        color: INK,
        width: 1.2,
        order,
        maxSeg: 25,
        lift: [0.02, 0.0022],
        height: 300,
        densifyKm: 0,
      })
    this.sets = {
      big: line(classes.big, 3),
      mid: line(classes.mid, 3),
      small: line(classes.small, 3),
    }
    for (const s of Object.values(this.sets)) this.group.add(s.group)
    // (kept for the tools and older callers: the large coasts' set)
    this.lines = this.sets.big

    this.fills = ground ? this.buildFills(polys, proj, uniforms, ground) : null
    if (this.fills) this.group.add(this.fills)
  }

  /** The polygons the relief pack has no land texel for, triangulated flat at FILL_LIFT. */
  buildFills(polys, proj, uniforms, ground) {
    const island = srgb([0.6, 0.66, 0.5])
    const reef = srgb([0.86, 0.85, 0.74])
    const pos = []
    const col = []
    let n = 0
    for (const f of polys) {
      const kind = f.properties?.kind
      const g = f.geometry
      const polygons = g?.type === 'Polygon' ? [g.coordinates] : g?.type === 'MultiPolygon' ? g.coordinates : []
      for (const rings of polygons) {
        if (!rings?.length || rings[0].length < 4) continue
        const world = rings.map((r) => densifyLonLat(r, 20).map((c) => proj.toWorld(c)))
        if (this.landInPack(world[0], ground)) continue
        const contour = world[0].map(([x, z]) => new THREE.Vector2(x, z))
        const holes = world.slice(1).map((r) => r.map(([x, z]) => new THREE.Vector2(x, z)))
        let tris
        try {
          tris = THREE.ShapeUtils.triangulateShape(contour, holes)
        } catch {
          continue
        }
        const pts = contour.concat(...holes)
        const c = kind === 'reef' ? reef : island
        for (const t of tris) {
          for (const k of t) {
            const p = pts[k]
            pos.push(p.x, FILL_LIFT, p.y)
            col.push(c[0], c[1], c[2])
          }
        }
        n++
      }
    }
    this.fillCount = n
    if (!pos.length) return null
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
    geo.setAttribute('aColour', new THREE.Float32BufferAttribute(col, 3))
    geo.computeBoundingSphere()
    this.fillUniforms = { ...uniforms, uOpacity: { value: 1 } }
    this.fillMaterial = new THREE.ShaderMaterial({
      vertexShader: fillVertex,
      fragmentShader: fillFragment,
      uniforms: this.fillUniforms,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    })
    const mesh = new THREE.Mesh(geo, this.fillMaterial)
    mesh.name = 'coast-fills'
    mesh.renderOrder = 2
    return mesh
  }

  /** Whether the pack shows land anywhere on a ring: its vertices, its centroid and a few points between. */
  landInPack(ring, ground) {
    let cx = 0
    let cz = 0
    for (const [x, z] of ring) {
      if (ground.metresAt(x, z) > 0) return true
      cx += x
      cz += z
    }
    cx /= ring.length
    cz /= ring.length
    if (ground.metresAt(cx, cz) > 0) return true
    const step = Math.max(1, Math.floor(ring.length / 8))
    for (let i = 0; i < ring.length; i += step) {
      const [x, z] = ring[i]
      if (ground.metresAt((x + cx) / 2, (z + cz) / 2) > 0) return true
    }
    return false
  }

  /** Once a frame: widths and the size classes by the camera's distance (km), all scaled by the overlays' opacity. */
  update(camera, resolution, dpr, opacity = 1, distance = 1000) {
    // a fine pen far out, a broader one close in
    const t = smooth(Math.log(20000), Math.log(150), Math.log(Math.max(1, distance)))
    const w = (0.75 + 0.75 * t) * dpr
    const k = { big: 1, mid: smooth(MID_IN[0], MID_IN[1], distance), small: smooth(SMALL_IN[0], SMALL_IN[1], distance) }
    for (const [cls, s] of Object.entries(this.sets)) {
      s.uniforms.uWidth.value = cls === 'big' ? w : w * 0.85
      s.update(camera, resolution, opacity * k[cls])
    }
    if (this.fills) this.fills.visible = true
  }

  dispose() {
    for (const s of Object.values(this.sets)) s.dispose()
    if (this.fills) {
      this.fills.geometry.dispose()
      this.fillMaterial.dispose()
    }
  }
}
