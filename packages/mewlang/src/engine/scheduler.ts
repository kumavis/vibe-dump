/**
 * The scheduler. Owns WHEN work happens and when we give up (A6): rounds,
 * shuffling, budgets, the RoundLog. It may read semantics freely; semantics
 * (the e-graph, the lattices, the rules) never reads it back.
 *
 * Modes:
 * - 'bsp' (default): each round, ALL enabled rule instances fire against the
 *   start-of-round snapshot; deltas apply in a fixed order.
 * - 'shuffle': identical rounds, but delta application order within each
 *   phase is permuted by a seeded RNG. Because every rule is monotone and
 *   every write is an ACI join, the quiescent state cannot change — this is
 *   the app's empirical confluence demonstration.
 * - 'chaos' (CO-9 stretch): no rounds at all — repeatedly pick ONE enabled
 *   firing at random and apply it immediately, until none remain. One firing
 *   per RoundLog entry, so the timeline works unchanged. The strongest
 *   in-app witness that the barriers between rounds are a scheduling
 *   convenience, not the source of the guarantee (A3.3).
 *
 * CO-1: budget lives HERE, never in the rules. It is checked between rounds
 * only ('chaos': between firings): maxRounds and maxClasses. Within a round,
 * all enabled firings always fire — never a subset — so budget pressure can
 * truncate the round sequence but never alter round contents.
 */
import type { Program } from '../lang/ast'
import { type Compiled, compileProgram, internExpr } from './compile'
import { type EClassId, EGraph, type ProvenanceEntry } from './egraph'
import { type Extraction, extract } from './extract'
import { type FiringRecord, type RoundLog, type Snapshot, takeSnapshot } from './roundlog'
import {
  type ArithMutation,
  type Delta,
  ruleArith,
  ruleDemand,
  ruleIf,
  ruleUnfold,
} from './rules'

export type RunStatus = 'running' | 'quiescent' | 'budget-exhausted'
export type SchedulerMode = 'bsp' | 'shuffle' | 'chaos'

export interface EvalOptions {
  /** CO-1: rounds budget, checked between rounds only. */
  maxRounds?: number
  /** CO-1: class-count budget, checked between rounds only. */
  maxClasses?: number
  mode?: SchedulerMode
  /** Seed for 'shuffle' and 'chaos' modes. */
  seed?: number
  /** CO-4: disable the unfold-dedup latch; the fixpoint must not change. */
  dedupUnfolds?: boolean
  /** CO-8: demand-driven unfolding (the lesson-9 engine flag). */
  demand?: boolean
  /** CO-7: literal-collision tripwire mode (strict throws; UI uses false). */
  strictSoundness?: boolean
  /** CO-7 mutation-test injection. Test-only. */
  _mutation?: ArithMutation
  /**
   * A2 guard-justification test hook: disable the idempotence skips in
   * R-arith and R-if (their re-firings become semantic no-ops). Test-only.
   */
  _noIdempotenceSkips?: boolean
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
  mode: SchedulerMode
  seed: number | null
  soundnessViolations: string[]
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

/**
 * Chaos logs one FIRING per RoundLog entry, so its budget is measured in
 * firings, not rounds. A BSP round can hold arbitrarily many firings (a wide
 * arithmetic program fires hundreds in round 1), so the round budget scales
 * by this factor; maxClasses provides the hard cap either way.
 */
const CHAOS_FIRINGS_PER_ROUND_BUDGET = 32

export class Evaluator {
  readonly egraph: EGraph
  readonly rootId: EClassId
  private defs: Compiled['defs']
  /** CO-4: grow-only latch set of unfolded call-node keys (re-canonicalized). */
  private unfolded = new Set<string>()
  /** CO-8: the demand lattice — canonical ids, grows monotonically. */
  private demanded: Set<EClassId> | null
  private rng: (() => number) | null
  readonly mode: SchedulerMode
  readonly seed: number | null
  private maxRounds: number
  private maxClasses: number
  private dedupUnfolds: boolean
  private mutation?: ArithMutation
  private idempotenceSkips: boolean

  status: RunStatus = 'running'
  rounds: RoundLog[] = []
  snapshots: Snapshot[] = []

  constructor(program: Program, source: string, opts: EvalOptions = {}) {
    const compiled = compileProgram(program, source, {
      strictSoundness: opts.strictSoundness ?? true,
    })
    this.egraph = compiled.egraph
    this.rootId = compiled.rootId
    this.defs = compiled.defs
    this.maxRounds = opts.maxRounds ?? 64
    this.maxClasses = opts.maxClasses ?? 2000
    this.mode = opts.mode ?? 'bsp'
    this.seed = this.mode === 'bsp' ? null : (opts.seed ?? 1)
    this.rng = this.seed === null ? null : mulberry32(this.seed)
    this.dedupUnfolds = opts.dedupUnfolds ?? true
    this.demanded = (opts.demand ?? true) ? new Set([this.egraph.find(this.rootId)]) : null
    this.mutation = opts._mutation
    this.idempotenceSkips = !(opts._noIdempotenceSkips ?? false)
    this.snapshots.push(takeSnapshot(this.egraph, this.rootId, this.currentDemand()))
  }

