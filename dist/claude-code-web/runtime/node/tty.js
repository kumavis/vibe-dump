// node:tty — no terminal in a Worker: isatty() is always false. The stream
// classes exist so `instanceof`/construction sites link and run.
import { Readable, Writable } from './stream.js';

export const isatty = () => false;

export class ReadStream extends Readable {
  constructor(fd, options) {
    super({ ...options, read() {} });
    this.fd = fd;
    this.isTTY = false;
    this.isRaw = false;
  }
  setRawMode(mode) { this.isRaw = !!mode; return this; }
  ref() { return this; }
  unref() { return this; }
}

export class WriteStream extends Writable {
  constructor(fd, options) {
    super({ ...options, write(chunk, enc, cb) { cb(); } });
    this.fd = fd;
    this.isTTY = false;
    this.columns = 80;
    this.rows = 24;
  }
  getColorDepth() { return 1; }
  hasColors() { return false; }
  getWindowSize() { return [this.columns, this.rows]; }
  clearLine(dir, cb) { cb?.(); return true; }
  clearScreenDown(cb) { cb?.(); return true; }
  cursorTo(x, y, cb) { (typeof y === 'function' ? y : cb)?.(); return true; }
  moveCursor(dx, dy, cb) { cb?.(); return true; }
}

export default { isatty, ReadStream, WriteStream };
