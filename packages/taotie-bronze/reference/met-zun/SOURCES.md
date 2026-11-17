# Sources: met-zun (Met 43.25.1)

Every file in this folder comes from The Metropolitan Museum of Art's Open Access photographs of this
object. The Met publishes them as public domain (CC0 1.0; the API record has `isPublicDomain: true`).
The licence does not require attribution, but each file carries the credit line the Met asks for.

Credit line: The Metropolitan Museum of Art, New York. Rogers Fund, 1943 (acc. 43.25.1). Public domain (CC0 1.0).

- Object record: https://www.metmuseum.org/art/collection/search/49383
- API record: https://collectionapi.metmuseum.org/public/collection/v1/objects/49383
- Wikidata: https://www.wikidata.org/wiki/Q116314007

The Met publishes four photographs of this object: the primaryImage and three additionalImages. A
Commons search turns up only a copy of DP140765 (`商 青銅尊-Wine Vase (Zun) MET DP140765.jpg`), and no
other open-licence views turned up. So the set has **no true side view, no top view and no view of
the underside**. I downloaded the full-resolution originals: DP140764/5/6 are 3000×4000 and DT2853 is
3811×2634. Full frames and crops were then downscaled to ≤1800 px on the long side
(ImageMagick `-resize '1800x1800>' -quality 86`). Crop boxes are given in original-image pixels
(w×h+x+y) and were cut from the un-rotated originals. The measurements in dossier.md use a copy
rotated by −1.8° to remove the camera roll; see dossier §b.1.

| file | what | source image | crop (orig px) | licence |
| --- | --- | --- | --- | --- |
| front.jpg | full view, camera on a **nose line** (belly + foot nose flanges, shoulder head and the symmetric neck blade on the centre line), az 0, el ≈ 12° | https://images.metmuseum.org/CRDImages/as/original/DP140765.jpg | full frame | CC0 1.0 |
| three-quarter.jpg | full view, camera on a **mould seam** (join flanges + shoulder strip + neck seam on the centre line), rotated 60° from front.jpg | https://images.metmuseum.org/CRDImages/as/original/DP140764.jpg | full frame | CC0 1.0 |
| detail-foot-mask.jpg | foot register, one full foot taotie centred on its nose flange, warm transparency scan | https://images.metmuseum.org/CRDImages/as/original/DT2853.jpg | full frame | CC0 1.0 |
| detail-inscription.jpg | interior floor, cast clan sign | https://images.metmuseum.org/CRDImages/as/original/DP140766.jpg | full frame | CC0 1.0 |
| detail-belly-mask.jpg | belly: both halves of the front taotie, kui frieze above, join flanges at both edges | DP140765 | 1470×700+780+2050 | CC0 1.0 |
| detail-belly-half.jpg | belly: right half-mask (nose flange → seam flange at +60°) | DP140765 | 720×630+1480+2100 | CC0 1.0 |
| detail-belly-seam.jpg | belly: two half-masks meeting at a seam flange | DP140764 | 1470×700+780+2050 | CC0 1.0 |
| detail-shoulder-head.jpg | shoulder: front animal head on the nose line, shoulder kui band, back heads at ±120° | DP140765 | 1600×700+700+1550 | CC0 1.0 |
| detail-shoulder-seam.jpg | shoulder: plain seam strip at centre, heads at ±60° | DP140764 | 1600×700+700+1550 | CC0 1.0 |
| detail-neck-blades.jpg | trumpet: 3 of the 9 rising blades (centre one on the nose line) and the neck kui band | DP140765 | 1800×850+600+1100 | CC0 1.0 |
| detail-neck-seam.jpg | trumpet: the two blades flanking a mould seam, thin seam ridge through the kui band | DP140764 | 1100×750+950+1150 | CC0 1.0 |
| detail-foot-front.jpg | foot register on the nose line, dentil band, plain foot rim | DP140765 | 1400×900+850+2750 | CC0 1.0 |
| detail-foot-seam.jpg | foot register on a seam | DP140764 | 1400×900+850+2750 | CC0 1.0 |
| detail-waist.jpg | rounded belly underside, waist, top of foot register | DP140765 | 1150×260+950+2640 | CC0 1.0 |
| detail-leiwen.jpg | foot: D-shaped horn with sunk leiwen inset (scale ≈ 11.8 px/mm in the original) | DT2853 | 700×850+1300+450 | CC0 1.0 |

`profile.json` and `spec.json` are derived measurements, not images. My own work, no licence restriction.
