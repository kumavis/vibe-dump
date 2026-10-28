// http(s).request over the browser's fetch().
//
// ClientRequest is a Writable that buffers the request body and issues one
// fetch() when ended; the IncomingMessage pulls the response body from the
// fetch ReadableStream chunk by chunk, so SSE responses stream. fetch has
// already undone any Content-Encoding, so that header (and Content-Length) is
// dropped from the response, otherwise axios would try to gunzip plain text.
//
// Servers cannot exist in a page: createServer() returns a Server whose
// listen() never binds (it emits 'error' if someone is listening for one).
import EventEmitter from '../events.js';
import { Readable, Writable } from '../stream.js';
import { Buffer } from '../buffer.js';
import { systemError, unsupported, nodeError } from './errors.js';

export const METHODS = [
  'ACL', 'BIND', 'CHECKOUT', 'CONNECT', 'COPY', 'DELETE', 'GET', 'HEAD', 'LINK', 'LOCK', 'M-SEARCH',
  'MERGE', 'MKACTIVITY', 'MKCALENDAR', 'MKCOL', 'MOVE', 'NOTIFY', 'OPTIONS', 'PATCH', 'POST',
  'PROPFIND', 'PROPPATCH', 'PURGE', 'PUT', 'QUERY', 'REBIND', 'REPORT', 'SEARCH', 'SOURCE',
  'SUBSCRIBE', 'TRACE', 'UNBIND', 'UNLINK', 'UNLOCK', 'UNSUBSCRIBE',
];

export const STATUS_CODES = {
  100: 'Continue', 101: 'Switching Protocols', 102: 'Processing', 103: 'Early Hints', 200: 'OK',
  201: 'Created', 202: 'Accepted', 203: 'Non-Authoritative Information', 204: 'No Content',
  205: 'Reset Content', 206: 'Partial Content', 207: 'Multi-Status', 208: 'Already Reported',
  226: 'IM Used', 300: 'Multiple Choices', 301: 'Moved Permanently', 302: 'Found', 303: 'See Other',
  304: 'Not Modified', 305: 'Use Proxy', 307: 'Temporary Redirect', 308: 'Permanent Redirect',
  400: 'Bad Request', 401: 'Unauthorized', 402: 'Payment Required', 403: 'Forbidden', 404: 'Not Found',
  405: 'Method Not Allowed', 406: 'Not Acceptable', 407: 'Proxy Authentication Required',
  408: 'Request Timeout', 409: 'Conflict', 410: 'Gone', 411: 'Length Required',
  412: 'Precondition Failed', 413: 'Payload Too Large', 414: 'URI Too Long',
  415: 'Unsupported Media Type', 416: 'Range Not Satisfiable', 417: 'Expectation Failed',
  418: "I'm a Teapot", 421: 'Misdirected Request', 422: 'Unprocessable Entity', 423: 'Locked',
  424: 'Failed Dependency', 425: 'Too Early', 426: 'Upgrade Required', 428: 'Precondition Required',
  429: 'Too Many Requests', 431: 'Request Header Fields Too Large', 451: 'Unavailable For Legal Reasons',
  500: 'Internal Server Error', 501: 'Not Implemented', 502: 'Bad Gateway', 503: 'Service Unavailable',
  504: 'Gateway Timeout', 505: 'HTTP Version Not Supported', 506: 'Variant Also Negotiates',
  507: 'Insufficient Storage', 508: 'Loop Detected', 509: 'Bandwidth Limit Exceeded', 510: 'Not Extended',
  511: 'Network Authentication Required',
};

// Headers fetch() refuses or manages itself.
const DROP_REQUEST_HEADERS = new Set([
  'host', 'connection', 'content-length', 'transfer-encoding', 'keep-alive', 'upgrade', 'expect',
  'proxy-connection', 'te', 'trailer', 'accept-encoding',
]);

export const maxHeaderSize = 16384;

export function validateHeaderName(name) {
  if (typeof name !== 'string' || !/^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/.test(name)) {
    throw nodeError('ERR_INVALID_HTTP_TOKEN', `Header name must be a valid HTTP token ["${name}"]`, TypeError);
  }
}
export function validateHeaderValue(name, value) {
  if (value === undefined) throw nodeError('ERR_HTTP_INVALID_HEADER_VALUE', `Invalid value "${value}" for header "${name}"`, TypeError);
  if (/[^\t\x20-\x7e\x80-\xff]/.test(String(value))) throw nodeError('ERR_INVALID_CHAR', `Invalid character in header content ["${name}"]`, TypeError);
}
export function setMaxIdleHTTPParsers() {}

