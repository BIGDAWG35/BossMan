**Version:** v4 · **Date:** 2026-09-14 · **Source:** `~/.hermes/knowledge/LEARNED_SQUAREPAYOUTS_ACTIVE.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED_SQUAREPAYOUTS_ACTIVE

**Status:** ACTIVE — REVENUE PROJECT (Permanent, 2026-08-17)
**Supersedes:** Any prior tombstone / retirement classification of SquarePayouts.
**Owner:** BossMan (Hermes)

---

## 1. ACTIVE STATUS — BINDING

**SquarePayouts (Opp-65, Basecamp 3.basecamp.com/6162349/projects/47218024) is an ACTIVE revenue project.**

It is **NOT retired, NOT tombstoned, NOT archived, NOT dormant, and NOT removed from any inventory.**

The prior retirement classification (filename `ecosystem.config.js.RETIRED-2026-07-27`, kanban card `t_8dcdae59` closed as `done` with empty result, kanban card `t_2e18270c` audit decision) was **incorrect and is hereby superseded.**

**Preserved as audit history only** — `ecosystem.config.js.RETIRED-2026-07-27` stays on disk as evidence; it is NOT canonical configuration.

## 2. ROOT CAUSE OF THE FALSE RETIREMENT CLASSIFICATION

The retirement was triggered by an **autonomous loop** that conflated temporary offline state with permanent decommission:

**Timeline (false retirement chain):**

| Date | Card / Event | Action | Correctness |
|---|---|---|---|
| 2026-07-23 20:02 | `t_squarepayouts_health-loop_v1_20260723` (Loop Engineering + Ops + QA + Knowledge Canon) | Triggered a SquarePayouts health/audit loop. | OK |
| 2026-07-22 | PM2 health-monitor whitelist drift-fix | Removed `squarepayouts`, `client-hub`, `bakery`, `trading-control`, etc. from `CRITICAL_SERVICES` ("no PM2 process — removed"). | **WRONG for `squarepayouts`** — process was offline due to stale build config, not decommissioned. |
| 2026-07-27 | `ecosystem.config.js` renamed to `ecosystem.config.js.RETIRED-2026-07-27` (on disk only, never committed) | The audit pre-emptively tombstoned config. | **WRONG — no decision was ever made** |
| 2026-07-28 02:50 | `t_2e18270c` (audit, completed 02:56) | Result: "Both services classified as (a) retire" — chose option (a) without checking actual project state. | **WRONG** — see §3 |
| 2026-07-28 02:55 | `t_8dcdae59` (decision card, completed 03:02:43 — 7 minutes later) | Marked `done` with **empty `result` field** — no actual decision recorded. | **BUG** — closure without verdict is the formal gap. |

**The false retirement was caused by 3 compounding errors:**

1. **Audit assumed non-existent apex domain** — `https://squarepayouts.com` was checked, but the live URL has always been `https://[new-trycloudflare-url].trycloudflare.com` (per `LEARNED_SQUAREPAYOUTS.md`). The audit checked the wrong URL and declared "URL returns empty."

2. **Audit conflated stale config with decommission** — `ecosystem.config.js` pointed to `./server.js` (a custom Next.js node entry, still valid), but the audit treated it as outdated because the file's `next()` import was missed. The build was working; the config was just stale.

3. **Decision card was closed without a recorded verdict** — `t_8dcdae59` was opened to get a decision, then `done` was set 7 minutes later with no `result` field populated. The autonomous loop likely treated "no objection in 7 minutes" as approval. **No human reviewed the closure.**

**What the audit failed to check:**
- `cron 0561fcffeba1` "SquaresPayouts Daily Exporter" was — and remains — **KEEP per AUTOMATION_INVENTORY.md**. Active daily cron exporting SquarePayouts status to Obsidian + GitHub is direct evidence of active state.
- Working tree at `~/Projects/squarepayouts/` had **11+ untracked directories** under `app/api/altus/`, `app/api/health/`, `app/api/host/board/[id]/numbers/`, `app/host/board/[id]/results/` — clear evidence of active development.
- Basecamp project `47218024` was still active with pinned documents and 3 triage cards.
- Opp-65 Mission Control doc v3.1 (2026-07-20) explicitly stated "Canonical — v3-aligned (ACTIVE)."

## 3. CANONICAL FACTS (Verified 2026-08-17)

