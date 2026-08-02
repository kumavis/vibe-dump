/* =====================================================================
   SMF 02 — THE JAM · data layer
   L2→L3: manual toil saturates → alert routing as relief.
   Alerts are PHYSICAL TOKENS: a tripped gate mints one, it travels the
   trace to the alert bay, queues, and dispatches a responder bot.
   The storm: a degraded belt flutters at the gate threshold, the gate
   chatters, the bay floods. The fix is a TANK between probe and gate —
   hysteresis as a part, not a config field.

   Pure JS: no DOM, no canvas, no timers, no Math.random.
   createSim(opts?) -> { state, step(dt), act(action) }
   ===================================================================== */

export const DT = 0.1;

export const P = {
  laneRate: 2.0,          // matter/s per flowing lane
  maxLanes: 8,
  startLanes: 2,
  startMatter: 25,
  laneCostBase: 40, laneCostStep: 30,
  probeCost: 15,
  botCost: 25, maxBots: 2,
  tankCost: 20,
  quota: 1500,

  firstJamAt: 8,
  jamBase: 24,            // mean jam interval = jamBase / activeLanes
  jamMin: 3.5,

  gateTrip: 0.5,          // s of flow-token silence before an untanked gate trips
  tankCap: 6, tankLo: 1.5, tankHi: 4,   // hysteresis band lives in the part
  tankGain: 2.0,          // flow -> tank inflow multiplier
  tankDrain: 1.5,         // constant drain

  flutterPeriod: 1.4, flutterDuty: 0.5, // degraded belt: 0<->2 square wave
  stormDelay: 10,         // s after firstAutoClear before the belt degrades
  stormQueue: 6,          // bay queue depth that flags the storm

  botSpeed: 350,          // px/s
  botWork: 1.0,           // s to clear a real jam
  ghostWork: 0.25,        // s wasted when the lane self-recovered
  tokenSpeed: 260,        // alert token px/s along the trace

  fluencyClears: 12,      // manual clears that earn the signal palette
  handsFreeSecs: 60, handsFreeLanes: 6,

  seed: 0x5eed02,
};

/* World geometry (abstract px). Lives here so sim distances (bot travel,
   token transit) and the view agree, and the harness can reason about it. */
export const G = {
  W: 960, H: 640,
  laneX0: 130, laneX1: 690,       // belt span
  laneY0: 64, laneDY: 50,         // lane i center: laneY0 + i*laneDY
  overlayDY: -16,                 // signal overlay height above the belt
  probeX: 300, tankX: 440, gateX: 580,
  chanX: 632,                     // shared vertical trace channel
  trunkY: 536,                    // horizontal trunk into the bay
  queueX: 500, queueY: 552,       // queue slots grow leftward from here
  padX: 420, padY: 596,           // responder parking
  bayX0: 330, bayY0: 560, bayX1: 644, bayY1: 628,
  bankX: 744, bankY0: 64, bankY1: 414,
};

export const MILESTONES = [
  ['firstJam', 'First belt jam'],
  ['firstClear', 'Cleared by hand'],
  ['fluency', '12 manual clears — palette earned'],
  ['firstProbe', 'First lane probed'],
  ['firstAutoClear', 'First automated clear'],
  ['storm', 'Alert storm — bay flooded'],
  ['tankInstalled', 'Tank on the flapping lane'],
  ['stormQuelled', 'Storm quelled — hysteresis holds'],
  ['handsFree', '60s hands-free, 6+ lanes'],
  ['quota', 'Quota banked — 1500 matter'],
];

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const laneY = (ix) => G.laneY0 + ix * G.laneDY;
export const laneCost = (activeNow) => P.laneCostBase + P.laneCostStep * (activeNow - P.startLanes);

/* Alert trace polyline for lane ix: gate -> channel -> trunk -> bay queue. */
export function tracePath(ix) {
  const ly = laneY(ix) + G.overlayDY;
  return [
    [G.gateX + 8, ly],
    [G.chanX, ly],
    [G.chanX, G.trunkY],
    [G.queueX, G.trunkY],
  ];
}
export function pathLength(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}
export function pointOnPath(pts, s, out) {
  out = out || [0, 0];
  for (let i = 1; i < pts.length; i++) {
    const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (s <= d) {
      const k = d ? s / d : 0;
      out[0] = pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k;
      out[1] = pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k;
      return out;
    }
    s -= d;
  }
  out[0] = pts[pts.length - 1][0]; out[1] = pts[pts.length - 1][1];
  return out;
}

