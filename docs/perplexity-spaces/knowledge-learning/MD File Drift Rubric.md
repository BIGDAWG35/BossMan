**Version:** v4 · **Date:** 2026-09-01 · **Source:** `~/.hermes/knowledge/LEARNED_MD_FILE_DRIFT_RUBRIC.md` · **Status:** Current — auto-built from canon by build_spaces_v4.py; edit the source, not this copy

> Note: any LBC35/OpenClaw mention in this file is historical (retired 2026-09-30; BossMan does all delegation via kanban + route-card.sh). Health OS was deleted 2026-09-30. Where this file conflicts with "00 - Current State (2026-10-01).md", the Current State file wins.

# LEARNED_MD_FILE_DRIFT_RUBRIC.md — Classify Before Trim

> **CANONICAL SOURCE OF TRUTH** for classifying MD content before any removal/trim/dedup.
> Locked 2026-08-06 (Card `t_md_drift_rubric_v1_20260806`); amended 2026-08-31 (Card `t_v33_full_install_v1_20260831`) — added **fifth category: Generated** (auto-generated artifacts).
> Companion: `LEARNED_7_RULE_CONTRACT.md` Rules #8 + #9, `AUTOMATION_INVENTORY.md` A.1.

This doc codifies the workflow that prevents two failure modes at once:
- **Knowledge loss** — deleting a section because it "looks redundant" without realizing it's the only preserved version of a retired workflow.
- **Bloat creep** — letting working-context sections grow inside LEARNED/canon files until the file's job becomes unclear.

The rule is simple: **No section may be deleted from a canon MD file without (a) a git snapshot, (b) classification by this rubric, and (c) approval as durable, historical, or trim-only.**

---

## 1. Classification rubric (5 categories — 2026-08-31 amendment)

For every section of a canon MD considered for removal, classify it as ONE of:

| # | Class | Definition | Disposition |
|---|---|---|---|
| **A** | **Canonical durable rule** | A permanently live truth about how the stack works. Active in current workflows. Used by agents today. Will be wrong if removed. | **DO NOT REMOVE.** If misplaced, move to the correct `LEARNED_*.md` or kernel-doc (SOUL/AGENTS/ROUTING-RULES/OPERATINGBLUEPRINT) with cross-reference. |
| **B** | **Historical evidence / timeline** | A recording of what happened. Phase report, audit result, postmortem, decision log. Useful for root-causing drift, but not active. | **MOVE** to `~/.hermes/knowledge/PHASEREPORT.md` (append-only) OR `~/.hermes/archive/knowledge-history/<orig-file>/<date>.md` if very old. |
| **C** | **Procedure / step-by-step workflow** | A runnable set of commands, decisions, or gates. A "recipe" for a task. Distinct from a rule because it tells you how to act today. | **MOVE** to `~/.hermes/skills/<category>/<skill-name>/SKILL.md` OR `references/<topic>.md` inside an existing skill. |
| **D** | **Temporary working context / stale duplicate** | Material that was live once but no longer is. Old session output, scratch notes, planning drafts, repeated content already owned by another file. | **SAFE TO TRIM** after (a) snapshot + (b) classification + (c) a 7-day quarantine window if it's in code-paths the agent relies on. |
| **Generated** | **Auto-generated artifact** (added 2026-08-31) | Material produced by a cron job, build step, doc-hygiene sweep, or other automated writer. Examples: daily memos, weekly intel, regenerated snapshots, service-map output, build-metrics, audit scripts. **Out of canon by source.** Never trimmed via Rule #9; managed via lifecycle (regenerate / quarantine / archive) tracked separately. | **DO NOT classify as A/B/C/D.** If a generated artifact is cited from canon, **point to** it from canon rather than absorb it. Lifecycle decisions belong to the generating script's owner lane (ops for cron, content for daily memos, knowledge-canon for snapshots). |

**A and B look identical at a glance.** The discriminator is *Is this still active in any current workflow?* If yes → A. If the answer is "we'd only need to read it to remember what happened" → B.

