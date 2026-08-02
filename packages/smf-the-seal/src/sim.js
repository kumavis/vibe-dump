/* =====================================================================
   SMF 05 — THE SEAL · DATA LAYER
   Pure JS: no DOM, no canvas, no timers, no Math.random.
   createSim() -> { state, step(dt), act(action) }.
   computeRadius(state, moduleId) is a PURE query — the view animates its
   result (red preview wave / green re-verify wave over the same set) and
   the headless harness asserts its exact membership.

   The scenario in four acts:
     1  seal    — 5s measurement window writes the contract PLATE ≥ 4/s,
                  the open module collapses to a chip, the planner stamps
                  two copies (L5 can only place what L4 sealed).
     2  leak    — ore turns coarse: delivery goes 8/s ×4s, 0 ×4s. The
                  average is still exactly 4/s, so CONTRACT: PASS while
                  downstream starves each trough — BEHAVIOR: FAILING.
     3  break   — hold-to-break: holding BREAK SEAL propagates the blast
                  radius preview; releasing early cancels; holding 1.2s
                  commits and drops 9 nodes to UNVERIFIED.
     4  reseal  — surge tank fix, richer contract ("≥ 4/s per any 2s
                  window"), green re-verification walks the same radius.
   ===================================================================== */

export const DT = 0.1;

export const C = {
  MEASURE: 5,            // seal / reseal measurement window (s)
  HOLD_COMMIT: 1.2,      // hold this long to break the seal
  WAVE_LEAD: 0.15,       // red wave reaches depth d at LEAD + d*STEP
  WAVE_STEP: 0.25,
  VERIFY_PER: 4,         // green wave: seconds per node re-verified
  PLAN_DELAY: 2,         // planner think time after seal
  STAMP_BUILD: 3,        // stamp build time
  STAMP_STAGGER: 1,
  LEAK_MIN_T: 30,        // leak fires at max(30, sealDone + 12)
  LEAK_AFTER_SEAL: 12,
  BURST: 8,              // leak: 8/s for 4s, 0 for 4s (avg = 4/s exactly)
  PERIOD_TICKS: 80,
  DUTY_TICKS: 40,
  PLATE_NOM: 4,
  AVG_TICKS: 80,         // contract v1 measures this rolling average (8s)
  WIN2_TICKS: 20,        // contract v2 measures every 2s window
  TANK_CAP: 18,          // surge tank capacity (absorbs a full 4s burst)
  REPRIME: 1.5,          // restart cost: a tripped station re-primes this long
  SHIP_NOM: 0.5,         // nominal final product rate
  DONE_LAG: 1,
};

/* ------------------------- authored graph -------------------------- */
/* ~14 fixed modules in four tiers + the planner's two stamp slots.
   Array order IS topological order (and the tie-break for wave order). */

