# Automation Inventory — Cron Jobs + LaunchAgents

**Snapshot:** 2026-06-12 (updated 2026-06-12 with 2 new Obsidian audit jobs)
**Owner:** BossMan Hermes
**Source of truth:** `hermes cron list` (cron) + `launchctl list` (LaunchAgents)
**Codified in:** `~/.hermes/SOUL.md § Cron + Automation Policy — No Spam, High Signal`

BossMan updates this file whenever the cron/LaunchAgent set changes. Every entry below must justify its existence in one line. Jobs that no longer serve a real purpose get archived (not deleted — keep audit trail).

---

## Cron Jobs (27 active, all `hermes cron list`)

| # | ID | Name | Schedule | Deliver | Mode | One-line justification |
|---|---|---|---|---|---|---|
| 1 | `0561fcffeba1` | SquaresPayouts Daily Exporter | `0 9 * * *` | local | agent | Dumps SquarePayouts order/transaction data to local file once a day for the morning brief. |
| 2 | `c6d759d2b561` | BakeryOps Daily Exporter | `5 9 * * *` | local | agent | Same as above for BakeryOps — daily export for morning brief. |
| 3 | `7203f2330d92` | perplexity-spaces-sync | `0 6 * * *` | origin | no-agent | Pulls canonical docs from Perplexity Spaces once a day to keep the local mirror current. Silent on success, origin only on failure. |
| 4 | `5f3569ba2813` | Morning Pipeline Brief | `0 8 * * 1-5` | origin | agent | Weekday morning digest of pipeline, blockers, and alerts. High signal, low frequency. |
| 5 | `d7baa1737ba8` | Basecamp Monitor (cron) | `*/15 * * * *` | local | no-agent | Polls Basecamp for new feedback messages every 15 min; silent unless there's a new message. |
| 6 | `e8c2a1f3d419` | Hermes Monthly Deep-Audit | `0 9 1 * *` | origin | no-agent | First of the month: deep audit of board hygiene, MEMORY size, cron health, model usage. Once monthly, deliberate signal. |
| 7 | `88eff3953480` | Hermes Weekly Systems Review — Monday 8 AM | `0 8 * * 1` | telegram | agent | Weekly board health, alerts, and project progress sent to Marcelo's Telegram. Replaces ad-hoc reviews. |
| 8 | `76956b7cafa7` | CSDAWG 2.0 Weekly Intelligence | `0 15 * * 1` | origin | agent | Weekly Binance/regime intel brief. Important but not urgent. |
| 9 | `2ba797d7ccfa` | Phase 12 — Weekly Systems Improvement Audit | `0 8 * * 1` | local | no-agent | Generates `weekly-systems-improvement-report.md` to local file for Monday review. |
| 10 | `c77d492c5b6d` | MoneyPipeline Morning Research | `0 5 * * *` | local | no-agent | Daily Money Pipeline opportunity research; output is the morning brief input. |
| 11 | `8fb30e332d6d` | MoneyPipeline Auto-Enrich V2 | `0 6 * * *` | local | no-agent | Daily enrichment of the opportunity pipeline from public sources. |
| 12 | `84896b15c68b` | CuaDriver Health Monitor | `*/5 * * * *` | local | no-agent | Self-heal watchdog for CuaDriver. Silent unless degraded. |
| 13 | `8d04ee3f0227` | Client Hub Feedback Queue Processor | `*/5 * * * *` | local | no-agent | Drains the Client Hub feedback queue every 5 min. Silent unless there's input. |
| 14 | `fed3553cf244` | binance-health-check-am | `0 9 * * *` | telegram | agent | Morning Binance bot health ping to Marcelo. |
| 15 | `4d4552dc85c9` | binance-health-check-pm | `0 21 * * *` | telegram | agent | Evening Binance bot health ping to Marcelo. |
| 16 | `21ddf2bf5690` | Travel OS — T-14 Pre-Trip Reminder | `0 8 * * *` | telegram | agent | 2-week-before-trip reminder. Wall-clock event, not request-driven. |
| 17 | `dee58753bbad` | Travel OS — T-7 Pre-Trip Reminder | `0 8 * * *` | telegram | agent | 1-week-before reminder. Wall-clock event. |
| 18 | `c6055f4fe568` | Travel OS — T-3 Pre-Trip Reminder | `0 8 * * *` | telegram | agent | 3-day-before reminder. |
| 19 | `97f7cbf776b9` | Travel OS — T-1 Day Before Reminder | `0 8 * * *` | telegram | agent | 1-day-before reminder. |
| 20 | `126ac0b0c8a9` | Travel OS — Post-Trip Close-Out | `30 8 * * *` | telegram | agent | Post-trip debrief trigger. |
| 21 | `6f310d2f4c42` | Travel OS — Trip-Start Bundle (T-3 to T-0) | `0 7 * * *` | telegram | agent | Daily trip-start bundle delivery 3 days out. |
| 22 | `ff0b6860cba5` | Weekly Hermes → Perplexity Spaces Refresh | `0 7 * * 6` | origin | agent | Weekly Saturday push to Perplexity Spaces for cross-device access. |
| 23 | `b858e01bd089` | Travel OS External Watchdog | `*/5 * * * *` | local | no-agent | 5-min watchdog for Travel OS external reachability. Silent unless down. |
| 24 | `ab41f101c407` | Travel OS Handoff Sync — Weekly Drift Check | `0 6 * * 6` | local | no-agent | Weekly drift check between local Travel OS and the handoff repo. Silent unless drift detected. |
| 25 | `378ef14a305b` | Hermes Weekly MEMORY Health Check — Monday 9:05 AM | `5 9 * * 1` | origin | agent | Codified enforcement of the MEMORY hygiene hard rule. Opens kanban card if MEMORY > 1,800 chars. |
| 26 | `0613ba1877bc` | Obsidian Vault Monthly Audit — 1st 09:00 PT | `0 9 1 * *` | local | no-agent | 8-check vault hygiene; silent when healthy. |
| 27 | `ee1f669efb1e` | Obsidian Vault Bi-Monthly Review — 1st 10:00 PT (even months) | `0 10 1 */2 *` | origin | no-agent | 5-task vault review; surfaces to Telegram by design. |