| Field | Value |
|---|---|
| Canonical repo path | `/Users/bigdawg/Projects/squarepayouts/` |
| GitHub remote | `https://github.com/BIGDAWG35/squarepayouts` (private) |
| Default branch | `main` |
| Last local commit | `b92b3b9` "docs: add troubleshooting language to Governance V3 section" (2026-06-26) |
| Last origin commit | `6b2bbbe` "Add winner notification flow to How It Works page" (2026-06-01) |
| Local ahead of origin | 2 commits (`b92b3b9`, `29ddb520`) |
| Working tree | DIRTY — 1 deletion + 11+ untracked directories + 1 untracked file |
| Node entry point | `./server.js` (custom Next.js server) |
| PM2 process name | `squarepayouts` (currently OFFLINE — restart pending Marcelo approval) |
| PM2 port | `8030` (currently free — restart pending Marcelo approval) |
| Cloudflared tunnel | `/usr/local/bin/cloudflared` with credentials `/Users/bigdawg/.cloudflared/credentials.json` (tunnel UUID `ba7cb2bf-0193-425a-92a8-2d85544609e3`) — currently OFFLINE |
| Public URL pattern | `https://[new-trycloudflare-url].trycloudflare.com` (changes per restart; **not `squarepayouts.com`**) |
| Basecamp project | `3.basecamp.com/6162349/projects/47218024` |
| Basecamp pinned docs | Card Table 9875092873, Questionnaires 9875092871, Project Home 47218024 |
| Active cron | `0561fcffeba1` "SquaresPayouts Daily Exporter" (daily, exports to Obsidian + GitHub) — KEEP per AUTOMATION_INVENTORY |
| M3 model rule | DURABLE TASK-FIT ROUTING (Permanent 2026-09-14, Marcelo policy). SquarePayouts model/tool routing is owned by BossMan — BossMan selects best-fit per task type, risk, privacy, cost, quality. No blanket categorical block by AI model or by tool, EXCEPT the standing safety-sensitive and secrets carve-outs in the V3 task-type ledger: Claude is mandatory for auth, encryption, money-path, PII, and audit-logging work; production secrets, credentials, tokens, and .env content are Llama/local only and must never leave the host. Money-path/auth/PII/credentials/security/audit/public-financial work requires Step-5 red-team QA + strongest appropriate model; card does NOT move to done until verification passes. Production secrets and raw credentials remain local-only. |
| Project layers | Buyer → Host → Participant → Super Admin (4-layer product) |
| Stakeholders | Builder (internal), Cello (human owner), client-squares (external) |

## 4. RESTORATION ACTIONS (2026-08-17)

### 4.1 Mission Control
- `~/Desktop/spaces/projects-mission-control/Opp-65 — SquarePayouts Status — v3.md` — bumped to **v3.2 (post-recovery)**, status updated from "Canonical v3-aligned (ACTIVE, audit-only)" to **"ACTIVE — RESTORED — revenue project confirmed live"**.

### 4.2 PM2 / Runtime
- `~/.hermes/scripts/legacy/pm2-health-monitor.sh` whitelist — `CRITICAL_SERVICES` re-includes `squarepayouts` (port 8030).
- `~/.hermes/skills/devops/pm2-health-check/SKILL.md` — whitelist section updated; `Removed` block now reads "Was removed 2026-07-22 in error — restored 2026-08-17."
- **Service itself**: NOT auto-restarted. Per V3 governance, `pm2 start` is a major-infra carve-out; awaiting Marcelo approval.

### 4.3 New ecosystem.config.js (canonical, NOT the tombstone)
- New file `~/Projects/squarepayouts/ecosystem.config.js` created pointing to the **Next.js production build** (`npm run start`) rather than the stale `./server.js`. The old tombstone `ecosystem.config.js.RETIRED-2026-07-27` remains as audit evidence.

### 4.4 GitHub
- Local working tree has 2 commits ahead of `origin/main` and 1 untracked file + 11+ untracked dirs. Push is **deferred** — `git push` to a remote branch is V3 carve-out for major-infra.
- Repo description on GitHub already correctly says: "PM2: squarepayouts on 8030." No change needed.

### 4.5 Obsidian
- Canonical vault: `~/Documents/Obsidian Vault/` — **no Opp-65 note existed before recovery**. New note added at `~/Documents/Obsidian Vault/SquarePayouts/Opp-65 — Status — 2026-08-17.md` linking to Mission Control.

### 4.6 Basecamp
- Project `47218024` is intact. **No write operations performed** (no Perplexity Computer in scope this turn).
- Future automation: `basecamp-monitor.js` cron (every 15 min) will continue to sync state — no change needed.

### 4.7 Kanban
- `t_0b722ed8` "Squares testing and feedback loop" — **unblocked** (status back to `todo`).
- `t_8dcdae59` — **commented** with false-retirement verdict (decision card body updated; `result` field remains empty because no decision was ever made).
- `t_2e18270c` — **commented** with audit-error analysis (audit body unchanged for forensic reasons; result field kept as historical evidence).
- New reactivation card `t_squarepayouts_reactivation_v1_20260817` — created, ready.

