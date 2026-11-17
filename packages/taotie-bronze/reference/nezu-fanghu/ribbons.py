#!/usr/bin/env python3
"""nezu-fanghu — the birds as EMBOSSED RIBBONS in a SUNK cartouche, traced off the developed photographs.

    python3 reference/nezu-fanghu/ribbons.py [zone …]      (default: every faces/dev-*.bird.json)

The bronze (photo-08, photo-09): each bird sits in a cartouche SUNK below the wall, its edge stepped down through
parallel ribs; inside, the bird is raised back up as broad flat-topped RIBBONS (3–6 mm) with soft shoulders, wide
sunk channels between them packed with fine spirals, a ring eye with a domed centre in its own small recess.
So the drawing is POSITIVE: one swept centre line per continuous ribbon (tools/trace.py's `band` hint — per-point
width, corner `bend`, `start` / `end` 'point' | { coil } and round caps), the floor is whatever is left.

faces/dev-<zone>.bird.json (developed mm: s from the side's centre line, right seen from outside; y vessel height):
  { "image": "dev-low.jpg", "frame": [s0, y0, s1, y1], "ppmm": 7,
    "field": { "rrect": [x0, y0, x1, y1], "r": [TL, TR, BR, BL] } | { "poly": [[s, y]…] },   the cartouche at the wall
    "rim": mm (width of the stepped rim; ribbons are clipped to the field shrunk by it, default 2.6),
    "ribbons": [ { "name", "band": [[s, y]…], "width": mm | [mm per point], "bend", "start", "end", "cap",
                   "snap": mm (optional: pull the swept outline onto the photograph's edge) } | { "poly", "round" } ],
    "cuts": [ shapes cut out of the ribbons (sunk notches) ],
    "eyes": [ { "c": [s, y], "r": mm (ring outer radius), "recess": mm (recess radius) } ] }
Writes  faces/dev-<zone>.ribbons.json   { frame, field, rim, plates: [{ outer, holes }], eyes, coverage }
        .work/fanghu-bird/trace/dev-<zone>.ribbons.png   photo + grid + centre lines | mask | outlines over the photo
coverage = raised fraction of the cartouche (ribbons + eye ring) inside the field.
Every image written under reference/ carries no metadata (this script writes none there).
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.abspath(os.path.join(HERE, '..', '..'))
sys.path.insert(0, os.path.join(PKG, 'tools'))
from trace import Face, shape_mask, snap_poly, contours, chaikin, dp_simplify, signed_area, point_in, blur, erode, dilate  # noqa: E402

OUT = os.path.join(PKG, '.work', 'fanghu-bird', 'trace')


def rrect_poly(b, r, step=10):
    x0, y0, x1, y1 = b
    R = r if isinstance(r, list) else [r] * 4
    lim = lambda v: max(0, min(v, (x1 - x0) / 2, (y1 - y0) / 2))
    rTL, rTR, rBR, rBL = map(lim, R)
    pts = []
    def arc(cx, cy, rr, a0, a1):
        for i in range(step + 1):
            a = a0 + (a1 - a0) * i / step
            pts.append((cx + rr * np.cos(a), cy + rr * np.sin(a)))
    h = np.pi / 2
    arc(x1 - rBR, y0 + rBR, rBR, -h, 0)
    arc(x1 - rTR, y1 - rTR, rTR, 0, h)
    arc(x0 + rTL, y1 - rTL, rTL, h, 2 * h)
    arc(x0 + rBL, y0 + rBL, rBL, 2 * h, 3 * h)
    return pts


def field_poly(f):
    if 'rrect' in f:
        return rrect_poly(f['rrect'], f.get('r', 0))
    return [tuple(p) for p in f['poly']]


def shift(shape, dx, dy):
    """a hint shape in developed mm → face mm of the frame (origin at the frame's bottom-left)."""
    s = dict(shape)
    for k in ('band', 'poly'):
        if k in s:
            s[k] = [[p[0] - dx, p[1] - dy] for p in s[k]]
    if 'circle' in s:
        x, y, r = s['circle']
        s['circle'] = [x - dx, y - dy, r]
    if 'box' in s:
        x0, y0, x1, y1 = s['box']
        s['box'] = [x0 - dx, y0 - dy, x1 - dx, y1 - dy]
    for e in ('start', 'end'):  # a coil spec carries no coordinates
        pass
    return s


def font(n):
    try:
        return ImageFont.load_default(size=n)
    except TypeError:
        return ImageFont.load_default()


def run(zone, k=2):
    H = json.load(open(os.path.join(HERE, 'faces', f'dev-{zone}.bird.json')))
    fr, pp = H['frame'], H['ppmm']
    im = Image.open(os.path.join(HERE, 'faces', H.get('image', f'dev-{zone}.jpg'))).convert('RGB')
    W, Hh = im.size
    face = Face(fr[2] - fr[0], fr[3] - fr[1], W, Hh)
    dx, dy = fr[0], fr[1]
    A = np.asarray(im, np.float32) / 255
    L = 0.3 * A[..., 0] + 0.55 * A[..., 1] + 0.15 * A[..., 2]
    ll = np.log(L + 0.03)
    ln = ll - blur(ll, 6 * pp)
    g = blur(ln, 0.3 * pp)
    gx = np.zeros_like(g); gy = np.zeros_like(g)
    gx[:, 1:-1] = g[:, 2:] - g[:, :-2]
    gy[1:-1] = g[2:] - g[:-2]

    F = field_poly(H['field'])
    field = shape_mask(face, {'poly': [[p[0] - dx, p[1] - dy] for p in F]})
    rim = float(H.get('rim', 2.6))
    inner = erode(field, rim * pp)
    rib = np.zeros_like(field)
    for r in H.get('ribbons', []):
        s = shift(r, dx, dy)
        m = shape_mask(face, s)
        if r.get('snap') and m.any():
            loops = [lp for lp in contours(m) if signed_area(lp) > 0]
            if loops:
                lp = max(loops, key=lambda q: abs(signed_area(q)))
                mm = [face.mm(x, y) for x, y in dp_simplify(chaikin(lp, 2), 0.3 * pp)]
                sn = snap_poly(face, mm, gx, gy, float(r['snap']))
                m = shape_mask(face, {'poly': sn})
        rib |= m
    for c in H.get('cuts', []):
        rib &= ~shape_mask(face, shift(c, dx, dy))
    if H.get('grow'):  # widen every ribbon (mm): the channels between them narrow by twice this
        rib = dilate(rib, float(H['grow']) * pp)
    rib &= inner
    eyes = []
    raised_eye = np.zeros_like(field)
    for e in H.get('eyes', []):
        c, r = e['c'], float(e['r'])
        rec = float(e.get('recess', r + 1.2))
        rib &= ~shape_mask(face, {'circle': [c[0] - dx, c[1] - dy, rec]})
        raised_eye |= shape_mask(face, {'circle': [c[0] - dx, c[1] - dy, r]})
        eyes.append({'c': c, 'r': r, 'recess': rec})
    # polygons (developed mm)
    soft = blur(rib.astype(np.float32), 0.12 * pp) >= 0.5
    loops = contours(soft)
    outers, holes = [], []
    for lp in loops:
        a = signed_area(lp)
        if abs(a) < 2.0 * pp * pp:
            continue
        Q = dp_simplify(chaikin(lp, 2), 0.22 * pp)
        if len(Q) < 3:
            continue
        mmq = np.array([face.mm(x, y) for x, y in Q]) + np.array([dx, dy])
        (outers if a > 0 else holes).append(mmq)
    plates = [{'outer': o, 'holes': []} for o in outers]
    for h in holes:
        best = None
        for pl in plates:
            if point_in(pl['outer'], h[0]) and (best is None or abs(signed_area(pl['outer'])) < abs(signed_area(best['outer']))):
                best = pl
        if best is not None:
            best['holes'].append(h)
    ccw = lambda P_, want: P_ if (signed_area(P_) > 0) == want else P_[::-1]
    enc = lambda P_: [[round(float(x), 1), round(float(y), 1)] for x, y in P_]
    out_plates = [{'outer': enc(ccw(p['outer'], True)), 'holes': [enc(ccw(h, False)) for h in p['holes']]} for p in plates]
    cov = float(((soft | raised_eye) & field).sum()) / float(field.sum())
    cov_in = float(((soft | raised_eye) & inner).sum()) / float(inner.sum())
    res = {'zone': zone, 'units': 'mm', 'frame': 'developed (s, y): s from the side centre line, y vessel height',
           'field': H['field'], 'rim': rim, 'plates': out_plates, 'eyes': eyes,
           'coverage': round(cov, 3), 'coverageInner': round(cov_in, 3),
           'generator': f'reference/nezu-fanghu/ribbons.py from faces/dev-{zone}.bird.json (do not edit)'}
    p = os.path.join(HERE, 'faces', f'dev-{zone}.ribbons.json')
    s = json.dumps(res, separators=(',', ':')).replace('{"outer"', '\n{"outer"').replace(',"eyes"', '\n,"eyes"')
    with open(p, 'w') as f:
        f.write(s + '\n')
    # ---- preview
    os.makedirs(OUT, exist_ok=True)
    PW, PH = W * k, Hh * k
    P = lambda q: ((q[0] - fr[0]) * pp * k, (fr[3] - q[1]) * pp * k)
    photo = im.resize((PW, PH), Image.LANCZOS)

    def grid(img):
        d = ImageDraw.Draw(img, 'RGBA')
        f = font(13)
        for gx_ in range(int(fr[0]) // 5 * 5, int(fr[2]) + 1, 5):
            X = P((gx_, 0))[0]
            d.line([(X, 0), (X, PH)], fill=(0, 200, 255, 120 if gx_ % 10 == 0 else 45))
            if gx_ % 10 == 0:
                d.text((X + 2, 2), str(gx_), font=f, fill=(255, 255, 0, 255))
        for gy_ in range(int(fr[1]) // 5 * 5, int(fr[3]) + 1, 5):
            Y = P((0, gy_))[1]
            d.line([(0, Y), (PW, Y)], fill=(255, 80, 80, 120 if gy_ % 10 == 0 else 45))
            if gy_ % 10 == 0:
                d.text((2, Y - 14), str(gy_), font=f, fill=(255, 255, 0, 255))
        return img
    flat = np.clip(128 + blur(ln, 0.25 * pp) / (np.std(ln) + 1e-6) * 45, 0, 255).astype(np.uint8)
    a = grid(Image.fromarray(flat).convert('RGB').resize((PW, PH), Image.LANCZOS))
    d = ImageDraw.Draw(a, 'RGBA')
    tp = os.path.join(HERE, 'faces', f'dev-{zone}.trace.json')
    if os.path.exists(tp):  # the earlier builder's channel centre lines: where the dark lines of the photograph run
        for ch in json.load(open(tp)).get('channels', []):
            d.line([P(q) for q in ch['line']], fill=(0, 255, 255, 110), width=1)
    for r in H.get('ribbons', []):
        if 'band' in r:
            pts = [P(q) for q in r['band']]
            d.line(pts, fill=(255, 0, 255, 230), width=2)
            for q in pts:
                d.ellipse([q[0] - 2.5, q[1] - 2.5, q[0] + 2.5, q[1] + 2.5], fill=(255, 255, 255, 230))
            if r.get('name'):
                d.text((pts[0][0] + 3, pts[0][1] + 3), r['name'], font=font(12), fill=(255, 255, 255, 255))
    m = np.full((Hh, W, 3), 70, np.uint8)
    m[field] = [52, 34, 28]
    m[field & ~inner] = [110, 90, 80]
    m[soft] = [236, 228, 210]
    m[raised_eye] = [255, 220, 120]
    b = grid(Image.fromarray(m).resize((PW, PH), Image.NEAREST))
    Lm = np.asarray(photo.convert('L'), np.float32)
    c = Image.fromarray(np.clip(Lm * 0.85 + 10, 0, 255).astype(np.uint8)).convert('RGB')
    dc = ImageDraw.Draw(c, 'RGBA')
    for pl in out_plates:
        dc.polygon([P(q) for q in pl['outer']], fill=(255, 40, 200, 40), outline=(255, 40, 200, 255))
        for h in pl['holes']:
            dc.polygon([P(q) for q in h], outline=(0, 220, 255, 255))
    dc.line([P(q) for q in F] + [P(F[0])], fill=(255, 230, 0, 255), width=2)
    for e in eyes:
        for rr, col in ((e['r'], (255, 230, 0, 255)), (e['recess'], (0, 255, 0, 255))):
            x, y = P(e['c'])
            dc.ellipse([x - rr * pp * k, y - rr * pp * k, x + rr * pp * k, y + rr * pp * k], outline=col, width=2)
    head = 30
    sheet = Image.new('RGB', (3 * PW + 16, PH + head + 4), (15, 14, 12))
    for i, img in enumerate((a, b, c)):
        sheet.paste(img, (4 + i * (PW + 4), head))
    ImageDraw.Draw(sheet).text((6, 6), f'nezu-fanghu dev-{zone} · ribbons {len(out_plates)} plates · raised {cov * 100:.1f} % of the cartouche ({cov_in * 100:.1f} % inside the rim) · '
                               f'{os.path.getsize(p) / 1024:.1f} kB', font=font(16), fill=(233, 226, 212))
    sheet.save(os.path.join(OUT, f'dev-{zone}.ribbons.png'))
    for i, img in enumerate((a, b, c)):
        img.save(os.path.join(OUT, f'dev-{zone}.ribbons-{"abc"[i]}.png'))
    print(f'{zone}: {len(H.get("ribbons", []))} ribbons → {len(out_plates)} plates, raised {cov * 100:.1f} % of the cartouche '
          f'({cov_in * 100:.1f} % inside the rim), {os.path.getsize(p) / 1024:.1f} kB')


if __name__ == '__main__':
    zones = sys.argv[1:] or sorted(f[4:-10] for f in os.listdir(os.path.join(HERE, 'faces')) if f.startswith('dev-') and f.endswith('.bird.json'))
    for z in zones:
        run(z)
