import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/* =====================================================================
   SCENARIO 01 — DYING PATCH
   Grow / dorm / resorb loop on a two-patch map.

   ARCHITECTURE NOTES
   - DATA LAYER (createSim): pure JS, no three.js. Fixed 100ms tick.
     Entities keep minimal state; anything periodic (belt items, signal
     tokens, bot positions) is DERIVED from the global clock in the view.
     The sim does all transport as continuous *rates*, never discrete items.
   - VIEW LAYER (createView): three.js only. Reads sim state each frame,
     owns zero game state. Tokens are drawn at frac(t*speed) along paths.
   - TILE ABSTRACTION: fluid field lives on a 4u tile grid; at far zoom
     structures collapse into aggregate tile quads.
   ===================================================================== */

/* ============================ CONSTANTS ============================= */
const DT = 0.1;                       // sim tick, seconds
const WORLD = { w: 160, h: 100 };     // world units
const TS = 4;                          // tile size
const NX = WORLD.w / TS, NZ = WORLD.h / TS;

const P = {
  mine: 0.6,          // ore/s per active miner
  taper: 0.35,        // below this reserve fraction, yield tapers
  yield: 0.5,         // matter per ore smelted
  gain: 2.5,          // probe rate -> tank inflow multiplier
  drain: 2.2,         // tank drain when gate open
  tankCap: 10, hi: 6, lo: 2,          // gate hysteresis band
  pour: 6.0,          // fluid/s from an open emitter
  scout: 1.5,         // fluid/s from a survey beacon
  decay: 0.18, diff: 0.30,            // field dynamics (per s)
  pourRad: 3.0,       // emitter footprint, in tiles
  warmup: 12,         // commissioning grace for fresh builds, seconds
  dorm: 0.5,          // field below this -> structure sleeps
  resorb: 0.22,       // field below this (while dormant) -> countdown
  resorbDelay: 12,    // seconds below resorb threshold before reclaim
  growMargin: 0.15, growSustain: 4,   // gradient-reversal trigger
  botSpeed: 9, buildT: 4, resorbWork: 3,
  cost: { miner: 20, smelter: 30, rig: 25 },
  refund: 0.5,
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const cellIx = (x, z) => {
  const gx = clamp(Math.floor((x + WORLD.w / 2) / TS), 0, NX - 1);
  const gz = clamp(Math.floor((z + WORLD.h / 2) / TS), 0, NZ - 1);
  return gx + gz * NX;
};

/* ======================================================================
   DATA LAYER — no three.js beyond this comment’s horizon
   ====================================================================== */
function createSim() {
  const fluid = new Float32Array(NX * NZ);
  const tmp = new Float32Array(NX * NZ);

  const patches = [
    { x: -45, z: 0, r: 7, reserve: 40, init: 40, name: "A" },
    { x: 48, z: 8, r: 8, reserve: 240, init: 240, name: "B" },
  ];

  let nid = 1;
  const S = (type, x, z, o, st) => ({
    id: nid++, type, x, z, o, state: st, low: 0, queued: false, builtAt: -999,
  });
  const structures = [
    // Outpost ALPHA — prebuilt, running
    S("miner", -51, -2, 0, "active"),
    S("miner", -39, -2, 0, "active"),
    S("smelter", -45, -8, 0, "active"),
    S("rig", -45, -12, 0, "active"),
    // Outpost BETA — planner's plan, invisible until the mold commits
    S("miner", 42, 5, 1, "plan"),
    S("miner", 54, 5, 1, "plan"),
    S("smelter", 48, 0, 1, "plan"),
    S("rig", 48, -4, 1, "plan"),
  ];

  const outposts = [
    { patch: 0, tank: P.tankCap, gate: true, everOpen: true, probeRate: 0, scout: false },
    { patch: 1, tank: 0, gate: false, everOpen: false, probeRate: 0, scout: true },
  ];

  const bots = [
    { x: -2, z: -20, job: null },
    { x: 3, z: -20, job: null },
  ];

  const state = {
    t: 0, matter: 45, fluid, patches, structures, outposts, bots,
    jobs: [], events: [], flags: {}, growTimer: 0, done: false,
  };

  const ev = (msg) => {
    state.events.push({ t: state.t, msg });
    if (state.events.length > 60) state.events.shift();
  };
  const flag = (k, msg) => {
    if (!state.flags[k]) { state.flags[k] = true; if (msg) ev(msg); }
  };
  const byId = (id) => structures.find((s) => s.id === id);
  const sname = (s) => `${s.o ? "BETA" : "ALPHA"} ${s.type.toUpperCase()}`;

  function pourAt(x, z, amt, rad, dt) {
    const cx = (x + WORLD.w / 2) / TS, cz = (z + WORLD.h / 2) / TS;
    let wsum = 0; const cells = [];
    const g0x = Math.max(0, Math.floor(cx - rad)), g1x = Math.min(NX - 1, Math.ceil(cx + rad));
    const g0z = Math.max(0, Math.floor(cz - rad)), g1z = Math.min(NZ - 1, Math.ceil(cz + rad));
    for (let gz = g0z; gz <= g1z; gz++) for (let gx = g0x; gx <= g1x; gx++) {
      const d2 = (gx + 0.5 - cx) ** 2 + (gz + 0.5 - cz) ** 2;
      if (d2 > rad * rad) continue;
      const w = Math.exp(-d2 / (rad * rad * 0.4));
      cells.push([gx + gz * NX, w]); wsum += w;
    }
    for (const [c, w] of cells) fluid[c] += (amt * dt * w) / wsum;
  }

  function fluidStep(dt) {
    const k = P.diff * dt;
    for (let gz = 0; gz < NZ; gz++) for (let gx = 0; gx < NX; gx++) {
      const i = gx + gz * NX, c = fluid[i];
      const l = gx > 0 ? fluid[i - 1] : c, r = gx < NX - 1 ? fluid[i + 1] : c;
      const u = gz > 0 ? fluid[i - NX] : c, d = gz < NZ - 1 ? fluid[i + NX] : c;
      tmp[i] = c + k * (l + r + u + d - 4 * c);
    }
    const dk = 1 - P.decay * dt;
    for (let i = 0; i < fluid.length; i++) fluid[i] = tmp[i] * dk;
  }

  const fluidAt = (x, z) => fluid[cellIx(x, z)];
  // a structure senses its tile neighborhood, not a single cell
  const fluidNear = (x, z) => {
    let m = 0;
    for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++)
      m = Math.max(m, fluid[cellIx(x + dx * TS, z + dz * TS)]);
    return m;
  };

  function step(dt) {
    state.t += dt;

    /* --- extraction & signal rigs --- */
    for (let oi = 0; oi < outposts.length; oi++) {
      const o = outposts[oi];
      const p = patches[o.patch];
      const miners = structures.filter((s) => s.o === oi && s.type === "miner" && s.state === "active");
      const smelterUp = structures.some((s) => s.o === oi && s.type === "smelter" && s.state === "active");
      let rate = 0;
      if (smelterUp && p.reserve > 0 && miners.length) {
        const tf = p.reserve < p.init * P.taper ? p.reserve / (p.init * P.taper) : 1;
        rate = miners.length * P.mine * tf;
        const ext = Math.min(rate * dt, p.reserve);
        p.reserve -= ext;
        state.matter += ext * P.yield;
      }
      o.probeRate = rate;

      const rig = structures.find((s) => s.o === oi && s.type === "rig");
      const rigOn = rig && rig.state === "active";
      if (rigOn) {
        o.tank = clamp(o.tank + (rate * P.gain - (o.gate ? P.drain : 0)) * dt, 0, P.tankCap);
        if (o.gate && o.tank <= P.lo) {
          o.gate = false;
          ev(`${oi ? "BETA" : "ALPHA"} RIG: gate CLOSED — tank drained to ${o.tank.toFixed(1)}`);
          if (oi === 0 && state.t > 3) flag("gateClosed");
        } else if (!o.gate && o.tank >= P.hi) {
          o.gate = true; o.everOpen = true;
          ev(`${oi ? "BETA" : "ALPHA"} RIG: gate OPEN — pouring value field`);
        }
      } else {
        o.tank = Math.max(0, o.tank - 0.6 * dt);
        o.gate = false;
      }
      if (o.gate) pourAt(p.x, p.z, P.pour, P.pourRad, dt);
      if (o.scout && !o.everOpen) pourAt(p.x, p.z, P.scout, P.pourRad, dt);
      if (o.scout && o.everOpen) { o.scout = false; ev("BETA: rig online — survey beacon retired"); }
    }

    fluidStep(dt);

    /* --- per-structure policy: field decides wake / sleep / reclaim --- */
    for (const s of structures) {
      if (s.state !== "active" && s.state !== "dormant") continue;
      if (state.t - s.builtAt < P.warmup) continue; // commissioning grace
      const f = fluidNear(s.x, s.z);
      if (s.state === "active" && f < P.dorm) {
        s.state = "dormant"; s.low = 0;
        ev(`${sname(s)} DORMANT — field ${f.toFixed(2)} < ${P.dorm}`);
      } else if (s.state === "dormant") {
        if (f > P.dorm * 1.15) {
          s.state = "active"; s.low = 0;
          ev(`${sname(s)} reactivated — field recovered`);
        } else if (f < P.resorb) {
          s.low += dt;
          if (s.low > P.resorbDelay && !s.queued) {
            s.queued = true;
            state.jobs.push({ kind: "resorb", sid: s.id });
            ev(`${sname(s)} marked for RESORPTION`);
          }
        } else s.low = 0;
      }
    }
    if (structures.filter((s) => s.o === 0 && (s.state === "dormant" || s.state === "gone")).length >= 3)
      flag("alphaDorm", "ALPHA colony dormant — signal starvation");

    /* --- growth: mold follows the reversed gradient --- */
    const fA = fluidAt(patches[0].x, patches[0].z);
    const fB = fluidAt(patches[1].x, patches[1].z);
    state.fA = fA; state.fB = fB;
    if (!state.flags.grow) {
      state.growTimer = fB > fA + P.growMargin ? state.growTimer + dt : 0;
      if (state.growTimer > P.growSustain) {
        flag("grow", `GRADIENT REVERSED — B ${fB.toFixed(2)} > A ${fA.toFixed(2)}: growth queued at Patch B`);
        for (const s of structures) if (s.state === "plan") {
          s.state = "ghost";
          state.jobs.push({ kind: "build", sid: s.id });
        }
      }
    }

    /* --- bots: minimal state; position derived from t0 + duration --- */
    for (const b of bots) {
      if (!b.job) {
        const ji = state.jobs.findIndex((j) =>
          j.kind === "resorb" || state.matter >= P.cost[byId(j.sid).type]);
        if (ji >= 0) {
          const j = state.jobs.splice(ji, 1)[0];
          const s = byId(j.sid);
          if (j.kind === "build") state.matter -= P.cost[s.type];
          const dist = Math.hypot(s.x - b.x, s.z - b.z);
          b.job = {
            kind: j.kind, sid: s.id, phase: "travel",
            x0: b.x, z0: b.z, tx: s.x, tz: s.z,
            t0: state.t, dur: Math.max(0.1, dist / P.botSpeed),
          };
        }
      } else {
        const j = b.job, s = byId(j.sid);
        if (j.phase === "travel" && state.t >= j.t0 + j.dur) {
          j.phase = "work"; j.t0 = state.t;
          j.dur = j.kind === "build" ? P.buildT : P.resorbWork;
          b.x = j.tx; b.z = j.tz;
          s.state = j.kind === "build" ? "building" : "resorbing";
        } else if (j.phase === "work" && state.t >= j.t0 + j.dur) {
          if (j.kind === "build") {
            s.state = "active";
            s.builtAt = state.t;
            if (s.type === "rig") state.outposts[s.o].tank = P.hi; // ships primed
            ev(`${sname(s)} BUILT`);
          } else {
            s.state = "gone";
            const back = Math.round(P.cost[s.type] * P.refund);
            state.matter += back;
            ev(`${sname(s)} RESORBED — +${back} matter reclaimed`);
            flag("resorb1");
          }
          b.job = null;
        }
      }
    }

    /* --- milestones --- */
    flag("start");
    if (patches[0].reserve < patches[0].init * 0.5)
      flag("deplete", "PATCH A below 50% — extraction will taper");
    if (!state.done) {
      const alphaGone = structures.filter((s) => s.o === 0).every((s) => s.state === "gone");
      const betaUp = structures.filter((s) => s.o === 1).every((s) => s.state === "active");
      if (alphaGone && betaUp) {
        state.done = true;
        flag("done", `SCENARIO COMPLETE T+${state.t.toFixed(0)}s — colony relocated to Patch B`);
      }
    }
  }

  /* pre-warm the field so ALPHA starts in equilibrium, not bootstrap */
  for (let i = 0; i < 120; i++) {
    pourAt(patches[0].x, patches[0].z, P.pour, P.pourRad, DT);
    pourAt(patches[1].x, patches[1].z, P.scout, P.pourRad, DT);
    fluidStep(DT);
  }
  ev("ALPHA operational — 2 miners, smelter, signal rig");
  ev("Survey beacon holding a thin field over Patch B (reserve 240)");

  return { state, step, fluidAt };
}

