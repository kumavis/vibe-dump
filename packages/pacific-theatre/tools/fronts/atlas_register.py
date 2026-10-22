"""Register an Atlas of the World Battle Fronts leaf to lon/lat, writing the fits/T<leaf>.json classify.py reads."""
# The page is a Mercator map, scanned with a little rotation and warp. Start from a quadratic fit to
# hand-read control points (fits/cp24.json, read off leaf 24), carried to another leaf by one global
# shift found by correlating its line work with leaf 24's; then refine with the coastline itself: draw
# Natural Earth's 50 m coast where the current fit puts it, find the local shift that best lays it on the
# page's own dark line work in windows all over the map, and fit a cubic to the shifted points, dropping
# outliers. Writes fits/T<leaf>.json: {coef: 10x2 cubic in (u, v), residual stats}.
#
# FRONTS_DOWNLOADS=... python3 -I tools/fronts/atlas_register.py <leaf> [--from 24]
import sys, json, math, glob
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from paths import HERE, FITS, VIEW, downloads
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

DL = downloads()
A = DL + 'atlas/jp2/'
NE = DL + 'ne/ne_50m_land.geojson'


def merc(lat):
    lat = np.clip(np.asarray(lat, dtype=float), -85, 85)
    return np.log(np.tan(np.pi / 4 + np.radians(lat) / 2))


def terms(lon, lat, order):
    u = (np.asarray(lon, dtype=float) - 140) / 40
    v = merc(lat)
    one = np.ones_like(u)
    t = [one, u, v]
    if order >= 2:
        t += [u * u, u * v, v * v]
    if order >= 3:
        t += [u ** 3, u * u * v, u * v * v, v ** 3]
    return np.stack(t, axis=-1)


class T:
    def __init__(self, coef, order):
        self.coef = np.asarray(coef)
        self.order = order

    def __call__(self, lon, lat):
        return terms(lon, lat, self.order) @ self.coef

    @staticmethod
    def fit(lon, lat, px, order, w=None):
        M = terms(lon, lat, order)
        if w is not None:
            M = M * w[:, None]
            px = px * w[:, None]
        coef, *_ = np.linalg.lstsq(M, px, rcond=None)
        return T(coef, order)


def load_leaf(n):
    im = Image.open(sorted(glob.glob(A + f'*_{n:04d}.jp2'))[0]).convert('RGB')
    a = np.asarray(im).astype(np.int16)
    dark = (a.min(axis=2) < 135).astype(np.float32)  # the line work and the lettering
    return im, dark


def blur(m, r):
    return np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.BoxBlur(r))).astype(np.float32) / 255


def coast_rings():
    fc = json.load(open(NE))
    rings = []
    for f in fc['features']:
        g = f['geometry']
        polys = [g['coordinates']] if g['type'] == 'Polygon' else g['coordinates']
        for p in polys:
            for r in p:
                r = np.asarray(r)
                lon = r[:, 0].copy()
                lon[lon < -30] += 360  # the table's side of 180
                if lon.max() < 75 or lon.min() > 200 or r[:, 1].max() < -45 or r[:, 1].min() > 62:
                    continue
                rings.append(np.c_[lon, r[:, 1]])
    return rings


def draw_coast(t, shape, rings):
    im = Image.new('L', (shape[1], shape[0]), 0)
    d = ImageDraw.Draw(im)
    for r in rings:
        p = t(r[:, 0], r[:, 1])
        d.line([tuple(q) for q in p], fill=255, width=3)
    return np.asarray(im).astype(np.float32) / 255


def shift_of(img, tpl, s):
    """the (dx, dy) that best lays tpl on img (img is tpl's window grown by s on each side)"""
    H, W = img.shape
    t = np.zeros_like(img)
    h, w = tpl.shape
    t[s:s + h, s:s + w] = tpl - tpl.mean()
    i = img - img.mean()
    c = np.real(np.fft.ifft2(np.fft.fft2(i) * np.conj(np.fft.fft2(t))))
    c = np.fft.fftshift(c)
    cy, cx = H // 2, W // 2
    win = c[cy - s:cy + s + 1, cx - s:cx + s + 1]
    k = np.unravel_index(np.argmax(win), win.shape)
    peak = win[k]
    second = np.sort(win.ravel())[-int(0.02 * win.size) - 1]
    return k[1] - s, k[0] - s, float(peak), float(peak / max(second, 1e-6))


