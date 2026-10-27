// node:readline — jspm's is `unimplemented`. This is the non-terminal subset:
// line splitting over any Readable (process.stdin carries stream-json input),
// question(), prompt(), pause/resume, close and async iteration.
import EventEmitter from './events.js';

const kQuestion = Symbol('question');

export class Interface extends EventEmitter {
  constructor(input, output, completer, terminal) {
    super();
    // createInterface(options) or createInterface(input, output, completer, terminal)
    const opts = input && input.input !== undefined ? input : { input, output, completer, terminal };
    this.input = opts.input;
    this.output = opts.output;
    this.terminal = false; // never a TTY here
    this.crlfDelay = Math.max(100, opts.crlfDelay || 100);
    this.history = [];
    this.line = '';
    this.cursor = 0;
    this.closed = false;
    this.paused = false;
    this._prompt = opts.prompt ?? '> ';
    this._partial = '';
    this._sawCR = false;
    this._pending = [];
    this._decoder = new TextDecoder();
    this[kQuestion] = null;

    this._onData = (chunk) => this._feed(typeof chunk === 'string' ? chunk : this._decoder.decode(chunk, { stream: true }));
    this._onEnd = () => {
      const rest = this._decoder.decode();
      if (rest) this._feed(rest);
      if (this._partial.length) { const l = this._partial; this._partial = ''; this._emitLine(l); }
      this.close();
    };
    if (this.input) {
      this.input.on('data', this._onData);
      this.input.on('end', this._onEnd);
      this.input.on('close', this._onEnd);
      if (typeof this.input.resume === 'function') this.input.resume();
    }
    if (opts.signal) {
      if (opts.signal.aborted) queueMicrotask(() => this.close());
      else opts.signal.addEventListener('abort', () => this.close(), { once: true });
    }
  }

  _feed(text) {
    let s = text;
    if (this._sawCR && s.startsWith('\n')) s = s.slice(1);
    this._sawCR = false;
    const parts = (this._partial + s).split(/\r\n|\n|\r/);
    this._sawCR = s.endsWith('\r');
    this._partial = parts.pop();
    for (const l of parts) this._emitLine(l);
  }

  _emitLine(l) {
    if (this.closed) return;
    if (this.paused) { this._pending.push(l); return; }
    const q = this[kQuestion];
    if (q) { this[kQuestion] = null; q(l); return; }
    this.emit('line', l);
  }

  setPrompt(p) { this._prompt = p; }
  getPrompt() { return this._prompt; }
  prompt() { if (!this.closed) { this.resume(); this.output?.write?.(this._prompt); } }
  question(query, options, cb) {
    const callback = typeof options === 'function' ? options : cb;
    if (this.closed) throw Object.assign(new Error('readline was closed'), { code: 'ERR_USE_AFTER_CLOSE' });
    this.output?.write?.(query);
    this[kQuestion] = callback;
    this.resume();
  }
  write(data) { if (!this.closed && data != null) this._feed(String(data)); }
  pause() {
    if (this.paused) return this;
    this.paused = true;
    this.input?.pause?.();
    this.emit('pause');
    return this;
  }
  resume() {
    if (!this.paused) return this;
    this.paused = false;
    this.input?.resume?.();
    this.emit('resume');
    const pending = this._pending.splice(0);
    for (const l of pending) this._emitLine(l);
    return this;
  }
  close() {
    if (this.closed) return;
    this.closed = true;
    if (this.input) {
      this.input.removeListener('data', this._onData);
      this.input.removeListener('end', this._onEnd);
      this.input.removeListener('close', this._onEnd);
    }
    this.emit('close');
  }
  getCursorPos() { return { rows: 0, cols: this.cursor }; }

  [Symbol.asyncIterator]() {
    const queue = [];
    const waiters = [];
    let done = this.closed;
    const onLine = (l) => { const w = waiters.shift(); if (w) w({ value: l, done: false }); else queue.push(l); };
    const onClose = () => { done = true; for (const w of waiters.splice(0)) w({ value: undefined, done: true }); };
    this.on('line', onLine);
    this.on('close', onClose);
    const cleanup = () => { this.removeListener('line', onLine); this.removeListener('close', onClose); };
    return {
      next: () => {
        if (queue.length) return Promise.resolve({ value: queue.shift(), done: false });
        if (done) { cleanup(); return Promise.resolve({ value: undefined, done: true }); }
        return new Promise((resolve) => waiters.push(resolve));
      },
      return: () => { cleanup(); this.close(); return Promise.resolve({ value: undefined, done: true }); },
      [Symbol.asyncIterator]() { return this; },
    };
  }
}

export function createInterface(input, output, completer, terminal) {
  return new Interface(input, output, completer, terminal);
}

// Cursor helpers write the same ANSI sequences Node does.
const csi = (s) => `\x1b[${s}`;
export function cursorTo(stream, x, y, cb) {
  const callback = typeof y === 'function' ? y : cb;
  const seq = typeof y === 'number' ? csi(`${y + 1};${x + 1}H`) : csi(`${x + 1}G`);
  stream?.write?.(seq);
  callback?.();
  return true;
}
export function moveCursor(stream, dx, dy, cb) {
  let seq = '';
  if (dx < 0) seq += csi(`${-dx}D`); else if (dx > 0) seq += csi(`${dx}C`);
  if (dy < 0) seq += csi(`${-dy}A`); else if (dy > 0) seq += csi(`${dy}B`);
  if (seq) stream?.write?.(seq);
  cb?.();
  return true;
}
export function clearLine(stream, dir, cb) {
  stream?.write?.(dir < 0 ? csi('1K') : dir > 0 ? csi('0K') : csi('2K'));
  cb?.();
  return true;
}
export function clearScreenDown(stream, cb) {
  stream?.write?.(csi('0J'));
  cb?.();
  return true;
}
export function emitKeypressEvents() {}

export const promises = {
  Interface: class extends Interface {
    question(query, options = {}) {
      return new Promise((resolve, reject) => {
        if (options.signal?.aborted) return reject(Object.assign(new Error('The operation was aborted'), { name: 'AbortError', code: 'ABORT_ERR' }));
        super.question(query, resolve);
      });
    }
  },
  createInterface: (...args) => new promises.Interface(...args),
  Readline: class { constructor(stream) { this.stream = stream; } clearLine() { return this; } clearScreenDown() { return this; } cursorTo() { return this; } moveCursor() { return this; } commit() { return Promise.resolve(); } rollback() { return this; } },
};

export default {
  Interface, createInterface, cursorTo, moveCursor, clearLine, clearScreenDown,
  emitKeypressEvents, promises,
};
