// The net badge (DESIGN §2.7, N2): how an online match's page stands with
// the others, under the HUD while a match is followed. "online · 2
// watching" (the sync server reached), "reconnecting" (not, while the
// browser is online), "offline · your moves will sync" (the browser
// offline: what this page writes waits in its document); and, when a
// peer's presence says it stands on this page's head with another hash,
// "out of step with Ann" (net/presence.js: the only cross-check a match
// with no human seat has). ((V3b) In the top-left corner on every screen,
// one line that stops short of the HUD (style.css's #netbadge: the top
// row's table), its text cut with … past that and whole in its title; on a
// phone the HUD and all under it step down a line while it shows.)
export class NetBadge {
  constructor(el) {
    this.el = el
  }

  // { link: 'online' | 'reconnecting' | 'offline', watching, apart: [name…] }
  show({ link, watching = 0, apart = [] }) {
    const el = this.el
    el.classList.remove('hidden', 'ok', 'warn')
    if (apart.length) {
      el.textContent = `⚠ out of step with ${apart.join(', ')}`
      el.classList.add('warn')
    } else if (link === 'online') {
      el.textContent = `● online · ${watching} watching`
      el.classList.add('ok')
    } else el.textContent = link === 'offline' ? '○ offline · your moves will sync' : '◌ reconnecting…'
    el.title = el.textContent
  }

  hide() {
    this.el.classList.add('hidden')
  }
}
