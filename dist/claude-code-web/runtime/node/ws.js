// `ws` (npm) — the bundle's only external bare import — over the browser's
// native WebSocket. Custom request headers, proxies and TLS options cannot be
// applied by a page and are ignored. Servers are unavailable.
import EventEmitter from './events.js';
import { Buffer } from './buffer.js';
import { Duplex } from './stream.js';
import { unsupported } from './internal/errors.js';

const STATES = ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'];

export class WebSocket extends EventEmitter {
  constructor(address, protocols, options) {
    super();
    if (protocols && !Array.isArray(protocols) && typeof protocols === 'object') { options = protocols; protocols = undefined; }
    this._options = options || {};
    this._binaryType = 'nodebuffer';
    this.url = String(address);
    this._ws = null;
    const Native = globalThis.WebSocket;
    try {
      if (typeof Native !== 'function' || Native === WebSocket) throw unsupported('WebSocket');
      this._ws = protocols === undefined ? new Native(this.url) : new Native(this.url, protocols);
    } catch (err) {
      queueMicrotask(() => { this._emitError(err); this.emit('close', 1006, Buffer.alloc(0)); });
      return;
    }
    this._ws.binaryType = 'arraybuffer';
    this._ws.onopen = () => this.emit('open');
    this._ws.onmessage = (ev) => {
      const isBinary = typeof ev.data !== 'string';
      const buf = Buffer.from(isBinary ? new Uint8Array(ev.data) : ev.data);
      const data = isBinary && this._binaryType === 'arraybuffer' ? ev.data : buf;
      this.emit('message', data, isBinary);
    };
    this._ws.onerror = () => this._emitError(new Error(`WebSocket error (${this.url})`));
    this._ws.onclose = (ev) => this.emit('close', ev.code, Buffer.from(ev.reason || ''));
  }
  _emitError(err) {
    if (this.listenerCount('error') > 0) this.emit('error', err);
  }
  get readyState() { return this._ws ? this._ws.readyState : 3; }
  get protocol() { return this._ws?.protocol ?? ''; }
  get extensions() { return this._ws?.extensions ?? ''; }
  get bufferedAmount() { return this._ws?.bufferedAmount ?? 0; }
  get binaryType() { return this._binaryType; }
  set binaryType(v) { this._binaryType = v; }
  get isPaused() { return false; }

  send(data, options, cb) {
    const callback = typeof options === 'function' ? options : cb;
    if (this.readyState !== 1) {
      const err = new Error(`WebSocket is not open: readyState ${this.readyState} (${STATES[this.readyState]})`);
      if (callback) { queueMicrotask(() => callback(err)); return; }
      throw err;
    }
    let payload = data;
    if (typeof data === 'number') payload = String(data);
    else if (ArrayBuffer.isView(data)) payload = new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
    this._ws.send(payload);
    if (callback) queueMicrotask(() => callback());
  }
  close(code, reason) {
    if (!this._ws || this.readyState >= 2) return;
    try { this._ws.close(code, reason === undefined ? undefined : String(reason)); } catch { this._ws.close(); }
  }
  terminate() { this.close(); }
  ping(data, mask, cb) { const c = [data, mask, cb].find((f) => typeof f === 'function'); if (c) queueMicrotask(c); }
  pong(data, mask, cb) { const c = [data, mask, cb].find((f) => typeof f === 'function'); if (c) queueMicrotask(c); }
  pause() {}
  resume() {}

  // EventTarget-style API, which ws also offers.
  addEventListener(type, listener, opts) {
    const wrapped = (...args) => {
      const ev = type === 'message' ? { type, data: args[0], isBinary: args[1], target: this }
        : type === 'close' ? { type, code: args[0], reason: String(args[1] ?? ''), wasClean: true, target: this }
        : type === 'error' ? { type, error: args[0], message: args[0]?.message, target: this } : { type, target: this };
      if (typeof listener === 'function') listener.call(this, ev); else listener?.handleEvent?.(ev);
    };
    wrapped._listener = listener;
    if (opts?.once) this.once(type, wrapped); else this.on(type, wrapped);
  }
  removeEventListener(type, listener) {
    for (const l of this.listeners(type)) if (l._listener === listener) this.removeListener(type, l);
  }
}
for (const [i, name] of STATES.entries()) {
  Object.defineProperty(WebSocket, name, { value: i, enumerable: true });
  Object.defineProperty(WebSocket.prototype, name, { value: i, enumerable: true });
}
for (const type of ['open', 'message', 'error', 'close']) {
  const key = `_on${type}Handler`;
  Object.defineProperty(WebSocket.prototype, `on${type}`, {
    get() { return this[key]?._listener ?? null; },
    set(fn) {
      if (this[key]) this.removeEventListener(type, this[key]._listener);
      this[key] = null;
      if (typeof fn === 'function') { this.addEventListener(type, fn); this[key] = this.listeners(type).at(-1); }
    },
  });
}

export class WebSocketServer extends EventEmitter {
  constructor() { super(); throw unsupported('ws.WebSocketServer'); }
}

export function createWebSocketStream(ws, options) {
  const d = new Duplex({
    ...options,
    read() {},
    write(chunk, enc, cb) { ws.send(chunk, cb); },
    final(cb) { ws.close(); cb(); },
  });
  ws.on('message', (data) => d.push(data));
  ws.on('close', () => d.push(null));
  ws.on('error', (err) => d.destroy(err));
  return d;
}

export const Server = WebSocketServer;
export class Receiver {}
export class Sender {}

Object.assign(WebSocket, { WebSocket, WebSocketServer, Server, createWebSocketStream, Receiver, Sender });
export default WebSocket;
