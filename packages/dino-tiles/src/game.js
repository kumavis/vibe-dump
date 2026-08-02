// Pure game logic for Dino Tiles — no DOM, no three.js, so the star
// thresholds can be calibrated by headless autoplay in node.

export const R = 3 // hex board radius → 37 cells

export const TILES = {
  parasaur: {
    name: 'Parasaurolophus', icon: '🎺', kind: 'dino', species: 'parasaur', prey: true, base: 5,
    rule: '+6 per parasaur neighbor · loves lakes & gardens',
  },
  stego: {
    name: 'Stegosaurus', icon: '🌵', kind: 'dino', species: 'stego', prey: true, base: 6,
    rule: '+6 per stego neighbor · loves lakes & gardens',
  },
  trike: {
    name: 'Triceratops', icon: '🦬', kind: 'dino', species: 'trike', prey: true, base: 7,
    rule: '+6 per trike neighbor · loves lakes & gardens',
  },
  raptor: {
    name: 'Velociraptor', icon: '🗡️', kind: 'dino', species: 'raptor', predator: true, base: 8,
    rule: '+6 per raptor · scares herbivores (−8) unless fenced',
  },
  trex: {
    name: 'T-Rex', icon: '👑', kind: 'dino', species: 'trex', predator: true, loner: true, base: 20,
    rule: '+5 per EMPTY neighbor · −6 per any dino neighbor',
  },
  lake: {
    name: 'Lake', icon: '🌊', kind: 'scenery', base: 2,
    rule: '+4 per dino neighbor',
  },
  garden: {
    name: 'Garden', icon: '🌳', kind: 'scenery', base: 2,
    rule: '+3 per non-empty neighbor',
  },
  snack: {
    name: 'Snack Stand', icon: '🌭', kind: 'scenery', base: 3,
    rule: '+5 per different species around it',
  },
  fence: {
    name: 'Fence', icon: '⛓️', kind: 'scenery', base: 1,
    rule: '+4 per predator neighbor · fenced predators scare no one',
  },
}

// Fixed deck composition: every run is fair, stars mean something.
const DECK = [
  ...Array(5).fill('parasaur'),
  ...Array(4).fill('stego'),
  ...Array(4).fill('trike'),
  ...Array(4).fill('raptor'),
  ...Array(2).fill('trex'),
  ...Array(4).fill('lake'),
  ...Array(3).fill('garden'),
  ...Array(2).fill('snack'),
  ...Array(2).fill('fence'),
]

// Calibrated by headless autoplay: random play ≈ 262, myopic-greedy ≈ 525.
// 3★ sits above the greedy median — it takes actual planning.
export const STARS = [320, 450, 550]

export function cellsList() {
  const out = []
  for (let q = -R; q <= R; q++) {
    for (let r = -R; r <= R; r++) {
      if (Math.abs(q + r) <= R) out.push({ q, r, key: `${q},${r}` })
    }
  }
  return out
}

const DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]

export function neighborKeys(q, r) {
  const out = []
  for (const [dq, dr] of DIRS) {
    const nq = q + dq
    const nr = r + dr
    if (Math.abs(nq) <= R && Math.abs(nr) <= R && Math.abs(nq + nr) <= R) out.push(`${nq},${nr}`)
  }
  return out
}

export function newRun(rng = Math.random) {
  const deck = [...DECK]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return { board: {}, deck, idx: 0, score: 0, done: false }
}

export function currentTile(run) {
  return run.deck[run.idx] ?? null
}

export function upcoming(run, n = 2) {
  return run.deck.slice(run.idx + 1, run.idx + 1 + n)
}

function isSafePredator(run, key) {
  // A predator with a fence neighbor is on its best behavior.
  const [q, r] = key.split(',').map(Number)
  return neighborKeys(q, r).some((nk) => run.board[nk] === 'fence')
}

// Connected same-species group size including `key`.
function groupSize(run, key, species) {
  const seen = new Set([key])
  const stack = [key]
  while (stack.length) {
    const cur = stack.pop()
    const [q, r] = cur.split(',').map(Number)
    for (const nk of neighborKeys(q, r)) {
      if (!seen.has(nk) && TILES[run.board[nk]]?.species === species) {
        seen.add(nk)
        stack.push(nk)
      }
    }
  }
  return seen.size
}

