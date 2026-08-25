// monitor.js — the panel the whole operating system turns out to have been
// living inside.
//
// The screen is two coincident objects: a WebGL plane that writes nothing but
// a hole in the frame buffer, and a CSS3DObject holding the actual, still
// running, still interactive OS element. The hole is what lets the DOM show
// through the WebGL image, and because the hole also writes depth, anything
// behind it in the scene is correctly hidden and anything in front of it
// correctly covers it.

import * as THREE from 'three'
import { MAT, PALETTE, box, cyl, cable, glowSprite, makeCanvasTexture, edgeDirt, tintGeometry } from './materials.js'

// The OS is a 1440x900 logical panel. At 0.0004 world units per CSS pixel it
// becomes a 0.576 x 0.36 m active area — a 27 inch 16:10 display, which is
// exactly what someone with this desk would own.
export const SCREEN = {
  cssWidth: 1440,
  cssHeight: 900,
  scale: 0.0004,
  get width() {
    return this.cssWidth * this.scale
  },
  get height() {
    return this.cssHeight * this.scale
  },
}

const BEZEL = 0.024
const PANEL_W = SCREEN.width + BEZEL * 2
const PANEL_H = SCREEN.height + BEZEL * 2 + 0.016 // a slightly deeper chin
const PANEL_D = 0.032
const TILT = 0.055 // a few degrees back, the way anyone actually sets one up.
// Negative X rotation is what tips a +Z normal upward; positive tips it down.

