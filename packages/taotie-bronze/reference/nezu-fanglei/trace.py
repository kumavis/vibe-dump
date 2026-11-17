#!/usr/bin/env python3
"""Trace the nezu-fanglei décor from its flattened faces (reference/nezu-fanglei/faces/*.jpg).

The raised bands of this bronze catch the light (pale grey-green tops) and the leiwen ground between them is
a fine dark texture, so the flattened photograph is the drawing: normalise by the local highlights,
threshold the plateaus, open away the leiwen ridges, keep the dark specks inside the plateaus as the incised
lines, and write both as polygons. No element is drawn from memory. Same method as
reference/met-fangding/trace.py, whose image helpers it reuses.

    python3 -I reference/nezu-fanglei/trace.py      → src/artifacts/nezu-fanglei/trace-data.js
                                                      + .work/r7-lei/trace/*.png (debug overlays)
Coordinates: x from the face centre line (mm, left → right seen from outside), y = VESSEL height (mm),
converted from each face's chord plane (y = centre.y + v · up.y). Each face contributes only between
its own y0 / y1 (the seams of faces.json), so a band crossing a seam is traced in two pieces that meet.
Requires python3 + PIL + numpy only.
"""
import json, os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(HERE, '..', 'met-fangding'))
from trace import gauss, gdilate, gerode, label, drop_small, contours, simplify, area, enc  # noqa: E402

OUT_JS = os.path.join(PKG, 'src', 'artifacts', 'nezu-fanglei', 'trace-data.js')
DBG = os.path.join(PKG, '.work', 'r7-lei', 'trace')
FACES = json.load(open(os.path.join(HERE, 'faces.json')))['faces']
RHO = 0.75
BELLY = [[21.5, 66.5], [35, 69.5], [50.5, 75.5], [70, 85.5], [101, 98.8], [125, 110.5], [150, 120.5], [178, 127.2], [215, 129.8], [245, 130.4], [263, 130.3]]
SHOULDER = [[263, 130.3], [276, 130.6], [294, 128], [310, 122], [319, 116], [325, 108.5]]


def half_at(y):
    t = SHOULDER if y > 263 else BELLY
    xs, ys = [r[0] for r in t], [r[1] for r in t]
    return float(np.interp(y, xs, ys))


