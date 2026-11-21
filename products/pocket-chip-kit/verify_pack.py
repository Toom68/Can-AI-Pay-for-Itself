#!/usr/bin/env python3
"""Verify the Pocket Chip Kit pack: every WAV decodes, is non-silent and not
clipped; every .mid is a valid SMF with note events; required docs exist.

    python verify_pack.py          # exit 0 on success, prints manifest
"""
from __future__ import annotations

import json
import struct
import sys
import wave
from pathlib import Path

ROOT = Path(__file__).resolve().parent
PACK = ROOT / "pack"
REQUIRED = ["preview.html", "cover.png", "README.txt", "LICENSE.txt"]
MIN_PEAK = 0.05
MAX_CLIP_FRAC = 0.001  # at most 0.1% of samples may sit at full scale


def check_wav(path: Path) -> dict:
    with wave.open(str(path), "rb") as w:
        assert w.getframerate() == 44100, f"{path}: rate {w.getframerate()}"
        assert w.getsampwidth() == 2, f"{path}: width {w.getsampwidth()}"
        assert w.getnchannels() == 1, f"{path}: {w.getnchannels()} ch"
        n = w.getnframes()
        assert n > 0, f"{path}: empty"
        frames = w.readframes(n)
    peak = 0
    clipped = 0
    total = n
    for i in range(0, len(frames), 2):
        v = abs(struct.unpack_from("<h", frames, i)[0])
        if v > peak:
            peak = v
        if v >= 32760:
            clipped += 1
    peakf = peak / 32767
    assert peakf >= MIN_PEAK, f"{path}: silent (peak {peakf:.4f})"
    clipf = clipped / total
    assert clipf <= MAX_CLIP_FRAC, f"{path}: clipped {clipf:.2%}"
    return {"duration_s": round(n / 44100, 3), "peak": round(peakf, 3)}


def check_midi(path: Path) -> dict:
    data = path.read_bytes()
    assert data[:4] == b"MThd", f"{path}: bad header"
    assert b"MTrk" in data, f"{path}: no track"
    note_ons = sum(
        1 for i in range(len(data) - 2)
        if data[i] & 0xF0 == 0x90 and data[i + 2] > 0
    )
    assert note_ons >= 4, f"{path}: only {note_ons} notes"
    return {"notes": note_ons}


def main() -> int:
    if not PACK.is_dir():
        print("pack/ missing - run build_pack.py first")
        return 1
    manifest = {"wav": {}, "midi": {}, "extras": []}
    fails = 0
    wavs = sorted(PACK.rglob("*.wav"))
    mids = sorted(PACK.rglob("*.mid"))
    for p in wavs:
        try:
            manifest["wav"][str(p.relative_to(PACK))] = check_wav(p)
        except Exception as e:
            print("FAIL", e)
            fails += 1
    for p in mids:
        try:
            manifest["midi"][str(p.relative_to(PACK))] = check_midi(p)
        except Exception as e:
            print("FAIL", e)
            fails += 1
    for rel in REQUIRED:
        if (PACK / rel).exists():
            manifest["extras"].append(rel)
        else:
            print(f"FAIL missing {rel}")
            fails += 1
    total_s = sum(v["duration_s"] for v in manifest["wav"].values())
    print(json.dumps({
        "wav_files": len(wavs),
        "midi_files": len(mids),
        "audio_seconds": round(total_s, 1),
        "extras": manifest["extras"],
        "failures": fails,
    }, indent=2))
    if fails == 0 and len(wavs) >= 80:
        print("PACK VERIFIED")
        return 0
    print(f"{fails} failures" + ("; too few wavs" if len(wavs) < 80 else ""))
    return 1


if __name__ == "__main__":
    sys.exit(main())
