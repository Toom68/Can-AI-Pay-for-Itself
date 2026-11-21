#!/usr/bin/env python3
"""Build the Pocket Chip Kit sample + MIDI pack (stdlib only).

Renders every WAV deterministically (seeded RNG) into pack/ and writes a small
set of Standard MIDI Files. Run:

    python build_pack.py            # render everything into ./pack
    python verify_pack.py           # then verify it

44.1 kHz / 16-bit / mono WAVs. No dependencies beyond the standard library.
"""
from __future__ import annotations

import math
import random
import struct
import wave
import zipfile
from pathlib import Path

SR = 44100
ROOT = Path(__file__).resolve().parent
PACK = ROOT / "pack"
SEED = 20261121

# ---------------------------------------------------------------- synthesis


def _norm(samples: list[float], peak: float = 0.85) -> list[float]:
    m = max((abs(s) for s in samples), default=0.0)
    if m < 1e-9:
        return samples
    return [s * (peak / m) for s in samples]


def write_wav(path: Path, samples: list[float]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    samples = _norm(samples)
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(max(-1.0, min(1.0, s)) * 32767)) for s in samples))


def env_adsr(t: float, a: float, d: float, s: float, slvl: float, r: float, dur: float) -> float:
    if t < 0 or t > dur:
        return 0.0
    if t < a:
        return t / a if a > 0 else 1.0
    t -= a
    if t < d:
        return 1.0 - (1.0 - slvl) * (t / d)
    t -= d
    if t < s:
        return slvl
    t -= s
    return slvl * max(0.0, 1.0 - t / r)


def render(freq_fn, wave_fn, dur: float, env_fn, vol: float = 1.0) -> list[float]:
    """Sample-accurate render: freq_fn(t)->Hz, wave_fn(phase)->[-1,1], env_fn(t)->[0,1]."""
    out = []
    phase = 0.0
    n = int(dur * SR)
    for i in range(n):
        t = i / SR
        f = max(1.0, freq_fn(t))
        phase = (phase + f / SR) % 1.0
        out.append(wave_fn(phase) * env_fn(t) * vol)
    return out


def square(duty: float = 0.5):
    return lambda p: 1.0 if p < duty else -1.0


def tri(p: float) -> float:
    return 4.0 * abs(p - 0.5) - 1.0


def sine(p: float) -> float:
    return math.sin(2.0 * math.pi * p)


class LFSR:
    """NES-style 15-bit linear feedback shift register noise."""

    def __init__(self, short: bool = False):
        self.reg = 1
        self.tap = 6 if short else 1  # bit6 tap = short-period metallic noise

    def step(self) -> float:
        bit = (self.reg & 1) ^ ((self.reg >> self.tap) & 1)
        self.reg = (self.reg >> 1) | (bit << 14)
        return 1.0 if self.reg & 1 else -1.0


def lfsr_noise(dur: float, env_fn, clock_hz: float = 44100.0, short: bool = False,
               vol: float = 1.0) -> list[float]:
    lfsr = LFSR(short)
    out, acc, n = [], 0.0, int(dur * SR)
    period = max(1.0, SR / clock_hz)
    cur = 0.0
    for i in range(n):
        t = i / SR
        acc += 1.0
        if acc >= period:
            cur = lfsr.step()
            acc = 0.0
        out.append(cur * env_fn(t) * vol)
    return out


def expdecay(k: float):
    return lambda t: math.exp(-k * t) if t >= 0 else 0.0


def white(dur: float, env_fn, vol: float = 1.0) -> list[float]:
    rng = random.Random(SEED + int(dur * 1000))
    n = int(dur * SR)
    return [rng.uniform(-1, 1) * env_fn(i / SR) * vol for i in range(n)]


def mix(*layers: list[float]) -> list[float]:
    n = max(len(l) for l in layers)
    out = [0.0] * n
    for l in layers:
        for i, s in enumerate(l):
            out[i] += s
    return out


def pitch_sweep(f0: float, f1: float, dur: float):
    return lambda t: f0 * ((f1 / f0) ** (min(t, dur) / dur))


NOTE_HZ = {n: 440.0 * 2 ** ((n - 69) / 12) for n in range(128)}


def n2f(name: str) -> float:
    """'C3' -> Hz."""
    semis = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    name = name.strip()
    base = semis[name[0].upper()]
    i = 1
    if name[1] in "#b":
        base += 1 if name[1] == "#" else -1
        i = 2
    octv = int(name[i:])
    return NOTE_HZ[12 * (octv + 1) + base]


