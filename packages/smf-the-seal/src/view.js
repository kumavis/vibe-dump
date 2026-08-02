/* =====================================================================
   SMF 05 — THE SEAL · VIEW LAYER
   Canvas 2D only. Reads the sim each frame, owns zero game state.
   Tokens are drawn at frac(time·speed) along edge paths — the sim moves
   rates, never items. The red blast-radius preview and the green
   re-verification wave animate the SAME computeRadius result: identical
   membership, identical depth order. That symmetry is the UI thesis.
   ===================================================================== */

import { C } from './sim.js';

const COL = {
  bg: '#0b0e11', grid: '#12181d',
  boxFill: 'rgba(13,18,22,0.94)', boxLine: '#2a3d49', boxLineDim: '#1c262d',
  text: '#c2ccd2', dim: '#566068', dim2: '#5b7482',
  amber: '#e0973a', amberDim: '#8a6f4d', amberDark: '#4d3d26',
  cyan: '#55d6f0', cyanDim: '#2a5866', blue: '#3b9fd9',
  green: '#9fd65a', greenDim: '#4d6b2e',
  red: '#d96b6b', redDim: '#7a3d3d',
};
const FONT = (px, w = 400) =>
  `${w} ${px}px ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace`;
const lerp = (a, b, k) => a + (b - a) * k;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

