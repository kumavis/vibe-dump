/**
 * The face screen in 3D: the midsagittal anatomy of the 2D view grown into a head you can turn,
 * drawn as glowing lines like everything else.
 *
 * The engine's anatomy is a midsagittal section, so width comes from three places:
 *  - the area function: each line of the airway's measuring grid has a gap and an area, which make
 *    an elliptical cross-section, so the 3D airway is exactly the tube the acoustics see;
 *  - the articulators' midline outlines, swept sideways with anatomical widths: the tongue and soft
 *    palate as ribbed surfaces, the lips as a patch whose opening is the engine's aperture and
 *    spreading;
 *  - fixed proportions for everything else (head, mandible, teeth, larynx, vertebrae, eyes, ears).
 * The jaw turns the mandible, the lower teeth and the lower face (skinned, so the cheeks stretch)
 * about the condyles; the larynx carries its cartilages and the hyoid.
 *
 * Body cm throughout: x forward, y up, z out of the right side of the face (towards the default
 * camera, which looks at the side view the 2D screen shows), glottis at the origin.
 */
import * as THREE from "three";
import type { HumanArtic, HumanFrame } from "../../wasm/types.ts";
import { NEUTRAL } from "../../wasm/engine.ts";
import type { TelemetryMessage } from "../../worklet/protocol.ts";
import type { VoiceModel } from "../analysis.ts";
import { V, heat, pressureLevel } from "../colors.ts";
import { catmullRom, rotateAbout, type Vec } from "./geom.ts";
import { chaikin, type Pt } from "./vector.ts";
import { Beams, Poly } from "./beams3d.ts";
import { bodyPoint, buildProfile, Gaze, jawAngle, wallX } from "./profile.ts";
import { faceHandles, type FaceView, type ViewFlags } from "./anatomy.ts";
import { Expression } from "./expression.ts";

type Table = readonly (readonly [number, number])[];
type V3 = [number, number, number];

const smooth = (a: number, b: number, x: number): number => {
  const t = Math.max(0, Math.min(1, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));

function interp(tab: Table, x: number): number {
  if (x <= tab[0][0]) return tab[0][1];
  for (let i = 1; i < tab.length; i++) {
    if (x <= tab[i][0]) {
      const [x0, y0] = tab[i - 1], [x1, y1] = tab[i];
      return y0 + ((y1 - y0) * (x - x0)) / (x1 - x0);
    }
  }
  return tab[tab.length - 1][1];
}

// ------------------------------------------------------------------ proportions
// template cm (the adult male, before the body's scale), by template height unless noted

/** half-width of the head and neck */
const WIDTH: Table = [[-4.6, 5.3], [0, 5.4], [2.5, 5.5], [4.5, 5.25], [6.5, 5.5], [8.5, 6.1], [10.5, 6.6], [12.5, 7.0], [15, 7.3], [17.5, 7.65], [19.5, 7.4], [21, 6.5], [22.2, 4.6], [23.0, 1.0]];
/** the face's surface beside the midline features (chin, lips, nose), as body x */
const PLANE: Table = [[3.4, 5.9], [4.6, 6.2], [5.7, 6.15], [6.5, 6.2], [8.0, 6.35], [9.5, 6.35], [10.6, 6.55], [11.6, 6.75], [12.6, 6.9], [13.9, 7.15], [15.0, 7.45], [16.1, 7.95]];
/** half-width of the midline feature: the chin, then the nose */
const FEATURE: Table = [[3.4, 2.0], [4.6, 2.2], [5.7, 2.4], [6.5, 2.6], [10.6, 1.7], [11.0, 1.75], [11.65, 1.2], [12.6, 0.95], [13.9, 0.75], [15.0, 0.9], [16.1, 1.6]];
/** where the head is widest, as a fraction of the way from the back to the face */
const WIDEST: Table = [[-4.6, 0.5], [3.0, 0.5], [6.0, 0.42], [12, 0.42], [16, 0.45], [23, 0.45]];
/** the jaw's lower border in the side view (x → y): the skin below it is the neck's */
const JAW_BORDER: Table = [[-3, 8.5], [-1.6, 8.0], [-0.6, 6.4], [1.2, 4.6], [3.5, 3.6], [5.3, 3.0], [7.3, 3.3], [8.6, 4.4]];
/** the back edge of the ramus (y → x): the skin behind it stays with the skull */
const RAMUS_BACK: Table = [[6.0, -0.6], [7.4, -0.8], [9.6, -1.9], [10.6, -2.5], [12, -2.6]];
const BRAIN_WIDTH: Table = [[12.3, 4.0], [13.0, 5.6], [14.5, 6.4], [16.5, 6.9], [18.5, 6.6], [20.0, 5.4], [21.0, 3.6], [21.45, 0.5]];
/** the tongue's half-width and how far its sides fall below the midline, root (0) to tip (1) */
const TONGUE_W: Table = [[0, 1.5], [0.15, 1.9], [0.35, 2.35], [0.6, 2.45], [0.8, 2.2], [0.92, 1.5], [1, 0.55]];
const TONGUE_H: Table = [[0, 1.3], [0.35, 1.1], [0.7, 0.9], [0.9, 0.55], [1, 0.25]];
/** teeth from the midline back, upper and lower: crown width along the arch, height, thickness */
const UPPER_TEETH = [[0.85, 1.05, 0.7], [0.68, 0.95, 0.65], [0.78, 1.1, 0.8], [0.7, 0.85, 0.9], [0.68, 0.8, 0.9], [1.0, 0.75, 1.1], [0.92, 0.7, 1.05]] as const;
const LOWER_TEETH = [[0.54, 0.9, 0.6], [0.6, 0.92, 0.62], [0.7, 1.0, 0.75], [0.7, 0.85, 0.8], [0.72, 0.8, 0.85], [1.1, 0.72, 1.05], [1.05, 0.7, 1.0]] as const;
/** the lips' patch reaches this far to each side (template cm), past the widest mouth */
const LIP_HALF = 3.0;
/** superellipse exponent of the back half of a cross-section */
const PB = 2.2;

/** a head (or brain) cross-section at one height: front and back on the midline, the bare front
 *  beside the midline feature, half-width, where it is widest, the feature's size and width, and
 *  the superellipse exponent of the front half (the back half uses PB) */
interface Section {
  F: number;
  Bk: number;
  Fs: number;
  W: number;
  xw: number;
  E: number;
  wf: number;
  pf: number;
}

const bump = (u: number) => (Math.abs(u) < 1 ? (1 - u * u) ** 2 : 0);

/** x of the front surface at lateral z (without the midline feature when bare) */
function frontX(s: Section, z: number, bare = false): number {
  const u = Math.min(1, Math.abs(z) / s.W);
  const c = Math.pow(1 - Math.pow(u, s.pf), 1 / s.pf);
  return s.xw + (s.Fs - s.xw) * c + (bare ? 0 : s.E * bump(z / s.wf));
}

/** half-width of the surface at x (for things on the side of the head) */
function sideZ(s: Section, x: number): number {
  const front = x > s.xw;
  const c = front ? (x - s.xw) / Math.max(1e-6, s.Fs - s.xw) : (s.xw - x) / Math.max(1e-6, s.xw - s.Bk);
  const p = front ? s.pf : PB;
  return s.W * Math.pow(Math.max(0, 1 - Math.pow(Math.min(1, c), p)), 1 / p);
}

/** one side of a cross-section, from the back (z = 0) round to the front (z = 0), as x, z pairs */
function halfRing(s: Section, zf: number, out: number[]): void {
  out.length = 0;
  const NB = 12, NF = 10, NP = 16;
  for (let i = 0; i < NB; i++) {
    const th = Math.PI - (i / NB) * (Math.PI / 2);
    out.push(s.xw - (s.xw - s.Bk) * Math.pow(Math.abs(Math.cos(th)), 2 / PB), s.W * Math.pow(Math.sin(th), 2 / PB));
  }
  const thf = Math.asin(Math.min(1, Math.pow(zf / s.W, s.pf / 2)));
  for (let i = 0; i < NF; i++) {
    const th = Math.PI / 2 - (i / NF) * (Math.PI / 2 - thf);
    const z = s.W * Math.pow(Math.sin(th), 2 / s.pf);
    out.push(s.xw + (s.Fs - s.xw) * Math.pow(Math.cos(th), 2 / s.pf) + s.E * bump(z / s.wf), z);
  }
  for (let i = 0; i <= NP; i++) {
    const z = zf * (1 - i / NP);
    out.push(frontX(s, z), z);
  }
}

/** A closed outline's cross-sections by height, tabulated (rest shapes are built once per body). */
class Shape {
  private readonly rows: (Section | null)[] = [];
  readonly y0: number;
  readonly y1: number;

  constructor(outline: Vec[], private readonly dy: number, make: (y: number, F: number, Bk: number) => Section) {
    let lo = Infinity, hi = -Infinity;
    for (const p of outline) {
      lo = Math.min(lo, p.y);
      hi = Math.max(hi, p.y);
    }
    this.y0 = lo;
    this.y1 = hi;
    for (let y = lo; y <= hi; y += dy) {
      let F = -Infinity, Bk = Infinity;
      for (let i = 0; i < outline.length - 1; i++) {
        const a = outline[i], b = outline[i + 1];
        if (a.y > y === b.y > y) continue;
        const x = a.x + ((b.x - a.x) * (y - a.y)) / (b.y - a.y);
        F = Math.max(F, x);
        Bk = Math.min(Bk, x);
      }
      this.rows.push(F > Bk ? make(y, F, Bk) : null);
    }
  }

  at(y: number): Section | null {
    const u = (y - this.y0) / this.dy;
    const i = Math.floor(u);
    if (i < 0 || i >= this.rows.length - 1) return null;
    const a = this.rows[i], b = this.rows[i + 1];
    if (!a || !b) return a ?? b;
    const t = u - i, l = (p: number, q: number) => p + (q - p) * t;
    return { F: l(a.F, b.F), Bk: l(a.Bk, b.Bk), Fs: l(a.Fs, b.Fs), W: l(a.W, b.W), xw: l(a.xw, b.xw), E: l(a.E, b.E), wf: l(a.wf, b.wf), pf: l(a.pf, b.pf) };
  }
}

/** polylines in flat xyz arrays */
class Lines {
  readonly lines: Float32Array[] = [];
  private cur: number[] = [];
  p(x: number, y: number, z: number): this {
    this.cur.push(x, y, z);
    return this;
  }
  end(close = false): void {
    if (close && this.cur.length >= 3) this.cur.push(this.cur[0], this.cur[1], this.cur[2]);
    if (this.cur.length >= 6) this.lines.push(new Float32Array(this.cur));
    this.cur = [];
  }
  /** an ellipse c + u·cos + v·sin from angle a0 to a1 */
  ellipse(c: V3, u: V3, v: V3, n = 24, a0 = 0, a1 = Math.PI * 2): void {
    for (let i = 0; i <= n; i++) {
      const an = a0 + ((a1 - a0) * i) / n, cs = Math.cos(an), sn = Math.sin(an);
      this.p(c[0] + u[0] * cs + v[0] * sn, c[1] + u[1] * cs + v[1] * sn, c[2] + u[2] * cs + v[2] * sn);
    }
    this.end();
  }
}

/** static lines in one style */
interface Group {
  lines: Float32Array[];
  color: string;
  width: number;
  alpha: number;
  hot?: boolean;
}

/** a polyline whose points the jaw carries by weight w (the lower face's skin), and the cheeks' puff by c */
interface Skinned {
  a: Float32Array;
  w: Float32Array;
  c: Float32Array;
}

/** everything that only depends on the body, in the rest pose (jaw closed) */
interface Rest {
  model: VoiceModel;
  head: Shape;
  condyle: Vec;
  /** the lips' patch reaches this far to each side (the shell leaves a hole for it) */
  lipHalf: number;
  center: THREE.Vector3;
  shell: Skinned[];
  fixed: Group[];
  /** carried by the jaw */
  jaw: Group[];
  /** the chin's midline outline (rest pose): part of the midsagittal section */
  chin: Float32Array;
  eyes: V3[];
  eyeR: number;
}

/** how much of the jaw's rotation a point of the face's skin follows (rest pose, body cm) */
function jawWeight(k: number, ph: number, x: number, y: number): number {
  const X = x / k, Yb = y / k;
  const Y = Yb >= 7 ? Yb : 7 - (7 - Yb) / ph;
  const wv = 1 - smooth(7.6, 9.1, Y); // the cheek above the mouth's corners stays with the skull
  const yb = interp(JAW_BORDER, X);
  const wl = smooth(yb - 1.5, yb + 0.15, Y); // the neck below the jaw stays
  const xr = interp(RAMUS_BACK, Y);
  const wb = smooth(xr - 0.7, xr + 0.9, X); // and behind the ramus, the ear and the back of the neck
  return wv * wl * wb;
}

/** how far the cheeks push out at full puff (template cm): to the side, and a little forward */
const PUFF_OUT = 1.7, PUFF_FWD = 0.55;

/**
 * How much of the cheeks' puff a point of the face's skin takes (rest pose, body cm): a mound
 * behind the mouth's corners, over the buccinators, fading out before the lips, the nose and
 * the jaw's lower border; the midline itself only comes forward.
 */
function cheekWeight(k: number, ph: number, x: number, y: number): number {
  const X = x / k, Yb = y / k;
  const Y = Yb >= 7 ? Yb : 7 - (7 - Yb) / ph;
  const r2 = ((X - 5.2) / 2.3) ** 2 + ((Y - 8.3) / 2.4) ** 2;
  return r2 < 1 ? (1 - r2) ** 2 : 0;
}

/** the cheeks' push at a point (rest pose): [dx, dz] for its weight c, side of the face z and the puff */
function puffAt(k: number, c: number, z: number, puff: number): [number, number] {
  if (c === 0 || puff === 0) return [0, 0];
  const m = c * puff * k;
  return [PUFF_FWD * m, Math.sign(z) * PUFF_OUT * m * smooth(0.4 * k, 2.6 * k, Math.abs(z))];
}

/** split a polyline (flat xyz) into the runs whose points are kept */
function keptRuns(pts: number[], keep: boolean[], closed: boolean): number[][] {
  const n = keep.length;
  if (keep.every(Boolean)) return [closed ? [...pts, pts[0], pts[1], pts[2]] : pts];
  const out: number[][] = [];
  // a closed loop starts just after a dropped point, so no run wraps round the seam
  const start = closed ? keep.indexOf(false) + 1 : 0;
  let run: number[] = [];
  for (let j = 0; j < n; j++) {
    const i = (start + j) % n;
    if (keep[i]) run.push(pts[3 * i], pts[3 * i + 1], pts[3 * i + 2]);
    else {
      if (run.length >= 6) out.push(run);
      run = [];
    }
  }
  if (run.length >= 6) out.push(run);
  return out;
}

/** a polyline resampled to n points evenly along its length */
function resample(p: Vec[], n: number): Vec[] {
  const cum = [0];
  for (let i = 1; i < p.length; i++) cum.push(cum[i - 1] + Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y));
  const L = cum[cum.length - 1];
  const out: Vec[] = [];
  let j = 0;
  for (let i = 0; i < n; i++) {
    const s = (L * i) / (n - 1);
    while (j < p.length - 2 && cum[j + 1] < s) j++;
    const t = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
    out.push({ x: p[j].x + (p[j + 1].x - p[j].x) * t, y: p[j].y + (p[j + 1].y - p[j].y) * t });
  }
  return out;
}

