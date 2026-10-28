// node:stream — @jspm/core's readable-stream v4 build, re-exported with the
// named exports jspm only hangs off the default object.
import S from '../jspm/stream.js';

export const Readable = S.Readable;
export const Writable = S.Writable;
export const Duplex = S.Duplex;
export const Transform = S.Transform;
export const PassThrough = S.PassThrough;
export const Stream = S.Stream;
export const finished = S.finished;
export const pipeline = S.pipeline;
export const addAbortSignal = S.addAbortSignal;
export const compose = S.compose;
export const destroy = S.destroy;
export const isDisturbed = S.isDisturbed;
export const isErrored = S.isErrored;
export const isReadable = S.isReadable;
export const isWritable = (s) => !!s && s.writable !== false && !s.destroyed && !s.writableEnded;
export const isDestroyed = (s) => !!s?.destroyed;

let defaultHWM = 16 * 1024;
export const getDefaultHighWaterMark = (objectMode) => (objectMode ? 16 : defaultHWM);
export const setDefaultHighWaterMark = (objectMode, value) => { if (!objectMode) defaultHWM = value; };

// Node >= 22.6: a connected pair of Duplex streams.
export function duplexPair(options) {
  let a, b;
  const make = () => new Duplex({
    ...options,
    read() {},
    write(chunk, enc, cb) { (this === a ? b : a).push(chunk); cb(); },
    final(cb) { (this === a ? b : a).push(null); cb(); },
  });
  a = make();
  b = make();
  return [a, b];
}

// stream.promises (also served as node:stream/promises)
export const promises = {
  pipeline(...streams) {
    let options = {};
    const last = streams[streams.length - 1];
    if (last && typeof last === 'object' && !last.pipe && !last.write && !last[Symbol.asyncIterator] && typeof last !== 'function') {
      options = streams.pop();
    }
    return new Promise((resolve, reject) => {
      const p = pipeline(...streams, (err, value) => (err ? reject(err) : resolve(value)));
      if (options.signal) addAbortSignal(options.signal, p);
    });
  },
  finished(stream, options = {}) {
    return new Promise((resolve, reject) => {
      finished(stream, options, (err) => (err ? reject(err) : resolve()));
    });
  },
};
// Node attaches these to the Stream constructor as well (require('stream').Readable
// === Stream.Readable). jspm already defines some (some as getters): keep those.
const statics = {
  Readable, Writable, Duplex, Transform, PassThrough, Stream, finished, pipeline,
  addAbortSignal, compose, destroy, isDisturbed, isErrored, isReadable, isWritable,
  isDestroyed, getDefaultHighWaterMark, setDefaultHighWaterMark, duplexPair, promises,
};
for (const [k, v] of Object.entries(statics)) {
  if (!(k in Stream)) Object.defineProperty(Stream, k, { value: v, writable: true, configurable: true, enumerable: true });
}

export default Stream;
