/* =====================================================================
   SMF 02 — THE JAM · view layer
   Canvas 2D only. Reads the sim each frame, owns zero game state.
   All motion is derived from state.t — tokens are drawn at
   frac(t · speed) along their runs, never simulated.
   Two-color law: amber = matter, cyan = signal.
   ===================================================================== */
import { P, G, laneY, clamp, laneCost, pointOnPath } from './sim.js';

const C = {
  bg: '#0b0e11', grid: '#121a20',
  text: '#c2ccd2', dim: '#566068', dim2: '#5b7482', faint: '#39454d',
  amber: '#e0973a', amberHi: '#f0b45e', amberLo: '#8a5e26', amberBg: '#221a0e',
  cyan: '#55d6f0', cyanHi: '#a9ecfa', cyanLo: '#2a6a7a',
  green: '#9fd65a', red: '#d96b6b', blue: '#3b9fd9',
  belt: '#2b3b44', hopper: '#c8781e', smelter: '#b05537',
};
const FONT = (px, w = 600) =>
  `${w} ${px}px ui-monospace, 'SF Mono', 'Cascadia Mono', Menlo, Consolas, monospace`;

export function createView(canvas) {
  const ctx = canvas.getContext('2d');
  let dpr = 1, scale = 1, ox = 0, oy = 0, inset = 0;
  const pt = [0, 0]; // scratch for pointOnPath

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cw = canvas.clientWidth || 1, chh = canvas.clientHeight || 1;
    canvas.width = Math.round(cw * dpr);
    canvas.height = Math.round(chh * dpr);
    /* keep the world clear of the HUD panel (right inset) */
    const eff = Math.max(320, cw - inset);
    scale = Math.min(eff / G.W, chh / G.H);
    ox = (eff - G.W * scale) / 2;
    oy = (chh - G.H * scale) / 2;
  }
  function setInset(px) { inset = px; resize(); }

  const clientToWorld = (cx, cy) => {
    const r = canvas.getBoundingClientRect();
    return [((cx - r.left) - ox) / scale, ((cy - r.top) - oy) / scale];
  };
  const worldToClient = (wx, wy) => {
    const r = canvas.getBoundingClientRect();
    return [r.left + ox + wx * scale, r.top + oy + wy * scale];
  };

  /* position of a responder bot, derived from its job record */
  function botPos(b, t) {
    const j = b.job;
    if (!j) return [b.hx, b.hy];
    const k = clamp((t - j.t0) / j.dur, 0, 1);
    if (j.phase === 'travel') return [j.x0 + (j.tx - j.x0) * k, j.y0 + (j.ty - j.y0) * k];
    if (j.phase === 'work') return [j.tx, j.ty];
    return [j.tx + (b.hx - j.tx) * k, j.ty + (b.hy - j.ty) * k];
  }

  function diamond(x, y, r) {
    ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r, y); ctx.lineTo(x, y + r); ctx.lineTo(x - r, y);
    ctx.closePath();
  }

  function draw(state, ui) {
    const t = state.t;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = C.bg;
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);

    /* faint dot grid */
    ctx.fillStyle = C.grid;
    for (let gy = 40; gy < G.H; gy += 40)
      for (let gx = 40; gx < G.W - 140; gx += 40) ctx.fillRect(gx, gy, 2, 2);

    drawBank(state);
    for (const l of state.lanes) drawLane(state, l, t, ui);
    for (const l of state.lanes) if (l.probe) drawOverlay(state, l, t, ui);
    drawTraces(state, t);
    drawBay(state, t);
    for (const b of state.bots) drawBot(state, b, t);
  }

  /* ---------- quota bank ---------- */
  function drawBank(state) {
    const x = G.bankX, y0 = G.bankY0, y1 = G.bankY1, w = 26, h = y1 - y0;
    ctx.strokeStyle = C.amberLo;
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y0, w, h);
    const fr = clamp(state.banked / P.quota, 0, 1);
    ctx.fillStyle = C.amberBg;
    ctx.fillRect(x + 1, y0 + 1, w - 2, h - 2);
    ctx.fillStyle = C.amber;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(x + 2, y1 - 2 - (h - 4) * fr, w - 4, (h - 4) * fr);
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.dim2;
    ctx.font = FONT(9, 700);
    ctx.textAlign = 'center';
    ctx.fillText('QUOTA', x + w / 2, y0 - 10);
    ctx.fillStyle = C.amber;
    ctx.fillText(`${Math.min(999999, Math.floor(state.banked))}`, x + w / 2, y1 + 14);
    ctx.fillStyle = C.dim;
    ctx.fillText(`/${P.quota}`, x + w / 2, y1 + 25);
  }

  /* ---------- one belt lane ---------- */
  function drawLane(state, l, t, ui) {
    const y = laneY(l.ix);
    const x0 = G.laneX0, x1 = G.laneX1;

    if (!l.active) {
      const nActive = state.lanes.filter((q) => q.active).length;
      const isNext = l.ix === nActive;
      ctx.setLineDash([4, 5]);
      ctx.strokeStyle = isNext ? C.faint : '#232d33';
      ctx.lineWidth = 1;
      ctx.strokeRect(x0 - 34, y - 14, x1 - x0 + 92, 28);
      ctx.setLineDash([]);
      if (isNext) {
        ctx.fillStyle = C.dim;
        ctx.font = FONT(10);
        ctx.textAlign = 'center';
        ctx.fillText(`+ BUY LANE ${l.ix + 1} — ${laneCost(nActive)} matter`, (x0 + x1) / 2, y + 3);
      }
      return;
    }

    /* label */
    ctx.fillStyle = C.dim;
    ctx.font = FONT(9, 700);
    ctx.textAlign = 'right';
    ctx.fillText(`LANE ${l.ix + 1}`, x0 - 42, y + 3);

    /* hopper */
    ctx.fillStyle = '#1a1410';
    ctx.fillRect(x0 - 34, y - 11, 26, 22);
    ctx.strokeStyle = C.hopper;
    ctx.lineWidth = 1;
    ctx.strokeRect(x0 - 34, y - 11, 26, 22);
    ctx.fillStyle = C.amberLo;
    ctx.fillRect(x0 - 31, y - 7, 20, 14);

    /* belt rails */
    ctx.strokeStyle = C.belt;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x0 - 8, y - 6); ctx.lineTo(x1, y - 6);
    ctx.moveTo(x0 - 8, y + 6); ctx.lineTo(x1, y + 6);
    ctx.stroke();

    /* smelter */
    const hot = l.flow > 0;
    ctx.fillStyle = '#1d1210';
    ctx.fillRect(x1 + 2, y - 13, 26, 26);
    ctx.strokeStyle = C.smelter;
    ctx.strokeRect(x1 + 2, y - 13, 26, 26);
    ctx.fillStyle = hot ? C.amber : '#4a3226';
    if (hot) ctx.globalAlpha = 0.65 + 0.3 * Math.sin(t * 9 + l.ix * 1.7);
    ctx.fillRect(x1 + 8, y - 6, 14, 12);
    ctx.globalAlpha = 1;

    /* smelter -> bank feed */
    ctx.strokeStyle = hot ? C.amberLo : '#2a2118';
    ctx.beginPath();
    ctx.moveTo(x1 + 30, y); ctx.lineTo(G.bankX - 2, y);
    ctx.stroke();
    if (hot) {
      const k = ((t * 90) % (G.bankX - 2 - (x1 + 30)));
      ctx.fillStyle = C.amber;
      ctx.fillRect(x1 + 30 + k - 2, y - 2, 4, 4);
    }

    /* matter tokens on the belt — pure function of the clock */
    ctx.fillStyle = C.amber;
    if (l.jam) {
      /* pile-up behind the clog: matter with nowhere to go */
      for (let i = 0; i < 6; i++) {
        const px = l.jam.x - 12 - i * 8;
        if (px < x0) break;
        ctx.fillRect(px - 3, y - 3, 6, 6);
      }
      /* the clog itself: amber blob, red fault halo pulsing */
      const pulse = 0.55 + 0.45 * Math.sin(t * 6);
      ctx.fillStyle = C.amberHi;
      ctx.beginPath();
      ctx.arc(l.jam.x, y, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = C.red;
      ctx.globalAlpha = pulse;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(l.jam.x, y, 11 + 3 * pulse, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
    } else if (l.flow > 0) {
      const span = x1 - x0, spacing = 66;
      const off = (t * 60) % spacing;
      for (let px = x0 + off; px < x1; px += spacing) ctx.fillRect(px - 3, y - 3, 6, 6);
    }

    /* degraded belt: red flicker at the gate end until tanked */
    if (l.degraded && !l.tank) {
      ctx.fillStyle = C.red;
      ctx.globalAlpha = l.flow > 0 ? 0.25 : 0.8;
      ctx.font = FONT(8, 700);
      ctx.textAlign = 'center';
      ctx.fillText('FLAPPING', G.gateX, y + 18);
      ctx.globalAlpha = 1;
    }
  }

  /* ---------- signal overlay: probe · (tank) · gate ---------- */
  function drawOverlay(state, l, t, ui) {
    const y = laneY(l.ix) + G.overlayDY;
    const beltY = laneY(l.ix);

    /* probe: cyan tick with a stem down to the belt */
    ctx.strokeStyle = C.cyanLo;
    ctx.beginPath();
    ctx.moveTo(G.probeX, beltY - 8); ctx.lineTo(G.probeX, y + 4);
    ctx.stroke();
    ctx.fillStyle = C.cyan;
    ctx.beginPath();
    ctx.moveTo(G.probeX, y + 5); ctx.lineTo(G.probeX - 4, y - 2); ctx.lineTo(G.probeX + 4, y - 2);
    ctx.closePath();
    ctx.fill();

    /* overlay run probe -> (tank) -> gate */
    ctx.strokeStyle = C.cyanLo;
    ctx.globalAlpha = 0.8;
    ctx.beginPath();
    ctx.moveTo(G.probeX, y);
    ctx.lineTo(G.gateX - 6, y);
    ctx.stroke();
    ctx.globalAlpha = 1;

    /* flow tokens: emitted while the lane flows — absence is the signal */
    if (l.flow > 0) {
      ctx.fillStyle = C.cyan;
      const a = G.probeX + 8, bx = (l.tank ? G.tankX - 16 : G.gateX - 10);
      const spacing = 34, off = (t * 95) % spacing;
      for (let px = a + off; px < bx; px += spacing) {
        ctx.beginPath();
        ctx.arc(px, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      if (l.tank) {
        const a2 = G.tankX + 16, off2 = (t * 95) % spacing;
        for (let px = a2 + off2; px < G.gateX - 10; px += spacing) {
          ctx.beginPath();
          ctx.arc(px, y, 2.2, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    /* tank: the hysteresis part — visible cyan vessel with a level */
    if (l.tank) {
      const tx = G.tankX, w = 30, h = 16;
      ctx.fillStyle = '#0d1a20';
      ctx.fillRect(tx - w / 2, y - h / 2, w, h);
      ctx.strokeStyle = C.cyan;
      ctx.strokeRect(tx - w / 2, y - h / 2, w, h);
      const fr = clamp(l.tankLevel / P.tankCap, 0, 1);
      ctx.fillStyle = C.cyan;
      ctx.globalAlpha = 0.7;
      ctx.fillRect(tx - w / 2 + 2, y - h / 2 + 2, (w - 4) * fr, h - 4);
      ctx.globalAlpha = 1;
      /* LO / HI band ticks */
      ctx.strokeStyle = C.cyanHi;
      for (const th of [P.tankLo, P.tankHi]) {
        const px = tx - w / 2 + 2 + (w - 4) * (th / P.tankCap);
        ctx.beginPath();
        ctx.moveTo(px, y - h / 2 - 3); ctx.lineTo(px, y + h / 2 + 3);
        ctx.stroke();
      }
      ctx.fillStyle = C.cyanLo;
      ctx.font = FONT(8, 700);
      ctx.textAlign = 'center';
      ctx.fillText('TANK', tx, y - h / 2 - 6);
    } else if (ui.tool === 'tank') {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = C.cyan;
      ctx.strokeRect(G.tankX - 15, y - 8, 30, 16);
      ctx.setLineDash([]);
    }

    /* gate: trips on silence, mints an alert token */
    const tripped = t - l.lastTripT < 0.35;
    ctx.fillStyle = tripped ? C.cyanHi : '#0d1a20';
    ctx.fillRect(G.gateX - 6, y - 6, 12, 12);
    ctx.strokeStyle = l.gateArmed ? C.cyan : C.cyanLo;
    ctx.strokeRect(G.gateX - 6, y - 6, 12, 12);
    if (tripped) {
      ctx.strokeStyle = C.cyanHi;
      ctx.beginPath();
      ctx.arc(G.gateX, y, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  /* probe-tool hint on unprobed lanes */
  function drawProbeHint(state) {
    for (const l of state.lanes) {
      if (!l.active || l.probe) continue;
      const y = laneY(l.ix) + G.overlayDY;
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = C.cyan;
      ctx.beginPath();
      ctx.moveTo(G.probeX, y + 5); ctx.lineTo(G.probeX - 5, y - 4);
      ctx.lineTo(G.probeX + 5, y - 4);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }

  /* ---------- alert traces + tokens in flight ---------- */
  function drawTraces(state, t) {
    ctx.lineWidth = 1;
    for (const l of state.lanes) {
      if (!l.probe) continue;
      const p = l.tracePts;
      ctx.strokeStyle = C.cyanLo;
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(p[0][0], p[0][1]);
      for (let i = 1; i < p.length; i++) ctx.lineTo(p[i][0], p[i][1]);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
    /* alert tokens ARE items: cyan diamonds riding the trace */
    ctx.fillStyle = C.cyanHi;
    for (const tok of state.transit) {
      const l = state.lanes[tok.lane];
      const k = clamp((t - tok.t0) / (tok.t1 - tok.t0), 0, 1);
      pointOnPath(l.tracePts, k * l.traceLen, pt);
      diamond(pt[0], pt[1], 4.5);
      ctx.fill();
    }
  }

  /* ---------- alert bay ---------- */
  function drawBay(state, t) {
    const armed = !!state.flags.fluency;
    const a = armed ? 1 : 0.4;
    ctx.globalAlpha = a;

    ctx.fillStyle = 'rgba(13,18,22,.9)';
    ctx.fillRect(G.bayX0, G.bayY0, G.bayX1 - G.bayX0, G.bayY1 - G.bayY0);
    ctx.strokeStyle = armed ? C.cyanLo : '#22303a';
    ctx.strokeRect(G.bayX0, G.bayY0, G.bayX1 - G.bayX0, G.bayY1 - G.bayY0);

    ctx.fillStyle = armed ? C.cyan : C.dim;
    ctx.font = FONT(9, 700);
    ctx.textAlign = 'left';
    ctx.fillText(armed ? 'ALERT BAY' : 'ALERT BAY — dormant', G.bayX0 + 8, G.bayY0 + 14);

    /* runbook hopper */
    ctx.strokeStyle = armed ? C.cyan : '#2a3a44';
    ctx.strokeRect(G.bayX1 - 96, G.bayY0 + 8, 86, 26);
    ctx.fillStyle = armed ? C.cyanHi : C.dim;
    ctx.font = FONT(8, 700);
    ctx.fillText('RUNBOOK', G.bayX1 - 88, G.bayY0 + 19);
    ctx.fillStyle = armed ? C.cyan : C.dim;
    ctx.fillText('UNJAM x∞', G.bayX1 - 88, G.bayY0 + 29);

    /* responder parking */
    for (let i = 0; i < P.maxBots; i++) {
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = i < state.bots.length ? C.green : '#2a3a30';
      ctx.strokeRect(G.padX + i * 34 - 9, G.padY - 9, 18, 18);
      ctx.setLineDash([]);
    }
    ctx.fillStyle = C.dim;
    ctx.font = FONT(8);
    ctx.fillText('RESPONDERS', G.padX - 9, G.padY + 22);

    /* queue slots — the visible backlog */
    const qn = state.queue.length;
    for (let i = 0; i < 12; i++) {
      const qx = G.queueX - i * 15;
      ctx.strokeStyle = '#22313b';
      ctx.strokeRect(qx - 5, G.queueY - 5, 10, 10);
    }
    ctx.fillStyle = C.cyanHi;
    for (let i = 0; i < Math.min(qn, 12); i++) {
      diamond(G.queueX - i * 15, G.queueY, 4.5);
      ctx.fill();
    }
    ctx.font = FONT(9, 700);
    ctx.textAlign = 'left';
    ctx.fillStyle = qn > 5 ? C.red : (qn ? C.cyan : C.dim);
    ctx.fillText(`QUEUE ${qn}`, G.queueX + 14, G.queueY + 3);

    ctx.globalAlpha = 1;
  }

  /* ---------- responder bots ---------- */
  function drawBot(state, b, t) {
    const [x, y] = botPos(b, t);
    ctx.fillStyle = C.green;
    ctx.fillRect(x - 6, y - 6, 12, 12);
    ctx.fillStyle = '#0b0e11';
    ctx.fillRect(x - 2, y - 2, 4, 4);
    /* the loaded runbook rides along: a cyan chip on the bot */
    if (b.job && b.job.phase !== 'return') {
      ctx.fillStyle = C.cyan;
      ctx.fillRect(x - 6, y - 10, 12, 3);
    }
    if (b.job && b.job.phase === 'work') {
      const k = (t - b.job.t0) / b.job.dur;
      ctx.strokeStyle = C.green;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, 10 + 4 * Math.sin(k * Math.PI), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
    }
  }

  function drawWithHints(state, ui) {
    draw(state, ui);
    if (ui.tool === 'probe' && state.flags.fluency) {
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, dpr * ox, dpr * oy);
      drawProbeHint(state);
    }
  }

  resize();
  return { draw: drawWithHints, resize, setInset, clientToWorld, worldToClient };
}
