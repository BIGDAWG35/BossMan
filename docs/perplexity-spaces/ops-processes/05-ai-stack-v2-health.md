# AI Orchestration Blueprint
**Version:** 1.1
**Date:** 2026-05-22
**Owner:** BossMan (Hermes orchestrator)
**Status:** Canonical — governs all AI stack decisions

---

## Command Hierarchy

- **BossMan** is the only top-level orchestrator.
- **Marcelo** is the approver/strategist — not a relay between tools.
- **LBC35 / OpenClaw / subagents** are the execution layer only.

---

## Perplexity Access (Updated 2026-05-22)

### Primary Access Path — Brave CDP Bridge

**Perplexity is accessed via Hermes Browser QA using a Brave browser instance with remote debugging enabled.**

- Brave is launched with `--remote-debugging-port=9222` + isolated `--user-data-dir=/tmp/brave-debug`
- Hermes config: `browser.cdp_url: http://localhost:9222` in `~/.hermes/config.yaml`
- This bypasses Cloudflare challenges entirely — Brave handles auth transparently
- CuaDriver handles all macOS-level screen capture and interaction

### Perplexity Desktop App — DEPRECATED

The Perplexity Mac app (`perplexity-ai.desktop`) has a **zero-bounds bug** that causes `capture` failures. Do NOT use Computer Use on the Perplexity desktop app.

### Perplexity Spaces Access Priority (2026-05-22)

**Priority 1 — File-first via local mirrors (CANONICAL):**
`~/.hermes/spaces/[folder]/` is the primary source. All Spaces maintenance uses local files as canonical state. Changes sync to Perplexity Spaces via browser automation.

**Priority 2 — Brave browser via CDP (PRIMARY automation path):**
`curl localhost:9222/json/version` → verify bridge is up → `browser_navigate` to `https://perplexity.ai` or `https://app.perplexity.ai/spaces/[id]`

**Priority 3 — Mac app assisted (visual verification only):**
Use Hermes Computer Use on the Perplexity Mac app for visual verification when needed — not for automation.

### Perplexity-BossMan Handoff

- BossMan pulls context from local Space mirrors (`~/.hermes/spaces/`)
- Browser automation via Brave CDP handles all Perplexity web interactions
- Marcelo does not manually copy/paste between Perplexity and BossMan

---

## Perplexity Role

- **Perplexity Search / Spaces / Deep Research** = default external research and context layer
- **Perplexity Computer** = premium delegated specialist for deep multi-step work (reverse engineering, complex research, investigations)

---

## Computer Use Ownership

- BossMan is the **ONLY** owner of Hermes Computer Use on the Mac mini.
- Other agents must not directly start Computer Use.
- Any agent needing Computer-mediated actions on the Mac must route the request through BossMan.
- **CuaDriver TCC fix (2026-05-22):** `tccutil reset ScreenCapture com.trycua.driver` + re-grant in System Settings → Screen Recording. SOM mode confirmed working (151 elements captured).
- **CuaDriver status (2026-05-22):** Running (PID 74248), SOM capture working, full display capture needs TCC fix if not already granted.

---

## Perplexity Computer Usage Policy

**Use Computer only when:**
- Research is deep/complex
- Reverse engineering or cross-system investigation is needed
- Report/blueprint generation requires multi-step workflows

**Do NOT use Computer for simple one-off queries or routine tasks.**

**Fallback if Perplexity limits are hit:**
- Internal stack (BossMan + LBC35 + subagents)
- Local Spaces files for maintenance (Priority 1 path)
- Brave CDP browser automation for web research

---

## Model Pool Roles (Permanent — 2026-06-03, v3.0 "10/10")