// Score the placement of `tileKey` at (q,r). Returns breakdown events.
export function scorePlacement(run, q, r, tileKey) {
  const tile = TILES[tileKey]
  const key = `${q},${r}`
  const events = [{ label: tile.name, amount: tile.base }]
  const nks = neighborKeys(q, r)
  const filled = nks.filter((nk) => run.board[nk])
  const add = (label, amount) => amount && events.push({ label, amount })

  if (tile.kind === 'dino') {
    let same = 0
    let friendly = 0
    let fright = 0
    let lakes = 0
    let gardens = 0
    let snacks = 0
    for (const nk of filled) {
      const other = TILES[run.board[nk]]
      if (other.kind === 'dino') {
        if (tile.loner || other.loner) {
          // handled below for trex itself; a dino next to a trex is scared
          if (other.loner && !tile.loner) fright += 1
        } else if (other.species === tile.species) same += 1
        else if (tile.prey && other.prey) friendly += 1
        if (tile.prey && other.species === 'raptor' && !isSafePredator(run, nk)) fright += 1
      }
      if (run.board[nk] === 'lake') lakes += 1
      if (run.board[nk] === 'garden') gardens += 1
      if (run.board[nk] === 'snack') snacks += 1
    }
    if (tile.loner) {
      const dinoNbs = filled.filter((nk) => TILES[run.board[nk]].kind === 'dino').length
      const empties = nks.length - filled.length
      add('Room to roar', empties * 5)
      add('Too close!', dinoNbs * -6)
    } else {
      add('Herd friends', same * 6)
      add('Good neighbors', friendly * 2)
      if (tileKey === 'raptor' && !isSafePredator(run, key)) {
        const scared = filled.filter((nk) => TILES[run.board[nk]]?.prey && true).length
        add('Frightened!', scared * -8)
      }
      add('Frightened!', fright * -8)
    }
    add('Waterfront', lakes * 4)
    add('Garden calm', gardens * 3)
    add('Snack time', snacks * 3)
  } else if (tileKey === 'lake') {
    const dinos = filled.filter((nk) => TILES[run.board[nk]].kind === 'dino').length
    add('Waterfront', dinos * 4)
  } else if (tileKey === 'garden') {
    add('Greenery', filled.length * 3)
  } else if (tileKey === 'snack') {
    const species = new Set(filled.map((nk) => TILES[run.board[nk]].species).filter(Boolean))
    add('Variety show', species.size * 5)
  } else if (tileKey === 'fence') {
    const preds = filled.filter((nk) => TILES[run.board[nk]]?.predator).length
    add('Safety first', preds * 4)
  }
  return events
}

// Post-placement group bonuses (herd of 3, growing herds, raptor packs).
function groupBonus(run, key, tileKey) {
  const tile = TILES[tileKey]
  if (tile.kind !== 'dino' || tile.loner) return null
  const size = groupSize(run, key, tile.species)
  if (size === 3) {
    return tileKey === 'raptor' ? { label: 'PACK HUNTS!', amount: 30, big: true } : { label: 'HERD!', amount: 25, big: true }
  }
  if (size > 3) return { label: 'Growing herd', amount: 10 }
  return null
}

export function place(run, q, r) {
  const key = `${q},${r}`
  if (run.done || run.board[key]) return { ok: false }
  const tileKey = currentTile(run)
  if (!tileKey) return { ok: false }
  const events = scorePlacement(run, q, r, tileKey)
  run.board[key] = tileKey
  const bonus = groupBonus(run, key, tileKey)
  if (bonus) events.push(bonus)
  const delta = events.reduce((t, e) => t + e.amount, 0)
  run.score = Math.max(0, run.score + delta)
  run.idx += 1
  const empties = cellsList().filter((c) => !run.board[c.key]).length
  if (run.idx >= run.deck.length || empties === 0) run.done = true
  return { ok: true, delta, events, tileKey, done: run.done }
}

export function starsFor(score) {
  return STARS.filter((t) => score >= t).length
}
