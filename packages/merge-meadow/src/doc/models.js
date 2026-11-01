// Rig models (design §17): data-driven articulated looks. A model is document
// data — a node tree with names (geometry), clips of tracks over named nodes
// (animation) and a state -> clips table (controller) — interpreted by one
// small renderer (track C's rig kind). Nothing here knows what an animal is
// beyond the seed library below, which is plain data like the presets.
//
//   doc.models[name] = { extends, stride, runSpeed, description?, nodes, animations, controller, rev }
//   node  = { name?, shape?, p?, r?, s?, color?, roughness?, metalness?, anchor?, children?, remove? }
//   clip  = { loop?: true, once?: false, duration?, tracks: { '<node>.<channel>': expression | [[t, v], ...] } }
//   controller = { states: { [state]: clip | [clips] }, blend: seconds }
//
// `extends` (design §17.3): a model starts from its base's resolved model.
//   nodes      patch BY NAME: an entry whose name the base has (anywhere in its
//              tree) overlays that node's fields (null deletes a field; p/r/s
//              replace whole) and its `children` are patched/added under it; an
//              entry with `remove: true` deletes that node and its subtree; any
//              other entry is a NEW node, added where it is nested (top level ->
//              a root). So a species part goes under a base bone by nesting it
//              in a stub that names the bone: { name: 'head', children: [ear] }.
//   animations merge BY CLIP NAME: clip fields overlay, tracks merge by key
//              (null removes a base track), a null clip removes the clip.
//   controller shallow-merges; `states` merges by state name (null removes).
//   stride, runSpeed, description: the most derived value wins.
// Depth ≤ LIMITS.extendsDepth hops; a cycle or a missing base throws.
import { plain, isObj, Counter } from './convert.js'
import { isName, own } from './schema.js'
import { checkJSON } from './validate.js'
import { checkExpr } from './expr.js'

export const CHANNELS = Object.freeze(['rx', 'ry', 'rz', 'px', 'py', 'pz', 'sx', 'sy', 'sz'])
export const LIMITS = Object.freeze({ nodes: 200, tracks: 400, depth: 8, extendsDepth: 8 })
export const SHAPES = Object.freeze(['box', 'sphere', 'cone', 'cylinder', 'capsule']) // the render's shape set (resources.js)
export const DEFAULTS = Object.freeze({ stride: 1, runSpeed: 4, blend: 0.15 })
export const MAX_KEYFRAMES = 512

const TRACK_RE = /^([A-Za-z_][A-Za-z0-9_-]{0,63})\.(rx|ry|rz|px|py|pz|sx|sy|sz)$/
const COLOR_RE = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/
const NODE_KEYS = new Set(['name', 'shape', 'p', 'r', 's', 'color', 'roughness', 'metalness', 'anchor', 'children', 'remove'])
const MODEL_KEYS = new Set(['extends', 'stride', 'runSpeed', 'description', 'nodes', 'animations', 'controller', 'rev'])
// what resolveModel / modelData add; accepted and dropped by defineModel, so a
// resolved model can be passed back as a definition (the editor's Fork)
export const RESOLVED_EXTRAS = Object.freeze(['name', 'chain', 'revs', 'key', 'model', 'error'])
const CLIP_KEYS = new Set(['loop', 'once', 'duration', 'tracks'])
const CONTROLLER_KEYS = new Set(['states', 'blend'])

const str = (v) => (v == null ? '' : String(plain(v)))
const clone = (v) => (v == null || typeof v !== 'object' ? v : Array.isArray(v) ? v.map(clone) : Object.fromEntries(Object.entries(v).map(([k, x]) => [k, clone(x)])))
const isVec3 = (v) => Array.isArray(v) && v.length === 3 && v.every((x) => typeof x === 'number' && Number.isFinite(x))
const fin = (v) => typeof v === 'number' && Number.isFinite(v)
const q = (k) => JSON.stringify(k)

function deepFreeze (o) {
  if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const k of Object.keys(o)) deepFreeze(o[k]) }
  return o
}

// ---------------------------------------------------------------- the seed library
// Coordinates: metres, +y up, +z forward (the way the entity faces), the root at
// the ground. A node's `s` scales only its own shape (children sit in unscaled
// parent space), so a joint is a named pivot with its mesh as an offset child.
// Rotation tracks are degrees added to the node's rest `r`; px/py/pz add metres
// to its rest `p`; sx/sy/sz multiply its rest `s`.

const box = (name, p, s, color, extra = {}) => ({ ...(name ? { name } : {}), shape: 'box', p, s, color, ...extra })
const pivot = (name, p, children, extra = {}) => ({ name, p, ...extra, children })
const range = (n) => Array.from({ length: n }, (_, i) => i + 1)

// a two-segment leg: hip pivot -> upper mesh, knee pivot -> lower mesh
function leg (side, at, upper, lower, w, color, lowerColor = color) {
  return pivot(`leg_${side}`, at, [
    box(`thigh_${side}`, [0, -upper / 2, 0], [w, upper, w], color),
    pivot(`knee_${side}`, [0, -upper, 0], [box(`shin_${side}`, [0, -lower / 2, 0], [w * 0.85, lower, w * 0.85], lowerColor)]),
  ])
}
const QLEGS = ['fl', 'fr', 'bl', 'br']
const each = (sides, f) => Object.fromEntries(sides.flatMap((s, i) => f(s, i)))

const QUAD_BROWN = '#a0785a'
const QUAD_DARK = '#7a5a40'
const quadruped = {
  extends: '',
  description: 'Four legs with knees, a neck, a head and a tail. The base for horse and sheep.',
  stride: 1,
  runSpeed: 4,
  nodes: [
    pivot('root', [0, 0, 0], [
      box('body', [0, 0.8, 0], [0.42, 0.4, 1.0], QUAD_BROWN, {
        children: [
          { name: 'saddle', p: [0, 0.24, -0.05], anchor: 'seat' },
          pivot('neck', [0, 0.12, 0.42], [
            box('neck_m', [0, 0.16, 0.04], [0.18, 0.36, 0.18], QUAD_BROWN, { r: [25, 0, 0] }),
            pivot('head', [0, 0.32, 0.12], [
              box('head_m', [0, 0, 0.1], [0.22, 0.22, 0.36], QUAD_BROWN),
              box('eye_l', [0.1, 0.05, 0.18], [0.04, 0.05, 0.05], '#111111'),
              box('eye_r', [-0.1, 0.05, 0.18], [0.04, 0.05, 0.05], '#111111'),
            ], { anchor: 'head' }),
          ]),
          pivot('tail', [0, 0.12, -0.5], [box('tail_m', [0, 0, -0.15], [0.06, 0.06, 0.3], QUAD_DARK)], { r: [20, 0, 0] }),
          leg('fl', [0.15, -0.2, 0.38], 0.3, 0.3, 0.12, QUAD_DARK),
          leg('fr', [-0.15, -0.2, 0.38], 0.3, 0.3, 0.12, QUAD_DARK),
          leg('bl', [0.15, -0.2, -0.38], 0.3, 0.3, 0.12, QUAD_DARK),
          leg('br', [-0.15, -0.2, -0.38], 0.3, 0.3, 0.12, QUAD_DARK),
        ],
      }),
    ]),
  ],
  animations: {
    breathe: { tracks: { 'body.sy': '1 + sin(t*2.2)*0.015' } },
    idle: {
      tracks: {
        'head.rx': 'sin(t*0.7)*5',
        'head.ry': 'sin(t*0.31 + rand*6)*12',
        'neck.rx': 'sin(t*0.5 + 1)*3',
        'tail.ry': 'sin(t*2.5)*12',
      },
    },
    // diagonal pairs (fl+br, fr+bl); the stride scales with `phase`, the swing with `gait`
    walk: {
      tracks: {
        'leg_fl.rx': 'sin(phase*tau)*(20 + 10*gait)',
        'leg_br.rx': 'sin(phase*tau)*(20 + 10*gait)',
        'leg_fr.rx': '-sin(phase*tau)*(20 + 10*gait)',
        'leg_bl.rx': '-sin(phase*tau)*(20 + 10*gait)',
        // knees flex while their leg swings forward (rx falling), never in stance
        'knee_fl.rx': 'saturate(-cos(phase*tau))*30',
        'knee_br.rx': '-saturate(-cos(phase*tau))*25',
        'knee_fr.rx': 'saturate(cos(phase*tau))*30',
        'knee_bl.rx': '-saturate(cos(phase*tau))*25',
        'body.py': 'abs(sin(phase*tau))*0.02',
        'head.rx': 'sin(phase*tau*2)*3',
        'tail.ry': 'sin(phase*tau)*10',
      },
    },
    // a gallop: front pair and back pair half a cycle apart, each pair slightly split
    run: {
      tracks: {
        'leg_fl.rx': 'sin(phase*tau)*(30 + 15*gait)',
        'leg_fr.rx': 'sin(phase*tau - 0.5)*(30 + 15*gait)',
        'leg_bl.rx': 'sin(phase*tau + pi)*(30 + 15*gait)',
        'leg_br.rx': 'sin(phase*tau + pi - 0.5)*(30 + 15*gait)',
        'knee_fl.rx': 'saturate(-cos(phase*tau))*50',
        'knee_fr.rx': 'saturate(-cos(phase*tau - 0.5))*50',
        'knee_bl.rx': '-saturate(cos(phase*tau))*40',
        'knee_br.rx': '-saturate(cos(phase*tau - 0.5))*40',
        'body.rx': 'sin(phase*tau)*4',
        'body.py': 'abs(sin(phase*tau))*0.06',
        'neck.rx': '8 + sin(phase*tau)*5',
        'tail.rx': '-10 + sin(phase*tau*2)*6',
      },
    },
    // keyframe tracks: a head-butt
    attack: {
      once: true,
      duration: 0.8,
      tracks: {
        'head.rx': [[0, 0], [0.2, -15], [0.4, 30], [0.8, 0]],
        'neck.rx': [[0, 0], [0.4, 20], [0.8, 0]],
        'body.pz': 'sin(saturate(st/0.8)*pi)*0.12',
      },
    },
    die: {
      once: true,
      duration: 1.2,
      tracks: {
        'root.rz': [[0, 0], [0.7, 95], [0.9, 86], [1.2, 90]],
        'root.py': 'smoothstep(0, 0.7, st)*0.21',
        'head.rx': 'smoothstep(0.5, 1.2, st)*25',
        ...each(QLEGS, (s) => [[`leg_${s}.rx`, 'smoothstep(0, 1, st)*12']]),
      },
    },
  },
  controller: { states: { idle: ['idle', 'breathe'], walk: ['walk', 'breathe'], run: 'run', attack: 'attack', die: 'die' }, blend: DEFAULTS.blend },
}

