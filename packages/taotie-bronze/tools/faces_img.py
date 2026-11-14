#!/usr/bin/env python3
"""Image half of tools/faces.mjs (PIL + numpy only). Not meant to be run by hand.

  faces_img.py rectify  <faces.json> <out dir> <originals dir> [face …]
      warp each face's photograph to a head-on image at `ppmm` (see KIT.md § Flat faces); prints
      one JSON line per face: {"face", "w", "h", "ppmm", "rms_mm", "max_mm", "src"}
  faces_img.py compare  <flat.jpg> <clay.png> <height.png> <out.jpg> <title> [ppmm] [blur mm]
      writes photo | model clay | overlay and prints {"ncc": …}
  faces_img.py sheet    <out.jpg> <title> <compare.jpg> …
"""
import json
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFont

Image.MAX_IMAGE_PIXELS = None


# ------------------------------------------------------------------ geometry
def unit(v):
    v = np.asarray(v, float)
    return v / np.linalg.norm(v)


def frame(face):
    """(c, right, up, n) of a face plane, vessel mm. right = up × n: u runs left → right seen from outside."""
    n = unit(face['normal'])
    up = np.asarray(face.get('up', [0, 1, 0]), float)
    up = unit(up - np.dot(up, n) * n)
    right = np.cross(up, n)
    return np.asarray(face['center'], float), right, up, n


def to_uv(face, xyz):
    c, r, u, n = frame(face)
    d = np.asarray(xyz, float) - c
    return float(d @ r), float(d @ u), float(d @ n)


def homography(src, dst):
    """DLT, least squares (≥ 4 pairs, Hartley-normalised): dst ~ H · src."""
    src = np.asarray(src, float)
    dst = np.asarray(dst, float)

    def norm(p):
        m = p.mean(0)
        s = np.sqrt(2) / max(1e-9, np.sqrt(((p - m) ** 2).sum(1)).mean())
        T = np.array([[s, 0, -s * m[0]], [0, s, -s * m[1]], [0, 0, 1]])
        return T, (np.c_[p, np.ones(len(p))] @ T.T)[:, :2]

    Ts, a = norm(src)
    Td, b = norm(dst)
    A = []
    for (x, y), (X, Y) in zip(a, b):
        A.append([-x, -y, -1, 0, 0, 0, X * x, X * y, X])
        A.append([0, 0, 0, -x, -y, -1, Y * x, Y * y, Y])
    _, _, vt = np.linalg.svd(np.asarray(A))
    H = vt[-1].reshape(3, 3)
    H = np.linalg.inv(Td) @ H @ Ts
    return H / H[2, 2]


def apply_h(H, pts):
    p = np.c_[np.asarray(pts, float), np.ones(len(pts))] @ H.T
    return p[:, :2] / p[:, 2:3]


def sample_bilinear(img, xs, ys):
    """img HxWxC float; xs, ys arrays (any shape) of pixel coords (pixel centres at integers)."""
    h, w = img.shape[:2]
    inside = (xs >= -0.5) & (xs <= w - 0.5) & (ys >= -0.5) & (ys <= h - 0.5)
    x = np.clip(xs, 0, w - 1.000001)
    y = np.clip(ys, 0, h - 1.000001)
    x0 = np.floor(x).astype(int)
    y0 = np.floor(y).astype(int)
    fx = (x - x0)[..., None]
    fy = (y - y0)[..., None]
    a = img[y0, x0] * (1 - fx) + img[y0, x0 + 1] * fx
    b = img[y0 + 1, x0] * (1 - fx) + img[y0 + 1, x0 + 1] * fx
    out = a * (1 - fy) + b * fy
    return out, inside


# ------------------------------------------------------------------ rectify
def load_source(ref_dir, originals, src):
    """→ (PIL image, scale, offset): photo px = original px × scale − offset."""
    orig = src.get('original')
    if orig:
        name = os.path.basename(orig.split('?')[0])
        p = os.path.join(originals, name)
        if os.path.exists(p):
            return Image.open(p).convert('RGB'), 1.0, (0.0, 0.0), p
    p = os.path.join(ref_dir, src['file'])
    im = Image.open(p).convert('RGB')
    size = src.get('size') or [im.width, im.height]
    scale = src.get('fileScale') or im.width / size[0]
    off = src.get('fileOffset') or [0, 0]
    return im, scale, (off[0] * scale, off[1] * scale), p


def face_points(data, name, seen=()):
    f = data['faces'][name]
    pts = f['points']
    if isinstance(pts, str):
        if pts in seen:
            raise SystemExit(f'points of {name}: reference loop')
        return face_points(data, pts, seen + (name,))
    return pts


