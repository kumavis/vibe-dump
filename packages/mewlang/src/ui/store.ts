import { create } from 'zustand'
import { parse } from '../lang/parser'
import { Evaluator, type EvalResult } from '../engine/scheduler'
import type { RoundLog, SnapClass, Snapshot } from '../engine/roundlog'
import { EXAMPLES, exampleById } from '../examples'
import { LESSONS, type LessonCtx } from './lessons/lessons'

export interface Selection {
  id: number
  round: number
}

export interface ConfluenceRun {
  seed: number
  answer: string
  classes: number
  alts: number
  rounds: number
}

export interface ConfluenceReport {
  ok: boolean
  runs: ConfluenceRun[]
}

export interface AppState {
  source: string
  exampleId: string
  dirty: boolean
  fuel: number
  shuffle: boolean
  seed: number
  error: string | null
  run: EvalResult | null
  round: number
  playing: boolean
  speed: number
  selected: Selection | null
  hoveredNode: number | null
  editorHoverPos: number | null
  confluence: ConfluenceReport | null
  relayoutNonce: number
  // tutorial
  tutorialOpen: boolean
  lessonIndex: number
  stepIndex: number
  completedLessons: number[]
  rightTab: 'inspector' | 'tutorial'

  setSource(s: string): void
  loadExample(id: string): void
  compile(opts?: { autoplay?: boolean }): void
  setRound(r: number): void
  stepFwd(): void
  stepBack(): void
  setPlaying(p: boolean): void
  setSpeed(x: number): void
  setFuel(f: number): void
  setShuffle(b: boolean): void
  reseed(): void
  select(id: number | null): void
  hoverNode(id: number | null): void
  setEditorHoverPos(p: number | null): void
  selectAtPos(p: number): void
  verifyConfluence(): void
  relayout(): void
  setRightTab(t: 'inspector' | 'tutorial'): void
  startTutorial(): void
  exitTutorial(): void
  gotoLesson(i: number): void
  nextStep(): void
  prevStep(): void
}

export function currentSnapshot(s: Pick<AppState, 'run' | 'round'>): Snapshot | null {
  if (!s.run) return null
  return s.run.snapshots[Math.min(s.round, s.run.snapshots.length - 1)] ?? null
}

export function currentRoundLog(s: Pick<AppState, 'run' | 'round'>): RoundLog | null {
  if (!s.run || s.round === 0) return null
  return s.run.rounds[s.round - 1] ?? null
}

export function classById(snap: Snapshot | null, id: number | null): SnapClass | null {
  if (!snap || id === null) return null
  return snap.classes.find((c) => c.id === id) ?? null
}

/**
 * Resolve a selection made at one round to the class id valid at another.
 * Forward: follow merge records. Backward: ids are never reused, so the id is
 * valid iff it exists in the earlier snapshot.
 */
export function resolveSelection(
  run: EvalResult | null,
  sel: Selection | null,
  round: number,
): number | null {
  if (!run || !sel) return null
  let id = sel.id
  if (round >= sel.round) {
    for (let r = sel.round; r < round; r++) {
      for (const m of run.rounds[r]?.merges ?? []) {
        if (m.a === id || m.b === id) id = m.result
      }
    }
  }
  const snap = run.snapshots[Math.min(round, run.snapshots.length - 1)]
  return snap && snap.classes.some((c) => c.id === id) ? id : null
}

/** Classes whose source spans contain the given offset (smallest span first). */
export function classesAtPos(snap: Snapshot | null, pos: number | null): SnapClass[] {
  if (!snap || pos === null) return []
  const hits: { c: SnapClass; size: number }[] = []
  for (const c of snap.classes) {
    let best = Infinity
    for (const s of c.spans) {
      if (s.start <= pos && pos < s.end) best = Math.min(best, s.end - s.start)
    }
    if (best < Infinity) hits.push({ c, size: best })
  }
  hits.sort((a, b) => a.size - b.size)
  return hits.map((h) => h.c)
}

export function lessonCtx(s: AppState): LessonCtx {
  const snap = currentSnapshot(s)
  const selId = resolveSelection(s.run, s.selected, s.round)
  return {
    run: s.run,
    round: s.round,
    snapshot: snap,
    roundLog: currentRoundLog(s),
    selectedClass: classById(snap, selId),
    confluence: s.confluence,
    source: s.source,
  }
}

function runProgram(source: string, fuel: number, seed: number | null): EvalResult {
  const program = parse(source)
  const ev = new Evaluator(program, source, { fuel, shuffleSeed: seed, maxRounds: 1000 })
  return ev.run()
}

