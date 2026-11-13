# chimera (vendored)

A copy of a few modules from **CHIMERA**, a physical-modelling voice synth, by Jameson Hodge:
<https://github.com/jamesondh/chimera-vocal-synth>, commit `1d3ea49`. MIT licensed (see `LICENSE`).

| here | upstream | used for |
|---|---|---|
| `wasm/chimera.wasm`, `wasm/chimera.ts`, `wasm/engine.ts`, `wasm/types.ts`, `wasm/wire.ts` | `src/wasm/` | the engine facade (the page uses it for the airway geometry; `tools/` renders the audio with it) |
| `ui/analysis.ts` (`VoiceModel`), `ui/body.ts`, `ui/colors.ts` (palette `V`), `ui/creatureVisuals.ts` | `src/ui/` | a body's airway model; the palette |
| `ui/render/anatomy3d.ts` (`Anatomy3D`), `beams3d.ts`, `expression.ts`, `profile.ts`, `geom.ts`, `vector.ts`, `anatomy.ts`, `readouts.ts` | `src/ui/render/` | the 3D head and the 2D vector kit (beams, Hershey labels, `Glow`) |
| `worklet/protocol.ts` | `src/worklet/` | the `TelemetryMessage` type |
| `../public/fonts/*` | `public/fonts/` | Hershey Simplex (see `AVHERSHEY-LICENSE.txt`) and Archivo (OFL) |

`initChimera()` must resolve before anything imports `wasm/engine.ts` (it reads the engine's
catalogue at import time): `src/main.js` awaits it, then dynamically imports the app.

## Changes

**None.** The files are byte-for-byte upstream. Vite compiles the TypeScript as is.
They work with the monorepo's `three@^0.160` (fat lines from `three/addons/lines/*`;
`InterleavedBuffer.addUpdateRange` exists since r159).

What the show does around them, without patching:

- **Per-character colour.** `V` is a module-level object read while a head draws and while
  `buildRest` bakes a body's geometry. `src/engine/palette.js` (`withPalette`) assigns a puppet's
  palette into `V` for the duration of that puppet's `poses()` / `update()` call and restores the
  house palette afterwards.
- **Private fields read from JS** (TypeScript `private` only; they are ordinary properties at run
  time). `src/engine/heads.js` sets `Anatomy3D.w` / `.h` and calls `.beams.setResolution()` (instead
  of `resize()`, which would also reset the airflow particles on every camera push), reads
  `.rest.shell` / `.rest.head` (the head's silhouette for the occluder, the neck for the costume)
  and `.beams.group.matrixWorld`. If upstream renames those, this file is the one to update.
- **Reproducible frames.** `?freeze=1` replaces `Math.random` with a seeded generator before the
  renderer loads (particles, blinks and glances use it).
