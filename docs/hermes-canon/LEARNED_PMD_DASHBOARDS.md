# PMD + Production Dashboards — Permanent Operating Rules

**Source:** AGENTS.md §"PMD + Production Dashboards — Autonomous-By-Default Rule" + §"Autonomous-By-Default Operating Model" (extracted 2026-07-22)
**Status:** Permanent

**Scope:** PMD, SquarePayouts, BakeryOps, Money Pipeline, BossHub, Travel OS, Client Hub, Trading Control, and every other production dashboard BossMan owns.

---

## Operator Interface Contract

The operator's (Marcelo's) interface for ALL non-trivial PMD/dashboard work is **identical to the health-check contract**:

1. **One single final message per feature.** PASS or PASS-WITH-FIX only.
2. **No A/B/C prompts.** No "what should I do?" questions. No bounce-backs.
3. **Escalation ONLY when:** (a) v3 carve-out blocks (infra/port/security/vendor-billing/product-direction), or (b) a LEARNED rule / canon doc has no answer.
4. **All other decisions** → BossMan picks the recommended option from `decision.md` and logs it.

---

## Default Pipeline (mandatory for every non-trivial change)

Every non-trivial PMD / dashboard change runs on the **autonomous-change-pipeline** skill:

1. **Research** — Perplexity + LEARNED docs (Perplexity main search via Browser QA).
2. **Plan / decompose** — M3 writes `decision.md`, breaks into kanban cards.
3. **Build** — DeepSeek / Claude / OpenAI per `ai-model-routing`.
4. **Cleanup** — Llama bulk; DeepSeek/OpenAI only on critical surface.
5. **Red-team QA** — DeepSeek (default Step-5 model) → structured verdict JSON.
6. **Docs** — Claude writes handoff only after Step-5 PASS.

---

## Kanban Card Schema (mandatory defaults)

Every new PMD / dashboard card follows the kanban template at `~/.hermes/templates/autonomous-change-pipeline-card.md`. Fields:

| Field | Required | Default |
|---|---|---|
| `work_type` | yes | `new_build` \| `existing_build` \| `refactor` \| `troubleshooting` \| `audit` |
| `qa_required` | yes | `yes` for every PMD/dashboard card |
| `verify_against` | yes | List of observable checks (routes, DB queries, browser flows, cron outputs, etc.) |
| `accept_when` | yes | Concrete "done" predicate (all children done, P5 PASS, Step-5 PASS, no stubs) |
| `qa_model` | yes | `deepseek` (default), `openai` (fallback), `M3` (last resort) |
| `parent_card` | yes (for any change > 1 child) | Parent kanban card ID |

---

## Self-QA Gate (BLOCKS the "done" report)

BossMan runs the verifier step BEFORE reporting back. The default checklist:

1. **Browser** — `curl -fsS` against the canonical route(s) on the real host, returns 2xx with expected shape.
2. **API** — exercise every API route the change touches, confirm 200/2xx and valid JSON.
3. **DB** — sqlite3 query confirms expected row counts, schema, and no stub pollution.
4. **PM2** — `pm2 list | grep <service>` returns `online`, `pm2 jlist` shows valid PIDs.
5. **Tests** — `npm test` (or equivalent) green.
6. **Step-5 PASS** — `docs/verdicts/step5-verdict-*.json` verdict == `pass`.

Any FAIL → BossMan fixes and re-runs. BossMan does NOT report "done" with FAIL.

---

## Canonical Template + Skill Pointers

- **Template:** `~/.hermes/templates/autonomous-change-pipeline-card.md` — full parent + child card body.
- **Skill:** `autonomous-change-pipeline` (already in `~/.hermes/skills/`).
- **Verdict shape:** `~/.hermes/templates/step5-verdict.json`.
- **Acceptance template:** `~/.hermes/templates/acceptance-criteria.md`.
- **Mirror:** `~/Obsidian/Hermes/10_Operating-Blueprint/AUTONOMY_OPERATING_MODEL_v3.md` (already published).

---

## Why This Rule Exists (Provenance)

Proven 2026-06-23 on the PMD + AI stack health check (parent goal card): zero clarifying questions, one final PASS-WITH-FIX verdict, autonomous fix applied (SERVICES_MAP.md refresh). The PMD-aware rule extends this from "audits" to "all non-trivial dashboard work".

---

## Five V3 Carve-Outs (require Marcelo approval)

For non-trivial changes, see **`autonomous-change-pipeline` skill** and **`workflow-sanity-check` skill**. Five carve-out categories still require Marcelo approval:

1. Infrastructure install/remove/upgrade
2. Public/VPN port changes
3. Security-relevant behavior
4. Vendor/API/billing
5. True product-direction

Mirror: `~/Obsidian/Hermes/10_Operating-Blueprint/AUTONOMY_OPERATING_MODEL_v3.md`.
