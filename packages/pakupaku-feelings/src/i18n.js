// Two languages. English content lives in data.js, Japanese in ja.js; this
// file holds the interface strings and folds either set into one shape the
// rest of the app reads, so nothing downstream needs to know which it is.

import { CORES, NEEDS, THOUGHT_WORDS } from './data.js'
import { JA } from './ja.js'

export const LANGS = ['en', 'ja']
const KEY = 'pakupaku-lang'

/** A choice made with the switch, else the browser's first preference we speak. */
export function startLang() {
  try {
    const saved = localStorage.getItem(KEY)
    if (LANGS.includes(saved)) return saved
  } catch {}
  const prefs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en']
  for (const p of prefs) {
    const base = String(p).toLowerCase().split('-')[0]
    if (LANGS.includes(base)) return base
  }
  return 'en'
}

export function saveLang(lang) {
  try {
    localStorage.setItem(KEY, lang)
  } catch {}
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c])

export const UI = {
  en: {
    title: 'Pakupaku Feelings',
    cover: ['how do', 'you feel?'],
    stage: 'A paper fortune teller of feelings. Press Tab for the same choices as buttons.',
    open: 'Open the fortune teller',
    back: 'Fold back',
    pickFeeling: 'Choose a feeling',
    pickCloser: 'Choose a closer word',
    pickNeed: 'Choose a need',
    leadUnmet: (w) => `Under ${esc(w)} there may be a need for`,
    leadMet: (w) => `Feeling ${esc(w)} says this need is being met:`,
    tryLabel: 'Try',
    askLabel: 'Ask',
    savorLabel: 'Savor',
    savor: 'Notice where the feeling sits in your body, and what helped it happen.',
    thankLabel: 'Thank',
    thank: 'If someone helped meet this need, tell them.',
    asked: (a) => `“Would you be willing to ${esc(a)}?”`,
    sayIt: 'Say it the NVC way',
    when: ['When ', ', '],
    placeholder: 'this happened',
    obsLabel: 'What happened, just the facts',
    unmet: (w, n, a) => `I feel <b>${esc(w)}</b>, because I need <b>${esc(n)}</b>. Would you be willing to ${esc(a)}?`,
    met: (w, n) =>
      n.startsWith('to ')
        ? `I felt <b>${esc(w)}</b>, because it met my need to <b>${esc(n.slice(3))}</b>. Thank you!`
        : `I felt <b>${esc(w)}</b>, because it met my need for <b>${esc(n)}</b>. Thank you!`,
    copy: 'Copy',
    copied: 'Copied',
    selected: 'Selected — copy it',
    others: (w) => `Other needs under ${esc(w)}`,
    close: 'Close',
    nvcLink: 'What is NVC?',
    thought: (t, w, ns) => `<span class="tw">“${esc(t)}”</span><span class="arrow">→</span><span>maybe <b>${esc(w)}</b>, needing ${ns.map((n) => `<b>${esc(n)}</b>`).join(' or ')}</span>`,
    about: `
      <h2>What is NVC?</h2>
      <p><b>Nonviolent Communication</b>, developed by Marshall Rosenberg, is a way of listening and speaking that starts with what is alive in us right now: our feelings, and the needs underneath them.</p>
      <ol class="steps-list">
        <li><b>Observe.</b> What happened, the way a camera would see it.</li>
        <li><b>Feel.</b> Name the feeling it brings up.</li>
        <li><b>Need.</b> Find what matters to you underneath it.</li>
        <li><b>Request.</b> Ask for something doable, right now.</li>
      </ol>
      <p>Feelings are messengers. Pleasant ones say a need is being met; painful ones say a need is asking for care. Needs are universal. Everyone has them, and none of them belongs to one person or one way of meeting it.</p>
      <h3>Thoughts dressed as feelings</h3>
      <p>Some words sound like feelings but are really a guess about what someone else did. Look underneath them:</p>`,
    aboutSmall:
      "The needs here come from the Center for Nonviolent Communication's Needs Inventory. This is a gentle tool for noticing, not a test, and every word is only a guess for you to try on.",
  },
  ja: {
    title: 'パクパクきもち',
    cover: ['どんな', 'きもち？'],
    stage: '気持ちのパクパク（折り紙の占い）。Tab キーで、同じ選択肢をボタンで選べます。',
    open: 'パクパクをひらく',
    back: 'たたむ',
    pickFeeling: '気持ちを選ぶ',
    pickCloser: 'もっと近いことばを選ぶ',
    pickNeed: 'ニーズを選ぶ',
    leadUnmet: (w) => `「${esc(w)}」の下には、こんなニーズがあるかも`,
    leadMet: (w) => `「${esc(w)}」は、このニーズが満たされているしるし`,
    tryLabel: 'ためす',
    askLabel: 'たのむ',
    savorLabel: '味わう',
    savor: 'その気持ちが体のどこにあるか、何がそうさせてくれたのか、感じてみる。',
    thankLabel: '伝える',
    thank: 'だれかが助けてくれたなら、伝えてみる。',
    asked: (a) => `「${esc(a)}」`,
    sayIt: 'NVCで言ってみる',
    when: ['', 'とき、'],
    placeholder: 'こんなことがあった',
    obsLabel: '何があったか（事実だけ）',
    unmet: (w, n, a) => `わたしは<b>「${esc(w)}」</b>と感じています。<b>${esc(n)}</b>が大切だからです。${esc(a)}`,
    met: (w, n) => `わたしは<b>「${esc(w)}」</b>と感じました。<b>${esc(n)}</b>が満たされたからです。ありがとう！`,
    copy: 'コピー',
    copied: 'コピーしました',
    selected: '選択しました',
    others: (w) => `「${esc(w)}」の下にある、ほかのニーズ`,
    close: '閉じる',
    nvcLink: 'NVCってなに？',
    thought: (t, w, ns) => `<span class="tw">「${esc(t)}」</span><span class="arrow">→</span><span>たぶん<b>「${esc(w)}」</b>。ニーズは${ns.map((n) => `<b>${esc(n)}</b>`).join('か')}</span>`,
    about: `
      <h2>NVCってなに？</h2>
      <p><b>NVC（非暴力コミュニケーション）</b>は、マーシャル・ローゼンバーグが生みだした話し方と聞き方です。いま自分のなかで生きているもの、つまり気持ちと、その奥にあるニーズから始めます。</p>
      <ol class="steps-list">
        <li><b>観察</b>　起きたことを、カメラが映すようにそのまま。</li>
        <li><b>気持ち</b>　わいてきた気持ちに名前をつける。</li>
        <li><b>ニーズ</b>　その奥で大切にしているものを見つける。</li>
        <li><b>リクエスト</b>　いまできる、具体的なことをたのむ。</li>
      </ol>
      <p>気持ちはメッセンジャーです。心地よい気持ちはニーズが満たされているしるし、つらい気持ちはニーズが手当てを求めているしるし。ニーズはだれにでもあるもので、特定の人や、特定の満たし方のものではありません。</p>
      <h3>気持ちのふりをした考え</h3>
      <p>気持ちのように聞こえても、じつは「相手が何をしたか」の推測、ということばがあります。その下をのぞいてみましょう。</p>`,
    aboutSmall:
      'ここにあるニーズは、Center for Nonviolent Communication のニーズ一覧（Needs Inventory）をもとにしています。これは気づくための道具で、テストではありません。どのことばも、ためしに当ててみるための推測です。',
  },
}

/**
 * The content in one language: cores with their closer words, needs keyed by
 * their English id, and the thought words — each with display text filled in.
 */
export function content(lang) {
  const ja = lang === 'ja' ? JA : null
  const cores = CORES.map((core) => ({
    ...core,
    word: ja?.cores[core.id]?.word ?? core.word,
    gist: ja?.cores[core.id]?.gist ?? core.gist,
    closer: core.closer.map((c) => ({
      ...c,
      word: ja?.closer[c.id]?.word ?? c.word,
      gist: ja?.closer[c.id]?.gist ?? c.gist,
    })),
  }))
  const needs = {}
  for (const [key, n] of Object.entries(NEEDS)) {
    const j = ja?.needs[key]
    needs[key] = {
      ...n,
      key,
      name: j?.name ?? key,
      said: j ? (j.said ?? j.name) : (n.said ?? key),
      means: j?.means ?? n.means,
      try: j?.try ?? n.try,
      ask: j?.ask ?? n.ask,
    }
  }
  const thoughts = THOUGHT_WORDS.map((t) => ({ ...t, label: ja?.thoughts[t.word] ?? t.word }))
  return { cores, needs, thoughts, ui: UI[lang] }
}
