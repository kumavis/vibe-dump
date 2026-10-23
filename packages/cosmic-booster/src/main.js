import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { Card, CARD_ASPECT } from './card.js'
import { Pack, PACK_W, PACK_H, TEAR_Y } from './pack.js'
import { Sparkles, sparkleColor, spectrumColor } from './particles.js'
import { Backdrop } from './background.js'
import { drawPack, RARITY, SET_SIZE } from './cards.js'
import { warmArt, ART_KINDS } from './art/index.js'
import { tween, after, ease, stepTweens, killTweens } from './tween.js'
import { sfx, isMuted, setMuted } from './audio.js'

// ---------------------------------------------------------------- renderer

const canvas = document.getElementById('gl')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: 'high-performance' })
renderer.setClearColor(0x000000, 1)
let pixelRatio = Math.min(window.devicePixelRatio || 1, 2)
renderer.setPixelRatio(pixelRatio)

const scene = new THREE.Scene()
const CAM_Z = 12
const FOV = 30
const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200)
camera.position.set(0, 0, CAM_Z)

// one key light, drifting slowly, that every foil surface reflects
const light = new THREE.Vector3(-3.5, 4.5, 8)

const reduceMotion = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const backdrop = new Backdrop()
backdrop.addTo(scene)
const sparkles = new Sparkles()
scene.add(sparkles.points)

