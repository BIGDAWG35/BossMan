# PHASEREPORT.md — Hermes phase / standard formalization log

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

## 2026-06-19 — DAILY-RADAR Stage 2 + Stage 7 ship

**Scope:** End-to-end DAILY-RADAR pipeline Stage 2 (Perplexity enrichment) + Stage 7 (cron + logging) under epic `t_aefb15e8`.

**What was codified:**

1. **D-12 — Research path = internal derivation (degraded-mode contract).**
   External Perplexity Browser QA path is dead on this host (CUA daemon zero-bounds bug, documented since 2026-05-23). Brave Search via curl returns 429 from this IP. Perplexity Search API is forbidden by locked rule (no API key by design). Resolution: internal derivation from Stage 1 + Stage 3 outputs, with `source: bot_internal_only` tag and `research_quality: PARTIAL`. Never fabricated. PARTIAL is the honest ceiling until external research is viable.

2. **D-13 — Two-layer USDT-symbol sanitization (defense in depth).**
   Both `daily_memo.js` (producer) and `daily_decision.js` (consumer) enforce `^[A-Z0-9]{2,15}USDT$` regex on `do_not_touch` and `watchlist`. DeepSeek can emit sentence fragments for symbol lists; without sanitization, the bot's `data/daily_radar.json` would contain malformed data. Invalid entries dropped silently with stderr warning. Caught in QA during full pipeline run — fixed at root before any bot read the file.

3. **D-14 — Cron silent-on-healthy delivery pattern.**
   Cron `2141a756a0aa` (DAILY-RADAR daily 12:00 PDT) uses `deliver: origin` but the prompt is structured to only emit on **real** failure or degraded-mode event. Healthy runs are silent. Operational equivalent of `deliver: local` without losing audit trail. First run (2026-06-19 13:04) emitted nothing to Marcelo. Pattern is reusable for any future daily pipeline cron where Marcelo does not want a daily Telegram ping.

4. **L-CRYPTO-13 — DeepSeek instruction set must recognise PARTIAL as a valid `research_quality` rating.**
   Pre-fix, DeepSeek rated any non-OK research as MISSING. Now: PASS / PARTIAL / MISSING with explicit semantics — PARTIAL = internal derivation present, external dimensions null; MISSING = no research at all. Affects `daily_memo.js` and any future consumer that reads `research_quality`.

**Where it was saved:**
- Canonical knowledge doc: `~/.hermes/knowledge/crypto-intel/STAGE_2_7_CAPTURE_2026-06-19.md`
- Obsidian mirror: `~/Obsidian/Hermes/40_Projects/Active/PROJ-2026-06_crypto-trading-intelligence/{PROJ-Overview,PROJ-Timeline,PROJ-Decisions,PROJ-Notes-2026-06-19_DAILY-RADAR-Stage-2-7}.md`
- Run evidence: `~/.hermes/knowledge/crypto-intel/daily/run_log_2026-06-19.jsonl` + `run_summary_2026-06-19.json`
- Source: `/Users/bigdawg/Projects/binance-bot/scripts/daily_{census,research,pair_brief,memo,decision}.js` + `daily_pipeline.sh`
- Cron: `2141a756a0aa` (next run 2026-06-20T12:00:00-07:00)

**Linked kanban card:** `t_aefb15e8` (DAILY-RADAR: Binance.US USDT intel radar)

**Stage 5 wire-up commit:** `96c8018`

**Verification:**
- 8/8 stages ok in end-to-end pipeline run (1 degraded fallback, degraded-mode worked)
- Total elapsed: 13.0s
- Bot runtime (PM2 `binance-bot` PID 4696): online, unaffected
- `data/daily_radar.json` final shape: `regime_today: MID_CYCLE`, `confidence: MEDIUM`, `research_quality: PARTIAL`, `watchlist: [HYPEUSDT, BTCUSDT]`, `do_not_touch: [SPXUSDT, 1000MOGUSDT]` clean

**What was NOT formalized:**
- L-CRYPTO-10 (two-gate approval) unchanged — bot stays in LIVE-pilot per Phase 11A, radar pipeline is advisory-only per L-CRYPTO-03
- No PAIRS universe changes
- No `PERPLEXITY_API_KEY` provisioning (deliberately not part of this project)

**Open follow-up (only when Marcelo asks):**
- If CUA daemon recovers, re-route Stage 2 Phase B from internal-only back to Perplexity Browser QA for true external news/sentiment (PARTIAL → OK).
- If DeepSeek keeps emitting sentences for symbol lists, add a Marcelo alert path for sanitizer drops.
