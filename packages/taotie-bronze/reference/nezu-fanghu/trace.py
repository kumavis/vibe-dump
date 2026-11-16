#!/usr/bin/env python3
"""nezu-fanghu — drawn plate outlines for the décor, in DEVELOPED body coordinates (s, y):
s = developed mm along the section from the side's centre line (left → right seen from outside), y = vessel height
(mm). The developed photographs faces/dev-<zone>.jpg are photo-08 resampled onto the model's own surface through the
assumed camera (.work/r8-fanghu/solve: develop.py), so a point read off them lands on the same spot of the model.

    python3 reference/nezu-fanghu/trace.py [zone …]       (default: every faces/dev-*.hints.json)

Reads   faces/dev-<zone>.hints.json  { "frame": [s0, y0, s1, y1], "ppmm": dev image px/mm, "shapes": [...], "bosses": [...] }
        shapes: { "band": [[s, y]…], "w": mm | [mm per point], "cap": "round" | "flat" }   a fat band along a centre line
                { "poly": [[s, y]…], "round": mm }       a drawn outline (convex AND concave corners rounded by `round`)
                { "rrect": [s0, y0, s1, y1], "r": mm }   { "circle": [s, y, r] }
                any shape + "cut": true                   subtracted (a hole, a channel between two masses)
                any shape + "ring": w                     only its outline, w mm wide (a frame)
Writes  faces/dev-<zone>.plates.json  (kit.tracedPlates input: { plates: [{ outer, holes }], bosses: [{ c, r }] })
        .work/r8-fanghu/trace/dev-<zone>.png  preview: the developed photo with the outlines in magenta
Uses the contour / simplify helpers of tools/trace.py (read only).
"""
import json, os, sys
import numpy as np
from PIL import Image, ImageDraw
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(os.path.dirname(HERE))
sys.path.insert(0, os.path.join(PKG, 'tools'))
import trace as T  # noqa: E402

PX = 10  # raster px/mm


def raster(frame, shapes):
    s0, y0, s1, y1 = frame
    Wp, Hp = int(round((s1 - s0) * PX)), int(round((y1 - y0) * PX))
    P = lambda p: ((p[0] - s0) * PX, (y1 - p[1]) * PX)
    M = np.zeros((Hp, Wp), bool)
    for sh in shapes:
        img = Image.new('L', (Wp, Hp), 0)
        d = ImageDraw.Draw(img)
        rnd = 0
        if 'band' in sh:
            pts = [P(p) for p in sh['band']]
            w = sh['w']
            ws = w if isinstance(w, list) else [w] * len(pts)
            for i in range(len(pts) - 1):
                # a quad per segment with linearly varying width + discs at the joints
                (ax, ay), (bx, by) = pts[i], pts[i + 1]
                L = np.hypot(bx - ax, by - ay) + 1e-9
                nx, ny = -(by - ay) / L, (bx - ax) / L
                wa, wb = ws[i] * PX / 2, ws[i + 1] * PX / 2
                d.polygon([(ax + nx * wa, ay + ny * wa), (bx + nx * wb, by + ny * wb), (bx - nx * wb, by - ny * wb), (ax - nx * wa, ay - ny * wa)], fill=255)
                for (cx, cy), r in (((ax, ay), wa), ((bx, by), wb)):
                    end = (i == 0 and (cx, cy) == (ax, ay)) or (i == len(pts) - 2 and (cx, cy) == (bx, by))
                    if not end or sh.get('cap', 'round') == 'round':
                        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
        elif 'poly' in sh:
            d.polygon([P(p) for p in sh['poly']], fill=255)
            rnd = sh.get('round', 0)
        elif 'rrect' in sh:
            a, b, c, e = sh['rrect']
            (x0, yb), (x1, yt) = P((a, b)), P((c, e))
            d.rounded_rectangle([x0, yt, x1, yb], radius=sh.get('r', 0) * PX, fill=255)
        elif 'circle' in sh:
            cx, cy = P(sh['circle'][:2]); r = sh['circle'][2] * PX
            d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=255)
        m = np.asarray(img) > 127
        if rnd:
            r = rnd * PX
            m = T.dilate(T.erode(m, r), r)   # round the convex corners
            m = T.erode(T.dilate(m, r), r)   # and the concave ones
        if 'ring' in sh:
            m = m & ~T.erode(m, sh['ring'] * PX)
        if sh.get('cut'):
            M &= ~m
        else:
            M |= m
    return M


