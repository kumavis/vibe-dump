/**
 * The CHIMERA engine (wasm) for offline rendering under bun: one main-thread facade for planning
 * (G2P, phrase and song planners) and separate engine instances per voice, driven through the same
 * ABI the AudioWorklet uses. Everything audible in the show comes out of here.
 */
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";
import { fileURLToPath } from "node:url";
import { initChimera } from "../chimera/wasm/chimera.ts";
import { writeGestures, writeSteps, utf8, fromUtf8, CONTROL_KEYS } from "../chimera/wasm/wire.ts";
import type { Gesture, BodyMix, HumanArtic } from "../chimera/wasm/types.ts";

export const FS = 48000;
/** telemetry frames are taken every HOP samples (31.25 per second; the page interpolates) */
export const HOP = 1536;
/** glottal-scope points kept per frame */
export const SCOPE = 8;
/** scalars kept at the head of a frame, in order */
export const SCALARS = ["phLen", "orLen", "velumPort", "f0", "voicing", "pLung", "outRms", "noiseLevel", "noiseNode", "gate"] as const;

const here = (rel: string) => fileURLToPath(new URL(rel, import.meta.url));
const wasmBytes = readFileSync(here("../chimera/wasm/chimera.wasm"));
const wasmModule = new WebAssembly.Module(wasmBytes);

type Fn = (...a: number[]) => number;
type Exports = { memory: WebAssembly.Memory } & Record<string, Fn>;

export type Engine = typeof import("../chimera/wasm/engine.ts");
let facade: Engine | null = null;
let g2p: InstanceType<Engine["EnglishG2P"]> | null = null;

/** Load the engine and the pronouncing dictionary (once). */
export async function loadEngine(): Promise<{ E: Engine; g2p: InstanceType<Engine["EnglishG2P"]> }> {
  if (!facade) {
    await initChimera(wasmBytes);
    facade = await import("../chimera/wasm/engine.ts");
    g2p = new facade.EnglishG2P();
    g2p.setDictionaryText(gunzipSync(readFileSync(here("./data/cmudict.txt.gz"))).toString("utf8"));
  }
  return { E: facade, g2p: g2p! };
}

const SOURCE_KEYS = ["f0", "glide", "pressure", "breathiness", "tension", "fry", "roughness", "vibratoDepth", "vibratoRate", "drift", "voiced", "brightness"];
const ARTIC_KEYS = CONTROL_KEYS.slice(0, 17);

export interface Tele {
  frames: number;
  channels: number;
  nPh: number;
  nOr: number;
  /** frames × channels, frame-major */
  data: Float32Array;
}

