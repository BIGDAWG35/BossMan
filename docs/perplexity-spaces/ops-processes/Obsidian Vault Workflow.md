**Version:** v4 · **Date:** 2026-10-01 · **Source:** `~/Desktop/spaces (2026-09-30 copy)/agent-os/Obsidian Vault Workflow — v3.md` · **Status:** Current — space-only doc: this copy is the canon (edit here)

> Note (2026-10-01): any LBC35/OpenClaw mention in this file is historical. LBC35/OpenClaw was retired and removed 2026-09-30; BossMan does all delegation via kanban + route-card.sh. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins. Health OS (V3/V4) was deleted 2026-09-30, so any Health OS row is history.

# Obsidian Vault Workflow — v3

> **2026-10-02 correction:** Spaces step is now: canon `~/.hermes/knowledge/` → `~/Desktop/spaces/<folder>/` (rebuilt by `~/.hermes/scripts/build_spaces_v4.py`) → read-only mirrors `~/.hermes/spaces/`, `~/Obsidian/Hermes/Perplexity Spaces/`, `~/Repos/BossMan/docs/perplexity-spaces/`; `sync_perplexity_spaces.sh` and `~/Desktop/V3/` are retired. `~/Obsidian/Hermes/V3-Canon/` and repo `docs/hermes-canon/` are md5-checked mirrors (`hermes-canon-drift-check.sh`) — agents keep them in sync; no manual Obsidian homework for Marcelo. Byte-identical copies of this file live in Shared, Ops Processes and Toolchain & Dev; the canonical `OBSIDIAN_VAULT_WORKFLOW.md` is not present in `~/.hermes/knowledge/` (2026-10-02 canon copy).
**Version:** v3.1 (refined 2026-07-20 to add V3-Canon mirror folder + V3 audit workflow)
**Date:** 2026-07-20
**Owner:** BossMan Hermes
**Status:** Canonical — v3-aligned
## Original title

_Obsidian Vault Workflow — Permanent Operating Standard_

