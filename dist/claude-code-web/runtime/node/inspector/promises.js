// node:inspector/promises
import { Session as CbSession, url, open, close, waitForDebugger, console, Network } from '../inspector.js';

export class Session extends CbSession {
  post(method, params) { return new Promise((resolve, reject) => super.post(method, params, (err, r) => (err ? reject(err) : resolve(r)))); }
}
export { url, open, close, waitForDebugger, console, Network };
export default { Session, url, open, close, waitForDebugger, console, Network };
