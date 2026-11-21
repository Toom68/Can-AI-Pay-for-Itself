#!/usr/bin/env python3
"""Publish raw Devin transcript exports to the public repo with contact details and secrets redacted.

Reads  private/transcripts/<agent>.json  (written by `devin --export`, gitignored)
Writes agents/<agent>/transcript.json     (safe to commit publicly)

Usage:
  python ops/tools/publish_transcript.py <agent>
  python ops/tools/publish_transcript.py --all
"""
import argparse
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW_DIR = ROOT / "private" / "transcripts"

PATTERNS = [
    (re.compile(r"gh[opsur]_[A-Za-z0-9]{20,}"), "[REDACTED_TOKEN]"),
    (re.compile(r"github_pat_[A-Za-z0-9_]{20,}"), "[REDACTED_TOKEN]"),
    (re.compile(r"\bsk-[A-Za-z0-9_-]{20,}"), "[REDACTED_TOKEN]"),
    (re.compile(r"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}"), "[REDACTED_JWT]"),
    (re.compile(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"), "[REDACTED_EMAIL]"),
    (re.compile(r"(?<![\d.])(?:\+?61[\s-]?|0)[2-478](?:[\s-]?\d){8}(?![\d.])"), "[REDACTED_PHONE]"),
    (re.compile(r"\((?:\+?61\s?)?0?[2-478]\)(?:[\s-]?\d){8}(?![\d.])"), "[REDACTED_PHONE]"),
    (re.compile(r"(?<![\d.])1[38]00(?:[\s-]?\d){6}(?![\d.])"), "[REDACTED_PHONE]"),
]


def scrub(value):
    if isinstance(value, str):
        for pattern, replacement in PATTERNS:
            value = pattern.sub(replacement, value)
        return value
    if isinstance(value, list):
        return [scrub(v) for v in value]
    if isinstance(value, dict):
        return {k: scrub(v) for k, v in value.items()}
    return value


def publish(agent):
    src = RAW_DIR / f"{agent}.json"
    if not src.exists():
        print(f"{agent}: no raw export yet at {src.relative_to(ROOT).as_posix()} (it appears after the first turn ends)")
        return False
    data = scrub(json.loads(src.read_text(encoding="utf-8")))
    dst = ROOT / "agents" / agent / "transcript.json"
    dst.parent.mkdir(parents=True, exist_ok=True)
    tmp = dst.with_name("transcript.json.tmp")
    tmp.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    os.replace(tmp, dst)
    print(f"{agent}: published {dst.relative_to(ROOT).as_posix()} ({dst.stat().st_size // 1024} KB)")
    return True


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("agent", nargs="?")
    p.add_argument("--all", action="store_true")
    a = p.parse_args()
    if a.all:
        agents = sorted(f.stem for f in RAW_DIR.glob("*.json")) if RAW_DIR.exists() else []
    elif a.agent:
        agents = [a.agent]
    else:
        p.error("give an agent name or --all")
    for agent in agents:
        publish(agent)
    if not agents:
        print("nothing to publish")
    sys.exit(0)


if __name__ == "__main__":
    main()
