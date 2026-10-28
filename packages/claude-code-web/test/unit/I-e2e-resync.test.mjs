// The e2e's recovery after a failed step 9 (test/e2e-resync.mjs): a missed
// interrupt must not make the steps after it read the previous turn's result
// (report L, finding 2).
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { createStep9Guard, resyncAfterFailedRun } from '../e2e-resync.mjs'

/** A fake clock: sleep() advances it, and the results arrive at given times. */
function fakeSession ({ arrivals = [], exitAt = Infinity, restart = { ready: true, ms: 5000 } } = {}) {
  const clock = { t: 0 }
  const s = {
    restarts: 0,
    now: () => clock.t,
    sleep: async (ms) => { clock.t += ms },
    results: async () => (clock.t >= exitAt ? -1 : arrivals.filter((at) => at <= clock.t).length),
    restart: async () => { s.restarts++; if (restart instanceof Error) throw restart; return restart }
  }
  return s
}

test('e2e resync: waits for the late result of the interrupted turn, then goes on without a restart', async () => {
  // the slow turn's result arrives 1.4 s after step 9 gave up on it (as in report L's run c3)
  const s = fakeSession({ arrivals: [1400] })
  const r = await resyncAfterFailedRun({ ...s, sent: 1 })
  assert.deepEqual(r, { ok: true, how: 'waited 1.5 s for the late result of its turn before going on' })
  assert.equal(s.restarts, 0)
  assert.equal(s.now(), 1500, 'stopped polling as soon as the result was there')
  // both turns of the run (the slow one, then "say hi") must have ended
  const two = fakeSession({ arrivals: [0, 3000] })
  assert.equal((await resyncAfterFailedRun({ ...two, sent: 2 })).ok, true)
  assert.equal(two.now(), 3000)
})

test('e2e resync: nothing pending means no wait', async () => {
  const s = fakeSession({ arrivals: [0, 0] })
  assert.deepEqual(await resyncAfterFailedRun({ ...s, sent: 2 }), { ok: true, how: 'no turn of it was left running' })
  assert.equal(s.now(), 0)
})

test('e2e resync: no result in time, or Claude Code exited: stop and restart; a failed restart is reported', async () => {
  const late = fakeSession({ arrivals: [] })
  const r = await resyncAfterFailedRun({ ...late, sent: 1, timeoutMs: 60_000 })
  assert.deepEqual(r, { ok: true, how: 'no result within 60.0 s: stopped and restarted Claude Code (ready in 5.0 s)' })
  assert.equal(late.restarts, 1)
  assert.ok(late.now() >= 60_000 && late.now() < 61_000)

  const exited = fakeSession({ arrivals: [], exitAt: 500 })
  assert.match((await resyncAfterFailedRun({ ...exited, sent: 1 })).how, /^Claude Code exited: stopped and restarted/)
  assert.ok(exited.now() < 1000, 'no waiting on a process that is gone')

  const broken = fakeSession({ restart: { ready: false, detail: 'timeout; state starting' } })
  assert.deepEqual(await resyncAfterFailedRun({ ...broken, sent: 1, timeoutMs: 1000 }), { ok: false, how: 'no result within 1.0 s, and the restart failed (timeout; state starting)' })
  const throws = fakeSession({ restart: new Error('page crashed') })
  assert.deepEqual(await resyncAfterFailedRun({ ...throws, sent: 1, timeoutMs: 1000 }), { ok: false, how: 'no result within 1.0 s, and the restart failed: page crashed' })
  // a page that cannot be asked counts as exited
  const gone = fakeSession()
  gone.results = async () => { throw new Error('Target closed') }
  assert.equal((await resyncAfterFailedRun({ ...gone, sent: 1 })).how.startsWith('Claude Code exited'), true)
})

test('e2e step-9 guard: before a step-9 failure, results are recorded as they are', () => {
  const rec = []
  const g = createStep9Guard((...a) => rec.push(a))
  assert.equal(g.failed, null)
  assert.equal(g.blocked(11, 'eleven'), false)
  g.record(11, 'eleven', 'FAIL', 'its own failure')
  g.record(13, 'thirteen', 'PASS', 'fine')
  assert.deepEqual(rec, [[11, 'eleven', 'FAIL', 'its own failure', undefined], [13, 'thirteen', 'PASS', 'fine', undefined]])
})

test('e2e step-9 guard: after a step-9 failure, later failures are its knock-ons (SKIP), passes stay passes', () => {
  const rec = []
  const g = createStep9Guard((...a) => rec.push(a))
  g.fail({ ok: true, how: 'waited 1.5 s for the late result of its turn before going on' })
  assert.equal(g.blocked(11, 'eleven'), false, 'the session is back in step: the step runs')
  g.record(11, 'eleven', 'FAIL', 'result: success ""', { x: 1 })
  g.record(13, 'thirteen', 'PASS', 'fine')
  assert.deepEqual(rec[0], [11, 'eleven', 'SKIP', 'skipped due to step 9 (it failed; waited 1.5 s for the late result of its turn before going on); this step\'s own problems:\nresult: success ""', { x: 1 }])
  assert.deepEqual(rec[1], [13, 'thirteen', 'PASS', 'fine', undefined])
})

test('e2e step-9 guard: when step 9 left no usable session, the later steps do not run and are SKIP', () => {
  const rec = []
  const g = createStep9Guard((...a) => rec.push(a))
  g.fail({ ok: false, how: 'no result within 60.0 s, and the restart failed (timeout)' })
  assert.equal(g.blocked(11, 'eleven'), true)
  assert.equal(g.blocked(13, 'thirteen'), true)
  assert.deepEqual(rec.map((r) => [r[0], r[2], r[3]]), [
    [11, 'SKIP', 'skipped due to step 9: no result within 60.0 s, and the restart failed (timeout)'],
    [13, 'SKIP', 'skipped due to step 9: no result within 60.0 s, and the restart failed (timeout)']
  ])
  // a failure that left nothing running (e.g. the next turn's text was wrong) still marks the knock-ons
  const g2 = createStep9Guard(() => {})
  g2.fail(undefined)
  assert.deepEqual(g2.failed, { ok: true, how: 'no turn of it was left running' })
})
