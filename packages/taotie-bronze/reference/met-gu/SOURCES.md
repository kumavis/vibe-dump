# Sources: met-gu (Met 1985.214.4)

All files come from the Open Access photographs of this object at The Metropolitan Museum of Art. The Met
publishes them as public domain (CC0 1.0; the API returns `isPublicDomain: true`). The licence requires no
attribution, but every file carries the credit line the Met asks for.

**Credit line:** The Metropolitan Museum of Art, New York. Gift of Ernest Erickson Foundation, 1985
(acc. 1985.214.4). Public domain (CC0 1.0).

- Object record: https://www.metmuseum.org/art/collection/search/61322
- API record: https://collectionapi.metmuseum.org/public/collection/v1/objects/61322
- Wikidata: https://www.wikidata.org/wiki/Q116313179

The Met publishes three photographs of this object: the primaryImage and two additionalImages. I found no
other open-licence views. **There is no full-vessel view facing a taotie nose (a true front), and there is
no top view.** Both full-length photographs face a *seam* flange, from opposite sides. They are named
`side*` because a taotie is seen from its side there. The detail photo faces a nose flange of the foot
taotie, so it is the only true front.

I downloaded the originals at full resolution: DP155109 and DP155110 are 3000×4000, and DP155111 is
4000×3000. Every file was downscaled to at most 1800 px on the long side with ImageMagick
(`-resize '1800x1800>' -quality 86`). The `detail-*` crops were cut from the originals before
downscaling. Crop boxes are given as `w×h+x+y` in original pixels.

| file | what it shows | source image | crop | licence |
| --- | --- | --- | --- | --- |
| side.jpg | Whole vessel, facing a seam flange (camera az ≈ +89°) | https://images.metmuseum.org/CRDImages/as/original/DP155109.jpg (the Met's primary image; called "three-quarter" by the scout) | full frame | CC0 1.0 |
| side-left.jpg | Whole vessel, facing the opposite seam flange (camera az ≈ −97°) | https://images.metmuseum.org/CRDImages/as/original/DP155110.jpg | full frame | CC0 1.0 |
| detail-foot-front.jpg | Foot, facing a nose flange: a full foot taotie split by the flange, with the seam flanges and spurs on the silhouette | https://images.metmuseum.org/CRDImages/as/original/DP155111.jpg | full frame | CC0 1.0 |
| detail-foot-halfmask.jpg | One foot half-mask at full resolution (nose flange at right edge) | DP155111 | 760×1440+1180+520 | CC0 1.0 |
| detail-foot-seam.jpg | Foot from a seam: two half-masks of different taotie, nose flanges with spurs on the silhouette | DP155109 | 820×950+1150+2830 | CC0 1.0 |
| detail-foot-ring.jpg | Foot ring, plain apron, raised arris, and the end of the seam flange | DP155109 | 1000×420+1050+3350 | CC0 1.0 |
| detail-collar.jpg | Three-rib collar between waist and foot; bottom end of the waist nose flange | DP155111 | 1300×520+1300+0 | CC0 1.0 |
| detail-waist.jpg | Waist drum from a seam: two waist half-masks and the ladder-scored flanges | DP155109 | 680×620+1220+2180 | CC0 1.0 |
| detail-waist-b.jpg | The same view from the opposite seam | DP155110 | 680×620+1200+2180 | CC0 1.0 |
| detail-flange-ladder.jpg | Waist nose flange face-on (ladder scoring) and the collar ribs | DP155109 | 300×700+1220+2250 | CC0 1.0 |
| detail-neck-band.jpg | Neck frieze at the seam axis: paired ring "eyes" left of the divider, squared spiral right of it | DP155109 | 420×260+1340+1990 | CC0 1.0 |
| detail-neck-band-b.jpg | The same neck frieze at the opposite seam | DP155110 | 420×260+1320+2020 | CC0 1.0 |
| detail-blade.jpg | One whole trumpet blade, from the neck band to the apex under the lip | DP155109 | 800×1550+1150+680 | CC0 1.0 |
| detail-rim-lip.jpg | The rim, with the front lip band and the interior | DP155109 | 1900×420+550+430 | CC0 1.0 |

The scout copies in the scratchpad (`01_DP155109.jpg`, `02_DP155110.jpg`, `03_DP155111.jpg`, 1800 px) are the
same three photographs. I measured on the full-resolution originals instead. They are kept, with the
measuring scripts, in `.work/dossier-met-gu/`, which is not deployed.
