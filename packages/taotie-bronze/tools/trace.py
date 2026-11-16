#!/usr/bin/env python3
"""Trace the raised PLATES of a flattened face photograph into polygons (KIT.md § Tracing plates from a flattened face).

    python3 tools/trace.py <id> <face> [<face> …]      e.g.  python3 tools/trace.py nezu-fanglei face-main
    python3 tools/trace.py <id> --all                   every face in reference/<id>/faces.json
    options: --no-preview  --quiet  --out <dir> (default: beside the photo, reference/<id>/faces/)

Reads   reference/<id>/faces/<face>.jpg, its entry in reference/<id>/faces.json (width × height mm) and the
        optional HINTS file reference/<id>/faces/<face>.trace.json.
Writes  <face>.plates.json   closed polygons with holes + bosses, in FACE MM
        <face>.trace.jpg     preview: photograph with a mm grid | mask by source | polygons over the photograph

Coordinates (plates.json, hints, everything): face mm, ORIGIN AT THE BOTTOM-LEFT CORNER of the face rectangle, x right
(seen from outside), y up — the ReliefPanel convention. The face centre is (width/2, height/2); faces.json `center` sits
there. A face is the flattened image of its register's chord plane: vessel y = center.y + (y − height/2)·up.y/|up|.

Method (python3 + numpy + PIL only):
  1. illumination flattening: log luminance minus its own ≈ 6 mm blur (gradients, glare halos and colour casts go)
  2. a plate score per pixel: −texture (band-passed 0.12–0.5 mm energy over a `window`, the leiwen threads are busy,
     plate tops are not) + brightness (plate tops are usually paler) + edge-free distance; robust z-scores
  3. threshold (Otsu over the field, + per-region overrides), optional mirror-average of the SCORE about the axis
  4. scale filter: an opening of `minWidth` (threads under ≈ 1.5 mm cannot survive), a closing of `close` (the incised
     lines on plate tops close up), small islands and pinholes dropped
  5. hints: include / exclude / erase shapes, plate / ground seeds, hand-drawn polygons and bands (optionally SNAPPED to
     the photograph's edges by dynamic programming), symmetry (mirror the readable half, or average both)
  6. crack-following contours, Chaikin smoothing, Douglas–Peucker at `simplify` mm (keeps squared hooked ends), holes
Confidence: the fraction of the field the classifier could READ (not shadow, not glare, score clear of the threshold),
the unread regions as boxes, and the plate area split into traced / mirrored / drawn.
"""
import json
import os
import sys
import time

import numpy as np
from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)

DEFAULTS = {
    'illum': 6.0,        # mm: illumination flattening blur
    'window': 1.2,       # mm: texture window
    'texture': 0.5,      # weight of −texture energy in the score
    'valley': 1.0,       # weight of −(density of thin dark lines: leiwen grooves, channels) in the score
    'valleyK': 0.15,     # how much darker than its 0.7 mm surround a pixel must be to count as a line
    'brightness': 0.6,   # weight of brightness
    'edges': 0.0,        # weight of "far from any strong edge"
    'threshold': None,   # score threshold (None: Otsu over the field) …
    'bias': 0.0,         # … plus this (− = more plate)
    'mirrorScore': False,  # average the score with its mirror image before thresholding (symmetric registers)
    'minWidth': 1.5,     # mm: narrower than this is ground texture, not a plate
    'close': 0.6,        # mm: closing radius (incised lines on the tops)
    'minArea': 8.0,      # mm²: smaller islands dropped
    'minHole': 4.0,      # mm²: smaller holes filled
    'grow': 0.3,         # mm: grow the TRACED plates by this (the dark contour line just inside a plate edge reads as ground)
    'smooth': 0.2,       # mm: final mask blur before contouring
    'simplify': 0.3,     # mm: Douglas–Peucker tolerance
    'shadow': 0.38,      # unread if local luminance < shadow × field median …
    'glare': 2.4,        # … or > glare × field median (or saturated)
    'ambiguous': 0.25,   # unread if |score − threshold| < ambiguous (score units ≈ IQRs)
}


# ------------------------------------------------------------------ image helpers
def blur(a, sigma):
    """≈ gaussian (three box passes, cumulative sums), sigma in px."""
    if sigma <= 0.3:
        return a.astype(np.float32)
    r = max(1, int(round(np.sqrt(12 * sigma * sigma / 3 + 1) / 2 - 0.5)))
    out = a.astype(np.float32)
    for _ in range(3):
        for ax in (0, 1):
            pad = [(0, 0), (0, 0)]
            pad[ax] = (r + 1, r)
            c = np.cumsum(np.pad(out, pad, mode='edge'), axis=ax, dtype=np.float64)
            if ax == 0:
                out = ((c[2 * r + 1:] - c[:-2 * r - 1]) / (2 * r + 1)).astype(np.float32)
            else:
                out = ((c[:, 2 * r + 1:] - c[:, :-2 * r - 1]) / (2 * r + 1)).astype(np.float32)
    return out


