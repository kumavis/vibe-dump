#!/usr/bin/env python3
"""Trace the met-fangding décor from its flattened faces (reference/met-fangding/faces/*.jpg).

The ground of this bronze is darkened almost black and the relief plateaus are pale, so the photograph
itself is the drawing: threshold the plateau, close the incised lines into it, keep the incised lines
separately, and write both as polygons in face mm. No element is drawn from memory.

    python3 -I reference/met-fangding/trace.py            → src/artifacts/met-fangding/trace-data.js
                                                            + .work/r5-met-fangding/trace/*.png (debug)
Face mm: x from the face centre line (left → right seen from outside), y = vessel height (mm).
Requires python3 + PIL + numpy only.
"""
import json, os, sys
import numpy as np
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(os.path.dirname(HERE))
OUT_JS = os.path.join(PKG, 'src', 'artifacts', 'met-fangding', 'trace-data.js')
DBG = os.path.join(PKG, '.work', 'r5-met-fangding', 'trace')
FACES = json.load(open(os.path.join(HERE, 'faces.json')))['faces']

# ---------------------------------------------------------------- image helpers
def gauss(a, s):
    if s <= 0.3:
        return a
    r = int(3 * s + 1)
    k = np.exp(-0.5 * (np.arange(-r, r + 1) / s) ** 2); k /= k.sum()
    p = np.pad(a, r, mode='edge')
    p = np.apply_along_axis(lambda v: np.convolve(v, k, 'valid'), 1, p)
    p = np.apply_along_axis(lambda v: np.convolve(v, k, 'valid'), 0, p)
    return p

def disk(r):
    r = max(1, int(round(r)))
    return [(dy, dx) for dy in range(-r, r + 1) for dx in range(-r, r + 1) if dx * dx + dy * dy <= r * r + 0.5]

def shift(a, dy, dx, fill):
    out = np.full_like(a, fill)
    H, W = a.shape
    ys, yd = (slice(0, H - dy), slice(dy, H)) if dy >= 0 else (slice(-dy, H), slice(0, H + dy))
    xs, xd = (slice(0, W - dx), slice(dx, W)) if dx >= 0 else (slice(-dx, W), slice(0, W + dx))
    out[yd, xd] = a[ys, xs]
    return out

def gdilate(a, r):
    out = a.copy()
    for dy, dx in disk(r):
        np.maximum(out, shift(a, dy, dx, a.min()), out=out)
    return out

def gerode(a, r):
    out = a.copy()
    for dy, dx in disk(r):
        np.minimum(out, shift(a, dy, dx, a.max()), out=out)
    return out

def label(m):
    """4-connected component labels (iterative flood fill on a bool array)."""
    H, W = m.shape
    lab = np.zeros((H, W), np.int32)
    n = 0
    sizes = [0]
    for y0, x0 in zip(*np.nonzero(m)):
        if lab[y0, x0]:
            continue
        n += 1
        st = [(y0, x0)]; lab[y0, x0] = n; c = 0
        while st:
            y, x = st.pop(); c += 1
            for yy, xx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
                if 0 <= yy < H and 0 <= xx < W and m[yy, xx] and not lab[yy, xx]:
                    lab[yy, xx] = n; st.append((yy, xx))
        sizes.append(c)
    return lab, np.array(sizes)

def drop_small(m, min_px):
    lab, sz = label(m)
    keep = sz >= min_px; keep[0] = False
    return keep[lab]

