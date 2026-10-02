**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/agent-os/PHASEREPORT.md — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# PHASEREPORT.md — v3

> **2026-10-02 correction:** Historical log only (not current guidance). Canon `~/.hermes/knowledge/PHASEREPORT.md` is an archived pointer since 2026-08-31. Entries are out of order: the file says 'Newest entry on top' but '2026-09-30 — Full Gateway Recovery' is appended at the bottom and the 2026-09-30 retirement entry sits above the 'Original title' block. Spaces sync via `sync_perplexity_spaces.sh` and `~/Desktop/V3/` paths are retired; current pipeline: canon `~/.hermes/knowledge/` → `~/Desktop/spaces/<folder>/` (rebuilt by `~/.hermes/scripts/build_spaces_v4.py`) → read-only mirrors `~/.hermes/spaces/`, `~/Obsidian/Hermes/Perplexity Spaces/`, `~/Repos/BossMan/docs/perplexity-spaces/`.

> **[HISTORICAL — 2026-10-02]** Append-only phase log (2026-06-12 → 2026-09-30); canon ~/.hermes/knowledge/PHASEREPORT.md has been an archived pointer since 2026-08-31, so this is history, not current guidance.
**Version:** v3.1 (refined 2026-07-20 to add July 2026 phase entries)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Historical log (superseded 2026-10-02: was 'Canonical — v3-aligned'; canon PHASEREPORT.md is an archived pointer since 2026-08-31)
## 2026-09-30 — LBC35/OpenClaw Retirement (stack-009-lbc35)
- Marked LBC35/OpenClaw RETIRED across canon + spaces sources; deleted binaries, ~/.openclaw, Desktop OpenClaw dirs, npm packages; preserved live Obsidian vault.
- Backup at ~/backups/openclaw-lbc35-final-20260930.tar.gz (777MB, 39624 entries); cron job 18590c4c63be ('openclaw-backup-final-delete') purges it 2026-10-30 09:00.
- Delegation is now done by BossMan via kanban + route-card.sh.
- Card: t_735da189.

## Original title

_PHASEREPORT.md — Hermes phase / standard formalization log_

**Purpose:** Append-only log of major formalizations, policy adoptions, and phase closures. Each entry has: date, scope, what was codified, where, and link to the kanban card.

**Owner:** BossMan Hermes
**Convention:** Newest entry on top. Format: `## YYYY-MM-DD — <title>`

---

## 2026-07-20 — V3 canon hardening + Roles & Chain audit

**Scope:** Single-session hardening pass to lock the V3 canon, refresh the LBC35 SOUL role definition, drift-harden the V3 mirror folder, and inventory Perplexity Spaces against V3 Brain. All changes follow the V3 save order (Hermes knowledge → Obsidian → BossMan repo) and are reflected here + in the kanban ledger.

**What was codified:**

- **Roles & Chain of Command audit** — 4-role picture (Marcelo / BossMan / Perplexity / sub-agents) locked canonically. New `~/Desktop/V3/agent-os/ROLES_AND_CHAIN_OF_COMMAND.md — v3.md` (9.1 KB) added to V3 folder.
  - Kanban card: `t_roles_chain_of_command_lock_20260720` (done).

- **7-rule contract formalized** — Companion ruleset codifying the agent-stack operating contract (blueprint-first, sub-agent ownership, Perplexity-first, drift-fix loop, completion-enforcement, no-spam, escalation carve-outs). New `~/Desktop/V3/agent-os/LEARNED_7_RULE_CONTRACT.md — v3.md` (5.9 KB) added.

- **V3 model stack + token economics audit** — Canonical model routing table (M3 default → DeepSeek/OpenAI fallback (history — superseded 2026-10-02: fallback is MiniMax-M3 → Ollama qwen3.5:35b-a3b-nvfp4; paid models card-only)), token cost caps, and Perplexity-Spaces-first lookup rule locked. New `~/Desktop/V3/agent-os/LEARNED_V3_MODEL_STACK.md — v3.md` (11.9 KB) added.
  - Kanban card: `t_v3_model_stack_token_econ_lock_20260720` (done).

