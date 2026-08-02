/* =====================================================================
   SMF 06 · CONTINENTAL — DATA LAYER
   Pure JS: no DOM, no canvas, no timers. createSim(opts) returns
   { state, step(dt), act(action) }.

   Scaled port of the Scenario 01 rules (pour / diffuse / decay field,
   dormancy + resorb by neighborhood sensing, commissioning grace,
   primed rigs, gradient-driven growth) onto continent-scale data
   structures:

   - field: two Float32Arrays, ping-ponged; diffusion runs as a flat
     sliding-window stencil over 16×16-cell BLOCKS, skipping blocks the
     organism isn't in (block max ≤ eps and no neighbor above eps).
     The pass also emits per-block maxima — reused by the policy loop.
   - structures: struct-of-arrays typed arrays (x, z, type, state,
     low-timer, builtAt, province, cell, block). Gone slots recycle
     through a free list. Zero allocation in any per-tick path.
   - policy: staggered round-robin — each structure is sensed every
     P.stagger-th tick. The organism's reflexes are slower than its
     heartbeat, and that is exactly why the heartbeat stays fast.
   - spatial index: per-block structure buckets (counting sort),
     rebuilt on a slow cadence when dirty — the view iterates only
     visible buckets, never the full population.
   ===================================================================== */

export const DT = 0.1;
export const WORLD = { w: 1536, h: 1024 };
export const TS = 4;                       // field tile size, world units
export const NX = (WORLD.w / TS) | 0;      // 384
export const NZ = (WORLD.h / TS) | 0;      // 256
export const NCELLS = NX * NZ;             // 98304
export const BS = 8;                       // block = 8×8 cells = 32 wu
export const NBX = (NX / BS) | 0;          // 48
export const NBZ = (NZ / BS) | 0;          // 32
export const NBLOCKS = NBX * NBZ;          // 1536
export const CAP = 80000;                  // structure slot capacity

export const DEFAULT_SEED = 0x5eed06;

export const P = {
  /* cadences — the scaling levers (see README) */
  stagger: 10,        // policy check every Nth tick per structure
  fieldEvery: 8,      // field diffusion/decay pass every Nth tick
  growEvery: 5,       // planner growth event every Nth tick
  bucketEvery: 30,    // spatial bucket rebuild cadence (when dirty)

  /* field dynamics (Scenario 01 lineage) */
  diff: 0.30, decay: 0.18, blockEps: 0.012, fieldCap: 3.5, litEps: 0.045,

  /* organism thresholds */
  dorm: 0.5, wakeMul: 1.15, resorb: 0.22, resorbDelay: 12, warmup: 12,

  /* economy */
  mine: 0.12,         // ore/s per active miner
  yield: 0.3,         // matter per ore
  smeltRatio: 10,     // miners one active smelter can serve
  taper: 0.3,         // reserve fraction below which extraction tapers
  matterCap: 500000,

  /* rig organ (normalized Scenario 01 hysteresis) */
  gainN: 2.5, drainN: 2.2, tankCap: 10, hi: 6, lo: 2, tankBleed: 0.6,

  /* province regeneration while abandoned */
  regen: 0.0008,      // fraction of init reserve per second

  /* pours — per-cell field add per second at kernel center */
  rigBase: 0.14, rigGain: 0.50,
  scoutRate: 0.085,
  scoutMaxPop: 5, scoutMinReserve: 0.25,

  /* the player's verbs */
  playerPour: 0.55, emitLife: 45, emitMergeR: 24, emitRadT: 7,
  pourCost: 80, pourMinGap: 0.25, pourStrengthCap: 2.5,
  starveCost: 30, trenchLife: 90, trenchRadT: 9, trenchAtten: 0.30,
  trenchMergeR: 28,

  /* the planner */
  growBatch: 4, growTargets: 2, surveyBonus: 0.02,
  rigPer: 240, smeltPer: 8,
  cost: { miner: 20, smelter: 30, rig: 25 }, refund: 0.5,

  /* milestones */
  migrationGoal: 300, starveGoal: 200, pourWindow: 180, starveWindow: 150,
};

const ST_ACTIVE = 0, ST_DORMANT = 1, ST_GONE = 2;
const TY_MINER = 0, TY_SMELTER = 1, TY_RIG = 2;
const COSTS = [P.cost.miner, P.cost.smelter, P.cost.rig];
const TYPE_NAMES = ['miner', 'smelter', 'rig'];

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

