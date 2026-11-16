# Sources — nezu-bo

**蟠螭文鎛 · Bo with Panchi Design** — Nezu Museum, Tokyo (根津美術館). Bronze.

## Facts from the museum label (transcribed from the card photograph)

- Title: 蟠螭文鎛 / Bo with Panchi Design
- Date: Spring and Autumn period, 6th–5th centuries BC
- Number on the card (lower right): 90120
- Exhibit number in the gallery: 18
- Dimensions: not on the label.

## Photographs

| file | what | credit | licence |
| --- | --- | --- | --- |
| `photo-18.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-19.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `card-20.jpg` | the museum label | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |

File numbers are the photograph's position in the owner's upload of 47 (sorted by file name). The pairing of photographs with this label follows the owner's habit (object first, then its card) and what each frame shows; check it against the object before relying on it.

## Files derived from the photographs (round 8)

Credit for every file below: **photograph by the project owner, Nezu Museum, Tokyo, 2026.** All are cut or resampled
from `photo-18.jpg` / `photo-19.jpg` with PIL and saved without EXIF / XMP / ICC / comments. No bystander or other
vessel appears in any of them (photo-19's right edge shows only the corner of a neighbouring plinth).

| file | what | from | crop / method (original px, x0 y0 x1 y1) |
| --- | --- | --- | --- |
| `front.jpg` | view `front` (reference) | photo-18 | whole frame (the fitted camera's frame) |
| `three-quarter.jpg` | view `three-quarter` | photo-19 | whole frame |
| `detail-crown.jpg` | view `detail-crown`: the openwork crown | photo-18 | 445 115 979 515 |
| `detail-boss.jpg` | view `detail-boss`: a coiled-serpent boss (row 2, middle column, left half) | photo-19 | 403 862 709 1092 |
| `detail-band.jpg` | view `detail-band`: interlace band 1, left half, with the bosses above and below | photo-19 | 320 610 880 1030 |
| `detail-panel.jpg` | view `detail-panel`: the central panel and the inner boss columns | photo-18 | 297 700 1123 1320 |
| `detail-field.jpg` | view `detail-field`: the lower field, left half | photo-19 | 387 1330 893 1710 |
| `faces/face-*.jpg` | flat faces (KIT.md § Flat faces) | per `faces.json` | homography onto each face plane (`node tools/faces.mjs --a nezu-bo --rectify`) |
| `faces/dev-upper-19.jpg` | upper zone, left half, developed onto the half-face panel (4 px/mm, ruled 10 mm) | photo-19 | resampled through the fitted camera (`dossier.md` §b.1) |
| `faces/dev-upper-18.jpg` | upper zone, right half, developed (4 px/mm) | photo-18 | as above |
| `faces/dev-lower-19.jpg` | lower field, left half, developed (4 px/mm) | photo-19 | as above |
| `faces/dev-band.jpg` | interlace band 1, left half, developed (8 px/mm): the image the band units were traced from | photo-19 | as above |
