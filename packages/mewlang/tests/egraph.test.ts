import { describe, expect, it } from 'vitest'
import { SoundnessError } from '../src/engine/egraph'
import {
  type CellValue,
  EGraph,
  type ENode,
  type ProvenanceEntry,
  cellHelpers,
  emptyCell,
  join,
  provKeyOf,
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
    const b = eg.add({ op: 'call', fn: 'one', args: [] })
    const r = eg.union(a, b, 'test', 't')
    expect(eg.find(a)).toBe(eg.find(b))
    expect(eg.find(a)).toBe(r)
    expect(eg.getCell(a).alts.size).toBe(2)
    expect(eg.classCount()).toBe(1)
  })

  it('congruence: merging children merges structurally identical parents', () => {
    const eg = new EGraph()
    const x = eg.add({ op: 'lit', value: 1 })
    const y = eg.add({ op: 'call', fn: 'mk1', args: [] })
    const z = eg.add({ op: 'lit', value: 3 })
    const fx = eg.add({ op: 'call', fn: 'f', args: [x, z] })
    const fy = eg.add({ op: 'call', fn: 'f', args: [y, z] })
    expect(eg.find(fx)).not.toBe(eg.find(fy))
    eg.union(x, y, 'test', 't')
    const congruences = eg.rebuild()
    expect(eg.find(fx)).toBe(eg.find(fy))
    expect(congruences.length).toBeGreaterThanOrEqual(1)
  })

  it('congruence closes transitively (grandparents)', () => {
    const eg = new EGraph()
    const x = eg.add({ op: 'lit', value: 1 })
    const y = eg.add({ op: 'call', fn: 'mk1', args: [] })
    const gx = eg.add({ op: 'call', fn: 'g', args: [x] })
    const gy = eg.add({ op: 'call', fn: 'g', args: [y] })
    const hx = eg.add({ op: 'call', fn: 'h', args: [gx] })
    const hy = eg.add({ op: 'call', fn: 'h', args: [gy] })
    eg.union(x, y, 'test', 't')
    eg.rebuild()
    expect(eg.find(gx)).toBe(eg.find(gy))
    expect(eg.find(hx)).toBe(eg.find(hy))
  })

  it('best cost: lit = 0, node = 1 + sum(children), ∞ if any child unknown', () => {
    const eg = new EGraph()
    const one = eg.add({ op: 'lit', value: 1 })
    const two = eg.add({ op: 'lit', value: 2 })
    const sum = eg.add({ op: '+', args: [one, two] })
    eg.recomputeBest()
    expect(eg.getCell(one).best).toMatchObject({ cost: 0 })
    expect(eg.getCell(sum).best).toMatchObject({ cost: 1 })
    const call = eg.add({ op: 'call', fn: 'f', args: [one] })
    const outer = eg.add({ op: 'call', fn: 'g', args: [call] })
    eg.recomputeBest()
    expect(eg.getCell(outer).best?.cost).toBe(2)
  })
})

