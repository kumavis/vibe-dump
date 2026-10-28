// Uncaught errors inside the Worker that the CLI did not handle itself:
// report each one to the page once, and keep running (a Node process would
// die; the page decides via the stream-json result).
//
// preventDefault() after posting matters: an unhandled 'error' on the Worker
// global is otherwise re-dispatched on the page's Worker object as well, and
// the page would show every error twice.

/**
 * @param {EventTarget} target       the Worker global (self)
 * @param {object} o
 * @param {(msg: object) => void} o.post   posts {type: 'error', message, stack} to the page
 * @param {(err: unknown) => boolean} [o.isExit]  true for the process.exit() sentinel (not an error)
 */
export function reportUncaught (target, { post, isExit = () => false }) {
  target.addEventListener('error', (ev) => {
    if (isExit(ev.error) || ev.defaultPrevented) return
    post({ type: 'error', message: String(ev.error?.message ?? ev.message), stack: ev.error?.stack })
    ev.preventDefault()
  })
  target.addEventListener('unhandledrejection', (ev) => {
    if (isExit(ev.reason) || ev.defaultPrevented) return
    ev.preventDefault()
    post({ type: 'error', message: `unhandled rejection: ${ev.reason?.message ?? ev.reason}`, stack: ev.reason?.stack })
  })
}
