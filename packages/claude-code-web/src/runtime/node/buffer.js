// node:buffer — @jspm/core's Buffer (feross/buffer) with the gaps Node code hits:
// 'base64url' encoding (feross only knows 'base64'), isUtf8/isAscii, constants,
// Blob/File/atob/btoa re-exports.
//
// The patch mutates the shared jspm Buffer class on purpose: jspm's stream and
// string_decoder use the same class, so every Buffer in the runtime gets it.
import jspmBuffer from '../jspm/buffer.js';

export const Buffer = jspmBuffer.Buffer;
export const SlowBuffer = jspmBuffer.SlowBuffer;
export const INSPECT_MAX_BYTES = jspmBuffer.INSPECT_MAX_BYTES;
export const kMaxLength = jspmBuffer.kMaxLength;
export const kStringMaxLength = 2 ** 29 - 24;
export const constants = { MAX_LENGTH: kMaxLength, MAX_STRING_LENGTH: kStringMaxLength };

const PATCHED = Symbol.for('claude-code-web.buffer.base64url');

const isB64Url = (e) => typeof e === 'string' && e.toLowerCase() === 'base64url';
const toB64 = (e) => (isB64Url(e) ? 'base64' : e);
const b64ToUrl = (s) => s.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

if (!Buffer[PATCHED]) {
  Buffer[PATCHED] = true;
  const proto = Buffer.prototype;

  const isEncoding = Buffer.isEncoding;
  Buffer.isEncoding = (enc) => isB64Url(enc) || isEncoding(enc);

  const byteLength = Buffer.byteLength;
  Buffer.byteLength = (str, enc, ...rest) => byteLength(str, toB64(enc), ...rest);

  // Decoding: feross's base64 decoder already accepts '-' and '_'.
  const from = Buffer.from;
  Buffer.from = function (value, encOrOffset, length) {
    return from.call(this, value, typeof value === 'string' ? toB64(encOrOffset) : encOrOffset, length);
  };

  const alloc = Buffer.alloc;
  Buffer.alloc = (size, fill, enc) => alloc(size, fill, toB64(enc));

  const toString = proto.toString;
  proto.toString = function (enc, start, end) {
    if (isB64Url(enc)) return b64ToUrl(toString.call(this, 'base64', start, end));
    return toString.apply(this, arguments);
  };

  // write(string[, offset[, length]][, encoding])
  const write = proto.write;
  proto.write = function (string, ...args) {
    for (let i = 0; i < args.length; i++) if (isB64Url(args[i])) args[i] = 'base64';
    return write.call(this, string, ...args);
  };

  const fill = proto.fill;
  proto.fill = function (val, ...args) {
    for (let i = 0; i < args.length; i++) if (isB64Url(args[i])) args[i] = 'base64';
    return fill.call(this, val, ...args);
  };

  // Node >= 19.8
  if (!Buffer.copyBytesFrom) {
    Buffer.copyBytesFrom = (view, offset = 0, length) => {
      const bytes = new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
      const size = view.BYTES_PER_ELEMENT || 1;
      const end = length === undefined ? view.length : offset + length;
      return Buffer.from(bytes.slice(offset * size, end * size));
    };
  }
}

const utf8Strict = typeof TextDecoder === 'function' ? new TextDecoder('utf-8', { fatal: true }) : null;

export function isUtf8(input) {
  if (!utf8Strict) return true;
  try { utf8Strict.decode(input); return true; } catch { return false; }
}

export function isAscii(input) {
  const bytes = input instanceof ArrayBuffer ? new Uint8Array(input) : new Uint8Array(input.buffer, input.byteOffset, input.byteLength);
  for (let i = 0; i < bytes.length; i++) if (bytes[i] > 0x7f) return false;
  return true;
}

export function transcode() {
  throw new Error('buffer.transcode is not available in the browser runtime');
}

export const Blob = globalThis.Blob;
export const File = globalThis.File;
export const atob = globalThis.atob;
export const btoa = globalThis.btoa;
export const resolveObjectURL = () => undefined;

const buffer = {
  Buffer, SlowBuffer, INSPECT_MAX_BYTES, kMaxLength, kStringMaxLength, constants,
  isUtf8, isAscii, transcode, Blob, File, atob, btoa, resolveObjectURL,
};
export default buffer;