const BIPED = '#c49a6c'
const BIPED_DARK = '#6b4a2e'
function arm (side, x) {
  return pivot(`arm_${side}`, [x, 0.5, 0], [
    box(`upper_arm_${side}`, [0, -0.15, 0], [0.09, 0.3, 0.09], BIPED),
    pivot(`elbow_${side}`, [0, -0.3, 0], [box(`forearm_${side}`, [0, -0.14, 0], [0.08, 0.28, 0.08], BIPED)]),
  ], { r: [0, 0, side === 'l' ? 4 : -4] })
}
function bipedLeg (side, x) {
  return pivot(`leg_${side}`, [x, -0.05, 0], [
    box(`thigh_${side}`, [0, -0.2, 0], [0.13, 0.4, 0.13], BIPED_DARK),
    pivot(`knee_${side}`, [0, -0.4, 0], [
      box(`shin_${side}`, [0, -0.2, 0], [0.11, 0.4, 0.11], BIPED_DARK),
      box(`foot_${side}`, [0, -0.42, 0.06], [0.12, 0.06, 0.22], '#3a2a1c'),
    ]),
  ])
}
const biped = {
  extends: '',
  description: 'Two legs, a torso that leans, two arms with elbows and a head. The base for trex.',
  stride: 1.2,
  runSpeed: 4,
  nodes: [
    pivot('root', [0, 0, 0], [
      box('hips', [0, 0.9, 0], [0.34, 0.18, 0.22], BIPED_DARK, {
        children: [
          pivot('torso', [0, 0.09, 0], [
            box('chest', [0, 0.28, 0], [0.4, 0.5, 0.24], BIPED),
            { name: 'seat', p: [0, 0.5, -0.15], anchor: 'seat' },
            pivot('neck', [0, 0.56, 0], [
              box('neck_m', [0, 0, 0], [0.11, 0.16, 0.11], BIPED), // bridges the chest top and the head
              pivot('head', [0, 0.06, 0], [
                box('head_m', [0, 0.14, 0.02], [0.24, 0.26, 0.26], BIPED),
                box('eye_l', [0.06, 0.16, 0.14], [0.04, 0.05, 0.03], '#111111'),
                box('eye_r', [-0.06, 0.16, 0.14], [0.04, 0.05, 0.03], '#111111'),
              ], { anchor: 'head' }),
            ]),
            arm('l', 0.25),
            arm('r', -0.25),
          ]),
          bipedLeg('l', 0.1),
          bipedLeg('r', -0.1),
        ],
      }),
    ]),
  ],
  animations: {
    breathe: { tracks: { 'chest.sy': '1 + sin(t*2)*0.02' } },
    idle: {
      tracks: {
        'head.ry': 'sin(t*0.4 + rand*6)*15',
        'torso.rx': 'sin(t*1.1)*1.5',
        'arm_l.rz': 'sin(t*1.1)*2',
        'arm_r.rz': '-sin(t*1.1)*2',
      },
    },
    walk: {
      tracks: {
        'leg_l.rx': '-sin(phase*tau)*(22 + 8*gait)',
        'leg_r.rx': 'sin(phase*tau)*(22 + 8*gait)',
        // knees flex mid-swing (the leg's rx falling), so the foot clears the ground
        'knee_l.rx': 'saturate(cos(phase*tau))*35',
        'knee_r.rx': 'saturate(-cos(phase*tau))*35',
        'arm_l.rx': 'sin(phase*tau)*18',
        'arm_r.rx': '-sin(phase*tau)*18',
        'hips.py': 'abs(cos(phase*tau))*0.03',
        'torso.ry': 'sin(phase*tau)*5',
      },
    },
    run: {
      tracks: {
        'leg_l.rx': '-sin(phase*tau)*(38 + 15*gait)',
        'leg_r.rx': 'sin(phase*tau)*(38 + 15*gait)',
        'knee_l.rx': 'saturate(cos(phase*tau))*70',
        'knee_r.rx': 'saturate(-cos(phase*tau))*70',
        'arm_l.rx': 'sin(phase*tau)*35',
        'arm_r.rx': '-sin(phase*tau)*35',
        'elbow_l.rx': '-70',
        'elbow_r.rx': '-70',
        'torso.rx': '8 + 4*gait',
        'hips.py': 'abs(sin(phase*tau))*0.06',
      },
    },
    // keyframe tracks: a right-hand punch
    attack: {
      once: true,
      duration: 0.7,
      tracks: {
        'arm_r.rx': [[0, 0], [0.15, 40], [0.35, -95], [0.7, 0]],
        'elbow_r.rx': [[0, 0], [0.15, -60], [0.35, -5], [0.7, 0]],
        'torso.ry': '-sin(saturate(st/0.7)*pi)*20',
      },
    },
    // falls on its back
    die: {
      once: true,
      duration: 1.2,
      tracks: {
        'root.rx': [[0, 0], [0.8, -92], [1, -86], [1.2, -90]],
        'root.py': 'smoothstep(0, 0.8, st)*0.13',
        'arm_l.rz': 'smoothstep(0, 1, st)*50',
        'arm_r.rz': '-smoothstep(0, 1, st)*50',
        'knee_l.rx': 'smoothstep(0, 0.6, st)*30',
      },
    },
  },
  controller: { states: { idle: ['idle', 'breathe'], walk: ['walk', 'breathe'], run: 'run', attack: 'attack', die: 'die' }, blend: DEFAULTS.blend },
}

