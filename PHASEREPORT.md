# PHASEREPORT.md — Hermes phase / standard formalization log

**Purpose:** Append-only log of major formalizations, policy adoptions, and phase closures. Each entry has: date, scope, what was codified, where, and link to the kanban card.

**Owner:** BossMan Hermes
**Convention:** Newest entry on top. Format: `## YYYY-MM-DD — <title>`

**Note on convention drift:** The 2026-06-23 AUTONOMY entry below was committed at the bottom (commit 4ba2aa6) contrary to this convention. Future appends follow the convention; a separate housekeeping pass will re-order the existing entries.

---

## 2026-06-23 — S1-KERNEL: Wire Security & PM2 Watch Goal Loop into SOUL + AGENTS

**Scope:** Kernel-doc wiring only. SOUL.md + AGENTS.md (canonical + Obsidian mirror) now reference the S1 Goal Loop so future sessions discover it without service behavior change.

**What was codified:**
- **SOUL.md § AUTONOMOUS REMEDIATION MODEL → "Security & PM2 Watch Goal Loop (Phase S1, 2026-06-23)"** — 20-line subsection describing the monthly meta-loop, 5-step INTAKE→DECOMPOSE→EXECUTE→REVIEW→DONE, hard STOPs (no PM2 deletes, no port opens, no service restarts, no SOUL/AGENTS/ROUTING-RULES/MODELROUTINGWORKFLOW edits inside the loop), P1+ findings surface as separate fix cards, no-spam defaults (Telegram only on P0 or Step-5 FAIL), idempotent script, and the S1.202606 first-cycle Step-5 verdict.
- **AGENTS.md (canonical `~/Projects/BossMan/hermes/AGENTS.md`) — 4th Goal Loop family blockquote** alongside AUTONOMOUS CHANGE PIPELINE, GOAL LOOP PATTERN, DOC HYGIENE GOAL LOOP.
- **AGENTS.md (Obsidian mirror `~/Obsidian/Hermes/20_Agents/AGENTS.md`)** — added the same 4th blockquote AND restored the AUTONOMOUS CHANGE PIPELINE + GOAL LOOP PATTERN blockquotes that had drifted from the canonical mirror. Obsidian and canonical now match (4 blockquotes each, byte-identical in the blockquote range).

**Cron:** S1 cron `675fdbeba374` remains registered (schedule `30 23 1 * *`, no-agent, deliver=local). No cron change in this wiring.

**Step-5 verdict:** `docs/verdicts/step5-verdict-s1-kernel-doc-2026-06-23.json` — **PASS** (BossMan self-check; DeepSeek unreachable in this env so M3 + grep audit was used as the v3 routing fallback. Patch text matches operator spec verbatim; behavior change = none; scope change = none; cron change = none.)

**Routing ledger:** worktype=audit, leadmodel=M3+DeepSeek (DeepSeek-unavailable, M3 used), costtier=Tier 1, qa_required=yes.

**Kanban:**
- Goal card (rehydrated after state-loss): `t_bf23cc0f` — "Security & PM2 Watch — Keep PM2/crons/security posture clean (Goal Loop)"
- Wiring card: `t_1a027791` — "S1-KERNEL: Wire Security & PM2 Watch Goal Loop into SOUL + AGENTS"
- P1 cards (rehydrated, still in `ready`, NOT auto-fixed): `t_03d2f5d6` (PM2 blessed baseline), `t_3a1e2a3b` (bakery port 3001 vs 8040), `t_5d33d8b9` (boss-hub public vs localhost).

**Mirror state:** SOUL.md = hermes kernel (single source, no mirror required). AGENTS.md mirrored canon→Obsidian via this patch. Per `~/.hermes/knowledge/DOC-SYNC-MATRIX.md`, the BossMan repo and Obsidian vault are now in sync for the blockquote range.

**Caveat:** Patch text references the pre-state-loss Goal card ID `t_e56d53cd`. The current rehydrated Goal card is `t_bf23cc0f`. Future cycle scripts should resolve the Goal card dynamically by title, not by hard-coded ID. Documented in the Step-5 verdict.

**Evidence:**
- SOUL.md lines 116-135
- AGENTS.md canonical line 427
- AGENTS.md Obsidian lines 421-428
- Step-5 verdict JSON
- Cron list (`hermes cron list 2>&1 | grep 675fdbeba374`)

---

## 2026-06-23 — Phase S1 Security & PM2 Watch: Goal Loop + Cron Proposal (no-spam)

**Goal:** Add a long-lived Security & PM2 Watch Goal Loop that wraps (does not
replace) the existing security-watch daily/weekly drivers and the PM2 Health
Monitor cron. Monthly cadence, no-spam default, hard STOPs on money/trading/
auth/env/kernel-doc.

