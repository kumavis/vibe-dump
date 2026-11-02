// _placeholder.js — the stand-in pop-up every spread starts with. Scene authors
// replace their module's `build` with the real thing; this shows the contract:
// mechanisms from ctx.paper (posed by the engine before update), ambient
// effects that fade with frame.reveal and breathe with frame.breath, and a
// dispose() that frees what build() made.

export function placeholderBuild(ctx) {
  const { THREE, group, paper, palette, colors, quality } = ctx

  // A plain tent in the accent colour: glued 0.35 from the spine on both
  // pages, 0.5 panels → 0.36 high when open, flat when closed. z stays ≤ 0.45
  // so the printed text strip is clear.
  const tent = paper.parallelFold({ a: 0.35, p: 0.5, z0: -0.45, z1: 0.3 })
  const card = paper.material({ color: palette.accent, roughness: 0.85 })
  paper.card(tent.left, { material: card })
  paper.card(tent.right, { material: card })

  // A handful of motes floating above the spread.
  const rnd = paper.rng(`${palette.bg}${palette.accent}`)
  const count = quality === 'low' ? 12 : 24
  const pos = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    pos[i * 3] = (rnd() - 0.5) * 1.4
    pos[i * 3 + 1] = 0.15 + rnd() * 0.7
    pos[i * 3 + 2] = -0.5 + rnd() * 0.85
  }
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
  const sprite = document.createElement('canvas')
  sprite.width = sprite.height = 64
  const g = sprite.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.3, 'rgba(255,255,255,0.6)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  const map = new THREE.CanvasTexture(sprite)
  const material = new THREE.PointsMaterial({
    color: colors.accent,
    map,
    size: 0.05,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  })
  const motes = new THREE.Points(geometry, material)
  motes.renderOrder = 2 // after the paper
  group.add(motes)

  return {
    update(frame) {
      material.opacity = frame.reveal * (0.3 + 0.6 * frame.breath)
      material.size = 0.035 + 0.03 * frame.breath
      motes.visible = frame.reveal > 0.001
      motes.position.y = 0.03 * Math.sin(frame.time * 0.35)
      motes.rotation.y = frame.time * 0.025
    },
    dispose() {
      geometry.dispose()
      material.dispose()
      map.dispose()
      paper.dispose()
    },
  }
}
