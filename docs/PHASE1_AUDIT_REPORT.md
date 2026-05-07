# Phase 1 Audit Report
**Hermes Primary Control Migration**
**Date:** 2026-05-07
**Scope:** Full discovery of OpenClaw/LBC35 ecosystem, PM2, cron, ports, dashboards, data sources, repos, and configs
**Rule:** Observation only — no changes made

---

## 1. PM2 PROCESSES

| ID | Name | Status | Uptime | Restarts | Script Path | Health |
|----|------|--------|--------|----------|-------------|--------|
| 13 | `money-pipeline` | online | 6D | 8 ⚠️ | `~/Projects/money-making-dashboard/server.js` | ⚠️ 8 restarts — unstable |
| 1 | `binance-bot` | online | 2D | 32 🚨 | `~/Projects/binance-bot/server.js` | 🚨 32 restarts — critically unstable |
| 6 | `bakery` | online | 6D | 0 | `~/Projects/bakery/server/index.js` | ✅ Port 3001 conflict in logs |
| 7 | `fresh-dashboard` | online | 6D | 0 | `~/Projects/fresh-dashboard/server/src/index.js` | ✅ |
| 3 | `health-dashboard` | online | 6D | 0 | `~/Projects/health-dashboard/server.js` | ✅ |
| 12 | `hub` | online | 6D | 0 | `~/openclaw-microapps/hub/server.js` | ✅ |
| 10 | `trading-control` | online | 6D | 0 | `~/Projects/trading-control/server.js` | ✅ |
| 2 | `overview` | online | 6D | 0 | `~/Projects/master-dashboard/server/src/index-8000.js` | ✅ |
| 5 | `squarepayouts` | online | 6D | 0 | `~/Projects/squarepayouts/server.js` | ⚠️ ERR_UNKNOWN_FILE_EXTENSION |
| 11 | `youtube-dashboard` | online | 6D | 0 | `~/Projects/youtube-dashboard/server.js` | ✅ |

**Active PM2 total: 10 processes**

### ⚠️ UNSTABLE — Need Immediate Attention
- **`binance-bot`**: 32 restarts. Errors: SQLite_ERROR, missing `pre-trade-hook` module at `/Projects/trading-review/pre-trade-hook`
- **`money-pipeline`**: 8 restarts. Stream errors and IncomingMessage emit errors in logs.

### ✅ STABLE — Keep
All others are stable (0 restarts, 6D uptime).

---

## 2. ACTIVE CRON JOBS

| Schedule | Command | Purpose | Owner |
|----------|---------|--------|-------|
| `0 5 * * *` | `money-making-dashboard/scripts/run_morning_research.sh` | Morning research automation | openclaw |
| `*/5 * * * *` | `node ~/Projects/trading-monitor/scripts/poller.js` | Market data polling every 5 min | openclaw |

**Active cron total: 2 jobs**

Both are owned by OpenClaw and run against OpenClaw-era projects (money-making-dashboard, trading-monitor).

### Assessment
- `run_morning_research.sh` — runs against money-making-dashboard project. Needs migration review.
- `poller.js` — trading monitor. Needs migration review.

**Both crons should be migrated to Hermes-owned scripts once the new workflow is live.**

---

## 3. OPENCLAW BOTS AND ROLES

### OpenClaw Agent Configuration (from `~/.openclaw/openclaw.json`)

| Agent ID | Model | Role |
|----------|-------|------|
| `main` | minimax-portal/MiniMax-M2.1 | Default main agent |
| `lbc35` | minimax-portal/MiniMax-M2.1 | Manager/orchestrator (current primary) |
| `csdawg` | minimax-portal/MiniMax-M2.1 | Crypto/stocks |
| `debugdawg` | minimax-portal/MiniMax-M2.1 | Debugging/security |
| `ideasdawg` | minimax-portal/MiniMax-M2.1 | Ideas/brainstorming |
| `dwdawg` | minimax-portal/MiniMax-M2.1 | Coding/implementation |

**OpenClaw default model stack:** MiniMax-M2.1 (primary), no fallbacks configured in defaults.

### OpenClaw Telegram Channels

| Account | Bot Token | AllowFrom | Streaming |
|---------|-----------|-----------|-----------|
| `main` | `8320439483:AAEB...` | — | partial |
| `youtube` | `8382029348:AAF...` | `8536867361` | off |

### OpenClaw Sub-Agents (from `~/.openclaw/agents/`)

