export const SUITS = [
  { name: 'Sand', color: '#b6a079', family: 0 },
  { name: 'Scarlet', color: '#e45a42', family: 1 },
  { name: 'Lemon', color: '#d4b747', family: 0 },
  { name: 'Chestnut', color: '#9b4939', family: 1 },
]
export const rankName = rank => ({ 1: 'Ace', 11: 'Jack', 12: 'Queen', 13: 'King' })[rank] || String(rank)
export const label = c => `${rankName(c.rank)} of ${SUITS[c.suit].name} mushrooms`
export function newGame(random = Math.random) {
  const deck = SUITS.flatMap((_, suit) => Array.from({ length: 13 }, (_, i) => ({ id: `${suit}-${i + 1}`, suit, rank: i + 1, faceUp: false })))
  for (let i = 51; i > 0; i--) {
    const j = Math.floor(random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  const tableau = Array.from({ length: 7 }, (_, col) => Array.from({ length: col + 1 }, (_, row) => ({ ...deck.pop(), faceUp: row === col })))
  return { stock: deck, waste: [], foundations: [[], [], [], []], tableau, moves: 0, seconds: 0, started: false }
}
export const clone = s => JSON.parse(JSON.stringify(s))
export function pile(s, loc) {
  return loc.type === 'tableau' ? s.tableau[loc.col] : loc.type === 'foundation' ? s.foundations[loc.col] : loc.type === 'waste' ? s.waste : s.stock
}
export function movingCards(s, loc) {
  const p = pile(s, loc)
  if (!p?.length || loc.type === 'stock') return []
  const index = loc.index ?? p.length - 1
  if (index < 0 || index >= p.length || (loc.type !== 'tableau' && index !== p.length - 1)) return []
  const cards = p.slice(index)
  if (cards.some(c => !c.faceUp)) return []
  if (cards.some((c, i) => i > 0 && (cards[i - 1].rank !== c.rank + 1 || SUITS[cards[i - 1].suit].family === SUITS[c.suit].family))) return []
  return cards
}
export function canMove(s, from, to) {
  if (!from || !to || (from.type === to.type && from.col === to.col)) return false
  const cards = movingCards(s, from), target = pile(s, to)
  if (!cards.length || !target) return false
  const first = cards[0], top = target.at(-1)
  if (to.type === 'foundation') return cards.length === 1 && first.suit === to.col && first.rank === (top?.rank || 0) + 1
  if (to.type === 'tableau') return top ? top.faceUp && top.rank === first.rank + 1 && SUITS[top.suit].family !== SUITS[first.suit].family : first.rank === 13
  return false
}
export function move(s, from, to) {
  if (!canMove(s, from, to)) return null
  const n = clone(s), source = pile(n, from), cards = source.splice(from.index ?? source.length - 1)
  pile(n, to).push(...cards)
  if (from.type === 'tableau' && source.length) source.at(-1).faceUp = true
  n.moves++; n.started = true
  return n
}
export function draw(s) {
  if (!s.stock.length && !s.waste.length) return null
  const n = clone(s)
  if (n.stock.length) n.waste.push({ ...n.stock.pop(), faceUp: true })
  else { n.stock = n.waste.reverse().map(c => ({ ...c, faceUp: false })); n.waste = [] }
  n.moves++; n.started = true
  return n
}
export const won = s => s.foundations.every(p => p.length === 13)
export function hints(s) {
  const sources = [{ type: 'waste' }, ...s.tableau.flatMap((p, col) => p.map((c, index) => c.faceUp ? { type: 'tableau', col, index } : null).filter(Boolean))]
  const targets = [...s.foundations.map((_, col) => ({ type: 'foundation', col })), ...s.tableau.map((_, col) => ({ type: 'tableau', col }))]
  const result = []
  for (const from of sources) for (const to of targets) {
    if (!canMove(s, from, to)) continue
    if (from.type === 'tableau' && from.index === 0 && to.type === 'tableau' && !pile(s, to).length) continue
    const reveal = from.type === 'tableau' && from.index > 0 && !pile(s, from)[from.index - 1].faceUp
    result.push({ from, to, score: (reveal ? 5 : 0) + (to.type === 'foundation' ? 3 : 0) + (from.type === 'waste' ? 1 : 0) })
  }
  return result.sort((a, b) => b.score - a.score)
}
export function validSave(s) {
  try {
    if (!Array.isArray(s.tableau) || s.tableau.length !== 7 || !Array.isArray(s.foundations) || s.foundations.length !== 4 || !Array.isArray(s.stock) || !Array.isArray(s.waste)) return false
    if (![...s.tableau, ...s.foundations].every(Array.isArray)) return false
    const cards = [...s.stock, ...s.waste, ...s.tableau.flat(), ...s.foundations.flat()]
    return cards.length === 52 && new Set(cards.map(c => c.id)).size === 52 && cards.every(c => Number.isInteger(c.suit) && c.suit >= 0 && c.suit < 4 && Number.isInteger(c.rank) && c.rank >= 1 && c.rank <= 13 && c.id === `${c.suit}-${c.rank}` && typeof c.faceUp === 'boolean') && Number.isFinite(s.seconds) && s.seconds >= 0 && Number.isInteger(s.moves) && s.moves >= 0
  } catch { return false }
}