**Scope:** Add a Goal Loop for runtime health + security posture drift. Same
pattern as Phase 3 doc-hygiene loop. Align with the 4 primary skills'
existing Scope & STOPs blocks (pm2-health-check, incident-response,
kanban-orchestrator, migration-playbook). Draft a cron proposal that is
NOT registered until operator approves.

**What was codified:**

- **S1-P1 — Long-lived Goal card.** `t_e56d53cd` "Security & PM2 Watch —
  Keep PM2/crons/security posture clean (Goal Loop)". Status=ready.
  Body contains: Goal, 5 success criteria, timeframe=monthly (started
  2026-06-23), 8 explicit STOPs, autonomous scope (8 items), full Routing
  Ledger (worktype=audit+watch, leadmodel=M3+DeepSeek, costtier=Tier 1,
  qa_required=yes), references 5 skills + 3 blessed crons + BLESSED-LISTS.md
  baseline + 5 Phase 2 carve-outs.
- **S1-P2 — 5-step loop spec.** `~/.hermes/knowledge/GOAL-LOOP-SECURITY_PM2.md`
  (287 lines, 10 H2 sections). Steps: INTAKE (PM2 + cron + LaunchAgent
  snapshots) → DECOMPOSE (3 child cards) → EXECUTE (diff vs baseline, BLESSED
  items only) → REVIEW (`SECURITY_PM2_REVIEW_YYYY-MM.md` ≤200 lines + one-line
  PHASEREPORT) → DONE (Step-5 PASS, Goal card log update, mirror).
- **S1-P3 — Alignment matrix.** `~/.hermes/knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md`
  (161 lines, 8 H2 sections). Cross-references 4 primary skills. Result:
  14/14 autonomous capabilities allowed; 15/15 STOPs consistent; Routing
  Ledger = strict subset; Step-5 verdict shape + JSON path convention
  aligned. Conflict resolution rule: more conservative STOP wins + operator
  approval required.
- **S1-P4 — Cron proposal (NOT REGISTERED).** `~/.hermes/knowledge/SECURITY_LOOP/SECURITY_PM2_CRON_PROPOSAL_2026-06-23.md`
  (262 lines, 13 H2 sections). Schedule: `30 23 1 * *` (1st of month,
  23:30 PT — 30 min after doc-hygiene to avoid contention). Default:
  report-only, local-only when PASS, Telegram only on P0/FAIL. Estimated
  ~$0.20/cycle. Crontab verified empty for S1 entry; hermes cron list
  verified empty for S1 entry. 4 approval options A/B/C/D. Standing
  assumption: 7-day default = no action.
- **S1-P5 — Step-5 PASS + PHASEREPORT + mirror + operator pre-approval ask.**
  Step-5 verdict JSON: `~/Projects/BossMan/docs/verdicts/step5-verdict-security-pm2-2026-06-23.json`
  (verdict: PASS). PHASEREPORT entry (this section, NEWEST-ON-TOP). Mirror
  to GitHub BossMan repo via `cp` + `git add` + `git commit`. SOUL.md /
  AGENTS.md additions prepared but NOT applied (Phase 2 carve-out: kernel-doc
  edits require explicit operator pre-approval).

**Pre-existing infrastructure (BLESSED, do NOT re-register):**
- Skill: `~/.hermes/skills/security-watch/SKILL.md` (Phase 3+4 shipped earlier
  today, 2026-06-23)
- Cron: `security-watch-daily` (id 133f6f655d59, `17 3 * * *`, local)
- Cron: `security-watch-weekly` (id 1b1e3e82a86a, `42 18 * * 0`, local)
- Cron: PM2 Health Monitor (every 5 min, local)
- Skill: `~/.hermes/skills/pm2-health-check/SKILL.md` (Phase 2 blessed)
- Skill: `~/.hermes/skills/incident-response/SKILL.md` (Phase 2 blessed)
- Skill: `~/.hermes/skills/devops/kanban-orchestrator/SKILL.md` (Phase 2 blessed)
- Skill: `~/.hermes/skills/devops/migration-playbook/SKILL.md` (Phase 2 blessed)
- Baseline: `~/.hermes/knowledge/security-watch/BLESSED-LISTS.md` (26 crons +
  11 LaunchAgents + 14 PM2 processes, 100% clean as of 2026-06-23)

**Phase S1 cards:**
- Parent: `t_21f1db14` (ready → running when children promoted; auto-completes
  when all children done; pending final close after Step-5)
