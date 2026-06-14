# Routing Rules — Mirror (Perplexity Spaces)

**This is a Perplexity Spaces mirror.** The canonical Routing Rules live at:

**`~/.hermes/knowledge/ROUTING-RULES.md`**

Always read and edit the canonical. BossMan syncs this mirror on each
canon update.

Last canonical version: **v3.0 (2026-06-03) — "10/10" update**

## Quick summary of v3.0

- 6-step Default Build Flow (Perplexity Search → M3 → primary builder → Llama → QA pass → Claude docs)
- Step 5 QA pass is **mandatory for critical cards** (money, PII, infra, trading, auth) and recommended for high-impact work. Default model: DeepSeek (red-team).
- Perplexity Computer: rare escalation tool, 10k credits/month, requires `escalate_to_computer: yes` flag with Marcelo approval.
- Light metrics: `build_passes` and `rewrite_scope` fields on every card; monthly review.
- LBC35 does not pick models and does not trigger Perplexity Computer.

For full policy, see the canonical.
