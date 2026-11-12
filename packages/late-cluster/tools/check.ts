/**
 * bun tools/check.ts <segment-id> [more ids…] | --all
 *
 * Re-reads a rendered segment's three outputs and checks them against the contract: the tele bin
 * decodes, every line's block exists and covers [t0, t1], a decoded block matches the cached
 * clip's float telemetry, word times are sane, and the mp3's duration matches cues.duration.
 */
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { decodeTele } from "./telebin.ts";
import { sayClip, type Clip } from "./clips.ts";
import { CAST } from "../src/cast.js";

const ROOT = fileURLToPath(new URL("../", import.meta.url));

async function check(id: string): Promise<boolean> {
  const results: [boolean, string][] = [];
  const ok = (c: boolean, msg: string) => results.push([c, msg]);
  const cuesFile = `${ROOT}src/segments/${id}/cues.json`;
  if (!existsSync(cuesFile)) {
    console.log(`✗ ${id}: no cues.json`);
    return false;
  }
  const cues = JSON.parse(readFileSync(cuesFile, "utf8"));
  const mp3 = `${ROOT}public/${cues.audio}`;
  const bin = `${ROOT}public/${cues.tele}`;
  ok(cues.id === id && typeof cues.duration === "number" && Array.isArray(cues.lines), "cues.json shape (id, duration, lines)");
  ok(cues.audio === `audio/${id}.mp3` && cues.tele === `tele/${id}.bin`, "cues audio/tele paths");
  ok(existsSync(mp3) && existsSync(bin), "mp3 and tele bin exist");

  // ---- mp3
  const pr = spawnSync("ffprobe", ["-v", "error", "-show_entries", "format=duration:stream=sample_rate,channels,codec_name", "-of", "json", mp3]);
  const probe = JSON.parse(pr.stdout.toString());
  const st = probe.streams?.[0] ?? {};
  const mdur = +probe.format?.duration;
  ok(st.codec_name === "mp3" && +st.sample_rate === 48000 && st.channels === 2, `mp3 is stereo 48 kHz (${st.codec_name}, ${st.sample_rate}, ${st.channels} ch)`);
  ok(Math.abs(mdur - cues.duration) < 0.08, `mp3 duration ${mdur.toFixed(3)} s ≈ cues.duration ${cues.duration} s`);
  // decode and look at levels: no clipping, no silence, no DC
  const dec = spawnSync("ffmpeg", ["-v", "error", "-i", mp3, "-f", "f32le", "-ac", "2", "-ar", "48000", "pipe:1"], { maxBuffer: 1 << 30 });
  const pcm = new Float32Array(dec.stdout.buffer, dec.stdout.byteOffset, dec.stdout.byteLength / 4);
  let peak = 0, sum = 0, dc = 0, nan = 0;
  for (let i = 0; i < pcm.length; i++) {
    const v = pcm[i];
    if (!Number.isFinite(v)) nan++;
    else (peak = Math.max(peak, Math.abs(v))), (sum += v * v), (dc += v);
  }
  const rms = Math.sqrt(sum / pcm.length);
  ok(nan === 0 && peak < 0.999 && peak > 0.3, `decoded mp3 peak ${peak.toFixed(3)} (no clipping, not silent), rms ${(20 * Math.log10(rms)).toFixed(1)} dBFS`);
  ok(Math.abs(dc / pcm.length) < 1e-3, `no DC offset (mean ${(dc / pcm.length).toExponential(1)})`);
  // head/tail silence
  const lvl = (a: number, b: number) => {
    let p = 0;
    for (let i = Math.floor(a * 48000) * 2; i < Math.min(pcm.length, Math.floor(b * 48000) * 2); i++) p = Math.max(p, Math.abs(pcm[i]));
    return p;
  };
  ok(lvl(0, 0.25) < 0.02 && lvl(mdur - 0.4, mdur) < 0.02, `quiet head (${lvl(0, 0.25).toFixed(4)}) and tail (${lvl(mdur - 0.4, mdur).toFixed(4)})`);

  // ---- tele bin
  const tele = decodeTele(readFileSync(bin));
  const h = tele.header;
  ok(h.fs === 48000 && h.hop === 1536 && h.scalars.length === 10 && h.nArtic === 17 && h.scope === 8, `tele header (fs ${h.fs}, hop ${h.hop}, ${h.blocks.length} blocks, ${tele.data.length} data bytes)`);
  let chOk = true, offOk = true, prevEnd = 0;
  for (const b of h.blocks) {
    if (b.channels !== 10 + 17 + 3 * (b.nPh + b.nOr) + 8) chOk = false;
    if (b.offset % 4 !== 0 || b.offset < prevEnd) offOk = false;
    prevEnd = b.offset + b.channels * 8 + b.channels * b.frames * 2;
  }
  ok(chOk, "every block: channels = 10 + 17 + 3·(nPh+nOr) + 8");
  ok(offOk && prevEnd <= tele.data.length, "block offsets 4-aligned, in order, inside the data area");
  const dt = h.hop / h.fs;
  const bad: string[] = [];
  for (const l of cues.lines) {
    if (l.tele < 0) continue;
    const b = h.blocks[l.tele];
    if (!b) {
      bad.push(`line ${l.i}: block ${l.tele} missing`);
      continue;
    }
    const end = l.teleT0 + (b.frames - 1) * dt;
    if (l.teleT0 > l.t0 + 1e-3 || end < l.t1 - 1e-3) bad.push(`line ${l.i} (${l.who} ${l.kind}): block covers ${l.teleT0}–${end.toFixed(3)}, line ${l.t0}–${l.t1}`);
  }
  ok(!bad.length, `every line's block exists and covers [t0, t1]${bad.length ? "\n      " + bad.join("\n      ") : ""}`);
  ok(cues.lines.every((l: any) => l.tele >= 0), "every line has telemetry");
  const shared = cues.lines.length - new Set(cues.lines.map((l: any) => l.tele)).size;
  ok(true, `${cues.lines.length} lines → ${h.blocks.length} blocks (${shared} lines share a block)`);

  // ---- words / times
  const wbad: string[] = [];
  for (const l of cues.lines) {
    if (!(l.t0 >= 0 && l.t1 > l.t0 && l.t1 <= cues.duration)) wbad.push(`line ${l.i}: t0 ${l.t0} t1 ${l.t1}`);
    for (const w of l.words) if (!(w[0] >= l.t0 - 0.06 && w[1] <= l.t1 + 0.06 && w[1] >= w[0])) wbad.push(`line ${l.i}: word ${JSON.stringify(w)} outside ${l.t0}–${l.t1}`);
    if (l.kind === "say" && l.words.length !== l.text.split(/\s+/).filter(Boolean).length) wbad.push(`line ${l.i}: ${l.words.length} words for caption ${JSON.stringify(l.text)}`);
  }
  ok(!wbad.length, `line and word times inside the segment and their lines${wbad.length ? "\n      " + wbad.slice(0, 8).join("\n      ") : ""}`);
  ok(Object.values(cues.cues).every((t: any) => t >= 0 && t <= cues.duration) && cues.sfx.every((s: any) => s.t1 <= cues.duration + 0.3), "cues and sfx inside the segment");

  // ---- one decoded block against the clip's float telemetry (re-made from the cache)
  const script = (await import(pathToFileURL(`${ROOT}src/segments/${id}/script.js`).href)).default;
  const sayBeat = script.beats.find((b: any) => b.say);
  const line = cues.lines.find((l: any) => l.kind === "say" && l.text === sayBeat?.text);
  if (sayBeat && line) {
    const c = (CAST as any)[sayBeat.say];
    const clip: Clip = await sayClip({ body: c.body, f0: c.f0, rate: c.rate, accent: c.accent, source: c.source }, sayBeat.as ?? sayBeat.text, { rate: sayBeat.rate, f0: sayBeat.f0, accent: sayBeat.accent, intonation: sayBeat.intonation });
    const got = tele.block(line.tele);
    const t = clip.tele!;
    const b = h.blocks[line.tele];
    let worst = 0, worstCh = -1;
    if (b.frames === t.frames && b.channels === t.channels) {
      for (let c = 0; c < t.channels; c++) {
        let lo = Infinity, hi = -Infinity, err = 0;
        for (let f = 0; f < t.frames; f++) {
          const v = t.data[f * t.channels + c];
          lo = Math.min(lo, v), hi = Math.max(hi, v);
          err = Math.max(err, Math.abs(v - got[f * t.channels + c]));
        }
        const rel = hi > lo ? err / (hi - lo) : err;
        if (rel > worst) (worst = rel), (worstCh = c);
      }
      ok(worst < 1e-4, `block ${line.tele} ("${line.id ?? line.text}") decodes to the clip's telemetry: max error ${worst.toExponential(2)} of range (channel ${worstCh})`);
    } else ok(false, `block ${line.tele} shape ${b.frames}×${b.channels} ≠ clip ${t.frames}×${t.channels}`);
  }
  // every block: finite, and the outRms channel isn't flat
  let finite = true, alive = 0;
  for (let i = 0; i < h.blocks.length; i++) {
    const d = tele.block(i);
    const ch = h.blocks[i].channels;
    let mx = 0;
    for (let f = 0; f < h.blocks[i].frames; f++) {
      const v = d[f * ch + 6];
      if (!Number.isFinite(v)) finite = false;
      mx = Math.max(mx, v);
    }
    if (mx > 0) alive++;
  }
  ok(finite && alive === h.blocks.length, `all blocks decode finite, outRms moves in ${alive}/${h.blocks.length}`);

  const kb = (f: string) => (Bun.file(f).size / 1024).toFixed(0);
  const pass = results.every((r) => r[0]);
  console.log(`\n${pass ? "PASS" : "FAIL"} ${id}  (${cues.duration} s, ${cues.lines.length} lines, ${cues.sfx.length} sfx, ${cues.music.length} music; mp3 ${kb(mp3)} KB, tele ${kb(bin)} KB, cues ${kb(cuesFile)} KB)`);
  for (const [c, m] of results) console.log(`  ${c ? "ok  " : "FAIL"} ${m}`);
  return pass;
}

const args = process.argv.slice(2);
let ids = args.filter((a) => !a.startsWith("--"));
if (args.includes("--all")) ids = readdirSync(`${ROOT}src/segments`).filter((d) => existsSync(`${ROOT}src/segments/${d}/cues.json`));
if (!ids.length) {
  console.error("usage: bun tools/check.ts <segment-id> | --all");
  process.exit(2);
}
let allOk = true;
for (const id of ids) allOk = (await check(id)) && allOk;
process.exit(allOk ? 0 : 1);
