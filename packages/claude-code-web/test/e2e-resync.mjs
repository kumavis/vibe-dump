// Recovery after a failed step 9 of the e2e (test/e2e.mjs), kept apart from
// it so it can be unit-tested (test/unit/I-e2e-resync.test.mjs).
//
// Step 9 interrupts a slow turn. When the interrupt is not applied, the slow
// stream runs on for ~20 s and the turn's result arrives after step 9 has
// given up on it. Without care every later turn then reads the previous
// turn's result, so one flake fails steps 9, 11 and 13 in cascade (report L,
// finding 2). Two pieces prevent that: resyncAfterFailedRun waits for the
// late result (or restarts Claude Code) before the next step, and
// createStep9Guard reports the steps after step 9 as its knock-ons (SKIP,
// "skipped due to step 9") rather than as failures of their own.

const secs = (ms) => `${(ms / 1000).toFixed(1)} s`

/**
 * Bring the session back in step after a failed step-9 run: `sent` turns were
 * sent in it; wait until each has its `result`, else (none within
 * `timeoutMs`, or Claude Code exited) stop and restart Claude Code.
 * @param {object} o
 * @param {() => Promise<number>} o.results  results seen since the run began; -1 once Claude Code has exited
 * @param {number} o.sent
 * @param {() => Promise<{ready: boolean, detail?: string, ms?: number}>} o.restart  stop and start Claude Code
 * @param {number} [o.timeoutMs]
 * @param {number} [o.pollMs]
 * @returns {Promise<{ok: boolean, how: string}>}
 */
export async function resyncAfterFailedRun ({ results, sent, restart, timeoutMs = 60_000, pollMs = 250, now = Date.now, sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)) }) {
  const t = now()
  const count = () => Promise.resolve().then(results).catch(() => -1)
  let n = await count()
  const pending = n >= 0 && n < sent
  while (n >= 0 && n < sent && now() - t < timeoutMs) {
    await sleep(pollMs)
    n = await count()
  }
  if (n >= sent) return { ok: true, how: pending ? `waited ${secs(now() - t)} for the late result of its turn before going on` : 'no turn of it was left running' }
  const why = n < 0 ? 'Claude Code exited' : `no result within ${secs(timeoutMs)}`
  try {
    const r = await restart()
    if (!r?.ready) return { ok: false, how: `${why}, and the restart failed${r?.detail ? ` (${r.detail})` : ''}` }
    return { ok: true, how: `${why}: stopped and restarted Claude Code${r.ms != null ? ` (ready in ${secs(r.ms)})` : ''}` }
  } catch (err) {
    return { ok: false, how: `${why}, and the restart failed: ${err?.message ?? err}` }
  }
}

/**
 * The reporting rule for the steps that run after step 9.
 * @param {(id: string|number, name: string, status: 'PASS'|'FAIL'|'SKIP', reason?: string, details?: object) => void} record
 */
export function createStep9Guard (record) {
  let after = null // {ok, how} once step 9 failed
  return {
    get failed () { return after },
    /** Step 9 failed; `state` is what resyncAfterFailedRun returned. */
    fail (state) { after = state ?? { ok: true, how: 'no turn of it was left running' } },
    /** record() for a later step: a failure is reported as a knock-on of step 9 (SKIP), with its own problems. */
    record (id, name, status, reason = '', details = undefined) {
      if (after && status === 'FAIL') return record(id, name, 'SKIP', `skipped due to step 9 (it failed; ${after.how}); this step's own problems:\n${reason}`, details)
      return record(id, name, status, reason, details)
    },
    /** True, with the step recorded as SKIP, when step 9 left no usable session. */
    blocked (id, name) {
      if (!after || after.ok) return false
      record(id, name, 'SKIP', `skipped due to step 9: ${after.how}`)
      return true
    }
  }
}