def polys(M, frame):
    s0, y0, s1, y1 = frame
    loops = T.contours(M)
    outers, holes = [], []
    for L in loops:
        Q = T.dp_simplify(T.chaikin(L, 2), 0.25 * PX)
        if len(Q) < 3:
            continue
        mm = np.c_[s0 + Q[:, 0] / PX, y1 - Q[:, 1] / PX]
        (outers if T.signed_area(mm) > 0 else holes).append(mm)
    plates = [{'outer': o, 'holes': []} for o in outers]
    for h in holes:
        best = None
        for p in plates:
            if T.point_in(p['outer'], h[0]) and (best is None or abs(T.signed_area(p['outer'])) < abs(T.signed_area(best['outer']))):
                best = p
        if best is not None:
            best['holes'].append(h)
    enc = lambda P_: [[round(float(x), 2), round(float(y), 2)] for x, y in P_]
    ccw = lambda P_, want: P_ if (T.signed_area(P_) > 0) == want else P_[::-1]
    return [{'outer': enc(ccw(p['outer'], True)), 'holes': [enc(ccw(h, False)) for h in p['holes']]} for p in plates]


def run(zone):
    hp = os.path.join(HERE, 'faces', f'dev-{zone}.hints.json')
    H = json.load(open(hp))
    frame = H['frame']
    M = raster(frame, H['shapes'])
    pl = polys(M, frame)
    out = {'zone': zone, 'frame': frame, 'units': 'mm', 'coords': 'developed body coordinates: s (mm from the side centre line, right seen from outside), y (vessel height)',
           'plates': pl, 'bosses': H.get('bosses', []), 'generator': 'reference/nezu-fanghu/trace.py (edit dev-%s.hints.json and re-run)' % zone}
    with open(os.path.join(HERE, 'faces', f'dev-{zone}.plates.json'), 'w') as f:
        json.dump(out, f, separators=(',', ':'))
    # preview
    dev = os.path.join(HERE, 'faces', f'dev-{zone}.jpg')
    if os.path.exists(dev):
        im = Image.open(dev).convert('RGB')
        ppmm = H['ppmm']; dframe = H.get('devFrame', frame)
        k = 2
        im = im.resize((im.size[0] * k, im.size[1] * k))
        d = ImageDraw.Draw(im)
        P = lambda p: ((p[0] - dframe[0]) * ppmm * k, (dframe[3] - p[1]) * ppmm * k)
        for gy in range(int(np.ceil(dframe[1])), int(dframe[3]) + 1):
            if gy % 5 == 0:
                y = P((0, gy))[1]; d.line([(0, y), (im.size[0], y)], fill=(255, 60, 60) if gy % 10 == 0 else (110, 40, 40))
                if gy % 10 == 0: d.text((3, y - 12), str(gy), fill=(255, 255, 0))
        for gx in range(int(np.ceil(dframe[0])), int(dframe[2]) + 1):
            if gx % 5 == 0:
                x = P((gx, 0))[0]; d.line([(x, 0), (x, im.size[1])], fill=(60, 160, 255) if gx % 10 == 0 else (40, 70, 120))
                if gx % 10 == 0: d.text((x + 2, 3), str(gx), fill=(255, 255, 0))
        for p in pl:
            for ring in [p['outer']] + p['holes']:
                d.line([P(q) for q in ring] + [P(ring[0])], fill=(255, 0, 255), width=2)
        for b in H.get('bosses', []):
            cx, cy = P(b['c']); r = b['r'] * ppmm * k
            d.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(0, 255, 0), width=2)
        od = os.path.join(PKG, 'packages', 'taotie-bronze', '.work', 'r8-fanghu', 'trace')
        od = os.path.join(os.path.dirname(HERE), '..', '.work', 'r8-fanghu', 'trace')
        os.makedirs(od, exist_ok=True)
        im.save(os.path.join(od, f'dev-{zone}.png'))
    area = float(M.sum()) / PX / PX
    fa = (frame[2] - frame[0]) * (frame[3] - frame[1])
    print(f'{zone}: {len(pl)} plates, {sum(len(p["outer"]) for p in pl)} vertices, coverage {100 * area / fa:.0f} % of the frame')


if __name__ == '__main__':
    zones = sys.argv[1:] or sorted(f[4:-11] for f in os.listdir(os.path.join(HERE, 'faces')) if f.startswith('dev-') and f.endswith('.hints.json'))
    for z in zones:
        run(z)