// a chain: head -> s1 -> … -> s6 -> tail (8 deep, LIMITS.depth). Every segment
// rotates relative to the one ahead of it, so a phase-shifted yaw per segment
// is a slither.
const SEGMENTS = range(6)
function serpentChain () {
  let tail = { name: 'tail', shape: 'cone', p: [0, 0, -0.34], r: [-90, 0, 0], s: [0.16, 0.42, 0.14], color: '#4a7030' }
  for (let k = SEGMENTS.length; k >= 1; k--) {
    const w = 0.26 - k * 0.012
    tail = { name: `s${k}`, shape: 'sphere', p: [0, 0, k === 1 ? -0.24 : -0.3], s: [w, w * 0.75, 0.42], color: k % 2 ? '#5d8a3a' : '#6f9e46', ...(k === 2 ? { anchor: 'seat' } : {}), children: [tail] }
  }
  return {
    name: 'head', shape: 'box', p: [0, 0.12, 0.9], s: [0.24, 0.15, 0.3], color: '#5d8a3a', anchor: 'head',
    children: [
      box('eye_l', [0.09, 0.06, 0.08], [0.04, 0.04, 0.04], '#111111'),
      box('eye_r', [-0.09, 0.06, 0.08], [0.04, 0.04, 0.04], '#111111'),
      box('tongue', [0, -0.03, 0.2], [0.02, 0.01, 0.12], '#c03030'),
      tail,
    ],
  }
}
const serpent = {
  extends: '',
  description: 'A segmented chain with no legs: head, six body segments, tail. It slithers by phase.',
  stride: 0.8,
  runSpeed: 3,
  nodes: [serpentChain()],
  animations: {
    idle: {
      loop: true,
      duration: 2.4,
      tracks: {
        ...each(SEGMENTS, (k) => [[`s${k}.ry`, `sin(t*1.2 - ${k}*0.7)*4`]]),
        'head.rx': 'sin(t*0.8)*4',
        // keyframes on a scale channel: a tongue flick every 2.4 s
        'tongue.sz': [[0, 0.2], [1.6, 0.2], [1.7, 1.4], [1.8, 0.2], [1.9, 1.4], [2.0, 0.2], [2.4, 0.2]],
      },
    },
    walk: {
      tracks: {
        ...each(SEGMENTS, (k) => [[`s${k}.ry`, `sin(phase*tau - ${k}*0.9)*(16 + 8*gait)`]]),
        'head.ry': '-sin(phase*tau + 0.9)*8',
      },
    },
    run: {
      tracks: {
        ...each(SEGMENTS, (k) => [[`s${k}.ry`, `sin(phase*tau - ${k}*1.1)*(22 + 10*gait)`]]),
        'head.ry': '-sin(phase*tau + 1.1)*10',
        'head.py': 'abs(sin(phase*tau))*0.02',
      },
    },
    attack: {
      once: true,
      duration: 0.6,
      tracks: {
        'head.rx': [[0, 0], [0.15, -25], [0.3, 10], [0.6, 0]],
        'head.pz': 'sin(saturate(st/0.6)*pi)*0.25',
        'tongue.sz': '1 + sin(saturate(st/0.6)*pi)*2',
      },
    },
    // rolls belly-up: the chain is nested, so rolling the head rolls it all
    die: {
      once: true,
      duration: 1,
      tracks: {
        'head.rz': [[0, 0], [1, 180]],
        ...each(SEGMENTS, (k) => [[`s${k}.ry`, `sin(${k}*1.3)*12*smoothstep(0, 1, st)`]]),
      },
    },
  },
  controller: { states: { idle: 'idle', walk: 'walk', run: 'run', attack: 'attack', die: 'die' }, blend: 0.25 },
}

const BIRD = '#e8e0d0'
const BEAK = '#e8a020'
function birdLeg (side, x) {
  return pivot(`leg_${side}`, [x, -0.12, 0], [
    { name: `shank_${side}`, shape: 'cylinder', p: [0, -0.14, 0], s: [0.04, 0.28, 0.04], color: BEAK },
    box(`foot_${side}`, [0, -0.29, 0.03], [0.08, 0.02, 0.1], BEAK),
  ])
}
function wing (side, x) {
  return pivot(`wing_${side}`, [x, 0.04, 0], [box(`feathers_${side}`, [x > 0 ? 0.02 : -0.02, -0.02, -0.04], [0.04, 0.2, 0.3], '#d8cfbf')])
}
const bird = {
  extends: '',
  description: 'A round body on two thin legs, two wings, a beak and a tail fan.',
  stride: 0.35,
  runSpeed: 3,
  nodes: [
    pivot('root', [0, 0, 0], [
      { name: 'body', shape: 'sphere', p: [0, 0.42, 0], s: [0.32, 0.3, 0.42], color: BIRD, children: [
        { name: 'seat', p: [0, 0.16, -0.02], anchor: 'seat' },
        pivot('neck', [0, 0.1, 0.14], [
          { name: 'head', shape: 'sphere', p: [0, 0.14, 0.04], s: [0.16, 0.16, 0.18], color: BIRD, anchor: 'head', children: [
            { name: 'beak', shape: 'cone', p: [0, -0.01, 0.11], r: [90, 0, 0], s: [0.06, 0.09, 0.06], color: BEAK },
            box('eye_l', [0.065, 0.03, 0.05], [0.03, 0.03, 0.03], '#111111'),
            box('eye_r', [-0.065, 0.03, 0.05], [0.03, 0.03, 0.03], '#111111'),
            box('comb', [0, 0.09, 0.01], [0.03, 0.06, 0.1], '#cc2222'),
          ] },
        ]),
        wing('l', 0.16),
        wing('r', -0.16),
        pivot('tail', [0, 0.06, -0.2], [box('tail_m', [0, 0, -0.08], [0.2, 0.04, 0.16], '#d8cfbf')], { r: [30, 0, 0] }),
        birdLeg('l', 0.07),
        birdLeg('r', -0.07),
      ] },
    ]),
  ],
  animations: {
    // keyframes: looks left, holds, looks right, holds, back
    idle: {
      loop: true,
      duration: 4,
      tracks: {
        'head.ry': [[0, 0], [0.6, 35], [1.6, 35], [2.0, -30], [3.2, -30], [3.6, 0], [4, 0]],
        'neck.rx': 'sin(t*1.3)*4',
        'tail.rx': 'sin(t*0.9)*5',
      },
    },
    walk: {
      tracks: {
        'leg_l.rx': '-sin(phase*tau)*30',
        'leg_r.rx': 'sin(phase*tau)*30',
        'neck.pz': 'saturate(sin(phase*tau*2))*0.04',
        'body.rz': 'sin(phase*tau)*4',
      },
    },
    // a flap-run: the faster, the harder the wings beat
    run: {
      tracks: {
        'leg_l.rx': '-sin(phase*tau)*45',
        'leg_r.rx': 'sin(phase*tau)*45',
        'wing_l.rz': '10 + sin(t*20)*35*gait',
        'wing_r.rz': '-10 - sin(t*20)*35*gait',
        'body.rx': '10*gait',
        'body.py': '0.05*gait',
      },
    },
    attack: {
      once: true,
      duration: 0.5,
      tracks: {
        'neck.rx': [[0, 0], [0.15, -10], [0.25, 55], [0.5, 0]],
        'head.rx': [[0, 0], [0.25, 20], [0.5, 0]],
      },
    },
    die: {
      once: true,
      duration: 1,
      tracks: {
        'root.rz': [[0, 0], [0.6, 95], [1, 90]],
        'root.py': 'smoothstep(0, 0.6, st)*0.16',
        'wing_l.rz': 'smoothstep(0, 1, st)*60',
        'wing_r.rz': '-smoothstep(0, 1, st)*60',
      },
    },
  },
  controller: { states: { idle: 'idle', walk: 'walk', run: 'run', attack: 'attack', die: 'die' }, blend: 0.12 },
}

// ---- species: patches over a base -------------------------------------------

// patch a quadruped's four legs: front/back = [half track width, z], hip height y
function quadLegs (front, back, y, upper, lower, w, color, lowerColor, extra = () => []) {
  return QLEGS.map((s) => ({
    name: `leg_${s}`,
    p: [(s.endsWith('l') ? 1 : -1) * (s.startsWith('f') ? front[0] : back[0]), y, s.startsWith('f') ? front[1] : back[1]],
    children: [
      { name: `thigh_${s}`, p: [0, -upper / 2, 0], s: [w, upper, w], color },
      { name: `knee_${s}`, p: [0, -upper, 0], children: [{ name: `shin_${s}`, p: [0, -lower / 2, 0], s: [w * 0.7, lower, w * 0.7], color: lowerColor }, ...extra(s, lower)] },
    ],
  }))
}

