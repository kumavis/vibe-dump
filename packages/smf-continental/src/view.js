/* =====================================================================
   SMF 06 · CONTINENTAL — VIEW LAYER
   Canvas 2D only. Reads the sim each frame, owns zero game state.

   LOD tiers by zoom (scale = px per world unit):
     tier 2  scale < 2.2   field + province aggregates (the organism map)
     tier 1  2.2 – 9       structure quads over the field
     tier 0  scale ≥ 9     typed structures + clock-derived token dots
   The camera glides between them; structures fade in across the band so
   continent → machine is one continuous gesture.

   Structures are found through the sim's per-block buckets — only the
   buckets under the viewport are ever iterated, never the full 50k list.
   ===================================================================== */

import {
  WORLD, TS, NX, NZ, NCELLS, BS, NBX, NBZ, P,
} from './sim.js';

const COL = {
  bg: '#0b0e11',
  fieldR: 59, fieldG: 159, fieldB: 217,           // #3b9fd9 — the organism
  oreRing: 'rgba(217,162,90,',                     // amber terrain
  active: '#e0973a', smelter: '#b05537', dormant: '#4d565c',
  rig: '#55d6f0', rigDim: '#2a6b7d',
  token: '#e6c15a', pulse: '#8fe9ff',
  resorb: '#d96b6b', ghost: '#4a90d9',
};

const ST_ACTIVE = 0, ST_DORMANT = 1, ST_GONE = 2;
const TY_MINER = 0, TY_SMELTER = 1, TY_RIG = 2;
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
const frac = (v) => v - Math.floor(v);

