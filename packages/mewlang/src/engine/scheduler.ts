/**
 * The BSP (bulk-synchronous parallel) scheduler.
 *
 * Each round: read a snapshot → collect ALL enabled rule instances → apply
 * their deltas (topology phase, then merge phase, then congruence repair,
 * then monotone best-cost tightening) → log the round. Because every rule is
 * monotone, the order deltas are applied in cannot change the quiescent
 * state — "confluence mode" shuffles that order with a seeded RNG to
 * demonstrate it empirically.
 */
import type { Program } from '../lang/ast'
import { type Compiled, compileProgram, internExpr } from './compile'
import { type EClassId, EGraph } from './egraph'
import { type Extraction, extract } from './extract'
import { type FiringRecord, type RoundLog, type Snapshot, takeSnapshot } from './roundlog'
import { computeDemand, ruleArith, ruleIf, ruleUnfold } from './rules'

export type RunStatus = 'running' | 'quiescent' | 'fuel-exhausted' | 'round-limit'

export interface EvalOptions {
  fuel?: number
  /** Seed for shuffled delta application (confluence mode). null = in order. */
  shuffleSeed?: number | null
  maxRounds?: number
}

export interface EvalResult {
  status: RunStatus
  rounds: RoundLog[]
  /** snapshots[r] = state after round r; snapshots[0] = the initial network. */
  snapshots: Snapshot[]
  rootId: EClassId
  extraction: Extraction
  classCount: number
  altCount: number
  seed: number | null
}

