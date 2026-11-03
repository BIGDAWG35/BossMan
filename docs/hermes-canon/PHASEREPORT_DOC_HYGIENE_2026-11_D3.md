# PHASEREPORT_DOC_HYGIENE_2026-11_D3.md — D3 PHASEREPORT + Cross-Ref Scan (Correction Addendum)
> **PATH-NOTE-2026-11-03 — path annotation** (added 2026-11-03 by kanban card `t_483f4239`): the mirror path written below is the **historical** GitHub-mirror location; it does not exist. The GitHub mirror now lives at `~/Repos/BossMan` (`https://github.com/BIGDAWG35/BossMan.git`, public). The original wording is preserved verbatim because this file is a dated report.


**Review Date:** 2026-11-02
**Card:** t_be0e96d9 (D3 — Monthly review board, Nov 2026)
**Parent:** t_f42ecbe1 (Doc Hygiene Goal Loop)
**Reviewer:** ops
**D3 Verdict:** **NEEDS-WORK** — P0=0, P1=0 (one parent P1 refuted), P2=6
**Supersedes:** the D2/D3 sections of the parent report `PHASEREPORT_DOC_HYGIENE_2026-11.md`
(the parent's GitHub-mirror-missing P1 and the "~40% sync gap" framing are **false positives** —
see F-1 and F-7).

---

## 1. Executive summary

The canon is healthy and the mirror topology is intact — but the *parent's* mirror
verdict was wrong because it probed a path that no longer exists. The GitHub mirror
**does exist** (`~/Repos/BossMan`, remote `github.com/BIGDAWG35/BossMan.git`, public,
last push 2026-11-03) and all **92 tracked canon→mirror pairs are at 0 drift**.

The real, actionable D3 findings are not "missing mirror" but:

1. **26 canon docs still reference `~/Projects/BossMan`** — a path that does not exist.
   This is what generated the false "GitHub mirror missing" P1, and it will keep
   regenerating it every cycle until corrected.
2. **The doc-hygiene loop has no calendar driver.** No cron spawns the monthly
   review card (the cron proposal is NOT REGISTERED per canon approval gate), so
   Nov's card was created by hand. Cadence is manual, not automated.
3. **The loop spec's Step-4 instruction is stale and unsafe**: it says to insert a
   line into `PHASEREPORT.md`, which was **archived on 2026-08-31** and is now a
   pointer file. Following it literally would corrupt an archive pointer.
4. **Scope & STOPs gap is larger than reported**: 286 of 292 `SKILL.md` in
   `~/.hermes/skills/` lack the section (6 have it, not 2); across all profiles it is
   1037 of 1043.

---

## 2. F-1 — GitHub mirror: parent P1 REFUTED (was P1, now P2 config drift)