// The scene renders into a half-float target so foil glints and star cores can
// go past white; only those reach the bloom (threshold 1).
// MSAA only where pixels are big enough to see stair-steps on the card edges
const composer = new EffectComposer(
  renderer,
  new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: pixelRatio < 1.5 ? 4 : 0 }),
)
composer.addPass(new RenderPass(scene, camera))
const BLOOM = 0.72
const bloom = new UnrealBloomPass(new THREE.Vector2(1, 1), BLOOM, 0.5, 1.0)
composer.addPass(bloom)
const finish = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 } },
  vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }`,
  fragmentShader: `
    uniform sampler2D tDiffuse; uniform float uTime; varying vec2 vUv;
    float h(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
    void main() {
      vec3 c = texture2D(tDiffuse, vUv).rgb;
      vec2 p = vUv - .5;
      c *= 1. - dot(p, p) * .6;
      c += (h(gl_FragCoord.xy + fract(uTime * 7.) * 100.) - .5) * (2. / 255.);
      gl_FragColor = vec4(c, 1.);
    }`,
})
composer.addPass(finish)

// ---------------------------------------------------------------- layout

const view = { w: 1, h: 1, visW: 1, visH: 1, aspect: 1 }

function packScale() {
  return Math.min((0.74 * view.visH) / PACK_H, (0.74 * view.visW) / PACK_W)
}
// A pose laid out in the z = 0 plane, moved to depth z so that it looks the
// same size and in the same place on screen.
function atDepth(p, z) {
  const f = (CAM_Z - z) / CAM_Z
  return { ...p, x: p.x * f, y: p.y * f, z, s: p.s * f }
}
// The card in hand lives between the header and the caption block, measured
// in pixels, so a short screen never puts the caption over it.
function focusBand() {
  const px = view.visH / view.h
  return {
    top: view.visH / 2 - 56 * px,
    bottom: -view.visH / 2 + (view.w <= 640 ? 134 : 104) * px,
  }
}
// Card height in hand: a little short of the band, to leave room for the idle
// sway and bob — but on a screen too short for the band it keeps a usable
// size and lets the caption overlap rather than shrinking to a speck.
function focusHeight() {
  const { top, bottom } = focusBand()
  const band = (top - bottom) * 0.92
  return { band, h: Math.min(0.64 * view.visH, Math.max(band, 0.45 * view.visH)) }
}
function focusScale() {
  return Math.min(focusHeight().h / CARD_ASPECT, 0.8 * view.visW)
}
function focusPose(extra = {}) {
  const { top, bottom } = focusBand()
  const { band, h } = focusHeight()
  // centred in the band, easing back to the screen centre when it doesn't fit
  const y = ((top + bottom) / 2) * Math.min(1, Math.max(0, band / h))
  return { x: 0, y, z: 0, rx: 0, ry: 0, rz: 0, s: focusScale(), flip: 0, ...extra }
}
// A spread card picked up to look closer: at the card-in-hand size, but
// never smaller than it already looked in the spread.
function inspectPose(c) {
  const f = focusPose()
  const p = spreadPose(c.index, cards.length)
  const looked = (p.s * CAM_Z) / (CAM_Z - p.z)
  return atDepth({ ...f, s: Math.max(f.s, looked * 1.15) }, 2.2)
}
function stackPose(k) {
  // cards waiting under the one in hand, edges just showing
  const s = focusScale()
  const { flip, ...f } = focusPose()
  return { ...f, x: f.x + k * s * 0.005, y: f.y - k * s * 0.006, z: -0.03 - k * 0.025, rz: (k % 2 ? 1 : -1) * 0.006 * k }
}
function pilePose(i) {
  const fs = focusScale()
  const s = fs * 0.36
  const portrait = view.aspect < 0.95
  const gutter = (view.visW - fs) / 2
  const x = portrait ? -view.visW / 2 + s * 0.18 : -view.visW / 2 + gutter / 2
  const y = portrait ? -view.visH * 0.02 : -view.visH * 0.06
  const r = ((i * 7919) % 13) / 13 - 0.5
  return { x: x + r * s * 0.12, y: y + i * s * 0.035, z: -0.8 + i * 0.015, rx: 0, ry: 0, rz: 0.16 - i * 0.05 + r * 0.06, s, flip: 0 }
}
function spreadPose(k, n) {
  const chase = k === n - 1
  // world units per CSS pixel, to keep clear of the HUD whatever the height
  const px = view.visH / view.h
  if (view.aspect < 0.95) {
    // portrait: the chase card up top, the rest in two rows beneath, all of
    // it between the header and the collection bar
    const top = view.visH / 2 - 56 * px
    const bottom = -view.visH / 2 + 118 * px
    const A = top - bottom
    const hB = A * 0.5
    const hR = A * 0.205
    const g = A * 0.045
    if (chase) {
      const s = Math.min(hB / CARD_ASPECT, 0.62 * view.visW)
      return atDepth({ x: 0, y: top - hB / 2, rx: 0, ry: 0, rz: 0, s, flip: 0 }, 0.5)
    }
    const perRow = Math.ceil((n - 1) / 2)
    const row = k < perRow ? 0 : 1
    const inRow = row ? n - 1 - perRow : perRow
    const col = row ? k - perRow : k
    const s = Math.min(hR / CARD_ASPECT, (0.9 * view.visW) / (perRow + 0.4))
    const gap = s * 1.08
    return {
      x: (col - (inRow - 1) / 2) * gap,
      y: top - hB - g - hR / 2 - row * (hR + g),
      z: 0.1 + col * 0.01,
      rx: 0,
      ry: 0,
      rz: (col - (inRow - 1) / 2) * -0.03,
      s,
      flip: 0,
    }
  }
  // landscape: the rest fanned in a crown behind the chase card
  const fit = Math.min(1, view.aspect / 1.62)
  if (chase) {
    // as big as it can be while its foot stays above the collection bar
    // (which stacks, and so stands taller, at 640 px and under), but never
    // smaller than the crown behind it
    // (also clear of the caption, which takes the bar's place while a card is
    // picked up)
    let y = -view.visH * 0.05
    const floor = -view.visH / 2 + (view.w <= 640 ? 108 : 96) * px
    const room = y - floor
    const crown = ((0.34 * view.visH) / CARD_ASPECT) * fit
    const s = Math.max(crown * 1.1, Math.min(((0.6 * view.visH) / CARD_ASPECT) * Math.max(fit, 0.75), (2 * room) / CARD_ASPECT))
    // when the floor on its size wins, lift it so its foot still clears the
    // bar, as far as the header allows
    const half = (s * CARD_ASPECT) / 2
    y = Math.min(Math.max(y, floor + half), Math.max(y, view.visH / 2 - 56 * px - half))
    return atDepth({ x: 0, y, rx: 0, ry: 0, rz: 0, s, flip: 0 }, 0.6)
  }
  const m = n - 1
  const u = m > 1 ? k / (m - 1) : 0.5
  const th = (u - 0.5) * 2 * 0.86
  const R = view.visH * 0.76 * fit
  const pivotY = -view.visH * 0.56 * fit - view.visH * 0.02
  const s = ((0.34 * view.visH) / CARD_ASPECT) * fit
  return {
    x: Math.sin(th) * R,
    y: pivotY + Math.cos(th) * R,
    z: -0.2 - Math.abs(th) * 0.15 + k * 0.004,
    rx: 0,
    ry: 0,
    rz: -th * 0.78,
    s,
    flip: 0,
  }
}

// ---------------------------------------------------------------- HUD

const $ = (s) => document.querySelector(s)
const hud = {
  caption: $('#caption'),
  chip: $('#caption .chip'),
  meta: $('#caption .meta'),
  dots: $('#dots'),
  hint: $('#hint'),
  spread: $('#spreadui'),
  count: $('#spreadui .count'),
  skip: $('#skip'),
  mute: $('#mute'),
}
let hintTimer = 0
const narrow = () => view.w < 560
function hint(text, delay = 0) {
  clearTimeout(hintTimer)
  hud.hint.classList.add('off')
  if (!text) return
  hintTimer = setTimeout(() => {
    hud.hint.textContent = text
    hud.hint.classList.remove('off')
  }, 350 + delay)
}
const RARITY_COLOR = { common: '#d9dce6', uncommon: '#b8d0ff', rare: '#ffd79a', holo: '#ffffff' }
function caption(card, i, n) {
  if (!card) {
    hud.caption.classList.remove('show', 'chase')
    return
  }
  const r = RARITY[card.def.rarity]
  hud.caption.classList.toggle('chase', card.def.rarity === 'holo')
  hud.chip.style.setProperty('--c', RARITY_COLOR[card.def.rarity])
  hud.chip.textContent = `${r.glyph}  ${r.label}${card.pull.foil && card.def.rarity !== 'holo' ? ' · Starlight foil' : ''}`
  hud.meta.textContent =
    card.def.rarity === 'holo'
      ? `${card.def.name} · print ${String(card.pull.print).padStart(3, '0')} of 250`
      : `${card.def.name} · ${i + 1} of ${n}`
  hud.caption.classList.add('show')
}
function dots(n, cur) {
  if (hud.dots.children.length !== n) {
    hud.dots.innerHTML = ''
    for (let i = 0; i < n; i++) {
      const li = document.createElement('li')
      if (i === n - 1) li.classList.add('star')
      hud.dots.appendChild(li)
    }
  }
  ;[...hud.dots.children].forEach((li, i) => {
    li.classList.toggle('seen', i < cur)
    li.classList.toggle('now', i === cur)
  })
  hud.dots.classList.toggle('show', cur >= 0)
}

// The collection lives in memory and is mirrored to storage when storage is
// there, so the count stays right in a private window too.
const COLLECTION_KEY = 'cosmic-booster:collection'
const owned = (() => {
  try {
    const stored = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '[]')
    return new Set(Array.isArray(stored) ? stored : [])
  } catch {
    return new Set()
  }
})()
function collection() {
  return owned
}
function collect(id) {
  owned.add(id)
  try {
    const stored = JSON.parse(localStorage.getItem(COLLECTION_KEY) || '[]')
    if (Array.isArray(stored)) for (const k of stored) owned.add(k)
    localStorage.setItem(COLLECTION_KEY, JSON.stringify([...owned]))
  } catch {}
  return owned
}

const SPEAKER_ON = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2.5 6h2.5l3.5-3v10l-3.5-3h-2.5z" fill="currentColor" stroke="none"/><path d="M11 5.2a4 4 0 0 1 0 5.6M12.8 3.4a6.6 6.6 0 0 1 0 9.2"/></svg>`
const SPEAKER_OFF = `<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3"><path d="M2.5 6h2.5l3.5-3v10l-3.5-3h-2.5z" fill="currentColor" stroke="none"/><path d="M11 6l4 4M15 6l-4 4"/></svg>`
function drawMute() {
  hud.mute.innerHTML = isMuted() ? SPEAKER_OFF : SPEAKER_ON
  hud.mute.setAttribute('aria-label', isMuted() ? 'Sound off' : 'Sound on')
}
drawMute()
hud.mute.addEventListener('click', (e) => {
  e.stopPropagation()
  setMuted(!isMuted())
  drawMute()
})

// ---------------------------------------------------------------- state

let state = 'boot'
let flowGen = 0
let pack = null
const packPose = { x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0, s: 1 }
const packTilt = new THREE.Vector2()
const stripPose = { x: 0, y: 0, z: 0, rx: 0, rz: 0, o: 1 }
let cards = []
let cur = 0
let inspected = null
let hovered = null
let shake = { v: 0 }
let vortex = 0
let simT = 0

function held() {
  if (state === 'reveal' || state === 'chaseReady' || state === 'chase' || state === 'chaseHold') return cards[cur]
  if (state === 'inspect') return inspected
  return null
}

function clearTable() {
  for (const c of cards) {
    scene.remove(c.group)
    c.dispose()
  }
  cards = []
  if (pack) {
    scene.remove(pack.group)
    pack.dispose()
    pack = null
  }
}

function newPack(dropIn) {
  const gen = ++flowGen
  killTweens()
  tearing = false
  riding = false
  clearTable()
  sparkles.clear()
  inspected = hovered = null
  const pulls = drawPack()
  cards = pulls.map((p, i) => {
    const c = new Card(p, renderer, light)
    c.index = i
    c.group.visible = false
    if (i === pulls.length - 1) c.pose.flip = 1 // the chase card waits face down
    scene.add(c.group)
    c.renderArt(renderer, 0, false)
    return c
  })
  cards[0].renderArt(renderer, 0, true)
  pack = new Pack(light)
  scene.add(pack.group)
  // upload the card faces and compile their shaders now, not at the rip
  cards.forEach((c) => {
    renderer.initTexture(c.face.frame)
    renderer.initTexture(c.face.mask)
    renderer.initTexture(c.material.uniforms.uBack.value)
    renderer.initTexture(c.material.uniforms.uBackMask.value)
    c.group.visible = true
  })
  renderer.compile(scene, camera)
  cards.forEach((c) => (c.group.visible = false))
  Object.assign(packPose, { x: 0, y: dropIn ? view.visH * 1.2 : 0, z: 0, rx: dropIn ? -0.5 : 0, ry: 0, rz: dropIn ? -0.3 : 0, s: packScale() })
  Object.assign(stripPose, { x: 0, y: 0, z: 0, rx: 0, rz: 0 })
  tearProgress = 0
  cur = 0
  state = 'pack'
  caption(null)
  dots(0, -1)
  hud.spread.classList.remove('show')
  hud.skip.classList.remove('gone')
  backdrop.tintTarget.setRGB(0.32, 0.2, 0.62)
  hint(narrow() ? 'Swipe across the top seal  ·  or tap the pack' : 'Drag across the top seal to tear it open  ·  or tap the pack', dropIn ? 700 : 400)
  if (dropIn) tween(packPose, { y: 0, rx: 0, rz: 0 }, 1.1, { ease: ease.outBack })
  return gen
}

// ---- tearing

let tearProgress = 0
let lastTearSound = 0

function setTear(p) {
  const before = tearProgress
  tearProgress = Math.min(1, p)
  pack.uniforms.uTear.value = tearProgress
  if (tearProgress > before) {
    const n = Math.ceil((tearProgress - before) * 160)
    tearSparks(n)
    if (simT - lastTearSound > 0.07) {
      sfx.tear(tearProgress)
      lastTearSound = simT
    }
  }
  if (tearProgress >= 1 && state === 'pack') openPack()
}

const _v = new THREE.Vector3()
const _v2 = new THREE.Vector3()
const _t2 = new THREE.Vector2()
const _qPack = new THREE.Quaternion()
function tearSparks(n) {
  pack.tearPoint(_v)
  pack.group.localToWorld(_v)
  for (let i = 0; i < Math.min(n, 30); i++) {
    sparkles.emit({
      x: _v.x + (Math.random() - 0.5) * 0.05,
      y: _v.y + (Math.random() - 0.5) * 0.05,
      z: _v.z + 0.1,
      vx: (Math.random() - 0.3) * 1.6,
      vy: Math.random() * 2.2 + 0.3,
      vz: Math.random() * 0.8,
      color: sparkleColor(new THREE.Color(1, 0.85, 0.6)),
      size: 0.35 + Math.random() * 0.6,
      life: 0.6 + Math.random() * 0.8,
      drag: 1.8,
      gravity: 2.4,
    })
  }
}

function autoTear() {
  if (state !== 'pack' || tearing) return
  tearing = true
  const o = { p: tearProgress }
  tween(o, { p: 1 }, 0.5 * (1 - tearProgress) + 0.12, {
    ease: ease.inOut,
    onUpdate: () => setTear(o.p),
  }).then(() => (tearing = false))
}
let tearing = false
let riding = false

async function openPack() {
  if (state !== 'pack') return
  state = 'opening'
  const gen = flowGen
  sfx.rip()
  hint(null)
  riding = true
  const s = packPose.s

  // the strip goes, the light comes out
  ripBurst()
  tween(stripPose, { x: 0.9, y: 1.3, z: 0.6, rz: -1.1, rx: -0.9 }, 1.0, { ease: ease.out })
  tween(pack.spill.material.uniforms.uI, { value: 0.85 }, 0.3, { ease: ease.out }).then(() =>
    tween(pack.spill.material.uniforms.uI, { value: 0 }, 1.4, { ease: ease.inOut, delay: 0.5 }),
  )

  // the cards, stacked inside, ride up out of the opening
  cards.forEach((c, k) => {
    c.group.visible = true
    Object.assign(c.pose, {
      x: packPose.x,
      y: packPose.y - PACK_H * s * 0.08,
      z: packPose.z + 0.01 - k * 0.004,
      rx: 0,
      ry: 0,
      rz: 0,
      s: s * 0.97,
    })
    tween(c.pose, { y: packPose.y + PACK_H * s * 0.34 }, 0.9, { delay: 0.25 + k * 0.012, ease: ease.out })
  })
  await after(1.05)
  if (gen !== flowGen) return
  riding = false

  // the pack falls away and the stack comes to your hand
  tween(packPose, { y: -view.visH * 1.25, rz: 0.35, rx: 0.7 }, 1.0, { ease: ease.in })
  cards.forEach((c, k) => tween(c.pose, stackPose(k), 1.05, { delay: k * 0.015, ease: ease.inOut }))
  sfx.swish()
  await after(1.1)
  if (gen !== flowGen) return
  scene.remove(pack.group)
  pack.dispose()
  pack = null
  state = 'reveal'
  cur = 0
  revealed(0)
}

function revealed(i) {
  const c = cards[i]
  const n = cards.length
  dots(n, i)
  if (i === n - 1) {
    state = 'chaseReady'
    caption(null)
    c.glow = 0
    tween(c, { glow: 0.55 }, 1.2)
    backdrop.tintTarget.setRGB(0.55, 0.32, 0.18)
    hint(narrow() ? 'Something bends the light  ·  tap to turn it' : 'Something is bending the light  ·  tap to turn it over', 300)
    return
  }
  state = 'reveal'
  const rank = RARITY[c.def.rarity].rank
  sfx.reveal(i, rank)
  collect(c.def.id)
  caption(c, i, n)
  const accent = new THREE.Color(c.def.accent)
  backdrop.tintTarget.copy(accent).multiplyScalar(0.55)
  c.glow = 0
  tween(c, { glow: rank >= 2 || c.pull.foil ? 0.32 : 0.1 }, 0.6)
  cardBurst(c, rank >= 2 || c.pull.foil ? 90 : 45, accent)
  hint(i === 0 ? (narrow() ? 'Tilt it  ·  tap for the next card' : 'Tilt it in the light  ·  tap for the next card') : '', 600)
}

async function next() {
  if (state !== 'reveal') return
  const c = cards[cur]
  sfx.swish()
  c.tiltTarget.set(0, 0)
  tween(c, { glow: 0 }, 0.4)
  tween(c.pose, pilePose(cur), 0.62, { ease: ease.inOut, arc: { z: 0.9 } })
  c.flyUntil = performance.now() / 1000 + 0.62
  cur++
  const nCard = cards[cur]
  // the next card is lifted to the front of the stack
  tween(nCard.pose, focusPose({ flip: nCard.pose.flip }), 0.3, { ease: ease.out })
  nCard.pop = 1
  for (let k = cur + 1; k < cards.length; k++) tween(cards[k].pose, stackPose(k - cur), 0.3)
  revealed(cur)
}

async function chase() {
  if (state !== 'chaseReady') return
  state = 'chase'
  const gen = flowGen
  const c = cards[cur]
  hint(null)
  hud.skip.classList.add('gone')
  sfx.gather()
  const sky = backdrop.sky.material.uniforms
  const stars = backdrop.starMat.uniforms
  stars.uCenter.value.set(c.pose.x, c.pose.y, 0)
  tween(sky.uDim, { value: 0.25 }, 1.8)
  tween(stars.uSuck, { value: 1 }, 2.0, { ease: ease.in })
  tween(c.pose, { z: 1.1, s: focusScale() * 0.94 }, 1.9, { ease: ease.inOut })
  tween(c, { glow: 0.95 }, 1.9, { ease: ease.in })
  tween(shake, { v: 1 }, 1.9, { ease: ease.in })
  const v = { v: 0 }
  tween(v, { v: 1 }, 1.9, { onUpdate: () => (vortex = v.v) })
  await after(1.95)
  if (gen !== flowGen) return
  vortex = 0
  shake.v = 0

  // and over
  let flashed = false
  const { x: hx, y: hy, z: hz, s: hs } = atDepth(focusPose(), 0.5)
  tween(c.pose, { flip: 0, x: hx, y: hy, z: hz, s: hs }, 1.0, {
    ease: ease.outBack,
    onUpdate: () => {
      if (!flashed && c.pose.flip < 0.5) {
        flashed = true
        c.material.uniforms.uFlash.value = 1
        tween(c.material.uniforms.uFlash, { value: 0 }, 0.9, { ease: ease.out })
        bloom.strength = 2
        tween(bloom, { strength: BLOOM }, 1.3, { ease: ease.out })
        chaseBurst(c)
        sfx.chase()
      }
    },
  })
  tween(stars.uSuck, { value: 0 }, 2.4, { ease: ease.out, delay: 0.2 })
  tween(sky.uDim, { value: 0.8 }, 2.2, { delay: 0.3 })
  tween(c, { glow: 0.42 }, 1.8, { delay: 0.3 })
  await after(1.0)
  if (gen !== flowGen) return
  collect(c.def.id)
  state = 'chaseHold'
  caption(c)
  dots(cards.length, cards.length)
  hint(narrow() ? 'Turn it in the light  ·  tap for your pull' : 'Turn it in the light  ·  tap to lay out your pull', 900)
}

async function spread() {
  if (state !== 'chaseHold' && state !== 'reveal') return
  state = 'spread'
  const gen = flowGen
  caption(null)
  dots(0, -1)
  hint(null)
  hud.skip.classList.add('gone')
  cards.forEach((c, k) => {
    c.tiltTarget.set(0, 0)
    tween(c.pose, spreadPose(k, cards.length), 1.0, { delay: (cards.length - 1 - k) * 0.05, ease: ease.inOut })
    tween(c, { glow: c.def.rarity === 'holo' ? 0.35 : c.pull.foil ? 0.18 : 0 }, 1)
  })
  sfx.swish()
  await after(1.0)
  if (gen !== flowGen || state !== 'spread') return
  showSpreadUi()
  hint('Pick up any card to look closer', 200)
}

function showSpreadUi() {
  const have = collection()
  hud.count.innerHTML = `Collection <b>${have.size}</b> / ${SET_SIZE}`
  hud.spread.classList.add('show')
}

function inspect(c) {
  if (state !== 'spread') return
  state = 'inspect'
  inspected = c
  if (hovered) hovered.hoverTarget = 0
  hovered = null
  c.hoverTarget = 0
  sfx.reveal(c.index, RARITY[c.def.rarity].rank)
  tween(c.pose, inspectPose(c), 0.7, { ease: ease.inOut })
  tween(c, { glow: c.def.rarity === 'holo' ? 0.45 : 0.3 }, 0.6)
  for (const o of cards) if (o !== c) tween(o.material.uniforms.uDim, { value: 0.3 }, 0.5)
  hud.spread.classList.remove('show')
  caption(c, c.index, cards.length)
  hint('Tap to put it back', 400)
  backdrop.tintTarget.copy(new THREE.Color(c.def.accent)).multiplyScalar(0.55)
}

function uninspect() {
  if (state !== 'inspect') return
  const c = inspected
  inspected = null
  state = 'spread'
  c.tiltTarget.set(0, 0)
  tween(c.pose, spreadPose(c.index, cards.length), 0.6, { ease: ease.inOut })
  tween(c, { glow: c.def.rarity === 'holo' ? 0.35 : c.pull.foil ? 0.18 : 0 }, 0.6)
  for (const o of cards) tween(o.material.uniforms.uDim, { value: 1 }, 0.5)
  caption(null)
  hint(null)
  showSpreadUi()
}

async function anotherPack() {
  if (state !== 'spread') return
  state = 'leaving'
  const gen = flowGen
  hud.spread.classList.remove('show')
  hint(null)
  sfx.swish()
  cards.forEach((c, k) =>
    tween(c.pose, { y: -view.visH * 1.4 - k * 0.15, rz: c.pose.rz + (Math.random() - 0.5) * 1.6, rx: 0.8 }, 0.85, {
      delay: k * 0.04,
      ease: ease.in,
    }),
  )
  await after(1.1)
  if (gen !== flowGen) return
  newPack(true)
}

// Jump straight to the end — for the impatient, and for the gallery thumbnail.
function skipToSpread() {
  if (state === 'boot' || state === 'spread' || state === 'inspect' || state === 'leaving' || state === 'chase') return
  flowGen++
  killTweens()
  tearing = false
  riding = false
  if (pack) {
    scene.remove(pack.group)
    pack.dispose()
    pack = null
  }
  vortex = 0
  shake.v = 0
  backdrop.sky.material.uniforms.uDim.value = 0.85
  backdrop.starMat.uniforms.uSuck.value = 0
  bloom.strength = BLOOM
  cards.forEach((c, k) => {
    c.flyUntil = 0
    c.group.visible = true
    Object.assign(c.pose, spreadPose(k, cards.length))
    c.tilt.set(0, 0)
    c.tiltVel.set(0, 0)
    c.material.uniforms.uFlash.value = 0
    c.material.uniforms.uDim.value = 1
    c.glow = c.def.rarity === 'holo' ? 0.35 : c.pull.foil ? 0.18 : 0
    collect(c.def.id)
  })
  cur = cards.length - 1
  state = 'spread'
  caption(null)
  dots(0, -1)
  hud.skip.classList.add('gone')
  backdrop.tintTarget.setRGB(0.5, 0.3, 0.2)
  showSpreadUi()
  hint('Pick up any card to look closer', 200)
}

// ---------------------------------------------------------------- sparkles

function ripBurst() {
  const s = packPose.s
  for (let i = 0; i < 160; i++) {
    const lx = (Math.random() - 0.5) * PACK_W
    _v.set(lx, (TEAR_Y - 0.5) * PACK_H, 0.05)
    pack.group.localToWorld(_v)
    sparkles.emit({
      x: _v.x,
      y: _v.y,
      z: _v.z + 0.1,
      vx: (Math.random() - 0.5) * 2.4 * s * 0.4,
      vy: (Math.random() * 3 + 0.6) * s * 0.4,
      vz: Math.random() * 1.2,
      color: spectrumColor(Math.random()).lerp(new THREE.Color(1, 1, 1), 0.35),
      size: 0.4 + Math.random() * 0.8,
      life: 0.9 + Math.random() * 1.2,
      drag: 1.6,
      gravity: 1.6,
    })
  }
}

function cardEdgePoint(c, out) {
  const u = Math.random() * 4
  const side = Math.floor(u)
  const f = u - side
  const hw = 0.5
  const hh = CARD_ASPECT / 2
  if (side === 0) out.set(-hw + f, hh, 0)
  else if (side === 1) out.set(hw, hh - f * CARD_ASPECT, 0)
  else if (side === 2) out.set(hw - f, -hh, 0)
  else out.set(-hw, -hh + f * CARD_ASPECT, 0)
  return c.group.localToWorld(out)
}

function cardBurst(c, n, accent) {
  c.group.updateMatrixWorld()
  c.group.getWorldPosition(_v2)
  for (let i = 0; i < n; i++) {
    cardEdgePoint(c, _v)
    const dx = _v.x - _v2.x
    const dy = _v.y - _v2.y
    const d = Math.hypot(dx, dy) || 1
    const sp = 0.6 + Math.random() * 1.6
    sparkles.emit({
      x: _v.x,
      y: _v.y,
      z: _v.z + 0.05,
      vx: (dx / d) * sp,
      vy: (dy / d) * sp,
      vz: Math.random() * 0.5,
      color: sparkleColor(accent),
      size: 0.35 + Math.random() * 0.65,
      life: 0.8 + Math.random() * 1.1,
      drag: 2.2,
      gravity: 0.3,
    })
  }
}

function chaseBurst(c) {
  c.group.updateMatrixWorld()
  c.group.getWorldPosition(_v2)
  for (let i = 0; i < 520; i++) {
    const a = Math.random() * Math.PI * 2
    const sp = 1.5 + Math.pow(Math.random(), 0.6) * 7.5
    sparkles.emit({
      x: _v2.x + Math.cos(a) * 0.3,
      y: _v2.y + Math.sin(a) * 0.3,
      z: _v2.z + 0.3,
      vx: Math.cos(a) * sp,
      vy: Math.sin(a) * sp * 0.8,
      vz: (Math.random() - 0.3) * 2,
      color: Math.random() < 0.4 ? new THREE.Color(1, 0.85, 0.6) : spectrumColor(a / 6.283 + Math.random() * 0.1).lerp(new THREE.Color(1, 1, 1), 0.25),
      size: 0.4 + Math.random() * 1.1,
      life: 1.2 + Math.random() * 1.8,
      drag: 1.7,
      gravity: 0.5,
    })
  }
}

function emitVortex(c, dt) {
  c.group.getWorldPosition(sparkles.attractor)
  const n = Math.floor(vortex * 150 * dt + Math.random())
  for (let i = 0; i < n; i++) {
    const a = Math.random() * Math.PI * 2
    const r = view.visH * (0.55 + Math.random() * 0.5)
    const x = sparkles.attractor.x + Math.cos(a) * r * 1.2
    const y = sparkles.attractor.y + Math.sin(a) * r
    sparkles.emit({
      x,
      y,
      z: -0.5 + Math.random(),
      vx: -Math.sin(a) * 1.8,
      vy: Math.cos(a) * 1.8,
      color: (Math.random() < 0.5 ? new THREE.Color(1, 0.8, 0.5) : spectrumColor(Math.random())).multiplyScalar(0.7),
      size: 0.25 + Math.random() * 0.5,
      life: 1.6 + Math.random(),
      drag: 0.6,
      pull: 9,
    })
  }
}

// glitter that slides off a foil card and drifts down
function drip(c, rate, dt) {
  if (Math.random() > rate * dt) return
  const u = (Math.random() - 0.5) * 0.96
  _v.set(u, -CARD_ASPECT / 2 + Math.random() * 0.25, 0.01)
  c.group.localToWorld(_v)
  sparkles.emit({
    x: _v.x,
    y: _v.y,
    z: _v.z + 0.05,
    vx: (Math.random() - 0.5) * 0.15,
    vy: -0.05 - Math.random() * 0.2,
    color: spectrumColor(Math.random()).lerp(new THREE.Color(1, 0.95, 0.85), 0.4),
    size: 0.25 + Math.random() * 0.45,
    life: 2 + Math.random() * 2,
    drag: 0.8,
    gravity: 0.35,
  })
}

// ---------------------------------------------------------------- input

const pointer = new THREE.Vector2()
const pointerSmooth = new THREE.Vector2()
let lastMove = -10
let down = null
const raycaster = new THREE.Raycaster()
const packPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

function setPointer(e) {
  pointer.set((e.clientX / view.w) * 2 - 1, -(e.clientY / view.h) * 2 + 1)
}

function packLocalX() {
  raycaster.setFromCamera(pointer, camera)
  packPlane.constant = -packPose.z
  if (!raycaster.ray.intersectPlane(packPlane, _v)) return null
  pack.group.worldToLocal(_v)
  return _v
}

function cardUnderPointer() {
  raycaster.setFromCamera(pointer, camera)
  const meshes = cards.filter((c) => c.group.visible).map((c) => c.mesh)
  const hit = raycaster.intersectObjects(meshes, false)[0]
  return hit ? cards.find((c) => c.mesh === hit.object) : null
}

canvas.addEventListener('pointerdown', (e) => {
  sfx.unlock()
  setPointer(e)
  lastMove = simT
  down = { x: e.clientX, y: e.clientY, t: performance.now(), moved: false, type: e.pointerType, tear: null }
  if (state === 'pack' && pack) {
    const p = packLocalX()
    if (p && Math.abs(p.x) < PACK_W / 2 + 0.05 && Math.abs(p.y) < PACK_H / 2 + 0.05) {
      down.tear = { lx: p.x }
      sfx.crinkle()
      document.body.classList.add('grab')
    }
  }
  canvas.setPointerCapture?.(e.pointerId)
})

window.addEventListener('pointermove', (e) => {
  setPointer(e)
  lastMove = simT
  if (down && Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) down.moved = true
  if (down?.tear && state === 'pack' && pack && !tearing) {
    const p = packLocalX()
    if (p) {
      const dx = Math.abs(p.x - down.tear.lx)
      down.tear.lx = p.x
      if (down.moved) setTear(tearProgress + (dx / PACK_W) * 1.15)
    }
  }
  if (e.pointerType === 'mouse' && (state === 'spread' || state === 'pack')) updateHover()
})

function updateHover() {
  if (state === 'spread') {
    const c = cardUnderPointer()
    if (c !== hovered) {
      if (hovered) hovered.hoverTarget = 0
      hovered = c
      if (c) {
        c.hoverTarget = 1
        sfx.hover()
      }
    }
    document.body.classList.toggle('pointer', !!c)
  } else if (state === 'pack' && pack) {
    const p = packLocalX()
    const over = p && Math.abs(p.x) < PACK_W / 2 && Math.abs(p.y) < PACK_H / 2
    document.body.classList.toggle('pointer', !!over)
  }
}

window.addEventListener('pointerup', (e) => {
  document.body.classList.remove('grab')
  if (!down) return
  const d = down
  down = null
  const quick = !d.moved && performance.now() - d.t < 600
  if (state === 'pack') {
    if (d.tear && (quick || tearProgress > 0.35)) autoTear()
    return
  }
  if (!quick && d.type !== 'mouse') {
    // a touch drag tilts the card; a flick sideways deals the next one
    const dx = e.clientX - d.x
    if (state === 'reveal' && Math.abs(dx) > view.w * 0.18) next()
    return
  }
  if (!quick) return
  advance()
})

function advance() {
  if (state === 'reveal') next()
  else if (state === 'chaseReady') chase()
  else if (state === 'chaseHold') spread()
  else if (state === 'spread') {
    const c = cardUnderPointer()
    if (c) inspect(c)
  } else if (state === 'inspect') uninspect()
}

window.addEventListener('keydown', (e) => {
  if (e.altKey || e.ctrlKey || e.metaKey) return
  const activate = e.key === ' ' || e.key === 'Enter'
  if (activate && e.target.closest?.('button')) return
  if (state === 'spread') {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault()
      browse(e.key === 'ArrowRight' ? 1 : -1)
    } else if (activate && hovered) {
      e.preventDefault()
      inspect(hovered)
    }
    return
  }
  if (activate || e.key === 'ArrowRight') {
    e.preventDefault()
    sfx.unlock()
    if (state === 'pack') autoTear()
    else advance()
  } else if (e.key === 'Escape') uninspect()
})