| Model | Role | Notes |
|-------|------|-------|
| **Perplexity Search (Pro)** | First-step research | Step 1 of every non-trivial build. Current docs, API references, gotchas. |
| **M3 (MiniMax M3)** | Primary thinking and planning brain | Step 2 design + Step 3 routing/architecture. Default for routine work. BLOCKED for SquarePayouts. |
| **DeepSeek** | Heavy-duty coder, reasoning engine, **and Step 5 QA (red-team)** | Primary builder for complex or critical backend logic, data, or debugging. **Default Step-5 QA model.** |
| **Llama (Ollama local)** | Cheap grinder | Step 4 harden and clean up. Bulk transforms, scaffolding, refactors, tests, cleanup. |
| **OpenAI** | Production finisher | Primary builder when output is user-facing or high-risk. Final polish only. **Step 5 QA fallback** (after DeepSeek). |
| **Claude** | Long-form documentation writer | **Step 6 only** — after the code is stable AND QA passes. Runbooks, handoff docs. |
| **Perplexity Deep Research** | Multi-source synthesis on complex topics | When Step 1 needs deeper research than a single search. |
| **Perplexity Computer** | Multi-step Mac/browser workflows | **Rare escalation only.** 10,000 credits/month cap. `escalate_to_computer: yes` flag, Marcelo approval. NOT part of the everyday default path. |

### SquarePayouts Model Restriction (Permanent)

**M3 is BLOCKED for all SquarePayouts work.** Use Claude, DeepSeek, or OpenAI only. Perplexity Search, Llama, and Claude remain approved for SquarePayouts research and review. Perplexity Computer requires the same `escalate_to_computer: yes` approval as everywhere else.

### Full policy

The 6-step Default Build Flow (Perplexity → M3 → primary builder → Llama cleanup → DeepSeek QA → Claude docs) and the multi-model rules are in:

- `~/.hermes/AGENTS.md` — Model Routing (parent policy)
- `~/.hermes/knowledge/ROUTING-RULES.md` — Default Build Flow rules (v3.0 canonical)
- `~/.hermes/knowledge/MODEL-STACK-WORKFLOWS.md` — End-to-end worked examples (v3.0)
- `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` — Cost tiers + Routing Ledger (v3.0)

---

## Project Kickoff Protocol — Default Build Flow v3.0 "10/10" (Permanent — 2026-06-03)

For every new project or significant work item, BossMan follows the **6-step Default Build Flow v3.0** from `~/.hermes/knowledge/ROUTING-RULES.md`:

**Step 1 — Research (Perplexity Search):**
- Perplexity Search pulls current docs, best practices, API references, and gotchas
- Never guess when we can read
- Key sources linked into the main project card

**Step 2 — Design (M3):**
- M3 designs the architecture, defines the main components, and breaks work into Kanban cards with clear acceptance criteria
- Saved in the main project card body, not in chat
- References the Perplexity sources from Step 1

**Step 3 — Build (Primary builder, one per card):**
- For each build card, pick exactly one primary builder:
  - **DeepSeek** for complex or critical backend logic, data, or debugging
  - **Llama** for repetitive scaffolding, refactors, or large-volume code edits
  - **OpenAI** when output is user-facing, high-risk, or needs polished style
- Note the primary builder under a `model_plan:` line in the card body
- Marcelo reviews the AI Stack Recommendation (which model for which card) and approves before build starts

**Step 4 — Harden and clean up:**
- Llama handles bulk cleanup and test generation
- DeepSeek or OpenAI only as a final sanity pass on critical components
- Do NOT rewrite large chunks that are already acceptable

**Step 5 — QA PASS (DeepSeek red-team) — new in v3.0:**
- **Mandatory for critical cards** (money, PII, infra, trading, auth, public APIs)
- Marcelo's standing rule: include Step 5 for high-impact or sensitive work unless explicitly told to skip
- DeepSeek uses red-team mindset: edge cases, security, performance, failure modes
- Default QA model: **DeepSeek**. Fallback: OpenAI → M3
- Findings logged as card comments and/or QA sub-cards
- Card's `qa_status` updated: `pending` → `passed` / `failed` / `logged`

**Step 6 — Docs and handoff (Claude):**
- Claude writes long-form docs and runbooks only after the code is stable AND QA has passed (or every QA issue is logged as a sub-card and tracked)
- Claude reads the final code, M3's design notes, the acceptance criteria, and the QA findings
- Output: concise but complete docs, saved to `~/.hermes/knowledge/`, Obsidian, and GitHub