const HORSE = '#8b5a2b'
const HORSE_DARK = '#5a3a1e'
const MANE = '#2a1a0e'
const horse = {
  extends: 'quadruped',
  description: 'A quadruped with long legs and hooves, a long neck with a mane, ears and a saddle.',
  stride: 1.8,
  runSpeed: 7,
  nodes: [
    { name: 'body', p: [0, 1.3, 0], s: [0.55, 0.6, 1.5], color: HORSE },
    { name: 'saddle', p: [0, 0.34, -0.05], children: [box('saddle_m', [0, -0.02, 0], [0.58, 0.08, 0.5], '#5b2a1a')] },
    { name: 'neck', p: [0, 0.2, 0.68], children: [box('mane', [0, 0.36, -0.06], [0.06, 0.72, 0.1], MANE, { r: [30, 0, 0] })] },
    { name: 'neck_m', p: [0, 0.32, 0.12], s: [0.24, 0.7, 0.3], r: [30, 0, 0], color: HORSE },
    { name: 'head', p: [0, 0.62, 0.32], children: [
      { name: 'ear_l', shape: 'cone', p: [0.07, 0.16, 0.02], s: [0.06, 0.14, 0.06], color: HORSE },
      { name: 'ear_r', shape: 'cone', p: [-0.07, 0.16, 0.02], s: [0.06, 0.14, 0.06], color: HORSE },
    ] },
    { name: 'head_m', p: [0, -0.08, 0.22], r: [35, 0, 0], s: [0.24, 0.26, 0.6], color: HORSE },
    { name: 'eye_l', p: [0.13, 0.04, 0.12] },
    { name: 'eye_r', p: [-0.13, 0.04, 0.12] },
    { name: 'tail', p: [0, 0.2, -0.75], r: [-40, 0, 0] },
    { name: 'tail_m', p: [0, 0, -0.3], s: [0.1, 0.1, 0.6], color: MANE },
    ...quadLegs([0.18, 0.58], [0.18, -0.58], -0.25, 0.52, 0.53, 0.16, HORSE, HORSE_DARK,
      (s, lower) => [box(`hoof_${s}`, [0, -lower + 0.03, 0.02], [0.14, 0.08, 0.16], '#222222')]),
  ],
  animations: {
    idle: { tracks: { 'tail.ry': 'sin(t*1.7)*18', 'mane.rz': 'sin(t*1.3)*3' } },
    walk: { tracks: { 'neck.rx': 'sin(phase*tau*2)*3' } },
    run: { tracks: { 'mane.rx': 'sin(phase*tau)*8', 'neck.rx': '12 + sin(phase*tau)*6' } },
  },
  controller: { blend: 0.2 },
}

const WOOL = '#f4f0e8'
const SHEEP_FACE = '#2a221e'
const sheep = {
  extends: 'quadruped',
  description: 'A short-legged quadruped in a ball of wool, with a dark face and ears. It grazes when idle.',
  stride: 0.8,
  runSpeed: 5,
  nodes: [
    { name: 'body', p: [0, 0.62, 0], s: [0.4, 0.36, 0.75], color: '#3a302a', children: [
      { name: 'wool', shape: 'sphere', p: [0, 0.04, 0], s: [0.78, 0.62, 1.05], color: WOOL },
    ] },
    { name: 'saddle', p: [0, 0.36, 0] },
    { name: 'neck', p: [0, 0.12, 0.36] },
    { name: 'neck_m', p: [0, 0.08, 0.04], s: [0.16, 0.2, 0.16], color: '#3a302a' },
    { name: 'head', p: [0, 0.18, 0.1], children: [
      box('ear_l', [0.13, 0.06, 0], [0.14, 0.05, 0.07], SHEEP_FACE),
      box('ear_r', [-0.13, 0.06, 0], [0.14, 0.05, 0.07], SHEEP_FACE),
      { name: 'tuft', shape: 'sphere', p: [0, 0.12, 0.02], s: [0.18, 0.1, 0.16], color: WOOL },
    ] },
    { name: 'head_m', s: [0.2, 0.22, 0.3], color: SHEEP_FACE },
    { name: 'eye_l', p: [0.09, 0.04, 0.17] },
    { name: 'eye_r', p: [-0.09, 0.04, 0.17] },
    { name: 'tail', p: [0, 0.1, -0.42] },
    { name: 'tail_m', shape: 'sphere', p: [0, 0, -0.04], s: [0.12, 0.12, 0.12], color: WOOL },
    ...quadLegs([0.14, 0.26], [0.14, -0.26], -0.16, 0.23, 0.23, 0.09, '#3a302a', SHEEP_FACE),
  ],
  animations: {
    // grazes: keyframes over a 6 s loop replace the base's neck bob
    idle: { duration: 6, tracks: { 'neck.rx': [[0, 0], [1.5, 0], [2.2, 40], [4.2, 40], [4.8, 0], [6, 0]] } },
    walk: { tracks: { 'wool.sy': '1 + abs(sin(phase*tau))*0.03' } },
  },
}

