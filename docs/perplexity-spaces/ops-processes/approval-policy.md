# Approval Auto-Resolve Policy (2026-06-04, permanent)

**Marcelo is NOT the approval bottleneck for routine implementation work.**

BossMan auto-approves + moves cards to `done` after verification UNLESS the work crosses one of:

1. **Major system architecture changes** (e.g. new data layer, new service, replacing a core library, restructuring the deployment topology)
2. **Security-sensitive changes or access/credential changes** (new API keys, permission scope changes, new external auth flows, secret rotation, anything that touches secrets)
3. **Major redesigns or major UX direction changes** (e.g. nav overhaul, new visual design system, rebranding, user-flow redesign)

**Auto-resolve covers (no Marcelo pause needed):**
- Bug fixes
- Wiring existing UI to existing APIs
- Persistence fixes
- Runtime hardening (PM2, builds, cache, restart reliability)
- Small module prop/interface changes
- Backward-compatibility shims
- QA / verification / cleanup
- Routine follow-ups (fu1/fu2/fu3) that close scope gaps from an already-approved card

**Operating behavior:**
- `awaiting_approval` is reserved for the 3 categories above or genuine product/design conflicts where two reasonable answers exist and only Marcelo can choose
- If a worker blocks with `review-required` on a routine implementation decision, BossMan makes the call and moves on
- Still report major outcomes back to Marcelo (Telegram or Kanban comment), but do NOT pause execution waiting for approval on routine work
- When in doubt: ask "Does this cross architecture, security, or major UX?" If no → proceed. If yes → escalate

**Override:** Marcelo can always re-engage by saying "hold for my approval" on any specific card or category. Default is auto-resolve.
