#!/usr/bin/env python3
"""nezu-fanghu — the décor's GROOVE NETWORK read straight off the developed photographs.

    python3 reference/nezu-fanghu/grooves.py [zone …]     (default: every zone in ZONES)

faces/dev-<zone>.jpg is photo-08 resampled onto the model's own surface (developed coordinates s, y in mm: s from the
side's centre line, y = vessel height). On this bronze the drawing is CUT into one broad flat level: every line of the
design is a groove — dark where it is in shadow, pale where it is packed with earth — and the deeper hollows of the
ground are packed with round spirals and earth (pink). So instead of hand-stroking centre lines this script:
  1. flattens the illumination (log luminance minus its 4 mm blur),
  2. measures line-ness at the groove scale with the Hessian (σ 0.3 / 0.5 mm): dark valleys (shadowed grooves) AND
     pale ridges (earth-filled grooves) — a patina blotch is a blob, not a line, and scores low,
  3. thresholds, keeps only connected pieces longer than `minLen` mm inside the zone's field (blotch worms go),
  4. reads the HOLLOWS (sunk spiral ground) as the earth-red regions (R − G, blurred 0.8 mm) inside the field,
  5. writes closed outlines (with holes, even-odd) in developed mm: faces/dev-<zone>.grooves.json, and a preview
     .work/r8-fanghu-fix/grooves/dev-<zone>.jpg (photo | grooves magenta, hollows cyan).
src/artifacts/nezu-fanghu/decor.js sinks the grooves and hollows into the panel through the same map as before.
Every output carries no metadata.
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(PKG, 'tools'))
from trace import blur, dilate, erode, label, contours, dp_simplify, chaikin, signed_area  # noqa: E402

OUT = os.path.join(PKG, '.work', 'r8-fanghu-fix', 'grooves')

# per zone: field polygon (developed mm), threshold, min piece length (mm), hollow threshold, erase boxes [s0,y0,s1,y1]
ZONES = {
    'up': dict(field=[[20.6, 198.6], [20.4, 280.6], [24, 281.6], [76, 281.6], [79.5, 279], [86, 252], [90.5, 216], [90.5, 199.5], [86, 198.4]], thr=0.33, minLen=2.6, hol=0.5),
    'frieze': dict(field=[[0.6, 310.2], [72, 310.2], [72, 356.2], [0.6, 356.2]], thr=0.3, minLen=2.4, hol=0.55),
    'low': dict(field=[[20.6, 73], [20.8, 152], [26, 160.5], [40, 161.2], [104, 161.2], [112.5, 158], [114, 140], [113.5, 95], [111, 79], [104, 73]], thr=0.33, minLen=2.6, hol=0.5),
}


def lineness(ln, pp, sigmas):
    V = np.zeros_like(ln)
    R = np.zeros_like(ln)
    ang = np.zeros_like(ln)
    best = np.zeros_like(ln)
    for sg in sigmas:
        g = blur(ln, sg * pp)
        gxx = np.zeros_like(g); gyy = np.zeros_like(g); gx = np.zeros_like(g); gxy = np.zeros_like(g)
        gxx[:, 1:-1] = g[:, 2:] - 2 * g[:, 1:-1] + g[:, :-2]
        gyy[1:-1] = g[2:] - 2 * g[1:-1] + g[:-2]
        gx[:, 1:-1] = (g[:, 2:] - g[:, :-2]) / 2
        gxy[1:-1] = (gx[2:] - gx[:-2]) / 2
        t = np.sqrt(((gxx - gyy) / 2) ** 2 + gxy ** 2)
        m = (gxx + gyy) / 2
        l1, l2 = m + t, m - t
        n = (sg * pp) ** 2
        # line, not blob: the cross-line curvature must dominate the along-line one
        v = np.maximum(0, l1 - np.abs(l2) * 0.7) * n
        r = np.maximum(0, -l2 - np.abs(l1) * 0.7) * n
        V = np.maximum(V, v)
        R = np.maximum(R, r)
        # direction ACROSS the line: the eigenvector of the dominant-magnitude eigenvalue
        lam = np.where(np.abs(l1) > np.abs(l2), l1, l2)
        a = np.arctan2(lam - gxx, gxy + 1e-12)  # eigenvector (gxy, lam - gxx)
        a = np.where(np.abs(gxy) < 1e-9, np.where(np.abs(gxx) > np.abs(gyy), 0.0, np.pi / 2), np.arctan2(lam - gxx, gxy))
        m_ = np.maximum(v, r)
        upd = m_ > best
        ang = np.where(upd, a, ang)
        best = np.maximum(best, m_)
    return V, R, ang


def nms(G, ang):
    """keep a pixel only where G is a maximum across the line (the line's centre)"""
    H, W = G.shape
    q = (np.round(((ang % np.pi) / (np.pi / 4))).astype(int)) % 4  # 0: x, 1: diag, 2: y, 3: anti-diag
    Gp = np.pad(G, 1, mode='edge')
    c = Gp[1:-1, 1:-1]
    nb = {0: (Gp[1:-1, 2:], Gp[1:-1, :-2]), 1: (Gp[2:, 2:], Gp[:-2, :-2]), 2: (Gp[2:, 1:-1], Gp[:-2, 1:-1]), 3: (Gp[2:, :-2], Gp[:-2, 2:])}
    keep = np.zeros_like(G, bool)
    for k, (a, b) in nb.items():
        keep |= (q == k) & (c >= a) & (c >= b)
    return keep


def poly_mask(W, H, P, pts):
    im = Image.new('L', (W, H), 0)
    ImageDraw.Draw(im).polygon([P(q) for q in pts], fill=255)
    return np.asarray(im) > 127


def loops_mm(M, fr, pp, tol=0.12, minArea=0.4):
    out = []
    for L in contours(M):
        Lm = np.stack([fr[0] + L[:, 0] / pp, fr[3] - L[:, 1] / pp], 1)
        Lm = chaikin(Lm, 1)
        Lm = dp_simplify(Lm, tol)
        if abs(signed_area(Lm)) < minArea or len(Lm) < 3:
            continue
        out.append([[round(float(a), 2), round(float(b), 2)] for a, b in Lm])
    return out


def run(zone):
    Z = ZONES[zone]
    T = json.load(open(os.path.join(HERE, 'faces', f'dev-{zone}.trace.json')))
    fr, pp = T['frame'], T['ppmm']
    A = np.asarray(Image.open(os.path.join(HERE, 'faces', f'dev-{zone}.jpg')).convert('RGB'), np.float32) / 255
    H, W = A.shape[:2]
    P = lambda q: ((q[0] - fr[0]) * pp, (fr[3] - q[1]) * pp)
    field = poly_mask(W, H, P, Z['field'])
    inner = erode(field, 0.9 * pp)
    L = 0.3 * A[..., 0] + 0.55 * A[..., 1] + 0.15 * A[..., 2]
    ll = np.log(L + 0.03)
    ln = ll - blur(ll, 4 * pp)
    V, R, ang = lineness(ln, pp, Z.get('sigmas', (0.3, 0.5)))
    s = lambda a: a / (np.percentile(a[inner], 98) + 1e-9)
    G = np.maximum(s(V), Z.get('pale', 0.9) * s(R))
    M = (G > Z['thr']) & inner & nms(blur(G, 0.6), ang)
    M = dilate(M, 0.6)
    for b in Z.get('erase', []):
        M &= ~poly_mask(W, H, P, [[b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]]])
    # keep pieces longer than minLen (bbox diagonal)
    lab, sz = label(M)
    keep = np.zeros(len(sz), bool)
    ys, xs = np.nonzero(lab)
    if len(ys):
        l = lab[ys, xs]
        x0 = np.full(len(sz), 1e9); x1 = np.full(len(sz), -1e9); y0 = np.full(len(sz), 1e9); y1 = np.full(len(sz), -1e9)
        np.minimum.at(x0, l, xs); np.maximum.at(x1, l, xs); np.minimum.at(y0, l, ys); np.maximum.at(y1, l, ys)
        diag = np.hypot(x1 - x0, y1 - y0) / pp
        keep = diag >= Z['minLen']
    keep[0] = False
    M = keep[lab]
    M = erode(dilate(M, Z.get('close', 0.45) * pp), Z.get('close', 0.45) * pp)  # bridge gaps; merge the shadow and earth edges of one groove
    M = dilate(M, Z.get('w', 0.35) * pp) & inner  # the groove's own width about its centre line
    # hollows: earth-red regions
    red = blur(A[..., 0] - 0.5 * (A[..., 1] + A[..., 2]), 0.8 * pp)
    rr = (red - np.percentile(red[inner], 10)) / (np.percentile(red[inner], 97) - np.percentile(red[inner], 10) + 1e-9)
    Hm = (rr > Z['hol']) & inner
    Hm = dilate(erode(Hm, 1.0 * pp), 1.0 * pp)
    Hm = drop(Hm, 6 * pp * pp)
    res = {'frame': fr, 'ppmm': pp, 'field': Z['field'], 'grooves': loops_mm(M, fr, pp), 'hollows': loops_mm(Hm, fr, pp, 0.25, 4)}
    with open(os.path.join(HERE, 'faces', f'dev-{zone}.grooves.json'), 'w') as f:
        json.dump(res, f, separators=(',', ':'))
    # preview
    os.makedirs(OUT, exist_ok=True)
    im = Image.fromarray((A * 255).astype(np.uint8))
    ov = np.asarray(im).copy()
    ov[M] = (0.35 * ov[M] + 0.65 * np.array([255, 0, 255])).astype(np.uint8)
    edge = Hm & ~erode(Hm, 1.5)
    ov[edge] = (0, 255, 255)
    fe = field & ~erode(field, 1.5)
    ov[fe] = (255, 255, 0)
    k = 2
    pv = Image.new('RGB', (W * 2, H))
    pv.paste(im, (0, 0)); pv.paste(Image.fromarray(ov), (W, 0))
    pv = pv.resize((W * 2 * k // 2 * 1, H * k // 2 * 1))
    pv.save(os.path.join(OUT, f'dev-{zone}.jpg'), quality=88)
    print(f"{zone}: {len(res['grooves'])} groove loops ({sum(len(p) for p in res['grooves'])} pts), {len(res['hollows'])} hollows, groove cover {M[field].mean()*100:.0f} %, hollow {Hm[field].mean()*100:.0f} %")


def drop(m, min_px):
    lab, sz = label(m)
    keep = sz >= min_px
    keep[0] = False
    return keep[lab]


if __name__ == '__main__':
    for z in (sys.argv[1:] or list(ZONES)):
        run(z)
