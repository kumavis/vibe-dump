// node:fs/promises — the memfs volume's promise API (see ../fs.js).
import { promises as p } from '../fs.js';

// Some memfs methods live on the prototype; bind everything so destructured
// imports (`import { readFile } from "fs/promises"`) keep their receiver.
const bind = (name) => (...args) => p[name](...args);

export const access = bind('access');
export const appendFile = bind('appendFile');
export const chmod = bind('chmod');
export const chown = bind('chown');
export const copyFile = bind('copyFile');
export const cp = bind('cp');
export const glob = bind('glob');
export const lchmod = bind('lchmod');
export const lchown = bind('lchown');
export const link = bind('link');
export const lstat = bind('lstat');
export const lutimes = bind('lutimes');
export const mkdir = bind('mkdir');
export const mkdtemp = bind('mkdtemp');
export const open = bind('open');
export const opendir = bind('opendir');
export const readFile = bind('readFile');
export const readdir = bind('readdir');
export const readlink = bind('readlink');
export const realpath = bind('realpath');
export const rename = bind('rename');
export const rm = bind('rm');
export const rmdir = bind('rmdir');
export const stat = bind('stat');
export const statfs = bind('statfs');
export const symlink = bind('symlink');
export const truncate = bind('truncate');
export const unlink = bind('unlink');
export const utimes = bind('utimes');
export const watch = bind('watch');
export const writeFile = bind('writeFile');
export const constants = p.constants;
export const FileHandle = p.FileHandle;

export default p;
