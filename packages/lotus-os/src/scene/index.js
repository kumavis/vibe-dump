// index.js — the room, assembled.
//
// This module is the only thing in the app that imports three.js, and it is
// only ever reached through a dynamic import, so nothing here is paid for
// until somebody double-clicks reveal.run.
//
// The trick it exists to perform: the operating system is a real DOM subtree
// running in the page. To reveal it, that subtree is MOVED — not copied, not
// screenshotted — into a CSS3DObject sitting exactly where the monitor's
// screen is, the camera is placed at the one distance that makes the panel
// cover precisely the same rectangle of the viewport it covered a frame ago,
// and only then does anything start moving. There is no cut to hide.

import * as THREE from 'three'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'

import { PALETTE, glowSprite, disposeAll } from './materials.js'
import { createRig, screenFitDistance } from './camera-rig.js'
import { createMonitor, SCREEN } from './monitor.js'
import { createRoom } from './room.js'
import { createDesk } from './desk.js'
import { createPrinter } from './printer.js'
import { createSolderKit } from './solder.js'
import { createBoard } from './board.js'

const FOV_SCREEN = 40
const FOV_ROOM = 52

// Where things stand on the desk. The desk top is at y = 0.75 and every prop
// is built with its own origin on the surface it sits on, so these are just
// footprint centres.
const PLACE = {
  monitor: [-0.3, 0.75, -1.28],
  printer: [0.8, 0.75, -1.1],
  solder: [-1.05, 0.75, -1.22],
  board: [-0.8, 0.75, -0.88],
}

// Chosen by looking at it. The camera ends far enough back that the cables
// hanging at z ~ 0.5 crop both edges and the bulb crops a corner, which is the
// difference between a photograph of a room and a render of some objects.
const ROOM_POSE = {
  position: new THREE.Vector3(0.64, 1.32, 0.98),
  target: new THREE.Vector3(-0.06, 0.92, -1.05),
  fov: FOV_ROOM,
}
// The camera swings out and to the right rather than sliding straight back.
const FLIGHT_ARC = new THREE.Vector3(0.12, 1.16, -0.16)

const reduced = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Build the room, or leave nothing behind.
 *
 * Assembling it touches the live desktop before it can fail — CSS3DObject
 * stamps position, pointer-events and user-select onto the element in its
 * constructor, and a prop built after that is free to throw. A half-built
 * room must not leave the panel wearing them, or the page gets its desktop
 * back absolutely positioned and unselectable.
 */
export async function createWorkspace(opts) {
  const { osEl } = opts
  const held = {}
  const before = {
    transform: osEl.style.transform,
    position: osEl.style.position,
    pointerEvents: osEl.style.pointerEvents,
    userSelect: osEl.style.userSelect,
  }
  try {
    return await buildWorkspace(opts, held)
  } catch (err) {
    for (const [key, value] of Object.entries(before)) osEl.style[key] = value
    osEl.removeAttribute('draggable')
    osEl.classList.remove('is-embodied')
    osEl.inert = false
    osEl.dataset.embodied = 'false'
    if (!osEl.parentElement || osEl.parentElement !== opts.homeEl) opts.homeEl.append(osEl)
    held.root?.remove()
    window.lotus?.fit?.()
    throw err
  }
}

