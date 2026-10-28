// node:crypto — synchronous hashing via @noble/hashes (WebCrypto's digest is
// async-only, and the bundle hashes synchronously in hundreds of places),
// randomness via crypto.getRandomValues. Asymmetric keys, ciphers and X.509
// are not available: their entry points exist so modules link, and throw
// ERR_FEATURE_UNAVAILABLE_ON_PLATFORM when called.
import * as V from '../vendor.js';
import { Buffer } from './buffer.js';
import { nodeError, unsupported } from './internal/errors.js';

const web = globalThis.crypto;

// Resolved lazily: vendor.js and this module can be mid-evaluation in a cycle.
function hashFn(algorithm) {
  const name = String(algorithm).toLowerCase().replace(/^rsa-/, '').replace(/^sha2-/, 'sha').replace(/^sha-(\d)/, 'sha$1');
  const table = {
    md5: V.md5, sha1: V.sha1, sha224: V.sha224, sha256: V.sha256, sha384: V.sha384,
    sha512: V.sha512, 'sha512-224': V.sha512_224, 'sha512-256': V.sha512_256,
    'sha3-256': V.sha3_256, 'sha3-512': V.sha3_512, ripemd160: V.ripemd160, rmd160: V.ripemd160,
  };
  const fn = table[name];
  if (!fn) throw nodeError('ERR_OSSL_EVP_UNSUPPORTED', `Digest method not supported: ${algorithm}`);
  return fn;
}

function toBytes(data, encoding, what = 'data') {
  if (typeof data === 'string') return Buffer.from(data, encoding || 'utf8');
  if (data instanceof ArrayBuffer) return new Uint8Array(data);
  if (ArrayBuffer.isView(data)) return new Uint8Array(data.buffer, data.byteOffset, data.byteLength);
  if (data && data.type === 'secret' && data._bytes) return data._bytes; // KeyObject
  throw nodeError('ERR_INVALID_ARG_TYPE', `The "${what}" argument must be of type string or an instance of Buffer, TypedArray, or DataView.`, TypeError);
}

function output(bytes, encoding) {
  const buf = Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return encoding && encoding !== 'buffer' ? buf.toString(encoding) : buf;
}

export class Hash {
  constructor(algorithm, options, state) {
    this._alg = algorithm;
    this._h = state || hashFn(algorithm).create();
    this._done = false;
  }
  update(data, inputEncoding) {
    if (this._done) throw nodeError('ERR_CRYPTO_HASH_FINALIZED', 'Digest already called');
    this._h.update(toBytes(data, inputEncoding));
    return this;
  }
  digest(encoding) {
    if (this._done) throw nodeError('ERR_CRYPTO_HASH_FINALIZED', 'Digest already called');
    this._done = true;
    return output(this._h.digest(), encoding);
  }
  copy() {
    if (this._done) throw nodeError('ERR_CRYPTO_HASH_FINALIZED', 'Digest already called');
    return new Hash(this._alg, undefined, this._h.clone());
  }
}

export class Hmac {
  constructor(algorithm, key) {
    this._h = V.hmac.create(hashFn(algorithm), toBytes(key, undefined, 'key'));
    this._done = false;
  }
  update(data, inputEncoding) {
    if (this._done) throw nodeError('ERR_CRYPTO_HASH_FINALIZED', 'Digest already called');
    this._h.update(toBytes(data, inputEncoding));
    return this;
  }
  digest(encoding) {
    if (this._done) throw nodeError('ERR_CRYPTO_HASH_FINALIZED', 'Digest already called');
    this._done = true;
    return output(this._h.digest(), encoding);
  }
}

export const createHash = (algorithm, options) => new Hash(algorithm, options);
export const createHmac = (algorithm, key) => new Hmac(algorithm, key);

// crypto.hash(algorithm, data[, outputEncoding = 'hex']) — Node >= 21.7
export function hash(algorithm, data, outputEncoding = 'hex') {
  return output(hashFn(algorithm)(toBytes(data)), outputEncoding);
}

export function getHashes() {
  return ['md5', 'ripemd160', 'rmd160', 'sha1', 'sha224', 'sha256', 'sha3-256', 'sha3-512', 'sha384', 'sha512', 'sha512-224', 'sha512-256'];
}
export const getCiphers = () => [];
export const getCurves = () => [];

// --- randomness ------------------------------------------------------------
export function randomFillSync(buf, offset = 0, size) {
  const view = buf instanceof ArrayBuffer ? new Uint8Array(buf) : new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  const end = size === undefined ? view.length : offset + size;
  for (let o = offset; o < end; o += 65536) web.getRandomValues(view.subarray(o, Math.min(end, o + 65536)));
  return buf;
}