// --- Agent (inert: fetch owns connections) ------------------------------------------
export class Agent extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = { path: null, ...options };
    this.keepAlive = !!options.keepAlive;
    this.keepAliveMsecs = options.keepAliveMsecs ?? 1000;
    this.maxSockets = options.maxSockets ?? Infinity;
    this.maxFreeSockets = options.maxFreeSockets ?? 256;
    this.maxTotalSockets = options.maxTotalSockets ?? Infinity;
    this.totalSocketCount = 0;
    this.defaultPort = options.defaultPort ?? 80;
    this.protocol = options.protocol ?? 'http:';
    this.sockets = {};
    this.freeSockets = {};
    this.requests = {};
  }
  getName(o = {}) { return `${o.host || 'localhost'}:${o.port || ''}:${o.localAddress || ''}`; }
  createConnection() { throw unsupported('http.Agent#createConnection'); }
  keepSocketAlive() { return false; }
  reuseSocket() {}
  destroy() {}
}

// A stand-in for req.socket / res.socket: enough surface for timeout and
// keep-alive tweaks that libraries apply to the socket.
class FakeSocket extends EventEmitter {
  constructor(host, port, encrypted) {
    super();
    this.remoteAddress = host;
    this.remotePort = port;
    this.encrypted = encrypted;
    this.authorized = encrypted;
    this.connecting = false;
    this.destroyed = false;
    this.writable = true;
    this.readable = true;
  }
  setTimeout(ms, cb) { if (cb) this.once('timeout', cb); return this; }
  setNoDelay() { return this; }
  setKeepAlive() { return this; }
  ref() { return this; }
  unref() { return this; }
  address() { return {}; }
  getPeerCertificate() { return {}; }
  destroy() { this.destroyed = true; return this; }
  end() { return this; }
}

export class IncomingMessage extends Readable {
  constructor(socket) {
    super();
    this.socket = socket;
    this.connection = socket;
    this.httpVersion = '1.1';
    this.httpVersionMajor = 1;
    this.httpVersionMinor = 1;
    this.headers = {};
    this.headersDistinct = {};
    this.rawHeaders = [];
    this.trailers = {};
    this.trailersDistinct = {};
    this.rawTrailers = [];
    this.statusCode = null;
    this.statusMessage = null;
    this.url = '';
    this.method = null;
    this.complete = false;
    this.aborted = false;
    this._reader = null;
    this._reading = false;
  }
  _read() {
    if (!this._reader || this._reading) return;
    this._reading = true;
    this._reader.read().then(({ done, value }) => {
      this._reading = false;
      this._onChunk?.();
      if (done) { this.complete = true; this.push(null); return; }
      if (value && value.byteLength && this.push(Buffer.from(value.buffer, value.byteOffset, value.byteLength))) this._read();
      else if (value && !value.byteLength) this._read();
    }, (err) => {
      this._reading = false;
      if (this.destroyed) return;
      this.aborted = true;
      this.emit('aborted');
      this.destroy(systemError('ECONNRESET', 'read', { message: 'aborted', cause: err }));
    });
  }
  _destroy(err, cb) {
    if (this._reader && !this.complete) this._reader.cancel().catch(() => {});
    cb(err);
  }
  setTimeout(ms, cb) { this.req?.setTimeout(ms, cb); return this; }
}

function normalizeRequestArgs(input, options, cb, defaultProtocol) {
  let opts = {};
  let callback = cb;
  if (typeof input === 'string' || input instanceof URL) {
    const u = new URL(String(input));
    opts = {
      protocol: u.protocol, hostname: u.hostname.replace(/^\[|\]$/g, ''), port: u.port,
      path: `${u.pathname}${u.search}`, auth: u.username ? `${decodeURIComponent(u.username)}:${decodeURIComponent(u.password)}` : undefined,
    };
    if (typeof options === 'function') callback = options;
    else if (options) opts = { ...opts, ...options };
  } else {
    opts = { ...(input || {}) };
    if (typeof options === 'function') callback = options;
  }
  opts.protocol = opts.protocol || opts.agent?.protocol || defaultProtocol;
  return { opts, callback };
}

function headerEntries(headers) {
  if (!headers) return [];
  if (Array.isArray(headers)) {
    const out = [];
    for (let i = 0; i < headers.length; i += 2) out.push([headers[i], headers[i + 1]]);
    return out;
  }
  return Object.entries(headers);
}

