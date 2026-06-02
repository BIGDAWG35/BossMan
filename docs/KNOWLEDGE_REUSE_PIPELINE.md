# KNOWLEDGE_REUSE_PIPELINE.md
**Version:** 1.1
**Date:** 2026-06-02
**Owner:** BossMan (Marcelo's Hermes orchestrator)
**Status:** ACTIVE — governs knowledge reuse and paid model artifact policy

---

## Purpose

This document defines how BossMan captures, stores, reuses, and enforces knowledge reuse across all projects. It is the **single source of truth for knowledge management** and the **paid model artifact reuse policy**.

---

## 1. Knowledge Tier Map

| Tier | Storage | Use For | Cost |
|------|---------|--------|------|
| **Tier 1** | Hermes knowledge, Obsidian, GitHub | Existing artifacts, docs, blueprints, system state | FREE |
| **Tier 2** | Ollama / Llama / Qwen local | Local drafts, summarization, pattern tasks | FREE |
| **Tier 3** | MiniMax 2.7 | Default reasoning — routine work | INCLUDED |
| **Tier 4** | DeepSeek / OpenAI / Claude | Advanced reasoning, structured output | PAID |
| **Tier 5** | Perplexity Computer | Complex multi-step Mac workflows | PAID HIGH |

**Default path:** Always check Tier 1 before any AI call. Escalate only when necessary. Save Tier 4/5 outputs for reuse.

---

## 2. Knowledge Reuse Rules (Permanent)

### Retrieval Before Action

Before spawning a sub-agent or starting any AI-assisted task:

1. Check `memory` for Marcelo's preferences
2. Check `~/.hermes/knowledge/` for relevant docs, specs, or priors
3. Run `session_search` for recent patterns
4. Check GitHub/BossMan/docs/ for existing artifacts

**No "fresh start" assumption — continuity is the default.**
If the same research was already done, flagged with `[RESEARCH]`, or documented — reuse it, don't re-research.

### Artifact Naming Standard

Reusable artifacts saved to `~/.hermes/knowledge/` must be named to reflect their contents:

| Pattern | Example |
|---------|---------|
| `SPEC-[PROJECT]-[FEATURE].md` | `SPEC-BINANCE-PRETRADE-HOOK.md` |
| `ARCH-[PROJECT].md` | `ARCH-CLIENT-HUB.md` |
| `LEARNED-[TOOL].md` | `LEARNED-PM2.md` |
| `REPORT-[PROJECT]-[DATE].md` | `REPORT-BINANCE-AUDIT-2026-05.md` |
| `MEMORY-[TOPIC].md` | `MEMORY-TRADING-INTELLIGENCE.md` |
| `AI-[PROJECT]-[DATE].md` | `AI-MONEY-PIPELINE-ANALYSIS-2026-06.md` |

### Exclusions (Never Save)

- Ephemeral task progress — NOT saved
- Raw data dumps — NOT saved
- Stale info (< 7 days) — NOT saved
- Unverified speculation — mark `[NEEDS VERIFICATION]` instead
- Duplicate content — update existing, don't create new

---

## 3. Paid Model Artifact Reuse Policy (New — 2026-06-02)

**When a Tier 4 or Tier 5 model produces a reusable artifact:**

1. **Save the artifact immediately** — save to `~/.hermes/knowledge/` with standard naming
2. **Tag it** — mark clearly with model used, date, and scope
3. **Update the Routing Ledger** — note the artifact path in `last_model_used`
4. **Never pay again** for the same analysis — check `~/.hermes/knowledge/` before re-running

**Reuse trigger checklist (before any Tier 4/5 call):**
```
[ ] Check ~/.hermes/knowledge/ for [same topic] or [similar artifact]
[ ] If found — reuse it and update last_model_used
[ ] If not found — proceed with Tier 4/5 call
[ ] After call — save output with standard naming
```

**What to save from Tier 4/5 calls:**
- Prompts and prompt templates
- Architecture diagrams / system designs
- Spec documents
- Code modules or functions
- Research summaries tagged `[RESEARCH]`
- Analysis writeups tagged `[ANALYSIS]`
- Structured outputs (JSON, YAML specs)

**Where to save:**
- Canonical: `~/.hermes/knowledge/`
- Mirror to: `~/Desktop/CLAW-Backup/` (Obsidian vault)
- GitHub: `BIGDAWG35/BossMan/docs/` (versioned)

---

## 4. Research Capture Protocol

**Trigger:** Any Perplexity Search, Deep Research, or web-based research task.

**Required capture:**
- Full prompt/question asked
- Key findings (bullet points, not verbatim)
- Source URLs
- Date
- Model used
- File: `~/.hermes/knowledge/AI-[PROJECT]-[TOPIC]-[DATE].md`

**Tag:** All research with `[RESEARCH]` in the filename and top of file.

**Reuse:** Before re-running the same research, check `session_search` for prior sessions on the topic.

---

## 5. Trusted Learning Rules (Permanent)

- **Verified sources only** — don't trust a claim just because it's popular; verify before acting or flag `[NEEDS VERIFICATION]`
- **Evidence-backed findings** — if you can't verify, explicitly flag confidence level
- **Compare when uncertain** — run same query through multiple models/sources and compare
- **Refine based on outcomes** — note what worked and what didn't; update patterns
- **No speculation as fact** — always label hypothesis vs. confirmed finding
- **Known vs. assumed** — store separately; update independently

---

## 6. Memory Capture Policy Summary

### Tags (for searchability)

| Tag | Use For |
|-----|---------|
| `[DECISION]` | Architectural choices, routing decisions, trade-offs |
| `[ARCHITECTURE]` | System design, service topology, data flows |
| `[ROUTING]` | Model selection, agent assignment, tool choice |
| `[WORKFLOW]` | Process improvements, automation patterns |
| `[RESEARCH]` | Market research, intelligence findings |
| `[ANALYSIS]` | Deep analytical work, specs, architectural reviews |
| `[PERFORMANCE]` | Speed improvements, resource optimization |
| `[SECURITY]` | Patches, vulnerabilities, hardening |
| `[PREFERENCE]` | Marcelo's stated likes/dislikes/tastes |

### Memory Storage Tiers

| Tier | Storage | Use For | Limit |
|------|---------|---------|-------|
| **1** | `memory` tool | Marcelo's preferences, corrections, environment facts | ~2200 chars |
| **2** | `~/.hermes/knowledge/` | Durable docs, project context, system insights | Unlimited |
| **3** | `~/Desktop/CLAW-Backup/` | Obsidian reference blueprints | Unlimited |
| **4** | `BIGDAWG35/BossMan/` | GitHub durable blueprints | Unlimited |

---

## 7. Document Locations

| Copy | Path |
|------|------|
| **Hermes knowledge (canonical)** | `~/.hermes/knowledge/KNOWLEDGE_REUSE_PIPELINE.md` |
| **Obsidian** | `/Users/bigdawg/Desktop/CLAW-Backup/KNOWLEDGE_REUSE_PIPELINE.md` |
| **GitHub** | `BIGDAWG35/BossMan/docs/KNOWLEDGE_REUSE_PIPELINE.md` |

**Cross-references:**
- `~/.hermes/knowledge/MODEL_ROUTING_WORKFLOW.md` — routing ledger, model tiers, cost policy
- `~/.hermes/knowledge/HERMES_MASTER_BLUEPRINT.md` — AI/Model Strategy table
- `~/.hermes/knowledge/OPERATING_BLUEPRINT.md` — routing rules, profiles

---

## 8. Change Log

| Version | Date | Change |
|---------|------|--------|
| 1.0 | 2026-05-27 | Initial — knowledge tier map, reuse rules, capture policy |
| 1.1 | 2026-06-02 | Added Section 3: Paid Model Artifact Reuse Policy; updated Artifact Naming Standard |

---

*Updated by BossMan when knowledge reuse rules or tier policy change.*