def rectify(faces_json, out_dir, originals, only):
    data = json.load(open(faces_json))
    ref_dir = os.path.dirname(os.path.abspath(faces_json))
    os.makedirs(out_dir, exist_ok=True)
    cache = {}
    for name, f in data['faces'].items():
        if only and name not in only:
            continue
        sid = f['source']
        src = data['sources'][sid]
        if sid not in cache:
            im, scale, off, path = load_source(ref_dir, originals, src)
            cache[sid] = (np.asarray(im, dtype=np.float32), scale, off, path)
        img, scale, off, path = cache[sid]
        pts = face_points(data, name)
        if f.get('flat'):
            # an already flat image (a rubbing): points are [px, py, u, v] straight in face mm
            uv = np.array([[p[2], p[3]] for p in pts], float)
            depth = np.zeros(len(pts))
        else:
            uvd = np.array([to_uv(f, p[2:5]) for p in pts], float)
            uv, depth = uvd[:, :2], uvd[:, 2]
        px = np.array([[p[0] * scale - off[0], p[1] * scale - off[1]] for p in pts], float)
        H = homography(uv, px)  # face mm → photo px
        # residual, in mm on the face: map photo px back through the inverse
        back = apply_h(np.linalg.inv(H), px)
        err = np.sqrt(((back - uv) ** 2).sum(1))
        ppmm = float(f.get('ppmm', 8))
        W = int(round(f['width'] * ppmm))
        Hh = int(round(f['height'] * ppmm))
        cap = int(f.get('maxSide', 2400))
        if max(W, Hh) > cap:
            k = cap / max(W, Hh)
            ppmm *= k
            W = int(round(f['width'] * ppmm))
            Hh = int(round(f['height'] * ppmm))
        # output pixel centres → face mm (u right, v up, origin at the face centre)
        xs = (np.arange(W) + 0.5) / W * f['width'] - f['width'] / 2
        ys = f['height'] / 2 - (np.arange(Hh) + 0.5) / Hh * f['height']
        U, V = np.meshgrid(xs, ys)
        # source px per output px: supersample when the warp shrinks the photo (> 1.4 px per px)
        J = apply_h(H, [[0, 0], [1 / ppmm, 0], [0, 1 / ppmm]])
        sp = max(np.linalg.norm(J[1] - J[0]), np.linalg.norm(J[2] - J[0]))
        ss = int(min(4, max(1, np.ceil(sp / 1.4))))
        acc = np.zeros((Hh, W, 3), np.float32)
        for i in range(ss):
            for j in range(ss):
                du = ((i + 0.5) / ss - 0.5) / ppmm
                dv = ((j + 0.5) / ss - 0.5) / ppmm
                q = np.stack([U.ravel() + du, V.ravel() + dv], 1)
                p = apply_h(H, q) - 0.5  # PIL pixel centres sit at +0.5
                val, inside = sample_bilinear(img, p[:, 0].reshape(U.shape), p[:, 1].reshape(U.shape))
                val[~inside] = 24
                acc += val
        acc /= ss * ss
        out = os.path.join(out_dir, name + '.jpg')
        Image.fromarray(np.clip(acc + 0.5, 0, 255).astype(np.uint8)).save(out, quality=int(f.get('quality', 88)), optimize=True)
        src_ppmm = sp * ppmm
        print(json.dumps({'face': name, 'w': W, 'h': Hh, 'ppmm': round(ppmm, 3), 'srcPpmm': round(float(src_ppmm), 2),
                          'rms_mm': round(float(np.sqrt((err ** 2).mean())), 2), 'max_mm': round(float(err.max()), 2),
                          'offPlane_mm': round(float(np.abs(depth).max()), 1), 'points': len(pts),
                          'perPoint_mm': [round(float(e), 2) for e in err], 'src': os.path.basename(path)}))


# ------------------------------------------------------------------ compare
def blur(a, sigma):
    """≈ gaussian: three box passes (separable, cumulative sums)."""
    if sigma <= 0.3:
        return a
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


def grad(a):
    gx = np.zeros_like(a)
    gy = np.zeros_like(a)
    gx[:, 1:-1] = a[:, 2:] - a[:, :-2]
    gy[1:-1] = a[2:] - a[:-2]
    return np.hypot(gx, gy)


def lum(im):
    a = np.asarray(im.convert('RGB'), np.float32) / 255
    return 0.2126 * a[..., 0] + 0.7152 * a[..., 1] + 0.0722 * a[..., 2]