def trace(face, *, y0, y1, keep=+1, t=0.62, incision_mm2=5.0, open_mm=0.8, min_mm2=6.0, hole_mm2=2.5,
          smooth_mm=0.45, close_mm=0.6, exclude=(), name=None, margin=2.0, hw=None):
    """Trace one face between vessel heights y0..y1, keep one half (+1 right, −1 left) and mirror it.
    exclude = [(x0, x1, ya, yb)] in (face x, vessel y) blanked first (flanges, heads, the lug)."""
    name = name or face
    F = FACES[face]
    im = Image.open(os.path.join(HERE, 'faces', face + '.jpg')).convert('RGB')
    ppmm = im.width / F['width']
    A = np.asarray(im).astype(np.float32)
    L = 0.25 * A[..., 0] + 0.5 * A[..., 1] + 0.25 * A[..., 2]
    Hh, Ww = L.shape
    cy, upy = F['center'][1], F['up'][1]
    # pixel grids → face x and vessel y
    xs = (np.arange(Ww) + 0.5) / ppmm - F['width'] / 2
    vs = F['height'] / 2 - (np.arange(Hh) + 0.5) / ppmm
    ys = cy + vs * upy
    X, Y = np.meshgrid(xs, ys)
    halfw = np.vectorize(half_at)(Y) if hw is None else np.full_like(Y, hw)
    valid = (Y >= y0) & (Y <= y1) & (np.abs(X) <= halfw - margin) & (X * keep >= 0)
    for (ex0, ex1, ea, eb) in exclude:
        valid &= ~((X >= ex0) & (X <= ex1) & (Y >= ea) & (Y <= eb))
    Lb = gauss(L, 0.12 * ppmm)
    hi = gauss(gdilate(gauss(L, 1.0 * ppmm), 3 * ppmm), 3 * ppmm)
    light = (Lb / np.maximum(hi, 1)) > t
    lab, sz = label(~light & valid)
    small = sz < incision_mm2 * ppmm * ppmm
    small[0] = False
    inc = small[lab]
    P = gdilate(gerode((light | inc).astype(np.float32), open_mm * ppmm), open_mm * ppmm) > 0.5
    P &= valid
    P = drop_small(P, min_mm2 * ppmm * ppmm)
    P = ~drop_small(~P, hole_mm2 * ppmm * ppmm)
    P &= valid
    P2 = gerode(gdilate(P.astype(np.float32), close_mm * ppmm), close_mm * ppmm) > 0.5
    P2 &= valid
    gaps = P2 & ~P
    Pf = gauss(P2.astype(np.float32), smooth_mm * ppmm)
    Pf[~valid] = 0
    Pm = Pf > 0.5
    inner = gerode(Pm.astype(np.float32), 0.45 * ppmm) > 0.5
    Lm = drop_small((inc & inner) | (gaps & Pm), 0.3 * ppmm * ppmm)
    Lf = gauss(Lm.astype(np.float32), 0.1 * ppmm)
    os.makedirs(DBG, exist_ok=True)
    dbg = np.stack([L] * 3, -1) * 0.6
    dbg[Pm] = dbg[Pm] * 0.5 + np.array([80, 160, 255]) * 0.5
    dbg[Lm] = [255, 40, 40]
    dbg[~valid] *= 0.35
    Image.fromarray(np.clip(dbg, 0, 255).astype(np.uint8)).save(os.path.join(DBG, name + '.png'))

    def to_mm(loops, tol, min_area):
        out = []
        for lp in loops:
            q = simplify(lp, tol * ppmm)
            if len(q) < 3 or area(q) < min_area * ppmm * ppmm:
                continue
            out.append([(round(float(xs[0] + (x - 0.5) / ppmm), 2), round(float(cy + (F['height'] / 2 - y / ppmm) * upy), 2)) for x, y in q])
        return out
    plateau = to_mm(contours(Pf), 0.06, 0.5)
    lines = to_mm(contours(Lf), 0.06, 0.15)
    # mirror the kept half onto the other
    mirror = lambda loops: [[(round(-x, 2), y) for x, y in l[::-1]] for l in loops]
    print(f'{name}: {len(plateau)} plateau loops, {len(lines)} line loops', file=sys.stderr)
    return {'plateau': plateau + mirror(plateau), 'lines': lines + mirror(lines), 'y': [y0, y1]}


if __name__ == '__main__':
    CF = (-4.5, 4.5, 0, 600)  # centre flange: not décor
    R = {
        'shoulder': trace('face-shoulder', y0=266.5, y1=320, keep=+1, exclude=[CF, (-32, 32, 260, 330)]),
        'main': trace('face-main', y0=178, y1=258, keep=+1, exclude=[CF]),
        'second': trace('face-second', y0=101, y1=178, keep=+1, exclude=[CF]),
        'low': trace('face-low', y0=38, y1=101, keep=+1, exclude=[CF, (-31, 31, 20, 104)]),
        'foot': trace('face-foot', y0=4.5, y1=20.5, keep=-1, exclude=[(-12, 12, 0, 30)], hw=62.5),
        'collar': trace('face-collar', y0=328, y1=373, keep=+1, exclude=[CF], hw=85.5),
    }
    js = ['// GENERATED by reference/nezu-fanglei/trace.py from the flattened photographs in reference/nezu-fanglei/faces/.',
          '// Do not edit by hand: re-run the tracer. Loops are int arrays in 0.05 mm, [x0, y0, dx1, dy1, …] (delta-coded);',
          '// x from the face centre line (left → right seen from outside), y = VESSEL height (mm).',
          'export default {']
    for k, v in R.items():
        js.append(f'  {k}: {{ y: {json.dumps(v["y"])},')
        js.append(f'    plateau: {json.dumps(enc(v["plateau"]), separators=(",", ":"))},')
        js.append(f'    lines: {json.dumps(enc(v["lines"]), separators=(",", ":"))} }},')
    js.append('}')
    os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
    open(OUT_JS, 'w').write('\n'.join(js) + '\n')
    print(f'wrote {OUT_JS} ({os.path.getsize(OUT_JS) // 1024} KB)', file=sys.stderr)
