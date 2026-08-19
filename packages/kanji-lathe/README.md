# Kanji Lathe

A parametric type foundry for the 1,000 most common kanji.

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

## Regenerating the corpus

`public/kanji-1000.json` is committed so the app stays a zero-dependency static
build. To rebuild it:

```bash
curl -sSL -o /tmp/kanjivg.zip https://github.com/KanjiVG/kanjivg/releases/download/r20230110/kanjivg-20230110-main.zip
unzip -q /tmp/kanjivg.zip -d /tmp/kanjivg
curl -sSL http://www.edrdg.org/kanjidic/kanjidic2.xml.gz | gunzip > /tmp/kanjidic2.xml
node tools/build-dataset.mjs --kanjivg /tmp/kanjivg/kanji --kanjidic /tmp/kanjidic2.xml --count 1000
```

The 1,000 characters are the top 1,000 by newspaper frequency (KANJIDIC2's `freq`
field), all of which KanjiVG covers.

## Credits and licences

Skeletons, stroke order and the component trees come from
[KanjiVG](https://kanjivg.tagaini.net) by Ulrich Apel, CC BY-SA 3.0. Frequency
ranks, readings, meanings, grades and JLPT levels come from
[KANJIDIC2](https://www.edrdg.org/wiki/index.php/KANJIDIC_Project) by the
Electronic Dictionary Research and Development Group, CC BY-SA 4.0. Both are
redistributed here in a repacked binary form; see `public/kanji-1000.json`'s
`meta.sources`. Fonts you export are derived from KanjiVG outlines and therefore
inherit CC BY-SA 3.0.