**C and A look identical too.** The discriminator is *Does it prescribe actions to take today, or does it describe a permanent truth?* A truth belongs in LEARNED. A recipe belongs in SKILL.

**Generated vs. B:** Generated artifacts are *re-creatable* from source data + a regeneration script; historical evidence (B) is *unique* and *one-time-recorded*. The discriminator is *Can we reproduce this by running a script?* If yes → Generated. If no → B.

**Generated vs. D:** Generated artifacts are *currently being produced*; temp working context (D) is *human-authored and not currently active*. The discriminator is *Did a script write this, or did a human?*

---

## 2. Workflow (mandatory before any trim)

```
STEP 1 — SNAPSHOT
  ~/.hermes/scripts/git-snapshot-before-fix.sh <repo-or-dir> "<file-purpose>"

  Required inputs: the repo or directory holding the MD, plus a human-readable reason.
  Example:
    ~/.hermes/scripts/git-snapshot-before-fix.sh ~/.hermes "trim-phasereport-2026-08-06"

  Output: a SHA on stdout. Save it to your kanban card metadata.

STEP 2 — CLASSIFY EACH CANDIDATE SECTION
  For each ## heading the trimmer wants to remove, do all four of:
    (a) Quote the first sentence that says it is a rule vs history vs procedure vs temp.
    (b) Reference any audit that mentions it (search LEARNED_INDEX).
    (c) Confirm no current SKILL or LEARNED doc depends on it (search LEARNED_*, skills/**/SKILL.md).
    (d) Record the classification in the kanban card body table.

STEP 3 — DISPOSITION
  A → leave in place, OR move to correct LEARNED with cross-ref.
  B → append to PHASEREPORT.md (if still useful for drift root-cause), OR move to archive/.
  C → move to SKILL.md / references/<topic>.md in the matching skill.
  D → trim after a 7-day quarantine. If, during quarantine, no agent reports breakage, trim is permanent.

STEP 4 — POST-TRIM VERIFY
  Re-run `~/.hermes/scripts/hermes-canon-drift-check.sh` (weekly) to confirm the trimmed file still passes md5 baselines.
  Confirm no LEARNED doc or SKILL now has a dead link to a deleted section.
  Run a Step-5 verifier: did any sub-agent skill still depend on the removed text? If yes, restore from snapshot and re-classify.

STEP 5 — IF STEP-5 FAILS OR AMBIGUITY SURFACES
  Stop. Do not force-trim. Surface a kanban comment with the verdict and revert via:
    ~/.hermes/scripts/git-revert-last-fix.sh <repo-or-dir> <sha> "<reason>"
```

---

## 3. Common mis-classifications (anti-patterns)

❌ Classify a section as D (temp) just because it "looks old." Old ≠ disposable.
❌ Classify a section as A (rule) because it "sounds important" without checking whether anything actually consumes it.
❌ Classify a workflow procedure as a "rule" and put it in `LEARNED_*.md`. Recipes → SKILL.
❌ Classify an audit result as "historical" and delete it. Audits prevent repeat drift. Move, don't trim.
❌ Use `ls -la` to "guess" what's old. Use frontmatter dates + last-referenced-by references from `search_files`.
❌ Trim without snapshot. This is forbidden by Rule #8 even if the trim is "obviously safe."
❌ Trim within 7 days of authoring. Newly authored sections may still be unverified or referenced by an in-flight onboarding.

---

## 4. File-structure recommended split (6-category pattern)

Hermes already follows this 6-category pattern implicitly. The rubric makes it explicit:

