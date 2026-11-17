"""Propose more raised figures in a photograph, learning what "raised figure" looks like from the owner's tracing.

  propose.py <photo.jpg> <owner-trace.json> <out-prefix> --area x0,y0,x1,y1 [--neg bays|ring] [--ring 12]
             [--roi x0,y0,x1,y1 ...] [--holdout 0.6] [--min 80]

The owner paints or outlines a few figures (tools/snap.py -> reference/<id>/owner-trace-*.json, outlines in photo px).
Those pixels are the labels: FIGURE = inside the outlines; GROUND = what lies just outside them (`--neg ring`: a band
`--ring` px wide — slabs standing on a spiral ground) or what the figure encloses (`--neg bays`: the channels and
bays of one broad figure, plus a 3 px moat). A random forest on per-pixel features (smoothed colour, gradient,
Hessian texture and signed shading derivatives at five scales — light comes from above, so the SIGN of dL/dy tells a
lit upper edge from a shadowed lower one) is trained on them and run over `--area`. The probability map is cut at
0.5 into shapes, which go to tools/snap.py for their edges. `--scribbles drawing.json:x0,y0,scale` adds the owner's
corrections drawn on a machine sheet of the Motif Tracer (sheet px = (photo px - x0,y0) * scale): Band or Outline
paint is FIGURE, Groove paint is GROUND; rerun and the map follows them. `--holdout f` first trains on the left fraction f of the
labelled pixels and scores the rest: the honest number. Needs opencv, scipy, scikit-image, scikit-learn (see snap.py).

Writes <out>-prob.png (area, 8 bit), <out>-proposals.json (drawing for snap.py: closed loops, px of the area x `--up`),
<out>-crop.jpg (the area x `--up`) and <out>-sheet.jpg (photo | probability | proposals over the photo, owner's in red).
"""
import argparse, json
import numpy as np, cv2
from scipy.ndimage import gaussian_filter
from skimage.feature import multiscale_basic_features
from sklearn.ensemble import RandomForestClassifier

ap = argparse.ArgumentParser()
ap.add_argument('photo'); ap.add_argument('trace'); ap.add_argument('out')
ap.add_argument('--area', required=True); ap.add_argument('--roi', action='append', default=[])
ap.add_argument('--neg', default='ring'); ap.add_argument('--ring', type=int, default=12)
ap.add_argument('--holdout', type=float, default=0.6); ap.add_argument('--min', type=int, default=80)
ap.add_argument('--scribbles', action='append', default=[], help='drawing.json:x0,y0,scale — corrections drawn on a machine sheet')
ap.add_argument('--up', type=int, default=3); ap.add_argument('--seed', type=int, default=7)
A = ap.parse_args()
X0, Y0, X1, Y1 = map(int, A.area.split(','))
img = cv2.imread(A.photo)[Y0:Y1, X0:X1]; H, W = img.shape[:2]
T = json.load(open(A.trace)); outs = [np.array(o) - [X0, Y0] for o in T['outlines_photo_px']]

# ---- labels
fig = np.zeros((H, W), np.uint8); cv2.fillPoly(fig, [o.round().astype(np.int32) for o in outs], 1)      # even-odd: holes stay ground
el = lambda r: cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * r + 1, 2 * r + 1))
pos = cv2.erode(fig, el(1)) > 0
if A.neg == 'bays': near = cv2.dilate(cv2.morphologyEx(fig, cv2.MORPH_CLOSE, el(A.ring)), el(3))
else: near = cv2.dilate(fig, el(A.ring))
neg = (near > 0) & (cv2.dilate(fig, el(1)) == 0)

# corrections: Band / Outline paint = FIGURE, Groove paint = GROUND, wherever the owner scribbled (they outrank the automatic ring)
for spec in A.scribbles:
    path, m_ = spec.rsplit(':', 1); sx, sy, sc = map(float, m_.split(','))
    for st in json.load(open(path))['strokes']:
        if st['k'] == 'note': continue
        q = (np.array([[float(v) for v in t.split(',')] for t in st['p'].split(';')]) / sc + [sx - X0, sy - Y0]).round().astype(np.int32)
        mk = np.zeros((H, W), np.uint8); cv2.polylines(mk, [q], False, 1, max(1, int(round(st['w'] / sc))), cv2.LINE_AA)
        if st['k'] == 'sunk': neg |= mk > 0; pos &= mk == 0
        else: pos |= mk > 0; neg &= mk == 0

# ---- features (on a locally normalised image, so a cartouche in the shade reads like one in the light)
from skimage.filters import sato
def features(bgr):
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32) / 255
    n = np.empty_like(lab)
    for c in range(3):
        d = lab[:, :, c] - gaussian_filter(lab[:, :, c], 30)
        n[:, :, c] = d / (np.sqrt(gaussian_filter(d * d, 30)) + 0.02)
    F = [multiscale_basic_features(n, channel_axis=-1, intensity=True, edges=True, texture=True, sigma_min=0.7, sigma_max=11, num_sigma=5).astype(np.float32)]
    L = n[:, :, 0]
    for s in (1.0, 2.0, 4.0, 8.0):
        F.append(np.stack([gaussian_filter(L, s, order=(1, 0)), gaussian_filter(L, s, order=(0, 1)),             # signed shading
                           L - gaussian_filter(L, 3 * s),                                                          # brighter / darker than around
                           np.sqrt(np.maximum(0, gaussian_filter(L * L, s) - gaussian_filter(L, s) ** 2))], -1))   # busyness (spiral ground)
    F.append(np.stack([sato(L, sigmas=[k], black_ridges=b).astype(np.float32) for k in (1.5, 3, 5) for b in (True, False)], -1))   # lines and channels, any direction
    return np.concatenate(F, -1)
