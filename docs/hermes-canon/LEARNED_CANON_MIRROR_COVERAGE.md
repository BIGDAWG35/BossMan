# LEARNED_CANON_MIRROR_COVERAGE.md — Every Tracked Canon File Must Have a Live Mirror Pair

**Status:** Permanent (2026-10-30, Card `t_drift_fix_v3_canon_20261030_135346`).
**Purpose:** Close the silent-drift class where a canon file is tracked by the drift-check but has **no** entry in `~/.hermes/config/canon_mirrors.json`, so the mirror sync can never refresh it.

---

## The failure mode

Three independent mechanisms exist, and they do **not** share a file list:

| Mechanism | Script | File list source | Scheduled |
|---|---|---|---|
| Mirror **sync** (writes) | `~/.hermes/scripts/canon_mirror_sync.py` | `~/.hermes/config/canon_mirrors.json` → `pairs` | daily (`canon-mirror-sync`, `d42e39ae95a4`) |
| Mirror **drift-check** (detects) | `~/.hermes/scripts/hermes-canon-drift-check.sh` | inline `CANON_FILES` array | weekly (`hermes-canon-drift-check-weekly`, `8ec521e1ccd9`) |
| Legacy **canon sync** | `~/.hermes/scripts/hermes-canon-sync.sh` | inline `CANON_FILES` array | **not scheduled** (manual/operator only) |

A file can be in the drift-check's `CANON_FILES` and still be absent from `canon_mirrors.json`. In that case the sync job silently skips it, the mirror rots, and the drift-check reports drift that **no scheduled job can fix** — it surfaces a card that re-runs `hermes-canon-sync.sh`, which does not cover the file either. The loop dead-ends.

`hermes-canon-sync.sh` is **not** the tool that fixes drift. It is unscheduled, and its `CANON_FILES` list is a third, independent list. `canon_mirror_sync.py` (config-driven) is the only scheduled writer.

## The 2026-10-30 instance (SOUL.md)

- `hermes-canon-drift-check.sh` tracks `SOUL.md` and `AGENTS.md` as kernel files (raw md5, no frontmatter stripping).
- `canon_mirrors.json` had `SOUL.md` → Obsidian only. **No `SOUL.md` → GitHub pair.**
- Result: `~/Repos/BossMan/docs/hermes-canon/SOUL.md` froze at the 2026-10-02 model-stack state (`MiniMax-M3` / `MiniMax-M2.7`) while canon moved to `MiniMax-M3.1-Flash` on 2026-10-28 (cards `t_e5ef887c`, `t_54c7dc11`). Obsidian tracked correctly the whole time because it *had* a pair.
- Fix: added the two missing pairs (SOUL.md → gh, AGENTS.md → gh) to `canon_mirrors.json`, re-ran `canon_mirror_sync.py`, committed. Drift-check went to **0**.

## Rules

1. **Adding a file to a drift-check list is not enough.** The same file must get a `canon_mirrors.json` pair for every mirror the drift-check compares it against. This has already bitten twice — `LEARNED_INDEX.md` and `LEARNED_BLENDER_LTS.md` (both, 2026-07-22 / 2026-07-30) — and again for `SOUL.md` / `AGENTS.md` (2026-10-30).
2. **`canon_mirrors.json` is the single source of truth for what gets mirrored.** `hermes-canon-sync.sh` is legacy and unscheduled. Do not use it as the remediation for a drift card.
3. **The drift-check now enforces rule 1.** It cross-checks every tracked file against `canon_mirrors.json` and reports `MIRROR-PAIR MISSING` as drift, so a missing pair surfaces as a card *before* the mirror rots, instead of after.
4. **Canon always wins.** Mirrors are one-way copies. Never hand-edit a mirror to "fix" drift — the mirror is wrong, the canon is right, and the fix is to re-run `canon_mirror_sync.py`.

## Verification

```bash
# 1. Is anything stale right now? (read-only)
/Users/bigdawg/.hermes/hermes-agent/venv/bin/python3 ~/.hermes/scripts/canon_mirror_sync.py --check

# 2. Refresh mirrors from canon (one-way, backs up old copies)
/Users/bigdawg/.hermes/hermes-agent/venv/bin/python3 ~/.hermes/scripts/canon_mirror_sync.py

# 3. Authoritative drift verification (also writes a card on drift — expected to be silent)
/bin/bash ~/.hermes/scripts/hermes-canon-drift-check.sh --verbose
```

`canon_mirror_sync.py` backs up replaced mirror copies to `~/Backups/canon-mirror-sync/<ts>/` and auto-commits `docs/hermes-canon/` in `~/Repos/BossMan`. It does **not** push; `build_spaces_v4.py` (daily 06:00) owns the push to `origin/main`.

## Related

- `LEARNED_DOC_PIPELINE.md` — which copy of a doc wins; mirror + Perplexity Projects sync.
- `LEARNED_INDEX.md` — master map of all `LEARNED_*` canon files.
- `BOSSMAN_DRIFT_CHECK.md` — the periodic stack drift-check prompt.
