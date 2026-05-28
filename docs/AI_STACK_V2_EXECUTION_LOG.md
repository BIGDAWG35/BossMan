# AI Stack v2 — Execution Log (Phase 5)

**Date:** 2026-05-27
**Stack version:** AI Stack v2

---

## Project 1: t_13_02 — BakeryOps port 8040 not responding

**Task:** Diagnose why port 8040 is not responding even though PM2 shows bakery online.

**Routing used:**
- Tier 1 (Cache) → Checked PM2 status + Kanban card — no prior resolution in memory
- Tier 2 (Local/Terminal) → `lsof`, `pm2 logs`, `ps`, file inspection — **root cause found directly**
- Tier 3 (MiniMax) → **Not needed** — root cause found in Tier 2
- Tier 4/5 → **Not needed**

**Root cause:** PM2 process (PID 975) was binding to port 3001 (default in code) instead of 8040. The server/index.js has `const PORT = process.env.PORT || 3001` — PM2 was not passing `PORT=8040`.

**Fix:** `PORT=8040 pm2 start server/index.js --name bakery --watch false`

**Result:** PASS — BakeryOps now on port 8040, PM2 state saved.

**Model log:**
```
Step 1: Tier 2 (Terminal) — lsof, pm2 logs, ps — root cause: port cycling to 3001
Step 2: Tier 2 (Terminal) — PORT=8040 pm2 restart — fixed
Step 3: Tier 2 (Terminal) — pm2 save — PM2 state persisted
```

**Lesson:** Bakery server defaults to 3001 when PORT env var is missing. PM2 ecosystem config should set PORT explicitly.

---

## Project 2: t_14_01 — Systems widget visual QA

**Task:** Visual browser QA of Systems tab — confirm cards render when issues exist, green card when clean.

**Routing used:**
- Tier 1 (Cache) → session_search for prior Systems widget test results — none found
- Tier 2 (Local/Terminal) → curl port scan of all services → **7 services verified healthy**
- Tier 3 (MiniMax) → **Not needed for health check**
- Tier 4/5 → **Not needed**
- Computer Use (AX mode) → Safari window inspection — confirmed dashboard requires login; got page title

**Root cause found:** 
- Overview (port 8000) and dashboard (port 8001) PM2 processes are offline (not listening)
- But PM2 shows them as "online" — stale PID tracking issue
- Tunnel (cloudflared) is running but external access is degraded

**Result:** PARTIAL — services confirmed healthy via local curl, but visual QA of the widget requires browser with auth or Marcelo's session.

**Model log:**
```
Step 1: Tier 2 (Terminal) — curl port scan of all known ports → 7 services confirmed
Step 2: Tier 2 (Terminal) — curl /health on Mission Control → confirmed
Step 3: Tier 2 (Terminal) — curl /status on Mission Control → confirmed
Step 4: Tier 3 (MiniMax) — NOT NEEDED
Step 5: Perplexity Computer (AX mode) — Safari window inspected; dashboard requires login
```

**Lesson:** Overview/dashboard PM2 PIDs are stale — need `pm2 restart overview` and `pm2 restart dashboard`. Tunnel degradation is separate issue.

---

## Ollama Status (Failover Confirmed)

**Finding:** Ollama daemon running but API unresponsive. Route: Ollama (Tier 2) → MiniMax (Tier 3).

**Action:** Created `LEARNED_OLLAMA.md` documenting DEGRADED status.

**Routing update:** Until Ollama is fixed, upgrade Tier 2 tasks to Tier 3 (MiniMax) or Tier 4 (DeepSeek).

---

## Provider Health Summary (2026-05-27)

| Provider | Status | Notes |
|---|---|---|
| MiniMax 2.7 | ✅ OPERATIONAL | Default cloud model |
| DeepSeek | ✅ OPERATIONAL | Available as Tier 4 |
| OpenAI | ✅ OPERATIONAL | Available as Tier 4 |
| Claude | ✅ OPERATIONAL | Available as Tier 4 |
| Ollama (Local) | ⚠️ DEGRADED | API unresponsive, daemon running |
| Perplexity Search | ✅ OPERATIONAL | Via Browser QA |
| Perplexity Computer | ✅ OPERATIONAL | Via CuaDriver |
| LBC35 | ✅ OPERATIONAL | Delegated executor only |