const REX = '#5f7f3a'
const REX_DARK = '#4e6a30'
const TAIL = ['tail', 'tail2', 'tail3', 'tail4']
const trex = {
  extends: 'biped',
  description: 'A biped leaning forward over a long four-part tail, with a big jawed head, tiny arms and thick legs.',
  stride: 2.2,
  runSpeed: 6,
  nodes: [
    { name: 'hips', p: [0, 1.6, 0], s: [0.7, 0.6, 0.8], color: REX, children: [
      { name: 'tail', shape: 'box', p: [0, 0.05, -0.45], r: [10, 0, 0], s: [0.5, 0.45, 0.6], color: REX, children: [
        { name: 'tail2', shape: 'box', p: [0, 0, -0.55], s: [0.36, 0.32, 0.6], color: REX, children: [
          { name: 'tail3', shape: 'box', p: [0, 0, -0.55], s: [0.22, 0.2, 0.6], color: REX, children: [
            { name: 'tail4', shape: 'box', p: [0, 0, -0.5], s: [0.12, 0.1, 0.5], color: REX_DARK },
          ] },
        ] },
      ] },
    ] },
    { name: 'torso', r: [70, 0, 0] },
    { name: 'chest', p: [0, 0.5, 0], s: [0.75, 1.1, 0.7], color: REX },
    { name: 'seat', p: [0, 0.9, -0.4] },
    { name: 'neck', p: [0, 1.05, 0], r: [-50, 0, 0] },
    { name: 'neck_m', p: [0, 0.05, 0], s: [0.5, 0.35, 0.5], color: REX },
    { name: 'head', p: [0, 0.15, 0], children: [
      pivot('jaw', [0, -0.05, 0], [
        box('jaw_m', [0, -0.08, 0.35], [0.5, 0.16, 0.85], REX_DARK),
        box('teeth', [0, 0.01, 0.38], [0.52, 0.05, 0.8], '#f0ead8'),
      ]),
    ] },
    { name: 'head_m', p: [0, 0.15, 0.3], s: [0.6, 0.6, 1.0], color: REX },
    { name: 'eye_l', p: [0.28, 0.3, 0.4], s: [0.06, 0.08, 0.08], color: '#e8c020' },
    { name: 'eye_r', p: [-0.28, 0.3, 0.4], s: [0.06, 0.08, 0.08], color: '#e8c020' },
    // tiny arms, pointing forward-down out of the leaning chest
    ...['l', 'r'].flatMap((s) => [
      { name: `arm_${s}`, p: [s === 'l' ? 0.38 : -0.38, 0.95, 0.2], r: [-110, 0, 0] },
      { name: `upper_arm_${s}`, p: [0, -0.12, 0], s: [0.1, 0.25, 0.1], color: REX },
      { name: `elbow_${s}`, p: [0, -0.25, 0], r: [-40, 0, 0] },
      { name: `forearm_${s}`, p: [0, -0.1, 0], s: [0.08, 0.2, 0.08], color: REX },
    ]),
    ...['l', 'r'].flatMap((s) => [
      { name: `leg_${s}`, p: [s === 'l' ? 0.3 : -0.3, -0.1, 0] },
      { name: `thigh_${s}`, p: [0, -0.4, 0], s: [0.32, 0.8, 0.4], color: REX },
      { name: `knee_${s}`, p: [0, -0.8, 0] },
      { name: `shin_${s}`, p: [0, -0.35, 0], s: [0.2, 0.7, 0.22], color: REX },
      { name: `foot_${s}`, p: [0, -0.65, 0.12], s: [0.3, 0.1, 0.5], color: REX_DARK },
    ]),
  ],
  animations: {
    idle: {
      tracks: {
        ...Object.fromEntries(TAIL.slice(0, 3).map((n, i) => [`${n}.ry`, `sin(t*0.9 - ${i * 0.6})*${6 + i * 2}`])),
        'jaw.rx': 'saturate(sin(t*0.5 + rand*6) - 0.85)*120',
        'arm_l.rz': null, // tiny arms do not sway
        'arm_r.rz': null,
      },
    },
    walk: {
      tracks: {
        ...Object.fromEntries(TAIL.slice(0, 3).map((n, i) => [`${n}.ry`, `sin(phase*tau - ${i * 0.7})*${8 + i * 2}`])),
        'arm_l.rx': null, // the base's arm swing goes: a T-rex keeps its arms still
        'arm_r.rx': null,
      },
    },
    run: {
      tracks: {
        ...Object.fromEntries(TAIL.slice(0, 3).map((n, i) => [`${n}.ry`, `sin(phase*tau - ${i * 0.7})*${10 + i * 3}`])),
        'head.rx': 'sin(phase*tau*2)*4',
        'arm_l.rx': null,
        'arm_r.rx': null,
        'elbow_l.rx': null,
        'elbow_r.rx': null,
      },
    },
    bite: {
      once: true,
      duration: 0.7,
      tracks: {
        'jaw.rx': [[0, 0], [0.2, 35], [0.35, 0], [0.7, 0]],
        'neck.rx': [[0, 0], [0.2, -15], [0.35, 25], [0.7, 0]],
        'torso.rx': 'sin(saturate(st/0.7)*pi)*10',
      },
    },
    // topples onto its side instead of the biped's fall backwards
    die: {
      duration: 1.3,
      tracks: {
        'root.rx': null,
        'root.rz': [[0, 0], [0.9, 92], [1.1, 86], [1.3, 90]],
        'root.py': 'smoothstep(0, 0.9, st)*0.4',
        'jaw.rx': 'smoothstep(0.6, 1.3, st)*25',
      },
    },
  },
  controller: { states: { attack: 'bite' } },
}

export const MODEL_LIBRARY = deepFreeze({ quadruped, biped, serpent, bird, horse, sheep, trex })

// ---------------------------------------------------------------- helpers

// named nodes, depth-first (unnamed nodes are static parts, not bones)
export function nodeNames (nodes) {
  const out = []
  const walk = (list) => { for (const n of Array.isArray(list) ? list : []) { if (!isObj(n)) continue; if (n.name != null && str(n.name)) out.push(str(n.name)); walk(n.children) } }
  walk(plain(nodes))
  return out
}

function countNodes (nodes) {
  let n = 0; let depth = 0
  const walk = (list, d) => { for (const x of Array.isArray(list) ? list : []) { if (!isObj(x)) continue; n++; if (d > depth) depth = d; walk(x.children, d + 1) } }
  walk(nodes, 1)
  return { count: n, depth }
}

