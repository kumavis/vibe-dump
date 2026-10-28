# Splat Bushtail — the prototype, now the game's figures

The Bushtail Clans' six figures with their fur drawn as 3D Gaussian splats and everything they wear or
carry modelled as meshes, in three.js beside the game's own meshes. It began here as a look prototype;
since V2 it is the game's default Bushtail figures (the 'new' figure style; the classic mesh figures are
the 'classic' style, a switch away on the title: DESIGN §1.1's (V2) notes). The runtime moved into the
game (`view/models/`); what stays here is the generator's source and script, the viewer and the sheet,
which now draw the game's own figures.

![The six units beside the classic meshes, close up and at game scale](./units.jpg)

(`units.jpg` is the prototype's sheet, taken before V2 with its own splat counts: density 0.2 close up, 6,000
and 1,300 splats at 60 and 28 px.)

## See it

```sh
npm run dev -w packages/tails-and-scales
# then open /proto/splat/viewer.html?unit=elder   (nutkin, grenadier, oakguard, glider, trebuchet, elder)
#      add &mesh=1 for the classic mesh figure, &shadow=1 for the sun's shadow; drag to orbit
```

The comparison sheet (each unit close up, then at about 60 and 28 px, beside the classic mesh figure at
the same sizes; the splats drawn are the game's own choice for each size):

```sh
cd packages/tails-and-scales
CHROMIUM_PATH=/opt/pw-browsers/chromium-<build>/chrome-linux/chrome node proto/splat/sheet.mjs <out dir> [unit...]
```

It writes `units.png` (and `units.jpg`) to the out dir.

## The files

| file | what it is |
| --- | --- |
| `upstream-squirrel.js` | the splat-squirrel project's `src/squirrel.js`, as it came: a procedural cartoon squirrel of about 81,000 splats on a 24-bone rig |
| `make-bushtail.py` | turns it into the game's `view/models/splat/fur.js` by anchored edits (each must match once) |
| `../../view/models/splat/fur.js` | **generated** (`python3 make-bushtail.py`): the fur alone, in any unit's palette, with the Elder's beard and the Glider's membrane as splat stages; poses; a progressive splat order; the rig's anchors and the body's surface for fitting kit |
| `../../view/models/splat/splats.js` | splats in three.js: `bakeSplats` skins a posed model once on the CPU; a unit's `SplatFur` (its levels of detail in one texture, its draw orders by view bin); a figure's `Splats` mesh; `prepareSplats`, each figure's level and draw order before each render |
| `../../view/models/squirrel.js` | the six units: each one's coat, pose, mesh kit and shadow proxy, built with the game's `view/models/kit.js`: the game's Bushtail kit |
| `viewer.html`, `viewer.js` | one figure as the game builds it (`view/models/cache.js`), splat or classic, on its base under the table's lights |
| `sheet.mjs` | the comparison sheet |
| `units.jpg` | the prototype's sheet |

## What was decided along the way

- **Splats for fur only.** Hats, goggles, straps, armour, weapons, the robe and the trebuchet are meshes;
  the beard and the gliding membrane are fur, so they are splats.
- **Few, big splats.** A splat scale of 1.5 with fewer splats reads best. The game draws
  `n ≈ 1.7 × (figure height in CSS px)²` of its progressive order, at the level of detail that holds it:
  about 1,500 on the classic table (28 px), 6,000 from about 60 px.
- **The face reads from above.** Bigger eyes, the head tilted up 0.3 rad and scaled 1.1 so the face shows
  to the game's 44° camera; the face's parts come first in the progressive order, so they thin last.
- **Kit fitted to the body.** Straps, the breastplate and the robe are cast onto the splat body's own
  surface (its SDF, without the arms) and stand off it by the fur's depth; held things sit in the posed
  paws.

## In the game (V2)

- **One fur per unit, shared.** A unit's fur is generated once (density 0.05: about 8,300 splats, in under
  half the time of the prototype's 0.1 and 11,800, and alike at 60 and 28 px; `make-bushtail.py` lowers
  the generator's floor to 0.04 for it), put in progressive order, and baked at four levels of detail,
  800, 1,500, 3,000 and 6,000 splats, packed into one float texture under one material. Every figure of the unit draws it: the
  template cache's template and clones, the race picker's diorama, every trebuchet (built afresh for its
  heap of acorns, its two crews' furs not).
- **A level per figure, per render**, from its height on screen with hysteresis; a frame that would
  draw more than its budget steps the farthest figures down (the stage's quality's: 150,000 at high,
  60,000 at medium, 30,000 at low and under `?lowfi`; shared by the table and the race picker's windows,
  the table's figures at their coarsest while a window shows; the perf overlay shows it).
- **No sort per frame.** A figure's draw order comes from its fur's cache: per (level, view bin), the
  bin being the camera's direction in the figure's own frame (32 azimuths by 6 elevation bands of 30°),
  sorted once by the splat centres' depth along the bin's middle direction, held as a Uint16 instanced
  attribute in a geometry every figure seen from that bin draws; one no figure has drawn for a while is
  freed.
- **Shadows** are the classic figure's body, invisible, merged with the kit into the figure's one shadow
  caster, on a layer only the sun's shadow pass draws; the splats cast none.
- **The far stand-in** (large boards) merges the base and the kit, and keeps the fur (a splat mesh of
  its own) and the body's shadow: a far squirrel keeps its hat and its halberd, and its coat doesn't
  change at the switch.

Cold build of a unit's figure in Chromium (desktop, SwiftShader; the viewer, a fresh page each, the JIT
cold): 122-224 ms, a median of about 142 (the trebuchet, two furs, 223; at density 0.1, 136-297 and
180; a classic figure 14-39). The title builds every unit of both races before its first frame: 657-668
ms with the 'new' figures (the Bushtails about two thirds of it) against 53-92 classic, about 2.6 s
against 0.3 at a phone's four times slower. The perf overlay's `built in` shows a real phone's.
DESIGN §1.1's (V2) note has the breakdown and the splats drawn.

## Not done

- No ink outline (the upstream renderer has one; three.js would need a pass).
- Figures don't animate their limbs; the game's whole-figure hop, breath, lean, flinch and keel apply to
  the miniature, the fur with it.
- The fur takes no shadow (a squirrel under a tree is lit as in the open).
