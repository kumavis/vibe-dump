# Taotie Bronze

A three.js museum viewer of procedurally recreated Chinese ritual bronzes (late Shang to Western Zhou), built
on a reusable design system — the **Taotie Kit** — for bronze relief décor and a parameterisable patina.

Nothing here is a scan. Every vessel is generated at load time from code and small traced data files, and is
checked against reference photographs. The package is `wip`: see [Open problems](#open-problems).

```bash
npm run dev -w @vibe-dump/taotie-bronze     # dev server
npm run build && npm run verify             # from the repo root, before pushing (dist/ is committed)
```

## Layout

```
packages/taotie-bronze/
├─ KIT.md            the kit's binding contract: units, module map, every public API, the artifact
│                    contract, verification hooks, tools. Read this before touching src/kit.
├─ research/         the reading the kit is built on: style grammar, patina and alloy, form and foundry,
│                    motif inventory
├─ src/
│  ├─ kit/           the design system (no vessel-specific code)
│  │  ├─ relief/     height-field panels and what is drawn on them: taotie and companion motifs, leiwen
│  │  │              ground, traced plates, sunk cartouches, ridge work, weave, panchi, rounded bands
│  │  ├─ geometry/   bodies (lathe, box "fang", lobed, plates), flanges, legs, handles, lids,
│  │  │              signed-distance heads, skins for meshes the kit did not make, relief → 3D surface
│  │  ├─ material/   PatinaMaterial and its presets
│  │  └─ util/       canvas and seeded random numbers (no Math.random in src)
│  ├─ artifacts/     one file per piece (+ a folder of its form / décor / sculpture modules);
│  │                 index.js is the registry. 20 museum vessels, 7 "Cast with the kit" examples
│  └─ app/           the viewer: stage, views, catalogue, patina drawer, motif atlas, reference overlay
├─ reference/<id>/   per piece: dossier.md, SOURCES.md, spec.json (proportions for metrics), faces.json
│                    (photo ↔ model mapping), the photographs, traced data, owner-trace-*.json
├─ tools/            render-and-compare and extraction tools (below)
└─ thumbnail.jpg     the gallery card, shot by hand
```

`.work/` (gitignored) holds each builder's scratch work: private builds, shots, notes.

## Approach

**One contract.** Units are millimetres, Y up, front +Z. A piece is an *artifact*: metadata, named views,
and an async `build(kit, { quality, params })` that returns meshes. Anything reusable goes into the kit as an
additive, documented function; vessel files only compose kit calls with their own data.

**Relief is a height field.** Décor is drawn in millimetres on a `ReliefPanel` (a 2D canvas of heights),
baked, and wrapped onto a parametric surface as real geometry. That keeps the vocabulary the founder's:
registers, figures standing on a ground, sunk channels, incised lines — and makes a face of a vessel
directly comparable with a flattened photograph.

**Evidence first.** Each piece starts from a dossier (dimensions, sources, what the photographs do and do not
show). Photographs are mapped onto the model through a fitted camera (`faces.json`), so décor can be traced in
the model's own coordinates. What is not seen (far sides, hidden zones) is repeated by symmetry and said so.

**Render, compare, look.** The loop for every change:

| tool | what it does |
| --- | --- |
| `tools/shoot.mjs` | renders named views (beauty, clay, silhouette) beside the reference photograph |
| `tools/faces.mjs` | head-on face renders against the flattened photograph: similarity, raised coverage |
| `tools/metrics.mjs` | proportions against `spec.json` |
| `tools/smoke.mjs` | every piece builds, at full and half quality, within its budgets |
| `tools/nometa.py` | no photograph in the repo carries embedded metadata |

Numbers are indicators; a person looking at the render beside the photograph is the judge. The Nezu
pieces were also reviewed blind by a second reader, twice.

**The owner in the loop for décor.** Deciding what is *one raised figure* in a photograph is the step that
kept failing when done by eye in a hurry or by automatic detection. The current method splits it:

1. The owner paints or outlines a few figures over the photograph (a small drawing page, the "Motif Tracer").
2. `tools/snap.py` slides that rough shape onto the real edge of the raised slab.
3. `tools/propose.py` trains a per-pixel classifier on those shapes and proposes the figure/ground map for
   the rest of the photograph; the owner corrects it with a few scribbles and it is retrained.
4. `tools/support.py` scores any traced outline by the edge the photograph actually has along it. An outline
   with no edge under it is a guess and may not go into a model.

Tracings and corrections are kept as `reference/<id>/owner-trace-*.json` and `owner-scribbles-*.json`.

**Budgets.** Headless Chromium with SwiftShader is the test machine: a piece builds in well under 10 s at
quality 1; relief panels are capped at 2048 px on phones; quality 0.5 must be visibly lighter. No CDN, no
network requests from the app, relative asset paths.

**How the work is organised.** A lead writes briefs and reviews; builders each own one vessel's files (or one
kit module) and report with renders beside the photographs. Shared files take additive lines only.

## Open problems

**Reading the décor**

- *Figure/ground is still the bottleneck.* The classifier needs the owner's corrections per photograph. It
  transferred usefully from one fully traced bird on the phoenix hu, poorly from three elements on the jue,
  and not at all from a single element on the you.
- *Incised lines inside a figure have no reliable extraction.* Line detection gives fragments. Slab tops are
  therefore plainer than the bronzes.
- *Builders' own readings are unreliable on soft photographs.* On the jue belly band, five of ten slabs a
  builder drew have no edge in the photograph (`tools/support.py` flags them). The gate now exists; the band
  has not been redrawn.
- *Relief heights are inferred from cast shadows* (about ± 0.5 mm). Deriving height from a photograph
  directly did not work under top lighting at about 3.6 px/mm.
- *The generated spiral ground* is more maze-like and even than the ordered stacks of squared spirals on the
  bronzes.

**Geometry and cameras**

- Photographs are placed with assumed pinhole cameras fitted to silhouettes. Near a vessel's limb the mapping
  stretches, and cameras fitted to different photographs of one vessel can disagree (the you's three-quarter
  view sits about 8 mm from its photograph at the horn).
- The similarity score is a weak guide: it has gone down when a register plainly got better.

**Specific pieces**

- `nezu-fanghu`: lower birds are the owner's silhouette only; upper birds are a rough machine extraction
  after one round of corrections; frieze, lid, foot and triangles still use the earlier tracing.
- `nezu-you`: four belly passages (A–D in `slabs.json`) are left as ground for the owner to draw.
- `nezu-jue`: belly band as above.
- Other Nezu pieces have known differences in their décor and details that have not been revisited.

**Tooling**

- `snap.py`, `propose.py` and `support.py` need OpenCV, SciPy, scikit-image and scikit-learn, which are not
  repo dependencies (a throw-away virtualenv is used).
- `reference/nezu-fanghu/owner_plates.py` depends on camera-solve scripts that live only in `.work/`, so the
  hu's bird data cannot be regenerated from a clean clone.
- The Motif Tracer page is not in the repo, and its shared-store save does not work from the owner's view;
  drawings travel as pasted text.
- A full smoke test takes about two minutes per piece under SwiftShader.