def arp_freq(base: float, offsets: list[int], step_hz: float):
    """NES-style arpeggio: cycle semitone offsets at step_hz."""
    freqs = [base * 2 ** (o / 12) for o in offsets]

    def f(t: float) -> float:
        return freqs[int(t * step_hz) % len(freqs)]

    return f


# ------------------------------------------------------------------- sounds


def s_kick(kind: str) -> list[float]:
    dur = {"deep": 0.28, "punch": 0.18, "long": 0.5}[kind]
    body = render(pitch_sweep({"deep": 110, "punch": 150, "long": 90}[kind], 42, dur * 0.7),
                  sine, dur, expdecay(18 if kind != "long" else 9))
    click = white(0.012, expdecay(300), vol=0.4)
    return mix(body, click)


def s_snare(kind: str) -> list[float]:
    dur = 0.22
    noise = lfsr_noise(dur, expdecay(22 if kind != "tight" else 40), clock_hz=SR, vol=0.8)
    tone = render(lambda t: 190 if kind != "hi" else 240, tri, 0.09, expdecay(45), vol=0.7)
    return mix(noise, tone)


def s_hat(open_: bool) -> list[float]:
    return lfsr_noise(0.28 if open_ else 0.05, expdecay(12 if open_ else 90),
                      clock_hz=SR, short=True, vol=0.7)


def s_clap() -> list[float]:
    rng = random.Random(SEED)
    out = [0.0] * int(0.25 * SR)
    for start in (0.0, 0.018, 0.038):
        e = lfsr_noise(0.12, expdecay(30), clock_hz=SR, vol=0.5)
        off = int(start * SR)
        for i, s in enumerate(e):
            out[off + i] += s
    return out


def s_tom(hz: float) -> list[float]:
    return mix(
        render(pitch_sweep(hz, hz * 0.55, 0.18), square(0.5), 0.22, expdecay(14)),
        white(0.01, expdecay(250), vol=0.25),
    )


def s_rim() -> list[float]:
    return render(lambda t: 1720, square(0.5), 0.03, expdecay(160))


def s_noise_hit() -> list[float]:
    return lfsr_noise(0.3, expdecay(14), clock_hz=8000, vol=0.8)


def s_bass(note: str, wave_fn, decay: float = 8.0) -> list[float]:
    hz = n2f(note)
    return mix(
        render(lambda t: hz, wave_fn, 0.5, expdecay(decay)),
        render(lambda t: hz * 2, wave_fn, 0.5, expdecay(decay * 2), vol=0.15),
    )


def s_lead(note: str, wave_fn, dur: float = 0.4) -> list[float]:
    hz = n2f(note)
    env = lambda t: env_adsr(t, 0.008, 0.08, 0.15, 0.6, 0.08, dur)
    return render(lambda t: hz, wave_fn, dur, env)


def s_fx(name: str) -> list[float]:
    if name == "coin":
        return mix(
            render(arp_freq(988, [0, 0, 7], 120), square(0.5), 0.16, expdecay(20)),
        )
    if name == "jump":
        return render(pitch_sweep(240, 950, 0.28), square(0.5), 0.3, expdecay(10))
    if name == "laser":
        return render(pitch_sweep(1600, 120, 0.22), square(0.25), 0.24, expdecay(14))
    if name == "powerup":
        return render(arp_freq(523, [0, 4, 7, 12] * 4, 60), square(0.5), 0.45, expdecay(9))
    if name == "damage":
        return mix(render(pitch_sweep(400, 80, 0.15), square(0.5), 0.18, expdecay(22)),
                   white(0.1, expdecay(30), vol=0.5))
    if name == "riser":
        return mix(render(pitch_sweep(200, 1400, 0.7), square(0.25), 0.75,
                          lambda t: min(1.0, t / 0.6) * math.exp(-2 * max(0, t - 0.65))),
                   lfsr_noise(0.7, lambda t: min(0.5, t), clock_hz=6000, vol=0.4))
    if name == "fall":
        return render(pitch_sweep(1200, 150, 0.6), square(0.5), 0.65, expdecay(6))
    if name == "sweep_up":
        return lfsr_noise(0.5, lambda t: min(1.0, t / 0.4) * math.exp(-3 * max(0, t - 0.42)),
                          clock_hz=3000, vol=0.7)
    if name == "sweep_down":
        return lfsr_noise(0.45, lambda t: 1.0 if t < 0.3 else math.exp(-9 * (t - 0.3)),
                          clock_hz=2500, vol=0.7)
    if name == "arp_major":
        return render(arp_freq(660, [0, 4, 7] * 6, 90), square(0.5), 0.35, expdecay(11))
    if name == "arp_minor":
        return render(arp_freq(660, [0, 3, 7] * 6, 90), square(0.5), 0.35, expdecay(11))
    if name == "select":
        return render(arp_freq(880, [0, 7], 80), square(0.5), 0.12, expdecay(30))
    if name == "confirm":
        return render(arp_freq(660, [0, 4, 7], 100), square(0.25), 0.2, expdecay(16))
    if name == "zap":
        return render(arp_freq(2000, [0, -12, 0, -12], 300), square(0.125), 0.15, expdecay(25))
    if name == "tick":
        return render(lambda t: 2400, square(0.5), 0.018, expdecay(400))
    raise ValueError(name)


