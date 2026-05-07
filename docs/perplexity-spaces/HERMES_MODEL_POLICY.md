# Hermes Model Policy

> **System:** Hermes (primary AI), powered by MiniMax 2.7
> This is Hermes's model policy — NOT OpenClaw's. Every Space references this.
> Last updated: 2026-05-07

---

## Overview

Hermes is Marcelo's primary AI agent. Its primary brain is **MiniMax 2.7**, running on the MiniMax API.
The other models — DeepSeek, OpenAI, Claude — are **backup layers** used only when MiniMax 2.7 is
insufficient for a specific task.

**Never confuse Hermes with OpenClaw.** They are separate systems with separate model stacks,
separate docs, and separate Spaces.

---

## BossMan + 4 Sub-Agents

Marcelo runs a multi-agent setup:

| Profile | Role | Model Stack |
|---------|------|-------------|
| **BossMan** | Orchestrator, final call on all decisions | MiniMax 2.7 (primary) |
| **Builder** | Code implementation, automation | MiniMax 2.7 (primary) |
| **Ops** | Services, PM2, runtime, processes | MiniMax 2.7 (primary) |
| **Trading** | Market research, signals, strategy | MiniMax 2.7 (primary) |
| **Content** | Docs, scripts, YouTube, writing | MiniMax 2.7 (primary) |

Each profile runs MiniMax 2.7 as default. Escalation to backup models is per-task (see below).

---

## Model Stack — Full Priority Order

### 1. MiniMax 2.7 — Primary Brain
**Use for:** Everything. All day, every day. Marcelo's default.

- Fast, low-cost, sufficient for most tasks
- Code, writing, analysis, routing, strategy, research
- If MiniMax can do it, use MiniMax

### 2. DeepSeek — Analysis Backup
**Use for:** Deeper analytical reasoning when MiniMax 2.7 isn't enough.

- Complex multi-step analysis
- Research requiring deeper reasoning chains
- Mathematical / financial modeling
- When MiniMax hits a ceiling on complexity

**Escalation trigger:** MiniMax produces a flat, shallow, or obviously incomplete answer on a
complex analytical task.

### 3. OpenAI — Production Text Backup
**Use for:** High-stakes production text when MiniMax or DeepSeek fall short.

- Production-ready code, runbooks, deployment configs
- Complex prompts requiring precise wording
- Critical documentation, compliance text
- Final-draft writing where quality is non-negotiable

**Escalation trigger:** Output needs to be production-quality and MiniMax/DeepSeek drafts aren't
clean enough for direct use.

### 4. Claude — Long-Form Reasoning Backup
**Use for:** Complex, long-form reasoning when MiniMax, DeepSeek, and OpenAI all conflict or stall.

- Architecture decisions with competing trade-offs
- Debugging where multiple models disagree on root cause
- Strategy problems requiring extended reasoning chains
- When you need a "reason through this from scratch" pass

**Escalation trigger:** All other models give conflicting answers, or a problem has gone in circles.
Claude is the tie-breaker and the deep-reasoning model.

---

## Escalation Rules Summary

| Situation | → Use |
|-----------|-------|
| Normal work, routing, writing, code | MiniMax 2.7 |
| MiniMax hits ceiling on analysis depth | DeepSeek |
| Need production-quality text / code | OpenAI |
| All models conflict or stall on hard problem | Claude |

**Never escalate preemptively.** Use MiniMax first. Escalate only when you hit a real limitation.

---

## Perplexity Integration

When working inside a Perplexity Space for Hermes:
- MiniMax 2.7 is the default Perplexity model
- Switch to a backup model only when the escalation triggers above are met
- This policy applies to ALL Hermes Spaces

---

## OpenClaw Separation

> ⚠️ **CRITICAL: Do not confuse Hermes with OpenClaw.**

| | Hermes | OpenClaw |
|--|-------|---------|
| Primary brain | MiniMax 2.7 | Claude / OpenAI |
| Docs location | `perplexity-spaces Hermes/` | `Openclaw Brain/` |
| Perplexity Spaces | Hermes-branded Spaces | OpenClaw-branded Spaces |
| Model policy | HERMES_MODEL_POLICY.md | OpenClaw's own policy |

**When working in Hermes Spaces:** Only read Hermes docs. Never pull OpenClaw prompts or
instructions into Hermes unless explicitly migrated and rewritten.

---

## Policy Reference

Every Hermes Space SETUP.md references this file. See:
- Agent OS
- Trading Ops
- Trading Strategy & Portfolio
- Toolchain & Dev
- Business & Ideas
- Content & YouTube
- Real Estate
- Ops Processes