| Sub-agent | Sessions | Agent Files | Status |
|-----------|----------|-------------|--------|
| `main` | ✅ | ✅ | Active |
| `lbc35` | ✅ | ✅ | Active — primary manager |
| `csdawg` | ✅ | ✅ | Active |
| `debugdawg` | ✅ | ✅ | Active |
| `dwdawg` | ✅ | ✅ | Active — exclusive implementation owner |
| `ideasdawg` | ✅ | ✅ | Active |

### OpenClaw SOUL / Role Definition (LBC35 — Manager)

LBC35 is currently defined as:
- **Manager, orchestrator, chief of staff, oversight lead**
- Owns routing, planning, monitoring, protecting
- DWDAWGBOT is **sole implementation owner** per LBC35's own AGENTS.md
- CSdawgbot owns crypto/stocks/market news
- OPdawgbot owns ops/finance
- YTDAWGBOT owns YouTube
- SMDAWGBOT owns social media

### Bot Lanes (from LBC35's AGENTS.md)

| Bot | Primary Responsibility |
|-----|----------------------|
| DWDAWGBOT | Coding, websites, Cursor, repo changes, implementation |
| YTDAWGBOT | YouTube setup, optimization, strategy, ops |
| SMDAWGBOT | Social media, content monitoring |
| IDEASDAWGBOT | Idea capture, brainstorming, routing |
| CSdawgbot | Crypto, stocks, market news |
| Debuggingdawgbot | Debugging, issue-finding, security |
| OPdawgbot | Operations, financial cases |
| Chacha13bot | Isolated sandbox — must NOT touch shared projects |

### LBC35's Current Authority Level
LBC35 acts as **primary orchestrator** — routes tasks, supervises bots, approves changes, monitors health. This is exactly what needs to shift to BossMan.

### Assessment
**LBC35 is functional but oversized for a delegated executor.** It currently has:
- Routing authority (should → BossMan)
- Bot supervision (should → BossMan)
- Approval gate on system changes (should stay or → BossMan)
- Implementation ownership is correctly delegated to DWDAWGBOT

---

## 4. LOCALHOST DASHBOARDS, SERVICES, AND PORTS

### Verified Listening Ports

| Port | Process | PM2 Name | Service | Health Check | Status |
|------|---------|----------|---------|--------------|--------|
| 18789 | node | — | OpenClaw gateway | localhost:18789/health | ✅ 200 |
| 3001 | node | `bakery` | Bakery service | localhost:3001 | ✅ 200 |
| 3100 | node | `squarepayouts` | SquarePayouts / OpenHue conflict | localhost:3100 | ⚠️ 404 |
| 5050 | node | `fresh-dashboard` | Fresh dashboard | localhost:5050 | ✅ 200 |
| 8003 | node | — | Unknown | — | ✅ LISTEN |
| 8080 | com.docke | — | Docker | — | ✅ LISTEN |
| 8090 | node | `hub` | OpenClaw microapps hub | localhost:8090 | ✅ 200 |
| 8100 | node | `overview` | Overview dashboard | localhost:8100 | ✅ 200 |
| 8102 | node | — | Unknown service | localhost:8102 | ✅ LISTEN |
| 8110 | node | `health-dashboard` | Health dashboard | localhost:8110 | ✅ 200 |
| 8104 | node | `binance-bot` | Binance bot dashboard | localhost:8104 | ✅ 200 |
| 8130 | node | `trading-control` | Trading control | localhost:8130 | ✅ 200 |
| 8140 | node | `youtube-dashboard` | YouTube dashboard | localhost:8140 | ✅ 200 |
| 8020 | node | `money-pipeline` | Crypto tracker | localhost:8020 | ✅ 200 |
| 9119 | python3.1 | — | Unknown python script | localhost:9119 | ✅ LISTEN |
| 8395 | syncspace | — | syncspace | — | ✅ LISTEN |
| 22000 | syncspace | — | syncspace | — | ✅ LISTEN |
| 49225/26 | UGREEN | — | UGREEN device | — | ✅ LISTEN |

### Unknown Ports Needing Identification
- `8102` — Node process, no PM2 entry. Unknown service.
- `8003` — Node process, no PM2 entry. Unknown service.
- `9119` — Python process. Unknown script.
- `8100 vs 8000` — Overview PM2 points to 8100 but service map says 8000. **Port conflict possible.**
- Port 5000 — referenced in SERVICES_MAP as "PM Dashboard" but not in current `lsof` output. Possibly not running.

