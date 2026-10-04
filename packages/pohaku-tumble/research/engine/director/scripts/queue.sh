#!/usr/bin/env bash
# Runs the batches queued after the matrix, one after another.
cd "$(dirname "$0")"
while pgrep -f "runall.mjs batches/matrix" >/dev/null; do sleep 10; done
for b in explore5 ablation views best; do
  rm -f results/$b.jsonl
  node runall.mjs batches/$b.mjs results/$b.jsonl 4 > results/$b.log 2>&1
done
echo queue-done > results/queue.done
