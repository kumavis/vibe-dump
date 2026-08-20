# Kanji Lathe

A parametric type foundry for Japanese — 6,627 characters: the full hiragana and
katakana syllabaries, Japanese punctuation, and every kanji KanjiVG draws.

Every character is loaded not as a picture but as a **structure**: an ordered list
of strokes, each with its CJK stroke type and direction, hung on the nested
component tree that a reader actually parses (radical, phonetic, position). That
structure is then run through a pipeline of deformation operators — component
surgery, region compression, stroke-shape work, frame distortion, noise, and
crown shyness — before a parametric pen assigns a width to every sample point and
the result is outlined, drawn, and optionally packed into a real TrueType file you
can install.

It is a procgen art toy with a conscience: a live legibility meter scores each
design against the untouched skeleton, so you can see exactly what a beautiful
idea costs in readability.

## What is interesting here

- **Structure, not outlines.** Stroke order, stroke direction and the component
  tree are first-class inputs. "Later strokes yield to earlier ones" is a slider.
- **Crown shyness.** Strokes repel each other and retract their tips before
  contact, the way adjacent tree canopies leave a river of sky between them. On a
  dense kanji this opens a lattice of light without dissolving the character.
- **Density equalisation.** The engine measures the glyph's own ink distribution
  and warps the em so crowded regions are handed more space and empty ones shrink
  — or the exact opposite, if you want the contrast amplified.
- **Modular cell fitting.** Each component is forced toward the canonical grid
  cell its position implies, turning any kanji into a rigid modular system.
- **Gray-value normalisation.** A 3-stroke kanji and a 23-stroke kanji are pulled
  to the same ink coverage, which is a real type-design move rather than an effect.
- **Render modes that survive export.** A font can hold exactly one thing:
  filled contours under the non-zero winding rule. That is less limiting than it
  sounds, because the engine still has the centreline and the per-point width
  when the outline is built — so a hollow glyph is not the outer shape "inset",
  which is genuinely hard, but the same stroke outlined a second time at a
  narrower width and wound backwards, letting the fill rule punch the hole.
  Concentric rings are the same trick repeated.
- **A real font falls out of it.** The TrueType writer is hand-rolled: dense
  outline polygons are simplified, corner-detected, and re-encoded as quadratic
  B-splines using TrueType's implied-midpoint rule. The proof view can compile the
  current design to a subset `.ttf` and hand it to `FontFace`, so the text you are
  reading is set by the platform's own rasteriser — the only honest preview of
  what the downloaded file will do.
- **The metric closes the loop.** *Push it* binary-searches the largest intensity
  of your current design whose probe glyphs all still clear a legibility floor,
  and the audit scores all 1,000 characters to show you which ones broke first.

## Using it

- **Glyph** — one character on the stage. Hover a stroke to identify it; press
  space to watch it written in stroke order.
- **Specimen** — a live page of the corpus, painted in slices so the panel stays
  responsive.
- **Proof** — set real Japanese text with the generated glyphs (kana fall back to
  the system font, exactly as a partial CJK font behaves in the wild).
- **Evolve** — nine mutations around the current design; click one to make it the
  parent. Directed search through a space too large to slider your way across.

Every control is in the URL, so a design is a link. `Export` writes SVG, PNG, a
preset JSON, or a `.ttf` of the top 250 or all 1,000 glyphs.

The right-hand column carries the legibility meter, *Push it*, the weakest-glyph
audit, and a per-stroke readout — hover the stage or the list to see which stroke
is which, what CJK stroke type it is, and which component it belongs to.

Keyboard: `R` randomise · `Space` play the writing animation · `←`/`→` walk the
frequency list.

## Layout

```
src/
  data/      corpus decode + the CJK stroke vocabulary
  geom/      Bézier and polyline kernel (the only place that knows about curves)
  engine/    skeleton, pipeline, per-stage operators in ops/, the pen, outlining,
             and the legibility metrics
  render/    canvas render modes
  font/      the TrueType writer
  ui/        dashboard, views, export
tools/
  build-dataset.mjs   regenerate public/kanji-1000.json from the upstream sources
  smoke.mjs           whole-pipeline integration check, no browser required
```

`ENGINE.md` is the contract every operator module is written against; adding a new
operator is a one-file change, and its controls appear in the dashboard by
themselves.