// stable JSON (sorted keys: doc key order is not preserved, rule §2.7) and FNV-1a
export function stableStringify (v) {
  if (v === undefined) return 'null'
  if (v === null || typeof v !== 'object') return JSON.stringify(v)
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(',')}]`
  return `{${Object.keys(v).sort().filter((k) => v[k] !== undefined).map((k) => `${JSON.stringify(k)}:${stableStringify(v[k])}`).join(',')}}`
}
export function fnv1a (s) {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0 }
  return h.toString(16).padStart(8, '0')
}
// a 53-bit content hash (cyrb53) as 14 hex digits: what template keys use, so two
// different looks practically never share a key (and so a template)
export function contentHash (s) {
  let h1 = 0xdeadbeef; let h2 = 0x41c6ce57
  for (let i = 0; i < s.length; i++) { const c = s.charCodeAt(i); h1 = Math.imul(h1 ^ c, 2654435761); h2 = Math.imul(h2 ^ c, 1597334677) }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(16).padStart(14, '0')
}

// The render key of a model look (design §17.3): 'model:<name>:<revs>:<hash>', revs
// the chain's revs own-first joined by '.', hash over the chain's stored bodies.
// The revs alone are not enough: two peers that each define a model from scratch
// both start at rev 1, and a remove + redefine starts again at 1, so the same revs
// can carry different content. A link's hash is cached on the stored object per
// rev (an Automerge snapshot keeps the identity of an unchanged subtree), so a doc
// change elsewhere costs a lookup, not a stringify.
const linkHashes = new WeakMap()
function linkHash (m) {
  const rev = Number(plain(m?.rev) ?? 0) || 0
  if (m && typeof m === 'object') { const hit = linkHashes.get(m); if (hit && hit.rev === rev) return hit.h }
  const h = contentHash(stableStringify(modelBody(m)))
  if (m && typeof m === 'object') linkHashes.set(m, { rev, h })
  return h
}
// -> the key, or 'missing:<name>' (no such model) / 'broken:<name>' (a missing base,
// a cycle or too deep a chain). `models`: doc.models (proxy, snapshot or plain).
export function modelKeyOf (models, name) {
  const revs = []; const hashes = []; const seen = new Set()
  let cur = String(name ?? '')
  while (cur) {
    const m = own(models, cur)
    if (!isObj(m) || seen.has(cur) || revs.length > LIMITS.extendsDepth) return revs.length ? `broken:${name}` : `missing:${name}`
    seen.add(cur); revs.push(Number(plain(m.rev) ?? 0) || 0); hashes.push(linkHash(m))
    cur = str(m.extends)
  }
  if (!revs.length) return `missing:${name}`
  return `model:${name}:${revs.join('.')}:${hashes.length === 1 ? hashes[0] : contentHash(hashes.join('.'))}`
}
// the key of an inline look's body ({ nodes, animations, controller, stride?, runSpeed? })
export const inlineKeyOf = (body) => `inline:${contentHash(stableStringify(body))}`

// a definable body: the model fields only, no rev and no resolver extras
export function modelBody (m) {
  const p = plain(m)
  const out = {}
  if (!isObj(p)) return out
  for (const k of Object.keys(p)) if (MODEL_KEYS.has(k) && k !== 'rev' && p[k] !== undefined) out[k] = p[k]
  return out
}

// ---------------------------------------------------------------- resolution

// overlay fields of patch onto node (null deletes; children handled by the caller)
function overlayNode (node, patch) {
  for (const [k, v] of Object.entries(patch)) {
    if (k === 'name' || k === 'children' || k === 'remove' || v === undefined) continue
    if (v === null) delete node[k]
    else node[k] = clone(v)
  }
}

const freshNode = (p) => {
  const n = {}
  for (const [k, v] of Object.entries(p)) if (k !== 'remove' && k !== 'children' && v !== null && v !== undefined) n[k] = clone(v)
  n.children = (Array.isArray(p.children) ? p.children : []).filter((c) => isObj(c) && !c.remove).map(freshNode)
  return n
}

// patch `roots` (owned, mutable) with `patches` by node name
function patchNodes (roots, patches) {
  const index = new Map() // name -> { node, list }
  const indexTree = (list) => { for (const n of list) { if (n.name) index.set(String(n.name), { node: n, list }); n.children ||= []; indexTree(n.children) } }
  const unindex = (n) => { if (n.name && index.get(String(n.name))?.node === n) index.delete(String(n.name)); for (const c of n.children ?? []) unindex(c) }
  indexTree(roots)
  const apply = (list, into) => {
    for (const p of Array.isArray(list) ? list : []) {
      if (!isObj(p)) continue
      const name = p.name != null ? String(p.name) : ''
      const hit = name ? index.get(name) : null
      if (hit) {
        if (p.remove === true) { const i = hit.list.indexOf(hit.node); if (i >= 0) hit.list.splice(i, 1); unindex(hit.node); continue }
        overlayNode(hit.node, p)
        if (Array.isArray(p.children)) apply(p.children, hit.node.children)
        continue
      }
      if (p.remove === true) continue
      const n = freshNode(p)
      into.push(n)
      indexTree([n])
    }
  }
  apply(patches, roots)
  return roots
}

function mergeClips (base, over) {
  const out = base
  for (const [name, c] of Object.entries(isObj(over) ? over : {})) {
    if (c === null) { delete out[name]; continue }
    if (!isObj(c)) continue
    const cur = isObj(out[name]) ? out[name] : { tracks: {} }
    const next = { ...cur, tracks: { ...(isObj(cur.tracks) ? cur.tracks : {}) } }
    for (const [k, v] of Object.entries(c)) {
      if (k === 'tracks' || v === undefined) continue
      if (v === null) delete next[k]; else next[k] = clone(v)
    }
    for (const [k, v] of Object.entries(isObj(c.tracks) ? c.tracks : {})) {
      if (v === null) delete next.tracks[k]; else if (v !== undefined) next.tracks[k] = clone(v)
    }
    out[name] = next
  }
  return out
}

function mergeController (base, over) {
  if (!isObj(over)) return base
  const out = { ...base, states: { ...(isObj(base.states) ? base.states : {}) } }
  for (const [k, v] of Object.entries(over)) {
    if (k === 'states' || v === undefined) continue
    if (v === null) delete out[k]; else out[k] = clone(v)
  }
  for (const [k, v] of Object.entries(isObj(over.states) ? over.states : {})) {
    if (v === null) delete out.states[k]; else if (v !== undefined) out.states[k] = clone(v)
  }
  return out
}

// fill clip and controller defaults: loop (unless once), once, duration (the last
// keyframe when unset and there are keyframe tracks); controller states as lists
function normalize (r) {
  for (const c of Object.values(r.animations)) {
    c.once = c.once === true
    c.loop = c.once ? false : c.loop !== false
    if (!isObj(c.tracks)) c.tracks = {}
    if (!fin(c.duration) || c.duration <= 0) {
      let end = 0
      for (const v of Object.values(c.tracks)) if (Array.isArray(v) && v.length) end = Math.max(end, Number(v[v.length - 1]?.[0]) || 0)
      if (end > 0) c.duration = end; else delete c.duration
    }
  }
  const states = {}
  for (const [k, v] of Object.entries(isObj(r.controller.states) ? r.controller.states : {})) {
    const list = (Array.isArray(v) ? v : [v]).map((x) => String(x)).filter(Boolean)
    if (list.length) states[k] = list
  }
  r.controller = { ...r.controller, states, blend: fin(r.controller.blend) && r.controller.blend >= 0 ? r.controller.blend : DEFAULTS.blend }
  return r
}

function fold (layers) {
  const r = { stride: DEFAULTS.stride, runSpeed: DEFAULTS.runSpeed, nodes: [], animations: {}, controller: { states: {}, blend: DEFAULTS.blend } }
  layers.forEach((m, i) => {
    for (const k of ['stride', 'runSpeed', 'description']) if (m[k] != null) r[k] = clone(m[k])
    // the first layer is taken as written: patching by name is what `extends` does,
    // and an inline look (an old tree) may repeat a name, which must not merge nodes
    if (i === 0) r.nodes = (Array.isArray(m.nodes) ? m.nodes : []).filter((n) => isObj(n) && n.remove !== true).map(freshNode)
    else patchNodes(r.nodes, m.nodes)
    mergeClips(r.animations, m.animations)
    r.controller = mergeController(r.controller, m.controller)
  })
  return normalize(r)
}

// the extends chain of `name`, base first: [[name, plainModel], ...]; null when
// `name` is not a model; throws on a cycle, a missing base or too deep a chain
function chainOf (models, name) {
  const chain = []
  const seen = new Set()
  let cur = String(name)
  while (cur) {
    if (seen.has(cur)) throw new TypeError(`model ${name}: extends cycle ${[...chain.map(([n]) => n), cur].join(' -> ')}`)
    const m = own(models, cur)
    if (!isObj(m)) {
      if (!chain.length) return null
      throw new TypeError(`model ${chain[chain.length - 1][0]} extends unknown model ${q(cur)}`)
    }
    if (chain.length > LIMITS.extendsDepth) throw new TypeError(`model ${name}: extends chain deeper than ${LIMITS.extendsDepth}`)
    seen.add(cur)
    const p = plain(m)
    chain.push([cur, p])
    cur = str(p.extends)
  }
  return chain.reverse()
}

// -> { name, extends, chain: [names, base first], rev, revs, description?, stride, runSpeed, nodes, animations, controller }
// as fresh plain data, or null when there is no such model. Throws on a cycle,
// a missing base or a chain deeper than LIMITS.extendsDepth.
export function resolveModel (models, name) {
  const chain = chainOf(models, name)
  if (!chain) return null
  const own = chain[chain.length - 1][1]
  const r = fold(chain.map(([, m]) => m))
  return {
    name: String(name),
    extends: str(own.extends),
    chain: chain.map(([n]) => n),
    rev: Number(own.rev ?? 0) || 0,
    revs: chain.map(([, m]) => Number(m.rev ?? 0) || 0).reverse(), // own first
    ...r,
  }
}

// A rig representation -> the resolved look, or null (unknown model, a broken
// extends chain). Model reps key on the revisions AND content of the chain (own
// first, then each base: modelKeyOf), so editing a base re-keys everything built on it:
//   { kind: 'rig', model: 'horse' }        -> key 'model:horse:3.1:<hash>'  ('model:quadruped:1:<hash>' with no extends)
//   { kind: 'rig'|'tree', nodes, ... }     -> key 'inline:<contentHash of the stable JSON>'
// -> { key, model, chain, stride, runSpeed, nodes, animations, controller } (fresh plain data)
export function resolveRepresentation (doc, rep) {
  const r = plain(rep)
  if (!isObj(r)) return null
  const name = str(r.model)
  if (name) {
    let m
    try { m = resolveModel(doc?.models ?? {}, name) } catch { return null }
    if (!m) return null
    return { key: modelKeyOf(doc?.models ?? {}, name), model: name, chain: m.chain, stride: m.stride, runSpeed: m.runSpeed, nodes: m.nodes, animations: m.animations, controller: m.controller }
  }
  const body = { nodes: Array.isArray(r.nodes) ? r.nodes : [], animations: isObj(r.animations) ? r.animations : {}, controller: isObj(r.controller) ? r.controller : {} }
  if (r.stride != null) body.stride = r.stride
  if (r.runSpeed != null) body.runSpeed = r.runSpeed
  const key = inlineKeyOf(body)
  const f = fold([body])
  return { key, model: '', chain: [], stride: f.stride, runSpeed: f.runSpeed, nodes: f.nodes, animations: f.animations, controller: f.controller }
}

// ---------------------------------------------------------------- validation

function checkNodes (nodes, problems, { allowRemove }) {
  const names = new Map()
  const walk = (list, path, depth) => {
    if (!Array.isArray(list)) { problems.push(`${path}: must be a list of nodes`); return }
    list.forEach((n, i) => {
      const at = `${path}[${i}]`
      if (!isObj(n)) { problems.push(`${at}: must be a node object`); return }
      for (const k of Object.keys(n)) if (!NODE_KEYS.has(k)) problems.push(`${at}: unknown node field ${q(k)} (${[...NODE_KEYS].join(', ')})`)
      if (n.name != null) {
        const nm = n.name
        if (typeof nm !== 'string' || !isName(nm)) problems.push(`${at}.name: bad node name ${q(nm)}`)
        else if (names.has(nm)) problems.push(`${at}.name: duplicate node name ${q(nm)} (also ${names.get(nm)})`)
        else names.set(nm, at)
      }
      if (n.shape != null && !SHAPES.includes(n.shape)) problems.push(`${at}.shape: must be one of ${SHAPES.join(', ')}`)
      for (const f of ['p', 'r', 's']) if (n[f] != null && !isVec3(n[f])) problems.push(`${at}.${f}: must be [x, y, z]`)
      if (n.color != null && !(typeof n.color === 'string' && COLOR_RE.test(n.color))) problems.push(`${at}.color: expected a #rrggbb colour`)
      for (const f of ['roughness', 'metalness']) if (n[f] != null && !(fin(n[f]) && n[f] >= 0 && n[f] <= 1)) problems.push(`${at}.${f}: must be a number in [0, 1]`)
      if (n.anchor != null && !(typeof n.anchor === 'string' && isName(n.anchor))) problems.push(`${at}.anchor: bad anchor name ${q(n.anchor)}`)
      if (n.remove != null) {
        if (typeof n.remove !== 'boolean') problems.push(`${at}.remove: must be true or false`)
        else if (n.remove && !allowRemove) problems.push(`${at}.remove: only a model that extends another can remove a node`)
        else if (n.remove && !n.name) problems.push(`${at}.remove: names the node to remove (needs a name)`)
      }
      if (depth > LIMITS.depth) problems.push(`${at}: nodes nested deeper than ${LIMITS.depth}`)
      else if (n.children != null) walk(n.children, `${at}.children`, depth + 1)
    })
  }
  walk(nodes, 'nodes', 1)
}