const DEFS = [
  { id: 'MINE-A',     tier: 'RAW',  x: 140,  y: 150, kind: 'raw',  outType: 'ORE',   outRate: 12 },
  { id: 'MINE-B',     tier: 'RAW',  x: 140,  y: 395, kind: 'raw',  outType: 'ORE',   outRate: 10 },
  { id: 'SAND-PIT',   tier: 'RAW',  x: 140,  y: 590, kind: 'raw',  outType: 'SAND',  outRate: 6 },
  { id: 'MINE-C',     tier: 'RAW',  x: 140,  y: 835, kind: 'raw',  outType: 'ORE',   outRate: 24, start: 'dormant' },
  { id: 'PLATE-A',    tier: 'INT',  x: 470,  y: 190, kind: 'proc', outType: 'PLATE', outRate: 4, open: true,
    ins: [{ type: 'ORE', rate: 12 }] },
  { id: 'WIRE-MILL',  tier: 'INT',  x: 470,  y: 430, kind: 'proc', outType: 'WIRE',  outRate: 6,
    ins: [{ type: 'ORE', rate: 10 }] },
  { id: 'GLASS-KILN', tier: 'INT',  x: 470,  y: 610, kind: 'proc', outType: 'GLASS', outRate: 3,
    ins: [{ type: 'SAND', rate: 6 }] },
  { id: 'STAMP-1',    tier: 'INT',  x: 470,  y: 780, kind: 'proc', outType: 'PLATE', outRate: 4,
    instanceOf: 'PLATE-A', start: 'planned', ins: [{ type: 'ORE', rate: 12 }] },
  { id: 'STAMP-2',    tier: 'INT',  x: 470,  y: 915, kind: 'proc', outType: 'PLATE', outRate: 4,
    instanceOf: 'PLATE-A', start: 'planned', ins: [{ type: 'ORE', rate: 12 }] },
  { id: 'FRAME-SHOP', tier: 'ASM',  x: 840,  y: 150, kind: 'proc', outType: 'FRAME', outRate: 1,
    ins: [{ type: 'PLATE', rate: 1.5 }, { type: 'WIRE', rate: 3 }] },
  { id: 'HULL-YARD',  tier: 'ASM',  x: 840,  y: 370, kind: 'proc', outType: 'HULL',  outRate: 1,
    ins: [{ type: 'PLATE', rate: 1.5 }, { type: 'GLASS', rate: 3 }] },
  { id: 'SERVO-LAB',  tier: 'ASM',  x: 840,  y: 555, kind: 'proc', outType: 'SERVO', outRate: 2,
    ins: [{ type: 'PLATE', rate: 1 }, { type: 'WIRE', rate: 3 }] },
  { id: 'PANEL-LINE', tier: 'ASM',  x: 840,  y: 800, kind: 'proc', outType: 'PANEL', outRate: 2,
    start: 'ghost', ins: [{ type: 'PLATE', rate: 8 }] },
  { id: 'CORE-ASSY',  tier: 'ASM',  x: 1100, y: 240, kind: 'proc', outType: 'CORE',  outRate: 1,
    ins: [{ type: 'FRAME', rate: 1 }, { type: 'SERVO', rate: 2 }] },
  { id: 'SHIP-DOCK',  tier: 'PROD', x: 1290, y: 430, kind: 'proc', outType: 'SHIP',  outRate: 0.5,
    ins: [{ type: 'HULL', rate: 1 }, { type: 'CORE', rate: 1 }] },
  { id: 'EXPORT-BAY', tier: 'PROD', x: 1480, y: 660, kind: 'sink', outType: 'CRATE', outRate: 0,
    ins: [{ type: 'SHIP', rate: 0.5 }, { type: 'PANEL', rate: 2 }] },
];

const EDGE_DEFS = [
  ['MINE-A', 'PLATE-A', 'ORE', 12],
  ['MINE-B', 'WIRE-MILL', 'ORE', 10],
  ['SAND-PIT', 'GLASS-KILN', 'SAND', 6],
  ['MINE-C', 'STAMP-1', 'ORE', 12],
  ['MINE-C', 'STAMP-2', 'ORE', 12],
  ['PLATE-A', 'FRAME-SHOP', 'PLATE', 1.5],
  ['PLATE-A', 'HULL-YARD', 'PLATE', 1.5],
  ['PLATE-A', 'SERVO-LAB', 'PLATE', 1],
  ['WIRE-MILL', 'FRAME-SHOP', 'WIRE', 3],
  ['WIRE-MILL', 'SERVO-LAB', 'WIRE', 3],
  ['GLASS-KILN', 'HULL-YARD', 'GLASS', 3],
  ['STAMP-1', 'PANEL-LINE', 'PLATE', 4],
  ['STAMP-2', 'PANEL-LINE', 'PLATE', 4],
  ['FRAME-SHOP', 'CORE-ASSY', 'FRAME', 1],
  ['SERVO-LAB', 'CORE-ASSY', 'SERVO', 2],
  ['HULL-YARD', 'SHIP-DOCK', 'HULL', 1],
  ['CORE-ASSY', 'SHIP-DOCK', 'CORE', 1],
  ['SHIP-DOCK', 'EXPORT-BAY', 'SHIP', 0.5],
  ['PANEL-LINE', 'EXPORT-BAY', 'PANEL', 2],
];

