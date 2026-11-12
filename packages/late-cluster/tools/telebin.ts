/**
 * The per-segment telemetry file (public/tele/<id>.bin), shared by render.ts (encode) and
 * check.ts (decode). Layout, before gzip:
 *
 *   "LCT1" | u32 LE jsonLen | JSON header (space-padded, jsonLen is a multiple of 4) | data area
 *
 * header: { fs, hop, scalars, nArtic, scope, blocks: [{ frames, channels, nPh, nOr, body, offset }] }
 * A block (at data-area byte `offset`): Float32LE[channels × 2] (min, step) per channel, then
 * Uint16LE[channels × frames] channel-major, each channel delta-coded mod 65536 (first value
 * absolute). q = round((v − min) / step), step = (max − min) / 65535 (step 0 → all zeros).
 * Each block is padded to a multiple of 4 bytes.
 */
import { gzipSync, gunzipSync } from "node:zlib";
import { FS, HOP, SCALARS, SCOPE, type Tele } from "./engine.ts";
import type { BodyMix } from "../chimera/wasm/types.ts";

export const NARTIC = 17;

export interface TeleBlockHead {
  frames: number;
  channels: number;
  nPh: number;
  nOr: number;
  body: { female: number; child: number };
  offset: number;
}

export interface TeleHeader {
  fs: number;
  hop: number;
  scalars: string[];
  nArtic: number;
  scope: number;
  blocks: TeleBlockHead[];
}

const pad4 = (n: number) => (4 - (n % 4)) % 4;

/** Encode one block (tele.data is frame-major as renderTracked makes it). */
export function encodeBlock(t: Tele): Buffer {
  const { frames, channels, data } = t;
  const head = new Float32Array(channels * 2);
  const q = new Uint16Array(channels * frames);
  for (let c = 0; c < channels; c++) {
    let lo = Infinity, hi = -Infinity;
    for (let f = 0; f < frames; f++) {
      const v = data[f * channels + c];
      if (v < lo) lo = v;
      if (v > hi) hi = v;
    }
    if (!Number.isFinite(lo)) (lo = 0), (hi = 0);
    const min = Math.fround(lo);
    const step = Math.fround((hi - lo) / 65535);
    head[c * 2] = min;
    head[c * 2 + 1] = step;
    let prev = 0;
    for (let f = 0; f < frames; f++) {
      const v = data[f * channels + c];
      const qv = step > 0 ? Math.max(0, Math.min(65535, Math.round((v - min) / step))) : 0;
      q[c * frames + f] = (qv - prev) & 0xffff;
      prev = qv;
    }
  }
  const a = Buffer.from(head.buffer);
  const b = Buffer.from(q.buffer);
  return Buffer.concat([a, b, Buffer.alloc(pad4(a.length + b.length))]);
}

export function encodeTele(blocks: { tele: Tele; body: BodyMix }[]): Buffer {
  const parts: Buffer[] = [];
  const heads: TeleBlockHead[] = [];
  let offset = 0;
  for (const { tele, body } of blocks) {
    const enc = encodeBlock(tele);
    heads.push({ frames: tele.frames, channels: tele.channels, nPh: tele.nPh, nOr: tele.nOr, body: { female: body.female, child: body.child }, offset });
    parts.push(enc);
    offset += enc.length;
  }
  const header: TeleHeader = { fs: FS, hop: HOP, scalars: [...SCALARS], nArtic: NARTIC, scope: SCOPE, blocks: heads };
  let json = JSON.stringify(header);
  json += " ".repeat(pad4(Buffer.byteLength(json, "utf8")));
  const jb = Buffer.from(json, "utf8");
  const len = Buffer.alloc(4);
  len.writeUInt32LE(jb.length, 0);
  return gzipSync(Buffer.concat([Buffer.from("LCT1", "ascii"), len, jb, ...parts]), { level: 9 });
}

export interface DecodedTele {
  header: TeleHeader;
  data: Buffer;
  /** decode block i → frame-major Float32Array (frames × channels) */
  block(i: number): Float32Array;
}

export function decodeTele(gz: Buffer): DecodedTele {
  const raw = gunzipSync(gz);
  if (raw.subarray(0, 4).toString("ascii") !== "LCT1") throw new Error("bad magic");
  const jl = raw.readUInt32LE(4);
  const header = JSON.parse(raw.subarray(8, 8 + jl).toString("utf8")) as TeleHeader;
  const data = raw.subarray(8 + jl);
  return {
    header,
    data,
    block(i: number) {
      const b = header.blocks[i];
      const { frames, channels } = b;
      const ab = data.buffer.slice(data.byteOffset + b.offset, data.byteOffset + b.offset + channels * 8 + channels * frames * 2);
      const head = new Float32Array(ab, 0, channels * 2);
      const q = new Uint16Array(ab, channels * 8, channels * frames);
      const out = new Float32Array(frames * channels);
      for (let c = 0; c < channels; c++) {
        const min = head[c * 2], step = head[c * 2 + 1];
        let acc = 0;
        for (let f = 0; f < frames; f++) {
          acc = (acc + q[c * frames + f]) & 0xffff;
          out[f * channels + c] = min + acc * step;
        }
      }
      return out;
    },
  };
}