export function createView(canvas, sim) {
  const ctx = canvas.getContext('2d', { alpha: false });
  const state = sim.state;

  /* ---------------------------------------------------------- camera */
  const cam = {
    cx: WORLD.w / 2, cz: WORLD.h / 2,
    scale: 0.8, tScale: 0.8, minScale: 0.5, maxScale: 26,
    anchorSX: 0, anchorSY: 0, anchorWX: 0, anchorWZ: 0, gliding: false,
  };
  let vw = 2, vh = 2, dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    vw = canvas.clientWidth || canvas.parentElement.clientWidth || 800;
    vh = canvas.clientHeight || canvas.parentElement.clientHeight || 600;
    canvas.width = Math.max(2, Math.round(vw * dpr));
    canvas.height = Math.max(2, Math.round(vh * dpr));
    cam.minScale = Math.min(vw / WORLD.w, vh / WORLD.h) * 0.92;
    if (cam.tScale < cam.minScale) cam.tScale = cam.minScale;
    if (cam.scale < cam.minScale) cam.scale = cam.minScale;
  }

  const s2wX = (mx) => cam.cx + (mx - vw / 2) / cam.scale;
  const s2wZ = (my) => cam.cz + (my - vh / 2) / cam.scale;
  const w2sX = (wx) => (wx - cam.cx) * cam.scale + vw / 2;
  const w2sZ = (wz) => (wz - cam.cz) * cam.scale + vh / 2;

  function zoomAt(mx, my, factor) {
    cam.tScale = clamp(cam.tScale * factor, cam.minScale, cam.maxScale);
    cam.anchorSX = mx; cam.anchorSY = my;
    cam.anchorWX = s2wX(mx); cam.anchorWZ = s2wZ(my);
    cam.gliding = true;
  }
  function panBy(dxPx, dyPx) {
    cam.cx -= dxPx / cam.scale;
    cam.cz -= dyPx / cam.scale;
    clampCam();
    if (cam.gliding) { cam.anchorWX = s2wX(cam.anchorSX); cam.anchorWZ = s2wZ(cam.anchorSY); }
  }
  function clampCam() {
    const mx = vw / (2 * cam.scale), mz = vh / (2 * cam.scale);
    cam.cx = clamp(cam.cx, Math.min(mx, WORLD.w / 2), Math.max(WORLD.w - mx, WORLD.w / 2));
    cam.cz = clamp(cam.cz, Math.min(mz, WORLD.h / 2), Math.max(WORLD.h - mz, WORLD.h / 2));
  }

  /* --------------------------------------------- field image pipeline */
  const fieldCanvas = document.createElement('canvas');
  fieldCanvas.width = NX; fieldCanvas.height = NZ;
  const fctx = fieldCanvas.getContext('2d');
  const img = fctx.createImageData(NX, NZ);
  const px32 = new Uint32Array(img.data.buffer);

  // static ground: dark bg + faint warm tint over ore provinces
  const baseR = new Uint8Array(NCELLS), baseG = new Uint8Array(NCELLS), baseB = new Uint8Array(NCELLS);
  {
    baseR.fill(11); baseG.fill(14); baseB.fill(17);
    for (const p of state.provinces) {
      const cx = p.x / TS, cz = p.z / TS, rT = p.r / TS;
      const g0x = Math.max(0, Math.floor(cx - rT)), g1x = Math.min(NX - 1, Math.ceil(cx + rT));
      const g0z = Math.max(0, Math.floor(cz - rT)), g1z = Math.min(NZ - 1, Math.ceil(cz + rT));
      for (let gz = g0z; gz <= g1z; gz++) {
        for (let gx = g0x; gx <= g1x; gx++) {
          const d2 = (gx + 0.5 - cx) ** 2 + (gz + 0.5 - cz) ** 2;
          if (d2 > rT * rT) continue;
          const i = gx + gz * NX;
          baseR[i] = 24; baseG[i] = 21; baseB[i] = 19;
        }
      }
    }
    // seed pixels once so the very first frame is already the continent
    for (let i = 0; i < NCELLS; i++) px32[i] = (255 << 24) | (baseB[i] << 16) | (baseG[i] << 8) | baseR[i];
  }

  // display field: lerped toward the sim field so slow field cadence
  // never shows as stepping (pure presentation state, not game state)
  const disp = new Float32Array(NCELLS);
  disp.set(state.field);
  let litCells = 0;

  function drawField(dtReal) {
    const f = state.field;
    // visible cell rect (+1 halo for smooth drawImage edges)
    const cx0 = clamp(Math.floor(s2wX(0) / TS) - 1, 0, NX - 1);
    const cx1 = clamp(Math.ceil(s2wX(vw) / TS) + 1, 0, NX - 1);
    const cz0 = clamp(Math.floor(s2wZ(0) / TS) - 1, 0, NZ - 1);
    const cz1 = clamp(Math.ceil(s2wZ(vh) / TS) + 1, 0, NZ - 1);
    const k = 1 - Math.exp(-dtReal * 7);
    let lit = 0;
    for (let gz = cz0; gz <= cz1; gz++) {
      const row = gz * NX;
      for (let gx = cx0; gx <= cx1; gx++) {
        const i = row + gx;
        const d = disp[i] + (f[i] - disp[i]) * k;
        disp[i] = d;
        if (d > P.litEps) lit++;
        // saturating ramp: deep pools stay rich blue instead of washing
        // out; the 0.04 floor also hides the block-skip's frozen residue
        const q = d < 0.04 ? 0 : (1.3 * (d - 0.04)) / (d + 1.3);
        const r = baseR[i] + ((COL.fieldR * q) | 0);
        const g = baseG[i] + ((COL.fieldG * q) | 0);
        const b = baseB[i] + ((COL.fieldB * q) | 0);
        px32[i] = (255 << 24) | ((b > 255 ? 255 : b) << 16) | ((g > 255 ? 255 : g) << 8) | (r > 255 ? 255 : r);
      }
    }
    litCells = lit;
    fctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; // the field is a fluid at every zoom
    const sx = cx0, sy = cz0, sw = cx1 - cx0 + 1, sh = cz1 - cz0 + 1;
    ctx.drawImage(
      fieldCanvas, sx, sy, sw, sh,
      w2sX(sx * TS), w2sZ(sy * TS), sw * TS * cam.scale, sh * TS * cam.scale,
    );
    // machine zoom: hairline tile grid gives the field its engineering texture
    if (cam.scale >= 9) {
      ctx.strokeStyle = 'rgba(11,14,17,0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let gx = cx0; gx <= cx1 + 1; gx++) {
        const X = w2sX(gx * TS);
        ctx.moveTo(X, 0); ctx.lineTo(X, vh);
      }
      for (let gz = cz0; gz <= cz1 + 1; gz++) {
        const Y = w2sZ(gz * TS);
        ctx.moveTo(0, Y); ctx.lineTo(vw, Y);
      }
      ctx.stroke();
    }
  }

  /* ------------------------------------------------------- aggregates */
  function drawProvinces(now, aggAlpha) {
    const s = cam.scale;
    for (const p of state.provinces) {
      const sx = w2sX(p.x), sy = w2sZ(p.z);
      const rPx = p.r * s;
      if (sx < -rPx - 40 || sx > vw + rPx + 40 || sy < -rPx - 40 || sy > vh + rPx + 40) continue;
      const rf = p.reserve / p.init;
      // ore terrain ring — always present, it is the geology
      ctx.strokeStyle = COL.oreRing + (0.08 + 0.3 * rf) + ')';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(sx, sy, rPx, 0, 6.2832);
      ctx.stroke();

      if (aggAlpha <= 0.02) continue;
      if (p.pTotal > 0) {
        // activity core: amber organism mass, grey when mostly dormant,
        // red flash while it is being eaten
        const dormFrac = p.pTotal > 0 ? p.pDorm / p.pTotal : 0;
        const flash = now - p.lastResorbT < 1.6;
        const rad = Math.max(1.6, Math.sqrt(p.pTotal) * 0.17 * Math.max(1, s * 0.8));
        ctx.globalAlpha = aggAlpha * (flash ? 0.55 + 0.4 * Math.abs(Math.sin(now * 9)) : 0.85);
        ctx.fillStyle = flash ? COL.resorb : dormFrac > 0.5 ? COL.dormant : COL.active;
        ctx.fillRect(sx - rad, sy - rad, rad * 2, rad * 2);
        if (p.gate) { // cyan signal prick: the rig organ is pouring
          ctx.fillStyle = COL.rig;
          ctx.globalAlpha = aggAlpha;
          ctx.fillRect(sx - 1, sy - 1, 2.5, 2.5);
        }
        ctx.globalAlpha = 1;
      } else if (p.scoutOn) {
        // survey beacon: pulsing cyan diamond over unclaimed ore
        const a = 0.35 + 0.3 * Math.sin(now * 2.6 + p.idx);
        const r2 = 3 + s;
        ctx.globalAlpha = aggAlpha * a;
        ctx.strokeStyle = COL.rig;
        ctx.beginPath();
        ctx.moveTo(sx, sy - r2); ctx.lineTo(sx + r2, sy); ctx.lineTo(sx, sy + r2); ctx.lineTo(sx - r2, sy);
        ctx.closePath();
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    }
  }

  /* --------------------------------------- structures via block buckets */
  const LCAP = 20000;
  const lMiner = new Float32Array(LCAP * 3); // x, y, province (for token drift)
  const lSmelt = new Float32Array(LCAP * 2);
  const lDorm = new Float32Array(LCAP * 2);
  const lRigOn = new Float32Array(2048 * 2);
  const lRigOff = new Float32Array(2048 * 2);

  function drawStructures(now, alpha, tier0) {
    const s = cam.scale;
    const { sx, sz, stype, sstate, sprov, bStart, bItems, provinces } = state;
    const bx0 = clamp(Math.floor(s2wX(0) / (BS * TS)), 0, NBX - 1);
    const bx1 = clamp(Math.floor(s2wX(vw) / (BS * TS)), 0, NBX - 1);
    const bz0 = clamp(Math.floor(s2wZ(0) / (BS * TS)), 0, NBZ - 1);
    const bz1 = clamp(Math.floor(s2wZ(vh) / (BS * TS)), 0, NBZ - 1);
    let nM = 0, nS = 0, nD = 0, nRon = 0, nRoff = 0;
    for (let bz = bz0; bz <= bz1; bz++) {
      for (let bx = bx0; bx <= bx1; bx++) {
        const b = bz * NBX + bx;
        const i0 = bStart[b], i1 = bStart[b + 1];
        for (let j = i0; j < i1; j++) {
          const i = bItems[j];
          const st = sstate[i];
          if (st === ST_GONE) continue;
          const X = w2sX(sx[i]), Y = w2sZ(sz[i]);
          if (st === ST_DORMANT) {
            if (nD < LCAP) { lDorm[nD * 2] = X; lDorm[nD * 2 + 1] = Y; nD++; }
          } else {
            const ty = stype[i];
            if (ty === TY_MINER) { if (nM < LCAP) { lMiner[nM * 3] = X; lMiner[nM * 3 + 1] = Y; lMiner[nM * 3 + 2] = sprov[i]; nM++; } }
            else if (ty === TY_SMELTER) { if (nS < LCAP) { lSmelt[nS * 2] = X; lSmelt[nS * 2 + 1] = Y; nS++; } }
            else if (provinces[sprov[i]].gate) { if (nRon < 2048) { lRigOn[nRon * 2] = X; lRigOn[nRon * 2 + 1] = Y; nRon++; } }
            else if (nRoff < 2048) { lRigOff[nRoff * 2] = X; lRigOff[nRoff * 2 + 1] = Y; nRoff++; }
          }
        }
      }
    }
    const q = clamp(1.9 * s * 0.42, 1.4, 12);
    const h = q / 2;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = COL.dormant;
    for (let i = 0; i < nD; i++) ctx.fillRect(lDorm[i * 2] - h, lDorm[i * 2 + 1] - h, q, q);
    ctx.fillStyle = COL.active;
    for (let i = 0; i < nM; i++) ctx.fillRect(lMiner[i * 3] - h, lMiner[i * 3 + 1] - h, q, q);
    ctx.fillStyle = COL.smelter;
    const qs = q * 1.35, hs = qs / 2;
    for (let i = 0; i < nS; i++) ctx.fillRect(lSmelt[i * 2] - hs, lSmelt[i * 2 + 1] - hs, qs, qs);
    ctx.fillStyle = COL.rigDim;
    for (let i = 0; i < nRoff; i++) ctx.fillRect(lRigOff[i * 2] - h, lRigOff[i * 2 + 1] - h, q, q);
    ctx.fillStyle = COL.rig;
    for (let i = 0; i < nRon; i++) ctx.fillRect(lRigOn[i * 2] - h, lRigOn[i * 2 + 1] - h, q, q);

    if (tier0) {
      // token dots — pure functions of the clock, zero sim state
      // amber matter tokens drift miner → province core; signal ripples
      // ring outward from pouring rigs
      const tokCap = 520;
      let tk = 0;
      ctx.fillStyle = COL.token;
      const provinces2 = state.provinces;
      const step = Math.max(1, Math.floor(nM / tokCap));
      for (let i = 0; i < nM && tk < tokCap; i += step) {
        const p = provinces2[lMiner[i * 3 + 2] | 0];
        const ph = frac(i * 0.61803398875);       // golden-ratio phase hash
        const tt = frac(now * 0.21 + ph);
        const X = lMiner[i * 3] + (w2sX(p.x) - lMiner[i * 3]) * tt;
        const Y = lMiner[i * 3 + 1] + (w2sZ(p.z) - lMiner[i * 3 + 1]) * tt;
        ctx.globalAlpha = alpha * (1 - tt * 0.55);
        ctx.fillRect(X - 1.4, Y - 1.4, 2.8, 2.8);
        tk++;
      }
      // signal ripples from pouring rigs
      ctx.globalAlpha = 1;
      ctx.strokeStyle = COL.pulse;
      ctx.lineWidth = 1;
      for (const p of state.provinces) {
        if (!p.gate) continue;
        const X = w2sX(p.x), Y = w2sZ(p.z);
        if (X < -80 || X > vw + 80 || Y < -80 || Y > vh + 80) continue;
        for (let rN = 0; rN < 2; rN++) {
          const ft = frac(now * 0.5 + rN * 0.5 + p.idx * 0.13);
          ctx.globalAlpha = alpha * (1 - ft) * 0.35;
          ctx.beginPath();
          ctx.arc(X, Y, ft * p.r * 0.4 * s, 0, 6.2832);
          ctx.stroke();
        }
      }
    }
    ctx.globalAlpha = 1;
  }

  /* ------------------------------------------------- player overlays */
  function drawOverlays(now) {
    const s = cam.scale;
    // starve trenches: red dashed scars
    ctx.setLineDash([6, 5]);
    for (const tr of state.trenches) {
      if (!tr.active) continue;
      const a = clamp((tr.until - state.t) / 12, 0, 1);
      const X = w2sX(tr.x), Y = w2sZ(tr.z), R = P.trenchRadT * TS * s;
      if (X < -R || X > vw + R || Y < -R || Y > vh + R) continue;
      ctx.strokeStyle = `rgba(217,107,107,${0.25 + 0.45 * a})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.arc(X, Y, R, 0, 6.2832); ctx.stroke();
      ctx.fillStyle = `rgba(217,107,107,${0.05 * a})`;
      ctx.beginPath(); ctx.arc(X, Y, R, 0, 6.2832); ctx.fill();
    }
    ctx.setLineDash([]);
    // player emitters: cyan wells
    for (const e of state.emitters) {
      if (!e.active) continue;
      const a = clamp((e.until - state.t) / 10, 0, 1) * (0.5 + 0.2 * Math.sin(now * 5));
      const X = w2sX(e.x), Y = w2sZ(e.z), R = P.emitRadT * TS * s;
      if (X < -R || X > vw + R || Y < -R || Y > vh + R) continue;
      ctx.strokeStyle = `rgba(85,214,240,${0.5 * a})`;
      ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.arc(X, Y, R * (0.85 + 0.1 * Math.sin(now * 3)), 0, 6.2832); ctx.stroke();
      ctx.strokeStyle = `rgba(85,214,240,${0.22 * a})`;
      ctx.beginPath(); ctx.arc(X, Y, R * 0.55, 0, 6.2832); ctx.stroke();
    }
  }

  const brush = { mode: 'pan', mx: 0, my: 0, over: false, dragging: false };

  function drawBrush(now) {
    if (!brush.over || brush.mode === 'pan') return;
    const s = cam.scale;
    const pour = brush.mode === 'pour';
    const R = (pour ? P.emitRadT : P.trenchRadT) * TS * s;
    ctx.strokeStyle = pour ? 'rgba(85,214,240,0.75)' : 'rgba(217,107,107,0.75)';
    ctx.lineWidth = 1.3;
    if (!pour) ctx.setLineDash([5, 4]);
    ctx.beginPath(); ctx.arc(brush.mx, brush.my, R, 0, 6.2832); ctx.stroke();
    ctx.setLineDash([]);
    if (brush.dragging) {
      const ft = frac(now * 1.6);
      ctx.globalAlpha = 1 - ft;
      ctx.beginPath(); ctx.arc(brush.mx, brush.my, R * (0.3 + 0.7 * ft), 0, 6.2832); ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  /* ------------------------------------------------------ frame loop */
  let drawMs = 0;

  function tier() { return cam.scale < 2.2 ? 2 : cam.scale < 9 ? 1 : 0; }

  function render(now, dtReal) {
    const t0 = performance.now();
    // camera glide toward target scale, anchored under the cursor
    if (cam.gliding) {
      const k = 1 - Math.exp(-dtReal * 11);
      cam.scale += (cam.tScale - cam.scale) * k;
      if (Math.abs(cam.tScale - cam.scale) < 0.002 * cam.scale) { cam.scale = cam.tScale; cam.gliding = false; }
      cam.cx = cam.anchorWX - (cam.anchorSX - vw / 2) / cam.scale;
      cam.cz = cam.anchorWZ - (cam.anchorSY - vh / 2) / cam.scale;
      clampCam();
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, vw, vh);

    drawField(dtReal);

    const s = cam.scale;
    const structAlpha = clamp((s - 2.0) / 0.9, 0, 1);
    const aggAlpha = 1 - structAlpha; // full crossfade: cores hand off to quads
    drawProvinces(now, aggAlpha);
    if (structAlpha > 0.02) drawStructures(now, structAlpha, s >= 9);
    drawOverlays(now);
    drawBrush(now);

    drawMs += (performance.now() - t0 - drawMs) * 0.08;
  }

  resize();
  window.addEventListener('resize', resize);

  return {
    render, resize, cam, brush, tier, zoomAt, panBy,
    screenToWorld: (mx, my) => [s2wX(mx), s2wZ(my)],
    worldToScreen: (wx, wz) => [w2sX(wx), w2sZ(wz)],
    stats: () => ({ drawMs, litCells }),
  };
}
