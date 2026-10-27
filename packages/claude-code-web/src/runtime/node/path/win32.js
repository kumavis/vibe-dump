// node:path/win32
import { win32 } from '../path.js';

export const {
  sep, delimiter, basename, dirname, extname, format, isAbsolute, join, normalize, parse,
  resolve, relative, toNamespacedPath, matchesGlob, posix, _makeLong,
} = win32;
export { win32 };
export default win32;
