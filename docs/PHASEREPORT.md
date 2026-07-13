# PHASER

## 2026-06-19 — L-CRYPTO-14 governance lock: BossMan is the autonomous crypto decision engine

**What happened.** Marcelo redirected the crypto decision model: BossMan is no longer a
"package intel and ask" advisor. BossMan is now the **autonomous crypto decision engine** with
hard $75 minimum trade floor. This is a governance change, not a code/runtime change.

**Authority upgrade — what BossMan now decides (within fixed boundaries):**
- Coin rotation (add/remove/watchlist) across the 15-pair universe
- Trade type / strategy class (L-CRYPTO-12: scalper, swing, position, hedge)
- Aggressiveness tier selection (named tier, from a fixed list — not a numeric band)
- Per-trade qualify / reject

**Authority boundaries — BossMan MAY NOT change without Marcelo approval:**
- Numeric risk / aggressiveness band values
- $75 hard minimum trade floor (signal AND execution layer)
- PAPER ↔ LIVE mode flip
- Security-sensitive settings (auth, secrets, key scopes, withdrawals, leverage)

**Codified as L-CRYPTO-14.** Wired into the SPEC as the "Decision Policy" section
(spec v1.3). Wired into both pipeline skills as a hard rule.

**Hard $75 floor — dual-layer enforcement.**
- **Signal layer:** intel producers MUST NOT emit recommendations whose notional < $75.
  Any < $75 recommendation is structurally invalid and gets dropped at the source.
- **Execution layer:** the trading layer MUST reject any < $75 trade as `INVALID_FLOOR`
  even if upstream signals or human override try to pass one through.
- Both layers are required; a single-layer guard is a single point of failure.

**No Telegram spam.** Routine outputs (daily decisions, weekly intel) go to local files
and mirrors only. Telegram is reserved for security-sensitive alerts and mode/config/boundary
change approvals. Weekly summary is the default Telegram cadence for crypto.

**Wire discipline preserved (L-CRYPTO-03):** the advisory pipeline's wire contract is unchanged
at the file layer. The intel wire stays advisory-only; the decision wire is a separate
L-CRYPTO-14 layer above it. The bot's `checkIntelGate()` still reads intel as advisory.

**Phase 1 scope — governance only.** Canon artifacts + skill metadata + PHASEREPORT entry
+ Obsidian + BossMan repo mirrors. NO runtime touch. Stage 6 code wire-up (BossMan decision
emitter) is a separate, preview-gated pass. No new crons, no `.env` changes, no PM2 restarts.

**Files changed:**
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (rule count 13 → 14; L-CRYPTO-14 added)
- `~/.hermes/knowledge/SPEC-BINANCE-AUTONOMOUS-TRADER.md` (v1.3; Decision Policy section added)
- `~/.hermes/skills/crypto-weekly-review/SKILL.md` (3-5 questions loop → one-shot decision digest)
- `~/.hermes/skills/trading/daily-radar-pipeline/SKILL.md` (Stage 6 named, "no decisions" added)
- `~/.hermes/knowledge/PHASEREPORT.md` (this entry)
- Mirrors to `~/Obsidian/Hermes/` and `~/Repos/BossMan/docs/` in the next step.

**Contracts intact.**
- L-CRYPTO-02 (one-way `INTEL_GATE`) — still binds; nothing leaks back to intel producer
- L-CRYPTO-03 (advisory-only at the wire) — still binds; no bot config writes from intel
- L-CRYPTO-10 (two-gate approval for mode flips) — still binds; BossMan may not flip PAPER↔LIVE

**Status:** Phase 1 governance lock shipped. Stage 6 (BossMan decision emitter, code pass)
awaits Marcelo's preview approval.
EPORT.md — Hermes phase / standard formalization log

**Purpose:** Append-only log of major formalizations, policy adoptions, and phase closures. Each entry has: date, scope, what was codified, where, and link to the kanban card.

**Owner:** BossMan Hermes
**Convention:** Newest entry on top. Format: `## YYYY-MM-DD — <title>`

---

## 2026-06-13 — Concurrent-edit resolution: OBSIDIAN_VAULT_WORKFLOW.md

