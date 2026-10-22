// Dev-only: checks the ephemeris in src/render/sky.js against the worked
// examples of Meeus, Astronomical Algorithms (2nd ed.), and the moon's age on
// the four v1 battle dates against R9's mean-lunation figures (±0.6 d there;
// a true moon runs up to about 0.7 d either side of the mean, so ±1.5 d here).
//
//   node tools/test-sky.mjs          exit 1 on any failure
//
// A check of the low-precision sun and the truncated moon, not an almanac:
// someone should still hold the four nights against the Nautical Almanac
// (R9 §11), moonset at Ironbottom Sound on 14–15 November 1942 above all.
import { sunPosition, moonPosition, gmst, astronomy, WAR_ROOM } from '../src/render/sky.js'

let failed = 0
let passed = 0
const check = (name, ok, detail = '') => {
  if (ok) passed++
  else failed++
  console.log(`  ${ok ? '✓' : '✗'} ${name}${detail ? ` — ${detail}` : ''}`)
}
const jdOf = (ms) => ms / 86400000 + 2440587.5
const Tof = (ms) => (jdOf(ms) - 2451545) / 36525
const dAng = (a, b) => Math.abs(((a - b + 540) % 360) - 180)

console.log('Meeus worked examples')
{
  // example 12.a: 1987 April 10, 0h UT, θ0 = 13h 10m 46.3668s
  const g = gmst(jdOf(Date.UTC(1987, 3, 10)))
  check('mean sidereal time, example 12.a', dAng(g, (13 + 10 / 60 + 46.3668 / 3600) * 15) < 1e-4, `${g.toFixed(6)}°`)
  // example 25.a: 1992 October 13, 0h TD: α = 198.38083°, δ = −7.78507°
  const s = sunPosition(Tof(Date.UTC(1992, 9, 13)))
  check('the sun, example 25.a (within 0.01°)', dAng(s.ra, 198.38083) < 0.01 && Math.abs(s.dec + 7.78507) < 0.01, `α ${s.ra.toFixed(4)}°, δ ${s.dec.toFixed(4)}°`)
  // example 47.a: 1992 April 12, 0h TD: λ = 133.162655°, β = −3.229126°, Δ = 368409.7 km, α = 134.688470°, δ = 13.768368°
  const m = moonPosition(Tof(Date.UTC(1992, 3, 12)), s.eps)
  check('the moon, example 47.a (within 0.05°, 300 km)', dAng(m.lambda, 133.162655) < 0.05 && Math.abs(m.beta + 3.229126) < 0.05 && Math.abs(m.dist - 368409.7) < 300, `λ ${m.lambda.toFixed(4)}°, β ${m.beta.toFixed(4)}°, Δ ${m.dist.toFixed(0)} km`)
  check('its right ascension and declination', dAng(m.ra, 134.68847) < 0.06 && Math.abs(m.dec - 13.768368) < 0.06, `α ${m.ra.toFixed(4)}°, δ ${m.dec.toFixed(4)}°`)
}

console.log('the sun in the sky')
{
  const a = astronomy(Date.UTC(2000, 5, 21, 12, 0), 23.44, 0)
  check('overhead at the tropic at noon on the June solstice', a.sun.y > 0.999, `elevation ${(Math.asin(a.sun.y) * 57.2958).toFixed(2)}°`)
  const b = astronomy(Date.UTC(2000, 2, 20, 18, 0), 0, 0)
  check('setting due west at the equator on the March equinox', Math.abs(Math.asin(b.sun.y) * 57.2958) < 2 && b.sun.x < -0.99, `x ${b.sun.x.toFixed(3)}, y ${b.sun.y.toFixed(3)}`)
  const w = astronomy(WAR_ROOM.utc, WAR_ROOM.lat, WAR_ROOM.lon)
  const elev = Math.asin(w.sun.y) * 57.2958
  const az = (Math.atan2(w.sun.x, -w.sun.z) * 57.2958 + 360) % 360
  check("the war room's light: the sun in the west-south-west, about 30° up", elev > 22 && elev < 40 && az > 230 && az < 270, `elevation ${elev.toFixed(1)}°, azimuth ${az.toFixed(1)}°`)
}

console.log("the moon's age on the v1 battle dates (R9's mean lunation)")
for (const [name, utc, lat, lon, ref] of [
  ['Pearl Harbor, 7 Dec 1941 07:55 −10:30', Date.UTC(1941, 11, 7, 18, 25), 21.4, -158, 18.5],
  ['Midway, 4 Jun 1942 10:22 −12:00', Date.UTC(1942, 5, 4, 22, 22), 30, -178, 20.5],
  ['Guadalcanal, 15 Nov 1942 00:00 +11:00', Date.UTC(1942, 10, 14, 13, 0), -9.3, 160, 5.9],
  ['Samar, 25 Oct 1944 07:00 +09:00', Date.UTC(1944, 9, 24, 22, 0), 11.8, 126.1, 7.5],
]) {
  const a = astronomy(utc, lat, lon)
  check(name, Math.abs(a.age - ref) < 1.5, `age ${a.age.toFixed(1)} d (mean ${ref}), ${(a.illum * 100).toFixed(0)} % lit, moon ${(Math.asin(a.moon.y) * 57.2958).toFixed(1)}° up`)
}

console.log(failed ? `${failed} failed, ${passed} passed` : `all ${passed} passed`)
process.exitCode = failed ? 1 : 0
