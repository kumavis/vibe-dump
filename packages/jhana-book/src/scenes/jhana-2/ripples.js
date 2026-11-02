// ripples.js — card outlines for jhana-2.
//
// hoopShape: one panel of a ripple. A symmetric tent glued at ±a with panels
// of length p, open flat: a point s along a panel (from the glue line toward
// the crease) sits a·(p − s)/p from the spine. For the panel to trace a circle
// of radius r round the point (0, zc) when seen from above:
//     (a·(p − s)/p)² + (t − zc)² = r²
// — an ellipse in panel coords whose half-width across the panel is r·p/a.
// The band between two such ellipses (rIn < a < rOut) is a C opening onto the
// crease: unfolded, the two panels make one elliptical hoop creased down its
// middle. Where the outer ellipse would run past the glue line it is clipped
// to it — that straight stretch is the glue tab that holds the hoop down.

export function hoopShape(THREE, { a, p, rOut, rIn, zc = 0, steps = 28 }) {
  const k = p / a
  const shape = new THREE.Shape()
  const outer = (phi) => new THREE.Vector2(Math.max(0, p - k * rOut * Math.cos(phi)), zc + rOut * Math.sin(phi))
  const inner = (phi) => new THREE.Vector2(p - k * rIn * Math.cos(phi), zc + rIn * Math.sin(phi))
  shape.moveTo(p, zc - rOut)
  for (let i = 1; i <= steps; i++) {
    const v = outer(-Math.PI / 2 + (Math.PI * i) / steps)
    shape.lineTo(v.x, v.y)
  }
  shape.lineTo(p, zc + rIn) // across the crease: the hoop's near crossing
  for (let i = steps - 1; i >= 0; i--) {
    const v = inner(-Math.PI / 2 + (Math.PI * i) / steps)
    shape.lineTo(v.x, v.y)
  }
  shape.lineTo(p, zc - rOut) // the far crossing
  return shape
}

// teardropShape: half of the spring, in V-panel coords for gamma = π/2 (s up
// the crease, t out along the glue line). A short glue tab at the foot, a
// swell a third of the way up, a point at the top of the crease; mirrored by
// the other panel it is a slender drop of gold standing on its tail.
export function teardropShape(THREE, { height, width }) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  shape.lineTo(0, width * 0.55)
  shape.bezierCurveTo(height * 0.14, width * 1.25, height * 0.42, width * 1.05, height, 0)
  shape.lineTo(0, 0)
  return shape
}
