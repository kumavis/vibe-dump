// Dev-only: checks src/time.js against ENGINEERING.md §4 and DATA.md §§4, 9.
//
//   node tools/test-time.mjs         exit 1 on any failure
//
// The zone sign (the navy's zone +12 is ISO −12:00, and Tokyo is 21 hours
// ahead of Midway's clock), bare dates read in their own zone, a time without
// an offset refused, spans widened by precision, the card's wording, the
// battle clock's 24:07 and ISO forms, and the WarClock's slider, chapters,
// window (never zero at a chapter's edge) and front keyframe pair.
import { DAY, zoneMinutes, zoneLabel, parseInstant, resolutionOf, spanOf, formatWhen, WarClock, BattleClock } from '../src/time.js'

let failed = 0
let passed = 0
const check = (name, ok, detail = '') => {
  if (ok) passed++
  else failed++
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
}
const throws = (f) => {
  try {
    f()
    return false
  } catch {
    return true
  }
}
const iso = (ms) => new Date(ms).toISOString().replace(':00.000Z', 'Z')

console.log('zones')
check("zoneMinutes('+09:00') = 540 (Tokyo)", zoneMinutes('+09:00') === 540)
check("zoneMinutes('-12:00') = -720 (the US Navy's zone +12)", zoneMinutes('-12:00') === -720)
check("zoneMinutes('-10:30') = -630 (Hawaiʻi, 1941)", zoneMinutes('-10:30') === -630)
check("zoneMinutes('Z') = 0", zoneMinutes('Z') === 0)
check("refuses '+9', 'UTC+9', '+12' and the navy's own 'zone +12'", ['+9', 'UTC+9', '+12', 'zone +12', '+15:00'].every((z) => throws(() => zoneMinutes(z))))
check('zoneLabel: UTC−12, UTC+9, UTC−10:30, UTC', zoneLabel('-12:00') === 'UTC−12' && zoneLabel('+09:00') === 'UTC+9' && zoneLabel('-10:30') === 'UTC−10:30' && zoneLabel('Z') === 'UTC')

console.log('instants')
const midway = parseInstant('1942-06-04T04:30-12:00')
check('1942-06-04T04:30-12:00 is 16:30 UTC (zone +12 is UTC−12)', midway === Date.UTC(1942, 5, 4, 16, 30), iso(midway))
check('the same instant on Tokyo time is 01:30 on 5 June: 21 hours ahead', parseInstant('1942-06-05T01:30+09:00') === midway)
check('1942-11-15T00:07+11:00 is 13:07 UTC on the 14th', parseInstant('1942-11-15T00:07+11:00') === Date.UTC(1942, 10, 14, 13, 7))
check('Pearl Harbor 07:55 at −10:30 is 18:25 UTC', parseInstant('1941-12-07T07:55-10:30') === Date.UTC(1941, 11, 7, 18, 25))
check('a bare date is the start of that day in the zone given', parseInstant('1942-06-04', { zone: '+11:00' }) === Date.UTC(1942, 5, 3, 13, 0))
check('a bare date with no zone is midnight UTC', parseInstant('1942-06-04') === Date.UTC(1942, 5, 4))
check('YYYY-MM and YYYY are the start of the month and the year', parseInstant('1942-06') === Date.UTC(1942, 5, 1) && parseInstant('1942') === Date.UTC(1942, 0, 1))
check('seconds are read', parseInstant('1942-06-04T10:21:30-12:00') === Date.UTC(1942, 5, 4, 22, 21, 30))
check('a time without an offset throws', throws(() => parseInstant('1942-06-04T04:30')))
check('nonsense throws (10:22, 1942-13-01, 1942-02-30, 1942-06-04T25:00Z)', ['10:22', '1942-13-01', '1942-02-30', '1942-06-04T25:00Z'].every((s) => throws(() => parseInstant(s))))
check('resolutionOf', resolutionOf('1942') === 'year' && resolutionOf('1942-06') === 'month' && resolutionOf('1942-06-04') === 'day' && resolutionOf('1942-06-04T04:30-12:00') === 'minute')