/** the point at fraction t of a polyline's length */
function along(p: Vec[], cum: number[], t: number): Vec {
  const s = t * cum[cum.length - 1];
  let j = 0;
  while (j < p.length - 2 && cum[j + 1] < s) j++;
  const u = (s - cum[j]) / Math.max(1e-9, cum[j + 1] - cum[j]);
  return { x: p[j].x + (p[j + 1].x - p[j].x) * u, y: p[j].y + (p[j + 1].y - p[j].y) * u };
}
const cumulative = (p: Vec[]): number[] => {
  const c = [0];
  for (let i = 1; i < p.length; i++) c.push(c[i - 1] + Math.hypot(p[i].x - p[i - 1].x, p[i].y - p[i - 1].y));
  return c;
};

// ------------------------------------------------------------------ the rest pose

function buildRest(model: VoiceModel): Rest {
  const t = model.tract;
  const k = t.scale;
  const ph = model.bodyParams.pharynx;
  const B = bodyPoint(model);
  const By = (Y: number) => B(0, Y).y;
  const unBy = (y: number) => (y / k >= 7 ? y / k : 7 - (7 - y / k) / ph);
  const P = (x: number, y: number) => t.P(x, y);
  // jaw closed, lips together
  const artic: HumanArtic = { ...NEUTRAL, jaw: 0, lipAp: 0, labiodental: 0 };
  const frame = model.frame(artic);
  const prof = buildProfile(model, frame, artic);
  const skin = [...prof.skinLower, ...prof.skinUpper];
  const head = new Shape(skin, 0.08 * k, (y, F, Bk) => {
    const Y = unBy(y);
    const plane = Y >= 3.4 && Y <= 16.1 ? interp(PLANE, Y) * k : Infinity;
    const Fs = Math.min(F, plane);
    const pf = 2.2 + 0.4 * smooth(2.5, 3.5, Y) * (1 - smooth(17, 18.5, Y));
    return { F, Bk, Fs, W: interp(WIDTH, Y) * k, xw: Bk + (Fs - Bk) * interp(WIDEST, Y), E: F - Fs, wf: interp(FEATURE, Y) * k, pf };
  });
  const condyle = P(-2.5, 10.5);
  const lipTop = frame.upperLip[frame.upperLip.length - 1].y;
  const lipBottom = frame.lowerLip[frame.lowerLip.length - 1].y;
  const lipHalf = LIP_HALF * k;
  const inLips = (x: number, y: number, z: number, s: Section) => y > lipBottom && y < lipTop && Math.abs(z) < lipHalf && x > s.xw;

  // ---- the head's shell: rings by height, verticals over the face, meridians round the back
  const shell: Skinned[] = [];
  const addShell = (pts: number[], keep: boolean[], closed: boolean) => {
    for (const run of keptRuns(pts, keep, closed)) {
      const n = run.length / 3;
      const w = new Float32Array(n), c = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        w[i] = jawWeight(k, ph, run[3 * i], run[3 * i + 1]);
        c[i] = cheekWeight(k, ph, run[3 * i], run[3 * i + 1]);
      }
      shell.push({ a: new Float32Array(run), w, c });
    }
  };
  const half: number[] = [];
  const ringStep = 1.4 * k;
  for (let y = head.y0 + 0.25 * k; y < head.y1 - 0.2 * k; y += ringStep) {
    const s = head.at(y);
    if (!s || s.W < 0.2 * k) continue;
    halfRing(s, Math.min(0.6 * s.W, 3.6 * k), half);
    const pts: number[] = [], keep: boolean[] = [];
    const n = half.length / 2;
    // right side from the back to the front, then the left side back again (no doubled ends)
    for (let i = 0; i < n; i++) pts.push(half[2 * i], y, half[2 * i + 1]);
    for (let i = n - 2; i > 0; i--) pts.push(half[2 * i], y, -half[2 * i + 1]);
    for (let i = 0; i < pts.length / 3; i++) keep.push(!inLips(pts[3 * i], y, pts[3 * i + 2], s));
    addShell(pts, keep, true);
  }
  const vstep = 0.3 * k;
  for (const z of [-3.6, -2.4, -1.2, 1.2, 2.4, 3.6].map((v) => v * k)) {
    let pts: number[] = [], keep: boolean[] = [];
    for (let y = head.y0 + 0.1 * k; y <= head.y1; y += vstep) {
      const s = head.at(y);
      if (!s || Math.abs(z) > 0.97 * s.W) {
        addShell(pts, keep, false);
        pts = [];
        keep = [];
        continue;
      }
      const x = frontX(s, z);
      pts.push(x, y, z);
      keep.push(!inLips(x, y, z, s));
    }
    addShell(pts, keep, false);
  }
  for (const th of [0.5, 0.8].map((v) => v * Math.PI)) {
    for (const side of [1, -1]) {
      const pts: number[] = [], keep: boolean[] = [];
      for (let y = head.y0 + 0.1 * k; y <= head.y1; y += vstep) {
        const s = head.at(y);
        if (!s || s.W < 0.2 * k) continue;
        pts.push(s.xw - (s.xw - s.Bk) * Math.pow(Math.abs(Math.cos(th)), 2 / PB), y, side * s.W * Math.pow(Math.sin(th), 2 / PB));
        keep.push(true);
      }
      addShell(pts, keep, false);
    }
  }

  const fixed: Group[] = [];
  const jaw: Group[] = [];
  const group = (into: Group[], color: string, width: number, alpha: number, fill: (L: Lines) => void, hot = false) => {
    const L = new Lines();
    fill(L);
    into.push({ lines: L.lines, color, width, alpha, hot });
  };
  /** a template outline on the side of the head, standing out from it by `off` (body cm) */
  const onSide = (L: Lines, pts: [number, number][], off: (i: number, n: number) => number, side: number) => {
    const curve = catmullRom(pts.map(([x, y]) => B(x, y)), 4);
    curve.forEach((p, i) => {
      const s = head.at(p.y);
      L.p(p.x, p.y, side * ((s ? sideZ(s, p.x) : 0) + off(i, curve.length)));
    });
    L.end();
  };

  // ---- ears
  group(fixed, V.blueDim, 1.05, 0.9, (L) => {
    for (const side of [1, -1]) {
      onSide(L, [[-2.55, 13.4], [-2.85, 14.75], [-3.65, 15.45], [-4.6, 15.25], [-5.2, 14.25], [-5.4, 12.8], [-5.05, 11.3], [-4.55, 10.2], [-3.95, 9.55], [-3.35, 9.65], [-3.0, 10.35]], (i, n) => (0.25 + 1.2 * Math.sin((Math.PI * i) / (n - 1)) ** 1.5) * k, side);
      onSide(L, [[-3.15, 14.3], [-3.95, 14.45], [-4.55, 13.5], [-4.6, 12.1], [-4.15, 11.05]], () => 0.55 * k, side);
      onSide(L, [[-2.7, 11.2], [-2.55, 11.85], [-2.75, 12.35]], () => 0.35 * k, side);
      const concha: [number, number][] = [];
      for (let i = 0; i <= 16; i++) concha.push([-3.5 + 0.6 * Math.cos((i / 16) * Math.PI * 2), 12.0 + 0.85 * Math.sin((i / 16) * Math.PI * 2)]);
      onSide(L, concha, () => 0.12 * k, side);
    }
  });
  // ---- the nose's sides and wings, so it reads from the front
  group(fixed, V.blueMid, 1.0, 0.8, (L) => {
    for (const side of [1, -1]) {
      for (let Y = 14.6; Y >= 11.3; Y -= 0.15) {
        const y = By(Y), s = head.at(y);
        if (!s) continue;
        const z = side * (0.3 + (1.05 * (14.6 - Y)) / 3.3) * k;
        L.p(frontX(s, z), y, z);
      }
      L.end();
      const wing: [number, number, number][] = [[7.95, 11.05, 0.95], [7.4, 11.15, 1.45], [7.25, 11.6, 1.55], [7.55, 12.1, 1.35], [8.2, 12.15, 1.0]];
      for (const [x, Y, z] of wing) L.p(x * k, By(Y), side * z * k);
      L.end();
    }
  });
  // ---- nostrils, under the tip of the nose
  group(fixed, V.blueMid, 1.0, 0.9, (L) => {
    for (const side of [1, -1]) L.ellipse([8.05 * k, By(10.98), side * 0.62 * k], [0.42 * k, 0.04 * k, 0], [0, 0, 0.26 * k], 16);
  });

  // ---- brain: rings and meridians over the 2D outline, the skull and its base stay on the midline
  const brain = new Shape(prof.brain, 0.08 * k, (y, F, Bk) => ({ F, Bk, Fs: F, W: interp(BRAIN_WIDTH, unBy(y)) * k, xw: Bk + (F - Bk) * 0.48, E: 0, wf: 1, pf: 2.3 }));
  group(fixed, V.blueMid, 0.85, 0.32, (L) => {
    for (let y = brain.y0 + 0.6 * k; y < brain.y1 - 0.15 * k; y += 1.5 * k) {
      const s = brain.at(y);
      if (!s) continue;
      for (let i = 0; i <= 48; i++) {
        const th = (i / 48) * Math.PI * 2, c = Math.cos(th), sn = Math.sin(th);
        const p = c >= 0 ? s.pf : PB;
        const x = c >= 0 ? s.xw + (s.Fs - s.xw) * Math.pow(c, 2 / p) : s.xw - (s.xw - s.Bk) * Math.pow(-c, 2 / p);
        L.p(x, y, Math.sign(sn) * s.W * Math.pow(Math.abs(sn), 2 / p));
      }
      L.end();
    }
    for (const th of [0.3, 0.7].map((v) => v * Math.PI)) {
      for (const side of [1, -1]) {
        for (let y = brain.y0; y <= brain.y1; y += 0.3 * k) {
          const s = brain.at(y);
          if (!s) continue;
          const c = Math.cos(th), sn = Math.sin(th);
          const p = c >= 0 ? s.pf : PB;
          const x = c >= 0 ? s.xw + (s.Fs - s.xw) * Math.pow(c, 2 / p) : s.xw - (s.xw - s.Bk) * Math.pow(-c, 2 / p);
          L.p(x, y, side * s.W * Math.pow(sn, 2 / p));
        }
        L.end();
      }
    }
  });

  // ---- cervical vertebrae: bodies, arches, processes; the spinal cord through them
  group(fixed, V.blueDim, 0.9, 0.6, (L) => {
    for (let i = 0; i < 9; i++) {
      const y0 = -4.4 + i * 1.75;
      if (y0 > 10.5) break;
      const x0 = wallX(y0) - 2.25;
      const lo = P(x0, y0 + 0.08), hi = P(x0, y0 + 1.32);
      const cx = P(x0 + 0.8, 0).x, rx = 0.8 * k, rz = 1.05 * k;
      for (const y of [lo.y, hi.y]) L.ellipse([cx, y, 0], [rx, 0, 0], [0, 0, rz], 24);
      for (const a of [0.25, 0.75, 1.25, 1.75].map((v) => v * Math.PI)) L.p(cx + rx * Math.cos(a), lo.y, rz * Math.sin(a)).p(cx + rx * Math.cos(a), hi.y, rz * Math.sin(a)).end();
      const ym = (lo.y + hi.y) / 2, ax = cx - 2.15 * k;
      L.ellipse([ax, ym, 0], [0.72 * k, 0, 0], [0, 0, 0.88 * k], 20);
      for (const s of [1, -1]) {
        L.p(cx - 0.7 * k, ym, s * 0.55 * k).p(ax + 0.45 * k, ym, s * 0.72 * k).end();
        L.p(cx - 0.5 * k, ym, s * 0.95 * k).p(cx - 0.9 * k, ym - 0.1 * k, s * 2.3 * k).end();
      }
      L.p(ax - 0.72 * k, ym, 0).p(ax - 1.8 * k, ym - 0.55 * k, 0).end();
    }
  });
  group(fixed, V.blueDim, 0.85, 0.5, (L) => {
    const cx = P(-4.9, 0).x;
    for (let y = -4.4; y <= 11.0; y += 1.75) L.ellipse([cx, P(0, y).y, 0], [0.42 * k, 0, 0], [0, 0, 0.6 * k], 16);
    for (const s of [1, -1]) L.p(cx, P(0, -4.6).y, s * 0.6 * k).p(cx, P(0, 11.4).y, s * 0.6 * k).end();
  });

  // ---- nasal cavity: the septum is the 2D outline; its side walls and the turbinates beside it
  group(fixed, V.blueDim, 0.9, 0.7, (L) => {
    for (const s of [1, -1]) {
      for (const p of prof.nasal) L.p(p.x, p.y, s * 1.2 * k);
      L.end(true);
      for (const tb of prof.turbinates) {
        for (const p of tb) L.p(p.x, p.y, s * 0.95 * k);
        L.end();
      }
    }
  });

  // ---- upper teeth on their arch, the palate's vault between them
  const arch = (front: number, depth: number, halfW: number) => {
    // x(z) = front − depth·(|z|/halfW)^1.85, sampled along its length
    const pts: Vec[] = [];
    for (let i = 0; i <= 60; i++) {
      const z = (halfW * i) / 60;
      pts.push({ x: front - depth * Math.pow(z / halfW, 1.85), y: z });
    }
    return { pts, cum: cumulative(pts) };
  };
  const teeth = (L: Lines, front: number, depth: number, halfW: number, spec: readonly (readonly [number, number, number])[], occ: (u: number) => number, dir: 1 | -1) => {
    const a = arch(front, depth, halfW);
    const len = a.cum[a.cum.length - 1];
    const total = spec.reduce((s, q) => s + q[0], 0);
    const scale = (0.97 * len) / (total * k);
    for (const side of [1, -1]) {
      let s0 = 0;
      for (const [w0, h0, th0] of spec) {
        const w = w0 * k * scale, h = h0 * k, th = th0 * k;
        const tc = (s0 + w / 2) / len;
        s0 += w;
        const c = along(a.pts, a.cum, tc);
        const c1 = along(a.pts, a.cum, Math.min(1, tc + 0.01)), c0 = along(a.pts, a.cum, Math.max(0, tc - 0.01));
        // tangent along the arch (x, z) and the outward normal
        let tx = c1.x - c0.x, tz = c1.y - c0.y;
        const tl = Math.hypot(tx, tz) || 1;
        tx /= tl;
        tz /= tl;
        const nx = tz, nz = -tx; // outward (front at the midline)
        const y0 = occ(c.y / halfW);
        const P3 = (u: number, v: number, inward = 0): V3 => [c.x + tx * u - nx * inward, y0 + dir * v, side * (c.y + tz * u - nz * inward)];
        // the face towards the lips and cheeks: flat biting edge, narrowing to the gum
        for (const [u, v] of [[-0.5, 0], [-0.5, 0.55], [-0.38, 1], [0, 1.08], [0.38, 1], [0.5, 0.55], [0.5, 0]] as const) L.p(...P3(u * w, v * h));
        L.end(true);
        // the biting surface
        for (const [u, v] of [[-0.45, 0.1], [0.45, 0.1], [0.45, 0.9], [-0.45, 0.9]] as const) L.p(...P3(u * w, 0, v * th));
        L.end(true);
      }
    }
  };
  const upFront = P(7.3, 0).x, upDepth = 4.2 * k, upHalf = 2.65 * k;
  group(fixed, V.blue, 1.0, 0.8, (L) => teeth(L, upFront, upDepth, upHalf, UPPER_TEETH, (u) => (7.95 + 0.3 * u * u) * k, 1));
  group(fixed, V.blueMid, 1.0, 0.6, (L) => {
    for (const i of [0, 2, 4, 5, 6, 7]) {
      const m = prof.palOral[i];
      // the arch's half-width at this depth, inside the teeth
      const u = Math.max(0, (upFront - m.x) / upDepth);
      const za = (u >= 1 ? upHalf : upHalf * Math.pow(u, 1 / 1.85)) - 0.45 * k;
      const ya = (8.95 + 0.3 * Math.min(1, za / upHalf) ** 2) * k;
      if (za < 0.6 * k || m.y < ya + 0.15 * k) continue;
      for (let j = 0; j <= 20; j++) {
        const z = za * (j / 10 - 1);
        L.p(m.x, ya + (m.y - ya) * Math.pow(1 - Math.pow(Math.abs(z) / za, 2.4), 0.7), z);
      }
      L.end();
    }
  });

  // ---- the mandible (rest pose; the jaw turns it about the condyles)
  const M = (x: number, y: number, z: number): V3 => {
    const p = P(x, y);
    return [p.x, p.y, z * k];
  };
  /** a smooth curve through mandible landmarks (template x, y and z) */
  const mline = (L: Lines, pts: [number, number, number][], side: number) => {
    const q = pts.map(([x, y, z]) => M(x, y, side * z));
    for (let i = 0; i < q.length - 1; i++) {
      const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
      for (let j = 0; j < 4; j++) {
        const t = j / 4, t2 = t * t, t3 = t2 * t;
        const c = (a: number, b: number, cc: number, d: number) => 0.5 * (2 * b + (-a + cc) * t + (2 * a - 5 * b + 4 * cc - d) * t2 + (-a + 3 * b - 3 * cc + d) * t3);
        L.p(c(p0[0], p1[0], p2[0], p3[0]), c(p0[1], p1[1], p2[1], p3[1]), c(p0[2], p1[2], p2[2], p3[2]));
      }
    }
    L.p(...q[q.length - 1]);
    L.end();
  };
  group(jaw, V.red, 1.25, 0.9, (L) => {
    for (const side of [1, -1]) {
      // lower border, then the ramus up to the condyle
      mline(L, [[6.4, 4.6, 0], [5.6, 4.45, 1.5], [4.5, 4.4, 2.6], [3.2, 4.5, 3.5], [1.8, 4.85, 4.15], [0.4, 5.6, 4.6], [-0.55, 6.6, 4.85], [-0.9, 7.6, 4.9], [-1.45, 8.9, 4.95], [-1.9, 9.7, 5.0], [-2.15, 10.2, 5.0]], side);
      // condyle neck forward, the notch, the coronoid and the ramus' front edge down to the teeth
      mline(L, [[-1.8, 10.25, 4.95], [-0.9, 9.4, 4.85], [0.15, 10.1, 4.6], [0.6, 8.9, 4.35], [1.1, 7.7, 4.0], [1.9, 7.2, 3.55]], side);
      const c = M(-2.5, 10.5, side * 4.95);
      L.ellipse(c, [0.45 * k, 0, 0], [0, 0.12 * k, 0.85 * k], 16);
    }
  });
  group(jaw, V.red, 1.0, 0.55, (L) => {
    for (const side of [1, -1]) {
      // the alveolar border along the lower teeth, and the body's height at a few places
      mline(L, [[1.9, 7.2, 3.55], [3.0, 7.15, 3.15], [4.3, 7.1, 2.6], [5.4, 7.05, 1.85], [6.2, 7.05, 1.05], [6.72, 7.15, 0]], side);
      for (const [xa, za, xb, yb, zb] of [[3.0, 3.15, 3.2, 4.5, 3.5], [5.4, 1.85, 5.6, 4.45, 1.5], [1.9, 3.55, 1.8, 4.85, 4.15]]) mline(L, [[xa, 7.15, za], [(xa + xb) / 2, 5.9, (za + zb) / 2 + 0.15], [xb, yb, zb]], side);
    }
  });
  // the chin on the midline: the 2D view's jaw outline
  const chinL = new Lines();
  mline(chinL, [[7.25, 6.75, 0], [7.4, 5.4, 0], [6.4, 4.6, 0], [5.6, 5.0, 0], [5.9, 6.2, 0], [6.45, 6.55, 0]], 1);
  const chin = chinL.lines[0];
  const loFront = P(6.98, 0).x, loDepth = 4.0 * k, loHalf = 2.5 * k;
  group(jaw, V.blue, 1.0, 0.8, (L) => teeth(L, loFront, loDepth, loHalf, LOWER_TEETH, (u) => (7.75 + 0.45 * Math.pow(u, 1.5)) * k, -1));

  // eyes: the 2D view draws one on the midline; here they sit either side of the nose
  const eyeC = B(6.15, 15.35);
  const center = new THREE.Vector3(0.3 * k, (head.y0 + head.y1) / 2, 0);
  return { model, head, condyle, lipHalf, center, shell, fixed, jaw, chin, eyes: [[eyeC.x, eyeC.y, 3.15 * k], [eyeC.x, eyeC.y, -3.15 * k]], eyeR: 1.05 * k };
}

