# Sources — nezu-bu

**饕餮文瓿 · Bu with Taotie Design** — Nezu Museum, Tokyo (根津美術館). Bronze.

## Facts from the museum label (transcribed from the card photograph)

- Title: 饕餮文瓿 / Bu with Taotie Design
- Date: Shang–Western Zhou dynasty, 11th century BC
- Number on the card (lower right): 90082
- Exhibit number in the gallery: 14
- Dimensions: not on the label.

## Photographs

| file | what | credit | licence |
| --- | --- | --- | --- |
| `photo-06.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `card-07.jpg` | the museum label | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |

File numbers are the photograph's position in the owner's upload of 47 (sorted by file name). The pairing of photographs with this label follows the owner's habit (object first, then its card) and what each frame shows; check it against the object before relying on it.

**Sorting.** Only `photo-06` shows this vessel (head-on at a belly mask, from about lid height; nothing unrelated in
frame, no bystander); `card-07` is its label. Every view `ref` and crop below comes from `photo-06`.

## Derived files (crops and flattenings of the owner's photograph)

Credit for every file below: **photograph by the project owner, Nezu Museum, Tokyo, 2026**. All are 1:1 crops (or
rectifications / developments) of `photo-06.jpg`, saved with PIL without EXIF/XMP/ICC/comment metadata
(`python3 tools/nometa.py`).

| file | what | from | crop (x0, y0, x1, y1 in the original's px) |
| --- | --- | --- | --- |
| `front.jpg` | view `front`: head-on at a belly mask | `photo-06.jpg` | (0, 260, 1536, 1412) — the 4:3 band holding the whole vessel |
| `detail-knob.jpg` | view `detail-knob`: the bud knob on its two posts, the front lid flange end-on, the right lid flange in profile | `photo-06.jpg` | (520, 300, 940, 660) |
| `detail-shoulder.jpg` | view `detail-shoulder`: the right half of the shoulder frieze (dragon, two dotted discs) | `photo-06.jpg` | (560, 700, 1010, 900) |
| `detail-mask.jpg` | view `detail-mask`: the right half of the belly mask (eye frame, nostril, spiral horn) | `photo-06.jpg` | (600, 860, 1010, 1100) |
| `detail-eye.jpg` | view `detail-eye`: the right eye in its frame | `photo-06.jpg` | (740, 900, 920, 1030) |
| `detail-flange.jpg` | view `detail-flange`: the left divider flange in profile | `photo-06.jpg` | (170, 700, 370, 1110) |
| `detail-foot.jpg` | view `detail-foot`: the foot frieze, an opening, the right foot flange | `photo-06.jpg` | (420, 1100, 940, 1380) |
| `faces/face-belly.jpg` `face-shoulder.jpg` `face-foot.jpg` `face-lid.jpg` | flat faces (KIT.md § Flat faces) | `photo-06.jpg` | warped by `faces.json` (`node tools/faces.mjs --a nezu-bu --rectify`) |
| `faces/dev-mask.jpg` `dev-shoulder.jpg` `dev-foot.jpg` `dev-lid.jpg` | the photograph DEVELOPED onto each register's panel (x = arc mm from the centre ridge, y = arc mm up the wall; 6 px/mm) through the fitted camera — the tracing images | `photo-06.jpg` | resampled, `.work/r8-bu/develop.py` |