export function randomFill(buf, offset, size, cb) {
  const callback = [offset, size, cb].find((f) => typeof f === 'function');
  const o = typeof offset === 'number' ? offset : 0;
  const s = typeof size === 'number' ? size : undefined;
  queueMicrotask(() => { try { callback(null, randomFillSync(buf, o, s)); } catch (e) { callback(e); } });
}

export function randomBytes(size, cb) {
  const buf = randomFillSync(Buffer.alloc(size));
  if (typeof cb === 'function') { queueMicrotask(() => cb(null, buf)); return undefined; }
  return buf;
}
export const pseudoRandomBytes = randomBytes;
export const prng = randomBytes;
export const rng = randomBytes;

// randomInt([min, ]max[, cb]) — unbiased by rejection sampling.
export function randomInt(min, max, cb) {
  if (typeof max !== 'number') { cb = max; max = min; min = 0; }
  const range = max - min;
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max) || range <= 0 || range > 2 ** 48) {
    throw nodeError('ERR_OUT_OF_RANGE', `The value of "max" is out of range. It must be greater than the value of "min" (${min}). Received ${max}`, RangeError);
  }
  const limit = 2 ** 48 - (2 ** 48 % range);
  const b = new Uint8Array(6);
  let x;
  do { web.getRandomValues(b); x = b.reduce((acc, v) => acc * 256 + v, 0); } while (x >= limit);
  const n = min + (x % range);
  if (typeof cb === 'function') { queueMicrotask(() => cb(null, n)); return undefined; }
  return n;
}

