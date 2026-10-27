// node:constants (deprecated) — the union of os.constants.errno/signals/priority,
// fs.constants and crypto.constants, as Node exports it.
import { constants as osConstants } from './os.js';
import fs from './fs.js';
import { constants as cryptoConstants } from './crypto.js';

const constants = {
  ...osConstants.errno,
  ...osConstants.signals,
  ...osConstants.priority,
  ...fs.constants,
  ...cryptoConstants,
  // Linux has no O_SYMLINK; Node's constants module leaves it undefined there.
};
export default constants;
export const {
  O_RDONLY, O_WRONLY, O_RDWR, O_CREAT, O_EXCL, O_NOCTTY, O_TRUNC, O_APPEND, O_DIRECTORY, O_NOFOLLOW,
  O_SYNC, O_DSYNC, O_SYMLINK, O_DIRECT, O_NONBLOCK, S_IFMT, S_IFREG, S_IFDIR, S_IFCHR, S_IFBLK,
  S_IFIFO, S_IFLNK, S_IFSOCK, S_IRWXU, S_IRUSR, S_IWUSR, S_IXUSR, S_IRWXG, S_IRGRP, S_IWGRP, S_IXGRP,
  S_IRWXO, S_IROTH, S_IWOTH, S_IXOTH, F_OK, R_OK, W_OK, X_OK, UV_FS_COPYFILE_EXCL, COPYFILE_EXCL,
  SIGINT, SIGTERM, SIGKILL, SIGHUP, ENOENT, EEXIST, EACCES, EPERM,
} = constants;
