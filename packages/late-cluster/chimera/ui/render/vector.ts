/**
 * Drawing kit for the vector-display screens: glowing beams, Hershey labels, handles, IPA
 * glyphs drawn as strokes, and the shared glow pass. Coordinates are CSS pixels (the context is
 * pre-scaled by usePhosphor / the anatomy view).
 *
 * Beams are drawn additively ("lighter"), so where lines cross they get brighter, like a beam.
 */
import { V, core } from "../colors.ts";

export type Pt = [number, number];

/** Hershey Simplex first; anything it lacks (IPA, ², ×) falls back to Archivo, which covers IPA. */
export const HERSHEY = '"Hershey", "Archivo", system-ui, sans-serif';
export const hfont = (size: number, weight: "l" | "m" = "l") => `${weight === "m" ? 500 : 300} ${size}px ${HERSHEY}`;

const hasLetterSpacing = typeof CanvasRenderingContext2D !== "undefined" && "letterSpacing" in CanvasRenderingContext2D.prototype;

export interface BeamOpts {
  alpha?: number;
  /** whitish core, for the brightest lines */
  hot?: boolean;
  dash?: number[];
  close?: boolean;
}

/** a path through screen points */
export function pathOf(pts: ArrayLike<Pt>, close = false): Path2D {
  const p = new Path2D();
  if (pts.length === 0) return p;
  p.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
  if (close) p.closePath();
  return p;
}

/** stroke a path as a glowing beam */
export function beam(ctx: CanvasRenderingContext2D, path: Path2D, color: string, width: number, o: BeamOpts = {}): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = o.alpha ?? 1;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.setLineDash(o.dash ?? []);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.stroke(path);
  if (o.hot) {
    // the whitish core is laid over the line, not added to it (adding saturates to white)
    ctx.globalCompositeOperation = "source-over";
    ctx.strokeStyle = core(color);
    ctx.lineWidth = width * 0.42;
    ctx.stroke(path);
  }
  ctx.restore();
}

/** beam through points */
export function beamPts(ctx: CanvasRenderingContext2D, pts: ArrayLike<Pt>, color: string, width: number, o: BeamOpts = {}): void {
  if (pts.length < 2) return;
  beam(ctx, pathOf(pts, o.close), color, width, o);
}

/** a single straight segment */
export function seg(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, color: string, width: number, o: BeamOpts = {}): void {
  const p = new Path2D();
  p.moveTo(x0, y0);
  p.lineTo(x1, y1);
  beam(ctx, p, color, width, o);
}

export function ring(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, width = 1.2, o: BeamOpts = {}): void {
  const p = new Path2D();
  p.arc(x, y, r, 0, Math.PI * 2);
  beam(ctx, p, color, width, o);
}

