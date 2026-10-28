// node:zlib — deflate/inflate/gzip via fflate, zstd decompression via fzstd
// (the bundle's 137 `.zst` assets), crc32, and Node's full `constants` table
// (report B §6b: jspm had no zlib.constants). Brotli and zstd compression are
// not available and throw ERR_FEATURE_UNAVAILABLE_ON_PLATFORM.
//
// Node naming vs fflate: Node "deflate" = zlib-wrapped (fflate zlibSync),
// Node "deflateRaw" = raw DEFLATE (fflate deflateSync).
import * as V from '../vendor.js';
import { Buffer } from './buffer.js';
import { Transform } from './stream.js';
import { constants } from './internal/zlib-constants.js';
import { unsupported } from './internal/errors.js';

export { constants };

const ff = () => V.fflate;
const zs = () => V.fzstd;

function bytes(data) {
  if (typeof data === 'string') return Buffer.from(data, 'utf8');
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  throw Object.assign(new TypeError('The "buffer" argument must be of type string or an instance of Buffer, TypedArray, DataView, or ArrayBuffer.'), { code: 'ERR_INVALID_ARG_TYPE' });
}
const toBuf = (u8) => Buffer.from(u8.buffer, u8.byteOffset, u8.byteLength);

function zlibError(err, code = 'Z_DATA_ERROR') {
  const e = new Error(err?.message || String(err));
  e.code = code;
  e.errno = constants[code] ?? -3;
  return e;
}

function wrapSync(fn) {
  return (data, opts) => {
    try { return toBuf(fn(bytes(data), opts)); } catch (err) { throw err?.code === 'ERR_FEATURE_UNAVAILABLE_ON_PLATFORM' ? err : zlibError(err); }
  };
}
const levelOpts = (o = {}) => ({ level: o.level === undefined || o.level < 0 ? 6 : Math.min(9, o.level), mem: o.memLevel });

export const deflateSync = wrapSync((d, o) => ff().zlibSync(d, levelOpts(o)));
export const inflateSync = wrapSync((d) => ff().unzlibSync(d));
export const deflateRawSync = wrapSync((d, o) => ff().deflateSync(d, levelOpts(o)));
export const inflateRawSync = wrapSync((d) => ff().inflateSync(d));
export const gzipSync = wrapSync((d, o) => ff().gzipSync(d, levelOpts(o)));
export const gunzipSync = wrapSync((d) => ff().gunzipSync(d));
export const unzipSync = wrapSync((d) => ff().decompressSync(d));
export const zstdDecompressSync = wrapSync((d) => zs().decompress(d));
export function zstdCompressSync() { throw unsupported('zlib.zstdCompressSync'); }
export function brotliCompressSync() { throw unsupported('zlib.brotliCompressSync'); }
export function brotliDecompressSync() { throw unsupported('zlib.brotliDecompressSync'); }

function asyncOf(syncFn) {
  return (data, opts, cb) => {
    const callback = typeof opts === 'function' ? opts : cb;
    const options = typeof opts === 'function' ? undefined : opts;
    queueMicrotask(() => {
      let out;
      try { out = syncFn(data, options); } catch (err) { callback(err); return; }
      callback(null, out);
    });
  };
}
export const deflate = asyncOf(deflateSync);
export const inflate = asyncOf(inflateSync);
export const deflateRaw = asyncOf(deflateRawSync);
export const inflateRaw = asyncOf(inflateRawSync);
export const gzip = asyncOf(gzipSync);
export const gunzip = asyncOf(gunzipSync);
export const unzip = asyncOf(unzipSync);
export const zstdDecompress = asyncOf(zstdDecompressSync);
export const zstdCompress = asyncOf(zstdCompressSync);
export const brotliCompress = asyncOf(brotliCompressSync);
export const brotliDecompress = asyncOf(brotliDecompressSync);

// --- streams -----------------------------------------------------------------
class ZlibBase extends Transform {
  constructor(opts = {}, makeEngine) {
    super({ ...opts, decodeStrings: true });
    this.bytesWritten = 0;
    this._opts = opts;
    this._failed = null;
    try {
      this._engine = makeEngine(opts, (chunk, final) => {
        if (chunk && chunk.length) this.push(toBuf(chunk));
        if (final) this._ended = true;
      });
    } catch (err) {
      this._failed = err;
    }
  }
  _transform(chunk, enc, cb) {
    if (this._failed) return cb(this._failed);
    try {
      const b = bytes(chunk);
      this.bytesWritten += b.length;
      if (!this._ended) this._engine.push(b, false);
      cb();
    } catch (err) {
      cb(zlibError(err));
    }
  }
  _flush(cb) {
    if (this._failed) return cb(this._failed);
    try {
      if (!this._ended) this._engine.push(new Uint8Array(0), true);
      cb();
    } catch (err) {
      cb(zlibError(err));
    }
  }
  flush(kind, cb) {
    const callback = typeof kind === 'function' ? kind : cb;
    try { this._engine?.flush?.(); } catch { /* inflaters have nothing to flush */ }
    if (callback) queueMicrotask(callback);
  }
  params(level, strategy, cb) { if (cb) queueMicrotask(cb); }
  reset() {}
  close(cb) { this.destroy(); if (cb) queueMicrotask(cb); }
}

const engine = (Cls, withOpts) => (opts, ondata) => {
  const e = withOpts ? new (ff()[Cls])(levelOpts(opts)) : new (ff()[Cls])();
  e.ondata = ondata;
  return e;
};

