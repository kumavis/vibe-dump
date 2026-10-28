// node:net — no raw sockets in a page. connect()/createConnection() return a
// Socket that fails asynchronously with ECONNREFUSED; servers never listen;
// isIP* are real; BlockList is a working in-memory list (report B §6b).
import { Duplex } from './stream.js';
import EventEmitter from './events.js';
import { systemError } from './internal/errors.js';

const v4 = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/;
export const isIPv4 = (s) => v4.test(String(s));
export function isIPv6(s) {
  const str = String(s).replace(/%.*$/, '');
  if (!str.includes(':')) return false;
  try { return new URL(`http://[${str}]/`).hostname.length > 2; } catch { return false; }
}
export const isIP = (s) => (isIPv4(s) ? 4 : isIPv6(s) ? 6 : 0);

let autoSelectFamily = true;
let autoSelectFamilyAttemptTimeout = 250;
export const getDefaultAutoSelectFamily = () => autoSelectFamily;
export const setDefaultAutoSelectFamily = (v) => { autoSelectFamily = !!v; };
export const getDefaultAutoSelectFamilyAttemptTimeout = () => autoSelectFamilyAttemptTimeout;
export const setDefaultAutoSelectFamilyAttemptTimeout = (v) => { autoSelectFamilyAttemptTimeout = v; };

export class Socket extends Duplex {
  constructor(options = {}) {
    super({ ...options, read() {}, write(chunk, enc, cb) { cb(systemError('ENOTCONN', 'write', { message: 'This socket is not connected' })); } });
    this.connecting = false;
    this.pending = true;
    this.remoteAddress = undefined;
    this.remotePort = undefined;
    this.remoteFamily = undefined;
    this.localAddress = undefined;
    this.localPort = undefined;
    this.bytesRead = 0;
    this.bytesWritten = 0;
    this.readyState = 'closed';
    this.timeout = undefined;
  }
  connect(...args) {
    const opts = typeof args[0] === 'object' ? args[0] : { port: args[0], host: typeof args[1] === 'string' ? args[1] : 'localhost', path: typeof args[0] === 'string' && Number.isNaN(Number(args[0])) ? args[0] : undefined };
    const cb = args.find((a) => typeof a === 'function');
    if (cb) this.once('connect', cb);
    this.connecting = true;
    this.readyState = 'opening';
    const where = opts.path || `${opts.host || 'localhost'}:${opts.port}`;
    queueMicrotask(() => {
      this.connecting = false;
      this.readyState = 'closed';
      this.destroy(systemError('ECONNREFUSED', 'connect', { message: `connect ECONNREFUSED ${where} (raw sockets are not available in the browser runtime)`, address: opts.host, port: opts.port }));
    });
    return this;
  }
  setTimeout(ms, cb) { this.timeout = ms; if (cb) this.once('timeout', cb); return this; }
  setNoDelay() { return this; }
  setKeepAlive() { return this; }
  address() { return {}; }
  ref() { return this; }
  unref() { return this; }
  resetAndDestroy() { return this.destroy(); }
}
export const Stream = Socket;

export function connect(...args) {
  const opts = typeof args[0] === 'object' ? args[0] : {};
  return new Socket(opts).connect(...args);
}
export const createConnection = connect;

export class Server extends EventEmitter {
  constructor(options, listener) {
    super();
    if (typeof options === 'function') listener = options;
    if (listener) this.on('connection', listener);
    this.listening = false;
    this.maxConnections = undefined;
  }
  listen() {
    queueMicrotask(() => {
      if (this.listenerCount('error') > 0) this.emit('error', systemError('EADDRNOTAVAIL', 'listen', { message: 'listen EADDRNOTAVAIL: servers are not available in the browser runtime' }));
    });
    return this;
  }
  address() { return null; }
  close(cb) { if (typeof cb === 'function') queueMicrotask(() => cb()); return this; }
  getConnections(cb) { queueMicrotask(() => cb(null, 0)); return this; }
  ref() { return this; }
  unref() { return this; }
}
export const createServer = (options, listener) => new Server(options, listener);

function ipToBigInt(ip) {
  if (isIPv4(ip)) return { family: 'ipv4', n: ip.split('.').reduce((a, o) => (a << 8n) + BigInt(o), 0n) };
  const full = new URL(`http://[${ip}]/`).hostname.slice(1, -1);
  let parts = full.split('::');
  const head = parts[0] ? parts[0].split(':') : [];
  const tail = parts[1] !== undefined && parts[1] ? parts[1].split(':') : [];
  const groups = parts.length === 2 ? [...head, ...Array(8 - head.length - tail.length).fill('0'), ...tail] : head;
  return { family: 'ipv6', n: groups.reduce((a, g) => (a << 16n) + BigInt(parseInt(g || '0', 16)), 0n) };
}

export class SocketAddress {
  constructor({ address = '127.0.0.1', port = 0, family = 'ipv4', flowlabel = 0 } = {}) {
    Object.assign(this, { address, port, family, flowlabel });
  }
  static parse(s) {
    const m = /^\[?([^\]]+?)\]?(?::(\d+))?$/.exec(s);
    return m ? new SocketAddress({ address: m[1], port: Number(m[2] || 0), family: isIPv6(m[1]) ? 'ipv6' : 'ipv4' }) : undefined;
  }
}

export class BlockList {
  constructor() { this._rules = []; }
  addAddress(address, family = 'ipv4') { this._rules.push({ type: 'address', address: String(address?.address ?? address), family }); }
  addRange(start, end, family = 'ipv4') { this._rules.push({ type: 'range', start: String(start?.address ?? start), end: String(end?.address ?? end), family }); }
  addSubnet(net, prefix, family = 'ipv4') { this._rules.push({ type: 'subnet', net: String(net?.address ?? net), prefix, family }); }
  check(address, family = 'ipv4') {
    let ip;
    try { ip = ipToBigInt(String(address?.address ?? address)); } catch { return false; }
    return this._rules.some((r) => {
      try {
        if (r.type === 'address') return ipToBigInt(r.address).n === ip.n;
        if (r.type === 'range') return ipToBigInt(r.start).n <= ip.n && ip.n <= ipToBigInt(r.end).n;
        const base = ipToBigInt(r.net);
        if (base.family !== ip.family) return false;
        const bits = base.family === 'ipv4' ? 32n : 128n;
        const shift = bits - BigInt(r.prefix);
        return (base.n >> shift) === (ip.n >> shift);
      } catch { return false; }
    });
  }
  get rules() { return this._rules.map((r) => `${r.type}: ${r.address || r.net || `${r.start}-${r.end}`}`); }
  static isBlockList(v) { return v instanceof BlockList; }
}

export default {
  isIP, isIPv4, isIPv6, Socket, Stream, connect, createConnection, Server, createServer, BlockList,
  SocketAddress, getDefaultAutoSelectFamily, setDefaultAutoSelectFamily,
  getDefaultAutoSelectFamilyAttemptTimeout, setDefaultAutoSelectFamilyAttemptTimeout,
};
