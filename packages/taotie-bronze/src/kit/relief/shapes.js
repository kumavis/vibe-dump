// Path helpers shared by motifs. Shang bands are drawn freehand-smooth, never
// as polygons, so the default way to turn control points into a path is a
// centripetal-ish Catmull-Rom spline converted to cubic Béziers.

/**
 * Begin a new path through pts ([x,y] in mm). closed → a smooth loop.
 * tension 0.5 is classic Catmull-Rom; lower is tighter.
 */
export function smoothPath(ctx, pts, closed = false, tension = 0.5) {
  const n = pts.length
  ctx.beginPath()
  if (n === 0) return
  if (n < 3) {
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0], pts[i][1])
    if (closed) ctx.closePath()
    return
  }
  const get = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))])
  const k = tension / 3
  ctx.moveTo(pts[0][0], pts[0][1])
  const segs = closed ? n : n - 1
  for (let i = 0; i < segs; i++) {
    const p0 = get(i - 1), p1 = get(i), p2 = get(i + 1), p3 = get(i + 2)
    ctx.bezierCurveTo(
      p1[0] + (p2[0] - p0[0]) * k, p1[1] + (p2[1] - p0[1]) * k,
      p2[0] - (p3[0] - p1[0]) * k, p2[1] - (p3[1] - p1[1]) * k,
      p2[0], p2[1],
    )
  }
  if (closed) ctx.closePath()
}

/** Straight polyline path. */
export function polyPath(ctx, pts, closed = false) {
  ctx.beginPath()
  pts.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
  if (closed) ctx.closePath()
}
