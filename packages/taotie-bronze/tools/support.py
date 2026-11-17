"""Does the photograph support each traced slab? An objective check on outlines a builder painted by eye.

  support.py <slabs.json> <photo.jpg> [--sigma 1.2] [--slack 1.5]

slabs.json: { slabs: [{ id, by: 'owner' | 'builder', photo_px: [[x, y]…] }] } (reference/<id>/slabs.json).
For every outline: the edge strength met along it — how much darker the picture gets going OUTWARD across the line
(the mark of a raised slab under top light; see tools/snap.py), best within ± slack px — as a median over the outline.
The owner's own outlines set the scale: a builder's slab whose median is under HALF the weakest owner outline is
FLAGGED — the photograph does not show an edge where it was drawn, so it is a guess. Needs opencv + scipy (see snap.py).
"""
import argparse, json
import numpy as np, cv2
from scipy.ndimage import gaussian_filter1d, map_coordinates
ap = argparse.ArgumentParser(); ap.add_argument('slabs'); ap.add_argument('photo')
ap.add_argument('--sigma', type=float, default=1.2); ap.add_argument('--slack', type=float, default=1.5)
A = ap.parse_args()
d = json.load(open(A.slabs)); img = cv2.imread(A.photo)
L = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32), (0, 0), A.sigma)
gx, gy = cv2.Sobel(L, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(L, cv2.CV_32F, 0, 1, ksize=3)
def support(o):
    c = np.array(o, float); cc = np.vstack([c, c[:1]]); seg = np.hypot(*np.diff(cc, axis=0).T); Lc = np.r_[0, np.cumsum(seg)]; t = np.arange(0, seg.sum(), 1.0)
    c = np.stack([np.interp(t, Lc, cc[:, 0]), np.interp(t, Lc, cc[:, 1])], 1)
    tan = np.stack([gaussian_filter1d(c[:, k], 2, order=1, mode='wrap') for k in (0, 1)], 1)
    n = np.stack([tan[:, 1], -tan[:, 0]], 1); n /= np.linalg.norm(n, axis=1, keepdims=True) + 1e-9
    if cv2.pointPolygonTest(c.astype(np.float32), tuple((c[0] + 2 * n[0]).astype(float)), False) > 0: n = -n
    best = np.full(len(c), -1e9)
    for off in np.linspace(-A.slack, A.slack, 5):
        q = c + off * n
        best = np.maximum(best, -(map_coordinates(gx, [q[:, 1], q[:, 0]], order=1) * n[:, 0] + map_coordinates(gy, [q[:, 1], q[:, 0]], order=1) * n[:, 1]))
    return float(np.median(best))
rows = [(s['id'], s.get('by', 'builder'), support(s['photo_px'])) for s in d['slabs']]
own = [r[2] for r in rows if r[1] == 'owner']; bar = 0.5 * min(own) if own else None
print('%-12s %-8s %s' % ('slab', 'by', 'median edge along the outline'))
bad = []
for i, by, v in rows:
    flag = bar is not None and by != 'owner' and v < bar
    if flag: bad.append(i)
    print('%-12s %-8s %6.1f %s' % (i, by, v, 'FLAGGED: no edge in the photograph' if flag else ''))
if bar is None: print('no owner outlines in this file: nothing to scale against')
else: print('bar = half the weakest owner outline = %.1f; flagged: %s' % (bar, ', '.join(map(str, bad)) or 'none'))
raise SystemExit(1 if bad else 0)