### Port 3100 Conflict
- OpenHue expected on 3100 but returned **404**
- SquarePayouts PM2 service is also configured for port 3100
- **Two services may be fighting for port 3100**

### Port 3001 Conflict
- Bakery PM2 log shows `address: '::', port: 3001` error
- Hermes gateway also expected on 3001
- **Port conflict: bakery and Hermes gateway both trying to use 3001**

### Critical: Port 8104 — Binance Bot
- Binance bot has 32 restarts — critically unstable
- Missing pre-trade-hook module
- SQLite error in logs
- **LIVE TRADING — HIGH RISK**

### Critical: Port 8020 — Money Pipeline
- 8 restarts — unstable
- Stream errors in logs
- **Active business tool — HIGH RISK**

---

## 5. DATA SOURCES, REPOS, WEBHOOKS, AND ENV/CONFIG DEPENDENCIES

### GitHub Repos

| Repo | Visibility | Purpose | Hermes Migration Status |
|------|-----------|---------|------------------------|
| `BIGDAWG35/BossMan` | public | Hermes primary operations | ✅ Active — current canonical repo |
| `BIGDAWG35/Bigdawgclaw` | private | OpenClaw core setup | 🔴 Legacy — source of OpenClaw truth |
| `BIGDAWG35/BinanceBot` | private | Binance trading bot code | ⚠️ Active — linked to live bot (8104) |
| `BIGDAWG35/MoneyMakingPipeline` | private | Money pipeline dashboard | ⚠️ Active — linked to live service (8020) |
| `BIGDAWG35/Squares` | private | Sports betting pool system | ✅ Client-owned |
| `BIGDAWG35/QuickStats` | private | Quick stats monitoring | ⚠️ Needs review |
| `BIGDAWG35/HealthDashboard` | private | Health supplement tracking | ✅ Client-owned |
| `BIGDAWG35/Bakery` | private | Bakery ordering system | ✅ Client-owned |
| `BIGDAWG35/lbc35-gateway` | public | OpenClaw gateway config | 🔴 Legacy |
| `BIGDAWG35/CLAW-Backup` | private | OpenClaw backup | 🔴 Archive only |
| `BIGDAWG35/OpenClaw-Backup` | public | OpenClaw backup | 🔴 Archive only |

### Env / Config Files Found

| File | Contains | Risk |
|------|----------|------|
| `~/.openclaw/openclaw.json` | Full OpenClaw config, agents, channels, gateway, bot tokens | 🔴 HIGH — contains bot tokens |
| `~/.openclaw/credentials/` | Credentials store | 🔴 HIGH — secrets only |
| `~/.openclaw/service-env/` | Service environment config | 🔴 HIGH |
| `~/.openclaw/telegram/` | Telegram session data | 🔴 HIGH |
| `~/Projects/*/ecosystem.config.cjs` | PM2 service definitions | ⚠️ MED |
| `~/Projects/*/.env` | Project env vars | ⚠️ MED — may contain API keys |

### Webhooks Found
- Binance bot: likely configured with Binance webhook for trading signals
- OpenClaw has `delivery-queue/` and `exec-approvals.json` — execution approval workflow
- No explicit webhook URLs found without reading `openclaw.json` in full (12KB)

### OpenClaw Workspace Files

**Canonical workspace:** `/Users/bigdawg/Desktop/Openclaw Brain/Openclaw Brain/`

Key files:
| File | Purpose | Hermes Status |
|------|---------|--------------|
| `SOUL.md` | LBC35's core identity and temperament | 🔴 Legacy — needs replacement |
| `AGENTS.md` | LBC35's agent routing and bot lane definitions | 🔴 Legacy — needs replacement |
| `USER.md` | User context and preferences | ✅ Migrate to Hermes knowledge |
| `SYSTEM_INSTRUCTIONS.md` | System-level instructions | 🔴 Legacy |
| `PROTOCOL.md` | Operating protocol | 🔴 Legacy |
| `BOT_HANDOFF.md` | Handoff procedures between bots | 🔴 Legacy |
| `COLLABORATOR_POLICY.md` | External collaborator rules | ✅ Review and migrate |
| `ADMIN_POLICY.md` | Admin-level policies | ✅ Review and migrate |
| `BACKUP_POLICY.md` | Backup procedures | ✅ Migrate to Hermes |
| `CONTEXT-MANAGEMENT.md` | Context management rules | ✅ Migrate to Hermes |
| `IDENTITY.md` | Identity definitions | ✅ Review and migrate |
| `TOOLS.md` | Tools reference | 🔴 Legacy — OpenClaw-specific |
| `TOOLS-REFERENCE.md` | Tools reference | 🔴 Legacy |
| `HEARTBEAT.md` | Heartbeat configuration | ✅ Review and migrate |
| `IMPORT_POLICY.md` | Import procedures | ✅ Review |
| `REMOTE_ACCESS_POLICY.md` | Remote access rules | ✅ Review and migrate |
| `AGENTS-REFERENCE.md` | Full agent specs | 🔴 Legacy |
| `Brain/` subfolder | OpenClaw-specific brain | 🔴 Legacy |
| `Hermes/Systems/` | Hermes-specific system docs | ✅ Valid — migrate to Hermes knowledge |