/* ======================================================================
   VIEW LAYER — three.js only; reads sim, owns no game state
   ====================================================================== */
const COL = {
  bg: 0x0b0e11, ground: 0x11181d, grid: 0x1b252c,
  ore: 0xd9a25a, matter: 0xe0973a, signal: 0x55d6f0, field: 0x2e9fd9,
  dormant: 0x4d565c, ghost: 0x4a90d9, resorb: 0xd96b6b, bot: 0x9fd65a,
};

function polyLen(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += pts[i].distanceTo(pts[i - 1]);
  return L;
}
function pointOnPoly(pts, s, out) {
  for (let i = 1; i < pts.length; i++) {
    const d = pts[i].distanceTo(pts[i - 1]);
    if (s <= d) { out.lerpVectors(pts[i - 1], pts[i], d ? s / d : 0); return out; }
    s -= d;
  }
  return out.copy(pts[pts.length - 1]);
}

function makeLabel(text, color) {
  const c = document.createElement("canvas");
  c.width = 256; c.height = 64;
  const g = c.getContext("2d");
  g.font = "700 30px 'Barlow Condensed', sans-serif";
  g.textAlign = "center"; g.textBaseline = "middle";
  g.fillStyle = color; g.fillText(text, 128, 32);
  const sp = new THREE.Sprite(new THREE.SpriteMaterial({
    map: new THREE.CanvasTexture(c), transparent: true, depthWrite: false,
  }));
  sp.scale.set(15, 3.75, 1);
  return sp;
}