const SEAL_ID = 'PLATE-A';
const PLATE_CONSUMERS = ['FRAME-SHOP', 'HULL-YARD', 'SERVO-LAB'];

/* ---------------------- pure radius query --------------------------- */
/* The blast radius of breaking `moduleId`'s seal: every module that
   transitively assumed its contract. Instances (planner stamps of the
   same sealed word) join at depth 1 and their own dependents follow.
   Returns exact membership + the counts the preview tally shows. */
export function computeRadius(state, moduleId) {
  const byId = state.byId;
  const depth = new Map();
  const queue = [moduleId];
  depth.set(moduleId, 0);
  for (const m of state.modules) {
    if (m.instanceOf === moduleId && m.placed) { depth.set(m.id, 1); queue.push(m.id); }
  }
  while (queue.length) {
    const id = queue.shift();
    const d = depth.get(id);
    for (const e of state.edges) {
      if (e.from !== id) continue;
      const tm = byId[e.to];
      if (tm.state === 'ghost' || tm.state === 'planned') continue;
      if (!depth.has(e.to)) { depth.set(e.to, d + 1); queue.push(e.to); }
    }
  }
  const nodes = [];
  for (const m of state.modules) {
    if (m.id === moduleId) continue;
    if (depth.has(m.id)) nodes.push({ id: m.id, depth: depth.get(m.id), ix: m.ix });
  }
  nodes.sort((a, b) => a.depth - b.depth || a.ix - b.ix);
  const stamps = nodes.filter((n) => byId[n.id].instanceOf === moduleId).map((n) => n.id);
  const modules = nodes.filter((n) => !byId[n.id].instanceOf).map((n) => n.id);
  const contracts = state.edges.filter((e) => e.from === moduleId).length;
  const reverifyEst = C.MEASURE + nodes.length * C.VERIFY_PER;
  return {
    nodes, modules, stamps, contracts,
    reverifyEst,
    reverifyRounded: Math.round(reverifyEst / 5) * 5,
    maxDepth: nodes.reduce((m, n) => Math.max(m, n.depth), 0),
  };
}

