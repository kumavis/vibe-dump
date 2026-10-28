// node:v8 — heap figures from performance.memory when the browser exposes it;
// serialize/deserialize via structuredClone-compatible JSON-ish encoding.
import { Buffer } from './buffer.js';

const mem = () => (typeof performance !== 'undefined' && performance.memory) || null;

export function getHeapStatistics() {
  const m = mem();
  const used = m?.usedJSHeapSize ?? 64e6;
  const total = m?.totalJSHeapSize ?? 128e6;
  const limit = m?.jsHeapSizeLimit ?? 4 * 1024 ** 3;
  return {
    total_heap_size: total, total_heap_size_executable: 0, total_physical_size: total,
    total_available_size: limit - used, used_heap_size: used, heap_size_limit: limit,
    malloced_memory: 0, peak_malloced_memory: 0, does_zap_garbage: 0, number_of_native_contexts: 1,
    number_of_detached_contexts: 0, total_global_handles_size: 0, used_global_handles_size: 0,
    external_memory: 0,
  };
}
export const getHeapSpaceStatistics = () => [];
export const getHeapCodeStatistics = () => ({ code_and_metadata_size: 0, bytecode_and_metadata_size: 0, external_script_source_size: 0, cpu_profiler_metadata_size: 0 });
export const cachedDataVersionTag = () => 0;
export const setFlagsFromString = () => {};
export const setHeapSnapshotNearHeapLimit = () => {};
export function writeHeapSnapshot() { throw new Error('v8.writeHeapSnapshot is not available in the browser runtime'); }
export function getHeapSnapshot() { throw new Error('v8.getHeapSnapshot is not available in the browser runtime'); }
export const isStringOneByteRepresentation = (s) => !/[^\u0000-ÿ]/.test(s);
export const startupSnapshot = { isBuildingSnapshot: () => false, addSerializeCallback() {}, addDeserializeCallback() {}, setDeserializeMainFunction() {} };
export const promiseHooks = { onInit: () => () => {}, onSettled: () => () => {}, onBefore: () => () => {}, onAfter: () => () => {}, createHook: () => () => {} };

export class GCProfiler {
  start() {}
  stop() { return { version: 1, startTime: 0, endTime: 0, statistics: [] }; }
}

// Not V8's wire format; round-trips JSON-able values, Buffers and Dates.
export function serialize(value) {
  return Buffer.from(JSON.stringify(value, (k, v) => (v && v.type === 'Buffer' && Array.isArray(v.data) ? { __b: v.data } : v instanceof Date ? { __d: v.toISOString() } : v)));
}
export function deserialize(buf) {
  return JSON.parse(Buffer.from(buf).toString(), (k, v) => (v && v.__b ? Buffer.from(v.__b) : v && v.__d ? new Date(v.__d) : v));
}
export class Serializer { constructor() { this._v = []; } writeHeader() {} writeValue(v) { this._v.push(v); } releaseBuffer() { return serialize(this._v.length === 1 ? this._v[0] : this._v); } }
export class Deserializer { constructor(buf) { this._buf = buf; } readHeader() { return true; } readValue() { return deserialize(this._buf); } }
export const DefaultSerializer = Serializer;
export const DefaultDeserializer = Deserializer;

export default {
  getHeapStatistics, getHeapSpaceStatistics, getHeapCodeStatistics, cachedDataVersionTag,
  setFlagsFromString, setHeapSnapshotNearHeapLimit, writeHeapSnapshot, getHeapSnapshot,
  isStringOneByteRepresentation, startupSnapshot, promiseHooks, GCProfiler, serialize, deserialize,
  Serializer, Deserializer, DefaultSerializer, DefaultDeserializer,
};