| Probe | Result |
|---|---|
| `~/Projects/BossMan/` (parent's probe path) | **does not exist** — stale path, not a missing repo |
| `~/Repos/BossMan/` | **exists**, git repo, 412 `.md` |
| `git remote -v` (Repos/BossMan) | `origin https://github.com/BIGDAWG35/BossMan.git` (+ a stray `laett-rewrite` local-path remote) |
| `gh repo view BIGDAWG35/BossMan` | `visibility=PUBLIC`, `pushedAt=2026-11-03T04:44:16Z`, url `github.com/BIGDAWG35/BossMan` |
| `~/code/BossMan` | second checkout of the **same** origin (stale, 43 `.md`) |
| `~/Repos/BossMan/docs/hermes-canon/` | 78 `.md` — the real canon mirror target |
| `git log` (Repos/BossMan) | HEAD `8f2f90b spaces v4 build 2026-11-02`, includes `canon mirror sync 2026-11-02` |

**Verdict:** no repo creation / restore / retire decision is needed. The mirror is live
and auto-synced (`canon_mirror_sync.py` + `build_spaces_v4.py`, daily 06:00/06:10).

**Residual P2:** `~/.hermes/config/canon_mirrors.json` → 92 pairs
(50 → `Repos/BossMan/docs/hermes-canon/`, 42 → `Obsidian/Hermes/V3-Canon/`).
**Drift check on all 92 pairs: 0 drifted, 0 missing source, 0 missing destination.**
Mirrors are healthy; the "40% sync gap" number in the parent report compares a
pair-based mirror set against a full canon listing and is not a real gap (see F-7).

---

## 3. F-2 — Stale `~/Projects/BossMan` path references (26 canon docs)

`GOAL-LOOP-DOC-HYGIENE.md` (the loop's own canonical spec) still points its INTAKE
step at `~/Projects/BossMan` (lines 86, 120, 123). That is why the Nov intake
declared the GitHub mirror "MISSING".

Canon docs referencing `~/Projects/BossMan` (top offenders):

```
knowledge/GOAL-LOOP-DOC-HYGIENE.md                                   (3 refs — spec, drives the false P1)
knowledge/GOAL-LOOP-SECURITY-PM2.md                                  (4)
knowledge/PHASEREPORT_DOC_FIXES_2026-06-23.md                        (4)
knowledge/memory/CRYPTO_INTEL_MEMORY_RULES.md                        (4)
knowledge/PHASEREPORT.md                                             (1)
knowledge/PHASE2_PIPELINE/{P1_AUDIT,P2_DESIGN}.md                    (2 each)
knowledge/SECURITY_LOOP/SCOPE-STOPs-ALIGNMENT-MATRIX.md             (3)
... plus 26 total across canon (audit/evidence folders from 2026-11-02)
```

**Action:** mechanical path correction `~/Projects/BossMan` → `~/Repos/BossMan`.
This is a canon write (protected lane) → dispatched as a child card, not done by ops.

---

## 4. F-3 — Cross-ref scan (D3 core): CLEAN

| Check | Scope | Result |
|---|---|---|
| Broken relative `.md` links in canon | 670 canon `.md` files, every `[..](x.md)` link | **0 broken** |
| Case-dup pairs (inode-verified) | `detect-case-dup-pairs.sh ~/.hermes/knowledge/` | **0 pairs, 0 bytes wasted** |
| Kernel docs present | `SOUL.md` ✓, `AGENTS.md` ✓, `knowledge/ROUTING-RULES.md` ✓ | present |
| Kernel doc drift (md5) | SOUL.md, AGENTS.md, ROUTING-RULES.md vs both mirrors | **0 drift** (all 3 in `canon_mirrors.json` with pairs for GH + Obsidian) |

---

## 5. F-4 — Scope & STOPs gap (P2, larger than reported)

| Scope | SKILL.md files | With explicit `Scope & STOPs` | Missing |
|---|---|---|---|
| `~/.hermes/skills/` (default profile) | 292 | **6** | **286** |
| All profiles (`~/.hermes/profiles/*/skills/`) | 1043 | 6 | **1037** |

The 6 that have it: `goal-loop`, `autonomous-change-pipeline`,
`devops/incident-response`, `devops/pm2-health-check`,
`devops/migration-playbook`, `devops/kanban-orchestrator`.

Note: the parent report counted 297 skills / 2 with the section. The 2 were the
`~/.hermes/skills/`-level ones the parent grep hit; the 4 devops ones were missed.

**Not a P0** — the loop's own STOP rule (`> 5 skills missing Scope & STOPs`) is a
*hardening-gap* signal, and this is a long-standing systemic condition, not new
drift. But it is 286 skills wide, so it needs a bulk, template-driven remediation
(not per-skill hand edits) and it belongs to the protected skill-writing lane.

---

## 6. F-5 — Loop spec is stale in two places (P2)

`knowledge/GOAL-LOOP-DOC-HYGIENE.md`:

- **Step 4 (line 199–203)** instructs: *"Insert a one-line entry at top of
  `PHASEREPORT.md`"*. `PHASEREPORT.md` was **archived 2026-08-31** (card
  `t_rule9_archive_untracked_knowledge_batch2`) and is now a 31-line *archive
  pointer*. The 224 KB log lives at
  `~/.hermes/profiles/ops/cron/output/t_rule9_archive_untracked_knowledge_20260831/PHASEREPORT.md.original_byte-equal`.
  Following Step 4 literally would append a live-cycle line to an archive pointer.
- **Line 86** cites `~/Projects/BossMan/PHASEREPORT.md` as "PHASEREPORT" — stale
  (see F-2).

**Action:** amend the spec to point at the archived log and to use a dated,
per-month report file as the append target. Protected canon write → child card.

---

## 7. F-6 — No calendar driver for the monthly loop (P2) → *calendar update applied*

- The doc-hygiene cron proposal (`knowledge/DOC-HYGIENE-CRON-PROPOSAL_2026-06-23.md`)
  is explicitly **NOT REGISTERED**; canon requires operator sign-off before a
  recurring driver is registered.
- Nothing in `~/.hermes/cron/jobs.json`, `~/.hermes/profiles/*/cron/jobs.json`, or
  `crontab -l` spawns a monthly doc-hygiene review card. **Nov's card
  (`t_f42ecbe1`) was created by hand.**
- Existing 1st-of-month drivers do **not** cover canon hygiene:
  `Hermes Monthly Deep-Audit` (`e8c2a1f3d419`, 09:00, deps/cron/DB integrity),
  `Obsidian Vault Monthly Audit` (`0613ba1877bc`, 09:00),
  `Hermes Monthly Deep-Audit` scope ≠ doc-hygiene loop.

**Calendar update applied by ops (this card):** a **one-shot** local cron entry
for **2026-12-01 09:30 PT** that opens the December review card
(`monthly_review_2026-12`) on the bossman board and runs INTAKE. Deliberately
one-shot rather than recurring: a recurring unattended driver is an approval-gated
canon item and stays with the operator.

**Recurring-driver recommendation (needs operator approval, not auto-registered):**
promote the one-shot into a monthly `0 30 1 * *` local job once the operator signs
off on the proposal.

---

## 8. F-7 — Intake metric drift (parent numbers vs measured)

| Metric | Parent | Measured (2026-11-02) |
|---|---|---|
| Canon `.md` files | 674 | **670** |
| Obsidian mirror `.md` | 406 | **356** in `~/Obsidian/Hermes` (406 = whole vault incl. non-Hermes) |
| GitHub mirror | "MISSING" | **present** — `~/Repos/BossMan` (412 `.md`; 78 in `docs/hermes-canon/`) |
| "Obsidian sync gap" | ~40% | **not a gap** — mirrors are pair-based (92 tracked pairs); 0 drift |
| TODO/FIXME/STUB markers | 42 | **56 across 14 canon files** (top: `projects/discord_dual_primary/PHASE2_DESIGN_v1.md` = 29, `GOAL-LOOP-DOC-HYGIENE.md` = 8) |
| Skills missing Scope & STOPs | 295 | **286** (`~/.hermes/skills`), **1037** (all profiles) |

---

## 9. P0 / P1 / P2 breakdown (D3 verdict)

| Pri | Count | Items | Escalation |
|---|---|---|---|
| **P0** | 0 | — | none |
| **P1** | **0** | parent's "GitHub mirror missing" **refuted** (F-1) | none |
| **P2** | 6 | F-2 stale path ×26 docs · F-3 none (cross-refs clean) · F-4 Scope&STOPs 286/1037 · F-5 stale loop spec ×2 · F-6 no recurring calendar driver · F-7 metric drift | child cards, no operator escalation |

**Overall November hygiene grade: NEEDS-WORK** (canon healthy + mirrors healthy +
cross-refs clean; the loop's own spec/calendar plumbing is stale).

---

## 10. Child cards created (ops → correct lane)

| Card | Assignee | Content |
|---|---|---|
| D3-A | builder | Correct stale `~/Projects/BossMan` → `~/Repos/BossMan` in canon (26 docs incl. `GOAL-LOOP-DOC-HYGIENE.md`) and amend loop spec Step 4 to append to the archived log / dated report instead of the `PHASEREPORT.md` pointer |
| D3-B | builder | Bulk `Scope & STOPs` remediation for `~/.hermes/skills/` (286 files) using the canonical template `autonomous-change-pipeline/references/scope-stops-block.md` |

Both are protected canon/skill writes → builder lane (ops does not write canon
bodies). No P0/P1 fix cards required.

---

## 11. Evidence

- Case-dup: `bash ~/.hermes/skills/autonomous-change-pipeline/scripts/detect-case-dup-pairs.sh ~/.hermes/knowledge/` → 0 pairs
- Mirror drift: 92 pairs from `~/.hermes/config/canon_mirrors.json` → 0 drift / 0 missing
- GitHub repo: `gh repo view BIGDAWG35/BossMan` → PUBLIC, pushedAt 2026-11-03T04:44:16Z
- Cross-ref: relative `.md` link scan over 670 canon files → 0 broken
- Skills audit: recursive `SKILL.md` scan of `~/.hermes/skills` + all `profiles/*/skills`
- Calendar: `~/.hermes/cron/jobs.json` (52 jobs), `profiles/*/cron/jobs.json`, `crontab -l` (13 lines) — no doc-hygiene driver
