// The online match's dialog (DESIGN §2.7, N2): a match that can't go on
// here, and why. Frozen (a desync, a log run past its cap, an entry gone
// from it), with a report to download for whoever looks into it; read-only
// (made under another version of the game, or a start this page can't
// trust: "The start changed your seat (ctrl)"), where Keep watching shows
// the battle without a seat played here.
const $ = (s) => document.querySelector(s)

export class NetDialog {
  constructor() {
    this.root = $('#netdialog')
  }

  get up() {
    return !this.root.classList.contains('hidden')
  }

  // { title, why, report (an object, offered as a JSON file), watch, back }
  show({ title, why, report = null, watch = null, back }) {
    $('#netTitle').textContent = title
    $('#netWhy').textContent = why
    const dl = $('#netReport')
    dl.classList.toggle('hidden', !report)
    dl.onclick = () => {
      const url = URL.createObjectURL(new Blob([JSON.stringify(report, null, 1)], { type: 'application/json' }))
      const a = document.createElement('a')
      a.href = url
      a.download = `tails-and-scales-${report.status ?? 'report'}-${Date.now()}.json`
      a.click()
      setTimeout(() => URL.revokeObjectURL(url), 10000)
    }
    const w = $('#netWatch')
    w.classList.toggle('hidden', !watch)
    w.onclick = () => {
      this.hide()
      watch()
    }
    $('#netBack').onclick = () => {
      this.hide()
      back()
    }
    this.root.classList.remove('hidden')
  }

  hide() {
    this.root.classList.add('hidden')
  }
}
