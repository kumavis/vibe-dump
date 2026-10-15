import * as THREE from 'three'
import { WORLD } from './data/world.js'
import { SPECIES } from './data/species.js'
import { START_KIT } from './data/items.js'
import { EventBus } from './core/events.js'
import { Input } from './core/input.js'
import { smoothstep } from './core/mathx.js'
import { Island } from './world/island.js'
import { Physics } from './world/physics.js'
import { buildTerrain } from './world/terrain.js'
import { buildWater } from './world/water.js'
import { Sky } from './world/sky.js'
import { Vegetation } from './world/vegetation.js'
import { buildStructures } from './world/structures.js'
import { FX } from './world/fx.js'
import { Flags, Stats } from './game/state.js'
import { Stealth } from './game/stealth.js'
import { Scoring } from './game/scoring.js'
import { Objectives } from './game/objectives.js'
import { Ecology } from './actors/ecology.js'
import { Player } from './player/player.js'
import { Inventory } from './player/inventory.js'
import { Interaction } from './player/interaction.js'
import { Weapons } from './player/weapons.js'
import { Projectiles } from './player/projectiles.js'
import { Science } from './player/science.js'
import { Photos } from './player/photos.js'
import { Helicopter } from './vehicles/helicopter.js'
import { Jeep } from './vehicles/jeep.js'
import { Audio } from './audio/audio.js'
import { HUD } from './ui/hud.js'
import { MapView, paintRelief, reliefTexture } from './ui/map.js'
import { Journal } from './ui/journal.js'
import { Menus, QUALITY } from './ui/menus.js'
import { buildLadder, detectRung, readGpuInfo, TierController } from './core/quality.js'

// Composition root. Builds every service onto one shared context `G`, then
// runs the frame loop. Systems only know each other through G and the event
// bus, so swapping one out (a new AI, a different weapon model) is local.

const params = new URLSearchParams(location.search)
const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()))

