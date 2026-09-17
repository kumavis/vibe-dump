// The map of Simville.
//
// The town is generated once, deterministically, from the tables below: the
// buildings are hand-placed, everything else (paths, pond, trees, flowers) is
// derived from them with a seeded RNG. That keeps the layout editable as data
// while still looking organic, and means every visitor sees the same town.
//
// The view is "dollhouse" top-down: buildings have floors and walls but no
// roof, so you can watch people move around inside them.

export const MAP_W = 56
export const MAP_H = 34
export const TILE = 24

export const T = {
  GRASS: 0,
  GRASS2: 1,
  PATH: 2,
  PLAZA: 3,
  WATER: 4,
  SHALLOW: 5,
  TREE: 6,
  FLOWER: 7,
  FLOOR: 8,
  WALL: 9,
  DOOR: 10,
  DOCK: 11,
  REED: 12,
}

const BLOCKED = new Set([T.WATER, T.TREE, T.WALL])

export function mulberry32(seed) {
  let a = seed >>> 0
  return function rng() {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// x, y is the top-left corner; w, h include the wall ring. `door` is the wall
// the doorway is cut into, and it always opens onto a path.
export const BUILDINGS = [
  { id: 'kettle', name: 'The Kettle', short: 'the Kettle', kind: 'cafe', x: 27, y: 9, w: 10, h: 7, door: 'S' },
  { id: 'library', name: 'Reading Room', short: 'the reading room', kind: 'library', x: 42, y: 7, w: 11, h: 8, door: 'W' },
  { id: 'workshop', name: 'Workshop', short: 'the workshop', kind: 'workshop', x: 41, y: 21, w: 10, h: 7, door: 'N' },
  { id: 'market', name: 'Market Hall', short: 'the market hall', kind: 'market', x: 17, y: 12, w: 8, h: 7, door: 'E' },
  { id: 'studio', name: 'Studio', short: 'the studio', kind: 'studio', x: 5, y: 14, w: 8, h: 6, door: 'E' },
  { id: 'watch', name: 'Watch House', short: 'the watch house', kind: 'watch', x: 30, y: 25, w: 8, h: 6, door: 'N' },
  { id: 'home-rosa', name: 'Rosa’s', short: 'Rosa’s cottage', kind: 'home', x: 6, y: 4, w: 6, h: 5, door: 'S' },
  { id: 'home-bo', name: 'Bo’s', short: 'Bo’s cottage', kind: 'home', x: 15, y: 3, w: 6, h: 5, door: 'S' },
  { id: 'home-nadia', name: 'Nadia’s', short: 'Nadia’s cottage', kind: 'home', x: 24, y: 3, w: 6, h: 5, door: 'S' },
  { id: 'home-milo', name: 'Milo’s', short: 'Milo’s house', kind: 'home', x: 38, y: 2, w: 6, h: 5, door: 'S' },
  { id: 'home-oma', name: 'Oma’s', short: 'Oma’s cottage', kind: 'home', x: 47, y: 16, w: 6, h: 5, door: 'W' },
  { id: 'home-yusef', name: 'Yusef’s', short: 'Yusef’s place', kind: 'home', x: 3, y: 25, w: 6, h: 5, door: 'E' },
]

const PLAZA = { cx: 32, cy: 20, rx: 6, ry: 4 }
const POND = { cx: 18, cy: 28, rx: 7.5, ry: 4 }

// Outdoor places people go that aren't buildings.
export const PLACES = {
  square: { name: 'the square', short: 'the square', x: 32, y: 20 },
  well: { name: 'the well', short: 'the well', x: 32, y: 20 },
  pond: { name: 'the pond', short: 'the pond', x: 18, y: 23 },
  dock: { name: 'the dock', short: 'the dock', x: 18, y: 23 },
  bench: { name: 'the bench', short: 'the bench by the pond', x: 24, y: 24 },
  lane: { name: 'the lane', short: 'the lane', x: 32, y: 8 },
  // Out at the western treeline, where the wood gets split.
  woods: { name: 'the woodpile', short: 'the woodpile', x: 5, y: 10 },
}

// Fixed decoration the renderer draws on top of the tiles. Lamps are also the
// night lighting, so they're spaced along the paths people actually use.
export const PROPS = [
  { kind: 'well', x: 32, y: 20 },
  { kind: 'bench', x: 24, y: 24, dir: 'S' },
  { kind: 'bench', x: 29, y: 17, dir: 'S' },
  { kind: 'bench', x: 36, y: 22, dir: 'N' },
  { kind: 'lamp', x: 27, y: 17 },
  { kind: 'lamp', x: 37, y: 17 },
  { kind: 'lamp', x: 27, y: 23 },
  { kind: 'lamp', x: 37, y: 23 },
  { kind: 'lamp', x: 26, y: 8 },
  { kind: 'lamp', x: 40, y: 12 },
  { kind: 'lamp', x: 22, y: 22 },
  { kind: 'lamp', x: 13, y: 11 },
  { kind: 'lamp', x: 40, y: 27 },
  { kind: 'stall', x: 27, y: 18, hue: 8 },
  { kind: 'stall', x: 35, y: 18, hue: 200 },
  { kind: 'stall', x: 30, y: 23, hue: 120 },
  { kind: 'crate', x: 26, y: 21 },
  { kind: 'crate', x: 38, y: 19 },
  { kind: 'planter', x: 30, y: 16 },
  { kind: 'planter', x: 34, y: 16 },
  { kind: 'boat', x: 15, y: 27 },
  { kind: 'logs', x: 5, y: 10 },
  { kind: 'logs', x: 4, y: 12 },
  { kind: 'crate', x: 7, y: 9 },
]

function inEllipse(x, y, e) {
  const dx = (x - e.cx) / e.rx
  const dy = (y - e.cy) / e.ry
  return dx * dx + dy * dy
}

// Where a building's doorway sits, and the tile just outside it that paths run
// to. Both are derived from the rect so moving a building moves its door.
export function doorOf(b) {
  const midX = b.x + (b.w >> 1)
  const midY = b.y + (b.h >> 1)
  switch (b.door) {
    case 'N': return { x: midX, y: b.y, out: { x: midX, y: b.y - 1 }, in: { x: midX, y: b.y + 1 } }
    case 'S': return { x: midX, y: b.y + b.h - 1, out: { x: midX, y: b.y + b.h }, in: { x: midX, y: b.y + b.h - 2 } }
    case 'W': return { x: b.x, y: midY, out: { x: b.x - 1, y: midY }, in: { x: b.x + 1, y: midY } }
    default: return { x: b.x + b.w - 1, y: midY, out: { x: b.x + b.w, y: midY }, in: { x: b.x + b.w - 2, y: midY } }
  }
}

export function buildTown(seed = 20260917) {
  const rng = mulberry32(seed)
  const tiles = new Uint8Array(MAP_W * MAP_H)
  const at = (x, y) => y * MAP_W + x
  const get = (x, y) => (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H ? T.WALL : tiles[at(x, y)])
  const set = (x, y, t) => {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return
    tiles[at(x, y)] = t
  }

  // Grass, with a second shade scattered through it so the ground isn't flat.
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) set(x, y, rng() < 0.22 ? T.GRASS2 : T.GRASS)
  }

  // Pond, with a reed fringe and a shallow rim.
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const d = inEllipse(x, y, POND)
      if (d < 0.72) set(x, y, T.WATER)
      else if (d < 1) set(x, y, T.SHALLOW)
      else if (d < 1.25 && rng() < 0.5) set(x, y, T.REED)
    }
  }
  // A short dock out from the north bank — somewhere to stand and look at it.
  for (let y = 23; y <= 26; y++) set(18, y, T.DOCK)

  // The plaza.
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      if (inEllipse(x, y, PLAZA) < 1) set(x, y, T.PLAZA)
    }
  }

  // Buildings: a wall ring, a floor inside, and a doorway cut through.
  for (const b of BUILDINGS) {
    for (let y = b.y; y < b.y + b.h; y++) {
      for (let x = b.x; x < b.x + b.w; x++) {
        const edge = x === b.x || y === b.y || x === b.x + b.w - 1 || y === b.y + b.h - 1
        set(x, y, edge ? T.WALL : T.FLOOR)
      }
    }
    const d = doorOf(b)
    set(d.x, d.y, T.DOOR)
  }

  // Paths: every doorstep routes to the plaza, which makes a star of lanes that
  // then get stitched together by the ring below.
  const carve = (ax, ay, bx, by, horizFirst) => {
    let x = ax
    let y = ay
    const step = () => {
      const t = get(x, y)
      if (t === T.GRASS || t === T.GRASS2 || t === T.FLOWER || t === T.REED || t === T.TREE) set(x, y, T.PATH)
    }
    step()
    if (horizFirst) {
      while (x !== bx) { x += Math.sign(bx - x); step() }
      while (y !== by) { y += Math.sign(by - y); step() }
    } else {
      while (y !== by) { y += Math.sign(by - y); step() }
      while (x !== bx) { x += Math.sign(bx - x); step() }
    }
  }

  for (const b of BUILDINGS) {
    const d = doorOf(b)
    carve(d.out.x, d.out.y, PLAZA.cx, PLAZA.cy, b.door === 'E' || b.door === 'W')
  }
  carve(PLAZA.cx, PLAZA.cy, PLACES.bench.x, PLACES.bench.y, false)
  carve(PLACES.bench.x, PLACES.bench.y, 18, 22, true)
  carve(13, 11, 13, 22, false)
  // A track out to the woodpile, otherwise it sits behind a wall of trees.
  carve(13, 11, PLACES.woods.x, PLACES.woods.y, true)
  carve(40, 12, 40, 20, false)

  // Trees and flowers fill the leftovers. Trees keep off the paths so they
  // never wall a doorway in; flowers don't care.
  const nearTraffic = (x, y) => {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const t = get(x + dx, y + dy)
        if (t === T.PATH || t === T.PLAZA || t === T.DOOR || t === T.FLOOR || t === T.DOCK) return true
      }
    }
    return false
  }
  for (let y = 0; y < MAP_H; y++) {
    for (let x = 0; x < MAP_W; x++) {
      const t = get(x, y)
      if (t !== T.GRASS && t !== T.GRASS2) continue
      // Denser at the edges of the map, so the town reads as a clearing.
      const edge = Math.min(x, y, MAP_W - 1 - x, MAP_H - 1 - y)
      const p = edge < 2 ? 0.55 : edge < 4 ? 0.3 : 0.07
      if (!nearTraffic(x, y) && rng() < p) set(x, y, T.TREE)
      else if (rng() < 0.05) set(x, y, T.FLOWER)
    }
  }

  return { tiles, get, set, seed }
}

