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

// --- how big the thing on the desk is ---------------------------------------
//
// The OS panel is the browser window, so this monitor is whatever shape the
// browser window is: 16:10 on the machine it was drawn for, 21:9 on somebody
// else's, portrait if you turn a phone over. That is not decoration. The
// reveal hands one live DOM subtree from the page into this monitor with no
// cut, and the seam is only invisible while the two rectangles are the same
// shape — match the height and you have matched the width too, but only if
// the aspects already agree.
//
// What is held fixed instead is the diagonal: whatever shape it comes out,
// the person at this desk bought one 27 inch monitor. DIAGONAL is exactly the
// 0.576 x 0.36 m the panel used to be nailed to, so a 16:10 window still
// builds the monitor that was there before, down to the millimetre.

const DIAGONAL = Math.hypot(0.576, 0.36)
// A ceiling, for the shapes nobody designed for. A very tall window would
// otherwise stand a panel up through the shelf and into the clock; a very wide
// one is self-limiting, because at a fixed diagonal wide also means short.
// This scales BOTH axes, never one, so the aspect survives it intact.
const MAX = { w: 0.86, h: 0.46 }

/** World size of the active area for a panel of `cssW` x `cssH` logical px. */
export function screenSizeFor(cssW, cssH) {
  const aspect = Math.max(1e-3, cssW) / Math.max(1e-3, cssH)
  let height = DIAGONAL / Math.hypot(1, aspect)
  let width = height * aspect
  const k = Math.min(1, MAX.w / width, MAX.h / height)
  return { width: width * k, height: height * k }
}

/**
 * The panel the OS is currently being drawn at, and the world rectangle that
 * has to match it. Live: setPanel() rewrites all four on every window resize.
 */
export const SCREEN = {
  cssWidth: 1440,
  cssHeight: 900,
  ...screenSizeFor(1440, 900),
}

const BEZEL = 0.024
const CHIN = 0.016 // the bottom edge of a monitor is always a little deeper
const PANEL_D = 0.032
const TILT = 0.055 // a few degrees back, the way anyone actually sets one up.
// Negative X rotation is what tips a +Z normal upward; positive tips it down.