**After the 6 steps:**
- Card → `done`
- Set metrics fields on the card:
  - `build_passes:` (`1` / `2` / `3+`)
  - `rewrite_scope:` (`none` / `minor` / `major`)
- Update Routing Ledger with which model produced what
- Self-audit: Was deliverable achieved? Was Marcelo's time used well? Follow-up needed?

**Per-card fields (v3.0):**
```yaml
model_plan: ...
qa_required: yes | no
qa_model: DeepSeek | OpenAI | M3
qa_status: pending | passed | failed | logged
escalate_to_computer: yes | no
escalate_to_computer_reason: ...
build_passes: 1 | 2 | 3+
rewrite_scope: none | minor | major
```

**Approval gates:** Marcelo reviews and approves:
- The architecture from Step 2 (before any build cards are assigned)
- The `model_plan:` field for each build card (before Step 3 starts)
- The `escalate_to_computer: yes` flag, when proposed (before Step 3 starts)
- The final docs from Step 6 (before marking the card done)

**Perplexity Computer — escalation (v3.0):**
- Allowed only on projects matching the §4 patterns: (1) greenfield full-stack SaaS builds, (2) large cross-service refactors/migrations, (3) complex multi-domain research
- Requires `escalate_to_computer: yes` flag on the main project card, approved by Marcelo
- Hard cap: **10,000 credits/month.** BossMan pre-warns if a project would consume more than ~3,000
- LBC35 does NOT trigger Perplexity Computer; it only follows the flag in the handoff packet

---

## Knowledge Flywheel

Important prompts, workflows, debug patterns, architecture decisions, and research conclusions must be saved to:
- `~/.hermes/knowledge/` — primary canonical store
- Obsidian: `/Users/bigdawg/Obsidian/Hermes/Systems/`
- GitHub: `BIGDAWG35/BossMan/docs/`
- Project-specific Perplexity Space

---

## Tool Strategy by Task Type

| Task | Tool |
|------|------|
| Perplexity web research | Browser QA → Brave CDP |
| Perplexity Spaces maintenance | Browser QA → Brave CDP + local file mirrors |
| macOS UI interaction | Hermes Computer Use (CuaDriver) |
| Localhost web app QA | Browser QA |
| Code/CLI/DB inspection | Terminal |
| Live sports/market data | Perplexity Search |
| Deep multi-source research | Perplexity Deep Research |
| Complex cross-system investigation | Perplexity Computer |
| Simple one-off research | Perplexity Search (no Computer) |

---

## Spaces Maintenance

- Daily sync via `sync_perplexity_spaces.sh` (cron job `7203f2330d92`, 6 AM daily)
- Monitors: `~/.hermes/knowledge/` + OpenClaw Brain files
- Syncs to: `~/.hermes/spaces/[space]/` → Obsidian + GitHub
- Telegram notification only if changes detected; silent if clean
- Event-driven audits after major system/project/blueprint changes
- Auto-verified = silent watchdog. Issues found = approval request to Marcelo
- Approval format:
  ```
  Space: [name]
  Detected changes: [list]
  Reason: [why needed]
  Proposed action: [exact plan]
  ```

---

## Key Paths

| Copy | Path |
|------|------|
| Local knowledge | `~/.hermes/knowledge/ai-orchestration-blueprint.md` |
| Obsidian | `/Users/bigdawg/Obsidian/Hermes/Systems/ai-orchestration-blueprint.md` |
| GitHub | `BIGDAWG35/BossMan/docs/ai-orchestration-blueprint.md` |
| Spaces sync script | `~/.hermes/scripts/sync_perplexity_spaces.sh` |
| Spaces file mapping | `~/.hermes/config/spaces_file_mapping.json` |
| Daily sync log | `~/.hermes/logs/spaces-sync-YYYY-MM-DD.md` |
| Spaces source | `~/.hermes/spaces/[folder]/` |

---

## Version History

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-14 | Initial — Perplexity Computer policy, model pool roles, project kickoff protocol |
| 1.1 | 2026-05-22 | Perplexity access updated to Brave CDP bridge; desktop app deprecated; Spaces priority updated; Project Kickoff Protocol expanded to 7-step standard workflow; Tool Strategy table added |