# ---------------------------------------------------------------- contours (crack following)
def contours(f, level=0.5, chaikin=2):
    """Closed outlines of {f > level}, following the pixel cracks (inside always on the same side, so
    holes come out as their own loops for even-odd filling), then Chaikin-smoothed.
    Returns loops of (x, y) in px (x right, y down; pixel centres at +0.5)."""
    M = np.pad(f > level, 1, constant_values=False)
    H, W = M.shape
    out = {}
    def add(a, b):
        out.setdefault(a, []).append(b)
    ins = M[1:-1, 1:-1]
    ys, xs = np.nonzero(ins & ~M[:-2, 1:-1]);  [add((y, x), (y, x + 1)) for y, x in zip(ys, xs)]
    ys, xs = np.nonzero(ins & ~M[1:-1, 2:]);   [add((y, x + 1), (y + 1, x + 1)) for y, x in zip(ys, xs)]
    ys, xs = np.nonzero(ins & ~M[2:, 1:-1]);   [add((y + 1, x + 1), (y + 1, x)) for y, x in zip(ys, xs)]
    ys, xs = np.nonzero(ins & ~M[1:-1, :-2]);  [add((y + 1, x), (y, x)) for y, x in zip(ys, xs)]
    loops = []
    while out:
        v0 = next(iter(out)); loop = [v0]; v = v0; prev = None
        while True:
            nb = out.get(v)
            if not nb:
                break
            if len(nb) > 1 and prev is not None:
                d = (v[0] - prev[0], v[1] - prev[1])
                # at a diagonal touch take the right turn (y down): keeps the two pixels apart
                right = (d[1], -d[0])
                nb.sort(key=lambda w: 0 if (w[0] - v[0], w[1] - v[1]) == right else 1)
            w = nb.pop(0)
            if not nb:
                del out[v]
            prev, v = v, w
            if v == v0:
                break
            loop.append(v)
        if len(loop) >= 4:
            pts = np.array([(x, y) for y, x in loop], float)
            for _ in range(chaikin):
                q = np.roll(pts, -1, 0)
                pts = np.stack([0.75 * pts + 0.25 * q, 0.25 * pts + 0.75 * q], 1).reshape(-1, 2)
            loops.append([tuple(p) for p in pts])
    return loops

def simplify(pts, tol):
    pts = np.asarray(pts)
    if len(pts) < 5:
        return pts
    # Douglas-Peucker on a closed loop: split at the two farthest points
    i0 = 0; i1 = int(np.argmax(((pts - pts[0]) ** 2).sum(1)))
    def dp(p):
        if len(p) < 3:
            return p
        a, b = p[0], p[-1]
        ab = b - a; L = np.hypot(*ab) + 1e-9
        d = np.abs(ab[0] * (p[:, 1] - a[1]) - ab[1] * (p[:, 0] - a[0])) / L
        i = int(np.argmax(d))
        if d[i] > tol:
            return np.vstack([dp(p[:i + 1])[:-1], dp(p[i:])])
        return np.vstack([a, b])
    A = dp(pts[i0:i1 + 1]); B = dp(np.vstack([pts[i1:], pts[:1]]))
    return np.vstack([A[:-1], B[:-1]])

def area(p):
    x, y = p[:, 0], p[:, 1]
    return 0.5 * abs(np.dot(x, np.roll(y, 1)) - np.dot(y, np.roll(x, 1)))