console.log('spans')
{
  const [a, b] = spanOf({ from: '1942-06-04', precision: 'day', zone: '-12:00' })
  check('a day in zone −12:00 spans that civil day there', a === Date.UTC(1942, 5, 4, 12) && b - a === DAY, `${iso(a)} – ${iso(b)}`)
  const [c, d] = spanOf({ from: '1942-06-04T04:30-12:00', to: '1942-06-07T05:01-12:00', precision: 'minute' })
  check('a minute-precision span ends a minute after its to', c === midway && d === parseInstant('1942-06-07T05:01-12:00') + 60000)
  const [e, f] = spanOf({ from: '1944-10', precision: 'month', zone: '+09:00' })
  check('a month spans the month, in its zone', e === Date.UTC(1944, 8, 30, 15) && f === Date.UTC(1944, 9, 31, 15), `${iso(e)} – ${iso(f)}`)
  const [g, h] = spanOf({ from: '1942-08-07', to: '1943-02-09', precision: 'day', zone: '+11:00' })
  check('a span of days runs to the end of its last day', g === Date.UTC(1942, 7, 6, 13) && h === Date.UTC(1943, 1, 9, 13))
  const [i, j] = spanOf({ from: '1942-06-15', precision: 'month' })
  check('a day written under month precision widens to its month', i === Date.UTC(1942, 5, 1) && j === Date.UTC(1942, 6, 1))
  const [k, l] = spanOf({ from: '1942-06-04T10:00-12:00', precision: 'hour' })
  check('hour precision spans the hour', k === Date.UTC(1942, 5, 4, 22) && l - k === 3600000)
}

console.log('how a time reads on a card')
{
  const a = formatWhen({ from: '1942-06-04T10:22-12:00', precision: 'minute', zone: '-12:00' })
  check('"4 June 1942, 10:22 (UTC−12)"', a === '4 June 1942, 10:22 (UTC−12)', a)
  const b = formatWhen({ from: '1942-06-04T04:30-12:00', to: '1942-06-07T05:01-12:00', precision: 'minute', zone: '-12:00' })
  check('a span over days', b === '4 June 1942, 04:30 – 7 June 1942, 05:01 (UTC−12)', b)
  const c = formatWhen({ from: '1942-06-04', to: '1942-06-07', precision: 'day', zone: '-12:00' })
  check('"4–7 June 1942"', c === '4–7 June 1942', c)
  const d = formatWhen({ from: '1942-08-07', to: '1943-02-09', precision: 'day', zone: '+11:00' })
  check('across a year', d === '7 August 1942 – 9 February 1943', d)
  const e = formatWhen({ from: '1944-10', precision: 'month' })
  check('"October 1944"', e === 'October 1944', e)
  const f = formatWhen({ from: '1941-12-07T07:55-10:30', precision: 'minute', zone: '+09:00' }, { name: 'Tokyo time' })
  check('the same instant in another clock, by name', f === '8 December 1941, 03:25 (Tokyo time)', f)
  const g = formatWhen(Date.UTC(1942, 5, 4, 22, 22), { zone: '-12:00' })
  check('ms UTC in a zone', g === '4 June 1942, 10:22 (UTC−12)', g)
  const h = formatWhen({ from: '1942-06-04T10:22-12:00', to: '1942-06-04T10:28-12:00', precision: 'minute', zone: '-12:00' })
  check('within a day', h === '4 June 1942, 10:22–10:28 (UTC−12)', h)
}

console.log('the battle clock')
{
  const c = new BattleClock({ zone: '-12:00', from: '1942-06-04T04:00-12:00', to: '1942-06-04T18:00-12:00' })
  check('duration 14 hours', c.duration === 14 * 3600)
  check("parse('10:22') = 6 h 22 min after 04:00", c.parse('10:22') === 6 * 3600 + 22 * 60)
  check("parse('10:21:30')", c.parse('10:21:30') === 6 * 3600 + 21 * 60 + 30)
  check("parse('24:07') is seven minutes past midnight the next day", c.parse('24:07') === 20 * 3600 + 7 * 60)
  check('parse of a full ISO instant in another zone', c.parse('1942-06-05T07:22+09:00') === 6 * 3600 + 22 * 60)
  check('utc(t) is the absolute instant', c.utc(c.parse('10:22')) === Date.UTC(1942, 5, 4, 22, 22))
  check("label(t) = '10:22', dateLabel(t) = '4 June 1942'", c.label(c.parse('10:22')) === '10:22' && c.dateLabel(c.parse('10:22')) === '4 June 1942')
  check('label past midnight reads the wall clock', c.label(c.parse('24:07')) === '00:07' && c.dateLabel(c.parse('24:07')) === '5 June 1942')
  const g = new BattleClock({ zone: '+11:00', from: '1942-11-14T21:00+11:00', to: '1942-11-15T03:00+11:00' })
  check("Guadalcanal: '24:07' and '1942-11-15T00:07+11:00' are the same t", g.parse('24:07') === g.parse('1942-11-15T00:07+11:00') && g.parse('24:07') === 3 * 3600 + 7 * 60)
  check('a clock that ends before it starts throws', throws(() => new BattleClock({ zone: '-12:00', from: '1942-06-04T18:00-12:00', to: '1942-06-04T04:00-12:00' })))
}