def disk_conv(m, r):
    """m (bool/float) convolved with a disc of radius r px (FFT)."""
    r = max(0.5, float(r))
    R = int(np.ceil(r))
    yy, xx = np.mgrid[-R:R + 1, -R:R + 1]
    k = (xx * xx + yy * yy <= r * r + 0.25).astype(np.float32)
    H, W = m.shape
    sh = (H + 2 * R + 1, W + 2 * R + 1)
    F = np.fft.rfft2(np.pad(m.astype(np.float32), ((R, R + 1), (R, R + 1))), sh)
    K = np.fft.rfft2(k, sh)
    c = np.fft.irfft2(F * K, sh)
    return c[2 * R:2 * R + H, 2 * R:2 * R + W], k.sum()


def dilate(m, r):
    if r <= 0:
        return m.copy()
    c, _ = disk_conv(m, r)
    return c > 0.5


def erode(m, r):
    if r <= 0:
        return m.copy()
    c, n = disk_conv(m, r)
    return c > n - 0.5


def label(m):
    """8-connected labels via row runs + union-find. → (labels int32, sizes)"""
    H, W = m.shape
    parent = [0]
    runs = []  # (row, x0, x1, id)
    prev = []
    for y in range(H):
        row = m[y]
        if not row.any():
            prev = []
            continue
        d = np.diff(np.r_[0, row.astype(np.int8), 0])
        xs0 = np.nonzero(d == 1)[0]
        xs1 = np.nonzero(d == -1)[0]
        cur = []
        j = 0
        for a, b in zip(xs0.tolist(), xs1.tolist()):
            rid = len(parent)
            parent.append(rid)
            while j < len(prev) and prev[j][1] < a:  # prev run [pa, pb) cannot touch [a, b) (8-connectivity)
                j += 1
            k = j
            while k < len(prev) and prev[k][0] <= b:
                ra, rb = find(parent, rid), find(parent, prev[k][2])
                if ra != rb:
                    parent[max(ra, rb)] = min(ra, rb)
                k += 1
            cur.append((a, b, rid))
            runs.append((y, a, b, rid))
        prev = cur
    lab = np.zeros((H, W), np.int32)
    roots = {}
    for y, a, b, rid in runs:
        r = find(parent, rid)
        if r not in roots:
            roots[r] = len(roots) + 1
        lab[y, a:b] = roots[r]
    sizes = np.bincount(lab.ravel(), minlength=len(roots) + 1)
    return lab, sizes


def find(parent, i):
    while parent[i] != i:
        parent[i] = parent[parent[i]]
        i = parent[i]
    return i


def drop_small(m, min_px):
    lab, sz = label(m)
    keep = sz >= min_px
    keep[0] = False
    return keep[lab]


def otsu(a):
    h, e = np.histogram(a, 256)
    c = (e[:-1] + e[1:]) / 2
    w = np.cumsum(h).astype(float)
    mu = np.cumsum(h * c)
    W = w[-1]
    sb = (mu[-1] * w / W - mu) ** 2 / (w * (W - w) + 1e-9)
    return float(c[np.argmax(sb)])


# ------------------------------------------------------------------ geometry helpers
class Face:
    def __init__(self, wmm, hmm, W, H):
        self.wmm, self.hmm, self.W, self.H = wmm, hmm, W, H
        self.ppmm = W / wmm

    def px(self, p):  # face mm → image px (x right, y down), pixel centres at +0.5
        return (p[0] * self.ppmm, (self.hmm - p[1]) * self.ppmm)

    def mm(self, x, y):
        return (x / self.ppmm, self.hmm - y / self.ppmm)


def shape_mask(face, shape, value=True):
    """Rasterise a hint shape: {"box": [x0,y0,x1,y1]} | {"poly": [[x,y]…]} | {"circle": [x,y,r]} | {"band": [[x,y]…],
    "width": mm, "cap": "square"|"round"} | a bare [[x,y]…] list. → bool array."""
    im = Image.new('L', (face.W, face.H), 0)
    d = ImageDraw.Draw(im)
    s = shape
    if isinstance(s, list):
        s = {'poly': s}
    if 'box' in s:
        x0, y0, x1, y1 = s['box']
        a, b = face.px((min(x0, x1), max(y0, y1)))
        c, e = face.px((max(x0, x1), min(y0, y1)))
        d.rectangle([a, b, c - 1, e - 1], fill=255)
    elif 'circle' in s:
        x, y, r = s['circle']
        cx, cy = face.px((x, y))
        rr = r * face.ppmm
        d.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=255)
    elif 'band' in s:
        pts = [face.px(p) for p in s['band']]
        w = s.get('width', 8) * face.ppmm
        d.line(pts, fill=255, width=max(1, int(round(w))), joint='curve')
        cap = s.get('cap', 'square')
        for i in (0, -1):
            p = np.array(pts[i])
            q = np.array(pts[1 if i == 0 else -2])
            if cap == 'round':
                d.ellipse([p[0] - w / 2, p[1] - w / 2, p[0] + w / 2, p[1] + w / 2], fill=255)
            else:  # square: extend by w/2 — corners slightly rounded by the final smoothing
                t = (p - q) / (np.hypot(*(p - q)) + 1e-9)
                n = np.array([-t[1], t[0]])
                e = p + t * w / 2 * (cap == 'square')
                quad = [tuple(p + n * w / 2), tuple(e + n * w / 2), tuple(e - n * w / 2), tuple(p - n * w / 2)]
                d.polygon(quad, fill=255)
    else:
        pts = [face.px(p) for p in s['poly']]
        if len(pts) >= 3:
            d.polygon(pts, fill=255)
    m = np.asarray(im) > 127
    if (s.get('round') or s.get('inner')) and m.any():
        ys, xs = np.nonzero(m)
        pad = int(np.ceil(max(float(s.get('round', 0)), float(s.get('inner', 0))) * face.ppmm)) + 3
        y0, y1, x0, x1 = max(0, ys.min() - pad), ys.max() + pad + 1, max(0, xs.min() - pad), xs.max() + pad + 1
        c = m[y0:y1, x0:x1]
        if s.get('round'):  # corners rounded to ≈ this radius (mm): gaussian blur + threshold keeps straight edges where
            # they are and an arm narrower than ≈ 2 × round only slightly thinner (an opening would delete it)
            c = blur(c.astype(np.float32), float(s['round']) * face.ppmm / 1.6) >= 0.5
        if s.get('inner'):  # inner (re-entrant) corners filled to this radius (mm)
            r = float(s['inner']) * face.ppmm
            c = erode(dilate(c, r), r)
        m = m.copy()
        m[y0:y1, x0:x1] = c
    if s.get('mirror'):
        m = m | mirror_arr(m, face, s.get('axis', face.wmm / 2))
    return m


