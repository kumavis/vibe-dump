"""Snap a rough human drawing of a raised shape to the edges in the photograph.

  snap.py <drawing.json> <photo.jpg> <out-prefix> [reach_px=50] [sigma=4]

Needs opencv and scipy, which the repo python does not have: use a throw-away venv outside the repo
  python3 -m venv /tmp/cv && /tmp/cv/bin/pip install numpy scipy opencv-python-headless

The drawing is the Motif Tracer's copy text (JSON part): strokes painted with a fat brush or drawn as
outlines. Union of the paint -> rough silhouette -> each contour point may slide along its normal by up to
`reach` px to the strongest edge, with a smoothness cost (Viterbi over the closed contour).
Writes <out>-sheet.jpg (photo | paint | snapped), <out>.svg and <out>.json (polygon in sheet pixels).
"""
import json, sys
import numpy as np, cv2
from scipy.ndimage import gaussian_filter1d, map_coordinates

src, photo, out = sys.argv[1:4]
reach = int(sys.argv[4]) if len(sys.argv) > 4 else 50
sigma = float(sys.argv[5]) if len(sys.argv) > 5 else 4
d = json.load(open(src)); img = cv2.imread(photo); H, W = img.shape[:2]
mask = np.zeros((H, W), np.uint8)
for s in d['strokes']:
    if s['k'] == 'note': continue
    p = np.array([[float(v) for v in q.split(',')] for q in s['p'].split(';')]).round().astype(np.int32)
    if s['k'] == 'outline' and s.get('c'): cv2.fillPoly(mask, [p], 255)
    else: cv2.polylines(mask, [p], False, 255, int(s['w']), cv2.LINE_AA)
mask = cv2.morphologyEx((mask > 127).astype(np.uint8), cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (25, 25)))
cs, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
cs = sorted([k for k in cs if cv2.contourArea(k) > 1500], key=cv2.contourArea, reverse=True)

def resample(c, step):
    seg = np.hypot(*np.diff(np.vstack([c, c[:1]]), axis=0).T); L = np.concatenate([[0], np.cumsum(seg)])
    t = np.arange(0, L[-1], step); cc = np.vstack([c, c[:1]])
    return np.stack([np.interp(t, L, cc[:, 0]), np.interp(t, L, cc[:, 1])], 1)

g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2LAB)[:, :, 0].astype(np.float32), (0, 0), sigma)
gx, gy = cv2.Sobel(g, cv2.CV_32F, 1, 0, ksize=3), cv2.Sobel(g, cv2.CV_32F, 0, 1, ksize=3)
offs = np.arange(-reach, reach + 1, 2.0); K = len(offs)
lam = 0.02; dk = (np.arange(K)[:, None] - np.arange(K)[None, :]) ** 2 * lam
def viterbi(E):
    n = len(E); S = E[0].copy(); B = np.zeros((n, K), int)
    for i in range(1, n):
        M = S[None, :] - dk; B[i] = M.argmax(1); S = M.max(1) + E[i]
    k = int(S.argmax()); path = [k]
    for i in range(n - 1, 0, -1): k = B[i][k]; path.append(k)
    return np.array(path[::-1])
def snap_one(c):
    c = resample(c, 5)
    c = np.stack([gaussian_filter1d(c[:, k], 6, mode='wrap') for k in (0, 1)], 1)       # tame the brush wobble
    tan = np.stack([gaussian_filter1d(c[:, k], 3, order=1, mode='wrap') for k in (0, 1)], 1)
    nrm = np.stack([tan[:, 1], -tan[:, 0]], 1); nrm /= np.linalg.norm(nrm, axis=1, keepdims=True) + 1e-9
    if cv2.pointPolygonTest(c.astype(np.float32), tuple((c[0] + 3 * nrm[0]).astype(float)), False) > 0: nrm = -nrm   # point outward
    N = len(c)
    P = c[:, None, :] + offs[None, :, None] * nrm[:, None, :]
    ex = map_coordinates(gx, [P[..., 1], P[..., 0]], order=1, mode='nearest'); ey = map_coordinates(gy, [P[..., 1], P[..., 0]], order=1, mode='nearest')
    dn = ex * nrm[:, None, 0] + ey * nrm[:, None, 1]
    # going OUTWARD off a raised slab the picture gets darker on both sides under top light: lit rim -> ground above,
    # slab -> its own cast shadow below. The far edge of the shadow has the other sign, so it is nearly ignored.
    E_ = np.maximum(0, -dn) + 0.2 * np.abs(dn)
    E_ = E_ / (np.percentile(E_, 99) + 1e-6) - 0.35 * (np.abs(offs) / reach)[None, :] ** 2       # mild pull to where the hand put it
    w = N // 4; path = viterbi(np.vstack([E_[-w:], E_, E_[:w]]))[w:w + N]                         # wrap-around for the closed loop
    off = gaussian_filter1d(offs[path], 2, mode='wrap')
    snap = c + off[:, None] * nrm
    poly = cv2.approxPolyDP(snap.astype(np.float32).reshape(-1, 1, 2), 1.5, True)[:, 0, :]
    return c, snap, poly, off
res = [snap_one(k[:, 0, :].astype(float)) for k in cs]
allp = np.vstack([r[1] for r in res]); moved = np.concatenate([np.abs(r[3]) for r in res])
json.dump({'sheet': d['sheet'], 'origin': d.get('origin'), 'size': [W, H], 'outlines': [np.round(r[2], 1).tolist() for r in res], 'moved_px': {'median': float(np.median(moved)), 'p90': float(np.percentile(moved, 90))}}, open(out + '.json', 'w'))
x0, y0 = np.floor(allp.min(0) - 60).astype(int).clip(0); x1, y1 = np.ceil(allp.max(0) + 60).astype(int); x1, y1 = min(x1, W), min(y1, H)
pth = ' '.join('M' + ' L'.join(f'{x - x0:.1f},{y - y0:.1f}' for x, y in r[2]) + ' Z' for r in res)
open(out + '.svg', 'w').write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {x1 - x0} {y1 - y0}"><path d="{pth}" fill="#8a9a6a" stroke="#1d2a1a" stroke-width="3" stroke-linejoin="round"/></svg>\n')
a = img.copy(); ov = img.copy(); ov[mask > 0] = (60, 200, 255); a = cv2.addWeighted(ov, 0.4, a, 0.6, 0)
b = img.copy(); e = np.zeros_like(img)
for c, snap, poly, off in res:
    cv2.polylines(b, [c.round().astype(np.int32)], True, (60, 200, 255), 2, cv2.LINE_AA); cv2.polylines(b, [poly.round().astype(np.int32)], True, (40, 40, 255), 4, cv2.LINE_AA)
    cv2.fillPoly(e, [poly.round().astype(np.int32)], (150, 170, 140)); cv2.polylines(e, [poly.round().astype(np.int32)], True, (255, 255, 255), 3, cv2.LINE_AA)
tiles = [t[y0:y1, x0:x1] for t in (img, a, b, e)]
sheet = np.vstack([np.hstack(tiles[:2]), np.hstack(tiles[2:])])
f = 1500 / sheet.shape[1]; cv2.imwrite(out + '-sheet.jpg', cv2.resize(sheet, None, fx=f, fy=f, interpolation=cv2.INTER_AREA), [cv2.IMWRITE_JPEG_QUALITY, 88])
print('shapes', len(res), 'moved median %.1f p90 %.1f px' % (np.median(moved), np.percentile(moved, 90)))
