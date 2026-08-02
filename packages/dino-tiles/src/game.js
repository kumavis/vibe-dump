// Pure game logic for Dino Tiles — no DOM, no three.js.
// Endless mode: the board grows outward from a starting lake; any empty cell
// touching a placed tile is buildable. Tiles arrive from an infinite weighted
// queue, and a rolling quest chain gives the run its goals.

export const TILES = {
  parasaur: {
    name: 'Parasaurolophus', color: '#58c9a5', kind: 'dino', species: 'parasaur', prey: true, base: 5,
    rule: '+6 per parasaur in the pen · loves lakes & gardens · fears predators',
  },
  stego: {
    name: 'Stegosaurus', color: '#7cb342', kind: 'dino', species: 'stego', prey: true, base: 6,
    rule: '+6 per stego in the pen · loves lakes & gardens · fears predators',
  },
  trike: {
    name: 'Triceratops', color: '#6f8fc9', kind: 'dino', species: 'trike', prey: true, base: 7,
    rule: '+6 per trike in the pen · loves lakes & gardens · fears predators',
  },
  raptor: {
    name: 'Velociraptor', color: '#ff9840', kind: 'dino', species: 'raptor', predator: true, base: 8,
    rule: '+6 per raptor in the pack · scares neighboring herbivores (−8)',
  },
  trex: {
    name: 'T-Rex', color: '#c0574f', kind: 'dino', species: 'trex', predator: true, loner: true, base: 20,
    rule: '+6 per lake or garden neighbor · −6 per neighboring dino',
  },
  lake: {
    name: 'Lake', color: '#6fc8e8', kind: 'scenery', base: 2,
    rule: '+4 per dino neighbor',
  },
  garden: {
    name: 'Garden', color: '#7ccf5f', kind: 'scenery', base: 2,
    rule: '+3 per non-empty neighbor',
  },
  snack: {
    name: 'Snack Stand', color: '#f2c14e', kind: 'scenery', base: 3,
    rule: '+5 per different species around it',
  },
}

const QUEUE_WEIGHTS = [
  ['parasaur', 0.18],
  ['stego', 0.15],
  ['trike', 0.13],
  ['raptor', 0.13],
  ['trex', 0.06],
  ['lake', 0.15],
  ['garden', 0.13],
  ['snack', 0.07],
]

function drawTile(rng = Math.random) {
  let roll = rng()
  for (const [key, w] of QUEUE_WEIGHTS) {
    roll -= w
    if (roll <= 0) return key
  }
  return 'parasaur'
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]

export function neighborKeys(q, r) {
  return DIRS.map(([dq, dr]) => `${q + dq},${r + dr}`)
}

export function parseKey(key) {
  return key.split(',').map(Number)
}

export function newRun() {
  const run = {
    v: 2,
    board: { '0,0': 'lake' }, // the founding lake
    queue: [],
    score: 0,
    placed: 0,
    questIdx: 0,
    questDone: 0,
  }
  refill(run)
  return run
}

export function refill(run) {
  while (run.queue.length < 3) run.queue.push(drawTile())
}

export function currentTile(run) {
  return run.queue[0] ?? null
}

export function upcoming(run, n = 2) {
  return run.queue.slice(1, 1 + n)
}

// Buildable frontier: empty cells adjacent to anything placed.
export function frontierKeys(run) {
  const out = new Set()
  for (const key of Object.keys(run.board)) {
    const [q, r] = parseKey(key)
    for (const nk of neighborKeys(q, r)) {
      if (!run.board[nk]) out.add(nk)
    }
  }
  return out
}

// Connected same-species pen size including `key`.
export function groupSize(run, key, species) {
  const seen = new Set([key])
  const stack = [key]
  while (stack.length) {
    const cur = stack.pop()
    const [q, r] = parseKey(cur)
    for (const nk of neighborKeys(q, r)) {
      if (!seen.has(nk) && TILES[run.board[nk]]?.species === species) {
        seen.add(nk)
        stack.push(nk)
      }
    }
  }
  return seen.size
}

export function scorePlacement(run, q, r, tileKey) {
  const tile = TILES[tileKey]
  const events = [{ label: tile.name, amount: tile.base }]
  const filled = neighborKeys(q, r).filter((nk) => run.board[nk])
  const add = (label, amount) => amount && events.push({ label, amount })

  if (tile.kind === 'dino') {
    let same = 0
    let friendly = 0
    let fright = 0
    let lakes = 0
    let gardens = 0
    let snacks = 0
    let dinoNbs = 0
    for (const nk of filled) {
      const other = TILES[run.board[nk]]
      if (other.kind === 'dino') {
        dinoNbs += 1
        if (!tile.loner && !other.loner) {
          if (other.species === tile.species) same += 1
          else if (tile.prey && other.prey) friendly += 1
        }
        if (tile.prey && other.predator) fright += 1
      }
      if (run.board[nk] === 'lake') lakes += 1
      if (run.board[nk] === 'garden') gardens += 1
      if (run.board[nk] === 'snack') snacks += 1
    }
    if (tile.loner) {
      add('Scenic solitude', (lakes + gardens) * 6)
      add('Too close!', dinoNbs * -6)
      add('Snack time', snacks * 3)
    } else {
      add('Pen mates', same * 6)
      add('Good neighbors', friendly * 2)
      if (tile.predator) {
        const scared = filled.filter((nk) => TILES[run.board[nk]]?.prey).length
        add('Terrified herd!', scared * -8)
      }
      add('Terrified!', fright * -8)
      add('Waterfront', lakes * 4)
      add('Garden calm', gardens * 3)
      add('Snack time', snacks * 3)
    }
  } else if (tileKey === 'lake') {
    const dinos = filled.filter((nk) => TILES[run.board[nk]].kind === 'dino').length
    add('Waterfront', dinos * 4)
  } else if (tileKey === 'garden') {
    add('Greenery', filled.length * 3)
  } else if (tileKey === 'snack') {
    const species = new Set(filled.map((nk) => TILES[run.board[nk]].species).filter(Boolean))
    add('Variety show', species.size * 5)
  }
  return events
}