def mirror_index(face, axis_mm):
    c = np.arange(face.W)
    j = np.round(2 * axis_mm * face.ppmm - c - 1).astype(int)
    return j


def mirror_arr(a, face, axis_mm):
    j = mirror_index(face, axis_mm)
    ok = (j >= 0) & (j < face.W)
    out = np.zeros_like(a)
    out[:, ok] = a[:, j[ok]]
    return out


def shapes_mask(face, shapes):
    m = np.zeros((face.H, face.W), bool)
    for s in shapes or []:
        m |= shape_mask(face, s)
    return m


# ------------------------------------------------------------------ snapping (drawn outlines → the photograph's edges)
def densify(pts, step):
    out = []
    n = len(pts)
    for i in range(n):
        a = np.array(pts[i], float)
        b = np.array(pts[(i + 1) % n], float)
        L = np.hypot(*(b - a))
        k = max(1, int(np.ceil(L / step)))
        for t in range(k):
            out.append(a + (b - a) * t / k)
    return np.array(out)


def snap_poly(face, pts_mm, gx, gy, radius_mm, prior=0.35, smooth=1.0):
    """Move a drawn closed outline onto the strongest edge NORMAL to it within ± radius (dynamic programming:
    edge strength − prior·|offset| − smooth·|Δoffset| between neighbours). Returns the snapped outline in mm."""
    P = np.array([face.px(p) for p in pts_mm], float)
    if len(P) < 3:
        return pts_mm
    area = 0.5 * np.sum(P[:, 0] * np.roll(P[:, 1], -1) - np.roll(P[:, 0], -1) * P[:, 1])
    D = densify(P, 0.5 * face.ppmm)
    n = len(D)
    T = np.roll(D, -1, 0) - np.roll(D, 1, 0)
    T /= np.hypot(T[:, 0], T[:, 1])[:, None] + 1e-9
    N = np.stack([T[:, 1], -T[:, 0]], 1) * (1 if area > 0 else -1)  # outward in image coords (y down)
    R = radius_mm * face.ppmm
    offs = np.arange(-R, R + 1e-6, 0.5)
    K = len(offs)
    X = D[:, None, 0] + N[:, None, 0] * offs[None, :]
    Y = D[:, None, 1] + N[:, None, 1] * offs[None, :]
    xi = np.clip(np.round(X - 0.5).astype(int), 0, face.W - 1)
    yi = np.clip(np.round(Y - 0.5).astype(int), 0, face.H - 1)
    e = np.abs(gx[yi, xi] * N[:, None, 0] + gy[yi, xi] * N[:, None, 1])
    e = e / (np.percentile(e, 95) + 1e-9)
    cost = -e + prior * np.abs(offs)[None, :] / max(R, 1)
    dk = np.abs(np.arange(K)[:, None] - np.arange(K)[None, :]) * (smooth / max(1, K / 8))
    acc = cost[0].copy()
    back = np.zeros((n, K), int)
    for i in range(1, n):
        tot = acc[:, None] + dk
        back[i] = np.argmin(tot, 0)
        acc = tot[back[i], np.arange(K)] + cost[i]
    k = int(np.argmin(acc))
    ks = [k]
    for i in range(n - 1, 0, -1):
        k = back[i, k]
        ks.append(k)
    ks = np.array(ks[::-1])
    S = D + N * offs[ks][:, None]
    # light smoothing along the outline (the DP leaves 0.5 px steps)
    S = (np.roll(S, 1, 0) + 2 * S + np.roll(S, -1, 0)) / 4
    return [face.mm(x, y) for x, y in S]


