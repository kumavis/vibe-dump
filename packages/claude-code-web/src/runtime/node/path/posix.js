// node:path/posix
import { posix } from '../path.js';

export const {
  sep, delimiter, basename, dirname, extname, format, isAbsolute, join, normalize, parse,
  resolve, relative, toNamespacedPath, matchesGlob, win32, _makeLong,
} = posix;
export { posix };
export default posix;
