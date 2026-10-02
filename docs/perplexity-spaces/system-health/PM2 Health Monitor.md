**Version:** v4 · **Date:** 2026-09-29 · **Source:** `~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED_PM2_HEALTH_MONITOR.md — PM2 Health Monitor canon
**Permanent 2026-05-28, upd 2026-07-22, pruned 2026-09-23 (t_86e6d0f0): 5,065 → ~5 KB. Cron:** `01dff7ff61e4` (bossman, every 15 min) — silent healthy; alerts only on repair.
**Pruned 2026-09-28 (t_481b94f8): 13,473 → ≤5 KB. Per-incident detail moved to `LEARNED_PM2_HEALTH_MONITOR_INCIDENTS.md`.**

## Skill: pm2-health-check
Runbook: `~/.hermes/skills/devops/pm2-health-check/SKILL.md`.

**Detection:** EADDRINUSE · High restart count · PM2 daemon drift · Route-not-responding · Orphan process · 5xx rate · Next.js stale build · Unstable restart loop

**Repair:** R1=PM2 drift · R2=EADDRINUSE orphan · R3=Next.js rebuild (stop→rm -rf .next→build→start→verify) · R4=unhealthy-online restart · R5=full daemon recovery

### Next.js Permanent Rule
**Never `pm2 restart` alone for build crashes.** Required:
```bash
pm2 stop <svc> && rm -rf .next && npm run build && pm2 start <svc>
# Verify: PM2 online + curl canonical route 200/307 + pm2 save
```

### Port Map (post-2026-07-22)
`pmd-web:7575(basePath=/pmd)` · `pmd-api:7576` · `binance-bot:8104` · `health-os-v3:8121` · `money-pipeline:8020` · `health-os-v4:3535` · `budgeting-software:8145` · `travel-os:3537`

### Verification After Any Repair
PM2 online ✓ · curl canonical route 200/307 ✓ · pm2 save ✓

### Drift Surfaces + Security Watch
Non-trivial incidents require **2 of {Claude, DeepSeek, OpenAI}** to agree before executing. Card `t_e56d53cd` (`GOAL-LOOP-SECURITY_PM2.md`). **STOPs:** No PM2 deletes, port changes, service restarts, SOUL/AGENTS/ROUTING-RULES edits. P1+ → separate fix card.

### Sibling Per-Incident Canon
Full detail for the appended sections below lives in `LEARNED_PM2_HEALTH_MONITOR_INCIDENTS.md` (co-located). One-line pointers:

| Section (was) | Card / topic |
|---|---|
| Zombie PM2 Daemon Cleanup | 2026-07-22 permanent |
| PM2 CLI Usage Policy (two-mode wrapper) | `t_60a3ec59` (2026-09-28) |
| pmd-web Auto-Repair Rule | 2026-07-22 permanent |
| Drift-Check Write-Protection | 2026-07-22 permanent |
| PM2 v5.4.2 jlist shape (`pm2_env`) | `t_d67b13db` (2026-09-28) |
| travel-os Next.js cwd | `t_d67b13db` (2026-09-28) |
| Concurrency Guard: heartbeat-mtime PRIMARY | `t_32ef5c9f` (2026-09-28) |
| FINAL LOCK RELEASE on clean exit | `t_714b95d1` (2026-09-28) |
| D16 RE-VERIFY DEDUP (calendar-day → 23h rolling window) | `t_c5b3e477` + `t_d304cf82` (2026-09-28/29) |

**When in doubt, treat `LEARNED_PM2_HEALTH_MONITOR.md` as the source of truth for *rules*; treat the INCIDENTS sibling as source of truth for *rationale + reproduction + command snippets*.** On-disk canon and cron-prompt canon MUST stay aligned — drift > 5 KB trips the cron guard and falls back to embedded job-prompt canon (degraded mode, not fatal).