  /**
   * Recompute the demand closure from the current state and assert CO-8's
   * grow-only property: no previously demanded class may drop out (modulo
   * canonicalization — merged ids collapse onto their survivor).
   */
  private currentDemand(): Set<EClassId> | null {
    if (this.demanded === null) return null
    const next = ruleDemand(this.egraph, this.rootId)
    for (const old of this.demanded) {
      if (!next.has(this.egraph.find(old))) {
        throw new Error(`demand lattice shrank: class ${old} lost demand (CO-8 violation)`)
      }
    }
    this.demanded = next
    return next
  }

  /** Execute one BSP round (or one chaos firing). Returns false once stopped. */
  step(): boolean {
    if (this.status !== 'running') return false
    return this.mode === 'chaos' ? this.stepChaos() : this.stepRound()
  }

  private gather(): { arith: Delta[]; ifs: Delta[]; unfolds: Delta[]; demanded: Set<EClassId> | null } {
    const eg = this.egraph
    const demanded = this.currentDemand()
    const arith = ruleArith(eg, this.mutation, this.idempotenceSkips)
    const ifs = ruleIf(eg, this.idempotenceSkips)
    const unfolds = ruleUnfold(eg, this.defs, this.dedupUnfolds ? this.unfolded : null, demanded)
    return { arith, ifs, unfolds, demanded }
  }

  /** CO-5.2: quiescence = empty firing set AND the cost fixpoint is stable. */
  private declareQuiescentOrKeepRunning(): boolean {
    const extra = this.egraph.recomputeBest()
    if (extra.length > 0) {
      // A cost source outside the per-round fixpoint would land here. There
      // is none today; treat any occurrence as an engine bug.
      throw new Error('quiescence check: cost fixpoint was not stable (CO-5 violation)')
    }
    this.egraph.drainRoundChanges()
    this.status = 'quiescent'
    return false
  }

  private budgetExceeded(): boolean {
    return this.rounds.length >= this.maxRoundsEffective() || this.egraph.classCount() > this.maxClasses
  }

  private maxRoundsEffective(): number {
    // Chaos logs one FIRING per RoundLog entry, so scale the round budget.
    return this.mode === 'chaos' ? this.maxRounds * CHAOS_FIRINGS_PER_ROUND_BUDGET : this.maxRounds
  }

  private stepRound(): boolean {
    const round = this.rounds.length + 1

    // ---- Read phase: all enabled rule instances against the round snapshot.
    const { arith, ifs, unfolds, demanded } = this.gather()
    if (arith.length + ifs.length + unfolds.length === 0) {
      return this.declareQuiescentOrKeepRunning()
    }

    // ---- CO-1: budget check between rounds, BEFORE firing. All-or-nothing:
    // we either fire every enabled instance of this round or stop here.
    if (this.budgetExceeded()) {
      this.status = 'budget-exhausted'
      return false
    }

    // ---- Confluence mode: shuffle application order within each phase.
    if (this.rng && this.mode === 'shuffle') {
      shuffleInPlace(arith, this.rng)
      shuffleInPlace(ifs, this.rng)
      shuffleInPlace(unfolds, this.rng)
    }

    const firings: FiringRecord[] = []
    this.applyDeltas(round, arith, ifs, unfolds, firings)
    this.finishRound(round, firings, demanded)
    return true
  }

  /** CO-9 stretch: one enabled firing at a time, chosen at random, no rounds. */
  private stepChaos(): boolean {
    const round = this.rounds.length + 1
    const { arith, ifs, unfolds, demanded } = this.gather()
    const all = [...arith, ...ifs, ...unfolds]
    if (all.length === 0) return this.declareQuiescentOrKeepRunning()
    if (this.budgetExceeded()) {
      this.status = 'budget-exhausted'
      return false
    }
    const pick = all[Math.floor(this.rng!() * all.length)]
    const firings: FiringRecord[] = []
    // Chaos has no rounds, and provenance is lattice state (CO-2): stamping
    // the firing ordinal into it would leak scheduler state into semantics
    // (A6) and make provenance differ between chaos seeds. Chaos provenance
    // is therefore recorded round-free (round 0) — invariant across chaos
    // schedules; only the RoundLog (scheduler-owned, observational) numbers
    // firings. Cross-family comparison (BSP rounds vs round-free) still
    // excludes provenance — see fingerprint.ts.
    this.applyDeltas(
      0,
      pick.type === 'addAlt' ? [pick] : [],
      pick.type === 'union' ? [pick] : [],
      pick.type === 'unfold' ? [pick] : [],
      firings,
    )
    this.finishRound(round, firings, demanded)
    return true
  }