# ------------------------------------------------------------------ contours
def contours(M):
    """Closed crack-following outlines of a bool mask (px corners, x right, y down). Outer loops come out with one
    orientation, holes with the other."""
    M = np.pad(M, 1, constant_values=False)
    nxt = {}

    def add(a, b):
        nxt.setdefault(a, []).append(b)

    ins = M[1:-1, 1:-1]
    ys, xs = np.nonzero(ins & ~M[:-2, 1:-1])
    for y, x in zip(ys.tolist(), xs.tolist()):
        add((y, x), (y, x + 1))
    ys, xs = np.nonzero(ins & ~M[1:-1, 2:])
    for y, x in zip(ys.tolist(), xs.tolist()):
        add((y, x + 1), (y + 1, x + 1))
    ys, xs = np.nonzero(ins & ~M[2:, 1:-1])
    for y, x in zip(ys.tolist(), xs.tolist()):
        add((y + 1, x + 1), (y + 1, x))
    ys, xs = np.nonzero(ins & ~M[1:-1, :-2])
    for y, x in zip(ys.tolist(), xs.tolist()):
        add((y + 1, x), (y, x))
    loops = []
    while nxt:
        v0 = next(iter(nxt))
        loop = [v0]
        v = v0
        prev = None
        while True:
            nb = nxt.get(v)
            if not nb:
                break
            if len(nb) > 1 and prev is not None:
                d = (v[0] - prev[0], v[1] - prev[1])
                right = (d[1], -d[0])
                nb.sort(key=lambda w: 0 if (w[0] - v[0], w[1] - v[1]) == right else 1)
            w = nb.pop(0)
            if not nb:
                del nxt[v]
            prev, v = v, w
            if v == v0:
                break
            loop.append(v)
        if len(loop) >= 4:
            loops.append(np.array([(x, y) for y, x in loop], float))
    return loops


def chaikin(P, n=2):
    for _ in range(n):
        Q = np.roll(P, -1, 0)
        P = np.stack([0.75 * P + 0.25 * Q, 0.25 * P + 0.75 * Q], 1).reshape(-1, 2)
    return P


def dp_simplify(P, tol):
    if len(P) < 6:
        return P
    i1 = int(np.argmax(((P - P[0]) ** 2).sum(1)))

    def dp(p):
        keep = np.zeros(len(p), bool)
        keep[0] = keep[-1] = True
        st = [(0, len(p) - 1)]
        while st:
            a, b = st.pop()
            if b - a < 2:
                continue
            A, B = p[a], p[b]
            ab = B - A
            L = np.hypot(*ab) + 1e-9
            seg = p[a + 1:b]
            d = np.abs(ab[0] * (seg[:, 1] - A[1]) - ab[1] * (seg[:, 0] - A[0])) / L
            i = int(np.argmax(d))
            if d[i] > tol:
                m = a + 1 + i
                keep[m] = True
                st += [(a, m), (m, b)]
        return p[keep]

    A = dp(P[:i1 + 1])
    B = dp(np.vstack([P[i1:], P[:1]]))
    return np.vstack([A[:-1], B[:-1]])


def signed_area(P):
    x, y = P[:, 0], P[:, 1]
    return 0.5 * float(np.dot(x, np.roll(y, -1)) - np.dot(np.roll(x, -1), y))


def point_in(P, q):
    x, y = P[:, 0], P[:, 1]
    x2, y2 = np.roll(x, -1), np.roll(y, -1)
    c = ((y > q[1]) != (y2 > q[1])) & (q[0] < (x2 - x) * (q[1] - y) / (y2 - y + 1e-12) + x)
    return bool(c.sum() % 2)


# ------------------------------------------------------------------ the trace
def load_json(p, default=None):
    if os.path.exists(p):
        with open(p) as f:
            return json.load(f)
    return default


def score_map(L, ppmm, P, valid):
    ll = np.log(L + 0.03)
    ln = ll - blur(ll, P['illum'] * ppmm)
    ln = ln / (np.std(ln[valid]) + 1e-6)
    bp = blur(ln, 0.12 * ppmm) - blur(ln, 0.5 * ppmm)
    tex = np.log(blur(bp * bp, P['window'] * ppmm) + 1e-4)
    bri = blur(ln, 1.0 * ppmm)

    def z(a):
        v = a[valid]
        q1, q2, q3 = np.percentile(v, [25, 50, 75])
        return (a - q2) / (q3 - q1 + 1e-6)

    ztex, zbri = z(tex), z(bri)
    S = -P['texture'] * ztex + P['brightness'] * zbri
    if P['valley']:
        v = ((blur(ln, 0.7 * ppmm) - blur(ln, 0.1 * ppmm)) > P['valleyK']).astype(np.float32)
        S = S - P['valley'] * z(blur(v, P['window'] * ppmm))
    if P['edges']:
        g = blur(ln, 0.3 * ppmm)
        gx = np.zeros_like(g)
        gy = np.zeros_like(g)
        gx[:, 1:-1] = g[:, 2:] - g[:, :-2]
        gy[1:-1] = g[2:] - g[:-2]
        gm = np.hypot(gx, gy)
        strong = gm > np.percentile(gm[valid], 80)
        far = blur(strong.astype(np.float32), 0.8 * ppmm)
        S = S - P['edges'] * z(far)
    return S, ln


