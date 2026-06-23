---
name: troubleshooting-mode
description: "BossMan Troubleshooting Mode for incident, bug, and system health cards. Enforces a strict 8-step workflow that mirrors the v3.0 6-step routing map (Perplexity → M3 → builder → Qwen → DeepSeek QA → Claude docs). Use this skill for any kanban card with status: incident or status: blocked (incident-flavored), label: troubleshooting, or when the user types /troubleshoot, 'incident', 'outage', 'broken', 'down', 'not working', or 'system health'."
trigger:
  - kanban card has status: incident
  - kanban card has status: blocked AND body contains "incident|outage|broken|down|not working|error"
  - kanban card has label: troubleshooting
  - user types /troubleshoot
  - user types one of: incident, outage, broken, down, "not working", "system health"
---

# BossMan Troubleshooting Mode

**Standing rule:** Troubleshooting Mode is for system behavior incidents only (PM2, cron, bots, pipelines, routing, AI stack, ports, services, network). It is NOT a substitute for normal card work. If the request is about content, design, or a feature card, run normal work instead.

This skill enforces the v3.0 6-step routing map (Perplexity Search → MiniMax-M3 → primary builder → Qwen/Ollama → DeepSeek QA → Claude docs) with no global default. `model.default` is a last-resort fallback (qwen2.5:3b) only when no `step:` field and no `model_plan:` line is present. The 8-step workflow below maps to that routing.

---

## 0. Is this really an incident?

Before running the protocol, classify. **Type** must be one of:
`service health` · `cron` · `AI routing` · `trading` · `port` · `log noise` · `other`.

If the card is not about system behavior, **do not run Troubleshooting Mode.** Treat it as normal work and exit this skill.

---

## 1. Step 1 — Gather facts (Perplexity + local tools)

Goal: build a fact-only picture. No guesses, no hypotheses yet. 3–6 bullets max.

**Routing for Step 1:**
- **Primary:** Perplexity Search (`web_research` tool, when wired) for external docs, API changes, known issues, vendor status pages.
- **Fallback (current reality — `web_research` is paper-only until follow-up card lands):** `browser_navigate` + `read_file` for vendor docs; `terminal` for PM2/cron/port/log inspection; `hermes insights` for usage stats.

**Always check for system-health incidents:**
- `pm2 list` — all processes online, restart counts, unstable restarts.
- `curl -sI http://localhost:<PORT>/` — every port in the routing table.
- `hermes cron list` — last-run status of any cron involved.
- `pm2 logs <service> --err --lines 50` and `pm2 logs --err --lines 50` for cross-service noise.
- `~/.hermes/state.db` queries for tool/skill usage if AI-routing incident.
- Service-specific logs (boss-hub, binance-bot, money-pipeline, etc.).

**Output of Step 1:** 3–6 bullets of facts only. No interpretation.

---

## 2. Step 2 — Design / decompose (MiniMax-M3)

Goal: form a hypothesis tree and break the incident into sub-problems only when decomposition helps.

**Routing for Step 2:**
- **Primary:** MiniMax-M3 (Step 2 design brain per v3.0).
- **Fallback:** Claude Sonnet-4 if M3 is unavailable.
- **HARD CARVE-OUT:** If the incident touches **SquarePayouts** (project: SquarePayouts), do NOT use M3. Auto-substitute Claude Sonnet-4. M3 is permanently BLOCKED on SquarePayouts.
- **Other carve-outs:** any project tagged `trading` or money/financial flows should be treated carefully and must go through Step‑5 QA before applying fixes.

fixes. Prefer reversible, scoped, safe.

Routing for Step 3:
- Primary: Claude Sonnet-4 (production-quality, polish, careful config diffs).
- Heavy-backend carve-out: if the fix is heavy backend logic or complex code, DeepSeek v4-flash may be the primary builder; Claude reviews.
- SquarePayouts: use Claude / DeepSeek / OpenAI only. M3 forbidden.

