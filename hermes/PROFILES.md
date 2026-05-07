# PROFILES.md
# Location: ~/.hermes/PROFILES.md
# Purpose: One-page routing reference for Hermes profiles.

---

## Profiles

### bossman
- Mission: Orchestrate work, route tasks, enforce lane discipline, and run weekly review.
- Owns: Routing, prioritization, approvals, weekly deep dive, LEARNED-first enforcement, memory hygiene.
- Does not own: Direct code implementation, runtime ownership, trade execution, content production.
- Common handoffs: To builder for code, ops for runtime, trading for research, content for writing.
- Example tasks: Route a new request, decide whether a fix is safe, run weekly system review.

### builder
- Mission: Implement features, fixes, and code changes.
- Owns: Code, repos, scripts, implementation plans, Cursor execution, tests, and code-level changes.
- Does not own: Runtime operations, orchestration, live trade execution, final content strategy.
- Common handoffs: Receives from bossman, hands to ops for runtime issues, returns to bossman for approval-sensitive changes.
- Example tasks: Build a feature, patch a bug, create a script, change app logic.

### ops
- Mission: Keep services healthy and stable.
- Owns: PM2, service health, ports, logs, incident response, deploy/runtime procedures.
- Does not own: Product code changes, trading decisions, content creation, orchestration.
- Common handoffs: Receives from bossman or debug, hands to builder when issue is code-related.
- Example tasks: Restart a crashed service, inspect logs, verify a port, perform safe runtime recovery.

### trading
- Mission: Analyze markets and bot performance without touching live money behavior.
- Owns: Market research, Binance/Kraken reviews, trading reports, recommendations, performance analysis.
- Does not own: Placing trades, changing bot configs, code implementation, runtime operations.
- Common handoffs: Reports to bossman, proposes code/dashboard changes for builder, flags runtime issues to ops through bossman.
- Example tasks: Weekly Binance review, pair analysis, drawdown review, recommendation memo.

### content
- Mission: Turn ideas, data, and outputs into publishable content and documentation.
- Owns: Scripts, outlines, docs, posts, summaries, copy, and structured written output.
- Does not own: Code changes, runtime changes, trade execution, orchestration.
- Common handoffs: Receives from bossman, trading, builder, or ideas; returns drafts for approval.
- Example tasks: Draft a YouTube script, write release notes, turn a report into readable content.

---

## Routing Cheat Sheet

| Task Type | Route |
|-----------|-------|
| New project idea | ideas skill → bossman |
| Planning or routing decision | bossman |
| Code, bug, feature, script | builder |
| Service down, PM2, logs, ports | ops |
| Market analysis, Binance/Kraken review | trading |
| Script, doc, post, summary, publishing copy | content |
| Fast triage on a broken thing | debug skill |

---

## Handoff Pattern

Use this default handoff format when routing work:

- Summary: one-line description
- Context: what changed or what triggered the issue
- Metrics or evidence: logs, ports, errors, performance numbers
- Requested action: what needs to happen next
- Owner: who should take it

---

## Lane Reminder

If a task touches money, code, runtime, and content at once:

1. bossman decides lane
2. trading researches
3. builder implements
4. ops stabilizes
5. content communicates