def main():
    leaf = int(sys.argv[1])
    src = int(sys.argv[sys.argv.index('--from') + 1]) if '--from' in sys.argv else None
    im, dark = load_leaf(leaf)
    H, W = dark.shape
    rings = coast_rings()
    if src is None:
        cps = json.load(open(FITS + 'cp24.json'))
        lon = np.array([c[1] for c in cps]); lat = np.array([c[2] for c in cps]); px = np.array([[c[3], c[4]] for c in cps], float)
        t = T.fit(lon, lat, px, 2)
    else:
        prev = json.load(open(FITS + f'T{src}.json'))
        t = T(prev['coef'], prev['order'])
        # one global shift from the whole map's coast
        cm = blur(draw_coast(t, dark.shape, rings), 3)
        dm = blur(dark, 3)
        y0, y1, x0, x1 = 300, 2700, 100, 2400
        dx, dy, _, _ = shift_of(dm[y0 - 80:y1 + 80, x0 - 80:x1 + 80], cm[y0:y1, x0:x1], 80)
        t = T(t.coef + np.r_[[[dx, dy]], np.zeros((len(t.coef) - 1, 2))], t.order)
        print('global shift', dx, dy)
    dm = blur(dark, 2)
    for it, (order, win, s) in enumerate([(2, 110, 45), (3, 90, 25), (3, 90, 20)]):
        cm = blur(draw_coast(t, dark.shape, rings), 2)
        pts = []
        for cy in range(320 + win, 2740 - win, win):
            for cx in range(40 + win, min(W, 2480) - win, win):
                tpl = cm[cy - win:cy + win, cx - win:cx + win]
                if tpl.sum() < 25:
                    continue
                img = dm[cy - win - s:cy + win + s, cx - win - s:cx + win + s]
                if img.shape != (2 * (win + s), 2 * (win + s)):
                    continue
                dx, dy, peak, ratio = shift_of(img, tpl, s)
                if ratio < 1.15 or abs(dx) >= s or abs(dy) >= s:
                    continue
                pts.append((cx, cy, dx, dy))
        pts = np.array(pts, float)
        # the lon/lat under each window centre, by inverting the current fit numerically
        ll = invert(t, pts[:, :2])
        target = pts[:, :2] + pts[:, 2:]
        keep = np.ones(len(pts), bool)
        for _ in range(4):
            nt = T.fit(ll[keep, 0], ll[keep, 1], target[keep], order)
            r = np.hypot(*(nt(ll[:, 0], ll[:, 1]) - target).T)
            sd = np.sqrt(np.mean(r[keep] ** 2))
            keep = r < max(2.5 * sd, 4)
        t = nt
        print(f'pass {it}: {len(pts)} windows, {keep.sum()} kept, rms {sd:.1f} px')
    # the hand-read control points against the final fit (leaf 24 only)
    if src is None:
        cps = json.load(open(FITS + 'cp24.json'))
        for c in cps:
            p = t([c[1]], [c[2]])[0]
            print(f'  {c[0]:12s} {p[0] - c[3]:6.1f} {p[1] - c[4]:6.1f}')
    json.dump({'leaf': leaf, 'order': t.order, 'coef': t.coef.tolist(), 'rms': sd, 'windows': int(keep.sum())}, open(FITS + f'T{leaf}.json', 'w'))
    # a check image: the fitted coast in red over the page
    ov = im.copy().convert('RGB')
    d = ImageDraw.Draw(ov)
    for r in rings:
        p = t(r[:, 0], r[:, 1])
        d.line([tuple(q) for q in p], fill=(255, 0, 0), width=2)
    ov.resize((W // 2, H // 2)).save(VIEW + f'reg{leaf}.jpg', quality=80)


def invert(t, px):
    """lon/lat for pixels, by Newton steps on the fit"""
    lon = np.full(len(px), 130.0)
    lat = np.full(len(px), 10.0)
    for _ in range(30):
        p = t(lon, lat)
        e = 1e-3
        pl = t(lon + e, lat)
        pt = t(lon, lat + e)
        J = np.stack([(pl - p) / e, (pt - p) / e], axis=-1)  # n x 2 x 2
        d = np.linalg.solve(J, (px - p)[..., None])[..., 0]
        lon += d[:, 0]
        lat = np.clip(lat + d[:, 1], -80, 80)
    return np.c_[lon, lat]


if __name__ == '__main__':
    main()
