// node:assert/strict
import { strict } from '../assert.js';

export const {
  AssertionError, deepEqual, deepStrictEqual, doesNotReject, doesNotThrow, equal, fail, ifError,
  notDeepEqual, notDeepStrictEqual, notEqual, notStrictEqual, ok, rejects, strictEqual, throws,
} = strict;
export { strict };
export default strict;
