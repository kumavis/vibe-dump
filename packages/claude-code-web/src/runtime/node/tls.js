// node:tls — TLS is the browser's job (fetch/WebSocket). Connections fail like
// net's; contexts and certificate helpers are inert.
import { Socket, Server } from './net.js';
import { unsupported } from './internal/errors.js';
import { ROOT_CERTIFICATES } from './internal/root-certificates.js';

export class TLSSocket extends Socket {
  constructor(socket, options = {}) {
    super(options);
    this.encrypted = true;
    this.authorized = false;
    this.authorizationError = null;
    this.alpnProtocol = false;
  }
  getPeerCertificate() { return {}; }
  getCertificate() { return {}; }
  getProtocol() { return null; }
  getCipher() { return null; }
  getSession() { return undefined; }
  setServername() {}
  renegotiate(opts, cb) { queueMicrotask(() => cb?.(unsupported('tls renegotiation'))); return false; }
}

export function connect(...args) {
  const opts = typeof args[0] === 'object' ? args[0] : { port: args[0], host: args[1] };
  return new TLSSocket(null, opts).connect({ port: opts.port, host: opts.host || opts.servername || 'localhost' }, args.find((a) => typeof a === 'function'));
}

export function createSecureContext(options = {}) { return { context: {}, options }; }
export class SecureContext {}
export const checkServerIdentity = () => undefined;
// See internal/root-certificates.js: the browser verifies TLS itself.
export const rootCertificates = ROOT_CERTIFICATES;
export const getCiphers = () => ['tls_aes_128_gcm_sha256', 'tls_aes_256_gcm_sha384', 'tls_chacha20_poly1305_sha256'];
// 'default'/'bundled' mirror rootCertificates; there is no readable system or extra store.
export const getCACertificates = (type = 'default') => (type === 'default' || type === 'bundled' ? [...ROOT_CERTIFICATES] : []);
export const setDefaultCACertificates = () => {};
export const DEFAULT_ECDH_CURVE = 'auto';
export const DEFAULT_MIN_VERSION = 'TLSv1.2';
export const DEFAULT_MAX_VERSION = 'TLSv1.3';
export const DEFAULT_CIPHERS = getCiphers().join(':');
export { Server };
export const createServer = (options, listener) => new Server(options, listener);
export const convertALPNProtocols = () => {};

export default {
  TLSSocket, connect, createSecureContext, SecureContext, checkServerIdentity, rootCertificates,
  getCiphers, getCACertificates, setDefaultCACertificates, DEFAULT_ECDH_CURVE, DEFAULT_MIN_VERSION,
  DEFAULT_MAX_VERSION, DEFAULT_CIPHERS, Server, createServer, convertALPNProtocols,
};