function createView(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(COL.bg);
  scene.fog = new THREE.Fog(COL.bg, 260, 460);

  const camera = new THREE.PerspectiveCamera(46, 1, 1, 1200);
  const cam = { tx: -38, tz: -4, dist: 95, pitch: 1.0, yaw: 0.5 };
  function applyCamera() {
    const cp = Math.cos(cam.pitch), sp2 = Math.sin(cam.pitch);
    camera.position.set(
      cam.tx + cam.dist * cp * Math.sin(cam.yaw),
      cam.dist * sp2,
      cam.tz + cam.dist * cp * Math.cos(cam.yaw),
    );
    camera.lookAt(cam.tx, 0, cam.tz);
  }

  scene.add(new THREE.AmbientLight(0xbfd4e0, 0.75));
  const sun = new THREE.DirectionalLight(0xffe8c8, 0.7);
  sun.position.set(60, 120, 40);
  scene.add(sun);

  /* ground + grid */
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(WORLD.w + 60, WORLD.h + 60),
    new THREE.MeshLambertMaterial({ color: COL.ground }),
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  const grid = new THREE.GridHelper(WORLD.w, NX, COL.grid, COL.grid);
  grid.position.y = 0.02;
  scene.add(grid);

  /* fluid field: instanced tile quads, brightness = depth (additive) */
  const fluidGeo = new THREE.PlaneGeometry(TS * 0.96, TS * 0.96);
  fluidGeo.rotateX(-Math.PI / 2);
  const fluidMesh = new THREE.InstancedMesh(
    fluidGeo,
    new THREE.MeshBasicMaterial({
      color: 0xffffff, blending: THREE.AdditiveBlending,
      depthWrite: false, transparent: true,
    }),
    NX * NZ,
  );
  fluidMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  fluidMesh.frustumCulled = false;
  scene.add(fluidMesh);

  /* patches */
  const patchMeshes = [];
  function addPatch(p) {
    const m = new THREE.Mesh(
      new THREE.CircleGeometry(p.r, 26),
      new THREE.MeshLambertMaterial({ color: COL.ore, transparent: true, opacity: 0.9 }),
    );
    m.rotation.x = -Math.PI / 2;
    m.position.set(p.x, 0.06, p.z);
    scene.add(m);
    patchMeshes.push(m);
    const lb = makeLabel(`PATCH ${p.name}`, "#d9a25a");
    lb.position.set(p.x, 9, p.z);
    scene.add(lb);
  }

  /* structures */
  const GEO = {
    miner: new THREE.BoxGeometry(3, 2.6, 3),
    smelter: new THREE.BoxGeometry(4.2, 3.2, 4.2),
    rig: new THREE.CylinderGeometry(1.5, 1.5, 3.4, 10),
  };
  const HY = { miner: 1.3, smelter: 1.6, rig: 1.7 };
  const lam = (c) => new THREE.MeshLambertMaterial({ color: c });
  const wire = (c) => new THREE.MeshBasicMaterial({ color: c, wireframe: true, transparent: true, opacity: 0.6 });
  const MAT = {
    active: { miner: lam(0xc8781e), smelter: lam(0xb05537), rig: lam(0x3aa7c9) },
    dormant: { miner: lam(COL.dormant), smelter: lam(COL.dormant), rig: lam(COL.dormant) },
    ghost: wire(COL.ghost),
    building: wire(0x7fb7ff),
    resorbing: wire(COL.resorb),
  };
  const structMeshes = new Map(); // id -> mesh

  /* bots */
  const botMeshes = [];
  const botGeo = new THREE.ConeGeometry(1, 2.4, 8);
  const botMat = new THREE.MeshLambertMaterial({ color: COL.bot });

  /* flow paths (built lazily from structure coords) */
  const V = (x, y, z) => new THREE.Vector3(x, y, z);
  let flows = null; // built on first sync
  const lineMat = {
    belt: new THREE.LineBasicMaterial({ color: 0x6b4f2a, transparent: true, opacity: 0.8 }),
    trace: new THREE.LineBasicMaterial({ color: COL.signal, transparent: true, opacity: 0.35 }),
  };
  function addLine(pts, mat) {
    const l = new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), mat);
    scene.add(l);
    return l;
  }
  function pylon(x, z, h) {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.12, h, 5),
      new THREE.MeshBasicMaterial({ color: 0x2b3b44 }),
    );
    m.position.set(x, h / 2, z);
    scene.add(m);
  }

  /* token instancing — items (amber cubes) & signal pulses (cyan) */
  const itemMesh = new THREE.InstancedMesh(
    new THREE.BoxGeometry(0.8, 0.8, 0.8),
    new THREE.MeshBasicMaterial({ color: 0xe6c15a }), 160,
  );
  const pulseMesh = new THREE.InstancedMesh(
    new THREE.SphereGeometry(0.42, 8, 8),
    new THREE.MeshBasicMaterial({ color: 0x8fe9ff, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false }),
    160,
  );
  itemMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  pulseMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  itemMesh.frustumCulled = false;
  pulseMesh.frustumCulled = false;
  scene.add(itemMesh, pulseMesh);

  /* far-zoom tile aggregates */
  const tilePool = [];
  const tileGeo = new THREE.PlaneGeometry(TS * 1.6, TS * 1.6);
  tileGeo.rotateX(-Math.PI / 2);
  for (let i = 0; i < 24; i++) {
    const m = new THREE.Mesh(tileGeo, new THREE.MeshBasicMaterial({ transparent: true, opacity: 0.85 }));
    m.visible = false; m.position.y = 0.4;
    scene.add(m);
    tilePool.push(m);
  }

  const dummy = new THREE.Object3D();
  const colScratch = new THREE.Color();
  const vScratch = new THREE.Vector3();
  const fieldCol = new THREE.Color(COL.field);

  function buildFlows(state) {
    const st = state.structures;
    const find = (o, type, n = 0) => st.filter((s) => s.o === o && s.type === type)[n];
    flows = [[], []].map((_, o) => {
      const m1 = find(o, "miner", 0), m2 = find(o, "miner", 1);
      const sm = find(o, "smelter"), rg = find(o, "rig");
      const p = state.patches[o];
      const f = {
        belts: [
          { pts: [V(m1.x, 0.5, m1.z), V(sm.x, 0.5, sm.z)], who: [m1.id, sm.id] },
          { pts: [V(m2.x, 0.5, m2.z), V(sm.x, 0.5, sm.z)], who: [m2.id, sm.id] },
        ],
        traceUp: { pts: [V(p.x - 1.5, 6, p.z), V(rg.x, 5, rg.z)], who: [rg.id] },
        traceDn: { pts: [V(rg.x, 5, rg.z), V(p.x + 1.5, 6, p.z)], who: [rg.id] },
        lines: [], o,
      };
      for (const b of f.belts) f.lines.push(addLine(b.pts, lineMat.belt));
      f.lines.push(addLine(f.traceUp.pts, lineMat.trace));
      f.lines.push(addLine(f.traceDn.pts, lineMat.trace));
      pylon(p.x - 1.5, p.z, 6); pylon(rg.x, rg.z, 5); pylon(p.x + 1.5, p.z, 6);
      for (const seg of f.belts) seg.len = polyLen(seg.pts);
      f.traceUp.len = polyLen(f.traceUp.pts);
      f.traceDn.len = polyLen(f.traceDn.pts);
      return f;
    });
    const hub = makeLabel("BUILDER HUB", "#9fd65a");
    hub.position.set(0, 6, -20);
    scene.add(hub);
  }

  function emitTokens(mesh, cursor, pts, len, rate, speed, time) {
    if (rate < 0.05) return cursor;
    const spacing = clamp(speed / (rate * 2.5), 1.6, len);
    const n = Math.min(Math.floor(len / spacing), 30);
    for (let i = 0; i < n; i++) {
      const s = (time * speed + i * spacing) % len;
      pointOnPoly(pts, s, vScratch);
      dummy.position.copy(vScratch);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(cursor++, dummy.matrix);
      if (cursor >= 158) break;
    }
    return cursor;
  }

  function sync(state, time, alive) {
    if (!flows) buildFlows(state);
    const gone = (id) => {
      const s = state.structures.find((q) => q.id === id);
      return !s || s.state === "gone" || s.state === "plan" || s.state === "ghost";
    };

    /* LOD tiers from camera distance */
    const tier = cam.dist < 75 ? 0 : cam.dist < 190 ? 1 : 2;

    /* fluid field */
    let fc = 0;
    for (let gz = 0; gz < NZ; gz++) for (let gx = 0; gx < NX; gx++) {
      const f = state.fluid[gx + gz * NX];
      if (f < 0.045) continue;
      dummy.position.set(
        gx * TS - WORLD.w / 2 + TS / 2, 0.12,
        gz * TS - WORLD.h / 2 + TS / 2,
      );
      dummy.rotation.set(0, 0, 0); dummy.scale.setScalar(1);
      dummy.updateMatrix();
      fluidMesh.setMatrixAt(fc, dummy.matrix);
      colScratch.copy(fieldCol).multiplyScalar(clamp(f / 2.0, 0.06, 1));
      fluidMesh.setColorAt(fc, colScratch);
      fc++;
    }
    fluidMesh.count = fc;
    fluidMesh.instanceMatrix.needsUpdate = true;
    if (fluidMesh.instanceColor) fluidMesh.instanceColor.needsUpdate = true;

    /* patches deplete visually */
    state.patches.forEach((p, i) => {
      const fr = p.reserve / p.init;
      patchMeshes[i].material.opacity = 0.25 + 0.65 * fr;
      patchMeshes[i].scale.setScalar(0.45 + 0.55 * fr);
    });

    /* structures */
    for (const s of state.structures) {
      let m = structMeshes.get(s.id);
      if (s.state === "plan" || s.state === "gone") { if (m) m.visible = false; continue; }
      if (!m) {
        m = new THREE.Mesh(GEO[s.type], MAT.active[s.type]);
        m.position.set(s.x, HY[s.type], s.z);
        scene.add(m);
        structMeshes.set(s.id, m);
      }
      m.visible = tier < 2;
      m.material =
        s.state === "active" ? MAT.active[s.type] :
        s.state === "dormant" ? MAT.dormant[s.type] :
        s.state === "ghost" ? MAT.ghost :
        s.state === "building" ? MAT.building : MAT.resorbing;
      const pulse = s.state === "building" || s.state === "resorbing"
        ? 1 + 0.08 * Math.sin(time * 7) : 1;
      m.scale.setScalar(pulse);
    }

    /* bots — position derived from job timer */
    state.bots.forEach((b, i) => {
      let m = botMeshes[i];
      if (!m) { m = new THREE.Mesh(botGeo, botMat); scene.add(m); botMeshes[i] = m; }
      let x = b.x, z = b.z;
      if (b.job && b.job.phase === "travel") {
        const k = clamp((state.t - b.job.t0) / b.job.dur, 0, 1);
        x = b.job.x0 + (b.job.tx - b.job.x0) * k;
        z = b.job.z0 + (b.job.tz - b.job.z0) * k;
      }
      m.position.set(x, 1.4 + (b.job ? 0.4 * Math.abs(Math.sin(time * 5)) : 0), z);
      m.visible = tier < 2;
    });

    /* tokens — pure functions of the clock, zero sim state */
    let ic = 0, pc = 0;
    if (tier === 0) {
      for (const f of flows) {
        const o = state.outposts[f.o];
        const perBelt = o.probeRate / 2;
        for (const seg of f.belts)
          if (!gone(seg.who[0]) && !gone(seg.who[1]))
            ic = emitTokens(itemMesh, ic, seg.pts, seg.len, perBelt, 5, time);
        if (!gone(f.traceUp.who[0])) {
          pc = emitTokens(pulseMesh, pc, f.traceUp.pts, f.traceUp.len, o.probeRate * 2, 11, time);
          if (o.gate)
            pc = emitTokens(pulseMesh, pc, f.traceDn.pts, f.traceDn.len, P.drain * 2, 11, time);
        }
      }
    }
    itemMesh.count = ic; pulseMesh.count = pc;
    itemMesh.instanceMatrix.needsUpdate = true;
    pulseMesh.instanceMatrix.needsUpdate = true;

    /* line visibility follows structures & tier */
    for (const f of flows) {
      const rigGone = gone(f.traceUp.who[0]);
      f.lines.forEach((l, li) => {
        const seg = li < 2 ? f.belts[li] : null;
        const segGone = seg ? (gone(seg.who[0]) || gone(seg.who[1])) : rigGone;
        l.visible = tier < 2 && !segGone;
      });
    }

    /* far zoom: aggregate structures into tile quads */
    if (tier === 2) {
      const tiles = new Map();
      for (const s of state.structures) {
        if (s.state === "plan" || s.state === "gone") continue;
        const ix = cellIx(s.x, s.z);
        const prev = tiles.get(ix);
        const rank = { building: 4, resorbing: 4, ghost: 3, active: 2, dormant: 1 }[s.state];
        if (!prev || rank > prev.rank) tiles.set(ix, { rank, state: s.state });
      }
      let ti = 0;
      for (const [ix, t] of tiles) {
        if (ti >= tilePool.length) break;
        const m = tilePool[ti++];
        m.visible = true;
        m.position.x = (ix % NX) * TS - WORLD.w / 2 + TS / 2;
        m.position.z = Math.floor(ix / NX) * TS - WORLD.h / 2 + TS / 2;
        m.material.color.set(
          t.state === "active" ? 0xd98a2b :
          t.state === "dormant" ? 0x566068 : 0x4a90d9,
        );
      }
      for (; ti < tilePool.length; ti++) tilePool[ti].visible = false;
    } else {
      for (const m of tilePool) m.visible = false;
    }

    applyCamera();
    renderer.render(scene, camera);
  }

  /* input: drag pan, wheel / pinch zoom */
  const el = renderer.domElement;
  let drag = null;
  const pointers = new Map();
  el.style.touchAction = "none";
  el.addEventListener("pointerdown", (e) => {
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 1) drag = [e.clientX, e.clientY];
    el.setPointerCapture(e.pointerId);
  });
  el.addEventListener("pointermove", (e) => {
    if (!pointers.has(e.pointerId)) return;
    const prev = pointers.get(e.pointerId);
    pointers.set(e.pointerId, [e.clientX, e.clientY]);
    if (pointers.size === 2) {
      const [a, b] = [...pointers.values()];
      const dNow = Math.hypot(a[0] - b[0], a[1] - b[1]);
      const pv = view._pinch || dNow;
      cam.dist = clamp(cam.dist * (pv / dNow), 30, 380);
      view._pinch = dNow;
      drag = null;
      return;
    }
    if (!drag) return;
    const dx = e.clientX - drag[0], dy = e.clientY - drag[1];
    drag = [e.clientX, e.clientY];
    const k = cam.dist * 0.0016;
    const cy = Math.cos(cam.yaw), sy = Math.sin(cam.yaw);
    cam.tx -= (dx * cy - dy * sy) * k;
    cam.tz -= (-dx * sy - dy * cy) * k;
    cam.tx = clamp(cam.tx, -95, 95);
    cam.tz = clamp(cam.tz, -65, 65);
  });
  const endPointer = (e) => {
    pointers.delete(e.pointerId);
    view._pinch = null;
    if (pointers.size === 0) drag = null;
  };
  el.addEventListener("pointerup", endPointer);
  el.addEventListener("pointercancel", endPointer);
  el.addEventListener("wheel", (e) => {
    e.preventDefault();
    cam.dist = clamp(cam.dist * Math.exp(e.deltaY * 0.0012), 30, 380);
  }, { passive: false });

  function resize() {
    const w = container.clientWidth, h = container.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  const view = {
    sync, cam,
    addPatch,
    dispose() {
      window.removeEventListener("resize", resize);
      renderer.dispose();
      container.removeChild(el);
    },
  };
  return view;
}