export class Deflate extends ZlibBase { constructor(o) { super(o, engine('Zlib', true)); } }
export class Inflate extends ZlibBase { constructor(o) { super(o, engine('Unzlib')); } }
export class DeflateRaw extends ZlibBase { constructor(o) { super(o, engine('Deflate', true)); } }
export class InflateRaw extends ZlibBase { constructor(o) { super(o, engine('Inflate')); } }
export class Gzip extends ZlibBase { constructor(o) { super(o, engine('Gzip', true)); } }
export class Gunzip extends ZlibBase { constructor(o) { super(o, engine('Gunzip')); } }
export class Unzip extends ZlibBase { constructor(o) { super(o, engine('Decompress')); } }
export class ZstdDecompress extends ZlibBase {
  constructor(o) {
    super(o, (opts, ondata) => { const d = new (zs().Decompress)(); d.ondata = ondata; return d; });
  }
}
class Unavailable extends ZlibBase {
  constructor(o, name) { super(o, () => { throw unsupported(`zlib.${name}`); }); }
}
export class ZstdCompress extends Unavailable { constructor(o) { super(o, 'ZstdCompress'); } }
export class BrotliCompress extends Unavailable { constructor(o) { super(o, 'BrotliCompress'); } }
export class BrotliDecompress extends Unavailable { constructor(o) { super(o, 'BrotliDecompress'); } }

export const createDeflate = (o) => new Deflate(o);
export const createInflate = (o) => new Inflate(o);
export const createDeflateRaw = (o) => new DeflateRaw(o);
export const createInflateRaw = (o) => new InflateRaw(o);
export const createGzip = (o) => new Gzip(o);
export const createGunzip = (o) => new Gunzip(o);
export const createUnzip = (o) => new Unzip(o);
export const createZstdDecompress = (o) => new ZstdDecompress(o);
export const createZstdCompress = (o) => new ZstdCompress(o);
export const createBrotliCompress = (o) => new BrotliCompress(o);
export const createBrotliDecompress = (o) => new BrotliDecompress(o);

// --- crc32 (Node >= 22.2) ------------------------------------------------------
let table = null;
export function crc32(data, value = 0) {
  if (!table) {
    table = new Int32Array(256);
    for (let n = 0; n < 256; n++) {
      let c = n;
      for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
      table[n] = c;
    }
  }
  const b = bytes(data);
  let crc = ~value;
  for (let i = 0; i < b.length; i++) crc = table[(crc ^ b[i]) & 0xff] ^ (crc >>> 8);
  return ~crc >>> 0;
}

// zlib.codes: name <-> number, as Node exports it.
export const codes = Object.freeze(Object.fromEntries(
  ['Z_OK', 'Z_STREAM_END', 'Z_NEED_DICT', 'Z_ERRNO', 'Z_STREAM_ERROR', 'Z_DATA_ERROR', 'Z_MEM_ERROR', 'Z_BUF_ERROR', 'Z_VERSION_ERROR']
    .flatMap((k) => [[k, constants[k]], [String(constants[k]), k]]),
));

// Legacy top-level constants (zlib.Z_FINISH etc.).
export const {
  Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK, Z_OK, Z_STREAM_END,
  Z_NEED_DICT, Z_ERRNO, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR, Z_VERSION_ERROR,
  Z_NO_COMPRESSION, Z_BEST_SPEED, Z_BEST_COMPRESSION, Z_DEFAULT_COMPRESSION, Z_FILTERED,
  Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY, Z_MIN_WINDOWBITS, Z_MAX_WINDOWBITS,
  Z_DEFAULT_WINDOWBITS, Z_MIN_CHUNK, Z_MAX_CHUNK, Z_DEFAULT_CHUNK, Z_MIN_MEMLEVEL, Z_MAX_MEMLEVEL,
  Z_DEFAULT_MEMLEVEL, Z_MIN_LEVEL, Z_MAX_LEVEL, Z_DEFAULT_LEVEL,
} = constants;

const zlib = {
  constants, codes, crc32,
  deflateSync, inflateSync, deflateRawSync, inflateRawSync, gzipSync, gunzipSync, unzipSync,
  zstdDecompressSync, zstdCompressSync, brotliCompressSync, brotliDecompressSync,
  deflate, inflate, deflateRaw, inflateRaw, gzip, gunzip, unzip, zstdDecompress, zstdCompress,
  brotliCompress, brotliDecompress,
  Deflate, Inflate, DeflateRaw, InflateRaw, Gzip, Gunzip, Unzip, ZstdDecompress, ZstdCompress,
  BrotliCompress, BrotliDecompress,
  createDeflate, createInflate, createDeflateRaw, createInflateRaw, createGzip, createGunzip,
  createUnzip, createZstdDecompress, createZstdCompress, createBrotliCompress, createBrotliDecompress,
  Z_NO_FLUSH, Z_PARTIAL_FLUSH, Z_SYNC_FLUSH, Z_FULL_FLUSH, Z_FINISH, Z_BLOCK, Z_OK, Z_STREAM_END,
  Z_NEED_DICT, Z_ERRNO, Z_STREAM_ERROR, Z_DATA_ERROR, Z_MEM_ERROR, Z_BUF_ERROR, Z_VERSION_ERROR,
  Z_NO_COMPRESSION, Z_BEST_SPEED, Z_BEST_COMPRESSION, Z_DEFAULT_COMPRESSION, Z_FILTERED,
  Z_HUFFMAN_ONLY, Z_RLE, Z_FIXED, Z_DEFAULT_STRATEGY, Z_MIN_WINDOWBITS, Z_MAX_WINDOWBITS,
  Z_DEFAULT_WINDOWBITS, Z_MIN_CHUNK, Z_MAX_CHUNK, Z_DEFAULT_CHUNK, Z_MIN_MEMLEVEL, Z_MAX_MEMLEVEL,
  Z_DEFAULT_MEMLEVEL, Z_MIN_LEVEL, Z_MAX_LEVEL, Z_DEFAULT_LEVEL,
};
export default zlib;