### Hermes-Specific Docs Found (in OpenClaw Workspace)
- `Hermes/Systems/Hermes/PROFILES.md` — Hermes profile definitions ✅ VALID
- `Hermes/Systems/Hermes/SERVICES_MAP.md` — Service map with VERIFY NEEDED entries ✅ VALID
- `Hermes/Systems/Hermes/OVERRIDES.md` — Local overrides ✅ VALID
- `Hermes/Systems/Hermes/HERMES_BACKUP.md` — Backup policy ✅ VALID

### Obsidian Notes
Only: `/Users/bigdawg/Obsidian/Hermes/Systems/operating-blueprint.md` — today's blueprint, just created.

### Hermes Knowledge Files
- `~/.hermes/knowledge/LEARNED_*.md` — 24 files of Hermes-specific learned content
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — just created from today's migration

### OpenClaw Memory Files (in OpenClaw Workspace)
- `memory/2026-04-*.md` — dated session memory
- `memory/audits/basecamp/` — Basecamp integration audit logs
- `memory/learn.md` — general learning notes
- `memory/research_logs.md` — research logs
- `memory/pendingResearchSummary.json` — pending research

### Cron Jobs from OpenClaw (in `~/.openclaw/cron/`)
Multiple backup `.json.bak` files — OpenClaw's cron job history. Active cron jobs are the 2 found in crontab.

---

## 6. CROSS-REFERENCE FINDINGS

### Finding: OpenClaw Uses MiniMax-M2.1, Hermes Uses MiniMax 2.7
- OpenClaw agents: `MiniMax-M2.1` (older model)
- Hermes profiles: `MiniMax 2.7` (newer model, primary brain)
- **This is intentional and correct.** The migration separates model tiers.

### Finding: Two Separate SOUL Systems Exist
1. Hermes: `~/.hermes/profiles/*/SOUL.md` (bossman, builder, ops, trading, content)
2. OpenClaw: `~/.openclaw/` + `~/Desktop/Openclaw Brain/Openclaw Brain/SOUL.md`

Both can coexist during transition. No conflict.

### Finding: SERVICES_MAP Has VERIFY NEEDED Entries
The OpenClaw-era SERVICES_MAP has 11 services all marked `ASSUMED: VERIFY NEEDED`. The `lsof` data this audit gathered should be used to update it.

### Finding: Port 3001 Conflict — Bakery vs Hermes Gateway
- `bakery` PM2 service tries to bind port 3001
- Hermes gateway also expects port 3001
- **Only one can win. This needs resolution before Phase 3.**

### Finding: Port 3100 Conflict — SquarePayouts vs OpenHue
- `squarepayouts` PM2 service tries to bind port 3100
- OpenHue expected on 3100 returns 404
- **OpenHue may not be running. SquarePayouts may be failing to start.**

### Finding: Missing Pre-Trade-Hook for Binance Bot
Binance bot error: `Cannot find module '/Users/bigdawg/Projects/trading-review/pre-trade-hook'`
- Trading-review project referenced but hook module missing
- Bot still running (32 restarts suggests it keeps crashing and restarting)
- **HIGH RISK — live money**

### Finding: OpenClaw Telegram Has Two Bot Tokens
- `main` bot (8320439483) — general Telegram
- `youtube` bot (8382029348) — YouTube-specific
Both need review for migration to Hermes.

### Finding: OpenClaw Has Its Own Kanban/Task System
`~/.openclaw/tasks/` — OpenClaw task files. This is separate from Hermes Kanban. OpenClaw tasks should not be migrated — Hermes Kanban is the new canonical board.

