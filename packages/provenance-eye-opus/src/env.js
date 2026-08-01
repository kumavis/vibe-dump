import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Environment
//
// Gold is metal: at metalness 1 there is no diffuse term at all, so lights do
// almost nothing and the environment map IS the material. This app ships no
// external assets, so the "studio" is painted by hand into a 512x256
// equirectangular canvas and PMREM-filtered.
//
// The one thing that matters here is CONTRAST. A smooth gradient makes gold
// render as flat orange plastic; what reads as cast metal is a mostly dark
// surround broken by a few hard, bright sources — a hot key, a horizon strip,
// and a handful of vertical softboxes for the bevels to rake across.
// ---------------------------------------------------------------------------
export function makeEnvMap(renderer) {
  const canvas = document.createElement('canvas')
  canvas.width = 512
  canvas.height = 256
  const ctx = canvas.getContext('2d')

  // Start near black. Everything bright from here is deliberate.
  ctx.fillStyle = '#07060f'
  ctx.fillRect(0, 0, 512, 256)

  // The horizon strip: a bright warm band the gold picks up as a long
  // highlight across every face that tips toward the equator.
  const strip = ctx.createLinearGradient(0, 96, 0, 168)
  strip.addColorStop(0.0, 'rgba(12,10,26,0)')
  strip.addColorStop(0.35, 'rgba(255,214,150,0.85)')
  strip.addColorStop(0.5, 'rgba(255,241,214,1)')
  strip.addColorStop(0.66, 'rgba(196,120,64,0.7)')
  strip.addColorStop(1.0, 'rgba(20,8,14,0)')
  ctx.fillStyle = strip
  ctx.fillRect(0, 96, 512, 72)

  // A cool wash overhead so the upward-facing bevels are not the same colour as
  // everything else.
  const above = ctx.createLinearGradient(0, 0, 0, 100)
  above.addColorStop(0, 'rgba(96,110,220,0.55)')
  above.addColorStop(1, 'rgba(30,24,70,0)')
  ctx.fillStyle = above
  ctx.fillRect(0, 0, 512, 100)

  // Warm bounce off the cloud below.
  const below = ctx.createLinearGradient(0, 176, 0, 256)
  below.addColorStop(0, 'rgba(150,70,30,0)')
  below.addColorStop(1, 'rgba(220,120,50,0.4)')
  ctx.fillStyle = below
  ctx.fillRect(0, 176, 512, 80)

  const blob = (x, y, r, color, alpha, hard = 0.35) => {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(hard, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalAlpha = alpha
    ctx.fillStyle = g
    ctx.fillRect(x - r, y - r, r * 2, r * 2)
    ctx.globalAlpha = 1
  }

  // Vertical softboxes: the streaked highlights that make a curved metal edge
  // look turned rather than painted.
  const bar = (x, w, top, h, color, alpha) => {
    const g = ctx.createLinearGradient(x - w, 0, x + w, 0)
    g.addColorStop(0, 'rgba(0,0,0,0)')
    g.addColorStop(0.5, color)
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.globalAlpha = alpha
    ctx.fillStyle = g
    ctx.fillRect(x - w, top, w * 2, h)
    ctx.globalAlpha = 1
  }
  bar(70, 26, 20, 200, '#fff4dd', 0.75)
  bar(214, 16, 44, 170, '#cfe0ff', 0.45)
  bar(330, 30, 10, 220, '#ffd9a8', 0.35)
  bar(452, 12, 60, 140, '#ffffff', 0.5)

  // The key: small, very hot, high and to the left. This is the highlight that
  // rakes along the triangle's top bevel.
  blob(126, 58, 26, '#ffffff', 1, 0.5)
  blob(126, 58, 90, '#ffd9a0', 0.5)
  // A tight cool accent opposite it, so the shadow side is not dead.
  blob(400, 108, 46, '#b9d0ff', 0.5, 0.25)
  // And a warm one low, standing in for the lit cloud.
  blob(262, 206, 90, '#ff9b4e', 0.4)

  const tex = new THREE.CanvasTexture(canvas)
  tex.mapping = THREE.EquirectangularReflectionMapping
  tex.colorSpace = THREE.SRGBColorSpace

  const pmrem = new THREE.PMREMGenerator(renderer)
  pmrem.compileEquirectangularShader()
  const envMap = pmrem.fromEquirectangular(tex).texture
  pmrem.dispose()
  tex.dispose()

  return envMap
}