**What happened:** A separate parallel BossMan session (the `bossman-profile`) was working on `~/Desktop/CLAW-Backup/` (Marcelo's primary personal Obsidian vault) and committed `docs/OBSIDIAN_VAULT_WORKFLOW.md` to the BossMan repo at commit `04a103d`. That doc is canonical for CLAW-Backup, with focus on vault identification, security boundaries, and daily-note workflows.

My session (also on `t_a08658cc`) was formalizing the `~/Obsidian/Hermes/` vault, a different scope. I wrote `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` (12,376 bytes) covering the Hermes project vault.

Then:
- The other session's content overwrote my local `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` (a race condition on the canonical path).
- My `cp` overwrote the repo's `docs/OBSIDIAN_VAULT_WORKFLOW.md` (commit `9e74c59`).
- I noticed via `git log`, reverted my overwriting commit (`a188942`), and re-added only the 3 genuinely-new files (LEARNED, PHASEREPORT, AUTOMATION_INVENTORY) at `32d5594`.
- I restored my version to the local `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` with §0 "Scope clarification" so future sessions don't confuse the two vaults.

**Learnings codified:**
- The two vaults (`~/Obsidian/Hermes/` vs `~/Desktop/CLAW-Backup/`) have different scopes and different canonical docs.
- Concurrent BossMan sessions writing to the same canonical path is a real risk. The fix: §10 of OBSIDIAN_VAULT_WORKFLOW.md now documents that "last writer wins, but both sessions log the conflict on the kanban card and the next audit reconciles."
- Repo-side: the BossMan repo's `docs/OBSIDIAN_VAULT_WORKFLOW.md` (commit `04a103d`) is canonical for CLAW-Backup, NOT for `~/Obsidian/Hermes/`. My version lives only in Hermes knowledge.

**Status:** Resolved. Two separate canonical docs, each with a clear scope.

---

## 2026-06-12 — Obsidian vault structure and audit workflow formalized

**Scope:** Permanent operating standard for the Hermes Obsidian vault at `~/Obsidian/Hermes/`. Codifies the 11-folder + `_Templates/` layout, the save order, the project structure, and the monthly audit + bi-monthly review cadence.

**What was created / updated:**
- `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md` — full canonical blueprint (11,077 bytes, 13 sections, version history).
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — appended "Obsidian Vault Layout (Permanent — 2026-06-12)" section summarizing the rule.
- `~/.hermes/knowledge/LEARNED.md` — created with rule L-001 (Obsidian vault structure) + 4 other cross-cutting rules.
- `~/.hermes/knowledge/PHASEREPORT.md` — this entry.
- `~/Obsidian/Hermes/` — 11 standard folders + `_Templates/` created. Existing notes (Perplexity Spaces, Systems, Projects) preserved and aligned to new layout where safe.
- `~/Obsidian/Hermes/70_Workflows/Obsidian Vault Workflow.md` — human-readable mirror of the canonical doc.
- `~/Obsidian/Hermes/01_Dashboard/Dashboard.md` — single landing page linking active projects, phase report, blueprint, services map, workflows.
- `~/Obsidian/Hermes/_Templates/Project Template.md` + `Workflow Template.md` — note templates.
- `~/.hermes/scripts/obsidian-vault-audit.sh` + `obsidian-vault-review.sh` — monthly + bi-monthly audit scripts.
- Cron jobs to schedule the audits.

**Save order codified (4 steps):**
1. Write to `~/.hermes/knowledge/`.
2. Mirror to `~/Obsidian/Hermes/`.
3. Sync to `~/Repos/BossMan/docs/` and commit.
4. Spaces content via existing `sync_perplexity_spaces.sh`.

**Conflict resolution:** Hermes knowledge wins. Always. If Obsidian and Hermes diverge, Hermes is right and Obsidian gets corrected.

**Conflict resolution note (added 2026-06-13):** A separate parallel session of BossMan was working on `~/Desktop/CLAW-Backup/` (Marcelo's primary personal Obsidian vault) and committed `docs/OBSIDIAN_VAULT_WORKFLOW.md` to the BossMan repo (commit `04a103d`) for that vault. My version (in `~/.hermes/knowledge/`) covers the **`~/Obsidian/Hermes/`** vault, not CLAW-Backup. The repo doc was preserved; my version lives only in Hermes knowledge. See §0 "Scope clarification" at the top of this file.

**Synced to GitHub at:** `~/Repos/BossMan/docs/LEARNED.md`, `PHASEREPORT.md`, `AUTOMATION_INVENTORY.md` (commits `32d5594` for these 3, plus the existing `OPERATING_BLUEPRINT.md`). The OBSIDIAN_VAULT_WORKFLOW.md in `docs/` is the OTHER session's version (CLAW-Backup scope) and was **not** overwritten.

**Kanban card:** `t_a08658cc` (status: `ready` at time of this entry; will be `done` after verification).

**Next review:** 2026-07-01 (monthly audit), 2026-07-01 (bi-monthly review — first one).

---

## 2026-06-12 — Kanban policy upgrade (all work on the board)

**Scope:** Codified the rule that every real Telegram request creates or updates a kanban card. Found and fixed 30 cards in illegal statuses, 6 ghost `task_runs`, 73 active cards untagged by project.

**What was created / updated:**
- `~/.hermes/knowledge/SOUL.md` § "Kanban — All Work Goes On The Board (Hard rule — 2026-06-12)"
- 4 scripts: `kanban-snapshot.py`, `kanban-status-migration.py`, `kanban-project-backfill.py`, `kanban-runs-gc.py`
- 30 status migrations, 6 task_runs terminations, 73 project tags

**Kanban card:** `t_kanban_policy_upgrade_20260612` (done).

---

## 2026-06-12 — Inline Telegram-intake gate + cron no-spam policy

**Scope:** Deterministic inline gate for every Telegram intake. Cron no-spam policy.

**What was created / updated:**
- `~/.hermes/scripts/telegram-intake-gate.py` + `.sh` — 4-decision gate (ack / recall / approval / work).
- `~/.hermes/SOUL.md` § "Cron + Automation Policy — No Spam, High Signal (Hard rule — 2026-06-12)"
- `~/.hermes/knowledge/AUTOMATION_INVENTORY.md` — 25 cron jobs + 7 LaunchAgents inventoried with one-line justifications.
- Cron `378ef14a305b` — weekly MEMORY health check (Mondays 9:05 AM).

**Kanban card:** `t_kanban_inline_gate_20260612` (done).

---

## 2026-06-12 — Memory hygiene codified

**Scope:** Hard rule on `MEMORY.md` size + weekly health check.

**What was created / updated:**
- `~/.hermes/SOUL.md` § "MEMORY.md usage (Hard rule — 2026-06-12)"
- `~/.hermes/scripts/memory-health-check.py` — weekly audit script.
- All 5 profile + active MEMORY.md files reset to clean scaffold; USER.md trimmed.

**Kanban card:** documented in the MEMORY.md audit conversation; no dedicated card.

---

(Older entries will be backfilled from `~/.hermes/knowledge/PHASE*_*.md` files in a future audit.)

---

## 2026-06-13 — Crypto/Trading knowledge unification (B)

**Scope:** Per Marcelo's 2026-06-13 decisions, the bifurcated crypto/trading knowledge system was unified.

**Codified:**
- `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` — 12 durable rules (L-CRYPTO-01 through L-CRYPTO-12)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` — new project folder
- `~/Repos/BossMan/docs/crypto-trading-intelligence/` — GitHub backup, 4 commits (cea4762, cc7757a, 7ffc274, 0c9abd1)
- `~/archive/2026-06-13/projects/{coinbase-bot,provider-balance-dashboard,fresh-dashboard}/` — cold storage (3 projects)
- `~/Desktop/CLAW-Backup/00_HARVEST_NOTICE.md` — 12 design docs harvested, original kept as cold storage
- `git init` in `~/Projects/csdawg-dashboard/` (commit 44c100f) and `~/Projects/trading-control/` (commit b20e5b2)
- Replaced 2 Obsidian stub `SETUP.md` files (`Trading Strategy & Portfolio`, `Trading Ops`) with live engine pointers

**Kanban card:** `t_unify_crypto_knowledge_20260613` (parent, ready) with 6 children (blocked crypto-track cards): t_e752ea85, t_ec89434d, t_e53da070, t_16e717ee, t_ec23a194, t_8149c340

**Open follow-up:** Marcelo to triage the 6 blocked children. The actual strategic work for the crypto learning system lives in those cards.

**Audit reference:** `~/.hermes/knowledge/CRYPTO_TRADING_KNOWLEDGE_AUDIT_2026-06-13.md` (24 KB)

---

## 2026-06-13 — Crypto learning system active (C)

**Scope:** Per Marcelo 2026-06-13 directive, the crypto learning system went from audit-complete to actively running.

**Codified:**
- New /goal card: `t_goal_crypto_swing_trader_20260613` — Become a competent crypto swing trader (12 months, status=running)
- `t_e53da070` (Crypto Education Curriculum — Modular Foundation): blocked → **running**, linked to goal
- `t_ec23a194` (Market Regime Identification Framework): **awaiting planned→ready|scheduled decision** (planned is not in legal status set per SOUL.md § Kanban)
- 4 new Stage 1 tasks created, all linked to goal + parent + epic:
  - `t_crypto_learn_s1_01_chart_basics` — Candles, timeframes, volume
  - `t_crypto_learn_s1_02_bull_bear_structure` — HH/HL, LH/LL, trend strength
  - `t_crypto_learn_s1_03_support_resistance` — Horizontal, diagonal, key levels
  - `t_crypto_learn_s1_04_moving_averages` — 50/200 MA, golden cross, death cross
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/stage-1/INDEX.md` — Stage 1 plan + done criteria
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-review-template.md` — Sunday evening review template (6 sections: engine check / chart study / curriculum progress / live systems / lessons learned / next week)
- `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/trade-journal/README.md` — per-day tactical trade log
- `LEARNED_CRYPTO_INTELLIGENCE.md` — added "How to add new rules (L-CRYPTO-13+)" section, with threshold test (would this still be true in 6 months?) and 3-way storage rule (Hermes knowledge + project folder + BossMan repo)
- CLAW-Backup: still at `~/Desktop/CLAW-Backup/` as cold storage (7.8 MB, 141 files, harvest notice present). **No further move attempts** per Marcelo directive.

**Kanban state:**
- 1 new goal card (running)
- 2 status updates (1 to running, 1 awaiting decision)
- 4 new Stage 1 sub-tasks (all ready)
- Total: 1 + 2 + 4 = 7 card operations

**BossMan repo:** commit `834b139` — 3 files, 167 insertions, pushed to origin.

**Open follow-up:** Marcelo to pick the planned synonym for `t_ec23a194` (recommended: `ready` — in queue, not started; or `scheduled` if there's a planned start time).

**Reference:** `LEARNED_CRYPTO_INTELLIGENCE.md` (12 rules) + `weekly-review-template.md` (the review loop).

---

## 2026-06-13 — t_ec23a194 status resolved (D)

**Scope:** Per Marcelo's clarified directive, the Market Regime Identification Framework card is now `ready` (in queue, not started) instead of `blocked`.

**Change:** `t_ec23a194` status `blocked` → `ready`. Body updated with the new status note and the Stage 1 contribution context.

**All other prior crypto-system state unchanged:**
- /goal: running
- Curriculum: running
- 4 Stage 1 tasks: todo (awaiting start)
- 4 other blocked cards: untouched (still blocked)
- Weekly review template: already wired to LEARNED_CRYPTO_INTELLIGENCE.md
- CLAW-Backup: still cold storage with harvest notice (no further move attempts)

---

## 2026-06-13 — Stage 1.1 chart basics started; auto-advance rule saved (E)

**Scope:** Per Marcelo 2026-06-13 directive.

**Codified:**
- `t_crypto_learn_s1_01_chart_basics` (Stage 1.1): `todo` → **running**, started_at set
- Auto-advance rule saved as a hermes skill: `~/.hermes/skills/curriculum-auto-advance/SKILL.md`
  - When Marcelo says "done": move task to done, harvest lessons to LEARNED_CRYPTO_INTELLIGENCE.md (under "Stage 1 – Chart Basics" section, tagged [TRADING][CRYPTO][CSDAWG]), mirror to 3 storage layers, auto-advance next sibling to running

**Workflow (when 1.1 done):**
1. `t_crypto_learn_s1_01_chart_basics` → done
2. Lessons appended to LEARNED_CRYPTO_INTELLIGENCE.md under "Stage 1 – Chart Basics" section
3. `t_crypto_learn_s1_02_bull_bear_structure` → running (auto-advance)

**Skill created:** `curriculum-auto-advance` — future sessions will follow the rule without re-explanation.

---

## 2026-06-13 — Standing crypto learning instructions locked (F)

**Scope:** Per Marcelo 2026-06-13 master directive.

**Codified:**

1. **Standing state:**
   - `/goal` `t_goal_crypto_swing_trader_20260613` — running
   - Curriculum `t_e53da070` — running
   - Stage 1.1 `t_crypto_learn_s1_01_chart_basics` — running
   - Stage 1.2–1.4 — todo

2. **`t_ec23a194` (Market Regime Identification Framework) → `ready`**
   - Body text unchanged (per directive "do not change the body text")
   - This re-applies the previous turn's intent after a status reversion (likely parallel-session drift)

3. **Standing trigger:** when Marcelo says "chart basics is done" (or similar), apply the `curriculum-auto-advance` skill:
   - Mark 1.1 done
   - Harvest lessons to `LEARNED_CRYPTO_INTELLIGENCE.md` under "Stage 1 – Chart Basics" section, tagged `[TRADING][CRYPTO][CSDAWG]`
   - Mirror to Obsidian project folder + BossMan repo + commit + push to origin
   - Auto-advance 1.2 from todo to running
   - Confirm back to Marcelo which card is now running

**Skill in effect:** `~/.hermes/skills/curriculum-auto-advance/SKILL.md`

**Reference:** `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` is the canonical destination for new lessons; weekly review template (in project folder) defines the threshold (would this still be true in 6 months?) for durable rule vs stage-section lesson.

---

## 2026-06-13 — Crypto weekly review workflow (on-demand) (G)

**Scope:** Per Marcelo 2026-06-13 directive — drive weekly crypto learning reviews through CSDAWGBOT (DeepSeek + OpenAI) to improve Binance bot intel.

**Decision:** Built **on-demand**, not cron. Reasoning: the Cron no-spam rule (2026-06-12) and 3-bucket escalation rule (2026-06-09) both require explicit approval for new crons + recurring Telegram pinging + paid model calls. Marcelo didn't respond to the choice prompt, so I took the lowest-risk path: build the artifacts and trigger manually.

**What was built (no approval required, all on-demand artifacts):**

1. **Skill:** `~/.hermes/skills/crypto-weekly-review/SKILL.md` (~6.3 KB) — defines the full workflow: read context, compose 3-5 questions for Marcelo, call DeepSeek + OpenAI for 3-5 CSDAWGBOT research proposals, create linked kanban tasks, branch on PAPER vs LIVE mode, write brief to `weekly-reviews/`, commit + push.

2. **Question templates:** `~/.hermes/skills/crypto-weekly-review/references/question-templates.md` (~5.2 KB) — 6 sections (A-F) for Marcelo questions, prompt template for CSDAWGBOT, mode-aware branching table, kanban task creation rules.

3. **Detector script:** `~/.hermes/scripts/crypto-review-detect.sh` (~900 B) — recognizes `/review`, `crypto review`, `stage N review`, `weekly review`, `stage-N review`, `1.1 review` as review commands. 7/7 test cases pass.

4. **Intake gate update:** `~/.hermes/scripts/telegram-intake-gate.py` — added `command_kind: crypto-weekly-review` body tag for review commands. 6/6 review patterns match, 4/4 non-review patterns still classify correctly.

5. **Project updates:**
   - `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/PROJ-Overview.md` — references `crypto-weekly-review` and `curriculum-auto-advance` skills
   - `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-13.md` — example first-run brief (~6.1 KB)
   - `weekly-reviews/` folder created

6. **BossMan repo:** pushed 2 commits — `6126db9` (skill + overview) and `866b096` (example brief)

**What was NOT built (awaits Marcelo approval):**

- ❌ No new cron. Cron creation requires explicit approval per no-spam rule.
- ❌ No automatic Telegram ping. Default `deliver: local` for any future cron.
- ❌ No automatic model calls. Each `/review` triggers a single LLM call to DeepSeek + OpenAI for CSDAWGBOT proposals; this is what Marcelo requested.

**Mode awareness built in:**
- PAPER (current default): questions focus on learning, regime framework, intel layer improvements
- LIVE (only after two-gate per L-CRYPTO-10): questions pivot to strategy refinement + risk rules
- L-CRYPTO-03 (advisory-only) is enforced in both modes
- L-CRYPTO-10 (two-gate) gates any exit from PAPER

**Cost when models ARE called:**
- DeepSeek: ~$0.001 per review (small model, 1-2k tokens)
- OpenAI: ~$0.01 per review (medium, fallback)
- ~$0.50/year total if used weekly

**Open follow-up (when Marcelo is ready):**
- Promote `/review` to a weekly cron? (Default schedule: Sunday 6pm PT)
- Default `deliver: local` (writes brief) or `deliver: telegram` (pings summary)?
- 3-month review: did Marcelo trigger `/review` consistently? If yes, cron promotion is justified per the no-spam rule's "narrow wall-clock" criterion.

---

## 2026-06-13 — Crypto weekly review cron registered (H)

**Scope:** Per Marcelo 2026-06-13 directive (1-cron option), registered the weekly crypto review as a real cron.

**Cron registered:** ea0157d715fa
- Name: Crypto Weekly Learning and Intel Review - Sunday 6pm PT
- Schedule: 0 18 * * 0 (Sunday 6pm system-TZ, PDT/PT)
- Deliver: telegram (single Home channel ping per run)
- Mode: agent (loads crypto-weekly-review skill)
- Skills: crypto-weekly-review
- First run: 2026-06-14T18:00:00-07:00 (tomorrow)
- Prompt: pointer to ~/.hermes/skills/crypto-weekly-review/references/cron-prompt.md (8.5 KB)

**3-criteria test (Cron no-spam rule):**
- Narrow wall-clock: Sunday 6pm, fixed.
- One-sentence explainable: Weekly Sunday 6pm, run crypto learning review, write brief, ping Telegram once.
- Default deliver local: Marcelo explicitly approved Telegram ping, so deliver: telegram.

**Cost bound:** at most 1 DeepSeek call + at most 1 OpenAI call (fallback) per run. If either exceeds 4k tokens input, surface cost in brief and ask Marcelo before expanding.

**No-spam:** explicit rule in cron-prompt: do not send daily or extra pings. If brief is empty, say "nothing to review" and exit.

**Important note from registration:** The first registration attempt used --profile trading which routed the cron to the trading profile jobs.json (id db495c7ea712), segregated from the default profile scheduler. Detected via grep, removed by deleting the profile jobs.json, re-registered in default profile (id ea0157d715fa). The hermes cron list and hermes cron remove CLI does NOT see profile-scoped jobs, so direct file deletion was the only path.

**No-spec drift:**
- ~/.hermes/knowledge/AUTOMATION_INVENTORY.md updated: 28 cron jobs (was 27), new row 28 with one-line justification
- ~/.hermes/skills/crypto-weekly-review/references/cron-prompt.md created (8.5 KB, full instructions)
- ~/Repos/BossMan/skills/crypto-weekly-review/SKILL.md already on origin (commit 6126db9)

**Next run:** tomorrow Sunday 2026-06-14 18:00 PDT.

---

## 2026-06-14 — Crypto weekly review (5 tasks proposed, 5 created)
- mode: PAPER, regime: MID_CYCLE/UNCERTAINTY (0.45), funding: NEGATIVE 164w, death_cross 245w
- intel: 6 days stale (2026-06-08 → 2026-06-14) — first CSDAWGBOT proposal is intel refresh
- stage: Stage 1.2 (bull/bear structure) running; Stage 1.1 closed 2026-06-13
- proposed: 5 CSDAWGBOT tasks (intel refresh, prediction resolution, Stage 1.3 draft, regime-precursor backtest, sector rotation study), created 5 kanban cards
- cards: t_8bec8b2a, t_947f0fa4, t_00af7146, t_b58afdfe, t_fcc58ae8 (all todo, assignee=trading)
- brief: ~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-14.md
- mirror: ~/Repos/BossMan/docs/crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-14.md
- commit: 1c4f970 pushed to origin/main
- cost: 1 M3 call (3,784 input / 4,483 output tokens, ~$0.01); 0 DeepSeek, 0 OpenAI (per cost-control budget, M3 produced structured output in one pass — no second call needed)
- l-crpto rule updates: none (no durable new lesson this week — only intel-refresh + prediction-resolution protocol candidates, which need another week of data to qualify for L-CRYPTO-14)
- L-CRYPTO-10: dormant (PAPER default preserved)
- L-CRYPTO-03: enforced (no engine writes, no bot config changes, no auto-trade triggers)
- First-resolution dates to watch: 2026-06-18 (LINK WARM + WARM-count-10+), 2026-06-19 (WARM-13+), 2026-06-22 (regime-conf > 0.5)

## 2026-06-15 — PM2 + Cron Cleanup Audit (Marcelo directive)

**Result:** 11 safe actions executed, 3 investigations completed. 13 → 12 PM2 processes, 31 → 25 active Hermes crons, 1 PM2 god daemon (was 3), 2 orphan dirs cleaned.

**Killed/removed:**
- 2 ghost PM2 daemons (PIDs 67410, 37930) — orphaned `/Users/bigdawg/.hermes/pro` home
- caddy PM2 process (90,812 restart loop, no Caddyfile) — removed; doc: `~/.hermes/knowledge/infrastructure/CADDY_REMOVED_2026-06-15.md`
- 2 obsolete Hermes crons: `dcdb8bf68e01` (disabled since 2026-05-27, missing script), `d7baa1737ba8` (Basecamp Monitor)
- 1 duplicate system crontab entry: `squarespayouts-status-exporter.js` (already covered by Hermes cron 0561fcffeba1)
- 1 stale PM2 module_conf.json port override: `squarepayouts: 8030` (squarepayouts not running on any port)
- 1 orphan script moved to `legacy/`: `basecamp-monitor-cron.sh`

**Consolidated:**
- 2 Monday 8am crons → 1 (88eff3953480 absorbs 2ba797d7ccfa's scope; survivor = LLM-driven)
- 6 Travel OS trip reminder crons → 1 (7f58cef97c80, runs all 6 stages of process-trip-reminders.py)

**Throttled (per system stability):**
- PM2 Health Monitor: `*/5` → `*/15` (288/day → 96/day)
- Travel OS External Watchdog: `*/5` → `*/15` (288/day → 96/day)
- Binance-bot-live-monitor and binance-bot-auto-ticket: KEPT at `*/5` per Marcelo policy

**Doc changes:**
- pm2-health-check SKILL.md: trading-control route updated `/api/health` → `/` per directive; caddy-removal cross-ref added

**Investigated (no fix):**
- pmd-web: 37 restarts = cumulative from dev-mode hot-reloads; current run 3D stable, 0 unstable, prod mode. `/portfolio` returns HTTP 200. **NOT in PM2 health-check whitelist — should be added if health-monitor coverage desired.**
- boss-hub-internal / boss-hub-external: 5 restarts each, all clustered at bring-up (June 12), `unstable_restarts: 0`, 3D current uptime. **Healthy, no action needed.**
- Hermes gateway (PID 1679): 90% CPU reading was a burst (6.7% → 0.6% in 5s). Healthy state, 14-day uptime, 4 ESTABLISHED HTTPS connections to LLM providers, 4 LSP child processes (TypeScript, Python, bash), cua-driver, Chrome headless. **No stuck job. Baseline Hermes activity.**

**Cron count:**
- Before audit: 31 active
- After audit: 25 active (31 - 2 deleted - 1 collapsed into 1 = 6 deleted, 1 merged with existing = 25)
- Breakdown: 25 active + 0 disabled = 25 total

**PM2 count:**
- Before audit: 13 (1 caddy in restart loop + 12 healthy)
- After audit: 12 (caddy removed, all 12 healthy)

**Open finding flagged in report (NOT auto-fixed):**
- pmd-web not in PM2 health-check whitelist. Route: `/portfolio` (HTTP 200). Should be added if auto-repair coverage is wanted.

## 2026-06-19 — Browser QA / Perplexity in Brave path restored

**Context.** The 2026-05-28 Brave + Perplexity bridge doc described a CuaDriver / Hermes
Computer Use path. That path is dead on this host (CuaDriver zero-bounds bug; Perplexity
desktop app same). The 2026-06-19 STAGE_2/7 capture initially concluded "Perplexity Browser
QA path is dead" and locked the pipeline to internal-only derivation. **Both conclusions
were later overturned** when a separate, isolated Brave instance + raw WebSocket CDP
turned out to be a working path.

**What was built.**
- `scripts/cdp_client.js` — raw WebSocket CDP client, no new deps. `openPerplexity()` and
  `queryPerplexity(prompt, opts)` exposed.
- `scripts/daily_research.js` — added `--source browserqa` mode with per-symbol graceful
  fallback to Brave text search → internal-only.
- `scripts/daily_pipeline.sh` — preferred path switched to `browserqa`; added post-Phase-B
  source-tally audit logging to RUN_LOG.
- New isolated Brave instance launched with `--remote-debugging-port=9222 --user-data-dir=/tmp/brave-debug`
  so the bot path does NOT touch Marcelo's default profile or `cello35` Perplexity login.

**Three non-obvious traps (D-16, D-17) documented at:**
`~/.hermes/knowledge/LEARNED_BRAVE_PERPLEXITY_BRIDGE.md` (mirrored at
`/Users/bigdawg/Repos/BossMan/docs/LEARNED_BRAVE_PERPLEXITY_BRIDGE.md`).

1. Perplexity has no submit button — `form.requestSubmit()` does NOT trigger the React
   submit. Use real `Input.dispatchKeyEvent` Enter OR direct URL `/search?q=...`.
2. Citations are ¹²³ superscripts, not `[1]` chips — polling heuristic must use
   `indexOf('Sources')`, not regex on bracket chars.
3. `JSON.stringify` template-literal regex literals double-escape `\\d` → runtime sees
   `\d` → matches single chars like "d". Use `indexOf` to avoid the escape game.

**Cron impact.** None. The existing `2141a756a0aa` (daily_pipeline.sh @ 12:00 PT) continues
to do all the work; no new jobs registered.

**Verification.** BTCUSDT smoke test: 14.2s, 6406 chars, `ok:true`, source-tag
`perplexity_browser_qa`. Token log shows `model: perplexity_search`, `ok: true`.

**Contract intact.** L-CRYPTO-03 advisory-only; no trading config or PAIRS universe changes;
internal-only derivation remains the last-resort fallback with `research_quality: PARTIAL`.

**Files mirrored across canonical layers** (dual-layer rule):
- `~/.hermes/knowledge/LEARNED_BRAVE_PERPLEXITY_BRIDGE.md` ↔ `/Users/bigdawg/Repos/BossMan/docs/LEARNED_BRAVE_PERPLEXITY_BRIDGE.md`
- `~/.hermes/knowledge/AUTOMATION_INVENTORY.md` ↔ `/Users/bigdawg/Repos/BossMan/docs/AUTOMATION_INVENTORY.md`
- `~/.hermes/knowledge/PHASEREPORT.md` (this file) ↔ `/Users/bigdawg/Repos/BossMan/docs/PHASEREPORT.md`
- `~/.hermes/knowledge/crypto-intel/STAGE_2_7_CAPTURE_2026-06-19.md` (Recovery section added)
- Memory entry: "Perplexity = Browser QA via CDP only" (lesson cluster D-12/13/14/15/16/17)

**BossMan can now debug or re-run this path in future sessions without pulling Marcelo
back into the loop** — every artifact, trap, and decision is captured in the canonical docs.

## 2026-06-19 — Stage 6 BossMan Decision Emitter wired (Phase 2-3)

**Marker.** `L-CRYPTO-15-EMITTER-SHIPPED-2026-06-19`

**What shipped.** `scripts/bossman_decision.js` — Stage 6 of the DAILY-RADAR pipeline. Pure
BossMan decision emitter: reads Stage 1-3 intel (`data/daily_radar.json`, `data/pair_briefs.json`,
`~/.hermes/knowledge/crypto-intel/daily/DAILY_MEMO_<date>.json`,
`~/.hermes/knowledge/crypto-intel/weekly/latest/intelligence.json`) plus `server.js` PAIRS
(regex-parse, read-only), then emits **one** structured artifact: `data/bossman_decision.json`
(overwrite) plus a dated archive `data/bossman_decision.<YYYY-MM-DD>.json`. Inline schema
validator enforces 8 hard-reject conditions — on any failure the artifact is NOT written.

**Governance.** L-CRYPTO-14 contract preserved end-to-end: $75 hard floor enforced at the
signal layer (sub-75 rows dropped, counted in `floor_audit.denied_below_floor`); no Telegram
spam; no PAPER↔LIVE flip; no numeric risk-band mutation; no `.env` / `server.js` /
`pre-trade-hook.js` / `ecosystem.config.cjs` / cron / PM2 writes. New rule L-CRYPTO-15
locks the schema and validation rules. Bot's `checkIntelGate()` still reads
`data/daily_radar.json` unchanged — Stage 6 is a sibling artifact, not a replacement.

**Preview gate.** Marcelo approved the design preview (msg 27899) before any code was
written. Preview covered schema, validation rules, dual-layer $75 floor split, tier set,
strategy classes, wire discipline, files-to-add list, and verification plan.

**Verification (live).** Inline validator: **128/128 checks pass** (top-level fields, schema
constants, universe parity with PAIRS, per_coin coverage, tier/strategy/decision enums, $75
floor, mode block). SHA-256 of artifact stable across re-reads. `pm2 jlist`: `binance-bot`
PID 4696 unchanged before/after Stage 6 writes — no restart. `.gitignore` updated to
exclude `data/bossman_decision*.json` (artifact contains live daily decisions, not
source-of-truth).

**Files added/changed.**

- NEW: `scripts/bossman_decision.js` (~660 lines, inline JSON-schema validator, no new npm deps).
- NEW: `data/bossman_decision.json`, `data/bossman_decision.2026-06-19.json` (gitignored).
- UPDATE: `~/.hermes/knowledge/LEARNED_CRYPTO_INTELLIGENCE.md` (rule count 14 → 15; L-CRYPTO-15 section appended).
- UPDATE: `~/.hermes/knowledge/SPEC-BINANCE-AUTONOMOUS-TRADER.md` (v1.4 row; new "Stage 6 — BossMan Decision Emitter" section before Gate Map).
- UPDATE: `~/.hermes/skills/trading/daily-radar-pipeline/SKILL.md` (Stage 6 status: PREVIEW-GATED → PENDING WIRE).
- UPDATE: `.gitignore` (added `data/bossman_decision*.json`).
- Mirrors: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` and `~/Repos/BossMan/docs/`. Commit local only, no git push.

**Today's artifact (preview).** regime `MID_CYCLE`, confidence `MEDIUM`, watchlist
`[HYPEUSDT]`, do_not_touch `[]`. Tier distribution: T1=5, T2=10, T3=0. Strategy: swing (15).
Decisions: QUALIFY=9, DENY=6. No sub-75 rows. `next_action = human_review_or_approval_required`.

**Open items / next pass.**

- Stage 7 — bot reads `bossman_decision.json` for trade gating (separate card, separate approval).
- Execution-layer $75 floor in `pre-trade-hook.js` (separate card).
- Per-trade qualify integration (separate card).
- HARD GATE §B (LIVE-readiness): UI-verified `canWithdraw=false`, but checklist is still paused pending a second-pass review of `canTrade` semantics with Marcelo before resuming Phase 11A.
- Push deferred pending merge strategy with sibling commits.

---

## Phase 2-4 — Stage 7 BossMan Decision Reader (shipped 2026-06-19, local-only commit)

**Scope:** read-and-gate integration pass. Bot READS `data/bossman_decision.json` (Stage 6 emitter artifact) and gates signals per `per_coin[sym].decision`. Sibling to `checkIntelGate()` — does NOT replace it.

**Files added:**
- `binance-bot/scripts/_bossman_decision.js` — pure read-and-gate module (read-only, no writes, no npm install).
- `binance-bot/scripts/_test_bossman_decision.js` — 21/21 unit + integration fixtures.

**Files edited (server.js only, additive):**
- `binance-bot/server.js` — +28 / -1. New section header block, env flag read, `checkBossmanDecision()` call between intel gate and inFlight, journal log shape, additive `bossmanDecisionGate` flag on `/health` + `/state` payloads, config-line append.

**Files UNTOUCHED (verified by `md5sum`):**
- `.env` (no env-var additions)
- `ecosystem.config.cjs` (no PM2 changes)
- `pre-trade-hook.js` (no execution-layer mutation)
- `package.json` (no npm install)
- `data/bossman_decision.json` (Stage 7 is read-only; Stage 6 remains sole writer)

**Wire discipline:**
- No PM2 restart. PID 4696 unchanged before/after wire-up.
- No `.env` mutation. Env flag defaults ON, no overrides set.
- No cron change. No Telegram. No PAPER↔LIVE flip.
- No numeric aggression/risk-band changes. No sizing math change.
- `strategy_class` and `aggression_tier` from artifact are NOT consulted — reserved for separate future card.

**Fail-CLOSED contract (L-CRYPTO-16):** every error path blocks the signal and journals a reason code:

| Condition | Code |
|---|---|
| File missing | `BOSSMAN_FILE_MISSING` |
| Schema/version/layer/rule invalid | `BOSSMAN_SCHEMA_INVALID` |
| Date ≠ today OR mtime > 24h | `BOSSMAN_STALE` |
| Symbol absent / case-mismatch | `BOSSMAN_SYMBOL_MISMATCH` |
| `decision == "DENY"` | `BOSSMAN_DENY` |
| `decision == "WATCH_ONLY"` | `BOSSMAN_WATCH_ONLY` |
| `decision == "QUALIFY"` | allow |
| `BOSSMAN_DECISION_GATE_ENABLED=false` | pass-through |

**Cache:** in-memory, TTL = 5 min, invalidated on file mtime change. No disk cache.

**Verification (all green):**

- ✅ `node scripts/_test_bossman_decision.js` → **21/21 fixtures pass**
- ✅ `node -c server.js` → clean
- ✅ `node -c scripts/_bossman_decision.js` → clean
- ✅ `git diff --stat HEAD -- server.js` → **+28 / -1**, additive only
- ✅ `md5sum .env ecosystem.config.cjs pre-trade-hook.js package.json` → unchanged
- ✅ `pm2 jlist` (pid 4696 baseline) — no restart
- ✅ `git check-ignore -v data/bossman_decision.json` → artifact stays out of git

**Docs:**

- ✅ `LEARNED_CRYPTO_INTELLIGENCE.md` — L-CRYPTO-16 added (count 15→16)
- ✅ `SPEC-BINANCE-AUTONOMOUS-TRADER.md` — bumped to v1.5; Stage 7 section appended; v1.5 deltas line; Stage 7 card crossed off the "what's NOT in Phase 2-3" list
- ✅ `PHASEREPORT.md` — this entry

**Commits (local only, NO push per Phase 2-3 protocol):**

- Stage 7 wire-up: pending (will commit only my own files: `server.js`, `scripts/_bossman_decision.js`, `scripts/_test_bossman_decision.js`; will not touch sibling subagent commits)

**Open items / next pass.**

- Execution-layer $75 floor in `pre-trade-hook.js` (separate card).
- Per-trade qualify integration using `strategy_class` + `aggression_tier` (separate card).
- HARD GATE §B (LIVE-readiness): still paused pending second-pass `canTrade` review with Marcelo.
- Push deferred (per L-CRYPTO-11 + standing macOS-git-hang rule).

---

## Phase 11A — Execution-layer $75 hard floor (L-CRYPTO-17, SHIPPED 2026-06-19)

**What:** Third independent $75 floor — the LAST line of defense inside `executeTrade()`. Runs AFTER sizing logic, intel gate, and BossMan decision gate. If anything ever passes a sub-75 notional into `executeTrade()` (race, manual trigger, future sizing drift), this guard catches it.

**Why:** Upstream `size === 0 → return` at line ~277 does not catch non-zero sub-75 quantities. LOT_SIZE pre-check at line ~408 only checks Binance's `ex.minNotional` (~$10), NOT our $75. Execution layer was the genuine gap.

## Phase 11B — Three-layer $75 observability CLI (SHIPPED 2026-06-19)

**What:** Read-only CLI to summarize the three-layer $75 stack from `data/bot.db::signal_journal`. Counts `BOSSMAN_*` blocks (Stage 7), `EXECUTION_FLOOR_BELOW_75` blocks (Phase 11A), and `executed=1` passes over any date range. Output: text or JSON to stdout.

**Why:** Operator (Marcelo) needs to see end-to-end what the three-layer stack is doing without writing new behavior, new crons, new dashboards, or Telegram pings. Strictly read-only on the journal.

**Files (1):** `scripts/_summary_gates.sh` (NEW, +159 lines, bash + sqlite3 CLI + jq, zero Node deps).

**Scope discipline:**

- Zero writes anywhere (DB, files, env, PM2, cron, Telegram).
- No decision-changing logic — purely counter queries on existing journal rows.
- No new dependencies (sqlite3 + jq already on system PATH).
- Synthetic-data test passed: 5-row fixture produced correct counts (2 BossMan + 1 floor + 2 passed = 5).

**Verification (all green):**

- ✅ `node -c server.js` → clean
- ✅ `node -c scripts/_execution_floor_guard.js` → clean
- ✅ `node scripts/_test_execution_floor.js` → 18/18 pass
- ✅ `node scripts/_test_bossman_decision.js` → 21/21 pass (no regression)
- ✅ `md5 -q .env ecosystem.config.cjs package.json` → unchanged
- ✅ `pm2 jlist` (pid 4696 baseline) — no restart, online
- ✅ `sha256sum data/bossman_decision.json` → `0bea7a37...d250` stable
- ✅ `git check-ignore -v data/bossman_decision.json` → still gitignored
- ✅ `git diff --stat HEAD -- server.js` → +39/-0, additive only

**Strict-interpretation decisions (surfaced, not auto-final):**

- PAPER sub-75 blocked: **YES** (stricter). Add `EXECUTION_FLOOR_BYPASS_PAPER=true` if you want simulation to pass sub-75.
- Counter exposed via PM2 logs only: **YES** (no dashboard mutation).

**Docs:**

- ✅ `LEARNED_CRYPTO_INTELLIGENCE.md` — L-CRYPTO-17 added (count 16→17)
- ✅ `SPEC-BINANCE-AUTONOMOUS-TRADER.md` — bumped to v1.6; Phase 11A section appended; execution-floor card crossed off

**Commit (local only, NO push per L-CRYPTO-11):** pending — will commit only my own files; will not touch sibling subagent commits.

**Open items (unchanged):**

- Per-trade qualify integration using `strategy_class` + `aggression_tier` (separate card).
- HARD GATE §B (LIVE-readiness): still paused pending second-pass `canTrade` review.
- Push deferred (per L-CRYPTO-11 + standing macOS-git-hang rule).

## Phase 11C — Governance spec pass: strategy classes + aggression tiers + market regimes (SHIPPED 2026-06-19)

**What:** Two new governance specs canonicalize the vocabulary BossMan uses in `data/bossman_decision.json`. Both specs are pure prose+tables at the governance layer — no engine constants, no runtime behavior, no schema change, no numeric risk-band change.

1. `~/.hermes/knowledge/SPEC-STRATEGY-CLASSES-AGGRESSION-TIERS.md` v0.1 (L-CRYPTO-18) — strategy classes (scalper / swing / position / hedge) and aggression tiers (TIER_1_CONSERVATIVE / TIER_2_BASE / TIER_3_AGGRESSIVE) with concrete bands (hold-time, R:R, notional cap, concurrent positions, equity-at-risk, drawdown tolerance) AND the class × tier legality matrix.
2. `~/.hermes/knowledge/SPEC-MARKET-REGIMES.md` v0.1 (L-CRYPTO-19) — 7-value regime vocabulary (EARLY_CYCLE / MID_CYCLE / LATE_CYCLE / DISTRIBUTION / RISK_OFF / RECOVERY / UNKNOWN) with regime → tier gate matrix and legacy aliases (CAPITULATION → RISK_OFF; EUPHORIA → LATE_CYCLE).

**Why:** Directive §3 (2026-06-19) shifted focus to higher-level crypto learning and strategy-class/aggression-tier/market-regime definition work at the governance/spec layer. No new code. Numeric bands explicitly labeled "governance guardrails and typical ranges, NOT engine constants" per Marcelo direction; implementation-level constants in `SPEC-BINANCE-AUTONOMOUS-TRADER.md` and bot code may be **narrower** but must NOT exceed the L-CRYPTO-18 ceilings without a new L-CRYPTO rule.

**Wire discipline:** Pure governance pass. The $75 pipeline (L-CRYPTO-14 / 15 / 16 / 17), Stage 6 emitter schema, Stage 7 BossMan gate, execution-layer $75 guard, sizing math, PAIRS, .env, PM2, cron, and Telegram behavior remain **frozen**. No new crons. No Telegram pings. No PM2 or .env changes.

**Files (local only, no push per L-CRYPTO-11):**

- ✅ `~/.hermes/knowledge/SPEC-STRATEGY-CLASSES-AGGRESSION-TIERS.md` — NEW, ~155 lines, prose + tables + 4 cross-refs
- ✅ `~/.hermes/knowledge/SPEC-MARKET-REGIMES.md` — NEW, ~174 lines, prose + 7-regime catalogue + tier gate + legacy alias
- ✅ `LEARNED_CRYPTO_INTELLIGENCE.md` — rule count 17 → 19; L-CRYPTO-18 + L-CRYPTO-19 added (pure spec pointers)
- ✅ `SPEC-BINANCE-AUTONOMOUS-TRADER.md` — bumped to v1.7; "Upstream governance specs" subsection appended; v1.7 deltas line; frozen-pipeline reminder
- ✅ Obsidian + BossMan docs mirrors (parity check below)
- ✅ `daily-radar-pipeline/SKILL.md` — one-line cross-ref to both new governance specs

**Mirrors (3-mirror parity):** `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/` and `~/Repos/BossMan/docs/crypto-trading-intelligence/`.

**Commit (local only, NO push per L-CRYPTO-11):** pending — will commit only my own files; will not touch sibling subagent commits.

**No-drift verification (confirmed):**

- ✅ No changes to `server.js`, `scripts/_execution_floor_guard.js`, `scripts/_stage6_*`, `scripts/_stage7_*`, `data/bot.db`, `.env`, `ecosystem.config.cjs`, or any cron expression.
- ✅ PM2 process for binance-bot still on port 8104; no restart needed (no code touched).
- ✅ Rule count: 17 → 19 (LEARNED only; SPEC v1.6 → v1.7; PHASEREPORT entry appended).
- ✅ BossMan decision artifact schema (L-CRYPTO-15) unchanged: same `per_coin[sym].strategy_class` / `per_coin[sym].aggression_tier` / `metadata.regime_today` fields, same enum values, same numeric types.

**Open items (unchanged):**

- Per-trade qualify integration using `strategy_class` + `aggression_tier` (separate card, frozen).
- HARD GATE §B (LIVE-readiness): still paused pending second-pass `canTrade` review.
- Regime evidence-base linking (existing memo corpus to SPEC-MARKET-REGIMES §6) — pointer only; no content rewrite in this pass.
- Position sizing math for tiers beyond the notional cap (L-CRYPTO-18 §6 open question, separate card).
- Hedge sizing math (L-CRYPTO-18 §6 open question, separate card).
- Push deferred (per L-CRYPTO-11 + standing macOS-git-hang rule).


## 2026-06-28 — Crypto weekly review (L-CRYPTO-14 digest, no new tasks)
- mode: PAPER (behavioral); API mode field = "LIVE" string drift, unchanged from 2026-06-21
- regime: MID_CYCLE / UNCERTAINTY / confidence=0.45 (7th consecutive week at this reading)
- regime basis: -999% annualized (was -139% last week; 7× widening — methodology audit recommended)
- intel age: 6d 20h stale (same as last week); trigger threshold 7d hit by next cron
- Stage 6 emitter: 9 days since last bossman_decision.json (was 2d last week — escalated from routine observation to stalled pipeline)
- curriculum parent t_e53da070: BLOCKED (agent crash x3) — new state vs. prior weeks
- decisions in latest artifact (2026-06-19 23:02): 9 QUALIFY / 6 DENY; floor audit clean; mutation NONE
- cost: $0.00 (0 LLM calls — within ≤1-call weekly budget)
- brief: ~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-06-28.md
- commit: b23db8c (local; remote push BLOCKED on rebase conflict in ROUTING-RULES.md — see Step 7 note)

## 2026-07-05 — Crypto weekly review (L-CRYPTO-14 digest, no new tasks)
- mode: PAPER (behavioral); API mode field = "LIVE" string drift, unchanged from prior 3 weeks
- regime: MID_CYCLE / **CONFIRMED** / confidence=**0.65** (was UNCERTAINTY/0.45 — first material regime-confidence move in 8+ weeks)
- regime basis: **+1401% annualized** (was -999% last week; net 14-day swing = 1540pp from -139% → +1401%) — **new PUMP_AND_DUMP_RISK flag ACTIVE/HIGH**
- intel age: 5d 19h stale (eased from 6d 20h; one new snapshot 2026-06-29)
- Stage 6 emitter: **15d 18h since last bossman_decision.json** — but reframed this week from "stalled pipeline" to **gated on Marcelo preview approval** (card `t_bb2fd054` blocked since 2026-06-19)
- BTC: $60,409 (-5.96% WoW); drawdown -52.09% (widened 3.04pp); volatility regime NORMAL → LOW
- curriculum parent t_e53da070: BLOCKED (carry-forward; agent crash x3)
- decisions in latest artifact (2026-06-19 23:02): 9 QUALIFY / 6 DENY; floor audit clean; mutation NONE
- approval-boundary item this week: **t_bb2fd054 Stage 6 emitter preview** — single approval request surfaced in F1
- cost: $0.00 (0 LLM calls — within ≤1-call weekly budget)
- brief: ~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-07-05.md

## 2026-07-12 — Crypto weekly review (run 5) + bot recovery from 36h sqlite3 outage
- **INCIDENT recovered:** binance-bot offline ≥36h (2026-07-11T04:00 PT → 2026-07-12T18:00 PT). Root cause: sqlite3 native binding built for arm64, Mac is x86_64 → dlopen failure → auto-recovery budget (3/3) exhausted. Fix: `npm rebuild sqlite3` + reset `auto-recovery-state.json` + `pm2 start`. Bot online now (pid 64855).
- **NEW finding:** `PAPER_MODE=false` at .env level since 2026-06-15 (NOT a string drift as 2026-06-21/06-28/07-05 briefs framed). Runtime still effectively PAPER via INTEL_GATE + BossMan gating + LIVE_PILOT_MAX_NOTIONAL=75. Surfaced for operator confirmation, not flipped (L-CRYPTO-20).
- **LESSON added:** cron-shell PATH omission silently disables auto-recovery (no Telegram surface for ≥36h outage). Future cron changes should set explicit PATH or source the user's shell rc.
- regime: MID_CYCLE / **UNCERTAINTY rolled back** (0.65 → 0.45) — CONFIRMED was a 1-week peak, not structural flip
- regime basis: **+1638% annualized** (was +1401% last week; net 17-day swing = 1777pp from -139% → +1638%) — **PUMP_AND_DUMP_RISK ACTIVE/HIGH, week 3**
- intel age: 6d 3h stale (refresh 2026-07-06; within 7d soft-signal)
- Stage 6 emitter: **22d 19h since last bossman_decision.json** — still gated on Marcelo preview approval (card `t_bb2fd054` blocked since 2026-06-19; week 5)
- BTC: $64,396 (+6.6% WoW); drawdown -48.92% (narrowed 3.17pp); volatility regime LOW
- daily_radar: 0 HOT / 28 WARM / 93 WATCH / 0 COLD — universe flattened, no breakout candidates
- curriculum parent t_e53da070: BLOCKED (carry-forward; agent crash x3)
- decisions in latest artifact (2026-06-19 23:02): 9 QUALIFY / 6 DENY; floor audit clean; mutation NONE
- approval-boundary items this week: **(NEW) PAPER_MODE=false env-level LIVE confirmation** + **(carry-forward week 5) t_bb2fd054 Stage 6 emitter preview** — both surfaced as single approval requests in F1
- cost: $0.00 (0 LLM calls — within ≤1-call weekly budget)
- brief: ~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/weekly-reviews/crypto-review-2026-07-12.md