// ------------------------------------------------------------------ the renderer

interface Particle {
  s: number;
  u: number;
  v: number;
  life: number;
  px: number;
  py: number;
  pz: number;
}

/** what the tongue, jaw and lips looked like a moment ago */
interface Echo {
  t: number;
  lines: { a: Float32Array; color: string }[];
}
const ECHO_AGES = [0.09, 0.06, 0.03];

export class Anatomy3D {
  readonly scene = new THREE.Scene();
  readonly camera = new THREE.PerspectiveCamera(24, 1, 5, 2000);
  private readonly beams = new Beams();
  private rest: Rest | null = null;
  private w = 1;
  private h = 1;
  /** a narrow screen: readouts above and below the head (as the 2D view) */
  compact = false;
  /** no readouts beside the head: keep it in the middle of a wide screen too */
  centred = false;
  /** which way the turned home view shows the face: 1 to the right, −1 to the left (a duet's
   *  second head, so the two sing towards each other) */
  facing: 1 | -1 = 1;
  private clock = 0;
  private readonly gaze = new Gaze();
  /** brows, lids, cheeks and the head's nods, from the voice (the view updates it) */
  face = new Expression();
  /** the camera in the head's own frame (the head nods and sways under it) */
  private readonly eye = new THREE.Vector3();
  private readonly turn = new THREE.Quaternion();
  private readonly euler = new THREE.Euler();
  private strobe = 0;
  private readonly tmp = new Poly();
  private readonly particles: Particle[] = [];
  private echoes: Echo[] = [];
  private lastEcho = -1;
  private sparkSeed = 7;
  /** the body's scale this frame */
  private k = 1;
  /** the airway's cross-sections this frame: centre, the grid line's direction, half-gap, half-width */
  private ring = { n: 0, s: new Float64Array(80), cx: new Float64Array(80), cy: new Float64Array(80), ux: new Float64Array(80), uy: new Float64Array(80), a: new Float64Array(80), b: new Float64Array(80) };
  private readonly v3 = new THREE.Vector3();
  /** the narrowest constriction this frame (for the measurement label), body cm */
  caliper: { x: number; y: number; z: number; area: number } | null = null;

