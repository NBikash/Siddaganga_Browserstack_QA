#!/usr/bin/env bash
# Usage: bash steps/run-batch.sh <batch-name> <key...>  – 4 staggered shards (own tabs), waits for completion, prints results.
name=$1; shift
node steps/close-extra-tabs.mjs
for i in $(seq 0 $((${SHARDS:-4}-1))); do
  (node steps/inspect-batch.mjs --shard=$i/${SHARDS:-4} "$@" > "exploration-logs/raw/batch-$name-$i.out" 2>&1 &)
  node -e "setTimeout(()=>{},3000)"
done
node -e "setTimeout(()=>{},10000)"
while [ "$(powershell -NoProfile -Command "@(Get-CimInstance Win32_Process -Filter \"Name='node.exe'\" | Where-Object { \$_.CommandLine -match 'inspect-batch' }).Count")" != "0" ]; do
  node -e "setTimeout(()=>{},10000)"
done
echo "== batch $name finished"; cat exploration-logs/raw/batch-$name-*.out