console.log('the war clock')
{
  // R3's eight chapters as DATA.md §4 drafts them (dates for the test, not the content's)
  const chapters = [
    { id: 'prologue', from: '1931-09-18', to: '1941-12-07', keyframe: '1941-12-06' },
    { id: 'first-six-months', from: '1941-12-07', to: '1942-06-01', keyframe: '1942-05-08' },
    { id: 'turn', from: '1942-06-01', to: '1943-02-09', keyframe: '1942-09-15' },
    { id: 'ladder', from: '1943-02-09', to: '1943-11-20', keyframe: '1943-11-01' },
    { id: 'central-pacific', from: '1943-11-20', to: '1944-10-20', keyframe: '1944-08-15' },
    { id: 'return', from: '1944-10-20', to: '1945-03-26', keyframe: '1945-01-15' },
    { id: 'approaches', from: '1945-03-26', to: '1945-08-31', keyframe: '1945-07-01' },
    { id: 'end', from: '1945-08-31', to: '1945-10-09', keyframe: '1945-09-02' },
  ]
  const w = new WarClock(chapters)
  check('the prologue takes the first tenth of the slider', Math.abs(w.sAt(Date.UTC(1941, 11, 7)) - 0.1) < 1e-12 && w.dateAt(0) === Date.UTC(1931, 8, 18))
  check('the war is linear after: halfway through its days is s = 0.55', Math.abs(w.sAt((Date.UTC(1941, 11, 7) + Date.UTC(1945, 9, 9)) / 2) - 0.55) < 1e-9)
  check('dateAt and sAt are inverse', [0, 0.03, 0.1, 0.4, 0.77, 1].every((s) => Math.abs(w.sAt(w.dateAt(s)) - s) < 1e-9))
  let calls = 0
  const off = w.onChange(() => calls++)
  w.setDate(Date.UTC(1942, 5, 4))
  w.setDate(Date.UTC(1942, 5, 4))
  off()
  w.setS(0.3)
  check('setDate notifies once per change; the unsubscribe holds', calls === 1)
  w.setDate(Date.UTC(1942, 5, 4, 12))
  check('date round-trips through s to the millisecond', Math.abs(w.date - Date.UTC(1942, 5, 4, 12)) < 1)
  check('chapterAt', w.chapterAt(Date.UTC(1942, 5, 4)).id === 'turn' && w.chapterAt(Date.UTC(1935, 0, 1)).id === 'prologue' && w.chapterAt(Date.UTC(1950, 0, 1)).id === 'end')
  const edge = Date.UTC(1942, 5, 1)
  const [a, b] = w.windowAt(edge)
  check('the window at a chapter boundary is not zero: ±21 days at the start of the turn', b - a === 42 * DAY && a < edge && b > edge, `${(b - a) / DAY} days`)
  const [c, d] = w.windowAt(Date.UTC(1945, 8, 2))
  check('in the end (39 days) the window clamps to ±7 days', d - c === 14 * DAY, `${(d - c) / DAY} days`)
  const [e, f] = w.windowAt(Date.UTC(1945, 0, 1))
  check('in the return (157 days) it is an eighth of the chapter either side', Math.abs((f - e) / 2 - (Date.UTC(1945, 2, 26) - Date.UTC(1944, 9, 20)) / 8) < 1, `${((f - e) / 2 / DAY).toFixed(2)} days`)
  const [g, h] = w.windowAt(Date.UTC(1937, 6, 7))
  check('in the prologue the window is the whole prologue', g === Date.UTC(1931, 8, 18) && h === Date.UTC(1941, 11, 7))
  const p = w.frontPair(Date.UTC(1942, 6, 12))
  check('frontPair between 1942-05-08 and 1942-09-15', p.a.id === '1942-05-08' && p.b.id === '1942-09-15' && p.t > 0.4 && p.t < 0.6, `t = ${p.t.toFixed(3)}`)
  const q = w.frontPair(Date.UTC(1940, 0, 1))
  check('before the first keyframe it holds the first', q.a.id === '1941-12-06' && q.b === q.a && q.t === 0)
  const r = w.frontPair(Date.UTC(1946, 0, 1))
  check('after the last it holds the last', r.a.id === '1945-09-02' && r.b === r.a)
  const k = new WarClock(chapters, { keyframes: [{ id: '1941-12-06', date: '1941-12-06' }, { id: '1943-06-01', date: '1943-06-01' }] })
  check('keyframes may come from fronts/manifest.json instead', k.frontPair(Date.UTC(1942, 8, 1)).b.id === '1943-06-01')
}

console.log(failed ? `${failed} failed, ${passed} passed` : `all ${passed} passed`)
process.exitCode = failed ? 1 : 0
