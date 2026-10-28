// node:https — same fetch-backed client as ./http.js with an https: default.
import { Agent as HttpAgent, Server, createServer, request as req, get as getReq } from './internal/http.js';

export class Agent extends HttpAgent {
  constructor(options = {}) { super({ protocol: 'https:', defaultPort: 443, ...options }); }
}
export { Server, createServer };
export const globalAgent = new Agent();
export const request = (input, options, cb) => req(input, options, cb, 'https:');
export const get = (input, options, cb) => getReq(input, options, cb, 'https:');

export default { Agent, Server, createServer, globalAgent, request, get };