function groupBonus(run, key, tileKey) {
  const tile = TILES[tileKey]
  if (tile.kind !== 'dino' || tile.loner) return null
  const size = groupSize(run, key, tile.species)
  if (size === 3) {
    return tile.predator ? { label: 'PACK HUNTS!', amount: 30, big: true } : { label: 'A HERD FORMS!', amount: 25, big: true }
  }
  if (size > 3) return { label: 'Growing pen', amount: 10 }
  return null
}

// ---------------------------------------------------------------- quests
// A rolling chain: each quest is a live measurement against a target.

const QUEST_SEQ = [
  { type: 'herd', n: 3 },
  { type: 'variety', n: 3 },
  { type: 'lakeside', n: 3 },
  { type: 'herd', n: 5 },
  { type: 'snackhub', n: 3 },
  { type: 'score', n: 600 },
  { type: 'herd', n: 7 },
  { type: 'variety', n: 5 },
  { type: 'lakeside', n: 8 },
  { type: 'score', n: 1500 },
  { type: 'herd', n: 9 },
  { type: 'snackhub', n: 4 },
]

function questSpec(idx) {
  if (idx < QUEST_SEQ.length) return QUEST_SEQ[idx]
  // Beyond the scripted chain: alternate ever-bigger pens and score marks.
  const k = idx - QUEST_SEQ.length
  return k % 2 === 0 ? { type: 'herd', n: 11 + k } : { type: 'score', n: 2500 + k * 1200 }
}

function measure(run, spec) {
  const dinoKeys = Object.keys(run.board).filter((k) => TILES[run.board[k]].kind === 'dino')
  switch (spec.type) {
    case 'herd': {
      let best = 0
      for (const k of dinoKeys) {
        const t = TILES[run.board[k]]
        if (t.loner) continue
        best = Math.max(best, groupSize(run, k, t.species))
      }
      return best
    }
    case 'variety':
      return new Set(dinoKeys.map((k) => TILES[run.board[k]].species)).size
    case 'lakeside':
      return dinoKeys.filter((k) => {
        const [q, r] = parseKey(k)
        return neighborKeys(q, r).some((nk) => run.board[nk] === 'lake')
      }).length
    case 'snackhub': {
      let best = 0
      for (const k of Object.keys(run.board).filter((k) => run.board[k] === 'snack')) {
        const [q, r] = parseKey(k)
        const species = new Set(
          neighborKeys(q, r)
            .map((nk) => TILES[run.board[nk]]?.species)
            .filter(Boolean)
        )
        best = Math.max(best, species.size)
      }
      return best
    }
    case 'score':
      return run.score
    default:
      return 0
  }
}

export function questStatus(run) {
  const spec = questSpec(run.questIdx)
  const label = {
    herd: `Build a pen of ${spec.n} same-species dinos`,
    variety: `Host ${spec.n} different dino species`,
    lakeside: `Give ${spec.n} dinos a lakeside view`,
    snackhub: `Ring a snack stand with ${spec.n} species`,
    score: `Reach ${spec.n} points`,
  }[spec.type]
  return { label, progress: Math.min(measure(run, spec), spec.n), target: spec.n }
}

function questReward(idx) {
  return 50 + idx * 15
}

// ---------------------------------------------------------------- place

export function place(run, q, r) {
  const key = `${q},${r}`
  if (run.board[key] || !frontierKeys(run).has(key)) return { ok: false }
  const tileKey = currentTile(run)
  if (!tileKey) return { ok: false }
  const events = scorePlacement(run, q, r, tileKey)
  run.board[key] = tileKey
  run.placed += 1
  const bonus = groupBonus(run, key, tileKey)
  if (bonus) events.push(bonus)
  let delta = events.reduce((t, e) => t + e.amount, 0)
  run.score = Math.max(0, run.score + delta)

  // Quests can chain if one completion satisfies the next.
  for (let guard = 0; guard < 3; guard++) {
    const spec = questSpec(run.questIdx)
    if (measure(run, spec) < spec.n) break
    const reward = questReward(run.questIdx)
    run.questIdx += 1
    run.questDone += 1
    run.score += reward
    delta += reward
    events.push({ label: 'QUEST COMPLETE', amount: reward, big: true })
  }

  run.queue.shift()
  refill(run)
  return { ok: true, delta, events, tileKey }
}