- S1-P1 `t_384470fc` ✅ done
- S1-P2 `t_4543a0ab` ✅ done
- S1-P3 `t_e5786971` ✅ done
- S1-P4 `t_89ce7840` ✅ done
- S1-P5 `t_61025967` in_progress (this entry)
- Goal card: `t_e56d53cd` (ready, long-lived — stays in `ready` for monthly cycles)

**Stop reasons enforced:**
- SOUL.md / AGENTS.md additions: prepared as proposal, NOT applied (Phase 2
  carve-out: kernel-doc edits require explicit operator pre-approval)
- Cron registration: HALT, awaiting operator choice (A/B/C/D)
- No new autonomous capabilities: S1 is a meta-loop wrapping existing skills

**Pattern precedent:** Phase 3 Doc Hygiene (entry above) — same Goal Loop +
monthly cron proposal pattern. S1 is the security/PM2 counterpart.

**Next steps (operator decision required):**
1. Approve SOUL.md / AGENTS.md cross-reference additions (or revise) → A/B/C/D
2. Approve cron registration (or revise schedule) → A/B/C/D
3. Decide whether S1 cron fires 2026-07-01 (first proposed date) or after
   a manual first cycle to validate the loop

**Verdict:** Step-5 PASS — see `~/Projects/BossMan/docs/verdicts/step5-verdict-security-pm2-2026-06-23.json`

---

## 2026-06-23 — Phase 3 Doc Hygiene: Goal Loop + Monthly Cron Proposal (no-spam)

**Goal:** Wire doc hygiene into the Goal Loop pattern so canon stays tight without
constant manual audits. Replace the ad-hoc "2026-06-23 audit + cleanup" pattern
with a monthly, low-noise, high-signal cadence.

