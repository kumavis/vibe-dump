// node:worker_threads — the shimmed process is the only thread. `Worker`
// throws (Claude Code's hooks worker is a non-goal for v1).
import EventEmitter from './events.js';
import { unsupported } from './internal/errors.js';

const g = globalThis;
export const isMainThread = true;
export const isInternalThread = false;
export const parentPort = null;
export const workerData = null;
export const threadId = 0;
export const resourceLimits = {};
export const SHARE_ENV = Symbol.for('nodejs.worker_threads.SHARE_ENV');
export const MessageChannel = g.MessageChannel;
export const MessagePort = g.MessagePort;
export const BroadcastChannel = g.BroadcastChannel;
export const markAsUntransferable = () => {};
export const isMarkedAsUntransferable = () => false;
export const markAsUncloneable = () => {};
export const moveMessagePortToContext = (port) => port;
export const receiveMessageOnPort = () => undefined;
const envData = new Map();
export const getEnvironmentData = (k) => envData.get(k);
export const setEnvironmentData = (k, v) => { if (v === undefined) envData.delete(k); else envData.set(k, v); };
export const postMessageToThread = () => Promise.reject(unsupported('worker_threads.postMessageToThread'));

export class Worker extends EventEmitter {
  constructor() { super(); throw unsupported('worker_threads.Worker'); }
}

export default {
  isMainThread, isInternalThread, parentPort, workerData, threadId, resourceLimits, SHARE_ENV,
  MessageChannel, MessagePort, BroadcastChannel, markAsUntransferable, isMarkedAsUntransferable,
  markAsUncloneable, moveMessagePortToContext, receiveMessageOnPort, getEnvironmentData,
  setEnvironmentData, postMessageToThread, Worker,
};
