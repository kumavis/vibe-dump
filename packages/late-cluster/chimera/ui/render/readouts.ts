/**
 * The face screen's readouts: formants and info lines in one corner, and four OP-1 style slots
 * (big numerals in each control's colour). Shared by the 2D and 3D anatomy views.
 */
import { TEXT, V } from "../colors.ts";
import { dot, ipaGlyph, label } from "./vector.ts";

/** an OP-1 style readout in the space under the chin */
export interface Slot {
  label: string;
  value: string;
  unit?: string;
  color: string;
  /** value is an IPA symbol, drawn as strokes */
  ipa?: boolean;
}

export interface ReadoutLayout {
  /** canvas size in CSS px */
  w: number;
  h: number;
  /** a narrow screen (a phone): readouts in a row above the head, slots in a row below it */
  compact: boolean;
  /** top-left of the 2×2 slot grid (wide layout); the grid fills from there to the bottom right */
  slotX: number;
  slotY: number;
}

export function drawReadouts(ctx: CanvasRenderingContext2D, layout: ReadoutLayout, formants: number[], info: string[], slots: Slot[]): void {
  if (layout.compact) return drawReadoutsCompact(ctx, layout, formants, info, slots);
  const { w, h } = layout;
  const fx = w - 18;
  let y = 26;
  if (formants.length >= 3) {
    ["F1", "F2", "F3"].forEach((lab, i) => {
      label(ctx, lab, fx - 78, y + i * 22, { size: 12, color: V.amber, ls: 0.12, alpha: 0.75 });
      label(ctx, String(Math.round(formants[i])), fx, y + i * 22, { size: 15, color: V.amber, align: "right", ls: 0.08 });
    });
    label(ctx, "HZ", fx, y + 64, { size: 10, color: V.amber, align: "right", alpha: 0.6 });
    y += 110;
  }
  for (const s of info) {
    label(ctx, s, fx, y, { size: 10, color: TEXT.secondary, align: "right", ls: 0.14 });
    y += 16;
  }
  if (!slots.length) return;
  const gx0 = layout.slotX, gy0 = layout.slotY;
  const cellW = Math.max(60, (w - 14 - gx0) / 2);
  const cellH = Math.max(56, Math.min(112, (h - 8 - gy0) / 2));
  const big = Math.max(22, Math.min(44, cellH * 0.4, cellW * 0.32));
  slots.slice(0, 4).forEach((s, i) => {
    const cx = gx0 + (i % 2) * cellW, cy = gy0 + Math.floor(i / 2) * cellH;
    dot(ctx, cx + 6, cy + 4, 4, s.color);
    label(ctx, s.label.toUpperCase(), cx + 16, cy + 8, { size: 11, color: s.color, ls: 0.2, alpha: 0.85 });
    const by = cy + 18 + big * 1.1;
    if (s.ipa) ipaGlyph(ctx, cx + big * 0.6, by, s.value, big * 1.45, s.color);
    else label(ctx, s.value.toUpperCase(), cx, by, { size: s.value.length > 3 ? big * 0.82 : big, color: s.color, weight: "m", ls: 0.04 });
    if (s.unit) label(ctx, s.unit.toUpperCase(), s.ipa ? cx + big * 1.5 : cx + (s.value.length > 3 ? 0 : big * 1.64), s.ipa || s.value.length <= 3 ? by : by + 18, { size: 11, color: s.color, ls: 0.16, alpha: 0.7 });
  });
}

/** narrow screens: formants and info in two rows on top, the four slots in a row at the bottom */
function drawReadoutsCompact(ctx: CanvasRenderingContext2D, layout: ReadoutLayout, formants: number[], info: string[], slots: Slot[]): void {
  const { w, h } = layout;
  if (formants.length >= 3) {
    const cw = (w - 24) / 3;
    ["F1", "F2", "F3"].forEach((lab, i) => {
      label(ctx, lab, 12 + i * cw, 18, { size: 10, color: V.amber, ls: 0.12, alpha: 0.75 });
      label(ctx, String(Math.round(formants[i])), 12 + i * cw + 26, 18, { size: 13, color: V.amber, ls: 0.06 });
    });
  }
  label(ctx, info.slice(0, 2).join("   "), 12, 36, { size: 9, color: TEXT.secondary, ls: 0.12 });
  if (info.length > 2) label(ctx, info.slice(2).join("   "), 12, 50, { size: 9, color: TEXT.secondary, ls: 0.12 });
  const four = slots.slice(0, 4);
  if (!four.length) return;
  const cw = (w - 24) / four.length, y0 = h - 82;
  const big = Math.max(16, Math.min(30, cw * 0.28));
  four.forEach((s, i) => {
    const cx = 12 + i * cw;
    dot(ctx, cx + 4, y0, 3, s.color);
    label(ctx, s.label.toUpperCase(), cx + 12, y0 + 3, { size: 8, color: s.color, ls: 0.14, alpha: 0.85 });
    const by = y0 + 18 + big;
    if (s.ipa) ipaGlyph(ctx, cx + big * 0.5, by, s.value, big * 1.4, s.color);
    else label(ctx, s.value.toUpperCase(), cx, by, { size: s.value.length > 3 ? big * 0.62 : big, color: s.color, weight: "m", ls: 0.02 });
    if (s.unit) label(ctx, s.unit.toUpperCase(), cx, by + 16, { size: 8, color: s.color, ls: 0.14, alpha: 0.7 });
  });
}
