/**
 * The head around the vocal tract, in body cm (x forward, y up, glottis at the origin): the
 * midsagittal outlines the anatomy views draw (skin, skull, brain, vertebrae, palate, jaw, larynx)
 * built from the engine's frame, and the eye's wandering gaze. The 2D view draws these outlines;
 * the 3D view uses them as the midline of its shapes.
 */
import type { HumanArtic, HumanFrame } from "../../wasm/types.ts";
import type { Vec } from "./geom.ts";
import { rotateAbout, dist, catmullRom } from "./geom.ts";
import type { VoiceModel } from "../analysis.ts";

/** the visible part of the head, in body cm */
export const VIEW = { x0: -7.5, x1: 10.25, y0: -4.55, y1: 19.9 };

/** Body-space outlines for one frame. */
export interface Profile {
  f: HumanFrame;
  model: VoiceModel;
  skinLower: Vec[];
  skinUpper: Vec[];
  inset: Vec[];
  skull: Vec[];
  brain: Vec[];
  sulcus: Vec[];
  eye: Vec[];
  eyeC: Vec;
  vertebrae: Vec[][];
  cords: Vec[][];
  nasal: Vec[];
  turbinates: Vec[][];
  palOral: Vec[];
  palNasal: Vec[];
  jawLower: Vec[];
  jawUpper: Vec[];
  hyoid: Vec[];
  thyroid: Vec[];
  trachea: Vec[][];
  rings: Vec[][];
  outerWall: Vec[];
  glottisWall: Vec[];
  fibres: Vec[][];
  folds: Vec[][];
  lowerTeeth: Vec[];
}

/** the jaw's rotation (radians, about the condyle) for an opening at the incisors */
export function jawAngle(model: VoiceModel, jaw: number): number {
  const t = model.tract;
  return (-Math.max(-0.2, Math.min(3, jaw)) * t.scale) / dist(t.P(-2.5, 10.5), t.P(6.95, 7.75));
}

/** template point → body point carried by the jaw */
export function jawFn(model: VoiceModel, a: HumanArtic): (x: number, y: number) => Vec {
  const t = model.tract;
  const condyle = t.P(-2.5, 10.5);
  const phi = jawAngle(model, a.jaw);
  return (x: number, y: number) => rotateAbout(t.P(x, y), condyle, phi);
}

/** an ellipse; rotation is in screen space (y down), as the MRI renderer had it: negated for body space */
export function ellipse(c: Vec, rx: number, ry: number, rot = 0, n = 40): Vec[] {
  const cr = Math.cos(-rot), sr = Math.sin(-rot);
  const o: Vec[] = [];
  for (let i = 0; i <= n; i++) {
    const an = (i / n) * Math.PI * 2;
    const x = Math.cos(an) * rx, y = Math.sin(an) * ry;
    o.push({ x: c.x + x * cr - y * sr, y: c.y + x * sr + y * cr });
  }
  return o;
}

function roundRect(p0: Vec, p1: Vec, r: number): Vec[] {
  const x0 = Math.min(p0.x, p1.x), x1 = Math.max(p0.x, p1.x), y0 = Math.min(p0.y, p1.y), y1 = Math.max(p0.y, p1.y);
  const rr = Math.min(r, (x1 - x0) / 2, (y1 - y0) / 2);
  const o: Vec[] = [];
  const corner = (cx: number, cy: number, a0: number) => {
    for (let i = 0; i <= 6; i++) {
      const an = a0 + (i / 6) * (Math.PI / 2);
      o.push({ x: cx + Math.cos(an) * rr, y: cy + Math.sin(an) * rr });
    }
  };
  corner(x1 - rr, y1 - rr, 0);
  corner(x0 + rr, y1 - rr, Math.PI / 2);
  corner(x0 + rr, y0 + rr, Math.PI);
  corner(x1 - rr, y0 + rr, (3 * Math.PI) / 2);
  o.push(o[0]);
  return o;
}

/** the posterior pharyngeal wall's x at height y (template cm) */
export const wallX = (y: number) => -1.2 - 0.025 * y;

/** facial profile in true body coordinates (the tract's P() compresses the oral region's x, which would flatten the nose) */
export function bodyPoint(model: VoiceModel): (x: number, y: number) => Vec {
  const k = model.tract.scale;
  const ph = model.bodyParams.pharynx;
  return (x: number, y: number): Vec => ({ x: x * k, y: (y < 7 ? 7 - (7 - y) * ph : y) * k });
}

