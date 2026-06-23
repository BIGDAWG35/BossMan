# Goal Loop — Security & PM2 Watch (Monthly)

**Goal card:** `t_e56d53cd` · **Phase S1 parent:** `t_21f1db14` · **Approved:** 2026-06-23

This document is the canonical spec for the monthly Security & PM2 Watch loop. It
applies the [Goal Loop pattern](../skills/goal-loop/SKILL.md) to a long-lived
runtime + security posture audit, **wrapping** (not replacing) the existing
`security-watch` (Phase 3+4 shipped 2026-06-23) and `pm2-health-check` (Phase 2
blessed) infrastructure.

**The S1 loop is a meta-loop.** It does not add new autonomous capabilities.
It consumes the existing security-watch daily/weekly drivers and the PM2 Health
Monitor cron as inputs, and produces a monthly review + PHASEREPORT entry.

---

## Scope & STOPs (Permanent — 2026-06-23)

**Purpose:** Make explicit what the Security & PM2 loop may auto-execute vs
what it must escalate. Tied to the autonomous-change-pipeline skill's Scope &
STOPs and the v3 Routing Ledger.

### Autonomous scope (loop may run without operator approval)

- **Read-only detection** — `pm2 list`, `hermes cron list`, `launchctl list`,
  `lsof -iTCP -sTCP:LISTEN`, `crontab -l`, `~/.hermes/state/security-watch/`
  reads. NO writes, NO restarts, NO kills of new processes.
- **Baseline diffing** — diff `pm2 list` / `hermes cron list` / `launchctl list`
  against `~/.hermes/knowledge/security-watch/BLESSED-LISTS.md`. Surface
  unknowns, ghosts, and drift as findings.
- **Report generation** — write `SECURITY_PM2_REVIEW_YYYY-MM.md` to canon
  (≤200 lines) + a one-line entry in `PHASEREPORT.md`
- **Mechanical cleanup of BLESSED items** — kill a known-ghost PM2 process
  that is already in `BLESSED-LISTS.md` as removed/dead, delete a known-dead
  cron job already in `BLESSED-LISTS.md` as removed. NO cleanup of items NOT
  in the blessed baseline.
- **Goal card updates** — bump `last_reviewed` field, add `## YYYY-MM-DD` log entry
- **Review card creation** — spawn one `monthly_review_YYYY-MM` child card
- **Step-5 QA invocation** — call DeepSeek Step-5 on every finding before
  any action item is moved from `todo` to `ready`
- **Reference** — read the existing `security-watch` weekly brief at
  `~/.hermes/state/security-watch/briefs/YYYY-Www.md` and link to it from the
  monthly review (no duplication of work the weekly driver already did)

### STOPs (loop must escalate, NEVER auto-act)

- **Money pipelines** — money-pipeline, bakery, pmd-web, squarepayouts
- **Trading bots** — binance-bot, trading-control, csdawg-dashboard
- **Auth systems** — NextAuth, NextAuth URL, OAuth, sessions, JWT secrets,
  any `.env` file or plaintext secret
- **Kernel-doc edits** — SOUL.md, AGENTS.md, ROUTING-RULES, MODELROUTINGWORKFLOW
- **Public-facing port or domain changes** — opening, closing, repointing any
  port, hostname, Tailscale MagicDNS name, Caddy vhost
- **Vendor / API / billing decisions** — paid API keys, new SaaS subscriptions,
  billing changes, vendor lock-in
- **Product-direction decisions** — pricing model, target market, scope pivot
- **Any new cron registration** — including a Security & PM2 monthly cron
  (see S1-P4 deliverable: drafted, not registered)
- **Any action outside `pm2-health-check` or `security-watch` autonomous scope**
  — if a finding requires a fix not already covered by those two skills'
  autonomous scope, STOP and escalate

### Step-5 QA gate (mandatory)

Every cycle must pass Step-5 QA before any action item is taken:

- All findings scored via `risk-taxonomy.md` reference doc in security-watch
- High-confidence findings → `security-incident-audit` skill invoked
- P0s spawn separate fix cards; P0 cards are never auto-closed
- Step-5 verdict JSON written to
  `~/Projects/BossMan/docs/verdicts/step5-verdict-security-pm2-YYYY-MM.json`

---

## Routing Ledger

| Field | Value |
|---|---|
| worktype | audit (monthly) + watch (continuous via security-watch + pm2-health-check) |
| leadmodel | M3 (planning, design, integration, report writing) + DeepSeek (Step-5 QA) |
| costtier | Tier 1 (default); Tier 2 only if Step-5 escalates due to `real_issue + touches_sensitive` |
| qa_required | yes (Step-5 mandatory on every cycle) |
| scope | meta-loop wrapping existing skills; does NOT add new autonomous capabilities |
| carve_outs | all 5 Phase 2 carve-outs apply (infra/port/security/vendor-billing/product-direction) |

---

## The 5-step loop (monthly)

### Step 1 — INTAKE (Day 1, ~5 min, $0.01)