**Scope:** Skill `goal-loop` (worke...[truncated]

**Scope:** Strengthen the autonomous-change pipeline and 4 critical operational skills with explicit Scope & STOPs; codify the reusable Goal Loop pattern for any goal/multi-week project/learning objective.

**What was codified:**

- **P1 — Map scope + audit.** All 5 target skills located, read, and audited. Canonical locations documented in `~/.hermes/knowledge/PHASE2_PIPELINE/P1_AUDIT.md`. Frontmatter + section anchors captured for surgical edits.
- **P2 — Design STOPs/Scope language.** Standardized "Scope & STOPs" section designed with 4 mandatory parts: Purpose + Autonomous scope + Approval gates + STOP conditions. Plus Routing Ledger table + Step-5 QA rule + Canonical references. Design doc: `~/.hermes/knowledge/PHASE2_PIPELINE/P2_DESIGN.md`.
- **P3 — Apply to 5 skills.** Scope & STOPs section inserted near the top of each:
  - `~/.hermes/skills/autonomous-change-pipeline/SKILL.md` (ACP — the governance parent)
  - `~/.hermes/skills/devops/pm2-health-check/SKILL.md`
  - `~/.hermes/skills/devops/kanban-orchestrator/SKILL.md`
  - `~/.hermes/skills/devops/migration-playbook/SKILL.md`
  - `~/.hermes/skills/devops/incident-response/SKILL.md`
- **P4 — Goal-Loop skill + SOUL/AGENTS cross-refs.** New skill `~/.hermes/skills/goal-loop/SKILL.md` derived from the crypto learning system. 5-step loop: intake → decompose → execute (with STOPs) → review (cadence) → done (with lesson harvest). Cross-references added to `~/.hermes/SOUL.md` (provenance list) and `~/.hermes/AGENTS.md` (new standing blockquote).
- **P5 — PHASEREPORT entry + Step-5 verdict + mirror sync.** This entry. Step-5 verifier JSON at `~/Projects/BossMan/docs/verdicts/step5-verdict-phase2-hardening-2026-06-23.json`. Mirror sync after commit.

**Where (final canon locations):**
- `~/.hermes/skills/autonomous-change-pipeline/SKILL.md` (Scope & STOPs added)
- `~/.hermes/skills/devops/pm2-health-check/SKILL.md` (Scope & STOPs added)
- `~/.hermes/skills/devops/kanban-orchestrator/SKILL.md` (Scope & STOPs added)
- `~/.hermes/skills/devops/migration-playbook/SKILL.md` (Scope & STOPs added)
- `~/.hermes/skills/devops/incident-response/SKILL.md` (Scope & STOPs added)
- `~/.hermes/skills/goal-loop/SKILL.md` (NEW — Goal Loop pattern)
- `~/.hermes/SOUL.md` (Goal Loop cross-ref added to ACP provenance)
- `~/.hermes/AGENTS.md` (Goal Loop standing rule blockquote added)
- `~/Projects/BossMan/PHASEREPORT.md` (this entry at top)
- `~/.hermes/knowledge/PHASE2_PIPELINE/{P1_AUDIT.md,P2_DESIGN.md,PHASEREPORT_AUTONOMY_PHASE2_2026-06-23.md}` (working docs)
- `~/Projects/BossMan/docs/verdicts/step5-verdict-phase2-hardening-2026-06-23.json` (Step-5 PASS)

**Kanban:** t_3441147e (parent) · 5 P1 children (P1=t_061a2cde, P2=t_d77d0ca1, P3=t_5ab509f8, P4=t_4b257efc, P5=t_04beaafb — all done) · Step-5 QA PASS pending

**Rule of record (Phase 2 — 2026-06-23):** Every non-trivial change must run on ACP with explicit Scope & STOPs. Every goal/multi-week project/learning objective must run on the Goal Loop pattern. The 5 carve-out categories (infra install/remove/upgrade, public/VPN port changes, security-relevant behavior, vendor/API/billing, true product-direction) remain the only things that halt BossMan. Mirror discipline unchanged: Hermes canon → Obsidian → GitHub. One-way canon → mirror.

---

## 2026-06-23 — Documentation Integrity Audit & Phase 1 Hygiene Fixes (Doc-sync PASS)

**Scope:** Comprehensive 9-finding audit of Hermes canon / Obsidian / GitHub mirrors; apply 4 P0 + 4 P1 fixes to tighten doc canon before autonomy expansion.

**What was codified:**
- **F1 (kernel drift):** SOUL.md M2.7 → M3 default. 5 active policy lines aligned with AGENTS.md v3.0 (commit c2e703b).
- **F2 (skill drift):** ACP skill re-synced from canon → GitHub (4,657-byte drift; includes audit-class extensions from 2026-06-23).
- **F3 (missing canon):** SOUL.md placed in Obsidian `20_Agents/` for human-readable mirror.
- **F4 (case-dup collapse):** 90 lowercase duplicate files deleted from `~/.hermes/knowledge/`. 91 → 0 case-dup pairs. ~990 KB reclaimed. Zero cross-references broken.
- **F6, F7 (stale mirrors):** SERVICES_MAP.md (Jun 2) and BLOCKER_RESOLUTIONS.md (May 7) aligned across Hermes canon, Obsidian, and BossMan/docs/. md5 identical at all 3 locations.
- **F5 (PHASEREPORT coverage):** 4 missing milestones backfilled — Single Status Surface (2026-06-09), Autonomous Remediation Model (2026-06-09), Cross-Device Bridge (2026-06-09), CuaDriver Self-Heal (2026-05-25).
- **E1 refined:** 91 case-dup pairs (not 88 as initially reported in P3/P4 estimates — bundled detection script confirmed 91, not 88).

**Where:**
- `~/.hermes/SOUL.md` (5 M2.7→M3 patches applied)
- `~/.hermes/knowledge/{SERVICES_MAP.md,BLOCKER_RESOLUTIONS.md}` (re-created from BossMan/docs Jun 2 source)
- `~/Obsidian/Hermes/{20_Agents/SOUL.md,30_Services-Maps/SERVICES_MAP.md,10_Operating-Blueprint/BLOCKER_RESOLUTIONS.md}` (mirrors aligned)
- `~/Projects/BossMan/hermes/skills/autonomous-change-pipeline/SKILL.md` (synced from canon)
- `~/Projects/BossMan/PHASEREPORT.md` (4 missing milestones + this entry)
- `~/.hermes/knowledge/PHASEREPORT_DOC_FIXES_2026-06-23.md` (consolidated report)

**Kanban:** t_6693aa83 (parent) · 7 P1 children (P1-1, P1-2, P1-3, P1-4, P1-5, P1-6, P1-7 — all done) · Step-5 QA PASS · all mirror md5s verified

**Rule of record:** Hermes canon is the source of truth. Obsidian + GitHub are read-only mirrors. Hermes wins on conflict. One-way canon → mirror. Doc-sync after every non-trivial change.

---

## 2026-06-18 — Phase 5 v3.3: Multi-Project Flow + Backlog Triage under Cap

**Scope:** 4 projects (Option 1, locked) — `money-pipeline`, `binance-bot`, `csdawg-dashboard` (tag = `agent-os`, lane = `agent-os`), `youtube-content`.

**Decisions locked by Marcelo:**
1. `csdawg-dashboard` is a project **tag**; the lane is `agent-os`. The tag is what counts under the cap.
2. Logical epic per project (no new physical epic cards in this phase). 1–2 active cards per project under cap=2.
3. Top-3 blocked ranked by unblock-likelihood, not age.

**Writes applied (3, all per Marcelo's instruction):**
| # | Action | Result | Card |
|---|---|---|---|
| 1 | Add `project: binance-bot` to Binance Bot v1 Epic | no-op (tag already present at body line 5 — P5-1a scan missed it) | `t_9fe07c44` |
| 2 | Create YouTube placeholder card | created, status=ready, has `project: youtube-content` | `t_8ba0f9ae` |
| 3 | Unblock Money Pipeline v2 Epic | `blocked` → `ready` | `t_9f22b48f` |

**Operational surprise (disclosed):** Within ~12s of write 3, the dispatcher tick fired and auto-claimed `t_9f22b48f` because its body still has `Internal owner: bossman` + `Human owner: Marcelo` and `bossman` is the default-assignee profile. A worker (pid 16409) is now `running` on the Epic. Pre-existing block-comment had read "Requires Marcelo approval before executing subcards. Marcelo has not yet responded in the comment thread." Two paths: (A) let the worker produce something Marcelo reviews, (B) re-block the Epic and pick MP6-01 manually. **Not auto-resolved — surfaced to Marcelo.**

**Tag backfill status:** 87/87 active cards now have a canonical `project:` tag (0 untagged, 0 legacy, 0 mis-tagged). The "untagged" classification in P5-1a was a scan-regex bug; first-line-only match missed tag lines that appeared after a heading. Verified via direct SQL.

**Recompute vs. manual promote:** `recompute_ready()` does **not** auto-promote `ready` parents' children — only `done` parents trigger child promotion. MP6-* children stayed `todo` after the Epic unblock. Per Marcelo's "no other status edits" directive, children are not auto-promoted in this phase.

**Cap interaction:** verified live at 2026-06-18 17:09 — 3 ready+tagged binance-bot tasks for `builder` produced `spawned: 2, skipped_per_project_capped: 1` with shape `{task_id, project, current}`. Untagged tasks confirmed cap-exempt.

**Advisory outputs (not codified as DB writes):**
- Per-project logical epics + 1–2 active card picks → see Telegram digest message of 2026-06-18.
- Per-project top-3 blocked by unblock-likelihood → published in the same digest.
- No card renames. No new physical epic cards. No status mutations beyond the 3 listed above.

**Mirrors (deferred to Phase 6 sync per standing save-order policy):** This entry is in `~/Projects/BossMan/PHASEREPORT.md` only. Mirrors at `~/Repos/BossMan/PHASEREPORT.md`, `~/Repos/BossMan/docs/PHASEREPORT.md`, `~/Projects/BossMan/docs/PHASEREPORT.md` do not yet have it.

---

## 2026-06-18 — Phase 4 v3.2: per-project concurrency cap (dispatcher pick-time rule)

**What happened:** Marcelo approved the §10.2 mechanism revision: the
active-card cap is no longer enforced by demoting cards to `todo` (which
collided with `recompute_ready()` auto-promotion on every
`hermes kanban list` call). Instead, the cap is enforced at dispatcher
pick time, opt-in via `kanban.max_in_progress_per_project` in
`~/.hermes/config.yaml`. Status mutations are forbidden for cap
compliance — only `recompute_ready()` owns the `todo ↔ ready ↔ blocked`
transitions.

**What was codified (append-only — no rewrites):**

1. `hermes_cli/kanban_db.py` — new `_extract_project_tag(body)` helper
   (regex, first-match-wins, returns `None` for untagged), new
   `DispatchResult.skipped_per_project_capped: list[(task_id, project,
   current)]` field, new cap block inside `dispatch_once()` mirroring
   the existing per-profile cap pattern. `ready_rows` SELECT
   extended with `body` so the cap can read project tags. **No schema
   changes.**
2. `hermes_cli/kanban.py::_cmd_dispatch` — reads
   `kanban.max_in_progress_per_project` from `load_config()`, coerces
   to positive int, passes to `dispatch_once()`. CLI JSON output
   surfaces `skipped_per_project_capped` (alongside the existing
   `skipped_per_profile_capped`).
3. `tests/hermes_cli/test_kanban_per_project_cap.py` — 13 unit tests:
   cap=1, cap=2, untagged-bypass, recompute-untouched (regression),
   idempotency, dry-run, telemetry field shape.
4. `~/.hermes/knowledge/ROUTING-RULES.md` §10.6 (NEW) — canonical
   definition: semantics, config, telemetry, implementation surface,
   out-of-scope. §10.2 mechanism amendment explaining why demote-to-todo
   was retired (cap-vs-recompute conflict). Version-history row v3.2.
5. `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` §10.7 (NEW) —
   model-routing perspective: when the cap fires, what happens to
   deferred tasks, interaction with model choice (none), Routing
   Ledger impact (none). Version-history row v3.2.

**Backward compatibility:** Zero-risk. When the config key is unset
(default), dispatcher behavior is bit-for-bit identical to the
pre-Phase-4 baseline. Verified live: `hermes kanban dispatch --dry-run
--json` shows the new `skipped_per_project_capped: []` field as an
empty list — the JSON shape now includes it but no tasks are skipped.

**Test results (2026-06-18):**

- `tests/hermes_cli/test_kanban_per_project_cap.py` — 13/13 pass in
  0.65s
- `tests/hermes_cli/test_kanban_per_profile_cap.py` — 9/9 pass
  (regression check — my `SELECT body` change didn't break it)
- `tests/hermes_cli/test_kanban_cli_dispatch_passthrough.py` — pass
- `tests/hermes_cli/test_kanban_db_init.py` — pass
- `tests/hermes_cli/test_kanban_core_functionality.py` — 196/197
  pass; 1 failure is pre-existing test-isolation flakiness (passes when
  run alone, fails when run after other tests in same session — shared
  monkeypatched env). Not caused by this change.

**Config-set is PENDING Marcelo approval.** Hermes refuses to write
`~/.hermes/config.yaml` without explicit consent (security-sensitive
infrastructure file — Approval Trigger #2). The default value `2` was
Marcelo's initial request. When set, live `skipped_per_project_capped`
will populate on dispatch. Until then, the field is well-formed but
empty.

**Decisions logged:**

- **Cap-vs-recompute conflict resolved by separation of concerns:**
  dispatcher owns cap, `recompute_ready()` owns status. They don't
  fight anymore. The cap can never be undone by an accidental
  `hermes kanban list` call.
- **Untagged-bypass is intentional.** Forward compat: new tags can be
  introduced without a code change. Legacy/no-tag work is not held
  hostage to a vocabulary upgrade.
- **Uniform cap only (single global value).** Per-project tiered caps
  (different N per project) explicitly deferred. Today's rule is one
  knob, one ceiling.
- **No schema changes.** Adding a column or table would have broken
  every existing bossman board. The cap fits entirely in
  `dispatch_once()` + `DispatchResult`.

**Status:** Code + tests + canon DONE. Config-set awaiting Marcelo
approval (infrastructure trigger #2). DB restored to clean state
after live dry-run: `kanban.db.post_p4_12_20260618_165647` is the
new baseline.

**Related kanban cards:** `t_pm2_daemon_env_leak_1780979963`-style
audit trail linked from the active Phase 4 P4.11/P4.12 cards.

---

## 2026-06-09 — Single Status Surface: BossMan as Only Authorized Status Origin

**Scope:** Stop all autonomous Telegram/status traffic from OpenClaw/LBC35 and other LaunchAgents. BossMan is the single status surface for Marcelo.

**What was codified:**
- No direct Telegram from any agent other than BossMan
- `ai.openclaw.gateway` LaunchAgent DISABLED (was sending autonomous summaries bypassing BossMan)
- Legacy `com.local.pm2-watchdog`, `com.local.squarepayouts`, `com.local.bakery` LaunchAgents DISABLED (redundant with BossMan PM2 health monitor)
- Remaining LaunchAgents under review: `quickstats`, `teamstandup`, `mission-control` — no Telegram routing confirmed
- All work, verification, and status flows through BossMan Kanban or direct BossMan report

**Where:**
- `~/.hermes/SOUL.md` §Single Status Surface — BossMan as Only Authorized Status Origin

**Rule of record:** BossMan is the only authorized status origin. No other system, agent, LaunchAgent, cron job, or script may send direct Telegram messages or notifications to Marcelo outside the BossMan routing layer.

---

## 2026-06-09 — Autonomous Remediation Model: BossMan fixes on its own

**Scope:** BossMan must diagnose, fix, verify, and report — without escalating routine matters to Marcelo. Marcelo is brought in ONLY on the 5 carve-out categories.

**What was codified:**
- 4-step remediation: Diagnose → Fix → Verify → Report
- AI stack uses Claude / DeepSeek / OpenAI for diagnosis and fix planning
- PM2 / crash / build / config / port / auth / DB / queue issues: BossMan handles autonomously
- Marcelo approval gate ONLY for: (1) infra install/remove/upgrade, (2) public/VPN port or domain changes, (3) security-relevant behavior changes, (4) vendor/API/billing decisions, (5) true product-direction
- "Challenge bad logic, not just broken code" — fix the workflow, not just the symptom

**Where:**
- `~/.hermes/SOUL.md` §AUTONOMOUS REMEDIATION MODEL (Mandatory — 2026-05-27)

**Rule of record:** Marcelo should NEVER be asked to run commands, restart services, switch browsers, test localhost URLs, or perform routine troubleshooting. BossMan fixes on its own, verifies, and reports.

---

## 2026-06-09 — Cross-Device Bridge: Perplexity Spaces access from any device

**Scope:** Marcelo may initiate work from Perplexity Spaces on any device (phone, iPad, MacBook Pro). BossMan picks up the named Space + answer snippet on the Mac mini via Hermes Computer Use and proceeds autonomously.

**What was codified:**
- BossMan owns all follow-up with Perplexity, planning, implementation, and verification
- Marcelo is the approval gate only — never a relay between tools
- Space thread content is OPTIONAL trigger context, NOT a dependency
- All agent reasoning comes from: local mirror + standing docs + Perplexity main search
- "Marcelo removed from relay loop" — BossMan does NOT ask Marcelo to copy/paste Perplexity output

**Where:**
- `~/.hermes/SOUL.md` §Perplexity as Default Communication Channel — Cross-Device Bridge (Permanent)

**Rule of record:** Cross-device work via Spaces. Marcelo is approval gate. BossMan owns the full research → implement → verify cycle.

---

## 2026-05-25 — CuaDriver Self-Heal + Fallback (Phase Cua)

**Scope:** Make CuaDriver critical infrastructure that never silently blocks project work. Auto-heal the singleton and provide fallback when broken.

**What was codified:**
- 4-layer health monitor on the CuaDriver daemon
- Auto-restart on stale `_CuaDriverSession` singleton (root cause of 2026-05-25 instability)
- Fallback path when CuaDriver is broken: use Browser QA at `https://perplexity.ai` as primary research path
- Operational status: ✅ CuaDriver daemon HEALTHY (auto-heal active), ✅ Perplexity main search via Browser QA, ✅ Local mirrors canonical

**Where:**
- `~/.hermes/SOUL.md` §CuaDriver Self-Heal + Fallback (Permanent — Phase Cua, 2026-05-25)

**Rule of record:** CuaDriver is critical infrastructure. Never silently block project work. Auto-heal + fallback to Browser QA.

---

## 2026-06-18 — Phase 4: Multi-Project OS + Loop Engine

**What happened:** Approved Marcelo's Phase 4 preview (no changes) and executed end-to-end on the bossman board + canon. Phase 4 layers multi-project discipline + a paid-model artifact-reuse loop on top of Routing Rules v3 + Model Routing Workflow v3. The 6-step Default Build Flow and model roles are untouched — everything is additive.

**What was codified (5 new + 1 amended canon doc):**

1. `PHASE_4_MULTI_PROJECT_OS.md` (NEW, canonical) — declares Phase 4, defines project tags, active-cap, fast-track carve-out, mirror contract, success metrics.
2. `PROJECT_VOCABULARY.md` (NEW) — closed list of 10 project tags: `money-pipeline`, `binance-bot`, `crypto-intel`, `bakery-ops`, `square-payouts`, `pmd`, `altus-forensic`, `youtube-content`, `agent-os`, `travel-os`. Mapping table from legacy title prefixes (`[MP]`, `[BC]`, `[SQ]`, etc.) and legacy tag values (`Trading`, `Bakery`, `SquarePayouts`, `Infra`, `Cross-Cutting`, `AltusForensic`).
3. `ARTIFACT_INDEX.md` (NEW, seeded) — single-lookup table of Tier-4/5 outputs. 18 seeded rows across 7 projects. Loop hook is one grep.
4. `ROUTING-RULES.md` §10 (NEW appendix) — Multi-Project OS section (tag enforcement, cap, fast-track, mirror rule, exception path).
5. `MODEL_ROUTING_WORKFLOW.md` §10 (NEW appendix) — Routing Ledger gains 2 new fields (`reuse_check`, `artifact_index_entry`); full loop hook shell snippet (§10.2), valid skip reasons (§10.3), post-call save protocol (§10.4), 2 worked examples (§10.5).
6. `KNOWLEDGE_REUSE_PIPELINE.md` §6 (NEW, "Loop Hook") — executable form of the existing §3 Paid Model Artifact Reuse Policy; inserted ahead of "Memory Capture Policy Summary" which was renumbered §7; old §7/§8 bumped to §8/§9.

**What was changed in the bossman board (86 active cards):**

- **Tag backfill (P4.7):** 86/86 active cards now carry a closed-vocabulary `project:` tag. Pre-P4 distribution: 0 cards had canonical tags (14 had no `project:` line, 72 had legacy values like `Trading`, `Bakery`, `Cross-Cutting`). Post-P4: 31 `money-pipeline`, 19 `agent-os`, 12 `crypto-intel`, 9 `binance-bot`, 5 `altus-forensic`, 4 `square-payouts`, 4 `bakery-ops`, 2 `pmd`. Cards were NOT renamed — only the body field was updated.
- **Active-card cap (P4.8):** 4 projects exceeded the 1-running + 1-ready cap (`money-pipeline` 14 ready, `agent-os` 4 ready, `binance-bot` 4 ready, `bakery-ops` 2 ready). 20 cards demoted to `todo` with a `phase4-note: active-cap: project X exceeded Y cap (P4.8 enforcement 2026-06-18)` reason line in the body. Post-P4: 0 breaches.
- **Backup:** `kanban.db.pre_p4_backup_20260618_160704` (pre-tag-backfill) + `kanban.db.pre_p48_backup_20260618_160830` (pre-cap-demotion) saved alongside the live DB.

**What was wired (loop hook):**

- DRY-RUN verified: 3 past Tier-4 outputs (`SPEC-BINANCE-AUTONOMOUS-TRADER.md`, `CRYPTO_TRADING_KNOWLEDGE_AUDIT_2026-06-13.md`, `PHASE_4_MULTI_PROJECT_OS.md`) all return hits when grepping `ARTIFACT_INDEX.md` for their project tag — pre-check latency is sub-millisecond, so no effective slowdown.
- Every future Tier-4/5 Routing Ledger now requires `reuse_check: yes|no` + `artifact_index_entry: <path>`. Valid skips are `index_unavailable` or explicit `override: <reason>` from Marcelo. Other skips logged as violations.

**Decisions logged:**

- **Append-only on existing canon** — no rewrites of Routing Rules v3.0, MRW v3, or Pipeline §1–§5/§7–§8. The 6-step Default Build Flow, model roles, Perplexity budget, Light Build Metrics, and LBC35 model-agnostic rule are explicitly OUT of scope (per preview guardrails).
- **Card titles preserved** — only the body field was modified. The `[MP]`, `[BC]`, `[SQ]` title prefixes coexist with the new `project:` body field.
- **Fast-track carve-out** — cards with `fast-track: yes` in body are exempt from the cap. None exist yet; gate is reserved for future urgent work.
- **Ambiguous Cross-Cutting classification resolved manually** — 18 cards needed human review because the legacy `Cross-Cutting` tag was overloaded (meta-workflow, project-specific, personal-admin). Final mapping committed; reasoning logged here for the audit trail.

**Status:** Implemented. Verification step P4.11 in progress (tag-backfill confirmed; cap confirmed; index presence confirmed; mirrors deferred to Phase 6 sync per standing save-order policy).

**Related kanban card:** (none — this was inline phase closure, not card-driven).

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


---

## 2026-06-23 — AUTONOMY-BY-DEFAULT OPERATING MODEL v3

**Scope:** Make BossMan the default operator for non-trivial changes (builds, refactors, troubleshooting, audits, bad-logic fixes). Marcelo remains the approval gate — but only on 5 carve-out categories.

**What was codified:**
- 5-child PMD pipeline (P1–P5) as the default execution shape for non-trivial changes
- 5-carve-out approval gate (infra install / public port / security / vendor-billing / product-direction)
- "Challenge bad logic, not just broken code" rule
- "BossMan NEVER reports done without Step-5 PASS + P5 self-verify PASS" kernel rule
- 3 new templates (handoff-packet, acceptance-criteria, step5-verdict.json)
- 2 new skills (autonomous-change-pipeline, workflow-sanity-check) + 1 patch (troubleshooting-mode adds cross-refs)
- LBC35 SOUL v3.0 (no model pick, no Perplexity Computer, no Step-5 override, SquarePayouts M3 ban)
- 8-dim autonomy audit PASSED (separate card t_8458f5b5)

**Where:**
- `hermes/SOUL.md` §AUTONOMOUS REMEDIATION MODEL + AUTONOMOUS CHANGE PIPELINE
- `hermes/AGENTS.md` v3.0
- `hermes/templates/{handoff-packet,acceptance-criteria,step5-verdict.json}`
- `hermes/skills/{autonomous-change-pipeline,workflow-sanity-check}/SKILL.md`
- `hermes/skills/troubleshooting-mode/SKILL.md` (patched — companion skills)
- `PHASEREPORT_AUTONOMY_v3_2026-06-23.md` (comprehensive entry)
- `~/Obsidian/Hermes/10_Operating-Blueprint/AUTONOMY_OPERATING_MODEL_v3.md` (mirror)
- `~/Obsidian/Hermes/50_Phase-Reports/PHASEREPORT_AUTONOMY_v3_2026-06-23.md` (mirror)

**Kanban:** t_0376eba5 (parent) · P1–P5 children (all done) · doc-sync PASS · git push PASS

**Rule of record:** BossMan autonomous-by-default for all non-trivial changes. Iteration limits are NOT blockers. Marcelo approves ONLY on 5 carve-out categories.
