#!/usr/bin/env python3
"""Regenerate the bundled Japanese webfont subsets + their metric data.

Not part of `npm run build` — the outputs (src/fonts/*.woff2 and
src/data/font-metrics.js) are committed, so the app builds with plain Vite and
CI needs no Python. Re-run this only when changing the font list or the
character coverage:

    pip install fonttools brotli
    python3 tools/build-fonts.py /path/to/source-ttfs

Every metric this app draws comes out of here: the OpenType BASE table's
`ideo` / `icft` / `icfb` / `romn` baselines are what CSS calls the
ideographic and ideographic-ink edges, and no browser API exposes the ink
ones, so they have to be read from the font binary ahead of time.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

HERE = Path(__file__).resolve().parent
PKG = HERE.parent

# family key -> (source filename, css family name, label, kind, variable?)
FONTS = [
    ("noto-sans-jp",  "NotoSansJP[wght].ttf",      "Noto Sans JP",  "ゴシック", "Gothic / sans",       True),
    ("noto-serif-jp", "NotoSerifJP[wght].ttf",     "Noto Serif JP", "明朝",     "Mincho / serif",      False),
    ("yuji-syuku",    "YujiSyuku-Regular.ttf",     "Yuji Syuku",    "筆",       "Brush",               False),
    ("klee-one",      "KleeOne-Regular.ttf",       "Klee One",      "教科書",   "Textbook / pen",      False),
    ("dot-gothic-16", "DotGothic16-Regular.ttf",   "DotGothic16",   "点",       "Bitmap",              False),
    ("rampart-one",   "RampartOne-Regular.ttf",    "Rampart One",   "立体",     "Display / 3-D",       False),
]

# Unicode blocks every face must cover: Latin, general punctuation, CJK
# punctuation, kana, and full-width forms.
RANGES = ",".join([
    "U+0020-007E", "U+00A0-00FF", "U+2010-2027", "U+2030", "U+203B",
    "U+25A0-25CF", "U+2605-2606", "U+3000-303F", "U+3041-309F",
    "U+30A0-30FF", "U+31F0-31FF", "U+FF01-FF60", "U+FFE0-FFE6",
])

# Kanji used by the app's own copy, presets and demos. Kept explicit so the
# subsets stay small — anything outside this set falls back to a system font.
APP_KANJI = (
    "永字面仮想体墨書字組版活版印刷文章行間"
    "花鳥風月雪春夏秋冬静寂山川草木森林海空雲雨雷"
    "東京都渋谷区新宿一期一会日本語漢字平仮名片仮名"
    "上下左右中心外内前後始終開閉高低大小長短広狭"
    "文字箱線幅高上端下端基線"
    "見本例題説明比較実験調整余白詰切揃"
    "縦横書方向流時代美術館展覧会"
    "光影色彩形状動作変化速度回転拡大縮小"
    "水火土金木風雷氷炎星月日光夜明朝夕"
    "初級中級上級入門応用基本標準"
)

# Newspaper-frequency top kanji, so free typing mostly just works.
COMMON_KANJI = (
    "日一国会人年大十二本中長出三同時政事自行社見月分議後前民生連五発間対上部東"
    "者党地合市業内相方四定今回新場金員九入選立開手米力学問高代明実円関決子動京全"
    "目表戦経通十以主題正光札論方保元検来外制続保増加減進退取受続果活最初期知使道"
    "所野田山川石川海空天気水火土木金石花草虫魚鳥犬猫馬牛羊音声楽画写真映像"
    "北南西東春夏秋冬朝昼夜週月年間分秒番号名前後左右上下内外"
    "父母兄弟姉妹子供家族友達先生学校教室勉強宿題試験合格"
    "食事飲物料理野菜果物肉魚米麦豆茶酒水湯氷雪雨風雲晴曇"
    "行来帰出入乗降歩走飛泳登下座立寝起働休遊笑泣怒喜悲"
    "赤青白黒黄緑紫茶色明暗濃薄軽重速遅強弱新古若老"
)


def collect_chars() -> str:
    extra = "".join(sorted(set(APP_KANJI + COMMON_KANJI)))
    return extra


def em(value, upm):
    return None if value is None else round(value / upm, 5)


def base_axis(font, axis_name):
    """Pull the ideographic baselines out of one BASE-table axis."""
    if "BASE" not in font:
        return None
    axis = getattr(font["BASE"].table, axis_name, None)
    if axis is None or axis.BaseTagList is None:
        return None
    tags = list(axis.BaseTagList.BaselineTag)
    # Prefer the record for Han; the kana/DFLT records carry the same
    # coordinates in every font shipped here, but Han is the canonical one.
    records = {r.BaseScriptTag: r.BaseScript for r in axis.BaseScriptList.BaseScriptRecord}
    script = records.get("hani") or records.get("kana") or records.get("DFLT")
    if script is None or script.BaseValues is None:
        return None
    coords = [c.Coordinate for c in script.BaseValues.BaseCoord]
    return dict(zip(tags, coords))


def measure(path: Path):
    font = TTFont(path, fontNumber=0, lazy=True)
    upm = font["head"].unitsPerEm
    os2, hhea = font["OS/2"], font["hhea"]
    horiz = base_axis(font, "HorizAxis") or {}
    vert = base_axis(font, "VertAxis") or {}

    # Every edge is reported in em, measured up from the alphabetic (roman)
    # baseline — the same frame of reference CSS uses for text-box-edge.
    romn = horiz.get("romn", 0)
    ideo = horiz.get("ideo")
    icft, icfb = horiz.get("icft"), horiz.get("icfb")

    ideo_under = em(ideo - romn, upm) if ideo is not None else None
    out = {
        "unitsPerEm": upm,
        "hhea": {"ascent": em(hhea.ascent, upm), "descent": em(hhea.descent, upm),
                 "lineGap": em(hhea.lineGap, upm)},
        "typo": {"ascent": em(os2.sTypoAscender, upm), "descent": em(os2.sTypoDescender, upm),
                 "lineGap": em(os2.sTypoLineGap, upm)},
        "useTypoMetrics": bool(os2.fsSelection & (1 << 7)),
        "capHeight": em(getattr(os2, "sCapHeight", None), upm),
        "xHeight": em(getattr(os2, "sxHeight", None), upm),
        # Raw BASE-table coordinates, in font design units, exactly as stored.
        "baseRaw": {"horiz": horiz, "vert": vert},
        # ideographic-under is `ideo`; ideographic-over has no `idtp` record in
        # any of these faces, so it is synthesized as under + 1em — the em box
        # itself. csswg-drafts#10850 is still deciding how that synthesis
        # should be specified.
        "ideographic": None if ideo_under is None else {
            "under": ideo_under,
            "over": round(ideo_under + 1, 5),
            "synthesizedOver": True,
        },
        # ideographic-ink is `icft` / `icfb` — the character face (字面).
        "ideographicInk": None if icft is None or icfb is None else {
            "under": em(icfb - romn, upm),
            "over": em(icft - romn, upm),
        },
        "vertical": None if not vert else {
            "ideoStart": em(vert.get("ideo", 0) - vert.get("romn", 0), upm),
            "inkStart": em(vert.get("icfb", 0) - vert.get("romn", 0), upm),
            "inkEnd": em(vert.get("icft", 0) - vert.get("romn", 0), upm),
        },
    }
    return out


def main():
    src_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE / "src-fonts"
    out_dir = PKG / "src" / "fonts"
    out_dir.mkdir(parents=True, exist_ok=True)
    text = collect_chars()
    text_file = HERE / ".chars.txt"
    text_file.write_text(text, encoding="utf8")
    print(f"charset: {len(text)} kanji + block ranges")

    data = {}
    tmp = Path(tempfile.mkdtemp())
    for key, filename, family, label_ja, label_en, variable in FONTS:
        src = src_dir / filename
        if not src.exists():
            sys.exit(f"missing source font: {src}")
        dest = out_dir / f"{key}.woff2"
        cut = src
        if not variable and "fvar" in TTFont(src, lazy=True):
            # Pin variable sources to their regular instance to save weight.
            cut = tmp / f"{key}-400.ttf"
            instancer.instantiateVariableFont(
                TTFont(src), {"wght": 400}, inplace=True, updateFontNames=False
            ).save(cut)
        cmd = [
            "pyftsubset", str(cut),
            f"--output-file={dest}", "--flavor=woff2",
            "--layout-features+=palt,vkna,tnum",
            "--drop-tables-=BASE",
            f"--text-file={text_file}", f"--unicodes={RANGES}",
            "--no-hinting", "--desubroutinize",
        ]
        subprocess.run(cmd, check=True)
        metrics = measure(src)
        metrics.update({"key": key, "family": family, "labelJa": label_ja,
                        "labelEn": label_en, "variable": variable,
                        "file": f"{key}.woff2"})
        data[key] = metrics
        print(f"  {key:<14} {dest.stat().st_size // 1024:>4} KB  "
              f"face={metrics['ideographicInk']}")

    text_file.unlink()
    out_js = PKG / "src" / "data" / "font-metrics.js"
    out_js.parent.mkdir(parents=True, exist_ok=True)
    body = json.dumps(data, ensure_ascii=False, indent=2)
    out_js.write_text(
        "// GENERATED by tools/build-fonts.py — do not edit by hand.\n"
        "// Every number below is read straight out of the font binary: OS/2,\n"
        "// hhea, and the OpenType BASE table's ideo / icft / icfb / romn\n"
        "// baselines. Values are in em, measured up from the alphabetic\n"
        "// baseline, except `baseRaw` which keeps the original design units.\n"
        f"export const FONT_METRICS = {body}\n\n"
        "export const FONT_LIST = Object.values(FONT_METRICS)\n",
        encoding="utf8")
    print(f"wrote {out_js.relative_to(PKG)}")


if __name__ == "__main__":
    main()
