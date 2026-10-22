// The coast's ink on the table (DATA.md §3): Natural Earth's coastline
// strokes as screen-width lines draped on the relief (render/lines.js
// LineSet), so no false meridian is drawn along a polygon split at 180°; the
// land polygons' rings stand in where a coast file has no strokes (the
// fixtures may not).
//
// Stage 0 draws the ink alone. The small islands' flat fills, a hair above
// the sea where the relief has no land texel, and thinning by zoom are the
// table workflow's.

import { LineSet } from '../render/lines.js'

export class Coast {
  /** coast: table/coast.json (normalised); proj: the TableProjection; uniforms: the table's bag. */
  constructor(coast, proj, uniforms) {
    const strokes = coast?.strokes?.features?.length ? coast.strokes : coast
    this.lines = new LineSet(strokes, proj, uniforms, {
      // a chart's dark ink, in the scene's linear light
      color: [0.035, 0.04, 0.045],
      width: 1.3,
      order: 3,
      maxSeg: 25,
      lift: [0.02, 0.0022],
      height: 300,
      densifyKm: 0,
    })
    this.group = this.lines.group
  }

  update(camera, resolution, dpr, opacity = 1) {
    this.lines.uniforms.uWidth.value = 1.3 * dpr
    this.lines.update(camera, resolution, opacity)
  }

  dispose() {
    this.lines.dispose()
  }
}
