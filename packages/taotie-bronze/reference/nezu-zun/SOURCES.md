# Sources — nezu-zun

**饕餮文尊 · Zun with Taotie Design** — Nezu Museum, Tokyo (根津美術館). Bronze.

## Facts from the museum label (transcribed from the card photograph)

- Title: 饕餮文尊 / Zun with Taotie Design
- Date: Shang dynasty, 12th–11th centuries BC
- Number on the card (lower right): 90075
- Exhibit number in the gallery: 10
- Dimensions: not on the label.

## Photographs

| file | what | credit | licence |
| --- | --- | --- | --- |
| `photo-26.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-28.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-29.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-30.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `card-27.jpg` | the museum label | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |

File numbers are the photograph's position in the owner's upload of 47 (sorted by file name). The pairing of photographs with this label follows the owner's habit (object first, then its card) and what each frame shows; check it against the object before relying on it.

**Sorting.** `photo-26` and `photo-28` are this vessel. `photo-29` and `photo-30` are close-ups of a DIFFERENT, related
vessel (no circle bands, a thin plain centre ridge instead of the notched flanges): kept as comparanda, not used as a
`ref` or traced (dossier §e).

## Derived files (crops and flattenings of the owner's photographs)

Credit for every file below: **photograph by the project owner, Nezu Museum, Tokyo, 2026**. All are 1:1 crops (or
rectifications) saved without EXIF/XMP/ICC/comment metadata (`python3 tools/nometa.py`).

| file | what | from | crop (x0, y0, x1, y1 in the original's px) |
| --- | --- | --- | --- |
| `front.jpg` | view `front`: head-on at a shoulder head, from below the shoulder | `photo-26.jpg` | whole frame (0, 0, 1536, 2048) — nothing unrelated in it |
| `three-quarter.jpg` | view `three-quarter`: at a divider flange, from rim height | `photo-28.jpg` | (140, 200, 1450, 1700) — the dark neighbouring object at the left edge cropped out |
| `detail-head.jpg` | view `detail-head`: a shoulder head near profile | `photo-28.jpg` | (960, 620, 1320, 900) |
| `detail-head-front.jpg` | view `detail-head-front`: the front head's snout end and horns | `photo-26.jpg` | (500, 630, 880, 880) |
| `detail-mask.jpg` | view `detail-mask`: the belly mask and both circle bands | `photo-26.jpg` | (300, 860, 1100, 1280) |
| `detail-eye.jpg` | view `detail-eye`: the right eye boss in its socket | `photo-26.jpg` | (740, 1030, 920, 1180) |
| `detail-circles.jpg` | view `detail-circles`: the upper circle band | `photo-26.jpg` | (690, 860, 1030, 990) |
| `detail-foot.jpg` | view `detail-foot`: the foot frieze, bowstrings and two openings | `photo-26.jpg` | (360, 1270, 1060, 1660) |
| `faces/face-belly.jpg` `face-circles.jpg` `face-foot.jpg` | flat faces (KIT.md § Flat faces) | `photo-26.jpg` | warped by `faces.json` (`node tools/faces.mjs --a nezu-zun --rectify`) |
| `faces/face-divider.jpg` | flat face: the small mask at a divider flange | `photo-28.jpg` | warped by `faces.json` |