function checkKeyframes (v, at, problems) {
  if (!v.length) { problems.push(`${at}: keyframes need at least one [t, v]`); return }
  if (v.length > MAX_KEYFRAMES) { problems.push(`${at}: at most ${MAX_KEYFRAMES} keyframes`); return }
  let last = -Infinity
  for (let i = 0; i < v.length; i++) {
    const k = v[i]
    if (!(Array.isArray(k) && k.length === 2 && fin(k[0]) && fin(k[1]))) { problems.push(`${at}[${i}]: a keyframe is [t (s), value]`); return }
    if (k[0] < 0) { problems.push(`${at}[${i}]: t must be >= 0`); return }
    if (!(k[0] > last)) { problems.push(`${at}[${i}]: keyframe times must increase (${k[0]} after ${last})`); return }
    last = k[0]
  }
}

function checkClips (anims, problems) {
  if (!isObj(anims)) { problems.push('animations: must be {clip: {loop?, once?, duration?, tracks}}'); return }
  for (const [name, c] of Object.entries(anims)) {
    const at = `animations.${name}`
    if (!isName(name)) problems.push(`${at}: bad clip name ${q(name)}`)
    if (c === null) continue // removes the base's clip
    if (!isObj(c)) { problems.push(`${at}: must be {loop?, once?, duration?, tracks}`); continue }
    for (const k of Object.keys(c)) if (!CLIP_KEYS.has(k)) problems.push(`${at}: unknown clip field ${q(k)} (loop, once, duration, tracks)`)
    for (const f of ['loop', 'once']) if (c[f] != null && typeof c[f] !== 'boolean') problems.push(`${at}.${f}: must be true or false`)
    if (c.duration != null && !(fin(c.duration) && c.duration > 0 && c.duration <= 600)) problems.push(`${at}.duration: must be a number of seconds in (0, 600]`)
    if (c.tracks == null) continue
    if (!isObj(c.tracks)) { problems.push(`${at}.tracks: must be {'<node>.<channel>': expression | [[t, v], ...]}`); continue }
    for (const [k, v] of Object.entries(c.tracks)) {
      const ta = `${at}.tracks[${q(k)}]`
      if (!TRACK_RE.test(k)) { problems.push(`${ta}: a track is '<node>.<channel>' with channel one of ${CHANNELS.join(', ')}`); continue }
      if (v === null) continue // removes the base's track
      if (typeof v === 'string') { const e = checkExpr(v); if (e) problems.push(`${ta}: ${e}`) } else if (Array.isArray(v)) checkKeyframes(v, ta, problems)
      else problems.push(`${ta}: must be an expression string or keyframes [[t, v], ...]`)
    }
  }
}

function checkController (c, problems) {
  if (!isObj(c)) { problems.push('controller: must be {states: {state: clip | [clips]}, blend?}'); return }
  for (const k of Object.keys(c)) if (!CONTROLLER_KEYS.has(k)) problems.push(`controller: unknown field ${q(k)} (states, blend)`)
  if (c.blend != null && !(fin(c.blend) && c.blend >= 0 && c.blend <= 10)) problems.push('controller.blend: must be seconds in [0, 10]')
  if (c.states == null) return
  if (!isObj(c.states)) { problems.push('controller.states: must be {state: clip | [clips]}'); return }
  for (const [s, v] of Object.entries(c.states)) {
    const at = `controller.states.${s}`
    if (!isName(s)) problems.push(`${at}: bad state name ${q(s)}`)
    if (v === null) continue
    const list = Array.isArray(v) ? v : [v]
    if (!list.length || list.length > 8) problems.push(`${at}: 1 to 8 clips`)
    for (const x of list) if (typeof x !== 'string' || !isName(x)) problems.push(`${at}: bad clip name ${q(x)}`)
  }
}

// problems in the resolved model: unique names, limits, every track targets an
// existing named node, every controller state names an existing clip
function checkResolved (r, problems, label = '') {
  const pre = label ? `${label}: ` : ''
  const { count, depth } = countNodes(r.nodes)
  if (count > LIMITS.nodes) problems.push(`${pre}${count} nodes (at most ${LIMITS.nodes})`)
  if (depth > LIMITS.depth) problems.push(`${pre}nodes nested ${depth} deep (at most ${LIMITS.depth})`)
  const names = nodeNames(r.nodes)
  const set = new Set()
  for (const n of names) { if (set.has(n)) problems.push(`${pre}duplicate node name ${q(n)} after extends`); set.add(n) }
  let tracks = 0
  for (const [clip, c] of Object.entries(r.animations)) {
    for (const k of Object.keys(c.tracks ?? {})) {
      tracks++
      const node = TRACK_RE.exec(k)?.[1]
      if (node && !set.has(node)) problems.push(`${pre}animations.${clip}.tracks[${q(k)}]: no node named ${q(node)}`)
    }
  }
  if (tracks > LIMITS.tracks) problems.push(`${pre}${tracks} tracks (at most ${LIMITS.tracks})`)
  for (const [s, list] of Object.entries(r.controller.states)) for (const c of list) if (!Object.hasOwn(r.animations, c)) problems.push(`${pre}controller.states.${s}: no clip named ${q(c)}`)
}

const NEW = ' new' // a key no model name can take (names have no spaces)

// -> problems[] (empty when valid). `models`: doc.models (proxy or plain);
// opts.name: the name it is being defined under (for cycles through itself).
// A resolved model (resolveModel / modelData output) is accepted as is.
export function validateModel (model, models = {}, { name } = {}) {
  const problems = []
  const m = plain(model)
  if (!isObj(m)) return ['model must be {extends?, stride?, runSpeed?, nodes, animations?, controller?}']
  for (const p of checkJSON(m, [])) problems.push(p)
  for (const k of Object.keys(m)) if (!MODEL_KEYS.has(k) && !RESOLVED_EXTRAS.includes(k)) problems.push(`unknown model field ${q(k)} (${[...MODEL_KEYS].join(', ')})`)
  const ext = m.extends == null ? '' : m.extends
  if (typeof ext !== 'string' || (ext !== '' && !isName(ext))) problems.push(`extends: bad model name ${q(ext)}`)
  for (const f of ['stride', 'runSpeed']) if (m[f] != null && !(fin(m[f]) && m[f] > 0 && m[f] <= 1000)) problems.push(`${f}: must be a number in (0, 1000]`)
  if (m.description != null && !(typeof m.description === 'string' && m.description.length <= 500)) problems.push('description: a string of at most 500 characters')
  if (m.nodes != null) checkNodes(m.nodes, problems, { allowRemove: !!ext })
  else if (!ext) problems.push('nodes: a model that extends nothing needs nodes')
  if (m.animations != null) checkClips(m.animations, problems)
  if (m.controller != null) checkController(m.controller, problems)
  if (problems.length) return problems
  const all = { ...plain(models ?? {}), [name ?? NEW]: { ...modelBody(m), rev: 0 } }
  let r
  try { r = resolveModel(all, name ?? NEW) } catch (e) { problems.push(String(e?.message ?? e).replace(NEW, '(new model)')); return problems }
  if (ext && m.nodes != null) checkPatchNames(m.nodes, ext, all, problems)
  checkResolved(r, problems)
  return problems
}