/* --------------------------- createSim ------------------------------ */
export function createSim() {
  const modules = DEFS.map((d, ix) => ({
    id: d.id, ix, tier: d.tier, x: d.x, y: d.y, kind: d.kind,
    outType: d.outType, outRate: d.outRate, outFlow: 0,
    instanceOf: d.instanceOf || null, openDesign: !!d.open,
    state: d.start === 'planned' ? 'planned' : d.start === 'ghost' ? 'ghost'
      : d.start === 'dormant' ? 'dormant' : 'on',
    placed: d.start !== 'planned',
    verified: true, verifiedAt: -9, buildT0: -1, reprimeUntil: 0,
    ins: (d.ins || []).map((i) => {
      /* lean line buffers (~1.3s of draw) + a strict restart hysteresis:
         a starved station trips and waits for a nearly-full hopper. This
         is what the bursty delivery exploits — the leak needs a taut line. */
      const cap = Math.max(2, i.rate * 0.6);
      return {
        type: i.type, rate: i.rate, cap,
        buf: d.start === 'planned' || d.start === 'ghost' ? 0 : cap * 0.8,
        restart: cap * 0.95,
        starved: false, lastStarveT: -9, lastSpillT: -9,
      };
    }),
  }));
  const byId = {};
  for (const m of modules) byId[m.id] = m;

  const edges = EDGE_DEFS.map(([from, to, type, rate]) => {
    const tm = byId[to];
    const ti = tm.ins.findIndex((i) => i.type === type);
    return { from, to, type, rate, ti, flow: 0 };
  });
  for (const m of modules) {
    m.outEdges = edges.filter((e) => e.from === m.id);
    m.outRateSum = m.outEdges.reduce((s, e) => s + e.rate, 0);
  }

  const state = {
    t: 0, tick: 0,
    world: { w: 1600, h: 1000 },
    modules, edges, byId,
    flags: {}, flagOrder: [], events: [],
    phase: 'open',            // open -> measuring -> sealed -> broken -> fixed -> resealing -> resealed
    contract: null,           // { min, windowed } | null
    measureT0: -1, sealDoneT: -1, sealBrokenT: -1, resealedT: -1, reverifiedT: -1,
    hold: null,               // { t0, radius } while BREAK SEAL is held
    lastCancel: null,         // { t, radius, held } after an early release
    planner: { status: 'idle', t0: -1 },
    leakAt: 0, leakActive: false, leakTick: 0, leakStarveSeen: false,
    paradox: false,
    surgeTank: false, tankLevel: 0, plateRaw: C.PLATE_NOM,
    reverify: null,           // { order, i, t0 } during the green wave
    banner: null,             // { msg, t }
    rates: { plate: 0, plateAvg: C.PLATE_NOM, win2: C.PLATE_NOM, ship: C.SHIP_NOM, shipAvg5: C.SHIP_NOM, crate: 1 },
  };

  /* measurement rings — reused every tick, zero allocation in step() */
  const plateHist = new Float32Array(C.AVG_TICKS).fill(C.PLATE_NOM * DT);
  const win2Hist = new Float32Array(C.WIN2_TICKS).fill(C.PLATE_NOM * DT);
  const shipHist = new Float32Array(50).fill(C.SHIP_NOM * DT);
  let plateSum = C.PLATE_NOM * DT * C.AVG_TICKS;
  let win2Sum = C.PLATE_NOM * DT * C.WIN2_TICKS;
  let shipSum = C.SHIP_NOM * DT * 50;
  let plateIx = 0, win2Ix = 0, shipIx = 0;

  const ev = (msg) => {
    state.events.push({ t: state.t, msg });
    if (state.events.length > 80) state.events.shift();
  };
  const flag = (k, msg) => {
    if (!state.flags[k]) {
      state.flags[k] = true;
      state.flagOrder.push({ k, t: state.t });
      if (msg) ev(msg);
    }
  };
  const banner = (msg) => { state.banner = { msg, t: state.t }; };

  function commitBreak() {
    const radius = state.hold.radius;
    state.hold = null;
    state.phase = 'broken';
    state.contract = null;
    state.sealBrokenT = state.t;
    for (const n of radius.nodes) {
      const m = byId[n.id];
      m.verified = false;
      for (const inp of m.ins) inp.starved = false;
    }
    state.planner.status = 'halted';
    state.lastRadius = radius;
    flag('sealBroken',
      `SEAL BROKEN — PLATE-A re-opened; ${radius.nodes.length} nodes UNVERIFIED, planner HALTED`);
    banner('SEAL BROKEN — BLAST RADIUS UNVERIFIED');
  }

  /* ------------------------------ step ------------------------------ */
  function step(dt) {
    state.tick++;
    state.t = state.tick * DT;
    const t = state.t;

    flag('start', 'All four tiers nominal — PLATE-A running OPEN (crusher → smelter → buffer)');

    /* -- ceremonies & scripted schedule -- */
    if (state.phase === 'measuring' && t >= state.measureT0 + C.MEASURE) {
      state.phase = 'sealed';
      state.sealDoneT = t;
      state.contract = { min: C.PLATE_NOM, windowed: false };
      flag('sealed', 'PLATE-A SEALED ◈ — contract: PLATE ≥ 4/s (sustained avg). Downstream now assumes it.');
      banner('SEALED ◈ PLATE ≥ 4/s');
      state.leakAt = Math.max(C.LEAK_MIN_T, t + C.LEAK_AFTER_SEAL);
      state.planner = { status: 'planning', t0: t };
      ev('PLANNER: "PLATE" entered the vocabulary — siting 2 stamps on the MINE-C field');
    }
    if (state.phase === 'resealing' && t >= state.measureT0 + C.MEASURE) {
      state.phase = 'resealed';
      state.resealedT = t;
      state.contract = { min: C.PLATE_NOM, windowed: true };
      flag('resealed', 'PLATE-A RESEALED ◈ — richer contract: PLATE ≥ 4/s per ANY 2s window (the failure taught it)');
      banner('RESEALED ◈ ≥ 4/s PER ANY 2s WINDOW');
      const r = computeRadius(state, SEAL_ID);
      state.lastRadius = r;
      state.reverify = { order: r.nodes.map((n) => n.id), i: 0, t0: t };
      ev(`GREEN WAVE — re-verifying the same ${r.nodes.length}-node radius the red preview showed`);
    }

    /* planner: stamps two copies of the sealed chip (L5 places only what L4 sealed) */
    const pl = state.planner;
    if (pl.status === 'planning' && t >= pl.t0 + C.PLAN_DELAY) {
      pl.status = 'stamping';
      const s1 = byId['STAMP-1'], s2 = byId['STAMP-2'];
      s1.placed = s2.placed = true;
      s1.state = s2.state = 'building';
      s1.buildT0 = t; s2.buildT0 = t + C.STAMP_STAGGER;
      byId['MINE-C'].state = 'on';
      ev('MINE-C ONLINE — ore field wakes to feed the planner’s stamps');
    }
    for (const sid of ['STAMP-1', 'STAMP-2']) {
      const s = byId[sid];
      if (s.state === 'building' && t >= s.buildT0 + C.STAMP_BUILD) {
        s.state = 'on';
        for (const inp of s.ins) inp.buf = inp.cap * 0.8;
        ev(`${sid} ONLINE — PLATE-A′ stamped, producing PLATE 4/s under the sealed contract`);
      }
    }
    if (pl.status === 'stamping' && byId['STAMP-1'].state === 'on' && byId['STAMP-2'].state === 'on') {
      pl.status = 'active';
      byId['PANEL-LINE'].state = 'on';
      for (const inp of byId['PANEL-LINE'].ins) inp.buf = inp.cap * 0.8;
      flag('plannerStamped', 'PLANNER STAMPED ×2 — PANEL-LINE fed. The planner can only place what has been sealed.');
    }

    /* leak: scripted geology — coarse ore makes PLATE-A bursty */
    if (state.leakAt && !state.leakActive && t >= state.leakAt) {
      state.leakActive = true;
      state.leakTick = state.tick;
      ev('ORE SEAM TURNED COARSE — PLATE-A delivery now 8/s ×4s, 0 ×4s. Average still exactly 4/s.');
      banner('ORE COARSE — DELIVERY GONE BURSTY');
    }

    /* hold-to-break commit */
    if (state.hold && t >= state.hold.t0 + C.HOLD_COMMIT) commitBreak();

    /* green re-verification wave */
    if (state.reverify) {
      const rv = state.reverify;
      if (t >= rv.t0 + (rv.i + 1) * C.VERIFY_PER) {
        const m = byId[rv.order[rv.i]];
        m.verified = true;
        m.verifiedAt = t;
        rv.i++;
        ev(`RE-VERIFIED ${m.id} against the 2s-window contract (${rv.i}/${rv.order.length})`);
        if (rv.i >= rv.order.length) {
          state.reverify = null;
          state.reverifiedT = t;
          state.planner.status = 'active';
          flag('reverified', 'GREEN WAVE COMPLETE — full radius re-verified; planner stamps resume');
          banner('RE-VERIFIED — LINE RESUMING');
        }
      }
    }

    /* -- production pass, topological order -- */
    let plateOutAmt = 0;
    for (const m of modules) {
      let outAmt = 0;
      if (m.id === SEAL_ID) {
        /* PLATE-A internals: crusher -> smelter -> buffer (-> surge tank) */
        let raw = C.PLATE_NOM;
        if (state.leakActive) {
          raw = ((state.tick - state.leakTick) % C.PERIOD_TICKS) < C.DUTY_TICKS ? C.BURST : 0;
        }
        const inp = m.ins[0];
        const need = inp.rate * dt;
        if (inp.buf + 1e-9 >= need) inp.buf -= need; else raw = 0;
        state.plateRaw = raw;
        if (state.surgeTank) {
          const avail = state.tankLevel + raw * dt;
          outAmt = Math.min(C.PLATE_NOM * dt, avail);
          state.tankLevel = Math.min(C.TANK_CAP, avail - outAmt);
        } else {
          outAmt = raw * dt;
        }
        m.outFlow = outAmt / dt;
        plateOutAmt = outAmt;
      } else if (m.kind === 'raw') {
        m.outFlow = m.state === 'on' ? m.outRate : 0;
        outAmt = m.outFlow * dt;
      } else if (m.kind === 'sink') {
        let crate = 0;
        if (m.state === 'on' && m.verified) {
          for (const inp of m.ins) {
            const take = Math.min(inp.rate * dt, inp.buf);
            inp.buf -= take;
            crate += take * (inp.type === 'SHIP' ? 2 : 0.5);
          }
        }
        m.outFlow = crate / dt;
      } else {
        /* generic processor: starvation latch (restart hysteresis) plus a
           re-prime delay — a tripped or halted station pays REPRIME seconds
           before producing again. Bursty delivery is expensive *because*
           restarts are expensive; steady delivery never trips. */
        if (m.state !== 'on' || !m.verified) {
          m.outFlow = 0;
          m.reprimeUntil = t + C.REPRIME;
        } else {
          let blocked = false;
          for (const inp of m.ins) {
            if (inp.starved) {
              if (inp.buf >= inp.restart) inp.starved = false;
              else { blocked = true; inp.lastStarveT = t; }
            }
          }
          if (!blocked) {
            for (const inp of m.ins) {
              if (inp.buf + 1e-9 < inp.rate * dt) {
                inp.starved = true;
                inp.lastStarveT = t;
                blocked = true;
              }
            }
          }
          if (blocked) {
            m.outFlow = 0;
            m.reprimeUntil = t + C.REPRIME;
          } else if (t < m.reprimeUntil) {
            m.outFlow = 0;      // hoppers ready, machine still warming up
          } else {
            for (const inp of m.ins) inp.buf -= inp.rate * dt;
            m.outFlow = m.outRate;
            outAmt = m.outRate * dt;
          }
        }
      }
      /* distribute along typed out-edges, proportional to edge rate;
         a full buffer spills (lost) — no smart re-routing */
      if (m.outEdges.length) {
        if (outAmt <= 0) {
          for (const e of m.outEdges) e.flow = 0;
        } else {
          for (const e of m.outEdges) {
            const share = outAmt * (e.rate / m.outRateSum);
            const tm = byId[e.to];
            const inp = tm.ins[e.ti];
            const amt = Math.min(share, inp.cap - inp.buf);
            inp.buf += amt;
            if (share - amt > 1e-9) inp.lastSpillT = t;
            e.flow = amt / dt;
          }
        }
      }
    }

    /* -- measurement rings (contract meter, product meter) -- */
    plateSum += plateOutAmt - plateHist[plateIx];
    plateHist[plateIx] = plateOutAmt;
    plateIx = (plateIx + 1) % C.AVG_TICKS;
    win2Sum += plateOutAmt - win2Hist[win2Ix];
    win2Hist[win2Ix] = plateOutAmt;
    win2Ix = (win2Ix + 1) % C.WIN2_TICKS;
    const shipAmt = byId['SHIP-DOCK'].outFlow * dt;
    shipSum += shipAmt - shipHist[shipIx];
    shipHist[shipIx] = shipAmt;
    shipIx = (shipIx + 1) % 50;

    const r = state.rates;
    r.plate = byId[SEAL_ID].outFlow;
    r.plateAvg = plateSum / (C.AVG_TICKS * DT);
    r.win2 = win2Sum / (C.WIN2_TICKS * DT);
    r.ship = byId['SHIP-DOCK'].outFlow;
    r.shipAvg5 = shipSum / 5;
    r.crate = byId['EXPORT-BAY'].outFlow;

    /* -- the leak paradox: contract genuinely PASS, behavior failing -- */
    const measured = state.contract && state.contract.windowed ? r.win2 : r.plateAvg;
    state.contractPass = state.contract ? measured >= state.contract.min - 0.05 : null;
    if (state.leakActive && !state.surgeTank) {
      for (const cid of PLATE_CONSUMERS) {
        if (byId[cid].ins[0].starved) state.leakStarveSeen = true;
      }
    }
    state.paradox = !!(state.contract && state.phase === 'sealed' && state.contractPass
      && state.leakActive && !state.surgeTank && state.leakStarveSeen);
    if (state.paradox) {
      flag('leak', 'LEAKY ABSTRACTION — CONTRACT: PASS · BEHAVIOR: FAILING. The average is true; the burst starves the line.');
      if (!state._leakBannerDone) { state._leakBannerDone = true; banner('CONTRACT: PASS · BEHAVIOR: FAILING'); }
    }

    /* -- done: recovery above 90% of nominal after re-verification -- */
    if (state.flags.reverified && !state.flags.done
      && t >= state.reverifiedT + C.DONE_LAG && r.shipAvg5 >= 0.9 * C.SHIP_NOM) {
      flag('done', `SCENARIO COMPLETE T+${t.toFixed(0)}s — product back above 90% under the richer contract`);
      banner(`THE SEAL HELD — T+${t.toFixed(0)}s`);
    }
  }

  /* ------------------------------ act ------------------------------- */
  function act(a) {
    switch (a.type) {
      case 'seal':
        if (state.phase === 'open') {
          state.phase = 'measuring';
          state.measureT0 = state.t;
          ev('MEASUREMENT WINDOW OPEN — observing PLATE-A throughput for 5s');
        }
        break;
      case 'breakHold':
        if (a.on) {
          if (!state.hold && (state.phase === 'sealed'
            || (state.phase === 'resealed' && !state.reverify))) {
            state.hold = { t0: state.t, radius: computeRadius(state, SEAL_ID) };
          }
        } else if (state.hold) {
          const held = state.t - state.hold.t0;
          state.lastCancel = { t: state.t, radius: state.hold.radius, held };
          state.hold = null;
          flag('radiusPreviewed',
            `BLAST RADIUS PREVIEWED — held ${held.toFixed(1)}s, released early. Nothing broke.`);
        }
        break;
      case 'fix':
        if (state.phase === 'broken' && !state.surgeTank) {
          state.surgeTank = true;
          state.tankLevel = 0;
          state.phase = 'fixed';
          flag('fixed', 'SURGE TANK installed after the buffer — absorbs the 4s burst, drains a steady 4/s');
        }
        break;
      case 'reseal':
        if (state.phase === 'fixed' || (state.phase === 'broken' && state.surgeTank)) {
          state.phase = 'resealing';
          state.measureT0 = state.t;
          ev('RE-MEASUREMENT — this time the window watches every 2s slice, because the failure taught it to');
        }
        break;
      default:
        break;
    }
  }

  ev('Four tiers: RAW → INTERMEDIATE → ASSEMBLY → PRODUCT · final product SHIP 0.5/s');
  ev('PLATE-A is OPEN — three internal parts visible. SEAL it to write its contract.');

  return { state, step, act };
}
