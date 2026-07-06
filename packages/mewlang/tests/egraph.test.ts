import { describe, expect, it } from 'vitest'
import {
  type CellValue,
  EGraph,
  type ENode,
  emptyCell,
  join,
  mulberryCellEq,
} from './helpers'

describe('union-find + hashcons', () => {
  it('hash-conses structurally identical nodes into the same class', () => {
    const eg = new EGraph()
    const one = eg.add({ op: 'lit', value: 1 })
    const two = eg.add({ op: 'lit', value: 2 })
    const sum1 = eg.add({ op: '+', args: [one, two] })
    const sum2 = eg.add({ op: '+', args: [one, two] })
    expect(sum1).toBe(sum2)
    expect(eg.classCount()).toBe(3)
  })

  it('union merges cells and canonicalizes', () => {
    const eg = new EGraph()
    const a = eg.add({ op: 'lit', value: 1 })
    const b = eg.add({ op: 'lit', value: true })
    const r = eg.union(a, b, 'test', 't')
    expect(eg.find(a)).toBe(eg.find(b))
    expect(eg.find(a)).toBe(r)
    expect(eg.getCell(a).alts.size).toBe(2)
    expect(eg.classCount()).toBe(1)
  })

  it('congruence: merging children merges structurally identical parents', () => {
    const eg = new EGraph()
    const x = eg.add({ op: 'lit', value: 1 })
    const y = eg.add({ op: 'lit', value: 2 })
    const z = eg.add({ op: 'lit', value: 3 })
    const fx = eg.add({ op: 'call', fn: 'f', args: [x, z] })
    const fy = eg.add({ op: 'call', fn: 'f', args: [y, z] })
    expect(eg.find(fx)).not.toBe(eg.find(fy))
    eg.union(x, y, 'test', 't')
    const congruences = eg.rebuild(1)
    expect(eg.find(fx)).toBe(eg.find(fy))
    expect(congruences.length).toBeGreaterThanOrEqual(1)
  })

  it('congruence closes transitively (grandparents)', () => {
    const eg = new EGraph()
    const x = eg.add({ op: 'lit', value: 1 })
    const y = eg.add({ op: 'lit', value: 2 })
    const gx = eg.add({ op: 'call', fn: 'g', args: [x] })
    const gy = eg.add({ op: 'call', fn: 'g', args: [y] })
    const hx = eg.add({ op: 'call', fn: 'h', args: [gx] })
    const hy = eg.add({ op: 'call', fn: 'h', args: [gy] })
    eg.union(x, y, 'test', 't')
    eg.rebuild(1)
    expect(eg.find(gx)).toBe(eg.find(gy))
    expect(eg.find(hx)).toBe(eg.find(hy))
  })

  it('best cost: lit = 0, node = 1 + sum(children), Infinity if unknown', () => {
    const eg = new EGraph()
    const one = eg.add({ op: 'lit', value: 1 })
    const two = eg.add({ op: 'lit', value: 2 })
    const sum = eg.add({ op: '+', args: [one, two] })
    eg.recomputeBest()
    expect(eg.getCell(one).best).toMatchObject({ cost: 0 })
    expect(eg.getCell(sum).best).toMatchObject({ cost: 1 })
    // A call over an un-costed class has no best yet.
    const call = eg.add({ op: 'call', fn: 'f', args: [one] })
    const outer = eg.add({ op: 'call', fn: 'g', args: [call] })
    eg.recomputeBest()
    expect(eg.getCell(outer).best?.cost).toBe(2)
  })
})

describe('lattice laws for join (property-style over generated deltas)', () => {
  const gen = (seed: number): CellValue[] => {
    const rng = mulberryCellEq.rng(seed)
    const nodes: ENode[] = [
      { op: 'lit', value: 1 },
      { op: 'lit', value: 2 },
      { op: 'lit', value: true },
      { op: '+', args: [0, 1] },
      { op: '*', args: [1, 2] },
      { op: 'call', fn: 'f', args: [0] },
      { op: 'if', args: [0, 1, 2] },
    ]
    const cells: CellValue[] = []
    for (let i = 0; i < 40; i++) {
      const cell = emptyCell()
      const n = 1 + Math.floor(rng() * 4)
      for (let j = 0; j < n; j++) {
        const node = nodes[Math.floor(rng() * nodes.length)]
        cell.alts.set(mulberryCellEq.keyOf(node), node)
      }
      if (rng() < 0.7) {
        const node = [...cell.alts.values()][0]
        cell.best = { cost: Math.floor(rng() * 5), node }
      }
      if (rng() < 0.8) {
        cell.provenance.push({
          rule: ['R-arith', 'R-if', 'R-unfold'][Math.floor(rng() * 3)],
          round: Math.floor(rng() * 5),
          detail: `d${Math.floor(rng() * 3)}`,
        })
      }
      cells.push(cell)
    }
    return cells
  }

  it('join is commutative', () => {
    const cells = gen(42)
    for (let i = 0; i < cells.length - 1; i++) {
      const ab = join(cells[i], cells[i + 1])
      const ba = join(cells[i + 1], cells[i])
      expect(mulberryCellEq.eq(ab, ba)).toBe(true)
    }
  })

  it('join is associative', () => {
    const cells = gen(7)
    for (let i = 0; i < cells.length - 2; i++) {
      const l = join(join(cells[i], cells[i + 1]), cells[i + 2])
      const r = join(cells[i], join(cells[i + 1], cells[i + 2]))
      expect(mulberryCellEq.eq(l, r)).toBe(true)
    }
  })

  it('join is idempotent', () => {
    const cells = gen(99)
    for (const c of cells) {
      expect(mulberryCellEq.eq(join(c, c), c)).toBe(true)
      const c2 = join(c, cells[0])
      expect(mulberryCellEq.eq(join(c2, cells[0]), c2)).toBe(true)
    }
  })
})
