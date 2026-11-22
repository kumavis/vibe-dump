#!/usr/bin/env bash
# QC contact sheet: sheet.sh in.mp4 out.jpg t1 t2 ... (seconds) -> frames side by side, labelled
set -euo pipefail
in=$1; out=$2; shift 2
tmp=$(mktemp -d); i=0; inputs=()
for t in "$@"; do
  /usr/bin/ffmpeg -v error -y -ss "$t" -i "$in" -frames:v 1 -vf "scale=540:-1,drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:text='$t s':x=8:y=8:fontsize=22:fontcolor=yellow:box=1:boxcolor=black@0.6" "$tmp/$i.png"
  inputs+=(-i "$tmp/$i.png"); i=$((i+1))
done
/usr/bin/ffmpeg -v error -y "${inputs[@]}" -filter_complex "hstack=inputs=$i" "$out"
rm -rf "$tmp"