Fix-proposal rules:
- Minimal change first. Avoid big refactors in incident mode.
- Always include exact commands / file diffs.
- Label anything risky: "HIGH RISK — touches money-pipeline", "REVERSIBLE", "REQUIRES REBOOT", etc.
- For each fix, list one quick verification step.

Output of Step 3: Ordered list of fixes, each with: action, file/command, risk label, verification.

---

4. Step 4 — Cleanup / local grunt (Qwen via Ollama)

Goal: free up the primary brain by offloading repetitive, local tasks.

Routing for Step 4:
- qwen2.5:14b (Step 4 primary): bulk log cleanup, repetitive snippet refactor, batch test-case generation, multi-file rewrites of similar code.
- qwen2.5:3b (ultra-fast helper): "is this log line an error or warning?", "extract the id from this JSON", "classify this PM2 status string".
- Concurrency rule: never run 14B heavy work concurrently with 3B heavy work. If 14B is running (Ollama lock), 3B tasks either wait or fall back to a tiny Python helper.
- Qwen is a helper, never the primary incident designer. M3 / Claude still own the diagnosis and the fix.

Output of Step 4: N/A unless Step 3 produced bulk-cleanup work. If used, cite the Qwen model + prompt.

---

5. Step 5 — QA / red-team (DeepSeek v4-flash, MANDATORY for money/trading)

Goal: stress-test the proposed fix. Find what could go wrong before applying it.

Routing for Step 5:
- Primary: DeepSeek v4-flash (red-team mindset per v3.0).
- Fallback: Claude Sonnet-4 if DeepSeek is unavailable. If Claude is the fallback, explicitly note "DeepSeek was skipped" in the output.

Mandatory for:
- Any fix touching money/financial flows: money-pipeline, binance-bot, csdawg-dashboard, trading-control.
- Any fix that modifies PM2 config, cron jobs, env vars, or API keys.
- Any fix that affects more than one service.

Recommended for:
- Any fix touching boss-hub (the registry is shared by all services).
- Any fix that involves force-push, history rewrite, or force-restart.

DeepSeek's red-team questions:
- "What could this break in money-pipeline, trading, or cron jobs?"
- "Is there a partial-failure mode (e.g., service starts but health check fails)?"
- "What happens during failover? Does the fallback chain still work?"
- "Does this introduce a race condition or a state inconsistency?"
- "Is the rollback path clear and tested?"

Output of Step 5: Pass / Fail / Conditional. If Fail, go back to Step 3 with the new constraints. If Conditional, list the conditions under which the fix is safe.

---

6. Step 6 — Final docs / runbook (Claude)

Goal: write the answer so future-you can read it 6 months from now and know exactly what happened, why, and how to reproduce.

Routing for Step 6: Claude Sonnet-4 (long-form, polished writing).

Required sections in the runbook:
1. Incident Summary — 2–3 sentences: what's broken, where, impact.
2. Facts Collected (Step 1) — bullets only, no guesses.
3. Root Cause (Step 2–3) — short, plain language.
4. Fix Plan (Step 3–4) — ordered list of actions (commands / diffs).
5. QA / Risk Review (Step 5) — what DeepSeek / Claude thinks could go wrong.
6. Runbook Notes — 3–5 bullets for future reference: similar symptoms, files touched, lessons.
7. Escalation — ALERT block, or "No escalation needed."

Style rules:
- Tight, operational, no filler.
- Use code blocks for commands and diffs.
- Use bullet lists, not paragraphs.
- Telegram-readable (Markdown will be auto-rendered).

---

7. Escalation rules

Page Marcelo immediately if any of these are true (ALERT format below):

1
• Trigger: **Crash loop** (≥2 restarts in 5 min) on a live trading or money service
• Why: Money at risk; needs human decision (stop, debug, or accept).

2
• Trigger: Money-pipeline has ≥ 10 restarts OR is unresponsive
• Why: Money flows are the highest-stakes surface.

3
• Trigger: Telegram gateway disconnected
• Why: No user notifications get through.