describe('CO-5: cost fixpoint', () => {
  /** A class whose cheapest non-cyclic route costs 3 (a 3-deep call chain). */
  const expensiveSeed = (eg: EGraph, tag: string) => {
    const s1 = eg.add({ op: 'call', fn: `${tag}1`, args: [] })
    const s2 = eg.add({ op: 'call', fn: `${tag}2`, args: [s1] })
    return eg.add({ op: 'call', fn: `${tag}3`, args: [s2] })
  }

  it('cyclic e-graph: A ∋ f(B), B ∋ g(A); lit joins into B → A tightens in one pass', () => {
    const eg = new EGraph()
    const a = expensiveSeed(eg, 'sa') // cost 3 route
    const b = expensiveSeed(eg, 'sb')
    const fb = eg.add({ op: 'call', fn: 'f', args: [b] })
    const ga = eg.add({ op: 'call', fn: 'g', args: [a] })
    eg.union(a, fb, 'test', 'A := f(B)')
    eg.union(b, ga, 'test', 'B := g(A)')
    eg.rebuild()
    eg.recomputeBest()
    // ⊥ = ∞ initialization: the f/g cycle contributes nothing on its own —
    // both classes cost 3 via their seeds, not less via the cycle.
    expect(eg.getCell(a).best?.cost).toBe(3)
    expect(eg.getCell(b).best?.cost).toBe(3)
    // Ground B: its cost drops to 0 and A converges to 1 = f(B) within ONE
    // recomputeBest() call, through the cycle edge.
    eg.addAlt(b, { op: 'lit', value: 7 }, { rule: 'test', round: 1, premises: [], detail: 'ground' })
    eg.rebuild()
    const tightened = eg.recomputeBest()
    expect(eg.getCell(b).best).toMatchObject({ cost: 0 })
    expect(eg.getCell(a).best?.cost).toBe(1)
    expect(tightened.some((t) => t.classId === eg.find(a))).toBe(true)
  })

  it('⊥-initialization: a 2-cycle cannot manufacture finite cost from nothing', () => {
    const eg = new EGraph()
    const m = eg.add({ op: 'call', fn: 'seedM', args: [] }) // finite route: cost 1
    const n = eg.add({ op: 'call', fn: 'seedN', args: [] })
    const hm = eg.add({ op: 'call', fn: 'h', args: [n] })
    const kn = eg.add({ op: 'call', fn: 'k', args: [m] })
    eg.union(m, hm, 't', '')
    eg.union(n, kn, 't', '')
    eg.rebuild()
    eg.recomputeBest()
    // If costs were seeded from 0 instead of ∞, the h/k cycle would settle at
    // bogus finite values independent of the seeds. With ⊥ = ∞ the only
    // finite routes are the nullary seeds: exactly 1 each.
    expect(eg.getCell(m).best?.cost).toBe(1)
    expect(eg.getCell(n).best?.cost).toBe(1)
  })

  it('depth-20 chain fully retightens in one fixpoint call when the base drops', () => {
    const eg = new EGraph()
    const base = eg.add({ op: 'call', fn: 'seed', args: [] }) // cost 1
    let cur = base
    const chain: number[] = []
    for (let i = 0; i < 20; i++) {
      cur = eg.add({ op: 'call', fn: `link${i}`, args: [cur] })
      chain.push(cur)
    }
    eg.recomputeBest()
    chain.forEach((id, i) => expect(eg.getCell(id).best?.cost).toBe(i + 2))
    // Ground the base: every link must tighten by 1 in a single call.
    eg.addAlt(base, { op: 'lit', value: 5 }, { rule: 'test', round: 1, premises: [], detail: '' })
    eg.rebuild()
    eg.recomputeBest()
    expect(eg.getCell(base).best?.cost).toBe(0)
    chain.forEach((id, i) => expect(eg.getCell(id).best?.cost).toBe(i + 1))
  })
})

describe('CO-3: best is min in a total order', () => {
  it('equal-cost alternatives resolve by content, independent of insertion order', () => {
    const build = (flip: boolean) => {
      const eg = new EGraph()
      const x = eg.add({ op: 'lit', value: 1 })
      const first = eg.add({ op: 'call', fn: flip ? 'gamma' : 'alpha', args: [x] })
      const second = eg.add({ op: 'call', fn: flip ? 'alpha' : 'gamma', args: [x] })
      eg.union(first, second, 'test', 'tie')
      eg.rebuild()
      eg.recomputeBest()
      return eg.getCell(first).best
    }
    const a = build(false)
    const b = build(true)
    expect(a?.cost).toBe(1)
    expect(b?.cost).toBe(1)
    // both orders pick the same winner: 'call alpha(1)' < 'call gamma(1)'
    expect(a?.tieKey).toBe(b?.tieKey)
    expect(a?.tieKey).toContain('alpha')
  })
})

describe('CO-6: canonicalize at application time', () => {
  it('a delta aimed at a retired id lands in the surviving class', () => {
    const eg = new EGraph()
    const a = eg.add({ op: 'call', fn: 'a', args: [] })
    const b = eg.add({ op: 'call', fn: 'b', args: [] })
    // merge phase order: Union(a,b) first retires one id...
    eg.union(a, b, 'test', '')
    // ...then an AddAlt aimed at the possibly-retired original id.
    eg.addAlt(a, { op: 'lit', value: 9 }, { rule: 'test', round: 1, premises: [], detail: '' })
    eg.addAlt(b, { op: 'call', fn: 'c', args: [] }, { rule: 'test', round: 1, premises: [], detail: '' })
    eg.rebuild()
    const cell = eg.getCell(a)
    expect(eg.find(a)).toBe(eg.find(b))
    const keys = [...cell.alts.keys()]
    expect(keys.some((k) => k.startsWith('lit'))).toBe(true)
    expect(keys.some((k) => k.startsWith('call:c'))).toBe(true)
    expect(cell.alts.size).toBe(4)
  })
})

