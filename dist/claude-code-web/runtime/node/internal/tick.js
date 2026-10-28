// process.nextTick stand-in that does not depend on a global `process`.
//
// Node runs nextTick callbacks before promise reactions; a microtask is the
// closest browser primitive and keeps ordering relative to I/O sane.
export function nextTick(fn, ...args) {
  queueMicrotask(() => fn(...args));
}

// setImmediate is absent in browsers. A MessageChannel macrotask avoids the
// 4 ms clamp nested setTimeout(0) gets, and falls back to setTimeout.
const immediates = new Map();
let nextId = 1;
let channel = null;
const queue = [];

function drain() {
  const batch = queue.splice(0, queue.length);
  for (const id of batch) {
    const entry = immediates.get(id);
    if (!entry) continue;
    immediates.delete(id);
    entry.fn(...entry.args);
  }
}

function schedule() {
  if (typeof MessageChannel === 'function') {
    if (!channel) {
      channel = new MessageChannel();
      channel.port1.onmessage = drain;
      // Node: don't keep the process alive just for this port.
      if (typeof channel.port1.unref === 'function') channel.port1.unref();
    }
    channel.port2.postMessage(0);
  } else {
    setTimeout(drain, 0);
  }
}

export class Immediate {
  constructor(id) { this._id = id; }
  ref() { return this; }
  unref() { return this; }
  hasRef() { return true; }
  [Symbol.toPrimitive]() { return this._id; }
}

export function setImmediate(fn, ...args) {
  const id = nextId++;
  immediates.set(id, { fn, args });
  queue.push(id);
  if (queue.length === 1) schedule();
  return new Immediate(id);
}

export function clearImmediate(handle) {
  if (handle == null) return;
  immediates.delete(typeof handle === 'object' ? handle._id : handle);
}
