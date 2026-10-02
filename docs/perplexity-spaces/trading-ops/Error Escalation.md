**Version:** v4 · **Date:** 2026-10-02 · **Source:** `~/.hermes/knowledge/error-escalation.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# Error Escalation — When to Page Marcelo

> **2026-10-02 (MD audit Phase 4):** the live PM2 app is `binance-bot-live` (Binance.US spot, port 8104, live since 2026-10-01). Read every `binance-bot` below as `binance-bot-live`. PM2 autorestart is OFF on purpose (a crash stays down until BossMan's monitor restarts it, so a crash loop cannot burn money); the `autostart: true` line below is history. Current facts: `~/Desktop/spaces/trading-ops/Binance Bot - Current State.md`.

**Source of truth:** `~/.hermes/skills/troubleshooting-mode/SKILL.md` §7 (verbatim) + this file's "Live-Trading-Specific Escalation" section below.

**Updated:** 2026-06-16 (Phase 6 Track B launch). "Binance bot online" is no longer an alert condition. "Binance bot stopped" is now a L2/L3 alert **unless** a `label:maintenance` or `binance-bot` incident card exists on the kanban. Crypto is 24/7; the bot must be too.

---

## Binance Bot — Expected State (24/7 ONLINE, Phase 6 Track B)

`binance-bot` is expected to be **ONLINE 24/7** with `autostart: true` (per Phase 6 Track B, card `t_1c502da6`). `paperMode=false` is the live mode. The pre-start wrapper runs the 18/18 safe-start gate before the main process stays up.

**Page Marcelo when (Binance bot):**

- `binance-bot` is **STOPPED** AND there is no `label:maintenance` card AND no `binance-bot` incident card on the kanban. Severity: **L2/L3** (L2 if uptime < 1h, L3 if uptime > 1h — but always page).
- `restart_time >= 5` in 24h. Severity: **L2**.
- `/api/status` returns non-200, fails to respond, or shows `totalExposure > maxExposure * 1.10`, or any open position that does not match the most recent signal. Severity: **L2/L3** depending on magnitude.
- `pm2 logs` shows real errors — exceptions, crash loops, or any unhandled `Promise` rejection. Severity: **L2**.
- `cooldownActive=true` for more than 4 hours during a single UTC day. Severity: **L3** (likely balance or signal data problem).
- `dailyLimitHit=true` more than 2 days in a row. Severity: **L3** (likely a market-condition problem; do not auto-reset).

**DO NOT page Marcelo** just because `binance-bot` is online. ONLINE is the expected state under Phase 6 Track B.

---

## Page Marcelo immediately if any of these are true

| # | Trigger | Why |
|---|---------|-----|
| 1 | Binance bot is in a **crash loop** (≥2 restarts in 5 min) | Money at risk; needs human decision (stop, debug, or accept) |
| 2 | Money-pipeline has **≥ 10 restarts** OR is **unresponsive** | Money flows are the highest-stakes surface |
| 3 | **Telegram gateway** disconnected | No user notifications get through |
| 4 | **Tailscale VPN** disconnected | BossMan loses access to remote Mac minis |
| 5 | Any critical service **completely unresponsive** (not just slow) | `pm2 status` says errored / stopped; no HTTP response on the canonical port |
| 6 | **HTTP 401/403 from Binance.US** | API key compromised → must rotate + revoke prior key |
| 7 | **OOM kill (exit 137) twice in 24h** | Memory leak; trading logic may be unstable |
| 8 | **Balance divergence >5%** between internal / API / Binance | Reconciliation gap → possible silent trade loss |
| 9 | **intelligence.json older than 7 days** | Stale intel; bot may be making blind decisions |
| 10 | **Pre-trade hook REJECT count > 5 in 1 hour** | Anomalous signal stream or signal-source bug |

---

## Do NOT page Marcelo for these (changed 2026-06-16, Phase 6 Track B)

- ❌ Binance bot going from `stopped` → `online` — **this is the expected transition** under Phase 6 Track B
- ❌ Routine 9 AM / 9 PM PDT health check PASS
- ❌ `pm2 save` output
- ❌ `git pull` output
- ❌ `crontab -l` listing
- ❌ Pre-trade hook single-instance REJECT (one bad signal is normal)
- ❌ Routine restart after a single crash (1 restart = noise, 2+ = pattern)

---

## ALERT block format (use this exact template)

```
ALERT <Service/Job Name>
Status: <current>
Expected: <should be>
Restart count: <N>
Last good timestamp: <ISO>
Actions tried: <short bullet list>
Needs your decision on: <specific question, one line>
```

If the issue is not in the escalation table but is high-stakes (e.g., a fix that requires touching live trading config), still surface it for approval, but format as "Proposed action — needs A/B/C" rather than a hard ALERT.

---

## Live-Trading-Specific Escalation (Phase 6 Track B, 2026-06-16)

These conditions fire ALERT blocks for the binance-bot specifically. The general rule: a single data point is noise; a pattern is an alert.

### Crash loop (ALERT Binance Bot)
- **Trigger:** `pm2 describe binance-bot | grep restart_time` shows 2+ restarts in 5 min
- **First action:** `pm2 stop binance-bot` — do not let it loop forever with real money at risk
- **Then:** `pm2 logs binance-bot --err --lines 200` to capture the error
- **ALERT:** status=crash_loop, expected=stable, restart count=N, last good=ISO, actions tried=[pm2 stop, captured logs], needs decision on=root cause and fix

### API key compromise (ALERT Binance API Auth)
- **Trigger:** HTTP 401/403 from any `/api/*` endpoint, or `code: -2015` from Binance
- **First action:** `pm2 stop binance-bot` immediately
- **ALERT:** status=auth_failed, expected=200, restart count=N, last good=ISO, actions tried=[pm2 stop, captured error], needs decision on=key rotation

### OOM kill (ALERT Binance Bot Memory)
- **Trigger:** exit code 137, twice in 24h
- **First action:** `pm2 stop binance-bot`
- **ALERT:** status=oom_kill, expected=stable memory, restart count=N, last good=ISO, actions tried=[pm2 stop, captured pm2 logs], needs decision on=memory leak or raise max_memory_restart

### Balance divergence (ALERT Binance Balance Reconciliation)
- **Trigger:** internal balance vs API vs Binance differ by >5%
- **First action:** `pm2 stop binance-bot` to prevent further drift
- **ALERT:** status=divergence, expected=±2% (internal vs API) or ±5% (API vs Binance), restart count=N, last good=ISO, actions tried=[pm2 stop], needs decision on=reconciliation strategy

### Stale intel (ALERT Binance Intelligence)
- **Trigger:** `intelligence.json` mtime > 7 days old
- **First action:** none — bot will still trade on stale signals but with reduced confidence
- **ALERT:** status=stale, expected=fresh (≤24h), restart count=0, last good=ISO, actions tried=[checked mtime], needs decision on=refresh intel or reduce position size

### Anomalous reject stream (ALERT Pre-Trade Hook)
- **Trigger:** REJECT count > 5 in 1 hour
- **First action:** none — bot is correctly refusing bad signals
- **ALERT:** status=high_reject_rate, expected=0-2/hour, restart count=0, last good=ISO, actions tried=[checked hook log], needs decision on=signal source bug or genuine market regime shift

---

## Routing rule

When an ALERT fires, BossMan sends the block to Marcelo via Telegram (home channel). If the alert is "stop and decide" (crash loop, auth failed, OOM, divergence), the bot is **already stopped** by the time the alert goes out. If the alert is "monitor and decide" (stale intel, high reject rate), the bot stays online.

When in doubt: `pm2 stop binance-bot` is always the safer default. Reversing a stop takes one command; reversing live trades does not.
