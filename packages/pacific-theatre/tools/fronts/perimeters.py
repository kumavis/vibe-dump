"""The keyframes' perimeters (DATA.md §6), the dashed line round the island area Japan controlled, for build.py."""
import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import HERE
import numpy as np
import shapely
from shapely.geometry import LineString, box, mapping
from classify import classify_leaf

# the limit of Japan's advance in 1942, from Morton's Map I ("Limit of advance, May 1942") and Map 9, with
# the Gilberts, Nauru, Ocean Island, the Aleutians and the Kai, Aru and Tanimbar groups as the record dates
# them; schematic
LIMIT_1942_05 = [(93.4, 19.8), (91.8, 14.5), (91.9, 10.5), (92.6, 6.5), (94.6, 2.0), (99.0, -4.5), (105.6, -11.2), (112.0, -10.0), (118.0, -10.2),
                 (123.5, -11.2), (127.6, -9.0), (130.2, -5.2), (133.0, -4.6), (136.5, -2.0), (141.5, -2.2), (145.0, -4.3), (147.4, -7.3), (149.5, -6.8),
                 (152.0, -7.0), (155.5, -7.6), (159.0, -9.6), (161.0, -8.5), (165.0, -2.0), (173.6, 1.4), (172.8, 6.0), (169.5, 12.5), (167.5, 19.6),
                 (159.0, 25.0), (154.5, 27.0), (150.0, 33.0), (153.0, 43.0), (157.0, 50.8)]
LIMIT_1942_09 = [(93.4, 19.8), (91.8, 14.5), (91.9, 10.5), (92.6, 6.5), (94.6, 2.0), (99.0, -4.5), (105.6, -11.2), (112.0, -10.0), (118.0, -10.2),
                 (123.5, -11.2), (127.6, -9.0), (131.0, -8.6), (134.8, -7.0), (136.5, -4.6), (138.5, -2.4), (141.5, -2.2), (145.0, -4.3), (147.3, -7.6),
                 (148.6, -9.0), (151.0, -7.5), (155.5, -7.6), (158.5, -9.8), (160.5, -9.8), (162.5, -7.5), (167.4, -1.2), (170.2, -1.3), (173.6, 1.2),
                 (173.4, 3.6), (172.8, 6.0), (169.5, 12.5), (167.5, 19.6), (159.0, 25.0), (154.5, 27.0), (150.0, 33.0), (153.0, 43.0), (158.0, 50.5),
                 (172.0, 52.2), (178.2, 52.4), (178.4, 51.4), (172.0, 51.6), (160.0, 50.0)]


def near(m, r):
    out = m.copy()
    for _ in range(r):
        out = out | np.roll(out, 1, 0) | np.roll(out, -1, 0) | np.roll(out, 1, 1) | np.roll(out, -1, 1)
    return out


def perimeter_feature(line, name, sources):
    line = shapely.set_precision(line, 0.01)
    return {'type': 'Feature', 'properties': {'kind': 'perimeter', 'name': name, 'sources': sources}, 'geometry': mapping(line)}


def perimeters(kf, land, atlas, where, helpers):
    majority, fill_unknown, cells_to_geom = helpers
    if kf == '1942-05-08':
        return [perimeter_feature(LineString(LIMIT_1942_05), "the limit of Japan's advance", [{'id': 'morton-1962', 'where': 'Map I, "Limit of advance, May 1942"'}])]
    if kf == '1942-09-15':
        return [perimeter_feature(LineString(LIMIT_1942_09), "the limit of Japan's advance", [{'id': 'morton-1962', 'where': 'Maps I and 9'}, {'id': 'usn-chron', 'where': '1942, June to August'}])]
    leaf = atlas.get(kf)
    if not leaf or kf == '1945-09-02':
        return []
    d = 0.2
    lon = np.arange(80 + d / 2, 171, d)
    lat = np.arange(52 - d / 2, -28, -d)
    LO, LA = np.meshgrid(lon, lat)
    c = classify_leaf(leaf, LO.ravel(), LA.ravel(), region=(30, 2300, 300, 2735)).reshape(LO.shape).astype(np.int8)
    page = c != 0
    c = majority(c, page, r=2)
    closed = near(page, 3)
    c = fill_unknown(c, closed, iters=4)
    jp = ((c == 1) | (c == 4)) & closed
    zone = cells_to_geom(jp, lon, lat, d)
    zone = zone.buffer(0.3).buffer(-0.3)
    polys = [p for p in (zone.geoms if hasattr(zone, 'geoms') else [zone]) if p.area > 40]
    feats = []
    # only where the page itself shows the edge: inside its map, clear of the frame and of the binding's
    # shadow in the north-east
    off = cells_to_geom(~closed, lon, lat, d).buffer(1.0)
    frame = box(81.0, -27.0, 170.0, 51.0).difference(box(162.0, 36.0, 171.0, 52.0)).difference(off)
    keep_off = land.buffer(0.35)
    for p in polys:
        ring = LineString(p.exterior.coords).simplify(0.15)
        ring = ring.intersection(frame).difference(keep_off)
        parts = [g for g in (ring.geoms if hasattr(ring, 'geoms') else [ring]) if isinstance(g, LineString) and g.length > 4]
        for g in parts:
            feats.append(perimeter_feature(g, "the edge of Japan's sea area", [{'id': 'atlas-battle-fronts-1945', 'where': where[kf] + ': the white of the enemy-held sea'}]))
    return feats
