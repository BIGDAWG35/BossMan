# Phase 12 — Weekly Systems Improvement Loop
**Status:** ✅ IMPLEMENTED — 2026-05-20
**Schedule:** Every Monday 08:00 AM local (cron job `2ba797d7ccfa`)
**Run mode:** no_agent — silent when healthy, report-only when issues found

---

## What Was Built

### Core Script: `~/.hermes/scripts/weekly-systems-improvement.sh`
Automated weekly audit checking:
- **PM2 services:** binance-bot, money-pipeline, squarepayouts, bakery, cloudflare-tunnel
- **Critical ports:** 8104 (Binance), 8020 (Money Pipeline), 8030 (SquarePayouts), 8040 (BakeryOps), 8100/8140/8001/8003 (Mission Control)
- **Hermes Gateway + CuaDriver:** LaunchAgent status + socket-based check
- **Cron jobs:** Binance/Crypto entries in system crontab
- **Binance Bot LIVE mode:** Paper vs Live, last trade log
- **Disk space:** Alert if >85% usage
- **Bot error log:** Recent error references in bot.log

**Exit behavior:**
- Exit 0 + silent when no issues found — **no report, no card, no message**
- Exit 0 + generate report when issues found — **report + cards only**

### Report Generator: `~/.hermes/scripts/systems-improvement-report.py`
Consumes raw check output, produces structured markdown:
- Per-project sections with severity icon (🔴 CRITICAL / 🟡 WARNING / 🟢 IMPROVE)
- Three-tier action per project: "address now / needs approval / nice to have"
- Auto-appends to `MEMORY_CAPTURE_LOG.md`
- Syncs to CLAW-Backup + GitHub

---

## Where Things Live

| Asset | Path |
|-------|------|
| Weekly audit script | `~/.hermes/scripts/weekly-systems-improvement.sh` |
| Report generator | `~/.hermes/scripts/systems-improvement-report.py` |
| Report output | `~/.hermes/knowledge/memory/SYSTEMS_IMPROVEMENT_YYYY-MM-DD.md` |
| CLAW-Backup mirror | `~/Desktop/CLAW-Backup/SYSTEMS_IMPROVEMENT/SYSTEMS_IMPROVEMENT_YYYY-MM-DD.md` |
| GitHub | `~/Projects/BossMan/SYSTEMS_IMPROVEMENT_YYYY-MM-DD.md` + `scripts/` |
| Cron job | Hermes cron `2ba797d7ccfa` — every Monday 08:00 AM |

---

## Kanban Cards Created

**Phase 12 parent card:** `t_phase12_01` (status: done)
**Sub-cards:**
| Card ID | Title | Status |
|---------|-------|--------|
| `t_phase12_02` | 12-01 — Weekly audit script | done |
| `t_phase12_03` | 12-02 — Report format + memory integration | done |
| `t_phase12_04` | 12-03 — Kanban integration | done |
| `t_phase12_05` | 12-04 — Mission Control widget | planned (deferred to Phase 13) |

**Issue cards from first run (2026-05-20):**
| Card ID | Project | Issue | Severity |
|---------|---------|-------|----------|
| `t_p12_issue_binancebot` | BinanceBot | 6 restarts, LIVE mode active | WARNING |
| `t_p12_issue_mc` | MissionControl | Ports 8001/8100/8140 not responding, 8003=healthy | WARNING |
| `t_p12_issue_bakeryops` | BakeryOps | Port 8040 not responding | WARNING |
| `t_p12_issue_hermes` | Hermes | cua-driver socket exists but process check inconclusive | IMPROVE |
| `t_p12_issue_cryptointel` | CryptoIntel | False positive — Hermes cron (not crontab) is correct pattern | IMPROVE |

---

## How Kanban Integration Works

When the weekly audit finds issues:
1. **One card per project** (NOT one card per check — no spam)
2. Card title: `[PROJECT:Name][SEVERITY] Short description`
3. Card body: YAML frontmatter + three action tiers
4. All linked to `t_phase12_01` parent
5. Card status: `ready` (not `running` until work starts)
6. Only created when at least one issue is found

**No cards created when healthy** — this is the core "no spam" guarantee.

---

## Mission Control Widget — Deferred

Card `t_p12_issue_mc` (12-04) is deferred to Phase 13 or later. The widget requires:
- `GET /api/systems-improvement/latest` endpoint on Mission Control
- Read most recent `SYSTEMS_IMPROVEMENT_*.md` file
- Display project → status → one-line recommendation
- Hide section if no report in last 7 days

This is a lightweight addition but not blocking Phase 12 operation.

---

## Tag Schema Used

- `[PROJECT:BinanceBot]` / `[PROJECT:MoneyPipeline]` / `[PROJECT:SquarePayouts]` / `[PROJECT:BakeryOps]` / `[PROJECT:Hermes]` / `[PROJECT:CryptoIntel]` / `[PROJECT:MissionControl]`
- `[PERFORMANCE]` — service is degraded or unstable
- `[WORKFLOW]` — process/cron issue
- `[TRADING]` — Binance Bot LIVE mode observation
- `[IMPROVE]` — nice-to-have improvement, not critical

---

## TOOLS/BRAINS USED

| | Used |
|---|---|
| Perplexity Search | No |
| Perplexity Computer | No |
| OpenAI | No |
| DeepSeek | No |
| Claude | No |
| **MiniMax 2.7** | ✅ Yes — all orchestration, script writing, DB ops, file writes, Git, sync |

---

## Next Steps (Phase 13)

1. Implement Mission Control widget (12-04 — deferred)
2. Fix false positive: update `weekly-systems-improvement.sh` to also check Hermes cron jobs (not just system crontab) for CryptoIntel
3. Fix Binance Bot 6-restart investigation
4. Investigate BakeryOps port 8040 issue

---

## Example Report Output

```markdown
# Systems Improvement Report -- 2026-05-20

**Generated:** 2026-05-20 19:16:49 via Phase 12 Weekly Systems Improvement Loop
**Schedule:** Every Monday 08:00 AM local
**Trigger:** 5 project(s) with issues or improvement opportunities

---

## [BinanceBot] 🟡 WARNING

- **What we can address now:** Check logs, monitor for pattern, restart if needed.
- **What needs Marcelo's approval:** Only if persists beyond 1 week.
- **What could be better:** Investigate why binance-bot restarts frequently.

**Details:**
  - [WARNING] binance-bot has 6 restarts — possible instability (uptime: 0h 0m)
  - [UNKNOWN] [TRADING] Binance Bot is in LIVE mode — monitor closely
```