def trace_face(vid, face_name, out_dir=None, preview=True, quiet=False):
    t0 = time.time()
    ref = os.path.join(PKG, 'reference', vid)
    faces = load_json(os.path.join(ref, 'faces.json'))
    if not faces or face_name not in faces['faces']:
        raise SystemExit(f'no face {face_name} in reference/{vid}/faces.json')
    F = faces['faces'][face_name]
    img_p = os.path.join(ref, 'faces', face_name + '.jpg')
    out_dir = out_dir or os.path.join(ref, 'faces')
    os.makedirs(out_dir, exist_ok=True)
    hints_p = os.path.join(ref, 'faces', face_name + '.trace.json')
    hints = load_json(hints_p, {})
    im = Image.open(img_p).convert('RGB')
    A = np.asarray(im, np.float32) / 255
    H, W = A.shape[:2]
    face = Face(F['width'], F['height'], W, H)
    ppmm = face.ppmm
    P = dict(DEFAULTS)
    P.update(hints.get('params', {}))
    L = 0.3 * A[..., 0] + 0.55 * A[..., 1] + 0.15 * A[..., 2]

    # the field: the decorated area (hint), minus the rectifier's out-of-photo fill
    outside = blur((np.abs(A - 24 / 255).max(2) < 0.016).astype(np.float32), 2.0) > 0.97  # uniform fill, not a dark photo
    outside = dilate(erode(outside, 3), 5)
    field = shapes_mask(face, [hints['field']]) if hints.get('field') else np.ones((H, W), bool)
    field &= ~outside
    for s in hints.get('mask', []):  # not décor at all (flanges, heads, a lug): neither plate nor ground
        field &= ~shape_mask(face, s)
    if field.sum() < 100:
        raise SystemExit('empty field')

    # ---- auto: the score, per-region parameters
    S, ln = score_map(L, ppmm, P, field)
    thr0 = P['threshold'] if P['threshold'] is not None else otsu(S[field])
    THR = np.full((H, W), thr0 + P['bias'], np.float32)
    auto_area = field.copy()
    forced_plate = np.zeros((H, W), bool)
    forced_ground = np.zeros((H, W), bool)
    for r in hints.get('regions', []):
        m = shape_mask(face, r) & field
        mode = r.get('mode', 'auto')
        if mode == 'off':
            auto_area &= ~m
        elif mode == 'plate':
            forced_plate |= m
        elif mode == 'ground':
            forced_ground |= m
        if any(k in r for k in DEFAULTS):
            Pr = dict(P)
            Pr.update({k: v for k, v in r.items() if k in DEFAULTS})
            if any(k in r for k in ('texture', 'brightness', 'window', 'edges', 'valley', 'valleyK')):
                Sr, _ = score_map(L, ppmm, Pr, field)
                S = np.where(m, Sr, S)
            tr = Pr['threshold'] if Pr['threshold'] is not None else (otsu(S[m]) if m.sum() > 400 else thr0)
            THR[m] = tr + Pr['bias']
    sym = hints.get('symmetry') or {}
    axis = float(sym.get('axis', face.wmm / 2))
    if P['mirrorScore'] or sym.get('keep') == 'average':
        Sm = mirror_arr(S, face, axis)
        okm = mirror_arr(field.astype(np.float32), face, axis) > 0.5
        S = np.where(okm, 0.5 * (S + Sm), S)
    auto = (S > THR) & auto_area

    # confidence: shadow, glare, ambiguous score
    Lb = blur(L, 1.0 * ppmm)
    med = float(np.median(Lb[field]))
    shadow = Lb < P['shadow'] * med
    glare = (Lb > min(0.97, P['glare'] * med)) | (blur((A.max(2) > 0.985).astype(np.float32), 0.5 * ppmm) > 0.3)
    amb = blur((np.abs(S - THR) < P['ambiguous']).astype(np.float32), 1.0 * ppmm) > 0.55
    unread = (shadow | glare | amb) & auto_area

    # ---- scale filter + cleanup of the auto mask
    rw = P['minWidth'] / 2 * ppmm
    auto = dilate(erode(auto, rw), rw)
    rc = P['close'] * ppmm
    auto = erode(dilate(auto, rc), rc)
    if P['grow']:
        auto = dilate(auto, P['grow'] * ppmm)
    auto &= auto_area
    # seeds: ground seeds remove the auto component they fall in; plate seeds (if any) keep only their components
    seeds = hints.get('seeds', {})
    if seeds.get('plate') or seeds.get('ground'):
        lab, _ = label(auto)
        drop = set()
        keep = set()
        for p in seeds.get('ground', []):
            x, y = face.px(p)
            v = lab[int(min(H - 1, max(0, y))), int(min(W - 1, max(0, x)))]
            if v:
                drop.add(int(v))
        for p in seeds.get('plate', []):
            x, y = face.px(p)
            v = lab[int(min(H - 1, max(0, y))), int(min(W - 1, max(0, x)))]
            if v:
                keep.add(int(v))
        if seeds.get('only') and keep:
            auto = np.isin(lab, list(keep))
        if drop:
            auto &= ~np.isin(lab, list(drop))

    # ---- hand hints
    src = np.zeros((H, W), np.uint8)  # 0 ground · 1 traced · 2 drawn · 3 mirrored
    plate = auto & ~forced_ground
    plate |= forced_plate
    src[plate] = 1
    inc = shapes_mask(face, hints.get('include', []))
    exc = shapes_mask(face, hints.get('exclude', []))
    plate |= inc
    src[inc] = 2
    plate &= ~exc
    g = blur(ln, 0.3 * ppmm)
    gx = np.zeros_like(g)
    gy = np.zeros_like(g)
    gx[:, 1:-1] = g[:, 2:] - g[:, :-2]
    gy[1:-1] = g[2:] - g[:-2]
    drawn_polys = []
    for d in hints.get('draw', []):
        dd = {'poly': d} if isinstance(d, list) else dict(d)
        if dd.get('snap') and 'poly' in dd:
            dd['poly'] = snap_poly(face, dd['poly'], gx, gy, float(dd['snap']))
            drawn_polys.append(dd['poly'])
        m = shape_mask(face, dd)
        if dd.get('cut'):
            plate &= ~m
            src[m] = 0
        else:
            plate |= m
            src[m & ~auto] = 2
    plate &= ~shapes_mask(face, hints.get('erase', []))
    plate &= field | inc | (src == 2)

    # ---- symmetry
    keep = sym.get('keep', 'none')
    if keep in ('left', 'right'):
        yr = sym.get('y')
        rows = np.ones(H, bool)
        if yr:
            ys = face.hmm - (np.arange(H) + 0.5) / ppmm
            rows = (ys >= yr[0]) & (ys <= yr[1])
        xs = (np.arange(W) + 0.5) / ppmm
        tgt = (xs > axis) if keep == 'left' else (xs < axis)
        pm = mirror_arr(plate, face, axis)
        sm = mirror_arr(src, face, axis)
        R = rows[:, None] & tgt[None, :]
        plate = np.where(R, pm, plate)
        src = np.where(R & pm, 3, np.where(R, 0, src)).astype(np.uint8)
        unread = unread & ~R
    elif keep == 'average':
        pm = mirror_arr(plate, face, axis)
        both = blur(plate.astype(np.float32) + pm.astype(np.float32), 0.15 * ppmm) / 2
        plate = both >= 0.5

    # ---- final cleanup: bosses are cut out of the plates (the primitive raises them separately)
    bosses = []
    for b in hints.get('bosses', []):
        c, r = list(b['c']), float(b['r'])
        if b.get('snap'):
            c, r = snap_boss(face, c, r, gx, gy)
        bosses.append({'c': [round(c[0], 1), round(c[1], 1)], 'r': round(r, 1), **({'ring': b['ring']} if 'ring' in b else {}), **({'hole': b['hole']} if 'hole' in b else {})})
        if b.get('mirror') or (keep in ('left', 'right') and (c[0] > axis) == (keep == 'right') and not b.get('noMirror')):
            bosses.append({'c': [round(2 * axis - c[0], 1), round(c[1], 1)], 'r': round(r, 1), **({'ring': b['ring']} if 'ring' in b else {}), **({'hole': b['hole']} if 'hole' in b else {})})
    for b in bosses:
        if b.get('cut', True):
            plate &= ~shape_mask(face, {'circle': [b['c'][0], b['c'][1], b['r'] + float(hints.get('bossGap', 0.6))]})
    plate = drop_small(plate, P['minArea'] * ppmm * ppmm)
    plate = ~drop_small(~plate, P['minHole'] * ppmm * ppmm)
    soft = blur(plate.astype(np.float32), P['smooth'] * ppmm)
    plate = soft >= 0.5
    src = np.where(plate, np.maximum(src, 1), 0).astype(np.uint8)

    # ---- polygons
    loops = contours(plate)
    outers, holes = [], []
    tol = P['simplify'] * ppmm
    for lp in loops:
        a = signed_area(lp)
        if abs(a) < P['minHole'] * ppmm * ppmm * 0.5:
            continue
        Q = dp_simplify(chaikin(lp, 2), tol)
        if len(Q) < 3:
            continue
        mmq = np.array([face.mm(x, y) for x, y in Q])
        (outers if a > 0 else holes).append(mmq)
    plates = []
    for o in outers:
        plates.append({'outer': o, 'holes': []})
    for h in holes:
        q = h.mean(0)
        best = None
        for pl in plates:
            if point_in(pl['outer'], h[0]) and (best is None or abs(signed_area(pl['outer'])) < abs(signed_area(best['outer']))):
                best = pl
        if best is not None:
            best['holes'].append(h)
    # orientation: outer CCW in mm (y up), holes CW
    def ccw(P_, want):
        return P_ if (signed_area(P_) > 0) == want else P_[::-1]
    enc = lambda P_: [[round(float(x), 1), round(float(y), 1)] for x, y in P_]
    out_plates = [{'outer': enc(ccw(p['outer'], True)), 'holes': [enc(ccw(h, False)) for h in p['holes']]} for p in plates]

    # ---- stats
    fa = float(field.sum())
    plate_f = plate & field
    stats = {
        'fieldArea_mm2': round(fa / ppmm ** 2, 1),
        'coverage': round(float(plate_f.sum()) / fa, 3),  # raised fraction of the field
        'read': round(1 - float(unread.sum()) / float(auto_area.sum()), 3) if auto_area.sum() else None,  # of the auto area, how much was read
        'traced': round(float(((src == 1) & plate_f).sum()) / max(1, plate_f.sum()), 3),
        'drawn': round(float(((src == 2) & plate_f).sum()) / max(1, plate_f.sum()), 3),
        'mirrored': round(float(((src == 3) & plate_f).sum()) / max(1, plate_f.sum()), 3),
        'threshold': round(thr0, 3),
    }
    lab, sz = label(unread & field)
    boxes = []
    for i in np.nonzero(sz >= 25 * ppmm * ppmm)[0]:
        if i == 0:
            continue
        ys, xs = np.nonzero(lab == i)
        a = face.mm(xs.min(), ys.max() + 1)
        b = face.mm(xs.max() + 1, ys.min())
        boxes.append([round(a[0], 1), round(a[1], 1), round(b[0], 1), round(b[1], 1)])
    stats['unread'] = boxes[:40]
    result = {
        'face': face_name, 'vessel': vid, 'units': 'mm',
        'frame': 'face mm: origin bottom-left of the face rectangle, x right seen from outside, y up (ReliefPanel convention); centre = (width/2, height/2)',
        'width': face.wmm, 'height': face.hmm, 'axis': axis,
        'field': hints.get('field'), 'mask': hints.get('mask'),
        'plates': out_plates, 'bosses': bosses, 'stats': stats,
        'generator': 'tools/trace.py (do not edit: change ' + face_name + '.trace.json and re-run)',
    }
    out_json = os.path.join(out_dir, face_name + '.plates.json')
    with open(out_json, 'w') as f:
        f.write(compact_json(result))
    ms = (time.time() - t0) * 1000
    if preview:
        write_preview(os.path.join(out_dir, face_name + '.trace.jpg'), im, face, plate, src, unread & field, field, out_plates, bosses, drawn_polys, stats, f'{vid} · {face_name}')
    nv = sum(len(p['outer']) + sum(len(h) for h in p['holes']) for p in out_plates)
    line = (f'  {face_name:16s} coverage {stats["coverage"] * 100:4.1f} %  read {"auto off" if stats["read"] is None else format(stats["read"] * 100, "4.1f") + " %"}  '
            f'traced {stats["traced"] * 100:4.1f} / drawn {stats["drawn"] * 100:4.1f} / mirrored {stats["mirrored"] * 100:4.1f} %  '
            f'{len(out_plates)} plates, {nv} vertices, {len(bosses)} bosses, {os.path.getsize(out_json) / 1024:.1f} kB  '
            f'unread {len(boxes)} regions  ({ms / 1000:.1f} s)')
    if not quiet:
        print(line)
    return result


