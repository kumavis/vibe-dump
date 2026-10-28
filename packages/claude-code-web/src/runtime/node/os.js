// node:os — a fixed linux/x64 machine. homedir()/userInfo() follow $HOME/$USER
// from the runtime's process.env (HOME=/home/user per ARCHITECTURE.md).
const env = () => globalThis.process?.env || {};

export const EOL = '\n';
export const devNull = '/dev/null';

const signals = {
  SIGHUP: 1, SIGINT: 2, SIGQUIT: 3, SIGILL: 4, SIGTRAP: 5, SIGABRT: 6, SIGIOT: 6, SIGBUS: 7,
  SIGFPE: 8, SIGKILL: 9, SIGUSR1: 10, SIGSEGV: 11, SIGUSR2: 12, SIGPIPE: 13, SIGALRM: 14,
  SIGTERM: 15, SIGCHLD: 17, SIGSTKFLT: 16, SIGCONT: 18, SIGSTOP: 19, SIGTSTP: 20, SIGTTIN: 21,
  SIGTTOU: 22, SIGURG: 23, SIGXCPU: 24, SIGXFSZ: 25, SIGVTALRM: 26, SIGPROF: 27, SIGWINCH: 28,
  SIGIO: 29, SIGPOLL: 29, SIGPWR: 30, SIGSYS: 31,
};
const errno = {
  E2BIG: 7, EACCES: 13, EADDRINUSE: 98, EADDRNOTAVAIL: 99, EAGAIN: 11, EBADF: 9, EBUSY: 16,
  ECANCELED: 125, ECONNABORTED: 103, ECONNREFUSED: 111, ECONNRESET: 104, EEXIST: 17,
  EHOSTUNREACH: 113, EINTR: 4, EINVAL: 22, EIO: 5, EISDIR: 21, ELOOP: 40, EMFILE: 24,
  ENAMETOOLONG: 36, ENETUNREACH: 101, ENOENT: 2, ENOMEM: 12, ENOSPC: 28, ENOSYS: 38,
  ENOTCONN: 107, ENOTDIR: 20, ENOTEMPTY: 39, ENOTSUP: 95, EPERM: 1, EPIPE: 32, ESRCH: 3,
  ETIMEDOUT: 110, EXDEV: 18,
};
const priority = { PRIORITY_LOW: 19, PRIORITY_BELOW_NORMAL: 10, PRIORITY_NORMAL: 0, PRIORITY_ABOVE_NORMAL: -7, PRIORITY_HIGH: -14, PRIORITY_HIGHEST: -20 };
export const constants = { signals, errno, priority, dlopen: { RTLD_LAZY: 1, RTLD_NOW: 2, RTLD_GLOBAL: 256, RTLD_LOCAL: 0 }, UV_UDP_REUSEADDR: 4 };

export const homedir = () => env().HOME || '/home/user';
export const tmpdir = () => (env().TMPDIR || '/tmp').replace(/(.)\/$/, '$1');
export const hostname = () => 'localhost';
export const platform = () => 'linux';
export const type = () => 'Linux';
export const arch = () => 'x64';
export const machine = () => 'x86_64';
export const release = () => '6.0.0-browser';
export const version = () => '#1 SMP browser';
export const endianness = () => 'LE';
export const uptime = () => Math.floor((typeof performance !== 'undefined' ? performance.now() : 0) / 1000);
export const loadavg = () => [0, 0, 0];
export const totalmem = () => (globalThis.navigator?.deviceMemory || 8) * 1024 ** 3;
export const freemem = () => Math.floor(totalmem() / 2);
export const availableParallelism = () => globalThis.navigator?.hardwareConcurrency || 4;
export const cpus = () => Array.from({ length: availableParallelism() }, () => ({
  model: 'browser', speed: 0, times: { user: 0, nice: 0, sys: 0, idle: 0, irq: 0 },
}));
export const networkInterfaces = () => ({});
export const getPriority = () => 0;
export const setPriority = () => {};
export function userInfo(options) {
  const e = env();
  const info = { uid: 1000, gid: 1000, username: e.USER || 'user', homedir: homedir(), shell: e.SHELL || null };
  if (options?.encoding === 'buffer') {
    const enc = new TextEncoder();
    return { ...info, username: enc.encode(info.username), homedir: enc.encode(info.homedir), shell: info.shell && enc.encode(info.shell) };
  }
  return info;
}

const os = {
  EOL, devNull, constants, homedir, tmpdir, hostname, platform, type, arch, machine, release,
  version, endianness, uptime, loadavg, totalmem, freemem, availableParallelism, cpus,
  networkInterfaces, getPriority, setPriority, userInfo,
};
export default os;