  constructor() {
    this.scene.add(this.beams.group);
    this.scene.fog = new THREE.Fog(0x000000, 50, 100);
    for (let i = 0; i < 200; i++) this.particles.push({ s: Math.random() * 17, u: Math.random() * 2 - 1, v: Math.random() * 2 - 1, life: Math.random(), px: NaN, py: NaN, pz: NaN });
  }

  dispose(): void {
    this.beams.dispose();
  }

  /** forget the motion so far (a replay jumped): the face's springs and held-note time, the
   *  outline echoes, the airflow's particle trails and the vocal folds' strobe phase */
  resetMotion(): void {
    this.face = new Expression();
    this.echoes = [];
    this.lastEcho = -1;
    this.strobe = 0;
    for (const p of this.particles) p.px = NaN;
  }

  resize(w: number, h: number): void {
    this.w = w;
    this.h = h;
    this.compact = w < 560;
    this.camera.aspect = w / h;
    // on a wide screen the head sits left of centre, leaving the right for the readouts
    if (this.compact || this.centred) this.camera.clearViewOffset();
    else this.camera.setViewOffset(w, h, 0.1 * w, 0, w, h);
    this.camera.updateProjectionMatrix();
    this.beams.setResolution(w, h);
    for (const p of this.particles) p.px = NaN;
  }