async function boot() {
  const G = {
    time: 0,
    frame: 0,
    started: false,
    paused: false,
    mode: 'title',
    species: SPECIES,
    discovered: new Set(),
    godMode: params.has('god'),
    vehicle: null, // the vehicle the player is in, if any
    events: new EventBus(),
  }
  window.__G = G

  // ---- renderer, scene, camera
  const canvas = document.getElementById('game')
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.05
  renderer.autoClear = false
  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(72, innerWidth / innerHeight, 0.1, 3000)
  scene.add(camera)
  Object.assign(G, { renderer, scene, camera })
  await nextFrame()

  // ---- world
  const cfg = { ...WORLD, seed: params.has('seed') ? Number(params.get('seed')) : WORLD.seed }
  G.island = new Island(cfg)
  G.flags = new Flags(G.events)
  G.stats = new Stats(G.events)
  G.inventory = new Inventory(G.events)
  G.interact = new Interaction(G)
  G.physics = new Physics(G.island)
  scene.add(buildTerrain(G.island))
  const water = buildWater(G.island)
  scene.add(water.group)
  G.sky = new Sky(scene, { hours: 7.4 })
  G.reliefCanvas = paintRelief(G.island, 512)
  G.mapTexture = reliefTexture(G.reliefCanvas)
  await nextFrame()
  G.veg = new Vegetation(G.island, G.physics, scene, cfg.seed)
  G.fx = new FX(scene, camera)
  G.player = new Player(G)
  G.ui = { showNote: (entry) => showNote(entry) }
  G.toast = (text, kind, seconds) => G.hud?.toast(text, kind, seconds)
  buildStructures(G)
  G.projectiles = new Projectiles(G)
  G.hazards = G.projectiles
  G.stealth = new Stealth(G)
  G.ecology = new Ecology(G)
  G.ecology.populate(cfg.seed + 99)
  G.wind = { x: 0, z: 0, strength: cfg.wind.strength, angle: cfg.wind.angle }
  await nextFrame()

  // ---- player-side systems
  G.weapons = new Weapons(G)
  G.science = new Science(G)
  G.photos = new Photos(G)
  G.scoring = new Scoring(G)
  G.objectives = new Objectives(G)
  const lab = G.island.poi.fieldlab
  G.heli = new Helicopter(G, lab.pad, lab.padYaw)
  G.jeep = Jeep.atStation(G)
  G.vehicles = [G.heli, G.jeep]
  G.audio = new Audio()
  G.hud = new HUD(G)
  G.map = new MapView(G, document.getElementById('map'))
  G.journal = new Journal(G, document.getElementById('journal'))
  G.inventory.grant(START_KIT)
  const spawn = G.island.poi.dock.spawn
  G.player.teleport(spawn.pos, spawn.yaw)

  const input = new Input(canvas)
  G.input = input

  // ---- settings
  // Graphics is a manual tier, or Auto: a first guess from the GPU, screen and
  // core count, then a controller that watches frame times through the title
  // and the first 20 s of play and steps the tier/pixel ratio (core/quality.js).
  const ladder = buildLadder(devicePixelRatio)
  const gpu = readGpuInfo(renderer.getContext())
  const guess = detectRung({ ...gpu, width: innerWidth, height: innerHeight, dpr: devicePixelRatio }, ladder)
  // An automated browser (the gallery's thumbnail shot, headless playtests)
  // renders in software, where Auto would pick Low and keep stepping down.
  // Pin it to the rung most players see — Medium — and don't adapt.
  let mediumRung = guess.index
  ladder.forEach((r, i) => {
    if (r.tier === 'medium') mediumRung = i
  })
  const pinned = navigator.webdriver === true
  G.gfx = { gpu, guess, ladder, auto: null, autoIndex: pinned ? mediumRung : guess.index, pinned, tier: null, pixelRatio: 0 }
  let playClock = 0
  const applyQuality = (tier, pixelRatio) => {
    if (G.gfx.tier !== tier) {
      const q = QUALITY[tier]
      G.sky.setShadowSize(q.shadows)
      G.veg.setQuality(q)
      G.gfx.tier = tier
    }
    if (G.gfx.pixelRatio !== pixelRatio) {
      G.gfx.pixelRatio = pixelRatio
      renderer.setPixelRatio(pixelRatio)
      resize()
    }
  }
  // "Auto · Low · 50% res": the share of the screen's native resolution (per
  // axis) the rung renders at, said only when it is below native
  const showAutoTier = () => {
    const r = ladder[G.gfx.autoIndex]
    const native = r.pixelRatio / devicePixelRatio
    G.menus.setAutoLabel(QUALITY[r.tier].label + (native < 0.99 ? ` · ${Math.round(native * 100)}% res` : ''))
  }
  const applySettings = (s) => {
    if (s.quality !== 'auto' && QUALITY[s.quality]) {
      G.gfx.auto = null // a manual choice ends adaptation
      applyQuality(s.quality, Math.min(devicePixelRatio, QUALITY[s.quality].pixelRatio))
    } else {
      if (!G.gfx.auto && !G.gfx.pinned) {
        G.gfx.auto = new TierController(ladder, G.gfx.autoIndex)
        G.gfx.auto.startedAt = playClock
      }
      const r = G.gfx.auto ? G.gfx.auto.rung : ladder[G.gfx.autoIndex]
      applyQuality(r.tier, r.pixelRatio)
    }
    showAutoTier()
    input.sensitivity = 0.0022 * s.sensitivity
    input.invertY = s.invertY
    G.audio.setVolume(s.volume)
  }
  // Auto's frame clock: its own rAF callback sees the same frame intervals as
  // the game loop without touching it.
  let probeLast = 0
  const probe = (now) => {
    requestAnimationFrame(probe)
    const ms = probeLast ? now - probeLast : 0
    probeLast = now
    const ctl = G.gfx.auto
    if (!ctl || !ms || document.hidden) return
    if (G.mode === 'play' && !G.paused) playClock += ms / 1000
    if (!ctl.settled && playClock - ctl.startedAt > 20) ctl.settle()
    if (!ctl.sample(ms)) return
    G.gfx.autoIndex = ctl.index
    applyQuality(ctl.rung.tier, ctl.rung.pixelRatio)
    showAutoTier()
  }
  const resize = () => {
    renderer.setSize(innerWidth, innerHeight)
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()
    G.weapons.vm.setAspect(camera.aspect)
    const h = renderer.getDrawingBufferSize(new THREE.Vector2()).y
    G.fx.setScale(h / (2 * Math.tan(THREE.MathUtils.degToRad(36))))
  }
  addEventListener('resize', resize)

  // ---- menus and modes
  const anyOverlay = () => G.map.open || G.journal.open || G.menus.noteOpen
  const setPaused = (p) => {
    G.paused = p
  }
  const resume = (fromOverlay) => {
    if (G.mode === 'title') return
    G.menus.show('pause', false)
    if (fromOverlay !== true) {
      G.map.toggle(false)
      G.journal.toggle(false)
    }
    if (!anyOverlay()) setPaused(false)
    // a menu button left focused would take Space/Enter meant for the game
    document.activeElement?.blur?.()
    input.lock()
    G.audio.init()
  }
  const pause = () => {
    if (G.mode !== 'play' || G.paused) return
    setPaused(true)
    G.menus.show('pause')
  }
  const showNote = (entry) => {
    G.menus.showNote(entry)
    setPaused(true)
  }
  const start = () => {
    G.audio.init()
    G.mode = 'play'
    G.started = true
    document.body.classList.add('playing')
    input.lock()
    G.player.fade = 1.5
    G.objectives.refresh()
    const tips = [
      ['Day 1, 07:30. The boat leaves at dusk the day you call for it. Make the trip count.', 'info', 7],
      ['Field Scanner [1] catalogues species. Tranq Pistol [2] for small animals. J opens the journal.', 'info', 9],
      ['Compys scavenge the beach where the pier comes ashore. Field Camera [6]: hold RMB to raise it, wheel zooms, click shoots.', 'info', 10],
      ['Crouch [C] in ferns and tall grass. The eye bottom-left shows how visible you are.', 'info', 10],
    ]
    tips.forEach(([t, k, s], i) => setTimeout(() => G.toast(t, k, s), 1500 + i * 3500))
  }
  G.menus = new Menus(G, {
    start,
    resume,
    respawn: () => {
      G.menus.show('death', false)
      G.vehicle?.exit(true)
      const st = G.island.poi.station
      const p = new THREE.Vector3(st.x + Math.sin(st.yaw) * 7, 0, st.z + Math.cos(st.yaw) * 7)
      p.y = G.physics.groundAt(p.x, p.z, st.y + 3)
      G.player.revive(p, st.yaw + Math.PI)
      input.lock()
    },
    applySettings,
    openJournal: () => {
      G.menus.show('pause', false)
      G.journal.toggle(true)
    },
  })
  applySettings(G.menus.settings)
  requestAnimationFrame(probe)

  input.onLockChange = (locked) => {
    if (!locked && G.mode === 'play' && !G.paused && !anyOverlay()) pause()
  }
  canvas.addEventListener('click', () => {
    if (G.mode === 'play' && !G.paused) input.lock()
  })
  addEventListener('keydown', (e) => {
    if (e.code !== 'Escape' || G.mode !== 'play') return
    if (anyOverlay()) {
      if (G.menus.noteOpen) G.menus.closeNote()
      G.map.toggle(false)
      G.journal.toggle(false)
      setPaused(G.menus.noteOpen)
    } else if (!G.paused) pause()
  })
  G.events.on('player:died', () => setTimeout(() => G.menus.show('death'), 2200))
  G.events.on('expedition:complete', () =>
    setTimeout(() => {
      G.menus.showDebrief()
      setPaused(true)
      input.unlock()
    }, 2500),
  )

  // ---- attract mode: orbit a herd behind the title card
  const plains = G.island.cfg.plains
  const showcase = G.ecology.herds
    .filter((h) => h.species === 'triceratops')
    .sort((a, b) => Math.hypot(a.home.x - plains.x, a.home.z - plains.z) - Math.hypot(b.home.x - plains.x, b.home.z - plains.z))[0] || G.ecology.herds[0]
  const attract = { angle: 1.3, focus: { x: showcase.home.x, z: showcase.home.z } }
  // Lay the herd out for the opening frame (and the gallery thumbnail): a
  // staggered line about a body length apart, all grazing side-on to the
  // camera's first position, so it reads as animals rather than a pile.
  {
    const n = showcase.records.length
    const len = SPECIES[showcase.species].radius * 4
    const ax = Math.cos(attract.angle) // from the herd towards the camera
    const az = Math.sin(attract.angle)
    const yaw = Math.atan2(az, -ax) // side-on, facing screen-left (-az, ax): into the frame
    showcase.records.forEach((r, i) => {
      const along = (i - (n - 1) / 2) * len * 0.6
      const depth = (i % 2 ? 0.4 : -0.4) * len
      r.x = showcase.home.x + az * along + ax * depth
      r.z = showcase.home.z - ax * along + az * depth
      r.yaw = yaw + (((i * 7) % 5) - 2) * 0.1
    })
  }
  if (params.has('play')) start()

  // ---- loop
  let last = performance.now()
  let discoverT = 0
  let booted = 0
  const tmpFocus = new THREE.Vector3()
  function simulate(dt) {
    G.frame++
    const playing = G.mode === 'play'

    // overlay toggles work even while paused
    if (playing && G.player.alive) {
      if (input.pressed('map') && !G.journal.open && !G.menus.noteOpen) {
        G.map.toggle()
        setPaused(anyOverlay())
      }
      if (input.pressed('journal') && !G.map.open && !G.menus.noteOpen) {
        G.journal.toggle()
        setPaused(anyOverlay())
      }
      if (G.menus.noteOpen && input.pressed('interact') && G.frame > (G.noteFrame || 0)) G.menus.closeNote()
    }

    if (playing && !G.paused) {
      G.time += dt
      // read once: the E that steps you out of a vehicle must not board it again
      const riding = G.vehicle
      if (!riding) G.player.update(dt, input)
      for (const v of G.vehicles) v.update(dt, input)
      if (G.vehicle) G.vehicle.updateCamera(camera, dt)
      G.weapons.update(dt, input)
      if (!riding && G.player.alive) G.interact.update(dt, G.player.eye, G.player.look, input.pressed('interact'), input.down('interact'))
      if (G.menus.noteOpen) G.noteFrame = G.frame + 1
      G.projectiles.update(dt)
      G.stealth.update(dt)
      const veh = G.vehicle
      const focus = veh ? veh.pos : G.player.pos
      G.ecology.loadRadius = veh ? veh.tune.load.radius : 220
      G.ecology.unloadRadius = veh ? veh.tune.load.unload : 280
      G.ecology.update(dt, focus)
      G.objectives.update(dt)
      discoverT -= dt
      if (discoverT <= 0) {
        discoverT = 0.5
        for (const p of G.island.pois) {
          if (G.discovered.has(p.id)) continue
          if (Math.hypot(p.x - focus.x, p.z - focus.z) < 75) {
            G.discovered.add(p.id)
            G.toast(`Discovered: ${p.name}`, 'loot')
          }
        }
      }
      if (G.map.open) G.map.draw()
    } else if (G.mode === 'title') {
      G.time += dt
      attract.angle += dt * 0.03
      const f = attract.focus
      const R = 19
      const cx = f.x + Math.cos(attract.angle) * R
      const cz = f.z + Math.sin(attract.angle) * R
      const gy = Math.max(G.island.heightAt(cx, cz), G.island.waterAt(cx, cz))
      camera.position.set(cx, gy + 2.6, cz)
      let fy = G.island.heightAt(f.x, f.z) + 3.4
      const loaded = showcase.loaded
      if (loaded.length) {
        let sx = 0
        let sz = 0
        for (const c of loaded) {
          sx += c.pos.x
          sz += c.pos.z
        }
        attract.focus.x += (sx / loaded.length - attract.focus.x) * dt * 0.3
        attract.focus.z += (sz / loaded.length - attract.focus.z) * dt * 0.3
        fy = G.island.heightAt(attract.focus.x, attract.focus.z) + 3.4
      }
      camera.lookAt(f.x, fy, f.z)
      // keep the herd clear of the title card on the left
      if (innerWidth > 800) camera.rotateY(0.3)
      camera.updateMatrixWorld()
      G.ecology.update(dt, attract.focus)
    }

    // world presentation runs in every mode
    const cam = camera.position
    const wa = G.wind.angle + Math.sin(G.time / 90) * 0.5
    G.wind.x = Math.cos(wa)
    G.wind.z = Math.sin(wa)
    const flyingNow = G.vehicle?.kind === 'heli'
    const alt = flyingNow ? G.heli.pos.y - G.island.heightAt(G.heli.pos.x, G.heli.pos.z) : 0
    G.sky.fogBoost = smoothstep(0.2, 0.8, G.island.sample(G.island.d.canopy, cam.x, cam.z)) * (flyingNow ? 0 : 1)
    tmpFocus.copy(playing ? (G.vehicle ? G.vehicle.pos : G.player.pos) : cam)
    G.sky.update(playing && !G.paused ? dt : dt * 0.2, tmpFocus, { altitude: alt, camera: cam })
    G.veg.update(dt, cam, 0.8 + 0.4 * Math.sin(G.time * 0.3) * G.wind.strength)
    water.uniforms.uTime.value += dt
    G.fx.update(G.paused ? 0 : dt)
    if (G.boat) G.boat.position.y = Math.sin(G.time * 0.9) * 0.12 - 0.05
    G.audio.setListener(cam, G.vehicle ? G.vehicle.camYaw : G.player.yaw)
    G.audio.update(dt, G)
    if (playing) G.hud.update(dt)
    input.endFrame()
  }

  function draw() {
    renderer.clear()
    renderer.render(scene, camera)
    if (G.photos.pending.length) G.photos.capture(renderer.domElement) // photo = scene only, no view model
    if (G.mode === 'play' && !G.vehicle && G.player.alive) G.weapons.vm.render(renderer)
  }

  function frame(now) {
    requestAnimationFrame(frame)
    const dt = Math.min(0.05, (now - last) / 1000)
    last = now
    simulate(dt)
    draw()
    if (booted < 4 && ++booted === 4) document.getElementById('boot')?.remove()
  }
  requestAnimationFrame(frame)
  // test hook: fast-forward the simulation without rendering
  window.__step = (seconds, dt = 1 / 30) => {
    for (let i = 0, n = Math.round(seconds / dt); i < n; i++) simulate(dt)
  }
}

boot().catch((err) => {
  console.error(err)
  const b = document.getElementById('boot')
  if (b) b.innerHTML = `<div style="max-width:70ch;padding:20px">The island failed to grow: ${String(err && err.message)}</div>`
})