export function createSim(opts = {}) {
  const seed = (opts.seed ?? DEFAULT_SEED) >>> 0;
  const target = opts.target ?? 50000;
  const rng = mulberry32(seed);

  /* ------------------------------------------------ field (ping-pong) */
  let cur = new Float32Array(NCELLS);
  let nxt = new Float32Array(NCELLS);
  const blockMax = new Float32Array(NBLOCKS);   // per-block field max
  const blockDil = new Float32Array(NBLOCKS);   // dilated (self + 8 nbrs)
  const blockForce = new Uint8Array(NBLOCKS);   // pour landed here: run N passes

  /* ------------------------------------------- structures (SoA arrays) */
  const sx = new Float32Array(CAP);
  const sz = new Float32Array(CAP);
  const stype = new Uint8Array(CAP);
  const sstate = new Uint8Array(CAP);
  const slow = new Float32Array(CAP);     // seconds sensed below resorb
  const sbuiltAt = new Float32Array(CAP); // commissioning grace anchor
  const sprov = new Int16Array(CAP);
  const scell = new Int32Array(CAP);      // field cell index (never moves)
  const sblock = new Int16Array(CAP);     // block index
  let count = 0;                          // high-water slot count
  const freeList = new Int32Array(CAP);
  let freeCount = 0;

  /* ------------------------------------------------- spatial buckets  */
  const bStart = new Int32Array(NBLOCKS + 1);
  const bItems = new Int32Array(CAP);
  const bFill = new Int32Array(NBLOCKS);
  let bucketsDirty = true;

  /* ------------------------------------------------------- provinces  */
  const provinces = [];

  /* ------------------------------------------------- player emitters  */
  const EMIT_SLOTS = 64, EMIT_KCAP = 280;
  const emitters = [];
  for (let i = 0; i < EMIT_SLOTS; i++) {
    emitters.push({
      active: false, x: 0, z: 0, strength: 0, until: -1,
      kIdx: new Int32Array(EMIT_KCAP), kW: new Float32Array(EMIT_KCAP),
      kBlocks: new Int16Array(24), kn: 0, kbn: 0,
    });
  }
  const TRENCH_SLOTS = 32, TRENCH_KCAP = 340;
  const trenches = [];
  for (let i = 0; i < TRENCH_SLOTS; i++) {
    trenches.push({
      active: false, x: 0, z: 0, until: -1,
      kIdx: new Int32Array(TRENCH_KCAP), kn: 0,
    });
  }

  const state = {
    t: 0, seed, matter: 4000, incomeRate: 0,
    field: cur, NX, NZ, TS, WORLD,
    provinces,
    // SoA views for the renderer / harness
    sx, sz, stype, sstate, sprov, scell, sblock,
    get count() { return count; },
    bStart, bItems,
    alive: 0, dormant: 0, resorbedTotal: 0, builtTotal: 0,
    birthsMin: 0, resorbsMin: 0,   // last completed 60 s window
    litCells: 0, activeBlocks: 0,
    emitters, trenches,
    lastPour: { x: 0, z: 0, t: -1e9, prov: -1 },
    pourBuilds: 0,
    lastStarve: { x: 0, z: 0, t: -1e9, prov: -1 },
    starveResorbs: 0,
    pourSpent: 0,
    flags: {}, flagOrder: [], flagT: {}, events: [],
  };

  const ev = (msg) => {
    state.events.push({ t: state.t, msg });
    if (state.events.length > 80) state.events.shift();
  };
  const flag = (k, msg) => {
    if (!state.flags[k]) {
      state.flags[k] = true;
      state.flagOrder.push(k);
      state.flagT[k] = state.t;
      if (msg) ev(msg);
    }
  };

  const cellOf = (x, z) => {
    const gx = clamp((x / TS) | 0, 1, NX - 2);
    const gz = clamp((z / TS) | 0, 1, NZ - 2);
    return gx + gz * NX;
  };
  const blockOfCell = (c) => (((c % NX) / BS) | 0) + ((((c / NX) | 0) / BS) | 0) * NBX;

  /* ================================================== world generation */
  function buildKernel(cxT, czT, radT, kIdx, kW, kBlocks, sharp) {
    // gaussian footprint kernel, clamped inside [1, N-2]; returns [n, nb]
    let n = 0;
    const g0x = Math.max(1, Math.floor(cxT - radT)), g1x = Math.min(NX - 2, Math.ceil(cxT + radT));
    const g0z = Math.max(1, Math.floor(czT - radT)), g1z = Math.min(NZ - 2, Math.ceil(czT + radT));
    const r2 = radT * radT;
    const blocksSeen = new Set();
    for (let gz = g0z; gz <= g1z; gz++) {
      for (let gx = g0x; gx <= g1x; gx++) {
        const d2 = (gx + 0.5 - cxT) ** 2 + (gz + 0.5 - czT) ** 2;
        if (d2 > r2 || n >= kIdx.length) continue;
        kIdx[n] = gx + gz * NX;
        if (kW) kW[n] = Math.exp(-d2 / (r2 * sharp));
        blocksSeen.add(((gx / BS) | 0) + ((gz / BS) | 0) * NBX);
        n++;
      }
    }
    let nb = 0;
    if (kBlocks) for (const b of blocksSeen) { if (nb < kBlocks.length) kBlocks[nb++] = b; }
    return [n, nb];
  }

  function genProvinces() {
    const GX = 12, GZ = 10;
    const cw = WORLD.w / GX, ch = WORLD.h / GZ;
    for (let gz = 0; gz < GZ; gz++) {
      for (let gx = 0; gx < GX; gx++) {
        const r = 26 + rng() * 18;
        const pad = r + 8;
        const x = gx * cw + pad + rng() * Math.max(1, cw - 2 * pad);
        const z = gz * ch + pad + rng() * Math.max(1, ch - 2 * pad);
        const prospect = rng() < 0.15;
        const u0 = rng();
        const reserveFrac = prospect
          ? 0.9 + 0.1 * rng()
          : (u0 < 0.1 ? 0.02 + 0.06 * rng() : 0.25 + 0.75 * rng());
        const life = 400 + 1300 * rng(); // seconds of full-rate extraction
        provinces.push({
          idx: provinces.length, name: `P${String(provinces.length).padStart(3, '0')}`,
          x, z, r, area: Math.PI * r * r,
          prospect, reserveFrac, life,
          cap: 0, init: 0, reserve: 0,
          tank: 0, gate: false, u: 0, rate: 0,
          scoutOn: false, everPop: false,
          pTotal: 0, pAct: 0, pDorm: 0, mAct: 0, smAct: 0, rAct: 0,
          rigs: 0, smelters: 0,
          growI: 0, lastResorbT: -1e9, lastBuildT: -1e9,
          radT: clamp(r / TS * 0.9 + 1.5, 4, 12),
          kIdx: null, kW: null, kBlocks: null, kn: 0, kbn: 0,
          ecc: 0.8 + rng() * 0.25, rot: rng() * Math.PI,
        });
      }
    }
    // capacity: area-proportional so that colonized capacity sums to target
    let areaSum = 0;
    for (const p of provinces) if (!p.prospect) areaSum += p.area;
    const density = target / areaSum;
    for (const p of provinces) {
      p.cap = Math.max(24, Math.floor(p.area * density));
      p.init = p.cap * 0.85 * P.mine * p.life;
      p.reserve = p.init * p.reserveFrac;
      p.kIdx = new Int32Array(520); p.kW = new Float32Array(520);
      p.kBlocks = new Int16Array(40);
      const [kn, kbn] = buildKernel(p.x / TS, p.z / TS, p.radT, p.kIdx, p.kW, p.kBlocks, 0.55);
      p.kn = kn; p.kbn = kbn;
    }
  }

  function placeAt(p, i) {
    // deterministic phyllotaxis fill, center-out, with seeded jitter
    const cap = Math.ceil(p.cap * 1.3);
    const k = i % cap;
    const a = k * 2.399963229728653 + p.rot;
    const rr = p.r * Math.sqrt((k + 0.5) / cap) * 0.97;
    const ca = Math.cos(a), sa = Math.sin(a);
    const ex = ca * rr, ez = sa * rr * p.ecc;
    const cr = Math.cos(p.rot), srot = Math.sin(p.rot);
    const x = p.x + ex * cr - ez * srot + (rng() - 0.5) * 1.6;
    const z = p.z + ex * srot + ez * cr + (rng() - 0.5) * 1.6;
    return [clamp(x, TS * 1.5, WORLD.w - TS * 1.5), clamp(z, TS * 1.5, WORLD.h - TS * 1.5)];
  }

  function typeFor(p) {
    // same rule at gen time and at planner build time
    if (p.rigs < 1 + Math.floor(p.pTotal / P.rigPer)) return TY_RIG;
    if (p.smelters < Math.ceil((p.pTotal + 1) / P.smeltPer)) return TY_SMELTER;
    return TY_MINER;
  }

  function addStructure(p, type, builtAt) {
    let i;
    if (freeCount > 0) i = freeList[--freeCount];
    else { if (count >= CAP) return -1; i = count++; }
    const [x, z] = placeAt(p, p.growI++);
    sx[i] = x; sz[i] = z; stype[i] = type; sstate[i] = ST_ACTIVE;
    slow[i] = 0; sbuiltAt[i] = builtAt; sprov[i] = p.idx;
    const c = cellOf(x, z);
    scell[i] = c; sblock[i] = blockOfCell(c);
    p.pTotal++; p.pAct++;
    if (type === TY_MINER) p.mAct++;
    else if (type === TY_SMELTER) { p.smAct++; p.smelters++; }
    else { p.rAct++; p.rigs++; if (p.tank < P.tankCap) p.tank = P.tankCap; } // primed rig
    state.alive++; state.builtTotal++;
    bucketsDirty = true;
    return i;
  }

  function spawnContinent() {
    let placed = 0;
    // largest-remainder style: fill each colonized province to capacity,
    // trimming the last one so the total hits the target exactly.
    for (const p of provinces) {
      if (p.prospect) continue;
      const n = Math.min(p.cap, target - placed);
      for (let i = 0; i < n; i++) addStructure(p, typeFor(p), -999);
      placed += n;
      if (placed >= target) break;
    }
    // top up round-robin if capacity rounding left us short
    let guard = 0;
    while (placed < target && guard++ < 200000) {
      for (const p of provinces) {
        if (p.prospect || placed >= target) continue;
        addStructure(p, typeFor(p), -999);
        placed++;
      }
    }
    // rig organs start matching their health; pre-warm the field analytically
    for (const p of provinces) {
      const rf = p.reserve / p.init;
      const tf = rf < P.taper ? rf / P.taper : 1;
      if (!p.prospect) {
        p.tank = tf > 0.3 ? P.tankCap * 0.8 : P.tankCap * 0.25;
        p.gate = tf > 0.3;
        const amp = 1.35 * Math.min(1, tf + 0.15);
        for (let k = 0; k < p.kn; k++) {
          const c = p.kIdx[k];
          const v = amp * Math.sqrt(p.kW[k]);
          if (v > cur[c]) cur[c] = v;
        }
      } else {
        const amp = 0.32;
        for (let k = 0; k < p.kn; k++) {
          const c = p.kIdx[k];
          const v = amp * Math.sqrt(p.kW[k]);
          if (v > cur[c]) cur[c] = v;
        }
      }
      for (let k = 0; k < p.kbn; k++) blockForce[p.kBlocks[k]] = 3;
    }
    for (let i = 0; i < NCELLS; i++) {
      const v = cur[i];
      if (v > 0) { const b = blockOfCell(i); if (v > blockMax[b]) blockMax[b] = v; }
    }
    computeDil();
    for (let r = 0; r < 6; r++) fieldPass();
  }

  /* ===================================================== field passes */
  const K_DIFF = P.diff * DT * P.fieldEvery;   // 0.24 — inside the k ≤ 0.25
  const DK = 1 - P.decay * DT * P.fieldEvery;  // explicit-stencil stability limit
  const FIELD_CAP = P.fieldCap, LIT_EPS = P.litEps, BLOCK_EPS = P.blockEps;
  const TR_ATTEN = P.trenchAtten;

  function computeDil() {
    for (let bz = 0; bz < NBZ; bz++) {
      for (let bx = 0; bx < NBX; bx++) {
        const bi = bz * NBX + bx;
        let m = blockMax[bi];
        const x0 = bx > 0 ? -1 : 0, x1 = bx < NBX - 1 ? 1 : 0;
        const z0 = bz > 0 ? -1 : 0, z1 = bz < NBZ - 1 ? 1 : 0;
        for (let dz = z0; dz <= z1; dz++) {
          for (let dx = x0; dx <= x1; dx++) {
            const v = blockMax[bi + dz * NBX + dx];
            if (v > m) m = v;
          }
        }
        blockDil[bi] = m;
      }
    }
  }

  function fieldPass() {
    // trench suppression first: the organism cannot hold a dug trench
    for (let ti = 0; ti < TRENCH_SLOTS; ti++) {
      const tr = trenches[ti];
      if (!tr.active) continue;
      if (state.t > tr.until) { tr.active = false; continue; }
      const kIdx = tr.kIdx, kn = tr.kn;
      for (let k = 0; k < kn; k++) cur[kIdx[k]] *= TR_ATTEN;
    }
    // block-skipped sliding-window stencil; emits blockMax + lit count
    const src = cur, dst = nxt, kd = K_DIFF, dk = DK;
    let lit = 0, act = 0;
    for (let bz = 0; bz < NBZ; bz++) {
      for (let bx = 0; bx < NBX; bx++) {
        const bi = bz * NBX + bx;
        const on = blockForce[bi] > 0 || blockDil[bi] > BLOCK_EPS;
        if (blockForce[bi] > 0) blockForce[bi]--;
        if (!on) { blockMax[bi] = 0; continue; }
        act++;
        let bmax = 0;
        const z0 = bz === 0 ? 1 : bz * BS, z1 = bz === NBZ - 1 ? NZ - 1 : (bz + 1) * BS;
        const x0 = bx === 0 ? 1 : bx * BS, x1 = bx === NBX - 1 ? NX - 1 : (bx + 1) * BS;
        for (let gz = z0; gz < z1; gz++) {
          const row = gz * NX;
          let l = src[row + x0 - 1], c = src[row + x0];
          for (let gx = x0; gx < x1; gx++) {
            const i = row + gx;
            const r = src[i + 1];
            let v = (c + kd * (l + r + src[i - NX] + src[i + NX] - 4 * c)) * dk;
            if (v > FIELD_CAP) v = FIELD_CAP;
            dst[i] = v;
            if (v > bmax) bmax = v;
            l = c; c = r;
          }
        }
        blockMax[bi] = bmax;
        if (bmax > LIT_EPS) {
          for (let gz = z0; gz < z1; gz++) {
            const row = gz * NX;
            for (let gx = x0; gx < x1; gx++) if (dst[row + gx] > LIT_EPS) lit++;
          }
        }
      }
    }
    const t = cur; cur = nxt; nxt = t;
    state.field = cur;
    state.litCells = lit;
    state.activeBlocks = act;
    computeDil();
  }

  function pourKernel(kIdx, kW, kn, amt) {
    // amt = per-cell/s at kernel center, integrated over the field cadence
    const a = amt * DT * P.fieldEvery;
    for (let k = 0; k < kn; k++) {
      const c = kIdx[k];
      let v = cur[c] + a * kW[k];
      if (v > P.fieldCap) v = P.fieldCap;
      cur[c] = v;
    }
  }

  /* ================================================== policy (staggered) */
  const WAKE = P.dorm * P.wakeMul;
  const DT_EFF = P.stagger * DT; // seconds between checks of one structure

  function resorbStructure(i, p) {
    sstate[i] = ST_GONE;
    freeList[freeCount++] = i;
    state.dormant--;
    state.resorbedTotal++;
    resorbsWin++;
    state.matter = Math.min(P.matterCap, state.matter + COSTS[stype[i]] * P.refund);
    p.pTotal--; p.pDorm--;
    if (stype[i] === TY_SMELTER) p.smelters--;
    else if (stype[i] === TY_RIG) p.rigs--;
    p.lastResorbT = state.t;
    bucketsDirty = true;
    if (state.lastStarve.prov === p.idx && state.t - state.lastStarve.t < P.starveWindow) {
      state.starveResorbs++;
      if (state.starveResorbs >= P.starveGoal) {
        flag('starved', `TRENCH BITES — ${state.starveResorbs} structures resorbed in ${p.name}`);
      }
    }
    if (p.pTotal === 0 && p.everPop) {
      p.everPop = false;
      ev(`${p.name} COLLAPSED — organism withdrew (reserve ${(100 * p.reserve / p.init).toFixed(0)}%)`);
    }
  }

  function policySlice(tick) {
    const f = cur, phase = tick % P.stagger, stag = P.stagger;
    const t = state.t, dorm = P.dorm, res = P.resorb, delay = P.resorbDelay, warm = P.warmup;
    for (let i = phase; i < count; i += stag) {
      const st = sstate[i];
      if (st === ST_GONE) continue;
      if (t - sbuiltAt[i] < warm) continue;   // commissioning grace
      const b = sblock[i], dil = blockDil[b], c = scell[i];
      if (st === ST_ACTIVE) {
        if (dil >= dorm) {
          const cv = f[c];
          if (cv >= dorm) continue;           // fast path: centre proves max
          let m = cv, v;
          v = f[c - 1]; if (v > m) m = v; v = f[c + 1]; if (v > m) m = v;
          v = f[c - NX]; if (v > m) m = v; v = f[c - NX - 1]; if (v > m) m = v;
          v = f[c - NX + 1]; if (v > m) m = v; v = f[c + NX]; if (v > m) m = v;
          v = f[c + NX - 1]; if (v > m) m = v; v = f[c + NX + 1]; if (v > m) m = v;
          if (m >= dorm) continue;
        }
        // sleep
        sstate[i] = ST_DORMANT; slow[i] = 0;
        state.alive--; state.dormant++;
        const p = provinces[sprov[i]];
        p.pAct--; p.pDorm++;
        if (stype[i] === TY_MINER) p.mAct--;
        else if (stype[i] === TY_SMELTER) p.smAct--;
        else p.rAct--;
      } else {
        // dormant: wake?
        let m = -1;
        if (dil > WAKE) {
          const cv = f[c];
          if (cv > WAKE) m = cv;
          else {
            m = cv; let v;
            v = f[c - 1]; if (v > m) m = v; v = f[c + 1]; if (v > m) m = v;
            v = f[c - NX]; if (v > m) m = v; v = f[c - NX - 1]; if (v > m) m = v;
            v = f[c - NX + 1]; if (v > m) m = v; v = f[c + NX]; if (v > m) m = v;
            v = f[c + NX - 1]; if (v > m) m = v; v = f[c + NX + 1]; if (v > m) m = v;
          }
          if (m > WAKE) {
            sstate[i] = ST_ACTIVE; slow[i] = 0;
            state.alive++; state.dormant--;
            const p = provinces[sprov[i]];
            p.pAct++; p.pDorm--;
            if (stype[i] === TY_MINER) p.mAct++;
            else if (stype[i] === TY_SMELTER) p.smAct++;
            else p.rAct++;
            continue;
          }
        }
        // resorb countdown (neighborhood max below resorb threshold)
        if (dil < res) slow[i] += DT_EFF;     // whole block is starved
        else {
          if (m < 0) {
            const cv = f[c];
            if (cv >= res) { slow[i] = 0; continue; }
            m = cv; let v;
            v = f[c - 1]; if (v > m) m = v; v = f[c + 1]; if (v > m) m = v;
            v = f[c - NX]; if (v > m) m = v; v = f[c - NX - 1]; if (v > m) m = v;
            v = f[c - NX + 1]; if (v > m) m = v; v = f[c + NX]; if (v > m) m = v;
            v = f[c + NX - 1]; if (v > m) m = v; v = f[c + NX + 1]; if (v > m) m = v;
          }
          if (m < res) slow[i] += DT_EFF; else slow[i] = 0;
        }
        if (slow[i] > delay) resorbStructure(i, provinces[sprov[i]]);
      }
    }
  }

  /* ======================================================= the planner */
  function trenched(p) {
    for (let ti = 0; ti < TRENCH_SLOTS; ti++) {
      const tr = trenches[ti];
      if (!tr.active) continue;
      const dx = p.x - tr.x, dz = p.z - tr.z;
      const rr = P.trenchRadT * TS + p.r * 0.4;
      if (dx * dx + dz * dz < rr * rr) return true;
    }
    return false;
  }

  const growPick = [-1, -1];
  function growStep() {
    // comparative gradient: growth flows to the deepest field it can
    // reach that still has ore and room. Player pours weight this
    // directly through the field itself (policy is fluid, not rules).
    growPick[0] = -1; growPick[1] = -1;
    let s0 = 0, s1 = 0;
    for (let pi = 0; pi < provinces.length; pi++) {
      const p = provinces[pi];
      const rf = p.reserve / p.init;
      if (p.pTotal >= p.cap || rf < 0.02) continue;
      const f = cur[cellOf(p.x, p.z)];
      let score = f * f * rf * (1 - p.pTotal / p.cap) + (p.scoutOn ? P.surveyBonus : 0);
      if (score <= 0.004) continue;
      if (trenched(p)) continue;
      if (score > s0) { s1 = s0; growPick[1] = growPick[0]; s0 = score; growPick[0] = pi; }
      else if (score > s1) { s1 = score; growPick[1] = pi; }
    }
    for (let gi = 0; gi < P.growTargets; gi++) {
      const pi = growPick[gi];
      if (pi < 0) continue;
      const p = provinces[pi];
      for (let n = 0; n < P.growBatch; n++) {
        if (p.pTotal >= p.cap) break;
        const ty = typeFor(p);
        if (state.matter < COSTS[ty]) return;
        state.matter -= COSTS[ty];
        if (addStructure(p, ty, state.t) < 0) return;
        birthsWin++;
        p.lastBuildT = state.t;
        if (p.pTotal === 1) ev(`${p.name} SETTLED — first ${TYPE_NAMES[ty]} on new ground`);
        if (p.pTotal >= 30 && !p.everPop) p.everPop = true;
        if (state.lastPour.prov === p.idx && state.t - state.lastPour.t < P.pourWindow) {
          state.pourBuilds++;
          if (state.pourBuilds >= P.migrationGoal) {
            flag('migration', `MIGRATION — ${state.pourBuilds} structures raised toward the pour at ${p.name}`);
          }
        }
      }
    }
  }

  /* ================================================= buckets (counting) */
  function rebuildBuckets() {
    bStart.fill(0);
    for (let i = 0; i < count; i++) {
      if (sstate[i] === ST_GONE) continue;
      bStart[sblock[i] + 1]++;
    }
    for (let b = 0; b < NBLOCKS; b++) bStart[b + 1] += bStart[b];
    bFill.set(bStart.subarray(0, NBLOCKS));
    for (let i = 0; i < count; i++) {
      if (sstate[i] === ST_GONE) continue;
      bItems[bFill[sblock[i]]++] = i;
    }
    bucketsDirty = false;
  }

  /* ========================================================== stepping */
  let tick = 0;
  let birthsWin = 0, resorbsWin = 0, windowEnd = 60;
  let incomeAcc = 0, lastPourRejectEv = -1e9;

  function nearestProvince(x, z) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < provinces.length; i++) {
      const p = provinces[i];
      const d = (p.x - x) ** 2 + (p.z - z) ** 2;
      if (d < bd) { bd = d; best = i; }
    }
    return best;
  }

  const prof = opts.profile ? { econ: 0, field: 0, policy: 0, grow: 0, buckets: 0, ticks: 0 } : null;
  if (prof) state.prof = prof;
  const pnow = prof ? () => performance.now() : () => 0;

  function step(/* dt is always DT: fixed tick, fast-forward = more ticks */) {
    tick++;
    state.t += DT;
    const t = state.t;
    const fieldTick = tick % P.fieldEvery === 0;
    let pt = pnow();

    /* --- province economy: extraction, rig organ, pours --- */
    let income = 0;
    {
      const mine = P.mine, taper = P.taper, smeltR = P.smeltRatio * P.mine, yld = P.yield;
      const gainN = P.gainN, drainN = P.drainN, tankCap = P.tankCap, hi = P.hi, lo = P.lo;
      const bleed = P.tankBleed, regen = P.regen * DT;
      const rigBase = P.rigBase, rigGain = P.rigGain, scoutRate = P.scoutRate;
      const scoutPop = P.scoutMaxPop, scoutRes = P.scoutMinReserve;
      for (let pi = 0; pi < provinces.length; pi++) {
        const p = provinces[pi];
        let rate = 0, u = 0;
        if (p.mAct > 0 && p.smAct > 0 && p.reserve > 0) {
          const rf = p.reserve / p.init;
          const tf = rf < taper ? rf / taper : 1;
          const potential = p.mAct * mine;
          rate = Math.min(potential, p.smAct * smeltR) * tf;
          const ext = Math.min(rate * DT, p.reserve);
          p.reserve -= ext;
          income += ext * yld;
          u = rate / potential;
        } else if (p.pTotal === 0 && p.reserve < p.init) {
          p.reserve = Math.min(p.init, p.reserve + p.init * regen); // slow re-survey of abandoned ground
        }
        p.rate = rate; p.u = u;

        if (p.rAct > 0) {
          p.tank = clamp(p.tank + (u * gainN - (p.gate ? drainN : 0)) * DT, 0, tankCap);
          if (p.gate && p.tank <= lo) p.gate = false;
          else if (!p.gate && p.tank >= hi) p.gate = true;
        } else {
          p.tank = Math.max(0, p.tank - bleed * DT);
          p.gate = false;
        }
        p.scoutOn = p.pTotal < scoutPop && p.reserve / p.init > scoutRes;

        if (fieldTick) {
          if (p.gate) pourKernel(p.kIdx, p.kW, p.kn, rigBase + rigGain * u);
          if (p.scoutOn) pourKernel(p.kIdx, p.kW, p.kn, scoutRate);
        }
      }
    }
    state.matter = Math.min(P.matterCap, state.matter + income);
    incomeAcc += income;
    state.incomeRate += (income / DT - state.incomeRate) * 0.02;
    if (prof) { const n = pnow(); prof.econ += n - pt; pt = n; }

    /* --- player emitters --- */
    if (fieldTick) {
      for (let ei = 0; ei < EMIT_SLOTS; ei++) {
        const e = emitters[ei];
        if (!e.active) continue;
        if (t > e.until) { e.active = false; continue; }
        pourKernel(e.kIdx, e.kW, e.kn, P.playerPour * e.strength);
        for (let k = 0; k < e.kbn; k++) blockForce[e.kBlocks[k]] = 2;
      }
      fieldPass();
    }
    if (prof) { const n = pnow(); prof.field += n - pt; pt = n; }

    /* --- staggered structure policy --- */
    policySlice(tick);
    if (prof) { const n = pnow(); prof.policy += n - pt; pt = n; }

    /* --- planner growth --- */
    if (tick % P.growEvery === 0) growStep();
    if (prof) { const n = pnow(); prof.grow += n - pt; pt = n; }

    /* --- spatial buckets, slow cadence --- */
    if (bucketsDirty && tick % P.bucketEvery === 0) rebuildBuckets();
    if (prof) { const n = pnow(); prof.buckets += n - pt; pt = n; prof.ticks++; }

    /* --- milestone windows --- */
    if (t >= windowEnd) {
      state.birthsMin = birthsWin;
      state.resorbsMin = resorbsWin;
      if (birthsWin > 0 && resorbsWin > 0) {
        flag('steadyState', `STEADY CHURN — ${birthsWin} births · ${resorbsWin} resorptions in one minute`);
      }
      birthsWin = 0; resorbsWin = 0;
      windowEnd += 60;
    }
  }

  /* ============================================================= acts */
  function actPour(a) {
    const t = state.t;
    if (t - (state._lastPourAccept ?? -1e9) < P.pourMinGap) return false;
    if (state.matter < P.pourCost) {
      if (t - lastPourRejectEv > 5) { ev('POUR REJECTED — matter reserves too thin'); lastPourRejectEv = t; }
      return false;
    }
    const x = clamp(a.x, TS * (P.emitRadT + 2), WORLD.w - TS * (P.emitRadT + 2));
    const z = clamp(a.z, TS * (P.emitRadT + 2), WORLD.h - TS * (P.emitRadT + 2));
    const s = clamp(a.strength ?? 1, 0.4, P.pourStrengthCap);
    state.matter -= P.pourCost;
    state.pourSpent += P.pourCost;
    state._lastPourAccept = t;

    // merge into a nearby live emitter, else claim a slot
    let slot = null, fresh = false;
    for (let i = 0; i < EMIT_SLOTS; i++) {
      const e = emitters[i];
      if (e.active && (e.x - x) ** 2 + (e.z - z) ** 2 < P.emitMergeR * P.emitMergeR) { slot = e; break; }
    }
    if (!slot) {
      fresh = true;
      let oldest = 0, ot = Infinity;
      for (let i = 0; i < EMIT_SLOTS; i++) {
        const e = emitters[i];
        if (!e.active) { oldest = i; break; }
        if (e.until < ot) { ot = e.until; oldest = i; }
      }
      slot = emitters[oldest];
      slot.x = x; slot.z = z; slot.strength = 0;
      const [kn, kbn] = buildKernel(x / TS, z / TS, P.emitRadT, slot.kIdx, slot.kW, slot.kBlocks, 0.55);
      slot.kn = kn; slot.kbn = kbn;
      slot.active = true;
    }
    slot.until = t + P.emitLife;
    slot.strength = Math.min(P.pourStrengthCap, slot.strength + 0.6 * s);
    for (let k = 0; k < slot.kbn; k++) blockForce[slot.kBlocks[k]] = 2;

    const prov = nearestProvince(x, z);
    if (prov !== state.lastPour.prov) {
      state.pourBuilds = 0;
      ev(`SURVEY POUR near ${provinces[prov].name} — the field deepens`);
    }
    state.lastPour.x = x; state.lastPour.z = z; state.lastPour.t = t; state.lastPour.prov = prov;
    flag('poured', 'FIRST POUR — the player takes the brush');
    if (fresh && state.flags.poured) { /* already logged above when province changed */ }
    return true;
  }

  function actStarve(a) {
    const t = state.t;
    if (state.matter < P.starveCost) return false;
    const x = clamp(a.x, TS * (P.trenchRadT + 2), WORLD.w - TS * (P.trenchRadT + 2));
    const z = clamp(a.z, TS * (P.trenchRadT + 2), WORLD.h - TS * (P.trenchRadT + 2));
    let slot = null;
    for (let i = 0; i < TRENCH_SLOTS; i++) {
      const tr = trenches[i];
      if (tr.active && (tr.x - x) ** 2 + (tr.z - z) ** 2 < P.trenchMergeR * P.trenchMergeR) { slot = tr; break; }
    }
    if (!slot) {
      state.matter -= P.starveCost;
      let oldest = 0, ot = Infinity;
      for (let i = 0; i < TRENCH_SLOTS; i++) {
        const tr = trenches[i];
        if (!tr.active) { oldest = i; break; }
        if (tr.until < ot) { ot = tr.until; oldest = i; }
      }
      slot = trenches[oldest];
      slot.x = x; slot.z = z;
      const [kn] = buildKernel(x / TS, z / TS, P.trenchRadT, slot.kIdx, null, null, 1);
      slot.kn = kn;
      slot.active = true;
      const prov = nearestProvince(x, z);
      if (prov !== state.lastStarve.prov || t - state.lastStarve.t > P.starveWindow) {
        state.starveResorbs = 0;
        ev(`STARVE TRENCH dug at ${provinces[prov].name} — field suppressed`);
      }
      state.lastStarve.x = x; state.lastStarve.z = z; state.lastStarve.t = t; state.lastStarve.prov = prov;
    } else {
      slot.x = x; slot.z = z; // trench follows the drag
      const [kn] = buildKernel(x / TS, z / TS, P.trenchRadT, slot.kIdx, null, null, 1);
      slot.kn = kn;
      state.lastStarve.t = t;
    }
    slot.until = t + P.trenchLife;
    return true;
  }

  function act(a) {
    if (!a) return false;
    if (a.type === 'pour') return actPour(a);
    if (a.type === 'starve') return actStarve(a);
    return false;
  }

  /* ============================================================== boot */
  genProvinces();
  spawnContinent();
  rebuildBuckets();
  flag('spawned',
    `CONTINENT SPAWNED — ${state.builtTotal} structures · ${provinces.length} provinces · seed 0x${seed.toString(16).toUpperCase()}`);
  ev('Survey beacons hold thin field over unclaimed provinces');
  // settle: gates commit, senescent provinces begin to fail, HUD opens on a
  // continent already breathing (100 ticks ≈ 10 sim-seconds)
  for (let i = 0; i < 100; i++) step();

  return { state, step, act };
}
