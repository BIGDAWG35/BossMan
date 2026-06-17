# MEMORY.md — curated long-term memory (max 2,200 chars)

This file stores only durable, cross-session rules and facts.
- Short, bullet-style entries.
- No raw logs (those stay in cron output or knowledge docs).
- No one-off incidents already captured in kanban/cards.

Current entries are managed via the memory tool only.
§
**Marcelo goal anchor (2026-06-13):** `/goal` t_goal_crypto_swing_trader_20260613 — become a competent crypto swing trader, 12-month horizon, Stage 1 of 4 active. Long-term learning goal, not a project. Curriculum-style sub-tasks.
§
**Curriculum task structure (work style — 2026-06-13):** learning-domain work uses parent card + N sub-tasks per stage, each with done criteria + self-test. Sub-tasks start `todo`→`running`→`done`. **Lessons go to canonical LEARNED_<domain>.md, NOT task body.** Task body = status + link; LEARNED file = content. Applies to any curriculum/learning work, not just crypto.
§
**Auto-advance for sequential learning tasks (2026-06-13):** when user says sub-task is done, auto-flip next sibling `todo`→`running` without asking. Harvest lessons to LEARNED file first, then advance. Skill: `~/.hermes/skills/curriculum-auto-advance/`. Don't ask for confirmation between finish and next-task-start.
§
**Lesson vs rule threshold (2026-06-13):** when adding to LEARNED_<domain>.md, ask "would this still be true in 6 months?". If yes → numbered durable rule (L-<DOMAIN>-NN+). If no → stage-section bullet. Default to stage-section when in doubt; weekly review can promote later. Cross-domain heuristic.
§
**Skill: `git-history-secret-scrub` (2026-06-15).** Class-level. Top lessons: snapshot LIVE files BEFORE filter-repo's `reset --hard`; redact literals in audit docs that document findings (L-HYGIENE-09 leak surface). Pre-flight: `…/git-history-secret-scrub/scripts/inventory.sh`.
§
**v3 Perplexity routing (2026-06-16):** Space-first, no cross-Space mixing, v3 docs only. 67 v3 files in `~/Desktop/V3/<space>/`. Mirrors `~/.hermes/spaces/` + `~/Repos/BossMan/docs/perplexity-spaces/` still 100% pre-v3 — wipe + re-sync from `~/Desktop/V3/`. `~/.hermes/knowledge/` wins on conflict. v2/OpenClaw answer = drift.