  /** the head's centre and camera positions for this body: the turned "home" view and the 2D view's side */
  poses(model: VoiceModel): { target: THREE.Vector3; home: THREE.Vector3; side: THREE.Vector3 } {
    const r = this.restFor(model);
    const half = Math.tan((this.camera.fov * Math.PI) / 360);
    // fit the head's height (and its width in a narrow screen) at a male's size, so bodies compare
    const d = 1.1 * Math.max(15.2 / half, 11 / (half * Math.max(0.3, this.camera.aspect)));
    const target = r.center.clone();
    // facing left: the same three-quarter view from the head's other side
    const az = this.facing > 0 ? 0.62 : Math.PI - 0.62, el = 0.2;
    return {
      target,
      home: target.clone().add(new THREE.Vector3(Math.sin(az) * Math.cos(el), Math.sin(el), Math.cos(az) * Math.cos(el)).multiplyScalar(d)),
      side: target.clone().add(new THREE.Vector3(0, 0, this.facing * d)),
    };
  }

  private restFor(model: VoiceModel): Rest {
    if (!this.rest || this.rest.model !== model) this.rest = buildRest(model);
    return this.rest;
  }

  /** body point → CSS px on the canvas */
  project(x: number, y: number, z: number): [number, number] {
    const v = this.v3.set(x, y, z).applyMatrix4(this.beams.group.matrixWorld).project(this.camera);
    return [((v.x + 1) / 2) * this.w, ((1 - v.y) / 2) * this.h];
  }

  /** CSS px per cm at a body point, across the screen */
  pxPerCmAt(x: number, y: number, z: number): number {
    const e = this.camera.matrixWorld.elements;
    const [x0, y0] = this.project(x, y, z);
    const [x1, y1] = this.project(x + e[0], y + e[1], z + e[2]);
    return Math.hypot(x1 - x0, y1 - y0);
  }

  /** the top of the head on screen (CSS px) and the head's scale there (px per body cm) */
  crown(model: VoiceModel): { x: number; y: number; cmPx: number } {
    const rest = this.restFor(model);
    const k = model.tract.scale;
    const s = rest.head.at(rest.head.y1 - 1.2 * k);
    const cx = s ? (s.F + s.Bk) / 2 : rest.center.x;
    const [x, y] = this.project(cx, rest.head.y1, 0);
    return { x, y, cmPx: this.pxPerCmAt(cx, rest.head.y1, 0) };
  }

  /** what the words at the mouth (and other overlays) need of this view */
  faceView(model: VoiceModel, f: HumanFrame, a: HumanArtic): FaceView {
    const lips = faceHandles(model, f, a).find((h) => h.id === "lips")!.pos;
    return {
      handles: faceHandles,
      X: (p) => this.project(p.x, p.y, 0)[0],
      Y: (p) => this.project(p.x, p.y, 0)[1],
      pxPerCm: this.pxPerCmAt(lips.x, lips.y, 0),
    };
  }

  // ------------------------------------------------------------------ one frame
  update(model: VoiceModel, f: HumanFrame, a: HumanArtic, tele: TelemetryMessage | null, view: ViewFlags, dt: number): void {
    this.clock += dt;
    const rest = this.restFor(model);
    const k = model.tract.scale;
    const face = this.face;
    this.headPose(rest, k);
    const phi = jawAngle(model, a.jaw);
    const C = rest.condyle;
    const B = this.beams;
    // dim with depth: full brightness up to just in front of the head's middle
    const dist = this.camera.position.distanceTo(rest.center);
    const fog = this.scene.fog as THREE.Fog;
    fog.near = dist - 3 * k;
    fog.far = dist + 30 * k;

    B.begin();
    const flat = (pts: Vec[], z = 0): Float32Array => {
      const o = new Float32Array(pts.length * 3);
      pts.forEach((p, i) => {
        o[3 * i] = p.x;
        o[3 * i + 1] = p.y;
        o[3 * i + 2] = z;
      });
      return o;
    };
    // The midsagittal section is the 2D view's drawing: full on from the side, but seen edge-on (from
    // the front, back or above) its lines pile into one bright bar down the middle, so it fades as
    // the head turns and the 3D shapes take over; the articulators' outlines fade less.
    const toCam = this.v3.copy(this.eye).sub(rest.center).normalize();
    const side = smooth(0.25, 0.8, Math.abs(toCam.z));
    const cut = 0.22 + 0.78 * side, artCut = 0.45 + 0.55 * side;
    const line = (pts: Vec[], color: string, w: number, o: { alpha?: number; hot?: boolean; close?: boolean } = {}, fade = cut) => B.line(flat(pts), pts.length, color, w, { ...o, alpha: (o.alpha ?? 1) * fade });
    const rot = (x: number, y: number, ang: number): [number, number] => (ang === 0 ? [x, y] : rotXY(x, y, C, ang));
    this.k = k;

    // ---- the fixed and jaw-carried structures
    for (const g of rest.fixed) for (const l of g.lines) B.line(l, l.length / 3, g.color, g.width, { alpha: g.alpha, hot: g.hot });
    for (const g of rest.jaw) {
      for (const l of g.lines) {
        const P = this.tmp.reset();
        for (let i = 0; i < l.length; i += 3) {
          const [x, y] = rot(l[i], l[i + 1], phi);
          P.p(x, y, l[i + 2]);
        }
        B.poly(P, g.color, g.width, { alpha: g.alpha, hot: g.hot });
      }
    }
    for (const sk of rest.shell) {
      const P = this.tmp.reset();
      for (let i = 0; i < sk.w.length; i++) {
        const z = sk.a[3 * i + 2];
        const [dx, dz] = puffAt(k, sk.c[i], z, face.puff);
        const [x, y] = rot(sk.a[3 * i] + dx, sk.a[3 * i + 1], phi * sk.w[i]);
        P.p(x, y, z + dz);
      }
      B.poly(P, V.blueDim, 0.85, { alpha: 0.42 });
    }

    // ---- the midsagittal section, as the 2D view draws it
    const G = buildProfile(model, f, a);
    line(G.inset, V.blueDim, 0.9, { alpha: 0.5 });
    line(G.skull, V.blueDim, 0.9, { close: true, alpha: 0.6 });
    line(G.brain, V.blueMid, 1.0, { close: true, alpha: 0.75 });
    line(G.sulcus, V.blueDim, 0.9);
    line(G.nasal, V.blueMid, 1, { close: true });
    line(G.palOral, V.blueMid, 1.1);
    line(G.palNasal, V.blueMid, 1.1);
    line(G.skinLower, V.blue, 1.5);
    line(G.skinUpper, V.blue, 1.5);
    line(G.outerWall, V.blue, 1.4, { hot: true });
    line(f.inner, V.blue, 1.3, { alpha: 0.9 });
    line(G.glottisWall, V.blue, 1.2, { alpha: 0.8 });

    this.eyes(rest, dt);
    this.airway(model, f, tele, view, k);
    this.velum(f, k);
    this.epiglottis(f, k, artCut);
    this.larynx(model, f, a, tele, k, dt, rest.head.y0, cut);

    const tongueOutline = flat(f.tongue);
    const soft = (v: Vec[], it: number) => flat(chaikin(v.map((p) => [p.x, p.y] as Pt), it).map(([x, y]) => ({ x, y })));
    const upperLip = soft(f.upperLip, 2), lowerLip = soft(f.lowerLip, 2);
    const mouth = this.lips(rest, model, f, a, phi);
    const chin = rest.chin;
    const chinNow = new Float32Array(chin.length);
    for (let i = 0; i < chin.length; i += 3) {
      const [x, y] = rot(chin[i], chin[i + 1], phi);
      chinNow[i] = x;
      chinNow[i + 1] = y;
    }

    // afterglow: where the tongue, jaw and lips were a moment ago
    if (tele && this.clock - this.lastEcho >= 0.028) {
      this.lastEcho = this.clock;
      const lines = [{ a: tongueOutline, color: V.green }, { a: chinNow, color: V.red }, { a: upperLip, color: V.pink }, { a: lowerLip, color: V.pink }];
      if (mouth) lines.push({ a: mouth, color: V.pink });
      this.echoes.push({ t: this.clock, lines });
      while (this.echoes.length && this.clock - this.echoes[0].t > 0.12) this.echoes.shift();
    }
    if (tele) {
      ECHO_AGES.forEach((age, i) => {
        const e = this.nearestEcho(this.clock - age);
        if (!e) return;
        for (const l of e.lines) B.line(l.a, l.a.length / 3, l.color, 1, { alpha: (0.1 + 0.07 * i) * artCut });
      });
    }

    this.tongue(f, a, k);
    B.line(chinNow, chinNow.length / 3, V.red, 1.5, { hot: true, alpha: artCut });
    B.line(tongueOutline, f.tongue.length, V.green, 1.6, { hot: true, alpha: artCut });
    B.line(upperLip, upperLip.length / 3, V.pink, 1.5, { hot: true, alpha: artCut });
    B.line(lowerLip, lowerLip.length / 3, V.pink, 1.5, { hot: true, alpha: artCut });
    line(chaikin(f.velum.map((p) => [p.x, p.y] as Pt), 3).map(([x, y]) => ({ x, y })), V.white, 1.25, { alpha: 0.92 }, artCut);

    if (view.particles && tele) this.drawParticles(model, f, tele, dt);
    if (tele) this.drawTurbulence(model, f, tele);
    this.caliper = null;
    if (view.calipers) this.drawCaliper(f);
    B.end();
  }

  private nearestEcho(t: number): Echo | null {
    let best: Echo | null = null, bd = 0.016;
    for (const e of this.echoes) {
      const d = Math.abs(e.t - t);
      if (d < bd) {
        bd = d;
        best = e;
      }
    }
    return best;
  }

  /**
   * The head nods (chin up on high notes, down on the beat) and sways (on a long note, and with
   * the vibrato) about the top of the neck. Everything is drawn in the head's frame, so this
   * turns the beams' group; the camera's position in that frame is kept for what faces it.
   */
  private headPose(rest: Rest, k: number): void {
    const g = this.beams.group;
    const pivot = this.v3.set(-2.4 * k, rest.head.y0 + 0.42 * (rest.condyle.y - rest.head.y0), 0);
    this.turn.setFromEuler(this.euler.set(this.face.tilt, 0, this.face.nod));
    g.quaternion.copy(this.turn);
    g.position.copy(pivot).sub(pivot.applyQuaternion(this.turn));
    g.updateMatrixWorld(true);
    this.eye.copy(this.camera.position);
    g.worldToLocal(this.eye);
  }