export class ClientRequest extends Writable {
  constructor(input, options, cb, defaultProtocol = 'http:') {
    // No autoDestroy: 'finish' (request body sent) must not abort the fetch.
    super({ autoDestroy: false, emitClose: false });
    const { opts, callback } = normalizeRequestArgs(input, options, cb, defaultProtocol);
    this._opts = opts;
    this.method = String(opts.method || 'GET').toUpperCase();
    this.protocol = opts.protocol;
    const defaultPort = opts.defaultPort || (this.protocol === 'https:' ? 443 : 80);
    let host = opts.hostname || opts.host || 'localhost';
    let port = opts.port;
    if (!opts.hostname && typeof opts.host === 'string' && /^[^[\]]+:\d+$/.test(opts.host)) [host, port] = opts.host.split(':');
    this.host = host;
    this.port = Number(port) || defaultPort;
    this.path = opts.path || '/';
    this.agent = opts.agent;
    this.aborted = false;
    this.headersSent = false;
    this.reusedSocket = false;
    this.maxHeadersCount = null;
    this.finished = false;
    this._headers = new Map(); // lower-case name -> [originalName, value]
    for (const [k, v] of headerEntries(opts.headers)) if (v !== undefined) this.setHeader(k, v);
    if (opts.auth && !this.hasHeader('authorization')) {
      this.setHeader('Authorization', `Basic ${Buffer.from(opts.auth).toString('base64')}`);
    }
    this._chunks = [];
    this._controller = new AbortController();
    this._timeoutMs = 0;
    this._timer = null;
    this.socket = new FakeSocket(host, this.port, this.protocol === 'https:');
    this.connection = this.socket;
    if (callback) this.once('response', callback);
    if (opts.timeout) this.setTimeout(opts.timeout);
    this._unlinkSignal = null;
    if (opts.signal) {
      // An abort destroys the request whenever it lands: _destroy aborts the
      // fetch (pending, or its body mid-stream) and _send cancels a body that
      // arrives after the request was destroyed. The listener goes away with
      // the request, so a long-lived signal does not collect one per request.
      const signal = opts.signal;
      const onAbort = () => this.destroy(Object.assign(new Error('The operation was aborted'), { name: 'AbortError', code: 'ABORT_ERR', cause: signal.reason }));
      if (signal.aborted) queueMicrotask(onAbort);
      else {
        signal.addEventListener('abort', onAbort, { once: true });
        this._unlinkSignal = () => { this._unlinkSignal = null; signal.removeEventListener('abort', onAbort); };
      }
    }
    queueMicrotask(() => { if (!this.destroyed) this.emit('socket', this.socket); });
  }

  get url() {
    const h = this.host.includes(':') ? `[${this.host}]` : this.host;
    const defaultPort = this.protocol === 'https:' ? 443 : 80;
    return `${this.protocol}//${h}${this.port && this.port !== defaultPort ? `:${this.port}` : ''}${this.path}`;
  }

  setHeader(name, value) {
    if (this.headersSent) throw nodeError('ERR_HTTP_HEADERS_SENT', 'Cannot set headers after they are sent to the client');
    this._headers.set(String(name).toLowerCase(), [String(name), value]);
    return this;
  }
  getHeader(name) { return this._headers.get(String(name).toLowerCase())?.[1]; }
  hasHeader(name) { return this._headers.has(String(name).toLowerCase()); }
  removeHeader(name) { this._headers.delete(String(name).toLowerCase()); }
  getHeaders() { return Object.fromEntries([...this._headers].map(([k, [, v]]) => [k, v])); }
  getHeaderNames() { return [...this._headers.keys()]; }
  getRawHeaderNames() { return [...this._headers.values()].map(([n]) => n); }
  flushHeaders() {}
  setNoDelay() {}
  setSocketKeepAlive() {}
  setTimeout(ms, cb) {
    if (cb) this.once('timeout', cb);
    this._timeoutMs = ms;
    this._armTimer();
    return this;
  }
  _armTimer() {
    clearTimeout(this._timer);
    if (this._timeoutMs > 0 && !this.destroyed) {
      this._timer = setTimeout(() => { this.emit('timeout'); this.socket.emit('timeout'); }, this._timeoutMs);
    }
  }
  abort() {
    if (this.aborted) return;
    this.aborted = true;
    queueMicrotask(() => this.emit('abort'));
    this.destroy();
  }

  _write(chunk, encoding, cb) {
    this._chunks.push(typeof chunk === 'string' ? Buffer.from(chunk, encoding) : Buffer.from(chunk));
    cb();
  }

  _final(cb) {
    this.finished = true;
    this.headersSent = true;
    cb();
    this._send();
  }