// --- how it reacts to being resized -----------------------------------------
//
// A spring rather than a tween, because a resize is not one event: drag a
// window edge and the browser fires forty of them, each retargeting a spring
// that is already moving. Under-damped on purpose — a monitor that arrives at
// its new shape by easing into it looks like a CSS transition, and one that
// overshoots a couple of millimetres and comes back looks like an object.
const SPRING = { k: 150, damp: 13 }
// The panel is on a hinge, so a change of shape rocks it. Same idea: a damped
// oscillator, kicked once per change, by an impulse the size of the change.
const NOD = { freq: 12.5, damp: 2.6 }
const RESYNC = 0.95 // seconds the power LED spends amber, re-acquiring signal

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
  //
  // Everything from here down is built at unit size and SCALED into place by
  // layout(), which runs on every window resize and on every frame of the
  // spring that follows one. Rebuilding the geometry instead would be correct
  // and is what the first version did; it also meant disposing and re-uploading
  // eleven buffers sixty times a second for the length of a window drag, to
  // arrive at boxes that are still boxes. A box does not mind being scaled.
  // The one thing scaling must not do is take the bezel with it — so the shell
  // and the hole are scaled by their own numbers, and the gap between them is
  // BEZEL wherever it lands.
  const panel = new THREE.Group()
  panel.rotation.x = -TILT
  group.add(panel)

  const shell = box(1, 1, PANEL_D, MAT.plastic(0x17151d, 0.58), { dirt: 0.12 })
  panel.add(shell)

  // A recessed lip around the active area, so the bezel is not one flat slab.
  const lip = new THREE.Mesh(edgeDirt(new THREE.PlaneGeometry(1, 1), 0.08), MAT.plastic(0x0a0910, 0.4))
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
  const punch = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), punchMat)
  punch.position.z = PANEL_D / 2 + 0.0022
  punch.renderOrder = -1
  panel.add(punch)

  // The live OS, at the same place, in the CSS3D scene.
  let screenObject = new CSS3DObject(screenEl)

  // --- back of the panel: vents, a port cluster, a power light ---
  const back = box(1, 1, 0.016, MAT.plastic(0x131119, 0.66))
  back.position.z = -PANEL_D / 2 - 0.008
  panel.add(back)

  const slats = []
  for (let i = 0; i < 7; i++) {
    const slat = box(1, 0.004, 0.004, MAT.plastic(0x0b0a10, 0.8))
    slat.position.z = -PANEL_D / 2 - 0.016
    panel.add(slat)
    slats.push(slat)
  }

  // Cloned off the cache, not taken from it: MAT.emissive memoises by colour,
  // the board's LEDs are the same green, and this one is about to start
  // blinking amber every time somebody drags a window edge.
  const ledMat = MAT.emissive(PALETTE.green, 1.6).clone()
  const powerLed = new THREE.Mesh(new THREE.CircleGeometry(0.0022, 8), ledMat)
  panel.add(powerLed)
  const powerGlow = glowSprite(PALETTE.green, 0.006, { core: 0.5, mid: 0.16, halo: 0.05 })
  panel.add(powerGlow)
  const glowMats = []
  powerGlow.traverse((o) => {
    if (o.material?.color) glowMats.push({ mat: o.material, opacity: o.material.opacity })
  })
  const LED_GREEN = new THREE.Color(PALETTE.green)
  const LED_AMBER = new THREE.Color(PALETTE.amber)

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
  //
  // The yaw is what put it back through the screen: at 0.12rad a note 70mm wide
  // swings its far edge 4.2mm in z, and sitting 4.5mm proud of the panel that
  // took the receding edge to +0.3mm — behind the punch plane at +2.2mm, so the
  // running desktop drew over that side of it. Stand it further off and yaw it
  // less: the receding edge now clears the punch by 3.7mm.
  note.position.z = PANEL_D / 2 + 0.008
  note.rotation.z = -0.07
  note.rotation.y = 0.06
  panel.add(note)

  const tapeMat = MAT.plastic(0xb0a68f, 0.9).clone()
  tapeMat.transparent = true
  tapeMat.opacity = 0.55
  const tape = new THREE.Mesh(new THREE.PlaneGeometry(0.024, 0.009), tapeMat)
  tape.position.z = PANEL_D / 2 + 0.0102
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

  // --- layout ---------------------------------------------------------------

  /** The world rectangle the active area is drawn at right now. Between a
   *  resize and the spring settling this is NOT SCREEN's target shape, and it
   *  is deliberately the thing everything else measures against. */
  const live = { width: SCREEN.width, height: SCREEN.height }
  const target = { width: SCREEN.width, height: SCREEN.height }
  const vel = { width: 0, height: 0 }
  let nod = 0
  let nodVel = 0
  let resync = 0
  let animating = false

  /** Push `live` out into every mesh that depends on it. */
  function layout() {
    const sw = live.width
    const sh = live.height
    const pw = sw + BEZEL * 2
    const ph = sh + BEZEL * 2 + CHIN

    // The hinge is where it always was; the panel hangs off it, so how far its
    // centre sits above the neck is half of however tall it has become.
    panel.position.set(0, 0.235 + ph / 2 - 0.02, -0.022)

    shell.scale.set(pw, ph, 1)
    lip.scale.set(sw + 0.008, sh + 0.008, 1)
    // Two CSS pixels of inset all round, in whatever those are worth today.
    punch.scale.set(sw * (1 - 4 / SCREEN.cssWidth), sh * (1 - 4 / SCREEN.cssHeight), 1)

    back.scale.set(pw * 0.52, ph * 0.44, 1)
    back.position.y = 0.01
    // Proportional spacing, because a 32:9 window makes a panel barely taller
    // than its own chin and seven vents at a fixed 11mm walk straight out of it.
    const gap = Math.min(0.011, ph * 0.026)
    for (let i = 0; i < slats.length; i++) {
      slats[i].scale.x = pw * 0.42
      slats[i].position.y = ph * 0.14 - i * gap
    }

    const ledX = pw / 2 - Math.min(0.024, pw * 0.12)
    const ledY = -ph / 2 + Math.min(0.009, ph * 0.05)
    powerLed.position.set(ledX, ledY, PANEL_D / 2 + 0.003)
    powerGlow.position.copy(powerLed.position)

    // The note is a piece of paper and does not resize with the monitor — but
    // it cannot be four fifths of a short panel either, so it shrinks with the
    // bezel it is taped to and stops well before it becomes a sticker.
    const ns = THREE.MathUtils.clamp(ph / 0.424, 0.55, 1.15)
    note.scale.set(ns, ns, 1)
    note.position.x = -pw / 2 + 0.04 * ns
    note.position.y = ph / 2 - 0.048 * ns
    tape.scale.set(ns, ns, 1)
    tape.position.x = note.position.x + 0.004 * ns
    tape.position.y = note.position.y + 0.024 * ns

    panel.rotation.x = -TILT + nod
    panel.rotation.z = nod * 0.26

    api.onReshape?.(live)
  }

  // --- reacting to a resize -------------------------------------------------

  /**
   * Tell the monitor what shape the OS panel is now.
   *
   * `animate` is the whole easter egg and also the whole hazard. In the room it
   * is on: the monitor visibly stretches to the new shape, overshoots, rocks on
   * its hinge and re-acquires its signal, while the desktop inside it is pulled
   * along with it because the CSS3D copy is scaled from `live` and not from the
   * target. Anywhere near the hand-off it must be off, because for those frames
   * the hole in the canvas has to be exactly the rectangle the page is drawing
   * the panel at, and a spring that is still moving is a rectangle that is not.
   */
  function setPanel(cssWidth, cssHeight, { animate = false } = {}) {
    const next = screenSizeFor(cssWidth, cssHeight)
    const changed = Math.abs(next.width - SCREEN.width) > 1e-6 || Math.abs(next.height - SCREEN.height) > 1e-6
    SCREEN.cssWidth = cssWidth
    SCREEN.cssHeight = cssHeight
    SCREEN.width = next.width
    SCREEN.height = next.height
    target.width = next.width
    target.height = next.height

    if (!animate) {
      settle()
      return
    }
    if (changed) {
      // One kick per change, signed by which way the panel is going: a monitor
      // handed more screen rocks back, one handed less nods forward. Sized by
      // the change in area, so nudging a window edge by a pixel does not set
      // the thing wobbling like it has been hit.
      const grow = target.width * target.height - live.width * live.height
      nodVel += THREE.MathUtils.clamp(grow * 34, -0.7, 0.7)
      resync = RESYNC
    }
    animating = true
    layout()
    syncScreen()
  }

  /** Arrive at the target shape immediately, with nothing left moving. */
  function settle() {
    live.width = target.width
    live.height = target.height
    vel.width = vel.height = 0
    nod = nodVel = 0
    resync = 0
    animating = false
    setLed(LED_GREEN, 1)
    layout()
    syncScreen()
  }

  /** The power light, which is the only part of this machine that ever admits
   *  anything has happened. Green and steady, amber and blinking while it is
   *  working out what it has just been plugged into. */
  function setLed(color, brightness) {
    ledMat.color.copy(color).multiplyScalar(1.6 * brightness)
    for (const { mat, opacity } of glowMats) {
      mat.color.copy(color)
      mat.opacity = opacity * brightness
    }
  }

  /**
   * The spring, the nod and the signal light. Only does any work in the frames
   * after a resize; the rest of the time it is two comparisons and a return.
   */
  function update(dt) {
    if (!animating) return
    // Semi-implicit Euler, sub-stepped. Two things are being defended against
    // and one clamp cannot do both: a tab that has been in the background for
    // ten seconds comes back with one enormous dt, and an explicit spring
    // integrated across it does not overshoot, it explodes — while simply
    // clamping the step instead ties the spring's speed to the frame rate, so
    // on a machine rendering this room at eight frames a second the monitor
    // takes four seconds to change shape. Fixed steps, capped in number: the
    // spring runs in real time at any frame rate and is never asked to
    // integrate a step it cannot survive.
    let remaining = Math.min(dt, 0.3)
    while (remaining > 1e-6) {
      const h = Math.min(remaining, 1 / 120)
      remaining -= h
      for (const key of ['width', 'height']) {
        vel[key] += (target[key] - live[key]) * SPRING.k * h
        vel[key] *= Math.exp(-SPRING.damp * h)
        live[key] += vel[key] * h
      }
      nodVel += -NOD.freq * NOD.freq * nod * h - 2 * NOD.damp * nodVel * h
      nod += nodVel * h
    }

    if (resync > 0) {
      resync -= dt
      // Six hertz, the rate at which a monitor that has lost its input blinks.
      // The light has to be put back the moment the countdown ends and not
      // when the spring finally stops, or a long reshape — or one resize
      // arriving on the heels of another — leaves it stranded on whichever
      // half of a blink it happened to be on.
      if (resync <= 0) setLed(LED_GREEN, 1)
      else setLed(LED_AMBER, Math.sin((RESYNC - resync) * 38) > -0.35 ? 1 : 0.12)
    }

    const still =
      Math.abs(target.width - live.width) < 2e-5 &&
      Math.abs(target.height - live.height) < 2e-5 &&
      Math.abs(vel.width) < 2e-4 &&
      Math.abs(vel.height) < 2e-4 &&
      Math.abs(nod) < 2e-4 &&
      Math.abs(nodVel) < 2e-4 &&
      resync <= 0
    if (still) {
      settle()
      return
    }

    layout()
    syncScreen()
  }

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

  /** Park the CSS3D copy exactly on top of the hole. Runs after the monitor is
   *  placed in the room, and then on every frame the panel is changing shape. */
  function syncScreen() {
    const { position, quaternion } = screenPose()
    screenObject.position.copy(position)
    screenObject.quaternion.copy(quaternion)
    // CSS pixels to metres, one axis at a time and read off `live`, never off
    // the hole — the hole is deliberately a couple of pixels smaller. The two
    // factors are equal whenever the monitor is at rest, and during a reshape
    // they are not, which is exactly the point: the picture stretches with the
    // panel on its way to the new shape instead of waiting for it.
    screenObject.scale.set(live.width / SCREEN.cssWidth, live.height / SCREEN.cssHeight, 1)
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
    setPanel,
    settle,
    update,
    /** The rectangle the active area is being drawn at THIS frame. The camera
     *  and the screen light both have to follow it rather than SCREEN, which
     *  is where it is heading. */
    live,
    /** Set by the assembler: the screen's own light and glare are sized off
     *  the panel, so they have to be re-fitted whenever it changes. */
    onReshape: null,
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
    dispose() {
      ledMat.dispose()
    },
  }

  // Nothing above has a position or a size yet: every last one of them is a
  // unit primitive sitting at the origin until this runs.
  layout()

  return api
}
