// The kill-switch flags (ARCHITECTURE.md "Policy posture"), shared by the
// page (src/host/invocation.js buildEnv, via src/host/constants.js) and the
// Worker (boot.js), so the two can never drift apart. Plain ESM with no
// imports: the Worker loads it as is from runtime/boot/policy.js.

/** Always set, never overridable from settings or from the boot message. */
export const POLICY_ENV = Object.freeze({
  CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC: '1',
  DISABLE_TELEMETRY: '1',
  DISABLE_ERROR_REPORTING: '1',
  DISABLE_AUTOUPDATER: '1'
})

/**
 * The process environment the Worker runs the CLI with: whatever the boot
 * message carried, with the policy flags merged in last (defence in depth:
 * a page that builds a Harness with its own env cannot drop them).
 */
export function workerEnv (env) {
  return { ...(env || {}), ...POLICY_ENV }
}
