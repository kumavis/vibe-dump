# Sources — nezu-you

**饕餮文卣 · You with Taotie Design** — Nezu Museum, Tokyo (根津美術館). Bronze.

## Facts from the museum label (transcribed from the card photograph)

- Title: 饕餮文卣 / You with Taotie Design
- Date: Shang dynasty, 12th–11th centuries BC
- Designation: Important Art Object (重要美術品)
- Number on the card (lower right): 90086
- Exhibit number in the gallery: 4
- Dimensions: not on the label.

## Photographs

| file | what | credit | licence |
| --- | --- | --- | --- |
| `photo-31.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-32.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-47.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `card-33.jpg` | the museum label | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |

**`photo-47.jpg` is a byte-identical copy of `photo-32.jpg`** (same MD5): there are two distinct views of the object, not three.

File numbers are the photograph's position in the owner's upload of 47 (sorted by file name). The pairing of photographs with this label follows the owner's habit (object first, then its card) and what each frame shows; check it against the object before relying on it.

## Derived files (crops and flattenings of the owner's photographs)

Credit for every file below: **photograph by the project owner, Nezu Museum, Tokyo, 2026**. All are saved without EXIF/XMP/ICC/comment metadata (`python3 tools/nometa.py`).

| file | what | from | crop (x0, y0, x1, y1 in the original's px) |
| --- | --- | --- | --- |
| `front.jpg` | view `front`: the pivot face head-on, bail edge-on | `photo-31.jpg` | whole frame (0, 0, 1536, 2048) — nothing unrelated in it |
| `three-quarter.jpg` | view `three-quarter`: from the front right | `photo-32.jpg` | (60, 180, 1300, 1960) |
| `detail-mask.jpg` | view `detail-mask`: right half of the belly mask | `photo-31.jpg` | (690, 1040, 1290, 1640) |
| `detail-eye.jpg` | view `detail-eye`: the right eye boss | `photo-31.jpg` | (830, 1340, 1050, 1560) |
| `detail-head.jpg` | view `detail-head`: the pivot head on the neck | `photo-31.jpg` | (500, 840, 890, 1150) |
| `detail-strap.jpg` | view `detail-strap`: the bail strap's décor | `photo-31.jpg` | (500, 0, 890, 1000) |
| `detail-lid.jpg` | view `detail-lid`: lid, knob, ridge flange, right horn, bail | `photo-32.jpg` | (250, 330, 1150, 960) |
| `detail-foot.jpg` | view `detail-foot`: the foot frieze | `photo-31.jpg` | (240, 1560, 1160, 1930) |
| `faces/face-*.jpg` | flat faces (KIT.md § Flat faces): belly, neck, skirt, foot, lid, strap | `photo-31.jpg` | warped by `faces.json` (`node tools/faces.mjs --a nezu-you --rectify`) |
