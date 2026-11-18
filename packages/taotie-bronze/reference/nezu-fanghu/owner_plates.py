"""Bird plates for the Nezu fanghu from the owner's reading.
  lower bird: the owner's own outline (reference/nezu-fanghu/owner-trace-phoenix.json)
  upper bird: the machine's figure/ground map trained on that outline and on the owner's corrections
              (tools/propose.py + tools/snap.py -> .work/lead/propose/hu-snapped.json), upper LEFT cartouche, mirrored
Both are carried from photo-08 onto the model's developed surface (s, y mm) through the camera of
.work/r8-fanghu/solve and written in the ribbons.json form that src/artifacts/nezu-fanghu/decor.js lays on.
Run with cwd = .work/r8-fanghu/solve (for cam.py / form.py / develop.py)."""
import json, sys, numpy as np, cv2
sys.path.insert(0, '.')
from cam import project
from form import *
from develop import CAM08
from scipy.ndimage import map_coordinates, gaussian_filter
from scipy.spatial import cKDTree
from skimage.morphology import remove_small_objects, remove_small_holes
ROOT = '/home/user/vibe-dump/packages/taotie-bronze/'; REF = ROOT + 'reference/nezu-fanghu/'; OUT = ROOT + '.work/lead/hu/'
PP = 8
photo = cv2.imread(REF + 'photo-08.jpg')
def fwd(S, Y):
    a = bodyW(Y); b = RHO * a; r = np.minimum(bodyR(Y), b - 0.5); x, z = rrPoint(0, S, a, b, r)
    return project(np.c_[x.ravel(), Y.ravel(), z.ravel()], CAM08)[:, :2].reshape(S.shape + (2,))
def grid(s0, s1, y0, y1):
    ss = s0 + (np.arange(int((s1 - s0) * PP)) + 0.5) / PP; ys = y1 - (np.arange(int((y1 - y0) * PP)) + 0.5) / PP
    return np.meshgrid(ss, ys)
def toPx(p, fr): return np.c_[(np.asarray(p)[:, 0] - fr[0]) * PP, (fr[3] - np.asarray(p)[:, 1]) * PP]
def toMm(c, fr): return np.c_[fr[0] + c[:, 0] / PP, fr[3] - c[:, 1] / PP]
def plates(fig, fr, min_mm2=3.0, hole_mm2=1.0):
    fig = remove_small_objects(fig, max_size=int(min_mm2 * PP * PP)); fig = remove_small_holes(fig, max_size=int(hole_mm2 * PP * PP))
    fig = gaussian_filter(fig.astype(np.float32), 0.22 * PP) > 0.5
    cs, hier = cv2.findContours(fig.astype(np.uint8), cv2.RETR_CCOMP, cv2.CHAIN_APPROX_NONE); out = {}
    simp = lambda c: np.round(toMm(cv2.approxPolyDP(c.astype(np.float32), 0.1 * PP, True)[:, 0, :] + 0.5, fr), 2).tolist()
    for k, c in enumerate(cs):
        if hier[0][k][3] < 0 and cv2.contourArea(c) >= min_mm2 * PP * PP: out[k] = {'outer': simp(c), 'holes': []}
    for k, c in enumerate(cs):
        par = hier[0][k][3]
        if par >= 0 and par in out and cv2.contourArea(c) >= hole_mm2 * PP * PP: out[par]['holes'].append(simp(c))
    return list(out.values()), fig
def carve(fig, fr, eye):
    c = toPx([eye['c']], fr)[0]; cv2.circle(fig, tuple(c.round().astype(int)), int(round(eye['recess'] * PP)), 0, -1); return fig
def sheet(name, devimg, fr, P, field, eye):
    k = 2; im = cv2.resize(devimg, None, fx=k, fy=k, interpolation=cv2.INTER_CUBIC); a = im.copy(); e = np.zeros_like(im); e[:] = (40, 50, 60)
    T = lambda p: (toPx(p, fr) * k).round().astype(np.int32)
    loops = [T(p['outer']) for p in P] + [T(h) for p in P for h in p['holes']]
    cv2.fillPoly(e, loops, (150, 170, 140))
    cv2.polylines(a, loops, True, (40, 40, 255), 2, cv2.LINE_AA); cv2.polylines(a, [T(field)], True, (255, 220, 0), 2, cv2.LINE_AA)
    cv2.circle(a, tuple(T([eye['c']])[0]), int(eye['r'] * PP * k), (0, 255, 0), 2)
    cv2.imwrite(OUT + name, np.hstack([im, a, e]), [cv2.IMWRITE_JPEG_QUALITY, 86])

# ---------------- upper bird: machine map of the upper LEFT cartouche, mirrored into the right bird's frame
UP = json.load(open(REF + 'faces/dev-up.ribbons.json')); fr = [15, 196, 96, 294]
S, Y = grid(fr[0], fr[2], fr[1], fr[3])
# the mirror twin: sample at -s. Under the assumed camera the left cartouche develops 14 % wider than the right one's
# traced field (its edges read at s 17.4 and 94.3 against 20.6 and 88): fit it to the field
P = fwd(-(17.4 + (S - 20.6) * 1.14), Y)
snap = json.load(open(ROOT + '.work/lead/propose/hu-snapped.json'))['outlines']; crop = cv2.imread(ROOT + '.work/lead/propose/hu-crop.jpg')
M = np.zeros(crop.shape[:2], np.uint8); cv2.fillPoly(M, [np.array(o).round().astype(np.int32) for o in snap], 1)   # even-odd
fig = map_coordinates(M.astype(np.float32), [(P[..., 1] - 840) * 3, (P[..., 0] - 280) * 3], order=1, mode='constant') > 0.5
import os
if os.path.exists(REF + 'faces/dev-up.fused-outlines.json'):       # better: both upper birds registered and averaged (see that file's note)
    FO = json.load(open(REF + 'faces/dev-up.fused-outlines.json'))['outlines_dev_mm']
    f8 = np.zeros(S.shape, np.uint8); cv2.fillPoly(f8, [toPx(o, fr).round().astype(np.int32) for o in FO], 1); fig = f8 > 0
