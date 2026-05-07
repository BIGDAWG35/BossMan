# Claude Usage Policy — Hermes Perplexity Spaces

> Applies to: Agent OS, Business Ideas, Trading Ops, Toolchain Dev
> Hermes-native version — adapted from OpenClaw policy
> Last updated: 2026-05-07

---

## 1. Hermes Profiles and Ownership

Hermes operates as a multi-profile agent system. Each profile has a defined role:

- **bossman (Manager/Orchestrator)**
  - First point of contact. Scopes tasks, routes to the right profile, summarizes back to Marcelo.
  - **Never writes code.** Never deploys without approval.
  - Owns routing, prioritization, approvals, and memory hygiene.

- **builder (Default Coder)**
  - Default owner for all coding, apps, web, and implementation work across all Spaces.
  - Implements features, fixes, dashboards, scripts, and internal tools.
  - Can optionally use Claude as a helper when Marcelo explicitly asks.

- **ops (Operations & Deploy)**
  - Owns PM2, service health, ports, logs, Tailscale, cron wiring, and runtime checks.
  - Does not design or spec apps; acts on plans from bossman + builder.

- **trading (Trading Analysis)**
  - Owns market research, Binance bot review, portfolio analysis, trading reports.
  - **Does NOT touch live money.** Analysis and recommendations only.

- **content (Content & Docs)**
  - Owns scripts, outlines, docs, posts, summaries, copy, written output.
  - Receives drafts from other profiles, returns polished versions for Marcelo's approval.

---

## 2. When Claude Is Allowed

Claude is **opt-in only**.

Claude may be used **only** when Marcelo explicitly requests it:

- "Use Claude to help draft this spec."
- "Have Claude scaffold the initial version of this app."
- "Use Claude to explore a few design options first."

When that happens:

- **bossman:** Clearly states in the task: "builder is the owner; you may use Claude as a helper."
- **builder:** Remains the primary executor. Can call Claude to:
  - Generate initial scaffolds or boilerplate code
  - Propose multiple designs or API shapes
  - Draft documentation, specs, or long-form content

Claude can be used for:

- **Business Ideas Space**
  - Drafting specs, product write-ups, landing page copy
  - Brainstorming structured options for systems or projects

- **Agent OS Space**
  - Scaffolding new internal tools, dashboards, or helper services (non-critical)
  - Drafting design docs, runbooks, and internal documentation

- **Trading Ops Space**
  - Drafting strategy documents, reports, or analysis
  - Non-live, sandbox/backtest scripts (only with explicit permission)

- **Toolchain Dev Space**
  - Scaffolding project structures, exploring library options
  - Drafting technical documentation and API references

---

## 3. When Claude Is NOT Used

If Marcelo does **not** explicitly ask for Claude:

- **builder handles the coding by default.**
- Claude should **not** be invoked.

Claude must **not** be used for:

- Core Agent OS routing logic (PROFILES.md rules, space-level orchestration)
- Live trading logic (Binance, Kraken, money pipeline execution)
- Security-sensitive changes (auth, secrets, access control)
- Direct deployment or infrastructure changes

For these, the flow is:

1. bossman scopes the task
2. builder implements
3. ops deploys (after Marcelo approval)

No Claude involvement unless Marcelo explicitly says otherwise.

---

## 4. Failure / Fallback Rules

If Marcelo has explicitly asked to use Claude and Claude is unavailable (auth issues, tool disabled, etc.):

- **Ownership does not change:** builder is still the owner of the task.
- **Default behavior:** builder continues the work manually, following existing patterns.
- **Exception only if Marcelo said "stop if Claude can't be used":**
  - builder stops
  - Reports the blocker to bossman
  - bossman reports to Marcelo and waits for a new instruction

bossman never silently "moves" a task to Claude or changes the execution path without Marcelo's explicit instruction.

---

## 5. Hermes-Specific Model Stack

This section clarifies what models Hermes uses and when:

| Model | Role | Used By |
|-------|------|---------|
| Hermes (default) | General orchestration, routing, day-to-day | bossman, all profiles |
| Claude | Helper / scaffold (opt-in) | builder, only when Marcelo asks |
| Codex / Claude Code | Autonomous coding agent | builder (via delegation) |
| Perplexity Spaces AI | Space-aware research and analysis | All spaces (custom instructions) |

**Default:** Hermes handles everything. Claude is called only when requested.

---

## 6. Per-Space Summary Block

Include this short block in each Space's SETUP.md:

```md
## Claude Helper Rules (This Space)

- Manager: bossman orchestrates
- Default coder: builder
- Ops/deploy: ops
- Trading analysis: trading
- Content: content
- Claude: helper-only and opt-in
- Only used when Marcelo explicitly asks to use Claude
- If Claude is unavailable, builder continues unless Marcelo said "stop if Claude can't be used"
- For full details, see: architect_01-claude-usage-policy.md in this Space
```

---

## 7. Key Differences from OpenClaw

| OpenClaw | Hermes |
|----------|--------|
| DWDAWGBOT (coder) | builder |
| OPdawgbot (ops) | ops |
| LBC35 (manager) | bossman |
| CSdawgbot (crypto) | trading |
| YTDAWGBOT (YouTube) | content |
| SMDAWGBOT (social) | content |
| Claude opt-in | Same — opt-in only |

**Why this matters:** Perplexity Spaces AI needs to know Hermes's profile names to route tasks correctly within each Space.