/** mulberry32 — tiny deterministic PRNG. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function shuffleInPlace<T>(arr: T[], rng: () => number): void {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
}

export class Evaluator {
  readonly egraph: EGraph
  readonly rootId: EClassId
  private defs: Compiled['defs']
  private unfolded = new Set<string>()
  private rng: (() => number) | null
  readonly seed: number | null

  fuel: number
  status: RunStatus = 'running'
  rounds: RoundLog[] = []
  snapshots: Snapshot[] = []
  private maxRounds: number

  constructor(program: Program, source: string, opts: EvalOptions = {}) {
    const compiled = compileProgram(program, source)
    this.egraph = compiled.egraph
    this.rootId = compiled.rootId
    this.defs = compiled.defs
    this.fuel = opts.fuel ?? 256
    this.maxRounds = opts.maxRounds ?? 2000
    this.seed = opts.shuffleSeed ?? null
    this.rng = this.seed === null ? null : mulberry32(this.seed)
    this.snapshots.push(takeSnapshot(this.egraph, this.rootId, this.fuel))
  }

  /** Execute one BSP round. Returns false once the network has stopped. */
  step(): boolean {
    if (this.status !== 'running') return false
    if (this.rounds.length >= this.maxRounds) {
      this.status = 'round-limit'
      return false
    }
    const round = this.rounds.length + 1
    const eg = this.egraph

    // ---- Read phase: all enabled rule instances against the round snapshot.
    // (Rules only read; nothing is applied until every rule has run.)
    const arithDeltas = ruleArith(eg)
    const ifDeltas = ruleIf(eg)
    const demanded = computeDemand(eg, this.rootId)
    let unfoldDeltas = ruleUnfold(eg, this.defs, this.unfolded, demanded)

    // Fuel gates unfolding only.
    let blockedByFuel = 0
    if (unfoldDeltas.length > this.fuel) {
      blockedByFuel = unfoldDeltas.length - this.fuel
      unfoldDeltas = unfoldDeltas.slice(0, this.fuel)
    }

    if (arithDeltas.length + ifDeltas.length + unfoldDeltas.length === 0) {
      this.status = blockedByFuel > 0 ? 'fuel-exhausted' : 'quiescent'
      return false
    }

    // ---- Confluence mode: shuffle application order within each phase.
    if (this.rng) {
      shuffleInPlace(arithDeltas, this.rng)
      shuffleInPlace(ifDeltas, this.rng)
      shuffleInPlace(unfoldDeltas, this.rng)
    }

    const firings: FiringRecord[] = []

    // ---- Topology phase: process AllocClass requests (instantiate bodies).
    const pendingUnions: { a: EClassId; b: EClassId; rule: string; detail: string; reads: EClassId[] }[] = []
    for (const d of unfoldDeltas) {
      if (d.type !== 'unfold') continue
      const def = this.defs.get(d.fn)!
      const env = new Map<string, EClassId>()
      def.params.forEach((p, i) => env.set(p, d.argClasses[i]))
      const bodyClass = internExpr(eg, def.body, env, {
        rule: 'R-unfold',
        round,
        detail: `unfolded ${d.detail}`,
      })
      this.unfolded.add(d.nodeKey)
      this.fuel--
      pendingUnions.push({
        a: d.callClass,
        b: bodyClass,
        rule: 'R-unfold',
        detail: `unfold ${d.detail}`,
        reads: d.reads,
      })
      firings.push({ rule: 'R-unfold', detail: d.detail, reads: d.reads, writes: [d.callClass] })
    }

    // ---- Merge phase: all AddAlt joins, then all unions, then congruence.
    for (const d of arithDeltas) {
      if (d.type !== 'addAlt') continue
      eg.addAlt(d.classId, d.node, d.rule, round, d.detail)
      firings.push({ rule: d.rule, detail: d.detail, reads: d.reads, writes: [eg.find(d.classId)] })
    }
    for (const d of ifDeltas) {
      if (d.type !== 'union') continue
      eg.addProvenance(d.a, { rule: d.rule, round, detail: d.detail })
      eg.union(d.a, d.b, d.rule, d.detail)
      firings.push({ rule: d.rule, detail: d.detail, reads: d.reads, writes: [eg.find(d.a)] })
    }
    for (const u of pendingUnions) {
      eg.union(u.a, u.b, u.rule, u.detail)
    }
    const congruences = eg.rebuild(round)
    for (const c of congruences) {
      firings.push({
        rule: 'R-congruence',
        detail: c.detail,
        reads: [c.a, c.b].map((x) => eg.find(x)),
        writes: [eg.find(c.result)],
      })
    }

    // ---- Monotone tightening of best costs.
    eg.recomputeBest()

    // Re-canonicalize unfold marks (keys may have changed under merges).
    this.unfolded = new Set(
      [...this.unfolded].map((k) => {
        const parsed = parseCallKey(k)
        return parsed ? eg.nodeKey({ op: 'call', fn: parsed.fn, args: parsed.args }) : k
      }),
    )

    const changes = eg.drainRoundChanges()
    this.rounds.push({
      round,
      firings,
      newClasses: changes.newClasses,
      merges: changes.merges.map((m) => ({ a: m.a, b: m.b, result: m.result, rule: m.rule })),
      changedCells: [...new Set(changes.dirty)],
      fuelRemaining: this.fuel,
      blockedByFuel,
    })
    this.snapshots.push(takeSnapshot(eg, this.rootId, this.fuel))
    return true
  }

  run(): EvalResult {
    while (this.step()) {
      /* saturate */
    }
    return this.result()
  }

  result(): EvalResult {
    const snap = this.snapshots[this.snapshots.length - 1]
    return {
      status: this.status,
      rounds: this.rounds,
      snapshots: this.snapshots,
      rootId: this.egraph.find(this.rootId),
      extraction: extract(this.egraph, this.rootId),
      classCount: this.egraph.classCount(),
      altCount: snap.classes.reduce((n, c) => n + c.alts.length, 0),
      seed: this.seed,
    }
  }
}

function parseCallKey(key: string): { fn: string; args: number[] } | null {
  if (!key.startsWith('call:')) return null
  const rest = key.slice(5)
  const sep = rest.indexOf(':')
  if (sep < 0) return null
  const fn = rest.slice(0, sep)
  const argsStr = rest.slice(sep + 1)
  const args = argsStr === '' ? [] : argsStr.split(',').map(Number)
  return { fn, args }
}

/** Parse + compile + saturate in one call (used by tests and the UI). */
export function evaluate(program: Program, source: string, opts: EvalOptions = {}): EvalResult {
  return new Evaluator(program, source, opts).run()
}
