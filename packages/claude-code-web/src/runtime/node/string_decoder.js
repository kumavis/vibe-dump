// node:string_decoder — @jspm/core's port of Node's StringDecoder, which only
// accepts Buffers; Node also takes any TypedArray/DataView, so convert first.
import SD from '../jspm/string_decoder.js';
import { Buffer } from './buffer.js';

const toBuf = (b) => (b == null || typeof b === 'string' || Buffer.isBuffer(b) ? b
  : ArrayBuffer.isView(b) ? Buffer.from(b.buffer, b.byteOffset, b.byteLength) : Buffer.from(b));

export class StringDecoder extends SD.StringDecoder {
  write(buf) { return super.write(toBuf(buf)); }
  end(buf) { return super.end(toBuf(buf)); }
}
export default { StringDecoder };
