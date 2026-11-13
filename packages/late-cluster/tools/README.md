# The Late Cluster: offline audio tools

Every sound in the show comes from CHIMERA, a physical-modelling voice synth (`chimera/wasm`):
speech, singing, beatbox, audience laughter and applause. Nothing is sampled. The audio is
rendered offline by these tools. Each segment ships as one mixed mp3 plus compact telemetry
that the page replays on the 3D heads.

```sh
bun tools/render.ts demo            # render one segment (or several ids, or --all)
bun tools/render.ts --warm          # once per checkout: pre-render every sfx and creature call (about 80 s cold)
bun tools/render.ts demo --whisper  # render, then check every captioned line is intelligible
bun tools/analyze.ts whisper demo   # just the intelligibility check on the last render
bun tools/check.ts demo             # verify the three outputs against the contract
bun tools/analyze.ts mp3 demo       # loudness/brightness per 5 s of a rendered segment
bun tools/analyze.ts sfx [names]    # stats for the audience/band library
bun tools/analyze.ts voices [ids]   # each cast voice saying two test sentences (--wav dir --whisper)
```

Every clip render (a line, a sung phrase, a beat, a crowd voice) is cached on disk in
`tools/.cache/` (gitignored). The cache key is everything that shapes the sound. Edit one line
and only that line re-renders: a cached segment re-mixes in about a second. A cold render
runs at roughly 4× real time, so a 45 s segment takes about 20 s. To drop every cached render,
bump `CACHE_VERSION` in `clips.ts`.

**Several authors, one checkout.** Render **only your own segment id**: no `--all`, and nobody
else's segment. A render takes a lock on its id (`tools/.cache/locks/<id>.lock`), so a second
render of the same id stops with a message. Renders of different ids run in parallel safely:
- They write disjoint files (`public/audio/<id>.mp3`, `public/tele/<id>.bin`,
  `src/segments/<id>/cues.json`), each through a temp file and an atomic rename.
- They share `tools/.cache`. Cache entries are also written through a unique temp file and a
  rename.
- A truncated or corrupt entry is detected and re-rendered.

Run `--warm` once after a fresh checkout, or after bumping `CACHE_VERSION`, so the crowd, the
band stings and the creatures are rendered once rather than by every author. These were
tested by running two `--warm`s and the demo render concurrently on a cold cache: no temp
files were left behind, the entries were byte-identical to a serial run, and a concurrent
second `demo` render was refused.

| file | what it does |
|---|---|
| `engine.ts` | loads the wasm under bun, does G2P (CMUdict), and provides `Voice` (one engine instance per voice; `renderTracked` snapshots telemetry every 1536 samples) |
| `clips.ts` | cached clip renderers: `sayClip`, `singClip`, `beatClip`, `hitClip`, `vocalClip` (explicit segments + pitch contour, used for crowd noises), `creatureClip` (bestiary calls or gated, pitch-glided notes) |
| `sfx.ts` | the audience and band library (below) |
| `render.ts` | script → timeline → mix → `public/audio/<id>.mp3`, `public/tele/<id>.bin`, `src/segments/<id>/cues.json` |
| `telebin.ts` | the tele bin encoder/decoder |
| `check.ts`, `analyze.ts` | verification |

---

## Writing a segment script

A segment is `src/segments/<id>/script.js`. It holds a default export of plain data and no code.
`<id>` must match the directory name. Render it with `bun tools/render.ts <id>`. The tool prints
a timeline: every line's start and end time, its duration and the IPA that was actually
pronounced. Read it. A mangled name shows up in the IPA right away.

### Complete example

```js
// src/segments/demo/script.js
export default {
  id: 'demo',
  title: 'Demo: Cold Open',
  gap: 0.28,                       // default pause before each spoken/sung line (s)
  beats: [
    { sfx: 'applause-long', hold: 0.18 },               // start with an ovation; talk over its tail

    // say: who (a cast id from src/cast.js) + text (the caption)
    { say: 'larry', id: 'hello', text: 'Good evening, Bluesky! Welcome to The Late Cluster.',
      as: 'Good evening, blue-sky! Welcome to the late cluster.' },   // `as`: what is pronounced
    { say: 'larry', text: "I'm your host, Larry Nx.", as: "I'm your host, Larry En-Ex." },
    { say: 'sibyl', id: 'interrupt', text: 'Larry, the simcluster is trending again.', overlap: 0.35 },
    { say: 'larry', text: "Again? It's been trending since Tuesday!" },
    { sfx: 'laugh' },                                    // next laugh variant, at the cursor
    { cue: 'chart-in', at: -0.2 },                       // a named visual marker
    { say: 'sibyl', text: 'Your feed says you are ninety percent posting, and ten percent vibes.',
      rate: 1.05, f0: 205, accent: 0.3, intonation: 'statement', vol: 1.0, pan: -0.2 },
    { say: 'larry', text: 'Finally, an algorithm that understands me.' },
    { sfx: 'rimshot', at: 0.1 },
    { sfx: 'chuckle', at: -0.4, hold: 0 },               // overlaps the rimshot, doesn't move the cursor
    { call: 'seal', name: 'zap', at: -0.2, hold: 0, vol: 0.7 },   // a creature call as a punchline
    { wait: 0.3 },

    // sing: one lyric syllable per sounding note; notes are [midi, beats], midi <= 0 is a rest
    { sing: 'larry', id: 'ditty', bpm: 112, lyrics: 'sim cluster, sim cluster, what is in my feed',
      notes: [[52,.5],[55,.5],[57,1],[52,.5],[55,.5],[57,1],[59,.5],[57,.5],[55,.5],[52,.5],[50,1.5]] },
    { sfx: 'aww', at: 0.1 },
    { say: 'larry', text: 'Hit it, Formants!' },

    // music: tracks share one clock. Beat 0 is the block's t0 for every track.
    { music: { id: 'stomp', bpm: 100, tracks: [
      { who: 'larry', id: 'stomp-lead', caption: true,
        lyrics: "we post into the void, and the void posts back",
        notes: [[45,.5],[48,.5],[48,.5],[50,.5],[52,.5],[52,.5],[0,1],
                [52,.5],[50,.5],[48,.5],[50,.5],[45,1],[0,1]] },
      { who: 'pete', beat: 'B . . . | ! . . . ', loops: 4, vol: 0.9 },           // stomp / clap
      { who: ['hy', 'al', 'dee'], shout: 'hey', beats: [3, 7], vol: 0.9 },       // on beats 3 and 7
    ] } },
    { sfx: 'sting', at: 0.05 },
    { sfx: 'applause', at: -0.4, hold: 0.2 },
    { say: 'sibyl', text: 'Stay clustered. We will be right back!', gap: 0.1 },
  ],
}
```

