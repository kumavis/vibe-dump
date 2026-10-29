# Twemoji graphics

The eight SVG files in this directory are unmodified copies of Twemoji 15.1.0
glyphs, downloaded from
`https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/<codepoint>.svg`
(the maintained fork at <https://github.com/jdecked/twemoji>).

| file | glyph | used by |
| --- | --- | --- |
| `1f996.svg` | 🦖 | `trex` preset |
| `1f411.svg` | 🐑 | `sheep` preset |
| `1f40e.svg` | 🐎 | `horse` preset |
| `1f333.svg` | 🌳 | tree palette / billboard |
| `1faa8.svg` | 🪨 | rock palette / billboard |
| `1f4a1.svg` | 💡 | lamp palette / billboard |
| `1f43a.svg` | 🐺 | wolf (the design's example preset) |
| `1f9d1.svg` | 🧑 | player avatars |

They are drawn only when the platform has no colour emoji font
(`hasColorEmoji()` in `../resources.js`); otherwise the system font draws the
glyph and these files are never fetched.

Copyright 2019 Twitter, Inc and other contributors.
Copyright 2024 jdecked and other contributors.

Graphics licensed under CC-BY 4.0: <https://creativecommons.org/licenses/by/4.0/>