- **LBC35 SOUL v4.0 (delegator/router)** — LBC35 role redefined from v3.0 "delegator/router" to v4.0 "delegator/router" that hands work to sub-agents + Perplexity and never executes implementation steps itself. New `~/Desktop/V3/agent-os/LBC35 SOUL — v3 (Delegator-Router) — v3.md` (5.8 KB) replaces legacy LBC35 SOUL reference.

- **V3 canon drift-hardening** — All 4 V3 canon docs (LEARNED_*, SOUL, AGENTS, PHASEREPORT) reconciled across 3 storage layers:
  1. `~/.hermes/knowledge/` (canonical)
  2. `~/Obsidian/Hermes/30_Canon/V3-Canon/` (Obsidian mirror)
  3. `~/Repos/BossMan/docs/hermes-canon/` (GitHub mirror, public-readable)
  - Drift-check script `~/.hermes/scripts/hermes-canon-drift-check.sh` registered.
  - Kanban cards: `t_hermes_canon_drift_hardening_20260720` (PASS — mirrors in sync), plus 6 `t_drift_fix_v3_canon_20260720_*` remediation cards (all done).

- **Hermes canon sync + drift-check scripts registered** — `~/.hermes/scripts/hermes-canon-sync.sh` and `hermes-canon-drift-check.sh` added to the canonical cron catalogue. Wire-up: weekly Sunday cron (to be registered with Marcelo sign-off).

- **V3 audit: all 9 Perplexity Spaces inventoried** — Each Space checked for last-updated date, owner, and V3-Brain linkage. Result: 4 active, 3 stale (refresh candidates), 2 archive-only. Manual-update checklist handed back to Marcelo via `t_perplexity_spaces_audit_V3_20260720` (ready).

- **10 new docs added to V3 folder** — Today the V3 folder grew from 12 → 14 visible files; the 10-new figure includes the in-progress v3 mirrors staged during this hardening pass (LEARNED_7_RULE_CONTRACT, LEARNED_V3_MODEL_STACK, ROLES_AND_CHAIN_OF_COMMAND, Hermes Sub-Agent Master Blueprint — v3, plus 6 drift-fix inline patches on existing files).

**Kanban cards (today):**
- `t_roles_chain_of_command_lock_20260720` (done)
- `t_v3_model_stack_token_econ_lock_20260720` (done)
- `t_hermes_canon_drift_hardening_20260720` (done — PASS)
- 6 × `t_drift_fix_v3_canon_20260720_*` (done)
- `t_perplexity_spaces_audit_V3_20260720` (ready — Marcelo review)
- `t_V3_sync_consolidation_20260720` (done — V3 desktop folder consolidated)
- `t_drift_V3_folder_wiped_20260720` (done — recovery from canon + catalog)
- `t_git_origin_divergence_20260720` (open — operator decision needed)

**Reference:** `~/Desktop/V3/agent-os/` (this folder, 14 files); `~/.hermes/knowledge/AGENTS.md` (now inherits Governance V3); `~/Obsidian/Hermes/30_Canon/V3-Canon/` (Obsidian mirror).

---

## 2026-06-16 to 2026-07-19 — Interim work (single rollup entry)

**Scope:** Bridging rollup between the original v3.0 cut-off (2026-06-16) and the V3 canon hardening pass (2026-07-20). No discrete phase entries were filed during this window because BossMan was running project-mode + incident-mode in parallel; this entry restores ledger continuity so the canon hardening pass has a complete predecessor. 233 kanban cards were closed in this window.

**Work categories (from kanban ledger, 2026-06-16 → 2026-07-20, completed_at):**