4
• Trigger: Tailscale VPN disconnected
• Why: BossMan loses access to BossLady/Cello Mac minis and Tailscale-routed services.

5
• Trigger: Any critical service completely unresponsive (not just slow)
• Why: pm2 status says errored / stopped; no HTTP response on the canonical port.

6
• Trigger: HTTP 401/403 from a money service (Binance, Kraken, etc.)
• Why: API key compromised → must rotate + revoke prior key.

7
• Trigger: OOM kill (exit 137) twice in 24h on a money service
• Why: Memory leak; trading logic may be unstable.

8
• Trigger: Balance divergence >5% between internal / API / exchange on a money service
• Why: Reconciliation gap → possible silent trade loss.

9
• Trigger: Pre-trade hook REJECT count > 5 in 1 hour
• Why: Anomalous signal stream or signal-source bug.

**Deleted (2026-06-16, Phase 6 Track B t_1c502da6):** "Binance bot is online when it should be STOPPED". Online is now the expected healthy state for binance-bot. Other money services still follow operator policy — if RUNBOOK says a service must be stopped, then online = ALERT for that service.

**Added (2026-06-16, Phase 6 Track B t_1c502da6):** "Binance bot is STOPPED with no maintenance/incident card on the board" → L2/L3 ALERT. The PM2 Health Monitor cron (`01dff7ff61e4`) checks the kanban for `label:maintenance` or `label:incident` cards (with "binance" in the title) before paging Marcelo. This is the inverse of the older "online = alert" rule. Pitfall: when stopping binance-bot for scheduled work, create the maintenance card FIRST, wait one cron tick (~15 min max), then `pm2 stop` — the pitfall is the reverse order, which produces a spurious page in the gap between stop and card. See `trading/binance-bot` SKILL.md §"24/7 ONLINE Policy" for the full rules and allowed-OFF card format.

ALERT format (use this exact template):

ALERT <Service/Job Name>
Status: <current>
Expected: <should be>
Restart count: <N>
Last good timestamp: <ISO>
Actions tried: <short bullet list>
Needs your decision on: <specific question, one line>
If the issue is not in the escalation table but is high-stakes (e.g., a fix that requires touching live trading config), still surface it for approval, but format as "Proposed action — needs A/B/C" rather than a hard ALERT.

---

8. Answer template