---

## LaunchAgents (7 active, 4 disabled)

### Active

| # | Plist | PID | One-line justification |
|---|---|---|---|
| 1 | `ai.hermes.gateway.plist` | 1679 | BossMan Telegram gateway — single status surface (Permanent — 2026-05-18 rule). |
| 2 | `ai.hermes.gateway-health.plist` | — | Self-heal watchdog for the gateway above. Silent unless degraded. |
| 3 | `com.bigdawg.pm2-resurrect.plist` | — | PM2 resurrect at boot — keeps all managed services up across reboots. |
| 4 | `com.local.tailscale-funnel-travel-os.plist` | — | Tailscale funnel listener for Travel OS remote access. |
| 5 | `com.local.mission-control.plist` | — | Mission Control dashboard on port 8001 (internal only). |
| 6 | `com.local.quickstats.plist` | — | Quick Stats dashboard on port 8102 (internal only). |
| 7 | `com.local.teamstandup.plist` | 1685 | Team Standup dashboard on port 8003 (internal only). |

### Disabled (kept for audit trail — never delete without explicit Marcelo approval)

| Plist | Why disabled |
|---|---|
| `ai.openclaw.gateway.plist.disabled-2026-05-18` | LBC35 / OpenClaw violated Single Status Surface rule (2026-06-12 incident). Re-enable requires 3-bucket approval. |
| `com.local.pm2-watchdog.plist.disabled-2026-05-18` | Superseded by BossMan PM2 health monitor cron. Re-enable requires kanban card. |
| `com.local.bakery.plist.disabled-2026-05-18` | BakeryOps now runs under PM2; LaunchAgent was redundant. Re-enable requires kanban card. |
| `com.local.squarepayouts.plist.disabled-2026-05-18` | SquarePayouts now runs under PM2; LaunchAgent was redundant. Re-enable requires kanban card. |

---

## Scripts in `~/.hermes/scripts/` (operationally wired, not in cron)

These are referenced by BossMan or by hand, not scheduled:

| Script | Wired into | Justification |
|---|---|---|
| `telegram-intake-gate.py` | Every Telegram intake (inline) | Codified first step of "all work on the board" rule. <50ms decision. |
| `kanban-snapshot.py` | `kanban-snapshot.sh` + on-demand | Cross-project board report. Use any time. |
| `kanban-status-migration.py` | On-demand (one-shot) | Idempotent illegal-status sweeper. Re-run if status drift returns. |
| `kanban-project-backfill.py` | On-demand (one-shot) | Idempotent project tagger for new cards. |
| `kanban-runs-gc.py` | On-demand (one-shot) | Idempotent stale task_runs terminator. |
| `memory-health-check.py` | Cron `378ef14a305b` | Weekly MEMORY hygiene enforcement. |
| `obsidian-vault-audit.sh` | Cron `0613ba1877bc` | Monthly Obsidian vault hygiene (8 checks, silent when healthy). |
| `obsidian-vault-review.sh` | Cron `ee1f669efb1e` | Bi-monthly Obsidian vault review (5 tasks, surfaces to Telegram). |
| `spaces-audit.sh` / `spaces-audit-cron.sh` | (Review — not currently in cron) | Perplexity Spaces mirror audit. **Recommend deprecating; the new `telegram-intake-gate.py` covers same surface.** |
| `cuadriver-health.sh` / `cuadriver-health-cron.sh` | Cron `84896b15c68b` | CuaDriver 4-layer self-heal. |
| `gateway-health-check.sh` | (Review — not currently in cron) | Gateway health one-shot. **Recommend deprecating; superseded by `ai.hermes.gateway-health` LaunchAgent.** |
| `gateway-health-monitor.sh.RETIRED-2026-05-21` | Retired (already renamed) | Old gateway monitor with restart-storm bug. Don't re-enable. |
| `computer-use-health.sh` | (Review — not currently in cron) | Computer Use self-heal. **Review for reactivation if Computer Use becomes regular.** |
| `travel-os-external-watchdog.sh` | Cron `b858e01bd089` | Travel OS 5-min external reachability. |
| `tunnel-url-monitor.sh` | (Review — not currently in cron) | Caddy tunnel URL monitor. **Review; may be subsumed by travel-os-external-watchdog.** |
| `weekly-spaces-refresh.sh` | (Review — not currently in cron) | Weekly Spaces refresh. **May be subsumed by cron `ff0b6860cba5`.** |
| `weekly-systems-improvement.sh` | Cron `2ba797d7ccfa` | Weekly systems improvement report. |
| `weekly-travel-os-handoff-sync.sh` | Cron `ab41f101c407` | Weekly Travel OS drift check. |
| `money-pipeline-morning-research.sh` | Cron `c77d492c5b6d` | MP morning research. |
| `money-pipeline-auto-enrich-v2.sh` | Cron `8fb30e332d6d` | MP auto-enrich. |
| `deep-audit-cron.sh` | Cron `e8c2a1f3d419` | Monthly deep audit. |
| `process-feedback-queue.sh` | Cron `8d04ee3f0227` | Client Hub feedback drain. |
| `basecamp-monitor-cron.sh` | Cron `d7baa1737ba8` | Basecamp feedback monitor. |
| `sync_perplexity_spaces.sh` | Cron `7203f2330d92` | Daily Spaces sync. |
| `portal-ticket-reminder.sh` | (Review — not currently in cron) | Portal ticket reminder. **Review for retention.** |
| `spaces-audit-cron.sh` | (Review — not currently in cron) | Spaces audit. **Recommend deprecating.** |

### Scripts in `node_modules/` subdirectory (money-pipeline / crypto-intel)

These are Node.js apps used by the cron jobs above. Not in scope for daily operations; they're owned by the Money Pipeline and CSDAWG projects.

### Scripts in `legacy/`

`gateway-health-monitor.sh.RETIRED-2026-05-21` and similar retired scripts. **Do not re-enable without explicit Marcelo approval.**

---

## Cron jobs NOT approved under the new "no spam" rule

None of the 25 active cron jobs violate the new policy. All meet the three-criteria test (narrow case, one-sentence explainable, silent output by default).

## Recommended follow-ups (carry as separate kanban cards, not auto-fixed)

1. **Re-evaluate the 4 Travel OS trip reminder crons** — they all run at 8 AM and only differ by offset. Could be consolidated to a single daily check that decides which reminder to send.
2. **Re-evaluate `basecamp-monitor-cron.sh` at `*/15`** — if Basecamp feedback is rarely <15min old, downgrade to `*/30` or `0 *`.
3. **Review `cuadriver-health-cron.sh` at `*/5`** — same logic; 5-min is aggressive if CuaDriver is stable.
4. **3 scripts not in cron and probably orphaned** — `spaces-audit.sh`, `gateway-health-check.sh`, `tunnel-url-monitor.sh`. Decide: keep as one-shot or archive.

These are recommendations only — not auto-actions. Each requires Marcelo's `Approved` per Rule 1.