export const useStore = create<AppState>((set, get) => ({
  source: exampleById('fib').source,
  exampleId: 'fib',
  dirty: true,
  fuel: 256,
  shuffle: false,
  seed: 1,
  error: null,
  run: null,
  round: 0,
  playing: false,
  speed: 4,
  selected: null,
  hoveredNode: null,
  editorHoverPos: null,
  confluence: null,
  relayoutNonce: 0,
  tutorialOpen: false,
  lessonIndex: 0,
  stepIndex: 0,
  completedLessons: [],
  rightTab: 'inspector',

  setSource: (source) => {
    if (source === get().source) return
    set({ source, dirty: true, exampleId: '' })
  },

  loadExample: (id) => {
    const ex = exampleById(id)
    set({ source: ex.source, exampleId: id, dirty: true, error: null })
  },

  compile: (opts = {}) => {
    const s = get()
    try {
      const run = runProgram(s.source, s.fuel, s.shuffle ? s.seed : null)
      set({
        run,
        error: null,
        dirty: false,
        round: 0,
        playing: opts.autoplay ?? true,
        selected: null,
        hoveredNode: null,
        confluence: null,
      })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e), run: null, playing: false })
    }
  },

  setRound: (r) => {
    const run = get().run
    if (!run) return
    const round = Math.max(0, Math.min(r, run.rounds.length))
    set({ round })
  },

  stepFwd: () => get().setRound(get().round + 1),
  stepBack: () => {
    set({ playing: false })
    get().setRound(get().round - 1)
  },
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  setFuel: (fuel) => set({ fuel: Math.max(1, Math.min(100000, Math.floor(fuel) || 1)), dirty: true }),
  setShuffle: (shuffle) => set({ shuffle, dirty: true }),
  reseed: () => set({ seed: ((get().seed * 1103515245 + 12345) % 2147483647) + 1, dirty: true }),

  select: (id) => {
    if (id === null) set({ selected: null })
    else set({ selected: { id, round: get().round }, rightTab: get().tutorialOpen ? get().rightTab : 'inspector' })
  },
  hoverNode: (hoveredNode) => set({ hoveredNode }),
  setEditorHoverPos: (editorHoverPos) => set({ editorHoverPos }),

  selectAtPos: (pos) => {
    const s = get()
    const hits = classesAtPos(currentSnapshot(s), pos)
    if (hits.length > 0) s.select(hits[0].id)
  },

  verifyConfluence: () => {
    const s = get()
    try {
      const runs: ConfluenceRun[] = []
      for (let i = 0; i < 10; i++) {
        const seed = s.seed + i * 7919
        const r = runProgram(s.source, s.fuel, seed)
        runs.push({
          seed,
          answer: r.extraction.pretty,
          classes: r.classCount,
          alts: r.altCount,
          rounds: r.rounds.length,
        })
      }
      const ok = runs.every(
        (r) => r.answer === runs[0].answer && r.classes === runs[0].classes && r.alts === runs[0].alts,
      )
      set({ confluence: { ok, runs } })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : String(e) })
    }
  },

  relayout: () => set({ relayoutNonce: get().relayoutNonce + 1 }),
  setRightTab: (rightTab) => set({ rightTab }),

  startTutorial: () => {
    set({ tutorialOpen: true, rightTab: 'tutorial', lessonIndex: 0, stepIndex: 0 })
    get().gotoLesson(0)
  },
  exitTutorial: () => set({ tutorialOpen: false, rightTab: 'inspector' }),

  gotoLesson: (i) => {
    const lesson = LESSONS[i]
    if (!lesson) return
    set({
      tutorialOpen: true,
      rightTab: 'tutorial',
      lessonIndex: i,
      stepIndex: 0,
      source: lesson.source,
      exampleId: lesson.exampleId ?? '',
      dirty: true,
      selected: null,
      confluence: null,
    })
    get().compile({ autoplay: false })
    const run = get().run
    if (run) {
      const target = lesson.startRound === 'end' ? run.rounds.length : (lesson.startRound ?? 0)
      set({ round: Math.min(target, run.rounds.length), playing: false })
    }
  },

  nextStep: () => {
    const s = get()
    const lesson = LESSONS[s.lessonIndex]
    if (s.stepIndex < lesson.steps.length - 1) {
      set({ stepIndex: s.stepIndex + 1 })
    } else if (lesson.checkpoint.test(lessonCtx(s))) {
      const completed = s.completedLessons.includes(s.lessonIndex)
        ? s.completedLessons
        : [...s.completedLessons, s.lessonIndex]
      set({ completedLessons: completed })
      if (s.lessonIndex < LESSONS.length - 1) get().gotoLesson(s.lessonIndex + 1)
    }
  },

  prevStep: () => {
    const s = get()
    if (s.stepIndex > 0) set({ stepIndex: s.stepIndex - 1 })
    else if (s.lessonIndex > 0) get().gotoLesson(s.lessonIndex - 1)
  },
}))

export { EXAMPLES, LESSONS }
