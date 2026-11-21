# Cadence — Windows build notes (2026-11-21)

**Source:** https://github.com/Toom68/cadence @ `main` (shallow clone, unmodified — built read-only in `private/cadence/`).
**Version:** 1.1.0 (`cadence-studio` crate, `cargo --version` = 1.100.0 stable, host `x86_64-pc-windows-msvc`).
**Built with:** `powershell -ExecutionPolicy Bypass -File scripts/windows-package.ps1` →
`dist/Cadence-1.1.0-windows-x64.zip` (repo's own packaging script — `cargo build --release --locked` + `--version` smoke check + zip).

## Artifacts

| File | Size | Purpose |
|---|---|---|
| `Cadence-1.1.0-windows-x64.zip` | 4,075,908 B (~3.9 MB) | The sellable product — contains `Cadence.exe` (10.1 MB, unsigned) |
| `screenshot.png` | 270 KB | Real capture of the running app on this Windows machine (window-only `PrintWindow`, no desktop content) |
| `LISTING.md` | — | itch.io listing copy + steps |

## Smoke test results (this machine, Windows)

| Check | Result |
|---|---|
| `Cadence.exe --version` | `Cadence 1.1.0`, exit 0 |
| `--list-instruments` | 7 built-ins + 196 pack presets listed |
| `--render-demo demo.wav` | Rendered "Afterglow" demo song, 18.5 s → 3.9 MB WAV in 0.81 s |
| GUI launch | Window opened as "Afterglow - Cadence", `Responding=True`, demo song loaded, `Audio ready`; screenshot taken; **process closed cleanly — no windows left open** |

`CADENCE_DATA_DIR` was pointed at a scratch dir during the smoke test so nothing was written to Thomas's real app-data folder.

## Honest caveats for buyers (already in LISTING.md)

- The exe is **unsigned** → Windows SmartScreen will show "Windows protected your PC"; click *More info → Run anyway*.
- Windows build was smoke-tested on one machine only; macOS build is not included in this zip.
- Cadence's source is free on GitHub — this listing sells a ready-built, tested binary (pay-for-convenience + support).