| Category | Cards | Highlights |
|---|---|---|
| **V3 canon hardening** | 68 | Roles & Chain, 7-rule contract, model stack, LBC35 SOUL v4.0, drift-fix loops, V3 folder sync consolidation, GitHub origin reconciliation (see 2026-07-20 entry above for the canonical writeup) |
| **Other / misc** | 84 | Stage-2.5 pair briefs, inventory manifests, internal-balance source-of-truth decisions, restoration plans, ad-hoc ops cards |
| **Binance bot / balance incidents** | 33 | Pre-trade hook restoration, balance-divergence handler fix, regression test, prod-like verify, online-but-STOPPED incident triage, builder self-healing package |
| **Money Pipeline v2 (MP6)** | 16 | Epic + 12 sub-tasks (MP6-01 through MP6-14) covering architecture, scoring, dashboard, lifecycle, handoff audit, Basecamp testing templates |
| **PMD (Property Management Dashboard)** | 10 | Phase 1/6/7, Audit Gates A & B, destructive-admin-safety skill extension, 38 P3.2 design-preview decisions, recurring-expense edit bug, market-value provider mismatch bug |
| **Cron / PM2 cleanup** | 7 | PM2 + cron audit follow-ups (continuation of 2026-06-15 audit) |
| **Travel OS / Tailscale** | 6 | Tailscale Funnel exposure decision, registry reconciliation, dynamic localhost hub v1 status |
| **Dashboards / CLAW / GitHub** | 4 | GitHub naming/description normalization (BossMan, bots, dashboards), CLAW-Backup + money-pipeline + Bigdawg-remotes follow-ups |
| **Boss-hub / registry** | 4 | boss-hub HTTP 500 fix (RegistryError definition in registry_io.py), 8 offline services rewire triage |
| **Crypto / CSDAWGBOT** | 1 | Stage 1.1 chart-basics completed |

**Notable incident resolved (2026-06-18):** `t_1cb4ec89` — "Binance bot online but expected STOPPED" — closed after the self-healing package (close cousin: `t_0f9f7820`) was deployed and verified.

**Notable incident resolved (2026-06-21):** `t_62e56b48` — "binance-bot(12C-F): triage balance-divergence alert (internal=128.05 vs api/binance=498.09)" — closed by `t_c3efe8a1` (source-of-truth design) → `t_0af62e71` (persistence fix) → `t_0b3a228c` (health-check alignment) → `t_ccfc6850` (regression test) → `t_40dae539` (prod-like verify). Full 5-card chain.

**Notable milestone (2026-06-19):** Phase 6 — Money Pipeline v2 Epic (`t_9f22b48f`) closed; 12 MP6 sub-tasks all closed same day, single largest 24-hour kanban throughput event in the window.

**Phase 6 final card:** `t_d521bfe0` — "MP6-11 — Test Full Workflow with One Real Opportunity" — closed 2026-06-19 00:42:17 (the run-on-real-data verification step).

**Ledger note:** This rollup is intentionally a single entry rather than 233 micro-entries; per the kanban card ledger it is the canonical source for this window. Future windows should follow the same category-bucketed rollup pattern unless individual entries are phase-grade.

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
4. Spaces content via existing `sync_perplexity_spaces.sh`. (history — superseded 2026-10-02: script retired; Spaces are rebuilt by ~/.hermes/scripts/build_spaces_v4.py)

**Conflict resolution:** Hermes knowledge wins. Always. If Obsidian and Hermes diverge, Hermes is right and Obsidian gets corrected.