def snap_boss(face, c, r, gx, gy):
    """refine a boss's centre / radius onto the strongest radial edge (search ± 25 % r, ± 1.5 mm)."""
    best = (-1, c, r)
    th = np.linspace(0, 2 * np.pi, 72, endpoint=False)
    for dx in np.arange(-1.5, 1.51, 0.25):
        for dy in np.arange(-1.5, 1.51, 0.25):
            for rr in np.arange(r * 0.8, r * 1.25 + 1e-6, 0.2):
                X = (c[0] + dx + rr * np.cos(th)) * face.ppmm
                Y = (face.hmm - (c[1] + dy + rr * np.sin(th))) * face.ppmm
                xi = np.clip(X.astype(int), 0, face.W - 1)
                yi = np.clip(Y.astype(int), 0, face.H - 1)
                e = np.abs(gx[yi, xi] * np.cos(th) - gy[yi, xi] * np.sin(th)).mean()
                if e > best[0]:
                    best = (e, [c[0] + dx, c[1] + dy], rr)
    return best[1], best[2]


def compact_json(d):
    s = json.dumps(d, separators=(',', ':'))
    # one plate per line keeps diffs readable
    return s.replace('{"outer"', '\n{"outer"').replace(',"bosses"', '\n,"bosses"').replace(',"stats"', '\n,"stats"') + '\n'


