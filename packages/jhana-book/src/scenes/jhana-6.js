// jhana-6 — infinite consciousness (viññāṇañcāyatana).
//
// Indra's net: a lattice of thin paper struts (V-fold trusses, a needle spire,
// leaf flaps — see ./jhana-6/net.js for the folds) with a jewel of light at
// every node. Each jewel knows two to four neighbours. On every in-breath one
// jewel lights and its neighbours answer a beat later, hop by hop (~0.6 s),
// each answer a little fainter, until the wave has washed through the net and
// faded; where it passes, the struts themselves glow. Between waves the jewels
// breathe softly with the breath. A few motes of light hang in the air, and one
// soft teal light sits above the net. Alive, not busy: one wave per breath.

import { createGlows } from './jhana-5/glows.js'
import { createDust } from './jhana-5/dust.js'
import { buildNet } from './jhana-6/net.js'

const HOP = 0.6 // seconds per hop
const DECAY = 0.75 // each answer this much of the call
const FLOOR = 0.1 // a wave stops when its answers get this faint
const HEAT_TAU = 1.3 // how long a lit jewel takes to fade (s)
const ATTACK_TAU = 0.22 // how softly a jewel brightens (s)

// The story layer (DESIGN.md addendum). `stage` chases frame.beat with
// STAGE_TAU (≈ 3 s to settle) so nothing changes as a cut.
const STAGE_TAU = 1.0
const UNISON_RISE = 1.4 // "Turn toward the knowing": all jewels swell together over this (s)…
const UNISON_TAU = 2.2 // …then settle back into the ordinary waves with this time constant

const smooth = (x) => x * x * (3 - 2 * x)