export function randomUUID() {
  if (typeof web.randomUUID === 'function') return web.randomUUID();
  const b = randomFillSync(new Uint8Array(16));
  b[6] = (b[6] & 0x0f) | 0x40;
  b[8] = (b[8] & 0x3f) | 0x80;
  const h = [...b].map((x) => x.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

export const getRandomValues = (arr) => web.getRandomValues(arr);

export function timingSafeEqual(a, b) {
  const x = toBytes(a, undefined, 'buf1');
  const y = toBytes(b, undefined, 'buf2');
  if (x.byteLength !== y.byteLength) throw nodeError('ERR_CRYPTO_TIMING_SAFE_EQUAL_LENGTH', 'Input buffers must have the same byte length', RangeError);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

// --- key derivation ----------------------------------------------------------
export function pbkdf2Sync(password, salt, iterations, keylen, digest) {
  return output(V.pbkdf2(hashFn(digest), toBytes(password), toBytes(salt), { c: iterations, dkLen: keylen }));
}
export function pbkdf2(password, salt, iterations, keylen, digest, cb) {
  queueMicrotask(() => { try { cb(null, pbkdf2Sync(password, salt, iterations, keylen, digest)); } catch (e) { cb(e); } });
}

export function scryptSync(password, salt, keylen, options = {}) {
  const N = options.N ?? options.cost ?? 16384;
  const r = options.r ?? options.blockSize ?? 8;
  const p = options.p ?? options.parallelization ?? 1;
  return output(V.scrypt(toBytes(password), toBytes(salt), { N, r, p, dkLen: keylen, maxmem: options.maxmem ?? 2 ** 32 }));
}
export function scrypt(password, salt, keylen, options, cb) {
  const callback = typeof options === 'function' ? options : cb;
  const opts = typeof options === 'object' ? options : {};
  queueMicrotask(() => { try { callback(null, scryptSync(password, salt, keylen, opts)); } catch (e) { callback(e); } });
}

export function hkdfSync(digest, ikm, salt, info, keylen) {
  const out = V.hkdf(hashFn(digest), toBytes(ikm), toBytes(salt), toBytes(info), keylen);
  return out.buffer.slice(out.byteOffset, out.byteOffset + out.byteLength);
}
export function hkdf(digest, ikm, salt, info, keylen, cb) {
  queueMicrotask(() => { try { cb(null, hkdfSync(digest, ikm, salt, info, keylen)); } catch (e) { cb(e); } });
}

// --- keys (secret keys only) --------------------------------------------------
export class KeyObject {
  constructor(type, bytes) {
    this.type = type;
    this._bytes = bytes;
  }
  get symmetricKeySize() { return this.type === 'secret' ? this._bytes.byteLength : undefined; }
  get asymmetricKeyType() { return undefined; }
  export(options) {
    if (this.type !== 'secret') throw unsupported('KeyObject.export');
    if (options?.format === 'jwk') return { kty: 'oct', k: Buffer.from(this._bytes).toString('base64url') };
    return Buffer.from(this._bytes);
  }
  equals(other) { return other instanceof KeyObject && other.type === this.type && timingSafeEqual(this._bytes, other._bytes); }
  static from() { throw unsupported('KeyObject.from(CryptoKey)'); }
}

export function createSecretKey(key, encoding) {
  return new KeyObject('secret', Uint8Array.from(toBytes(key, encoding, 'key')));
}

const unavailable = (name) => function () { throw unsupported(`crypto.${name}`); };
export const createPrivateKey = unavailable('createPrivateKey');
export const createPublicKey = unavailable('createPublicKey');
export const generateKeyPairSync = unavailable('generateKeyPairSync');
export const generateKeySync = unavailable('generateKeySync');
export const createSign = unavailable('createSign');
export const createVerify = unavailable('createVerify');
export const sign = unavailable('sign');
export const verify = unavailable('verify');
export const createCipheriv = unavailable('createCipheriv');
export const createDecipheriv = unavailable('createDecipheriv');
export const createDiffieHellman = unavailable('createDiffieHellman');
export const createDiffieHellmanGroup = unavailable('createDiffieHellmanGroup');
export const getDiffieHellman = unavailable('getDiffieHellman');
export const createECDH = unavailable('createECDH');
export const diffieHellman = unavailable('diffieHellman');
export const publicEncrypt = unavailable('publicEncrypt');
export const publicDecrypt = unavailable('publicDecrypt');
export const privateEncrypt = unavailable('privateEncrypt');
export const privateDecrypt = unavailable('privateDecrypt');
export function generateKeyPair(type, options, cb) {
  queueMicrotask(() => cb(unsupported('crypto.generateKeyPair')));
}
export function generateKey(type, options, cb) {
  queueMicrotask(() => cb(unsupported('crypto.generateKey')));
}

export class X509Certificate {
  constructor() { throw unsupported('crypto.X509Certificate'); }
}
export class Certificate {
  static exportChallenge() { throw unsupported('crypto.Certificate'); }
  static exportPublicKey() { throw unsupported('crypto.Certificate'); }
  static verifySpkac() { return false; }
}

export const constants = {
  OPENSSL_VERSION_NUMBER: 0, SSL_OP_ALL: 2147485776, SSL_OP_NO_SSLv2: 0, SSL_OP_NO_SSLv3: 33554432,
  SSL_OP_NO_TLSv1: 67108864, SSL_OP_NO_TLSv1_1: 268435456, SSL_OP_NO_TLSv1_2: 134217728,
  RSA_PKCS1_PADDING: 1, RSA_NO_PADDING: 3, RSA_PKCS1_OAEP_PADDING: 4, RSA_X931_PADDING: 5,
  RSA_PKCS1_PSS_PADDING: 6, RSA_PSS_SALTLEN_DIGEST: -1, RSA_PSS_SALTLEN_MAX_SIGN: -2,
  RSA_PSS_SALTLEN_AUTO: -2, POINT_CONVERSION_COMPRESSED: 2, POINT_CONVERSION_UNCOMPRESSED: 4,
  POINT_CONVERSION_HYBRID: 6, defaultCoreCipherList: '', defaultCipherList: '',
};

export const webcrypto = web;
export const subtle = web?.subtle;
export const getFips = () => 0;
export const setFips = () => {};
export const setEngine = () => {};
export const secureHeapUsed = () => ({ total: 0, min: 0, used: 0, utilization: 0 });

const crypto = {
  Hash, Hmac, createHash, createHmac, hash, getHashes, getCiphers, getCurves, randomFillSync,
  randomFill, randomBytes, pseudoRandomBytes, prng, rng, randomInt, randomUUID, getRandomValues,
  timingSafeEqual, pbkdf2Sync, pbkdf2, scryptSync, scrypt, hkdfSync, hkdf, KeyObject,
  createSecretKey, createPrivateKey, createPublicKey, generateKeyPairSync, generateKeySync,
  generateKeyPair, generateKey, createSign, createVerify, sign, verify, createCipheriv,
  createDecipheriv, createDiffieHellman, createDiffieHellmanGroup, getDiffieHellman, createECDH,
  diffieHellman, publicEncrypt, publicDecrypt, privateEncrypt, privateDecrypt, X509Certificate,
  Certificate, constants, webcrypto, subtle, getFips, setFips, setEngine, secureHeapUsed,
};
export default crypto;
