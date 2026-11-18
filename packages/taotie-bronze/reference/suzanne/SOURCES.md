# Suzanne — sources

| file | what | credit | licence |
| --- | --- | --- | --- |
| `src/artifacts/suzanne/suzanne.bin` | the cage: Suzanne.gltf / Suzanne.bin welded (2 012 vertices, 3 936 triangles: the head and two eyeball shells), quantised to 16-bit positions + varint indices by `tools/classics.mjs` (25 kB) | © 2017 UX3D, Khronos glTF Sample Assets (Models/Suzanne) | CC0 1.0 (public domain dedication) |

Credit line: Suzanne, Khronos glTF Sample Assets — © 2017 UX3D, CC0. Suzanne is the Blender Foundation's mascot.

## The model

Suzanne is the monkey head built into the Blender 3D software (Add → Mesh → Monkey) as its test model and
mascot; she is the Blender Foundation's. The mesh used here is the copy UX3D prepared for the Khronos Group's
glTF Sample Assets repository (github.com/KhronosGroup/glTF-Sample-Assets, Models/Suzanne), released under CC0.
Only the geometry (positions, indices) was taken; the sample's textures, normals, tangents and UVs were not.
The files were downloaded once into a scratch folder and parsed as data.

## What the Taotie Kit added

Scale and seat (220 mm chin to crown, on a cast neck ring), two levels of Loop subdivision at load, refinement
where relief displaces her, a per-vertex cavity, the projected relief (`src/artifacts/suzanne/decor.js`: eyes, horns,
canthi, ears, a kui on each cheek, leiwen ground), the centre flange and the neck ring. Her muzzle and mouth are as
the sample has them.
