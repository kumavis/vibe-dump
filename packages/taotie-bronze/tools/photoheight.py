#!/usr/bin/env python3
"""Relief height FROM the flattened photograph of a mirror-symmetric register (python3 + PIL + numpy only).

An experiment (round "photo relief"): instead of drawing the décor as vectors, read the height off the photograph.

  python3 tools/photoheight.py nezu-fanglei face-main [--out .work/photo/height] [--ship]

Writes <out>/<face>-{pure,hybrid}.npy (float32 mm, face pixel grid, row 0 = TOP), <out>/<face>-sheet.jpg
(photo | height | relit from the left | relit from the lower right, per variant) and, with --ship,
reference/<id>/faces/<face>.height.png: the RIGHT half (axis → right edge) of the hybrid as a 16-bit greyscale PNG,
resampled to SHIP_PPMM, plus <face>.height.json { width, height (mm of the shipped half), ppmm, min, max, axis, ... }.

Method (every step is a cue that is cheap to switch off for comparison, see CUES):
  1. luminance → log → illumination flattened and contrast normalised (a 10 mm window): the left half of the
     photograph is a stop darker than the right, this makes the two halves comparable.
  2. mirror: the left half, flipped about the axis, is registered onto the right (global shift, then a smooth
     field of local shifts from 24 mm tiles) — the same relief under a mirrored light.
  3. light + gain: the shading q is regressed on the slope of the hand-traced plate prior (plates.json) → the
     light's direction in the face plane and the slope gain (so heights come out in mm). Done per half: the
     mirrored half sees the light with its x flipped, so the pair is a two-light photometric stereo.
  4. robust weights: glare (near-white), deep shadow (clipped), green/red crust (chroma away from the bronze's
     own), and pixels where the two halves disagree at 1.5 mm scale are down-weighted.
  5. integration: least squares (conjugate gradients) of
        Σ_halves w (l·∇z − q)² + ε|∇z|² + μ (z − prior)²
     pure:   prior = 0, μ small (a 15 mm high-pass, no drawn information at all)
     hybrid: prior = the traced plates (2.4 mm plates, 3 mm bosses), μ larger: the drawing holds the layout
             and the absolute heights, the photograph moves the edges and shapes the tops.
  6. micro: incised lines and the leiwen ground are DARK in the photograph whatever the light (occlusion), so they
     are taken isotropically as a shallow cut: depth ∝ how much darker a pixel is than its 0.8 mm neighbourhood,
     from the right half only (registration is not good to 0.3 mm), the mirrored half where the right is glare.
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw

PKG = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHIP_PPMM = 4.5
BAND_HI = 4.0  # mm
LAM_PURE = 30.0  # mm
PURE_SPAN = 3.2  # mm
SNAP = 0.35
MID = 0.25
MICRO_DEPTH = 0.42  # mm at full darkness
EPS_X = 1.0

CUES = {'mirror': True, 'weights': True, 'micro': True, 'warp': True, 'snap': True}


# ------------------------------------------------------------------ small image ops
def gblur(x, s):
    """Gaussian blur, sigma s px (FFT, reflect padded)."""
    if s <= 0:
        return x.copy()
    p = int(3 * s) + 2
    X = np.pad(x, p, mode='reflect')
    fy = np.fft.fftfreq(X.shape[0])[:, None]
    fx = np.fft.rfftfreq(X.shape[1])[None, :]
    g = np.exp(-2 * (np.pi * s) ** 2 * (fx ** 2 + fy ** 2))
    return np.fft.irfft2(np.fft.rfft2(X) * g, s=X.shape)[p:-p, p:-p]


def shift_bilinear(img, dx, dy):
    """sample img at (x + dx, y + dy); dx, dy scalars or arrays of img's shape."""
    h, w = img.shape
    ys, xs = np.mgrid[0:h, 0:w].astype(float)
    x = np.clip(xs + dx, 0, w - 1.001)
    y = np.clip(ys + dy, 0, h - 1.001)
    x0 = np.floor(x).astype(int)
    y0 = np.floor(y).astype(int)
    fx = x - x0
    fy = y - y0
    a = img[y0, x0] * (1 - fx) + img[y0, x0 + 1] * fx
    b = img[y0 + 1, x0] * (1 - fx) + img[y0 + 1, x0 + 1] * fx
    return a * (1 - fy) + b * fy