dev = cv2.remap(photo, P[..., 0].astype(np.float32), P[..., 1].astype(np.float32), cv2.INTER_LINEAR)
field = np.array(UP['field']['poly']); fm = np.zeros(S.shape, np.uint8); cv2.fillPoly(fm, [toPx(field, fr).round().astype(np.int32)], 1)
inner = cv2.erode(fm, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * int((UP['rim'] + 0.2) * PP) + 1,) * 2))     # inside the stepped rim
eye = dict(UP['eyes'][0])
if len(sys.argv) > 1: eye['c'] = [float(sys.argv[1]), float(sys.argv[2])]
figU = carve((fig & (inner > 0)).astype(np.uint8), fr, eye) > 0
PU, figU = plates(figU, fr)
cov = float(figU.sum() / max(1, fm.sum()))
json.dump({'zone': 'up', 'units': 'mm', 'frame': UP['frame'], 'field': UP['field'], 'rim': UP['rim'], 'plates': PU, 'eyes': [eye], 'coverage': round(cov, 3),
           'generator': "tools/propose.py (trained on the owner's tracing and corrections) + tools/snap.py on both upper cartouches registered and averaged (faces/dev-up.fused-outlines.json); reference/nezu-fanghu/owner_plates.py"},
          open(REF + 'faces/dev-up.machine.json', 'w'), separators=(',', ':'))
sheet('up-plates.jpg', dev, fr, PU, field, eye); print('upper: plates', len(PU), 'holes', sum(len(p['holes']) for p in PU), 'coverage %.2f' % cov)

# ---------------- lower bird: the owner's outline
LOW = json.load(open(REF + 'faces/dev-low.ribbons.json')); fr = [10, 64, 124, 172]
own = [np.array(o) for o in json.load(open(REF + 'faces/dev-low.owner-outline.json'))['outlines_dev_mm']]
smax = max(o[:, 0].max() for o in own); ymin = min(o[:, 1].min() for o in own)
def warp(p):                                   # the limb (s > 95) and the belly's underside (y < 90) are stretched by the development: bring them back
    p = np.array(p, float); s, y = p[:, 0].copy(), p[:, 1].copy()
    k = s > 95; s[k] = 95 + (s[k] - 95) * (113.6 - 95) / (smax - 95)
    k = y < 90; y[k] = 90 - (90 - y[k]) * (90 - 72.6) / (90 - ymin)
    return np.c_[s, y]
S, Y = grid(fr[0], fr[2], fr[1], fr[3]); fig = np.zeros(S.shape, np.uint8)
cv2.fillPoly(fig, [toPx(warp(o), fr).round().astype(np.int32) for o in own], 1)
eye = dict(LOW['eyes'][0]); eye['c'] = warp([eye['c']])[0].round(2).tolist()
if len(sys.argv) > 3: eye['c'] = [float(sys.argv[3]), float(sys.argv[4])]
hull = cv2.dilate(cv2.morphologyEx(fig, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * 7 * PP + 1,) * 2)), cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (2 * int(1.2 * PP) + 1,) * 2))
hc = max(cv2.findContours(hull, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0], key=cv2.contourArea)
fieldL = np.round(toMm(cv2.approxPolyDP(hc.astype(np.float32), 0.15 * PP, True)[:, 0, :] + 0.5, fr), 2)
PL, figL = plates(carve(fig, fr, eye) > 0, fr)
cov = float(figL.sum() / max(1, hull.sum()))
import os
LN = json.load(open(REF + 'faces/dev-low.owner-lines.json'))['lines'] if os.path.exists(REF + 'faces/dev-low.owner-lines.json') else []
lines = [{'line': np.round(warp(l['line']), 2).tolist(), 'w': l['w']} for l in LN]          # owner_lines.py: incised lines on the figure
json.dump({'zone': 'low', 'units': 'mm', 'frame': LOW['frame'], 'field': {'poly': fieldL.tolist()}, 'rim': 0, 'plates': PL, 'eyes': [eye], 'lines': lines, 'coverage': round(cov, 3),
           'span': [round(float(fieldL[:, 0].min()), 2), round(float(fieldL[:, 0].max()), 2)],
           'generator': "the owner's own outline (owner-trace-phoenix.json) developed onto the model; limb and underside un-stretched; reference/nezu-fanghu/owner_plates.py"},
          open(REF + 'faces/dev-low.owner.json', 'w'), separators=(',', ':'))
Pd = fwd(S, Y); dev = cv2.remap(photo, Pd[..., 0].astype(np.float32), Pd[..., 1].astype(np.float32), cv2.INTER_LINEAR)
sheet('low-plates.jpg', dev, fr, PL, fieldL, eye); print('lower: plates', len(PL), 'holes', sum(len(p['holes']) for p in PL), 'coverage %.2f' % cov, 'field s', fieldL[:, 0].min(), fieldL[:, 0].max(), 'y', fieldL[:, 1].min(), fieldL[:, 1].max(), 'eye', eye)