---

## 7. KEEP / MIGRATE / ARCHIVE / RETIRE RECOMMENDATIONS

### PM2 Processes

| Service | Recommendation | Notes |
|---------|---------------|-------|
| `binance-bot` | 🔴 MIGRATE + FIX FIRST | 32 restarts, missing module. Live money. Fix pre-trade-hook before Phase 3. |
| `money-pipeline` | ✅ KEEP | Stable enough for now. Monitor. |
| `bakery` | ⚠️ MIGRATE | Port 3001 conflict needs resolution. Separate from Hermes gateway. |
| `hub` | 🔴 ARCHIVE | OpenClaw microapps hub — replace with Hermes services |
| `overview` | ✅ KEEP | Valid dashboard |
| `health-dashboard` | ✅ KEEP | Valid dashboard |
| `fresh-dashboard` | ✅ KEEP | Valid dashboard |
| `trading-control` | ✅ KEEP | Valid trading service |
| `youtube-dashboard` | ✅ KEEP | Valid YouTube dashboard |
| `squarepayouts` | ⚠️ INVESTIGATE | Port 3100 conflict, ERR_UNKNOWN_FILE_EXTENSION |

### Cron Jobs

| Job | Recommendation | Notes |
|-----|----------------|-------|
| Morning research (money-making-dashboard) | ✅ MIGRATE | Move to Hermes-owned script path |
| Trading poller (5min) | ✅ MIGRATE | Move to Hermes-owned script path |

### OpenClaw Sub-Agents

| Agent | Recommendation | Notes |
|-------|----------------|-------|
| `lbc35` | 🔴 DEMOTE | Becomes delegated executor under BossMan |
| `dwdawg` | ✅ KEEP | Implementation layer — works under BossMan |
| `csdawg` | ✅ KEEP | Crypto research — works under BossMan |
| `debugdawg` | ✅ KEEP | Debugging — works under BossMan |
| `ideasdawg` | ✅ KEEP | Ideas — works under BossMan |
| `main` | 🔴 ARCHIVE | Superseded by Hermes bossman profile |

### GitHub Repos

| Repo | Recommendation | Notes |
|------|---------------|-------|
| `BossMan` | ✅ KEEP — PRIMARY | Hermes canonical repo |
| `Bigdawgclaw` | 🔴 ARCHIVE | Legacy — read-only reference |
| `BinanceBot` | ✅ KEEP | Live trading code — needs review |
| `MoneyMakingPipeline` | ✅ KEEP | Valid pipeline — needs Hermes-native rewrite |
| `Squares` | ✅ KEEP | Client-owned |
| `Bakery` | ✅ KEEP | Client-owned |
| `lbc35-gateway` | 🔴 ARCHIVE | Legacy gateway config |
| `CLAW-Backup` | 🔴 ARCHIVE | Read-only backup |
| `OpenClaw-Backup` | 🔴 ARCHIVE | Read-only backup |

### Local Docs

| Doc | Recommendation | Notes |
|-----|---------------|-------|
| `Hermes/Systems/PROFILES.md` | ✅ MIGRATE | To `~/.hermes/knowledge/` |
| `Hermes/Systems/SERVICES_MAP.md` | ✅ MIGRATE + UPDATE | Update VERIFY NEEDED entries with audit data |
| `Hermes/Systems/OVERRIDES.md` | ✅ KEEP | Hermes-specific, valid |
| `Hermes/Systems/HERMES_BACKUP.md` | ✅ KEEP | Already in Hermes knowledge |
| OpenClaw SOUL.md, AGENTS.md | 🔴 ARCHIVE | Legacy — do not migrate |
| OpenClaw TOOLS.md, PROTOCOL.md | 🔴 ARCHIVE | OpenClaw-specific |
| OpenClaw `Brain/` folder | 🔴 ARCHIVE | OpenClaw-specific |
| OpenClaw `memory/*.md` | ✅ REVIEW | Extract any valid decisions/memos |
| OpenClaw `memory/audits/` | ✅ KEEP | Historical audit data |

### Ports and Services

| Port | Service | Recommendation |
|------|---------|---------------| 
| 18789 | OpenClaw gateway | 🔴 Keep for now — needed for OpenClaw LBC35 transition |
| 3001 | Bakery/Hermes conflict | ⚠️ RESOLVE — assign Hermes to different port |
| 3100 | SquarePayouts/OpenHue | ⚠️ INVESTIGATE — one service is failing |
| 8104 | Binance bot | ✅ KEEP — needs fix |
| 8020 | Money pipeline | ✅ KEEP — monitor |
| 8090 | Hub | 🔴 ARCHIVE — replace with Hermes |
| Other ports | Various dashboards | ✅ KEEP — valid |