def norm01(x, lo=1, hi=99):
    a, b = np.percentile(x, [lo, hi])
    return np.clip((x - a) / max(b - a, 1e-9), 0, 1)


# ------------------------------------------------------------------ the plate prior (the hand-traced outlines)
def plate_prior(plates, W, H, ppmm, height=2.4, boss=3.0):
    """traced plates → a smooth height prior (mm), image rows top-down. Shoulder ≈ 0.9 mm via a blur."""
    im = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(im)
    P = lambda pts: [(x * ppmm, (plates['height'] - y) * ppmm) for x, y in pts]
    for p in plates['plates']:
        d.polygon(P(p['outer']), fill=255)
        for h in p.get('holes') or []:
            d.polygon(P(h), fill=0)
    m = np.asarray(im, float) / 255
    s = gblur(m, 0.45 * ppmm)
    z = height * np.clip((s - 0.15) / 0.7, 0, 1) ** 0.8
    ys, xs = np.mgrid[0:H, 0:W].astype(float)
    for b in plates.get('bosses') or []:
        cx, cy, r = b['c'][0] * ppmm, (plates['height'] - b['c'][1]) * ppmm, b['r'] * ppmm
        rr = np.hypot(xs - cx, ys - cy) / r
        dome = boss * np.sqrt(np.clip(1 - rr ** 2, 0, 1)) ** 0.6
        if b.get('hole'):
            hr = b['hole'] * ppmm / r
            dome -= 1.4 * np.clip(1 - (rr / hr) ** 2, 0, 1) ** 0.5
        z = np.where(rr < 1, np.maximum(z, dome), z)
    return z, m


# ------------------------------------------------------------------ registration
def phase_shift(a, b):
    """integer+subpixel shift d such that b(x) ≈ a(x + d) (phase correlation)."""
    win = np.outer(np.hanning(a.shape[0]), np.hanning(a.shape[1]))
    A = np.fft.fft2((a - a.mean()) * win)
    B = np.fft.fft2((b - b.mean()) * win)
    R = A * np.conj(B)
    R /= np.abs(R) + 1e-9
    c = np.real(np.fft.ifft2(R))
    iy, ix = np.unravel_index(np.argmax(c), c.shape)
    h, w = c.shape

    def sub(cm, c0, cp):
        den = cm - 2 * c0 + cp
        return 0.5 * (cm - cp) / den if abs(den) > 1e-12 else 0

    dy = iy + sub(c[(iy - 1) % h, ix], c[iy, ix], c[(iy + 1) % h, ix])
    dx = ix + sub(c[iy, (ix - 1) % w], c[iy, ix], c[iy, (ix + 1) % w])
    if dy > h / 2:
        dy -= h
    if dx > w / 2:
        dx -= w
    return dx, dy, c.max()