async function buildWorkspace({ osEl, homeEl, shell }, held) {
  // --- DOM ----------------------------------------------------------------

  const root = document.createElement('div')
  held.root = root
  root.className = 'room'
  root.dataset.mode = 'off'

  const cssLayer = document.createElement('div')
  cssLayer.className = 'room__css3d'

  const hud = document.createElement('div')
  hud.className = 'room__hud'
  hud.innerHTML =
    '<div class="room__label" aria-hidden="true"><span class="room__label-name"></span><span class="room__label-hint"></span></div>' +
    '<div class="room__hint"><span class="room__hint-text"></span></div>' +
    '<div class="room__post" aria-hidden="true"></div>'

  root.append(cssLayer, hud)
  document.body.append(root)

  // Film grain, generated rather than shipped. Four percent opacity over the
  // dark gradients is the difference between "graded footage" and "banding".
  try {
    const g = document.createElement('canvas')
    g.width = g.height = 128
    const gc = g.getContext('2d')
    const img = gc.createImageData(128, 128)
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 90 + Math.random() * 76
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v
      img.data[i + 3] = 255
    }
    gc.putImageData(img, 0, 0)
    root.style.setProperty('--grain', `url(${g.toDataURL('image/png')})`)
  } catch {
    /* no canvas, no grain; the room still renders */
  }

  const labelEl = hud.querySelector('.room__label')
  const labelName = hud.querySelector('.room__label-name')
  const labelHint = hud.querySelector('.room__label-hint')
  const hintText = hud.querySelector('.room__hint-text')

  // --- renderers ----------------------------------------------------------

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true, // required: the screen is a hole punched in this canvas
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 0.95
  renderer.outputColorSpace = THREE.SRGBColorSpace
  renderer.localClippingEnabled = true // the printer reveals its print with one
  renderer.domElement.className = 'room__gl'
  root.append(renderer.domElement)

  const cssRenderer = new CSS3DRenderer({ element: cssLayer })
  // Chromium will happily scroll an overflow:hidden container to reveal a
  // focused descendant, which slides the whole CSS3D layer off its matrix.
  cssLayer.addEventListener('scroll', () => {
    cssLayer.scrollTop = 0
    cssLayer.scrollLeft = 0
  })

  const scene = new THREE.Scene()
  scene.background = new THREE.Color(PALETTE.void)
  scene.fog = new THREE.FogExp2(0x0b0912, 0.13)

  const cssScene = new THREE.Scene()

  const camera = new THREE.PerspectiveCamera(FOV_SCREEN, 1, 0.02, 60)
  const rig = createRig(camera, { getSize: () => ({ width: window.innerWidth, height: window.innerHeight }) })

  RectAreaLightUniformsLib.init()

  // --- lights -------------------------------------------------------------
  // Two shadow casters, no more: the desk lamp and the window. Everything else
  // in the room lights without casting, because six overlapping shadow maps
  // both costs a fortune and flattens the image.

  const hemi = new THREE.HemisphereLight(0x2a2340, 0x08060e, 0.3)
  scene.add(hemi)

  const lampLight = new THREE.SpotLight(PALETTE.amber, 9.5, 3.4, 0.85, 0.55, 2)
  lampLight.castShadow = true
  lampLight.shadow.mapSize.set(1536, 1536)
  lampLight.shadow.bias = -0.0006
  lampLight.shadow.normalBias = 0.022
  lampLight.shadow.camera.near = 0.05
  lampLight.shadow.camera.far = 4
  lampLight.shadow.radius = 3
  scene.add(lampLight)
  scene.add(lampLight.target)

  const shaft = new THREE.DirectionalLight(0xb9a8ff, 0.78)
  shaft.position.set(-3.2, 3.1, 1.1)
  shaft.target.position.set(0.2, 0.6, -1.0)
  shaft.castShadow = true
  shaft.shadow.mapSize.set(1024, 1024)
  shaft.shadow.camera.left = -2.8
  shaft.shadow.camera.right = 2.8
  shaft.shadow.camera.top = 2.6
  shaft.shadow.camera.bottom = -0.6
  shaft.shadow.camera.near = 0.5
  shaft.shadow.camera.far = 10
  shaft.shadow.normalBias = 0.03
  scene.add(shaft, shaft.target)

  const rim = new THREE.DirectionalLight(0x6a5cff, 0.3)
  rim.position.set(2.2, 1.5, -2.4)
  scene.add(rim)

  // --- props --------------------------------------------------------------

  const sfx = shell?.sfx ?? null
  const parts = []
  const interactives = []

  const collect = (part, position = null, rotationY = 0) => {
    if (!part) return null
    if (position) part.group.position.set(...position)
    if (rotationY) part.group.rotation.y = rotationY
    scene.add(part.group)
    parts.push(part)
    for (const it of part.interactives ?? []) interactives.push(it)
    return part
  }

  const room = collect(createRoom({ sfx, quality: 1 }))
  const desk = collect(createDesk({ sfx, quality: 1 }))
  const monitor = collect(createMonitor({ screenEl: osEl, CSS3DObject }), PLACE.monitor)
  const printer = collect(createPrinter({ sfx, quality: 1 }), PLACE.printer, -0.06)
  const solder = collect(createSolderKit({ sfx, quality: 1 }), PLACE.solder, 0.14)
  const board = collect(createBoard({ sfx, quality: 1 }), PLACE.board, -0.22)

  scene.updateMatrixWorld(true)
  monitor.syncScreen()
  // Deliberately NOT added to cssScene yet. CSS3DRenderer appends an object's
  // element into its own layer the first time it renders it, which would tear
  // the desktop out of the page while the loader is still on screen.

  // The lamp is modelled by desk.js; the light that belongs to it lives here,
  // because it is one of the two shadow casters and those are rationed.
  if (desk?.lampTarget) {
    lampLight.position.copy(desk.lampTarget.origin)
    lampLight.target.position.copy(desk.lampTarget.aim)
  } else {
    lampLight.position.set(-0.92, 1.14, -1.3)
    lampLight.target.position.set(-0.86, 0.75, -0.95)
  }

  // The screen washing the desk in violet is most of why the shot reads as a
  // computer rather than as a prop of one.
  const pose = monitor.screenPose()
  const screenLight = new THREE.RectAreaLight(0x8a5cff, 6.5, SCREEN.width * 0.94, SCREEN.height * 0.94)
  screenLight.position.copy(pose.position).addScaledVector(pose.normal, 0.012)
  screenLight.lookAt(pose.position.clone().addScaledVector(pose.normal, 1))
  scene.add(screenLight)

  const screenBloom = glowSprite(0x9a6cff, SCREEN.height * 0.5, { core: 0.1, mid: 0.06, halo: 0.035, streak: SCREEN.width * 3.4 })
  screenBloom.position.copy(pose.position).addScaledVector(pose.normal, 0.006)
  scene.add(screenBloom)

  // --- hover marker -------------------------------------------------------

  const marker = glowSprite(PALETTE.gold, 0.012, { core: 0.55, mid: 0.18, halo: 0.05 })
  marker.visible = false
  scene.add(marker)

  // --- sizing -------------------------------------------------------------

  function resize() {
    const w = window.innerWidth
    const h = window.innerHeight
    renderer.setSize(w, h)
    cssRenderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  resize()
  window.addEventListener('resize', onResize)

  function onResize() {
    resize()
    if (root.dataset.mode === 'screen') rig.setPose(screenPose())
    // The distance that reproduces the page's framing depends on the viewport,
    // so a resize during the way home invalidates the pose being flown to.
    else if (root.dataset.mode === 'flying' && homeward) rig.retarget(screenPose())
  }

  // --- the two poses ------------------------------------------------------

  /**
   * The pose that reproduces the page's own view of the OS exactly: the panel
   * covering the same rectangle it covers when it is scaled to fit the window.
   */
  function screenPose() {
    const p = monitor.screenPose()
    const vh = window.innerHeight
    const fit = Math.min(window.innerWidth / SCREEN.cssWidth, vh / SCREEN.cssHeight)
    const d = screenFitDistance({
      worldHeight: SCREEN.height,
      viewportHeight: vh,
      targetHeightPx: SCREEN.cssHeight * fit,
      fov: FOV_SCREEN,
    })
    return {
      position: p.position.clone().addScaledVector(p.normal, d),
      target: p.position.clone(),
      fov: FOV_SCREEN,
    }
  }

  // --- interaction --------------------------------------------------------

  const raycaster = new THREE.Raycaster()
  const pointer = new THREE.Vector2()
  let hovered = null
  let pressAt = null
  let pointerInside = false

  // The interactive set never changes after assembly, so flatten it once
  // rather than rebuilding the array on every frame of the hover test.
  const hitObjects = []
  for (const it of interactives) {
    if (it.objects) hitObjects.push(...it.objects)
    else if (it.object) hitObjects.push(it.object)
  }

  function findInteractive(object) {
    for (const it of interactives) {
      const objs = it.objects ?? (it.object ? [it.object] : [])
      for (const o of objs) {
        let cur = object
        while (cur) {
          if (cur === o) return it
          cur = cur.parent
        }
      }
    }
    return null
  }

  function pick() {
    if (!pointerInside || root.dataset.mode !== 'room') return null
    raycaster.setFromCamera(pointer, camera)
    const hits = raycaster.intersectObjects(hitObjects, true)
    for (const hit of hits) {
      const it = findInteractive(hit.object)
      if (it) return { it, hit }
    }
    return null
  }

  function setHover(found) {
    const it = found?.it ?? null
    if (it !== hovered) {
      hovered = it
      labelEl.classList.toggle('is-on', !!it)
      renderer.domElement.style.cursor = it ? 'pointer' : 'grab'
      if (it) {
        labelName.textContent = it.label ?? ''
        labelHint.textContent = typeof it.hint === 'function' ? it.hint() : (it.hint ?? '')
      }
    } else if (it) {
      labelHint.textContent = typeof it.hint === 'function' ? it.hint() : (it.hint ?? '')
    }
    marker.visible = !!found
    if (found) marker.position.copy(found.hit.point)
  }

  const onPointerMove = (ev) => {
    pointerInside = true
    pointer.x = (ev.clientX / window.innerWidth) * 2 - 1
    pointer.y = -(ev.clientY / window.innerHeight) * 2 + 1
    labelEl.style.transform = `translate(${ev.clientX + 16}px, ${ev.clientY + 16}px)`
  }
  const onPointerDown = (ev) => {
    pressAt = { x: ev.clientX, y: ev.clientY }
  }
  const onPointerUp = (ev) => {
    if (!pressAt) return
    const moved = Math.hypot(ev.clientX - pressAt.x, ev.clientY - pressAt.y)
    pressAt = null
    if (moved > 6 || root.dataset.mode !== 'room') return
    const found = pick()
    if (found?.it?.onClick) found.it.onClick(found.hit)
  }
  const onPointerLeave = () => {
    pointerInside = false
    setHover(null)
  }

  renderer.domElement.addEventListener('pointermove', onPointerMove)
  renderer.domElement.addEventListener('pointerdown', onPointerDown)
  renderer.domElement.addEventListener('pointerup', onPointerUp)
  renderer.domElement.addEventListener('pointerleave', onPointerLeave)
  const detachRig = rig.attach(renderer.domElement)

  const onKey = (ev) => {
    if (root.dataset.mode !== 'room') return
    if (ev.key === 'Escape') exit()
  }
  window.addEventListener('keydown', onKey)

  // Clicking the monitor is how you get back in. The monitor module leaves the
  // handler blank because the flight belongs to the assembler.
  for (const it of monitor.interactives) it.onClick = () => exit()

  // --- loop ---------------------------------------------------------------

  let running = false
  let rafId = 0
  let t = 0
  let lastNow = 0

  function frame(now) {
    if (!running) return
    rafId = requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - lastNow) / 1000 || 0)
    lastNow = now
    t += dt

    rig.update(dt, t)
    for (const p of parts) p.update?.(dt, t)
    if (root.dataset.mode === 'room') setHover(pick())

    renderer.render(scene, camera)
    cssRenderer.render(cssScene, camera)
  }

  function start() {
    if (running) return
    running = true
    lastNow = performance.now()
    rafId = requestAnimationFrame(frame)
  }
  function stop() {
    running = false
    cancelAnimationFrame(rafId)
  }

  function renderOnce() {
    renderer.render(scene, camera)
    cssRenderer.render(cssScene, camera)
  }

  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()))

  // --- entering and leaving ----------------------------------------------

  let busy = false
  let homeward = false

  /**
   * Moving a DOM subtree keeps its nodes but loses three things that would
   * give the whole trick away: scroll offsets reset, focus falls back to the
   * body, and every running CSS animation restarts from zero. Measured, all
   * three. So snapshot them, let the renderer do its move, and put them back
   * in the same frame.
   */
  function keepState() {
    const nodes = [...osEl.querySelectorAll('.scroll, .term, .sidebar, .prose, .grid-view, .list-view')]
    const scrolls = nodes.map((n) => [n, n.scrollTop, n.scrollLeft])
    const active = osEl.contains(document.activeElement) ? document.activeElement : null
    let anims = []
    try {
      anims = (osEl.getAnimations?.({ subtree: true }) ?? []).map((a) => [a.effect?.target, a.animationName ?? '', a.currentTime])
    } catch {
      /* no Web Animations API; the pulses restart and nobody dies */
    }
    return () => {
      for (const [n, top, left] of scrolls) {
        n.scrollTop = top
        n.scrollLeft = left
      }
      try {
        for (const a of osEl.getAnimations?.({ subtree: true }) ?? []) {
          const match = anims.find(([target, name]) => target === a.effect?.target && name === (a.animationName ?? ''))
          if (match && match[2] != null) a.currentTime = match[2]
        }
      } catch {
        /* as above */
      }
      active?.focus?.({ preventScroll: true })
    }
  }

  async function enter() {
    if (busy || root.dataset.mode === 'room') return controller
    busy = true
    try {
      // Measure the panel exactly as the page is drawing it, before touching
      // anything — this is the rectangle the 3D copy has to match.
      const homeRect = osEl.getBoundingClientRect()

      root.dataset.mode = 'screen'
      root.style.display = 'block'
      osEl.dataset.embodied = 'true'
      osEl.classList.add('is-embodied')
      osEl.style.pointerEvents = 'none'
      renderer.domElement.style.transition = 'none'
      renderer.domElement.style.opacity = '0'

      // Snapshot before inert: setting it blurs whatever was focused, and the
      // focus half of keepState would be reading BODY by then.
      const restoreState = keepState()
      osEl.inert = true
      cssScene.add(monitor.remountScreen())
      rig.drift = 0
      rig.setPose(screenPose())
      renderOnce()
      restoreState()

      // One correction pass. Apparent size goes as 1/distance, so the ratio of
      // the measured heights is exactly the factor the distance was out by —
      // sub-pixel after a single step, and it costs one frame.
      const now = osEl.getBoundingClientRect()
      if (now.height > 1 && homeRect.height > 1) {
        const ratio = now.height / homeRect.height
        if (Math.abs(ratio - 1) > 0.002) {
          const p = monitor.screenPose()
          const d = rig.base.position.distanceTo(p.position) * ratio
          rig.setPose({ position: p.position.clone().addScaledVector(p.normal, d), target: p.position.clone(), fov: FOV_SCREEN })
          renderOnce()
        }
      }

      start()
      await nextFrame()

      // Bring the room up around the panel. The hole in the canvas is fully
      // transparent at any canvas opacity, so the desktop itself does not
      // flicker: only the room fades in around it.
      void renderer.domElement.offsetWidth // commit the transition-less zero
      renderer.domElement.style.transition = 'opacity 620ms ease'
      renderer.domElement.style.opacity = '1'
      shell?.sfx?.bowl?.({ base: 155.6, dur: 6, gain: 0.075 })

      await new Promise((r) => setTimeout(r, reduced() ? 60 : 420))

      homeward = false
      root.dataset.mode = 'flying'
      hud.classList.add('is-on')
      rig.drift = 0
      await rig.flyTo(ROOM_POSE, {
        ms: reduced() ? 420 : 3000,
        mid: FLIGHT_ARC,
        onUpdate: (e) => {
          rig.drift = e * 0.9
        },
      })
      rig.drift = 1
      root.dataset.mode = 'room'
      hintText.textContent = 'drag to look · click the printer, the board, the station · click the monitor to go back'
      hud.classList.add('is-settled')
    } catch (err) {
      // The hand-off has already moved the panel by the time most of this can
      // fail. Put it back rather than leaving it stranded in a room nobody is
      // looking at.
      console.error('reveal failed part-way', err)
      try {
        cssScene.remove(monitor.screenObject)
        osEl.style.transform = ''
        osEl.style.position = ''
        osEl.style.pointerEvents = ''
        osEl.style.userSelect = ''
        osEl.removeAttribute('draggable')
        osEl.classList.remove('is-embodied')
        osEl.inert = false
        osEl.dataset.embodied = 'false'
        homeEl.append(osEl)
        window.lotus?.fit?.()
      } finally {
        root.dataset.mode = 'off'
        root.style.display = 'none'
        stop()
      }
      throw err
    } finally {
      busy = false
    }
    return controller
  }

  async function exit() {
    if (busy || root.dataset.mode !== 'room') return
    busy = true
    try {
      hud.classList.remove('is-settled')
      setHover(null)
      homeward = true
      root.dataset.mode = 'flying'
      rig.recentre()
      await rig.flyTo(screenPose(), {
        ms: reduced() ? 360 : 2100,
        mid: FLIGHT_ARC,
        onUpdate: (e) => {
          rig.drift = (1 - e) * 0.9
        },
      })
      rig.drift = 0
      root.dataset.mode = 'screen'

      // Fade the room back out, then take the panel out of the monitor and
      // give it back to the page. Same subtree, same state, same open windows.
      renderer.domElement.style.transition = `opacity ${reduced() ? 60 : 420}ms ease`
      renderer.domElement.style.opacity = '0'
      hud.classList.remove('is-on')
      await new Promise((r) => setTimeout(r, reduced() ? 60 : 420))

      const restoreState = keepState()
      cssScene.remove(monitor.screenObject) // detaches the element from the CSS layer
      osEl.style.transform = ''
      osEl.style.position = ''
      osEl.style.pointerEvents = ''
      osEl.style.userSelect = ''
      osEl.removeAttribute('draggable')
      osEl.classList.remove('is-embodied')
      osEl.inert = false
      osEl.dataset.embodied = 'false'
      homeEl.append(osEl)
      window.lotus?.fit?.()
      restoreState()

      root.dataset.mode = 'off'
      root.style.display = 'none'
      // Stopping the loop strands any voice a prop had running: update() is
      // the only thing that could ever have turned it off again.
      shell?.sfx?.stopAll?.()
      stop()
    } finally {
      busy = false
    }
  }

  function dispose() {
    shell?.sfx?.stopAll?.()
    stop()
    // root owns the CSS3D layer, which owns the live desktop whenever the
    // panel is embodied. Removing it without handing the panel back first
    // would take the whole operating system with it.
    if (osEl.dataset.embodied === 'true') {
      cssScene.remove(monitor.screenObject)
      osEl.style.transform = ''
      osEl.style.position = ''
      osEl.style.pointerEvents = ''
      osEl.style.userSelect = ''
      osEl.removeAttribute('draggable')
      osEl.classList.remove('is-embodied')
      osEl.inert = false
      osEl.dataset.embodied = 'false'
      homeEl.append(osEl)
      window.lotus?.fit?.()
    }
    window.removeEventListener('resize', onResize)
    window.removeEventListener('keydown', onKey)
    renderer.domElement.removeEventListener('pointermove', onPointerMove)
    renderer.domElement.removeEventListener('pointerdown', onPointerDown)
    renderer.domElement.removeEventListener('pointerup', onPointerUp)
    renderer.domElement.removeEventListener('pointerleave', onPointerLeave)
    detachRig?.()
    for (const p of parts) p.dispose?.()
    disposeAll(scene)
    renderer.dispose()
    root.remove()
  }

  const controller = {
    root,
    scene,
    camera,
    rig,
    parts: { room, desk, monitor, printer, solder, board },
    enter,
    exit,
    dispose,
    get mode() {
      return root.dataset.mode
    },
  }

  // Compile every shader and draw one frame while the layer is still hidden.
  // A display:none canvas still renders; it just is not composited. This is
  // what stops the reveal from opening on a stutter.
  renderer.domElement.style.opacity = '0'
  rig.setPose(screenPose())
  renderer.compile(scene, camera)
  renderer.render(scene, camera)

  return controller
}
