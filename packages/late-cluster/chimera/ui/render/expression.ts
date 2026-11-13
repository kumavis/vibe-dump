/**
 * The face's expression, from what the voice is doing: the cheeks puff with the air pressure held
 * behind closed lips, the brows follow the pitch, the eyes blink now and then and close on a long
 * held note, and (for the 3D head, which has no handles to keep still) the head nods, sways and
 * wobbles with the vibrato.
 *
 * Both face views keep one each and update it every frame from the latest telemetry; without
 * telemetry (the engine not started) the face still blinks and everything else settles to rest.
 */
import type { TelemetryMessage } from "../../worklet/protocol.ts";

/** dyn/cm² in one cmH₂O (the engine's pressures are in dyn/cm²) */
const CM_H2O = 980.665;
const smooth = (a: number, b: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));
/** one step of x towards target with time constant tau (s) */
const follow = (x: number, target: number, tau: number, dt: number) => x + (target - x) * (1 - Math.exp(-dt / tau));

/** A damped spring: it overshoots a little, which is what makes cheeks and heads jiggle. */
class Spring {
  x = 0;
  v = 0;
  constructor(private readonly hz: number, private readonly damping: number) {}
  step(target: number, dt: number): number {
    const w = 2 * Math.PI * this.hz;
    // a few substeps keep it stable at a low frame rate
    const n = Math.max(1, Math.ceil(dt / 0.008)), h = dt / n;
    for (let i = 0; i < n; i++) {
      this.v += (w * w * (target - this.x) - 2 * this.damping * w * this.v) * h;
      this.x += this.v * h;
    }
    return this.x;
  }
}

/**
 * The air pressure (cmH₂O) in the mouth just behind the lips: a node about a centimetre in from
 * the lips' end of the oral tube. Lips shut with the soft palate up (p, b) hold it near the lungs'
 * pressure; m lets it out through the nose, and t, k and vowels leave it near nothing.
 */
export function mouthPressure(tele: TelemetryMessage): number {
  const p = tele.t.pressureRms;
  const i = tele.nPh + tele.nOr - 3;
  return i >= tele.nPh && i < p.length ? p[i] / CM_H2O : 0;
}

export class Expression {
  /** cheeks: 0 at rest, 1 fully puffed (a spring: it overshoots a little either way on release) */
  puff = 0;
  /** brows: +1 raised high, −1 lowered and knit */
  brow = 0;
  /** eyelids: 0 open, 1 shut */
  lid = 0;
  /** extra gaze pitch (radians, up): the eyes roll up on high notes */
  lookUp = 0;
  /** being petted: 0..1, set by the view; the eyes close and the brows lift with pleasure */
  content = 0;
  /** 3D head: chin up (+) or down, radians */
  nod = 0;
  /** 3D head: tilted towards its right shoulder (+), radians */
  tilt = 0;

  private clock = 0;
  private readonly cheeks = new Spring(6.5, 0.32);
  private readonly nodSpring = new Spring(2.4, 0.42);
  private readonly tiltSpring = new Spring(3.2, 0.3);
  /** the pitch's long-run level (log2 Hz) and its last fraction of a second, while voiced */
  private ref = NaN;
  private fast = NaN;
  /** how long the pitch has held steady (s) */
  private held = 0;
  private hold = 0;
  private nextBlink = 1.5 + Math.random() * 2;
  private blinkAt = -1;
  private secondBlink = false;
  private lastStep = -1;

  /** dt: the real time since the last update (s), not a frame-capped one, so a held note or a blink
   *  lasts as long at a low frame rate */
  update(tele: TelemetryMessage | null, dt: number): void {
    this.clock += dt;
    const t = tele?.t;
    const voiced = !!t && t.voicing > 0.45 && t.gate > 0.3 && t.f0 > 30 && t.outRms > 0.004;

    // ---- cheeks
    const puffTo = tele ? smooth(1.5, 7.0, mouthPressure(tele)) : 0;
    this.puff = clamp(this.cheeks.step(puffTo, dt), -0.35, 1.25);

    // ---- pitch: brows follow the pitch above or below where it has been lately
    let dev = 0, wobble = 0;
    if (voiced) {
      const l = Math.log2(t!.f0);
      // the first note, or a new body an octave away, starts from where it is
      if (!Number.isFinite(this.ref) || Math.abs(12 * (l - this.ref)) > 14) this.ref = this.fast = l;
      this.ref = follow(this.ref, l, 5, dt);
      // a new note (a step well past any vibrato) starts the held time again
      if (Math.abs(12 * (l - this.fast)) > 2.5) {
        this.fast = l;
        this.held = 0;
      }
      this.fast = follow(this.fast, l, 0.35, dt);
      this.held += dt;
      dev = 12 * (l - this.ref);
      wobble = 12 * (l - this.fast);
    } else this.held = 0;
    const browTo = (voiced ? clamp(dev / 6, -0.7, 1) : 0) + 0.3 * this.content;
    this.brow = follow(this.brow, browTo, voiced ? 0.12 : 0.45, dt);
    this.lookUp = 0.32 * Math.max(0, this.brow);

    // ---- eyes: a long high note closes them (not a long note at the voice's usual pitch: Play's
    // held breath is one); blinks in between
    const holdTo = voiced ? 0.92 * smooth(0.9, 1.9, this.held) * smooth(0.15, 0.55, this.brow) : 0;
    this.hold = follow(this.hold, holdTo, holdTo > this.hold ? 0.35 : 0.08, dt);
    if (this.clock >= this.nextBlink && this.hold < 0.2) {
      this.blinkAt = this.clock;
      this.secondBlink = !this.secondBlink && Math.random() < 0.18;
      this.nextBlink = this.clock + (this.secondBlink ? 0.28 : 2 + Math.random() * 4.5);
    }
    const b = (this.clock - this.blinkAt) / 0.17;
    const blink = this.blinkAt >= 0 && b < 1 ? Math.sin(Math.PI * b) ** 0.7 : 0;
    this.lid = Math.max(blink, this.hold, 0.95 * this.content);

    // ---- the 3D head: chin up for high notes, a nod on the beat, a sway on a long note, the vibrato's wobble
    // a nod for each beat (four steps) the sequencer passed since the last frame, the bar's first the
    // hardest; a slow frame that skips the beat's own step still nods, once
    const step = tele?.beatStep ?? -1;
    if (step >= 0 && this.lastStep >= 0 && step !== this.lastStep) {
      const wrapped = step < this.lastStep;
      if (wrapped || Math.floor(step / 4) !== Math.floor(this.lastStep / 4)) this.nodSpring.v -= wrapped || Math.floor(step / 16) !== Math.floor(this.lastStep / 16) ? 1.3 : 0.8;
    }
    this.lastStep = step;
    this.nod = this.nodSpring.step(0.13 * this.brow, dt);
    const sway = smooth(0.6, 2, this.held) * 0.07 * Math.sin(this.clock * 1.7);
    this.tilt = this.tiltSpring.step(sway + 0.05 * clamp(wobble, -1.5, 1.5), dt);
  }
}