// Step the highlight through the spread, left to right as the cards lie.
function browse(dir) {
  if (document.activeElement?.closest?.('button')) document.activeElement.blur()
  const order = cards.slice().sort((a, b) => a.pose.x - b.pose.x)
  let i = hovered ? order.indexOf(hovered) : dir > 0 ? -1 : order.length
  i = (i + dir + order.length) % order.length
  if (hovered) hovered.hoverTarget = 0
  hovered = order[i]
  hovered.hoverTarget = 1
  sfx.hover()
}

hud.skip.addEventListener('click', (e) => {
  e.stopPropagation()
  sfx.unlock()
  skipToSpread()
})
$('#again').addEventListener('click', (e) => {
  e.stopPropagation()
  sfx.unlock()
  anotherPack()
})

// ---------------------------------------------------------------- frame

function resize() {
  view.w = window.innerWidth
  view.h = window.innerHeight
  view.aspect = view.w / view.h
  renderer.setPixelRatio(pixelRatio)
  renderer.setSize(view.w, view.h)
  const samples = pixelRatio < 1.5 ? 4 : 0
  for (const rt of [composer.renderTarget1, composer.renderTarget2]) {
    if (rt.samples !== samples) {
      rt.samples = samples
      rt.dispose()
    }
  }
  composer.setPixelRatio(pixelRatio)
  composer.setSize(view.w, view.h)
  camera.aspect = view.aspect
  camera.updateProjectionMatrix()
  view.visH = 2 * CAM_Z * Math.tan(THREE.MathUtils.degToRad(FOV / 2))
  view.visW = view.visH * view.aspect
  backdrop.resize(view.w, view.h, pixelRatio)
  sparkles.setScale(view.h, pixelRatio)
  relayout()
}

