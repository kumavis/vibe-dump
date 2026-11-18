# Stanford dragon — sources

| file | what | credit | licence |
| --- | --- | --- | --- |
| `src/artifacts/stanford-dragon/dragon.bin` | the dragon mesh: the "res2" decimation of the VRIP reconstruction, 201 031 triangles / 100 207 vertices after welding, quantised to 16-bit positions + varint indices by `tools/classics.mjs` (1.27 MB) | Stanford Computer Graphics Laboratory, The Stanford 3D Scanning Repository | research use; free to redistribute with credit; not for commercial use (see below) |

Credit line: Stanford Computer Graphics Laboratory, The Stanford 3D Scanning Repository.

## The model

The Stanford dragon is a range scan of a small carved dragon figurine, reconstructed in 1996 with the "vrip"
volumetric merging program at the Stanford Computer Graphics Laboratory and published in The Stanford 3D Scanning
Repository (graphics.stanford.edu/data/3Dscanrep/). The repository ships the full reconstruction (871 414
triangles) and three decimations made with a crude algorithm that, as its README says, does not preserve topology
and leaves a few small holes. This piece uses the second resolution ("res2": 100 250 vertices, 202 520 triangles
before welding), the largest one whose quantised binary stays under ≈ 1.5 MB and under 250 k triangles.

graphics.stanford.edu is not reachable from the build machine, so the files were taken from the npm package
`stanford-dragon` 1.1.1 (Hugh Kennedy), which redistributes the repository's four PLY files unchanged
(`models/dragon_vrip*.ply.gz`, with the repository's own README). The package was unpacked by hand in a scratch
folder and parsed as data; it is not a dependency of this project.

## Terms

The Stanford 3D Scanning Repository's terms, stated plainly: the models may be used freely for research, and may
be redistributed for free provided the Stanford Computer Graphics Laboratory is credited; they may not be used
commercially, or in a product for sale, without the laboratory's permission. This project is a free, non-commercial
research and demonstration piece and credits the laboratory here, in the artifact's label and in its source.

## What the Taotie Kit added

Orientation and size (head toward +X, 220 mm long, seated on its feet), a per-vertex cavity computed at load
(`kit.meshCavity`), the patina (`stanford-dragon` preset) and the base, which is entirely the kit's
(`src/artifacts/stanford-dragon/base.js`). No relief is projected onto the scan: its scales and whiskers are the
scan's own.
