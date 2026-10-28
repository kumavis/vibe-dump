// node:http — client over fetch (see ./internal/http.js), inert servers/agents.
import {
  METHODS, STATUS_CODES, Agent, ClientRequest, IncomingMessage, OutgoingMessage, ServerResponse,
  Server, createServer, maxHeaderSize, validateHeaderName, validateHeaderValue, setMaxIdleHTTPParsers,
  request as req, get as getReq,
} from './internal/http.js';

export {
  METHODS, STATUS_CODES, Agent, ClientRequest, IncomingMessage, OutgoingMessage, ServerResponse,
  Server, createServer, maxHeaderSize, validateHeaderName, validateHeaderValue, setMaxIdleHTTPParsers,
};

export const globalAgent = new Agent({ protocol: 'http:', defaultPort: 80 });
export const request = (input, options, cb) => req(input, options, cb, 'http:');
export const get = (input, options, cb) => getReq(input, options, cb, 'http:');

export default {
  METHODS, STATUS_CODES, Agent, ClientRequest, IncomingMessage, OutgoingMessage, ServerResponse,
  Server, createServer, maxHeaderSize, validateHeaderName, validateHeaderValue, setMaxIdleHTTPParsers,
  globalAgent, request, get,
};