# -------------------------------------------------------------------- loops


def drum_loop(bpm: float, pattern: int) -> list[float]:
    """2 bars of 8th-note grid."""
    beat = 60.0 / bpm
    dur = beat * 16
    out = [0.0] * int(dur * SR)

    def lay(start_s: float, snd: list[float], gain: float = 1.0):
        off = int(start_s * SR)
        for i, s in enumerate(snd):
            if off + i < len(out):
                out[off + i] += s * gain

    kick, snare, hhat, ohat = s_kick("punch"), s_snare("mid"), s_hat(False), s_hat(True)
    for bar in range(2):
        b = bar * beat * 8
        if pattern == 1:  # standard 4-on-floor
            for st, snd in ((0, kick), (4, snare), (8, kick), (12, snare)):
                lay(b + st * beat / 2, snd)
            for st in range(0, 16, 2):
                lay(b + st * beat / 2, hhat, 0.6)
            lay(b + 14 * beat / 2, ohat, 0.5)
        elif pattern == 2:  # syncopated
            for st, snd in ((0, kick), (4, snare), (7, kick), (8, kick), (12, snare)):
                lay(b + st * beat / 2, snd)
            for st in range(16):
                lay(b + st * beat / 2, hhat, 0.5 if st % 2 else 0.7)
        else:  # half-time
            for st, snd in ((0, kick), (8, snare), (10, kick)):
                lay(b + st * beat / 2, snd)
            for st in range(0, 16, 4):
                lay(b + st * beat / 2, hhat, 0.6)
            lay(b + 14 * beat / 2, ohat, 0.5)
    return out


def bass_loop(bpm: float, notes: list[str], wave_fn) -> list[float]:
    beat = 60.0 / bpm
    dur = beat * len(notes) / 2  # 8th notes
    out = [0.0] * int(dur * SR)
    for i, n in enumerate(notes):
        snd = render(lambda t, f=n2f(n): f, wave_fn, beat * 0.45, expdecay(9))
        off = int(i * beat * 0.5 * SR)
        for j, s in enumerate(snd):
            if off + j < len(out):
                out[off + j] += s
    return out


def arp_loop(bpm: float, base: str, offsets: list[int], reps: int) -> list[float]:
    beat = 60.0 / bpm
    dur = beat * reps
    return render(arp_freq(n2f(base), offsets * int(beat * 8 * reps / len(offsets)),
                           8 / beat), square(0.25), dur, lambda t: 0.9)


# -------------------------------------------------------------------- MIDI


def vlq(n: int) -> bytes:
    out = [n & 0x7F]
    n >>= 7
    while n:
        out.insert(0, (n & 0x7F) | 0x80)
        n >>= 7
    return bytes(out)


def midi_file(notes: list[tuple[int, int, int, int]], bpm: int, name: str) -> bytes:
    """notes: (start_ticks, dur_ticks, pitch, vel). Single-track SMF."""
    tpq = 480
    events = []
    for st, dur, pitch, vel in notes:
        events.append((st, bytes([0x90, pitch, vel])))
        events.append((st + dur, bytes([0x80, pitch, 0])))
    events.sort(key=lambda e: e[0])
    tempo = int(60_000_000 / bpm)
    trk = b"\x00\xff\x03" + bytes([len(name.encode())]) + name.encode()
    trk += b"\x00\xff\x51\x03" + tempo.to_bytes(3, "big")
    last = 0
    for t, ev in events:
        trk += vlq(t - last) + ev
        last = t
    trk += b"\x00\xff\x2f\x00"
    return b"MThd" + (6).to_bytes(4, "big") + (0).to_bytes(2, "big") + \
        (1).to_bytes(2, "big") + tpq.to_bytes(2, "big") + b"MTrk" + len(trk).to_bytes(4, "big") + trk


