# Scratch: classify an Atlas leaf's colours onto a lon/lat grid.
#
# Per pixel: 'jp' (the white of enemy-held territory, light and neutral in hue), 'allied' (the pink tint
# and the deep red of the period's gains: red over green), 'neutral' (the grey, neutral in hue and darker
# than the white), 'black' (the period's enemy gains, solid near-black) and nothing for line work,
# lettering and anything between. A grid cell takes the majority of its window's votes; solid black wins
# where it fills most of the window (a line or a letter never does).
import sys, json, glob
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import FITS, VIEW
import numpy as np
from PIL import Image
from atlas_register import T, A

CLASSES = ['none', 'jp', 'allied', 'neutral', 'black']
# the inset maps some pages carry over the main map, in page pixels (x0, y0, x1, y1): no answer there
INSETS = {82: [(15, 2105, 615, 2715)]}


def pixel_classes(rgb):
    r, g, b = rgb[..., 0].astype(np.int16), rgb[..., 1].astype(np.int16), rgb[..., 2].astype(np.int16)
    mn = np.minimum(np.minimum(r, g), b)
    mx = np.maximum(np.maximum(r, g), b)
    mean = (r + g + b) / 3
    c = np.zeros(r.shape, np.uint8)
    light = mn >= 120
    c[light & (r - g >= 12)] = 2
    c[light & (r - g < 8) & (mean >= 165)] = 1
    c[light & (r - g < 8) & (mean < 163) & (mx - mn <= 14)] = 3
    c[(r - g >= 50) & (r >= 140)] = 2  # the deep red of the period's gains
    c[mx < 95] = 4
    return c


def integral(m):
    s = np.zeros((m.shape[0] + 1, m.shape[1] + 1), np.int32)
    s[1:, 1:] = m.astype(np.int32).cumsum(0).cumsum(1)
    return s


def window_sum(s, x, y, r):
    H, W = s.shape[0] - 1, s.shape[1] - 1
    x0 = np.clip(x - r, 0, W); x1 = np.clip(x + r + 1, 0, W)
    y0 = np.clip(y - r, 0, H); y1 = np.clip(y + r + 1, 0, H)
    return s[y1, x1] - s[y0, x1] - s[y1, x0] + s[y0, x0]


def classify_leaf(leaf, lons, lats, r=5, region=None):
    """class index (CLASSES) for each (lon, lat), 0 where the page has no answer or the point is off the map"""
    rgb = np.asarray(Image.open(sorted(glob.glob(A + f'*_{leaf:04d}.jp2'))[0]).convert('RGB'))
    cls = pixel_classes(rgb)
    j = json.load(open(FITS + f'T{leaf}.json'))
    t = T(j['coef'], j['order'])
    p = t(lons, lats)
    x = np.round(p[:, 0]).astype(int)
    y = np.round(p[:, 1]).astype(int)
    H, W = cls.shape
    # the map's own frame on the page: below the title band, above the caption, inside the scan
    x0, x1, y0, y1 = region or (30, min(W, 2480) - 10, 300, 2735)
    on = (x >= x0) & (x < x1) & (y >= y0) & (y < y1)
    for (a, b, c_, d) in INSETS.get(leaf, []):
        on &= ~((x >= a) & (x < c_) & (y >= b) & (y < d))
    votes = np.stack([window_sum(integral(cls == k), x, y, r) for k in range(5)], axis=-1)
    area = (2 * r + 1) ** 2
    out = np.argmax(votes[:, 1:4], axis=1) + 1
    out[votes[:, 1:4].max(axis=1) < 0.15 * area] = 0
    out[votes[:, 4] > 0.6 * area] = 4
    out[~on] = 0
    return out


if __name__ == '__main__':
    # a preview: the classes on a 0.1-degree grid, as an image (jp white, allied pink, neutral grey, black, none blue)
    leaf = int(sys.argv[1])
    d = 0.1
    lon = np.arange(78, 182, d)
    lat = np.arange(56, -32, -d)
    LON, LAT = np.meshgrid(lon, lat)
    c = classify_leaf(leaf, LON.ravel(), LAT.ravel()).reshape(LON.shape)
    pal = np.array([[60, 90, 200], [240, 240, 235], [225, 150, 140], [140, 140, 140], [20, 20, 20]], np.uint8)
    Image.fromarray(pal[c]).save(VIEW + f'cls{leaf}.png')
    print({CLASSES[k]: int((c == k).sum()) for k in range(5)})
