#!/usr/bin/env python3
"""Append a structured entry to agents/<agent>/log.json (a JSON array of entries).

Usage:
  python ops/tools/agentlog.py <agent> <kind> "<message>" [--data '{"key": "value"}']
"""
import argparse
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
KINDS = ["start", "progress", "decision", "result", "blocker", "done", "note"]


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("agent", help="agent folder name, e.g. leads")
    p.add_argument("kind", choices=KINDS)
    p.add_argument("message")
    p.add_argument("--data", help="optional JSON object with extra fields (numbers, paths, links)")
    a = p.parse_args()
    if not re.fullmatch(r"[a-z0-9][a-z0-9-]*", a.agent):
        p.error("agent must be lowercase letters, digits and dashes")

    entry = {
        "ts": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "agent": a.agent,
        "kind": a.kind,
        "message": a.message,
    }
    if a.data:
        entry["data"] = json.loads(a.data)

    path = ROOT / "agents" / a.agent / "log.json"
    path.parent.mkdir(parents=True, exist_ok=True)
    entries = json.loads(path.read_text(encoding="utf-8")) if path.exists() else []
    entries.append(entry)
    tmp = path.with_name("log.json.tmp")
    tmp.write_text(json.dumps(entries, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    os.replace(tmp, path)
    print(f"logged to {path.relative_to(ROOT).as_posix()} ({len(entries)} entries)")


if __name__ == "__main__":
    main()