  // ------------------------------------------------------------------ eyes
  private eyes(rest: Rest, dt: number): void {
    const g = this.gaze, e = this.face;
    g.update(this.clock, dt);
    const r = rest.eyeR;
    // where they look: forward, turned by the gaze (yaw towards +z, pitch up)
    const pitch = g.pitch + 1.3 * e.lookUp;
    const d: V3 = [Math.cos(pitch) * Math.cos(g.yaw), Math.sin(pitch), Math.cos(pitch) * Math.sin(g.yaw)];
    const basis = (n: V3): [V3, V3] => {
      const up: V3 = Math.abs(n[1]) > 0.9 ? [1, 0, 0] : [0, 1, 0];
      const u = norm3(cross(up, n));
      return [u, cross(n, u)];
    };
    const cam = this.eye;
    // the iris shows less as the lids close
    const seen = 1 - smooth(0.4, 0.9, e.lid);
    const wide = Math.max(0, e.brow);
    for (const c of rest.eyes) {
      // a sphere's outline is the circle facing the camera
      const toCam = norm3([cam.x - c[0], cam.y - c[1], cam.z - c[2]]);
      const [u, v] = basis(toCam);
      const L = new Lines();
      L.ellipse(c, scale3(u, r), scale3(v, r), 36);
      const [iu, iv] = basis(d);
      const ic: V3 = [c[0] + d[0] * r * 0.86, c[1] + d[1] * r * 0.86, c[2] + d[2] * r * 0.86];
      L.ellipse(ic, scale3(iu, r * 0.5), scale3(iv, r * 0.5), 24);
      const pc: V3 = [c[0] + d[0] * r * 0.97, c[1] + d[1] * r * 0.97, c[2] + d[2] * r * 0.97];
      L.ellipse(pc, scale3(iu, r * 0.2), scale3(iv, r * 0.2), 14);
      // the lids: an almond over the front of the eyeball, inner corner towards the nose; the
      // upper one opens wide on a high note and comes down onto the lower one to shut
      const out = Math.sign(c[2]);
      const lidAt = (open: number, sv: number, sgn: number) => open * (1 - sv * sv) + 0.06 * sv * out * sgn;
      const lid = (upper: boolean) => {
        for (let i = 0; i <= 16; i++) {
          const sv = -1 + i / 8, al = out * sv * 0.95;
          const lo = lidAt(-0.36, sv, -1);
          const be = upper ? lidAt(0.5 + 0.2 * wide, sv, 1) * (1 - e.lid) + (lo + 0.03) * e.lid : lo;
          L.p(c[0] + 1.04 * r * Math.cos(be) * Math.cos(al), c[1] + 1.04 * r * Math.sin(be), c[2] + 1.04 * r * Math.cos(be) * Math.sin(al));
        }
        L.end();
      };
      lid(true);
      lid(false);
      // the brow above it: up with the pitch, knit (inner end down) on a low note, and on a long
      // high note with the eyes shut, the inner end up (the singer feeling it)
      const lift = 0.3 * e.brow, knit = 0.28 * Math.max(0, -e.brow), feel = 0.22 * e.lid * wide;
      for (let i = 0; i <= 12; i++) {
        const sv = -1 + i / 6, al = out * (0.15 + sv * 0.62), inner = (1 - sv) / 2;
        const be = 0.82 + 0.12 * (1 - sv * sv) - 0.06 * sv + lift + (feel - knit) * inner;
        L.p(c[0] + 1.32 * r * Math.cos(be) * Math.cos(al), c[1] + 1.32 * r * Math.sin(be), c[2] + 1.32 * r * Math.cos(be) * Math.sin(al));
      }
      L.end();
      const style = [[V.blueMid, 1.0, 0.35], [V.blue, 1.0, 0.9 * seen], [V.blue, 1.0, 0.7 * seen], [V.blue, 1.25, 0.95], [V.blue, 1.05, 0.75], [V.blueMid, 1.3, 0.8]] as const;
      L.lines.forEach((l, i) => this.beams.line(l, l.length / 3, style[i][0], style[i][1], { alpha: style[i][2] }));
    }
  }

  // ------------------------------------------------------------------ the lips
  /**
   * The lips as a patch over the mouth: the engine's midline outlines swept sideways. The opening's
   * width is the engine's lip width (rounded to spread) and its height the midline gap, closing to
   * the corners. The upper lip stays with the skull and the lower with the jaw; the corners go half
   * way, and towards the patch's edges each point follows the face's skin. Returns the opening's
   * outline (for the afterglow) when the lips are apart.
   */
  private lips(rest: Rest, model: VoiceModel, f: HumanFrame, a: HumanArtic, phi: number): Float32Array | null {
    const k = model.tract.scale, C = rest.condyle, head = rest.head, B = this.beams;
    const ph = model.bodyParams.pharynx;
    const Wl = rest.lipHalf;
    const Wm = Math.max(0.3 * k, ((1.1 + (model.bodyParams.lipWidth - 1.1) * clamp01(a.lipWidth)) * k) / 2);
    const up = f.upperLip.slice(6); // edge → nose
    const lo = f.lowerLip.slice(6).map((p) => rotateAbout(p, C, -phi)); // edge → chin, as if the jaw were closed
    const cu = cumulative(up), cl = cumulative(lo);
    const ul = up[0], ll = lo[0];
    const yc = (ul.y + ll.y) / 2;
    const base = (y: number, z: number): number => {
      const s = head.at(y);
      return s ? frontX(s, z, true) : 0;
    };
    const bulge0u = ul.x - base(ul.y, 0), bulge0l = ll.x - base(ll.y, 0), avg0 = (bulge0u + bulge0l) / 2;
    const yTop = up[up.length - 1].y, yBot = lo[lo.length - 1].y;
    const P = this.tmp;
    /** a point of the patch: upper or lower lip, t from the edge (0) to the patch's far edge (1), at z */
    const pt = (upper: boolean, t: number, z: number): V3 => {
      const sz = Math.sqrt(Math.max(0, 1 - (z / Wm) ** 2));
      const M = along(upper ? up : lo, upper ? cu : cl, t);
      const edge = upper ? ul : ll, far = upper ? yTop : yBot;
      const ye = yc + (edge.y - yc) * sz;
      const span = far - edge.y;
      const y = ye + ((M.y - edge.y) * (far - ye)) / (Math.abs(span) < 1e-4 ? 1e-4 : span);
      const g = Math.pow(Math.max(0, 1 - (z / Wl) ** 2), 1.5);
      const bulge = M.x - base(M.y, 0) + (avg0 - (upper ? bulge0u : bulge0l)) * (1 - sz) * (1 - t);
      const x = base(y, z) + bulge * g;
      const natural = upper ? 0.5 * (1 - sz) * (1 - t) : 0.5 * (1 + sz) + 0.5 * (1 - sz) * t;
      const w = natural + (jawWeight(k, ph, x, y) - natural) * smooth(Wm, Wl, Math.abs(z));
      // the cheeks' puff, as the shell beside the patch takes it
      const [dx, dz] = puffAt(k, cheekWeight(k, ph, x, y), z, this.face.puff);
      const [rx, ry] = w ? rotXY(x + dx, y, C, phi * w) : [x + dx, y];
      return [rx, ry, z + dz];
    };
    const row = (upper: boolean, t: (z: number) => number, z0: number, z1: number, n: number): Poly => {
      P.reset();
      for (let i = 0; i <= n; i++) {
        const z = z0 + ((z1 - z0) * i) / n;
        P.p(...pt(upper, t(z), z));
      }
      return P;
    };
    const skinRows = [0.66, 0.88];
    for (const upper of [true, false]) {
      for (const t of skinRows) B.poly(row(upper, () => t, -Wl, Wl, 24), V.blueDim, 0.85, { alpha: 0.42 });
      for (const z of [-0.8, -0.5, 0.5, 0.8].map((v) => v * Wl)) {
        P.reset();
        for (let i = 0; i <= 8; i++) P.p(...pt(upper, 0.45 + (0.55 * i) / 8, z));
        B.poly(P, V.blueDim, 0.85, { alpha: 0.42 });
      }
      // the vermilion border, closing to the corners; the upper one with a Cupid's bow
      const Wv = Math.min(Wl, Wm + 0.3 * k);
      const border = (z: number) => {
        const s = Math.sqrt(Math.max(0, 1 - (z / Wv) ** 2));
        const bow = upper ? -0.07 * Math.exp(-((z / (0.32 * k)) ** 2)) + 0.05 * Math.exp(-(((Math.abs(z) - 0.55 * k) / (0.3 * k)) ** 2)) : 0;
        return Math.max(0, (upper ? 0.42 : 0.45) * s + bow * s);
      };
      B.poly(row(upper, border, -Wv, Wv, 28), V.pink, 1.3, { alpha: 0.95 });
      B.poly(row(upper, (z) => 0.45 * border(z), -Wv, Wv, 28), V.pink, 1.0, { alpha: 0.45 });
    }
    // where the lips meet beyond the corners
    for (const s of [1, -1]) B.poly(row(true, () => 0, s * Wm, s * Wl, 6), V.pink, 1.0, { alpha: 0.6 });
    // the opening: are the lips apart in the engine's frame (lo is in the jaw's rest pose)
    const open = f.upperLip[6].y - f.lowerLip[6].y > 0.02 * k;
    const n = 24;
    P.reset();
    for (let i = 0; i <= n; i++) P.p(...pt(true, 0, -Wm + (2 * Wm * i) / n));
    if (open) for (let i = n - 1; i > 0; i--) P.p(...pt(false, 0, -Wm + (2 * Wm * i) / n));
    B.poly(P, V.pink, 2.1, { hot: true, close: open });
    return open ? P.a.slice(0, P.n * 3) : null;
  }