## Checks

```bash
npm run check --workspace @vibe-dump/kanji-lathe
```

Three passes, no browser required:

- `tools/ops-sweep.mjs` takes each operator on its own and asserts it is a genuine
  no-op at its defaults over all 1,000 kanji, stays finite and in-bounds at every
  parameter extreme (each alone, then all at once), reproduces bit-for-bit from a
  seed, survives being applied twice, and holds its time budget. It also holds the
  pen to a clean monoline at defaults and checks that gray normalisation really
  does pull simple and complex characters to the same ink coverage.
- `tools/shyness-check.mjs` measures the minimum clearance between different
  strokes before and after crown shyness, so the signature effect has to prove it
  opens gaps rather than merely jiggling points.
- `tools/font-check.mjs` re-parses a generated `.ttf` with a reader written
  independently of the writer, then hands the file to Chromium and confirms it
  rasterises distinct, non-blank glyphs. Both halves are needed: the first
  version of the writer carried a transposed `head.magicNumber`, passed the
  re-parse cleanly, and was refused by the font sanitiser in every browser.
  `--hollow` builds the same font in the hollow style and checks the browser lays
  down materially less ink at the same weight, which is the only real proof that
  the reversed contours are punching holes rather than being quietly dropped.
- `tools/smoke.mjs` runs every preset through the whole pipeline across a spread
  of glyph complexities, outlines the result, scores it, and packs a real
  TrueType file.

`npm run shots --workspace @vibe-dump/kanji-lathe` drives the built app in
headless Chromium and writes one screenshot per preset plus a contact sheet of
all of them, which is the only way to review a visual change honestly.
`npm run preview -- "Crown Shy"` renders a single design across several
characters for fast iteration on one preset.

## Single-file build

```bash
npm run standalone --workspace @vibe-dump/kanji-lathe   # → dist/artifact.html
```

Inlines the stylesheet, the script and both corpora into one 4 MiB page fragment
for hosts that will not serve the corpus as a side-car fetch. The corpora ride in
inert `application/json` script tags rather than as JS object literals, so the
browser never parses four megabytes of stroke data at load — the extended set
costs nothing until something asks for a character in it. The loader checks for a
baked-in corpus before it reaches for the network, so the same source serves both
builds. Such hosts usually sandbox the page as well, so the export
menu says plainly that downloads are blocked there rather than appearing to do
nothing.

## The corpus

Two committed files, so the app stays a zero-dependency static build:

- `public/corpus-core.json` — 1,188 characters, 293 KiB gzipped. All the kana and
  punctuation plus the thousand most frequent kanji. Loads with the page.
- `public/corpus-ext.json` — 5,439 more kanji, 1.7 MiB gzipped. Nobody should pay
  that on first paint, so it arrives only when you search past the core, ask the
  specimen sheet for a range beyond it, or type a character it does not hold.

To rebuild them:

```bash
curl -sSL -o /tmp/kanjivg.zip https://github.com/KanjiVG/kanjivg/releases/download/r20230110/kanjivg-20230110-main.zip
unzip -q /tmp/kanjivg.zip -d /tmp/kanjivg
curl -sSL http://www.edrdg.org/kanjidic/kanjidic2.xml.gz | gunzip > /tmp/kanjidic2.xml
node tools/build-dataset.mjs --kanjivg /tmp/kanjivg/kanji --kanjidic /tmp/kanjidic2.xml --count 1000
```

`--count` is the core/extended split. Kanji are ordered most-worth-having first:
newspaper frequency rank where KANJIDIC2 knows one, then school grade, then
stroke count for the long tail. Kana carry a romanisation so that searching "ka"
finds か and カ; KANJIDIC covers ideographs only.

## Credits and licences

Skeletons, stroke order and the component trees come from
[KanjiVG](https://kanjivg.tagaini.net) by Ulrich Apel, CC BY-SA 3.0. Frequency
ranks, readings, meanings, grades and JLPT levels come from
[KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) by the
Electronic Dictionary Research and Development Group, CC BY-SA 4.0. Both are
redistributed here in a repacked binary form; see `public/kanji-1000.json`'s
`meta.sources`. Fonts you export are derived from KanjiVG outlines and therefore
inherit CC BY-SA 3.0.