// After a resize, put everything that's at rest where the new layout wants it.
function relayout() {
  if (state === 'pack') packPose.s = packScale()
  const n = cards.length
  if (state === 'reveal' || state === 'chaseReady' || state === 'chaseHold') {
    cards.forEach((c, k) => {
      if (k < cur) Object.assign(c.pose, pilePose(k))
      else if (k === cur) Object.assign(c.pose, atDepth(focusPose({ flip: c.pose.flip }), c.pose.z))
      else Object.assign(c.pose, stackPose(k - cur))
    })
  } else if (state === 'spread' || state === 'inspect') {
    cards.forEach((c, k) => {
      if (c === inspected) Object.assign(c.pose, inspectPose(c))
      else Object.assign(c.pose, spreadPose(k, n))
    })
  }
}
window.addEventListener('resize', resize)

// Projected height of a card in device pixels, to pick its art resolution.
function cardPixels(c) {
  const depth = CAM_Z - c.group.position.z
  return ((c.pose.s * CARD_ASPECT) / (2 * depth * Math.tan(THREE.MathUtils.degToRad(FOV / 2)))) * view.h * pixelRatio
}

let frameNo = 0
let lastNow = performance.now() / 1000
let slowFrames = 0
let frameAvg = 1 / 60

function frame(ms) {
  const now = ms / 1000
  const rawDt = now - lastNow
  lastNow = now
  const dt = Math.min(rawDt, 1 / 20)
  simT += dt
  frameNo++
  stepTweens(now)

  // let a struggling GPU breathe: a sustained run of slow frames steps the
  // resolution down; frames slower than ~8 fps drop it to 1x at once
  if (rawDt < 1) frameAvg += (rawDt - frameAvg) * 0.25
  if (rawDt > 0.045 && rawDt < 0.5) slowFrames++
  else slowFrames = Math.max(0, slowFrames - 1)
  if (pixelRatio > 1 && frameNo > 4 && (frameAvg > 0.12 || slowFrames > 90)) {
    pixelRatio = frameAvg > 0.12 ? 1 : Math.max(1, pixelRatio - 0.5)
    slowFrames = 0
    frameAvg = 1 / 60
    resize()
  }

  light.set(-3.4 + Math.sin(simT * 0.31) * 1.4, 4.4 + Math.cos(simT * 0.23) * 0.9, 8)
  pointerSmooth.lerp(pointer, 1 - Math.exp(-dt * 4))
  const drift = reduceMotion ? 0 : 1
  camera.position.set(pointerSmooth.x * 0.3 * drift, pointerSmooth.y * 0.18 * drift, CAM_Z)
  camera.lookAt(0, 0, 0)

  const idle = simT - lastMove > 2.5 || (down === null && lastMove < 0)
  const touchHold = down && down.type !== 'mouse'
  const mouseLive = !idle && (!down || down.type === 'mouse')
  const sway = reduceMotion ? 0.25 : 1
  const aim = (target, kx, ky) => {
    if (mouseLive || touchHold) target.set(-pointer.y * kx, pointer.x * ky)
    else target.set(Math.sin(simT * 0.7) * kx * 0.42 * sway, Math.sin(simT * 0.5 + 1) * ky * 0.5 * sway)
  }

  // pack
  if (pack) {
    pack.uniforms.uTime.value = simT
    pack.uniforms.uHover.value = state === 'pack' ? 1 : 0
    if (state === 'pack') aim(_t2, 0.22, 0.38)
    else _t2.set(0, 0)
    // while it opens the lean decays on real time, so it has all but gone by
    // the time the cards let go of the pack, however slow the frames
    const leanDt = state === 'opening' ? Math.min(rawDt, 0.5) : dt
    packTilt.lerp(_t2, 1 - Math.exp(-leanDt * 5))
    pack.group.position.set(packPose.x, packPose.y + Math.sin(simT * 0.9) * 0.05 * packPose.s, packPose.z)
    pack.group.rotation.set(packPose.rx + packTilt.x, packPose.ry + packTilt.y, packPose.rz, 'YXZ')
    pack.group.scale.setScalar(packPose.s)
    pack.strip.position.set(stripPose.x, (TEAR_Y - 0.5) * PACK_H + ((1 - TEAR_Y) * PACK_H) / 2 + stripPose.y, stripPose.z)
    pack.strip.rotation.set(stripPose.rx, 0, stripPose.rz)
    pack.strip.visible = stripPose.y < 3
  }

  // cards
  const h = held()
  for (const c of cards) {
    if (!c.group.visible) continue
    if (c === h) aim(c.tiltTarget, 0.42, 0.55)
    else if (state === 'spread' && c === hovered) c.tiltTarget.set(-pointer.y * 0.12, pointer.x * 0.16)
    else c.tiltTarget.set(0, 0)
    if (riding) {
      c.tilt.set(0, 0)
      c.tiltVel.set(0, 0)
    } else c.stepTilt(dt)
    c.hover += (c.hoverTarget - c.hover) * (1 - Math.exp(-dt * 10))
    c.pop *= Math.exp(-dt * 7)
    if (c === h && state !== 'inspect') c.offset.y = Math.sin(simT * 1.1) * 0.025 * c.pose.s
    else c.offset.y *= 0.9
    if (shake.v > 0 && c === h && !reduceMotion) c.offset.set((Math.random() - 0.5) * shake.v * 0.035, (Math.random() - 0.5) * shake.v * 0.035, 0)
    else c.offset.x = c.offset.z = 0
    // The card in hand is drawn over the deck waiting a few hundredths behind
    // it: tilted, its edges would otherwise swing back through those cards.
    // One on its way to the pile stays over everything until it lands. Both
    // still write depth, so what lies behind them stays hidden.
    const dealing = state === 'reveal' || state === 'chaseReady' || state === 'chase' || state === 'chaseHold'
    const flying = dealing && c.flyUntil > now
    const inHand = c === h && state !== 'inspect'
    c.mesh.renderOrder = flying ? 3 : inHand ? 2 : 0
    c.material.depthFunc = flying || inHand ? THREE.AlwaysDepth : THREE.LessEqualDepth
    c.applyPose()
    if (riding && pack) {
      // riding up inside the pack: turn about the pack's own pivot, exactly as
      // it turns, so no card (face up or face down) leans out through its front
      _v.subVectors(c.group.position, pack.group.position).applyEuler(pack.group.rotation)
      c.group.position.copy(pack.group.position).add(_v)
      c.group.quaternion.premultiply(_qPack.setFromEuler(pack.group.rotation))
    }
    c.setTime(simT)
  }

  // paint the art that's on show: big cards at full resolution every frame,
  // small ones at low resolution on alternate frames
  for (const c of cards) {
    if (!c.group.visible) continue
    const hidden = (state === 'reveal' || state === 'chaseReady') && c.index > cur
    if (hidden) continue
    const hi = cardPixels(c) > 480
    if (hi || (frameNo + c.index) % 2 === 0 || !c.artFresh.lo) {
      c.updateViewTilt(camera)
      c.renderArt(renderer, simT, hi)
    }
  }

  // sparkles
  if (vortex > 0 && h) emitVortex(h, dt)
  for (const c of cards) {
    if (!c.group.visible || c.pose.flip > 0.5) continue
    if (c.def.rarity === 'holo' && (state === 'chaseHold' || state === 'spread' || c === inspected)) drip(c, 7, dt)
    else if (c.pull.foil && (c === h || state === 'spread')) drip(c, 1.5, dt)
  }
  if (state === 'chaseReady' && h) {
    // light leaking round the face-down card
    h.glow = 0.5 + 0.18 * Math.sin(simT * 3.2)
    if (Math.random() < dt * 30) {
      cardEdgePoint(h, _v)
      sparkles.emit({
        x: _v.x,
        y: _v.y,
        z: _v.z + 0.05,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: spectrumColor(Math.random()),
        size: 0.3 + Math.random() * 0.5,
        life: 0.8 + Math.random() * 0.6,
        drag: 1.5,
      })
    }
  }
  sparkles.update(dt, simT)
  backdrop.update(dt, simT, pointerSmooth)
  backdrop.paint(renderer)
  finish.uniforms.uTime.value = simT
  composer.render()
  requestAnimationFrame(frame)
}

// ---------------------------------------------------------------- boot

async function boot() {
  resize()
  // the card faces are typeset on canvas, so the fonts must be in first
  try {
    await Promise.race([
      Promise.all([
        document.fonts.load('600 50px Jost'),
        document.fonts.load('500 30px Jost'),
        document.fonts.load('400 24px Jost'),
        document.fonts.load('italic 500 32px "Cormorant Garamond"'),
      ]),
      new Promise((r) => setTimeout(r, 3000)),
    ])
  } catch {}
  warmArt(renderer, ART_KINDS)
  newPack(false)
  requestAnimationFrame((ms) => {
    lastNow = ms / 1000
    frame(ms)
  })
  requestAnimationFrame(() => document.body.classList.add('ready'))
}

boot()
