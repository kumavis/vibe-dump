# Sources — nezu-fanghu

**鳳文方壺 · Square Hu with Phoenix Design** — Nezu Museum, Tokyo (根津美術館). Bronze.

## Facts from the museum label (transcribed from the card photograph)

- Title: 鳳文方壺 / Square Hu with Phoenix Design
- Date: Western Zhou dynasty, 9th century BC
- Number on the card (lower right): 90097-98
- Exhibit number in the gallery: 16
- Dimensions: not on the label.

## Photographs

| file | what | credit | licence |
| --- | --- | --- | --- |
| `photo-08.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `photo-09.jpg` | the object | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |
| `card-10.jpg` | the museum label | photograph by the project owner, Nezu Museum, Tokyo, November 2026 | owner's own photograph, kept in the repository with permission |

File numbers are the photograph's position in the owner's upload of 47 (sorted by file name). The pairing of photographs with this label follows the owner's habit (object first, then its card) and what each frame shows; check it against the object before relying on it.

## Derived files (all: photograph by the project owner, Nezu Museum, Tokyo, 2026 — 1:1 crops / resamplings, saved without metadata)

| file | what | from | crop (x0, y0, x1, y1 px of the source) |
| --- | --- | --- | --- |
| `front.jpg` | view `front` ref: the vessel (the blurred bystander strip at the bottom of the frame cropped out) | photo-08 | (200, 40, 1340, 1820) |
| `three-quarter.jpg` | view `three-quarter` ref: the vessel only (the twin vessel of the pair at the left edge cropped out) | photo-09 | (175, 140, 1250, 1720) |
| `detail-crown.jpg` | lid band and crown | photo-08 | (431, 47, 948, 434) |
| `detail-handle.jpg` | the left (−X) handle head and ring | photo-08 | (170, 536, 660, 903) |
| `detail-stud.jpg` | the diamond stud on the strap crossing | photo-08 | (415, 993, 944, 1389) |
| `detail-phoenix.jpg` | the lower right bird cartouche | photo-08 | (635, 1206, 1155, 1595) |
| `detail-upper.jpg` | the upper left bird cartouche | photo-08 | (282, 797, 749, 1147) |
| `detail-neck.jpg` | neck frieze and triangles | photo-08 | (404, 379, 975, 807) |
| `detail-foot.jpg` | foot band and plate | photo-08 | (431, 1442, 933, 1818) |
| `faces/face-*.jpg` | flattened faces (lower, upper, strap, neck, foot, lid): photo-08 warped onto each zone's chord plane (faces.json, `node tools/faces.mjs --a nezu-fanghu --rectify`) | photo-08 | homography, see faces.json |
| `faces/dev-*.jpg` | photo-08 DEVELOPED onto the model's own curved surface (s = developed mm from the face centre line, y = height) through the assumed camera — the images the décor was traced from (`dev-*.trace.json`, previewed by `trace.py`) | photo-08 | per-pixel resampling, `.work/r8-fanghu/solve/devs.py` |

Each detail crop is the region of photo-08 that the view of the same name frames (target projected through the assumed
camera, 4 : 3, half height = view fit × R at the target's distance; `.work/r8-fanghu/solve/refcrops.py`).