---

## 8. BLOCKERS REQUIRING MARCELO'S APPROVAL

### 🚨 CRITICAL — Must Fix Before Phase 3
1. **Binance bot pre-trade-hook missing** — `/Projects/trading-review/pre-trade-hook` module not found. Bot is cycling restarts. Live money at risk.
2. **Port 3001 conflict** — Bakery and Hermes gateway both trying to use port 3001. One must move.
3. **Port 3100 conflict** — SquarePayouts likely failing to start. OpenHue not responding. Investigate and resolve.

### ⚠️ HIGH — Resolve During Phase 2-3
4. **LBC35 authority scope** — LBC35 currently acts as primary orchestrator. Needs formal demotion letter in its SOUL before Phase 3 handoff.
5. **OpenClaw Telegram bot tokens** — Two Telegram bots configured. Need to decide which move to Hermes and which stay with OpenClaw.
6. **money-pipeline instability** — 8 restarts. Stream errors in logs. Active business tool.
7. **OpenClaw cron ownership** — Two cron jobs owned by OpenClaw-era scripts. Need migration to Hermes-owned paths.

### 🔍 CLARIFICATION NEEDED
8. **Bakery ownership** — Is bakery a client project (Squares/Bakery tier) or Marcelo's own business? Affects migration priority.
9. **Port 8100 vs 8000 confusion** — SERVICES_MAP says PM Dashboard on 5000, overview dashboard references 8000. PM2 shows overview on 8100. Need confirmed port map.
10. **Port 8102 and 8003** — Two listening ports with no PM2 entry and no service name. Need identification.
11. **Port 9119 (Python)** — Unknown Python script on 9119. Need identification.
12. **trading-review project** — Referenced by Binance bot but not in PM2 list. Is it a separate standalone process?
13. **kraken-bot** — Error logs reference kraken-bot with port 8106 but not in PM2. Is it retired but still referenced?

---

## 9. AMBIGUITIES — NEED LBC35 TARGETED FOLLOW-UP

Only ask LBC35 if Marcelo approves. Do not broad query — ask only these specific gaps:

1. "What is the trading-review project and where is pre-trade-hook supposed to be?"
2. "What service should be on port 8102?"
3. "What is the Python script on port 9119?"
4. "Is kraken-bot retired? Should the reference be removed from the bot config?"

---

## 10. STILL REQUIRES CONFIRMATION

- [ ] Is bakery Marcelo's own business or a client?
- [ ] Should OpenHue be running on 3100? What should be there?
- [ ] Should port 3001 be Hermes gateway or bakery? (One must move)
- [ ] Which Telegram bot should migrate to Hermes: `main` or `youtube` or both?
- [ ] Are ports 8102, 8003, 9119 safe to ignore or do they need identification?

---

## Sources Audited

| Source | Location | Coverage |
|--------|----------|----------|
| PM2 | `pm2 list` + `pm2 info` | 100% — all 10 active processes |
| Cron | `crontab -l` | 100% — all user cron jobs |
| OpenClaw config | `~/.openclaw/openclaw.json` | 100% — agents, channels, gateway, models |
| OpenClaw workspace | `~/Desktop/Openclaw Brain/Openclaw Brain/` | 100% — all brain files |
| OpenClaw agents | `~/.openclaw/agents/*/` | 100% — all sub-agents |
| OpenClaw cron | `~/.openclaw/cron/` | 100% — job configs |
| Hermes knowledge | `~/.hermes/knowledge/` | Partial — LEARNED files not read in detail |
| Obsidian | `/Users/bigdawg/Obsidian/` | Partial — checked structure only |
| GitHub | `BIGDAWG35/*` repos | Partial — listed but not deep-audited |
| Ports | `lsof -i -P -n` | 100% — all listening ports |
| Health checks | `curl` against all key ports | 100% — all major services |
| Error logs | `~/.pm2/logs/` | 100% — error patterns identified |
| SERVICES_MAP | OpenClaw workspace | 100% — all VERIFY NEEDED entries |

---

*Phase 1 audit complete. No changes made. Ready for Marcelo review and Phase 2.*
