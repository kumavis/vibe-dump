// `undici` — Bun ships it as a built-in and the bundle requires it for proxy
// dispatchers. In a page, fetch is the platform's; dispatchers are inert.
import EventEmitter from './events.js';

const g = globalThis;
export class Dispatcher extends EventEmitter {
  constructor(options = {}) { super(); this.options = options; }
  dispatch() { return false; }
  close(cb) { if (cb) queueMicrotask(cb); return Promise.resolve(); }
  destroy(err, cb) { const c = typeof err === 'function' ? err : cb; if (c) queueMicrotask(c); return Promise.resolve(); }
  compose() { return this; }
}
export class Agent extends Dispatcher {}
export class Pool extends Dispatcher {}
export class Client extends Dispatcher {}
export class ProxyAgent extends Dispatcher {}
export class EnvHttpProxyAgent extends Dispatcher {}
export class RetryAgent extends Dispatcher {}
export class MockAgent extends Dispatcher {}

let dispatcher = new Agent();
export const setGlobalDispatcher = (d) => { dispatcher = d; };
export const getGlobalDispatcher = () => dispatcher;

export const fetch = (...args) => g.fetch(...args);
export const Headers = g.Headers;
export const Request = g.Request;
export const Response = g.Response;
export const FormData = g.FormData;
export const File = g.File;
export const WebSocket = g.WebSocket;
export const EventSource = g.EventSource;

export default {
  Dispatcher, Agent, Pool, Client, ProxyAgent, EnvHttpProxyAgent, RetryAgent, MockAgent,
  setGlobalDispatcher, getGlobalDispatcher, fetch, Headers, Request, Response, FormData, File,
  WebSocket, EventSource,
};