### Beat kinds

A cursor walks the beats in order. It starts 0.3 s into the segment.

**`say`**: a spoken line.

| key | meaning |
|---|---|
| `say` | cast id (required) |
| `text` | the caption shown on screen (required) |
| `as` | what is actually pronounced (a respelling). The caption stays `text`. Give `as` the **same number of space-separated words** as `text` so word timings map back onto the caption words, and join multi-word respellings with hyphens (`blue-sky`, `En-Ex`). Otherwise caption words are spread evenly over the line, and the tool prints a note. |
| `id` | optional line id (unique within the segment), copied to cues.json |
| `gap` | pause before the line (s). Defaults to the script's `gap`, and to 0 for the first line. |
| `overlap` | start this much earlier, over the previous line (an interruption) |
| `rate`, `f0`, `accent` | per-line overrides of the cast voice. `rate` multiplies the cast rate. |
| `intonation` | `statement` \| `question` \| `flat`: overrides the punctuation-derived contour of every phrase in the line |
| `vol` | gain multiplier (default 1) |
| `pan` | −1..1 (default: the cast member's pan) |
| `caption` | `false` to hide the caption |

The line starts at `cursor + gap − overlap`. The cursor then moves to where the speech ends
(the clip's silent tail is ignored).

**`sing`**: a sung phrase by one voice. Keys: `sing` (cast id), `bpm`, `lyrics`, `notes`
(`[[midi, beats], …]`; `midi <= 0` is a rest), plus optional `id`, `gap`, `overlap`, `vibrato`
(cents, default 30), `transpose` (semitones), `vol`, `pan`, `caption`, and `text` (a caption
that differs from the lyrics). It is laid out like `say`. The line ends with the last sung note.

**`sfx`**: an audience or band sound from the library below. `{ sfx: 'laugh' }` picks the next
variant round-robin. `{ sfx: 'laugh-2' }` picks variant 2. The sound starts at `cursor + at`, and
`at` may be negative. Optional `pan` (a balance shift, −1..1) and `duck` (0..1, below). The cursor then advances by `hold × (sound length)`. `hold` runs 0..1 and
defaults per sfx (about 0.3–0.55 for crowd sounds, 1 for rimshot and sting). `hold: 0` lays a
sound under what follows without waiting. `vol` scales it. While anyone says a line or sings a
captioned line, sfx automatically duck by about 9 dB, so dialogue reads through laughs and
applause.

Every sfx has a duck depth. Crowd sounds duck fully. Studio one-shots (ding, buzzer, tick, tada,
drumroll) duck partly, and creature calls barely duck (they are punchlines and should cut
through). `duck: 0..1` on the beat overrides it. `pan: −1..1` on an sfx beat is a balance shift.

**`call`**: a specific creature call, used as a punchline:
`{ call: 'seal', name: 'zap', pitch: 4000, vol: 0.8, pan: 0.3, at: -0.1, hold: 0.5, duck: 0.15 }`.
`call` is a creature id and `name` is one of its call ids (default: the creature's first call).
`pitch` (Hz) re-pitches calls that have a reference pitch. It works on every call except the
alligator's `hiss` and the elephant's `trumpet` and `squeak`, which ignore it. It is laid out
like an sfx: `at`, `hold` (default 0.8), `vol`, `pan`, `duck` (default 0.15). In cues.json it
appears under `sfx` as `call:seal/zap`. The ready-made creature sfx below (`caw`, `cluck`,
`seal`, `gator`, `trumpet`) are tuned designs and are usually what you want.

| creature | calls (id: length, reference pitch) |
|---|---|
| `songbird` | `flute` 1.3 s 2600 Hz · `trill` 1.2 s 3000 Hz · `chirps` 0.7 s 4500 Hz · `buzz` 0.7 s 1200 Hz |
| `seal` (Weddell) | `trill` 3.8 s 3600 Hz (a long descending sci-fi trill) · `zap` 0.2 s 6000 Hz (laser chirp) · `whistle` 0.8 s 1700 Hz · `chug` 0.9 s 90 Hz (quiet) |
| `alligator` | `bellow` 2.0 s 28 Hz · `growl` 0.6 s 45 Hz · `hiss` 1.4 s · `dance` 1.8 s 18 Hz |
| `elephant` | `rumble` 3.2 s 14 Hz · `trumpet` 1.3 s · `squeak` 0.6 s |

**`wait`**: `{ wait: 0.6 }` moves the cursor that many seconds. Negative values are allowed.

**`cue`**: `{ cue: 'chart-in', at: -0.2 }` names a moment for the page (cursor + `at`).
Names must be unique.

**`music`**: `{ music: { id, bpm, tracks: [...], gap?, swing? } }`. Beat 0 falls `gap` (default
0.25 s) after the cursor. Every track counts beats (quarter notes, 0-based) from that one
sample, so melodies, beatbox and shouts are sample-aligned. The cursor moves to the end of the
longest track. Each track has exactly one of:

| track kind | keys |
|---|---|
| sung melody | `who`, `lyrics`, `notes`, optional `caption` (default **false** in music; set `true` for the lead), `vibrato`, `transpose`, `id` |
| beatbox | `who`, `beat` (CHIMERA beat text, below), `loops` (default 1), `swing` (0..0.5) |
| shouts | `who`, `shout` (text), `beats: [3, 7, 11, 15]` (the shout's first vowel lands on each beat), optional `as`, `f0` (default 1.3 × the cast f0; shouted with the shout patch, below) |

All tracks also take `vol`, `pan` and `start` (a beat offset for the whole track). `who` may be
an array: each member renders separately with their own voice and pan.

Beat text: steps are sixteenths, `.` is a rest, and `|` is only visual. Sounds: `B` kick, `t`
hat, `tss` open hat, `Pf` snare, `K` rimshot, `^K` inward snare, `!` tongue click (a clap),
`P!` lip pop, `kch` crash, `m` hum (`m:43` hums MIDI 43). So `B . . . | ! . . .` is two beats
of stomp, clap. Loop it 8 times for four bars of 4/4.

### Validation

The renderer stops with a pointed message when the script has:
- an unknown cast id (it lists the cast), an unknown sfx (it lists the library), or an unknown key on a beat;
- a syllable/note mismatch (it prints the syllables it found, e.g. `sim- clus- ter what is …`);
- a bad note (`[midi, beats]`, MIDI 28..96), a beat pattern with no sounds, or a duplicate cue or line id;
- a number out of range (rate 0.5–2, f0 50–500, pan −1..1, …).

---

## Outputs (the contract with the page)

1. **`public/audio/<id>.mp3`**: stereo, 48 kHz, libmp3lame 96 kbps. 0.3 s of lead-in, about
   0.6 s after the last sound. Equal-power pan, then a 10 Hz DC guard.
   - **Loudness:** the whole mix gets one gain so that the dialogue (all `say` lines, gated
     BS.1770 loudness) sits at **−17 LUFS** in every segment. Back-to-back segments then match
     in speech level, and music and sfx keep their balance against the dialogue.
   - **Limiter:** a look-ahead limiter on the **4×-oversampled true peak**, with a −1.5 dBTP
     ceiling (`tools/loudness.ts`).
   - **Decoded-peak check:** the mp3 is encoded, decoded and measured, and the whole mix is
     trimmed and re-encoded if the decoded peak is above 0.97 (mp3 adds its own overshoot).
   - The render prints the integrated loudness, the dialogue gain and the decoded peak.
2. **`public/tele/<id>.bin`**: gzip of `LCT1` + u32 LE jsonLen + a JSON header (space-padded
   to a multiple of 4) + a data area. Header:
   `{ fs:48000, hop:1536, scalars:[phLen, orLen, velumPort, f0, voicing, pLung, outRms, noiseLevel, noiseNode, gate], nArtic:17, scope:8, blocks:[{frames, channels, nPh, nOr, body:{female,child}, offset}] }`.
   A block is `Float32LE[channels×2]` (min, step) followed by `Uint16LE[channels×frames]`,
   channel-major. Each channel is delta-coded mod 65536, with the first value absolute. Each
   block is padded to 4 bytes. Channels per frame: 10 scalars, 17 artic, phAreas(nPh),
   orAreas(nOr), pressureRms(nPh+nOr), flow(nPh+nOr), 8 glottal-area points. Lines that reuse
   the same clip (repeated shouts) share a block.
3. **`src/segments/<id>/cues.json`**: `{ id, title, duration, audio, tele, lines, cues, sfx, music }`.
   Each line is `{ i, id?, who, kind: say|sing|beat|shout, text, caption, t0, t1, words: [[t0,t1,word]…], tele, teleT0 }`.
   All times are segment seconds (the mp3's clock), rounded to ms. Frame *k* of block `tele`
   is at `teleT0 + k·hop/fs`. `sfx` entries are `{ name: 'laugh-1', t0, t1 }`, and `music`
   entries are `{ id, t0, bpm, beats }`.

`bun tools/check.ts <id>` re-reads all three outputs and checks them against this contract.

---

## The audience and the band (`sfx.ts`)

All sfx are made from CHIMERA voices, seeded so they come out the same on every render. The
crowd sits in a small synthetic room (a Schroeder reverb) and is mixed well under dialogue
level.

| name | variants | length | made of |
|---|---|---|---|
| `laugh` | 3 | ~1.6 s | 12 crowd voices (random body, pitch, rate, breathiness), each 3–6 "h+vowel" pulses falling in pitch, staggered and panned wide |
| `biglaugh` | 2 | ~2.0–2.5 s | 22 voices with longer laughs, plus two woos |
| `chuckle` | 2 | ~1.0 s | 3–4 soft, breathy "heh heh" voices |
| `groan` | 2 | ~1.7 s | 9 voices holding "oh", pitch falling to about 70 % |
| `ooh` | 2 | ~1.6 s | 9 voices on "ooh", rising about 40 % then settling |
| `aww` | 2 | ~1.5 s | 9 voices on "ah", high and falling |
| `woo` | 2 | ~1.35 s | 3 rising "woo"s |
| `applause` | 2 | ~3.3 s | ~450 tongue clicks, hats, snares and lip pops from 4 bodies, high-passed and cut short like claps, with random gain, pan and pitch, plus a swell-and-decay density envelope |
| `applause-long` | 1 | ~5.8 s | the same, longer, with three woos |
| `rimshot` | 1 | ~1.6 s | Pete: snare, kick, crash (ba-dum-tss) |
| `sting` | 2 | ~2.1 s | the Formants (Dee, Hy, Al) scat a four-note figure in three-part harmony, with Pete on kick and crash |

Studio one-shots, all from mouths:

| name | variants | length | made of |
|---|---|---|---|
| `ding` | 2 | ~0.8 s | game-show correct: two bright voices sing "ding" a sixth apart (MIDI 84+76; v2 81+72), with a bell-like exponential decay on the ŋ hum. Centroid 2.5–3.5 kHz |
| `buzzer` | 2 | ~0.9 / 0.7 s | wrong answer: two pressed, rough, saturated voices a tritone apart (92 and 130 Hz) on a flat "ehhh" |
| `tick` | 3 | 0.05 s | one clock tick: a tongue click (male or female body) or a rimshot click, high-passed |
| `ticktock` | 1 | ~2.6 s | six alternating tick/tock clicks at 2 per second |
| `whoosh` | 2 | ~0.6 / 0.75 s | voiceless ʃ, f and h layered, swelling and swept left→right (v2 right→left). Centroid about 6.7 kHz |
| `tada` | 2 | ~1.15 s | Dee, Hy and Al sing "ta-dah!" (pickup into a held major chord) |
| `drumroll` | 2 | ~2 s | Pete's snare re-struck 16 times a second with a crescendo, then crash + kick (v2 alternates snare and hat) |
| `gasp` | 2 | ~0.8 s | 12 crowd voices at once: a breathy "hah!" (v1) or "oh!" (v2), pitch jumping up |
| `hey` | 2 | ~0.7 s | 12 crowd voices shout HEY! together |
| `murmur` | 2 | ~2.9–3 s | 14 crowd voices chatting quietly, low-passed so no words come through. A bed: `hold` 0.2 by default |
| `silence-cough` | 1 | ~1 s | one lonely "ahem" from the back right |

Creature punchlines (barely ducked):

| name | variants | length | made of |
|---|---|---|---|
| `caw` | 2 | ~1.0 / 0.6 s | crow-ish: the songbird overdriven, low purity, pitched down to 900→600 Hz with a falling glide. v1 is "caw caw", v2 a single caw |
| `cluck` | 2 | ~1.1 / 0.75 s | the songbird short and low (~600 Hz): v1 "buk buk buk-BAAK", v2 four clucks |
| `seal` | 2 | ~0.9 / 1.1 s | the Weddell seal pulsed at 20–25 Hz around 300 Hz: two (v2: three) barks |
| `gator` | 2 | ~0.8 / 2.1 s | the alligator's `growl` (v1) or `bellow` (v2) |
| `trumpet` | 2 | ~1.3 / 1.65 s | the elephant's `trumpet`, its opening spike soft-clipped. v2 is resampled 0.8× (lower and longer), because the call ignores `pitch` |

To add one, write a maker in `SFX` (see `laughMix`, `glideMix` and `applauseMix`), then run
`bun tools/analyze.ts sfx <name> --wav /tmp/x` and look at the numbers. Applause should show a
centroid around 4 kHz with 0 % voiced. Laughs show a few hundred Hz with partial voicing. Every
sound needs a plausible envelope sparkline with no NaN or DC.

---

## Voice design

A cast entry (`src/cast.js`) sets `body`, `f0`, `rate`, `accent`, `source` and `pan`. The numbers
below come from a sweep: one sentence per setting, checked for NaN, level, voicing and a Whisper
(base.en) transcription. No setting produced NaN or silence. The failure modes are saturation
and lost intelligibility. Every clip is peak-normalized afterwards, so loudness is not a voice
parameter: use `vol` in the script for that.

| param | what it does | safe | breaks |
|---|---|---|---|
| `body.female` | anatomy from adult male (0) to adult female (1). It sets formants and vocal-tract length, and it shapes the 3D head | 0–1 | — |
| `body.child` | adult (0) to child (1): a smaller tract | 0–0.4 | ≥ 0.5 loses intelligibility quickly (Whisper got 1–2 of 8 words at child 1) |
| `f0` | speaking pitch, Hz | men 85–150, women 165–260 | < 85: voicing falls apart (creaky and unvoiced). > 280: the engine output saturates (it pins at 0.75 raw) and words smear |
| `rate` | speaking-rate multiplier | 0.8–1.3 | 1.6 smears, 2.0 is unintelligible |
| `accent` | pitch excursion on stressed syllables | 0.1–0.4 (0 is flat and robotic, 0.3+ is animated) | 1.0 saturates |
| `source.breathiness` | aspiration noise | 0–0.5 | 1.0 is nearly a whisper (−7 dB, noisy) but still intelligible |
| `source.tension` | vocal-fold tension: pressed and bright vs lax and soft | 0.3–0.7 (default 0.5) | 1.0 saturates |
| `source.fry` | creak, vocal fry | 0–0.2 | 0.5 cuts voicing to about 30 % and hurts intelligibility |
| `source.roughness` | cycle-to-cycle irregularity, rasp | 0–0.6 | subtle even at 1 |
| `source.brightness` | spectral tilt (default 0.25) | 0–0.6 | 1.0 saturates |
| `source.pressure` | lung pressure, i.e. effort (default 8) | 6–10 | ≥ 11 saturates |
| `source.drift` | slow pitch wander, cents | 0–60 | harmless |
| `vibratoDepth/Rate`, `glide` | no audible effect on speech (the planner drives pitch). Sung lines use `vibrato` | — | — |

**Shouts** (music `shout` tracks and the `hey` sfx) use a shout source patch: pressure 11.5,
tension 0.8, brightness 0.55, breathiness 0.1. They are pitched to 1.3× the cast f0 with accent
0.45. Compared with a plain spoken "hey", the shouted one has a spectral centroid 3–4× higher
(hy 470 → 1760 Hz, dee 580 → 2450 Hz) and a 5 ms attack instead of 20–90 ms. The patch saturates
on purpose: a harsh shout is the goal.

"Saturates" means the raw output hits the engine's ceiling and the waveform squares off: a
harsher timbre, not a level problem. `bun tools/analyze.ts voices` renders each cast voice so
you can check a new entry.

**Making a new guest distinct.** Put the guest somewhere empty in (body, f0) space first. These
two carry most of a voice's identity. `bun tools/analyze.ts voices` prints each voice's median
f0, its spectral centroid and its three nearest neighbours. Distance combines pitch (semitones
÷ 2) and the long-term average spectrum (rms dB difference ÷ 2.5). Below about 1.5, two voices
are easy to confuse. In the final cast every voice's nearest neighbour is at least 1.5 away
(before tuning, Dee and Borjev were 0.48 apart and Hy and Norvid 0.77). The cast as tuned
(median f0 is measured, so accent raises it above the set f0):

| id | role | body f/c | f0 (median) | rate | accent | source | nearest |
|---|---|---|---|---|---|---|---|
| larry | host | 0 / 0 | 104 (107) | 1.0 | 0.16 | breath 0.12, tension 0.5 | pete 1.54 |
| al | bass | 0 / 0 | 84 (79) | 0.95 | 0.14 | tension 0.45, fry 0.2 (gravel) | abel 2.31 |
| abel | low, fast, breathy | 0 / 0 | 92 (101) | 1.26 | 0.24 | breath 0.55, tension 0.35, bright 0.1 | larry 2.02 |
| pete | percussion | 0.65 / 0.4 | 115 (119) | 1.05 | 0.18 | tension 0.55, bright 0.4 | larry 1.54 |
| hy | bandleader | 0.35 / 0 | 135 (143) | 0.95 | 0.2 | breath 0.3, tension 0.42, bright 0.12 (warm) | dee 1.79 |
| norvid | dry, clipped, croaky | 0.25 / 0.15 | 160 (138) | 1.2 | 0.1 | tension 0.66, rough 0.5, fry 0.2, bright 0.5 | pete 1.92 |
| dee | alto | 0.9 / 0.1 | 155 (159) | 1.0 | 0.18 | breath 0.18, tension 0.45, bright 0.25 | borjev 1.52 |
| borjev | small odd bot | 0.1 / 0.4 | 178 (175) | 0.95 | 0.05 | tension 0.62, rough 0.6, bright 0.3, drift 40 | dee 1.52 |
| eppy | shouty sports | 0.15 / 0.2 | 165 (189) | 1.16 | 0.36 | tension 0.68, bright 0.55 | borjev 1.82 |
| sibyl | announcer | 1 / 0 | 196 (207) | 1.04 | 0.2 | breath 0.2 | borjev 1.79 |
| samantha | broadcast | 1 / 0.15 | 228 (253) | 1.08 | 0.32 | breath 0.08, bright 0.5 | bot 1.84 |
| bot | chirpy, flat | 0.5 / 0.4 | 275 (274) | 1.18 | 0.06 | tension 0.7, bright 0.6 | samantha 1.84 |

Rate and accent separate voices too: the table's distance doesn't measure them. Abel at 1.26
and Larry at 1.0 sound very different at nearly the same pitch (101 and 107 Hz).

Whisper (base.en) on the two test sentences: every voice gets "Good evening, and welcome back
to the show." 8/8. The harder "…the feed knows what I had for breakfast?" scores 7–10 of 13
for every voice, the host included, so that is the G2P and engine rather than any one voice.
Overall scores are 71–86 % per voice: al 86, hy 81, eppy 81, borjev 81,
larry 76, sibyl 76, dee 76, pete 76, bot 76, abel 76, norvid 71, samantha 71.

To add a guest, find an open spot. Gaps left: about 120–130 Hz with a neutral male body, about
200 Hz with body 0.3–0.5 / child 0, and 240–250 Hz breathy. Then set the attitude: `rate` (0.9
deliberate, 1.2 hurried), `accent` (0.05 robotic, 0.35 excitable), breathiness 0.3+ (intimate),
fry or roughness (croaky), and brightness with tension (brassy). Run
`bun tools/analyze.ts voices <id> --wav /tmp/v --whisper`: keep the nearest distance at 1.5 or
more and the Whisper score near the others. Pan guests away from whoever they talk to.

**Respelling with `as`.** Unknown words go through letter-to-sound rules, which are often
wrong. Watch the IPA in the timeline, then check with `--whisper`. Join multi-word respellings
with hyphens so the caption's word timings still map. Watch out: **each hyphen part is G2P'd as
its own word, and function words get their weak form**. `for-mints` comes out /fəɹ/, `at-proto`
/ət/ and `nor-vid` /nəɹ/. Spell those parts so they aren't function words (`four`, `att`, `nore`).

These were tested on Larry in "Next up, X, live.", with the IPA and what Whisper heard:

| caption | best `as` | IPA | notes |
|---|---|---|---|
| Bluesky | `blue-sky` | bluskaɪ | as-is gives /blʌɛski/ ("Bloskey") |
| simcluster | `sim-cluster` | sɪmklʌstɚ | the same IPA as-is, but the hyphenated form was the one Whisper got right ("Simcluster") |
| Formants | as-is | fɔɹmənts | Whisper: "formants". Avoid `for-mints` (reduced /fəɹ/) |
| vibecoded | `vibe-coded` | vaɪbkoʊɾɪd | as-is gives /vaɪbɛkoʊdd/ |
| bsky | `bee-sky` | biskaɪ | as-is gives /bski/. Say `blue-sky` if you mean the site |
| gm | `gee-em` (or `good-morning`) | dʒiɛm | the letters are read out anyway. Whisper doesn't parse bare letters |
| gn | `gee-en` (or `good-night`) | dʒiɛn | as-is gives /gn/, which is unpronounceable |
| atproto | `att-pro-toe` | ættpɹoʊtoʊ | as-is gives /ætpɹoʊɾɑ/ ("Ask Prada"). `at-proto` reduces to /ət/ |
| Piranesi | `pier-ah-nay-see` | pɪɹɑneɪsi | Whisper: "Piranesi". As-is gives /pɝeɪnɛsɪ/ |
| norvid | as-is | nɔɹvɪd | correct. `nor-vid` reduces to /nəɹ/ |
| Jevbot | `jev-bot` | dʒɛvbɔt | as-is is also fine (/dʒɛvbɑt/) |
| catoid | `cat-oid` | kætɔɪd | as-is gives /keɪɾɔɪd/ ("Kay-toyed") |
| Top Chicken | as-is | tɑptʃɪkən | correct. Whisper mishears "top" as "tap" |
| Nx | `En-Ex` | ɛnɛks | as-is gives /nks/ |
| Abelian | `a-bee-lee-an` | əbiliən | as-is gives /eɪbɛlɪæn/ |
| AI | `ay-eye` | eɪaɪ | as-is gives "eye" |
| skeet | as-is | skit | in the dictionary |

**Checking a segment's intelligibility.** `bun tools/render.ts <id> --whisper` (or
`bun tools/analyze.ts whisper <id>` after a render) cuts every captioned line out of the
*final mix* (0.12 s before to 0.18 s after the line), so whatever is under it counts. Each cut
is padded with 0.6 s of digital silence, because Whisper hallucinates ("Thank you.",
"Cheers!") on sub-second clips that touch the clip edge. All cuts are transcribed in one local
Whisper (base.en) run. It prints caption vs heard per line with a word score: ✓ ≥ 85 %, ~ ≥ 60 %,
✗ below. Digits and % are normalized ("90 %" counts as "ninety percent") and compounds count
("Simcluster" covers "sim cluster"). "build" counts as "built", because the t of "built it" is
flapped and the two are indistinguishable. Whisper doesn't know invented names, so judge those by
the IPA. The demo scores 62/82 caption words (76 %), and the sung music lead is the weakest.
Fix a weak line by respelling it, slowing it down (`rate: 0.9`), giving it more `gap` from a
loud sfx, or lowering the sfx's `vol`.

**Sounds the engine makes weakly, whatever the voice.** These come from a lab pass on every
voice: isolated and in-context renders, several noise levels, Whisper base.en. They are
articulation limits in the engine, and no respelling or voice setting fixed them:
- **/tʃ/ before /ɪ/** ("chicken" → "written", "returned"). The affricate comes out as a noisy
  burst with almost no vowel after it. More than a dozen spellings failed (chick-in, chikkin,
  chih-kin, chiggin, …). The only ones Whisper took as "chicken" were `shicken`/`Top Shicken`
  (2/3), and a person would hear "shicken", so they are not used. Caption the word and accept it.
- **/dʒ/** ("joke" → "broke", "drug"). `djoke` (an extra closure) worked 3/3 in the monologue
  line and 0/3 in the cold-open lines.
- **Initial /k/ + /l/** ("claim" → "flame", "lame"). Nothing helped, including `klame`, `kleym`
  and pressure 10–11.5.
- **Final /ŋ/ after /p/** ("Pong" → "on", "pun"). Nothing robust.
- **/w/ onsets** sometimes heard as /l/ or /b/ ("week" → "leap", "Even" → "Being").
- **"Acknowledged"** comes out as "ignorate". Dropping the final d (`as: 'Acknowledge.'`) gives
  2/3.
- **"heuristic"**: `hew-ristic` at rate 0.95–1.05 works. At rate 0.8 it doesn't.

Slowing a line down doesn't fix a weak consonant (rate 0.7 was often *worse*). A presence boost
(+4 or +8 dB high shelf at 2 kHz, on all 234 lines) changed Whisper's score by 0.1 %.

**"Built it."** (the runner): `{ say: 'bot', text: 'Built it.', rate: 0.9 }` with the bot's base
rate at 1.0, so the effective rate is 0.9. It is reliably heard as "Build it" / "Built it" in
isolation (40/40 variants) and against a laugh starting at the line's end (211/240 across
voices and spellings; every failure was the hyphenated `Built-it.` spelling). What breaks it in
a mix is an sfx *under* it: a buzzer or gasp overlapping the line, or a creature call with its
low duck depth. Start sfx 0.15 s after it, or give them `duck: 1`.

**The Whisper score is noisy.** Unchanged lines change their transcription when anything else
in the mix shifts, even a 1 dB global gain change. Segment totals move ±3–5 % run to run for
that reason alone. Compare individual lines, not segment percentages, and re-check a fix in
the lab (isolated, padded) before believing it.

**How the G2P handles text** (CMUdict plus letter-to-sound):
- Numbers are read out: `2025` → "two thousand twenty five", `90%` → "ninety" (**the % sign is
  dropped**, so write "percent"), `$3.50` → "three fifty" (no "dollars"), `3:30` → "three
  thirty", `2.5` → "two. five". Ordinals break: `1st` → "one street". Write words.
- Abbreviations: `Dr.` → "drive", `AI` → "eye", `LOL` → "lol" (rhymes with "doll"), `e.g.` →
  "e. g." Respell them (`as: 'doctor'`, `'ay-eye'`).
- Handles and URLs: `@jay.bsky.social` → "jay. bsky. social". Each `.` ends a phrase (a 0.35 s
  pause) and `bsky` is mangled. Respell as `jay-dot-blue-sky-dot-social` (one caption word,
  one hyphenated token). `#` and `@` are silent.
- Words the engine says poorly whatever the voice: "feed" (heard as "kid" or "hit"), "had for"
  (heard as "heard through"), "Tuesday" (heard as "two days" or "2D"), and a phrase-final
  "live". If a punchline depends on one of these, rephrase it.
- Hyphenated words are one word (`mm-hmm`, `blue-sky`). Em dashes, quotes and parentheses are
  ignored and add no pause, so use a comma.

**Punctuation shapes prosody.** Each `,` `;` `:` ends a phrase with a short pause (0.18 s).
`.` `!` `...` end one with a longer pause (0.35 s) and a falling statement contour. `?` gives
that phrase a rising question contour, and `?!` counts as a question. The beat's `intonation`
overrides every phrase in the line (`flat` sounds robotic). For a dramatic pause, split the
line into two beats and set `gap`.

**Singing.** Use one syllable per sounding note. The error message prints how the lyrics were
split. Unknown words can become several syllables or a melisma (`~`), so prefer dictionary
spellings (scat: `bah`, `dah`, `doo`, `wah`). Tested so far: Larry
(male) MIDI 45–59, Al 41–52, Hy 64–71, Dee 67–74.

**Intelligibility check** (optional): `bun tools/analyze.ts voices --wav /tmp/v --whisper` runs
a local `whisper` if one is installed. In the full demo mix, Whisper base.en recovers nearly
every line, including the sung ones under the band, and the closing line under applause.

---

## Rendering video (`video.mjs`)

Renders the show to mp4 for posting: frame-exact and offline, never a screen recording. Run it
with node (not bun), from the package directory. Output goes to `video/`, which is gitignored.
The scene list and the clip numbers (`01-…`) come from `src/rundown.js` at run time. Re-render
only the segments that changed, then rebuild the full files with `--full --bluesky`. Rename
clips by hand if the order changed.

```sh
node tools/video.mjs --all --bluesky    # every clip + late-cluster-full.mp4 + late-cluster-bluesky.mp4
node tools/video.mjs --all              # every clip (01-…, numbered by the rundown) + late-cluster-full.mp4
node tools/video.mjs song               # one clip (or several ids)
node tools/video.mjs --full             # rebuild late-cluster-full.mp4 from the clips already in video/
node tools/video.mjs --bluesky          # rebuild only the posting cut, from the clips (second generation)
node tools/video.mjs cold-open --frames 90   # a 3 s test → video/test-01-cold-open.mp4
```

Options: `--jobs 3` (segments in parallel, each in its own browser), `--scale 1.5` (stage backing
store: 1.5 gives 1920×1080, 1 gives 1280×720), `--crf 16`, `--preset slow`, `--out dir`. Temp
files go to `$TMPDIR`. On an M3 Max, `--all --jobs 4` takes about 8 minutes.

**The posting cut** (`--bluesky`; tune it with `--max-mb 280 --max-seconds 600 --out-name
late-cluster-bluesky.mp4`) is the whole episode for Bluesky, which allows 10 minutes and
300 MB. The CRF-16 master is too big for that. The cut is a two-pass x264 encode at the video
bitrate that fits the size limit: the limit less 2 % for the container, less 192 kb/s for the
AAC. If the result comes out over the limit, pass 2 is re-run at a lower bitrate. It refuses an
episode at or over `--max-seconds`.

With `--all --bluesky`, each segment also writes a lossless (x264 `-qp 0`) copy of the same
yuv420p frames to the temp folder. The posting cut is encoded from those, so it is a first
generation like the master. That takes about 1 GB per minute of temp space while it runs. A
`--bluesky` without `--all` re-encodes the CRF-16 clips instead, and says so.

**The YouTube build** is for platforms that show their own subtitles.

```sh
node tools/video.mjs --youtube          # late-cluster-youtube.mp4 (+ .srt, .vtt): no burned-in captions
node tools/video.mjs --subs             # only late-cluster-youtube.srt / .vtt (about 10 s, no pictures)
node tools/video.mjs song --no-captions # a clip without captions → video/07-song-nocaps.mp4
```

`--youtube` re-renders every segment with the stage's caption system off, using
`stage.draw(show, { captions: false })`, the same switch as the app's CC button. It then
assembles the full episode like the master: CRF 16, the same audio, the same per-clip frame
counts. The normal clips and full files are untouched, and still have captions. Turning
captions off removes two things:
- the caption bar: the speaker tag and the line with its lit word;
- the `[ LAUGHTER ]` / `[ APPLAUSE ]` box that replaces it when nobody is talking.

Everything a segment draws itself stays: chyrons, post cards, the APPLAUSE/LAUGH sign, the
BUILT counter, the disclaimer footer and the song's on-stage lyric lines. With the caption bar
gone, a chyron sits at its lower position (y 560 rather than 478), as it does in the app with
captions off.

The subtitles come from the caption system itself, not from `cues.json` alone. While each
segment is stepped, the tool records what the caption bar would show on every frame:
- the line, with the speaker's display name and kind;
- the laugh caption.

That way segments' own overrides are included, such as the song hiding the bar for its sung
lyrics. Runs of identical frames become cues. A line counts as shown while the bar is more than
half faded in, which is roughly t0 to t1 + 0.55 s. The full-file times use the rendered frame
counts, so nothing drifts. The conventions:
- **Speakers:** `NAME:` (cast display name) at a segment's first line, whenever the speaker
  changes, and after more than 5 s without a line.
- **Song:** `♪ … ♪` for sung lines.
- **Sounds:** `[LAUGHTER]` / `[APPLAUSE]`. Back-to-back sound captions merge into
  `[APPLAUSE AND LAUGHTER]`.
- **Layout:** at most 2 lines of 42 characters. A longer line is split into several cues at its
  word timings.
- **Timing:** cues don't overlap, and last at least 0.7 s unless the next cue starts first. A
  line too short to read that runs straight into the next shares a two-line cue with it.
- **Format:** UTF-8, SRT and VTT.

Output: H.264 High, yuv420p, tagged bt709, 30 fps CFR, AAC-LC stereo 48 kHz 192 kb/s,
`+faststart`. Only the stage is rendered (captions on): no title card, end card or transport bar.

How it works:
- **Stepping.** The show is stateful: eased head turns, face springs, blinks, glances, airflow
  particles and shot pushes. Seeking with `?freeze` is not the same as playing through. So each
  segment is stepped continuously from t = 0. The page boots in `?seg=title&freeze=1` mode,
  which runs no frame loop and seeds `Math.random`, so renders are reproducible. Then the tool
  builds the segment's `Show` from the app's own modules and calls what `app.js`'s `tick()`
  calls: `setup`, `resetMotion()` at the cut, then `show.frame(n/30, 1/30)` and
  `stage.draw(show)` for every frame. It needs no hooks in the app.
- **Pixels.** `getImageData` per frame is POSTed to the tool's Vite dev server as a Blob (a typed
  array body is about 100× slower), then piped into ffmpeg/libx264.
- **Audio.** The shipped mp3 is decoded with ffmpeg, which honours the LAME gapless header, so
  sample 0 is t = 0. This is the same alignment the page gets from `audioLead()`.
- **Length.** Each segment is `round(duration·30)` frames, so every clip is within half a frame
  of its `cues.json` duration. The count doesn't depend on the other segments, so a clip stays
  valid when another segment changes. Only its `01-…` number can change, if the rundown order
  does. Each clip's audio is trimmed or padded to that length at the tail, by less than a frame.
  The full episode concatenates the clips' video streams and encodes one continuous audio
  stream, the segments' PCM back to back. Audio and video cut together and there is no AAC
  priming or padding at the cuts, so nothing drifts.

---

## Known limits

- Laughs are synthesized "h+vowel" pulses. They read as a crowd laughing, but up close they
  are clearly synthetic. Real laughter has inhaled gasps, which the engine can't do in speech
  mode.
- The mp3 relies on the LAME header for encoder-delay trimming. Browsers that ignore it play
  everything about 25 ms late, which is negligible for lip-sync.
- Cold renders are single-threaded (about 4× real time).
- Some creature calls (elephant `trumpet`/`squeak`, alligator `hiss`) ignore `pitch`. The
  elephant's sustained "mode" can't be gated into a trumpet (it only gives transients), so the
  trumpet comes from the built-in call.
- There is no seal *bark* call in the bestiary. `seal` is designed from the gated seal with
  pulse and roughness, and reads as a pulsed honk-bark.