export function isWalkable(town, x, y) {
  if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return false
  return !BLOCKED.has(town.tiles[y * MAP_W + x])
}

// A* over the tile grid. The map is 1904 tiles, so a plain sorted-insert open
// list is quicker than it has any right to be and much easier to read.
export function findPath(town, from, to) {
  const start = from.y * MAP_W + from.x
  const goal = to.y * MAP_W + to.x
  if (start === goal) return []
  if (!isWalkable(town, to.x, to.y)) return null

  const came = new Map()
  const gScore = new Map([[start, 0]])
  const open = [{ i: start, f: 0 }]
  const h = (i) => Math.abs((i % MAP_W) - to.x) + Math.abs(((i / MAP_W) | 0) - to.y)

  while (open.length) {
    const current = open.shift()
    if (current.i === goal) {
      const path = []
      let i = goal
      while (i !== start) {
        path.push({ x: i % MAP_W, y: (i / MAP_W) | 0 })
        i = came.get(i)
      }
      return path.reverse()
    }
    const cx = current.i % MAP_W
    const cy = (current.i / MAP_W) | 0
    const g = gScore.get(current.i)
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = cx + dx
      const ny = cy + dy
      if (!isWalkable(town, nx, ny)) continue
      const ni = ny * MAP_W + nx
      // Doorways are pinch points; nudging the cost up keeps people from
      // cutting through a building just to shave a step off a walk outside it.
      const t = town.tiles[ni]
      const cost = t === T.DOOR ? 2 : t === T.FLOOR ? 1.4 : 1
      const ng = g + cost
      if (gScore.has(ni) && gScore.get(ni) <= ng) continue
      gScore.set(ni, ng)
      came.set(ni, current.i)
      const f = ng + h(ni)
      let lo = 0
      let hi = open.length
      while (lo < hi) {
        const mid = (lo + hi) >> 1
        if (open[mid].f < f) lo = mid + 1
        else hi = mid
      }
      open.splice(lo, 0, { i: ni, f })
    }
  }
  return null
}

