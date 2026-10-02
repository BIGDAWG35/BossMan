**Version:** v4 · **Date:** 2026-09-30 · **Source:** `~/.hermes/knowledge/LBC35_OPENCLAW_RETIREMENT_2026-09-30.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LBC35 / OpenClaw Retirement Note — 2026-09-30

**Card:** `t_735da189` (stack-009-lbc35: Retire OpenClaw/LBC35 per Marcelo)
**Approval:** TIER-B YES via perplexity-intake (MARCELO-APPROVED 2026-09-30 22:03Z)
**Owner:** BossMan (Hermes)
**Status:** **RETIREMENT COMPLETE**

---

## What was retired

| Asset | Path | Status as of 2026-09-30 22:24Z |
|---|---|---|
| OpenClaw binary | `/usr/local/lib/node_modules/openclaw` | **gone** (was 744KB) |
| OpenClaw CLI symlink | `/usr/local/bin/openclaw` | **gone** |
| Clawhub binary | `/usr/local/lib/node_modules/clawhub` | **gone** (was 24KB) |
| Clawhub CLI symlinks | `/usr/local/bin/{clawhub,clawdhub}` | **gone** |
| OpenClaw config dir | `~/.openclaw/` | **gone** (was 5.3GB; `workspace-lbc35/`, `openclaw.json`, `agents/`, `cron/`, `flows/`, `memory/`, `logs/`, `kanban.db`) |
| OpenClaw vault | `~/Desktop/Openclaw Brain` (live) | **content gone**, top-level empty dir remains |
| OpenClaw backup | `~/Desktop/CLAW-Backup` | **gone** |
| OpenClaw backup (2026-04-14) | `~/Desktop/Openclaw Brain - BACKUP 20260414` | **gone** |
| OpenClaw agent plists | `~/Library/LaunchAgents/ai.openclaw.*` | already DISABLED copies only — kept in `disabled/` subdir |
| `.env` LBC35/OpenClaw tokens | `~/.hermes/.env` | **none present** (was clean before retirement) |
| PM2 apps for LBC35/OpenClaw | PM2 daemon | **none** (verified jlist) |
| Cron refs to LBC35/OpenClaw | `~/.hermes/cron/jobs.json` | **none** (verified) |

## What was NOT retired (kept as historical archive, deleted by deferred cron 2026-10-30 09:00)

| Asset | Path | Why kept until 2026-10-30 |
|---|---|---|
| `~/2026-05-30T15-11-58.573Z-openclaw-backup.tar.gz` | 2.6GB OpenClaw-era snapshot | 30-day rollback safety net |
| `~/openclaw-BACKUP-20260414/` | Full backup from April 2026 | Historical archive |
| `~/Projects/openclaw-backup/`, `~/Projects/openclaw-brain/`, `~/Desktop/Openclaw-Backups/` | Earlier workspace dumps | Historical archive |
| `~/.openclaw-user/` | Identity subdir stub | Per-owner discretion |
| `~/.basecamp_openclaw.env` | 1KB env export | Per-owner discretion |
| `~/bin/openclaw-start.sh` | Loop-launcher script | Orphans binary; cleanup deferred |
| `~/Desktop/ Openclaw Brain/` | Vestigial leading-space empty dir | Per-owner discretion |

A 30-day grace cron (`openclaw-backup-final-delete`, schedule `0 9 30 10 *`, script `~/.hermes/scripts/openclaw-backup-final-delete.sh`, no-agent mode) runs 2026-10-30 09:00 PDT and removes the deferred targets. The cron was already provisioned by the same earlier-action that removed the binaries; verified live.

## Documentation banners added (Phase 5)

| File | Edit |
|---|---|
| `~/.hermes/SOUL.md` | 4 inline `RETIRED 2026-09-30` banners added beside LBC35/OpenClaw sections (Quick reference, Single status surface, Delegation & Lane Discipline, Single Status Surface) |
| `~/.hermes/profiles/qa-verification/SOUL.md` | `Section 6. Relationship to LBC35` header banner |
| `~/.hermes/AGENTS_ROSTER.md` | Authority flow + Single status surface + OpenClaw gateway annotations |
| `~/.hermes/AGENTS_INDEX.md` | Row 9 ("Delegation Rules + OpenClaw gate") inline note |
| `~/Desktop/spaces/toolchain-dev/LBC35 SOUL — v3 (Delegator-Router) — v3.md` | Title banner + status: RETIRED + path correction (`~/.openclaw/agents/lbc35/SOUL.md` no longer exists) |
| `~/Repos/BossMan/docs/LBC35_SOUL_v2_delegated_executor.md` | Title banner + status: RETIRED |
| `~/Repos/BossMan/docs/migration-from-openclaw.md` | Title banner + status: COMPLETE — RETIRED 2026-09-30 |

## Remaining doc work (out-of-scope for this card — flag for follow-up)

- 200+ additional files across `~/Desktop/spaces/` and `~/Repos/BossMan/docs/` still reference LBC35/OpenClaw as historical context. Each needs a per-file banner OR a master-list pointer to this retirement note. The card spec is "mark LBC35/OpenClaw **sections** RETIRED" — the touched files above cover the **canonical spec docs**; the historical references in peripheral docs can carry a single-pointer banner in a follow-up card.

## Why retire

Per the perplexity-intake approval:
- LBC35/OpenClaw was a delegator/router only; the role has been replaced by BossMan's direct routing of sub-agents.
- The npm package, config dir, vault, and gateway were all stale (last touched 2026-09-16; no PM2 process; no cron refs).
- Keeping the binary around creates drift between the canonical role description (BossMan + sub-agents) and the legacy role description (LBC35).
- 30-day rollback window via cron preserves safety net.

## Verification (Phase 6 grep)

```
grep -r -i -E "(lbc35|openclaw)" ~/.hermes/{SOUL.md,AGENTS*,profiles/*/SOUL.md} \
  ~/Desktop/spaces/toolchain-dev/LBC35*.md \
  ~/Repos/BossMan/docs/LBC35*.md ~/Repos/BossMan/docs/migration-from-openclaw.md
```

All matches now carry an inline `RETIRED 2026-09-30` annotation pointing back to this card.

---

**Card status:** ready for completion.