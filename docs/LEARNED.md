# LEARNED.md — Cross-cutting durable rules

**Status:** Index of cross-cutting rules that don't fit in a per-domain `LEARNED_*.md` file. Domain-specific learnings live in their own files (e.g. `LEARNED_BAKERY.md`, `LEARNED_TRADING.md`).

**Owner:** BossMan Hermes
**Last updated:** 2026-06-12

---

## L-001 — Obsidian vault structure is permanent (2026-06-12)

**Rule:** The Obsidian vault at `~/Obsidian/Hermes/` must always follow the 11-folder + `_Templates/` structure: `00_INBOX/`, `01_Dashboard/`, `10_Operating-Blueprint/`, `20_Agents/`, `30_Services-Maps/`, `40_Projects/{Active,On-Hold,Archive}/`, `50_Phase-Reports/`, `60_Knowledge-Topics/`, `70_Workflows/`, `80_Logs/`, `90_Archive/`, `_Templates/`. **No project notes are left loose in the vault root** — every project-specific file lives inside its `PROJ-…/` folder.

**Save order is mandatory:**
1. All operational changes and system knowledge are written to `~/.hermes/knowledge/` FIRST.
2. Then mirrored to `~/Obsidian/Hermes/`.
3. Then synced to `~/Repos/BossMan/docs/` and committed (BossMan repo is the primary GitHub backup stream).
4. Perplexity Spaces content syncs via `bash ~/.hermes/scripts/sync_perplexity_spaces.sh` when relevant.

**Source of truth:** Hermes knowledge in `~/.hermes/knowledge/` is the source of truth. If Obsidian and Hermes knowledge ever conflict, Hermes knowledge wins and Obsidian is corrected to match. The BossMan repo wins over Obsidian (it's the GitHub backup).

**Audit cadence:**
- Monthly audit (1st, 09:00 PT): 8 checks, silent when healthy. Script: `~/.hermes/scripts/obsidian-vault-audit.sh`.
- Bi-monthly review (every other 1st, 10:00 PT): 5 tasks, surfaces to Telegram. Script: `~/.hermes/scripts/obsidian-vault-review.sh`.

**Approval needed for:**
- Adding a new top-level folder (kanban card + Marcelo approval)
- Renaming a top-level folder (3-bucket — architecture change)
- Changing the save order (3-bucket)
- Changing the audit cadence (kanban card + Marcelo approval)

**Canonical doc:** `~/.hermes/knowledge/OBSIDIAN_VAULT_WORKFLOW.md`.

**Enforcement:** The monthly audit script flags drift, duplicate filenames, missing frontmatter, files in wrong locations, and stale project timelines.

---

## L-002 — BossMan is the single status surface (2026-05-18)

**Rule:** Only BossMan (via `ai.hermes.gateway`) sends autonomous status messages to Marcelo. No other agent, script, cron, or LaunchAgent may send direct Telegram messages to Marcelo outside the BossMan routing layer.

**Why:** LBC35 / OpenClaw violated this on 2026-06-12 with an unauthorized "morning digest" message. The `ai.openclaw.gateway` LaunchAgent was disabled, 7 crons with Telegram routing were disabled, and the incident was logged on kanban card `t_lbc35_tg_bypass_20260612`.

**Enforcement:** Any new LaunchAgent or cron that touches Telegram requires Marcelo's explicit approval per the 3-bucket rule.

---

## L-003 — All work goes on the board (2026-06-12)

**Rule:** Every real work request from Marcelo creates or updates a kanban card on the `bossman` board. Pure acks and pure factual recall are exempt. The inline gate `~/.hermes/scripts/telegram-intake-gate.sh` is the codified first step of every Telegram intake.

**Why:** Without this, work vanishes into chat. The board is the source of truth for what's actually happening.

**Enforcement:** Inline gate runs on every Telegram intake. The morning-brief cron backfills missed work. The `kanban-snapshot.sh` script exposes the cross-project view.

---

## L-004 — Memory hygiene is codified (2026-06-12)

**Rule:** `MEMORY.md` is a small, curated list of durable cross-session rules and facts only. Hard cap 2,200 chars, soft target <1,500 chars, prune trigger at 1,800 chars. Heavy content lives in kanban + `~/.hermes/knowledge/`.

**Enforcement:** Weekly cron `memory-health-check` (Mondays 9:05 AM) opens a kanban card if MEMORY > 1,800 chars or USER > 1,350 chars.

---

## L-005 — Cron + automation: no spam (2026-06-12)

**Rule:** No new cron job or LaunchAgent without explicit Marcelo approval. The inline Telegram-intake gate handles routing. Cron is only the right answer for narrow, wall-clock, explainable cases. Output is `deliver: local` by default.

**Enforcement:** All cron/LaunchAgent changes go through a BossMan kanban card with Marcelo's `Approved` reply. Inventory is at `~/.hermes/knowledge/AUTOMATION_INVENTORY.md`.

---

(More rules will be added here as they're formalized. Domain-specific learnings stay in their own `LEARNED_*.md` files.)