def write_midi(path: Path, data: bytes) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)


def q(t: float, tpq: int = 480) -> int:
    return int(t * tpq)


def gen_midi(mdir: Path) -> None:
    e8, e4 = 240, 480
    # 4 drum patterns (GM map: kick 36, snare 38, hat 42, openhat 46)
    pats = [
        [(0, e8, 36, 110), (e4, e8, 38, 110), (2 * e4, e8, 36, 110), (3 * e4, e8, 38, 110)]
        + [(i * e8, e8, 42, 80) for i in range(0, 8, 2)] + [(7 * e8, e8, 46, 80)],
        [(0, e8, 36, 110), (e4, e8, 38, 110), (3 * e8 + e4, e8, 36, 110), (2 * e4, e8, 36, 100),
         (3 * e4, e8, 38, 110)] + [(i * e8, e8, 42, 75) for i in range(8)],
        [(0, e4, 36, 110), (2 * e4, e8, 38, 115), (2 * e4 + e8, e8, 36, 95)]
        + [(i * e4, e8, 42, 80) for i in range(4)] + [(3 * e4 + e8, e8, 46, 80)],
        [(0, e8, 36, 115), (e8, e8, 36, 90), (e4, e8, 38, 110), (2 * e4, e8, 36, 110),
         (2 * e4 + e8, e8, 36, 90), (3 * e4, e8, 38, 110)] + [(i * e8, e8, 42, 70) for i in range(8)],
    ]
    for i, p in enumerate(pats):
        two_bars = p + [(st + 4 * e4, d, n, v) for st, d, n, v in p]
        write_midi(mdir / f"drum-pattern-{i + 1}.mid", midi_file(two_bars, 132, f"drum pattern {i + 1}"))

    basslines = [
        ["C2", "C2", "G2", "C2", "A1", "A1", "F2", "G1"],
        ["A1", "A1", "E2", "A1", "F1", "F1", "G1", "G1"],
        ["C2", "E2", "G2", "E2", "F2", "A2", "G2", "B1"],
        ["D2", "D2", "A2", "D2", "Bb1", "Bb1", "C2", "C2"],
    ]
    for i, line in enumerate(basslines):
        two_bars = line + line
        notes = [(n * e8, int(e8 * 0.9), _pitch(two_bars[n]), 105) for n in range(len(two_bars))]
        write_midi(mdir / f"bassline-{i + 1}.mid", midi_file(notes, 132, f"bassline {i + 1}"))

    melodies = [
        [(0, "E4"), (1, "G4"), (2, "A4"), (3, "G4"), (4, "E4"), (6, "D4"), (7, "E4"),
         (8, "E4"), (9, "G4"), (10, "A4"), (12, "G4"), (14, "E4")],
        [(0, "C5"), (2, "A4"), (3, "G4"), (4, "A4"), (6, "E4"), (8, "D4"), (9, "E4"),
         (10, "G4"), (12, "A4")],
        [(0, "A4"), (1, "A4"), (2, "C5"), (3, "A4"), (4, "G4"), (6, "E4"), (8, "G4"),
         (9, "G4"), (10, "E4"), (12, "D4")],
        [(0, "E5"), (1, "D5"), (2, "C5"), (3, "D5"), (4, "E5"), (5, "E5"), (6, "E5"),
         (8, "D5"), (9, "D5"), (10, "D5"), (12, "E5"), (13, "G5"), (14, "G5")],
    ]
    for i, mel in enumerate(melodies):
        notes = [(st * e8, int(e8 * 0.95), _pitch(nm), 100) for st, nm in mel]
        write_midi(mdir / f"melody-{i + 1}.mid", midi_file(notes, 132, f"melody {i + 1}"))


