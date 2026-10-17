#!/bin/bash
# usage: runx.sh <sim: simx|dsimx> <engine> <grid: auto|CxR> <lex: path|jukugo> [extra json]
cd "$(dirname "$0")"
SIMF=$1; ENG=$2; GRID=$3; LEX=$4; EXTRA=${5:-'{}'}
if [ "$GRID" = auto ]; then C=null; R=null; else C=${GRID%x*}; R=${GRID#*x}; fi
TABLE=ENGINES; [ "$SIMF" = dsimx ] && TABLE=DENGINES
if [ "$LEX" = jukugo ]; then HO=false; SL=1; else HO=true; SL=1.5; fi
CFG="$(node -e "import('./engines.mjs').then(m=>console.log(JSON.stringify({...m.$TABLE['$ENG']($C,$R),horizontalOnly:$HO,slab:$SL,seeds:10,name:'$ENG|$GRID|'+'$(basename $LEX .json)',...$EXTRA})))")"
LEX=$LEX CFG="$CFG" node $SIMF.mjs