# ---------------------------------------------------------------- tracing one region
def trace(face, rect, *, t=0.6, incision_mm2=6.0, open_mm=0.75, min_mm2=5.0, hole_mm2=2.0, smooth_mm=0.4, close_mm=0.6,
          exclude=(), name='x', inset=0.9):
    """rect = (x0, x1, y0, y1) in face mm; exclude = list of (x0, x1, y0, y1) to blank (flanges).

    Light / dark split on the photo normalised by its local highlights (so a plateau in shade still counts
    as light); dark specks smaller than `incision_mm2` lying in light are the incised lines on the
    plateaus (kept separately); the leiwen ridges are thinner than the bands, so an opening of radius
    `open_mm` removes them and keeps every band at its true outline."""
    F = FACES[face]
    im = Image.open(os.path.join(HERE, 'faces', face + '.jpg')).convert('RGB')
    ppmm = im.width / F['width']
    A = np.asarray(im).astype(np.float32)
    L = 0.25 * A[..., 0] + 0.5 * A[..., 1] + 0.25 * A[..., 2]
    cy = F['center'][1]
    def X(u): return (u + F['width'] / 2) * ppmm
    def Y(y): return (cy + F['height'] / 2 - y) * ppmm
    x0, x1, y0, y1 = rect
    x0, x1, y0, y1 = x0 + inset, x1 - inset, y0 + inset, y1 - inset   # stay off the field's border fillet
    c0, c1, r0, r1 = int(X(x0)), int(X(x1)), int(Y(y1)), int(Y(y0))
    Lr = L[r0:r1, c0:c1]
    valid = np.ones_like(Lr, bool)
    for (ex0, ex1, ey0, ey1) in exclude:
        valid[max(0, int(Y(ey1)) - r0):max(0, int(Y(ey0)) - r0), max(0, int(X(ex0)) - c0):max(0, int(X(ex1)) - c0)] = False
    Lb = gauss(Lr, 0.12 * ppmm)
    hi = gauss(gdilate(gauss(Lr, 1.0 * ppmm), 3 * ppmm), 3 * ppmm)
    light = (Lb / np.maximum(hi, 1)) > t
    lab, sz = label(~light)
    small = sz < incision_mm2 * ppmm * ppmm; small[0] = False
    inc = small[lab]
    P = gdilate(gerode((light | inc).astype(np.float32), open_mm * ppmm), open_mm * ppmm) > 0.5
    P &= valid
    P = drop_small(P, min_mm2 * ppmm * ppmm)
    P = ~drop_small(~P, hole_mm2 * ppmm * ppmm)
    P &= valid
    # bands that touch along an incised contour line come out as separate islands with a < 1.2 mm gap:
    # close those gaps (the plateau runs through) and keep each gap as an incised line instead
    P2 = gerode(gdilate(P.astype(np.float32), close_mm * ppmm), close_mm * ppmm) > 0.5
    P2 &= valid
    gaps = P2 & ~P
    Pf = gauss(P2.astype(np.float32), smooth_mm * ppmm)
    P = Pf > 0.5
    inner = gerode(P.astype(np.float32), 0.45 * ppmm) > 0.5
    Lm = drop_small((inc & inner) | (gaps & P), 0.3 * ppmm * ppmm)
    Lf = gauss(Lm.astype(np.float32), 0.1 * ppmm)
    os.makedirs(DBG, exist_ok=True)
    dbg = np.stack([Lr] * 3, -1) * 0.55
    dbg[P] = dbg[P] * 0.5 + np.array([80, 160, 255]) * 0.5
    dbg[Lm] = [255, 40, 40]
    Image.fromarray(np.clip(dbg, 0, 255).astype(np.uint8)).save(os.path.join(DBG, name + '.png'))
    def to_mm(loops, tol, min_area):
        out = []
        for lp in loops:
            q = simplify(lp, tol * ppmm)
            if len(q) < 3 or area(q) < min_area * ppmm * ppmm:
                continue
            out.append([(round(x0 + x / ppmm, 2), round(y1 - y / ppmm, 2)) for x, y in q])
        return out
    plateau = to_mm(contours(Pf), 0.05, 0.4)
    lines = to_mm(contours(Lf), 0.05, 0.12)
    print(f'{name}: {len(plateau)} plateau loops ({sum(map(len, plateau))} pts), {len(lines)} line loops ({sum(map(len, lines))} pts)', file=sys.stderr)
    return {'rect': [x0, x1, y0, y1], 'plateau': plateau, 'lines': lines}

def enc(loops):
    """Loops → compact: each loop a flat int array in 0.05 mm units, delta-coded after the first point."""
    out = []
    for lp in loops:
        q = [(int(round(x * 20)), int(round(y * 20))) for x, y in lp]
        flat = [q[0][0], q[0][1]]
        for (a, b), (c, d) in zip(q, q[1:]):
            flat += [c - a, d - b]
        out.append(flat)
    return out