export function createMonitor({ screenEl, CSS3DObject }) {
  const group = new THREE.Group()

  // --- stand ---
  const foot = box(0.26, 0.014, 0.16, MAT.paint(PALETTE.greyMetal, { rough: 0.5, metal: 0.55 }))
  foot.position.set(0, 0.007, -0.01)
  group.add(foot)

  const neck = box(0.052, 0.215, 0.028, MAT.paint(PALETTE.greyMetal, { rough: 0.45, metal: 0.65 }))
  neck.position.set(0, 0.12, -0.045)
  neck.rotation.x = -0.06
  group.add(neck)

  const hinge = cyl(0.018, 0.018, 0.06, MAT.metal(PALETTE.aluminium, 0.5), 12)
  hinge.rotation.z = Math.PI / 2
  hinge.position.set(0, 0.225, -0.038)
  group.add(hinge)

  // --- panel ---
  const panel = new THREE.Group()
  panel.position.set(0, 0.235 + PANEL_H / 2 - 0.02, -0.022)
  panel.rotation.x = -TILT
  group.add(panel)

  const shell = box(PANEL_W, PANEL_H, PANEL_D, MAT.plastic(0x17151d, 0.58), { dirt: 0.12 })
  panel.add(shell)

  // A recessed lip around the active area, so the bezel is not one flat slab.
  const lip = new THREE.Mesh(
    edgeDirt(new THREE.PlaneGeometry(SCREEN.width + 0.008, SCREEN.height + 0.008), 0.08),
    MAT.plastic(0x0a0910, 0.4),
  )
  lip.position.z = PANEL_D / 2 + 0.0005
  panel.add(lip)

  // --- the hole ---
  // NoBlending means this fragment REPLACES whatever is in the frame buffer
  // rather than mixing with it, so writing an alpha of zero genuinely punches
  // through the (alpha: true) canvas to the CSS3D layer underneath. It still
  // writes depth, which is what stops the panel shell behind it from drawing.
  const punchMat = new THREE.MeshBasicMaterial({
    color: 0x000000,
    opacity: 0,
    transparent: false,
    blending: THREE.NoBlending,
    premultipliedAlpha: true,
    toneMapped: false,
    fog: false,
  })
  // The hole is a couple of CSS pixels smaller than the panel all round, so the
  // desktop's outermost pixels tuck under the bezel lip instead of resolving
  // against it through the antialiased silhouette.
  const punch = new THREE.Mesh(
    new THREE.PlaneGeometry((SCREEN.cssWidth - 4) * SCREEN.scale, (SCREEN.cssHeight - 4) * SCREEN.scale),
    punchMat,
  )
  punch.position.z = PANEL_D / 2 + 0.0022
  punch.renderOrder = -1
  panel.add(punch)

  // The live OS, at the same place, in the CSS3D scene.
  let screenObject = new CSS3DObject(screenEl)

  // --- back of the panel: vents, a port cluster, a power light ---
  const back = box(PANEL_W * 0.52, PANEL_H * 0.44, 0.016, MAT.plastic(0x131119, 0.66))
  back.position.z = -PANEL_D / 2 - 0.008
  back.position.y = 0.01
  panel.add(back)

  for (let i = 0; i < 7; i++) {
    const slat = box(PANEL_W * 0.42, 0.004, 0.004, MAT.plastic(0x0b0a10, 0.8))
    slat.position.set(0, PANEL_H * 0.14 - i * 0.011, -PANEL_D / 2 - 0.016)
    panel.add(slat)
  }

  const powerLed = new THREE.Mesh(
    new THREE.CircleGeometry(0.0022, 8),
    MAT.emissive(PALETTE.green, 1.6),
  )
  powerLed.position.set(PANEL_W / 2 - 0.024, -PANEL_H / 2 + 0.009, PANEL_D / 2 + 0.003)
  panel.add(powerLed)
  const powerGlow = glowSprite(PALETTE.green, 0.006, { core: 0.5, mid: 0.16, halo: 0.05 })
  powerGlow.position.copy(powerLed.position)
  panel.add(powerGlow)

  // A note taped to the corner of the bezel. Every monitor has one.
  //
  // It used to borrow the shared decal sheet — a scatter of barcodes and
  // warning labels across a mostly empty 512px square — so at monitor size it
  // sampled blank paper almost every time and the only thing that read was the
  // tape holding it on. It gets its own scrawl now: nobody has to be able to
  // read it, but it has to be obvious that somebody wrote something.
  const noteTex = makeCanvasTexture('bezel-note', 128, 96, (ctx, w, h) => {
    ctx.fillStyle = '#b3a878'
    ctx.fillRect(0, 0, w, h)
    // a fold shadow down one edge, so it is a piece of paper and not a swatch
    const fold = ctx.createLinearGradient(0, 0, w * 0.18, 0)
    fold.addColorStop(0, 'rgba(0,0,0,0.16)')
    fold.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = fold
    ctx.fillRect(0, 0, w * 0.18, h)

    ctx.strokeStyle = 'rgba(38,32,28,0.62)'
    ctx.lineWidth = 2.2
    ctx.lineCap = 'round'
    const lines = [0.9, 0.72, 0.86, 0.55, 0.34]
    lines.forEach((len, i) => {
      const y = 20 + i * 13
      ctx.beginPath()
      ctx.moveTo(14, y)
      // a run of small arcs reads as handwriting at any size a straight rule
      // would read as a form to fill in
      for (let x = 14; x < 14 + (w - 30) * len; x += 6) {
        ctx.quadraticCurveTo(x + 3, y - 3, x + 6, y)
      }
      ctx.stroke()
    })
    ctx.strokeStyle = 'rgba(150,40,40,0.55)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(14, 84)
    ctx.lineTo(60, 84)
    ctx.stroke()
  })

  const note = new THREE.Mesh(
    tintGeometry(new THREE.PlaneGeometry(0.07, 0.052), 0xffffff),
    new THREE.MeshStandardMaterial({
      map: noteTex,
      roughness: 0.95,
      metalness: 0,
      vertexColors: true,
      side: THREE.DoubleSide,
    }),
  )
  // Positioned by its centre, so half its width has to clear the edge or the
  // note hangs off the panel into the room behind it.
  //
  // It has to sit in FRONT of the punch plane. The punch writes depth, and the
  // hole it opens is where the CSS3D desktop shows through — so a note behind
  // it is a note behind the running OS, which is what it looked like. The
  // bezel is 24mm and the note is 70mm, so there is nowhere to put it that
  // does not cross the screen: tape it over the corner, the way people do.
  // Nothing is lost, because the panel is inert while it is in the monitor.
  note.position.set(-PANEL_W / 2 + 0.040, PANEL_H / 2 - 0.048, PANEL_D / 2 + 0.0045)
  note.rotation.z = -0.07
  note.rotation.y = 0.12
  panel.add(note)

  const tapeMat = MAT.plastic(0xb0a68f, 0.9).clone()
  tapeMat.transparent = true
  tapeMat.opacity = 0.55
  const tape = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.009), tapeMat)
  tape.position.set(note.position.x + 0.004, note.position.y + 0.024, PANEL_D / 2 + 0.0052)
  tape.rotation.z = 0.28
  panel.add(tape)

  // --- the cable down the back of the desk ---
  const lead = cable(
    [
      [0.02, 0.24, -0.06],
      [0.05, 0.14, -0.1],
      [0.07, 0.03, -0.14],
      [0.05, -0.02, -0.2],
    ],
    { radius: 0.005, color: 0x0e0c14 },
  )
  group.add(lead)

  /**
   * The screen's world pose. Both the CSS3D copy and the camera's "you are
   * looking at the desktop" position are derived from this, so it is the one
   * piece of geometry in the room that has to be exact.
   */
  function screenPose() {
    punch.updateWorldMatrix(true, false)
    const position = new THREE.Vector3()
    const quaternion = new THREE.Quaternion()
    const scale = new THREE.Vector3()
    punch.matrixWorld.decompose(position, quaternion, scale)
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quaternion).normalize()
    return { position, quaternion, scale, normal }
  }

  /** Park the CSS3D copy exactly on top of the hole. Called once, after the
   *  monitor has been placed in the room. */
  function syncScreen() {
    const { position, quaternion, scale } = screenPose()
    screenObject.position.copy(position)
    screenObject.quaternion.copy(quaternion)
    // The element is 1440x900 CSS px and must land at 0.576 x 0.36 m — derived
    // from SCREEN.scale, never from the hole, which is deliberately smaller.
    screenObject.scale.set(scale.x * SCREEN.scale, scale.y * SCREEN.scale, 1)
    screenObject.updateMatrixWorld(true)
  }

  /**
   * Hand the panel to a NEW CSS3DObject before each reveal.
   *
   * CSS3DRenderer memoises, per object, the transform string it last wrote,
   * and skips the write when it has not changed. Coming home clears that
   * inline transform so the page can have its panel back — and the second
   * reveal then lands on the same camera pose, produces the same string, and
   * the renderer decides it has nothing to do. The panel renders untransformed
   * and falls out of the monitor. A fresh object has no cache entry.
   */
  function remountScreen() {
    screenObject = new CSS3DObject(screenEl)
    api.screenObject = screenObject
    syncScreen()
    return screenObject
  }

  const api = {
    group,
    panel,
    punch,
    screenObject,
    screenPose,
    syncScreen,
    remountScreen,
    powerLed,
    powerGlow,
    interactives: [
      {
        objects: [punch, shell, lip],
        label: 'The monitor',
        hint: 'Go back in',
        // wired up by the assembler, which owns the flight back
        onClick: () => {},
      },
    ],
    dispose() {},
  }

  return api
}