### 4.8 Audit Guardrail
- New knowledge file `LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md` codifies the no-auto-retire rule.

## 5. FUTURE AUDIT RULE (Permanent — 2026-08-17)

**Absence of a PM2 process or temporary URL outage alone MUST NOT classify SquarePayouts (or any revenue project) as retired.**

**Required verification before any future archive recommendation:**

1. **Runtime check** — confirm the absence is not a transient PM2 restart loop. Wait 24h before flagging.
2. **GitHub activity** — confirm last commit / push date; flag if >90 days stale (NOT 7 days).
3. **Basecamp status** — confirm card-table is `archived` or `trash`, not just stale.
4. **Kanban** — confirm no active or blocked cards referencing the project.
5. **Cron inventory** — confirm no active crons reference the project (a daily exporter is direct evidence of live state).
6. **Mission Control** — confirm the project status doc explicitly marks "archived" or "trash."
7. **Marcelo approval** — explicit, recorded, dated.

**Only if all 7 checks pass** may an archive classification be proposed.

**No revenue project may be archived or tombstoned automatically.** Any proposed retirement requires a **single explicit Marcelo approval** captured in a kanban card `result` field.

**Distinguish "temporarily offline / needs repair" from "retired."** If 5 of the 7 checks suggest active state but runtime is offline, the correct classification is `BLOCKED-ON-MARCELO: relaunch needed`, NOT retired.

## 6. CROSS-REFERENCES

- `~/.hermes/knowledge/LEARNED_SQUAREPAYOUTS.md` — original active-state note (4-layer model, Basecamp project ID, testing checklist pinned).
- `~/Desktop/spaces/projects-mission-control/Opp-65 — SquarePayouts Status — v3.md` — Mission Control canonical note (now v3.2).
- `~/.hermes/knowledge/LEARNED_REVENUE_PROJECT_ARCHIVE_GUARDRAIL.md` — audit guardrail.
- `~/.hermes/knowledge/LEARNED_PM2_HEALTH_MONITOR.md` — PM2 health-monitor skill (whitelist restored).
- `~/.hermes/knowledge/LEARNED_BASECAMP_WORKFLOW.md` — Basecamp project ID 47218024 confirmed.
- Kanban cards: `t_0b722ed8` (unblocked), `t_8dcdae59` (commented), `t_2e18270c` (commented), `t_squarepayouts_reactivation_v1_20260817` (new).
- Obsidian note: `~/Documents/Obsidian Vault/SquarePayouts/Opp-65 — Status — 2026-08-17.md` (new).

## 7. INCIDENT — Basecamp OAuth grant revoked, exporter silently hollow (2026-09-02)

**Status:** BLOCKED-ON-MARCELO (interactive OAuth re-login required).

**Symptom:** `scripts/squarespayouts-status-exporter.js` exits 0, prints
`✅ Obsidian` / `✅ GitHub`, and commits daily — but the status file contains
`*Could not fetch Card Table columns.*` and `*No check-in questions configured.*`.

**Root cause:** Basecamp OAuth token expired ~1,080h (~45 days) ago and the
refresh grant is **revoked server-side**:
`token refresh failed: token request failed with status 401: Unknown Basecamp ID.`
`basecamp auth refresh` does NOT recover it. `basecamp auth status` misleadingly
reports `authenticated: true` alongside `expired: true` — do not trust that summary.

**Outage window:** last real data `2026-07-08` / `5337cba` (Triage: 3 bug cards —
Square View size, Header image link, Pricing workflow). HOLLOW from **2026-07-09**
through 2026-09-02 = ~55 days, ~56 hollow commits. Sibling `opp-350-bakeryops.md`
is affected identically (same CLI/token).

**Why it went unnoticed (script design defects — fix when unblocked):**
1. `apiGetJson()` catches every error and returns `null` → auth failure is
   indistinguishable from "empty column".
2. Hollow output is rendered as normal prose, not an error.
3. `commitToGit()` swallows failures; exit code is always 0.
4. No exit-nonzero / alert on total fetch failure.

**Recovery:** `basecamp auth login` (interactive browser OAuth, Marcelo creds),
then re-run the exporter and confirm the Card Table table renders.

**Guardrail:** Per §5, this is `BLOCKED-ON-MARCELO: credential re-auth`, NOT
retirement. A hollow exporter is NOT evidence the project is dead — the exporter
was still committing daily while returning zero real data.