**Version:** 1.0
**Date:** 2026-06-12
**Owner:** BossMan Hermes (Marcelo's orchestrator)
**Status:** Canonical — governs the Hermes Obsidian vault at `~/Obsidian/Hermes/`

---

## 0. Scope clarification (added 2026-06-13)

**This document is canonical for the `~/Obsidian/Hermes/` vault** — the Hermes project vault used by BossMan as a long-term human archive of Hermes knowledge.

- The other vault, `~/Desktop/CLAW-Backup/`, is Marcelo's personal Obsidian vault with its own workflow doc (sentence restored 2026-10-02; the bulk LBC35 cleanup had overwritten the original line).

**The two vaults are NOT the same.** Future BossMan sessions that confuse them should re-read this section.

---

## 1. Purpose

Define the **permanent layout, save order, and audit cadence** for the Hermes Obsidian vault at `~/Obsidian/Hermes/`. The vault is a long-term human-friendly archive of Hermes knowledge, not a runtime source of truth.

## 2. Source of truth — priority order

When Obsidian and Hermes knowledge conflict, **Hermes knowledge wins**. The canonical chain is:

1. **`~/.hermes/knowledge/`** — primary. All operational changes and system knowledge are written or updated here FIRST.
2. **`~/Obsidian/Hermes/`** — long-term human archive. Read-only mirror with curated views.
3. **`~/Repos/BossMan/docs/`** — GitHub backup stream. Mirrored from `~/.hermes/knowledge/`.

Obsidian is **never** authoritative. If the two diverge, the Hermes knowledge file is the right one and Obsidian gets corrected to match.

## 3. Save order (mandatory)

> **Canonical save order (4-step chain):**
> 1. **Local** (`~/.hermes/knowledge/` + `~/.hermes/SOUL.md`) — source of truth
> 2. **Obsidian** (`~/Obsidian/Hermes/`) — long-term human archive
> 3. **GitHub** (`~/Repos/BossMan/docs/` via `git push`) — version control + backup
> 4. **Perplexity Spaces** (`~/Library/.../Perplexity Spaces`) — live AI working layer (history — superseded 2026-10-02: now Perplexity Projects; upload folder ~/Desktop/spaces/<folder>/ rebuilt by build_spaces_v4.py)

For any operational change:

```
STEP 1 → Write or update ~/.hermes/knowledge/<doc>.md     (primary, source of truth)
STEP 2 → Periodically mirror to ~/Obsidian/Hermes/         (human-friendly views)
STEP 3 → Sync ~/.hermes/knowledge/ → ~/Repos/BossMan/docs/ (GitHub backup, commit)
STEP 4 → If Spaces content is involved, run the existing
         Perplexity Spaces sync workflow (~/.hermes/scripts/sync_perplexity_spaces.sh)
         [history — superseded 2026-10-02: run ~/.hermes/scripts/build_spaces_v4.py]
```

BossMan follows this order on every knowledge change. Skipping Step 1 and writing straight to Obsidian is a policy violation; the kanban card for that change gets a comment flagging it.

## 4. Vault layout (permanent, 11 folders + 1 Templates dir)

The Obsidian vault at `~/Obsidian/Hermes/` is laid out as follows. **All folder names are fixed** — additions go inside, not as new top-level dirs.

| Folder | Purpose | Notes |
|---|---|---|
| `00_INBOX/` | Short-lived drop zone | Anything here >14 days old is flagged by the monthly audit and either moved or deleted. |
| `01_Dashboard/` | `Dashboard.md` — single landing page | Links to active projects, latest phase report, operating blueprint, services map, and main workflows. |
| `10_Operating-Blueprint/` | Mirror of `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` + related canon | Updated only when Hermes knowledge changes. |
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
| `30_Services-Maps/` | Service inventory + port maps + PM2 + registry mirrors | Mirrors of `SERVICES_MAP.md` and `services-registry.yaml` from Boss Hub. |
| `40_Projects/Active/` | Currently-running projects | `PROJ-YYYY-MM_Project-Name/` per project (see §6). |
| `40_Projects/On-Hold/` | Paused but not abandoned | Same structure as Active. |
| `40_Projects/Archive/` | Completed or killed | Same structure. Kept for at least 12 months. |
| `50_Phase-Reports/` | Mirrors of `PHASE*.md` and `PHASEREPORT.md` from Hermes knowledge | Updated after every phase close. |
| `60_Knowledge-Topics/` | Cross-cutting knowledge topics (not project-specific) | One folder per topic. Perplexity Spaces content lives at `60_Knowledge-Topics/perplexity-spaces/`. |
| `70_Workflows/` | Process documents (the Obsidian Vault Workflow doc lives here) | New workflows get a file here and a link from `01_Dashboard/Dashboard.md`. |
| `80_Logs/` | Read-only logs (cron output, audit results) | Subdir per source. |
| `90_Archive/` | Long-term cold storage | Anything older than 2 years or killed; rarely touched. |
| `_Templates/` | Note templates (`Project Template.md`, `Workflow Template.md`, etc.) | Edit templates here, never inline. |

## 5. Project structure (under `40_Projects/`)

Every project gets a folder under Active / On-Hold / Archive, named `PROJ-YYYY-MM_Project-Name/`. The folder always contains:

| File | Required? | Purpose |
|---|---|---|
| `PROJ-Overview.md` | **Required** | Top-level project summary with frontmatter. |
| `PROJ-Timeline.md` | Recommended | Chronological log of events, decisions, milestones. |
| `PROJ-Decisions.md` | Recommended | Architectural and product decisions with rationale. |
| `PROJ-Notes.md` | Optional | Free-form notes, links, references. |
| `PROJ-Screenshots/` | Optional | Images, diagrams. |
| Subfolders | Optional | Component notes, sub-projects. |

### `PROJ-Overview.md` frontmatter (required fields)

```yaml
---
id: PROJ-2026-06_property-management-dashboard
name: Property Management Dashboard
status: active | on-hold | archived
owner: bossman | builder | ops | trading | content
created: 2026-06-12
tags: [pmd, real-estate, finance]
---
```

**Field rules:**
- `id` is stable and unique. Format: `PROJ-YYYY-MM_<slug>`.
- `status` is one of `active | on-hold | archived`. Determines which subfolder of `40_Projects/` the project lives in.
- `owner` is the routed assignee from the Kanban rule.
- `created` is the project kickoff date.
- `tags` is a YAML list of lowercase keywords.

## 6. Project lifecycle

| State | Where it lives | How to move |
|---|---|---|
| Active | `40_Projects/Active/` | Default. |
| Paused | `40_Projects/On-Hold/` | BossMan moves on kanban-card approval or 60+ days of no activity. |
| Completed or killed | `40_Projects/Archive/` | BossMan moves on completion or kill. |
| > 2 years in Archive | `90_Archive/` | BossMan moves during bi-monthly review. |

**No project notes live loose.** Every project-specific file is inside its `PROJ-…/` folder. Anything in the vault root is a policy violation (caught by the monthly audit).

## 7. Save order detail (operational)

### 7.1 When you change Hermes knowledge

```
cd ~/Repos/BossMan
cp ~/.hermes/knowledge/<doc>.md docs/
git add docs/<doc>.md
git commit -m "sync(knowledge): <doc> — <short description>"
git push
# bash ~/.hermes/scripts/sync_perplexity_spaces.sh   # retired 2026-10-02 — use ~/.hermes/scripts/build_spaces_v4.py
```

### 7.2 When you create a new project in Hermes

1. Create the kanban epic (BossMan) — captures the work itself.
2. Write `PROJ-Overview.md` in Obsidian (under `40_Projects/Active/PROJ-YYYY-MM_<slug>/`).
3. Add a line to `01_Dashboard/Dashboard.md` linking the project.
4. Add the project to the cross-cutting `ROUTING-RULES.md` (if it's a new routing category).

### 7.3 When a project moves state

1. Move the folder (`mv` or `git mv` if in a tracked vault) from `Active/` → `On-Hold/` or `Archive/`.
2. Update `PROJ-Overview.md` frontmatter `status:` field.
3. Update the link in `01_Dashboard/Dashboard.md`.
4. Log the move in `50_Phase-Reports/PHASEREPORT.md`.

## 8. Monthly audit (script: `~/.hermes/scripts/obsidian-vault-audit.sh`)

Runs on the **1st of every month at 09:00 AM PT** (cron job, silent when healthy). Checks:

| # | Check | Severity | Action on failure |
|---|---|---|---|
| 1 | Files in `00_INBOX/` older than 14 days | Warning | List files in Telegram ping with move/delete suggestion. |
| 2 | `PROJ-Overview.md` files missing `id`, `status`, or `created` | Error | List project paths; report to Telegram. |
| 3 | Markdown files in vault root (not inside a folder) | Error | List files; report to Telegram. |
| 4 | Duplicate filenames in different folders | Warning (informational) | List duplicate paths. Bi-monthly review decides if drift or expected. |
| 5 | Active projects with stale `PROJ-Timeline.md` (no entry in >30 days) | Warning | List project paths. |
| 6 | BossMan repo: `git status` dirty OR last commit for `docs/` > 30 days | Warning | List modified files; recommend commit. |
| 7 | Obsidian files newer than their Hermes-knowledge mirror (drift) | Warning | List file pairs; trigger a re-mirror. |
| 8 | `01_Dashboard/Dashboard.md` exists and has at least 3 active project links | Warning | List missing links. |

**Silent when healthy** (no findings → no Telegram ping). Findings get one consolidated Telegram ping with a "fix me" kanban card auto-created.

## 9. Bi-monthly review (script: `~/.hermes/scripts/obsidian-vault-review.sh`)

Runs on the **1st of every other month at 10:00 AM PT** (cron, surfaces to Telegram — this is a deliberate signal, not silent). Tasks:

1. **Archive stale projects** — anything in `On-Hold/` for > 90 days moves to `Archive/`.
2. **Refine templates** — review `_Templates/Project Template.md` and `_Templates/Workflow Template.md`; if any field has been consistently wrong, fix the template.
3. **Review folder taxonomy** — only adjust the 11-folder layout if a real, recurring need shows up. Justification required in the bi-monthly report.
4. **Confirm Obsidian mirrors still reflect Hermes priorities** — diff `10_Operating-Blueprint/Operating-Blueprint.md` against `~/.hermes/knowledge/OPERATING_BLUEPRINT.md`. If drift > 30 days, ping Marcelo.
5. **Inventory the `_Templates/` folder** — flag any templates not used in > 6 months.

## 10. Conflict resolution

| Conflict | Resolution |
|---|---|
| Obsidian says X, Hermes knowledge says Y | **Hermes knowledge wins.** BossMan updates Obsidian. |
| Hermes knowledge says X, BossMan repo says Y | **Hermes knowledge wins.** BossMan re-syncs the repo. |
| BossMan repo says X, Obsidian says Y | **BossMan repo wins** (it's the GitHub backup). BossMan re-mirrors Obsidian. |
| Spaces content says X, Hermes knowledge says Y | **Hermes knowledge wins.** BossMan re-syncs Spaces. |
| Two kanban cards disagree on project state | **Kanban card wins** (the most recent decision). BossMan updates the doc. |
| Two BossMan sessions write to the same Hermes knowledge file | **Last writer wins, but both sessions log the conflict on the kanban card** and the next audit reconciles. (See PHASEREPORT entry 2026-06-13.) |

## 11. Change management

| Action | Approval required? |
|---|---|
| Edit a file in `~/.hermes/knowledge/` | No (it's the source of truth). |
| Edit a file in `~/Obsidian/Hermes/` | No, but log the change in a kanban card comment. |
| Add a new folder under `~/Obsidian/Hermes/` | **Yes** — BossMan kanban card with Marcelo's explicit approval. Justify why 11 fixed folders are insufficient. |
| Rename a top-level folder | **Yes** — 3-bucket rule (this is an architecture change). |
| Change the save order | **Yes** — 3-bucket rule. |
| Add a new audit check to the monthly script | No, but document in §8. |
| Change the monthly audit cadence | **Yes** — kanban card with Marcelo approval. |
| Edit `_Templates/Project Template.md` | No, but propagate to existing projects only if a clear need arises (bi-monthly review). |

## 12. What this document is NOT

- ❌ Not a runtime reference. BossMan doesn't read Obsidian at runtime.
- ❌ Not a process document for the CLAW-Backup vault. That's the other canonical doc.
- ❌ Not a process document for Spaces. The Spaces sync has its own workflow.
- ❌ Not a replacement for `SOUL.md` or `OPERATINGBLUEPRINT.md`. It's a **leaf** of the canon, not a root.
- ❌ Not a place for personal notes unrelated to Hermes. Personal stuff stays in `~/Desktop/CLAW-Backup/` or another workspace.

## 13. Version history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-06-12 | Initial formalization. 11-folder layout, project structure, save order, monthly audit, bi-monthly review. |
| 1.0 + §0 | 2026-06-13 | Added "Scope clarification" §0 + §10 conflict-resolution row after a concurrent-edit incident with another BossMan session (PHASEREPORT entry 2026-06-13). |

---

## 14. V3-Canon mirror folder (added 2026-07-20)

As of the 2026-07-20 V3 audit, a new top-level mirror folder lives at:

```
~/Obsidian/Hermes/V3-Canon/
```

It contains today's **4 V3 canon docs**, mirrored read-only from `~/.hermes/knowledge/`:

| Obsidian mirror (in `~/Obsidian/Hermes/V3-Canon/`) | Canonical source (in `~/.hermes/knowledge/`) | Purpose |
|---|---|---|
- LBC35/OpenClaw (RETIRED 2026-09-30) — was delegator/router; delegation now done by BossMan via kanban + route-card.sh.
| `V3 – 7-Rule Contract.md` | `LEARNED_7_RULE_CONTRACT.md` | BossMan + sub-agents operating rules (7 numbered rules) |
| `V3 – Model Stack and Routing.md` | `LEARNED_V3_MODEL_STACK.md` | Which model for which task + troubleshooting tier policy |
| `V3 – Token Economics.md` | `LEARNED_V3_TOKEN_ECONOMICS.md` | Reuse, don't re-pay (token spend policy) |

A `README.md` in that folder sets the convention:

> 🔁 **MIRROR — DO NOT EDIT.** This is a read-only mirror folder. Hermes (`~/.hermes/knowledge/` + `~/.hermes/SOUL.md`) is the source of truth.

**Convention (blockquote format):** every mirrored file in `~/Obsidian/Hermes/V3-Canon/` opens with a `> **CANONICAL SOURCE OF TRUTH** ... All mirrors ... are read-only views of this content.` blockquote pointing to its canonical source path under `~/.hermes/knowledge/`. This is how the human (and any sub-agent reading the Obsidian vault) can tell at a glance that the file is a view, not an editable source.

**Sync mechanism:** the doc-hygiene goal loop (`~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md`) periodically md5-checks canon vs. mirror. If drift is detected, the loop creates a `t_drift_fix_v3_canon` kanban card and surfaces drift to Marcelo. The loop never silently rewrites a mirror — the mirrors are one-way from Hermes → Obsidian.

**Edit policy:** edit canon under `~/.hermes/knowledge/` only. Do NOT edit the mirror to "match" expectations; if drift is reported, fix the canon.

---

## 15. V3 audit workflow (added 2026-07-20)

The V3 audit is the periodic process that keeps `~/Obsidian/Hermes/V3-Canon/` honest, keeps the 4 V3 canon docs aligned with their canonical sources under `~/.hermes/knowledge/`, and keeps the operator-facing Obsidian view readable.

**5-step audit workflow:**

1. **Read V3 folder as source-of-truth.** Open `/Users/bigdawg/Desktop/V3/` (this `agent-os/` V3 mirror folder). (history — superseded 2026-10-02: ~/Desktop/V3 no longer exists; read ~/.hermes/knowledge/ and compare against ~/Desktop/spaces/) Treat every `.md` in there as the operator-facing view of V3. Note version dates, claimed conventions, and any references to the Obsidian vault, the canon files, or the audit workflow itself.
2. **Inventory Perplexity Spaces.** List all Perplexity Spaces that touch V3 canon topics (Roles, 7-Rule, Model Stack, Token Economics, etc.). For each Space, capture: title, last-updated date, and whether its content still matches the current canon.
3. **Diff.** Compare each V3 mirror file against its canonical source (md5 + a content-level diff for anything that drifted). Also diff each V3 mirror against any operator-facing Perplexity Space that covers the same ground. Capture drift as: file path, drift type (content / structural / missing / renamed), and severity.
4. **Write audit md.** Produce a single audit document (today: the V3 audit md at `~/Desktop/V3/`) that consolidates findings: what's in sync, what's drifted, what's missing, what needs to be created (e.g., new `V3-Canon/` mirror folder, new mirror README, new section in this workflow doc).
5. **Operator manual UI edits.** The agent stack does NOT silently edit Obsidian. The audit md lists exactly which edits need to happen in the Obsidian UI (which folders to create, which blockquote headers to add, which mirror notes to populate). Marcelo (the operator) executes those edits in Obsidian, then the next audit cycle verifies the mirror is in sync. (superseded 2026-10-02: agents execute autonomously; V3-Canon/ is an md5-checked mirror maintained by script — no manual homework for Marcelo)

**Why operator UI edits instead of agent-driven file writes?** Obsidian's metadata (graph view, backlinks, tags, internal-link resolution) is most reliable when files are touched through the Obsidian UI or through a controlled write path the operator has reviewed. The audit workflow respects that boundary: the agent diagnoses and prescribes; the operator applies.

**Cadence:** the V3 audit runs on the same schedule as the doc-hygiene goal loop (see `~/.hermes/knowledge/GOAL-LOOP-DOC-HYGIENE.md`). Drift findings produce kanban cards, not silent rewrites.

---

## Change log (v3.0 → v3.1, 2026-07-20)

| # | Patch | What changed |
|---|---|---|
| A | Frontmatter refresh | Bumped `Version` from `v3.0` → `v3.1 (refined 2026-07-20 to add V3-Canon mirror folder + V3 audit workflow)`. Bumped `Date` from `2026-06-16` → `2026-07-20`. |
| B | Save order blockquote | Added a 4-step blockquote in §3 spelling out the canonical chain: Local → Obsidian → GitHub → Perplexity Spaces, with exact paths for each tier. |
| C | V3-Canon mirror section | New §14 documenting `~/Obsidian/Hermes/V3-Canon/` as the read-only mirror for today's 4 V3 canon docs (ROLES_AND_CHAIN_OF_COMMAND, LEARNED_7_RULE_CONTRACT, LEARNED_V3_MODEL_STACK, LEARNED_V3_TOKEN_ECONOMICS). Includes the `> 🔁 MIRROR — DO NOT EDIT.` blockquote convention, the per-file canon-source mapping table, and the doc-hygiene sync mechanism. |
| D | V3 audit workflow section | New §15 documenting the 5-step audit workflow: read V3 folder as source-of-truth → inventory Perplexity Spaces → diff → write audit md → operator manual UI edits. Explains why agent stack does NOT silently edit Obsidian (preserves Obsidian metadata integrity; agent diagnoses, operator applies). |
