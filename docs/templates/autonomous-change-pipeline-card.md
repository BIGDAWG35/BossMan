# Autonomous-Change-Pipeline Card Template (PMD + Production Dashboards)

> **Permanent template — 2026-06-23.** Required default for every non-trivial change to PMD, SquarePayouts, BakeryOps, Money Pipeline, BossHub, Travel OS, Client Hub, Trading Control, and every other production dashboard BossMan owns. See `AGENTS.md` § "PMD + Production Dashboards — Autonomous-By-Default Rule".

> Activated by `autonomous-change-pipeline` skill. Proven on PMD 4-property 2026-06-22 (P1–P5), Phase 4 Security Watch 2026-06-23, Doc-Integrity Audit 2026-06-23, Phase 1 Doc-Fix 2026-06-23, Phase 2 Hardening 2026-06-23, Phase S1 Security-PM2 Loop 2026-06-23.

---

## How to use this template

1. Copy the **Parent card body** below into `hermes kanban create` (or use `hermes kanban swarm` for the parallel-worker variant).
2. Create child cards using the **Child card template**. Link them via `--parent <parent_id>`.
3. Run the **v3 6-step pipeline**: research → plan/decompose → build → cleanup → red-team QA → docs.
4. BossMan runs the **Self-QA gate** before reporting done.
5. Marcelo sees **one single final message**: PASS or PASS-WITH-FIX.

---

## Parent card body

```yaml
project: <PMD | SquarePayouts | BakeryOps | MoneyPipeline | BossHub | TravelOS | ClientHub | TradingControl | ...>
work_type: <new_build | existing_build | refactor | troubleshooting | audit>
assignee: <profile>
priority: <low | med | high | critical>
skill: autonomous-change-pipeline
qa_required: yes
qa_model: deepseek                # default; openai fallback, M3 last resort
parent_card: <optional — only if this is itself a child of a larger epic>
max_runtime: 4h
body: |
  <one-paragraph problem statement>

  # Acceptance criteria (accept_when)
  - [ ] All child cards status=done
  - [ ] P5 self-verify card passed (localhost + Tailscale + DB + PM2 + tests all green)
  - [ ] Step-5 QA verdict JSON verdict=pass
  - [ ] No silent stubs / synthetic rows / placeholder data
  - [ ] Browser flow verified end-to-end (every button/modal/route)
  - [ ] PM2 service online with valid PID
  - [ ] DB integrity check passed (row counts, schema, no orphan rows)
  - [ ] Documentation updated (LEARNED_*.md or PHASEREPORT entry if material)

  # verify_against (observable checks)
  1. curl -fsS -o /dev/null -w "%{http_code}\n" https://localhost:<port>/<route>  → 200
  2. <API route>  → 200 with valid JSON shape
  3. sqlite3 <db> "SELECT count(*) FROM <table> WHERE <condition>"  → expected N
  4. pm2 jlist  → <service> status=online, pid valid
  5. <test command>  → 0 exit, expected pass count
  6. Step-5 verdict: cat docs/verdicts/step5-verdict-<this-card>.json | jq '.verdict'  → "pass"

  # 6-step pipeline plan
  1. Research → Perplexity main search (Browser QA) + LEARNED docs
  2. Plan → M3 writes decision.md with options + recommended choice
  3. Build → <DeepSeek | Claude | OpenAI> per ai-model-routing
  4. Cleanup → Llama bulk, DeepSeek/OpenAI only on critical surface
  5. Red-team QA → DeepSeek (default Step-5 model) → structured verdict JSON
  6. Docs → Claude writes handoff only after Step-5 PASS

  # Carve-out check
  - [ ] infra install/remove/upgrade   → operator approval required (auto-stop, surface to Marcelo)
  - [ ] public/VPN port or domain change → operator approval required
  - [ ] security-relevant behavior change → operator approval required
  - [ ] vendor/API/billing decision     → operator approval required
  - [ ] true product-direction pivot    → operator approval required

  # Operator interface
  Marcelo will see ONE single final message (PASS or PASS-WITH-FIX) after Step-5 PASS.
  No mid-stream status pings. No A/B/C prompts unless a carve-out blocks.
```

---

## Child card template (P1–P5)

Each child follows the same shape. For audit-class work, rename P1–P5 to A/B/C/D/E.

### P1 — Research / Schema / Map (M3 owns)

```yaml
project: <as parent>
work_type: <inherits parent>
assignee: bossman
priority: <high>
parent: <parent_id>
qa_required: yes
qa_model: deepseek
skill: autonomous-change-pipeline
body: |
  # P1 — Research / Schema / Map

  # Goal
  <one sentence>

  # Output
  - decision.md with options A/B/C + recommended choice
  - (audit-class) full enumeration of every target file with sizes/mtimes

  # verify_against
  1. decision.md exists at <path> with all options + recommendation
  2. <audit-class> file list complete: find <scope> -type f | wc -l == N
  3. No silent assumptions — every option has evidence

  # accept_when
  - decision.md reviewed and recommendation chosen (auto-pick recommended)
  - File enumeration complete (audit-class)
```

### P2 — Decision / Methodology (M3 owns)