  _destroy(err, cb) {
    clearTimeout(this._timer);
    this._unlinkSignal?.();
    this._controller.abort(err || undefined);
    this.res?.destroy();
    cb(err);
  }

  async _send() {
    const headers = new Headers();
    for (const [k, [, v]] of this._headers) {
      if (DROP_REQUEST_HEADERS.has(k) || v === undefined) continue;
      headers.set(k, Array.isArray(v) ? v.join(', ') : String(v));
    }
    const hasBody = this._chunks.length && !['GET', 'HEAD'].includes(this.method);
    const body = hasBody ? Buffer.concat(this._chunks) : undefined;
    this._armTimer();
    let res;
    try {
      res = await globalThis.fetch(this.url, {
        method: this.method,
        headers,
        body: body && new Uint8Array(body.buffer, body.byteOffset, body.byteLength),
        signal: this._controller.signal,
        credentials: 'omit',
        redirect: 'follow',
      });
    } catch (err) {
      clearTimeout(this._timer);
      if (this.destroyed) return;
      const e = err?.name === 'AbortError'
        ? Object.assign(new Error('socket hang up'), { code: 'ECONNRESET', cause: err })
        : systemError('ECONNREFUSED', 'connect', { message: `connect ECONNREFUSED ${this.host}:${this.port} (fetch failed: ${err?.message || err})`, address: this.host, port: this.port, cause: err });
      this.destroy(e);
      return;
    }
    if (this.destroyed) { res.body?.cancel().catch(() => {}); return; }
    const msg = new IncomingMessage(this.socket);
    this.res = msg;
    msg.req = this;
    msg.statusCode = res.status;
    msg.statusMessage = res.statusText || STATUS_CODES[res.status] || '';
    const decoded = res.headers.has('content-encoding');
    for (const [k, v] of res.headers) {
      if (decoded && (k === 'content-encoding' || k === 'content-length')) continue;
      msg.rawHeaders.push(k, v);
      if (k === 'set-cookie') { (msg.headers[k] ||= []).push(v); } else msg.headers[k] = msg.headers[k] === undefined ? v : `${msg.headers[k]}, ${v}`;
      (msg.headersDistinct[k] ||= []).push(v);
    }
    if (res.body && this.method !== 'HEAD' && res.status !== 204 && res.status !== 304) {
      msg._reader = res.body.getReader();
      msg._onChunk = () => this._armTimer();
    } else {
      msg.complete = true;
      msg.push(null);
    }
    // (the Readable emits its own 'close' after 'end')
    msg.once('end', () => { clearTimeout(this._timer); this._unlinkSignal?.(); queueMicrotask(() => this.emit('close')); });
    this.emit('response', msg);
    // Node discards an unconsumed response body; don't leave the fetch dangling.
    if (this.listenerCount('response') === 0) msg.resume();
  }
}

export function request(input, options, cb, defaultProtocol) {
  return new ClientRequest(input, options, cb, defaultProtocol);
}

export function get(input, options, cb, defaultProtocol) {
  const req = request(input, options, cb, defaultProtocol);
  req.end();
  return req;
}

export class OutgoingMessage extends Writable {}

export class ServerResponse extends Writable {
  constructor(req) { super(); this.req = req; this.statusCode = 200; this.headersSent = false; }
}

export class Server extends EventEmitter {
  constructor(options, requestListener) {
    super();
    if (typeof options === 'function') requestListener = options;
    if (requestListener) this.on('request', requestListener);
    this.listening = false;
    this.timeout = 0;
    this.keepAliveTimeout = 5000;
    this.headersTimeout = 60000;
    this.requestTimeout = 300000;
    this.maxHeadersCount = null;
  }
  listen(...args) {
    queueMicrotask(() => {
      if (this.listenerCount('error') > 0) {
        this.emit('error', systemError('EADDRNOTAVAIL', 'listen', { message: 'listen EADDRNOTAVAIL: servers are not available in the browser runtime' }));
      }
    });
    return this;
  }
  address() { return null; }
  close(cb) { if (typeof cb === 'function') queueMicrotask(() => cb()); queueMicrotask(() => this.emit('close')); return this; }
  closeAllConnections() {}
  closeIdleConnections() {}
  setTimeout(ms, cb) { if (cb) this.on('timeout', cb); return this; }
  ref() { return this; }
  unref() { return this; }
  [Symbol.asyncDispose ?? Symbol.for('Symbol.asyncDispose')]() { this.close(); return Promise.resolve(); }
}

export function createServer(options, requestListener) {
  return new Server(options, requestListener);
}
