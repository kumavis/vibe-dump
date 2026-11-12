/**
 * Glowing beams in 3D: an immediate-mode line kit over three.js fat lines, the 3D twin of the
 * canvas kit in vector.ts. Each frame the renderer begins, adds polylines (body cm) in a colour,
 * width and alpha, and ends; the segments go into one instanced buffer per line width.
 *
 * Lines blend by maximum, not by adding: a polyline's segments overlap at every joint, and adding
 * would bead each joint. Max blending also keeps a dense wireframe from bleaching to white where
 * many lines converge (the silhouette of a shell). Scene fog dims lines with depth.
 * Colours are the palette's sRGB values passed straight through (the renderer outputs them
 * untransformed), so a beam here matches the same beam on a 2D screen.
 */
import * as THREE from "three";
import { LineSegments2 } from "three/addons/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/addons/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/addons/lines/LineMaterial.js";
import { core } from "../colors.ts";

/** line widths (CSS px) the batches draw at; a beam takes the nearest */
const WIDTHS = [0.6, 0.85, 1.05, 1.3, 1.6, 2.1];

/** A growable polyline of xyz points, reused between frames. */
export class Poly {
  a = new Float32Array(3 * 256);
  n = 0;
  reset(): this {
    this.n = 0;
    return this;
  }
  p(x: number, y: number, z: number): this {
    if (3 * this.n + 3 > this.a.length) {
      const b = new Float32Array(this.a.length * 2);
      b.set(this.a);
      this.a = b;
    }
    const i = 3 * this.n++;
    this.a[i] = x;
    this.a[i + 1] = y;
    this.a[i + 2] = z;
    return this;
  }
}

class Batch {
  readonly mesh: LineSegments2;
  private geo = new LineSegmentsGeometry();
  private pos = new Float32Array(0);
  private col = new Float32Array(0);
  private pb: THREE.InstancedInterleavedBuffer | null = null;
  private cb: THREE.InstancedInterleavedBuffer | null = null;
  private cap = 0;
  n = 0;

  constructor(readonly material: LineMaterial) {
    this.mesh = new LineSegments2(this.geo, material);
    this.mesh.frustumCulled = false;
    this.grow(2048);
  }

  private grow(cap: number): void {
    const pos = new Float32Array(cap * 6), col = new Float32Array(cap * 6);
    pos.set(this.pos.subarray(0, this.n * 6));
    col.set(this.col.subarray(0, this.n * 6));
    this.pos = pos;
    this.col = col;
    this.cap = cap;
    // a fresh geometry: three keeps a GPU buffer per attribute, and the old ones go with it
    this.geo.dispose();
    this.geo = new LineSegmentsGeometry();
    const pb = (this.pb = new THREE.InstancedInterleavedBuffer(pos, 6, 1).setUsage(THREE.DynamicDrawUsage));
    const cb = (this.cb = new THREE.InstancedInterleavedBuffer(col, 6, 1).setUsage(THREE.DynamicDrawUsage));
    this.geo.setAttribute("instanceStart", new THREE.InterleavedBufferAttribute(pb, 3, 0));
    this.geo.setAttribute("instanceEnd", new THREE.InterleavedBufferAttribute(pb, 3, 3));
    this.geo.setAttribute("instanceColorStart", new THREE.InterleavedBufferAttribute(cb, 3, 0));
    this.geo.setAttribute("instanceColorEnd", new THREE.InterleavedBufferAttribute(cb, 3, 3));
    this.mesh.geometry = this.geo;
  }

  seg(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, r: number, g: number, b: number): void {
    if (this.n >= this.cap) this.grow(this.cap * 2);
    const i = this.n++ * 6, p = this.pos, c = this.col;
    p[i] = x0;
    p[i + 1] = y0;
    p[i + 2] = z0;
    p[i + 3] = x1;
    p[i + 4] = y1;
    p[i + 5] = z1;
    c[i] = c[i + 3] = r;
    c[i + 1] = c[i + 4] = g;
    c[i + 2] = c[i + 5] = b;
  }

  commit(): void {
    this.geo.instanceCount = this.n;
    this.mesh.visible = this.n > 0;
    for (const buf of [this.pb!, this.cb!]) {
      buf.clearUpdateRanges();
      buf.addUpdateRange(0, this.n * 6);
      buf.needsUpdate = true;
    }
  }

  dispose(): void {
    this.geo.dispose();
    this.material.dispose();
  }
}

const rgbCache = new Map<string, [number, number, number]>();
function rgb(hex: string): [number, number, number] {
  let c = rgbCache.get(hex);
  if (!c) {
    const v = parseInt(hex.slice(1), 16);
    c = [((v >> 16) & 255) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
    rgbCache.set(hex, c);
  }
  return c;
}

export interface Beam3Opts {
  alpha?: number;
  /** whitish core, for the brightest lines */
  hot?: boolean;
  close?: boolean;
}

export class Beams {
  readonly group = new THREE.Group();
  private readonly batches: Batch[];

  constructor() {
    this.batches = WIDTHS.map((w) => {
      const m = new LineMaterial({ linewidth: w, vertexColors: true, transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
      m.blending = THREE.CustomBlending;
      m.blendEquation = THREE.MaxEquation;
      m.fog = true;
      const b = new Batch(m);
      this.group.add(b.mesh);
      return b;
    });
  }

  /** the canvas size in CSS px (the fat lines' widths are in CSS px) */
  setResolution(w: number, h: number): void {
    for (const b of this.batches) b.material.resolution.set(w, h);
  }

  begin(): void {
    for (const b of this.batches) b.n = 0;
  }

  end(): void {
    for (const b of this.batches) b.commit();
  }

  private batch(width: number): Batch {
    let best = 0;
    for (let i = 1; i < WIDTHS.length; i++) if (Math.abs(WIDTHS[i] - width) < Math.abs(WIDTHS[best] - width)) best = i;
    return this.batches[best];
  }

  /** a polyline through the first n points of a flat xyz array */
  line(a: ArrayLike<number>, n: number, color: string, width: number, o: Beam3Opts = {}): void {
    if (n < 2) return;
    const al = o.alpha ?? 1;
    this.strokes(a, n, rgb(color), al, this.batch(width), o.close ?? false);
    if (o.hot) this.strokes(a, n, rgb(core(color)), al, this.batch(width * 0.42), o.close ?? false);
  }

  poly(p: Poly, color: string, width: number, o: Beam3Opts = {}): void {
    this.line(p.a, p.n, color, width, o);
  }

  /** one segment */
  seg(x0: number, y0: number, z0: number, x1: number, y1: number, z1: number, color: string, width: number, alpha = 1): void {
    const [r, g, b] = rgb(color);
    this.batch(width).seg(x0, y0, z0, x1, y1, z1, r * alpha, g * alpha, b * alpha);
  }

  private strokes(a: ArrayLike<number>, n: number, [r, g, b]: [number, number, number], al: number, bt: Batch, close: boolean): void {
    r *= al;
    g *= al;
    b *= al;
    for (let i = 0; i < n - 1; i++) {
      const j = 3 * i;
      bt.seg(a[j], a[j + 1], a[j + 2], a[j + 3], a[j + 4], a[j + 5], r, g, b);
    }
    if (close) {
      const j = 3 * (n - 1);
      bt.seg(a[j], a[j + 1], a[j + 2], a[0], a[1], a[2], r, g, b);
    }
  }

  dispose(): void {
    for (const b of this.batches) b.dispose();
  }
}
