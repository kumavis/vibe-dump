// node:http2 — not available over fetch. connect() returns a session that
// errors asynchronously; servers never listen. `constants` is Node's table
// subset the bundle reads.
import EventEmitter from './events.js';
import { Server } from './internal/http.js';
import { systemError, unsupported } from './internal/errors.js';

export const constants = {
  NGHTTP2_SESSION_SERVER: 0, NGHTTP2_SESSION_CLIENT: 1, NGHTTP2_NO_ERROR: 0, NGHTTP2_PROTOCOL_ERROR: 1,
  NGHTTP2_INTERNAL_ERROR: 2, NGHTTP2_CANCEL: 8, NGHTTP2_REFUSED_STREAM: 7,
  HTTP2_HEADER_STATUS: ':status', HTTP2_HEADER_METHOD: ':method', HTTP2_HEADER_AUTHORITY: ':authority',
  HTTP2_HEADER_SCHEME: ':scheme', HTTP2_HEADER_PATH: ':path', HTTP2_HEADER_PROTOCOL: ':protocol',
  HTTP2_HEADER_CONTENT_TYPE: 'content-type', HTTP2_HEADER_CONTENT_LENGTH: 'content-length',
  HTTP2_HEADER_AUTHORIZATION: 'authorization', HTTP2_HEADER_USER_AGENT: 'user-agent',
  HTTP2_HEADER_ACCEPT: 'accept', HTTP2_HEADER_TE: 'te', HTTP2_HEADER_CONTENT_ENCODING: 'content-encoding',
  HTTP2_HEADER_ACCEPT_ENCODING: 'accept-encoding', HTTP2_HEADER_GRPC_STATUS: 'grpc-status',
  HTTP2_HEADER_GRPC_MESSAGE: 'grpc-message', HTTP2_METHOD_GET: 'GET', HTTP2_METHOD_POST: 'POST',
  HTTP2_METHOD_PUT: 'PUT', HTTP2_METHOD_DELETE: 'DELETE', HTTP_STATUS_OK: 200, HTTP_STATUS_NO_CONTENT: 204,
  HTTP_STATUS_BAD_REQUEST: 400, HTTP_STATUS_UNAUTHORIZED: 401, HTTP_STATUS_NOT_FOUND: 404,
  HTTP_STATUS_INTERNAL_SERVER_ERROR: 500,
};

class ClientHttp2Session extends EventEmitter {
  constructor(authority) {
    super();
    this.closed = false;
    this.destroyed = false;
    this.connecting = true;
    queueMicrotask(() => {
      this.connecting = false;
      const err = systemError('ECONNREFUSED', 'connect', { message: `connect ECONNREFUSED ${authority} (http2 is not available in the browser runtime)` });
      if (this.listenerCount('error')) this.emit('error', err);
      this.destroy();
    });
  }
  request() { throw unsupported('http2 request'); }
  close(cb) { this.closed = true; if (cb) queueMicrotask(cb); this.emit('close'); }
  destroy() { if (this.destroyed) return; this.destroyed = true; this.closed = true; this.emit('close'); }
  ref() {}
  unref() {}
  setTimeout() {}
  ping(cb) { queueMicrotask(() => cb?.(unsupported('http2 ping'))); return false; }
}

export function connect(authority, options, listener) {
  return new ClientHttp2Session(String(authority));
}
export class Http2ServerRequest extends EventEmitter {}
export class Http2ServerResponse extends EventEmitter {}
export const createServer = (options, listener) => new Server(options, listener);
export const createSecureServer = createServer;
export const getDefaultSettings = () => ({ headerTableSize: 4096, enablePush: true, initialWindowSize: 65535, maxFrameSize: 16384, maxConcurrentStreams: 4294967295, maxHeaderListSize: 65535, enableConnectProtocol: false });
export const getPackedSettings = () => new Uint8Array(0);
export const getUnpackedSettings = () => ({});
export const sensitiveHeaders = Symbol('nodejs.http2.sensitiveHeaders');

export default {
  constants, connect, Http2ServerRequest, Http2ServerResponse, createServer, createSecureServer,
  getDefaultSettings, getPackedSettings, getUnpackedSettings, sensitiveHeaders,
};