/* ======================================================================
   REACT SHELL — HUD reads the sim at 5 Hz; render loop is independent
   ====================================================================== */
const CHECKLIST = [
  ["start", "Alpha extracting at Patch A"],
  ["deplete", "Patch A depleting"],
  ["gateClosed", "Signal cut — gate closed"],
  ["alphaDorm", "Alpha colony dormant"],
  ["grow", "Gradient reversed — growth at B"],
  ["resorb1", "First resorption refund"],
  ["done", "Colony relocated — Beta online"],
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;700&family=IBM+Plex+Mono:wght@400;600&display=swap');
.smf-root{position:relative;width:100%;height:100vh;min-height:560px;background:#0b0e11;overflow:hidden;font-family:'IBM Plex Mono',monospace;color:#c2ccd2;}
.smf-canvas{position:absolute;inset:0;}
.smf-panel{position:absolute;top:0;right:0;bottom:0;width:min(320px,86vw);background:rgba(13,18,22,.92);border-left:1px solid #1e2a32;overflow-y:auto;padding:14px 14px 20px;font-size:11px;transition:transform .25s;}
.smf-panel.hidden{transform:translateX(100%);}
.smf-toggle{position:absolute;top:10px;right:10px;z-index:5;background:#13202a;border:1px solid #2a3d49;color:#55d6f0;font:600 11px 'IBM Plex Mono';padding:5px 9px;cursor:pointer;}
.smf-h1{font:700 19px 'Barlow Condensed';letter-spacing:.14em;color:#e6edf1;margin:0 0 1px;}
.smf-sub{font:500 12px 'Barlow Condensed';letter-spacing:.22em;color:#5b7482;margin-bottom:12px;}
.smf-row{display:flex;justify-content:space-between;align-items:baseline;margin:3px 0;}
.smf-k{color:#5b7482;}
.smf-amber{color:#e0973a;} .smf-cyan{color:#55d6f0;} .smf-dim{color:#566068;} .smf-green{color:#9fd65a;}
.smf-card{border:1px solid #1e2a32;padding:8px 9px;margin:10px 0;background:rgba(255,255,255,.015);}
.smf-cardh{font:700 13px 'Barlow Condensed';letter-spacing:.18em;color:#9fb2bd;margin-bottom:5px;display:flex;justify-content:space-between;}
.smf-bar{position:relative;height:7px;background:#141c22;border:1px solid #22313b;margin:3px 0 6px;}
.smf-fill{position:absolute;inset:0;transform-origin:left;}
.smf-tick{position:absolute;top:-2px;bottom:-2px;width:1px;background:#7a8b94;}
.smf-lamp{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:5px;vertical-align:-1px;}
.smf-check{list-style:none;margin:4px 0 0;padding:0;}
.smf-check li{margin:3px 0;color:#566068;}
.smf-check li.on{color:#c2ccd2;}
.smf-check li.on b{color:#9fd65a;}
.smf-log{max-height:150px;overflow-y:auto;margin-top:4px;}
.smf-log div{margin:2px 0;color:#7d8f99;line-height:1.35;}
.smf-log div:first-child{color:#c2ccd2;}
.smf-btn{background:#13202a;border:1px solid #2a3d49;color:#8fa8b5;font:600 11px 'IBM Plex Mono';padding:4px 9px;margin-right:5px;cursor:pointer;}
.smf-btn.on{color:#0b0e11;background:#55d6f0;border-color:#55d6f0;}
.smf-help{position:absolute;left:12px;bottom:10px;font-size:10px;color:#495a64;z-index:4;pointer-events:none;}
.smf-banner{position:absolute;left:50%;top:16px;transform:translateX(-50%);background:rgba(19,32,42,.95);border:1px solid #55d6f0;color:#8fe9ff;font:700 15px 'Barlow Condensed';letter-spacing:.2em;padding:8px 18px;z-index:6;}
.smf-legend{margin-top:10px;color:#5b7482;line-height:1.6;}
`;

export default function Scenario01DyingPatch() {
  const mountRef = useRef(null);
  const simRef = useRef(null);
  const speedRef = useRef(1);
  const [hud, setHud] = useState(null);
  const [speed, setSpeed] = useState(1);
  const [panel, setPanel] = useState(true);

  useEffect(() => { speedRef.current = speed; }, [speed]);

  useEffect(() => {
    const sim = createSim();
    simRef.current = sim;
    const view = createView(mountRef.current);
    for (const p of sim.state.patches) view.addPatch(p);

    let raf, last = performance.now(), acc = 0, alive = true;
    const loop = (now) => {
      if (!alive) return;
      const rdt = Math.min((now - last) / 1000, 0.1);
      last = now;
      acc += rdt * speedRef.current;
      let steps = 0;
      while (acc >= DT && steps < 240) { sim.step(DT); acc -= DT; steps++; }
      view.sync(sim.state, now / 1000, alive);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const hudTimer = setInterval(() => {
      const s = sim.state;
      setHud({
        t: s.t, matter: s.matter,
        rA: s.patches[0].reserve / s.patches[0].init,
        rB: s.patches[1].reserve / s.patches[1].init,
        o: s.outposts.map((o) => ({
          tank: o.tank, gate: o.gate, rate: o.probeRate, scout: o.scout,
        })),
        fA: s.fA || 0, fB: s.fB || 0,
        flags: { ...s.flags },
        events: s.events.slice(-10).reverse(),
        done: s.done,
      });
    }, 200);

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      clearInterval(hudTimer);
      view.dispose();
    };
  }, []);

  const Bar = ({ fr, color, hi, lo }) => (
    <div className="smf-bar">
      <div className="smf-fill" style={{ background: color, transform: `scaleX(${clamp(fr, 0, 1)})` }} />
      {hi != null && <div className="smf-tick" style={{ left: `${hi * 100}%` }} />}
      {lo != null && <div className="smf-tick" style={{ left: `${lo * 100}%` }} />}
    </div>
  );

  return (
    <div className="smf-root">
      <style>{css}</style>
      <div className="smf-canvas" ref={mountRef} />
      {hud?.done && <div className="smf-banner">COLONY RELOCATED — T+{hud.t.toFixed(0)}s</div>}
      <button className="smf-toggle" onClick={() => setPanel(!panel)}>
        {panel ? "HIDE ▸" : "◂ TELEMETRY"}
      </button>
      <div className="smf-help">drag pan · wheel / pinch zoom · zoom out for tile view</div>

      <div className={`smf-panel ${panel ? "" : "hidden"}`}>
        <div className="smf-h1">SLIME MOLD FOUNDRY</div>
        <div className="smf-sub">SCENARIO 01 — DYING PATCH</div>

        <div className="smf-row">
          <span className="smf-k">T+{hud ? hud.t.toFixed(1) : "0.0"}s</span>
          <span className="smf-amber">MATTER {hud ? hud.matter.toFixed(0) : "—"}</span>
        </div>
        <div style={{ margin: "7px 0 4px" }}>
          {[["⏸", 0], ["×1", 1], ["×8", 8], ["×32", 32]].map(([l, v]) => (
            <button key={l} className={`smf-btn ${speed === v ? "on" : ""}`} onClick={() => setSpeed(v)}>{l}</button>
          ))}
        </div>

        {hud && ["ALPHA", "BETA"].map((nm, i) => {
          const o = hud.o[i];
          return (
            <div className="smf-card" key={nm}>
              <div className="smf-cardh">
                <span>OUTPOST {nm}</span>
                <span>
                  <span className="smf-lamp" style={{ background: o.gate ? "#55d6f0" : o.scout ? "#3b6b7a" : "#333c42" }} />
                  {o.gate ? "GATE OPEN" : o.scout ? "SURVEY" : "GATE SHUT"}
                </span>
              </div>
              <div className="smf-row"><span className="smf-k">RESERVE</span><span className="smf-amber">{((i ? hud.rB : hud.rA) * 100).toFixed(0)}%</span></div>
              <Bar fr={i ? hud.rB : hud.rA} color="#e0973a" />
              <div className="smf-row"><span className="smf-k">EXTRACTION</span><span>{o.rate.toFixed(2)}/s</span></div>
              <div className="smf-row"><span className="smf-k">SIGNAL TANK</span><span className="smf-cyan">{o.tank.toFixed(1)}/{P.tankCap}</span></div>
              <Bar fr={o.tank / P.tankCap} color="#55d6f0" hi={P.hi / P.tankCap} lo={P.lo / P.tankCap} />
              <div className="smf-row"><span className="smf-k">FIELD @ PATCH</span><span style={{ color: "#3b9fd9" }}>{(i ? hud.fB : hud.fA).toFixed(2)}</span></div>
            </div>
          );
        })}

        <div className="smf-card">
          <div className="smf-cardh"><span>SCENARIO TIMELINE</span></div>
          <ul className="smf-check">
            {CHECKLIST.map(([k, label]) => (
              <li key={k} className={hud?.flags[k] ? "on" : ""}>
                <b>{hud?.flags[k] ? "■" : "□"}</b> {label}
              </li>
            ))}
          </ul>
        </div>

        <div className="smf-card">
          <div className="smf-cardh"><span>EVENT LOG</span></div>
          <div className="smf-log">
            {hud?.events.map((e, i) => (
              <div key={i}>T+{e.t.toFixed(0)} {e.msg}</div>
            ))}
          </div>
        </div>

        <div className="smf-legend">
          <span className="smf-amber">■ matter layer</span> · <span className="smf-cyan">■ signal layer</span> · <span style={{ color: "#3b9fd9" }}>■ value field</span><br />
          dormancy &lt; {P.dorm} · resorb &lt; {P.resorb} after {P.resorbDelay}s<br />
          growth: field B &gt; field A + {P.growMargin} for {P.growSustain}s
        </div>
      </div>
    </div>
  );
}
