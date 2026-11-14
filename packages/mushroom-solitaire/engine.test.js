import { test } from 'node:test'
import assert from 'node:assert/strict'
import { newGame, clone, canMove, move, draw, hints, validSave, won } from './engine.js'
const card = (suit, rank, faceUp = true) => ({ id: `${suit}-${rank}`, suit, rank, faceUp })
const empty = () => ({ stock: [], waste: [], tableau: Array.from({ length: 7 }, () => []), foundations: Array.from({ length: 4 }, () => []), moves: 0, seconds: 0 })

test('deal contains every card once, seven exposed cards, and 24 stock cards', () => {
  const s = newGame()
  assert.ok(validSave(s)); assert.equal(s.stock.length, 24)
  assert.deepEqual(s.tableau.map(p => p.length), [1, 2, 3, 4, 5, 6, 7])
  assert.equal(s.tableau.flat().filter(c => c.faceUp).length, 7)
  assert.ok(s.tableau.every(p => p.at(-1).faceUp))
})
test('draw-one and recycling preserve card order, all cards, and immutable history', () => {
  const original = newGame(); let s = clone(original)
  const order = original.stock.map(c => c.id).reverse()
  for (let i = 0; i < 24; i++) { s = draw(s); assert.equal(s.waste.at(-1).id, order[i]); assert.ok(validSave(s)) }
  assert.equal(original.waste.length, 0)
  s = draw(s); assert.equal(s.waste.length, 0); assert.ok(s.stock.every(c => !c.faceUp))
  for (let i = 0; i < 24; i++) { s = draw(s); assert.equal(s.waste.at(-1).id, order[i]) }
})
test('tableau alternates mushroom families and descends; empty spaces require Kings', () => {
  const s = empty(); s.waste = [card(1, 8)]; s.tableau[0] = [card(0, 9)]; s.tableau[1] = [card(3, 9)]; s.tableau[2] = [card(2, 10)]
  assert.ok(canMove(s, { type: 'waste' }, { type: 'tableau', col: 0 }))
  for (const col of [1, 2, 3]) assert.equal(canMove(s, { type: 'waste' }, { type: 'tableau', col }), false)
  s.waste = [card(1, 13)]; assert.ok(canMove(s, { type: 'waste' }, { type: 'tableau', col: 3 }))
})
test('whole valid stacks move and reveal the hidden card; hidden and broken stacks cannot move', () => {
  const s = empty(); s.tableau[0] = [card(0, 2, false), card(1, 8), card(2, 7)]; s.tableau[1] = [card(0, 9)]
  const from = { type: 'tableau', col: 0, index: 1 }, to = { type: 'tableau', col: 1 }
  const n = move(s, from, to)
  assert.equal(n.tableau[1].length, 3); assert.ok(n.tableau[0][0].faceUp); assert.equal(s.tableau[0][0].faceUp, false)
  assert.equal(move(s, { ...from, index: 0 }, to), null)
  s.tableau[0][2] = card(3, 7); assert.equal(move(s, from, to), null)
})
test('foundations require exact suit and sequential ranks, one card at a time', () => {
  const s = empty(); s.waste = [card(1, 1)]
  assert.ok(move(s, { type: 'waste' }, { type: 'foundation', col: 1 }))
  assert.equal(move(s, { type: 'waste' }, { type: 'foundation', col: 0 }), null)
  s.waste = [card(1, 2)]; assert.equal(move(s, { type: 'waste' }, { type: 'foundation', col: 1 }), null)
  s.foundations[1] = [card(1, 1)]; assert.ok(move(s, { type: 'waste' }, { type: 'foundation', col: 1 }))
  s.tableau[0] = [card(1, 2), card(0, 1)]
  assert.equal(move(s, { type: 'tableau', col: 0, index: 0 }, { type: 'foundation', col: 1 }), null)
})
test('randomized legal play preserves all 52 cards and valid state over many actions', () => {
  for (let game = 0; game < 20; game++) {
    let s = newGame()
    for (let i = 0; i < 150; i++) {
      const choices = hints(s), h = choices[Math.floor(Math.random() * choices.length)]
      const next = h && Math.random() < .8 ? move(s, h.from, h.to) : draw(s)
      if (next) s = next
      assert.ok(validSave(s))
    }
  }
})
test('win detection and malformed save rejection', () => {
  const s = newGame(); assert.equal(won(s), false)
  assert.equal(validSave({ ...s, stock: [] }), false)
  const bad = clone(s); bad.stock[1] = bad.stock[0]; assert.equal(validSave(bad), false)
  assert.equal(validSave(null), false)
  s.foundations = Array.from({ length: 4 }, (_, suit) => Array.from({ length: 13 }, (_, i) => card(suit, i + 1)))
  assert.ok(won(s))
})