describe('CO-7: literal-collision tripwire', () => {
  it('throws in strict mode when two distinct literals meet in one class', () => {
    const eg = new EGraph()
    const one = eg.add({ op: 'lit', value: 1 })
    const two = eg.add({ op: 'lit', value: 2 })
    expect(() => eg.union(one, two, 'test', 'bad')).toThrow(SoundnessError)
  })

  it('records instead of throwing in non-strict (UI) mode', () => {
    const eg = new EGraph({ strictSoundness: false })
    const one = eg.add({ op: 'lit', value: 1 })
    const two = eg.add({ op: 'lit', value: 2 })
    eg.union(one, two, 'test', 'bad')
    expect(eg.soundnessViolations.length).toBe(1)
    expect(eg.soundnessViolations[0]).toMatch(/distinct literals/)
  })

  it('equal literals do not trip (idempotent join)', () => {
    const eg = new EGraph()
    const a = eg.add({ op: 'lit', value: 5 })
    eg.addAlt(a, { op: 'lit', value: 5 }, { rule: 'test', round: 1, premises: [], detail: '' })
    expect(eg.getCell(a).alts.size).toBe(1)
  })
})

describe('lattice laws for join (A1, property-style over generated deltas — incl. provenance)', () => {
  const gen = (seed: number): CellValue[] => {
    const rng = cellHelpers.rng(seed)
    // one literal only — a cell with two distinct lits is out of the lattice's
    // reachable states (the CO-7 tripwire enforces that at the EGraph level)
    const nodes: ENode[] = [
      { op: 'lit', value: 1 },
      { op: '+', args: [0, 1] },
      { op: '*', args: [1, 2] },
      { op: 'call', fn: 'f', args: [0] },
      { op: 'call', fn: 'g', args: [2, 3] },
      { op: 'if', args: [0, 1, 2] },
    ]
    const cells: CellValue[] = []
    for (let i = 0; i < 40; i++) {
      const cell = emptyCell()
      const n = 1 + Math.floor(rng() * 4)
      for (let j = 0; j < n; j++) {
        const node = nodes[Math.floor(rng() * nodes.length)]
        cell.alts.set(cellHelpers.keyOf(node), node)
      }
      if (rng() < 0.7) {
        const node = [...cell.alts.values()][0]
        cell.best = {
          cost: Math.floor(rng() * 5),
          node,
          tieKey: `k${Math.floor(rng() * 6)}`,
        }
      }
      const nProv = Math.floor(rng() * 3)
      for (let j = 0; j < nProv; j++) {
        const p: ProvenanceEntry = {
          rule: ['R-arith', 'R-if', 'R-unfold'][Math.floor(rng() * 3)],
          round: Math.floor(rng() * 5),
          premises: [Math.floor(rng() * 4), Math.floor(rng() * 4)],
          detail: 'd',
        }
        cell.provenance.set(provKeyOf(p), p)
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
      expect(cellHelpers.eq(ab, ba)).toBe(true)
    }
  })

  it('join is associative', () => {
    const cells = gen(7)
    for (let i = 0; i < cells.length - 2; i++) {
      const l = join(join(cells[i], cells[i + 1]), cells[i + 2])
      const r = join(cells[i], join(cells[i + 1], cells[i + 2]))
      expect(cellHelpers.eq(l, r)).toBe(true)
    }
  })

  it('join is idempotent', () => {
    const cells = gen(99)
    for (const c of cells) {
      expect(cellHelpers.eq(join(c, c), c)).toBe(true)
      const c2 = join(c, cells[0])
      expect(cellHelpers.eq(join(c2, cells[0]), c2)).toBe(true)
    }
  })
})