F = features(img); nf = F.shape[-1]; Ff = F.reshape(-1, nf)
Fm = features(img[:, ::-1])[:, ::-1].reshape(-1, nf)       # the same pixels as seen in the mirror image: a confronted twin is lit that way

def fit(mask_pos, mask_neg):
    rng = np.random.default_rng(A.seed); ip = np.flatnonzero(mask_pos.ravel()); ineg = np.flatnonzero(mask_neg.ravel())
    n = m = min(30000, len(ip), len(ineg))
    ip = rng.choice(ip, n, replace=False); ineg = rng.choice(ineg, m, replace=False)
    rf = RandomForestClassifier(n_estimators=120, max_depth=14, min_samples_leaf=15, class_weight='balanced', n_jobs=3, random_state=A.seed)
    y = np.r_[np.ones(n), np.zeros(m)]
    rf.fit(np.vstack([Ff[ip], Ff[ineg], Fm[ip], Fm[ineg]]), np.r_[y, y]); return rf

score = None
if A.holdout:                                           # train on the left part of the labels, score on the rest
    xs = np.nonzero(pos | neg)[1]; cut = np.quantile(xs, A.holdout); left = np.arange(W)[None, :] <= cut
    rf = fit(pos & left, neg & left); te = (pos | neg) & ~left
    p = rf.predict_proba(Ff[te.ravel()])[:, 1] > 0.5; y = pos[te]
    score = {'pixels': int(te.sum()), 'accuracy': float((p == y).mean()), 'iou': float((p & y).sum() / max(1, (p | y).sum())),
             'figure_recall': float((p & y).sum() / max(1, y.sum())), 'ground_recall': float((~p & ~y).sum() / max(1, (~y).sum()))}
rf = fit(pos, neg)
P = np.zeros(H * W, np.float32)
for i in range(0, H * W, 400000): P[i:i + 400000] = rf.predict_proba(Ff[i:i + 400000])[:, 1]
P = P.reshape(H, W); cv2.imwrite(A.out + '-prob.png', (P * 255).round().astype(np.uint8))

# ---- shapes
m = (gaussian_filter(P, 0.8) > 0.5).astype(np.uint8)
m = cv2.morphologyEx(m, cv2.MORPH_OPEN, el(1))
rois = [list(map(int, r.split(','))) for r in A.roi] or [[X0, Y0, X1, Y1]]
keep = np.zeros_like(m)
for x0, y0, x1, y1 in rois: keep[y0 - Y0:y1 - Y0, x0 - X0:x1 - X0] = 1
m &= keep
cs, hier = cv2.findContours(m, cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE)
up = A.up; strokes = []; polys = []
for k, c in enumerate(cs):
    hole = hier[0][k][3] >= 0
    if cv2.contourArea(c) < (A.min / 3 if hole else A.min): continue
    q = cv2.approxPolyDP(c.astype(np.float32), 0.6, True)[:, 0, :]
    if len(q) < 4: continue
    polys.append((q, hole))
    strokes.append({'k': 'outline', 'w': 7, 'c': 1, 'p': ';'.join('%.1f,%.1f' % ((x + 0.5) * up, (y + 0.5) * up) for x, y in q)})
crop = cv2.resize(img, None, fx=up, fy=up, interpolation=cv2.INTER_LANCZOS4); cv2.imwrite(A.out + '-crop.jpg', crop, [cv2.IMWRITE_JPEG_QUALITY, 92])
json.dump({'sheet': 'proposals', 'origin': '%s area %d,%d,%d,%d shown at %dx' % (A.photo.split('/')[-1], X0, Y0, X1, Y1, up), 'size': [W * up, H * up],
           'score': score, 'strokes': strokes}, open(A.out + '-proposals.json', 'w'))
heat = cv2.applyColorMap((P * 255).astype(np.uint8), cv2.COLORMAP_VIRIDIS)
v = img.copy()
for q, hole in polys: cv2.polylines(v, [q.round().astype(np.int32)], True, (255, 220, 0) if not hole else (255, 120, 0), 1, cv2.LINE_AA)
for o in outs: cv2.polylines(v, [o.round().astype(np.int32)], True, (40, 40, 255), 1, cv2.LINE_AA)
s = np.hstack([img, heat, v]); f = min(2, 2400 / s.shape[1])
cv2.imwrite(A.out + '-sheet.jpg', cv2.resize(s, None, fx=f, fy=f, interpolation=cv2.INTER_CUBIC), [cv2.IMWRITE_JPEG_QUALITY, 88])
imp = np.argsort(rf.feature_importances_)[::-1][:6]
print('features', nf, 'labels fig/ground', int(pos.sum()), int(neg.sum()), 'holdout', score, 'shapes', len(polys), 'top features', imp.tolist())