export function createSim(opts = {}) {
  const rng = mulberry32((opts.seed ?? P.seed) >>> 0);

  const lanes = [];
  for (let i = 0; i < P.maxLanes; i++) {
    lanes.push({
      ix: i,
      active: i < P.startLanes,
      jam: null,              // { x, t0 }
      jamsSeen: 0,
      probe: false, probeT: -1,
      tank: false, tankLevel: 0,
      gateArmed: true, silence: 0,
      lastTripT: -999, trips: 0,
      degraded: false, flutT0: 0,
      flow: 0,
      tracePts: tracePath(i), traceLen: 0,
    });
    lanes[i].traceLen = pathLength(lanes[i].tracePts);
  }

  const state = {
    t: 0,
    matter: P.startMatter,
    banked: 0,
    throughput: 0,
    lanes,
    bots: [],                 // { hx, hy, job } — position derived from job
    transit: [],              // alert tokens in flight { lane, t0, t1 }
    queue: [],                // alert tokens waiting at the bay { lane }
    manualClears: 0, autoClears: 0, ghostVisits: 0, alertsMinted: 0,
    clearTs: [],              // rolling 60s window of manual clear times
    handsRate: 0,
    lastManualT: -1e9,
    lastUnder6T: 0,
    nextJamAt: P.firstJamAt,
    stormAt: null, stormLane: -1, tankT: -1,
    flags: {}, flagT: {},
    events: [],
    done: false,
    stats: { handsPeakPre: 0, handsPeak: 0, peakQueue: 0, peakQueueStorm: 0, queueAtQuell: -1 },
  };

  const scratch = new Array(P.maxLanes);
  let lastMintEv = -1e9, lastGhostEv = -1e9, lastAutoEv = -1e9;

  const ev = (msg) => {
    state.events.push({ t: state.t, msg });
    if (state.events.length > 60) state.events.shift();
  };
  const flag = (k, msg) => {
    if (state.flags[k]) return false;
    state.flags[k] = true;
    state.flagT[k] = state.t;
    if (msg) ev(msg);
    return true;
  };

  const activeCount = () => {
    let n = 0;
    for (const l of lanes) if (l.active) n++;
    return n;
  };
  const allActiveProbed = () => {
    for (const l of lanes) if (l.active && !l.probe) return false;
    return true;
  };

  function mint(l) {
    l.gateArmed = false;
    l.lastTripT = state.t;
    l.trips++;
    state.alertsMinted++;
    state.transit.push({ lane: l.ix, t0: state.t, t1: state.t + l.traceLen / P.tokenSpeed });
    if (state.t - lastMintEv > 2) {
      ev(`GATE ${l.ix + 1} tripped — ALERT token minted`);
      lastMintEv = state.t;
    }
  }

  function step(dt) {
    const s = state;
    s.t += dt;
    const t = s.t;

    /* --- jam scheduler (seeded, deterministic) --- */
    if (t >= s.nextJamAt) {
      let n = 0;
      for (const l of lanes) if (l.active && !l.jam && !l.degraded) scratch[n++] = l;
      if (n > 0) {
        const l = scratch[Math.floor(rng() * n) % n];
        l.jam = { x: G.laneX0 + 60 + rng() * (G.laneX1 - G.laneX0 - 150), t0: t };
        l.jamsSeen++;
        if (!flag('firstJam', `JAM — LANE ${l.ix + 1} belt stalled. Click the clog to clear.`))
          ev(`JAM — LANE ${l.ix + 1} belt stalled`);
        const na = activeCount();
        s.nextJamAt = t + Math.max(P.jamMin, P.jamBase / na) * (0.8 + 0.4 * rng());
      } else {
        s.nextJamAt = t + 1;
      }
    }

    /* --- lane flows & income (rates, not items) --- */
    let tp = 0;
    for (const l of lanes) {
      let f = 0;
      if (l.active && !l.jam) {
        if (l.degraded) {
          const ph = ((t - l.flutT0) / P.flutterPeriod) % 1;
          f = ph < P.flutterDuty ? P.laneRate : 0;
        } else f = P.laneRate;
      }
      l.flow = f;
      tp += f;
    }
    s.throughput = tp;
    s.matter += tp * dt;
    s.banked += tp * dt;

    /* --- gates: absence of flow tokens is the signal --- */
    for (const l of lanes) {
      if (!l.probe) continue;
      const flowing = l.flow > 1e-3;
      if (l.tank) {
        /* the gate reads the tank, not the probe: band = hysteresis */
        l.tankLevel = clamp(l.tankLevel + (l.flow * P.tankGain - P.tankDrain) * dt, 0, P.tankCap);
        if (l.gateArmed && l.tankLevel <= P.tankLo) mint(l);
        else if (!l.gateArmed && l.tankLevel >= P.tankHi) l.gateArmed = true;
      } else {
        if (flowing) { l.silence = 0; l.gateArmed = true; }
        else {
          l.silence += dt;
          if (l.gateArmed && l.silence >= P.gateTrip) mint(l);
        }
      }
    }

    /* --- alert tokens in transit -> bay queue (in place, order kept) --- */
    let w = 0;
    for (let i = 0; i < s.transit.length; i++) {
      const tok = s.transit[i];
      if (t >= tok.t1) s.queue.push(tok);
      else s.transit[w++] = tok;
    }
    s.transit.length = w;
    if (s.queue.length > s.stats.peakQueue) s.stats.peakQueue = s.queue.length;
    if (s.stormLane >= 0 && !s.flags.stormQuelled && s.queue.length > s.stats.peakQueueStorm)
      s.stats.peakQueueStorm = s.queue.length;

    /* --- responder bots: job records, position derived --- */
    for (const b of s.bots) {
      const j = b.job;
      if (!j) {
        if (s.queue.length) {
          const tok = s.queue.shift();
          const l = lanes[tok.lane];
          const tx = l.jam ? l.jam.x : (G.probeX + G.gateX) / 2;
          const ty = laneY(tok.lane);
          const d = Math.hypot(tx - b.hx, ty - b.hy);
          b.job = {
            lane: tok.lane, phase: 'travel', t0: t,
            dur: Math.max(0.15, d / P.botSpeed),
            x0: b.hx, y0: b.hy, tx, ty,
          };
        }
      } else if (t >= j.t0 + j.dur) {
        if (j.phase === 'travel') {
          const l = lanes[j.lane];
          j.phase = 'work'; j.t0 = t;
          j.dur = l.jam ? P.botWork : P.ghostWork;
        } else if (j.phase === 'work') {
          const l = lanes[j.lane];
          if (l.jam) {
            l.jam = null;
            s.autoClears++;
            if (!flag('firstAutoClear', `RESPONDER cleared LANE ${j.lane + 1} — first automated clear`)
              && t - lastAutoEv > 2) { ev(`RESPONDER cleared LANE ${j.lane + 1}`); lastAutoEv = t; }
          } else {
            s.ghostVisits++;
            if (t - lastGhostEv > 2) {
              ev(`RESPONDER: no fault on LANE ${j.lane + 1} — already recovered`);
              lastGhostEv = t;
            }
          }
          j.phase = 'return'; j.t0 = t;
          j.dur = Math.max(0.15, Math.hypot(j.tx - b.hx, j.ty - b.hy) / P.botSpeed);
        } else {
          b.job = null; // back at the bay — runbook reloaded
        }
      }
    }

    /* --- HANDS meter: manual clears/min over a rolling window --- */
    while (s.clearTs.length && s.clearTs[0] < t - 60) s.clearTs.shift();
    const win = Math.min(Math.max(t, 15), 60);
    s.handsRate = (s.clearTs.length / win) * 60;
    if (s.handsRate > s.stats.handsPeak) s.stats.handsPeak = s.handsRate;
    if (!s.flags.firstProbe && s.handsRate > s.stats.handsPeakPre) s.stats.handsPeakPre = s.handsRate;

    /* --- the storm: scripted degraded belt after automation works --- */
    if (s.flags.firstAutoClear && s.stormAt === null) s.stormAt = t + P.stormDelay;
    if (s.stormAt !== null && s.stormLane < 0 && t >= s.stormAt) {
      let cand = null;
      for (const l of lanes) if (l.probe && l.active && !l.jam && !l.tank) { cand = l; break; }
      if (cand) {
        cand.degraded = true; cand.flutT0 = t; s.stormLane = cand.ix;
        ev(`LANE ${cand.ix + 1} BELT DEGRADED — flow flapping at the gate threshold`);
      }
    }
    if (s.stormLane >= 0 && s.queue.length >= P.stormQueue)
      flag('storm', `ALERT STORM — bay queue at ${s.queue.length}, responders thrashing`);
    if (s.flags.tankInstalled && !s.flags.stormQuelled && s.queue.length <= 1 && t - s.tankT >= 3) {
      s.stats.queueAtQuell = s.queue.length;
      flag('stormQuelled', 'Storm quelled — the tank buffers the flutter, the bay is calm');
    }

    /* --- hands-free: 60s of zero manual clears while 6+ lanes run --- */
    if (activeCount() < P.handsFreeLanes) s.lastUnder6T = t;
    if (!s.flags.handsFree && s.flags.stormQuelled
      && t - Math.max(s.lastManualT, s.lastUnder6T) >= P.handsFreeSecs
      && allActiveProbed() && s.bots.length >= 1) {
      flag('handsFree', `HANDS-FREE — ${P.handsFreeSecs}s with zero manual clears, ${activeCount()} lanes running`);
    }

    /* --- quota --- */
    if (!s.flags.quota && s.banked >= P.quota) {
      flag('quota', `QUOTA BANKED — ${P.quota} matter at T+${t.toFixed(0)}s`);
      s.done = true;
    }
  }

  function act(a) {
    const s = state;
    switch (a && a.type) {
      case 'clear': {
        const l = lanes[a.laneIx];
        if (!l || !l.jam) return { ok: false, reason: 'no jam there' };
        l.jam = null;
        s.manualClears++;
        s.lastManualT = s.t;
        s.clearTs.push(s.t);
        if (!flag('firstClear', `Jam cleared BY HAND — LANE ${l.ix + 1}`)
          && s.manualClears <= 4) ev(`Cleared by hand — LANE ${l.ix + 1} (${s.manualClears})`);
        if (s.manualClears === P.fluencyClears)
          flag('fluency', '12 manual clears — SIGNAL PALETTE earned: probes · responder bot');
        return { ok: true };
      }
      case 'buyLane': {
        const n = activeCount();
        if (n >= P.maxLanes) return { ok: false, reason: 'all lanes built' };
        const cost = laneCost(n);
        if (s.matter < cost) return { ok: false, reason: `need ${cost} matter` };
        s.matter -= cost;
        lanes[n].active = true;
        ev(`LANE ${n + 1} ONLINE — ${cost} matter`);
        return { ok: true };
      }
      case 'buyProbe': {
        if (!s.flags.fluency) return { ok: false, reason: 'palette not earned yet' };
        const l = lanes[a.laneIx];
        if (!l || !l.active) return { ok: false, reason: 'no lane there' };
        if (l.probe) return { ok: false, reason: 'already probed' };
        if (s.matter < P.probeCost) return { ok: false, reason: `need ${P.probeCost} matter` };
        s.matter -= P.probeCost;
        l.probe = true; l.probeT = s.t; l.gateArmed = true; l.silence = 0;
        if (!flag('firstProbe', `PROBE online — LANE ${l.ix + 1}. Silence is the signal.`))
          ev(`PROBE online — LANE ${l.ix + 1}`);
        return { ok: true };
      }
      case 'buyBot': {
        if (!s.flags.fluency) return { ok: false, reason: 'palette not earned yet' };
        if (s.bots.length >= P.maxBots) return { ok: false, reason: 'pad is full' };
        if (s.matter < P.botCost) return { ok: false, reason: `need ${P.botCost} matter` };
        s.matter -= P.botCost;
        const i = s.bots.length;
        s.bots.push({ hx: G.padX + i * 34, hy: G.padY, job: null });
        ev(`RESPONDER ${i + 1} hired — UNJAM runbook loaded from the hopper`);
        return { ok: true };
      }
      case 'buyTank': {
        if (!s.flags.storm) return { ok: false, reason: 'no storm yet' };
        const l = lanes[a.laneIx];
        if (!l || !l.probe) return { ok: false, reason: 'needs a probed lane' };
        if (l.tank) return { ok: false, reason: 'tank already installed' };
        if (s.matter < P.tankCost) return { ok: false, reason: `need ${P.tankCost} matter` };
        s.matter -= P.tankCost;
        l.tank = true;
        l.tankLevel = P.tankHi; // ships primed at the open threshold
        l.gateArmed = true;
        if (l.ix === s.stormLane) {
          s.tankT = s.t;
          flag('tankInstalled', `TANK installed on LANE ${l.ix + 1} — the gate now reads the buffer`);
        } else ev(`TANK installed on LANE ${l.ix + 1}`);
        return { ok: true };
      }
    }
    return { ok: false, reason: 'unknown action' };
  }

  ev('2 lanes running — bank 1500 matter. Jams are yours to clear.');

  return { state, step, act };
}