export default {
  id: 'jhana-6',
  label: '6',
  title: 'Infinite Consciousness',
  pali: 'viññāṇañcāyatana',
  line: 'Knowing, without edge.',
  hinge: 'beyond space',
  guide: [
    'What knows the space?',
    'Turn toward the knowing.',
    'It has no edge either.',
  ],
  tab: {
    text: '“Consciousness is infinite.” To behold boundless space, the knowing must be boundless; attention turns to the knowing.',
    source: 'MN 111 · Brasington',
  },
  palette: { bg: '#03111a', paper: '#123540', ink: '#c3efe6', accent: '#62efd5' },
  audio: { root: 77.78, intervals: [0, 7, 11, 14, 18], brightness: 0.5, shimmer: 0.4, breathe: 0.5 },

  build(ctx) {
    const { THREE, group, paper, quality } = ctx

    // Pale, faintly luminous card stock: the struts glow a little by
    // themselves (bioluminescence), more where a wave is passing.
    const strut = (color, glow) =>
      new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        emissive: new THREE.Color(glow),
        emissiveIntensity: 0.08,
        roughness: 0.85,
        side: THREE.DoubleSide,
      })
    const materials = {
      teal: strut('#94e6d6', '#37e0c4'),
      violet: strut('#b7a8f2', '#8a6cff'),
      aqua: strut('#86d9e2', '#2fc6e0'),
      spire: strut('#c9bcff', '#9a7cff'),
      leaf: strut('#9ae8cf', '#3fe0b0'),
    }
    const net = buildNet(paper, materials, paper.rng('jhana-6 · cells'))
    const N = net.nodes.length

    // neighbour lists from the edges
    const nbrs = Array.from({ length: N }, () => [])
    for (const [a, b] of net.edges) {
      if (!nbrs[a].includes(b)) nbrs[a].push(b)
      if (!nbrs[b].includes(a)) nbrs[b].push(a)
    }

    // ---- the jewels ------------------------------------------------------------
    const TONE = { crown: '#c4b0ff', crease: '#7ff5df', knot: '#5fe6d0', tip: '#8cf0c8' }
    const jewels = createGlows(THREE, group, {
      anchors: net.nodes.map((n) => n.anchor),
      sizes: net.nodes.map((n) => n.size * 1.25),
      colors: net.nodes.map((n) => TONE[n.kind] || '#5fe6d0'),
      hot: '#eafffb',
      lift: 0.03,
    })
    const rnd = paper.rng('jhana-6 · viññāṇa')
    const phase = new Float32Array(N).map(() => rnd() * Math.PI * 2) // each jewel's own slow shimmer
    const lag = new Float32Array(N).map(() => 0.88 + 0.24 * rnd()) // hops are not quite metronomic
    const heat = new Float32Array(N)
    const shown = new Float32Array(N)
    const pendingAt = new Float64Array(N).fill(Infinity)
    const pendingE = new Float32Array(N)
    const firedWave = new Int32Array(N).fill(-1)
    let wave = -1
    let originIdx = 0
    let lastPhase = 'in' // the first wave comes from firstWaveAt, not from a phase edge
    let firstWaveAt = 0.6 // the first wave comes shortly after the page opens

    const fire = (i, e, time) => {
      heat[i] = Math.max(heat[i], e)
      firedWave[i] = wave
      const next = e * DECAY
      if (next < floor) return
      const list = nbrs[i]
      for (let k = 0; k < list.length; k++) {
        const j = list[k]
        if (firedWave[j] === wave || pendingAt[j] !== Infinity) continue
        pendingAt[j] = time + HOP * lag[j]
        pendingE[j] = next
      }
    }
    const startWave = (time) => {
      wave++
      pendingAt.fill(Infinity)
      fire(net.origins[originIdx % net.origins.length], 1.15, time)
      originIdx++
    }
    let floor = FLOOR // lowered at beat 3 so every wave carries one hop further

    // ---- one soft teal light above the net (no shadows) ---------------------------
    const light = new THREE.PointLight(new THREE.Color('#5ff0d6'), 0, 2.2, 2)
    light.position.set(0, 0.62, -0.12)
    group.add(light)

    // ---- motes: awareness in the air, a sparse slow field above the pages --------
    const motes = createDust(THREE, paper.rng('jhana-6 motes'), {
      count: quality === 'low' ? 90 : 180,
      wrapX: 1.3,
      place(rr, o) {
        do {
          o.x = (rr() * 2 - 1) * 1.3
          o.y = 0.06 + rr() * 1.0
        } while (Math.atan2(Math.abs(o.x), o.y) > 1.33)
        o.z = -0.8 + rr() * 1.15
        o.size = 0.008 + Math.pow(rr(), 3) * 0.016
        o.drift = (rr() - 0.5) * 0.008
      },
      color(rr, c) {
        c.set(rr() < 0.65 ? '#6ff2da' : '#a994ff')
        c.multiplyScalar(0.45 + 0.4 * rr())
      },
    })
    group.add(motes.points)

    const setGlow = new Float32Array(net.sets.length)
    let stage = -1 // the eased beat (−1 until the first frame, which snaps)
    let unisonAt = -1 // when the all-together lighting began (−1: not yet)
    let unisonDone = false // it happens once: the first time the reader reaches beat 2

    return {
      update(frame) {
        const { dt, time, reveal, breath, breathPhase, openness } = frame
        const beat = frame.beat ?? 0
        const pull = frame.pull ?? 0
        const first = stage < 0
        stage = first ? beat : stage + (beat - stage) * (1 - Math.exp(-dt / STAGE_TAU))
        // beat 3 "It has no edge either": waves reach one hop further, glow rises ~15 %
        const edgeless = Math.min(1, Math.max(0, stage - 2))
        floor = FLOOR * (1 - 0.25 * edgeless) // DECAY = 0.75: one more answer before the cut-off
        const lift = 1 + 0.15 * edgeless
        // beat 2 "Turn toward the knowing": once, every jewel lights together
        if (first && beat >= 2) unisonDone = true // arrived here already past it: don't replay
        if (!unisonDone && beat === 2 && reveal > 0.3) {
          unisonAt = time
          unisonDone = true
        }
        let unison = 0
        if (unisonAt >= 0) {
          const u = time - unisonAt
          unison = u < UNISON_RISE ? smooth(u / UNISON_RISE) : Math.exp(-(u - UNISON_RISE) / UNISON_TAU)
          if (unison < 0.003 && u > UNISON_RISE) unisonAt = -1
        }
        // pull tab: the whole net lit at once, breathing, for as long as it is out
        let all = 0.85 * unison + pull * (0.6 + 0.25 * breath)

        // a new wave on each in-breath (and one soon after the page first opens)
        if (breathPhase === 'in' && lastPhase === 'out' && reveal > 0.3) startWave(time)
        lastPhase = breathPhase
        if (firstWaveAt >= 0 && time > firstWaveAt && reveal > 0.3) {
          startWave(time)
          firstWaveAt = -1
        }

        // answers arriving
        for (let i = 0; i < N; i++) {
          if (pendingAt[i] <= time) {
            const e = pendingE[i]
            pendingAt[i] = Infinity
            if (firedWave[i] !== wave) fire(i, e, time)
          }
        }

        // heat fades, the shown glow eases toward base + heat (no snapping)
        const fadeK = Math.exp(-dt / HEAT_TAU)
        const easeK = 1 - Math.exp(-dt / ATTACK_TAU)
        let total = 0
        setGlow.fill(0)
        for (let i = 0; i < N; i++) {
          heat[i] *= fadeK
          const base = (0.22 + 0.2 * breath + 0.05 * Math.sin(time * 0.31 + phase[i])) * lift
          shown[i] += (base + 1.2 * Math.max(heat[i], all) - shown[i]) * easeK
          jewels.glow[i] = shown[i]
          total += heat[i]
        }
        for (let k = 0; k < net.sets.length; k++) {
          const ids = net.sets[k].nodes
          let h = 0
          for (let j = 0; j < ids.length; j++) h += heat[ids[j]]
          h = Math.max(h / ids.length, all)
          net.sets[k].material.emissiveIntensity = ((0.06 + 0.05 * breath) * lift + 0.55 * h) * (0.3 + 0.7 * reveal)
        }

        jewels.update(reveal)
        motes.update(time, openness, reveal * reveal * 0.9)
        light.intensity = reveal * ((0.35 + 0.25 * breath) * lift + 0.06 * Math.min(6, total) + 0.25 * all)
      },
      dispose() {
        jewels.dispose()
        motes.dispose()
        for (const k in materials) materials[k].dispose()
        light.dispose()
        paper.dispose()
      },
    }
  },
}