// `extends`: a patch entry names a base node to change, or adds a NEW node. An
// entry that names no node of the base and carries only `name` and `children` is
// a stub whose name is misspelt ('right_arm' for 'arm_r'): as a new node it would
// be a shapeless root at the origin, with the hat or staff at the feet. So is a
// `remove: true` that names no node. Both are refused, with the nearest base name.
function checkPatchNames (patches, ext, all, problems) {
  let base
  try { base = resolveModel(all, ext) } catch { return } // reported by the resolve of the model itself
  if (!base) return
  const baseNames = nodeNames(base.nodes)
  const known = new Set(baseNames)
  const walk = (list, path, inPatch) => {
    (Array.isArray(list) ? list : []).forEach((p, i) => {
      if (!isObj(p)) return
      const at = `${path}[${i}]`
      const nm = typeof p.name === 'string' ? p.name : ''
      if (inPatch && nm && known.has(nm)) { walk(p.children, `${at}.children`, true); return }
      if (inPatch && p.remove === true) {
        problems.push(`${at}: remove names ${q(nm)}, which is not a node of ${ext}${hint(nm, baseNames)}`)
        return
      }
      if (inPatch && nm && Object.keys(p).every((k) => k === 'name' || k === 'children')) {
        problems.push(`${at}: ${q(nm)} is not a node of ${ext}${hint(nm, baseNames)}; to add a new node give it a shape or a position (p)`)
      }
      for (const n of nodeNames([p])) known.add(n)
      // a new node's children are new too: nothing under it patches the base
    })
  }
  walk(patches, 'nodes', true)
}

// ' (did you mean "arm_r"?)' — compares names with sides spelt out or abbreviated
// and their parts in any order, so right_arm finds arm_r and Head finds head
const SIDE = { right: 'r', left: 'l', front: 'f', back: 'b', rear: 'b', upper: 'u', lower: 'lo' }
const normName = (n) => String(n).toLowerCase().split(/[_\-\s]+|(?<=[a-z])(?=[0-9])/).filter(Boolean).map((t) => SIDE[t] ?? t).sort().join('_')
function editDistance (a, b) {
  const d = Array.from({ length: b.length + 1 }, (_, j) => j)
  for (let i = 1; i <= a.length; i++) {
    let prev = d[0]; d[0] = i
    for (let j = 1; j <= b.length; j++) { const t = d[j]; d[j] = Math.min(d[j] + 1, d[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = t }
  }
  return d[b.length]
}
function hint (name, names) {
  if (!name || !names.length) return ''
  const a = normName(name)
  let best = null; let bd = Infinity
  for (const n of names) { const dd = Math.min(editDistance(a, normName(n)), editDistance(name.toLowerCase(), n.toLowerCase())); if (dd < bd) { bd = dd; best = n } }
  return best != null && bd <= Math.max(1, Math.floor(a.length / 3)) ? ` (did you mean ${q(best)}?)` : ''
}

// An inline rig look (representation { nodes, animations?, controller? }; what a
// `tree` is). The nodes are checked only for what the renderer needs: a list of
// node objects within the limits. The renderer coerces the rest (an unknown shape
// draws a box, a CSS colour name a default, a short vector its defaults; extra
// fields are ignored), and the `tree` kind accepted any node content before rigs,
// so a strict check would leave existing trees unrenderable-in-the-editor: no
// field edit, not even a replace with the same data, would pass. Clips and the
// controller are checked strictly, and a track must target a name exactly ONE
// node carries (a repeated or missing name is refused only once a track uses it).
export function validateInline (rep, models = {}) {
  void models
  const problems = []
  const r = plain(rep) ?? {}
  const nodes = r.nodes ?? []
  const walk = (list, path, depth) => {
    if (!Array.isArray(list)) { problems.push(`${path}: must be a list of nodes`); return }
    list.forEach((n, i) => {
      const at = `${path}[${i}]`
      if (!isObj(n)) { problems.push(`${at}: must be a node object`); return }
      if (depth > LIMITS.depth) problems.push(`${at}: nodes nested deeper than ${LIMITS.depth}`)
      else if (n.children != null) walk(n.children, `${at}.children`, depth + 1)
    })
  }
  walk(nodes, 'nodes', 1)
  for (const f of ['stride', 'runSpeed']) if (r[f] != null && !(fin(r[f]) && r[f] > 0 && r[f] <= 1000)) problems.push(`${f}: must be a number in (0, 1000]`)
  if (r.animations != null) checkClips(r.animations, problems)
  if (r.controller != null) checkController(r.controller, problems)
  if (problems.length) return problems
  const { count, depth } = countNodes(nodes)
  if (count > LIMITS.nodes) problems.push(`${count} nodes (at most ${LIMITS.nodes})`)
  if (depth > LIMITS.depth) problems.push(`nodes nested ${depth} deep (at most ${LIMITS.depth})`)
  const f = fold([{ nodes, animations: isObj(r.animations) ? r.animations : {}, controller: isObj(r.controller) ? r.controller : {} }])
  const uses = new Map()
  for (const n of nodeNames(f.nodes)) uses.set(n, (uses.get(n) ?? 0) + 1)
  let tracks = 0
  for (const [clip, c] of Object.entries(f.animations)) {
    for (const k of Object.keys(c.tracks ?? {})) {
      tracks++
      const node = TRACK_RE.exec(k)?.[1]
      const u = node ? uses.get(node) ?? 0 : 1
      if (!u) problems.push(`animations.${clip}.tracks[${q(k)}]: no node named ${q(node)}`)
      else if (u > 1) problems.push(`animations.${clip}.tracks[${q(k)}]: ${u} nodes are named ${q(node)}; rename all but one to animate it`)
    }
  }
  if (tracks > LIMITS.tracks) problems.push(`${tracks} tracks (at most ${LIMITS.tracks})`)
  for (const [st, list] of Object.entries(f.controller.states)) for (const c of list) if (!Object.hasOwn(f.animations, c)) problems.push(`controller.states.${st}: no clip named ${q(c)}`)
  return problems
}

// the models whose extends chain passes through `name` (not `name` itself)
export function dependentsOf (models, name) {
  const out = []
  for (const n of Object.keys(models ?? {})) {
    if (n === name) continue
    let cur = str(own(models, n)?.extends); let hops = 0
    while (cur && hops++ <= LIMITS.extendsDepth) { if (cur === name) { out.push(n); break } cur = str(own(models, cur)?.extends) }
  }
  return out.sort()
}

// library models in dependency order (bases first)
export const LIBRARY_ORDER = Object.freeze((() => {
  const out = []
  const visit = (n) => { if (out.includes(n)) return; const e = str(MODEL_LIBRARY[n]?.extends); if (e && MODEL_LIBRARY[e]) visit(e); out.push(n) }
  for (const n of Object.keys(MODEL_LIBRARY)) visit(n)
  return out
})())

// -> defineModel ops for every library model missing from doc.models, bases
// first. Never touches a model the doc already has (an edited horse stays as
// edited), and skips a library model that would not validate against the doc's
// edited bases (it would refuse the whole batch).
export function ensureLibraryOps (doc) {
  const have = plain(doc?.models ?? {})
  const ops = []
  for (const name of LIBRARY_ORDER) {
    if (isObj(have[name])) continue
    const model = clone(MODEL_LIBRARY[name])
    if (validateModel(model, have, { name }).length) continue
    ops.push({ op: 'defineModel', name, model })
    have[name] = { ...model, rev: 1 }
  }
  return ops
}

// the doc form of a new library model (seedDoc writes these directly)
export function libraryDocModels (toDoc) {
  const out = {}
  for (const name of LIBRARY_ORDER) out[name] = { ...toDoc(clone(MODEL_LIBRARY[name])), rev: new Counter(1) }
  return out
}
