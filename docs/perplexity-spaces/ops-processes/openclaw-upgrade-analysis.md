# OpenClaw Upgrade Analysis — 2026.5.4 → 2026.5.27
**Scanned:** 5 stable releases (5.22, 5.23, 5.24, 5.25, 5.26, 5.27)
**Current:** 2026.5.4 | **Target:** 2026.5.27 | **Gap:** 23 stable versions

---

## What We're Adopting (High-Signal for Our Setup)

### 🔴 RED-ZONE — Security & Stability (Non-Negotiable)

| Change | Why It Matters | Action |
|---|---|---|
| CLI numeric option validation (5.27) | Rejects malformed `--timeout`, `--version` etc. before they can cause silent failures | Upgrade only |
| Unsafe Node runtime env override blocking (5.27) | Prevents rogue env vars from bypassing exec policy | Upgrade only |
| Stale device-token rejection (5.27) | Stops invalidated sessions from staying alive | Upgrade only |
| SSRF policy on browser snapshot URLs (5.26) | Browser tool can't be tricked into reading internal URLs | Upgrade only |
| Prompt-injection filter on explicit `memory_store` tool (5.26) | Prevents hostile text injected into memory writes | Upgrade only |
| Session lock max-hold reclaim (5.26) | Fixes wedged sessions from aborted subagents | Upgrade only |
| Auth rate limiter on remote/non-browser gateway auth (5.26) | Stops brute-force against gateway endpoint | Upgrade only |
| Hostname normalization for repeated trailing dots (5.27) | Blocks certain domain-based bypasses | Upgrade only |
| Tool-call text scrubbed from replies (5.26) | Sensitive tool results can't leak into user-visible messages | Upgrade only |
| Cron retry after transient rate limits before next slot (Unreleased/5.28) | Scheduled jobs reschedule smarter instead of missing the hour | Upgrade only |

### 🟡 YELLOW-ZONE — New Capabilities We Should Enable

| Feature | Version | Why It Matters | Fit |
|---|---|---|---|
| **Core OpenAI-compatible embedding provider** (5.27) | 5.27 | Enables local embeddings for memory without external API costs | ✅ Load into LBC35 SOUL — `memory/` can use local embeddings |
| **Transcript-backed meeting summaries** (5.26) | 5.26 | All voice/channel transcripts use one reliable path | ✅ Relevant for Telegram/Discord voice sessions |
| **`cron.maxConcurrentRuns` default 8** (5.26) | 5.26 | Scheduled jobs run 8-parallel instead of 1 | ✅ Our PM2/cron watchdog overlaps — align cron concurrency |
| **Signal/iMessage/WhatsApp reaction approvals** (5.26) | 5.26 | Mobile approval flows work without textual `/approve` | ✅ Better reaction handling on iMessage channel |
| **Activity tab (ephemeral live tool activity)** (5.26) | 5.26 | Live diagnostic view without persisting raw telemetry | ✅ Useful for BossMan debugging |
| **`openclaw backup` command** (5.26) | 5.26 | Built-in backup with verification | ✅ Use for pre-upgrade snapshots |
| **Plugin SDK reaction approval helpers** (5.26) | 5.26 | Cleaner approval UX for plugin-driven approvals | ✅ Low priority — note for future plugins |
| **Status: show active subagent details** (5.28) | 5.28 | `openclaw status` now shows subagent activity | ✅ Useful for monitoring LBC35 subagents |
| **Named model auth profiles + migration** (5.26) | 5.26 | Multiple credential sets per provider | ⚠️ Review if we have multiple API keys |
| **OpenTelemetry LLM spans for diagnostics** (5.26) | 5.26 | Structured observability for model calls | ⚠️ Nice-to-have — BossMan can query directly |

### 🟢 GREEN-ZONE — Performance & Polish (Nice to Have)

| Change | Version | Notes |
|---|---|---|
| Gateway/plugin metadata caching (5.26, 5.27) | Faster startup and reply paths | Transparent win |
| Rastermill replaces Sharp for image processing | No Sharp dependency | Clean removal |
| `openclaw doctor` restart guidance now actionable | Easier diagnostics | Useful |
| Browser snapshot CDP URL validation | Prevents internal URL reads | Security+ |
| Claude CLI OAuth auth label prefers active profile | Better model routing | Low risk |

---

## What We're NOT Adopting (Not Relevant / Out of Scope)

- **PixVerse plugin** — external video generation, not in our stack
- **iOS/Android mobile apps** — we run headless server
- **Signal/WhatsApp channels** — Telegram is our sole messaging channel
- **WebChat** — no web chat interface in use
- **Matrix** — no Matrix channel
- **Google Vertex / Vertex ADC** — not in our provider config
- **Docker/Alpine/Windows-specific paths** — Mac mini only
- ** Crabbox/Testbox CI lanes** — CI not relevant

---

## Pre-Upgrade Backup Targets

```
~/.openclaw/workspace-lbc35/
  SOUL.md
  AGENTS.md
  TOOLS.md
  IDENTITY.md
  USER.md
  HEARTBEAT.md
  memory/

~/.openclaw/openclaw.json         ← main config
~/.openclaw/openclaw.json.bak*   ← existing backups (keep all)
~/.openclaw/credentials/         ← API keys, tokens
~/.openclaw/agents/              ← agent configs
```

---

## Upgrade Command Sequence

```bash
# 1 — Pre-upgrade backup (verify destination has space)
openclaw backup create \
  --label "pre-2026.5.27-upgrade" \
  --verify

# 2 — Backup key files individually to CLAW-Backup
rsync -av ~/.openclaw/workspace-lbc35/ \
  ~/Desktop/CLAW-Backup/Openclaw_Brain/ \
  --exclude='memory/'            # skip dense logs

rsync -av ~/.openclaw/openclaw.json \
  ~/Desktop/CLAW-Backup/Openclaw_Brain/openclaw.json.pre-upgrade

# 3 — Upgrade OpenClaw
npm update -g openclaw

# 4 — Verify new version
openclaw --version

# 5 — Restart gateway
openclaw gateway restart

# 6 — Health check
openclaw doctor
openclaw status
```

---

## Post-Upgrade Checklist

- [ ] `openclaw --version` shows 2026.5.27
- [ ] `openclaw doctor` passes without errors
- [ ] `openclaw status` shows gateway online
- [ ] Telegram channel still connected and routing messages
- [ ] LBC35 workspace files intact (SOUL.md, AGENTS.md, TOOLS.md)
- [ ] BossMan Kanban routing still functional
- [ ] No new error logs in `~/.openclaw/logs/`