**Inputs:**
- `pm2 list` (current — should match 14 blessed processes)
- `hermes cron list` (current — should match 26 blessed crons)
- `launchctl list | grep -v com.apple` (current — should match 11 blessed LaunchAgents)
- `crontab -l` (current — should match 4 blessed cron entries: 2 health-cron-wrapper + 2 health-check.js)
- `~/.hermes/state/security-watch/snapshots/` (last 30 days)
- `~/.hermes/state/security-watch/briefs/` (last 4 weekly briefs)
- `~/.hermes/knowledge/security-watch/BLESSED-LISTS.md` (baseline)

**Outputs:**
- `~/.hermes/knowledge/SECURITY_LOOP/INTAKE-YYYY-MM-DD.json` with all snapshots
  + a `diff_summary` field showing unknowns/ghosts/drift count
- Kanban comment on Goal card `t_e56d53cd` with intake summary

**STOP:** None (pure read).

---

### Step 2 — DECOMPOSE (Day 1, ~2 min, $0.01)

**Spawn 3 child cards per cycle:**

| Card | Title | Detector | Lead skill |
|---|---|---|---|
| `S1.YYYYMM.A` | PM2 whitelist vs actual | `pm2 list` diff vs BLESSED-LISTS.md | `pm2-health-check` |
| `S1.YYYYMM.B` | Cron/LaunchAgent audit | `hermes cron list` + `launchctl list` diff vs BLESSED-LISTS.md | `pm2-health-check` (PM2 portion) + manual cron check |
| `S1.YYYYMM.C` | Basic security checks (listeners, processes, log/env leaks) | security-watch weekly brief (already produced) + listener port scan | `security-watch` |

**STOP:** None (card creation is mechanical).

---

### Step 3 — EXECUTE (Day 1–3, ~10 min, $0.05)

**Run detectors within autonomous scope:**

| Detector | Command | Result | Action |
|---|---|---|---|
| PM2 unknown | `pm2 list` JSON → diff against baseline | list of unknown process names | spawn fix cards for each unknown |
| Cron ghost | `hermes cron list` → diff against baseline | list of unknown / missing cron IDs | spawn fix cards for ghosts |
| LaunchAgent ghost | `launchctl list` → diff against baseline | list of unknown labels | spawn fix cards for ghosts |
| Listener drift | `lsof -iTCP -sTCP:LISTEN -P -n` → diff against port map in SOUL | list of new listening ports | Step-5 QA on each |
| Log/env leaks | grep for tokens, `sk-`, `BEGIN PRIVATE KEY` in canonical log paths | match count | Step-5 QA on each |
| Weekly brief | read `~/.hermes/state/security-watch/briefs/YYYY-Www.md` | summary | link to monthly report |

**Mechanical cleanup (BLESSED items only):**
- If `pm2 list` shows a process in BLESSED-LISTS.md "Removed" list → `pm2 delete <name>` and log
- If `hermes cron list` shows a cron in BLESSED-LISTS.md "Removed" list → `hermes cron remove <id>` and log
- If `crontab -l` shows a dead cron in BLESSED-LISTS.md "Removed" list → remove line and log

**STOPs during EXECUTE:**
- DO NOT touch any process/cron NOT in BLESSED-LISTS.md "Removed" list — spawn fix card
- DO NOT touch any `.env` file, NextAuth config, OAuth client, JWT secret
- DO NOT touch money-pipeline, binance-bot, trading-control, csdawg-dashboard
- DO NOT register any new crons (S1-P4 deliverable is proposal-only)

---

### Step 4 — REVIEW (Day 4–5, ~15 min, $0.10)

**Synthesize the monthly review:**

`~/.hermes/knowledge/SECURITY_LOOP/SECURITY_PM2_REVIEW_YYYY-MM.md` (≤200 lines) with:

1. **Header** — month, cycle number, Goal card ID
2. **Baseline status** — PM2 (X/14), crons (Y/26), LaunchAgents (Z/11)
3. **Findings** — table: ID, category, severity, status, fix card
4. **P0 carry-forward** — table: ID, from cycle, status, next step
5. **Mechanical cleanups performed** — list with timestamps
6. **Step-5 QA verdict** — PASS/CAVEAT, with DeepSeek summary
7. **Next cycle** — first day, expected P0s

**PHASEREPORT entry** (one line at top of `~/Projects/BossMan/PHASEREPORT.md`):
```
## YYYY-MM-DD — Security & PM2 Watch Cycle N: <PASS|CAVEAT> — <one-sentence summary>
```

**STOPs during REVIEW:**
- DO NOT commit to the GitHub mirror without Step-5 PASS
- DO NOT close any P0 fix card (those are operator decisions)
- DO NOT add new autonomous scope without kanban approval

---

### Step 5 — DONE (Day 5–7, ~5 min, $0.02)

**Close cycle:**

- Mark all `S1.YYYYMM.A/B/C` cards complete
- Update Goal card `t_e56d53cd` with `## YYYY-MM-DD` log entry
- Confirm Step-5 verdict JSON exists
- Confirm PHASEREPORT entry written
- Confirm mirror md5 match (canon → GitHub for SECURITY_LOOP/ files)
- Spawn next cycle's children (Day 25 of month, for Day 1 of next month)