// Every place an agent can be sent, as a walkable tile plus the words used for
// it in dialogue and the memory stream.
export function buildLocations(town) {
  const locs = new Map()
  for (const b of BUILDINGS) {
    // Aim at the middle of the room, not the doorstep — sending everyone to the
    // tile inside the door puts the whole lunch crowd in one corner of the café.
    locs.set(b.id, {
      id: b.id,
      name: b.name,
      short: b.short,
      kind: b.kind,
      building: b,
      x: b.x + (b.w >> 1),
      y: b.y + (b.h >> 1),
      rect: b,
      spread: Math.max(1, Math.min(b.w, b.h) / 2 - 0.5),
    })
  }
  for (const [id, p] of Object.entries(PLACES)) {
    locs.set(id, { id, name: p.name, short: p.short, kind: 'outdoor', x: p.x, y: p.y, spread: 2.5 })
  }
  // Everything has to be standable — a typo in the tables above would otherwise
  // strand somebody forever, so nudge to the nearest open tile instead.
  for (const loc of locs.values()) {
    if (isWalkable(town, loc.x, loc.y)) continue
    outer: for (let r = 1; r < 8; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (isWalkable(town, loc.x + dx, loc.y + dy)) {
            loc.x += dx
            loc.y += dy
            break outer
          }
        }
      }
    }
  }
  return locs
}