  // ------------------------------------------------------------------ the tongue
  private tongue(f: HumanFrame, a: HumanArtic, k: number): void {
    const T = f.tongue;
    let iTip = 0, bd = Infinity;
    T.forEach((p, i) => {
      const d = (p.x - f.tip.x) ** 2 + (p.y - f.tip.y) ** 2;
      if (d < bd) {
        bd = d;
        iTip = i;
      }
    });
    // the upper surface from the root over the dorsum to the tip, in even stations
    const N = 22;
    const st = resample(T.slice(0, iTip + 1), N);
    const lateral = clamp01(a.lateral);
    const frames = st.map((p, i) => {
      const q0 = st[Math.max(0, i - 1)], q1 = st[Math.min(N - 1, i + 1)];
      let tx = q1.x - q0.x, ty = q1.y - q0.y;
      const tl = Math.hypot(tx, ty) || 1;
      tx /= tl;
      ty /= tl;
      const sg = i / (N - 1);
      // outward: the surface runs root → tip with the tongue below it, so its left normal
      return { p, nx: -ty, ny: tx, W: interp(TONGUE_W, sg) * k, h: (interp(TONGUE_H, sg) + 0.8 * lateral * smooth(0.45, 0.8, sg)) * k };
    });
    const at = (fr: (typeof frames)[number], ph: number): V3 => {
      const drop = fr.h * (1 - Math.cos(ph));
      return [fr.p.x - fr.nx * drop, fr.p.y - fr.ny * drop, fr.W * Math.sin(ph)];
    };
    const P = this.tmp;
    for (let i = 1; i < N - 1; i += 2) {
      P.reset();
      for (let j = 0; j <= 12; j++) P.p(...at(frames[i], -Math.PI / 2 + (Math.PI * j) / 12));
      this.beams.poly(P, V.green, 1.0, { alpha: 0.5 });
    }
    for (const ph of [-Math.PI / 2, -Math.PI / 4, Math.PI / 4, Math.PI / 2]) {
      P.reset();
      for (const fr of frames) P.p(...at(fr, ph));
      this.beams.poly(P, V.green, Math.abs(ph) > 1 ? 1.25 : 1.0, { alpha: Math.abs(ph) > 1 ? 0.8 : 0.45 });
    }
  }

  // ------------------------------------------------------------------ the airway
  private airway(model: VoiceModel, f: HumanFrame, tele: TelemetryMessage | null, view: ViewFlags, k: number): void {
    const g = f.grid;
    const R = this.ring;
    R.n = 0;
    if (g.length < 2) return;
    const nodeS = tele ? model.nodeS(tele.t.phLen, tele.t.orLen) : null;
    const pressure = view.pressure && tele && nodeS && nodeS.length === tele.t.pressureRms.length;
    let ux = -1, uy = 0;
    for (let i = 0; i < g.length && R.n < R.s.length; i++) {
      const s = g[i];
      const dx = s.outer.x - s.inner.x, dy = s.outer.y - s.inner.y, d = Math.hypot(dx, dy);
      if (d > 1e-4) {
        ux = dx / d;
        uy = dy / d;
      }
      // the acoustic gap hangs from the outer wall (contact models can shorten the ray's gap)
      const half = s.d / 2;
      const j = R.n++;
      R.s[j] = s.s;
      R.cx[j] = s.outer.x - ux * half;
      R.cy[j] = s.outer.y - uy * half;
      R.ux[j] = ux;
      R.uy[j] = uy;
      R.a[j] = half;
      // an ellipse with this midsagittal gap and the section's area
      R.b[j] = s.d > 0.01 ? Math.min(3.5 * k, (2 * s.area) / (Math.PI * s.d)) : 0;
    }
    const P = this.tmp;
    const cam = this.eye;
    for (let j = 0; j < R.n; j += 2) {
      P.reset();
      for (let i = 0; i <= 24; i++) {
        const an = (i / 24) * Math.PI * 2, c = Math.cos(an) * R.a[j], sn = Math.sin(an) * R.b[j];
        P.p(R.cx[j] + R.ux[j] * c, R.cy[j] + R.uy[j] * c, sn);
      }
      // the ring's plane faces along the tract (its normal is across the grid line)
      const vx = cam.x - R.cx[j], vy = cam.y - R.cy[j], vz = cam.z;
      const facing = Math.abs(R.uy[j] * vx - R.ux[j] * vy) / (Math.hypot(vx, vy, vz) || 1);
      const fade = 1 - 0.65 * facing * facing;
      if (pressure) {
        const lvl = Math.pow(pressureLevel(nodeValueAtS(tele!.t.pressureRms, nodeS!, R.s[j])), 0.85);
        this.beams.poly(P, heat(lvl), 0.85, { alpha: (0.25 + 0.65 * lvl) * fade });
      } else this.beams.poly(P, V.blueDim, 0.85, { alpha: (view.grid ? 0.8 : 0.45) * fade });
    }
    // the tube's side walls
    for (const side of [1, -1]) {
      P.reset();
      for (let j = 0; j < R.n; j++) P.p(R.cx[j], R.cy[j], side * R.b[j]);
      this.beams.poly(P, V.blue, 1.0, { alpha: 0.55 });
    }
    // the epilarynx: a short round tube up from the folds
    const gl = f.glottis;
    for (const u of [0.3, 0.65]) {
      const cx = gl.x + (R.cx[0] - gl.x) * u, cy = gl.y + (R.cy[0] - gl.y) * u, r = (0.55 + 0.25 * u) * k;
      P.reset();
      for (let i = 0; i <= 20; i++) P.p(cx + r * Math.cos((i / 20) * Math.PI * 2), cy, r * Math.sin((i / 20) * Math.PI * 2));
      this.beams.poly(P, V.blueDim, 0.9, { alpha: 0.6 });
    }
  }

  /** a point in the airway at s (cm from the glottis), across (u) and sideways (v), each −1..1 */
  private airPoint(f: HumanFrame, s: number, u: number, v: number): V3 | null {
    const R = this.ring;
    if (R.n < 2) return null;
    if (s <= R.s[0]) {
      const t = Math.max(0, s / Math.max(0.01, R.s[0]));
      const g = f.glottis;
      return [g.x + (R.cx[0] - g.x) * t + u * 0.3 * this.k, g.y + (R.cy[0] - g.y) * t, v * 0.45 * this.k];
    }
    let lo = 0, hi = R.n - 1;
    if (s >= R.s[hi]) return null;
    while (hi - lo > 1) {
      const m = (lo + hi) >> 1;
      if (R.s[m] <= s) lo = m;
      else hi = m;
    }
    const t = (s - R.s[lo]) / Math.max(1e-6, R.s[hi] - R.s[lo]);
    const l = (q: Float64Array) => q[lo] + (q[hi] - q[lo]) * t;
    const a = l(R.a) * u * 0.82, b = l(R.b) * v * 0.82;
    return [l(R.cx) + l(R.ux) * a, l(R.cy) + l(R.uy) * a, b];
  }

  private drawParticles(model: VoiceModel, f: HumanFrame, tele: TelemetryMessage, dt: number): void {
    const t = tele.t;
    const nodeS = model.nodeS(t.phLen, t.orLen);
    const areas = new Float32Array(t.phAreas.length + t.orAreas.length);
    areas.set(t.phAreas, 0);
    areas.set(t.orAreas, t.phAreas.length);
    const L = f.lipS;
    for (const p of this.particles) {
      const U = nodeValueAtS(t.flow, nodeS, p.s);
      const A = Math.max(0.05, nodeValueAtS(areas, nodeS, p.s));
      const u = U / A; // particle velocity cm/s
      const vis = Math.sign(u) * 2.2 * Math.log1p(Math.abs(u) / 30); // perceptual speed (cm/s on screen)
      p.s += vis * dt;
      p.life -= dt * 0.25;
      if (p.s > L || p.s < 0 || p.life <= 0 || Math.abs(u) < 3) {
        if (!(Math.abs(u) < 3 && p.life > 0)) {
          p.s = Math.random() * 0.8;
          p.u = Math.random() * 2 - 1;
          p.v = Math.random() * 2 - 1;
          p.life = 0.6 + Math.random() * 0.8;
          p.px = NaN;
          continue;
        }
      }
      const pos = this.airPoint(f, p.s, p.u, p.v);
      if (!pos) continue;
      if (Number.isFinite(p.px)) {
        const band = Math.min(2, Math.floor(Math.min(1, Math.abs(vis) / 6) * Math.min(1, p.life) * 3));
        this.beams.seg(p.px, p.py, p.pz, pos[0], pos[1], pos[2], "#ffe2a8", 1.05, 0.16 + 0.2 * band);
      }
      [p.px, p.py, p.pz] = pos;
    }
  }