```
~/.hermes/knowledge/LEARNED_*.md    →  A — durable truths (each one has a single job)
~/.hermes/knowledge/PHASEREPORT.md  →  B — append-only change log (every permanent change lands here)
~/.hermes/skills/**/SKILL.md        →  C — procedures (one skill, one job; reference docs in references/)
~/.hermes/knowledge/AUDIT_*.md      →  D-like-A — point-in-time checks (kept as historical evidence)
~/.hermes/archive/                  →  B-frozen — material no longer live, but reusable as historical evidence
# 2026-08-31 amendment: Generated category (5th rubric class)
~/.hermes/cron/output/<job>/        →  Generated — auto-generated cron output (daily memos, weekly intel, audit scripts)
~/.hermes/knowledge/BUILDMETRICS*.md→  Generated — auto-regenerated monthly metrics (knowledge-canon cron)
~/.hermes/knowledge/SERVICES_MAP_SNAPSHOT_*.md → Generated — auto-regenerated services map (retired script + manual)
~/.hermes/logs/*.log                →  Generated — runtime logs (heartbeat, incident reports, drift-scan)
# End 2026-08-31 amendment
~/.hermes/SOUL.md                   →  A — kernel identity
~/.hermes/AGENTS.md                 →  A — kernel delegation rules
~/.hermes/knowledge/ROUTING-RULES.md →  A — routing parent policy
~/.hermes/OPERATINGBLUEPRINT.md     →  A — orchestrator handbook (durable, not project history)
```

**Single-job rule:** Each `LEARNED_*.md` file should have a one-line "Job:" in its frontmatter. If your trim attempt would leave the file with mixed jobs (a recipe + a rule + a history section), split the file first and then trim nothing.

---

## 5. Quick classification tests

Three minutes per section. Apply all four:

1. **Current-usage test**: Search `~/.hermes/skills/` for `<keyword>` in last 30 days. Any reference? → A or C.
2. **Drift-relevance test**: Search `~/.hermes/knowledge/PHASEREPORT.md` + audit history. Reasoned about? → B.
3. **Action test**: Does it say "do X when Y" or "Z is true"? Procedure → C. Truth → A.
4. **Freshness test**: Is the section referenced from a `LEARNED_*.md`, `README`, or skill in the last 7 days? If yes, leave alone.

If three of four say "trim" → safe. If 0–2 say trim → keep + classify properly.

---

## 7. Compliance enforcement

- `~/.hermes/scripts/hermes-canon-drift-check.sh` — weekly md5 baseline check protects the trimmed files.
- `~/.hermes/scripts/pm2-canon-drift-check.sh` — protects PM2/canon sections at finer granularity.
- `~/.hermes/knowledge/AUTOMATION_INVENTORY.md` — registers the snap/revert/drift helpers.
- Every kanban card that touches a canon MD must record (a) SHA, (b) classification table, (c) Step-5 verdict.
- **2026-08-31 amendment:** Generated artifacts (5th rubric category) are excluded from `hermes-canon-drift-check.sh`'s md5 baseline because they regenerate; their lifecycle is tracked separately by their owner lane (see `HERMES_SUBAGENT_BLUEPRINT_v3.3.md` §"Cost-control rule" + tier-6 ownership plan in `V3_3_MASTER_BLUEPRINT_20260831.md`).

---

## 8. Quick classification tests (amended 2026-08-31)

Three minutes per section. Apply all five:

1. **Current-usage test**: Search `~/.hermes/skills/` for `<keyword>` in last 30 days. Any reference? → A or C.
2. **Drift-relevance test**: Search `~/.hermes/knowledge/PHASEREPORT.md` + audit history. Reasoned about? → B.
3. **Action test**: Does it say "do X when Y" or "Z is true"? Procedure → C. Truth → A.
4. **Freshness test**: Is the section referenced from a `LEARNED_*.md`, `README`, or skill in the last 7 days? If yes, leave alone.
5. **Generated test (2026-08-31 amendment)**: Did a script write this file (cron job, build step, doc-hygiene sweep)? If yes → Generated. **DO NOT classify as A/B/C/D — apply lifecycle rule instead.**

If three of five say "trim" → safe. If 0–2 say trim → keep + classify properly. **Generated always says "do not trim" — manage lifecycle separately.**

---

*Maintained by: knowledge-canon sub-agent. Mirror: Obsidian + GitHub via `hermes-canon-sync.sh`. Drift signal: any breach of §2 workflow opens a `t_drift_md_classification_2026-08-XX` card.*
*Amended 2026-08-31 PDT: added Generated (5th) category + 6-category file structure pattern + Generated discriminator tests.*