// Layout problems that would strand somebody, as a list of sentences.
//
// The buildings are hand-placed and the paths are derived from them, so it is
// entirely possible to drop a cottage where another building's doorstep needs
// to be — which is not visible on the map and shows up hours later as one
// resident who never left the house. This checks the thing that actually
// matters: can you walk from the square to everywhere and back.
export function townProblems(town, locations) {
  const problems = []
  const square = locations.get('square')

  for (const b of BUILDINGS) {
    const d = doorOf(b)
    if (!isWalkable(town, d.out.x, d.out.y)) {
      problems.push(`${b.id}: the tile outside its door (${d.out.x},${d.out.y}) is blocked`)
    }
  }

  for (const loc of locations.values()) {
    if (loc.id === 'square') continue
    if (!findPath(town, { x: square.x, y: square.y }, { x: loc.x, y: loc.y })) {
      problems.push(`${loc.id}: no way to walk there from the square`)
    }
  }
  return problems
}

// A loose spot inside a location, so a group of people don't stack on one tile.
export function scatterNear(town, loc, rng, spread = loc.spread ?? 2) {
  for (let tries = 0; tries < 24; tries++) {
    const x = Math.round(loc.x + (rng() * 2 - 1) * spread)
    const y = Math.round(loc.y + (rng() * 2 - 1) * spread)
    if (!isWalkable(town, x, y)) continue
    // Stay inside the building you were sent to.
    if (loc.rect) {
      const b = loc.rect
      if (x <= b.x || y <= b.y || x >= b.x + b.w - 1 || y >= b.y + b.h - 1) continue
    }
    return { x, y }
  }
  return { x: loc.x, y: loc.y }
}