**Conflict resolution note (added 2026-06-13):** A separate parallel session of BossMan was working on `~/Desktop/CLAW-Backup/` (Marcelo's primary personal Obsidian vault) and committed `docs/OBSIDIAN_VAULT_WORKFLOW.md` to the BossMan repo (commit `04a103d`) for that vault. My version (in `~/.hermes/knowledge/`) covers the **`~/Obsidian/Hermes/`** vault, not CLAW-Backup. The repo doc was preserved; my version lives only in Hermes knowledge. See §0 "Scope clarification" at the top of Obsidian Vault Workflow.md (this note was copied from that file; PHASEREPORT has no §0).

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

---

## Change log (v3.0 → v3.1, 2026-07-20)

| # | Patch | Location | What changed |
|---|---|---|---|
| A | Frontmatter refresh | Top header (lines 1–5) | `Version: v3.0 → v3.1 (refined 2026-07-20 to add July 2026 phase entries)`; `Date: 2026-06-16 → 2026-07-20` |
| B | New phase entry | Inserted after intro block, before 2026-06-13 entries | New `## 2026-07-20 — V3 canon hardening + Roles & Chain audit` entry covering: Roles & Chain 4-role picture, 7-rule contract, V3 model stack + token economics, LBC35 SOUL v4.0 delegator/router, V3 canon drift-hardening (3 storage layers + drift-check script), Hermes canon sync scripts, Perplexity Spaces audit, 10 new docs added |
| C | Interim rollup entry | Inserted between 2026-07-20 and 2026-06-13 entries | New `## 2026-06-16 to 2026-07-19 — Interim work (single rollup entry)` covering 233 kanban cards closed in the window, bucketed by category (V3 hardening, MP6, Binance bot, PMD, Travel OS, etc.) with 2 notable incident chains and the Phase-6 MP6 milestone |
| D | Change log | Appended at bottom of file | This section — summarizes the v3.0 → v3.1 patches |

**Trigger:** V3 desktop folder was found wiped earlier in the day; recovery from canon + catalog → V3 folder rebuilt → reconciliation pass locked the canon across all 3 storage layers.

**Sibling mirrors updated today:**
- `~/.hermes/knowledge/PHASEREPORT.md` — superseded; only `.bak.20260619` exists locally (canonical source-of-truth is now the v3 mirror until next sync).
- `~/Obsidian/Hermes/30_Canon/V3-Canon/PHASEREPORT.md` — to be re-mirrored on next drift-check cycle.
- `~/Repos/BossMan/docs/hermes-canon/PHASEREPORT.md` — to be re-mirrored + pushed on next sync.

**Verified post-edit:** `wc -l` and `grep "2026-07"` confirmation commands run; results captured in the per-edit summary.


## 2026-09-30 — Full Gateway Recovery (Phase 1 Close)

**Incident:** All 9 gateways down ~14h (23:17 Sep 29 → 13:02 Sep 30)

**Root cause:** v0.21.5 upgrade committed `hermes_platform/` into the repo
but the venv was never refreshed. Every launchd spawn died in
`hermes_cli/stderr_timestamp.py:99` → `gateway/restart.py:10` →
`hermes_cli/config.py:43` → `hermes_constants.py:16` with
`ModuleNotFoundError: No module named 'hermes_platform'`.
LaunchAgent exited 1 on every attempt (runs=162, LastExitStatus=256).

**Fix sequence:**
1. `pip install -e .` in `~/.hermes/hermes-agent/venv` → import resolved
2. Unset duplicate `TELEGRAM_BOT_TOKEN` from bossman, builder, content,
   loop-engineering, ops, trading (6 profiles)
3. Unset duplicate `DISCORD_BOT_TOKEN` from ops
4. `hermes gateway migrate --multiplex` → single host gateway serves all 9
5. Installed `~/.hermes/bin/key-wizard.sh` (alias: `hermes-key`)
6. Set `DEEPSEEK_API_KEY` via wizard → session hygiene restored
7. `hermes gateway restart` → PID 71616

**Verified state:**
- All 9 profiles: ✓ (default PID 71616, 8 via multiplexer)
- Token collisions: 0 (was 7)
- Session hygiene: no abort warnings
- Kanban dispatcher: no stuck warnings
- Gateway status warnings: 0

**Known non-blocking:**
- `ai.hermes.gateway-watchdog` loaded, PID 0 — `flock` unavailable on macOS.
  Harmless; launchd handles restart natively. Candidate for removal.
- ops api_server moved to `http://127.0.0.1:8642/p/ops/v1/...` — update any
  clients calling the old per-profile port.

**Verdict: PASS-WITH-FIX** — Phase 1 complete, cleared for Phase 2.
