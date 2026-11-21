#!/usr/bin/env bash
# Launch one free-model Devin worker in Orca for ops/specs/<name>.md.
# The transcript is exported as JSON to private/transcripts/<name>.json (publish with publish_transcript.py).
# Usage: bash ops/tools/launch_worker.sh <name> [model]   (model defaults to swe-2-max)
set -euo pipefail
name="$1"
model="${2:-swe-2-max}"
cd "$(git rev-parse --show-toplevel)"
spec="ops/specs/$name.md"
[ -f "$spec" ] || { echo "no spec at $spec" >&2; exit 1; }
mkdir -p private/transcripts

field() { python -c "import json,sys; d=json.load(sys.stdin); print($1)"; }

task=$(orca orchestration task-create --spec-file "$spec" --task-title "$name" --display-name "$name ($model)" --json | field "d['result']['taskId']")
term=$(orca terminal create --worktree current --title "$name ($model)" \
  --command "devin --model $model --permission-mode smart --export private/transcripts/$name.json" --json \
  | field "d['result']['terminal']['handle']")

for _ in 1 2 3; do
  blocked=$(orca terminal wait --terminal "$term" --for tui-idle --timeout-ms 90000 --json \
    | field "d['result']['wait'].get('blockedReason') or ''")
  [ "$blocked" = "agent-trust-workspace" ] || break
  orca terminal send --terminal "$term" --enter --json >/dev/null
done

orca orchestration worker-start --task "$task" --terminal "$term" --worktree current --json
echo "launched $name: task=$task terminal=$term model=$model"
