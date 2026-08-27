(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const a of s)if(a.type==="childList")for(const r of a.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&n(r)}).observe(document,{childList:!0,subtree:!0});function e(s){const a={};return s.integrity&&(a.integrity=s.integrity),s.referrerPolicy&&(a.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?a.credentials="include":s.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function n(s){if(s.ep)return;s.ep=!0;const a=e(s);fetch(s.href,a)}})();const Jt=`// The flute voice: a jet-drive waveguide.
//
// A flute is a tube with a jet of air blown across a hole in one end. The jet
// flaps in and out of the hole; the tube's own pressure wave is what makes it
// flap; the flapping is what keeps the wave going. That feedback loop is the
// whole instrument, and it is what this models — a delay line for the bore, a
// second short delay for the jet's transit time, and a cubic nonlinearity
// where the jet meets the edge.
//
// Modelling it rather than faking it buys three things that matter for a
// machine that improvises:
//
//   * Breath noise comes back out of the tube *pitched*, because it is
//     injected into the loop and filtered by the tube's modes. That airy,
//     hollow quality is most of what a low bass flute sounds like.
//   * Blowing harder brightens the tone for free — a bigger limit cycle
//     drives the cubic further into saturation and makes more harmonics.
//   * Slurring is free. Change the delay length while the air keeps flowing
//     and you get a real legato with no re-attack, which is exactly how a
//     trill or a grace note works on a real flute.
//
// This module deliberately has no browser dependencies: it is imported as text
// and concatenated into the AudioWorklet, and imported normally by the test
// harness so the tuning can be measured offline.

const TAU = Math.PI * 2
const clamp = (x, a, b) => (x < a ? a : x > b ? b : x)
const lerp = (a, b, t) => a + (b - a) * t

// ---------------------------------------------------------------------------
// Register anchors.
//
// A note on \`jetRatio\`, which is the parameter that decides whether this thing
// makes a sound at all. The jet's delayed feedback and the open end's
// reflection add up to B = Er - A*exp(-jx), where A = Pb*jetGain*jetRefl and
// x = 2*pi*jetRatio at the fundamental. The tube can only sustain a mode where
// |B| exceeds one, so jetRatio picks which mode that is: at 0.5 — a jet
// transit of half a period — the two terms are exactly in phase at the
// fundamental (|B| = Er + A) and exactly out of phase at the octave, which is
// the flute playing normally. Halve it and the octave becomes the favoured
// mode instead: that is literally what overblowing is.
//
// A flute is not one instrument. The low register is quiet, noisy and has few
// harmonics because the player is blowing near the threshold where the tube
// oscillates at all; the high register is loud and nearly pure because the
// fundamental is already above 1 kHz and there is no room for harmonics under
// the radiation rolloff. These are the two ends, plus the ordinary middle;
// every note interpolates between them.
// ---------------------------------------------------------------------------

const LOW = {
  pSus: 0.46, pPeakRatio: 1.1,
  jetRatio: 0.52, jetGain: 2.6, jetRefl: 0.71, endRefl: 0.46, jetOffset: 0.34,
  loopNoise: 0.35, airGain: 0.2, airCenter: 1700, airQ: 0.8,
  chiffGain: 0.45, chiffCenter: 2200, chiffDecay: 0.09, chiffIntoBore: 0.4,
  tA: 0.18, tSettle: 0.14, tR: 0.26, tTail: 0.3,
  vibRate: 4.6, vibDelay: 0.5, vibRamp: 0.7, vibPressureDepth: 0.04, vibCents: 9,
  scoopCents: 30, scoopTau: 0.06,
  outGain: 0.13,
}

const MID = {
  pSus: 0.58, pPeakRatio: 1.12,
  jetRatio: 0.5, jetGain: 2.6, jetRefl: 0.59, endRefl: 0.42, jetOffset: 0.3,
  loopNoise: 0.18, airGain: 0.09, airCenter: 2400, airQ: 0.7,
  chiffGain: 0.3, chiffCenter: 4000, chiffDecay: 0.07, chiffIntoBore: 0.35,
  tA: 0.045, tSettle: 0.09, tR: 0.14, tTail: 0.25,
  vibRate: 5.2, vibDelay: 0.35, vibRamp: 0.5, vibPressureDepth: 0.045, vibCents: 11,
  scoopCents: 25, scoopTau: 0.04,
  outGain: 0.16,
}

const HIGH = {
  pSus: 0.8, pPeakRatio: 1.14,
  jetRatio: 0.47, jetGain: 3.3, jetRefl: 0.345, endRefl: 0.4, jetOffset: 0.22,
  loopNoise: 0.08, airGain: 0.03, airCenter: 3200, airQ: 0.6,
  chiffGain: 0.22, chiffCenter: 4500, chiffDecay: 0.025, chiffIntoBore: 0.35,
  tA: 0.01, tSettle: 0.035, tR: 0.06, tTail: 0.12,
  vibRate: 5.6, vibDelay: 0.15, vibRamp: 0.25, vibPressureDepth: 0.025, vibCents: 14,
  scoopCents: 12, scoopTau: 0.025,
  outGain: 0.18,
}

const FIELDS = Object.keys(MID)

/**
 * The preset for a given pitch, interpolated across the registers.
 *
 * The crossfade is continuous rather than a switch: the one place a real flute
 * is genuinely smooth is across the break, and a hard switch puts an audible
 * seam exactly there.
 *
 * \`tone\` carries the player-facing modifiers:
 *   breathiness 0..1 — air-to-tone ratio
 *   vibrato     0..1 — vibrato depth (0 is a legitimate straight-tone drone)
 *   brightness  0..1 — nudges the reflection filter corner
 */
export function presetFor(midi, tone = {}) {
  const breathiness = tone.breathiness ?? 0.4
  const vibrato = tone.vibrato ?? 0.5
  const brightness = tone.brightness ?? 0.5

  // Smoothstep from the low anchor (MIDI 50) to the high anchor (MIDI 90).
  let u = clamp((midi - 50) / 40, 0, 1)
  u = u * u * (3 - 2 * u)

  const p = {}
  if (u < 0.5) {
    const t = u * 2
    for (const k of FIELDS) p[k] = lerp(LOW[k], MID[k], t)
  } else {
    const t = (u - 0.5) * 2
    for (const k of FIELDS) p[k] = lerp(MID[k], HIGH[k], t)
  }

  // Breathiness moves air in three places at once — the noise inside the tube,
  // the hiss at the lips, and the chiff — because on a real instrument they
  // all come from the same thing: the player using more air than the tube can
  // turn into tone.
  const b = (breathiness - 0.4) // centred on the default
  p.loopNoise = clamp(p.loopNoise * (1 + 1.4 * b), 0, 0.5)
  p.airGain = clamp(p.airGain * (1 + 2.2 * b), 0, 0.35)
  p.chiffGain = clamp(p.chiffGain * (1 + 1.2 * b), 0, 0.6)

  p.vibPressureDepth *= vibrato * 2
  p.vibCents *= vibrato * 2

  p.brightness = brightness
  p.driftCents = 2.6
  p.driftPressure = 0.012
  p.detuneCents = 0
  p.maxSlewD = 0.25

  return p
}

// ---------------------------------------------------------------------------
// Shared voice machinery: the breath envelope and the modulators.
//
// The envelope drives *breath pressure*, not amplitude. That distinction is
// the whole reason the attack sounds like a flute: the tone does not fade in,
// it appears part-way up the pressure ramp at the moment the loop gain crosses
// one, and it stops on release when the gain drops back under one — while air
// is still audibly flowing.
// ---------------------------------------------------------------------------

class VoiceCore {
  constructor(fs, preset) {
    this.fs = fs
    this.iFs = 1 / fs
    this.P = preset
    this.rng = 0x9e3779b9

    this.midi = 69
    this.f0 = 440
    this.p = 0
    this.pTune = 0
    this.stage = 0 // 0 idle, 1 attack, 2 settle, 3 sustain, 4 release, 5 tail
    this.tail = 0
    this.aInc = 0
    this.sC = 0
    this.rC = 0
    this.pPeak = 0
    this.pSus = 0
    this.gain = 1

    this.vibPh = 0
    this.vibAge = 0
    this.vibSwell = 0
    this.vibRateMul = 1
    this.vibDepthMul = 1
    this.d1 = 0
    this.d2 = 0
    this.d3 = 0

    this.chiff = 0
    this.chiffC = 1
    this.scoop = 0
    this.scoopC = 1
    this.bendCents = 0
    this.bendFrom = 0
    this.bendC = 1

    this.flutterPh = 0
    this.flutterRate = 0
    this.flutterDepth = 0

    this.nLp = 0
    this.nLpA = 1 - Math.exp((-TAU * 3000) / fs)
    this.dn = 1e-18
  }

  /** xorshift32 in [-1, 1). The only randomness on the audio thread. */
  rand() {
    let s = this.rng
    s ^= s << 13
    s >>>= 0
    s ^= s >>> 17
    s ^= s << 5
    s >>>= 0
    this.rng = s
    return s * 4.656612873077393e-10 - 1
  }

  setPreset(p) {
    this.P = p
  }

  noteOn(ev) {
    const P = this.P
    const slur = !!ev.slur
    if (!slur) this.rng = (ev.seed >>> 0) || 0x9e3779b9

    this.midi = ev.midi
    this.f0 = 440 * Math.pow(2, (ev.midi - 69) / 12)
    const vel = clamp(ev.velocity ?? 0.7, 0.05, 1)
    this.gain = ev.gain ?? 1
    // Velocity only moves the pressure over a narrow band. Wider is more
    // expressive but drops the quiet end below the threshold where the tube
    // speaks at all — true to life, and musically useless.
    this.pSus = P.pSus * (0.72 + 0.28 * vel)
    this.pPeak = this.pSus * P.pPeakRatio

    this.flutterRate = ev.flutter ? ev.flutter : 0
    this.flutterDepth = ev.flutter ? 0.35 : 0
    this.vibRateMul = ev.vibRate ? ev.vibRate / P.vibRate : 1
    this.vibDepthMul = ev.vibDepth ?? 1

    if (slur) {
      // Legato: the air never stops, so there is no re-attack. Dip the
      // pressure briefly and fire a fraction of a chiff — that is what a
      // real slur or trill actually is.
      this.p *= 0.92
      this.chiff = P.chiffGain * 0.28
      if (this.stage >= 4) this.stage = 3
      this.scoop = 0
    } else {
      this.p = 0
      this.stage = 1
      this.vibPh = 0
      this.vibAge = 0
      this.chiff = 0
      this.aInc = (1 / Math.max(1, P.tA * this.fs)) * this.pPeak
      this.scoop = 1
    }

    this.sC = 1 - Math.exp(-3 / (P.tSettle * this.fs))
    this.rC = 1 - Math.exp(-1 / (P.tR * this.fs))
    this.chiffC = Math.exp(-1 / (P.chiffDecay * this.fs))
    this.scoopC = Math.exp(-1 / (P.scoopTau * this.fs))

    // An explicit bend (a scoop into the note from below, or a fall at the
    // end) rides on top of everything else.
    this.bendFrom = ev.bendCents ?? 0
    this.bendCents = this.bendFrom
    this.bendC = Math.exp(-1 / (Math.max(0.01, ev.bendTime ?? 0.12) * this.fs))

    if (!slur) this.pTune = this.pSus
    this.onNoteOn(slur)
  }

  onNoteOn() {}

  noteOff() {
    if (this.stage > 0 && this.stage < 4) {
      this.stage = 4
      this.tail = (this.P.tTail * this.fs) | 0
    }
  }

  isActive() {
    return this.stage !== 0
  }

  /** Advance the breath envelope by one sample. */
  stepEnv() {
    switch (this.stage) {
      case 1:
        this.p += this.aInc
        if (this.p >= this.pPeak) {
          this.p = this.pPeak
          this.stage = 2
        }
        break
      case 2:
        this.p += (this.pSus - this.p) * this.sC
        if (Math.abs(this.p - this.pSus) < 1e-4) this.stage = 3
        break
      case 3:
        break
      case 4:
        this.p -= this.p * this.rC
        if (this.p < 1e-4) {
          this.p = 0
          this.stage = 5
        }
        break
      case 5:
        if (--this.tail <= 0) this.stage = 0
        break
      default:
        this.p = 0
    }
  }

  /**
   * Advance the deterministic modulators. Returns the pitch offset in cents;
   * leaves the vibrato value in \`this.vib\` for the pressure path.
   */
  stepMod() {
    const P = this.P
    const iFs = this.iFs

    this.vibAge++
    this.vibPh += P.vibRate * this.vibRateMul * (0.85 + 0.15 * this.vibSwell) * iFs
    if (this.vibPh >= 1) this.vibPh -= 1
    this.vib = Math.sin(TAU * this.vibPh) * this.vibSwell * this.vibDepthMul

    // Three incommensurate sines standing in for a human being slightly
    // unsteady. Deterministic, so an export matches what was heard.
    this.d1 += 0.11 * iFs
    if (this.d1 >= 1) this.d1 -= 1
    this.d2 += 0.173 * iFs
    if (this.d2 >= 1) this.d2 -= 1
    this.d3 += 0.267 * iFs
    if (this.d3 >= 1) this.d3 -= 1
    this.drift =
      0.3333 * (Math.sin(TAU * this.d1) + Math.sin(TAU * this.d2) + Math.sin(TAU * this.d3))

    if (this.flutterRate > 0) {
      this.flutterPh += this.flutterRate * iFs
      if (this.flutterPh >= 1) this.flutterPh -= 1
      this.flutter = Math.sin(TAU * this.flutterPh)
    } else {
      this.flutter = 0
    }

    this.chiff *= this.chiffC
    this.scoop *= this.scoopC
    this.bendCents *= this.bendC

    return (
      P.vibCents * this.vib -
      P.scoopCents * this.scoop +
      this.bendCents +
      P.driftCents * this.drift +
      P.detuneCents
    )
  }

  /** Breath pressure including vibrato, drift, flutter and turbulence. */
  stepPressure() {
    const P = this.P
    const w = this.rand()
    this.nLp += this.nLpA * (w - this.nLp)
    let Pb =
      this.p *
      (1 +
        P.vibPressureDepth * this.vib +
        P.driftPressure * this.drift +
        this.flutterDepth * this.flutter)
    Pb += Pb * P.loopNoise * this.nLp
    return Pb < 0 ? 0 : Pb > 1.2 ? 1.2 : Pb
  }

  /** Vibrato swell-in, recomputed once per block. */
  updateSwell() {
    const P = this.P
    const t = (this.vibAge * this.iFs - P.vibDelay) / P.vibRamp
    const u = clamp(t, 0, 1)
    this.vibSwell = u * u * (3 - 2 * u)
  }
}

// ---------------------------------------------------------------------------
// Engine 1: the jet-drive waveguide.
// ---------------------------------------------------------------------------

export class JetWaveguide extends VoiceCore {
  constructor(fs, preset) {
    super(fs, preset)

    // The bore has to hold a full period of the lowest note plus interpolation
    // headroom: at MIDI 36 (65 Hz) that is about 740 samples at 48 kHz, so
    // 4096 is generous. The jet delay is a fraction of it.
    this.NB = 4096
    this.mB = this.NB - 1
    this.bore = new Float32Array(this.NB)
    this.wi = 0
    this.NJ = 1024
    this.mJ = this.NJ - 1
    this.jet = new Float32Array(this.NJ)
    this.ji = 0

    this.D = 400
    this.Dbase = 400
    this.DbaseGoal = 400
    this.Dj = 128

    this.lp = 0
    this.lpA = 0.125
    this.dcX = 0
    this.dcY = 0
    this.dcR = Math.exp((-TAU * 5) / fs)
    this.oX = 0
    this.oY = 0
    this.oR = 0.995
    this.radZ = 0

    this.svLp = 0
    this.svBp = 0
    this.svF = 0.31
    this.svQ = 1.43

    this.peak = 0
    this.faults = 0
  }

  reset() {
    this.bore.fill(0)
    this.jet.fill(0)
    this.lp = this.dcX = this.dcY = 0
    this.svLp = this.svBp = this.radZ = 0
    this.oX = this.oY = 0
    this.peak = 0
  }

  /**
   * Bore delay length for a wanted pitch.
   *
   * Naively this is just fs/f0, but the loop contains a lowpass, a DC blocker
   * and the jet's own delayed feedback, and each of those adds phase — i.e.
   * extra apparent length. Ignoring them makes the instrument play sharp, by
   * a little down low and by a lot up high where the period is only a few
   * dozen samples. So: solve for the delay that puts the round-trip phase at
   * exactly one period. The jet term depends on D itself, hence the damped
   * fixed-point iteration.
   */
  solveDelay(f0, pb) {
    const fs = this.fs
    const P = this.P
    const w = (TAU * f0) / fs
    const cw = Math.cos(w)
    const sw = Math.sin(w)

    const a = 1 - this.lpA
    const argLP = -Math.atan2(a * sw, 1 - a * cw)
    const R = this.dcR
    const argDC = Math.atan2(sw, 1 - cw) - Math.atan2(R * sw, 1 - R * cw)

    const rEff = P.jetRatio * (1 - 0.25 * (pb - 0.6))
    const A = P.jetGain * P.jetRefl * pb
    const period = fs / f0

    let D = period
    for (let i = 0; i < 8; i++) {
      const x = w * rEff * D
      const argB = Math.atan2(A * Math.sin(x), P.endRefl - A * Math.cos(x))
      const lag = -(argLP + argDC + argB) / w
      D = 0.5 * D + 0.5 * (period - lag)
      if (D < 6) {
        D = 6
        break
      }
    }
    return clamp(D, 6, this.NB - 8)
  }

  onNoteOn(slur) {
    this.DbaseGoal = this.solveDelay(this.f0, this.pTune || this.pSus)
    // Wide leaps sound better snapped: the click is covered by the chiff,
    // whereas gliding a big interval sounds like a slide whistle.
    if (!slur || Math.abs(this.Dbase - this.DbaseGoal) > this.Dbase * 0.25) {
      this.Dbase = this.D = this.DbaseGoal
    }
  }

  blockUpdate() {
    const P = this.P
    const fs = this.fs

    // Tuning and brightness follow a heavily smoothed copy of the pressure,
    // not the noisy per-sample one — otherwise the turbulence would frequency
    // modulate the tube.
    this.pTune += (this.p - this.pTune) * (1 - Math.exp(-128 / (0.05 * fs)))
    const pb = clamp(this.pTune, 0.05, 1.2)

    // The reflection filter corner is the harmonic-count control: how much of
    // each round trip survives, per frequency. Blowing harder opens it, which
    // is why a crescendo brightens without any separate brightness control.
    const fc = clamp(
      1400 * Math.pow(this.f0 / 220, 0.6) * (0.45 + 1.1 * pb) * (0.7 + 0.6 * P.brightness),
      400,
      0.42 * fs
    )
    this.lpA = 1 - Math.exp((-TAU * fc) / fs)

    this.DbaseGoal = this.solveDelay(this.f0, pb)
    this.Dj = clamp(P.jetRatio * (1 - 0.25 * (pb - 0.6)) * this.Dbase, 2, this.NJ - 4)

    // The air bandpass starts at the chiff's centre and glides down to the
    // steady-state breath colour as the chiff decays.
    const mix = P.chiffGain > 0 ? clamp(this.chiff / P.chiffGain, 0, 1) : 0
    const acf = P.airCenter + mix * (P.chiffCenter - P.airCenter)
    this.svF = 2 * Math.sin((Math.PI * clamp(acf, 200, 0.45 * fs)) / fs)
    this.svQ = 1 / P.airQ

    this.updateSwell()
  }

  render(out, off, n) {
    const P = this.P
    const b = this.bore
    const mB = this.mB
    const jt = this.jet
    const mJ = this.mJ
    const maxSlew = P.maxSlewD

    this.blockUpdate()

    for (let i = 0; i < n; i++) {
      this.stepEnv()
      const cents = this.stepMod()
      const Pb = this.stepPressure()

      // Delay length: slew-limit the base (so a pitch change is a glide, not a
      // discontinuity in the delay line) then add the fast modulation on top.
      let dd = this.DbaseGoal - this.Dbase
      if (dd > maxSlew) dd = maxSlew
      else if (dd < -maxSlew) dd = -maxSlew
      this.Dbase += dd
      this.D = this.Dbase * Math.pow(2, -cents / 1200)
      if (this.D < 6) this.D = 6
      else if (this.D > this.NB - 8) this.D = this.NB - 8

      // Read the bore with cubic Lagrange interpolation. Linear would work but
      // its lowpass droop varies with the fractional part, so vibrato would
      // modulate the brightness as well as the pitch.
      const rp = this.wi - this.D
      const ip = Math.floor(rp)
      const f = rp - ip
      const ym = b[(ip - 1) & mB]
      const y0 = b[ip & mB]
      const y1 = b[(ip + 1) & mB]
      const y2 = b[(ip + 2) & mB]
      const cm = (-f * (f - 1) * (f - 2)) / 6
      const c0 = ((f + 1) * (f - 1) * (f - 2)) / 2
      const c1 = (-(f + 1) * f * (f - 2)) / 2
      const c2 = ((f + 1) * f * (f - 1)) / 6
      const boreOut = cm * ym + c0 * y0 + c1 * y1 + c2 * y2

      // Reflection: a one-pole lowpass (the tube's frequency-dependent loss,
      // magnitude never above one, so it can only ever remove energy) and a
      // very low DC blocker to keep the jet centred.
      this.dn = -this.dn
      this.lp += this.lpA * (boreOut - this.lp) + this.dn
      const hp = this.lp - this.dcX + this.dcR * this.dcY
      this.dcX = this.lp
      this.dcY = hp
      const refl = hp

      // The jet: delayed by its transit time across the mouth hole, then
      // through the cubic. u^3 - u has slope -1 at the origin, so the loop
      // regenerates; it saturates beyond |u| = 1, and that saturation is the
      // only thing limiting the amplitude. No envelope, no compressor — the
      // nonlinearity is the limiter, exactly as in the real instrument.
      jt[this.ji] = refl
      const jrp = this.ji - this.Dj
      const jip = Math.floor(jrp)
      const jf = jrp - jip
      const ja = jt[jip & mJ]
      const jb2 = jt[(jip + 1) & mJ]
      const jetOut = ja + jf * (jb2 - ja)
      this.ji = (this.ji + 1) & mJ

      // The jet sits slightly to one side of the edge rather than dead centre.
      // Without that offset the nonlinearity is an odd function, an odd
      // function fed a sine can only produce odd harmonics, and the result is
      // a hollow clarinet rather than a flute. The offset is what puts the
      // second harmonic back. It costs some loop gain — the cubic's slope at
      // the operating point is 3*off^2 - 1 rather than -1 — which is why
      // jetGain is set a little higher than the bare stability analysis wants.
      const u = P.jetGain * P.jetRefl * jetOut + P.jetOffset * Pb
      let fj = u * (u * u - 1)
      if (fj > 1) fj = 1
      else if (fj < -1) fj = -1

      // Breath pressure is a *gain* on the jet drive, not an offset into the
      // cubic. That is the fix that makes the model speak reliably: with an
      // offset the small-signal loop gain sits at or below one and the tube
      // only ever mumbles.
      const drive = Pb * fj

      // Turbulence goes into the loop, so it comes back tube-coloured. This is
      // the single most important line for the low register.
      const bn = this.rand()
      const inNoise = this.nLp * Pb * P.loopNoise * 0.6 + bn * this.chiff * P.chiffIntoBore

      let x = P.endRefl * refl + drive + inNoise
      if (!(x > -4 && x < 4)) {
        // Should never happen; if it does, mute rather than emit a bang.
        this.reset()
        x = 0
        this.faults++
      }
      b[this.wi] = x
      this.wi = (this.wi + 1) & mB

      // The open end radiates like a differentiator.
      const rad = boreOut - 0.86 * this.radZ
      this.radZ = boreOut

      // Direct hiss at the lips, bypassing the tube. Turbulent noise grows as
      // roughly pressure^1.5 while the tone grows faster than that, so playing
      // softer automatically gets breathier — no rule needed.
      const nb = this.rand()
      this.svLp += this.svF * this.svBp
      const svHp = nb - this.svLp - this.svQ * this.svBp
      this.svBp += this.svF * svHp
      const pbs = Pb > 0 ? Pb * Math.sqrt(Pb) : 0
      // Scaled by outGain like the tone is. Without that the hiss enters the
      // mix roughly six times louder than intended relative to the tone, and
      // the instrument turns into a noise generator with a pitch hiding in it.
      const air = this.svBp * (P.airGain * pbs + this.chiff) * P.outGain

      let s = (P.outGain * (0.8 * rad + 0.2 * refl) + air) * this.gain
      const o = s - this.oX + this.oR * this.oY
      this.oX = s
      this.oY = o
      let v = o < -1.5 ? -1.5 : o > 1.5 ? 1.5 : o
      v = v - (v * v * v) / 6.75

      out[off + i] += v

      const av = v < 0 ? -v : v
      if (av > this.peak) this.peak = av
    }
  }
}

// ---------------------------------------------------------------------------
// Engine 2: a spectral flute.
//
// Additive partials plus pitch-locked noise. It cannot blow up, cannot fail to
// speak, and costs nothing to reason about — so it is both a safety net and a
// genuinely different colour. It shares the envelope, the vibrato and the same
// brightness law as the waveguide, so the two are interchangeable per note.
// ---------------------------------------------------------------------------

export class SpectralFlute extends VoiceCore {
  constructor(fs, preset) {
    super(fs, preset)
    this.NH = 12
    this.ph = new Float32Array(this.NH)
    this.rng = 0x1234567
    for (let k = 0; k < this.NH; k++) this.ph[k] = (this.rand() + 1) * 0.5
    this.r1 = [0, 0]
    this.r2 = [0, 0]
    this.r3 = [0, 0]
    this.svLp = 0
    this.svBp = 0
    this.svF = 0.31
    this.svQ = 1.43
    this.oX = 0
    this.oY = 0
    this.oR = 0.995
    this.lpA = 0.125
    this.peak = 0
  }

  reset() {
    this.r1 = [0, 0]
    this.r2 = [0, 0]
    this.r3 = [0, 0]
    this.svLp = this.svBp = 0
  }

  blockUpdate() {
    const P = this.P
    const fs = this.fs
    this.pTune += (this.p - this.pTune) * (1 - Math.exp(-128 / (0.05 * fs)))
    const pb = clamp(this.pTune, 0.05, 1.2)
    const fc = clamp(
      1400 * Math.pow(this.f0 / 220, 0.6) * (0.45 + 1.1 * pb) * (0.7 + 0.6 * P.brightness),
      400,
      0.42 * fs
    )
    this.lpA = 1 - Math.exp((-TAU * fc) / fs)
    const mix = P.chiffGain > 0 ? clamp(this.chiff / P.chiffGain, 0, 1) : 0
    const acf = P.airCenter + mix * (P.chiffCenter - P.airCenter)
    this.svF = 2 * Math.sin((Math.PI * clamp(acf, 200, 0.45 * fs)) / fs)
    this.svQ = 1 / P.airQ
    this.updateSwell()
  }

  render(out, off, n) {
    const P = this.P
    const fs = this.fs
    const iFs = this.iFs
    this.blockUpdate()
    const a = 1 - this.lpA

    // Partial amplitudes come from the same reflection-filter law the
    // waveguide uses, so both engines brighten identically with pressure.
    const amps = this._amps || (this._amps = new Float32Array(this.NH))
    const freqs = this._freqs || (this._freqs = new Float32Array(this.NH))
    let norm = 0
    let used = 0
    for (let k = 1; k <= this.NH; k++) {
      const fk = k * this.f0
      if (fk > 0.45 * fs) break
      const wk = (TAU * fk) / fs
      const ck = Math.cos(wk)
      const sk = Math.sin(wk)
      const H = (1 - a) / Math.hypot(1 - a * ck, a * sk)
      const amp = (H * H) / k
      amps[k - 1] = amp
      freqs[k - 1] = fk * iFs
      norm += amp
      used = k
    }
    if (norm <= 0) norm = 1

    const lowness = clamp((72 - this.midi) / 24, 0, 1)
    const g1 = lerp(0.15, 0.4, lowness)
    const g2 = lerp(0.06, 0.2, lowness)
    const g3 = lerp(0.02, 0.1, lowness)

    for (let i = 0; i < n; i++) {
      this.stepEnv()
      const cents = this.stepMod()
      const Pb = this.stepPressure()
      const bend = Math.pow(2, cents / 1200)

      let sum = 0
      for (let k = 0; k < used; k++) {
        this.ph[k] += freqs[k] * bend
        if (this.ph[k] >= 1) this.ph[k] -= 1
        sum += amps[k] * Math.sin(TAU * this.ph[k])
      }
      sum /= norm

      // Breath locked to the tube's modes. Without these the noise is just
      // tape hiss; with them it reads unmistakably as a flute, especially low.
      const nz = this.rand()
      const f0b = this.f0 * bend
      const reso = (st, fr, q, g) => {
        const wq = (TAU * fr) / fs
        const rr = 1 - wq / (2 * q)
        const y = wq * nz + 2 * rr * Math.cos(wq) * st[0] - rr * rr * st[1]
        st[1] = st[0]
        st[0] = y
        return g * y
      }
      const airTone =
        reso(this.r1, f0b, 25, g1) + reso(this.r2, 2 * f0b, 22, g2) + reso(this.r3, 3 * f0b, 20, g3)

      this.svLp += this.svF * this.svBp
      this.svBp += this.svF * (nz - this.svLp - this.svQ * this.svBp)

      const pbs = Pb > 0 ? Pb * Math.sqrt(Pb) : 0
      let s =
        (P.outGain * 2.2 * sum * Pb * Pb + (airTone * 0.35 + this.svBp) * (P.airGain * pbs + this.chiff)) *
        this.gain

      const o = s - this.oX + this.oR * this.oY
      this.oX = s
      this.oY = o
      let v = clamp(o, -1.5, 1.5)
      v = v - (v * v * v) / 6.75
      out[off + i] += v
      const av = v < 0 ? -v : v
      if (av > this.peak) this.peak = av
    }
  }
}

export const ENGINES = { waveguide: JetWaveguide, spectral: SpectralFlute }
`,zt=`// The AudioWorklet half of the voice.
//
// This file is never imported by the app directly. It is concatenated after
// flute-dsp.js and handed to \`audioWorklet.addModule\` as a Blob URL, so
// everything flute-dsp.js declares is already in scope here.
//
// Two ways in:
//
//   * \`processorOptions.score\` — the whole performance, up front. Used for
//     offline rendering, where posting messages to a port that is being
//     drained faster than real time is a race you cannot win.
//   * \`port.postMessage\` — one event at a time, stamped with the frame it
//     should happen on. Used for live play.
//
// Either way events are scheduled by SAMPLE, never by wall clock, which is
// what makes an exported WAV identical to what was heard.

class FluteProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super()
    const o = options.processorOptions || {}
    this.polyphony = o.polyphony || 4
    this.engine = o.engine === 'spectral' ? SpectralFlute : JetWaveguide
    this.tone = o.tone || {}
    this.voices = []
    for (let i = 0; i < this.polyphony; i++) {
      this.voices.push(new this.engine(sampleRate, presetFor(69, this.tone)))
    }
    this.owner = new Array(this.polyphony).fill(-1)
    this.startedAt = new Array(this.polyphony).fill(-1)

    this.queue = []
    this.frame = 0
    this.done = false

    if (o.score) this.load(o.score)

    this.port.onmessage = (e) => {
      const m = e.data
      if (m.type === 'schedule') this.load(m.events)
      else if (m.type === 'tone') this.tone = m.tone
      else if (m.type === 'cancelAfter') {
        // Keep anything already sounding — including its note-off, or the
        // voice would hang — and drop the rest of the plan.
        this.queue = this.queue.filter((ev) => ev.pending || ev.on <= m.frame)
      } else if (m.type === 'panic') {
        this.queue.length = 0
        for (const v of this.voices) {
          v.noteOff()
        }
      }
    }
  }

  load(events) {
    for (const ev of events) this.queue.push(ev)
    this.queue.sort((a, b) => a.on - b.on)
  }

  /**
   * Pick a voice for a note.
   *
   * A slurred note continues the most recently started voice — that is what
   * makes a trill a trill rather than a row of separate attacks. Otherwise
   * take a free voice, or steal the one that has been sounding longest, which
   * is the one least likely to be missed.
   */
  allocate(slur) {
    let newest = -1
    for (let i = 0; i < this.voices.length; i++) {
      if (!this.voices[i].isActive()) continue
      if (newest < 0 || this.startedAt[i] > this.startedAt[newest]) newest = i
    }
    if (slur && newest >= 0) return newest

    for (let i = 0; i < this.voices.length; i++) {
      if (!this.voices[i].isActive()) return i
    }
    let oldest = 0
    for (let i = 1; i < this.voices.length; i++) {
      if (this.startedAt[i] < this.startedAt[oldest]) oldest = i
    }
    return oldest
  }

  /** Fire every event whose moment has arrived. */
  fireDue(now) {
    let again = true
    while (again) {
      again = false
      for (const ev of this.queue) {
        if (ev.done) continue
        if (!ev.pending) {
          if (ev.on > now) continue
          const vi = this.allocate(ev.slur)
          const v = this.voices[vi]
          v.setPreset(presetFor(ev.midi, this.tone))
          v.noteOn(ev)
          this.owner[vi] = ev.id
          this.startedAt[vi] = ev.on
          ev.voice = vi
          ev.pending = true
          again = true
        } else if (ev.off <= now) {
          // Do not release a voice that a later note has already taken over.
          if (this.owner[ev.voice] === ev.id) this.voices[ev.voice].noteOff()
          ev.done = true
          again = true
        }
      }
    }
    if (this.queue.length > 64) this.queue = this.queue.filter((ev) => !ev.done)
    else while (this.queue.length && this.queue[0].done) this.queue.shift()
  }

  process(_inputs, outputs) {
    const out = outputs[0][0]
    if (!out) return true
    out.fill(0)

    const n = out.length
    let cursor = 0

    // Walk the quantum in sub-blocks that end on event boundaries, so a note
    // starts on the exact sample it was scheduled for rather than being
    // rounded to the nearest 128.
    while (cursor < n) {
      const now = this.frame + cursor
      this.fireDue(now)

      let next = this.frame + n
      for (const ev of this.queue) {
        if (ev.done) continue
        const at = ev.pending ? ev.off : ev.on
        if (at > now && at < next) next = at
      }

      const len = next - now
      for (const v of this.voices) {
        if (v.isActive()) v.render(out, cursor, len)
      }
      cursor += len
    }

    this.frame += n
    return true
  }
}

registerProcessor('flute-voice', FluteProcessor)
`;function z(i){let t=i>>>0;const e=()=>{t=t+1831565813>>>0;let n=t;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296};return e.range=(n,s)=>n+e()*(s-n),e.int=(n,s)=>Math.floor(n+e()*(s-n+1)),e.chance=n=>e()<n,e.pick=n=>n[Math.floor(e()*n.length)],e.weighted=(n,s)=>{let a=0;for(const o of s)a+=Math.max(0,o);if(a<=0)return n[n.length-1];let r=e()*a;for(let o=0;o<n.length;o++)if(r-=Math.max(0,s[o]),r<=0)return n[o];return n[n.length-1]},e.normal=()=>(e()+e()+e()-1.5)*1.1547,e.gauss=(n,s)=>n+Math.max(-3,Math.min(3,e.normal()))*s,e}function ht(){return(Math.floor(Math.random()*4294967295)^Date.now())>>>0}let Z=null;function yt(){if(!Z){const i=Jt.replace(/^export\s+/gm,"")+`
`+zt.replace(/^export\s+/gm,"");Z=URL.createObjectURL(new Blob([i],{type:"text/javascript"}))}return Z}function jt(i,t,e=12345){const n=i.sampleRate,s=Math.max(1,Math.floor(t*n)),a=i.createBuffer(2,s,n),r=z(e);for(let o=0;o<2;o++){const h=a.getChannelData(o);let l=0;for(let d=0;d<s;d++){const f=d/s,p=r()*2-1;l+=.34*(p-l);const c=Math.pow(1-f,2.6),g=Math.min(1,d/(.012*n));h[d]=l*c*g}}return a}const B=(i,t,e)=>i<t?t:i>e?e:i,ot=i=>.35+4.4*Math.pow(B(i,0,1),1.6);function wt(i,{space:t=.55,gain:e=.9,seed:n=12345,analyser:s=!1}={}){const a=i.createGain();a.gain.value=18;const r=i.createGain(),o=i.createGain(),h=.05+.38*B(t,0,1);r.gain.value=1-.45*h,o.gain.value=h;const l=i.createConvolver();l.normalize=!0,l.buffer=jt(i,ot(t),n);const d=i.createBiquadFilter();d.type="highshelf",d.frequency.value=4200,d.gain.value=-4;const f=i.createGain();f.gain.value=e;const p=i.createDynamicsCompressor();p.threshold.value=-6,p.knee.value=3,p.ratio.value=12,p.attack.value=.003,p.release.value=.2,a.connect(d),d.connect(r),d.connect(l),l.connect(o),r.connect(f),o.connect(f),f.connect(p);let c=null;return s&&(c=i.createAnalyser(),c.fftSize=2048,c.smoothingTimeConstant=.75,p.connect(c)),p.connect(i.destination),{input:a,master:f,dry:r,wet:o,convolver:l,analyser:c}}function kt(i,t,e=0,n=0){return i.map((s,a)=>({id:n+a,on:Math.round((e+s.t)*t),off:Math.round((e+s.t+s.d)*t),midi:s.midi,velocity:s.vel,slur:!!s.slur,bendCents:s.bendCents||0,bendTime:s.portamento||.12,flutter:s.flutter||0,seed:(2654435769^Math.imul(n+a+1,2654435761))>>>0}))}class ct{constructor(){this.ctx=null,this.node=null,this.graph=null,this.ready=!1,this.usingWorklet=!1,this.nextId=0,this.tone={breathiness:.4,vibrato:.5,brightness:.5},this.space=.55,this.seed=12345}async init({space:t=.55,gain:e=.9,seed:n=12345}={}){if(this.ready)return;const s=window.AudioContext||window.webkitAudioContext;this.ctx=new s({latencyHint:"playback"}),this.space=t,this.seed=n,this.graph=wt(this.ctx,{space:t,gain:e,seed:n,analyser:!0});try{await this.ctx.audioWorklet.addModule(yt()),this.node=new AudioWorkletNode(this.ctx,"flute-voice",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[1],processorOptions:{polyphony:4,tone:this.tone}}),this.node.connect(this.graph.input),this.usingWorklet=!0}catch(a){console.warn("AudioWorklet unavailable, using the node-graph voice:",a),this.fallback=new Yt(this.ctx,this.graph.input),this.usingWorklet=!1}this.ready=!0}get analyser(){var t;return((t=this.graph)==null?void 0:t.analyser)??null}get currentTime(){return this.ctx?this.ctx.currentTime:0}async resume(){this.ctx&&this.ctx.state!=="running"&&await this.ctx.resume()}async suspend(){this.ctx&&this.ctx.state==="running"&&await this.ctx.suspend()}setTone(t){this.tone={...this.tone,...t},this.node&&this.node.port.postMessage({type:"tone",tone:this.tone}),this.fallback&&(this.fallback.tone=this.tone)}setSpace(t){if(!this.graph||Math.abs(t-this.space)<.01)return;this.space=t,this.graph.convolver.buffer=jt(this.ctx,ot(t),this.seed);const e=.05+.38*B(t,0,1);this.graph.wet.gain.value=e,this.graph.dry.gain.value=1-.45*e}setGain(t){this.graph&&(this.graph.master.gain.value=t)}schedule(t,e){if(!t.length)return;const n=this.nextId;if(this.nextId+=t.length,this.usingWorklet){const s=kt(t,this.ctx.sampleRate,e,n);this.node.port.postMessage({type:"schedule",events:s})}else this.fallback.schedule(t,e)}cancelAfter(t){this.usingWorklet&&this.node&&this.node.port.postMessage({type:"cancelAfter",frame:Math.round(t*this.ctx.sampleRate)}),this.fallback&&this.fallback.cancelAfter(t)}panic(){this.usingWorklet&&this.node&&this.node.port.postMessage({type:"panic"}),this.fallback&&this.fallback.panic()}static async renderOffline(t,{space:e=.55,tone:n={},seed:s=12345,tail:a=null,sampleRate:r=48e3}={}){const o=t.reduce((g,b)=>Math.max(g,b.t+b.d),0),h=a??ot(e)+.6,l=Math.max(.5,o+h),d=Math.ceil(l*r),f=new OfflineAudioContext(2,d,r),p=wt(f,{space:e,gain:.9,seed:s});return await f.audioWorklet.addModule(yt()),new AudioWorkletNode(f,"flute-voice",{numberOfInputs:0,numberOfOutputs:1,outputChannelCount:[1],processorOptions:{polyphony:4,tone:n,score:kt(t,r,0,0)}}).connect(p.input),f.startRendering()}}class Yt{constructor(t,e){this.ctx=t,this.dest=e,this.tone={breathiness:.4,vibrato:.5},this.active=[];const n=Math.floor(t.sampleRate*2);this.noise=t.createBuffer(1,n,t.sampleRate);const s=this.noise.getChannelData(0),a=z(4242);for(let h=0;h<n;h++)s[h]=a()*2-1;const r=new Float32Array([0,1,.18,.08,.03,.015,.008]),o=new Float32Array(r.length);this.wave=t.createPeriodicWave(r,o,{disableNormalization:!1})}schedule(t,e){for(const n of t)this.play(n,e+n.t)}play(t,e){const n=this.ctx,s=Math.max(e,n.currentTime+.005),a=Math.max(.05,t.d),r=440*Math.pow(2,(t.midi-69)/12),o=this.tone.breathiness??.4,h=this.tone.vibrato??.5,l=n.createOscillator();l.setPeriodicWave(this.wave),l.frequency.value=r,t.bendCents&&(l.frequency.setValueAtTime(r*Math.pow(2,t.bendCents/1200),s),l.frequency.exponentialRampToValueAtTime(r,s+Math.max(.03,t.portamento||.12)));const d=n.createBiquadFilter();d.type="lowpass",d.Q.value=.6;const f=B(r*(3+4*t.vel),700,9e3);d.frequency.setValueAtTime(f*.55,s),d.frequency.linearRampToValueAtTime(f,s+.08);const p=n.createBufferSource();p.buffer=this.noise,p.loop=!0;const c=n.createBiquadFilter();c.type="bandpass",c.frequency.value=B(r*2.2,400,7e3),c.Q.value=.8;const g=n.createGain(),b=n.createGain(),v=.22*(.35+.65*t.vel),k=B(.06-45e-5*(t.midi-48),.008,.09),x=B(.22-.0016*(t.midi-48),.05,.3);b.gain.setValueAtTime(1e-4,s),b.gain.exponentialRampToValueAtTime(v*1.1,s+k),b.gain.exponentialRampToValueAtTime(v,s+k+.09),b.gain.setValueAtTime(v,Math.max(s+k+.09,s+a)),b.gain.exponentialRampToValueAtTime(1e-4,s+a+x);const I=.5*(.4+o);g.gain.setValueAtTime(1e-4,s),g.gain.exponentialRampToValueAtTime(I*v,s+.012),g.gain.exponentialRampToValueAtTime(Math.max(2e-4,.35*o*v),s+.14),g.gain.setValueAtTime(Math.max(2e-4,.35*o*v),Math.max(s+.15,s+a)),g.gain.exponentialRampToValueAtTime(1e-4,s+a+x);const L=n.createOscillator();L.frequency.value=5.2;const M=n.createGain();M.gain.setValueAtTime(0,s),M.gain.linearRampToValueAtTime(r*.006*h*2,s+Math.min(a,.6)),L.connect(M),M.connect(l.frequency),l.connect(d),d.connect(b),p.connect(c),c.connect(g),g.connect(b),b.connect(this.dest);const P=s+a+x+.05;l.start(s),l.stop(P),L.start(s),L.stop(P),p.start(s),p.stop(P);const A={osc:l,lfo:L,air:p,g:b,stop:P,t0:s};this.active.push(A),l.onended=()=>{const C=this.active.indexOf(A);C>=0&&this.active.splice(C,1);try{b.disconnect()}catch{}}}cancelAfter(t){for(const e of this.active.slice())if(!(e.t0<=t))try{e.osc.stop(t),e.lfo.stop(t),e.air.stop(t)}catch{}}panic(){const t=this.ctx.currentTime;for(const e of this.active)try{e.g.gain.cancelScheduledValues(t),e.g.gain.setTargetAtTime(1e-4,t,.05),e.osc.stop(t+.4),e.lfo.stop(t+.4),e.air.stop(t+.4)}catch{}}}const Y=[{id:"minor-pentatonic",name:"Minor Pentatonic",mood:"plain, safe, folk",steps:[0,3,5,7,10]},{id:"major-pentatonic",name:"Major Pentatonic",mood:"open, pastoral",steps:[0,2,4,7,9]},{id:"hirajoshi",name:"Hirajoshi",mood:"Japanese, shakuhachi-adjacent",steps:[0,2,3,7,8]},{id:"in-sen",name:"In Sen",mood:"austere, hollow",steps:[0,1,5,7,10]},{id:"kumoi",name:"Kumoi",mood:"bittersweet, floating",steps:[0,2,3,7,9]},{id:"dorian",name:"Dorian",mood:"wistful but not sad",steps:[0,2,3,5,7,9,10]},{id:"aeolian",name:"Aeolian",mood:"plainly minor",steps:[0,2,3,5,7,8,10]},{id:"lydian",name:"Lydian",mood:"bright, weightless",steps:[0,2,4,6,7,9,11]},{id:"mixolydian",name:"Mixolydian",mood:"warm, modal",steps:[0,2,4,5,7,9,10]},{id:"phrygian",name:"Phrygian",mood:"dark, andalusian",steps:[0,1,3,5,7,8,10]},{id:"harmonic-minor",name:"Harmonic Minor",mood:"exotic tension",steps:[0,2,3,5,7,8,11]},{id:"whole-tone",name:"Whole Tone",mood:"dreamlike, ungrounded",steps:[0,2,4,6,8,10]},{id:"chromatic",name:"Chromatic",mood:"no gravity at all",steps:[0,1,2,3,4,5,6,7,8,9,10,11]}],Mt=Object.fromEntries(Y.map(i=>[i.id,i])),lt=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];function xt(i){const t=Math.round(i);return`${lt[(t%12+12)%12]}${Math.floor(t/12)-1}`}const Qt=[{id:"drone",name:"Drone",lo:48,hi:62},{id:"low",name:"Low",lo:55,hi:72},{id:"mid",name:"Middle",lo:62,hi:84},{id:"high",name:"High",lo:74,hi:96},{id:"full",name:"Full",lo:52,hi:92}],S=(i,t,e)=>i<t?t:i>e?e:i,D=i=>S(i,0,1),Pt=i=>1/(1+Math.exp(-i)),At=["arch","sigh","question","static","cascade"],Q={registerLow:62,registerHigh:86,density:.45,breathiness:.32,motion:.4,pace:.4,phrase:.42,ornament:.5,vibrato:.5,space:.55,scale:"dorian",root:2,scaleAuto:!0,rootAuto:!0,automation:!0,mode:"endless",burstPhrases:1},Ct=[.25,.5,.75,1,1.5,2,3,5],tt={base:[6,14,8,26,16,14,10,6],cascade:[24,30,10,20,8,4,2,2],static:[0,2,4,10,16,24,26,18]};class ut{constructor(t={},e=1){this.settings={...Q,...t},this.seed=e>>>0,this.rng=z(this.seed),this.reset()}reset(){const t=this.settings;this.phraseIndex=0,this.t=0,this.root=t.root,this.scaleId=t.scale,this.lastDegree=null,this.lastArchetype=null,this.repeatRun=0,this.rawClamps=0,this.drift={center:0,density:0,motion:0,pace:0,dyn:0,vib:0};const e=z(this.seed^1542469173);this.macroPhase=[e()*Math.PI*2,e()*Math.PI*2,e()*Math.PI*2],this.nextRootJump=200+e()*240,this.nextScaleJump=150+e()*180}get scale(){return Mt[this.scaleId]??Mt.dorian}midiOf(t){const e=this.scale.steps,n=e.length,s=Math.floor(t/n),a=(t%n+n)%n;return this.root+12*s+e[a]}degreeNear(t){const n=this.scale.steps.length;let s=0,a=1/0;const r=Math.floor((t-this.root)/12);for(let o=r-1;o<=r+1;o++)for(let h=0;h<n;h++){const l=o*n+h,d=Math.abs(this.midiOf(l)-t);d<a&&(a=d,s=l)}return s}macro(t){const[e,n,s]=this.macroPhase;return .12*Math.sin(2*Math.PI*t/233+e)+.09*Math.sin(2*Math.PI*t/389+n)+.06*Math.sin(2*Math.PI*t/631+s)}ou(t,e,n,s,a){const r=1-Math.exp(-e/n),o=s*Math.sqrt(1-Math.exp(-2*e/n));let h=this.drift[t]+(0-this.drift[t])*r+o*this.rng.gauss(0,1);this.drift[t]=S(h,-a,a)}effective(){const t=this.settings,e=t.automation,n=e?this.drift:{center:0,density:0,motion:0,pace:0,dyn:0,vib:0},s=e?this.macro(this.t):0,a=Math.min(t.registerLow,t.registerHigh),r=Math.max(t.registerLow,t.registerHigh),o=(a+r)/2,h=Math.max(2,(r-a)/2);return{lo:a,hi:r,density:D(t.density+n.density+.6*s),motion:D(t.motion+n.motion),pace:D(t.pace+n.pace),vibrato:D(t.vibrato+n.vib),dyn:n.dyn,macro:s,center:S(o+n.center,a+Math.min(2,h),r-Math.min(2,h))}}pickContour(t){const e=D((64-t.center)/16),n={arch:.28+.1*t.motion,sigh:.24-.05*t.motion+.1*(1-t.pace),question:.14+.06*t.motion,static:.1+.45*(1-t.motion)+.3*e,cascade:.08+.5*t.motion*t.pace};return this.lastArchetype&&(n[this.lastArchetype]*=this.repeatRun>=2?0:.45),this.rng.weighted(At,At.map(s=>n[s]))}shape(t,e){const n=this.rng;switch(t){case"arch":{const s=3+4*n();return a=>s*Math.sin(Math.PI*a)}case"sigh":{const s=3+5*n();return a=>-s*Math.pow(a,.7)}case"question":{const s=2+3*n();return a=>s*Math.pow(a,1.4)}case"cascade":{const s=6+8*n();return a=>-s*a}default:return s=>Math.round(1.2*Math.sin(3*Math.PI*s))}}noteCount(t,e){const n={arch:[5,11],sigh:[3,8],question:[3,6],static:[2,5],cascade:[7,20]},[s,a]=n[t];let r=s+Math.floor(Math.pow(this.rng(),1.15)*(a-s+1));return r=Math.round(r*(.25+1.15*e.pace)),S(r,2,24)}nextPhrase(){const t=this.settings,e=this.rng;!t.rootAuto&&t.root!==this.root&&(this.root=t.root,this.lastDegree=null),!t.scaleAuto&&t.scale!==this.scaleId&&(this.scaleId=t.scale,this.lastDegree=null);const n=this.effective(),s=this.pickContour(n);this.repeatRun=s===this.lastArchetype?this.repeatRun+1:0,this.lastArchetype=s;const a=this.noteCount(s,n),r=this.shape(s,a);let o=this.degreeNear(n.lo);this.midiOf(o)<n.lo&&(o+=1);let h=this.degreeNear(n.hi);this.midiOf(h)>n.hi&&(h-=1),h<o&&(h=o);const l=S(this.degreeNear(n.center),o,h);let d=this.lastDegree??l;d=S(d,o,h);const f=(2.5+24*Math.pow(D(t.phrase??.42),1.8))*Math.exp(e.gauss(0,.18))*(1+.35*(1-t.breathiness)),p=2.6*Math.pow(2,-3.8*n.pace),c=[];let g=0,b=0,v=d,k=0,x=0;for(let C=0;C<a;C++){const T=a>1?C/(a-1):0,X=C===a-1;if(C>0){v=this.walk(v,d+r(T),l,o,h,n,k);const V=v-(c.length?this.degreeOf(c[c.length-1]):v);k=V,x=V===0?x+1:0}X&&c.length>1&&(v=this.cadence(s,v,l,o,h,n));const W=S(this.midiOf(v),36,96),_t=this.pickRhythm(s,T,X),Vt=1+e.gauss(0,.06)*(1-.5*n.pace);let j=p*_t*Vt;const _=this.ornament(s,T,X,n,W,k,x,j),bt=this.airCost(j,W,t.breathiness,_);if(g+bt>f&&c.length>=1){if(g>.7*f&&c.length>=2){const V=Math.max(.18,f-g);j=Math.min(j,V/(.9+.6*t.breathiness)),_.fall=!0,c.push(this.makeNote(b,j,W,s,T,C,n,_,v)),b+=j,g=f}break}c.push(this.makeNote(b,j,W,s,T,C,n,_,v)),g+=bt;const vt=e.chance(.35+.4*n.motion)?.025+.09*e():0;vt>0&&(c[c.length-1].duration=Math.max(.06,j-vt),c[c.length-1].expr.tongue="hard"),b+=j}c.length===0&&(c.push(this.makeNote(0,p,S(this.midiOf(l),36,96),s,0,0,n,{tongue:"soft"},l)),b=p),this.lastDegree=this.degreeOf(c[c.length-1]);const I=this.expand(c,n.lo,n.hi);let M=.55+.9*(g/f)+.4*e()+16*Math.pow(1-n.density,1.8)*e.range(.6,1.6);t.mode==="endless"&&e.chance(.02)&&(M+=e.range(12,40));const P=b,A=P+M;return t.automation&&(this.ou("center",A,95,3.5,Math.max(3,(n.hi-n.lo)/2-3)),this.ou("density",A,140,.18,.35),this.ou("motion",A,110,.15,.3),this.ou("pace",A,180,.1,.25),this.ou("dyn",A,75,.08,.2),this.ou("vib",A,130,.12,.25),this.maybeModulate()),this.phraseIndex++,this.t+=A,{notes:I,duration:P,restAfter:M,contour:s,info:{root:this.root,scale:this.scaleId,center:n.center,density:n.density,phraseIndex:this.phraseIndex}}}degreeOf(t){return t._degree}expand(t,e=36,n=96){const s=[],a=(o,h)=>{const l=this.degreeNear(o),d=this.midiOf(l+h);if(d<e||d>n){const f=this.midiOf(l-h);return f>=e&&f<=n?f:S(o,e,n)}return S(d,36,96)};for(const o of t){const h=o.expr,l={midi:o.midi,velocity:o.velocity,tongue:h.tongue,bendCents:h.bendCents??0,detuneCents:h.detuneCents??0,portamento:h.portamento??0,flutter:h.flutter??0,fall:!!h.fall};let d=o.time,f=o.duration;if(h.grace&&f>.14){const p=Math.min(.085,f*.3);s.push({...l,time:d,duration:p,midi:a(o.midi,h.grace),velocity:o.velocity*.72}),d+=p,f-=p,l.slur=!0}if(h.trill&&f>.3&&f<2.5){const p=1/h.trill.rate,c=a(o.midi,1),g=12;let b=0;for(;f>.001&&b<g;){const v=b===g-1?f:Math.min(p/2,f);s.push({...l,time:d,duration:v,midi:b%2===0?o.midi:c,velocity:o.velocity*(b%2===0?1:.9),slur:b>0||l.slur}),d+=v,f-=v,b++}continue}if(h.mordent&&f>.25){const p=f*.5,c=Math.min(.1,f*.2);s.push({...l,time:d,duration:p}),s.push({...l,time:d+p,duration:c,midi:a(o.midi,h.mordent),slur:!0,velocity:o.velocity*.88}),s.push({...l,time:d+p+c,duration:f-p-c,slur:!0});continue}if(h.overblow&&f>.3&&o.midi+12<=96){const p=f*.45;s.push({...l,time:d,duration:p}),s.push({...l,time:d+p,duration:f-p,midi:o.midi+12,slur:!0,velocity:o.velocity*.95});continue}s.push({...l,time:d,duration:f})}const r=s.filter(o=>o.duration>=.02);return r.sort((o,h)=>o.time-h.time),r.length?r:s.slice(0,1).map(o=>({...o,duration:Math.max(.08,o.duration)}))}makeNote(t,e,n,s,a,r,o,h,l){this.settings;let d;switch(s){case"arch":d=.34+.34*Math.pow(Math.sin(Math.PI*a),.8);break;case"sigh":d=.68-.3*a;break;case"question":d=.4+.22*a;break;case"cascade":d=.62-.18*a+(r%3===0?.1:0);break;default:d=.45+.06*Math.sin(3*Math.PI*a)}return d*=.85+.3*D(.5+o.dyn+o.macro),d+=this.rng.gauss(0,.05),d=S(d,.12,.98),{time:t,duration:e,midi:n,velocity:d,expr:{tongue:"legato",...h},_degree:l}}walk(t,e,n,s,a,r,o){const h=this.rng,l=[0,1,2,3,4],d=[.1*(1-r.motion),.55-.15*r.motion,.22,.08+.1*r.motion,.05+.2*r.motion];let f=h.weighted(l,d);if(f===4&&(f=h.int(4,6)),Math.abs(o)>=4){f=Math.min(f,2);const v=o>0?-1:1;if(h.chance(.75))return this.constrain(t+v*f,n,s,a)}const p=e-t,c=.95-.55*r.motion,g=.75*Pt(1.1*p)+.25*Pt(-c*(t-n)),b=h.chance(g)?1:-1;return this.constrain(t+b*f,n,s,a)}constrain(t,e,n,s){const a=this.scale.steps.length;if(t>s){if(t-a>=n&&t-a<=s)return t-a;const r=2*e-t;return r>=n&&r<=s?r:(this.rawClamps++,this.rawClamps>1?(this.rawClamps=0,e):s)}if(t<n){if(t+a>=n&&t+a<=s)return t+a;const r=2*e-t;return r>=n&&r<=s?r:(this.rawClamps++,this.rawClamps>1?(this.rawClamps=0,e):n)}return this.rawClamps=0,t}cadence(t,e,n,s,a,r){const o=this.rng,h=this.scale.steps.length;if(!o.chance(.55+.3*(1-r.motion)))return e;const l=t==="question"?[1,2,5]:[0,4],d=o.pick(l)%h,f=Math.round((e-d)/h);return this.constrain(f*h+d,n,s,a)}pickRhythm(t,e,n){if(n)return this.rng.weighted(t==="static"?[3,5,8]:[2,3,5],[40,35,25]);let s=tt[t]??tt.base;return t==="sigh"&&(s=tt.base.map((a,r)=>Ct[r]>=2?a*(1+1.5*e):a)),this.rng.weighted(Ct,s)}airCost(t,e,n,s){const a=1+.55*Math.max(0,(56-e)/12)+.25*Math.max(0,(e-84)/12);let r=t*(.9+.6*n)*a;return s.trill&&(r+=.15*t),s.flutter&&(r+=.35*t),s.overblow&&(r+=.2*t),r}ornament(t,e,n,s,a,r,o,h){const l=this.rng,d=this.settings,f=2*D(d.ornament??.5),p={};o>=1&&(p.tongue="hard",p.detuneCents=l.range(-8,8));const c=(.1+.3*s.motion)*f,g=(.04+.16*s.motion)*f,b=(.05+.15*s.motion)*f,v=(.18+.2*(1-s.motion))*f,k=(.03+.14*d.breathiness)*f,x=(.04+.08*s.motion)*f;h>.5&&h<2.5&&l.chance(g)?p.trill={rate:5+6*s.motion+3*l()}:h>.22&&l.chance(b)&&(p.mordent=l.chance(.5)?1:-1),h<1.2&&l.chance(c)&&(p.grace=l.chance(.65)?-1:1),l.chance(v)&&Math.abs(r)<=3&&r!==0&&(p.portamento=S(.05+.1*l(),.02,.25)),h>.7&&l.chance(k)&&(p.flutter=22+8*l()),l.chance(x)&&a+12<=Math.min(96,s.hi)&&(p.overblow=!0);const I=D(.1+.35*D((64-a)/16))*f;return!n&&l.chance(I)&&(p.bendCents=-l.range(15,60)),n&&l.chance(.12*f)&&(p.fallOff=!0),p}maybeModulate(){const t=this.settings,e=this.rng;if(t.rootAuto&&this.t>this.nextRootJump&&(this.root=(this.root+e.weighted([5,7,2,10,3,9],[30,30,12,12,8,8]))%12,this.nextRootJump=this.t+e.range(200,440),this.lastDegree=null),t.scaleAuto&&this.t>this.nextScaleJump){const n=new Set(this.scale.steps),s=Y.filter(a=>{if(a.id===this.scaleId||a.id==="chromatic")return!1;let r=0;for(const o of a.steps)n.has(o)&&r++;return r>=3});s.length&&(this.scaleId=e.pick(s).id),this.nextScaleJump=this.t+e.range(150,330)}}}const Et=[{id:"drone",name:"Drone Flute",blurb:"Low, bassy and sustained — two or three very long notes, then a long silence.",settings:{registerLow:43,registerHigh:58,density:.3,breathiness:.42,motion:.1,pace:.23,phrase:.89,ornament:.55,vibrato:.26,space:.85,scale:"minor-pentatonic",root:9,scaleAuto:!1,rootAuto:!0,automation:!0}},{id:"ambient",name:"Long Grass",blurb:"Endless background music. Everything drifts, so it never settles into a pattern.",settings:{registerLow:62,registerHigh:86,density:.35,breathiness:.3,motion:.3,pace:.41,phrase:.42,ornament:.5,vibrato:.45,space:.7,scale:"dorian",root:2,scaleAuto:!0,rootAuto:!0,automation:!0}},{id:"smatterings",name:"Smatterings",blurb:"Quick high flurries. Press Puff for a single one, Breathe to keep them coming.",settings:{registerLow:72,registerHigh:93,density:.85,breathiness:.22,motion:.85,pace:1,phrase:.25,ornament:.65,vibrato:.22,space:.35,scale:"major-pentatonic",root:7,scaleAuto:!1,rootAuto:!1,automation:!1}},{id:"bamboo",name:"Bamboo Rain",blurb:"Short gestures with wide gaps — a shakuhachi practising in another room.",settings:{registerLow:67,registerHigh:88,density:.55,breathiness:.4,motion:.62,pace:.57,phrase:.34,ornament:.6,vibrato:.35,space:.55,scale:"hirajoshi",root:4,scaleAuto:!0,rootAuto:!0,automation:!0}},{id:"cathedral",name:"Cathedral Low",blurb:"The drone's louder sibling: same low band, denser, built on slow rising arches.",settings:{registerLow:45,registerHigh:64,density:.45,breathiness:.35,motion:.28,pace:.29,phrase:.73,ornament:.5,vibrato:.4,space:.9,scale:"aeolian",root:0,scaleAuto:!0,rootAuto:!0,automation:!0}}],Ot=Object.fromEntries(Et.map(i=>[i.id,i])),Tt=2.5,Kt=120;class Xt{constructor(t){this.engine=t,this.improviser=null,this.timer=null,this.playing=!1,this.startedAt=0,this.cursor=0,this.score=[],this.phrasesLeft=1/0,this.onPhrase=null,this.onStop=null,this.playbackNotes=null,this.playbackIndex=0}get elapsed(){return this.playing?this.engine.currentTime-this.startedAt:0}get scoreDuration(){return this.score.reduce((t,e)=>Math.max(t,e.t+e.d),0)}start(t,e,{record:n=!0}={}){this.stop({silent:!0}),this.improviser=new ut(t,e),this.settings=t,this.seed=e,n&&(this.score=[]),this.playbackNotes=null,this.phrasesLeft=t.mode==="burst"?t.burstPhrases||1:1/0,this.beginClock()}play(t){this.stop({silent:!0}),this.improviser=null,this.playbackNotes=t.slice().sort((e,n)=>e.t-n.t),this.playbackIndex=0,this.score=t.slice(),this.beginClock()}beginClock(){this.playing=!0,this.startedAt=this.engine.currentTime+.15,this.cursor=0,this.tick(),this.timer=setInterval(()=>this.tick(),Kt)}tick(){if(!this.playing)return;const t=this.engine.currentTime-this.startedAt;if(this.playbackNotes){const e=[];for(;this.playbackIndex<this.playbackNotes.length&&this.playbackNotes[this.playbackIndex].t<t+Tt;)e.push(this.playbackNotes[this.playbackIndex++]);if(e.length&&this.engine.schedule(e,this.startedAt),this.playbackIndex>=this.playbackNotes.length){const n=this.playbackNotes[this.playbackNotes.length-1];(!n||t>n.t+n.d+1.5)&&this.finish()}return}for(;this.cursor<t+Tt&&this.phrasesLeft>0;){const e=this.improviser.nextPhrase(),n=this.cursor,s=e.notes.map(a=>({t:n+a.time,d:a.duration,midi:a.midi,vel:a.velocity,slur:!!a.slur,tongue:a.tongue,bendCents:a.bendCents||0,portamento:a.portamento||0,flutter:a.flutter||0}));this.engine.schedule(s,this.startedAt),this.score.push(...s),this.cursor=n+e.duration+e.restAfter,this.phrasesLeft--,this.onPhrase&&this.onPhrase(e,n)}this.phrasesLeft<=0&&t>this.cursor-.5&&this.finish()}replan(){if(!this.playing||!this.improviser)return;const e=this.engine.currentTime-this.startedAt+.25;this.engine.cancelAfter(this.startedAt+e),this.score=this.score.filter(n=>n.t<e),this.cursor=e,this.improviser.lastDegree=null,this.tick()}finish(){clearInterval(this.timer),this.timer=null,setTimeout(()=>{this.playing&&(this.playing=!1,this.onStop&&this.onStop())},2*1e3)}stop({silent:t=!1}={}){this.timer&&clearInterval(this.timer),this.timer=null;const e=this.playing;this.playing=!1,this.engine.panic(),e&&!t&&this.onStop&&this.onStop()}}const H=40,J=96,q=(i,t,e)=>i+(t-i)*e,N=(i,t,e)=>i<t?t:i>e?e:i;function St(i){const t=Math.sin(i*127.1)*43758.5453;return t-Math.floor(t)}function et(i){const t=Math.floor(i),e=i-t,n=e*e*(3-2*e);return q(St(t),St(t+1),n)}function Zt(i,t){return .6*et(i+t)+.3*et(i*2.1-t*.7)+.1*et(i*4.3+t*1.3)}const nt=[255,178,107],st=[126,214,255],Rt=i=>[Math.round(q(nt[0],st[0],i)),Math.round(q(nt[1],st[1],i)),Math.round(q(nt[2],st[2],i))];class te{constructor(t){this.canvas=t,this.ctx=t.getContext("2d"),this.dpr=Math.min(window.devicePixelRatio||1,2),this.w=0,this.h=0,this.t=0,this.analyser=null,this.freq=null,this.reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches,this.range={lo:62,hi:86},this.energy=0,this.notes=[],this.motes=[],this.resize(),window.addEventListener("resize",()=>this.resize());for(let e=0;e<240;e++)this.stepMotes(1/30);this.t=3.2}setAnalyser(t){this.analyser=t,this.freq=t?new Uint8Array(t.frequencyBinCount):null}setRange(t,e){this.range.lo=t,this.range.hi=e}noteOn(t,e){const n=N((t-H)/(J-H),0,1);this.notes.push({u:n,life:1,vel:e}),this.notes.length>40&&this.notes.shift()}resize(){const t=this.canvas.getBoundingClientRect();this.w=Math.max(1,Math.floor(t.width)),this.h=Math.max(1,Math.floor(t.height)),this.canvas.width=Math.floor(this.w*this.dpr),this.canvas.height=Math.floor(this.h*this.dpr),this.ctx.setTransform(this.dpr,0,0,this.dpr,0,0),this.columns=N(Math.round(this.w/70),12,24);const e=this.reduced?120:460;for(;this.motes.length<e;)this.motes.push(this.newMote(!0));this.motes.length=e}newMote(t){return{x:Math.random()*(this.w||800),y:t?Math.random()*(this.h||600):(this.h||600)+8,r:.6+Math.random()*1.6,a:.05+Math.random()*.3,vy:-(4+Math.random()*12)}}stepMotes(t){const e=this.h||600,n=this.w||800;for(const s of this.motes)s.y+=s.vy*t,s.x+=Math.sin(s.y*.004+this.t*.11)*12*t,s.y<-8&&(s.y=e+8,s.x=Math.random()*n),s.x<-8&&(s.x=n+8),s.x>n+8&&(s.x=-8)}levels(){const t=this.columns,e=new Float32Array(t);let n=null;this.analyser&&this.freq&&(this.analyser.getByteFrequencyData(this.freq),n=this.freq);for(let s=0;s<t;s++){const a=t>1?s/(t-1):0;let r=.18+.34*Zt(s*.37,this.t*.06);if(n){const o=q(H,J,a),h=440*Math.pow(2,(o-69)/12),l=N(Math.round(h/(this.sampleRate||48e3/2)*n.length*2),0,n.length-1);let d=0;for(let f=-1;f<=1;f++)d=Math.max(d,n[N(l+f,0,n.length-1)]);r+=d/255*1.5}for(const o of this.notes){const h=Math.abs(o.u-a);h<.09&&(r+=(1-h/.09)*o.life*.9*(.4+o.vel))}e[s]=r}return e}draw(t){const e=this.ctx,n=this.w,s=this.h;if(!n||!s)return;this.t+=t,this.stepMotes(t);for(const c of this.notes)c.life-=t*1.6;this.notes=this.notes.filter(c=>c.life>0);const a=e.createLinearGradient(0,0,0,s);a.addColorStop(0,"#05070b"),a.addColorStop(.55,"#0a1018"),a.addColorStop(1,"#070a10"),e.fillStyle=a,e.fillRect(0,0,n,s);const r=e.createRadialGradient(n*.5,s*.72,0,n*.5,s*.72,n*.7);r.addColorStop(0,"rgba(60,110,160,0.10)"),r.addColorStop(1,"rgba(60,110,160,0)"),e.fillStyle=r,e.fillRect(0,0,n,s);const o=this.levels(),h=this.columns,l=n/(h+1);e.globalCompositeOperation="lighter";let d=0;for(let c=0;c<h;c++){const g=h>1?c/(h-1):0,b=q(H,J,g),v=b>=this.range.lo-1&&b<=this.range.hi+1,k=N(o[c],0,2.2);d+=k;const[x,I,L]=Rt(g),M=`${x},${I},${L}`,P=v?1:.1,A=l*(c+1),C=18+26*Math.min(k,1.4),T=e.createLinearGradient(0,0,0,s);T.addColorStop(0,`rgba(${M},0)`),T.addColorStop(.45,`rgba(${M},${.22*P})`),T.addColorStop(.62,`rgba(255,255,255,${.4*Math.min(k,1.2)*P})`),T.addColorStop(.85,`rgba(${M},${.1*P})`),T.addColorStop(1,`rgba(${M},0)`),e.fillStyle=T,e.fillRect(A-C/2,0,C,s),e.save(),e.shadowBlur=18,e.shadowColor=`rgba(${M},${.9*P})`,e.fillStyle=`rgba(255,255,255,${.55*Math.min(k,1.3)*P})`,e.fillRect(A-.75,s*.12,1.5,s*.76),e.restore()}this.energy=d/h;for(const c of this.motes){const g=N(c.x/n,0,1),b=q(H,J,g),v=Math.abs((c.x%l-l/2)/(l/2)),k=b>=this.range.lo&&b<=this.range.hi&&v>.55,[x,I,L]=Rt(g),M=c.a*(k?1.8:1);e.fillStyle=k?`rgba(${x},${I},${L},${M})`:`rgba(200,230,255,${M})`,e.beginPath(),e.arc(c.x,c.y,c.r,0,Math.PI*2),e.fill()}const f=14+26*N(this.energy-.3,0,1.4);for(let c=0;c<3;c++){e.beginPath(),e.lineWidth=[1.6,1,.6][c],e.strokeStyle=`rgba(169,230,255,${[.35,.18,.1][c]})`;for(let g=0;g<=n;g+=6){const b=s*.72+c*6+Math.sin(g*.006+this.t*.55+c*.12)*f;g===0?e.moveTo(g,b):e.lineTo(g,b)}e.stroke()}e.globalCompositeOperation="source-over";const p=e.createRadialGradient(n*.5,s*.45,0,n*.5,s*.45,Math.max(n,s)*.75);p.addColorStop(.38,"rgba(0,0,0,0)"),p.addColorStop(1,"rgba(0,0,0,0.58)"),e.fillStyle=p,e.fillRect(0,0,n,s)}start(){let t=performance.now();const e=n=>{const s=Math.min(.05,(n-t)/1e3);t=n,this.draw(s),this.raf=requestAnimationFrame(e)};this.raf=requestAnimationFrame(e)}}function ee(i){const t=Math.min(2,i.numberOfChannels),e=i.length,n=i.sampleRate,s=2,a=t*s,r=e*a,o=new ArrayBuffer(44+r),h=new DataView(o),l=(p,c)=>{for(let g=0;g<c.length;g++)h.setUint8(p+g,c.charCodeAt(g))};l(0,"RIFF"),h.setUint32(4,36+r,!0),l(8,"WAVE"),l(12,"fmt "),h.setUint32(16,16,!0),h.setUint16(20,1,!0),h.setUint16(22,t,!0),h.setUint32(24,n,!0),h.setUint32(28,n*a,!0),h.setUint16(32,a,!0),h.setUint16(34,8*s,!0),l(36,"data"),h.setUint32(40,r,!0);const d=[];for(let p=0;p<t;p++)d.push(i.getChannelData(p));let f=44;for(let p=0;p<e;p++)for(let c=0;c<t;c++){const g=Math.max(-1,Math.min(1,d[c][p]));h.setInt16(f,g<0?g*32768:g*32767,!0),f+=2}return new Blob([o],{type:"audio/wav"})}function dt(i,t){const e=URL.createObjectURL(i),n=document.createElement("a");n.href=e,n.download=t,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(e),1e4)}const at=480,Nt=120,Lt=at*Nt/60;function F(i){const t=[i&127];let e=i>>>7;for(;e>0;)t.unshift(e&127|128),e>>>=7;return t}function it(i,t){for(let e=0;e<t.length;e++)i.push(t.charCodeAt(e))}function Dt(i,t){i.push(t>>>24&255,t>>>16&255,t>>>8&255,t&255)}function ne(i,{name:t="Flute Machine"}={}){const e=[];for(const o of i){const h=Math.max(0,Math.min(127,Math.round(o.midi))),l=Math.max(1,Math.min(127,Math.round((o.velocity??.7)*127))),d=Math.max(0,Math.round(o.time*Lt)),f=Math.max(d+1,Math.round((o.time+o.duration)*Lt));e.push({tick:d,order:1,bytes:[144,h,l]}),e.push({tick:f,order:0,bytes:[128,h,64]})}e.sort((o,h)=>o.tick-h.tick||o.order-h.order);const n=[];n.push(...F(0),255,3,...F(t.length)),it(n,t);const s=Math.round(6e7/Nt);n.push(...F(0),255,81,3),n.push(s>>16&255,s>>8&255,s&255),n.push(...F(0),192,73);let a=0;for(const o of e)n.push(...F(o.tick-a),...o.bytes),a=o.tick;n.push(...F(0),255,47,0);const r=[];return it(r,"MThd"),Dt(r,6),r.push(0,0),r.push(0,1),r.push(at>>8&255,at&255),it(r,"MTrk"),Dt(r,n.length),r.push(...n),new Blob([new Uint8Array(r)],{type:"audio/midi"})}const Bt="flute-machine.session",qt=1;function Ft({score:i,settings:t,seed:e,presetId:n,tone:s,title:a}){const r=i.reduce((o,h)=>Math.max(o,h.t+h.d),0);return{format:Bt,formatVersion:qt,app:"flute-machine",createdAt:new Date().toISOString(),title:a||"flute machine take",duration:Math.round(r*1e3)/1e3,seed:e,presetId:n??null,settings:{...t},tone:{...s},notes:i.map(o=>({t:G(o.t,4),d:G(o.d,4),midi:o.midi,vel:G(o.vel,3),...o.slur?{slur:1}:{},...o.bendCents?{bend:G(o.bendCents,1)}:{},...o.portamento?{porta:G(o.portamento,3)}:{},...o.flutter?{flutter:G(o.flutter,1)}:{}}))}}const G=(i,t)=>{const e=Math.pow(10,t);return Math.round(i*e)/e};function Gt(i){if(!i||typeof i!="object")throw new Error("Not a session file.");if(i.format!==Bt)throw new Error("This is not a Flute Machine session file.");if(!Array.isArray(i.notes)||i.notes.length===0)throw new Error("That session has no notes in it.");if(i.formatVersion>qt)throw new Error(`That file was made by a newer version (format ${i.formatVersion}).`);const t=i.notes.filter(e=>Number.isFinite(e.t)&&Number.isFinite(e.midi)).map(e=>({t:Math.max(0,+e.t),d:Math.max(.02,+e.d||.25),midi:Math.max(24,Math.min(108,+e.midi)),vel:Math.max(.02,Math.min(1,+e.vel||.7)),slur:!!e.slur,bendCents:+e.bend||0,portamento:+e.porta||0,flutter:+e.flutter||0})).sort((e,n)=>e.t-n.t);if(!t.length)throw new Error("No usable notes in that session.");return{notes:t,settings:{...Q,...i.settings||{}},tone:{breathiness:.4,vibrato:.5,brightness:.5,...i.tone||{}},seed:Number.isFinite(i.seed)?i.seed>>>0:1,presetId:i.presetId??null,title:i.title||"loaded take"}}function ft(i){const t=new Date,e=n=>String(n).padStart(2,"0");return`flute-machine-${t.getFullYear()}${e(t.getMonth()+1)}${e(t.getDate())}-${e(t.getHours())}${e(t.getMinutes())}${e(t.getSeconds())}.${i}`}const m=i=>document.getElementById(i),rt=(i,t,e)=>i<t?t:i>e?e:i,u={preset:"ambient",settings:{...Q,...Ot.ambient.settings},tone:{breathiness:.3,vibrato:.45,brightness:.5},seed:ht(),volume:.75,droneLock:!1,savedRange:null},y=new ct,w=new Xt(y),E=new te(m("stage"));E.setRange(u.settings.registerLow,u.settings.registerHigh);E.start();let It=null;function O(i,t=!1){const e=m("toast");e.textContent=i,e.classList.toggle("is-error",t),e.classList.add("is-shown"),clearTimeout(It),It=setTimeout(()=>e.classList.remove("is-shown"),2600)}function R(){var o;const i=u.settings,t=(((o=Y.find(h=>h.id===i.scale))==null?void 0:o.name)??i.scale).toLowerCase(),e=`${lt[(i.root%12+12)%12]} ${t}`,n=w.playing;m("status").textContent=`${e} · seed ${u.seed.toString(16)} · ${n?"breathing":"resting"}`;const s=w.score.length,a=w.scoreDuration;m("scoreInfo").textContent=s?`${s} note${s===1?"":"s"} · ${$t(a)} recorded`:"nothing recorded yet";const r=s>0;for(const h of["save","midi","wav"])m(h).disabled=!r}const $t=i=>{const t=Math.floor(i/60),e=Math.floor(i%60);return t?`${t}m ${String(e).padStart(2,"0")}s`:`${e}s`},Ht=[{key:"density",label:"Density",target:"settings",desc:"how much silence between phrases"},{key:"pace",label:"Pace",target:"settings",desc:"note length, 2.6s to 0.2s"},{key:"phrase",label:"Phrase",target:"settings",desc:"how much air per breath"},{key:"motion",label:"Motion",target:"settings",desc:"how far the melody wanders"},{key:"ornament",label:"Ornament",target:"settings",desc:"trills, grace notes, slides"},{key:"breathiness",label:"Breath",target:"both",desc:"air against tone"},{key:"vibrato",label:"Vibrato",target:"both",desc:"depth of the wobble"},{key:"space",label:"Space",target:"settings",desc:"size of the room"}];function se(i,t){const e=Math.min(window.devicePixelRatio||1,2),n=54;i.width=n*e,i.height=n*e,i.style.width=`${n}px`,i.style.height=`${n}px`;const s=i.getContext("2d");s.setTransform(e,0,0,e,0,0),s.clearRect(0,0,n,n);const a=n/2,r=n/2,o=n/2-6,h=Math.PI*.75,l=Math.PI*1.5;s.lineCap="round",s.lineWidth=3,s.strokeStyle="rgba(190,215,255,0.12)",s.beginPath(),s.arc(a,r,o,h,h+l),s.stroke();const d=s.createLinearGradient(0,0,n,0);d.addColorStop(0,"#ffb26b"),d.addColorStop(1,"#7ed6ff"),s.strokeStyle=d,s.lineWidth=3,s.beginPath(),s.arc(a,r,o,h,h+l*rt(t,0,1)),s.stroke();const f=h+l*rt(t,0,1);s.strokeStyle="rgba(232,240,251,0.9)",s.lineWidth=2,s.beginPath(),s.moveTo(a+Math.cos(f)*(o-8),r+Math.sin(f)*(o-8)),s.lineTo(a+Math.cos(f)*(o-1),r+Math.sin(f)*(o-1)),s.stroke()}function ie(){const i=m("knobs");i.innerHTML="";for(const t of Ht){const e=document.createElement("button");e.className="knob",e.type="button",e.setAttribute("role","slider"),e.setAttribute("aria-label",`${t.label} — ${t.desc}`),e.setAttribute("aria-valuemin","0"),e.setAttribute("aria-valuemax","100");const n=document.createElement("canvas");n.className="knob__dial";const s=document.createElement("span");s.className="knob__label",s.textContent=t.label;const a=document.createElement("span");a.className="knob__value";const r=document.createElement("span");r.className="knob__desc",r.textContent=t.desc,e.append(n,s,a,r),i.append(e);const o=()=>t.target==="settings"?u.settings[t.key]:u.tone[t.key]??u.settings[t.key],h=c=>{c=rt(c,0,1),(t.target==="settings"||t.target==="both")&&(u.settings[t.key]=c),(t.target==="tone"||t.target==="both")&&(u.tone[t.key]=c),l(),ae(t.key)},l=()=>{const c=o();se(n,c),a.textContent=String(Math.round(c*100)),e.setAttribute("aria-valuenow",String(Math.round(c*100)))};t.render=l,l();let d=!1,f=0;e.addEventListener("pointerdown",c=>{d=!0,f=c.clientY,e.setPointerCapture(c.pointerId),c.preventDefault()}),e.addEventListener("pointermove",c=>{if(!d)return;const g=f-c.clientY;f=c.clientY,h(o()+g/160)});const p=c=>{d=!1;try{e.releasePointerCapture(c.pointerId)}catch{}};e.addEventListener("pointerup",p),e.addEventListener("pointercancel",p),e.addEventListener("keydown",c=>{const g=c.shiftKey?.01:.05;if(c.key==="ArrowUp"||c.key==="ArrowRight")h(o()+g);else if(c.key==="ArrowDown"||c.key==="ArrowLeft")h(o()-g);else if(c.key==="Home")h(0);else if(c.key==="End")h(1);else return;c.preventDefault()})}}const oe=()=>Ht.forEach(i=>i.render&&i.render());function $({replan:i=!1}={}){w.improviser&&(w.improviser.settings=u.settings,i&&w.replan())}function ae(i){y.ready&&((i==="breathiness"||i==="vibrato")&&y.setTone(u.tone),i==="space"&&y.setSpace(u.settings.space),$())}function pt(){const i=m("presets");i.innerHTML="";for(const t of Et){const e=document.createElement("button");e.className="chip"+(t.settings.registerHigh<=66?" chip--low":""),e.type="button",e.textContent=t.name,e.title=t.blurb,e.setAttribute("aria-pressed",String(t.id===u.preset)),e.addEventListener("click",()=>re(t.id)),i.append(e)}}function re(i,t){const e=Ot[i];e&&(u.preset=i,u.settings={...Q,...e.settings},u.tone.breathiness=u.settings.breathiness,u.tone.vibrato=u.settings.vibrato,u.droneLock=u.settings.registerHigh<=66,U(),pt(),y.ready&&(y.setTone(u.tone),y.setSpace(u.settings.space)),w.playing&&K(),R())}function U(){const i=u.settings.registerLow,t=u.settings.registerHigh;m("rangeLo").value=i,m("rangeHi").value=t,m("rangeOut").textContent=`${xt(i)} — ${xt(t)}`;const e=+m("rangeLo").min,n=+m("rangeLo").max,s=(i-e)/(n-e)*100,a=(t-e)/(n-e)*100,r=m("rangeSpan");r.style.left=`${s}%`,r.style.width=`${Math.max(0,a-s)}%`,E.setRange(i,t),oe(),mt(),m("drift").checked=!!u.settings.automation,m("droneLock").checked=u.droneLock,m("breathe").classList.toggle("is-low",t<=66)}function Ut(){let i=+m("rangeLo").value,t=+m("rangeHi").value;t-i<7&&(document.activeElement===m("rangeLo")?t=Math.min(96,i+7):i=Math.max(43,t-7)),u.settings.registerLow=i,u.settings.registerHigh=t,u.droneLock=!1,m("droneLock").checked=!1,U(),$({replan:!0})}function he(){const i=m("root");i.innerHTML="";for(let e=0;e<12;e++){const n=document.createElement("option");n.value=String(e),n.textContent=lt[e],i.append(n)}const t=m("scale");t.innerHTML="";for(const e of Y){const n=document.createElement("option");n.value=e.id,n.textContent=e.name,n.title=e.mood,t.append(n)}}function mt(){m("root").value=String((u.settings.root%12+12)%12),m("scale").value=u.settings.scale,m("rootAuto").checked=!!u.settings.rootAuto,m("scaleAuto").checked=!!u.settings.scaleAuto}function ce(){const i=m("ticks");i.innerHTML="";for(const t of[2,3,4,5,6,7]){const e=document.createElement("span");e.textContent=`C${t}`,i.append(e)}}async function gt(){y.ready||(await y.init({space:u.settings.space,gain:u.volume,seed:u.seed}),E.setAnalyser(y.analyser),E.sampleRate=y.ctx.sampleRate,y.usingWorklet||O("Using the simple voice — worklets are blocked here")),await y.resume()}async function K(){await gt(),y.setTone(u.tone),y.setSpace(u.settings.space),y.setGain(u.volume),w.start({...u.settings,mode:"endless"},u.seed),m("breathe").classList.add("is-playing"),m("breathe").querySelector(".breathe__label").textContent="Rest",m("breathe").setAttribute("aria-label","Stop playing"),R()}function Wt(){w.stop(),m("breathe").classList.remove("is-playing"),m("breathe").querySelector(".breathe__label").textContent="Breathe",m("breathe").setAttribute("aria-label","Start playing"),R()}async function le(){await gt(),y.setTone(u.tone),y.setGain(u.volume);const i={...u.settings,density:.85,pace:Math.max(.78,u.settings.pace),phrase:Math.min(.28,u.settings.phrase),motion:Math.max(.65,u.settings.motion),ornament:Math.max(.6,u.settings.ornament),automation:!1,mode:"burst",burstPhrases:1},t=ht();if(w.playing){const s=new ut(i,t).nextPhrase().notes.map(o=>({t:o.time,d:o.duration,midi:o.midi,vel:o.velocity,slur:!!o.slur,bendCents:o.bendCents||0,portamento:o.portamento||0,flutter:o.flutter||0})),a=y.currentTime+.08;y.schedule(s,a);const r=w.elapsed+.08;w.score.push(...s.map(o=>({...o,t:o.t+r})));for(const o of s)setTimeout(()=>E.noteOn(o.midi,o.vel),o.t*1e3)}else w.start(i,t);R()}async function ue(){const i=w.score;if(!i.length)return;const t=m("wav");t.disabled=!0;const e=t.textContent;t.textContent="Rendering";try{const n=await ct.renderOffline(i,{space:u.settings.space,tone:u.tone,seed:u.seed,sampleRate:48e3});dt(ee(n),ft("wav")),O(`WAV exported — ${$t(n.duration)}`)}catch(n){console.error(n),O(`Could not render: ${n.message}`,!0)}finally{t.textContent=e,t.disabled=!1,R()}}function de(){const i=w.score;if(!i.length)return;const t=i.map(e=>({time:e.t,duration:e.d,midi:e.midi,velocity:e.vel}));dt(ne(t),ft("mid")),O(`MIDI exported — ${t.length} notes`)}function fe(){const i=w.score;if(!i.length)return;const t=Ft({score:i,settings:u.settings,seed:u.seed,presetId:u.preset,tone:u.tone});dt(new Blob([JSON.stringify(t,null,1)],{type:"application/json"}),ft("json")),O("Session saved")}async function pe(i){try{const t=Gt(JSON.parse(await i.text()));u.settings=t.settings,u.tone=t.tone,u.seed=t.seed,u.preset=t.presetId??u.preset,U(),pt(),await gt(),y.setTone(u.tone),y.setSpace(u.settings.space),y.setGain(u.volume),w.play(t.notes),m("breathe").classList.add("is-playing"),m("breathe").querySelector(".breathe__label").textContent="Rest",O(`Playing "${t.title}" — ${t.notes.length} notes`),R()}catch(t){console.error(t),O(t.message||"Could not read that file",!0)}}pt();ie();he();ce();U();R();m("breathe").addEventListener("click",()=>{w.playing?Wt():K()});m("puff").addEventListener("click",le);m("rangeLo").addEventListener("input",Ut);m("rangeHi").addEventListener("input",Ut);m("droneLock").addEventListener("change",i=>{if(u.droneLock=i.target.checked,u.droneLock){u.savedRange=[u.settings.registerLow,u.settings.registerHigh];const t=Qt.find(e=>e.id==="drone");u.settings.registerLow=t.lo,u.settings.registerHigh=t.hi}else u.savedRange&&(u.settings.registerLow=u.savedRange[0],u.settings.registerHigh=u.savedRange[1]);U(),$({replan:!0})});for(const[i,t]of[["root","root"],["scale","scale"]])m(i).addEventListener("change",e=>{u.settings[t]=t==="root"?+e.target.value:e.target.value,u.settings[t==="root"?"rootAuto":"scaleAuto"]=!1,mt(),$({replan:!0}),R()});for(const[i,t]of[["rootAuto","rootAuto"],["scaleAuto","scaleAuto"]])m(i).addEventListener("change",e=>{u.settings[t]=e.target.checked,$()});m("drift").addEventListener("change",i=>{u.settings.automation=i.target.checked,$()});m("volume").addEventListener("input",i=>{u.volume=+i.target.value,y.setGain(u.volume)});m("dice").addEventListener("click",()=>{u.seed=ht(),O(`New seed ${u.seed.toString(16)}`),w.playing&&K()});m("save").addEventListener("click",fe);m("midi").addEventListener("click",de);m("wav").addEventListener("click",ue);m("load").addEventListener("click",()=>m("file").click());m("file").addEventListener("change",i=>{var e;const t=(e=i.target.files)==null?void 0:e[0];t&&pe(t),i.target.value=""});w.onPhrase=(i,t)=>{const e=Math.max(0,t-w.elapsed);for(const n of i.notes)setTimeout(()=>E.noteOn(n.midi,n.velocity),(e+n.time)*1e3);i.info&&(u.settings.rootAuto&&(u.settings.root=i.info.root),u.settings.scaleAuto&&(u.settings.scale=i.info.scale),mt()),R()};w.onStop=()=>{m("breathe").classList.remove("is-playing"),m("breathe").querySelector(".breathe__label").textContent="Breathe",R()};window.addEventListener("keydown",i=>{i.code!=="Space"||i.target.closest("input, button")||(i.preventDefault(),w.playing?Wt():K())});setInterval(R,1e3);window.__flute={engine:y,player:w,viz:E,state:u,FluteEngine:ct,toSession:Ft,fromSession:Gt,Improviser:ut};