def _pitch(nm: str) -> int:
    semis = {"C": 0, "D": 2, "E": 4, "F": 5, "G": 7, "A": 9, "B": 11}
    base = semis[nm[0].upper()]
    i = 1
    if nm[1] in "#b":
        base += 1 if nm[1] == "#" else -1
        i = 2
    return 12 * (int(nm[i:]) + 1) + base


# -------------------------------------------------------------------- build


def main() -> None:
    A = PACK / "audio"
    files = 0

    def w(rel: str, snd: list[float]) -> None:
        nonlocal files
        write_wav(A / rel, snd)
        files += 1

    for kind in ("deep", "punch", "long"):
        w(f"drums/kick-{kind}.wav", s_kick(kind))
    for kind in ("mid", "hi", "tight"):
        w(f"drums/snare-{kind}.wav", s_snare(kind))
    w("drums/hat-closed.wav", s_hat(False))
    w("drums/hat-open.wav", s_hat(True))
    w("drums/clap.wav", s_clap())
    for i, hz in enumerate((160, 130)):
        w(f"drums/tom-{i + 1}.wav", s_tom(hz))
    w("drums/rim.wav", s_rim())
    w("drums/noise-hit.wav", s_noise_hit())
    w("drums/blip-1.wav", render(lambda t: 1800, square(0.25), 0.05, expdecay(80)))
    w("drums/blip-2.wav", render(lambda t: 1200, square(0.5), 0.06, expdecay(70)))

    notes_b = ["C1", "E1", "G1", "A1", "B1"]
    for n in notes_b:
        w(f"bass/tri-{n.lower()}.wav", s_bass(n, tri))
        w(f"bass/pulse-{n.lower()}.wav", s_bass(n, square(0.25)))
        w(f"bass/square-{n.lower()}.wav", s_bass(n, square(0.5)))
    w("bass/sub-c1.wav", s_bass("C1", sine, decay=5))
    w("bass/sub-g1.wav", s_bass("G1", sine, decay=5))
    w("bass/sub-a1.wav", s_bass("A1", sine, decay=5))
    w("bass/sub-e1.wav", s_bass("E1", sine, decay=5))
    w("bass/sub-f1.wav", s_bass("F1", sine, decay=5))

    for n in ("C4", "E4", "G4", "A4", "C5", "E5"):
        w(f"lead/square-{n.lower()}.wav", s_lead(n, square(0.5)))
        w(f"lead/pulse-{n.lower()}.wav", s_lead(n, square(0.25)))
        w(f"lead/tri-{n.lower()}.wav", s_lead(n, tri))

    for fx in ("coin", "jump", "laser", "powerup", "damage", "riser", "fall",
               "sweep_up", "sweep_down", "arp_major", "arp_minor", "select",
               "confirm", "zap", "tick"):
        w(f"fx/{fx}.wav", s_fx(fx))

    for bpm in (120, 140):
        for p in (1, 2, 3):
            w(f"loops/drums-{bpm}bpm-p{p}.wav", drum_loop(bpm, p))
    w("loops/bass-tri-132bpm.wav", bass_loop(132, ["C2", "C2", "G2", "C2", "A1", "A1", "F2", "G1"], tri))
    w("loops/bass-pulse-132bpm.wav", bass_loop(132, ["A1", "A1", "E2", "A1", "F1", "F1", "G1", "G1"], square(0.25)))
    w("loops/bass-square-120bpm.wav", bass_loop(120, ["C2", "E2", "G2", "E2", "F2", "A2", "G2", "B1"], square(0.5)))
    w("loops/bass-tri-140bpm.wav", bass_loop(140, ["D2", "D2", "A2", "D2", "Bb1", "Bb1", "C2", "C2"], tri))
    w("loops/arp-major-132bpm.wav", arp_loop(132, "C5", [0, 4, 7], 4))
    w("loops/arp-minor-132bpm.wav", arp_loop(132, "A4", [0, 3, 7], 4))
    w("loops/arp-major-140bpm.wav", arp_loop(140, "E5", [0, 4, 7, 12], 4))
    w("loops/arp-minor-120bpm.wav", arp_loop(120, "D5", [0, 3, 7, 10], 4))

    gen_midi(PACK / "midi")

    print(f"wrote {files} wav files + midi to {PACK}")
    zip_path = ROOT / "pocket-chip-kit.zip"
    with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
        for f in sorted(PACK.rglob("*")):
            if f.is_file():
                z.write(f, f.relative_to(ROOT))
    print(f"zipped -> {zip_path} ({zip_path.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
