#!/usr/bin/env python3
"""Track tokens burnt by every agent in this experiment.

Reads Devin's local session store (read-only), sums per-call token metrics for every session
whose working directory is this repo, prices them with `devin models list`, then writes
ops/tokens.json and refreshes the "Token burn" table in ops/STATE.md.

Costs are list-price equivalents of what the calls draw from the Devin plan quota; free models
(SWE-2 / SWE-2 Flash) cost US$0.

Usage: python ops/tools/token_report.py
"""
import json
import os
import re
import sqlite3
import subprocess
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
DB = Path(os.environ.get("APPDATA", Path.home() / "AppData/Roaming")) / "devin/cli/sessions.db"
OUT = ROOT / "ops" / "tokens.json"
STATE = ROOT / "ops" / "STATE.md"
START, END = "<!-- tokens:start -->", "<!-- tokens:end -->"
FIELDS = ["input", "cache_write", "cache_read", "output"]


def model_prices():
    """Map model id -> per-1M-token prices parsed from `devin models list`."""
    text = subprocess.run(["devin", "models", "list"], capture_output=True, text=True, encoding="utf-8").stdout
    prices = {}
    for line in text.splitlines():
        m = re.match(r"\s+([a-z0-9][a-z0-9.-]+)\s+.*\[(.*)\]\s*$", line)
        if not m:
            continue
        model, info = m.groups()
        if re.search(r"\bFree\b", info):
            prices[model] = {"input": 0.0, "cache_read": 0.0, "output": 0.0}
            continue
        nums = {k: re.search(rf"\$([\d.]+) / 1M {k}", info) for k in ("Input", "Cached input", "Output")}
        if all(nums.values()):
            prices[model] = {
                "input": float(nums["Input"].group(1)),
                "cache_read": float(nums["Cached input"].group(1)),
                "output": float(nums["Output"].group(1)),
            }
    return prices


def agent_name(con, session_id):
    row = con.execute(
        "select json_extract(chat_message, '$.content') from message_nodes "
        "where session_id = ? and json_extract(chat_message, '$.role') = 'user' order by node_id limit 1",
        (session_id,),
    ).fetchone()
    text = str(row[0] if row else "")
    m = re.search(r"\((?:agent name|worker): ([a-z0-9-]+)\)", text)
    if m:
        return m.group(1)
    if "make me 200 dollars" in text or "devin max" in text.lower():
        return "coordinator"
    return f"session-{session_id}"


def collect():
    con = sqlite3.connect(f"file:{DB.as_posix()}?mode=ro", uri=True, timeout=10)
    workdir = str(ROOT).replace("/", "\\")
    sessions = con.execute(
        "select id, created_at from sessions where working_directory in (?, ?) order by created_at",
        (workdir, ROOT.as_posix()),
    ).fetchall()
    rows = con.execute(
        f"select session_id, json_extract(chat_message, '$.metadata.generation_model'), "
        f"json_extract(chat_message, '$.metadata.metrics.input_tokens'), "
        f"json_extract(chat_message, '$.metadata.metrics.cache_creation_tokens'), "
        f"json_extract(chat_message, '$.metadata.metrics.cache_read_tokens'), "
        f"json_extract(chat_message, '$.metadata.metrics.output_tokens') "
        f"from message_nodes where session_id in ({','.join('?' * len(sessions))}) "
        f"and json_extract(chat_message, '$.role') = 'assistant'",
        [s for s, _ in sessions],
    ).fetchall() if sessions else []
    names = {s: agent_name(con, s) for s, _ in sessions}
    con.close()
    return sessions, rows, names


def main():
    prices = model_prices()
    sessions, rows, names = collect()
    agents = defaultdict(lambda: {"sessions": set(), "calls": 0, "models": defaultdict(lambda: dict.fromkeys(FIELDS, 0) | {"calls": 0})})
    for session_id, model, *vals in rows:
        model = model or "unknown"
        a = agents[names[session_id]]
        a["sessions"].add(session_id)
        a["calls"] += 1
        bucket = a["models"][model]
        bucket["calls"] += 1
        for field, v in zip(FIELDS, vals):
            bucket[field] += int(v or 0)

    report, totals = {}, dict.fromkeys(FIELDS, 0) | {"calls": 0, "cost_usd": 0.0}
    unpriced = set()
    for name, a in sorted(agents.items()):
        entry = dict.fromkeys(FIELDS, 0) | {"calls": a["calls"], "cost_usd": 0.0, "sessions": sorted(a["sessions"]), "models": {}}
        for model, b in a["models"].items():
            p = prices.get(model)
            if p is None:
                unpriced.add(model)
                cost = 0.0
            else:
                cost = ((b["input"] + b["cache_write"]) * p["input"] + b["cache_read"] * p["cache_read"] + b["output"] * p["output"]) / 1e6
            entry["models"][model] = b | {"cost_usd": round(cost, 4), "free": bool(p) and p["output"] == 0}
            entry["cost_usd"] += cost
            for f in FIELDS:
                entry[f] += b[f]
        entry["cost_usd"] = round(entry["cost_usd"], 4)
        report[name] = entry
        for f in FIELDS + ["calls"]:
            totals[f] += entry[f]
        totals["cost_usd"] += entry["cost_usd"]
    totals["cost_usd"] = round(totals["cost_usd"], 4)

    data = {
        "generated_at": datetime.now(timezone.utc).astimezone().isoformat(timespec="seconds"),
        "note": "cost_usd = list-price equivalent drawn from the Devin plan quota; SWE-2 models are free",
        "totals": totals,
        "agents": report,
        "unpriced_models": sorted(unpriced),
    }
    OUT.write_text(json.dumps(data, indent=2) + "\n", encoding="utf-8")

    def fmt(n):
        return f"{n / 1e6:.2f}M" if n >= 1e6 else f"{n / 1e3:.0f}k"

    lines = [
        START,
        f"_Updated {data['generated_at']} by `python ops/tools/token_report.py` (JSON: `ops/tokens.json`)._",
        "",
        "| Agent | Model(s) | Calls | Input | Cached input | Output | Quota cost (US$) |",
        "|-------|----------|------:|------:|-------------:|-------:|-----------------:|",
    ]
    for name, e in report.items():
        models = ", ".join(f"{m}{' (free)' if b['free'] else ''}" for m, b in e["models"].items())
        lines.append(f"| {name} | {models} | {e['calls']} | {fmt(e['input'] + e['cache_write'])} | {fmt(e['cache_read'])} | {fmt(e['output'])} | {e['cost_usd']:.2f} |")
    t = totals
    lines.append(f"| **Total** | | {t['calls']} | {fmt(t['input'] + t['cache_write'])} | {fmt(t['cache_read'])} | {fmt(t['output'])} | **{t['cost_usd']:.2f}** |")
    lines.append(END)
    block = "\n".join(lines)

    state = STATE.read_text(encoding="utf-8")
    if START in state and END in state:
        state = re.sub(re.escape(START) + r".*?" + re.escape(END), lambda _: block, state, flags=re.S)
    else:
        state = state.rstrip() + "\n\n## Token burn\n" + block + "\n"
    STATE.write_text(state, encoding="utf-8")
    print(block)
    if unpriced:
        print("unpriced models:", ", ".join(sorted(unpriced)))


if __name__ == "__main__":
    main()