def register_mirror(R, M, valid, ppmm, search_mm=4.0, win_mm=8.0):
    """dense field (dx, dy) so that M sampled at (x + dx, y + dy) ≈ R: windowed NCC over every integer shift
    at half resolution (σ = win_mm windows), the best shift per pixel, then smoothed."""
    def half(a):
        h, w = a.shape[0] // 2 * 2, a.shape[1] // 2 * 2
        return a[:h, :w].reshape(h // 2, 2, w // 2, 2).mean((1, 3))
    r, m, v = half(gblur(R, 0.4 * ppmm)), half(gblur(M, 0.4 * ppmm)), half(valid)
    hp = ppmm / 2
    S = int(round(search_mm * hp))
    s = win_mm * hp / 2
    rz = (r - gblur(r, s)) * v
    rr = gblur(rz * rz, s) + 1e-6
    best = np.full(r.shape, -2.0)
    bx = np.zeros(r.shape)
    by = np.zeros(r.shape)
    H, W = r.shape
    mp = np.pad(m, S, mode='edge')
    vp = np.pad(v, S, mode='constant')
    for dy in range(-S, S + 1):
        for dx in range(-S, S + 1):
            ms = mp[S + dy:S + dy + H, S + dx:S + dx + W]
            vs = vp[S + dy:S + dy + H, S + dx:S + dx + W] * v
            mz = (ms - gblur(ms, s)) * vs
            ncc = gblur(rz * mz, s) / np.sqrt(rr * (gblur(mz * mz, s) + 1e-6))
            ncc -= 0.002 * (dx * dx + dy * dy) / S  # a weak pull toward no shift
            u = ncc > best
            best[u] = ncc[u]
            bx[u] = dx
            by[u] = dy
    conf = np.clip(best, 0, None) ** 2 * v + 1e-4
    sm = 2 * s
    fx = gblur(bx * conf, sm) / gblur(conf, sm)
    fy = gblur(by * conf, sm) / gblur(conf, sm)
    up = lambda a: np.asarray(Image.fromarray(a.astype(np.float32), mode='F').resize((R.shape[1], R.shape[0]), Image.BILINEAR)) * 2
    FX, FY = up(fx), up(fy)
    sel = v > 0.5
    return FX, FY, (float(np.median(bx[sel]) * 2), float(np.median(by[sel]) * 2), float(np.median(best[sel])), float(np.std(fx[sel]) * 2), float(np.std(fy[sel]) * 2))


# ------------------------------------------------------------------ integration
def dx_(z):
    g = np.zeros_like(z)
    g[:, :-1] = z[:, 1:] - z[:, :-1]
    return g


def dy_(z):
    g = np.zeros_like(z)
    g[:-1] = z[1:] - z[:-1]
    return g


def dxT(g):
    o = np.zeros_like(g)
    o[:, 1:] += g[:, :-1]
    o[:, :-1] -= g[:, :-1]
    return o


def dyT(g):
    o = np.zeros_like(g)
    o[1:] += g[:-1]
    o[:-1] -= g[:-1]
    return o


def solve(terms, eps, mu, prior, z0=None, iters=400):
    """eps: scalar or (eps_x, eps_y): smoothness ACROSS the light (x) may be much stronger than along it."""
    ex, ey = (eps, eps) if np.isscalar(eps) else eps
    """minimise Σ_j w_j (a_j Dx z + b_j Dy z − q_j)² + eps |∇z|² + mu (z − prior)² by conjugate gradients."""
    def A(z):
        gx, gy = dx_(z), dy_(z)
        out = ex * dxT(gx) + ey * dyT(gy) + mu * z
        for a, b, w, q in terms:
            r = w * (a * gx + b * gy)
            out += a * dxT(r) + b * dyT(r)
        return out

    rhs = mu * prior
    for a, b, w, q in terms:
        r = w * q
        rhs = rhs + a * dxT(r) + b * dyT(r)
    z = prior.copy() if z0 is None else z0.copy()
    r = rhs - A(z)
    p = r.copy()
    rs = (r * r).sum()
    rs0 = rs
    for i in range(iters):
        Ap = A(p)
        al = rs / (p * Ap).sum()
        z += al * p
        r -= al * Ap
        rn = (r * r).sum()
        if rn < 1e-10 * rs0:
            break
        p = r + (rn / rs) * p
        rs = rn
    return z


def relight(z, ppmm, light, amb=0.15):
    """Lambert shading of height z (mm, rows top-down) under a light (x right, y UP, z out of the face)."""
    gx = np.gradient(z, axis=1) * ppmm
    gy = -np.gradient(z, axis=0) * ppmm
    n = np.dstack([-gx, -gy, np.ones_like(z)])
    n /= np.linalg.norm(n, axis=2, keepdims=True)
    l = np.asarray(light, float)
    l /= np.linalg.norm(l)
    return np.clip(amb + (1 - amb) * np.clip(n @ l, 0, 1), 0, 1)


# ------------------------------------------------------------------ main
def derive(vid, face, out):
    fdir = os.path.join(PKG, 'reference', vid, 'faces')
    plates = json.load(open(os.path.join(fdir, face + '.plates.json')))
    rgb = np.asarray(Image.open(os.path.join(fdir, face + '.jpg')).convert('RGB')).astype(float) / 255
    H, W = rgb.shape[:2]
    ppmm = W / plates['width']
    axis = plates['axis'] * ppmm  # px
    lin = rgb ** 2.2
    Y = 0.2126 * lin[..., 0] + 0.7152 * lin[..., 1] + 0.0722 * lin[..., 2]

    # 1. log luminance, flattened and contrast-normalised over 10 mm
    L = np.log(Y + 0.004)
    big = 10 * ppmm
    m = gblur(L, big)
    q = L - m
    sd = np.sqrt(gblur(q * q, big)) + 1e-3
    q = q / sd
    q = gblur(q, 0.2 * ppmm)  # the photograph is ≈ 3.6 px/mm upsampled to 6: nothing real below that

    # field validity (no flange, no corners, no top plain band edge effects)
    ys, xs = np.mgrid[0:H, 0:W].astype(float)
    xmm, ymm = xs / ppmm, plates['height'] - ys / ppmm
    fb = plates['field']['box']
    valid = ((xmm > fb[0]) & (xmm < fb[2]) & (ymm > fb[1]) & (ymm < fb[3])).astype(float)
    for mk in plates.get('mask') or []:
        if 'box' in mk:
            b = mk['box']
            valid[(xmm > b[0] - 1) & (xmm < b[2] + 1) & (ymm > b[1]) & (ymm < b[3])] = 0
        else:
            im = Image.new('L', (W, H), 0)
            ImageDraw.Draw(im).polygon([(x * ppmm, (plates['height'] - y) * ppmm) for x, y in mk['poly']], fill=255)
            valid[np.asarray(im) > 0] = 0

    prior, pmask = plate_prior(plates, W, H, ppmm)

    # work on the right half (axis → right edge); its mirror image is the left half flipped about the axis
    x0 = int(round(axis))
    w2 = W - x0
    R = q[:, x0:]
    Rv = valid[:, x0:]
    # mirrored left half: column x0 + i  ↔  column x0 − 1 − i (centre of the pixel grid symmetric about axis)
    idx = np.clip(2 * x0 - 1 - np.arange(x0, W), 0, W - 1)
    Mq = q[:, idx]
    Mv = valid[:, idx] * (np.arange(x0, W)[None, :] * 0 + (2 * x0 - 1 - np.arange(x0, W) >= 0))
    cache = os.path.join(out, face + '-mirrorfield.npy')
    if os.path.exists(cache) and '--fresh' not in sys.argv:
        fx, fy = np.load(cache)
        reg = (np.median(fx), np.median(fy), float('nan'), np.std(fx), np.std(fy))
    else:
        fx, fy, reg = register_mirror(R, Mq, Rv * Mv, ppmm)
        os.makedirs(out, exist_ok=True)
        np.save(cache, np.stack([fx, fy]))
    Mq = shift_bilinear(Mq, fx, fy)
    Mv = shift_bilinear(Mv, fx, fy)
    print(f'  mirror: median shift {reg[0]:.1f}, {reg[1]:.1f} px, median NCC {reg[2]:.2f}, field sd {reg[3]:.2f} / {reg[4]:.2f} px')
    Rprior = prior[:, x0:]

    # 3. light direction + gain from the prior: q ≈ a·Dx z + b·Dy z (z blurred like the photo)
    ps = gblur(Rprior, 0.5 * ppmm)
    gxp, gyp = dx_(ps), dy_(ps)

    def fit(qh, v):
        sel = (v > 0.5) & ((np.abs(gxp) + np.abs(gyp)) > 0.02)
        A = np.c_[gxp[sel], gyp[sel]]
        a, b = np.linalg.lstsq(A, qh[sel], rcond=None)[0]
        pred = A @ [a, b]
        cc = np.corrcoef(pred, qh[sel])[0, 1]
        return a, b, cc

    aR, bR, cR = fit(R, Rv)
    aM, bM, cM = fit(Mq, Rv * Mv)
    angR = np.degrees(np.arctan2(bR, -aR))
    angM = np.degrees(np.arctan2(bM, aM))  # mirrored back
    print(f'  light (in-plane, 0 right / 90 up): right half {angR:.0f}°  gain {np.hypot(aR, bR):.2f}/px  r={cR:.2f}; '
          f'mirrored left {angM:.0f}°  gain {np.hypot(aM, bM):.2f}  r={cM:.2f}')

    # 4. robust weights
    Yr = Y[:, x0:]
    Ym = shift_bilinear(Y[:, idx], fx, fy)
    s = lin.sum(2) + 1e-4
    chrom = np.dstack([lin[..., 0] / s, lin[..., 1] / s])
    med = np.median(chrom[valid > 0.5], axis=0)
    cdev = np.hypot(chrom[..., 0] - med[0], chrom[..., 1] - med[1])
    cdev = gblur(cdev * (Y > 0.03), 1.0 * ppmm)  # chroma is meaningless in deep shadow (and blocky: JPEG)
    ctr = np.percentile(cdev[valid > 0.5], 90)

    def weight(Yh, cd):
        w = np.ones_like(Yh)
        if not CUES['weights']:
            return w
        w *= np.clip((0.92 - Yh) / 0.25, 0.05, 1)  # glare
        w *= np.clip(Yh / 0.004, 0.2, 1)  # crushed black: slope sign known, magnitude not
        w *= np.exp(-np.clip(cd - ctr, 0, None) ** 2 / (0.03 ** 2))  # crust / colour patches
        return w

    wR = weight(Yr, cdev[:, x0:]) * Rv
    wM = weight(Ym, shift_bilinear(cdev[:, idx], fx, fy)) * Rv * Mv
    if CUES['mirror']:
        # disagreement at 1.5 mm after removing what the two lights legitimately differ by
        dis = gblur(np.abs((R / max(np.hypot(aR, bR), 1e-6)) - (Mq / max(np.hypot(aM, bM), 1e-6))), 1.5 * ppmm)
        dthr = np.percentile(dis[Rv > 0.5], 70)
        k = np.exp(-np.clip(dis - dthr, 0, None) ** 2 / (0.5 * dthr) ** 2)
        # the half closer to the prior-free consensus keeps its weight: halve both where they disagree
        wR = wR * (0.5 + 0.5 * k)
        wM = wM * (0.5 + 0.5 * k)
    else:
        wM = wM * 0

    sel = Rv > 0.5
    lp = lambda x: gblur(x, 1.0 * ppmm)
    agree = lambda z: float(np.corrcoef(lp(z)[sel], lp(Rprior)[sel])[0, 1])

    # 6 (first, the integrator wants it). micro: darker than its 0.8 mm neighbourhood. Grooves, incised lines and
    # the leiwen are dark in the photograph whatever the light (occlusion + the dirt in them), so this is read
    # ISOTROPICALLY, not as a slope. Own half; the mirrored half where the right half is glare.
    def dark_of(Lh, a, b):
        loc = gblur(Lh, a * ppmm) - gblur(Lh, b * ppmm)
        loc = loc / (np.sqrt(gblur(loc * loc, 3 * ppmm)) + 1e-3)
        return np.clip(-loc, 0, 2.5) / 2.5

    LR = L[:, x0:]
    LM = shift_bilinear(L[:, idx], fx, fy)
    glare = gblur(np.clip((Yr - 0.75) / 0.2, 0, 1), 0.6 * ppmm)
    micro = dark_of(LR, 0.18, 0.8) * (1 - glare) + dark_of(LM, 0.18, 0.8) * glare
    micro = gblur(micro, 0.1 * ppmm) if CUES['micro'] else micro * 0
    dR = dark_of(LR, 0.18, 0.8)
    dM = dark_of(LM, 0.18, 0.8)

    # 5. PURE: integrate the shading along the light (direction from the regression, gains normalised so both
    # halves count alike). Darkness that is not slope (grooves, a darker ground) would integrate into ramps and
    # streaks, so the dark-line measure is added back before integrating. A 30 mm high-pass (mu) and a strong
    # smoothness ACROSS the light (eps_x): with the key straight overhead nothing in the photograph says how a
    # vertical edge rises, so the integrator is told to leave x alone rather than invent streaks.
    nR, nM = np.hypot(aR, bR), np.hypot(aM, bM)
    terms = [(aR / nR, bR / nR, wR, R + 0.5 * dR), (aM / nM, bM / nM, wM, Mq + 0.5 * dM)]
    terms = [(a_, b_, w_, q_ - (q_ * w_)[sel].sum() / max(w_[sel].sum(), 1e-6)) for a_, b_, w_, q_ in terms]
    pure = solve(terms, (EPS_X, 0.02), mu=1 / (LAM_PURE * ppmm) ** 2, prior=np.zeros_like(R), z0=np.zeros_like(R), iters=400)
    pure -= gblur(pure, LAM_PURE * ppmm)
    # absolute scale: the photograph has no unit of height. Set the 2–98 % span of the macro relief to the plates'
    # 2.4 mm + a bit (what the vessel's plates and bosses stand, per the dossier) — a calibration, not a fit
    zl = lp(pure)[sel]
    k = PURE_SPAN / max(np.percentile(zl, 98) - np.percentile(zl, 2), 1e-6)
    pure = k * pure
    gm = (pmask[:, x0:] < 0.05) & sel
    pure -= np.median(pure[gm]) if gm.any() else np.median(pure[sel])
    print(f'  pure: agreement with the traced layout (corr of 1 mm low-pass) {agree(pure):.2f}')

    # HYBRID: the drawn plates give WHERE (layout and heights), the photograph gives the edges' exact course and
    # every line on the tops and in the ground.
    #  (a) warp the drawing onto the photograph: dense windowed NCC between the drawing's ground and the
    #      photograph's broad dark (channels + cast shadows under the plates), ±2 mm, 10 mm windows
    d2 = dark_of(LR, 0.5, 2.5)
    gnd = 1 - gblur(pmask[:, x0:], 0.5 * ppmm)
    if CUES['warp']:
        wx, wy, wreg = register_mirror(d2, gnd, Rv, ppmm, search_mm=2.0, win_mm=10.0)
    else:
        wx, wy, wreg = np.zeros_like(R), np.zeros_like(R), (0, 0, float('nan'), 0, 0)
    mW = shift_bilinear(pmask[:, x0:], wx, wy)
    pW = shift_bilinear(Rprior, wx, wy)
    print(f'  hybrid warp: median {wreg[0] / ppmm:.2f}, {wreg[1] / ppmm:.2f} mm, NCC {wreg[2]:.2f}, sd {wreg[3] / ppmm:.2f} / {wreg[4] / ppmm:.2f} mm')
    #  (b) snap each edge within ≈ ±0.7 mm onto the photograph: where the soft mask is undecided, the broad dark
    #      votes ground and the absence of it votes plate
    mb = gblur(mW, 0.7 * ppmm)
    ev = d2 - np.median(d2[sel])
    sm = np.clip((mb - 0.5 - (SNAP * ev if CUES['snap'] else 0)) * 2.5 + 0.5, 0, 1)
    sm = gblur(sm, 0.25 * ppmm)
    plate = 2.4 * (sm * sm * (3 - 2 * sm)) + 0.25 * gblur(sm, 1.5 * ppmm) ** 2 * sm
    boss = np.where(pW > 2.45, pW, 0)  # the bosses (domes above the plate level), warped with the drawing
    hyb = np.maximum(plate, boss)
    #  (c) the photograph's mid-scale relief (the pure solution above 1.5 mm removed) as a modulation of the tops
    hyb = hyb + MID * (pure - gblur(pure, 1.5 * ppmm))
    print(f'  hybrid: agreement with the traced layout {agree(hyb):.2f}')
    micro = micro * MICRO_DEPTH

    pure_f = pure - micro
    hyb_f = hyb - micro
    for z in (pure_f, hyb_f):
        z[Rv < 0.5] = np.where(Rprior[Rv < 0.5] > 0, Rprior[Rv < 0.5], 0)  # outside the field: the prior
    os.makedirs(out, exist_ok=True)
    np.save(os.path.join(out, face + '-pure.npy'), pure_f.astype(np.float32))
    np.save(os.path.join(out, face + '-hybrid.npy'), hyb_f.astype(np.float32))
    np.save(os.path.join(out, face + '-drawn.npy'), Rprior.astype(np.float32))

    # sheet: per row photo | height | relit upper-left grazing | relit lower-right (NOT the museum light)
    photo = (np.asarray(Image.open(os.path.join(fdir, face + '.jpg')).convert('L'), float) / 255)[:, x0:]
    rows = []
    for name, z in (('drawn prior', Rprior), ('pure photo', pure_f), ('hybrid', hyb_f)):
        hz = norm01(z, 0.5, 99.5)
        rows.append(np.hstack([photo, hz, relight(z, ppmm, [-1, 0.25, 0.7]), relight(z, ppmm, [0.8, -0.6, 0.8])]))
        print(f'  {name}: {np.percentile(z[sel], 1):.2f} … {np.percentile(z[sel], 99):.2f} mm')
    sheet = np.vstack(rows)
    Image.fromarray((sheet * 255).astype(np.uint8)).save(os.path.join(out, face + '-sheet.jpg'), quality=88)
    return dict(ppmm=ppmm, axis=plates['axis'], width=plates['width'], height=plates['height'], hybrid=hyb_f, pure=pure_f, field=fb)


def ship(vid, face, res, which='hybrid'):
    """the right half, resampled to SHIP_PPMM, 16-bit greyscale PNG + json (no metadata)."""
    z = res[which]
    ppmm = res['ppmm']
    wmm = res['width'] - res['axis']
    hmm = res['height']
    W2, H2 = int(round(wmm * SHIP_PPMM)), int(round(hmm * SHIP_PPMM))
    zi = np.asarray(Image.fromarray(z.astype(np.float32), mode='F').resize((W2, H2), Image.BILINEAR if SHIP_PPMM >= ppmm else Image.BOX))
    zi = zi[::-1].copy()  # row 0 = bottom (the ReliefPanel convention)
    lo, hi = float(zi.min()), float(zi.max())
    u16 = np.round((zi - lo) / (hi - lo) * 65535).astype('>u2')
    base = os.path.join(PKG, 'reference', vid, 'faces', f'{face}.height-{which}')
    Image.frombytes('I;16B', (W2, H2), u16.tobytes()).save(base + '.png', optimize=True)
    meta = {
        'face': face, 'vessel': vid, 'variant': which,
        'note': 'tools/photoheight.py: relief height derived from the flattened photograph (mirror-registered halves, '
                'two-light shading integration on the traced-plate prior, dark-line micro relief). RIGHT half only: '
                'x from the axis (0) to the face edge; mirror for the left half. Rows bottom-up (row 0 = y 0).',
        'width': round(wmm, 3), 'height': hmm, 'ppmm': SHIP_PPMM, 'cols': W2, 'rows': H2,
        'min': round(lo, 4), 'max': round(hi, 4), 'field': res['field'], 'axis': res['axis'],
    }
    json.dump(meta, open(base + '.json', 'w'), indent=1)
    print(f'  shipped {base}.png  {W2}×{H2}  {os.path.getsize(base + ".png") / 1024:.0f} kB  [{lo:.2f}, {hi:.2f}] mm')


if __name__ == '__main__':
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    vid, face = args[0], args[1]
    out = os.path.join(PKG, '.work', 'photo', 'height')
    if '--out' in sys.argv:
        out = sys.argv[sys.argv.index('--out') + 1]
    for c in list(CUES):
        if '--no-' + c in sys.argv:
            CUES[c] = False
    r = derive(vid, face, out)
    if '--ship' in sys.argv:
        for which in ('hybrid', 'pure'):
            ship(vid, face, r, which)
