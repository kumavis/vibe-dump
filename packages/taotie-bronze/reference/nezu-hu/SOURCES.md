# Sources — nezu-hu

**蟠螭文壺 · Hu with Panchi Design** — Nezu Museum, Tokyo (根津美術館). Bronze.

## Facts from the museum label (transcribed from the card photograph)

- Title: 蟠螭文壺 / Hu with Panchi Design
- Date: Spring and Autumn period, 7th–6th centuries BC
- Number on the card (lower right): 90099
- Exhibit number in the gallery: 17
- Dimensions: not on the label.

## Photographs

| file | what | credit | licence |
| --- | --- | --- | --- |
| `photo-11.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `card-12.jpg` | the museum label | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |

File numbers are the photograph's position in the owner's upload of 47 (sorted by file name). The pairing of photographs with this label follows the owner's habit (object first, then its card) and what each frame shows; check it against the object before relying on it.

**Sorting.** Only `photo-11` shows this vessel (the front, from a little above the rim; nothing unrelated in the
part of the frame the crops use, no bystander); `card-12` is its label. Every view `ref` and crop below comes from
`photo-11`.

## Derived files (crops and flattenings of the owner's photograph)

Credit for every file below: **photograph by the project owner, Nezu Museum, Tokyo, 2026**. All are 1:1 crops (or
rectifications / developments) of `photo-11.jpg`, saved with PIL without EXIF/XMP/ICC/comment metadata
(`python3 tools/nometa.py`).

| file | what | from | crop (x0, y0, x1, y1 in the original's px) |
| --- | --- | --- | --- |
| `front.jpg` | view `front`: the whole vessel | `photo-11.jpg` | (60, 20, 1500, 1800) |
| `detail-handle.jpg` | view `detail-handle`: the right handle in profile | `photo-11.jpg` | (1060, 440, 1330, 860) |
| `detail-handle-left.jpg` | view `detail-handle-left`: the left handle in profile | `photo-11.jpg` | (220, 440, 490, 860) |
| `detail-panchi.jpg` | view `detail-panchi`: the shoulder band's interlace, front, at close range, the neck rope over it | `photo-11.jpg` | (560, 600, 1010, 900) |
| `detail-body.jpg` | view `detail-body`: the belly band's interlace, front | `photo-11.jpg` | (520, 1000, 1060, 1360) |
| `detail-cord.jpg` | view `detail-cord`: plain cords and the twisted rope between the bands | `photo-11.jpg` | (600, 860, 960, 1000) |
| `detail-foot.jpg` | view `detail-foot`: the foot ring and the lowest interlace rows | `photo-11.jpg` | (260, 1380, 900, 1780) |
| `detail-neck.jpg` | the neck with its incised inscription (not a view ref) | `photo-11.jpg` | (380, 150, 1180, 620) |
| `faces/face-shoulder.jpg` `face-body.jpg` `face-neck.jpg` | flat faces (KIT.md § Flat faces) | `photo-11.jpg` | warped by `faces.json` (`node tools/faces.mjs --a nezu-hu --rectify`) |
| `faces/dev-shoulder.jpg` `dev-body.jpg` `dev-neck.jpg` | the photograph DEVELOPED onto each band (x = arc mm from the front centre line, y = arc mm up the wall from the band's foot; 6 px/mm) through the fitted camera — the tracing images | `photo-11.jpg` | resampled, `.work/r8-hu/develop.py` |