/** One voice: its own engine instance, as in the worklet. */
export class Voice {
  private readonly x: Exports;
  private readonly h: number;
  readonly body: BodyMix;
  constructor(body: BodyMix) {
    this.body = body;
    this.x = new WebAssembly.Instance(wasmModule, {}).exports as unknown as Exports;
    this.h = this.x.engine_new(FS);
    this.x.engine_set_body(this.h, body.female, body.child);
  }
  get clock(): number {
    return this.x.engine_clock(this.h);
  }
  private values(): Float64Array {
    return new Float64Array(this.x.memory.buffer, this.x.engine_values(this.h), 32).fill(NaN);
  }
  setSource(values: Record<string, number | boolean | undefined>): void {
    const v = this.values();
    for (const [k, val] of Object.entries(values)) {
      const i = SOURCE_KEYS.indexOf(k);
      if (i >= 0 && val !== undefined) v[i] = typeof val === "boolean" ? (val ? 1 : 0) : val;
    }
    this.x.engine_set_source(this.h);
  }
  setArtic(values: Partial<HumanArtic>): void {
    const v = this.values();
    for (const [k, val] of Object.entries(values)) {
      const i = ARTIC_KEYS.indexOf(k as never);
      if (i >= 0 && typeof val === "number") v[i] = val;
    }
    this.x.engine_set_artic(this.h, 2);
  }
  setGate(level: number): void {
    this.x.engine_set_gate(this.h, level);
  }
  /** Schedule gestures whose times are relative to now. */
  schedule(gestures: readonly Gesture[]): void {
    for (let i = 0; i < gestures.length; i += 1000) {
      const part = gestures.slice(i, i + 1000);
      const n = writeGestures(this.x.memory.buffer, this.x.engine_records(this.h), part, 1000);
      if (n !== part.length) throw new Error("the engine took fewer gestures than were sent");
      this.x.engine_schedule(this.h, n, 0, 0);
    }
  }
  /** Start the beat sequencer: step 0 sounds 0.2 s (the player's horizon) after now. */
  startBeat(steps: ({ id: string; note?: number; accent?: number } | null)[], bpm: number, swing = 0): void {
    const n = writeSteps(this.x.memory.buffer, this.x.engine_records(this.h), steps);
    this.x.engine_set_beat(this.h, 1, n, bpm, swing, 1);
  }
  stopBeat(): void {
    this.x.engine_set_beat(this.h, 0, 0, NaN, NaN, 0);
  }
  /** Switch to a creature (bestiary) voice; returns what the engine says about it. */
  setCreature(id: string, params: Record<string, number> = {}): { id: string; params: string[]; calls: string[] } {
    const x = this.x;
    const bytes = utf8(JSON.stringify({ id, params }));
    const p = x.chimera_alloc(bytes.length);
    new Uint8Array(x.memory.buffer, p, bytes.length).set(bytes);
    const status = x.engine_set_creature(this.h, p, bytes.length);
    x.chimera_free(p, bytes.length);
    const v = JSON.parse(fromUtf8(new Uint8Array(x.memory.buffer, x.chimera_result_ptr(), x.chimera_result_len())));
    if (status !== 0) throw new Error(v.error);
    return v;
  }
  creatureParam(index: number, value: number): void {
    this.x.engine_creature_param(this.h, index, value);
  }
  playCall(index: number, pitch = NaN, amp = NaN): void {
    this.x.engine_play_call(this.h, index, pitch, amp);
  }
  render(n: number): Float32Array {
    const out = new Float32Array(n);
    this.renderInto(out, 0, n);
    return out;
  }
  private renderInto(out: Float32Array, from: number, to: number): void {
    for (let i = from; i < to; i += 128) {
      const m = Math.min(128, to - i);
      out.set(new Float32Array(this.x.memory.buffer, this.x.engine_render(this.h, m), m), i);
    }
  }
  /**
   * Render n samples, taking a telemetry frame every HOP samples (frame i: the state at i·HOP).
   * `events` run at their sample (between renders), in order.
   */
  renderTracked(n: number, events: { at: number; fn: () => void }[] = []): { audio: Float32Array; tele: Tele } {
    const out = new Float32Array(n);
    const frames: Float32Array[] = [];
    let nPh = 0, nOr = 0;
    const snap = () => {
      const x = this.x;
      const p = x.engine_telemetry(this.h);
      const head = new Float64Array(x.memory.buffer, p, 16);
      const nArtic = head[11], nScope = head[14];
      nPh = head[12];
      nOr = head[13];
      const nT = nPh + nOr;
      const all = new Float64Array(x.memory.buffer, p, 16 + nArtic + 3 * nT + 2 * nScope);
      const f = new Float32Array(SCALARS.length + nArtic + 3 * nT + SCOPE);
      let o = 0;
      for (let i = 0; i < SCALARS.length; i++) f[o++] = all[i];
      for (let i = 0; i < nArtic + 3 * nT; i++) f[o++] = all[16 + i];
      const g0 = 16 + nArtic + 3 * nT;
      for (let i = 0; i < SCOPE; i++) f[o++] = all[g0 + Math.floor((i * nScope) / SCOPE)];
      for (let i = 0; i < f.length; i++) if (!Number.isFinite(f[i])) f[i] = 0;
      frames.push(f);
    };
    const queue = [...events].sort((a, b) => a.at - b.at);
    snap();
    for (let pos = 0; pos < n; ) {
      while (queue.length && queue[0].at <= pos) queue.shift()!.fn();
      let end = Math.min(n, (Math.floor(pos / HOP) + 1) * HOP);
      if (queue.length) end = Math.min(end, Math.max(pos + 1, queue[0].at));
      this.renderInto(out, pos, end);
      pos = end;
      if (pos % HOP === 0) snap();
    }
    const channels = frames[0].length;
    const data = new Float32Array(frames.length * channels);
    frames.forEach((f, i) => data.set(f, i * channels));
    return { audio: out, tele: { frames: frames.length, channels, nPh, nOr, data } };
  }
}

export const midiToHz = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
