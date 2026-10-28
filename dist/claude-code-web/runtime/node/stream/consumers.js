// node:stream/consumers — written here because jspm's copy has a TDZ bug in blob().
import { Buffer } from '../buffer.js';

async function collect(stream) {
  const chunks = [];
  if (stream && typeof stream.getReader === 'function' && !stream[Symbol.asyncIterator]) {
    const reader = stream.getReader();
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
  } else {
    for await (const chunk of stream) chunks.push(chunk);
  }
  return chunks.map((c) => (typeof c === 'string' ? Buffer.from(c) : Buffer.from(c.buffer ? new Uint8Array(c.buffer, c.byteOffset, c.byteLength) : c)));
}

export async function buffer(stream) { return Buffer.concat(await collect(stream)); }
export async function arrayBuffer(stream) {
  const b = await buffer(stream);
  return b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength);
}
export async function text(stream) { return new TextDecoder().decode(await buffer(stream)); }
export async function json(stream) { return JSON.parse(await text(stream)); }
export async function blob(stream) { return new Blob(await collect(stream)); }

export default { buffer, arrayBuffer, text, json, blob };
