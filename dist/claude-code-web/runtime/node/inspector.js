// node:inspector — no inspector in a page.
import EventEmitter from './events.js';

export class Session extends EventEmitter {
  connect() {}
  connectToMainThread() {}
  disconnect() {}
  post(method, params, cb) {
    const callback = typeof params === 'function' ? params : cb;
    const err = Object.assign(new Error('Inspector is not available in the browser runtime'), { code: 'ERR_INSPECTOR_NOT_AVAILABLE' });
    if (callback) queueMicrotask(() => callback(err));
  }
}
export const url = () => undefined;
export const open = () => ({ [Symbol.dispose ?? Symbol.for('Symbol.dispose')]() {} });
export const close = () => {};
export const waitForDebugger = () => { throw Object.assign(new Error('Inspector is not active'), { code: 'ERR_INSPECTOR_NOT_ACTIVE' }); };
export const console = globalThis.console;
export const Network = { requestWillBeSent() {}, responseReceived() {}, loadingFinished() {}, loadingFailed() {} };

export default { Session, url, open, close, waitForDebugger, console, Network };