def mirror_half(R, keep, anchors):
    """Replace one half of a traced register by the mirror image of the other (the cleaner trace).
    keep = +1 keeps the right half (x > 0), −1 the left. anchors = [(x_src, x_dst), …] with x_src on the
    kept side, x_dst its counterpart MEASURED on the other half of the same photograph (flange edge, eye or
    head centre, field edge): the copy is warped piecewise-linearly through them, so the replaced half keeps
    the photographed positions of its landmarks — the two halves of this bronze differ by up to 4 mm."""
    src = np.array([a for a, _ in anchors], float); dst = np.array([b for _, b in anchors], float)
    order = np.argsort(src); src, dst = src[order], dst[order]
    def f(x):
        return float(np.interp(x, src, dst, left=dst[0] + (x - src[0]) * (dst[1] - dst[0]) / (src[1] - src[0]),
                               right=dst[-1] + (x - src[-1]) * (dst[-1] - dst[-2]) / (src[-1] - src[-2])))
    out = {'rect': R['rect']}
    for k in ('plateau', 'lines'):
        kept = [l for l in R[k] if np.mean([p[0] for p in l]) * keep > 0]
        out[k] = kept + [[(round(f(x), 2), y) for x, y in l[::-1]] for l in kept]
    return out

if __name__ == '__main__':
    CF = [(-3.4, 3.4, 90, 190)]  # the centre flange crosses both registers: not décor
    # The right half of each long-face register and of the short mask traces cleanly; the left halves are
    # paler and more corroded and break up (see .work/r5-met-fangding/trace/*.png). Each poor half is the
    # warped mirror of the good one, pinned to landmarks measured on the poor half itself.
    R = {
        'longMain': mirror_half(trace('face-long-main', (-74.6, 74.6, 103.0, 149.0), exclude=CF + [(66.6, 75, 102, 150)], name='long-main'),
                                +1, [(3.4, -3.4), (28.0, -31.6), (74.6, -74.6)]),
        'longFrieze': mirror_half(trace('face-long-frieze', (-75.1, 75.1, 152.8, 172.9), exclude=CF, name='long-frieze'),
                                  +1, [(3.4, -3.4), (39.3, -41.6), (75.1, -75.1)]),
        'shortMain': mirror_half(trace('face-short-main', (-58.2, 58.2, 103.0, 149.0), exclude=CF, name='short-main', open_mm=0.85),
                                 +1, [(3.4, -3.4), (29.2, -28.7), (58.2, -58.2)]),
        'shortFrieze': mirror_half(trace('face-short', (-58.9, 58.9, 153.6, 172.9), exclude=CF, name='short-frieze', open_mm=0.85),
                                   -1, [(-3.4, 3.4), (-25.8, 22.5), (-58.9, 58.9)]),
    }
    js = ['// GENERATED by reference/met-fangding/trace.py from the flattened photographs in reference/met-fangding/faces/.',
          '// Do not edit by hand: re-run the tracer. Loops are int arrays in 0.05 mm, [x0, y0, dx1, dy1, …] (delta-coded);',
          '// x from the face centre line (left → right seen from outside), y = vessel height (mm).',
          'export default {']
    for k, v in R.items():
        js.append(f'  {k}: {{ rect: {json.dumps(v["rect"])},')
        js.append(f'    plateau: {json.dumps(enc(v["plateau"]), separators=(",", ":"))},')
        js.append(f'    lines: {json.dumps(enc(v["lines"]), separators=(",", ":"))} }},')
    js.append('}')
    os.makedirs(os.path.dirname(OUT_JS), exist_ok=True)
    open(OUT_JS, 'w').write('\n'.join(js) + '\n')
    print(f'wrote {OUT_JS} ({os.path.getsize(OUT_JS) // 1024} KB)', file=sys.stderr)
