# Bundled fonts

Six Japanese faces ship with this app, each subset down to the characters it
actually uses (`tools/build-fonts.py`). They are here because the whole point
of the app is reading real numbers out of real font binaries — the OpenType
`BASE` table's `ideo`, `icft`, `icfb` and `romn` baselines, which are what CSS
`text-box-edge: ideographic` and `ideographic-ink` refer to.

All six are licensed under the SIL Open Font License 1.1
(<https://openfontlicense.org>), retrieved from the
[google/fonts](https://github.com/google/fonts) repository.

| File | Family | Copyright |
| --- | --- | --- |
| `noto-sans-jp.woff2`  | Noto Sans JP   | © The Noto Project Authors |
| `noto-serif-jp.woff2` | Noto Serif JP  | © The Noto Project Authors |
| `yuji-syuku.woff2`    | Yuji Syuku     | © Kazuhiro Yuji |
| `klee-one.woff2`      | Klee One       | © FONTWORKS Inc. |
| `dot-gothic-16.woff2` | DotGothic16    | © FONTWORKS Inc. |
| `rampart-one.woff2`   | Rampart One    | © Fontworks Inc. |

Subsetting keeps the `BASE` table (`pyftsubset` drops it by default) because
the ideographic metrics live there. `noto-sans-jp.woff2` keeps its `wght`
variable axis; the rest are pinned to their regular instance.