```yaml
parent: <parent_id>
skill: autonomous-change-pipeline
body: |
  # P2 — Decision / Methodology

  # Goal
  Finalize the decision.md choice (operator override via Telegram if any).
  Audit-class: define 6 finding classes + priority scoring rules.

  # Output
  - decision.md finalized with chosen option + rationale
  - (audit-class) finding classes taxonomy + P0/P1/P2/P3 scoring

  # verify_against
  1. decision.md has chosen option clearly marked
  2. (audit-class) finding-class taxonomy committed to card body

  # accept_when
  - Decision is locked; P3 may start
```

### P3 — Implementation / Execute Audit (DeepSeek primary, Claude/OpenAI secondary)

```yaml
parent: <parent_id>
assignee: builder
skill: autonomous-change-pipeline
qa_required: yes
qa_model: deepseek
body: |
  # P3 — Implementation / Execute Audit

  # Goal
  Build the change OR (audit-class) read every target, classify into 6 finding classes, log raw findings.

  # Output
  - Code / config / doc / dashboard change committed
  - (audit-class) raw findings logged to card body or /tmp/audit-findings.json

  # verify_against
  1. <change specific>
  2. git diff shows expected file changes
  3. No TODO/FIXME/stub/mock introduced

  # accept_when
  - Build passes local compile / lint / format
  - All target files touched (audit-class)
```

### P4 — Honest Recompute / Verification (DeepSeek verification)

```yaml
parent: <parent_id>
assignee: builder
skill: autonomous-change-pipeline
qa_required: yes
qa_model: deepseek
body: |
  # P4 — Honest Recompute / Verification

  # Goal
  Re-derive every claim from source-of-truth. Prove no stubs / synthetic data.
  Audit-class: re-verify P0 findings independently, WITHDRAW false positives explicitly.

  # Output
  - Recompute report (numbers from DB, not from memory)
  - (audit-class) P4 report with explicit "WITHDRAWN" entries for any P3 finding that failed re-verify

  # verify_against
  1. Every numeric claim in the change is reproducible from DB / file:line
  2. No silent stubs / synthetic rows / placeholder data
  3. (audit-class) P0 false-positive rate explicitly reported

  # accept_when
  - P4 report attached
  - (audit-class) all P0 findings either confirmed or withdrawn with evidence
```

### P5 — Self-Verify Card (M3 synthesizes)

```yaml
parent: <parent_id>
assignee: bossman
skill: autonomous-change-pipeline
qa_required: yes
qa_model: deepseek                # Step-5 verifier
body: |
  # P5 — Self-Verify (BLOCKS the "done" report)

  # Goal
  Confirm the change is actually live and correct on the real runtime.

  # Default checklist (run ALL that apply)
  1. Service is up
     curl -fsS -o /dev/null -w "%{http_code}\n" https://localhost:<PORT>/<ROUTE>
  2. PM2 process is online
     pm2 list | grep <service>     # → online
     pm2 jlist | jq '.[] | select(.name=="<service>") | {pid, status}'
  3. Tailscale routing is alive (if exposed)
     tailscale status | grep <hostname>
  4. DB state matches expectation
     sqlite3 <db> "SELECT count(*) FROM <table> WHERE <condition>"
  5. No stubs / synthetic data
     grep -rE "TODO|FIXME|stub|mock|synthetic" <src>/ | head
  6. Step-5 QA verdict = pass
     cat <qa-verdict-file>.json | jq '.verdict'
  7. Browser flow (if UI)
     <click sequence> → expected outcome

  # Output
  - P5 evidence attached to card as a comment
  - Step-5 verdict JSON saved to docs/verdicts/step5-verdict-<card-id>.json

  # accept_when
  - All checks PASS
  - Step-5 verdict = "pass"
  - If ANY check FAILS → BossMan fixes and re-runs (no report until PASS)
```

---

## Workstream classes (use the matching P1–P5 mapping)

| Class | work_type | Pipeline | Notes |
|---|---|---|---|
| **Build** | new_build / existing_build | P1=schema/UI, P2=decision, P3=build, P4=recompute, P5=self-verify | Default for all feature work |
| **Audit** | audit | P1=audit universe map, P2=6 finding classes, P3=read+classify, P4=re-verify P0 (withdraw false positives), P5=operator report + cleanup plan | Proven 2026-06-23 |
| **Refactor** | refactor | P1=current state map, P2=migration plan, P3=migrate, P4=equivalence proof, P5=self-verify | No behavior change; must be observably equivalent |
| **Troubleshooting** | troubleshooting | P1=symptom inventory, P2=root-cause analysis, P3=fix, P4=verify fix, P5=incident report | Activate `debug` + `systematic-debugging` skill |
| **Doc-sync** | (sub-class of refactor) | P1=canon inventory, P2=mirror map, P3=sync, P4=integrity check, P5=canon review | See `autonomous-change-pipeline/references/doc-sync-as-acp.md` |

---

## Why this template exists

Proven on PMD 2026-06-22 (4-property build, P1–P5 PASS) and 7 autonomous audits 2026-06-23. Codifies the operator interface contract: **one final PASS/PASS-WITH-FIX message, no A/B/C prompts, no mid-stream pings**. Any deviation blocks the "done" report.

**Last updated:** 2026-06-23
**Owner:** BossMan (`bossman` profile)
**Provenance:** PMD + AI stack health check 2026-06-23 → codification of autonomous-by-default rule.