Use this exact structure for the final reply in Troubleshooting Mode. Every incident reply must include all 7 sections (use "No escalation needed" if §7 doesn't fire).

### Incident Summary
<2–3 sentences: what's broken, where, impact.>

### Type
<service health | cron | AI routing | trading | port | log noise | other>

### Facts Collected (Step 1)
- <bullet 1>
- <bullet 2>
- <bullet 3>

### Root Cause Hypothesis (Step 2–3)
<short, plain language, citing the Step 1 evidence>

### Fix Plan (Step 3–4)
1. <action> — <risk label> — <verification>
2. <action> — <risk label> — <verification>
3. <action> — <risk label> — <verification>

### QA / Risk Review (Step 5)
<DeepSeek (or Claude-as-fallback) review. PASS / FAIL / CONDITIONAL + conditions.>

### Runbook Notes (Step 6)
- <bullet for future reference>

### Escalation
<ALERT block, or "No escalation needed.">
---

Known gaps in this protocol (flag until fixed)

These are real, not theoretical. Until the follow-up cards land, the protocol must work around them:

- Perplexity Search not wired — Step 1 falls back to browser_navigate + read_file + terminal. External research is slower; vendor status pages may be missed.
- DeepSeek v4-flash dormant — Step 5 has 1 call/30d. Until Step 5 routing is wired, expect Claude to be the de facto QA model. Always note "DeepSeek was skipped" when Claude is used as fallback.
- LBC-35 profile not yet created — does not affect Troubleshooting Mode (LBC-35 is for delegated project work, not incident response).
- web_research tool not registered — see Perplexity Search gap above.
- health.warnings.forbidden_global_default block not yet added to ~/.hermes/config.yaml — relies on operator discipline until the routing lock is fully applied.

---

## PM2 hardening pitfall: autostart lives in THREE places (file is not the source of truth)

**Symptom (seen 2026-06-16, t_1cb4ec89):** Bot is online after a reboot despite `ecosystem.config.cjs` having `autostart: false`. After editing the file, `pm2 list` still shows it `online` and `pm2 jlist` still reports `autostart=True`. `pm2 save` "succeeds" but the next reboot resurrects from the stale in-memory config.

**Why:** PM2 loads the ecosystem file once at first start. After that, three independent sources of truth exist, and only two of them move on `pm2 save`:

1. **In-memory config** (`pm2 jlist`) — what PM2 actually uses. Editing the file does NOT re-read it.
2. **`~/.pm2/dump.pm2`** — what `pm2 resurrect` reads on boot. Each process entry is a JSON object with its own `autostart` field, copied from the in-memory config at the time of the last `pm2 save`.
3. **Ecosystem file** — only consulted at fresh `pm2 start` with the path.

**Correct sequence to make a config change survive reboot:**
```bash
pm2 stop <service>                            # or pm2 delete, depending on intent
pm2 delete <service>
pm2 start /path/to/ecosystem.config.cjs       # PM2 re-reads the file here
pm2 jlist | grep <service>                    # VERIFY autostart value matches the file
pm2 save                                      # persists in-memory state to dump.pm2
```

**Verification (mandatory before reporting "config hardened"):**
```bash
pm2 jlist | python3 -c "import sys,json; d=json.load(sys.stdin); [print(f\"{p['name']}: autostart={p['pm2_env'].get('autostart')}\") for p in d if p['name']=='<service>']"
grep -c <service> /Users/bigdawg/.pm2/dump.pm2   # must be > 0 (process present in dump)
```
If `pm2 jlist` still shows the wrong value after the sequence, something is cached. Re-`pm2 delete` and re-`pm2 start`.

**Anti-pattern:** editing `ecosystem.config.cjs` and `pm2 save` without re-`pm2 start` first. The save only persists current in-memory state, which is still the old config. File is silent, dump is silent, the bug surfaces at the next reboot.

**Companion skill:** `pm2-app-100pct-uptime` §"autostart hardening" for the broader pattern and the binance-bot LIVE-pilot recipe.

**Anti-pattern (dump edit):** never use `sed -i '/path/d' ~/.pm2/dump.pm2` to surgically remove a process. The dump is JSON with multiple lines per process referencing the cwd and script path; a path-based sed wipe will over-match and strip unrelated process entries. The right way to remove a process from the dump is `pm2 delete <name> && pm2 save`. If the dump is already corrupted, restore from `/Users/bigdawg/.pm2/dump.pm2.bak` (PM2 auto-creates this on every save) before doing anything else.

## PM2 post-mortem trace (when `pm2 list` lies, the log file tells the truth)

**Symptom (seen 2026-06-16, Phase 6 Track B T+5 anomaly):** `pm2 list` shows `status=stopped, pid=0, restart_time=0, uptime=0`. A status line posted minutes earlier said `status=online, pid=<X>, restart=0`. The two readings are mutually inconsistent, and the operator (or a parent agent) is asking "what happened between then and now?"

**Why `pm2 list` and `pm2 jlist` are not enough here:** they only show the *current* state. The historical event sequence (start → stop → kill → exit) is not in either output. Without history, you cannot distinguish:
- A crash (exit code != 0, no signal, no external `pm2 stop`)
- An operator `pm2 stop` (exit code 0, signal SIGINT, PM2 log entry "Stopping app:<name>")
- An OOM kill (exit code 137, signal SIGKILL)
- A parent-process kill (signal SIGTERM/SIGKILL, no PM2 stop entry)
- A reboot / PM2 daemon crash (PM2 log entry "PM2 log: PM2 successfully killed" or daemon restart)

**The trace command:**
```bash
tail -200 /Users/bigdawg/.pm2/pm2.log 2>&1 | grep -E "<service-name>|stop|kill|exit|started" | tail -40
```

PM2 appends one line per process lifecycle event to `~/.pm2/pm2.log`. The shape is:
```
2026-06-16T14:20:46: PM2 log: App [binance-bot:31] starting in -fork mode-
2026-06-16T14:20:46: PM2 log: App [binance-bot:31] online
2026-06-16T14:22:51: PM2 log: Stopping app:binance-bot id:31
2026-06-16T14:22:52: PM2 log: App [binance-bot:31] exited with code [0] via signal [SIGINT]
2026-06-16T14:22:52: PM2 log: pid=59497 msg=process killed
```

Reading these lines:
- `starting in -fork mode-` → PM2 launched the process
- `online` → process reported healthy to PM2
- `Stopping app:<name> id:<id>` → someone (operator, agent, or external trigger) issued `pm2 stop <name>` OR PM2 is about to. **No "Stopping app" line = no `pm2 stop` happened.**
- `exited with code [N] via signal [SIGXXX]` → the process exit. Code 0 + SIGINT = clean stop (operator action). Code != 0 + no signal = crash. Code 137 + SIGKILL = OOM. Code != 0 + SIGTERM = external kill.
- `msg=process killed` → PM2's bookkeeping line, always paired with the exit.

**This trace is the single source of truth for "who killed the process."** When the current state disagrees with a prior status line, this trace resolves it. Apply it before opening a security incident card or before sending an ALERT that names "unknown actor."

**Companion check:** if `~/.pm2/pm2.log` itself is missing or empty, PM2 was probably reinstalled or its home was wiped. In that case the post-mortem is unrecoverable from PM2's view; fall back to `~/.pm2/logs/<service>-error.log` and `~/.pm2/logs/<service>-out.log` for the process-side view.

## Hermes Kanban CLI quirks (discovered 2026-06-16, t_1cb4ec89)

- `hermes kanban create <title>` — title is positional. `--initial-status {blocked,running}` exists; `--status` does NOT. `--label` is NOT a flag on this version — encode labels in the title (e.g. `"... [incident | troubleshooting]"`) or in the body until/unless the CLI adds it. `--priority` takes an integer, not "high"/"low" (use `1` for high).
- `hermes kanban comment <task_id> <text...>` — `text` is positional, NOT `--body`. Use:
  ```bash
  hermes kanban comment t_1cb4ec89 "Comment body here" --author bossman
  ```
  Pipe heredocs DO work; backticks in the body render as code blocks (verified).

---

## Policy-vs-live-state drift (a recurring incident class)

**Symptom:** Policy doc (RUNBOOK.md, OPERATING_BLUEPRINT, error-escalation.md) says service X must be `stopped` / `disabled` / `not running`, but PM2 / launchctl / cron shows it `online` / `enabled` / scheduled.

**Root cause pattern:** A fail-closed wrapper (pre-start.js, safe-start.js, health-check.js) prevents *silent misconfig* but does NOT enforce *operator policy*. The wrapper will happily pass its own checks and start the service if the operator policy gate lives outside the wrapper. Most common shape: RUNBOOK says "stopped until X approval" but the ecosystem file has `autostart: true` and the dump has the process in it from before the policy was tightened.

**Standard fix shape (no code change to the bot itself):**
1. `curl` pre-check: confirm no open positions / unmanaged orders / in-flight state.
2. `pm2 stop <service>`.
3. Edit `ecosystem.config.cjs`: `autostart: true → false`, with an inline comment referencing the kanban card.
4. Re-register via `pm2 delete` + `pm2 start <ecosystem>` + `pm2 save` (see PM2 pitfall above).
5. Update the card with commands run, final `pm2 list` row, and a "policy vs live state drift" note in Runbook Notes.

**Lesson for the LEARNED file:** a fail-closed wrapper is a config-correctness gate, not a policy gate. For policy enforcement at boot, you need either `autostart: false` + manual restart (chosen here), or a check inside the wrapper that reads an approval file.

---

## Live service go-live protocol (the inverse: STOPPED → LIVE, or any "make X live and stay alive" request)

**Trigger:** User says "make X live", "go live with X", "X is approved for live", "flip the policy from STOPPED to online-is-healthy", or "I want X live and reliable" for a service that has been intentionally held offline. Also: any time a card titled "go-live and stay-alive" is created.

**Why this is a class, not an ad-hoc checklist:** it is the exact inverse of the policy-vs-live-state-drift section. The same `pm2 autostart` / pre-start wrapper / cron / knowledge-file / RUNBOOK-update mechanics apply, just in reverse direction, with the failure mode being "service silently starts and trades" instead of "service refuses to start". The lessons are mirror-symmetric.

**Mandatory gates (do not skip any):**
1. **Gate 1 — Approval on record.** A kanban card with status=running, priority=1, label=trading (or appropriate domain), with explicit user "go live" wording in the body. No card → no go-live. If the user only said "go live" verbally and no card exists, create the card FIRST and let them read it before continuing.
2. **Gate 2 — Pre-flight independently run.** `node safe-start.js` (or the equivalent pre-flight script) MUST be run as a standalone command, not just rely on the pre-start.js wrapper that runs during `pm2 start`. Reason: if the wrapper succeeds you cannot tell whether the wrapper is honest or just rubber-stamping. Verify the count out loud (e.g. "18/18 passed") in the status line.
3. **Gate 3 — `curl /api/status` snapshot.** Record: status, totalExposure, paperMode, balance, positions, dailyLimitHit, cooldownActive. If any field is non-zero or anomalous, STOP. The bot is the same bot before and after `pm2 start`; if it has positions or in-flight orders right now, "going live" means "resuming in the middle of a trade", not "starting fresh".
4. **Gate 4 — RUNBOOK / knowledge updated BEFORE start.** Edit RUNBOOK hard-gates, the Phase-Track section, the `~/.hermes/knowledge/error-escalation.md` "do NOT page" list, and the `~/.hermes/knowledge/health-monitoring.md` "what healthy means" table. If RUNBOOK still says "stopped", the go-live is undone the moment the next operator reads it. This is a hard gate — no start before docs are honest.
5. **Gate 5 — Cron / monitoring wired.** If RUNBOOK references a monitoring cadence (9 AM / 9 PM health check, etc.) that cadence MUST exist in `crontab -l` BEFORE the service starts. Aspirational cron is the most common silent gap. The cron entry + a wrapper script + a fail-marker file is the minimum bar.
6. **Gate 6 — Status line to user, then wait.** Send a one-line status with: pm2 row (expected: status=stopped, autostart=True, restart count), pre-flight result (e.g. "18/18 passed"), curl result. **STOP.** Wait for the user to read it and reply. Do not run `pm2 start` in the same step as anything else.

**Pitfall (learned 2026-06-16, Phase 6 Track B): `pm2 start ecosystem.config.cjs` starts the process.** The single command `pm2 start <ecosystem>` does TWO things: re-registers the in-memory config AND launches the process. If the user said "send me the status line, then I'll say go" but you needed to re-register PM2 to flip `autostart` from false to true, you have already started the bot. **Fix:** before `pm2 start <ecosystem>`, decide whether you need a stopped-state status line. If yes, split the work:
```bash
# Re-register config without starting the process:
pm2 delete <service>          # or pm2 stop, depending on intent
# ... do NOT run pm2 start yet ...
# Edit ecosystem file (autostart: false → true)
# Send status line, wait for "go"
pm2 start /path/to/ecosystem.config.cjs    # this line starts the process
```
Or accept that you have already started and surface that explicitly in the status line ("bot is online via pre-start.js gate, restart=0, all 18 checks passed; pm2 start and pre-flight collapsed into the same step"). Do not pretend the bot is stopped when it is online. **This pitfall applies any time the user asks for a "verify-stopped, then I'll say go" workflow AND the verification step requires `pm2 start`.**

**Mandatory 30-min observation window after go-live.** First 30 minutes: check `pm2 list <service>` every 5 min for restart-count drift, then every 15 min for the rest of the hour. If restart count > 0, treat as crash-loop precursor and apply §7 escalation rule #1 (stop + ALERT). After 30 min clean: drop to the cron cadence (9 AM / 9 PM PDT for binance-bot).

**Pitfall (learned 2026-06-16, Phase 6 Track B T+5 anomaly): the first T+0 status line was wrong.** The agent re-ran `pm2 start` after pre-flight and posted a T+0 status line from the **pre-start completion state** (pid, status=online, restart=0) — but several minutes had passed between the start and the post, and a `pm2 stop` had been issued in the window. The status line reported the bot as online when it was already stopped. The post-mortem trace (see "PM2 post-mortem trace" pitfall) was the only way to reconstruct the actual sequence.

**Rule:** every status line that reports PM2 / process state MUST be backed by a fresh `pm2 jlist` (or `pm2 list`) and `curl` call **executed in the same tool turn as the status post**. Cached or context-held state is not acceptable for status reports because PM2 state is mutable and the user cannot verify the claim against your context.

**Pitfall (learned 2026-06-16, Phase 6 Track B): no custom /tmp observer scripts.** When the agent tried to write a custom polling loop to `/tmp/binance-observer.sh` for the 30-min window, the operator rejected it with "Do not create a custom /tmp observer script. Use existing safe commands only." The standing rule: the observation window uses only the four safe read-only commands — `pm2 show`, `pm2 logs <service> --lines 50`, `curl -s http://127.0.0.1:<PORT>/api/status`, `pm2 jlist` (no pipes to python for control flow) — issued as discrete 5-min tool calls. Polling loops, /tmp scripts, and background watchers are forbidden in this context because they are the kind of code that grows silently, accumulates state, and turns into a system service without a kanban card. If a 30-min window truly needs automation, route it through a cron entry on the cron schedule (Gate 5), not a /tmp script.

**Reversibility:**
- Stop: `pm2 stop <service>` (in-memory only, survives until next `pm2 save` or reboot)
- Fully revert to STOPPED policy: `pm2 delete <service>` → flip `autostart: true → false` in ecosystem file → re-register (delete + start) → `pm2 save`. Update RUNBOOK and knowledge files back. Close the go-live card with "reverted" status and a one-line summary of why.

**Files touched in a typical go-live (the 4 files rule):**
1. `ecosystem.config.cjs` — `autostart: false → true` with inline comment referencing the approval card
2. `RUNBOOK.md` — hard-gates table + new Phase-Track section + "what changed" table
3. `~/.hermes/knowledge/error-escalation.md` — "do NOT page" list (add online-is-healthy entries, remove "online when it should be stopped" entries)
4. `~/.hermes/knowledge/health-monitoring.md` — "what healthy means" table (flip the row for this service)

**Companion artifacts:**
- `references/live-service-go-live.md` — binance-bot Phase 6 Track B worked example (commands, 4 files touched, status line, 30-min window, post-launch metrics, reusable template).
- `references/policy-vs-live-state-drift.md` (TODO, next session) — paired inverse case study, for when "online when it should be stopped" is still the alert (services that have NOT been flipped to live-is-healthy).
- `references/pm2-post-mortem-trace.md` (TODO, next session) — standalone reference for the `~/.pm2/pm2.log` trace technique, with worked examples for crash / operator-stop / OOM / parent-kill / reboot.

**Companion skills:**
- `workflow-sanity-check` — use at P5 of the post-fix self-verify, when the incident touched UI, forms, routes, or any user-facing flow. Catches the "technically works but the workflow is bad" case.
- `autonomous-change-pipeline` — use for non-incident / non-trivial work (new builds, refactors, feature additions, audits).