# ------------------------------------------------------------------ preview
def font(size):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def write_preview(path, im, face, plate, src, unread, field, plates, bosses, drawn, stats, title):
    W, H = im.size
    sc = max(1.0, 1400 / W)  # small faces are enlarged so the grid is legible
    PW, PH = int(W * sc), int(H * sc)
    p = face.ppmm * sc
    photo = im.resize((PW, PH), Image.LANCZOS)

    def grid(img, col=(255, 230, 0)):
        d = ImageDraw.Draw(img, 'RGBA')
        f = font(max(11, int(PH / 40)))
        for x in range(0, int(face.wmm) + 1, 5):
            X = x * p
            d.line([(X, 0), (X, PH)], fill=col + ((110,) if x % 10 == 0 else (45,)), width=1)
            if x % 10 == 0:
                d.text((X + 2, 1), str(x), font=f, fill=col + (230,))
        for y in range(0, int(face.hmm) + 1, 5):
            Y = PH - y * p
            d.line([(0, Y), (PW, Y)], fill=col + ((110,) if y % 10 == 0 else (45,)), width=1)
            if y % 10 == 0 and y:
                d.text((2, Y - f.size - 1 if hasattr(f, 'size') else Y - 12), str(y), font=f, fill=col + (230,))
        return img

    a = grid(photo.copy())
    # mask by source
    cols = np.array([[34, 30, 26], [236, 230, 214], [90, 160, 255], [255, 160, 60]], np.uint8)
    m = cols[src]
    m[~field & ~plate] = [70, 20, 20]
    hatch = ((np.add.outer(np.arange(H), np.arange(W)) // max(2, int(face.ppmm))) % 3 == 0) & unread & ~plate
    m[hatch] = [200, 40, 40]
    b = grid(Image.fromarray(m).resize((PW, PH), Image.NEAREST), (120, 200, 255))
    # polygons over the photograph
    L = np.asarray(photo.convert('L'), np.float32)
    c = Image.fromarray(np.clip(L * 0.8 + 10, 0, 255).astype(np.uint8)).convert('RGB')
    d = ImageDraw.Draw(c, 'RGBA')
    P = lambda q: [(x * p, PH - y * p) for x, y in q]
    for pl in plates:
        d.polygon(P(pl['outer']), fill=(255, 40, 200, 45), outline=(255, 40, 200, 255))
        for h in pl['holes']:
            d.polygon(P(h), fill=(0, 220, 255, 40), outline=(0, 220, 255, 255))
    for q in drawn:
        d.line(P(list(q) + [q[0]]), fill=(90, 160, 255, 200), width=1)
    for bo in bosses:
        x, y = bo['c']
        r = bo['r']
        d.ellipse([x * p - r * p, PH - y * p - r * p, x * p + r * p, PH - y * p + r * p], outline=(255, 230, 0, 255), width=2)
    head = 44
    gap = 6
    sheet = Image.new('RGB', (PW + 2 * gap, 3 * (PH + gap) + gap + head), (15, 14, 12))
    for i, (img, t) in enumerate(((a, 'photograph, flattened · grid in face mm (origin bottom-left)'),
                                   (b, 'plate mask · white traced · blue drawn · orange mirrored · red hatch unread · maroon outside the field'),
                                   (c, 'plates (magenta) · holes (cyan) · bosses (yellow) · snapped drawn outlines (blue) over the photograph'))):
        y = head + gap + i * (PH + gap)
        sheet.paste(img, (gap, y))
        dd = ImageDraw.Draw(sheet, 'RGBA')
        f = font(max(13, PW // 90))
        bb = dd.textbbox((0, 0), t, font=f)
        yb = y + PH - bb[3] - 8  # caption at the panel's bottom-right: the grid labels run along the top and left
        dd.rectangle([gap + PW - bb[2] - 12, yb, gap + PW, y + PH], fill=(15, 14, 12, 210))
        dd.text((gap + PW - bb[2] - 6, yb + 3), t, font=f, fill=(233, 226, 212))
    dd = ImageDraw.Draw(sheet)
    s = stats
    dd.text((gap, 8), f'{title}   ·   raised coverage {s["coverage"] * 100:.1f} % of the field   ·   read {"– (auto off)" if s["read"] is None else format(s["read"] * 100, ".0f") + " %"}   ·   '
                      f'traced {s["traced"] * 100:.0f} % · drawn {s["drawn"] * 100:.0f} % · mirrored {s["mirrored"] * 100:.0f} % of the plate area   ·   '
                      f'{len(plates)} plates, {len(bosses)} bosses, {len(s["unread"])} unread regions',
            font=font(max(14, PW // 80)), fill=(233, 226, 212))
    sheet.save(path, quality=85)


if __name__ == '__main__':
    argv = sys.argv[1:]
    if not argv or argv[0] in ('-h', '--help'):
        raise SystemExit(__doc__)
    opts = {'preview': '--no-preview' not in argv, 'quiet': '--quiet' in argv}
    out = None
    if '--out' in argv:
        out = argv[argv.index('--out') + 1]
    rest = [a for i, a in enumerate(argv) if not a.startswith('--') and (i == 0 or argv[i - 1] != '--out')]
    vid, names = rest[0], rest[1:]
    if '--all' in argv:
        names = list(load_json(os.path.join(PKG, 'reference', vid, 'faces.json'))['faces'])
    print(f'{vid}: trace → reference/{vid}/faces/<face>.plates.json, .trace.jpg' if not out else f'{vid}: trace → {out}')
    for n in names:
        trace_face(vid, n, out_dir=out, preview=opts['preview'], quiet=opts['quiet'])