**STOPs during DONE:**
- DO NOT mark the long-lived Goal card `t_e56d53cd` as done (it stays in `ready` for next cycle)
- DO NOT skip Step-5 PASS — without it, cycle is NOT done

---

## Cadence

| Field | Value |
|---|---|
| Frequency | Monthly (1st of month, 23:00 PT — see S1-P4 cron proposal) |
| Duration | 5–7 days from intake to close |
| Default delivery | local (silent) |
| Telegram ping | P0 only (with `real_issue + touches_sensitive` gates from security-watch) |
| Cost per cycle | ~$0.20 (Tier 1) / ~$0.50 (Tier 2 if Step-5 escalates) |

---

## Success criteria (target)

1. **No unknown PM2 processes** — 0 unknowns vs 14 blessed
2. **No ghost crons or LaunchAgents** — 0 ghosts vs 26 + 11 blessed
3. **No unreviewed security P0s at month end** — 0 unreviewed
4. **100% Routing Ledger + Step-5 compliance** — every incident + major fix
5. **Drift detected within 24h** — synthetic drift test passes 100%

---

## Scope & STOPs alignment (Permanent — 2026-06-23)

The autonomous scope and STOPs above are derived from and aligned with the
existing Scope & STOPs blocks in the 4 primary skills the S1 loop consumes.
See the dedicated alignment matrix at
`~/.hermes/knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md` for:

- **Autonomous scope:** 14/14 capabilities are allowed by at least one primary
  skill. No conflicts.
- **STOPs:** 15/15 STOPs are hard stops in at least one primary skill. No
  conflicts.
- **Routing Ledger:** S1 is a strict subset of the union of the 4 primary
  skills' Routing Ledgers.
- **Step-5 QA rules:** All 4 skills use the same Step-5 verdict shape + JSON
  path convention. S1 follows the same pattern.
- **Where S1 differs (intentionally):** cadence (monthly vs 5min/daily/weekly),
  repair scope (BLESSED items only), report artifact (`SECURITY_PM2_REVIEW_*
  .md`).
- **Conflict resolution:** more conservative STOP wins; S1 spec amended to
  match (not the other way around); operator approval required.

---

## References

- **Alignment matrix:** `~/.hermes/knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md`
- **Pattern source:** `~/.hermes/skills/goal-loop/SKILL.md`
- **Pattern precedent:** `~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md` (Phase 3)
- **Watched services:**
  - Skill: `~/.hermes/skills/security-watch/SKILL.md` (Phase 3+4, 2 active crons)
  - Skill: `~/.hermes/skills/pm2-health-check/SKILL.md` (Phase 2)
  - Skill: `~/.hermes/skills/incident-response/SKILL.md`
- **Baseline:** `~/.hermes/knowledge/security-watch/BLESSED-LISTS.md`
- **State:** `~/.hermes/state/security-watch/{snapshots,logs,briefs,incidents}/`
- **Active crons (blessed, do NOT re-register):**
  - `security-watch-daily` (133f6f655d59, `17 3 * * *`, local)
  - `security-watch-weekly` (1b1e3e82a86a, `42 18 * * 0`, local)
  - `PM2 Health Monitor` (every 5 min, local)
- **Governance:**
  - `~/.hermes/knowledge/ROUTING-LEDGER.md` (v3)
  - `~/Projects/BossMan/PHASEREPORT.md` (canonical phase log)
- **Phase S1 parent:** kanban `t_21f1db14`
- **Phase S1 children:** P1 done, P2 (this spec), P3 (alignment), P4 (cron proposal), P5 (wire + commit)

---

## Pitfalls (Permanent — 2026-06-23)

1. **Do not duplicate security-watch** — the daily/weekly drivers are already
   running. The S1 loop CONSUMES their output; it does not re-detect.
2. **Do not register the S1 monthly cron without operator approval** — the
   proposal is at S1-P4; crontab and hermes cron list both verified empty
   for `security-pm2-monthly` as of 2026-06-23.
3. **Do not soften STOPs** — security-watch hard rule #2 is
   "alert EXCEPTION-ONLY"; do not weaken.
4. **Do not auto-remediate** — security-watch hard rule #5 is
   "no auto-remediation without operator approval".
5. **Do not skip Step-5** — without Step-5 PASS, the cycle is not DONE.
6. **Do not mark the long-lived Goal card as done** — it stays in `ready`
   forever, awaiting the next cycle's children.
7. **Do not write to kernel-doc** — SOUL/AGENTS/ROUTING-RULES edits require
   explicit operator pre-approval (S1-P5 has the wiring for SOUL/AGENTS
   references, but S1-P5 itself requires operator approval per Phase 2 rule).

---

## Provenance

- **Drafted:** 2026-06-23 (Phase S1, S1-P2)
- **Author:** BossMan (autonomous, M3 lead)
- **Reviewer:** DeepSeek (Step-5 QA, in S1-P5)
- **Approver:** Marcelo (operator, pending for SOUL/AGENTS edits in S1-P5)
- **Next review:** 2026-07-23 (first monthly cycle)