  /** Topology phase, then merge phase (AddAlts → Unions → congruence). */
  private applyDeltas(
    round: number,
    arith: Delta[],
    ifs: Delta[],
    unfolds: Delta[],
    firings: FiringRecord[],
  ): void {
    const eg = this.egraph

    // ---- Topology phase: process AllocClass requests (instantiate bodies).
    const pendingUnions: { a: EClassId; b: EClassId; prov: ProvenanceEntry }[] = []
    for (const d of unfolds) {
      if (d.type !== 'unfold') continue
      const def = this.defs.get(d.fn)!
      const env = new Map<string, EClassId>()
      def.params.forEach((p, i) => env.set(p, d.argClasses[i]))
      const prov: ProvenanceEntry = {
        rule: 'R-unfold',
        round,
        premises: d.reads,
        detail: `unfold ${d.detail}`,
      }
      const bodyClass = internExpr(eg, def.body, env, prov)
      this.unfolded.add(d.nodeKey)
      pendingUnions.push({ a: d.callClass, b: bodyClass, prov })
      firings.push({ rule: 'R-unfold', detail: d.detail, reads: d.reads, writes: [eg.find(d.callClass)] })
    }

    // ---- Merge phase: all AddAlt joins, then all unions, then congruence
    // repair to fixpoint (CO-6). Deltas canonicalize inside the EGraph
    // methods at application time, never at emission time (A5).
    for (const d of arith) {
      if (d.type !== 'addAlt') continue
      eg.addAlt(d.classId, d.node, { rule: d.rule, round, premises: d.reads, detail: d.detail })
      firings.push({ rule: d.rule, detail: d.detail, reads: d.reads, writes: [eg.find(d.classId)] })
    }
    for (const d of ifs) {
      if (d.type !== 'union') continue
      eg.addProvenance(d.a, { rule: d.rule, round, premises: d.reads, detail: d.detail })
      eg.union(d.a, d.b, d.rule, d.detail)
      firings.push({ rule: d.rule, detail: d.detail, reads: d.reads, writes: [eg.find(d.a)] })
    }
    for (const u of pendingUnions) {
      eg.union(u.a, u.b, u.prov.rule, u.prov.detail)
      eg.addProvenance(u.a, u.prov)
    }
    const congruences = eg.rebuild()
    for (const c of congruences) {
      // Premise-free provenance key: which pair merged first in a multi-way
      // congruence is application-order-dependent, so recording the pair
      // would leak schedule into the lattice (CO-2). The fact recorded —
      // "a structural merge happened here in round R" — is schedule-invariant.
      eg.addProvenance(c.result, {
        rule: 'R-congruence',
        round,
        premises: [],
        detail: 'structurally identical nodes merged',
      })
      firings.push({
        rule: 'R-congruence',
        detail: c.detail,
        reads: [c.a, c.b].map((x) => eg.find(x)),
        writes: [eg.find(c.result)],
      })
    }
  }

  private finishRound(
    round: number,
    firings: FiringRecord[],
    demandedBefore: Set<EClassId> | null,
  ): void {
    const eg = this.egraph

    // ---- CO-5: monotone tightening of best costs, to fixpoint.
    const tightened = eg.recomputeBest()

    // Re-canonicalize unfold marks (keys may have changed under merges).
    this.unfolded = new Set(
      [...this.unfolded].map((k) => {
        const parsed = parseCallKey(k)
        return parsed ? eg.nodeKey({ op: 'call', fn: parsed.fn, args: parsed.args }) : k
      }),
    )

    // ---- Demand wavefront for the UI: what became demanded this round.
    let newlyDemanded: EClassId[] = []
    if (demandedBefore !== null) {
      const after = ruleDemand(eg, this.rootId)
      const beforeCanon = new Set([...demandedBefore].map((id) => eg.find(id)))
      newlyDemanded = [...after].filter((id) => !beforeCanon.has(id))
      this.demanded = after
    }

    const changes = eg.drainRoundChanges()
    this.rounds.push({
      round,
      firings,
      newClasses: changes.newClasses,
      merges: changes.merges.map((m) => ({ a: m.a, b: m.b, result: m.result, rule: m.rule })),
      changedCells: [...new Set(changes.dirty)],
      tightened,
      newlyDemanded,
      classCount: eg.classCount(),
    })
    this.snapshots.push(takeSnapshot(eg, this.rootId, this.demanded))
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
      mode: this.mode,
      seed: this.seed,
      soundnessViolations: this.egraph.soundnessViolations,
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
