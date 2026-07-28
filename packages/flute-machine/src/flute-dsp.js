// The flute voice: a jet-drive waveguide.
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
// A note on `jetRatio`, which is the parameter that decides whether this thing
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
 * `tone` carries the player-facing modifiers:
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
   * leaves the vibrato value in `this.vib` for the pressure path.
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
      const air = this.svBp * (P.airGain * pbs + this.chiff)

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