def font(size):
    try:
        return ImageFont.load_default(size=size)
    except TypeError:
        return ImageFont.load_default()


def label(im, text, size=22):
    d = ImageDraw.Draw(im, 'RGBA')
    f = font(size)
    box = d.textbbox((0, 0), text, font=f)
    d.rectangle([0, 0, box[2] + 20, box[3] + 14], fill=(15, 14, 12, 200))
    d.text((10, 6), text, font=f, fill=(233, 226, 212))


def compare(flat_p, clay_p, height_p, out_p, title, ppmm='8', blur_mm='0.5'):
    photo = Image.open(flat_p).convert('RGB')
    W, H = photo.size
    clay = Image.open(clay_p).convert('RGB').resize((W, H), Image.LANCZOS)
    hgt = Image.open(height_p).convert('RGB').resize((W, H), Image.LANCZOS)
    # blur in mm, ABOVE the leiwen pitch: the comparison is about motif outlines, not ground texture
    # (the model's leiwen is far more contrasty than the photographed one and swamps a fine-scale NCC)
    s1 = max(0.8, float(blur_mm) * float(ppmm))
    s2 = 2 * s1
    L = lum(photo)
    hh = lum(hgt)
    gp = blur(grad(blur(L, s1)), s2)
    gm = blur(grad(blur(hh, s1)), s2)
    # where both images have something: model content (height > 0) and photo inside the warp (not the 24 fill)
    mask = (blur((hh > 0.02).astype(np.float32), 2) > 0.5) & (np.abs(L - 24 / 255) > 0.01)
    if mask.sum() < 100:
        ncc = float('nan')
    else:
        a = gp[mask] - gp[mask].mean()
        b = gm[mask] - gm[mask].mean()
        ncc = float((a * b).sum() / max(1e-12, np.sqrt((a * a).sum() * (b * b).sum())))
    # overlay: desaturated, darkened photo + the model's relief edges in saturated magenta
    e = grad(blur(hh, 0.7))
    thr = np.percentile(e[e > 1e-4], 75) if (e > 1e-4).sum() > 100 else 1
    edge = np.clip((e - thr * 0.6) / max(1e-6, thr * 0.8), 0, 1)
    base = (L * 0.72 + 0.06)[..., None].repeat(3, 2)
    col = np.array([1.0, 0.12, 0.78], np.float32)
    ov = base * (1 - edge[..., None]) + col * edge[..., None]
    overlay = Image.fromarray(np.clip(ov * 255 + 0.5, 0, 255).astype(np.uint8))
    for im, t in ((photo, 'photograph, flattened'), (clay, 'model · clay'), (overlay, 'model relief edges over the photograph')):
        label(im, t, max(14, W // 50))
    gap = 8
    head = max(34, W // 28)
    sheet = Image.new('RGB', (W * 3 + gap * 4, H + gap * 2 + head), (15, 14, 12))
    for i, im in enumerate((photo, clay, overlay)):
        sheet.paste(im, (gap + i * (W + gap), head + gap))
    d = ImageDraw.Draw(sheet)
    d.text((gap, 6), f'{title}   ·   similarity {ncc:.3f} (NCC of gradient magnitude, blur {float(blur_mm):g} mm)', font=font(max(16, head - 14)), fill=(233, 226, 212))
    sheet.save(out_p, quality=88)
    print(json.dumps({'ncc': round(ncc, 4), 'w': W, 'h': H}))


def sheet(out_p, title, files):
    ims = [Image.open(f).convert('RGB') for f in files if os.path.exists(f)]
    if not ims:
        return
    TW = 2400
    rows = []
    for im in ims:
        k = TW / im.width
        rows.append(im.resize((TW, max(1, int(im.height * k))), Image.LANCZOS))
    head = 50
    H = head + sum(r.height + 10 for r in rows)
    out = Image.new('RGB', (TW, H), (15, 14, 12))
    d = ImageDraw.Draw(out)
    d.text((12, 10), title, font=font(30), fill=(185, 174, 156))
    y = head
    for r in rows:
        out.paste(r, (0, y))
        y += r.height + 10
    # keep the sheet a sane size
    if out.height > 12000:
        k = 12000 / out.height
        out = out.resize((int(out.width * k), 12000), Image.LANCZOS)
    out.save(out_p, quality=85)


if __name__ == '__main__':
    cmd, *a = sys.argv[1:]
    if cmd == 'rectify':
        rectify(a[0], a[1], a[2], a[3:])
    elif cmd == 'compare':
        compare(*a[:7])
    elif cmd == 'sheet':
        sheet(a[0], a[1], a[2:])
    else:
        raise SystemExit(__doc__)
