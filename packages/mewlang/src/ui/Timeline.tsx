import { useEffect, useMemo } from 'react'
import { currentRoundLog, useStore } from './store'

export function Timeline() {
  const run = useStore((s) => s.run)
  const round = useStore((s) => s.round)
  const playing = useStore((s) => s.playing)
  const speed = useStore((s) => s.speed)
  const setRound = useStore((s) => s.setRound)
  const stepFwd = useStore((s) => s.stepFwd)
  const stepBack = useStore((s) => s.stepBack)
  const setPlaying = useStore((s) => s.setPlaying)
  const setSpeed = useStore((s) => s.setSpeed)

  const total = run?.rounds.length ?? 0
  const atEnd = round >= total

  // Playback clock.
  useEffect(() => {
    if (!playing || !run) return
    if (round >= run.rounds.length) {
      setPlaying(false)
      return
    }
    const t = setInterval(() => {
      const s = useStore.getState()
      if (s.round >= (s.run?.rounds.length ?? 0)) s.setPlaying(false)
      else s.setRound(s.round + 1)
    }, 1000 / speed)
    return () => clearInterval(t)
  }, [playing, speed, run, round, setPlaying])

  const ribbon = useMemo(() => {
    if (!run) return ''
    if (round === 0) {
      const n = run.snapshots[0].classes.length
      return `R0: initial network — ${n} classes interned from main, fuel ${run.snapshots[0].fuel}`
    }
    const rl = currentRoundLog({ run, round })
    if (!rl) return ''
    const byRule = new Map<string, { n: number; sample: string }>()
    for (const f of rl.firings) {
      const cur = byRule.get(f.rule) ?? { n: 0, sample: f.detail }
      cur.n++
      byRule.set(f.rule, cur)
    }
    const parts: string[] = []
    for (const [rule, { n, sample }] of byRule) {
      parts.push(`${n}×${rule}${rule === 'R-unfold' ? `(${sample})` : ''}`)
    }
    if (rl.newClasses.length) parts.push(`+${rl.newClasses.length} classes`)
    if (rl.merges.length) parts.push(`${rl.merges.length} merge${rl.merges.length > 1 ? 's' : ''}`)
    parts.push(`fuel ${rl.fuelRemaining}`)
    if (rl.blockedByFuel > 0) parts.push(`⚠ ${rl.blockedByFuel} unfolds blocked by fuel`)
    return `R${rl.round}: ${parts.join(', ')}`
  }, [run, round])

  const ruleClass = (part: string) =>
    part.includes('R-arith')
      ? 'r-arith'
      : part.includes('R-if')
        ? 'r-if'
        : part.includes('R-unfold')
          ? 'r-unfold'
          : part.includes('R-congruence')
            ? 'r-cong'
            : ''

  return (
    <div className="timeline" data-testid="timeline">
      <button onClick={stepBack} disabled={!run || round === 0} title="step back one round">
        ⏮︎
      </button>
      <button
        className="primary"
        disabled={!run || total === 0 || (atEnd && !playing)}
        onClick={() => setPlaying(!playing)}
        title="play / pause"
      >
        {playing ? '⏸' : '▶'}
      </button>
      <button onClick={stepFwd} disabled={!run || atEnd} title="step forward one round">
        ⏭︎
      </button>
      <span className="round-display">
        round {round}/{total}
      </span>
      <input
        type="range"
        min={0}
        max={Math.max(total, 1)}
        value={round}
        disabled={!run}
        onChange={(e) => {
          setPlaying(false)
          setRound(Number(e.target.value))
        }}
      />
      <label style={{ color: 'var(--text-dim)', fontSize: 12 }}>
        speed{' '}
        <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))}>
          <option value={1}>1×</option>
          <option value={2}>2×</option>
          <option value={4}>4×</option>
          <option value={8}>8×</option>
        </select>
      </label>
      <div className="ribbon">
        {ribbon.split(', ').map((part, i) => (
          <span key={i}>
            {i > 0 && ', '}
            <span className={ruleClass(part)}>{part}</span>
          </span>
        ))}
      </div>
    </div>
  )
}