export function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, alpha = 1): void {
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

/** a handle: ring with crosshair ticks */
export function handle(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 7, alpha = 1): void {
  const t = 4;
  const p = new Path2D();
  p.arc(x, y, r, 0, Math.PI * 2);
  p.moveTo(x - r - t, y);
  p.lineTo(x - r + 2, y);
  p.moveTo(x + r - 2, y);
  p.lineTo(x + r + t, y);
  p.moveTo(x, y - r - t);
  p.lineTo(x, y - r + 2);
  p.moveTo(x, y + r - 2);
  p.lineTo(x, y + r + t);
  beam(ctx, p, color, 1.25, { alpha });
}

export interface LabelOpts {
  size?: number;
  color?: string;
  align?: CanvasTextAlign;
  baseline?: CanvasTextBaseline;
  weight?: "l" | "m";
  /** letter spacing as a fraction of the size */
  ls?: number;
  alpha?: number;
  /**
   * text in flight, meant to pass over other text or off the edge (a word flying off the lips);
   * tools/layout-lint.ts skips it
   */
  moving?: boolean;
}

/** Hershey text (pass capitals for chrome-style labels) */
export function label(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, o: LabelOpts = {}): void {
  const size = o.size ?? 11;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  ctx.globalAlpha = o.alpha ?? 1;
  ctx.font = hfont(size, o.weight);
  if (hasLetterSpacing) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${((o.ls ?? 0.14) * size).toFixed(2)}px`;
  ctx.textAlign = o.align ?? "left";
  ctx.textBaseline = o.baseline ?? "alphabetic";
  ctx.fillStyle = o.color ?? V.blue;
  const c = ctx as CanvasRenderingContext2D & { layoutMoving?: boolean };
  if (o.moving) c.layoutMoving = true;
  ctx.fillText(text, x, y);
  c.layoutMoving = undefined;
  ctx.restore();
}

/** Width of a label as label() would draw it (same font and letter spacing). */
export function labelWidth(ctx: CanvasRenderingContext2D, text: string, o: LabelOpts = {}): number {
  const size = o.size ?? 11;
  ctx.save();
  ctx.font = hfont(size, o.weight);
  if (hasLetterSpacing) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${((o.ls ?? 0.14) * size).toFixed(2)}px`;
  const wd = ctx.measureText(text).width;
  ctx.restore();
  return wd;
}

/** Words of a label broken into lines no wider than maxW. */
export function wrapLabel(ctx: CanvasRenderingContext2D, text: string, maxW: number, o: LabelOpts = {}): string[] {
  const lines: string[] = [];
  for (const word of text.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && labelWidth(ctx, `${last} ${word}`, o) <= maxW) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

/** line height of labelBlock() */
export const blockLineH = (size = 11) => size * 1.6;

/**
 * A message wrapped to maxW with its lines centred on y (placeholders like "start audio to see
 * them vibrate"), so it never runs off a narrow screen.
 */
export function labelBlock(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, o: LabelOpts = {}): void {
  const size = o.size ?? 11;
  const lines = wrapLabel(ctx, text, maxW, o);
  const lh = blockLineH(size);
  const y0 = y - ((lines.length - 1) * lh) / 2 + size * 0.35;
  lines.forEach((line, i) => label(ctx, line, x, y0 + i * lh, o));
}

/** Chaikin corner cutting (closed shapes), for soft tissue the engine gives as coarse polygons */
export function chaikin(p: Pt[], it = 2): Pt[] {
  let q = p.length > 1 && p[0][0] === p[p.length - 1][0] && p[0][1] === p[p.length - 1][1] ? p.slice(0, -1) : p.slice();
  for (let k = 0; k < it; k++) {
    const o: Pt[] = [];
    for (let i = 0; i < q.length; i++) {
      const a = q[i], b = q[(i + 1) % q.length];
      o.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    }
    q = o;
  }
  return q.length ? [...q, q[0]] : q;
}

// ------------------------------------------------------------------ IPA as strokes
// Latin letters come from the Hershey font; vowels it lacks are built from strokes or from font
// glyphs turned and mirrored; anything else falls back to the font stack (Archivo has IPA).

/** Draw an IPA symbol centred on x with its baseline at y. Decorative: give the screen a text equivalent. */
export function ipaGlyph(ctx: CanvasRenderingContext2D, x: number, y: number, ipa: string, size: number, color: string, alpha = 1): void {
  const xh = size * 0.5;
  const r = xh * 0.48;
  const cy = y - xh / 2;
  const sw = Math.max(0.9, size * 0.07);
  const f = (n: number) => n.toFixed(2);
  const stroke = (d: string) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = sw;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke(new Path2D(d));
    ctx.restore();
  };
  const glyph = (s: string, tf?: (c: CanvasRenderingContext2D) => void) => {
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = alpha;
    ctx.font = hfont(size);
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = color;
    if (tf) tf(ctx);
    ctx.fillText(s, tf ? 0 : x, tf ? 0 : y);
    ctx.restore();
  };
  const turned = (c: CanvasRenderingContext2D) => {
    c.translate(x, cy);
    c.rotate(Math.PI);
    c.translate(0, xh / 2);
  };
  const mirrored = (c: CanvasRenderingContext2D) => {
    c.translate(x, y);
    c.scale(-1, 1);
  };
  const bowl = (c: number) => `M${f(c + r)} ${f(cy)}A${f(r)} ${f(xh / 2)} 0 1 0 ${f(c - r)} ${f(cy)}A${f(r)} ${f(xh / 2)} 0 1 0 ${f(c + r)} ${f(cy)}`;
  switch (ipa) {
    case "ɑ": { const c = x - 0.06 * size; return stroke(bowl(c) + `M${f(c + r)} ${f(y - xh)}L${f(c + r)} ${f(y)}`); }
    case "ɒ": { const c = x + 0.06 * size; return stroke(bowl(c) + `M${f(c - r)} ${f(y - xh)}L${f(c - r)} ${f(y)}`); }
    case "ɪ": return stroke(`M${f(x)} ${f(y - xh)}L${f(x)} ${f(y)}M${f(x - xh * 0.3)} ${f(y - xh)}L${f(x + xh * 0.3)} ${f(y - xh)}M${f(x - xh * 0.3)} ${f(y)}L${f(x + xh * 0.3)} ${f(y)}`);
    case "ɛ": return stroke(`M${f(x + r * 0.9)} ${f(y - xh * 0.92)}Q${f(x - r * 1.1)} ${f(y - xh * 1.08)} ${f(x - r * 0.25)} ${f(cy)}Q${f(x - r * 1.3)} ${f(y + xh * 0.1)} ${f(x + r * 0.95)} ${f(y - xh * 0.06)}`);
    case "ɜ": return stroke(`M${f(x - r * 0.9)} ${f(y - xh * 0.92)}Q${f(x + r * 1.1)} ${f(y - xh * 1.08)} ${f(x + r * 0.25)} ${f(cy)}Q${f(x + r * 1.3)} ${f(y + xh * 0.1)} ${f(x - r * 0.95)} ${f(y - xh * 0.06)}`);
    case "ɝ": return stroke(`M${f(x - r * 0.9)} ${f(y - xh * 0.92)}Q${f(x + r * 1.1)} ${f(y - xh * 1.08)} ${f(x + r * 0.25)} ${f(cy)}Q${f(x + r * 1.3)} ${f(y + xh * 0.1)} ${f(x - r * 0.95)} ${f(y - xh * 0.06)}M${f(x + r * 0.55)} ${f(cy - xh * 0.1)}Q${f(x + r * 1.4)} ${f(cy - xh * 0.5)} ${f(x + r * 1.5)} ${f(cy - xh * 0.15)}`);
    case "ʊ": return stroke(`M${f(x - r * 1.15)} ${f(y - xh)}Q${f(x - r * 0.5)} ${f(y - xh * 0.9)} ${f(x - r * 0.75)} ${f(cy)}Q${f(x - r)} ${f(y)} ${f(x)} ${f(y)}Q${f(x + r)} ${f(y)} ${f(x + r * 0.75)} ${f(cy)}Q${f(x + r * 0.5)} ${f(y - xh * 0.9)} ${f(x + r * 1.15)} ${f(y - xh)}`);
    case "ʌ": return stroke(`M${f(x - r)} ${f(y)}L${f(x)} ${f(y - xh)}L${f(x + r)} ${f(y)}`);
    case "ɤ": return stroke(`M${f(x - r)} ${f(y - xh)}L${f(x)} ${f(y - xh * 0.1)}L${f(x + r)} ${f(y - xh)}M${f(x)} ${f(y - xh * 0.1)}Q${f(x - r * 0.5)} ${f(y + xh * 0.4)} ${f(x)} ${f(y + xh * 0.45)}Q${f(x + r * 0.5)} ${f(y + xh * 0.4)} ${f(x)} ${f(y - xh * 0.1)}`);
    case "ʃ": return stroke(`M${f(x + r * 0.9)} ${f(y - xh * 1.9)}Q${f(x)} ${f(y - xh * 2.2)} ${f(x)} ${f(y - xh)}L${f(x)} ${f(y + xh * 0.3)}Q${f(x)} ${f(y + xh * 0.95)} ${f(x - r * 0.9)} ${f(y + xh * 0.7)}`);
    case "θ": return stroke(`M${f(x + r)} ${f(y - xh)}A${f(r)} ${f(xh)} 0 1 0 ${f(x - r)} ${f(y - xh)}A${f(r)} ${f(xh)} 0 1 0 ${f(x + r)} ${f(y - xh)}M${f(x - r)} ${f(y - xh)}L${f(x + r)} ${f(y - xh)}`);
    case "ŋ": return stroke(`M${f(x - r)} ${f(y)}L${f(x - r)} ${f(y - xh)}M${f(x - r)} ${f(y - xh * 0.6)}Q${f(x - r * 0.2)} ${f(y - xh * 1.1)} ${f(x + r * 0.6)} ${f(y - xh * 0.9)}Q${f(x + r)} ${f(y - xh * 0.75)} ${f(x + r)} ${f(y - xh * 0.4)}L${f(x + r)} ${f(y + xh * 0.4)}Q${f(x + r)} ${f(y + xh * 0.85)} ${f(x + r * 0.3)} ${f(y + xh * 0.8)}`);
    case "ə": return stroke(`M${f(x - r)} ${f(cy)}L${f(x + r)} ${f(cy)}A${f(r)} ${f(xh / 2)} 0 1 1 ${f(x - r * 0.75)} ${f(y - xh * 0.85)}`);
    case "ɐ": return glyph("a", turned);
    case "ɔ": return glyph("c", mirrored);
    case "ɯ": return glyph("m", turned);
    case "ɨ": glyph("i"); return stroke(`M${f(x - r * 0.8)} ${f(cy)}L${f(x + r * 0.8)} ${f(cy)}`);
    case "ø": glyph("o"); return stroke(`M${f(x - r * 1.1)} ${f(y + xh * 0.1)}L${f(x + r * 1.1)} ${f(y - xh * 1.1)}`);
    case "æ": return glyph("æ");
    case "œ": return glyph("œ");
    default: return glyph(ipa);
  }
}

// ------------------------------------------------------------------ the glow
/**
 * One reduced-resolution glow layer: the finished frame is copied down, blurred there (cheap:
 * a fraction of the pixels), and added back on top. sigma is the halo radius in CSS px.
 */
export class Glow {
  private readonly small: HTMLCanvasElement;
  private readonly sctx: CanvasRenderingContext2D;
  private readonly canFilter: boolean;
  constructor(
    private readonly sigma = 2,
    private readonly alpha = 0.75,
    private readonly down = 4,
  ) {
    this.small = document.createElement("canvas");
    this.sctx = this.small.getContext("2d")!;
    this.canFilter = typeof this.sctx.filter === "string";
  }

  apply(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, dpr: number): void {
    const W = canvas.width, H = canvas.height;
    const w = Math.max(1, Math.round(W / this.down)), h = Math.max(1, Math.round(H / this.down));
    if (this.small.width !== w || this.small.height !== h) {
      this.small.width = w;
      this.small.height = h;
    }
    const s = this.sctx;
    s.setTransform(1, 0, 0, 1, 0, 0);
    s.globalCompositeOperation = "copy";
    if (this.canFilter) s.filter = `blur(${((this.sigma * dpr) / this.down).toFixed(2)}px)`;
    s.drawImage(canvas, 0, 0, w, h);
    if (this.canFilter) s.filter = "none";
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    // screen, not add: the halo brightens around a line without bleaching the line itself
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = this.alpha;
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(this.small, 0, 0, W, H);
    ctx.restore();
  }
}