export function buildProfile(model: VoiceModel, f: HumanFrame, a: HumanArtic): Profile {
  const t = model.tract;
  const P = (x: number, y: number) => t.P(x, y);
  const J = jawFn(model, a);
  const k = t.scale;
  const lar = a.larynx * k;
  const B = bodyPoint(model);
  const ulOut = f.upperLip.slice(7); // edge → nose
  const llOut = f.lowerLip.slice(7); // edge → chin
  const neckFront = catmullRom([B(2.3, -4.6), B(2.38, -1.5), B(2.52, 0.4), B(3.0, 1.7), J(5.3, 3.0), J(7.25, 3.35), J(7.95, 4.6), J(7.55, 5.7)], 4);
  const face = catmullRom([ulOut[ulOut.length - 1], B(7.05, 10.6), B(7.75, 10.78), B(8.75, 11.05), B(9.25, 11.65), B(8.95, 12.6), B(8.35, 13.9), B(7.7, 15.0), B(7.95, 16.1), B(7.9, 18.1), B(6.9, 20.5)], 4);
  const cranium = catmullRom([B(6.9, 20.5), B(3.0, 22.9), B(-2.2, 22.7), B(-6.9, 19.6), B(-8.7, 15.4), B(-8.3, 11.9), B(-7.4, 8.9), B(-6.8, 4.8), B(-6.6, 0), B(-6.6, -4.6)], 4);
  const vertebrae: Vec[][] = [];
  for (let i = 0; i < 9; i++) {
    const y0 = -4.4 + i * 1.75;
    if (y0 > 10.5) break;
    const x0 = wallX(y0) - 2.25;
    vertebrae.push(roundRect(P(x0, y0 + 1.4), P(x0 + 1.6, y0), 0.32 * k));
  }
  const palRaw: [number, number][] = [[1.0, 9.6], [1.8, 9.92], [2.7, 10.18], [3.6, 10.3], [4.4, 10.25], [5.1, 10.05], [5.7, 9.72], [6.15, 9.36], [6.55, 9.15], [7.0, 9.6]];
  const palOral = palRaw.map(([x, y]) => t.P(x, y));
  // the mandible's body only: its ramus is lateral, not in the midsagittal plane
  const jb = f.jawBone.filter((p) => p.x > 0.8 * k);
  const g = f.glottis;
  const hy = { x: P(1.6, 0).x, y: P(0, 2.9).y + 0.6 * lar };
  const rings: Vec[][] = [];
  for (let i = 0; i < 4; i++) {
    const y = g.y - (0.9 + i * 1.0) * k;
    if (y < -4.4) break;
    rings.push([{ x: g.x + 0.8 * k, y }, { x: g.x + 1.05 * k, y: y - 0.05 }, { x: g.x + 1.05 * k, y: y - 0.5 * k }, { x: g.x + 0.82 * k, y: y - 0.45 * k }, { x: g.x + 0.8 * k, y }]);
  }
  const origin = J(6.0, 5.45);
  const tc = f.tongueCenter;
  const fibres: Vec[][] = [];
  for (let i = 0; i <= 16; i++) {
    const ang = Math.PI * (0.18 + (0.9 * i) / 16);
    const end = { x: tc.x + Math.cos(ang) * f.tongueRadius * 1.25, y: tc.y + Math.sin(ang) * f.tongueRadius * 1.25 };
    const ctrl = { x: tc.x, y: (tc.y + origin.y) / 2 };
    const c: Vec[] = [];
    for (let j = 0; j <= 12; j++) {
      const u = j / 12;
      c.push({ x: (1 - u) * (1 - u) * origin.x + 2 * (1 - u) * u * ctrl.x + u * u * end.x, y: (1 - u) * (1 - u) * origin.y + 2 * (1 - u) * u * ctrl.y + u * u * end.y });
    }
    fibres.push(c);
  }
  const wallAtGlottis = { x: wallX(g.y / k) * k, y: g.y };
  return {
    f,
    model,
    skinLower: [...neckFront, ...llOut.slice().reverse()],
    skinUpper: [...ulOut, ...face.slice(1), ...cranium.slice(1)],
    inset: catmullRom([B(1.85, -4.6), B(1.9, -0.8), B(2.3, 1.6), J(5.2, 3.6), J(6.9, 3.9), J(7.4, 4.9), J(7.2, 5.9), B(6.6, 9.9), B(7.6, 10.9), B(8.55, 11.5), B(8.1, 13.4), B(7.25, 15.2), B(7.45, 18.0), B(3.0, 22.2), B(-2.0, 22.0), B(-6.3, 19.2), B(-7.9, 15.3), B(-7.6, 12.0), B(-6.7, 8.7), B(-6.1, 4.6), B(-6.0, -4.6)], 3),
    skull: catmullRom([B(7.0, 16.2), B(7.3, 18.5), B(6.0, 20.7), B(3.0, 22.1), B(-2.0, 22.0), B(-6.3, 19.2), B(-7.9, 15.3), B(-7.4, 12.6), B(-4.6, 12.2), B(-2.2, 13.3), B(1.0, 13.7), B(4.1, 14.1), B(6.2, 14.9)], 4),
    brain: catmullRom([B(6.55, 16.3), B(6.75, 18.4), B(5.5, 20.1), B(2.8, 21.4), B(-1.9, 21.3), B(-5.8, 18.8), B(-7.1, 15.4), B(-6.7, 13.1), B(-4.4, 12.8), B(-2.1, 13.9), B(1.0, 14.3), B(4.0, 14.7), B(5.9, 15.4)], 4),
    sulcus: catmullRom([B(5.4, 19.4), B(2.4, 20.5), B(-1.4, 20.4), B(-4.8, 18.4)], 4),
    eye: ellipse(B(6.5, 15.4), 1.1 * k, 0.95 * k),
    eyeC: B(6.5, 15.4),
    vertebrae,
    cords: [[P(-5.3, -4.6), P(-4.5, -4.6), P(-4.5, 11.8), P(-5.1, 12.4), P(-5.6, 11.6)], [P(-5.1, -4.6), P(-4.7, -4.6), P(-4.72, 11.4), P(-5.15, 11.6)]],
    nasal: catmullRom([B(0.3, 11.2), B(1.1, 10.25), B(2.7, 10.75), B(4.6, 10.85), B(6.4, 10.65), B(7.6, 10.85), B(8.45, 11.3), B(8.0, 12.2), B(6.7, 13.4), B(4.4, 13.9), B(1.8, 13.6), B(0.2, 12.6)], 4),
    turbinates: ([[3.0, 11.45, 2.1, 0.32], [3.5, 12.45, 1.9, 0.3], [4.0, 13.3, 1.45, 0.22]] as const).map(([cx, cy, rx, ry]) => ellipse(B(cx, cy), rx * k, ry * k, -0.04)),
    palOral,
    palNasal: palOral.map((p) => ({ x: p.x, y: p.y + 0.55 * k })),
    jawLower: jb,
    jawUpper: jb.map((p) => ({ x: p.x, y: p.y + 0.75 * k })),
    hyoid: ellipse(hy, 0.5 * k, 0.28 * k, 0.3, 28),
    thyroid: [{ x: g.x + 0.75 * k, y: g.y - 1.6 * k }, { x: g.x + 1.75 * k, y: g.y - 0.6 * k }, { x: g.x + 1.95 * k, y: g.y + 1.2 * k }, { x: g.x + 1.45 * k, y: g.y + 1.9 * k }, { x: g.x + 1.15 * k, y: g.y + 1.1 * k }, { x: g.x + 1.3 * k, y: g.y - 0.4 * k }, { x: g.x + 0.75 * k, y: g.y - 1.6 * k }],
    trachea: [[{ x: g.x - 0.65 * k, y: g.y }, { x: g.x - 0.75 * k, y: -4.8 }], [{ x: g.x + 0.75 * k, y: g.y }, { x: g.x + 0.95 * k, y: -4.8 }]],
    rings,
    outerWall: f.outer.filter((p) => p.y > g.y || p.x > 0),
    glottisWall: [wallAtGlottis, f.outer.find((p) => p.y > g.y) ?? wallAtGlottis],
    fibres,
    folds: [
      [{ x: g.x - 0.62 * k, y: g.y + 0.05 }, { x: g.x - 0.1, y: g.y + 0.12 * k }, { x: g.x - 0.62 * k, y: g.y + 0.32 * k }, { x: g.x - 0.62 * k, y: g.y + 0.05 }],
      [{ x: g.x + 0.72 * k, y: g.y + 0.05 }, { x: g.x + 0.12, y: g.y + 0.12 * k }, { x: g.x + 0.72 * k, y: g.y + 0.32 * k }, { x: g.x + 0.72 * k, y: g.y + 0.05 }],
    ],
    lowerTeeth: [...f.lowerTeeth, J(6.8, 6.0), J(6.4, 6.2), f.lowerTeeth[0]],
  };
}

/**
 * Where the eye looks: it holds still for a few seconds, then darts somewhere new (a saccade),
 * and every so often back to straight ahead. Pitch is up (+) and down; yaw is out of the
 * midsagittal plane (towards the viewer of the side view).
 */
export class Gaze {
  pitch = 0;
  yaw = 0;
  private toPitch = 0;
  private toYaw = 0;
  private next = 2;

  update(clock: number, dt: number): void {
    if (clock >= this.next) {
      const centre = Math.random() < 0.35;
      this.toPitch = centre ? 0 : (Math.random() * 2 - 1) * 0.55;
      this.toYaw = centre ? 0 : (Math.random() * 2 - 1) * 0.9;
      this.next = clock + 1.2 + Math.random() * 3.5;
    }
    const ease = 1 - Math.exp(-dt * 28);
    this.pitch += (this.toPitch - this.pitch) * ease;
    this.yaw += (this.toYaw - this.yaw) * ease;
  }
}