export function createView(canvas) {
  const ctx = canvas.getContext('2d');
  const WORLD = { w: 1600, h: 1000 };
  let dpr = 1, cw = 0, ch = 0, scale = 1, ox = 0, oy = 0, reserve = 0;

  function resize(panelReserve) {
    if (panelReserve != null) reserve = panelReserve;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cw = canvas.clientWidth; ch = canvas.clientHeight;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(ch * dpr);
    const availW = Math.max(320, cw - reserve - 16), availH = Math.max(240, ch - 12);
    scale = Math.min(availW / WORLD.w, availH / WORLD.h);
    ox = 8 + (availW - WORLD.w * scale) / 2;
    oy = 6 + (availH - WORLD.h * scale) / 2;
  }
  const s2w = (px, py) => ({ x: (px - ox) / scale, y: (py - oy) / scale });

  /* per-frame geometry caches (mutated in place, never reallocated) */
  const boxes = new Map();
  const geoms = new Map();

  function computeBox(m, st) {
    let b = boxes.get(m.id);
    if (!b) { b = { x: 0, y: 0, w: 0, h: 0, k: 1 }; boxes.set(m.id, b); }
    b.x = m.x; b.y = m.y; b.k = 1;
    if (m.id === 'PLATE-A') {
      const chipPhases = { sealed: 1, resealed: 1 };
      let k = chipPhases[st.phase] ? 1 : 0;
      const tw = 0.5;
      if (st.phase === 'sealed' && st.t - st.sealDoneT < tw) k = (st.t - st.sealDoneT) / tw;
      else if (st.phase === 'resealed' && st.t - st.resealedT < tw) k = (st.t - st.resealedT) / tw;
      else if (st.phase === 'broken' && st.sealBrokenT > 0 && st.t - st.sealBrokenT < tw)
        k = 1 - (st.t - st.sealBrokenT) / tw;
      b.k = clamp(k, 0, 1);
      b.w = lerp(240, 156, b.k); b.h = lerp(136, 64, b.k);
    } else if (m.instanceOf) { b.w = 150; b.h = 58; }
    else if (m.kind === 'raw') { b.w = 122; b.h = 50; }
    else { b.w = 140; b.h = 56; }
    return b;
  }

  function outPortY(m, e) {
    const b = boxes.get(m.id);
    const list = m.outEdges;
    const i = list.indexOf(e);
    return b.y - b.h / 2 + (b.h * (i + 1)) / (list.length + 1);
  }
  function inPortY(m, ti) {
    const b = boxes.get(m.id);
    if (m.id === 'PLATE-A') return b.y - b.h / 2 + b.h * (b.k > 0.5 ? 0.5 : 0.3);
    if (m.ins.length <= 1) return b.y - b.h / 2 + b.h * 0.55;
    /* multi-input boxes: reserve the title strip at the top */
    return b.y - b.h / 2 + 16 + ((b.h - 16) * (ti + 1)) / (m.ins.length + 1);
  }

  function computeGeom(e, st) {
    let g = geoms.get(e);
    if (!g) { g = { x0: 0, y0: 0, x1: 0, y1: 0, mx: 0, l1: 0, l2: 0, l3: 0, len: 0 }; geoms.set(e, g); }
    const fm = st.byId[e.from], tm = st.byId[e.to];
    const fb = boxes.get(fm.id), tb = boxes.get(tm.id);
    g.x0 = fb.x + fb.w / 2; g.y0 = outPortY(fm, e);
    g.x1 = tb.x - tb.w / 2; g.y1 = inPortY(tm, e.ti);
    g.mx = (g.x0 + g.x1) / 2;
    g.l1 = Math.abs(g.mx - g.x0); g.l2 = Math.abs(g.y1 - g.y0); g.l3 = Math.abs(g.x1 - g.mx);
    g.len = g.l1 + g.l2 + g.l3;
    return g;
  }
  const ptAt = (g, s, out) => {
    if (s <= g.l1) { out.x = g.x0 + Math.sign(g.mx - g.x0) * s; out.y = g.y0; return out; }
    s -= g.l1;
    if (s <= g.l2) { out.x = g.mx; out.y = g.y0 + Math.sign(g.y1 - g.y0) * s; return out; }
    s -= g.l2;
    out.x = g.mx + Math.sign(g.x1 - g.mx) * Math.min(s, g.l3); out.y = g.y1; return out;
  };
  const scratchPt = { x: 0, y: 0 };

  function strokeEdgePath(g) {
    ctx.beginPath();
    ctx.moveTo(g.x0, g.y0);
    ctx.lineTo(g.mx, g.y0);
    ctx.lineTo(g.mx, g.y1);
    ctx.lineTo(g.x1, g.y1);
    ctx.stroke();
  }

  /* ------------------------- wave helpers -------------------------- */
  const reach = (d) => C.WAVE_LEAD + d * C.WAVE_STEP;
  const depthMap = new Map();
  function radiusDepths(radius) {
    depthMap.clear();
    for (const n of radius.nodes) depthMap.set(n.id, n.depth);
    return depthMap;
  }

  /* ============================ draw ================================ */
  function draw(st, time, io) {
    resizeIfNeeded();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = COL.bg;
    ctx.fillRect(0, 0, cw, ch);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);

    /* grid */
    ctx.strokeStyle = COL.grid; ctx.lineWidth = 1 / scale;
    ctx.beginPath();
    for (let x = 0; x <= WORLD.w; x += 100) { ctx.moveTo(x, 0); ctx.lineTo(x, WORLD.h); }
    for (let y = 0; y <= WORLD.h; y += 100) { ctx.moveTo(0, y); ctx.lineTo(WORLD.w, y); }
    ctx.stroke();

    /* tier headers */
    ctx.font = FONT(15, 700); ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillStyle = COL.dim;
    const headers = [['R A W', 140], ['I N T E R M E D I A T E', 470], ['A S S E M B L Y', 840], ['P R O D U C T', 1300]];
    for (const [txt, x] of headers) ctx.fillText(txt, x, 46);

    /* boxes first (edge geometry needs them) */
    for (const m of st.modules) computeBox(m, st);

    /* wave bookkeeping */
    const hold = st.hold;
    const cancel = !hold && st.lastCancel && st.t - st.lastCancel.t < 0.35 ? st.lastCancel : null;
    const preview = hold || cancel;
    const previewAlpha = hold ? 1 : cancel ? 1 - (st.t - cancel.t) / 0.35 : 0;
    const holdT = hold ? st.t - hold.t0 : cancel ? cancel.held : 0;
    const pDepths = preview ? radiusDepths(preview.radius) : null;
    const rv = st.reverify;

    /* ----- edges ----- */
    for (const e of st.edges) {
      const fm = st.byId[e.from], tm = st.byId[e.to];
      if (fm.state === 'planned' || tm.state === 'planned') continue;
      const g = computeGeom(e, st);
      const ghost = fm.state === 'ghost' || tm.state === 'ghost';
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = ghost ? '#1a222a' : e.flow > 0.02 ? '#31424e' : COL.boxLineDim;
      if (ghost) ctx.setLineDash([6, 6]);
      strokeEdgePath(g);
      ctx.setLineDash([]);
      /* typed rate label */
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = FONT(12);
      ctx.fillStyle = ghost ? '#3a4650' : COL.amberDim;
      ctx.fillText(`${e.type} ${e.rate}/s`, g.mx, (g.y0 + g.y1) / 2 - 9);
      /* tokens — pure function of the clock */
      if (e.flow > 0.02) {
        const speed = 70;
        const spacing = clamp(speed / (e.flow * 2.2), 26, g.len);
        const n = Math.min(Math.floor(g.len / spacing) + 1, 14);
        ctx.fillStyle = COL.amber;
        for (let i = 0; i < n; i++) {
          const s = (time * speed + i * spacing) % g.len;
          ptAt(g, s, scratchPt);
          ctx.fillRect(scratchPt.x - 2.6, scratchPt.y - 2.6, 5.2, 5.2);
        }
      }
      /* arrowhead */
      ctx.fillStyle = ghost ? '#1a222a' : '#31424e';
      ctx.beginPath();
      ctx.moveTo(g.x1, g.y1); ctx.lineTo(g.x1 - 9, g.y1 - 5); ctx.lineTo(g.x1 - 9, g.y1 + 5);
      ctx.fill();

      /* red preview overlay on radius edges */
      if (preview && pDepths.has(e.to) && holdT >= reach(pDepths.get(e.to))
        && (e.from === 'PLATE-A' || pDepths.has(e.from))) {
        ctx.save();
        ctx.globalAlpha = 0.85 * previewAlpha;
        ctx.strokeStyle = COL.red; ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]); ctx.lineDashOffset = -time * 46;
        strokeEdgePath(g);
        ctx.restore();
      }
      /* green re-verify overlay walking the same geometry */
      if (rv && e.to === rv.order[rv.i] && (st.byId[e.from].verified || e.from === 'PLATE-A')) {
        ctx.save();
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = COL.green; ctx.lineWidth = 2;
        ctx.setLineDash([10, 8]); ctx.lineDashOffset = -time * 46;
        strokeEdgePath(g);
        ctx.restore();
      }
    }

    /* ----- vocabulary links: PLATE-A ↔ its stamps (same sealed word) ----- */
    for (const sid of ['STAMP-1', 'STAMP-2']) {
      const s = st.byId[sid];
      if (!s.placed) continue;
      const a = boxes.get('PLATE-A'), b = boxes.get(sid);
      let color = COL.cyanDim, alpha = 0.5, dash = true;
      if (preview && holdT >= reach(1)) { color = COL.red; alpha = 0.9 * previewAlpha; }
      else if (rv && rv.order[rv.i] === sid) { color = COL.green; alpha = 0.9; }
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color; ctx.lineWidth = 1.2;
      ctx.setLineDash(dash ? [3, 7] : []);
      ctx.lineDashOffset = -time * 20;
      ctx.beginPath();
      ctx.moveTo(a.x - a.w / 2, a.y + a.h / 2);
      ctx.quadraticCurveTo(a.x - a.w / 2 - 150, (a.y + b.y) / 2, b.x - b.w / 2, b.y - b.h / 2);
      ctx.stroke();
      ctx.restore();
    }

    /* ----- modules ----- */
    for (const m of st.modules) {
      if (m.state === 'planned') continue;
      drawModule(m, st, time, preview, pDepths, previewAlpha, holdT, rv);
    }

    /* ----- hold ring + pulse at PLATE-A ----- */
    if (hold) {
      const b = boxes.get('PLATE-A');
      const r0 = Math.max(b.w, b.h) / 2 + 22;
      const prog = clamp(holdT / C.HOLD_COMMIT, 0, 1);
      ctx.strokeStyle = 'rgba(217,107,107,0.25)'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(b.x, b.y, r0, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = COL.red; ctx.lineWidth = 4.5;
      ctx.beginPath(); ctx.arc(b.x, b.y, r0, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * prog); ctx.stroke();
      /* expanding pulses along the wave */
      for (let i = 0; i < 2; i++) {
        const pt = (holdT * 1.6 + i * 0.5) % 1;
        ctx.globalAlpha = (1 - pt) * 0.35;
        ctx.beginPath(); ctx.arc(b.x, b.y, r0 + pt * 320, 0, Math.PI * 2);
        ctx.strokeStyle = COL.red; ctx.lineWidth = 2; ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.font = FONT(14, 700); ctx.fillStyle = COL.red; ctx.textAlign = 'center';
      ctx.fillText(`BREAKING ${holdT.toFixed(1)} / ${C.HOLD_COMMIT.toFixed(1)}s — release to cancel`, b.x, b.y + r0 + 24);
    }

    /* ================= screen-space layer ================= */
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    if (hold) drawTally(st, holdT, io);
    if (rv) drawVerifyChip(st, rv);
    if (st.banner && st.t - st.banner.t < 3.5) drawBanner(st);
    /* commit vignette */
    if (st.sealBrokenT > 0 && st.t - st.sealBrokenT < 0.7) {
      const a = 0.45 * (1 - (st.t - st.sealBrokenT) / 0.7);
      ctx.strokeStyle = `rgba(217,107,107,${a})`;
      ctx.lineWidth = 46;
      ctx.strokeRect(0, 0, cw, ch);
    }
  }

  /* ------------------------- module draw ---------------------------- */
  function drawModule(m, st, time, preview, pDepths, previewAlpha, holdT, rv) {
    const b = boxes.get(m.id);
    const x = b.x - b.w / 2, y = b.y - b.h / 2;
    const unv = !m.verified;
    const ghost = m.state === 'ghost';
    const building = m.state === 'building';
    const dormant = m.state === 'dormant';

    /* body */
    ctx.fillStyle = unv ? 'rgba(11,13,17,0.94)' : COL.boxFill;
    ctx.fillRect(x, y, b.w, b.h);
    ctx.lineWidth = 1.4;
    let line = COL.boxLine;
    if (ghost || dormant) line = COL.boxLineDim;
    if (building) line = COL.greenDim;
    if (unv) line = '#20272e';
    if (m.id === 'PLATE-A' && b.k > 0.5) line = COL.cyanDim;
    if (m.instanceOf && !unv) line = COL.cyanDim;
    ctx.strokeStyle = line;
    if (ghost || building) ctx.setLineDash([5, 5]);
    ctx.strokeRect(x, y, b.w, b.h);
    ctx.setLineDash([]);

    /* hatching for UNVERIFIED */
    if (unv) {
      ctx.save();
      ctx.beginPath(); ctx.rect(x, y, b.w, b.h); ctx.clip();
      ctx.strokeStyle = 'rgba(120,130,140,0.14)'; ctx.lineWidth = 1;
      ctx.beginPath();
      for (let hx = x - b.h; hx < x + b.w; hx += 9) {
        ctx.moveTo(hx, y + b.h); ctx.lineTo(hx + b.h, y);
      }
      ctx.stroke();
      ctx.restore();
    }

    /* title + tier */
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.font = FONT(14, 700);
    ctx.fillStyle = ghost || dormant || unv ? COL.dim : m.kind === 'raw' ? COL.amber : COL.text;
    const seal = (m.id === 'PLATE-A' && b.k > 0.5) || (m.instanceOf && st.contract) ? ' ◈' : '';
    ctx.fillText(m.id + seal, x + 8, y + 12);
    ctx.font = FONT(10);
    ctx.fillStyle = COL.dim;
    ctx.textAlign = 'right';
    ctx.fillText(m.tier, x + b.w - 7, y + 11);
    ctx.textAlign = 'left';

    /* status lamp */
    const lampC = m.outFlow > 0.02 ? COL.green
      : unv ? COL.redDim
        : ghost || dormant ? '#333c42'
          : building ? COL.green : COL.amberDim;
    ctx.fillStyle = lampC;
    ctx.fillRect(x + b.w - 14, y + b.h - 14, 7, 7);

    /* status line */
    ctx.font = FONT(11);
    let status = null, sc = COL.dim2;
    if (dormant) { status = 'SURVEYED — awaiting planner'; }
    else if (ghost) { status = 'AWAITING PLATE SUPPLY'; }
    else if (building) { status = `PLANNER BUILDING ${clamp((st.t - m.buildT0) / C.STAMP_BUILD * 100, 0, 99).toFixed(0)}%`; sc = COL.green; }
    else if (unv) { status = 'UNVERIFIED'; sc = COL.red; }
    else if (m.ins.some((i) => i.starved)) { status = 'STARVED · tripped'; sc = COL.red; }
    else if (m.kind !== 'raw' && m.outFlow === 0 && m.state === 'on' && st.t < m.reprimeUntil) { status = 'RE-PRIMING'; sc = COL.amber; }
    if (m.id === 'PLATE-A') status = null; // has its own interior
    const statusX = m.ins.length ? x + 42 : x + 8;
    if (status) { ctx.fillStyle = sc; ctx.fillText(status, statusX, y + b.h - 12); }
    else if (m.id !== 'PLATE-A') {
      ctx.fillStyle = COL.dim;
      if (m.kind === 'sink') ctx.fillText(`${m.outFlow.toFixed(1)} crates/s`, statusX, y + b.h - 12);
      else ctx.fillText(`${m.outType} ${m.outFlow.toFixed(1)}/s`, statusX, y + b.h - 12);
    }

    /* input badges + mini buffer bars (the chip face draws its own ports) */
    for (let i = 0; i < m.ins.length && !(m.id === 'PLATE-A' && b.k > 0.5); i++) {
      const inp = m.ins[i];
      const py = inPortY(m, i);
      const bw = 30, bh = 4;
      ctx.fillStyle = inp.starved ? COL.red : COL.dim;
      ctx.font = FONT(9);
      ctx.textAlign = 'left';
      ctx.fillText(inp.type, x + 4, py - 6);
      ctx.strokeStyle = inp.starved ? COL.red : '#22313b';
      ctx.lineWidth = 1;
      ctx.strokeRect(x + 3, py, bw, bh);
      ctx.fillStyle = inp.starved ? COL.red : COL.amber;
      ctx.fillRect(x + 3, py, bw * clamp(inp.buf / inp.cap, 0, 1), bh);
      if (st.t - inp.lastSpillT < 0.4) {
        ctx.fillStyle = COL.red;
        ctx.fillText('▲ spill', x + 3 + bw + 4, py + 2);
      }
    }

    /* PLATE-A interior: open parts or sealed chip face */
    if (m.id === 'PLATE-A') drawPlateA(m, st, b, x, y, time);

    /* contract chip face for stamps */
    if (m.instanceOf && !ghost && !building) {
      ctx.font = FONT(10);
      ctx.fillStyle = unv ? COL.redDim : COL.cyan;
      ctx.fillText(unv ? 'instance of BROKEN word' : 'instance of PLATE-A', x + 42, y + 26);
      if (st.contract && !unv) {
        ctx.fillStyle = COL.cyanDim;
        ctx.fillText(st.contract.windowed ? 'PLATE ≥ 4/s /any 2s' : 'PLATE ≥ 4/s', x + 42, y + 38);
      }
    }

    /* assumes-tags under consumers of the sealed word */
    const tag = assumesTag(m, st);
    if (tag) {
      ctx.font = FONT(11);
      ctx.fillStyle = tag.broken ? COL.redDim : COL.cyanDim;
      ctx.textAlign = 'center';
      ctx.fillText(tag.txt, b.x, y + b.h + 12);
      ctx.textAlign = 'left';
    }

    /* red preview outline / green verify outline — same treatment */
    if (preview && pDepths.has(m.id) && holdT >= reach(pDepths.get(m.id))) {
      ctx.save();
      ctx.globalAlpha = previewAlpha;
      ctx.strokeStyle = COL.red; ctx.lineWidth = 2.2;
      ctx.shadowColor = COL.red; ctx.shadowBlur = 14;
      ctx.strokeRect(x - 4, y - 4, b.w + 8, b.h + 8);
      ctx.restore();
    }
    if (rv) {
      const ix = rv.order.indexOf(m.id);
      if (ix >= 0 && ix < rv.i && st.t - m.verifiedAt < 2.5) {
        ctx.save();
        ctx.globalAlpha = 1 - (st.t - m.verifiedAt) / 2.5;
        ctx.strokeStyle = COL.green; ctx.lineWidth = 2.2;
        ctx.shadowColor = COL.green; ctx.shadowBlur = 14;
        ctx.strokeRect(x - 4, y - 4, b.w + 8, b.h + 8);
        ctx.restore();
      } else if (ix === rv.i) {
        const prog = clamp((st.t - (rv.t0 + rv.i * C.VERIFY_PER)) / C.VERIFY_PER, 0, 1);
        ctx.save();
        ctx.strokeStyle = COL.green; ctx.lineWidth = 2.2;
        ctx.setLineDash([8, 6]); ctx.lineDashOffset = -time * 30;
        ctx.strokeRect(x - 4, y - 4, b.w + 8, b.h + 8);
        ctx.setLineDash([]);
        ctx.fillStyle = 'rgba(159,214,90,0.10)';
        ctx.fillRect(x, y, b.w * prog, b.h);
        ctx.restore();
      }
    }
  }

  function assumesTag(m, st) {
    if (!['FRAME-SHOP', 'HULL-YARD', 'SERVO-LAB', 'PANEL-LINE'].includes(m.id)) return null;
    const stamps = m.id === 'PANEL-LINE';
    if (!m.verified) return { txt: stamps ? 'assumed PLATE ≥ 4/s ×2 — BROKEN' : 'assumed PLATE ≥ 4/s — BROKEN', broken: true };
    if (!st.contract) return null;
    const w = st.contract.windowed ? ' /2s' : '';
    return { txt: stamps ? `assumes PLATE ≥ 4/s${w} ×2 (stamps)` : `assumes PLATE ≥ 4/s${w}`, broken: false };
  }

  function drawPlateA(m, st, b, x, y, time) {
    const openness = 1 - b.k;
    if (openness > 0.5) {
      /* three internal parts (+ surge tank once fixed) */
      const parts = st.surgeTank
        ? ['CRUSHER', 'SMELTER', 'BUFFER', 'SURGE\nTANK']
        : ['CRUSHER', 'SMELTER', 'BUFFER'];
      const n = parts.length;
      const pw = (b.w - 24 - (n - 1) * 14) / n, ph = 46;
      const py = y + b.h - ph - 26;
      ctx.font = FONT(10);
      let px = x + 12;
      for (let i = 0; i < n; i++) {
        const isTank = st.surgeTank && i === 3;
        ctx.strokeStyle = isTank ? COL.cyan : '#3a4a55';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(px, py, pw, ph);
        ctx.fillStyle = isTank ? COL.cyan : COL.dim2;
        ctx.textAlign = 'center';
        const lines = parts[i].split('\n');
        lines.forEach((ln, li) => ctx.fillText(ln, px + pw / 2, py + 12 + li * 10));
        if (isTank) {
          /* tank level bar */
          const lv = clamp(st.tankLevel / C.TANK_CAP, 0, 1);
          ctx.fillStyle = COL.cyan;
          ctx.fillRect(px + 4, py + ph - 8, (pw - 8) * lv, 4);
        }
        /* internal token dots between parts — density from the raw rate */
        if (i < n - 1) {
          const raw = st.plateRaw;
          if (raw > 0.1) {
            ctx.fillStyle = COL.amber;
            const k = (time * 1.7 + i * 0.37) % 1;
            ctx.fillRect(px + pw + 14 * k - 2, py + ph / 2 - 2, 4, 4);
            if (raw > 5) ctx.fillRect(px + pw + 14 * ((k + 0.5) % 1) - 2, py + ph / 2 - 2, 4, 4);
          }
          ctx.strokeStyle = '#3a4a55';
          ctx.beginPath();
          ctx.moveTo(px + pw + 2, py + ph / 2); ctx.lineTo(px + pw + 12, py + ph / 2);
          ctx.stroke();
        }
        px += pw + 14;
      }
      ctx.textAlign = 'left';
      /* interior status line */
      ctx.font = FONT(11);
      if (st.phase === 'measuring' || st.phase === 'resealing') {
        const p = clamp((st.t - st.measureT0) / C.MEASURE, 0, 1);
        ctx.fillStyle = 'rgba(85,214,240,0.10)';
        ctx.fillRect(x, y, b.w * p, b.h);
        ctx.strokeStyle = COL.cyan; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.moveTo(x + b.w * p, y); ctx.lineTo(x + b.w * p, y + b.h); ctx.stroke();
        ctx.fillStyle = COL.cyan;
        ctx.fillText(
          `MEASURING ${(p * C.MEASURE).toFixed(1)}/${C.MEASURE.toFixed(1)}s · ${st.phase === 'resealing'
            ? `worst 2s ${st.rates.win2.toFixed(1)}/s` : `avg ${st.rates.plateAvg.toFixed(1)}/s`}`,
          x + 8, y + 26);
      } else {
        ctx.fillStyle = st.leakActive && !st.surgeTank ? COL.red : COL.dim2;
        ctx.fillText(
          st.leakActive && !st.surgeTank
            ? `COARSE ORE — raw ${st.plateRaw.toFixed(0)}/s (avg 4/s)`
            : `OPEN · out ${m.outFlow.toFixed(1)}/s`,
          x + 8, y + 26);
      }
    } else {
      /* sealed chip face */
      ctx.font = FONT(11);
      ctx.fillStyle = COL.cyan;
      ctx.fillText(st.contract && st.contract.windowed ? 'PLATE ≥ 4/s /any 2s win' : 'PLATE ≥ 4/s (sustained)', x + 8, y + 28);
      ctx.fillStyle = COL.dim2;
      ctx.fillText(`out ${m.outFlow.toFixed(1)}/s`, x + 8, y + b.h - 12);
      /* typed port badges */
      ctx.font = FONT(9, 700);
      ctx.fillStyle = COL.amber;
      ctx.strokeStyle = COL.amberDark;
      ctx.strokeRect(x - 2, b.y - 7, 30, 14);
      ctx.fillText('ORE', x + 4, b.y);
      ctx.strokeRect(x + b.w - 34, b.y - 7, 40, 14);
      ctx.fillText('PLATE', x + b.w - 30, b.y);
    }
  }

  /* --------------------- screen-space widgets ----------------------- */
  function drawTally(st, holdT, io) {
    const r = st.hold.radius;
    let mods = 0, stamps = 0, full = true;
    for (const n of r.nodes) {
      if (holdT >= reach(n.depth)) {
        if (st.byId[n.id].instanceOf) stamps++; else mods++;
      } else full = false;
    }
    const lines = [];
    lines.push([`${mods} module${mods === 1 ? '' : 's'}`, COL.text]);
    if (holdT >= reach(1)) lines.push([`${stamps} planner stamps`, COL.text]);
    if (holdT >= reach(1)) lines.push([`${r.contracts} contracts downstream`, COL.text]);
    if (full) lines.push([`re-verify ≈ ${r.reverifyRounded}s`, COL.red]);

    const w = 196, lh = 17, h = 16 + lines.length * lh + 14;
    const pb = boxes.get('PLATE-A');
    const anchor = io.pointer || { x: pb.x * scale + ox + 140, y: pb.y * scale + oy };
    const px = clamp(anchor.x + 18, 8, cw - reserve - w - 12);
    const py = clamp(anchor.y + 14, 8, ch - h - 10);
    ctx.fillStyle = 'rgba(22,10,10,0.94)';
    ctx.strokeStyle = COL.red; ctx.lineWidth = 1.5;
    ctx.fillRect(px, py, w, h);
    ctx.strokeRect(px, py, w, h);
    ctx.font = FONT(12, 600); ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillStyle = COL.red;
    ctx.fillText('BLAST RADIUS', px + 10, py + 12);
    ctx.font = FONT(12);
    lines.forEach(([txt, c], i) => {
      ctx.fillStyle = c;
      ctx.fillText(txt, px + 10, py + 28 + i * lh);
    });
    /* hold progress */
    const prog = clamp(holdT / C.HOLD_COMMIT, 0, 1);
    ctx.strokeStyle = '#4a2828';
    ctx.strokeRect(px + 10, py + h - 10, w - 20, 4);
    ctx.fillStyle = COL.red;
    ctx.fillRect(px + 10, py + h - 10, (w - 20) * prog, 4);
  }

  function drawVerifyChip(st, rv) {
    const cur = rv.order[rv.i];
    const txt = `RE-VERIFYING ${rv.i + 1}/${rv.order.length} · ${cur}`;
    ctx.font = FONT(12, 600);
    const w = ctx.measureText(txt).width + 24;
    const px = 12, py = 12;
    ctx.fillStyle = 'rgba(13,22,13,0.94)';
    ctx.strokeStyle = COL.green; ctx.lineWidth = 1.5;
    ctx.fillRect(px, py, w, 26); ctx.strokeRect(px, py, w, 26);
    ctx.fillStyle = COL.green; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText(txt, px + 12, py + 14);
  }

  function drawBanner(st) {
    const age = st.t - st.banner.t;
    const a = age < 3 ? 1 : 1 - (age - 3) / 0.5;
    const msg = st.banner.msg;
    let color = COL.cyan;
    if (msg.includes('BROKEN')) color = COL.red;
    else if (msg.includes('FAILING')) color = COL.amber;
    else if (msg.includes('RE-VERIFIED') || msg.includes('HELD')) color = COL.green;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.font = FONT(15, 700);
    const w = ctx.measureText(msg).width + 40;
    const px = (cw - reserve) / 2 - w / 2, py = 14;
    ctx.fillStyle = 'rgba(13,18,22,0.95)';
    ctx.strokeStyle = color; ctx.lineWidth = 1.5;
    ctx.fillRect(px, py, w, 34); ctx.strokeRect(px, py, w, 34);
    ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(msg, px + w / 2, py + 18);
    ctx.restore();
  }

  /* ------------------------------------------------------------------ */
  let lastCw = 0, lastCh = 0;
  function resizeIfNeeded() {
    if (canvas.clientWidth !== lastCw || canvas.clientHeight !== lastCh) {
      lastCw = canvas.clientWidth; lastCh = canvas.clientHeight;
      resize();
    }
  }

  function hitModule(st, px, py) {
    const w = s2w(px, py);
    for (let i = st.modules.length - 1; i >= 0; i--) {
      const m = st.modules[i];
      if (m.state === 'planned') continue;
      const b = boxes.get(m.id);
      if (!b) continue;
      if (Math.abs(w.x - b.x) <= b.w / 2 + 6 && Math.abs(w.y - b.y) <= b.h / 2 + 6) return m.id;
    }
    return null;
  }

  resize(0);
  return { draw, resize, hitModule };
}