  private drawTurbulence(model: VoiceModel, f: HumanFrame, tele: TelemetryMessage): void {
    const t = tele.t;
    if (!(t.noiseLevel > 1) || t.noiseNode < 0) return;
    const s = model.branchS(t.noiseNode, t.phLen, t.orLen);
    if (s < 0) return;
    const intensity = Math.min(1, Math.log10(t.noiseLevel) / 3.2);
    if (intensity <= 0.05) return;
    let seed = (this.sparkSeed = (this.sparkSeed * 16807) % 2147483647);
    const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 40; i++) {
      const pos = this.airPoint(f, s + 0.2 + rnd() * 1.2, rnd() * 2 - 1, rnd() * 2 - 1);
      if (!pos) continue;
      const r = 0.02 + rnd() * 0.05;
      this.beams.seg(pos[0] - r, pos[1], pos[2], pos[0] + r, pos[1], pos[2], "#f4fbff", 1.6, 0.15 + 0.7 * intensity * rnd());
    }
  }

  private drawCaliper(f: HumanFrame): void {
    const R = this.ring;
    let mi = -1, ma = Infinity;
    for (let i = 2; i < f.grid.length - 1; i++) if (f.grid[i].area < ma) {
      ma = f.grid[i].area;
      mi = i;
    }
    if (mi < 0 || ma >= 1.2 || mi >= R.n) return;
    const P = this.tmp.reset();
    for (let i = 0; i <= 24; i++) {
      const an = (i / 24) * Math.PI * 2, c = Math.cos(an) * R.a[mi], sn = Math.sin(an) * R.b[mi];
      P.p(R.cx[mi] + R.ux[mi] * c, R.cy[mi] + R.uy[mi] * c, sn);
    }
    this.beams.poly(P, V.white, 1.3, { hot: true });
    const g = f.grid[mi];
    this.caliper = { x: g.outer.x, y: g.outer.y, z: 0, area: ma };
  }

  // ------------------------------------------------------------------ soft palate, epiglottis, larynx
  private velum(f: HumanFrame, k: number): void {
    const v = f.velum;
    const n = Math.floor(v.length / 2) - 1; // 0..n along the nasal side
    const fr: { x: number; y: number; nx: number; ny: number; W: number; droop: number }[] = [];
    for (let i = 0; i <= n; i++) {
      const a = v[i], b = v[v.length - 1 - i];
      let nx = a.x - b.x, ny = a.y - b.y;
      const l = Math.hypot(nx, ny) || 1;
      nx /= l;
      ny /= l;
      const u = i / n;
      fr.push({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, nx, ny, W: (1.95 - 1.5 * Math.pow(u, 1.5)) * k, droop: 0.45 * k * u });
    }
    const at = (q: (typeof fr)[number], u: number): V3 => {
      const off = 0.12 * k * (1 - u * u) - q.droop * u * u;
      return [q.x + q.nx * off, q.y + q.ny * off, q.W * u];
    };
    const P = this.tmp;
    for (const i of [1, 3, 5, 7, 9].filter((i) => i <= n)) {
      P.reset();
      for (let j = 0; j <= 12; j++) P.p(...at(fr[i], -1 + j / 6));
      this.beams.poly(P, V.white, 1.0, { alpha: 0.5 });
    }
    for (const u of [-1, 1]) {
      P.reset();
      for (const q of fr) P.p(...at(q, u));
      this.beams.poly(P, V.white, 1.0, { alpha: 0.65 });
    }
  }

  private epiglottis(f: HumanFrame, k: number, cut: number): void {
    const [base, tip] = f.epiglottis;
    let dx = tip.x - base.x, dy = tip.y - base.y;
    const l = Math.hypot(dx, dy) || 1;
    dx /= l;
    dy /= l;
    // it is a leaf, curling back towards the larynx at its edges
    const back = { x: -dy, y: dx }; // the side away from the tongue
    const halfW = (u: number) => (0.22 + 0.9 * Math.pow(Math.sin((u * Math.PI) / 2), 1.3)) * k;
    const P = this.tmp.reset();
    const N = 10;
    for (let i = 0; i <= N; i++) {
      const u = i / N, w = halfW(u), curl = 0.28 * k * (w / (1.12 * k));
      P.p(base.x + dx * l * u + back.x * curl, base.y + dy * l * u + back.y * curl, w);
    }
    for (let i = 1; i < 12; i++) {
      const z = halfW(1) * (1 - (2 * i) / 12);
      const curl = 0.28 * k * (Math.abs(z) / (1.12 * k)) ** 2;
      P.p(tip.x + back.x * curl + dx * 0.08 * k * (1 - (z / halfW(1)) ** 2), tip.y + back.y * curl + dy * 0.08 * k * (1 - (z / halfW(1)) ** 2), z);
    }
    for (let i = N; i >= 0; i--) {
      const u = i / N, w = halfW(u), curl = 0.28 * k * (w / (1.12 * k));
      P.p(base.x + dx * l * u + back.x * curl, base.y + dy * l * u + back.y * curl, -w);
    }
    this.beams.poly(P, V.blue, 1.1, { alpha: 0.75 });
    this.beams.line(new Float32Array([base.x, base.y, 0, tip.x, tip.y, 0]), 2, V.blue, 2.1, { alpha: 0.85 * cut });
  }

  /** the larynx's cartilages and folds round the glottis, the trachea down to the neck's end (bottom) */
  private larynx(model: VoiceModel, f: HumanFrame, a: HumanArtic, tele: TelemetryMessage | null, k: number, dt: number, bottom: number, cut: number): void {
    const g = f.glottis, B = this.beams;
    const L = new Lines();
    const at = (x: number, y: number, z: number): V3 => [g.x + x * k, g.y + y * k, z * k];
    const pl = (pts: [number, number, number][], close = false) => {
      for (const [x, y, z] of pts) L.p(...at(x, y, z));
      L.end(close);
    };
    // thyroid cartilage: two plates meeting at the front (the Adam's apple)
    for (const s of [1, -1]) {
      pl([[1.45, 1.75, 0], [0.75, 2.0, s * 1.2], [-0.5, 1.95, s * 1.9], [-0.6, -0.6, s * 1.85], [0.25, -0.85, s * 1.5], [1.05, -0.8, s * 0.55], [1.2, -0.75, 0], [1.6, 0.05, 0], [1.9, 1.15, 0], [1.45, 1.75, 0]]);
      pl([[-0.5, 1.95, s * 1.9], [-0.7, 2.85, s * 1.85]]);
      pl([[-0.6, -0.6, s * 1.85], [-0.45, -1.25, s * 1.7]]);
    }
    // cricoid: a signet ring, low in front and tall behind
    for (const [y0, rise] of [[-1.75, 0.15], [-1.4, 1.1]] as const) {
      for (let i = 0; i <= 28; i++) {
        const an = (i / 28) * Math.PI * 2;
        L.p(...at(0.1 + 1.0 * Math.cos(an), y0 + (rise * (1 - Math.cos(an))) / 2, 1.1 * Math.sin(an)));
      }
      L.end();
    }
    for (const l of L.lines) B.line(l, l.length / 3, V.blueMid, 1.0, { alpha: 0.85 });
    // trachea: C-shaped rings, open at the back
    const T = new Lines();
    const top = g.y - 2.1 * k, cx = g.x + 0.08 * k;
    for (let y = top; y > bottom; y -= 0.5 * k) T.ellipse([cx, y, 0], [0.82 * k, 0, 0], [0, 0, 0.95 * k], 20, -0.8 * Math.PI, 0.8 * Math.PI);
    for (const s of [1, -1]) T.p(cx, top, s * 0.95 * k).p(cx, bottom, s * 0.95 * k).end();
    for (const l of T.lines) B.line(l, l.length / 3, V.blueDim, 0.9, { alpha: 0.85 });
    // its front and back walls on the midline, as the 2D view draws them
    for (const s of [1, -1]) B.line(new Float32Array([cx + s * 0.82 * k, g.y, 0, cx + s * 0.82 * k, bottom, 0]), 2, V.blueMid, 1, { alpha: cut });
    // hyoid: a U open at the back, riding above the larynx
    const H = new Lines();
    const hy = { x: model.tract.P(1.6, 0).x, y: model.tract.P(0, 2.9).y + 0.6 * a.larynx * k };
    for (const dy of [-0.16, 0.16]) {
      for (let i = 0; i <= 20; i++) {
        const u = -1 + i / 10;
        H.p(hy.x + (0.35 - 0.65 * u * u) * k, hy.y + dy * k, 1.15 * u * k);
      }
      H.end();
      for (const s of [1, -1]) H.p(hy.x - 0.3 * k, hy.y + dy * k, s * 1.15 * k).p(hy.x - 2.8 * k, hy.y + (0.7 + dy) * k, s * 2.05 * k).end();
    }
    for (const l of H.lines) B.line(l, l.length / 3, V.blueMid, 1.0, { alpha: 0.85 });

    // the vocal folds, opening as the glottal area does (replayed slowly, as the stroboscope shows it)
    const area = tele?.t.glottalArea;
    let open = 0;
    if (area && area.length) {
      this.strobe = (this.strobe + dt / 1.8) % 1;
      let maxA = 0.02;
      for (let i = 0; i < area.length; i++) maxA = Math.max(maxA, area[i]);
      open = Math.min(0.45 * k, (area[Math.floor(this.strobe * area.length) % area.length] / (1.3 * k)) * 2.2);
      // the scope's samples can be missing for a moment (lips held shut, the voice stopped)
      if (!Number.isFinite(open)) open = 0;
    }
    const F = new Lines();
    for (const s of [1, -1]) {
      F.p(...at(0.72, 0.1, 0)).p(...at(-0.55, 0.1, s * (0.06 + open / k))).end();
      F.p(...at(0.72, 0.0, 0)).p(...at(-0.6, 0.0, s * 0.62)).end();
      F.p(...at(0.65, 0.45, 0)).p(...at(-0.5, 0.45, s * 0.45)).end();
      F.ellipse(at(-0.72, 0.15, s * (0.3 + open / k)), [0.18 * k, 0, 0], [0, 0.12 * k, 0.12 * k], 10);
    }
    F.lines.forEach((l, i) => B.line(l, l.length / 3, i % 4 === 0 ? V.white : V.blueMid, i % 4 === 0 ? 1.3 : 1.0, { alpha: i % 4 === 2 ? 0.6 : 0.9, hot: i % 4 === 0 }));
  }
}

function rotXY(x: number, y: number, c: Vec, ang: number): [number, number] {
  const dx = x - c.x, dy = y - c.y, cs = Math.cos(ang), sn = Math.sin(ang);
  return [c.x + dx * cs - dy * sn, c.y + dx * sn + dy * cs];
}
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm3 = (a: V3): V3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};
const scale3 = (a: V3, s: number): V3 => [a[0] * s, a[1] * s, a[2] * s];

function nodeValueAtS(values: ArrayLike<number>, nodeS: Float64Array, s: number): number {
  let best = 0, bd = Infinity;
  for (let i = 0; i < nodeS.length; i++) {
    const d = Math.abs(nodeS[i] - s);
    if (d < bd) {
      bd = d;
      best = i;
    }
  }
  return values[best] ?? 0;
}
